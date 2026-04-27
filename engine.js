/* ============================================================
   MTG Layer Inspector  —  engine.js
   Core evaluation engine, dependency detection, snapshots.
   [KEY: LAND-MANA]     —  Basic land subtype → mana ability mapping
   [KEY: STATE]         —  Permanent state constructor + snapshot
   [KEY: APPLY-EFFECT]  —  Single effect application logic (rule 305.7 built in)
   [KEY: DEPENDENCY]    —  CR 613.8 global dependency detection + resolution
   [KEY: EVALUATE]      —  Full GLOBAL layer-by-layer evaluation pipeline
   ============================================================ */

/* Return the effective source ID for an effect, accounting for text exchanges.
   After Exchange of Words swaps permanent A and B's text boxes, effects originally from A
   now live on B — so their effective source ID is B's ID (and vice versa). */
function _effectiveSourceId(effect, allStates) {
  if (!allStates || !effect.sourceId) return effect.sourceId;
  // Re-parsed effects already carry the correct sourceId (the permanent that now has the text).
  // textExchangedTo remapping only applies to stale pre-exchange effects.
  if (effect._reparsedEffect) return effect.sourceId;
  const srcState = allStates.get(effect.sourceId);
  if (srcState && srcState.textExchangedTo != null) return srcState.textExchangedTo;
  return effect.sourceId;
}

/* Return the display name for an effect's source, appending the permanent's label if it
   has one (e.g. "Conversion A"). Uses the final computed name from allStates when available
   so that mutated permanents show the top card's name, and Exchange of Words shows the
   permanent that currently carries the ability. Used only in log strings — never in parsing. */
function _effectDisplayName(effect, allStates) {
  const effSourceId = _effectiveSourceId(effect, allStates);
  // Prefer the final computed name (e.g. after mutation or text exchange)
  const computedName = allStates && effSourceId
    ? (allStates.get(effSourceId)?.name || effect.sourceName)
    : effect.sourceName;
  if (typeof Battlefield !== 'undefined' && Battlefield.permanents) {
    const perm = Battlefield.permanents.find(p => p.id === effSourceId);
    if (perm && perm.label) return `${computedName} ${perm.label}`;
  }
  return computedName;
}

/* [KEY: LAND-MANA]  —  Rule 305.7: basic land subtypes grant intrinsic mana abilities */
const BASIC_LAND_MANA = {
  'Plains':   '{T}: Add {W}.',
  'Island':   '{T}: Add {U}.',
  'Swamp':    '{T}: Add {B}.',
  'Mountain': '{T}: Add {R}.',
  'Forest':   '{T}: Add {G}.',
};
/* [END: LAND-MANA] */

/* [KEY: STATE]  —  Construct mutable state; snapshot for deep clone */
function createBaseState(permanent) {
  const allPrinted = [...(permanent.printedAbilities || [])];
  // Filter out abilities from conditional lines (they're added by Layer 6/7 effects when conditions are met)
  const condIndices = permanent._conditionalAbilityIndices;
  // Filter out leveler bracket abilities — abilities in non-base brackets are conditional on level counters.
  // Also filter structural lines (LEVEL headers, P/T lines) since they're not real abilities.
  const levelerData = permanent._levelerData;
  // Filter out spacecraft bracket abilities — abilities gated by charge counter thresholds.
  const spacecraftData = permanent._spacecraftData;
  const abilities = allPrinted.filter((_, i) => {
    if (condIndices && condIndices.has(i)) return false;
    if (levelerData && levelerData.abilityIndexToBracket) {
      const bracketIdx = levelerData.abilityIndexToBracket.get(i);
      if (bracketIdx !== undefined && bracketIdx > 0) {
        // Non-base bracket: all lines excluded from base state (structural + ability lines)
        return false;
      }
    }
    return true;
  });
  const hasChangeling = abilities.some(a => /\bchangeling\b/i.test(a));
  return {
    name:       permanent.name,
    types:      [...permanent.printedTypes],
    supertypes: [...(permanent.printedSupertypes || [])],
    subtypes:   [...(permanent.printedSubtypes || [])],
    power:      permanent.printedPower,
    toughness:  permanent.printedToughness,
    abilities:  abilities,
    colors:     [...(permanent.printedColors || [])],
    manaValue:  permanent.manaValue || 0,
    manaCost:   permanent.manaCost || '',
    isCreature: permanent.printedTypes.includes('Creature'),
    isToken:    permanent.isToken || false,
    oracleText: permanent.oracleText || '',
    hasChangeling: hasChangeling,
    isAllCreatureTypes: false, // computed at Layer 4 based on whether changeling is present at that point
    opponentsControlEffects: [], // track effects that say "your opponents control"
    abilitiesRemovedBy305_7: false,
    allAbilitiesRemoved: false, // Fix 18: set when REMOVE_ABILITIES strips all abilities from this permanent
    oracleTextModified: false,
    copySource: null,
    cdaUserValue: null,
    counters: { ...(permanent.counters || {}) },
    traits: [...(permanent.traits || [])], // special traits like "Has all card names"
    allPrintedAbilities: allPrinted, // full list including conditional for display
    conditionalAbilityIndices: condIndices || null,
    conditionalAbilityConditions: permanent._conditionalAbilityConditions || null,
    sagaChapterThresholds: permanent._sagaChapterThresholds || null,
    classLevelThresholds: permanent._classLevelThresholds || null,
    classLevel: permanent.classLevel || null,
    levelerData: permanent._levelerData || null,
    spacecraftData: permanent._spacecraftData || null,
    owner: permanent.owner || 'player_0',
    // Always start from owner, not from permanent.controller. The engine writes back the
    // computed controller to permanent.controller after Layer 2 (for UI use), so reading it
    // back here would make the base state already "post-control-effect", which means the
    // CONTROL effect would produce no delta and Layer 2 would show as unmodified.
    // Starting from owner is the correct base: Layer 2 effects then apply on top.
    controller: permanent.owner || 'player_0',
    tapped: permanent.tapped || false,
    isCommander: (() => {
      if (typeof Battlefield === 'undefined' || !Battlefield.isCommander) return false;
      if (Battlefield.isCommander(permanent.id)) return true;
      // If this permanent is in a mutate stack, check if any card in the stack is a commander
      const stack = Battlefield.getStack ? Battlefield.getStack(permanent.id) : null;
      if (stack) return stack.some(id => Battlefield.isCommander(id));
      return false;
    })(),
  };
}

function snapshotState(state) {
  return {
    name:       state.name,
    types:      [...state.types],
    supertypes: [...state.supertypes],
    subtypes:   [...state.subtypes],
    power:      state.power,
    toughness:  state.toughness,
    abilities:  [...state.abilities],
    colors:     [...state.colors],
    manaValue:  state.manaValue,
    manaCost:   state.manaCost || '',
    isCreature: state.types.includes('Creature'),
    isToken:    state.isToken || false,
    oracleText: state.oracleText || '',
    hasChangeling: state.hasChangeling || state.abilities.some(a => /\bchangeling\b/i.test(a)),
    // isAllCreatureTypes: set once at Layer 4 based on whether changeling exists at that point
    // After Layer 4, it persists even if changeling is later removed in Layer 6
    isAllCreatureTypes: state.isAllCreatureTypes || false,
    opponentsControlEffects: [...(state.opponentsControlEffects || [])],
    abilitiesRemovedBy305_7: state.abilitiesRemovedBy305_7 || false,
    allAbilitiesRemoved: state.allAbilitiesRemoved || false,
    oracleTextModified: state.oracleTextModified || false,
    copySource: state.copySource || null,
    cdaUserValue: state.cdaUserValue ?? null,
    counters: { ...(state.counters || {}) },
    traits: [...(state.traits || [])],
    allPrintedAbilities: state.allPrintedAbilities ? [...state.allPrintedAbilities] : null,
    conditionalAbilityIndices: state.conditionalAbilityIndices || null,
    conditionalAbilityConditions: state.conditionalAbilityConditions || null,
    sagaChapterThresholds: state.sagaChapterThresholds || null,
    classLevelThresholds: state.classLevelThresholds || null,
    classLevel: state.classLevel || null,
    levelerData: state.levelerData || null,
    spacecraftData: state.spacecraftData || null,
    owner: state.owner || 'player_0',
    controller: state.controller || state.owner || 'player_0',
    tapped: state.tapped || false,
    isCommander: state.isCommander || false,
  };
}

/* Returns the controller of the effect's source permanent (for "you control" resolution).
   Looks up the source in allStates first (which reflects Layer 2 control changes),
   falls back to ownerId (the original owner of the effect's source). */
function getEffectControllerId(effect, allStates) {
  if (allStates && effect.sourceId) {
    const srcState = allStates.get(effect.sourceId);
    if (srcState) return srcState.controller;
  }
  return effect.ownerId || 'player_0';
}
/* [END: STATE] */

/* [KEY: APPLY-EFFECT]  —  Apply a single effect to a mutable state. Returns description of what changed. */
function applyEffect(state, effect, context) {
  const changes = [];
  switch (effect.type) {
    case EFFECT_TYPE.ADD_TYPE:
      if (effect.params.gainsAllCreatureTypes) {
        if (!state.isAllCreatureTypes) {
          state.isAllCreatureTypes = true;
          changes.push('Gained all creature types');
        }
        break;
      }
      for (const sup of (effect.params.supertypes || [])) {
        if (!state.supertypes.includes(sup)) {
          state.supertypes.push(sup);
          changes.push(`Added supertype "${sup}"`);
        }
      }
      for (const t of (effect.params.types || [])) {
        if (!state.types.includes(t)) {
          state.types.push(t);
          changes.push(`Added type "${t}"`);
        }
      }
      for (const st of (effect.params.subtypes || [])) {
        if (!state.subtypes.includes(st)) {
          state.subtypes.push(st);
          changes.push(`Added subtype "${st}"`);
          // CR 305.6: basic land subtypes grant intrinsic mana abilities
          if (BASIC_LAND_MANA[st] && !state.abilities.includes(BASIC_LAND_MANA[st])) {
            state.abilities.push(BASIC_LAND_MANA[st]);
            changes.push(`Gained intrinsic mana ability: ${BASIC_LAND_MANA[st]}`);
          }
        }
      }
      break;

    case EFFECT_TYPE.REMOVE_TYPE:
      // Devotion condition: skip removal if devotion meets threshold
      if (effect.params.devotionCondition && effect._allStates) {
        const sourceState = effect._allStates.get(effect.sourceId);
        const sourceController = sourceState ? sourceState.controller : null;
        const dev = _computeDevotionCounts(effect._allStates, sourceController);
        const { colors, threshold } = effect.params.devotionCondition;
        const total = colors.reduce((sum, c) => sum + (dev[c] || 0), 0);
        if (total >= threshold) {
          changes.push(`Devotion ${total} >= ${threshold}: remains a creature.`);
          break;
        }
        changes.push(`Devotion ${total} < ${threshold}: not a creature.`);
      }
      for (const t of (effect.params.types || [])) {
        const i = state.types.indexOf(t);
        if (i >= 0) {
          state.types.splice(i, 1);
          changes.push(`Removed type "${t}"`);
          // CR 205.1a: When a card loses a type, it also loses all subtypes
          // associated with that type. Look up the subtype set from TypeCatalog.
          if (typeof TypeCatalog !== 'undefined' && TypeCatalog.getSubtypesForCardType) {
            const associatedSubs = TypeCatalog.getSubtypesForCardType(t);
            if (associatedSubs.size) {
              state.subtypes = state.subtypes.filter(s => {
                if (associatedSubs.has(s)) {
                  changes.push(`Removed subtype "${s}" (associated with lost type "${t}")`);
                  return false;
                }
                return true;
              });
            }
          }
          if (t === 'Creature' && state.isAllCreatureTypes &&
              !state.types.includes('Kindred') && !state.types.includes('Tribal')) {
            state.isAllCreatureTypes = false;
            changes.push('Lost all creature types (no longer a Creature or Kindred)');
          }
        }
      }
      // Also remove subtypes if explicitly specified
      for (const s of (effect.params.subtypes || [])) {
        const i = state.subtypes.indexOf(s);
        if (i >= 0) { state.subtypes.splice(i, 1); changes.push(`Removed subtype "${s}"`); }
      }
      break;

    case EFFECT_TYPE.SET_TYPE: {
      const oldTypes = [...state.types];
      const oldSub = [...state.subtypes];
      let landSubtypesWereReplaced = false;

      if (effect.params.replaceSubtypeCategory) {
        const cat = effect.params.replaceSubtypeCategory;
        const catSet = TypeCatalog.getSubtypeCategory(cat);
        const kept = state.subtypes.filter(s => !catSet.has(s));
        const newSubs = effect.params.subtypes || [];
        state.subtypes = [...new Set([...kept, ...newSubs])];
        if (!effect.params.keepTypes) {
          state.types = [...new Set(effect.params.types || [])];
        }
        changes.push(`Replaced ${cat} subtypes: [${oldSub.join(', ')}] → [${state.subtypes.join(', ')}]`);
        if (cat === 'land') landSubtypesWereReplaced = true;
      } else {
        // Only overwrite types if explicitly provided; undefined means keep existing types
        if (effect.params.types !== undefined) {
          state.types = [...new Set(effect.params.types)];
          changes.push(`Set types to [${state.types.join(', ')}] (was [${oldTypes.join(', ')}])`);
        }
        state.subtypes = [...new Set(effect.params.subtypes || [])];
        if (!effect.params.types) {
          changes.push(`Set subtypes to [${state.subtypes.join(', ')}] (was [${oldSub.join(', ')}])`);
        } else {
          if (state.subtypes.length) changes.push(`Set subtypes to [${state.subtypes.join(', ')}]`);
        }
        if (state.types.includes('Land') && state.subtypes.some(s => BASIC_LAND_MANA[s])) {
          landSubtypesWereReplaced = true;
        }
      }

      if (effect.params.keepSupertypes) {
        /* keep existing supertypes */
      } else if (effect.params.supertypes !== undefined) {
        state.supertypes = [...new Set(effect.params.supertypes)];
      }

      // CR 205.1b: creature subtypes only apply to creatures (and Kindred/Tribal);
      // if Creature type was removed by this SET_TYPE, clear the "all creature types" trait.
      if (!state.types.includes('Creature') && !state.types.includes('Kindred') &&
          !state.types.includes('Tribal') && state.isAllCreatureTypes) {
        state.isAllCreatureTypes = false;
        changes.push('Lost all creature types (no longer a Creature or Kindred)');
      }

      /* Rule 305.7: setting land subtypes removes all rules-text abilities
         and grants the intrinsic mana ability for each new basic land subtype. */
      if (landSubtypesWereReplaced && state.types.includes('Land')) {
        if (state.abilities.length > 0) {
          changes.push(`Rule 305.7: Removed abilities: [${state.abilities.join('; ')}]`);
        }
        state.abilities = [];
        state.hasChangeling = false;
        state.abilitiesRemovedBy305_7 = true;
        const manaAbilities = state.subtypes
          .filter(s => BASIC_LAND_MANA[s])
          .map(s => BASIC_LAND_MANA[s]);
        if (manaAbilities.length > 0) {
          state.abilities = [...manaAbilities];
          changes.push(`Rule 305.7: Granted mana abilities: [${manaAbilities.join('; ')}]`);
        }
      }
      break;
    }

    case EFFECT_TYPE.ADD_ABILITY: {
      const ab = effect.params.ability;
      if (ab) {
        // Most abilities stack meaningfully when granted multiple times (activated abilities,
        // triggered abilities, ward, etc.). Only static keyword abilities that have no
        // incremental effect are prevented from appearing multiple times.
        const abLower = ab.toLowerCase().trimStart();
        const preventDuplicate = /^(?:flying|lifelink|double strike|first strike|trample|vigilance|deathtouch|hexproof|shroud|indestructible|defender|menace|reach|haste|flash|changeling|fear|intimidate|skulk|shadow|horsemanship|plainswalk|islandwalk|swampwalk|mountainwalk|forestwalk|flanking|phasing|undying|persist|infect|wither|battle cry|exalted|affinity|convoke|cascade|rebuke|partner)(?:\s*$|\s*\()/i.test(abLower);
        if (!preventDuplicate || !state.abilities.includes(ab)) {
          state.abilities.push(ab);
          changes.push(`Added ability "${ab}"`);
          if (/\bchangeling\b/i.test(ab)) state.hasChangeling = true;
        }
      }
      // If the ability is a trait (e.g. "Has all card names"), also add to traits array
      if (effect.params.isTrait && ab && !state.traits.includes(ab)) {
        state.traits.push(ab);
      }
      break;
    }

    case EFFECT_TYPE.REMOVE_ABILITIES:
      // Type-only removal: "loses all creature types" without touching abilities.
      if (effect.params.losesAllCreatureTypesOnly) {
        state.isAllCreatureTypes = false;
        const _ctSet = typeof TypeCatalog !== 'undefined' ? TypeCatalog.getSubtypeCategory('creature') : new Set();
        if (_ctSet.size > 0) {
          state.subtypes = state.subtypes.filter(s => !_ctSet.has(s));
        } else {
          state.subtypes = [];
        }
        changes.push('Lost all creature types');
        break;
      }
      // Specific ability removal: "loses flying", "loses deathtouch", etc.
      // Only removes standalone keyword abilities, NOT keywords embedded in sentences.
      // A standalone keyword: "Flying", "Ward {2}", "Lifelink", "Protection from red"
      // A sentence: "Equipped creature has lifelink." — should NOT be removed.
      if (effect.params.specificAbilities && effect.params.specificAbilities.length > 0) {
        const toRemove = effect.params.specificAbilities.map(a => a.toLowerCase());
        function isStandaloneKeyword(abilityText, keyword) {
          const a = abilityText.toLowerCase().trim();
          const k = keyword.toLowerCase().trim();
          // Exact match
          if (a === k) return true;
          // Keyword followed by parameter: "Ward {2}", "Toxic 1"
          if (a.startsWith(k + ' ') && /^[\s{(\d]/.test(a.slice(k.length))) {
            // Check it's not a full sentence (no verbs/articles after keyword param)
            const afterKw = a.slice(k.length).trim();
            // If it's just a cost/number/reminder text, it's standalone
            if (/^(?:\{[^}]+\}|\d+|—|\()/.test(afterKw)) return true;
            // If it has no period/verb pattern, likely standalone
            if (afterKw.length < 30 && !/\b(?:has|gets|is|are|gains|loses|can|may|does|when|whenever|at|if|you)\b/.test(afterKw)) return true;
          }
          // Keyword with reminder text: "Flying (This creature can't...)"
          if (a.startsWith(k) && /^\s*\(/.test(a.slice(k.length))) return true;
          // Protection variants: exact match of "protection from [color/type]"
          if (k.startsWith('protection from') && a.startsWith(k)) return true;
          return false;
        }
        const removed = state.abilities.filter(a => toRemove.some(r => isStandaloneKeyword(a, r)));
        state.abilities = state.abilities.filter(a => !toRemove.some(r => isStandaloneKeyword(a, r)));
        if (removed.length > 0) {
          changes.push(`Removed specific abilities: [${removed.join(', ')}]`);
        }
        break;
      }
      // exceptManaAbilities: keep abilities that add mana (contain "add " but don't target)
      if (effect.params.exceptManaAbilities) {
        const kept = state.abilities.filter(a => /\badd\s/i.test(a) && !/\btarget\b/i.test(a));
        const removed = state.abilities.filter(a => !kept.includes(a));
        if (removed.length > 0) {
          changes.push(`Removed non-mana abilities: [${removed.join(', ')}]`);
        }
        if (kept.length > 0) {
          changes.push(`Kept mana abilities: [${kept.join(', ')}]`);
        }
        state.abilities = kept;
        state.hasChangeling = false;
        state.allAbilitiesRemoved = true;
        break;
      }
      if (state.abilities.length > 0) {
        changes.push(`Removed abilities: [${state.abilities.join(', ')}]`);
      }
      state.abilities = [];
      state.hasChangeling = false;
      // Fix 18: Mark that all abilities were removed from this permanent.
      // Effects sourced from this permanent that come from its rules text are now dead.
      state.allAbilitiesRemoved = true;
      // NOTE: isAllCreatureTypes is NOT reset here. Per MTG rules, changeling
      // sets all creature types in Layer 4. If changeling is removed in Layer 6,
      // the creature still has all creature types from Layer 4.
      // HOWEVER: if the effect explicitly says "loses all creature types",
      // then isAllCreatureTypes IS reset.
      if (effect.params.losesAllCreatureTypes) {
        state.isAllCreatureTypes = false;
        const catSet = typeof TypeCatalog !== 'undefined' ? TypeCatalog.getSubtypeCategory('creature') : new Set();
        if (catSet.size > 0) {
          state.subtypes = state.subtypes.filter(s => !catSet.has(s));
        } else {
          state.subtypes = [];
        }
        changes.push('Lost all creature types');
      }
      if (effect.params.replaceWith) {
        state.abilities = [...effect.params.replaceWith];
        state.hasChangeling = state.abilities.some(a => /\bchangeling\b/i.test(a));
        changes.push(`Granted: [${effect.params.replaceWith.join(', ')}]`);
      }
      break;

    case EFFECT_TYPE.SET_PT:
      if (state.types.includes('Creature')) {
        const oldP = state.power, oldT = state.toughness;
        if (effect.params.useMV) {
          state.power = state.manaValue;
          state.toughness = state.manaValue;
        } else if (effect.params.useCountOf !== undefined) {
          let val = 0;
          if (effect._allStates) {
            const raw = _computeForEachCount(effect.params.useCountOf, effect._allStates, state, effect);
            val = (raw !== null && raw !== undefined) ? raw : (state.cdaUserValue ?? 0);
          } else {
            val = state.cdaUserValue ?? 0;
          }
          state.power = val;
          state.toughness = val;
        } else {
          state.power = effect.params.power;
          state.toughness = effect.params.toughness;
        }
        changes.push(`Set P/T to ${state.power}/${state.toughness} (was ${oldP}/${oldT})`);
      }
      break;

    case EFFECT_TYPE.MODIFY_PT:
      if (state.types.includes('Creature')) {
        let modPow = effect.params.power;
        let modTou = effect.params.toughness;
        // "for each" variable boost: multiply base by count
        if (effect.params.forEachDesc !== undefined) {
          let val = null;
          if (effect._allStates) {
            val = _computeForEachCount(effect.params.forEachDesc, effect._allStates, state, effect);
          }
          if (val === null || val === undefined) {
            val = state.cdaUserValue ?? 0;
          }
          if (effect.params.userAdjustable && state.cdaUserValue !== null && state.cdaUserValue !== undefined) {
            val = state.cdaUserValue;
          }
          if (effect.params.maxCount !== undefined && val > effect.params.maxCount) {
            val = effect.params.maxCount;
          }
          modPow = (effect.params.basePower || effect.params.power) * val;
          modTou = (effect.params.baseToughness || effect.params.toughness) * val;
        }
        state.power += modPow;
        state.toughness += modTou;
        const sign = (n) => n >= 0 ? `+${n}` : `${n}`;
        changes.push(`Modified P/T by ${sign(modPow)}/${sign(modTou)} \u2192 now ${state.power}/${state.toughness}`);
      }
      break;

    case EFFECT_TYPE.ADD_COUNTERS: {
      const counterType = effect.params.counterType || '+1/+1';
      const count = effect.params.count || 0;
      // Support arbitrary P/T counter types: +N/+M, -N/-M, etc.
      const ptMatch = counterType.match(/^([+-]\d+)\/([+-]\d+)$/);
      if (ptMatch) {
        if (state.types.includes('Creature')) {
          const powMod = (effect.params.powerMod !== undefined ? effect.params.powerMod : parseInt(ptMatch[1])) * count;
          const touMod = (effect.params.toughnessMod !== undefined ? effect.params.toughnessMod : parseInt(ptMatch[2])) * count;
          state.power += powMod;
          state.toughness += touMod;
          changes.push(`${counterType} counters (x${count}): P/T now ${state.power}/${state.toughness}`);
        } else {
          changes.push(`${counterType} counters (x${count}) present but no P/T effect (not a creature)`);
        }
      }
      break;
    }

    case EFFECT_TYPE.SET_COLOR: {
      const oldColors = state.colors.join(', ') || 'none';
      state.colors = [...(effect.params.colors || [])];
      const newColors = state.colors.length ? state.colors.join(', ') : 'colorless';
      changes.push(`Set color to ${newColors} (was ${oldColors})`);
      break;
    }

    case EFFECT_TYPE.ADD_COLOR: {
      for (const c of (effect.params.colors || [])) {
        if (!state.colors.includes(c)) {
          state.colors.push(c);
          changes.push(`Added color "${c}"`);
        }
      }
      break;
    }

    case EFFECT_TYPE.COPY: {
      // Layer 1: Replace this permanent's state with copy source characteristics.
      // The copy source card data is stored in effect.params.copySource.
      const src = effect.params.copySource;
      if (!src) { break; } // No copy source selected — effect is inactive
      const srcTypes = parseTypeLine ? parseTypeLine(src.type_line || '') : { supertypes: [], types: [], subtypes: [] };
      const oldName = state.name;
      state.types      = srcTypes.types;
      state.supertypes = srcTypes.supertypes;
      state.subtypes   = srcTypes.subtypes;
      if (!effect.params.keepName) state.name = src.name;
      state.power      = src.power !== undefined ? (parseInt(src.power) || 0) : null;
      state.toughness  = src.toughness !== undefined ? (parseInt(src.toughness) || 0) : null;
      state.colors     = src.colors || [];
      state.manaValue  = src.cmc || 0;
      state.manaCost   = src.mana_cost || '';
      // Replace the copy source's card name with "this card" in the oracle text
      // so self-references resolve correctly for the copy.
      let copyOracleText = src.oracle_text || '';
      if (src.name && copyOracleText) {
        const srcName = (src.name || '').replace(/\u2019/g, "'");
        const escaped = srcName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Also try the part before a comma (e.g. "Deadpool, Trading Card" -> "Deadpool")
        const commaIdx = srcName.indexOf(',');
        const candidates = [escaped];
        if (commaIdx > 0) {
          const shortName = srcName.slice(0, commaIdx).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          candidates.push(shortName);
        }
        copyOracleText = copyOracleText.replace(/\u2019/g, "'");
        for (const cand of candidates) {
          const nameRe = new RegExp('\\b' + cand + '\\b', 'g');
          if (nameRe.test(copyOracleText)) {
            copyOracleText = copyOracleText.replace(nameRe, 'this card');
            break;
          }
        }
      }
      state.abilities  = copyOracleText.split('\n').map(l => l.trim()).filter(Boolean);
      state.oracleText = copyOracleText;
      state.hasChangeling = state.abilities.some(a => /\bchangeling\b/i.test(a));
      state.copySource = src;
      state.oracleTextModified = true; // signals re-parse needed
      // Add extra types if the copy says so (e.g. Phyrexian Metamorph adds Artifact)
      if (effect.params.addTypes) {
        for (const t of effect.params.addTypes) {
          if (!state.types.includes(t)) state.types.push(t);
        }
      }
      // Add extra subtypes (e.g. Sakashima's Student adds Ninja)
      if (effect.params.addSubtypes) {
        for (const st of effect.params.addSubtypes) {
          if (!state.subtypes.includes(st)) {
            state.subtypes.push(st);
            changes.push(`Added subtype "${st}" (copy exception)`);
          }
        }
      }
      // "except" clause modifications from generic copy parsing
      if (effect.params.setTypes) {
        state.types = [...effect.params.setTypes];
      }
      if (effect.params.setColors) {
        state.colors = [...effect.params.setColors];
      }
      if (effect.params.setPT) {
        state.power = effect.params.setPT.power;
        state.toughness = effect.params.setPT.toughness;
      }
      if (effect.params.addAbilities) {
        for (const ab of effect.params.addAbilities) {
          state.abilities.push(ab);
        }
        state.oracleText = state.abilities.join('\n');
      }
      // "is not legendary" / "is not [type]" — remove supertypes/types from copy
      if (effect.params.notLegendary) {
        const idx = state.supertypes.indexOf('Legendary');
        if (idx >= 0) { state.supertypes.splice(idx, 1); changes.push('Removed Legendary (copy exception)'); }
      }
      // "is still legendary" — ensure Legendary supertype is preserved on the copy
      if (effect.params.keepLegendary) {
        if (!state.supertypes.includes('Legendary')) {
          state.supertypes.push('Legendary');
          changes.push('Kept Legendary (copy exception: "still legendary")');
        }
      }
      // Add extra supertypes from "except it's still [type]"
      if (effect.params.addSupertypes) {
        for (const st of effect.params.addSupertypes) {
          if (!state.supertypes.includes(st)) {
            state.supertypes.push(st);
            changes.push(`Added supertype "${st}" (copy exception)`);
          }
        }
      }
      if (effect.params.removeTypes) {
        for (const rt of effect.params.removeTypes) {
          let ri = state.supertypes.indexOf(rt);
          if (ri >= 0) { state.supertypes.splice(ri, 1); changes.push(`Removed supertype "${rt}" (copy exception)`); }
          ri = state.types.indexOf(rt);
          if (ri >= 0) { state.types.splice(ri, 1); changes.push(`Removed type "${rt}" (copy exception)`); }
        }
      }
      changes.push(`Copied "${src.name}" (was "${oldName}")`);
      break;
    }

    case EFFECT_TYPE.TEXT_CHANGE: {
      // Layer 3: Text-changing effects. Multiple sub-types handled here.
      const changeType = effect.params.changeType || 'color_or_land';

      // --- Volrath's Shapeshifter: replace entire state from graveyard card ---
      if (changeType === 'volrath_text') {
        // Look up the top card of the controlling player's actual graveyard.
        // Fall back to the legacy effect.params.graveyardCard for compatibility.
        const controllerPlayerId = state.controller || 'player_0';
        const gCard = (typeof Battlefield !== 'undefined' && Battlefield.getGraveyardTop)
          ? Battlefield.getGraveyardTop(controllerPlayerId)
          : (effect.params.graveyardCard || null);
        if (!gCard) { break; } // No top graveyard card — effect is inactive
        const gTypes = parseTypeLine ? parseTypeLine(gCard.type_line || '') : { supertypes: [], types: [], subtypes: [] };
        if (!gTypes.types.includes('Creature')) {
          changes.push('Top card of graveyard is not a creature; Volrath keeps its printed characteristics.');
          break;
        }
        const oldName = state.name;
        // Replace name, mana cost, types, subtypes, supertypes, abilities, P/T, colors
        // (CR 706.2: a copy has all characteristics of the original, including mana cost)
        state.name = gCard.name;
        state.manaCost = gCard.mana_cost || '';
        state.manaValue = gCard.cmc ?? state.manaValue;
        state.supertypes = gTypes.supertypes;
        state.types = gTypes.types;
        state.subtypes = gTypes.subtypes;
        state.power = gCard.power !== undefined ? (parseInt(gCard.power) || 0) : state.power;
        state.toughness = gCard.toughness !== undefined ? (parseInt(gCard.toughness) || 0) : state.toughness;
        state.colors = gCard.colors || [];
        // Replace the full text box with the graveyard card's abilities.
        // Volrath's own "As long as…" ability does NOT carry over — it is the replaced
        // ability itself, so it is absent from the resulting text box.
        // Only "{2}: Discard a card." is retained (it is separately added by Volrath's rules text).
        // Replace self-referential proper nouns in the graveyard card's text so references
        // like "CardName gains trample" become "this card gains trample".
        const gReplacedText = typeof _replaceProperNounSelfRef === 'function'
          ? _replaceProperNounSelfRef(gCard.name, gCard.oracle_text || '')
          : (gCard.oracle_text || '');
        const gAbilities = gReplacedText.split('\n').map(l => l.trim()).filter(Boolean);
        const volrathOwnAbility = '{2}: Discard a card.';
        state.abilities = [...gAbilities];
        if (!state.abilities.includes(volrathOwnAbility)) {
          state.abilities.push(volrathOwnAbility);
        }
        state.oracleText = state.abilities.join('\n');
        // Sync allPrintedAbilities so the inspector never shows the stale Volrath ability
        // in any layer after this replacement.
        state.allPrintedAbilities = [...state.abilities];
        state.hasChangeling = state.abilities.some(a => /\bchangeling\b/i.test(a));
        state.oracleTextModified = true;
        changes.push(`Volrath becomes "${gCard.name}" (was "${oldName}"): gained name, mana cost, types, abilities, P/T, color.`);
        break;
      }

      // --- Exchange of Words / Deadpool: swap oracle text between two permanents ---
      // Only apply the swap once (not per-perm); subsequent matching perms get a log entry.
      // Use context.exchangeApplied Set (if provided) to track which effects have fired.
      // This avoids mutating the effect object, which leaked across dependency detection.
      if (changeType === 'exchange_text') {
        const exchangeKey = effect.id || effect.sourceId;
        if (context && context.exchangeApplied && context.exchangeApplied.has(exchangeKey)) {
          // Already swapped; just report that this perm was affected
          changes.push('Text box exchanged (swap applied).');
          break;
        }
        if (context && context.exchangeApplied) {
          context.exchangeApplied.add(exchangeKey);
        }
        const allSt = effect._allStates;
        if (!allSt) { changes.push('(Exchange requires global state.)'); break; }

        let idA, idB;
        if (effect.params.exchangeTargetA && effect.params.exchangeTargetB) {
          idA = effect.params.exchangeTargetA;
          idB = effect.params.exchangeTargetB;
        } else if (effect.params.exchangeTargetId) {
          idA = effect.sourceId;
          idB = effect.params.exchangeTargetId;
        } else {
          break; // No exchange targets selected — effect is inactive
        }

        const stA = allSt.get(idA);
        const stB = allSt.get(idB);
        if (!stA || !stB) { changes.push('(One or both exchange targets not found.)'); break; }

        // Use frozen snapshots if available (taken at trigger/ETB resolution time).
        // The snapshot captures the text boxes as they appeared at the end of Layer 3
        // BEFORE the exchange effect applied. Changes after resolution don't affect
        // what gets written — the exchange always writes those same frozen texts.
        let textForA, textForB, abilitiesForA, abilitiesForB;
        if (effect.params.snapshotTextA !== undefined && effect.params.snapshotTextB !== undefined) {
          // Snapshot mode: snapshotA = original text of target A, snapshotB = original text of target B
          // Exchange gives A the text of B and B the text of A
          textForA = effect.params.snapshotTextB;
          textForB = effect.params.snapshotTextA;
          abilitiesForA = effect.params.snapshotAbilitiesB || textForA.split('\n').map(l => l.trim()).filter(Boolean);
          abilitiesForB = effect.params.snapshotAbilitiesA || textForB.split('\n').map(l => l.trim()).filter(Boolean);
        } else {
          // No snapshots (legacy/fallback): read live text and swap
          textForA = stB.oracleText;
          textForB = stA.oracleText;
          abilitiesForA = [...stB.abilities];
          abilitiesForB = [...stA.abilities];
        }

        stA.oracleText = textForA;
        stA.abilities = [...abilitiesForA];
        stA.hasChangeling = abilitiesForA.some(a => /\bchangeling\b/i.test(a));
        stA.oracleTextModified = true;
        // Record where A's original text (and abilities) went, so effects with sourceId=idA
        // display idB as their effective source in the layer inspector.
        stA.textExchangedTo = idB;

        stB.oracleText = textForB;
        stB.abilities = [...abilitiesForB];
        stB.hasChangeling = abilitiesForB.some(a => /\bchangeling\b/i.test(a));
        stB.oracleTextModified = true;
        stB.textExchangedTo = idA;

        // If either exchange target is in a mutate stack, all other stack members must also
        // be stamped with textExchangedTo — they contribute abilities to the same permanent
        // and Exchange of Words exchanges the whole permanent's text box, not just one card.
        if (typeof Battlefield !== 'undefined' && Battlefield.getStack) {
          const stackA = Battlefield.getStack(idA);
          if (stackA) {
            for (const memberId of stackA) {
              if (memberId === idA) continue;
              const memberState = allSt.get(memberId);
              if (memberState) memberState.textExchangedTo = idB;
            }
          }
          const stackB = Battlefield.getStack(idB);
          if (stackB) {
            for (const memberId of stackB) {
              if (memberId === idB) continue;
              const memberState = allSt.get(memberId);
              if (memberState) memberState.textExchangedTo = idA;
            }
          }
        }

        changes.push('Exchanged text boxes between permanents (using snapshot).');
        break;
      }

      // --- Swirl the Mists (color_global): handled as normal replacements, applied globally ---
      // --- Standard replacements (color_or_land, color_only, land_only, creature_type) ---
      let reps = effect.params.replacements || [];
      if (reps.length === 0) { changes.push('(No text replacements specified.)'); break; }
      // Auto-expand replacements to include plural forms.
      // For creature_type: {from:"Wyvern", to:"Elf"} also adds {from:"Wyverns", to:"Elves"}.
      // For land types: {from:"Plains", to:"Swamp"} also adds {from:"Plains", to:"Swamps"} for plural contexts.
      if (changeType === 'creature_type' && typeof buildCreatureTypeReplacementPairs === 'function') {
        const expanded = [];
        const seen = new Set();
        for (const { from, to } of reps) {
          const pairs = buildCreatureTypeReplacementPairs(from, to);
          for (const p of pairs) {
            const key = p.from.toLowerCase();
            if (!seen.has(key)) { seen.add(key); expanded.push(p); }
          }
        }
        reps = expanded;
        // Sort longest-first so "Wyverns" is replaced before "Wyvern" could match inside it
        reps.sort((a, b) => b.from.length - a.from.length);
      }
      if ((changeType === 'color_or_land' || changeType === 'land_only') &&
          typeof buildLandTypeReplacementPairs === 'function') {
        const expanded = [];
        const seen = new Set();
        for (const { from, to } of reps) {
          const pairs = buildLandTypeReplacementPairs(from, to);
          for (const p of pairs) {
            const key = p.from.toLowerCase();
            if (!seen.has(key)) { seen.add(key); expanded.push(p); }
          }
        }
        reps = expanded;
        reps.sort((a, b) => b.from.length - a.from.length);
      }
      let text = state.oracleText;
      for (const { from, to, pluralTo } of reps) {
        if (!from || !to) continue;
        const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // For land types where singular=plural (e.g. "Plains"), use context to detect plural
        // "Plains are" = plural → use pluralTo; "Plains is" / other = singular → use to
        if (pluralTo && pluralTo !== to) {
          const ctxRegex = new RegExp(escaped + '(?=\\s+are\\b)', 'gi');
          text = text.replace(ctxRegex, (match) => {
            if (match[0] === match[0].toUpperCase()) return pluralTo.charAt(0).toUpperCase() + pluralTo.slice(1);
            return pluralTo.toLowerCase();
          });
        }
        const regex = new RegExp(escaped, 'gi');
        text = text.replace(regex, (match) => {
          if (match[0] === match[0].toUpperCase()) return to.charAt(0).toUpperCase() + to.slice(1);
          return to.toLowerCase();
        });
        changes.push(`Text: "${from}" \u2192 "${to}"`);
        // For creature type changes, also replace matching subtypes in the type line
        if (changeType === 'creature_type') {
          const fromCap = from.charAt(0).toUpperCase() + from.slice(1);
          const toCap = to.charAt(0).toUpperCase() + to.slice(1);
          const idx = state.subtypes.indexOf(fromCap);
          if (idx >= 0) {
            state.subtypes[idx] = toCap;
            changes.push(`Subtype: "${fromCap}" \u2192 "${toCap}"`);
          }
        }
      }
      // Fix article agreement after word replacements (a/an)
      text = text.replace(/\ba\s+([aeiouAEIOU])/g, (m, vowel) => 'an ' + vowel);
      text = text.replace(/\ban\s+([^aeiouAEIOU\s])/g, (m, consonant) => 'a ' + consonant);
      state.oracleText = text;
      state.abilities = text.split('\n').map(l => l.trim()).filter(Boolean);
      state.oracleTextModified = true;
      break;
    }

    case EFFECT_TYPE.CDA_PT: {
      // Layer 7a: characteristic-defining ability sets P/T.
      if (!state.types.includes('Creature')) break;
      let val = null;
      if (effect.params.compute && effect._allStates) {
        val = effect.params.compute(effect._allStates);
      }
      // Auto-compute "for each" counts from battlefield state
      if (val === null && effect.params.forEachDesc && effect._allStates) {
        val = _computeForEachCount(effect.params.forEachDesc, effect._allStates, state, effect);
      }
      if (val === null || val === undefined) {
        val = state.cdaUserValue ?? 0;
      }
      // Apply user adjustment if any (override auto-compute)
      if (effect.params.userAdjustable && state.cdaUserValue !== null && state.cdaUserValue !== undefined) {
        val = state.cdaUserValue;
      }
      // Apply max cap if specified
      if (effect.params.maxCount !== undefined && val > effect.params.maxCount) {
        val = effect.params.maxCount;
      }
      const oldP = state.power, oldT = state.toughness;
      // "for each" pattern: multiply base boost by count and ADD to current P/T
      if (effect.params.basePower !== undefined) {
        state.power += effect.params.basePower * val;
        state.toughness += effect.params.baseToughness * val;
        changes.push(`${effect.params.forEachDesc || 'CDA'}: ${effect.params.basePower >= 0 ? '+' : ''}${effect.params.basePower * val}/${effect.params.baseToughness >= 0 ? '+' : ''}${effect.params.baseToughness * val} (count: ${val}) → now ${state.power}/${state.toughness}`);
      } else {
        // "N plus the number of" pattern: add base value to count
        const base = effect.params.cdaBaseValue || 0;
        state.power = val + base;
        state.toughness = val + base + (effect.params.toughBonus || 0);
        changes.push(`CDA set P/T to ${state.power}/${state.toughness} (count: ${val}${base ? ', base: ' + base : ''}, was ${oldP}/${oldT})`);
      }
      break;
    }

    case EFFECT_TYPE.KEYWORD_COUNTER: {
      // Layer 6: keyword counters grant abilities
      const keyword = effect.params.keyword;
      if (keyword && !state.abilities.includes(keyword)) {
        state.abilities.push(keyword);
        changes.push(`Keyword counter grants "${keyword}"`);
        if (/\bchangeling\b/i.test(keyword)) state.hasChangeling = true;
      }
      break;
    }

    case EFFECT_TYPE.SWITCH_PT: {
      // Layer 7e: swap power and toughness.
      if (!state.types.includes('Creature')) break;
      const oldP = state.power, oldT = state.toughness;
      state.power = oldT;
      state.toughness = oldP;
      changes.push(`Switched P/T: ${oldP}/${oldT} → ${state.power}/${state.toughness}`);
      break;
    }

    case EFFECT_TYPE.SET_NAME: {
      const oldName = state.name;
      state.name = effect.params.name;
      changes.push(`Renamed "${oldName}" \u2192 "${state.name}"`);
      break;
    }

    case EFFECT_TYPE.GAIN_ACTIVATED_FROM_OTHERS: {
      // Marvin, Murderous Mimic: gain all activated abilities from permanents
      // that don't share a name with the card this ability is on.
      const selfName = state.name;
      const selfController = state.controller;
      if (!effect._allStates) break;
      for (const [pid, otherState] of effect._allStates) {
        if (pid === effect.sourceId) continue; // skip self
        if (otherState.name === selfName) continue; // skip same-named permanents
        // "creatures you control" — only gain from creatures controlled by Marvin's controller
        if (!otherState.types.includes('Creature')) continue;
        if (otherState.controller !== selfController) continue;
        // Extract activated abilities from this permanent's current abilities
        for (const ab of otherState.abilities) {
          const colonIdx = ab.indexOf(':');
          if (colonIdx < 0) continue;
          // Skip triggered abilities (start with when/whenever/at)
          if (/^(?:when(?:ever)?|at)\b/i.test(ab.trim())) continue;
          // Skip "enchant [type]" lines
          if (/^enchant\s/i.test(ab.trim())) continue;
          const effectText = ab.substring(colonIdx + 1).trim();
          if (!effectText) continue;
          // It's an activated ability — add it (duplicates are fine for activated abilities)
          state.abilities.push(ab);
          changes.push(`Gained activated ability from "${otherState.name}": "${ab}"`);
        }
      }
      break;
    }

    case EFFECT_TYPE.GAIN_ACTIVATED_FROM_GRAVEYARDS: {
      // Necrotic Ooze: gain all activated abilities of creature cards in all graveyards
      if (typeof Battlefield === 'undefined' || !Battlefield.players) break;
      for (const player of Battlefield.players) {
        if (!player.graveyard || !player.graveyard.length) continue;
        for (const card of player.graveyard) {
          // Only process creature cards
          const typeLine = (card.type_line || card.typeLine || '').toLowerCase();
          if (!typeLine.includes('creature')) continue;
          // Extract abilities from oracle text
          const oracle = card.oracle_text || card.oracleText || '';
          if (!oracle) continue;
          const strippedOracle = oracle.replace(/\s*\([^)]*\)/g, '').replace(/  +/g, ' ').trim();
          const abilityLines = strippedOracle.split('\n').map(l => l.trim()).filter(Boolean);
          for (const ab of abilityLines) {
            // Must be an activated ability (contains ":")
            const colonIdx = ab.indexOf(':');
            if (colonIdx < 0) continue;
            // Skip triggered abilities
            if (/^(?:when(?:ever)?|at)\b/i.test(ab)) continue;
            // Skip enchant lines
            if (/^enchant\s/i.test(ab)) continue;
            const effectText = ab.substring(colonIdx + 1).trim();
            if (!effectText) continue;
            // Replace card's proper name with "this card" for display
            const normalizedAb = ab.replace(new RegExp('\\b' + card.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), 'this card');
            state.abilities.push(normalizedAb);
            changes.push(`Gained activated ability from "${card.name}" (graveyard): "${normalizedAb}"`);
          }
        }
      }
      break;
    }

    case EFFECT_TYPE.GAIN_ACTIVATED_FROM_EXILE: {
      // Mairsil / Agatha's Soul Cauldron: gain activated abilities from cards in exile
      if (typeof Battlefield === 'undefined' || !Battlefield.exile) break;
      const _exSourceId = effect.sourceId;
      const _exFilterCounter = effect.params.filterCounter || null;
      const _exFilterTag = !!effect.params.filterTagToSource;
      for (const entry of Battlefield.exile) {
        if (_exFilterTag && entry.exiledWithId !== _exSourceId) continue;
        if (_exFilterCounter && !(entry.counters && entry.counters[_exFilterCounter] > 0)) continue;
        if (entry.isFaceDown) continue;
        const card = entry.card;
        const oracle = card.oracle_text || card.oracleText || '';
        if (!oracle) continue;
        const strippedOracle = oracle.replace(/\s*\([^)]*\)/g, '').replace(/  +/g, ' ').trim();
        const abilityLines = strippedOracle.split('\n').map(l => l.trim()).filter(Boolean);
        for (const ab of abilityLines) {
          const colonIdx = ab.indexOf(':');
          if (colonIdx < 0) continue;
          if (/^(?:when(?:ever)?|at)\b/i.test(ab)) continue;
          if (/^enchant\s/i.test(ab)) continue;
          const effectText = ab.substring(colonIdx + 1).trim();
          if (!effectText) continue;
          const normalizedAb = ab.replace(new RegExp('\\b' + card.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), 'this card');
          state.abilities.push(normalizedAb);
          const why = _exFilterCounter ? `with ${_exFilterCounter} counter` : 'tagged with this card';
          changes.push(`Gained activated ability from "${card.name}" (exile, ${why}): "${normalizedAb}"`);
        }
      }
      break;
    }

    case EFFECT_TYPE.CONTROL: {
      // Layer 2: control-changing effects (CR 613.1b)
      if (effect.params.exchangeControl) {
        // Exchange control: swap controllers of two permanents simultaneously
        const exchKey = effect.id || effect.sourceId;
        if (context && context.exchangeApplied && context.exchangeApplied.has(exchKey)) {
          // Already applied the swap — just report for the second permanent
          changes.push('Control exchanged (swap applied).');
          break;
        }
        if (context && context.exchangeApplied) context.exchangeApplied.add(exchKey);
        const allSt = effect._allStates;
        if (!allSt) { changes.push('(Exchange requires global state.)'); break; }
        const idA = effect.params.exchangeTargetA;
        const idB = effect.params.exchangeTargetB;
        const stA = allSt.get(idA);
        const stB = allSt.get(idB);
        if (!stA || !stB) { changes.push('(Exchange targets not found.)'); break; }
        const ctrlA = effect.params.snapshotControllerA != null ? effect.params.snapshotControllerA : stA.controller;
        const ctrlB = effect.params.snapshotControllerB != null ? effect.params.snapshotControllerB : stB.controller;
        stA.controller = ctrlB;
        stB.controller = ctrlA;
        const _getName = (id) => {
          if (typeof Battlefield !== 'undefined') {
            const p = Battlefield.permanents.find(pp => pp.id === id);
            if (p) return p.name + (p.label ? ` ${p.label}` : '');
          }
          return id;
        };
        const nameA = _getName(idA);
        const nameB = _getName(idB);
        const playerA = (typeof Battlefield !== 'undefined' && Battlefield.getPlayerName)
          ? Battlefield.getPlayerName(ctrlB) : ctrlB;
        const playerB = (typeof Battlefield !== 'undefined' && Battlefield.getPlayerName)
          ? Battlefield.getPlayerName(ctrlA) : ctrlA;
        changes.push(`Control exchanged: ${nameA} → ${playerA}, ${nameB} → ${playerB}`);
        break;
      }
      // For "you control enchanted/equipped" effects, resolve "you" as the current controller
      // of the source permanent in allStates (which may have been updated by earlier Layer 2
      // effects like Lay Claim). Fall back to newController if source not found.
      const newCtrl = (effect.params.useSourceController && effect._allStates)
        ? getEffectControllerId(effect, effect._allStates)
        : effect.params.newController;
      if (newCtrl && state.controller !== newCtrl) {
        state.controller = newCtrl;
        const playerName = (typeof Battlefield !== 'undefined' && Battlefield.getPlayerName)
          ? Battlefield.getPlayerName(newCtrl) : newCtrl;
        changes.push(`Controller changed to ${playerName}`);
      }
      break;
    }

    default:
      changes.push(`(Unhandled effect type: ${effect.type})`);
  }
  return changes;
}
/* [END: APPLY-EFFECT] */

/* [KEY: DEPENDENCY]
   CR 613.8  —  Global dependency detection and resolution.

   An effect A DEPENDS ON effect B if:
   (a) They apply in the same layer/sublayer, AND
   (b) Applying B would change whether A applies, what A applies to,
       or what A does to what it applies to  —  across ANY permanent, AND
   (c) Neither is a CDA, or both are CDAs.

   The engine evaluates GLOBALLY: it applies each chosen effect to
   ALL matching permanents, then re-detects dependencies with
   the updated global state.
*/

/* Does an effect apply to a specific permanent given its current state?
   `permId` is the permanent being tested (not necessarily the inspected one). */
function effectAppliesToPerm(effect, permState, permanent, permId, allStates, abilityGroupAffectedPerms) {
  // Compute who "you" is for this effect (the controller of the source permanent)
  const effectCtrl = getEffectControllerId(effect, allStates);
  // "Enchant player" effects scope to the chosen enchanted player rather than the source controller
  const ctrlForFilter = (effect._enchantedPlayerScoped && effect._enchantedPlayerId)
    ? effect._enchantedPlayerId
    : effectCtrl;

  if (effect.scope === 'targeted') {
    // Self-targeted effects (CDA_PT, counters, Volrath) apply only to their own source
    if (effect.selfTarget) {
      // TEXT_CHANGE effects with source ability text: the effect follows the ability.
      // If a text exchange moved the source ability to another permanent, the effect
      // applies to whichever permanent currently has that ability in its text box.
      if (effect.type === EFFECT_TYPE.TEXT_CHANGE && effect._sourceAbilityText) {
        const hasAbility = permState.abilities.some(a =>
          a.toLowerCase().includes(effect._sourceAbilityText)
        );
        if (!hasAbility) return false;
        // volrath_text: "As long as the top card of your graveyard is a creature card…"
        // gates the ENTIRE effect. "Your" = controller of whichever permanent currently
        // holds the ability (permState.controller), NOT the original source's controller.
        // This matters after Exchange of Words moves the ability to a different card.
        if (effect.params.changeType === 'volrath_text') {
          const ctrlId = permState.controller || 'player_0';
          const gCard = (typeof Battlefield !== 'undefined' && Battlefield.getGraveyardTop)
            ? Battlefield.getGraveyardTop(ctrlId)
            : null;
          if (!gCard || !(gCard.type_line || '').toLowerCase().includes('creature')) return false;
        }
        if (effect.asLongAsCondition) {
          if (!effect.asLongAsCondition(permState, allStates)) return false;
        }
        return true;
      }
      if (effect.sourceId !== permId) return false;
      // Check "as long as" condition even for self-targeted effects
      if (effect.asLongAsCondition) {
        if (!effect.asLongAsCondition(permState, allStates)) return false;
      }
      return true;
    }

    // Exchange control effects apply to both exchange targets (not through normal targeting)
    if (effect.type === EFFECT_TYPE.CONTROL && effect.params.exchangeControl) {
      const { exchangeTargetA, exchangeTargetB } = effect.params;
      if (exchangeTargetA && exchangeTargetB) {
        return permId === exchangeTargetA || permId === exchangeTargetB;
      }
      return false;
    }

    // Exchange text effects apply to both exchange targets (not through normal targeting)
    if (effect.type === EFFECT_TYPE.TEXT_CHANGE && effect.params.changeType === 'exchange_text') {
      const { exchangeTargetA, exchangeTargetB, exchangeTargetId } = effect.params;
      if (exchangeTargetA && exchangeTargetB) {
        return permId === exchangeTargetA || permId === exchangeTargetB;
      }
      if (exchangeTargetId) {
        return permId === effect.sourceId || permId === exchangeTargetId;
      }
      return false;
    }

    // Targeted effects require an explicit targetId (or targetIds for multi-target) to apply
    // Multi-target: effect has targetIds array (e.g. "up to two target creatures get +1/+1")
    if (effect.targetIds && effect.targetIds.length > 0) {
      if (!effect.targetIds.includes(permId)) return false;
      // Fall through to check conditions below
    } else if (!effect.targetId) {
      return false;
    } else if (effect.targetId !== permId) {
      // TEXT_CHANGE: if the target and this perm are in the same mutate stack,
      // apply the text change to this perm too — the stack is one merged permanent
      // and the text change should affect all merged abilities (Bug 1 fix).
      if (effect.type === EFFECT_TYPE.TEXT_CHANGE &&
          typeof Battlefield !== 'undefined' && Battlefield.mutateStacks) {
        const sameStack = Battlefield.mutateStacks.some(stack =>
          stack.length >= 2 && stack.includes(effect.targetId) && stack.includes(permId));
        if (!sameStack) return false;
      } else {
        return false;
      }
    }

    // Equipment effects only apply to creatures (dependency: target must be a creature)
    if (effect.requiresCreatureTarget && !permState.types.includes('Creature')) return false;

    // CR 702.16 — Protection from X: target rejects effects from a matching source.
    // Skip self-target effects (source = target). Aura/equipment attachment counts
    // as "targeting" in this engine and is also blocked.
    if (!effect.selfTarget && effect.sourceId !== permId) {
      const sourceState = allStates.get(effect.sourceId);
      const sourcePerm = (typeof Battlefield !== 'undefined')
        ? Battlefield.permanents.find(pp => pp.id === effect.sourceId) : null;
      // The "_nonTargetingSelection" flag (UI pronoun-to-target conversion) bypasses
      // protection ONLY for non-attachment effects. Auras/equipment attaching always count.
      const isAttachment = !!effect.auraRestriction || !!effect.requiresCreatureTarget;
      const isNonTargeting = sourcePerm && sourcePerm._nonTargetingSelection && !isAttachment;
      if (!isNonTargeting && _isProtectedFromSource(permState, sourceState, sourcePerm, permanent)) {
        return false;
      }
    }

    // "As long as" conditional effects: check runtime condition against target state
    // Must be checked BEFORE the early return so conditions are enforced
    // CR 613: If another part of the same ability already applied to this permanent
    // in an earlier layer, bypass the asLongAsCondition — all parts of a continuous
    // effect apply to the same set of permanents (e.g. Animate Artifact: Layer 4 adds
    // Creature type, Layer 7b should still set P/T even though target is now a creature).
    if (effect.asLongAsCondition) {
      const groupAlreadyAppliedTargeted = abilityGroupAffectedPerms && effect.abilityGroupId
        && abilityGroupAffectedPerms.has(effect.abilityGroupId)
        && abilityGroupAffectedPerms.get(effect.abilityGroupId).has(permId);
      if (!groupAlreadyAppliedTargeted) {
        if (!effect.asLongAsCondition(permState, allStates)) return false;
      }
    }

    return true;
  }

  if (effect.scope === 'global' && _effectiveSourceId(effect, allStates) === permId) {
    const selfAllowed = effect.affectsSelf !== undefined ? effect.affectsSelf : true;
    if (!selfAllowed) return false;
  }

  // "target opponent": effect applies only to the chosen opponent's permanents.
  // If no opponent chosen yet, the effect applies to nobody.
  if (effect._targetsOpponentPlayer) {
    const chosenOpp = effect._targetOpponentPlayerId;
    if (!chosenOpp) return false;
    if (permState.controller !== chosenOpp) return false;
  }

  if (effect.appliesTo) {
    // CR 613: If another part of the same ability already applied to this permanent
    // in an earlier layer, bypass the appliesTo filter — all parts of a continuous
    // effect apply to the same set of permanents.
    const groupAlreadyApplied = abilityGroupAffectedPerms && effect.abilityGroupId
      && abilityGroupAffectedPerms.has(effect.abilityGroupId)
      && abilityGroupAffectedPerms.get(effect.abilityGroupId).has(permId);
    if (!groupAlreadyApplied) {
      // For spell effects, check the filter against the permanent's characteristics
      // as they existed at spell resolution time. Spells should not benefit from
      // type/subtype/color changes made by continuous effects with later timestamps.
      // Strategy: check against base (printed) state. If that matches, spell applies.
      // If only the accumulated state matches, verify an earlier-timestamped continuous
      // effect on THIS permanent caused the match; otherwise block.
      if (effect.isSpellEffect && permanent) {
        const baseState = {
          ...permState,
          types: [...(permanent.printedTypes || permState.types)],
          subtypes: [...(permanent.printedSubtypes || permState.subtypes)],
          supertypes: [...(permanent.printedSupertypes || permState.supertypes)],
          colors: [...(permanent.printedColors || permState.colors)],
          isAllCreatureTypes: (permanent.printedAbilities || []).some(a => /\bchangeling\b/i.test(a)),
        };
        const baseMatches = effect.appliesTo(baseState, allStates, ctrlForFilter);
        const currentMatches = effect.appliesTo(permState, allStates, ctrlForFilter);
        if (!baseMatches && !currentMatches) return false;
        if (!baseMatches && currentMatches) {
          // Only current state matches — some effect changed the permanent.
          // Allow only if an effect with an earlier timestamp that could change
          // types/subtypes/colors applies to this specific permanent.
          // Earlier spells count too (e.g. Artificial Evolution changing creature types).
          const spellTs = effect.timestamp;
          let hasEarlierRelevantEffect = false;
          if (typeof Battlefield !== 'undefined') {
            for (const e of Battlefield.effects) {
              if (e.disabled || e.timestamp >= spellTs) continue;
              // Skip the spell effect itself (don't self-validate)
              if (e.sourceId === effect.sourceId) continue;
              if (e.type !== EFFECT_TYPE.ADD_TYPE && e.type !== EFFECT_TYPE.SET_TYPE &&
                  e.type !== EFFECT_TYPE.ADD_COLOR && e.type !== EFFECT_TYPE.SET_COLOR &&
                  e.type !== EFFECT_TYPE.COPY && e.type !== EFFECT_TYPE.TEXT_CHANGE) continue;
              // Check if this effect targets our permanent
              if (e.scope === 'targeted') {
                if ((e.selfTarget && e.sourceId === permId) ||
                    e.targetId === permId ||
                    (e.targetIds && e.targetIds.includes(permId))) {
                  hasEarlierRelevantEffect = true; break;
                }
              } else {
                // Global effect — check if it would apply to this permanent's base state
                if (!e.appliesTo || e.appliesTo(baseState)) {
                  hasEarlierRelevantEffect = true; break;
                }
              }
            }
          }
          if (!hasEarlierRelevantEffect) return false;
        }
      } else {
        if (!effect.appliesTo(permState, allStates, ctrlForFilter)) return false;
      }
    }
  }

  // "As long as" conditional effects for global effects
  if (effect.asLongAsCondition) {
    if (!effect.asLongAsCondition(permState, allStates)) return false;
  }

  // Spell effects (instants/sorceries) only affect permanents that existed before the
  // spell was cast — i.e., permanents with a strictly earlier timestamp.
  if (effect.isSpellEffect && permanent && permanent.timestamp >= effect.timestamp) {
    return false;
  }

  return true;
}

/* Is the source permanent of an effect still able to generate it?
   If the source lost abilities via rule 305.7 (land subtype replacement)
   or via a REMOVE_ABILITIES effect (e.g. Humility, Darksteel Mutation),
   effects generated by its oracle text cease to exist.
   Fix 18: Also checks allAbilitiesRemoved flag for Layer 6 ability removal.
   Targeted (aura) effects from OTHER sources are exempt — they come from
   the aura's rules text, not the enchanted creature's. */
function isSourceViable(effect, allStates) {
  if (!effect.sourceId || effect.sourceId === 'manual') return true;
  // Counters are external game objects, not rules text — they survive ability removal.
  if (effect._isCounterEffect) return true;
  const srcState = allStates.get(effect.sourceId);
  if (!srcState) return true; // source not tracked (manual pseudo-perm)
  if (srcState.abilitiesRemovedBy305_7) return false;
  // Fix 18: If source had all abilities removed, its rules-text effects are dead.
  // Exception: targeted effects that target the source itself (e.g. CDA on self)
  // still work because they define characteristics, not grant abilities externally.
  // Actually, CDAs and self-targeted effects are part of the creature's own rules text,
  // so they ARE affected. The exception is effects from OTHER sources (auras etc.)
  // which have a different sourceId — those won't be checked against this creature's state.
  if (srcState.allAbilitiesRemoved) return false;
  return true;
}

/* CR 702.16 — Protection from X.
   Parses one ability line for "protection from <X>" clauses (the line may be a
   keyword run like "Defender, protection from Zombies"). Returns array of
   { kind, value, raw } or empty. */
const _COLOR_NAME_TO_CODE = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };
const _CARD_TYPES_FOR_PROTECTION = new Set([
  'Creature', 'Artifact', 'Enchantment', 'Planeswalker', 'Land', 'Battle',
  'Instant', 'Sorcery', 'Tribal'
]);
function _parseOneProtectionClause(clauseRaw) {
  let x = clauseRaw.trim().toLowerCase().replace(/\.$/, '').trim();
  if (!x) return null;
  // Strip trailing duration suffixes ("until end of turn", "this turn", etc.)
  x = x.replace(/\s+(?:until\s+(?:end\s+of\s+turn|your\s+next\s+turn|the\s+end\s+of\s+(?:turn|your\s+next\s+turn))|this\s+turn)\s*$/i, '').trim();
  if (!x) return null;
  // Multi-word phrases first
  if (x === 'everything') return { kind: 'everything', value: null, raw: clauseRaw };
  if (x === 'all colors' || x === 'each color')
    return { kind: 'all_colors', value: null, raw: clauseRaw };
  if (x === 'monocolored') return { kind: 'monocolored', value: null, raw: clauseRaw };
  if (x === 'multicolored') return { kind: 'multicolored', value: null, raw: clauseRaw };
  if (x === 'colorless') return { kind: 'colorless', value: null, raw: clauseRaw };
  // First-word match wins for single-word kinds (color, equipment, aura, type, subtype).
  // This makes the parser tolerant of trailing modifiers we didn't strip.
  const firstWord = x.split(/\s+/)[0];
  if (_COLOR_NAME_TO_CODE[firstWord]) return { kind: 'color', value: _COLOR_NAME_TO_CODE[firstWord], raw: clauseRaw };
  if (firstWord === 'equipment') return { kind: 'subtype', value: 'Equipment', raw: clauseRaw };
  if (firstWord === 'aura' || firstWord === 'auras') return { kind: 'subtype', value: 'Aura', raw: clauseRaw };
  // Card type / subtype: try the full phrase first, then first word
  const sing = (typeof singularizeCreatureType === 'function')
    ? singularizeCreatureType(x)
    : (x.endsWith('s') ? x.charAt(0).toUpperCase() + x.slice(1, -1) : x.charAt(0).toUpperCase() + x.slice(1));
  if (_CARD_TYPES_FOR_PROTECTION.has(sing)) return { kind: 'cardType', value: sing, raw: clauseRaw };
  const singFirst = (typeof singularizeCreatureType === 'function')
    ? singularizeCreatureType(firstWord)
    : firstWord.charAt(0).toUpperCase() + firstWord.slice(1).replace(/s$/, '');
  if (_CARD_TYPES_FOR_PROTECTION.has(singFirst)) return { kind: 'cardType', value: singFirst, raw: clauseRaw };
  // Otherwise treat as subtype (Goblin, Cleric, Zombie, etc.) — use first word
  return { kind: 'subtype', value: singFirst, raw: clauseRaw };
}
function _parseProtectionAbility(abilityLine) {
  const out = [];
  if (!abilityLine) return out;
  const text = abilityLine.toLowerCase();
  const re = /protection from\s+([^.,;\n]+?(?:\s+and from\s+[^.,;\n]+?)*)(?=[.,;]|$)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const body = m[1].trim();
    // Split compound: "black and from white" → ["black", "white"]
    const parts = body.split(/\s+and from\s+/i).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const parsed = _parseOneProtectionClause(part);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}

/* Re-derive structured protection from a state's abilities[] (after Layer 6).
   Cached on state._protectionFrom for the duration of evaluation. */
function _getStateProtection(state) {
  if (!state || !state.abilities) return [];
  if (state._protectionFrom) return state._protectionFrom;
  const all = [];
  for (const ab of state.abilities) {
    const parsed = _parseProtectionAbility(ab);
    for (const p of parsed) all.push(p);
  }
  state._protectionFrom = all;
  return all;
}

/* Find the timestamp at which a permanent acquired a particular protection entry.
   For PRINTED protection, returns targetPerm.timestamp (the perm's own timestamp).
   For GRANTED protection, returns the earliest timestamp of any ADD_ABILITY effect
   whose params.ability parses to a matching protection clause and which targets
   this perm. Used to gate one-time effects: a spell with timestamp earlier than the
   protection grant resolves "before" protection existed and ignores it. */
function _protectionGrantTimestamp(targetPerm, protEntry) {
  // Default to printed: the protection was on the perm from the start.
  let printedTs = (targetPerm && targetPerm.timestamp) || 0;
  // Check whether this entry came from the perm's PRINTED abilities (it was always there).
  const printed = (targetPerm && targetPerm.printedAbilities) || [];
  const matchesEntry = (parsedList) => parsedList.some(q =>
    q.kind === protEntry.kind && q.value === protEntry.value);
  for (const ab of printed) {
    if (matchesEntry(_parseProtectionAbility(ab))) return printedTs;
  }
  // Otherwise look for the granting effect on the battlefield.
  if (typeof Battlefield === 'undefined' || !Battlefield.effects) return printedTs;
  let earliest = Infinity;
  for (const eff of Battlefield.effects) {
    if (eff.type !== EFFECT_TYPE.ADD_ABILITY) continue;
    if (!eff.params || !eff.params.ability) continue;
    if (!matchesEntry(_parseProtectionAbility(eff.params.ability))) continue;
    // Check whether this effect actually targets/applies to targetPerm.
    if (eff.scope === 'targeted') {
      if (eff.targetId === targetPerm.id) {
        if (eff.timestamp != null && eff.timestamp < earliest) earliest = eff.timestamp;
      } else if (Array.isArray(eff.targetIds) && eff.targetIds.includes(targetPerm.id)) {
        if (eff.timestamp != null && eff.timestamp < earliest) earliest = eff.timestamp;
      }
    } else if (eff.scope === 'global' && typeof eff.appliesTo === 'function') {
      // Approximate: if the effect's filter would match this perm by name (we
      // can't easily run appliesTo here without state), be permissive — assume
      // the grant exists at the effect's timestamp.
      if (eff.timestamp != null && eff.timestamp < earliest) earliest = eff.timestamp;
    }
  }
  if (earliest !== Infinity) return earliest;
  return printedTs;
}

/* CR 702.16: returns a protection entry that matches `sourceState`/`sourcePerm`,
   or null if the target isn't protected from the source.
   Manual-effect spells (instants/sorceries fired as pseudo-perms) aren't tracked
   in allStates, so fall back to `sourcePerm.printed*` for colors/types/subtypes.
   `targetPerm` is optional but enables timestamp-aware bypass for one-time effects:
   a spell or activated ability whose timestamp predates the protection grant
   ignores that protection entry (the spell would have resolved before protection
   was acquired).

   CR 113.7: For triggered/activated ability pseudo-perms, the SOURCE for protection
   purposes is the original permanent that has the ability — not the pseudo-perm
   (whose printedTypes is ['Instant']). Re-resolve via `abilitySourceId` so e.g.
   Mother of Runes' activated ability counts as a Creature source. */
function _isProtectedFromSource(targetState, sourceState, sourcePerm, targetPerm) {
  const prots = _getStateProtection(targetState);
  if (!prots.length) return null;
  // Resolve the real ability-source perm for triggered/activated pseudo-perms.
  let realSourcePerm = sourcePerm;
  let realSourceState = sourceState;
  if (sourcePerm && sourcePerm.abilitySourceId &&
      (sourcePerm.isTriggeredAbility || sourcePerm.isActivatedAbility) &&
      typeof Battlefield !== 'undefined') {
    const orig = Battlefield.permanents.find(pp => pp.id === sourcePerm.abilitySourceId);
    if (orig) {
      realSourcePerm = orig;
      // Attempt to use the real source's final state if accessible via Battlefield
      if (typeof Battlefield.getAllFinalStates === 'function') {
        const fs = Battlefield.getAllFinalStates();
        const rs = fs && fs.get && fs.get(orig.id);
        if (rs) realSourceState = rs;
      }
    }
  }
  // One-time-effect bypass: filter out protection entries acquired AFTER this source's timestamp.
  // Use the pseudo-perm's timestamp for the bypass (that's when the ability was activated/triggered),
  // not the real-source perm's timestamp.
  const isOneTimeSource = sourcePerm && sourcePerm.isManualEffect;
  const sourceTs = sourcePerm && sourcePerm.timestamp;
  let activeProts = prots;
  if (isOneTimeSource && targetPerm && sourceTs != null) {
    activeProts = prots.filter(p => {
      const grantTs = _protectionGrantTimestamp(targetPerm, p);
      return grantTs <= sourceTs;
    });
  }
  if (!activeProts.length) return null;
  const sColors = (realSourceState && realSourceState.colors) || (realSourcePerm && realSourcePerm.printedColors) || [];
  const sTypes = (realSourceState && realSourceState.types) || (realSourcePerm && realSourcePerm.printedTypes) || [];
  const sSubs = (realSourceState && realSourceState.subtypes) || (realSourcePerm && realSourcePerm.printedSubtypes) || [];
  const sName = (realSourceState && realSourceState.name) || (realSourcePerm && realSourcePerm.name) || '';
  const sIsAllCreatureTypes = !!(realSourceState && realSourceState.isAllCreatureTypes);
  for (const p of activeProts) {
    switch (p.kind) {
      case 'everything': return p;
      case 'colorless':
        if (sColors.length === 0) return p;
        break;
      case 'all_colors':
        if (sColors.length > 0) return p;
        break;
      case 'monocolored':
        if (sColors.length === 1) return p;
        break;
      case 'multicolored':
        if (sColors.length >= 2) return p;
        break;
      case 'color':
        if (sColors.includes(p.value)) return p;
        break;
      case 'cardType':
        if (sTypes.includes(p.value)) return p;
        break;
      case 'subtype':
        if (sSubs.includes(p.value)) return p;
        // Changeling / "is every creature type"
        if (sIsAllCreatureTypes && typeof TypeCatalog !== 'undefined' &&
            TypeCatalog.creatureTypes && TypeCatalog.creatureTypes.has(p.value)) return p;
        break;
      case 'name':
        if (sName === p.value) return p;
        break;
    }
  }
  return null;
}

function _formatProtectionEntry(p) {
  switch (p.kind) {
    case 'color': {
      const m = { W: 'white', U: 'blue', B: 'black', R: 'red', G: 'green' };
      return `protection from ${m[p.value] || p.value}`;
    }
    case 'all_colors': return 'protection from all colors';
    case 'monocolored': return 'protection from monocolored';
    case 'multicolored': return 'protection from multicolored';
    case 'colorless': return 'protection from colorless';
    case 'everything': return 'protection from everything';
    default: return `protection from ${p.value}`;
  }
}

/* Compare two states for meaningful differences. */
function statesAreDifferent(a, b) {
  if ([...a.types].sort().join() !== [...b.types].sort().join()) return true;
  if ([...a.subtypes].sort().join() !== [...b.subtypes].sort().join()) return true;
  if ([...a.supertypes].sort().join() !== [...b.supertypes].sort().join()) return true;
  if ([...a.abilities].sort().join() !== [...b.abilities].sort().join()) return true;
  if ([...a.colors].sort().join() !== [...b.colors].sort().join()) return true;
  if (a.power !== b.power || a.toughness !== b.toughness) return true;
  return false;
}

/* CR 613.8 dependency: compare what an additive effect (ADD_TYPE, ADD_COLOR,
   ADD_ABILITY, MODIFY_PT) actually DOES (its delta) rather than the full resulting
   state.  Full-state comparison produces false positives when B's changes persist
   in the result even though A's behaviour is identical.
   Example: Life-and-Limb (ADD_TYPE) + Conversion — Conversion changes Mountain→Plains
   on Taiga, but Life-and-Limb still adds exactly Creature + Saproling either way. */
function additiveDeltaDiffers(before1, after1, before2, after2) {
  const diff = (arrA, arrB) => arrA.filter(x => !arrB.includes(x)).sort().join();
  // Types
  if (diff(after1.types, before1.types) !== diff(after2.types, before2.types)) return true;
  // Subtypes
  if (diff(after1.subtypes, before1.subtypes) !== diff(after2.subtypes, before2.subtypes)) return true;
  // Supertypes
  if (diff(after1.supertypes, before1.supertypes) !== diff(after2.supertypes, before2.supertypes)) return true;
  // Colors
  if (diff(after1.colors, before1.colors) !== diff(after2.colors, before2.colors)) return true;
  // Abilities
  if (diff(after1.abilities, before1.abilities) !== diff(after2.abilities, before2.abilities)) return true;
  // P/T delta (for MODIFY_PT)
  const pDelta1 = (after1.power ?? 0) - (before1.power ?? 0);
  const pDelta2 = (after2.power ?? 0) - (before2.power ?? 0);
  const tDelta1 = (after1.toughness ?? 0) - (before1.toughness ?? 0);
  const tDelta2 = (after2.toughness ?? 0) - (before2.toughness ?? 0);
  if (pDelta1 !== pDelta2 || tDelta1 !== tDelta2) return true;
  return false;
}

/* Global dependency test: does applying B (to all permanents it affects)
   change whether/how A behaves on ANY permanent? */
function doesBInfluenceA_global(A, B, allStates, realPerms) {
  // Special case: "you control enchanted/equipped" CONTROL effects resolve their
  // newController dynamically from the source's current controller. If B is a CONTROL
  // effect that changes A's source's controller, then B influences A (the effective
  // "you" changes, changing who gains control of the enchanted permanent).
  if (A.type === EFFECT_TYPE.CONTROL && A.params.useSourceController &&
      A.sourceId && A.sourceId !== 'manual' &&
      B.type === EFFECT_TYPE.CONTROL && !B.params.exchangeControl) {
    const aSourceState = allStates.get(A.sourceId);
    if (aSourceState) {
      // Does B target A's source directly?
      const bTargetsASource = (B.scope === 'targeted' && !B.selfTarget &&
        (B.targetId === A.sourceId || (B.targetIds && B.targetIds.includes(A.sourceId))));
      // Does B's global appliesTo filter match A's source?
      const bGloballyAffectsASource = !bTargetsASource && B.appliesTo &&
        B.appliesTo(aSourceState, allStates, getEffectControllerId(B, allStates));
      if (bTargetsASource || bGloballyAffectsASource) {
        // B changes A's source's controller, which changes A's effective newController
        return true;
      }
    }
  }

  // For effects that operate on multiple permanents at once (exchange_text swaps
  // two text boxes, volrath_text reads from graveyard), we build a temporary
  // global state map so the simulation can actually apply B properly. This lets
  // the general loop detect dependencies without hardcoded special cases.
  const isGlobalB = B.type === EFFECT_TYPE.TEXT_CHANGE &&
    (B.params.changeType === 'exchange_text' || B.params.changeType === 'volrath_text');

  // Build "with B" global snapshot: snapshot all states, apply B globally to the copy
  let statesWithB = null;
  if (isGlobalB) {
    statesWithB = new Map();
    for (const p of realPerms) {
      const s = allStates.get(p.id);
      if (s) statesWithB.set(p.id, snapshotState(s));
    }
    // Apply B to all matching perms in the snapshot map (exchange needs both targets)
    const simB = { ...B, _allStates: statesWithB };
    const simContext = { exchangeApplied: new Set() };
    for (const p of realPerms) {
      const sB = statesWithB.get(p.id);
      if (sB && effectAppliesToPerm(simB, sB, p, p.id, statesWithB)) {
        applyEffect(sB, simB, simContext);
      }
    }
  }

  for (const perm of realPerms) {
    const baseState = allStates.get(perm.id);
    if (!baseState) continue;

    const stateWithoutB = snapshotState(baseState);
    // For global effects use the pre-computed "with B" state; otherwise apply per-perm
    let stateWithB;
    if (isGlobalB) {
      stateWithB = statesWithB.get(perm.id) || snapshotState(baseState);
    } else {
      stateWithB = snapshotState(baseState);
      if (effectAppliesToPerm(B, stateWithB, perm, perm.id, allStates)) {
        applyEffect(stateWithB, B);
      }
    }

    const aWithout = effectAppliesToPerm(A, stateWithoutB, perm, perm.id, allStates);
    const aWith    = effectAppliesToPerm(A, stateWithB, perm, perm.id, allStates);

    // Applicability changed on this permanent
    if (aWithout !== aWith) return true;

    // Result changed on this permanent
    if (aWithout && aWith) {
      // Purely additive/subtractive effects with static params (ADD_TYPE, ADD_COLOR,
      // ADD_ABILITY, REMOVE_ABILITIES) always attempt to add or remove the same
      // values regardless of existing state.  If the effect applies in both
      // scenarios the delta may differ (e.g. an addition is redundant in one case
      // but novel in the other, or a removal finds nothing to remove) yet the
      // effect's *behaviour* is identical — CR 613.8b only cares whether the
      // effect itself changes, not whether existing state absorbs it differently.
      // e.g. "loses flying" (REMOVE_ABILITIES) always attempts the same removal
      // regardless of whether another effect granted flying; "gains flying"
      // (ADD_ABILITY) always attempts the same addition regardless of whether
      // another effect removed flying.  Skip the delta check for these; only
      // applicability (condition a, checked above) matters.
      const STATIC_ADDITIVE = [EFFECT_TYPE.ADD_TYPE, EFFECT_TYPE.ADD_COLOR,
                                EFFECT_TYPE.ADD_ABILITY, EFFECT_TYPE.REMOVE_ABILITIES,
                                EFFECT_TYPE.KEYWORD_COUNTER];
      if (STATIC_ADDITIVE.includes(A.type)) continue;

      // SET_TYPE effects always output a fixed set of types/subtypes regardless
      // of the permanent's existing state:
      //   • replaceSubtypeCategory: replaces a fixed category with a fixed list.
      //   • Full SET_TYPE (explicit types, no keepTypes): overwrites all types and
      //     subtypes with fixed values (e.g. Darksteel Mutation → Artifact Creature
      //     Insect, Song of the Dryads → Land Forest).
      // In both cases the result is deterministic; B can only matter if it changes
      // whether A applies at all (tested above). The full-state comparison produces
      // false positives when B's side effects (e.g. CR 305.6 mana abilities added
      // by an ADD_TYPE subtype grant) linger in the snapshot — those are irrelevant
      // to whether A's own output changes. Only applicability changes matter.
      if (A.type === EFFECT_TYPE.SET_TYPE && A.params &&
          (A.params.replaceSubtypeCategory ||
           (A.params.types !== undefined && !A.params.keepTypes))) continue;

      // TEXT_CHANGE effects have specialized dependency rules:
      //
      // exchange_text and volrath_text read from fixed sources (frozen snapshots
      // or the top graveyard card), so B changing a target's live text cannot
      // affect what these effects write. Skip the result-changed check entirely
      // for them — only applicability changes (tested above) can create dependency.
      if (A.type === EFFECT_TYPE.TEXT_CHANGE &&
          (A.params.changeType === 'exchange_text' ||
           A.params.changeType === 'volrath_text')) continue;

      // Word-replacement TEXT_CHANGE effects (color, land type, creature type
      // substitutions): B *removing* a matchable word from A's target does NOT
      // create dependency — A still "applies" to its target, it simply finds
      // nothing to replace. Only if WITH B applied the target's text still
      // contains A's search word(s) can B affect what A does, and only then
      // should we continue to the result-changed check below.
      if (A.type === EFFECT_TYPE.TEXT_CHANGE) {
        const reps = A.params.replacements || [];
        const searchWords = reps.map(r => r.from).filter(Boolean);
        if (searchWords.length > 0) {
          const textWithB = stateWithB.oracleText || '';
          const anyMatchWithB = searchWords.some(w => {
            const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(esc, 'i').test(textWithB);
          });
          if (!anyMatchWithB) continue;
        }
      }

      const beforeWithout = snapshotState(stateWithoutB);
      const resultWithout = snapshotState(stateWithoutB);
      applyEffect(resultWithout, A);
      const beforeWith = snapshotState(stateWithB);
      const resultWith = snapshotState(stateWithB);
      applyEffect(resultWith, A);

      // For MODIFY_PT, partial SET_TYPE, and word-replacement TEXT_CHANGE,
      // compare what A actually CHANGED (delta) rather than the full resulting
      // state. This prevents false positives when B's changes persist in the
      // result even though A behaves identically (e.g. B changes "blue"→"green"
      // in an unrelated ability on the same permanent while A changes "red"→
      // "white" in a different ability — the delta for A's own replacement is
      // identical, even though the full state differs due to B's change).
      // exchange_text and volrath_text are excluded — they are handled by the
      // early-continue checks above and never reach this point.
      const DELTA_CHECK = [EFFECT_TYPE.MODIFY_PT, EFFECT_TYPE.TEXT_CHANGE];
      const isPartialSet = A.type === EFFECT_TYPE.SET_TYPE && A.params &&
                           (A.params.replaceSubtypeCategory || A.params.keepTypes);
      if (DELTA_CHECK.includes(A.type) || isPartialSet) {
        if (additiveDeltaDiffers(beforeWithout, resultWithout, beforeWith, resultWith)) return true;
      } else {
        if (statesAreDifferent(resultWithout, resultWith)) return true;
      }
    }
  }

  // Source-viability check: does applying B cause A's source to lose abilities?
  // e.g. Blood Moon (B) → Urborg becomes Mountain → Urborg's effect (A) dies.
  if (A.sourceId && A.sourceId !== 'manual') {
    const srcState = allStates.get(A.sourceId);
    if (srcState) {
      const srcWithout = snapshotState(srcState);
      // For global effects, use the pre-computed "with B" snapshot
      const srcWith = isGlobalB && statesWithB && statesWithB.has(A.sourceId)
        ? snapshotState(statesWithB.get(A.sourceId))
        : snapshotState(srcState);
      if (!isGlobalB && effectAppliesToPerm(B, srcWith, null, A.sourceId, allStates)) {
        applyEffect(srcWith, B);
      }
      // When B is itself an ADD_ABILITY or REMOVE_ABILITIES effect, the allAbilitiesRemoved
      // path does NOT create a dependency.  These are same-sublayer (6b) ability effects;
      // CR 613.8 uses timestamp order within a sublayer unless one effect changes what
      // the other does.  Humility removing Bello's own creature abilities is a within-
      // sublayer interaction — the dependency logic must not treat it as a cross-layer
      // source-viability dependency (which the 305.7 / Blood-Moon path is designed for).
      const bIsSameLayerAbility = B.type === EFFECT_TYPE.ADD_ABILITY ||
                                   B.type === EFFECT_TYPE.REMOVE_ABILITIES;
      if ((srcWith.abilitiesRemovedBy305_7 && !srcWithout.abilitiesRemovedBy305_7) ||
          (!bIsSameLayerAbility && srcWith.allAbilitiesRemoved && !srcWithout.allAbilitiesRemoved)) {
        return true;
      }
    }
  }

  return false;
}

/* Returns a human-readable string explaining WHY B is a dependency of A.
   Only called after doesBInfluenceA_global has already confirmed the dependency,
   so the same checks are re-run here purely to identify which condition fired. */
function getDependencyReason(A, B, allStates, realPerms) {
  const aName = _effectDisplayName(A, allStates);
  const bName = _effectDisplayName(B, allStates);

  const isGlobalB = B.type === EFFECT_TYPE.TEXT_CHANGE &&
    (B.params.changeType === 'exchange_text' || B.params.changeType === 'volrath_text');

  // Build "with B" snapshot for global effects (mirrors doesBInfluenceA_global)
  let statesWithB = null;
  if (isGlobalB) {
    statesWithB = new Map();
    for (const p of realPerms) {
      const s = allStates.get(p.id);
      if (s) statesWithB.set(p.id, snapshotState(s));
    }
    const simB = { ...B, _allStates: statesWithB };
    const simCtx = { exchangeApplied: new Set() };
    for (const p of realPerms) {
      const sB = statesWithB.get(p.id);
      if (sB && effectAppliesToPerm(simB, sB, p, p.id, statesWithB)) applyEffect(sB, simB, simCtx);
    }
  }

  // Check applicability change on any permanent
  for (const perm of realPerms) {
    const base = allStates.get(perm.id);
    if (!base) continue;
    const stWithout = snapshotState(base);
    let stWith;
    if (isGlobalB) {
      stWith = statesWithB.get(perm.id) || snapshotState(base);
    } else {
      stWith = snapshotState(base);
      if (effectAppliesToPerm(B, stWith, perm, perm.id, allStates)) applyEffect(stWith, B);
    }
    const appWithout = effectAppliesToPerm(A, stWithout, perm, perm.id, allStates);
    const appWith    = effectAppliesToPerm(A, stWith,    perm, perm.id, allStates);
    if (appWithout !== appWith) {
      const permLabel = perm.name || 'a permanent';
      return appWith
        ? `"${bName}" causes "${aName}" to start applying to ${permLabel}.\n\nSince "${bName}" changes what "${aName}" applies to, "${aName}" is dependent on "${bName}" and needs to wait for "${bName}" to happen first.`
        : `"${bName}" causes "${aName}" to stop applying to ${permLabel}.\n\nSince "${bName}" changes what "${aName}" applies to, "${aName}" is dependent on "${bName}" and needs to wait for "${bName}" to happen first.`;
    }
  }

  // Check source-viability
  if (A.sourceId && A.sourceId !== 'manual') {
    const srcState = allStates.get(A.sourceId);
    if (srcState) {
      const srcWithout = snapshotState(srcState);
      const srcWith    = isGlobalB && statesWithB && statesWithB.has(A.sourceId)
        ? snapshotState(statesWithB.get(A.sourceId))
        : snapshotState(srcState);
      if (!isGlobalB && effectAppliesToPerm(B, srcWith, null, A.sourceId, allStates)) {
        applyEffect(srcWith, B);
      }
      const srcName = A.sourceName || 'the source permanent';
      if (srcWith.abilitiesRemovedBy305_7 && !srcWithout.abilitiesRemovedBy305_7) {
        return `"${bName}" makes ${srcName} a basic land type (CR 305.7), causing it to lose all non-basic abilities including the one that generates "${aName}".\n\nSince "${bName}" changes ${srcName}'s type, "${aName}" is dependent on "${bName}" and needs to wait for "${bName}" to happen first.`;
      }
      if (srcWith.allAbilitiesRemoved && !srcWithout.allAbilitiesRemoved) {
        return `"${bName}" removes all abilities from ${srcName}, including the one that generates "${aName}".\n\nSince "${bName}" removes ${srcName}'s abilities, "${aName}" is dependent on "${bName}" and needs to wait for "${bName}" to happen first.`;
      }
    }
  }

  // Result changed (fallback)
  return `"${bName}" changes what "${aName}" affects or produces.\n\nSince "${bName}" changes what "${aName}" produces, "${aName}" is dependent on "${bName}" and needs to wait for "${bName}" to happen first.`;
}

/* Detect all pairwise dependencies among effects using current global state.
   Spell effects (isSpellEffect) are excluded — they always resolve in strict
   timestamp order with no dependency reordering (CR: spells resolve on the stack). */
function detectDependenciesGlobal(effects, allStates, realPerms) {
  const deps = [];
  for (let i = 0; i < effects.length; i++) {
    if (effects[i].isSpellEffect) continue;
    for (let j = 0; j < effects.length; j++) {
      if (i === j) continue;
      if (effects[j].isSpellEffect) continue;
      if (doesBInfluenceA_global(effects[i], effects[j], allStates, realPerms)) {
        deps.push({ dependent: i, dependsOn: j });
      }
    }
  }
  return deps;
}

/* CR 613.8 loop detection: find cycles and remove ALL dependencies involving cycle nodes */
function removeLoopDependencies(deps) {
  const adj = {};
  for (const d of deps) {
    if (!adj[d.dependent]) adj[d.dependent] = new Set();
    adj[d.dependent].add(d.dependsOn);
  }
  const inLoop = new Set();
  const visited = new Set();
  const stack = new Set();

  function dfs(node, path) {
    if (stack.has(node)) {
      let inCycle = false;
      for (const p of path) {
        if (p === node) inCycle = true;
        if (inCycle) inLoop.add(p);
      }
      inLoop.add(node);
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    path.push(node);
    for (const next of (adj[node] || [])) {
      dfs(next, [...path]);
    }
    stack.delete(node);
  }

  const allNodes = new Set(deps.flatMap(d => [d.dependent, d.dependsOn]));
  for (const node of allNodes) {
    if (!visited.has(node)) dfs(node, []);
  }

  return {
    cleaned: deps.filter(d => !(inLoop.has(d.dependent) && inLoop.has(d.dependsOn))),
    loopNodes: inLoop,
  };
}

/* Full CR 613.8: apply one layer's effects GLOBALLY.
   Picks an independent effect, applies it to ALL matching permanents,
   then re-detects dependencies from scratch with updated global state.
   Returns log info relevant to the inspected permanent. */
function applyLayerGlobal(effects, allStates, allPermanents, inspectedId, appliedSourceIds, abilityGroupAffectedPerms, abilityGroupRejectedPerms) {
  const realPerms = allPermanents.filter(p => !p.isManualEffect);
  const log = [];
  const logReasons = {}; // maps log-entry text → human-readable reason string
  const applicationLog = [];
  let remaining = [...effects];
  let iteration = 0;
  const MAX_ITER = 50;

  while (remaining.length > 0 && iteration < MAX_ITER) {
    iteration++;

    // Step 1: detect dependencies using CURRENT global state
    const deps = detectDependenciesGlobal(remaining, allStates, realPerms);

    // Step 2: remove loops
    const { cleaned, loopNodes } = removeLoopDependencies(deps);
    if (loopNodes.size > 0) {
      const loopNames = [...loopNodes].map(i => `"${remaining[i] ? _effectDisplayName(remaining[i], allStates) : '?'}"`).join(', ');

      // Build one interaction sentence per loop edge to explain why the loop exists
      const loopEdges = deps.filter(d => loopNodes.has(d.dependent) && loopNodes.has(d.dependsOn));
      const interactionParts = [];
      for (const edge of loopEdges) {
        const effA = remaining[edge.dependent]; // A depends on B
        const effB = remaining[edge.dependsOn]; // B influences A
        if (effA && effB) {
          const reason = getDependencyReason(effA, effB, allStates, realPerms);
          interactionParts.push(reason.split('\n\n')[0]);
        }
      }
      const interactionDesc = interactionParts.length > 0
        ? interactionParts.join(' ') + '\n\n'
        : '';

      const key = `Dependency loop: ${loopNames}: applied in timestamp order (CR 613.8).`;
      if (!log.includes(key)) {
        log.push(key);
        logReasons[key] =
          `A dependency loop (circular dependency) was detected among these effects: ${loopNames}.\n\n` +
          interactionDesc +
          `Each effect's outcome depends on the other(s), so the rules cannot establish a unique ordering.\n\n` +
          `CR 613.8 resolves this by applying all effects in the loop in timestamp order: the order their sources entered the battlefield (or were last affected by a spell or ability).`;
      }
    }

    if (cleaned.length > 0) {
      // Log dependencies discovered in this iteration (chains may span multiple iterations)
      for (const d of cleaned) {
        const depEff = remaining[d.dependent];
        const onEff  = remaining[d.dependsOn];
        const dd  = `"${depEff ? _effectDisplayName(depEff, allStates) : '?'}" depends on "${onEff ? _effectDisplayName(onEff, allStates) : '?'}"`;
        const key = `Dependency: ${dd}`;
        if (!log.includes(key)) {
          log.push(key);
          // Compute an explanation for the '?' popup in the layer inspector
          if (depEff && onEff) {
            logReasons[key] = getDependencyReason(depEff, onEff, allStates, realPerms);
          }
        }
      }
    }

    // Step 3: timestamp order
    const indexed = remaining.map((e, i) => ({ effect: e, idx: i }));
    indexed.sort((a, b) => a.effect.timestamp - b.effect.timestamp);

    // Step 4: first effect with no unresolved dependencies
    let chosen = null;
    let chosenIdx = -1;
    for (const { effect, idx } of indexed) {
      if (!cleaned.some(d => d.dependent === idx)) {
        chosen = effect;
        chosenIdx = remaining.indexOf(effect);
        break;
      }
    }

    if (!chosen) {
      // Fallback: all have deps  —  apply in timestamp order
      log.push('Fallback: remaining effects applied in timestamp order.');
      const sorted = [...remaining].sort((a, b) => a.timestamp - b.timestamp);
      for (const eff of sorted) {
        applyEffectGlobally(eff, allStates, realPerms, inspectedId, applicationLog, log, appliedSourceIds, abilityGroupAffectedPerms, abilityGroupRejectedPerms);
      }
      break;
    }

    // Step 5: remove chosen from remaining
    remaining.splice(chosenIdx, 1);

    // Step 6: apply chosen to ALL matching permanents
    applyEffectGlobally(chosen, allStates, realPerms, inspectedId, applicationLog, log, appliedSourceIds, abilityGroupAffectedPerms, abilityGroupRejectedPerms);

    // Step 7: loop  —  re-detect deps with fresh global state
  }

  if (remaining.length === 0 && log.length === 0) {
    log.push('No dependencies detected. Applied in timestamp order.');
  }

  return { log, logReasons, applicationLog };
}

/* Apply one effect to every matching permanent. Log changes for inspected. */
function applyEffectGlobally(effect, allStates, realPerms, inspectedId, applicationLog, log, appliedSourceIds, abilityGroupAffectedPerms, abilityGroupRejectedPerms) {
  // Source-viability: if source lost abilities (305.7 or REMOVE_ABILITIES), effect is dead
  // EXCEPTION: If this source already applied effects in an earlier layer, the entire ability
  // continues to apply even if the source lost its ability in a later layer (CR 613.7a).
  // This covers cases like Bello making an artifact into a creature (layer 4), then Bello
  // losing abilities (layer 6) — the artifact still gets the abilities and P/T from Bello.
  if (!isSourceViable(effect, allStates)) {
    const alreadyAppliedEarlier = appliedSourceIds && appliedSourceIds.has(effect.sourceId);
    // CDA_PT is an intrinsic ability: if the source lost ALL its abilities (via 305.7
    // OR a REMOVE_ABILITIES effect like Humility/Darksteel Mutation), the CDA no longer
    // exists and cannot define P/T — regardless of whether the source applied effects in
    // earlier layers. CR 613.7a's "already applied" exemption does not rescue a CDA whose
    // defining ability has been erased; there is simply nothing left to set P/T.
    const srcState = allStates.get(effect.sourceId);
    const is305_7 = srcState && srcState.abilitiesRemovedBy305_7;
    const abilitiesGone = is305_7 || !!(srcState && srcState.allAbilitiesRemoved);
    const cdaBlocked = effect.type === EFFECT_TYPE.CDA_PT && abilitiesGone;
    if (!alreadyAppliedEarlier || cdaBlocked) {
      const displayName = _effectDisplayName(effect, allStates);
      const reasonText = is305_7
        ? `Rule 305.7: "${displayName}" lost its abilities`
        : `"${displayName}" lost all abilities`;
      const effSrcIdSkip = _effectiveSourceId(effect, allStates);
      applicationLog.push({
        source: allStates.get(effSrcIdSkip)?.name || effect.sourceName,
        sourceId: effSrcIdSkip, timestamp: effect.timestamp,
        reason: `${reasonText} \u2014 effect no longer exists.`,
        changes: [],
      });
      log.push(`Skipped "${displayName}" \u2014 source lost abilities.`);
      return;
    }
  }

  let appliedAnywhere = false;
  let appliedToInspected = false;
  let inspectedChanges = [];

  // Context for exchange_text guard: tracks which exchange effects have already swapped
  const applyContext = { exchangeApplied: new Set() };

  for (const perm of realPerms) {
    const state = allStates.get(perm.id);
    if (!state) continue;

    // CR 613: If an earlier layer of this ability already rejected this permanent,
    // the rest of the ability does not apply to it either.
    if (abilityGroupRejectedPerms && effect.abilityGroupId &&
        abilityGroupRejectedPerms.get(effect.abilityGroupId)?.has(perm.id)) continue;

    if (!effectAppliesToPerm(effect, state, perm, perm.id, allStates, abilityGroupAffectedPerms)) {
      // Record the rejection so subsequent layers of this ability also skip this permanent.
      if (abilityGroupRejectedPerms && effect.abilityGroupId) {
        const alreadyAffected = abilityGroupAffectedPerms?.get(effect.abilityGroupId)?.has(perm.id);
        if (!alreadyAffected) {
          if (!abilityGroupRejectedPerms.has(effect.abilityGroupId)) {
            abilityGroupRejectedPerms.set(effect.abilityGroupId, new Set());
          }
          abilityGroupRejectedPerms.get(effect.abilityGroupId).add(perm.id);
        }
      }
      continue;
    }

    // For exchange text effects, attach allStates so the handler can swap between permanents
    if (effect.type === EFFECT_TYPE.TEXT_CHANGE &&
        (effect.params.changeType === 'exchange_text' || effect.params.changeType === 'volrath_text')) {
      effect._allStates = allStates;
    }

    // For exchange control effects, attach allStates so the handler can swap both permanents
    if (effect.type === EFFECT_TYPE.CONTROL && effect.params.exchangeControl) {
      effect._allStates = allStates;
    }

    // For "you control enchanted/equipped" aura effects, attach allStates so the handler
    // can resolve the current controller of the source dynamically (CR: "you" = current controller).
    if (effect.type === EFFECT_TYPE.CONTROL && effect.params.useSourceController) {
      effect._allStates = allStates;
    }

    // For GAIN_ACTIVATED_FROM_OTHERS, attach allStates so it can scan other permanents
    if (effect.type === EFFECT_TYPE.GAIN_ACTIVATED_FROM_OTHERS) {
      effect._allStates = allStates;
    }

    // For CDA_PT, attach allStates and cdaUserValue so the handler can compute
    if (effect.type === EFFECT_TYPE.CDA_PT) {
      effect._allStates = allStates;
      // Read user-supplied CDA value from the permanent's stored data
      const permObj = realPerms.find(p => p.id === perm.id);
      if (permObj && permObj.cdaUserValue !== undefined) {
        state.cdaUserValue = permObj.cdaUserValue;
      }
    }

    // For REMOVE_TYPE with devotion condition, attach allStates
    if (effect.type === EFFECT_TYPE.REMOVE_TYPE && effect.params.devotionCondition) {
      effect._allStates = allStates;
    }

    // For SET_PT with dynamic count, attach allStates
    if (effect.type === EFFECT_TYPE.SET_PT && effect.params.useCountOf !== undefined) {
      effect._allStates = allStates;
    }

    // For MODIFY_PT with "for each" variable boost, attach allStates
    if (effect.type === EFFECT_TYPE.MODIFY_PT && effect.params.forEachDesc !== undefined) {
      effect._allStates = allStates;
      const permObj = realPerms.find(p => p.id === perm.id);
      if (permObj && permObj.cdaUserValue !== undefined) {
        state.cdaUserValue = permObj.cdaUserValue;
      }
    }

    const changes = applyEffect(state, effect, applyContext);
    appliedAnywhere = true;

    // Track that this source has successfully applied effects (for cross-layer ability persistence)
    if (appliedSourceIds && effect.sourceId) {
      appliedSourceIds.add(effect.sourceId);
    }

    // CR 613: Track which permanents this ability group has affected.
    // Later effects in the same group will bypass the appliesTo filter for these permanents.
    if (abilityGroupAffectedPerms && effect.abilityGroupId) {
      if (!abilityGroupAffectedPerms.has(effect.abilityGroupId)) {
        abilityGroupAffectedPerms.set(effect.abilityGroupId, new Set());
      }
      abilityGroupAffectedPerms.get(effect.abilityGroupId).add(perm.id);
    }

    if (perm.id === inspectedId) {
      appliedToInspected = true;
      inspectedChanges = changes;
    }
  }

  // Resolve the effective source: accounts for text exchange (Exchange of Words) and
  // mutation (top card's name). After an exchange, the ability now lives on the other permanent.
  const effSrcId = _effectiveSourceId(effect, allStates);
  const computedSourceName = allStates.get(effSrcId)?.name || effect.sourceName;

  if (inspectedChanges.length > 0) {
    const displayName = _effectDisplayName(effect, allStates);
    applicationLog.push({
      source: computedSourceName, sourceId: effSrcId, timestamp: effect.timestamp,
      reason: effect.desc || `Effect from "${displayName}"`,
      changes: inspectedChanges,
    });
    log.push(`Applied "${displayName}" (ts:${effect.timestamp})`);
  } else if (appliedToInspected) {
    // Effect targets this permanent but produces no state change (e.g. CONTROL effect where
    // the permanent is already controlled by the correct player). Still show it in the inspector
    // so the user can see the Layer 2 effect is present even when it has no visible delta.
    const displayName = _effectDisplayName(effect, allStates);
    applicationLog.push({
      source: computedSourceName, sourceId: effSrcId, timestamp: effect.timestamp,
      reason: effect.desc || `Effect from "${displayName}"`,
      changes: [],
      appliedToInspected: true,
    });
    log.push(`Applied "${displayName}" (ts:${effect.timestamp})`);
  } else if (appliedAnywhere) {
    const displayName = _effectDisplayName(effect, allStates);
    applicationLog.push({
      source: computedSourceName, sourceId: effSrcId, timestamp: effect.timestamp,
      reason: `${effect.desc || displayName} (affected other permanents, not inspected)`,
      changes: [],
    });
    log.push(`Applied "${displayName}" (ts:${effect.timestamp}) — affected other permanents.`);
  } else {
    // Effect is in this layer but matched no permanents currently on the battlefield.
    // Still record it so "show all" mode can display it.
    const displayName = _effectDisplayName(effect, allStates);
    applicationLog.push({
      source: computedSourceName, sourceId: effSrcId, timestamp: effect.timestamp,
      reason: `${effect.desc || displayName} (no matching permanents)`,
      changes: [],
    });
    log.push(`Applied "${displayName}" (ts:${effect.timestamp}) — no matching permanents.`);
  }
}
/* [END: DEPENDENCY] */

/* [KEY: FOR-EACH-COMPUTE]  —  Auto-compute "for each" counts from battlefield state */
function _computeForEachCount(forEachDesc, allStates, selfState, effect) {
  // Resolve the SOURCE permanent's state for self-references like "counter on this creature".
  // When an effect says "for each counter on [source name]", selfState is the TARGET being
  // modified, but counters are on the SOURCE. Look up source state from allStates.
  const sourceState = (effect && effect.sourceId && allStates)
    ? (allStates.get(effect.sourceId) || selfState) : selfState;

  const desc = forEachDesc.toLowerCase().trim()
    .replace(/\s+you control$/, '')
    .replace(/\s+your opponents control$/, '')
    .replace(/\s+on the battlefield$/, '')
    .replace(/,?\s*to a maximum of \d+$/, '');

  // "supertype, card type, and subtype it has" — count type categories on the target itself (e.g. Embiggen)
  if (/\bit\s+has\b/.test(desc) && (/\bsupertype\b/.test(desc) || /\bcard\s+type\b/.test(desc) || /\bsubtype\b/.test(desc))) {
    let total = 0;
    if (/\bsupertype\b/.test(desc)) total += (selfState.supertypes || []).length;
    if (/\bcard\s+type\b/.test(desc)) total += (selfState.types || []).length;
    if (/\bsubtype\b/.test(desc)) {
      if (selfState.isAllCreatureTypes) {
        total += typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0
          ? TypeCatalog.creatureTypes.size : 50;
      } else {
        total += (selfState.subtypes || []).length;
      }
    }
    return total;
  }

  // Graveyard/exile counting: use Battlefield.gameState.graveyardCount when the
  // effect was flagged as graveyard-based (e.g. Lord of Extinction, Nighthowler).
  // The forEachDesc has already been cleaned of "in all graveyards" etc. by the parser.
  if (effect && effect.params && effect.params.isGraveyardCount) {
    if (typeof Battlefield !== 'undefined' && Battlefield.gameState) {
      return Battlefield.gameState.graveyardCount || 0;
    }
    return null; // fall back to user input
  }

  // "cards in hand" / "cards in all players' hands" — use gameState.handSize
  if (/\bcards?\s+in\s+.*\bhands?\b/.test(desc)) {
    if (typeof Battlefield !== 'undefined' && Battlefield.gameState) {
      return Battlefield.gameState.handSize || 0;
    }
    return null;
  }

  // "time you've cast your commander from the command zone this game" (Commander's Insignia, etc.)
  // Matches patterns like: "time you've cast your commander from the command zone"
  if (/\btimes?\s+you(?:'ve|'ve|\s+have)\s+cast\s+your\s+commander\b/.test(desc)) {
    if (typeof Battlefield !== 'undefined' && Battlefield.commanders) {
      let totalCasts = 0;
      for (const cmd of Battlefield.commanders) {
        totalCasts += (cmd.castCount || 0);
      }
      return totalCasts;
    }
    return null; // fall back to user input if no commander data
  }

  // "color among permanents" / "color among permanents you control"
  // Count distinct colors across all permanents on the battlefield
  if (/\bcolou?rs?\s+among\s+permanents?\b/.test(desc) || /\bcolou?r\s+among\s+permanents?\b/.test(desc)) {
    const distinctColors = new Set();
    for (const [, st] of allStates) {
      for (const c of (st.colors || [])) distinctColors.add(c);
    }
    return distinctColors.size;
  }

  // "its creature types" / "of its creature types"  —  count subtypes on the creature itself
  if (/\b(its|of its)\s+creature\s+types?\b/.test(desc)) {
    if (selfState.isAllCreatureTypes) {
      // Changeling: count = total creature types in the game (use TypeCatalog if available)
      return typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0
        ? TypeCatalog.creatureTypes.size : 50;
    }
    const creatureSubtypes = selfState.subtypes.filter(s => {
      if (typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0) {
        return TypeCatalog.creatureTypes.has(s);
      }
      return true; // assume all subtypes are creature types if catalog unavailable
    });
    return creatureSubtypes.length;
  }

  // Count by type/subtype across all permanents on the battlefield
  let count = 0;
  const _typeEntries = [
    ['artifact', 'Artifact'], ['creature', 'Creature'], ['enchantment', 'Enchantment'],
    ['land', 'Land'], ['planeswalker', 'Planeswalker'],
  ];
  const TYPE_MAP = Object.fromEntries([
    ..._typeEntries.flatMap(([k, v]) => { const fn = (st) => st.types.includes(v); return [[k, fn], [k + 's', fn]]; }),
    ['permanent', () => true], ['permanents', () => true],
  ]);

  // Fix 11: Handle supertype + type combos: "snow permanent", "snow creature", "legendary creature", etc.
  const SUPERTYPE_MAP = {
    'snow': 'Snow', 'legendary': 'Legendary', 'basic': 'Basic', 'world': 'World',
  };
  for (const [stWord, stVal] of Object.entries(SUPERTYPE_MAP)) {
    // "snow permanents" / "snow permanent"
    if (desc === stWord + ' permanent' || desc === stWord + ' permanents') {
      for (const [, st] of allStates) { if (st.supertypes.includes(stVal)) count++; }
      return count;
    }
    // "snow creatures" / "snow lands" etc.
    for (const [typeWord, typeChecker] of Object.entries(TYPE_MAP)) {
      if (desc === stWord + ' ' + typeWord) {
        for (const [, st] of allStates) { if (st.supertypes.includes(stVal) && typeChecker(st)) count++; }
        return count;
      }
    }
  }

  // Check if desc matches a simple type: "artifact", "creature", etc.
  const typeChecker = TYPE_MAP[desc];
  if (typeChecker) {
    for (const [, st] of allStates) { if (typeChecker(st)) count++; }
    return count;
  }

  // Fix 19: Handle "and/or" and "or" compound types: "artifact and/or enchantment", "creature or planeswalker"
  const andOrParts = desc.split(/\s+and\/or\s+|\s+or\s+/);
  if (andOrParts.length > 1) {
    const checkers = andOrParts.map(p => TYPE_MAP[p.trim()]).filter(Boolean);
    if (checkers.length === andOrParts.length) {
      // All parts are recognized types — count permanents matching ANY
      for (const [, st] of allStates) {
        if (checkers.some(fn => fn(st))) count++;
      }
      return count;
    }
  }

  // Check for "[subtype] [type]" e.g. "merfolk you control", "zombie creature", "elf creatures"
  const words = desc.split(/\s+/);
  const IRREGULAR_PLURAL_MAP_LOCAL = {
    'elves': 'Elf', 'dwarves': 'Dwarf', 'wolves': 'Wolf', 'werewolves': 'Werewolf',
    'allies': 'Ally', 'faeries': 'Faerie', 'zombies': 'Zombie', 'harpies': 'Harpy',
    'valkyries': 'Valkyrie', 'gargoyles': 'Gargoyle', 'fungi': 'Fungus',
    'oxen': 'Ox', 'mice': 'Mouse', 'geese': 'Goose',
  };
  function _singularize(s) {
    if (IRREGULAR_PLURAL_MAP_LOCAL[s]) return IRREGULAR_PLURAL_MAP_LOCAL[s];
    const cap = s.charAt(0).toUpperCase() + s.slice(1);
    if (s.endsWith('s') && s.length > 2) return s.charAt(0).toUpperCase() + s.slice(1, -1);
    return cap;
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const typeCheck = TYPE_MAP[w];
    if (typeCheck) {
      // Words before this are subtype qualifiers
      const subtypeWords = words.slice(0, i);
      if (subtypeWords.length > 0) {
        const subtype = subtypeWords.map(s => _singularize(s)).join(' ');
        for (const [, st] of allStates) {
          if (typeCheck(st) && (st.subtypes.includes(subtype) || st.isAllCreatureTypes)) count++;
        }
        return count;
      }
    }
  }

  // --- Counter patterns (checked BEFORE bare subtype to avoid changeling false positives) ---

  // Specific counter type on self: "+1/+1 counters on it" / "+1/+1 counter on this card"
  const selfCounterMatch = desc.match(/([+-]\d+\/[+-]\d+)\s+counters?\s+on\s+(.+)/);
  if (selfCounterMatch) {
    const counterType = selfCounterMatch[1];
    const selfRef = selfCounterMatch[2].trim();
    // If the "on X" target is a known self-reference, count specific counter type on SOURCE
    if (/^(it|this creature|this permanent|this card|this token)$/.test(selfRef)) {
      return (sourceState.counters && sourceState.counters[counterType]) || 0;
    }
    // "+1/+1 counters on creatures" -- count across all matching permanents
    if (/creatures?/.test(selfRef)) {
      for (const [, st] of allStates) {
        count += (st.counters && st.counters[counterType]) || 0;
      }
      return count;
    }
    // Fallback for "+1/+1 counter on [card name]" etc -- treat as source
    return (sourceState.counters && sourceState.counters[counterType]) || 0;
  }

  // Generic "counters on it/self" (any counter type): "counters on it", "counter on this creature"
  if (/counters?\s+on\s+(it|this creature|this permanent|this card|this token)\b/.test(desc)) {
    let total = 0;
    for (const [cType, cCount] of Object.entries(sourceState.counters || {})) {
      total += cCount;
    }
    return total;
  }

  // Broader "counter on [anything]" -- if desc contains "counter(s) on", treat as source-targeting
  if (/counters?\s+on\s+/.test(desc)) {
    let total = 0;
    for (const [cType, cCount] of Object.entries(sourceState.counters || {})) {
      total += cCount;
    }
    return total;
  }

  // Generic "[type] counters" across all permanents (e.g. "+1/+1 counters")
  const genericCounterMatch = desc.match(/([+-]\d+\/[+-]\d+)\s+counters?/);
  if (genericCounterMatch) {
    const counterType = genericCounterMatch[1];
    for (const [, st] of allStates) {
      count += (st.counters && st.counters[counterType]) || 0;
    }
    return count;
  }

  // "Aura and Equipment attached to it" — count permanents of specified subtypes/types
  // that are attached (equipped/enchanting) to the target creature (selfState).
  // Used by cards like Mantle of the Ancients: "gets +1/+1 for each Aura and Equipment attached to it."
  const attachedMatch = desc.match(/^(.+?)\s+attached\s+to\s+(?:it|this creature|this permanent|this card)\s*$/);
  if (attachedMatch) {
    const thingDesc = attachedMatch[1].trim();
    if (typeof Battlefield !== 'undefined' && Battlefield.effects) {
      // Find the ID of the creature that things are attached to (= the boost target / selfState).
      let creatureId = null;
      if (effect) {
        creatureId = effect.targetId || (effect.selfTarget ? effect.sourceId : null);
      }
      if (!creatureId && allStates) {
        for (const [id, st] of allStates) {
          if (st === selfState) { creatureId = id; break; }
        }
      }
      if (creatureId) {
        // Gather sourceIds of all effects targeting this creature (things attached to it).
        const attachedSourceIds = new Set();
        for (const eff of Battlefield.effects) {
          if (eff.targetId === creatureId && !eff.selfTarget && eff.sourceId !== creatureId) {
            attachedSourceIds.add(eff.sourceId);
          }
        }
        // Split "aura and equipment" into parts to match by subtype or type.
        const parts = thingDesc.split(/\s+and\s+|\s+or\s+/).map(s => s.trim()).filter(Boolean);
        count = 0;
        for (const srcId of attachedSourceIds) {
          const srcState = allStates.get(srcId);
          if (!srcState) continue;
          for (const part of parts) {
            const subCap = part.charAt(0).toUpperCase() + part.slice(1);
            const subSing = _singularize(part);
            const tCheck = TYPE_MAP[part];
            if ((tCheck && tCheck(srcState)) ||
                srcState.subtypes.includes(subCap) ||
                srcState.subtypes.includes(subSing)) {
              count++;
              break; // matched one part — avoid double-counting this permanent
            }
          }
        }
        return count;
      }
    }
  }

  // --- Bare subtype: "merfolk", "goblin", "elves", "humans", etc. ---
  const irregularLookup = IRREGULAR_PLURAL_MAP_LOCAL[desc];
  const subtype = irregularLookup || (desc.charAt(0).toUpperCase() + desc.slice(1));
  // Also try without trailing 's'
  const subtypeSingular = _singularize(desc);
  // Guard: skip bare subtype check if desc contains counter/non-subtype words
  if (!/\bcounters?\b|\bon\b/.test(desc)) {
    for (const [, st] of allStates) {
      if (st.subtypes.includes(subtype) || st.subtypes.includes(subtypeSingular) || st.isAllCreatureTypes) count++;
    }
    if (count > 0) return count;
  }

  return null; // couldn't auto-compute; fall back to user input
}

/* [KEY: DEVOTION-COMPUTE]  —  Compute devotion from mana costs of permanents on battlefield */
function _computeDevotionCounts(allStates, controller) {
  const devotion = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  const colorMap = { W: 'W', U: 'U', B: 'B', R: 'R', G: 'G' };
  for (const [, st] of allStates) {
    if (controller && st.controller !== controller) continue;
    const cost = st.manaCost || '';
    for (const ch of cost) {
      if (colorMap[ch]) devotion[ch]++;
    }
  }
  return devotion;
}
/* [END: FOR-EACH-COMPUTE] */

/* Helper: apply bestow at end of Layer 4 (CR 702.102).
   When a bestow creature has an active bestow target, it loses Creature type,
   loses creature subtypes, retains Enchantment, gains Aura subtype,
   and gains "Enchant creature" ability. */
function _applyBestowLayer4(Battlefield, allStates, inspectedId, layerResult) {
  if (typeof Battlefield === 'undefined' || !Battlefield.bestowTargets || !Battlefield.bestowTargets.size) return;
  for (const [bestowPermId, targetPermId] of Battlefield.bestowTargets) {
    const st = allStates.get(bestowPermId);
    if (!st) continue;
    const targetPerm = Battlefield.permanents && Battlefield.permanents.find(p => p.id === targetPermId);
    if (!targetPerm) continue; // target gone — bestow reverts (skip)

    const beforeTypes = [...st.types];
    const beforeSubtypes = [...st.subtypes];
    const beforeAbilities = [...st.abilities];

    // Remove Creature type
    const creatureIdx = st.types.indexOf('Creature');
    if (creatureIdx >= 0) st.types.splice(creatureIdx, 1);

    // Ensure Enchantment type is present
    if (!st.types.includes('Enchantment')) st.types.push('Enchantment');

    // Remove creature subtypes (CR 702.102: loses all creature types)
    const creatureSubtypes = (typeof TypeCatalog !== 'undefined') ? TypeCatalog.creatureTypes : new Set();
    st.subtypes = st.subtypes.filter(s => !creatureSubtypes.has(s));

    // Add Aura subtype if not present
    if (!st.subtypes.includes('Aura')) st.subtypes.push('Aura');

    // Add "Enchant creature" ability if not present
    if (!st.abilities.some(a => /^enchant creature$/i.test(a))) {
      st.abilities.push('Enchant creature');
    }

    if (bestowPermId === inspectedId) {
      const targetName = targetPerm.name || targetPermId;
      const changes = [];
      if (JSON.stringify(beforeTypes) !== JSON.stringify(st.types)) {
        changes.push('Types: [' + beforeTypes.join(', ') + '] → [' + st.types.join(', ') + ']');
      }
      if (JSON.stringify(beforeSubtypes) !== JSON.stringify(st.subtypes)) {
        changes.push('Subtypes: [' + beforeSubtypes.join(', ') + '] → [' + st.subtypes.join(', ') + ']');
      }
      const addedAbs = st.abilities.filter(a => !beforeAbilities.includes(a));
      if (addedAbs.length) changes.push('Gained abilities: ' + addedAbs.join('; '));
      changes.push('P/T cleared (no longer a creature).');
      layerResult.applicationLog.push({
        source: 'Bestow (enchanting ' + targetName + ')',
        timestamp: Battlefield.permanents.find(p => p.id === bestowPermId)?.timestamp || 0,
        reason: 'CR 702.102: While enchanting a creature via bestow, this card is an Aura enchantment, not a creature. It loses all creature subtypes and gains "Enchant creature".',
        changes,
      });
    }
  }
}

/* Apply Crew trait at Layer 4 (CR 702.122): permanents with the Crewed trait become artifact creatures.
   Both Artifact and Creature are added — for a normal vehicle this is a no-op for Artifact,
   but if a non-artifact permanent gets crewed (via shenanigans) it gains both types. */
function _applyCrewLayer4(allStates, allPermanents, inspectedId, layerResult) {
  for (const perm of (allPermanents || [])) {
    const st = allStates.get(perm.id);
    if (!st) continue;
    if (!(st.traits || []).includes('Crewed')) continue;
    const addedTypes = [];
    if (!st.types.includes('Artifact')) { st.types.push('Artifact'); addedTypes.push('Artifact'); }
    if (!st.types.includes('Creature')) { st.types.push('Creature'); addedTypes.push('Creature'); }
    if (addedTypes.length && perm.id === inspectedId && layerResult) {
      layerResult.applicationLog.push({
        source: 'Crew (crewed trait)',
        timestamp: perm.timestamp,
        reason: 'CR 702.122: A crewed Vehicle becomes an artifact creature until end of turn.',
        changes: [`Added type${addedTypes.length > 1 ? 's' : ''}: ${addedTypes.join(', ')}`],
      });
    }
  }
}

/* Helper: apply mutate stacks within Layer 1 (after COPY effects).
   CR 702.140: Top card's name/types/P/T are authoritative; ability pools merged.
   Called from both the "has effects" and "no effects" paths of Layer 1. */
function _applyMutateLayer1(Battlefield, allStates, inspectedId, layerResult) {
  if (typeof Battlefield === 'undefined' || !Battlefield.mutateStacks || !Battlefield.mutateStacks.length) return;
  for (const stack of Battlefield.mutateStacks) {
    if (stack.length < 2) continue;
    const topState = allStates.get(stack[0]);
    if (!topState) continue;

    const topName = topState.name;
    const topTypes = [...topState.types];
    const topSupertypes = [...topState.supertypes];
    const topSubtypes = [...topState.subtypes];
    const topPower = topState.power;
    const topToughness = topState.toughness;

    const mergedAbilities = [];
    const seen = new Set();
    for (const permId of stack) {
      const st = allStates.get(permId);
      if (!st) continue;
      for (const ab of st.abilities) {
        const abL = ab.toLowerCase().trimStart();
        const allowDup = /^(?:at|when|whenever)\b/.test(abL) ||
          /\bat the beginning\b|\bwhenever\b|\bwhen you do\b/i.test(abL) ||
          /^ward\b/i.test(ab);
        if (allowDup || !seen.has(ab)) { seen.add(ab); mergedAbilities.push(ab); }
      }
    }

    for (const permId of stack) {
      const st = allStates.get(permId);
      if (!st) continue;
      const beforeName = st.name;
      const beforeAbilities = [...st.abilities];
      st.name = topName;
      st.types = [...topTypes];
      st.supertypes = [...topSupertypes];
      st.subtypes = [...topSubtypes];
      st.power = topPower;
      st.toughness = topToughness;
      st.abilities = [...mergedAbilities];
      // Also sync oracleText to the merged abilities so Layer 3 text-change effects
      // that target any member of this stack operate on the full merged ability pool.
      st.oracleText = mergedAbilities.join('\n');

      if (permId === inspectedId) {
        const topPerm = Battlefield.permanents.find(p => p.id === stack[0]);
        const stackNames = stack.map(id => {
          const p = Battlefield.permanents.find(pp => pp.id === id);
          return p ? p.name : id;
        });
        const changes = [];
        if (beforeName !== st.name) changes.push('Name: "' + beforeName + '" \u2192 "' + st.name + '"');
        const addedAbs = mergedAbilities.filter(a => !beforeAbilities.includes(a));
        if (addedAbs.length) changes.push('Gained abilities from stack: ' + addedAbs.join('; '));
        layerResult.applicationLog.push({
          source: 'Mutate Stack (' + stackNames.join(' / ') + ')',
          timestamp: topPerm ? topPerm.timestamp : 0,
          reason: 'CR 702.140: Top card\u2019s name/types/P/T are used; all abilities in the stack are merged. Stack order (top\u2192bottom): ' + stackNames.join(', ') + '.',
          changes,
        });
      }
    }
  }
}

/* [KEY: EVALUATE]  —  Full GLOBAL evaluation pipeline.
   Builds states for ALL permanents, then applies effects layer-by-layer
   across the entire battlefield. Returns result for the inspected permanent. */
function evaluatePermanent(permanent, allPermanents, allEffects, inspectedId) {
  // Build mutable states for ALL real permanents
  const allStates = new Map();
  for (const p of allPermanents) {
    if (p.isManualEffect) continue;
    allStates.set(p.id, createBaseState(p));
  }

  // Mutate is applied at the end of Layer 1, after COPY effects.
  // See _applyMutateInLayer1 below.

  const result = {
    base: allStates.has(inspectedId) ? snapshotState(allStates.get(inspectedId)) : createBaseState(permanent),
    layers: [],
  };

  // Working copy of effects  —  may be mutated after Layer 3 text changes
  // Shallow-copy each effect object so mutations (bestow redirect, text-change) don't affect originals
  // Filter out disabled modal effects (user toggled off), then shallow-copy
  // For repeatable modal modes, duplicate effects per their mode count
  let workingEffects = [];
  for (const e of allEffects) {
    if (e.disabled) continue;
    if (e.modalModeIndex !== undefined) {
      const srcPerm = allPermanents.find(p => p.id === e.sourceId);
      if (srcPerm && srcPerm.modalRepeatable && srcPerm.modalModeCounts) {
        const count = srcPerm.modalModeCounts[e.modalModeIndex] ?? 0;
        for (let i = 0; i < count; i++) workingEffects.push({ ...e });
        continue;
      }
    }
    workingEffects.push({ ...e });
  }

  // Set "Equipped" / "Enchanted" traits on targeted permanents based on source type
  const permById = new Map();
  for (const p of allPermanents) { if (!p.isManualEffect) permById.set(p.id, p); }

  // BESTOW (CR 702.102): Redirect bestow card's self-targeting effects to the enchanted creature.
  // The bestow card's effects were parsed as creature effects (selfTarget: true, no targetId).
  // When bestowed, they should apply to the enchanted creature, like an Aura's effects.
  if (typeof Battlefield !== 'undefined' && Battlefield.bestowTargets && Battlefield.bestowTargets.size) {
    for (const [bestowPermId, targetPermId] of Battlefield.bestowTargets) {
      if (!permById.get(targetPermId)) continue;
      const targetState = allStates.get(targetPermId);
      if (!targetState) continue;
      // Add "Enchanted" trait to the bestow target
      if (!targetState.traits.includes('Enchanted')) targetState.traits.push('Enchanted');
      // Redirect this bestow perm's self-targeting effects to the enchanted creature.
      // Counter effects (_isCounterEffect) are NOT redirected: counters stay on the card
      // they're placed on, so a bestowed card's +1/+1 counters apply only to itself
      // (which has no P/T as an Aura), not to the enchanted creature.
      for (const eff of workingEffects) {
        if (eff.sourceId !== bestowPermId) continue;
        if (eff._isCounterEffect) continue; // counters stay on the bestow card
        if (eff.selfTarget || (!eff.targetId && eff.scope === 'targeted')) {
          eff.selfTarget = false;
          eff.targetId = targetPermId;
        }
      }
    }
  }

  // MUTATE (CR 702.140): In a mutate stack, all cards are treated as one permanent.
  // (a) Counters on any non-top card redirect to the top card.
  // (b) External effects (equipment/aura/other) targeting a non-top card redirect to the top card.
  if (typeof Battlefield !== 'undefined' && Battlefield.mutateStacks && Battlefield.mutateStacks.length) {
    for (const stack of Battlefield.mutateStacks) {
      if (stack.length < 2) continue;
      const topId = stack[0];
      for (let i = 1; i < stack.length; i++) {
        const nonTopId = stack[i];
        for (const eff of workingEffects) {
          if (eff.sourceId === nonTopId) {
            // Effect originates FROM a non-top card
            if (!eff._isCounterEffect) continue;
            // Redirect own counter effects to the top card
            eff.selfTarget = false;
            eff.targetId = topId;
          } else if (eff.targetId === nonTopId) {
            // External effect targeting a non-top card — redirect to top (CR 702.140).
            // Exception: TEXT_CHANGE effects remain targeting their original permanent;
            // effectAppliesToPerm applies them to all stack members (Bug 1 fix).
            if (eff.type !== EFFECT_TYPE.TEXT_CHANGE) {
              eff.targetId = topId;
            }
          }
        }
      }
    }
  }


  // RECONFIGURE (CR 702.151): When a permanent with reconfigure is attached to a creature
  // (has a targeted effect with a targetId set), it stops being a creature.
  // Inject a self-targeting REMOVE_TYPE effect to remove the Creature type.
  const reconfigureSourceIds = new Set();
  for (const eff of workingEffects) {
    if (!eff.targetId || eff.selfTarget) continue;
    if (reconfigureSourceIds.has(eff.sourceId)) continue;
    const sourcePerm = permById.get(eff.sourceId);
    if (!sourcePerm) continue;
    if (!(sourcePerm.printedSubtypes || []).includes('Equipment')) continue;
    // Check if this source has reconfigure in its abilities
    const hasReconfigure = (sourcePerm.oracleText || '').toLowerCase().includes('reconfigure');
    if (!hasReconfigure) continue;
    reconfigureSourceIds.add(eff.sourceId);
    // Inject a REMOVE_TYPE effect for Creature on the reconfigure source itself
    workingEffects.push({
      id: `${eff.sourceId}_reconfigure_remove_creature`,
      sourceId: eff.sourceId,
      sourceName: sourcePerm.name,
      type: EFFECT_TYPE.REMOVE_TYPE,
      layer: '4',
      params: { types: ['Creature'] },
      scope: 'targeted',
      selfTarget: true,
      timestamp: sourcePerm.timestamp,
      _isReconfigureEffect: true,
    });
  }

  for (const eff of workingEffects) {
    if (!eff.targetId || eff.selfTarget) continue;
    const sourcePerm = permById.get(eff.sourceId);
    if (!sourcePerm) continue;
    const targetState = allStates.get(eff.targetId);
    if (!targetState) continue;
    const srcSubs = sourcePerm.printedSubtypes || [];
    if (srcSubs.includes('Equipment') && !targetState.traits.includes('Equipped')) {
      targetState.traits.push('Equipped');
    }
    if (srcSubs.includes('Aura') && !targetState.traits.includes('Enchanted')) {
      targetState.traits.push('Enchanted');
    }
  }
  // Also update result.base if the inspected perm is targeted
  const inspectedBase = allStates.get(inspectedId);
  if (inspectedBase) {
    result.base.traits = [...inspectedBase.traits];
  }

  // (Exchange guard is now handled via context in applyEffectGlobally, not effect mutation)

  // Track which source IDs have successfully applied effects in earlier layers.
  // If an ability caused an earlier-layer change, all effects from that ability
  // continue to apply even if the source loses its abilities in a later layer.
  const appliedSourceIds = new Set();

  // CR 613: Track which permanents each ability group has affected or rejected.
  // Once any part of a continuous effect applies to a permanent, all other parts also apply.
  // Once any part fails to apply to a permanent, later parts also do not apply.
  const abilityGroupAffectedPerms = new Map(); // abilityGroupId → Set<permId>
  const abilityGroupRejectedPerms = new Map(); // abilityGroupId → Set<permId> rejected in earlier layers

  for (const layerDef of LAYERS) {
    const layerResult = {
      id: layerDef.id,
      name: layerDef.name,
      cr: layerDef.cr,
      active: layerDef.active,
      effects: [],
      orderLog: [],
      orderLogReasons: {},
      applicationLog: [],
      stateBefore: snapshotState(allStates.get(inspectedId)),
      stateAfter: null,
    };

    if (!layerDef.active) {
      layerResult.stateAfter = snapshotState(allStates.get(inspectedId));
      layerResult.orderLog.push('(Layer not yet active in MVP)');
      result.layers.push(layerResult);
      continue;
    }

    // ALL effects in this layer  —  do NOT pre-filter by applicability.
    const layerEffects = workingEffects.filter(e => e.layer === layerDef.id);

    // At the start of Layer 4, sync hasChangeling from current ability state.
    // isAllCreatureTypes is now set by the Changeling ADD_TYPE effect generated
    // in parseCardEffects(), so we don't initialize it here.
    if (layerDef.id === '4') {
      for (const [pid, st] of allStates) {
        st.hasChangeling = st.abilities.some(a => /\bchangeling\b/i.test(a));
      }
    }

    if (layerEffects.length === 0) {
      // For Layer 1, still apply mutate even if no COPY effects exist
      if (layerDef.id === '1') {
        _applyMutateLayer1(Battlefield, allStates, inspectedId, layerResult);
      }
      // For Layer 4, apply bestow/crew even if no other type effects exist
      if (layerDef.id === '4') {
        _applyBestowLayer4(Battlefield, allStates, inspectedId, layerResult);
        _applyCrewLayer4(allStates, allPermanents, inspectedId, layerResult);
      }
      layerResult.stateAfter = snapshotState(allStates.get(inspectedId));
      if (!layerResult.applicationLog.length) {
        layerResult.orderLog.push('No effects exist in this layer.');
      }
      result.layers.push(layerResult);
      // Post-Layer-3 re-parse
      if (layerDef.id === '3') {
        workingEffects = _reParseAfterTextChange(allStates, allPermanents, workingEffects);
      }
      continue;
    }

    // Apply with full CR 613.8 global dependency resolution
    const { log, logReasons, applicationLog } = applyLayerGlobal(
      layerEffects, allStates, allPermanents, inspectedId, appliedSourceIds, abilityGroupAffectedPerms, abilityGroupRejectedPerms
    );
    layerResult.orderLog = log;
    layerResult.orderLogReasons = logReasons;
    layerResult.applicationLog = applicationLog;

    // MUTATE (CR 702.140): Applied at end of Layer 1, after COPY effects.
    if (layerDef.id === '1') {
      _applyMutateLayer1(Battlefield, allStates, inspectedId, layerResult);
    }

    // BESTOW (CR 702.102): Applied at end of Layer 4, after other type effects.
    // CREW (CR 702.122): Crewed vehicles gain Creature type at Layer 4.
    if (layerDef.id === '4') {
      _applyBestowLayer4(Battlefield, allStates, inspectedId, layerResult);
      _applyCrewLayer4(allStates, allPermanents, inspectedId, layerResult);
    }

    // After Layer 2 (Control), write computed controller back to permanent objects
    // so subsequent getAllFinalStates calls and UI rendering see the updated controller.
    if (layerDef.id === '2' && typeof Battlefield !== 'undefined') {
      for (const [pid, st] of allStates) {
        const perm = Battlefield.permanents.find(p => p.id === pid);
        if (perm && perm.controller !== st.controller) {
          perm.controller = st.controller;
        }
      }
    }

    layerResult.stateAfter = snapshotState(allStates.get(inspectedId));
    result.layers.push(layerResult);

    // After Layer 3 (Text), re-parse effects from permanents whose text was modified.
    // This implements the "refactoring" behavior: changed text → changed effects.
    if (layerDef.id === '3') {
      workingEffects = _reParseAfterTextChange(allStates, allPermanents, workingEffects);
    }
  }

  result.final = snapshotState(allStates.get(inspectedId));

  // Evaluate which conditional abilities have their conditions met
  // so the UI can show them as active/inactive
  const finalState = result.final;
  if (finalState.conditionalAbilityConditions && finalState.conditionalAbilityConditions.size > 0) {
    const metSet = new Set();
    const inspState = allStates.get(inspectedId);
    for (const [idx, condFn] of finalState.conditionalAbilityConditions) {
      try {
        if (condFn(inspState, allStates)) metSet.add(idx);
      } catch(e) { /* condition eval failed, leave as unmet */ }
    }
    result.final.conditionalAbilitiesMet = metSet;
    result.base.conditionalAbilitiesMet = metSet;
    // Propagate to layer stateAfter snapshots
    for (const layer of result.layers) {
      if (layer.stateAfter) layer.stateAfter.conditionalAbilitiesMet = metSet;
    }
  }

  return result;
}

/* After Layer 3 text changes, re-parse effects from modified permanents.
   Replaces effects in layers 4+ from those sources with freshly-parsed ones. */
function _reParseAfterTextChange(allStates, allPermanents, currentEffects) {
  const modifiedSources = new Set();
  for (const [id, state] of allStates) {
    if (state.oracleTextModified) modifiedSources.add(id);
  }
  if (modifiedSources.size === 0) return currentEffects;

  // Collect targetId from removed effects so re-parsed effects inherit the same target.
  // An Aura like Living Terrain has its targetId set by the UI when the user picks
  // the enchanted permanent.  Re-parsing produces fresh effects with no targetId,
  // which makes them silently stop applying.
  const removedTargetIds = new Map(); // sourceId → targetId
  for (const eff of currentEffects) {
    if (modifiedSources.has(eff.sourceId) && !['1', '2', '3'].includes(eff.layer) &&
        eff.scope === 'targeted' && eff.targetId && !eff.selfTarget) {
      removedTargetIds.set(eff.sourceId, eff.targetId);
    }
  }

  // When an exchange-text permanent is part of a mutate stack, other stack members contribute
  // abilities to the same "permanent" — their text box was also exchanged away. Remove their
  // Layer 4+ effects too (without re-parsing them with stale text).
  const stackSiblingRemoveSources = new Set();
  for (const id of modifiedSources) {
    const state = allStates.get(id);
    if (state && state.textExchangedTo != null &&
        typeof Battlefield !== 'undefined' && Battlefield.getStack) {
      const stack = Battlefield.getStack(id);
      if (stack) {
        for (const memberId of stack) {
          if (memberId !== id && !modifiedSources.has(memberId)) {
            stackSiblingRemoveSources.add(memberId);
          }
        }
      }
    }
  }

  const updated = [];
  for (const eff of currentEffects) {
    const inModified = modifiedSources.has(eff.sourceId);
    const inSibling = stackSiblingRemoveSources.has(eff.sourceId);
    if ((!inModified && !inSibling) || ['1', '2', '3'].includes(eff.layer)) {
      updated.push(eff);
    }
    // Preserve CDA_PT, SWITCH_PT, and counter effects  —  not text-dependent
    else if ((inModified || inSibling) &&
             (eff.type === EFFECT_TYPE.CDA_PT || eff.type === EFFECT_TYPE.SWITCH_PT || eff._isCounterEffect)) {
      updated.push(eff);
    }
  }

  for (const id of modifiedSources) {
    const state = allStates.get(id);
    const perm = allPermanents.find(p => p.id === id);
    if (!perm || !state) continue;

    const fakeCard = {
      name: state.name,
      oracle_text: state.oracleText,
      type_line: perm.scryfallData?.type_line || [...state.supertypes, ...state.types].join(' ') + (state.subtypes.length ? ' \u2014 ' + state.subtypes.join(' ') : ''),
      colors: state.colors,
      cmc: state.manaValue,
    };
    // Re-parse modified text. Known abilities are matched by ability text (not card name),
    // so they will correctly match abilities in the modified/copied oracle text.
    if (typeof parseCardEffects === 'function') {
      const savedTargetId = removedTargetIds.get(id);
      const newEffects = parseCardEffects(perm, fakeCard);
      for (const ne of newEffects) {
        if (!['1', '2', '3'].includes(ne.layer)) {
          // Carry over the targetId from the original effects so the re-parsed
          // effects continue to apply to the same permanent (e.g. enchanted land).
          if (savedTargetId && ne.scope === 'targeted' && !ne.selfTarget && !ne.targetId) {
            ne.targetId = savedTargetId;
          }
          // Mark as re-parsed so _effectiveSourceId doesn't remap via textExchangedTo —
          // re-parsed effects already have the correct sourceId for the current text carrier.
          ne._reparsedEffect = true;
          updated.push(ne);
        }
      }
    }
  }

  return updated;
}
/* [END: EVALUATE] */
