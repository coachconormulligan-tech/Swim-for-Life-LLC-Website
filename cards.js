/* ============================================================
   MTG Layer Inspector  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  cards.js
   Scryfall API integration, card parsing, permanent creation.
   [KEY: SCRYFALL]       ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  API search (cards + tokens)
   [KEY: PARSE]          ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Oracle text ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ effects
   [KEY: PERMANENT]      ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Permanent object factory
   [KEY: BATTLEFIELD]    ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Global battlefield state
   ============================================================ */

/* Parse English number words to integers for limit detection. */
function _parseWordNumber(word) {
  const map = { once: 1, twice: 2, thrice: 3, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const n = map[word.toLowerCase()];
  if (n) return n;
  const parsed = parseInt(word, 10);
  return isNaN(parsed) ? 1 : parsed;
}

/* For triggered/activated abilities, "this creature"/"it" parsed as selfTarget
   gets converted to an untargeted targeted effect by the spell post-processor.
   Pin those effects back to the source permanent so they auto-apply without a dropdown. */
function _pinAbilityEffectsToSource(effects, sourcePermId) {
  for (const eff of effects) {
    if (eff.scope === 'targeted' && !eff.selfTarget && !eff.targetId && (!eff.targetIds || eff.targetIds.length === 0)) {
      // Don't auto-pin effects that have a target restriction (e.g. "target Cat you control",
      // "target creature") — these need the user to pick a target via the dropdown.
      if (eff.targetRestriction) continue;
      eff.targetId = sourcePermId;
      eff._autoTargetSource = true; // suppress target dropdown in UI
    }
  }
}

/* Generate an Excel-style label string from a 0-based index within a duplicate-name group.
   0→A, 1→B, …, 25→Z, 26→AA, 27→AB, …, 701→ZZ, 702→AAA, … */
function _permLabelString(n) {
  let s = '';
  let v = n + 1; // make 1-based
  while (v > 0) {
    v--;
    s = String.fromCharCode(65 + (v % 26)) + s;
    v = Math.floor(v / 26);
  }
  return s;
}

/* [KEY: BATTLEFIELD]  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Global state */
const Battlefield = {
  permanents: [],
  effects: [],
  nextTimestamp: 1,
  inspectedId: null,
  explanationMode: 'teaching', // 'teaching' | 'rules'

  // Multiplayer: array of player objects. Default single player is 'player_0'.
  players: [
    {
      id: 'player_0',
      name: 'Player 1',
      gameState: {
        handSize: 7,
        drawsThisTurn: 0,
        graveyardCount: 0,
        startingLife: 20,
        currentLife: 20,
        isYourTurn: true,
        customCounters: {},
      },
      commanders: [],
      graveyard: [],
      emblems: [],
    },
  ],
  activePlayerId: 'player_0',
  nextPlayerId: 1,

  // Game state: getter/setter routes to active player's gameState
  get gameState() { return this.getActivePlayer().gameState; },
  set gameState(val) { this.getActivePlayer().gameState = val; },

  // Player management
  getPlayer(id) { return this.players.find(p => p.id === id); },
  getActivePlayer() { return this.getPlayer(this.activePlayerId) || this.players[0]; },

  addPlayer(name) {
    const id = 'player_' + (this.nextPlayerId++);
    const player = {
      id,
      name: name || 'Player ' + this.nextPlayerId,
      gameState: {
        handSize: 7,
        drawsThisTurn: 0,
        graveyardCount: 0,
        startingLife: 20,
        currentLife: 20,
        isYourTurn: false,
        customCounters: {},
      },
      commanders: [],
      graveyard: [],
      emblems: [],
    };
    this.players.push(player);
    return player;
  },

  removePlayer(id) {
    if (id === 'player_0') return; // cannot remove default player
    this.players = this.players.filter(p => p.id !== id);
    // Remove all permanents and effects owned by this player
    this.effects = this.effects.filter(e => e.ownerId !== id);
    this.permanents = this.permanents.filter(p => p.owner !== id);
    // Switch to player_0 if active player was removed
    if (this.activePlayerId === id) {
      this.activePlayerId = 'player_0';
      this.inspectedId = null;
    }
    this.updateLabels();
  },

  setActivePlayer(id) {
    if (!this.getPlayer(id)) return;
    this.activePlayerId = id;
    // Clear inspectedId if it's not on the new player's board
    if (this.inspectedId) {
      const perm = this.permanents.find(p => p.id === this.inspectedId);
      if (perm && perm.controller !== id) this.inspectedId = null;
    }
  },

  getPlayerName(id) {
    const p = this.getPlayer(id);
    return p ? p.name : id;
  },

  // Triggered/activated ability tracking
  // triggerCounts: Map<permId, Map<abilityIndex, countThisTurn>>
  triggerCounts: new Map(),
  activateCounts: new Map(),

  /* Reset trigger and activate counts (call when starting a new turn). */
  resetTriggerCounts() { this.triggerCounts.clear(); this.activateCounts.clear(); },

  /* Get how many times a triggered ability has fired this turn. */
  getTriggerCount(permId, abilityIdx) {
    const m = this.triggerCounts.get(permId);
    return m ? (m.get(abilityIdx) || 0) : 0;
  },

  /* Get how many times an activated ability has been activated this turn. */
  getActivateCount(permId, abilityIdx) {
    const m = this.activateCounts.get(permId);
    return m ? (m.get(abilityIdx) || 0) : 0;
  },

  /* Extract triggered abilities from a computed ability list.
     Returns array of { index, fullText, effectText, triggerLimit }
     where effectText is the parseable part (after the first comma).
     triggerLimit is null (unlimited) or a number. */
  extractTriggeredAbilities(abilities) {
    const result = [];
    for (let i = 0; i < abilities.length; i++) {
      const ab = abilities[i];
      // Strip ability word prefix (e.g. "Eminence — ") ALWAYS before any parsing.
      // All words before an em dash are flavor/ability words with no rules meaning.
      const stripped = ab.trim().replace(/^[^{\n.;"—\u2014]+[\u2014—]\s*/g, '');
      // Triggered abilities start with "when", "whenever", or "at" (CR 603.1)
      if (!/^(?:when(?:ever)?|at)\b/i.test(stripped)) continue;
      // Extract effect text from the STRIPPED version (after first comma)
      const commaIdx = stripped.indexOf(',');
      if (commaIdx < 0) continue; // no effect portion found
      const effectText = stripped.substring(commaIdx + 1).trim();
      if (!effectText) continue;
      // Detect trigger limit: "This ability triggers only once/twice each turn."
      let triggerLimit = null;
      const trigLimitMatch = stripped.match(/this ability triggers only (\w+)(?: times)? each turn/i);
      if (trigLimitMatch) {
        triggerLimit = _parseWordNumber(trigLimitMatch[1]);
      }
      result.push({ index: i, fullText: ab, effectText, triggerLimit });
    }
    return result;
  },

  /* Extract activated abilities from a computed ability list.
     Returns array of { index, fullText, effectText, costText }
     Activated abilities contain ":" separating cost from effect (CR 602.1).
     Mana abilities and loyalty abilities are included. */
  extractActivatedAbilities(abilities) {
    const result = [];
    for (let i = 0; i < abilities.length; i++) {
      const ab = abilities[i];
      // Strip ability word prefix (e.g. "Eminence — ") ALWAYS before any parsing.
      const stripped = ab.trim().replace(/^[^{\n.;"—\u2014]+[\u2014—]\s*/g, '');
      // Detect Crew N keyword (reminder text stripped: "Crew 3" with no colon)
      const crewMatch = stripped.match(/^Crew\s+(\d+)\s*$/i);
      if (crewMatch) {
        result.push({ index: i, fullText: ab, effectText: stripped, costText: '',
                      activateLimit: null, isMonstrosity: false, monstrosityN: 0,
                      isCrew: true, crewN: parseInt(crewMatch[1], 10), options: null });
        continue;
      }
      // Detect Saddle N keyword
      const saddleMatch = stripped.match(/^Saddle\s+(\d+)\s*$/i);
      if (saddleMatch) {
        result.push({ index: i, fullText: ab, effectText: stripped, costText: '',
                      activateLimit: null, isMonstrosity: false, monstrosityN: 0,
                      isSaddle: true, saddleN: parseInt(saddleMatch[1], 10), options: null });
        continue;
      }
      const colonIdx = stripped.indexOf(':');
      if (colonIdx < 0) continue;
      // Skip triggered abilities (they may contain colons in their effect text)
      if (/^(?:when(?:ever)?|at)\b/i.test(stripped)) continue;
      // Skip "enchant [type]" lines
      if (/^enchant\s/i.test(stripped)) continue;
      // Skip "gains quoted ability" lines (e.g. saga chapters: 'This Saga gains "{T}: Add {C}."')
      // The colon is inside the quoted string, not a cost separator.
      if (stripped.substring(0, colonIdx).includes('"')) continue;
      const costText = stripped.substring(0, colonIdx).trim();
      const effectText = stripped.substring(colonIdx + 1).trim();
      if (!effectText) continue;
      // Detect activation limit: "Activate only once/twice each turn." / "Activate this ability only once/twice each turn."
      let activateLimit = null;
      const actLimitMatch = stripped.match(/activate(?:\s+this\s+ability)?\s+only\s+(\w+)(?: times)?\s+each\s+turn/i);
      if (actLimitMatch) {
        activateLimit = _parseWordNumber(actLimitMatch[1]);
      }
      // Detect Monstrosity N — an activated ability that can only fire if the
      // creature isn't already monstrous (CR 701.28). When it fires, N +1/+1
      // counters are placed on the creature and it gains the Monstrous trait.
      let isMonstrosity = false;
      let monstrosityN = 0;
      const monMatch = effectText.match(/^monstrosity\s+(\d+)\s*\.?\s*$/i);
      if (monMatch) {
        isMonstrosity = true;
        monstrosityN = parseInt(monMatch[1], 10);
      }
      // Detect "or"-style option splits (e.g. "gets +1/-1 or -1/+1", "gains flying or first strike").
      // Find a leading subject phrase + verb, then split the predicate on top-level " or ".
      // Skip "your choice of ..." (N-way comma list — too risky to auto-split).
      let options = null;
      if (!isMonstrosity && !/your choice of/i.test(effectText)) {
        const verbRe = /^(.+?\s+)(gets?|gains?|has|have|deals?|becomes?|loses?)\s+(.+)$/i;
        const vm = effectText.match(verbRe);
        if (vm) {
          const subj = vm[1], verb = vm[2], pred = vm[3];
          // Only split on a single top-level " or ". Require a trailing clause or period so we don't
          // catch an " or " that's part of an adverbial tail ("... until end of turn. or ..." won't occur,
          // but we also skip if there are multiple " or " at top level).
          // Strip a trailing shared-modifier (e.g. "until end of turn", "this turn") and re-apply
          // to both options so "+1/-1 or -1/+1 until end of turn" → both options get "until end of turn".
          let core = pred, tail = '';
          const tailMatch = pred.match(/\s+(until\s+(?:end\s+of\s+turn|your\s+next\s+turn|end\s+of\s+combat)|this\s+turn)\s*\.?\s*$/i);
          if (tailMatch) {
            core = pred.substring(0, tailMatch.index);
            tail = ' ' + tailMatch[1].trim();
          }
          const parts = core.split(/\s+or\s+/i);
          if (parts.length === 2) {
            const opt1 = `${subj}${verb} ${parts[0].trim()}${tail}`.replace(/\s+/g, ' ').trim();
            const opt2Raw = parts[1].trim();
            const opt2 = /^(gets?|gains?|has|have|deals?|becomes?|loses?|target|enchanted|equipped|this|each|all)\b/i.test(opt2Raw)
              ? `${opt2Raw}${tail}`
              : `${subj}${verb} ${opt2Raw}${tail}`.replace(/\s+/g, ' ').trim();
            options = [opt1, opt2];
          }
        }
      }
      result.push({ index: i, fullText: ab, effectText, costText, activateLimit, isMonstrosity, monstrosityN, options });
    }
    return result;
  },

  /* Shared: create a pseudo-permanent for a triggered/activated ability and parse its effects. */
  _addAbilityPseudo(sourcePermId, abilityIdx, effectText, fullText, kind) {
    const sourcePerm = this.permanents.find(p => p.id === sourcePermId);
    if (!sourcePerm) return null;
    const countMap = kind === 'trigger' ? this.triggerCounts : this.activateCounts;
    if (!countMap.has(sourcePermId)) countMap.set(sourcePermId, new Map());
    const counts = countMap.get(sourcePermId);
    counts.set(abilityIdx, (counts.get(abilityIdx) || 0) + 1);
    const ts = this.nextTimestamp++;
    const prefix = kind === 'trigger' ? 'trig' : 'act';
    const label = kind === 'trigger' ? 'trigger' : 'activated';
    const sourceBaseName = sourcePerm.label ? `${sourcePerm.name} ${sourcePerm.label}` : sourcePerm.name;
    const pseudoPerm = {
      id: prefix + '_' + sourcePermId + '_' + abilityIdx + '_' + ts,
      name: sourceBaseName + ' (' + label + ')',
      timestamp: ts,
      owner: sourcePerm.owner || 'player_0',
      controller: sourcePerm.controller || sourcePerm.owner || 'player_0',
      printedTypes: [], printedSupertypes: [], printedSubtypes: [],
      printedPower: null, printedToughness: null,
      printedAbilities: [], printedColors: [],
      manaValue: 0, manaCost: '', oracleText: effectText,
      imageUri: sourcePerm.imageUri, isManualEffect: true,
      [kind === 'trigger' ? 'isTriggeredAbility' : 'isActivatedAbility']: true,
      abilitySourceId: sourcePermId, abilityIndex: abilityIdx,
      abilityFullText: fullText, isToken: false,
      scryfallData: sourcePerm.scryfallData, counters: {},
    };
    this.permanents.push(pseudoPerm);
    // For triggered/activated abilities, convert "it" / "that creature" subject pronouns
    // to "target [type]" so effects like "Whenever a Cat attacks, it gains trample" become
    // targeted and require user selection.
    // IMPORTANT: This conversion is a UI convenience only — the original ability does NOT
    // actually target, so it bypasses shroud/hexproof. We flag this with _nonTargetingSelection.
    let parsedEffectText = effectText;
    // Strip leading "if [condition], " — this is a resolution condition, not a filter or target.
    // e.g. Eminence: "if this card is in the command zone or on the battlefield, another target Cat..."
    parsedEffectText = parsedEffectText.replace(/^if\s+[^,]+,\s*/i, '');
    // Handle "you may pay {cost}. If you do, [effect]" pattern.
    // This arises in triggered abilities where an optional mana cost gates the effect.
    // For this tool, assume the cost is always paid and parse only the actual effect.
    // Pattern: "you may pay <anything>. If you do, <effect>" (case-insensitive, across sentences)
    parsedEffectText = parsedEffectText.replace(
      /you may pay [^.]+\.\s*If you do,?\s*/gi,
      ''
    );

    // Infer the subject type from the trigger condition (the part before the first comma).
    // This lets us convert "it" → "target Cat" instead of "target creature" for e.g.
    // "Whenever another Cat you control attacks, …it gains trample…"
    let triggerSubject = 'creature'; // safe default
    let triggerHasAnother = false;
    let triggerIsSelf = false; // true when condition starts with "this creature/this permanent/this card"
    if (fullText && kind === 'trigger') {
      const stripped = fullText.trim().replace(/^[^{\n.;"—\u2014]+[\u2014—]\s*/g, '');
      const commaIdx = stripped.indexOf(',');
      const condText = commaIdx >= 0 ? stripped.substring(0, commaIdx) : stripped;
      // Detect self-referential trigger: "this creature/permanent/card/token [action]"
      // In this case "it" in the effect refers back to the source itself.
      // Strip leading trigger keyword ("Whenever/When/At") before testing.
      const condCore = condText.replace(/^(?:when(?:ever)?|at)\s+/i, '');
      if (/^this\s+(?:creature|permanent|card|token)\b/i.test(condCore)) {
        triggerIsSelf = true;
      }
      // "another [subtype/type]" — also marks that the source itself is excluded
      const anotherMatch = condText.match(/\banother\s+([A-Za-z]\w*)/i);
      if (anotherMatch) {
        triggerHasAnother = true;
        triggerSubject = anotherMatch[1];
      } else {
        // "a/an [subtype/type] [action]" — e.g. "a creature attacks you"
        const aMatch = condText.match(/\ban?\s+([A-Za-z]\w*)\s+(?:you\s+(?:control|own)\s+)?(?:attacks?|dies|enters|leaves|is\s+dealt|gains?|loses?)/i);
        if (aMatch) triggerSubject = aMatch[1];
      }
    }
    // "another" or "other target" in the effectText also excludes the source
    if (/\banother\s+(?:target\s+)?[A-Za-z]/i.test(parsedEffectText) || /\bother\s+target\b/i.test(parsedEffectText)) triggerHasAnother = true;
    if (triggerHasAnother) pseudoPerm._excludeAbilitySource = true;

    let didItConversion = false;
    if (/\bit\b/i.test(parsedEffectText)) {
      const before = parsedEffectText;
      // Replace "it gets/gains/has/is/becomes/loses" → "target [subject] gets/gains/..."
      parsedEffectText = parsedEffectText.replace(/\bit\s+(get[s]?|gain[s]?|ha[s]|have|is|becomes?|loses?)\b/gi, `target ${triggerSubject} $1`);
      // Replace "its power" / "its toughness" → "that creature's power"
      parsedEffectText = parsedEffectText.replace(/\bits\s+(power|toughness)\b/gi, "that creature's $1");
      if (parsedEffectText !== before) didItConversion = true;
    }
    // Also convert "that creature/permanent" pronouns (e.g. Gahiji: "that creature gets +2/+0")
    {
      const thatBefore = parsedEffectText;
      parsedEffectText = parsedEffectText.replace(
        /\bthat\s+(?:creature|permanent)\s+(get[s]?|gain[s]?|ha[s]|have|is|becomes?|loses?)\b/gi,
        `target ${triggerSubject} $1`
      );
      if (parsedEffectText !== thatBefore) didItConversion = true;
    }
    if (didItConversion) pseudoPerm._nonTargetingSelection = true;
    const fakeCard = { name: sourcePerm.name, oracle_text: parsedEffectText, type_line: 'Instant', colors: sourcePerm.printedColors, cmc: 0 };
    // Detect "basic land type of your choice" in the ability text so the land-type
    // dropdown appears on the activated-ability pseudo-permanent (not on the source card).
    if (/\bbasic land type of your choice\b/i.test(parsedEffectText)) {
      pseudoPerm.needsChosenLandType = true;
      pseudoPerm.chosenLandType = null;
      pseudoPerm.originalOracleText = parsedEffectText;
      pseudoPerm.originalCard = fakeCard;
    }
    // Pass pseudoPerm directly (not a spread) so choice flags persist on the stored object.
    pseudoPerm.printedTypes = ['Instant'];
    const newEffects = parseCardEffects(pseudoPerm, fakeCard);
    for (const eff of newEffects) {
      eff.isSpellEffect = true;
      eff.sourceId = pseudoPerm.id;
      eff.sourceName = pseudoPerm.name;
      eff.timestamp = ts;
      if (didItConversion) eff._nonTargetingSelection = true;
    }
    _pinAbilityEffectsToSource(newEffects, sourcePermId);
    // For self-referential triggers ("this creature attacks → it gains X"), force-pin
    // any remaining unset targeted effects to the source — no dropdown needed.
    if (triggerIsSelf) {
      for (const eff of newEffects) {
        if (eff.scope === 'targeted' && !eff.selfTarget && !eff.targetId) {
          eff.targetId = sourcePermId;
          eff._autoTargetSource = true;
        }
      }
    }
    // If the source is an aura/equipment/fortification that's attached to something, redirect
    // effects that refer to "Enchanted/Equipped/Fortified <perm>" (which _pinAbilityEffectsToSource
    // just auto-pinned to the source itself) to the actual attached permanent.
    const _sourceAttachments = sourcePerm.printedSubtypes || [];
    const _isAttachmentSource = _sourceAttachments.includes('Aura') || _sourceAttachments.includes('Equipment') || _sourceAttachments.includes('Fortification');
    if (_isAttachmentSource && sourcePerm.targetId) {
      const _attachmentWordRe = /\b(enchanted|equipped|fortified)\s+\w+/i;
      for (const eff of newEffects) {
        if (eff._autoTargetSource && eff.targetId === sourcePermId && _attachmentWordRe.test(parsedEffectText)) {
          eff.targetId = sourcePerm.targetId;
        }
      }
    }
    this.effects.push(...newEffects);
    this.updateLabels();
    return pseudoPerm;
  },

  addTriggeredAbility(sourcePermId, abilityIdx, effectText, fullText) {
    return this._addAbilityPseudo(sourcePermId, abilityIdx, effectText, fullText, 'trigger');
  },

  addActivatedAbility(sourcePermId, abilityIdx, effectText, fullText) {
    return this._addAbilityPseudo(sourcePermId, abilityIdx, effectText, fullText, 'activated');
  },

  /* Fire an eminence triggered/activated ability from a commander in the command zone.
     Unlike _addAbilityPseudo, this works from the commander card data directly
     since the commander has no permanent on the battlefield. */
  addCommandZoneAbility(commanderIdx, abilityIdx, effectText, fullText, kind) {
    const commander = this.commanders[commanderIdx];
    if (!commander) return null;
    const face = _resolveCardFace(commander.card, 0);
    const sourceId = 'cmdzone_' + commanderIdx;
    const countMap = kind === 'trigger' ? this.triggerCounts : this.activateCounts;
    if (!countMap.has(sourceId)) countMap.set(sourceId, new Map());
    const counts = countMap.get(sourceId);
    counts.set(abilityIdx, (counts.get(abilityIdx) || 0) + 1);
    const ts = this.nextTimestamp++;
    const prefix = kind === 'trigger' ? 'trig' : 'act';
    const label = kind === 'trigger' ? 'trigger' : 'activated';
    const colors = face.colors || commander.card.colors || [];
    const pseudoPerm = {
      id: prefix + '_' + sourceId + '_' + abilityIdx + '_' + ts,
      name: commander.name + ' (' + label + ', command zone)',
      timestamp: ts,
      owner: this.activePlayerId,
      controller: this.activePlayerId,
      printedTypes: [], printedSupertypes: [], printedSubtypes: [],
      printedPower: null, printedToughness: null,
      printedAbilities: [], printedColors: colors,
      manaValue: 0, manaCost: '', oracleText: effectText,
      imageUri: commander.imageUri, isManualEffect: true,
      [kind === 'trigger' ? 'isTriggeredAbility' : 'isActivatedAbility']: true,
      abilitySourceId: sourceId, abilityIndex: abilityIdx,
      abilityFullText: fullText, isToken: false,
      scryfallData: commander.card, counters: {},
    };
    this.permanents.push(pseudoPerm);
    // Convert "it" subject pronouns to "target creature" for individual creature targeting.
    // This is a UI convenience — the ability does NOT actually target, so it bypasses shroud/hexproof.
    let parsedCmdEffectText = effectText;
    let didCmdItConversion = false;
    if (/\bit\b/i.test(parsedCmdEffectText)) {
      const before = parsedCmdEffectText;
      parsedCmdEffectText = parsedCmdEffectText.replace(/\bit\s+(get[s]?|gain[s]?|ha[s]|have|is|becomes?|loses?)\b/gi, 'target creature $1');
      parsedCmdEffectText = parsedCmdEffectText.replace(/\bits\s+(power|toughness)\b/gi, "that creature's $1");
      if (parsedCmdEffectText !== before) didCmdItConversion = true;
    }
    if (didCmdItConversion) pseudoPerm._nonTargetingSelection = true;
    const fakeCard = { name: commander.name, oracle_text: parsedCmdEffectText, type_line: 'Instant', colors, cmc: 0 };
    const newEffects = parseCardEffects({ ...pseudoPerm, printedTypes: ['Instant'] }, fakeCard);
    for (const eff of newEffects) {
      eff.isSpellEffect = true;
      eff.sourceId = pseudoPerm.id;
      eff.sourceName = pseudoPerm.name;
      eff.timestamp = ts;
      if (didCmdItConversion) eff._nonTargetingSelection = true;
    }
    this.effects.push(...newEffects);
    this.updateLabels();
    return pseudoPerm;
  },

  // Commander tracking — routes to active player's commanders
  get commanders() { return this.getActivePlayer().commanders; },
  set commanders(val) { this.getActivePlayer().commanders = val; },

  // Emblem tracking — routes to active player's emblems
  get emblems() { return this.getActivePlayer().emblems || (this.getActivePlayer().emblems = []); },
  set emblems(val) { this.getActivePlayer().emblems = val; },

  // Mutate tracking: array of stacks. Each stack is an ordered array of permIds [top, ..., bottom].
  // The top card's name/types/P&T are authoritative; all cards in the stack share abilities.
  mutateStacks: [],

  /* Find which stack a permId is in. Returns { stackIdx, posIdx } or null. */
  _findInStack(permId) {
    for (let i = 0; i < this.mutateStacks.length; i++) {
      const pos = this.mutateStacks[i].indexOf(permId);
      if (pos !== -1) return { stackIdx: i, posIdx: pos };
    }
    return null;
  },

  /* Get the stack array for a permId, or null. */
  getStack(permId) {
    const loc = this._findInStack(permId);
    return loc ? this.mutateStacks[loc.stackIdx] : null;
  },

  /* Mutate mutaterId onto targetId.
     position: 'top' means mutaterId goes above targetId in the stack.
               'under' means mutaterId goes below targetId (but still in the same stack).
     targetId may itself be part of an existing stack — we merge into it.
     mutaterId is removed from any existing stack first. */
  applyMutate(mutaterId, targetId, position) {
    // Remove mutaterId from any existing stack
    this._removeFromStack(mutaterId);

    // Find or create the target's stack
    const targetLoc = this._findInStack(targetId);
    if (targetLoc) {
      const stack = this.mutateStacks[targetLoc.stackIdx];
      if (position === 'top') {
        // Insert mutaterId at the very top of the stack
        stack.unshift(mutaterId);
      } else {
        // Insert mutaterId at the very bottom of the stack
        stack.push(mutaterId);
      }
    } else {
      // targetId not in any stack — create a new stack
      if (position === 'top') {
        this.mutateStacks.push([mutaterId, targetId]);
      } else {
        this.mutateStacks.push([targetId, mutaterId]);
      }
    }

    // Bug fix: redirect external targeted effects (aura/equipment/etc.) pointing to any
    // non-top stack member to instead point to the top card. This keeps Battlefield.effects
    // consistent so the target dropdown always shows a valid selection and the Enchanted/
    // Equipped status is correctly preserved on the top card.
    // TEXT_CHANGE effects are excluded — per CR rules they remain targeting the original
    // permanent (and the evaluation engine applies them to the whole stack via oracleText).
    this._redirectEffectsToStackTop();
  },

  /* After any mutate stack change, update targeted effects so non-top members' targets
     are redirected to the top card. TEXT_CHANGE effects are left unchanged. */
  _redirectEffectsToStackTop() {
    for (const stack of this.mutateStacks) {
      if (stack.length < 2) continue;
      const topId = stack[0];
      for (let i = 1; i < stack.length; i++) {
        const nonTopId = stack[i];
        this.effects.forEach(e => {
          if (e.scope === 'targeted' && !e.selfTarget &&
              e.targetId === nonTopId &&
              e.type !== EFFECT_TYPE.TEXT_CHANGE) {
            e.targetId = topId;
          }
        });
      }
    }
  },

  /* Remove permId from whatever stack it's in. Cleans up empty/single-element stacks. */
  _removeFromStack(permId) {
    for (let i = this.mutateStacks.length - 1; i >= 0; i--) {
      const stack = this.mutateStacks[i];
      const pos = stack.indexOf(permId);
      if (pos !== -1) {
        stack.splice(pos, 1);
        if (stack.length <= 1) this.mutateStacks.splice(i, 1);
        return;
      }
    }
  },

  removeMutate(permId) {
    this._removeFromStack(permId);
  },

  // Bestow tracking: Map from bestow permId -> target permId.
  // When set, the bestow creature becomes an Aura enchanting the target (loses Creature type).
  bestowTargets: new Map(),

  /* Set a bestow creature to enchant a target creature. */
  applyBestow(bestowPermId, targetPermId) {
    this.bestowTargets.set(bestowPermId, targetPermId);
  },

  /* Remove bestow enchantment (card reverts to creature). */
  removeBestow(bestowPermId) {
    this.bestowTargets.delete(bestowPermId);
  },

  /* Get the target permId for a bestow creature, or null. */
  getBestowTarget(bestowPermId) {
    return this.bestowTargets.get(bestowPermId) || null;
  },

  updateGameState(key, value) {
    if (key in this.gameState) {
      this.gameState[key] = value;
    }
    this.evaluate();
    if (typeof renderAll === 'function') renderAll();
  },

  setCustomCounter(name, value) {
    if (value <= 0 && name in this.gameState.customCounters) {
      delete this.gameState.customCounters[name];
    } else if (value > 0) {
      this.gameState.customCounters[name] = value;
    }
    this.evaluate();
    if (typeof renderAll === 'function') renderAll();
  },

  addPermanent(card, opts = {}) {
    // Fix 7/10: If card has X in mana cost or oracle text references X, prompt user
    let processedCard = card;
    // For multi-face cards, get the oracle text from the active face
    const resolvedForCheck = _resolveCardFace(card, opts.faceIndex || 0);
    const manaCost = resolvedForCheck.mana_cost || '';
    const oracleText = resolvedForCheck.oracle_text || '';
    let xValue = null;
    const hasX = manaCost.includes('{X}') || /\bX\b/.test(oracleText);
    if (hasX) {
      const xVal = prompt('This card has a variable X value. Enter the value of X (number):', '0');
      const xNum = parseInt(xVal);
      if (!isNaN(xNum) && xNum >= 0) {
        xValue = xNum;
        // Replace X in the resolved oracle text for multi-face cards
        const resolvedOracle = resolvedForCheck.oracle_text || '';
        processedCard = { ...card, oracle_text: resolvedOracle.replace(/\bX\b/g, String(xNum)) };
        if (card.card_faces) {
          // Also update card_faces so createPermanent gets the right text
          processedCard.card_faces = card.card_faces.map((f, i) => {
            if (i === (opts.faceIndex || 0)) {
              return { ...f, oracle_text: (f.oracle_text || '').replace(/\bX\b/g, String(xNum)) };
            }
            return f;
          });
        }
      }
    }
    // Token clone detection: if a token has "clone" in its name or subtypes,
    // or if it has "copy" in its oracle text, mark it as needing a clone prompt
    const isToken = opts.isToken || card.layout === 'token' || card.layout === 'double_faced_token' || false;
    const isCloneToken = isToken && (
      /\bclone\b/i.test(card.name) ||
      /\bcopy\b/i.test(card.oracle_text || '') ||
      (card.type_line || '').toLowerCase().includes('shapeshifter')
    );
    const perm = createPermanent(processedCard, this.nextTimestamp++, opts);
    // Store X value info for later adjustment
    if (hasX) {
      perm.hasXValue = true;
      perm.xValue = xValue !== null ? xValue : 0;
      perm.originalOracleText = card.oracle_text || '';
      perm.originalCard = card;
    }
    // Detect "choose a creature type" / "choose a color" patterns
    const resolvedOracleForChoice = (processedCard.oracle_text || resolvedForCheck.oracle_text || '').toLowerCase();
    if (/\bchoose a creature type\b/i.test(resolvedOracleForChoice) ||
        /\bchoose a creature card name and a creature type\b/i.test(resolvedOracleForChoice)) {
      perm.needsChosenCreatureType = true;
      perm.chosenCreatureType = null;
      perm.originalOracleText = perm.originalOracleText || card.oracle_text || '';
      perm.originalCard = perm.originalCard || card;
    }
    if (/\bchoose a creature card name\b/i.test(resolvedOracleForChoice)) {
      perm.needsChosenCardName = true;
      perm.chosenCardName = null;
      perm.originalOracleText = perm.originalOracleText || card.oracle_text || '';
      perm.originalCard = perm.originalCard || card;
    }
    if (/\bchoose a color\b/i.test(resolvedOracleForChoice)) {
      perm.needsChosenColor = true;
      perm.chosenColor = null;
      perm.originalOracleText = perm.originalOracleText || card.oracle_text || '';
      perm.originalCard = perm.originalCard || card;
    }
    if (/\bchoose a basic land type\b/i.test(resolvedOracleForChoice)) {
      perm.needsChosenLandType = true;
      perm.chosenLandType = null;
      perm.originalOracleText = perm.originalOracleText || card.oracle_text || '';
      perm.originalCard = perm.originalCard || card;
    }
    // Mark clone tokens for custom editing
    if (isCloneToken) {
      perm.isCloneToken = true;
    }
    this.permanents.push(perm);
    // For parseCardEffects, use the resolved face data so it gets the right oracle text
    const resolvedForParse = _resolveCardFace(processedCard, opts.faceIndex || 0);
    const newEffects = parseCardEffects(perm, resolvedForParse);
    // For clone tokens, add a COPY effect so the copy modal appears
    if (isCloneToken && !newEffects.some(e => e.type === EFFECT_TYPE.COPY)) {
      newEffects.push({
        id: `${perm.id}_eff_${newEffects.length}`,
        layer: '1', type: EFFECT_TYPE.COPY,
        params: { copySource: null, restriction: null },
        appliesTo: null, scope: 'targeted', selfTarget: true,
        sourceId: perm.id, sourceName: card.name,
        timestamp: perm.timestamp,
        ownerId: perm.owner || 'player_0',
        desc: 'Token clone: select a card to copy.',
      });
    }
    this.effects.push(...newEffects);
    this.updateLabels();
    return perm;
  },

  /* Fix 10: Update X value and re-parse effects */
  setXValue(permId, newX) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm.hasXValue) return;
    perm.xValue = newX;
    const newOracleText = _stripReminderText(perm.originalOracleText.replace(/\bX\b/g, String(newX)));
    const processedCard = { ...perm.originalCard, oracle_text: newOracleText };
    perm.oracleText = newOracleText;
    // Re-parse effects from the modified text
    this.effects = this.effects.filter(e => e.sourceId !== permId);
    const fakeCard = { ...processedCard, name: perm.name };
    const newPerm = { ...perm, oracleText: newOracleText };
    const newEffects = parseCardEffects(newPerm, fakeCard);
    this.effects.push(...newEffects);
  },

  /* Set chosen creature type for a permanent and re-parse effects */
  _setChoice(permId, needsKey, valueKey, value) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm[needsKey]) return;
    perm[valueKey] = value || null;
    this._reparseWithChoices(perm);
  },
  setChosenCreatureType(permId, type) { this._setChoice(permId, 'needsChosenCreatureType', 'chosenCreatureType', type); },
  setChosenLandType(permId, type) { this._setChoice(permId, 'needsChosenLandType', 'chosenLandType', type); },
  setChosenColor(permId, color) { this._setChoice(permId, 'needsChosenColor', 'chosenColor', color); },
  setChosenCardName(permId, name) { this._setChoice(permId, 'needsChosenCardName', 'chosenCardName', name); },

  /* Re-parse effects after chosen type/color/X change */
  _reparseWithChoices(perm) {
    let oracleText = perm.originalOracleText || perm.oracleText || '';
    // Apply X substitution if present
    if (perm.hasXValue && perm.xValue !== null) {
      oracleText = oracleText.replace(/\bX\b/g, String(perm.xValue));
    }
    // Apply chosen creature type substitution
    if (perm.chosenCreatureType) {
      const ct = perm.chosenCreatureType;
      const ctPlural = ct.endsWith('s') ? ct : ct + 's';
      // "Creatures you control of the chosen type" → "[Type] creatures you control"
      // Pattern: [things] [you control] of the chosen [creature] type
      oracleText = oracleText.replace(
        /\b(creatures?\b[^.]*?\byou control)\s+of the chosen (?:creature )?type\b/gi,
        `${ct} $1`
      );
      // "of the chosen type" in other contexts → just the type name
      oracleText = oracleText.replace(/\bof the chosen (?:creature )?type\b/gi, ct);
      // "the chosen type" or "the last chosen ... creature type" standalone → type name
      oracleText = oracleText.replace(/\bthe (?:last )?chosen (?:creature )?type\b/gi, ct);
      // "are [chosen type] in addition to" → "are [type]s in addition to"
      oracleText = oracleText.replace(new RegExp('\\bare\\s+' + _escapeRegex(ct) + '\\b', 'gi'), `are ${ctPlural}`);
      // Strip the "choose a creature type" sentence
      oracleText = oracleText.replace(/(?:as [^.]*)?choose a creature type\.\s*/gi, '');
    }
    // Apply combined card name + creature type substitution (Psychic Paper pattern)
    // Must be done before individual substitutions to avoid partial matches
    if (perm.chosenCardName && perm.chosenCreatureType) {
      const cn = perm.chosenCardName;
      const ct = perm.chosenCreatureType;
      // "the last chosen name and creature type" → "[Name] and [Type]"
      oracleText = oracleText.replace(/\bthe (?:last )?chosen name and (?:creature )?type\b/gi, `${cn} and ${ct}`);
    }
    // Apply chosen card name substitution
    if (perm.chosenCardName) {
      const cn = perm.chosenCardName;
      oracleText = oracleText.replace(/\bthe (?:last )?chosen name\b/gi, cn);
      // Strip the "choose a creature card name" sentence
      oracleText = oracleText.replace(/(?:as [^.]*)?choose a creature card name(?:\s+and a creature type)?\.\s*/gi, '');
    }
    // Apply chosen basic land type substitution
    if (perm.chosenLandType) {
      const lt = perm.chosenLandType;
      oracleText = oracleText.replace(/\bthe chosen (?:basic land )?type\b/gi, `a ${lt}`);
      oracleText = oracleText.replace(/\bthe basic land type of your choice\b/gi, `a ${lt}`);
      oracleText = oracleText.replace(/(?:as [^.]*)?choose a basic land type\.\s*/gi, '');
    }
    // Apply chosen color substitution
    if (perm.chosenColor) {
      const cc = perm.chosenColor;
      oracleText = oracleText.replace(/\bthe chosen color\b/gi, cc);
      oracleText = oracleText.replace(/\bof the chosen color\b/gi, cc);
      oracleText = oracleText.replace(/(?:as [^.]*)?choose a color\.\s*/gi, '');
    }
    oracleText = _stripReminderText(oracleText);
    const processedCard = { ...(perm.originalCard || {}), oracle_text: oracleText };
    perm.oracleText = oracleText;
    // Re-parse effects
    this.effects = this.effects.filter(e => e.sourceId !== perm.id);
    const fakeCard = { ...processedCard, name: perm.name };
    const newPerm = { ...perm, oracleText };
    const newEffects = parseCardEffects(newPerm, fakeCard);
    // Inject SET_NAME / SET_TYPE effects for equipment that sets name and creature type
    // (e.g. Psychic Paper: "its name and creature type are [chosen name] and [chosen type]")
    if (perm.chosenCardName && /\bname\b.*\bare\b/i.test(perm.originalOracleText || '')) {
      newEffects.push({
        id: `${perm.id}_eff_setname`,
        layer: '3', type: EFFECT_TYPE.SET_NAME,
        params: { name: perm.chosenCardName },
        appliesTo: null, scope: 'targeted',
        sourceId: perm.id, sourceName: perm.name, timestamp: perm.timestamp,
        ownerId: perm.owner || 'player_0',
        desc: `Name becomes "${perm.chosenCardName}".`,
      });
    }
    if (perm.chosenCreatureType && perm.chosenCardName && /\bcreature type\b.*\bare\b/i.test(perm.originalOracleText || '')) {
      newEffects.push({
        id: `${perm.id}_eff_settype`,
        layer: '4', type: EFFECT_TYPE.SET_TYPE,
        params: { subtypes: [perm.chosenCreatureType], replaceSubtypeCategory: 'creature', keepTypes: true },
        appliesTo: null, scope: 'targeted',
        sourceId: perm.id, sourceName: perm.name, timestamp: perm.timestamp,
        ownerId: perm.owner || 'player_0',
        desc: `Creature type becomes ${perm.chosenCreatureType}.`,
      });
    }
    this.effects.push(...newEffects);
  },

  removePermanent(id) {
    // If removing a crew/saddle effect pseudo-perm, strip the trait from the source.
    const removingPerm = this.permanents.find(p => p.id === id);
    if (removingPerm?._isCrewEffect && removingPerm.abilitySourceId) {
      const src = this.permanents.find(p => p.id === removingPerm.abilitySourceId);
      if (src?.traits) src.traits = src.traits.filter(t => t !== 'Crewed');
    }
    if (removingPerm?._isSaddleEffect && removingPerm.abilitySourceId) {
      const src = this.permanents.find(p => p.id === removingPerm.abilitySourceId);
      if (src?.traits) src.traits = src.traits.filter(t => t !== 'Saddled');
    }
    // Cascade: if removing Exchange of Words (or any source that spawned exchange
    // pseudo-permanents), remove those pseudo-perms and their effects too.
    const linkedPseudoIds = this.permanents
      .filter(p => p._exchangeSourcePermId === id)
      .map(p => p.id);
    for (const pid of linkedPseudoIds) {
      this.permanents = this.permanents.filter(p => p.id !== pid);
      this.effects = this.effects.filter(e => e.sourceId !== pid);
    }
    this.permanents = this.permanents.filter(p => p.id !== id);
    this.effects = this.effects.filter(e => e.sourceId !== id);
    // Clear targetId on effects from other permanents that were targeting the removed one
    // (e.g. a reconfigure card attached to a creature that leaves the battlefield)
    for (const e of this.effects) {
      if (e.targetId === id) e.targetId = null;
    }
    this._removeFromStack(id);
    // Clean up bestow: remove if this was a bestow creature or a bestow target
    this.bestowTargets.delete(id);
    for (const [bestowId, targetId] of this.bestowTargets) {
      if (targetId === id) this.bestowTargets.delete(bestowId);
    }
    if (this.inspectedId === id) this.inspectedId = null;
    // Unlink commander if this permanent was the linked instance
    for (const cmd of this.commanders) {
      if (cmd.linkedPermId === id) cmd.linkedPermId = null;
    }
    // Clear exile tags pointing at the removed permanent
    if (this.exile) {
      for (const entry of this.exile) {
        if (entry.exiledWithId === id) entry.exiledWithId = null;
      }
    }
    this.updateLabels();
  },

  toggleTapped(id) {
    const perm = this.permanents.find(p => p.id === id);
    if (perm) {
      perm.tapped = !perm.tapped;
      // Add/remove 'Tapped' trait
      if (!perm.traits) perm.traits = [];
      if (perm.tapped) {
        if (!perm.traits.includes('Tapped')) perm.traits.push('Tapped');
      } else {
        perm.traits = perm.traits.filter(t => t !== 'Tapped');
      }
    }
  },

  /* Toggle the 'Attacking' trait on a creature. Mutually exclusive with 'Blocking'. */
  toggleAttacking(id) {
    const perm = this.permanents.find(p => p.id === id);
    if (perm) {
      if (!perm.traits) perm.traits = [];
      const isAttacking = perm.traits.includes('Attacking');
      if (isAttacking) {
        perm.traits = perm.traits.filter(t => t !== 'Attacking');
      } else {
        // Mutually exclusive with Blocking
        perm.traits = perm.traits.filter(t => t !== 'Blocking');
        perm.traits.push('Attacking');
      }
    }
  },

  /* Toggle the 'Blocking' trait on a creature. Mutually exclusive with 'Attacking'. */
  toggleBlocking(id) {
    const perm = this.permanents.find(p => p.id === id);
    if (perm) {
      if (!perm.traits) perm.traits = [];
      const isBlocking = perm.traits.includes('Blocking');
      if (isBlocking) {
        perm.traits = perm.traits.filter(t => t !== 'Blocking');
      } else {
        // Mutually exclusive with Attacking
        perm.traits = perm.traits.filter(t => t !== 'Attacking');
        perm.traits.push('Blocking');
      }
    }
  },

  /* Turn a card face down as a 2/2 creature.
     mode: 'morph' | 'cloak' | 'manifest'
     - morph: face down 2/2 creature with no abilities
     - cloak: face down 2/2 creature with Ward 2
     - manifest: face down 2/2 creature with no abilities */
  setFaceDown(id, mode) {
    const perm = this.permanents.find(p => p.id === id);
    if (!perm) return;
    if (perm.isFaceDown) {
      // Turn face up: restore original card data
      perm.isFaceDown = false;
      perm.faceDownMode = null;
      perm.printedTypes = [...(perm._originalTypes || perm.printedTypes)];
      perm.printedSupertypes = [...(perm._originalSupertypes || perm.printedSupertypes)];
      perm.printedSubtypes = [...(perm._originalSubtypes || perm.printedSubtypes)];
      perm.printedPower = perm._originalPower !== undefined ? perm._originalPower : perm.printedPower;
      perm.printedToughness = perm._originalToughness !== undefined ? perm._originalToughness : perm.printedToughness;
      perm.printedAbilities = [...(perm._originalAbilities || perm.printedAbilities)];
      perm.printedColors = [...(perm._originalColors || perm.printedColors)];
      perm.oracleText = perm._originalOracleText || perm.oracleText;
      // Turning face up gives a new timestamp (CR 613.7d)
      perm.timestamp = this.nextTimestamp++;
      // Re-parse effects with the new timestamp
      this.effects = this.effects.filter(e => e.sourceId !== id);
      const card = perm.scryfallData || { name: perm.name, oracle_text: perm.oracleText, type_line: '', colors: perm.printedColors };
      const newEffects = parseCardEffects(perm, card);
      this.effects.push(...newEffects);
    } else {
      // Save original state
      perm._originalTypes = [...perm.printedTypes];
      perm._originalSupertypes = [...(perm.printedSupertypes || [])];
      perm._originalSubtypes = [...(perm.printedSubtypes || [])];
      perm._originalPower = perm.printedPower;
      perm._originalToughness = perm.printedToughness;
      perm._originalAbilities = [...(perm.printedAbilities || [])];
      perm._originalColors = [...(perm.printedColors || [])];
      perm._originalOracleText = perm.oracleText;
      // Set face down state: 2/2 colorless creature with no name visible
      perm.isFaceDown = true;
      perm.faceDownMode = mode;
      perm.printedTypes = ['Creature'];
      perm.printedSupertypes = [];
      perm.printedSubtypes = [];
      perm.printedPower = 2;
      perm.printedToughness = 2;
      perm.printedColors = [];
      if (mode === 'cloak') {
        perm.printedAbilities = ['Ward {2}'];
        perm.oracleText = 'Ward {2}';
      } else {
        perm.printedAbilities = [];
        perm.oracleText = '';
      }
      // Remove existing effects and re-parse (minimal for face-down)
      this.effects = this.effects.filter(e => e.sourceId !== id);
      const fakeCard = { name: perm.name, oracle_text: perm.oracleText, type_line: 'Creature', colors: [], cmc: 0 };
      const newEffects = parseCardEffects(perm, fakeCard);
      this.effects.push(...newEffects);
    }
    this.evaluate();
    if (typeof renderAll === 'function') renderAll();
  },

  reorderTimestamps(orderedIds) {
    for (let i = 0; i < orderedIds.length; i++) {
      const perm = this.permanents.find(p => p.id === orderedIds[i]);
      if (perm) {
        const newTs = i + 1;
        this.effects.forEach(e => {
          if (e.sourceId === perm.id) e.timestamp = newTs;
        });
        perm.timestamp = newTs;
      }
    }
    this.updateLabels();
  },

  /* Assign unique letter labels (A, B, …, Z, AA, AB, …) to permanents that share a name.
     Permanents with a unique name get label = null.
     Called after any add/remove/reorder operation — AFTER parsing, so labels never
     influence the parser. Labels are display-only identifiers. */
  updateLabels() {
    // Group by controller + name so different players' same-named permanents
    // don't get labeled unnecessarily
    const nameGroups = new Map();
    for (const p of this.permanents) {
      const key = (p.controller || p.owner || 'player_0') + '::' + p.name;
      if (!nameGroups.has(key)) nameGroups.set(key, []);
      nameGroups.get(key).push(p);
    }
    for (const [, group] of nameGroups) {
      if (group.length <= 1) {
        group[0].label = null;
      } else {
        const sorted = [...group].sort((a, b) => a.timestamp - b.timestamp);
        for (let i = 0; i < sorted.length; i++) {
          sorted[i].label = _permLabelString(i);
        }
      }
    }
  },

  setTarget(effectSourceId, targetPermId) {
    // Validate aura restriction before setting target
    if (targetPermId) {
      const auraR = this.effects.find(e => e.sourceId === effectSourceId && e.auraRestriction)?.auraRestriction
        || this.permanents.find(p => p.id === effectSourceId)?._auraRestriction;
      if (auraR) {
        const target = this.permanents.find(p => p.id === targetPermId);
        if (target) {
          // Use final computed state for aura restriction validation
          const finalStates = this.getAllFinalStates();
          const fs = finalStates.get(targetPermId);
          const tState = fs
            ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes }
            : { types: target.printedTypes || [], supertypes: target.printedSupertypes || [], subtypes: target.printedSubtypes || [] };
          if (!auraR(tState)) return; // invalid target - silently reject
        }
      }
      // Equipment can only target creatures - validate using final computed state
      const isEquipment = this.effects.some(e => e.sourceId === effectSourceId && e.requiresCreatureTarget);
      if (isEquipment) {
        const finalStates = this.getAllFinalStates();
        // CR 704.5p: A creature can't be attached to anything. If an equipment is
        // currently a creature, it can't equip — unless it has reconfigure, which
        // makes it lose the creature type upon equipping.
        const sourcePerm = this.permanents.find(p => p.id === effectSourceId);
        const sourceFs = finalStates.get(effectSourceId);
        const sourceTypes = sourceFs ? (sourceFs.types || []) : (sourcePerm?.printedTypes || []);
        if (sourceTypes.includes('Creature')) {
          const sourceAbilities = sourceFs ? (sourceFs.abilities || []) : [];
          const hasReconfigure = sourceAbilities.some(a => /\breconfigure\b/i.test(a));
          if (!hasReconfigure) {
            if (typeof _showSBAToast === 'function') {
              _showSBAToast('This Equipment is currently a creature and cannot equip another creature. (Rule 704.5p: If a creature is attached to an object or player, it becomes unattached and remains on the battlefield.)');
            }
            return; // block equip
          }
        }
        const fs = finalStates.get(targetPermId);
        const types = fs ? (fs.types || []) : (this.permanents.find(p => p.id === targetPermId)?.printedTypes || []);
        if (!types.includes('Creature')) return; // silently reject non-creature target
      }
    }
    const newTs = this.nextTimestamp++;
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.scope === 'targeted') {
        e.targetId = targetPermId;
        e.timestamp = newTs;
      }
    });
  },

  /* Set the chosen opponent for a "target opponent" source (e.g. Curious Colossus).
     The selected player is recorded on the permanent and stamped onto every effect
     tagged with _targetsOpponentPlayer so the engine can restrict application to
     that player's permanents only. */
  setTargetOpponent(effectSourceId, playerId) {
    const perm = this.permanents.find(p => p.id === effectSourceId);
    if (perm) perm._targetOpponentPlayerId = playerId || null;
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e._targetsOpponentPlayer) {
        e._targetOpponentPlayerId = playerId || null;
      }
    });
  },

  /* Set the chosen player for a "target player" source (any player, including self).
     Used by cards like Bazaar Trader ("target player gains control of target ... you control"). */
  setTargetPlayer(effectSourceId, playerId) {
    const perm = this.permanents.find(p => p.id === effectSourceId);
    if (perm) perm._targetPlayerId = playerId || null;
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e._targetPlayerControl) {
        e.params.newController = playerId || null;
      }
    });
  },

  /* Set the chosen enchanted player for an "enchant player" aura (e.g. Curse of Conformity).
     Scopes that aura's global effects to only the chosen player's permanents. */
  setEnchantedPlayer(permId, playerId) {
    const perm = this.permanents.find(p => p.id === permId);
    if (perm) perm._enchantedPlayerId = playerId || null;
    this.effects.forEach(e => {
      if (e.sourceId === permId && e._enchantedPlayerScoped) {
        e._enchantedPlayerId = playerId || null;
      }
    });
  },

  /* Set a specific target slot for multi-target effects (e.g. "up to two target creatures") */
  setMultiTarget(effectSourceId, slotIndex, targetPermId) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.scope === 'targeted' && !e.selfTarget && e.targetIds) {
        // Update the specific slot
        while (e.targetIds.length <= slotIndex) e.targetIds.push(null);
        e.targetIds[slotIndex] = targetPermId;
        // Clean trailing nulls
        while (e.targetIds.length > 0 && !e.targetIds[e.targetIds.length - 1]) e.targetIds.pop();
      }
    });
    this.evaluate();
  },

  /* Set targetId for effects from a specific modal mode (modeIndex).
     Used when a modal spell has multiple targeted modes (e.g. Twisted Reflection with Entwine)
     so each mode can target a different permanent independently. */
  setModalModeTarget(effectSourceId, modeIndex, targetPermId) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.scope === 'targeted' &&
          !e.selfTarget && e.modalModeIndex === modeIndex) {
        e.targetId = targetPermId || null;
      }
    });
  },

  /* Select a specific modal mode by effect ID. For choose-one cards, this always
     selects the clicked mode and deselects all others. For choose-N/spree, this
     toggles the mode on/off while enforcing the max active count.
     Does NOT call evaluate — caller is responsible. */
  toggleEffect(effectId) {
    const eff = this.effects.find(e => e.id === effectId);
    if (!eff) return;
    const perm = this.permanents.find(p => p.id === eff.sourceId);
    const maxActive = perm ? (perm.modalMaxActive ?? Infinity) : Infinity;
    const siblingEffs = this.effects.filter(e => e.sourceId === eff.sourceId && e.modalModeIndex !== undefined);

    if (maxActive === 1) {
      // Radio behavior: always select this mode, deselect all others
      for (const e of siblingEffs) {
        e.disabled = (e.modalModeIndex !== eff.modalModeIndex);
      }
    } else {
      // Toggle behavior
      const wasDisabled = eff.disabled;
      if (wasDisabled) {
        // Enabling — check capacity
        if (maxActive < Infinity) {
          const activeIndices = new Set();
          for (const e of siblingEffs) {
            if (!e.disabled) activeIndices.add(e.modalModeIndex);
          }
          if (activeIndices.size >= maxActive) {
            // At max: disable the oldest active mode to make room
            const oldestActive = [...activeIndices][0];
            for (const e of siblingEffs) {
              if (e.modalModeIndex === oldestActive) e.disabled = true;
            }
          }
        }
        // Enable all effects in this mode
        for (const e of siblingEffs) {
          if (e.modalModeIndex === eff.modalModeIndex) e.disabled = false;
        }
      } else {
        // Disabling this mode
        for (const e of siblingEffs) {
          if (e.modalModeIndex === eff.modalModeIndex) e.disabled = true;
        }
      }
    }
  },

  /* Set modal mode counts for repeatable modal spells.
     counts: object mapping modeIndex → count (e.g. {0: 2, 1: 0, 2: 1}).
     For repeatable modes, effects are disabled/enabled based on count > 0.
     The engine duplicates effects per count. */
  setModalModeCounts(permId, counts) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return;
    perm.modalModeCounts = counts;
    // Enable/disable effects based on count
    const effs = this.effects.filter(e => e.sourceId === permId && e.modalModeIndex !== undefined);
    for (const e of effs) {
      e.disabled = (counts[e.modalModeIndex] ?? 0) === 0;
    }
  },

  /* Set modal mode selections for non-repeatable modal spells.
     activeIndices: Set of active mode indices.
     Disables modes not in the set, enables those in the set. */
  setModalModeSelections(permId, activeIndices) {
    const effs = this.effects.filter(e => e.sourceId === permId && e.modalModeIndex !== undefined);
    for (const e of effs) {
      e.disabled = !activeIndices.has(e.modalModeIndex);
    }
  },

  /* Set copy source for a COPY effect */
  setCopySource(effectSourceId, copySourceCard) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.type === EFFECT_TYPE.COPY) {
        e.params.copySource = copySourceCard;
      }
    });
  },

  /* Set/update text-change replacements and target.
     Also propagates targetId to other targeted effects from same source
     (e.g. Balduvian Shaman's Layer 6 ADD_ABILITY). */
  setTextChangeConfig(effectSourceId, targetId, replacements) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE) {
        if (targetId !== undefined) e.targetId = targetId;
        if (replacements !== undefined) e.params.replacements = replacements;
      }
    });
    // Propagate target to all other targeted effects from same source
    if (targetId !== undefined) {
      this.effects.forEach(e => {
        if (e.sourceId === effectSourceId && e.scope === 'targeted' && !e.selfTarget) {
          e.targetId = targetId;
        }
      });
    }
  },

  /* Set Swirl the Mists chosen color + auto-build replacements for all permanents */
  setSwirlColor(effectSourceId, chosenColor) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE &&
          e.params.changeType === 'color_global') {
        e.params.chosenColor = chosenColor;
        // Build replacements: every OTHER color word -> chosen color
        const allColors = ['white', 'blue', 'black', 'red', 'green'];
        e.params.replacements = allColors
          .filter(c => c !== chosenColor.toLowerCase())
          .map(c => ({ from: c, to: chosenColor.toLowerCase() }));
      }
    });
  },

  /* Update params on text-change effects matching a specific changeType */
  _setTextChangeParams(effectSourceId, changeType, params) {
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE &&
          e.params.changeType === changeType) {
        Object.assign(e.params, params);
      }
    });
  },
  setExchangeTargets(effectSourceId, targetA, targetB) {
    // Temporarily clear targets/snapshots so getAllFinalStates() evaluates WITHOUT the
    // exchange effect (handles both first-time and re-targeting correctly).
    this._setTextChangeParams(effectSourceId, 'exchange_text', {
      exchangeTargetA: null, exchangeTargetB: null,
      snapshotTextA: undefined, snapshotTextB: undefined,
      snapshotAbilitiesA: undefined, snapshotAbilitiesB: undefined,
    });
    // Take text snapshots: the exchange effect is now inactive, so getAllFinalStates()
    // returns state without the exchange applied — the Layer 3 text "immediately
    // before the exchange would begin applying".
    const finalStates = this.getAllFinalStates();
    const stA = finalStates.get(targetA);
    const stB = finalStates.get(targetB);
    const snapshotTextA = stA ? stA.oracleText : '';
    const snapshotTextB = stB ? stB.oracleText : '';
    this._setTextChangeParams(effectSourceId, 'exchange_text', {
      exchangeTargetA: targetA, exchangeTargetB: targetB,
      snapshotTextA, snapshotTextB,
      snapshotAbilitiesA: snapshotTextA.split('\n').map(l => l.trim()).filter(Boolean),
      snapshotAbilitiesB: snapshotTextB.split('\n').map(l => l.trim()).filter(Boolean),
    });
  },
  setDeadpoolTarget(effectSourceId, targetId) {
    // Temporarily clear target/snapshots so getAllFinalStates() evaluates without exchange.
    this._setTextChangeParams(effectSourceId, 'exchange_text', {
      exchangeTargetId: null,
      snapshotTextA: undefined, snapshotTextB: undefined,
      snapshotAbilitiesA: undefined, snapshotAbilitiesB: undefined,
    });
    // Take text snapshots before setting the target (same logic as Exchange of Words).
    const finalStates = this.getAllFinalStates();
    const stSource = finalStates.get(effectSourceId);
    const stTarget = finalStates.get(targetId);
    const snapshotTextA = stSource ? stSource.oracleText : '';
    const snapshotTextB = stTarget ? stTarget.oracleText : '';
    this._setTextChangeParams(effectSourceId, 'exchange_text', {
      exchangeTargetId: targetId,
      snapshotTextA, snapshotTextB,
      snapshotAbilitiesA: snapshotTextA.split('\n').map(l => l.trim()).filter(Boolean),
      snapshotAbilitiesB: snapshotTextB.split('\n').map(l => l.trim()).filter(Boolean),
    });
  },
  /* Exchange control: set targets and snapshot their current controllers */
  setExchangeControlTargets(effectSourceId, targetA, targetB) {
    const finalStates = this.getAllFinalStates();
    const stA = finalStates.get(targetA);
    const stB = finalStates.get(targetB);
    const ctrlA = stA ? stA.controller : null;
    const ctrlB = stB ? stB.controller : null;
    this.effects.forEach(e => {
      if (e.sourceId === effectSourceId && e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl) {
        e.params.exchangeTargetA = targetA;
        e.params.exchangeTargetB = targetB;
        e.params.snapshotControllerA = ctrlA;
        e.params.snapshotControllerB = ctrlB;
      }
    });
    this.evaluate();
  },

  setVolrathGraveyardCard(effectSourceId, card) {
    this._setTextChangeParams(effectSourceId, 'volrath_text', { graveyardCard: card });
  },

  /* Graveyard management */
  addToGraveyard(playerId, card) {
    const player = this.getPlayer(playerId);
    if (!player) return;
    if (!player.graveyard) player.graveyard = [];
    player.graveyard.push(card);
    player.gameState.graveyardCount = player.graveyard.length;
    this.evaluate();
  },

  removeFromGraveyard(playerId, index) {
    const player = this.getPlayer(playerId);
    if (!player || !player.graveyard) return;
    player.graveyard.splice(index, 1);
    player.gameState.graveyardCount = player.graveyard.length;
    this.evaluate();
  },

  getGraveyardTop(playerId) {
    const player = this.getPlayer(playerId);
    if (!player || !player.graveyard || player.graveyard.length === 0) return null;
    return player.graveyard[player.graveyard.length - 1];
  },

  getGraveyardCount(playerId) {
    const player = this.getPlayer(playerId);
    if (!player || !player.graveyard) return 0;
    return player.graveyard.length;
  },

  /* ─── Exile zone ─────────────────────────────────────────────── */
  /* [KEY: EXILE] */
  exile: [],
  nextExileId: 1,

  addToExile(card, { owner = null, exiledWithId = null, isFaceDown = false } = {}) {
    const id = 'exile_' + (this.nextExileId++);
    const entry = {
      id,
      card,
      owner: owner || this.activePlayerId,
      exiledWithId,
      counters: {},
      isFaceDown,
      timestamp: this.nextTimestamp++,
    };
    this.exile.push(entry);
    this.evaluate();
    return id;
  },

  removeFromExile(entryId) {
    this.exile = this.exile.filter(e => e.id !== entryId);
    this.evaluate();
  },

  setExileTag(entryId, permanentId) {
    const entry = this.exile.find(e => e.id === entryId);
    if (!entry) return;
    entry.exiledWithId = permanentId || null;
    this.evaluate();
  },

  setExileOwner(entryId, playerId) {
    const entry = this.exile.find(e => e.id === entryId);
    if (!entry) return;
    entry.owner = playerId;
    this.evaluate();
  },

  setExileFaceDown(entryId, isFaceDown) {
    const entry = this.exile.find(e => e.id === entryId);
    if (!entry) return;
    entry.isFaceDown = !!isFaceDown;
    this.evaluate();
  },

  addExileCounter(entryId, counterType, count = 1) {
    const entry = this.exile.find(e => e.id === entryId);
    if (!entry) return;
    if (!entry.counters) entry.counters = {};
    entry.counters[counterType] = (entry.counters[counterType] || 0) + count;
    // CR 122.3: +1/+1 and -1/-1 annihilate
    if (counterType === '+1/+1' || counterType === '-1/-1') {
      const opposite = counterType === '+1/+1' ? '-1/-1' : '+1/+1';
      const a = entry.counters[counterType] || 0;
      const b = entry.counters[opposite] || 0;
      if (a > 0 && b > 0) {
        const cancel = Math.min(a, b);
        entry.counters[counterType] -= cancel;
        entry.counters[opposite] -= cancel;
        if (entry.counters[counterType] === 0) delete entry.counters[counterType];
        if (entry.counters[opposite] === 0) delete entry.counters[opposite];
      }
    }
    this.evaluate();
  },

  removeExileCounter(entryId, counterType, count = 1) {
    const entry = this.exile.find(e => e.id === entryId);
    if (!entry || !entry.counters) return;
    entry.counters[counterType] = Math.max(0, (entry.counters[counterType] || 0) - count);
    if (entry.counters[counterType] === 0) delete entry.counters[counterType];
    this.evaluate();
  },

  getExileEntriesTaggedWith(permanentId) {
    return this.exile.filter(e => e.exiledWithId === permanentId);
  },

  getExileCount(playerId = null) {
    if (playerId) return this.exile.filter(e => e.owner === playerId).length;
    return this.exile.length;
  },
  /* [END: EXILE] */

  /* Set CDA user value for a permanent */
  setCDAValue(permId, value) {
    const perm = this.permanents.find(p => p.id === permId);
    if (perm) perm.cdaUserValue = value;
  },

  /* Class enchantment level management */
  setClassLevel(permId, level) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm._classLevelThresholds) return;
    const maxLevel = Math.max(...perm._classLevelThresholds.values());
    perm.classLevel = Math.max(1, Math.min(level, maxLevel));
    this.evaluate();
    if (typeof renderAll === 'function') renderAll();
  },

  /* Counter management */
  addCounter(permId, counterType, count = 1) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return;
    if (!perm.counters) perm.counters = {};
    if (!perm.counterTimestamps) perm.counterTimestamps = {};
    perm.counters[counterType] = (perm.counters[counterType] || 0) + count;
    perm.counterTimestamps[counterType] = this.nextTimestamp++;
    // CR 122.3: +1/+1 and -1/-1 counters annihilate each other
    if (counterType === '+1/+1' || counterType === '-1/-1') {
      const opposite = counterType === '+1/+1' ? '-1/-1' : '+1/+1';
      const a = perm.counters[counterType] || 0;
      const b = perm.counters[opposite] || 0;
      if (a > 0 && b > 0) {
        const cancel = Math.min(a, b);
        perm.counters[counterType] -= cancel;
        perm.counters[opposite] -= cancel;
        if (perm.counters[counterType] === 0) {
          delete perm.counters[counterType];
          if (perm.counterTimestamps) delete perm.counterTimestamps[counterType];
        }
        if (perm.counters[opposite] === 0) {
          delete perm.counters[opposite];
          if (perm.counterTimestamps) delete perm.counterTimestamps[opposite];
        }
      }
    }
    this._syncCounterEffects(permId);
  },

  removeCounter(permId, counterType, count = 1) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm.counters) return;
    perm.counters[counterType] = Math.max(0, (perm.counters[counterType] || 0) - count);
    if (perm.counters[counterType] === 0) {
      delete perm.counters[counterType];
      if (perm.counterTimestamps) delete perm.counterTimestamps[counterType];
    }
    this._syncCounterEffects(permId);
  },

  _syncCounterEffects(permId) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return;
    this.effects = this.effects.filter(e => !(e.sourceId === permId && e._isCounterEffect));

    const KW_COUNTERS = [
      'flying','first strike','double strike','deathtouch','haste',
      'hexproof','indestructible','lifelink','menace','reach',
      'trample','vigilance','defender','fear','intimidate',
      'shroud','wither','infect','prowess','ward','shield',
    ];

    for (const [type, count] of Object.entries(perm.counters || {})) {
      if (count <= 0) continue;
      // Match any P/T counter pattern: +N/+N, -N/-N, +N/-N, +N/+0, etc.
      const ptMatch = type.match(/^([+-]\d+)\/([+-]\d+)$/);
      if (ptMatch) {
        this.effects.push({
          id: `${permId}_counter_${type}`, layer: '7d', type: EFFECT_TYPE.ADD_COUNTERS,
          params: { counterType: type, count, powerMod: parseInt(ptMatch[1]), toughnessMod: parseInt(ptMatch[2]) },
          appliesTo: null, scope: 'targeted', selfTarget: true,
          sourceId: permId, sourceName: perm.name, timestamp: perm.timestamp,
          ownerId: perm.owner || 'player_0',
          desc: `${count}x ${type} counter${count !== 1 ? 's' : ''}`, _isCounterEffect: true,
        });
      } else if (KW_COUNTERS.includes(type.toLowerCase())) {
        const keyword = type.charAt(0).toUpperCase() + type.slice(1);
        this.effects.push({
          id: `${permId}_counter_${type}`, layer: '6', type: EFFECT_TYPE.KEYWORD_COUNTER,
          params: { keyword },
          appliesTo: null, scope: 'targeted', selfTarget: true,
          sourceId: permId, sourceName: perm.name, timestamp: (perm.counterTimestamps && perm.counterTimestamps[type]) || perm.timestamp,
          ownerId: perm.owner || 'player_0',
          desc: `${keyword} counter`, _isCounterEffect: true,
        });
      }
    }
  },

  /* Flip a transformable card to its other face. Re-creates permanent properties from the new face. */
  flipCard(permId) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm.isTransformable || !perm.scryfallData?.card_faces) return;
    const newFaceIndex = perm.activeFaceIndex === 0 ? 1 : 0;
    const card = perm.scryfallData;
    const resolvedCard = _resolveCardFace(card, newFaceIndex);
    
    // Update permanent with new face data
    const types = parseTypeLine(resolvedCard.type_line || '');
    let oracleText = resolvedCard.oracle_text || '';
    oracleText = _stripReminderText(oracleText);
    oracleText = _replaceProperNounSelfRef(resolvedCard.name, oracleText, perm.isToken);
    if (card.name !== resolvedCard.name) {
      oracleText = _replaceProperNounSelfRef(card.name, oracleText, perm.isToken);
    }
    
    perm.name = resolvedCard.name;
    perm.printedTypes = types.types;
    perm.printedSupertypes = types.supertypes;
    perm.printedSubtypes = types.subtypes;
    perm.printedPower = resolvedCard.power !== undefined ? parseInt(resolvedCard.power) || 0 : null;
    perm.printedToughness = resolvedCard.toughness !== undefined ? parseInt(resolvedCard.toughness) || 0 : null;
    perm.printedAbilities = extractAbilities(oracleText);
    _addIntrinsicLandMana(perm.printedAbilities, types.subtypes);
    perm.printedColors = resolvedCard.colors || [];
    perm.manaCost = resolvedCard.mana_cost || '';
    perm.oracleText = oracleText;
    perm.imageUri = resolvedCard.image_uris?.small || resolvedCard.image_uris?.normal || null;
    perm.activeFaceIndex = newFaceIndex;
    perm.oracleCounterTypes = _extractOracleCounterTypes(resolvedCard.oracle_text || '', types.subtypes, types.types);
    perm.isManualEffect = types.types.includes('Instant') || types.types.includes('Sorcery');
    
    // Re-parse effects for the new face
    this.effects = this.effects.filter(e => !(e.sourceId === permId && !e._isCounterEffect));
    const newEffects = parseCardEffects(perm, resolvedCard);
    this.effects.push(...newEffects);
    
    // Re-sync counter effects since types may have changed
    this._syncCounterEffects(permId);
  },

  /* Switch a chooseable-face (split/aftermath) card to a specific face. */
  switchSplitFace(permId, faceIndex) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm || !perm.isChooseableFace || !perm.scryfallData?.card_faces) return;
    const card = perm.scryfallData;
    const newFaceIndex = faceIndex !== undefined ? faceIndex : ((perm.activeFaceIndex + 1) % card.card_faces.length);
    const resolvedCard = _resolveCardFace(card, newFaceIndex);

    const types = parseTypeLine(resolvedCard.type_line || '');
    let oracleText = resolvedCard.oracle_text || '';
    oracleText = _stripReminderText(oracleText);
    oracleText = _replaceProperNounSelfRef(resolvedCard.name, oracleText, perm.isToken);
    if (card.name !== resolvedCard.name) {
      oracleText = _replaceProperNounSelfRef(card.name, oracleText, perm.isToken);
    }

    perm.name = resolvedCard.name;
    perm.activeFaceIndex = newFaceIndex;
    perm.printedTypes = types.types;
    perm.printedSupertypes = types.supertypes;
    perm.printedSubtypes = types.subtypes;
    perm.printedPower = resolvedCard.power !== undefined ? parseInt(resolvedCard.power) || 0 : null;
    perm.printedToughness = resolvedCard.toughness !== undefined ? parseInt(resolvedCard.toughness) || 0 : null;
    perm.printedAbilities = extractAbilities(oracleText);
    _addIntrinsicLandMana(perm.printedAbilities, types.subtypes);
    perm.printedColors = resolvedCard.colors || [];
    perm.manaCost = resolvedCard.mana_cost || '';
    perm.manaValue = _cmcFromManaCost(resolvedCard.mana_cost) || resolvedCard.cmc || card.cmc || 0;
    perm.isManualEffect = types.types.includes('Instant') || types.types.includes('Sorcery');
    perm.oracleText = oracleText;
    perm.oracleCounterTypes = _extractOracleCounterTypes(resolvedCard.oracle_text || '', types.subtypes, types.types);

    this.effects = this.effects.filter(e => !(e.sourceId === permId && !e._isCounterEffect));
    const newEffects = parseCardEffects(perm, resolvedCard);
    this.effects.push(...newEffects);
    this._syncCounterEffects(permId);
    this.updateLabels();
  },

  /* Toggle the locked/unlocked state of one room on a Room permanent. */
  toggleRoomLock(permId, faceIndex) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm?.isRoom || !perm.roomFaces) return;
    perm.roomLocked[faceIndex] = !perm.roomLocked[faceIndex];

    // Rebuild oracle text from only the unlocked rooms
    const activeOracle = perm.roomFaces
      .filter((_, i) => !perm.roomLocked[i])
      .map(f => f.oracle_text || '')
      .filter(Boolean)
      .join('\n');

    let oracleText = _stripReminderText(activeOracle);
    const cardName = perm.scryfallData?.name || perm.name;
    oracleText = _replaceProperNounSelfRef(perm.name, oracleText, perm.isToken);
    if (cardName !== perm.name) oracleText = _replaceProperNounSelfRef(cardName, oracleText, perm.isToken);
    perm.oracleText = oracleText;
    perm.printedAbilities = extractAbilities(oracleText);
    _addIntrinsicLandMana(perm.printedAbilities, perm.printedSubtypes);

    this.effects = this.effects.filter(e => !(e.sourceId === permId && !e._isCounterEffect));
    // Use the active (filtered) oracle text so only unlocked room effects are parsed.
    const newEffects = parseCardEffects(perm, { name: cardName, oracle_text: oracleText });
    this.effects.push(...newEffects);
    this._syncCounterEffects(permId);
  },

  evaluate() {
    if (!this.inspectedId) return null;
    const perm = this.permanents.find(p => p.id === this.inspectedId);
    if (!perm) return null;
    return evaluatePermanent(perm, this.permanents, this.effects, this.inspectedId);
  },

  /* Return Map<permId, finalState> for ALL real permanents. */
  getAllFinalStates() {
    const realPerms = this.permanents.filter(p => !p.isManualEffect);
    const map = new Map();
    const _fallback = (p) => ({ name: p.name, types: p.printedTypes, supertypes: p.printedSupertypes,
      subtypes: p.printedSubtypes || [], power: p.printedPower, toughness: p.printedToughness,
      colors: p.printedColors || [], abilities: p.printedAbilities || [], oracleText: p.oracleText || '',
      owner: p.owner || 'player_0', controller: p.owner || 'player_0' });
    const hasTraits = realPerms.some(rp => rp.traits && rp.traits.length > 0);
    for (const p of realPerms) {
      if (this.effects.length > 0 || hasTraits) {
        const r = evaluatePermanent(p, realPerms, this.effects, p.id);
        map.set(p.id, (r && r.final) ? r.final : _fallback(p));
      } else {
        map.set(p.id, _fallback(p));
      }
    }
    return map;
  },

  /* Get post-Layer-1 state for a permanent (copiable values).
     Returns the state after Layer 1 effects are applied, which is what a copy sees. */
  getPostLayer1State(permId) {
    const realPerms = this.permanents.filter(p => !p.isManualEffect);
    const perm = realPerms.find(p => p.id === permId);
    if (!perm) return null;
    if (this.effects.length === 0) return null;
    const r = evaluatePermanent(perm, realPerms, this.effects, permId);
    if (!r || !r.layers || r.layers.length === 0) return null;
    // Layer 1 is the first layer (id '1')
    const layer1 = r.layers.find(l => l.id === '1');
    return layer1 ? layer1.stateAfter : null;
  },

  /* Compute counts of each type, subtype, and supertype across all permanents.
     Also tracks combo trait counts and devotion.
     Uses final evaluated states when available, otherwise printed values.
     Returns { types: Map, subtypes: Map, supertypes: Map, combos: Map,
               devotion: {W,U,B,R,G}, nonbasicLands: number, basicLands: number } */
  getBattlefieldTypeCounts() {
    const counts = { types: new Map(), subtypes: new Map(), supertypes: new Map(),
                     combos: new Map(), devotion: { W: 0, U: 0, B: 0, R: 0, G: 0 },
                     basicLands: 0, nonbasicLands: 0, creatureTypeCount: new Map(),
                     counters: new Map(), totalCounters: 0, countersByPerm: new Map() };
    const realPerms = this.permanents.filter(p => !p.isManualEffect);
    if (realPerms.length === 0) return counts;
    
    // Build final states via a single evaluation pass (reuse engine's global eval)
    const finalStates = new Map();
    if (this.effects.length > 0) {
      for (const p of realPerms) {
        const r = evaluatePermanent(p, realPerms, this.effects, p.id);
        if (r && r.final) finalStates.set(p.id, r.final);
      }
    }

    for (const p of realPerms) {
      const state = finalStates.get(p.id);
      const types = state ? state.types : p.printedTypes;
      const subtypes = state ? state.subtypes : (p.printedSubtypes || []);
      const supertypes = state ? state.supertypes : (p.printedSupertypes || []);
      const manaCost = state ? (state.manaCost || '') : (p.manaCost || '');

      for (const t of types) {
        counts.types.set(t, (counts.types.get(t) || 0) + 1);
      }
      for (const st of subtypes) {
        counts.subtypes.set(st, (counts.subtypes.get(st) || 0) + 1);
      }
      for (const sup of supertypes) {
        counts.supertypes.set(sup, (counts.supertypes.get(sup) || 0) + 1);
      }

      // Track basic vs non-basic lands
      if (types.includes('Land')) {
        if (supertypes.includes('Basic')) {
          counts.basicLands++;
        } else {
          counts.nonbasicLands++;
        }
      }

      // Fix 2: Compute devotion from mana costs
      for (const ch of manaCost) {
        if (counts.devotion[ch] !== undefined) counts.devotion[ch]++;
      }

      // Fix 6: Track combo trait counts  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  every combination of supertypes + types + subtypes
      const allTraits = [...supertypes, ...types, ...subtypes];
      // Generate all non-empty subsets of size 2+ as sorted key strings
      const n = allTraits.length;
      for (let mask = 3; mask < (1 << n); mask++) { // skip single-bit masks (size 1)
        const bits = [];
        for (let b = 0; b < n; b++) {
          if (mask & (1 << b)) bits.push(allTraits[b]);
        }
        if (bits.length < 2) continue;
        // Limit to combos of 4 or fewer traits to avoid exponential blowup
        if (bits.length > 4) continue;
        const key = bits.join(' ');
        counts.combos.set(key, (counts.combos.get(key) || 0) + 1);
      }

      // Track creature type count per permanent
      if (state && state.isAllCreatureTypes) {
        counts.creatureTypeCount.set(p.id, Infinity);
      } else {
        const ctCount = subtypes.filter(s =>
          typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0
            ? TypeCatalog.creatureTypes.has(s) : true
        ).length;
        counts.creatureTypeCount.set(p.id, ctCount);
      }

      // Fix 10: Track counters per permanent and across the board
      const permCounters = state ? (state.counters || {}) : (p.counters || {});
      let permCounterTotal = 0;
      for (const [cType, cCount] of Object.entries(permCounters)) {
        if (cCount > 0) {
          counts.counters.set(cType, (counts.counters.get(cType) || 0) + cCount);
          permCounterTotal += cCount;
        }
      }
      counts.totalCounters += permCounterTotal;
      counts.countersByPerm.set(p.id, { total: permCounterTotal, types: { ...permCounters } });
    }
    return counts;
  },

  /* Shared: compute state after Layer 1 + Layer 3 effects applied before a given source. */
  _computeLayer3State(permId, beforeSourceId) {
    const allPerms = this.permanents.filter(p => !p.isManualEffect);
    const allStates = new Map();
    for (const p of allPerms) allStates.set(p.id, createBaseState(p));
    // Apply Layer 1 (COPY) effects first
    for (const eff of this.effects.filter(e => e.layer === '1').sort((a, b) => a.timestamp - b.timestamp)) {
      for (const p of allPerms) {
        const st = allStates.get(p.id);
        if (st && effectAppliesToPerm(eff, st, p, p.id, allStates)) applyEffect(st, eff);
      }
    }
    // Apply Layer 3 effects (exchange/volrath first for dependency priority)
    const layer3Effects = this.effects
      .filter(e => e.layer === '3' && e.sourceId !== beforeSourceId)
      .sort((a, b) => a.timestamp - b.timestamp);
    const isExchangeOrVolrath = (e) => e.params.changeType === 'exchange_text' || e.params.changeType === 'volrath_text';
    const sorted = [...layer3Effects.filter(isExchangeOrVolrath), ...layer3Effects.filter(e => !isExchangeOrVolrath(e))];
    const ctx = { exchangeApplied: new Set() };
    for (const eff of sorted) {
      for (const p of allPerms) {
        const st = allStates.get(p.id);
        if (!st || !effectAppliesToPerm(eff, st, p, p.id, allStates)) continue;
        if (eff.type === EFFECT_TYPE.TEXT_CHANGE && isExchangeOrVolrath(eff)) eff._allStates = allStates;
        applyEffect(st, eff, ctx);
      }
    }
    return allStates.get(permId);
  },

  getLayer3Text(permId, beforeSourceId) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return '';
    const state = this._computeLayer3State(permId, beforeSourceId);
    return state ? state.oracleText : perm.oracleText;
  },

  getLayer3Subtypes(permId, beforeSourceId) {
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return [];
    const state = this._computeLayer3State(permId, beforeSourceId);
    return state ? [...state.subtypes] : [...perm.printedSubtypes];
  },

  addCommander(card) {
    const face = _resolveCardFace(card, 0);
    const imageUri = face.image_uris?.normal || card.image_uris?.normal || '';
    this.commanders.push({ card, name: face.name || card.name, imageUri, castCount: 0, linkedPermId: null });
  },

  removeCommander(index) {
    this.commanders.splice(index, 1);
  },

  addEmblem(card) {
    const face = card.card_faces ? card.card_faces[0] : card;
    const imageUri = face.image_uris?.normal || card.image_uris?.normal || '';
    const name = card.name || face.name || '';
    const ts = this.nextTimestamp++;
    const emblemId = 'emblem_' + this.activePlayerId + '_' + ts;
    const oracleText = face.oracle_text || card.oracle_text || '';
    const colors = face.colors || card.colors || [];
    const pseudoPerm = {
      id: emblemId,
      name,
      timestamp: ts,
      owner: this.activePlayerId,
      controller: this.activePlayerId,
      printedTypes: ['Emblem'],
      printedSupertypes: [],
      printedSubtypes: [],
      printedPower: null,
      printedToughness: null,
      printedAbilities: [],
      printedColors: colors,
      manaValue: 0,
      manaCost: '',
      oracleText,
      imageUri,
      isManualEffect: false,
      isEmblem: true,
      isToken: false,
      counters: {},
      scryfallData: card,
    };
    this.permanents.push(pseudoPerm);
    const fakeCard = {
      name,
      oracle_text: oracleText,
      type_line: card.type_line || 'Emblem',
      colors,
      cmc: 0,
    };
    const newEffects = parseCardEffects(pseudoPerm, fakeCard);
    this.effects.push(...newEffects);
    this.emblems.push({ card, name, imageUri, permId: emblemId });
    this.updateLabels();
    return pseudoPerm;
  },

  removeEmblem(index) {
    const emblem = this.emblems[index];
    if (emblem) {
      this.permanents = this.permanents.filter(p => p.id !== emblem.permId);
      this.effects = this.effects.filter(e => e.sourceId !== emblem.permId);
    }
    this.emblems.splice(index, 1);
    this.updateLabels();
  },

  isCommander(permId) {
    // First check: exact ID match (when commander was put onto battlefield via the zone)
    if (this.commanders.some(c => c.linkedPermId === permId)) return true;
    // Fallback: name match, but only for commanders not yet linked to any specific permanent
    const perm = this.permanents.find(p => p.id === permId);
    if (!perm) return false;
    return this.commanders.some(c => c.linkedPermId === null && c.name === perm.name);
  },

  getCommanderNames() {
    return this.commanders.map(c => c.name);
  },

  clear() {
    this.permanents = [];
    this.effects = [];
    this.nextTimestamp = 1;
    this.inspectedId = null;
    this.mutateStacks = [];
    // Reset to single player
    this.players = [{
      id: 'player_0',
      name: 'Player 1',
      gameState: {
        handSize: 7, drawsThisTurn: 0, graveyardCount: 0,
        startingLife: 20, currentLife: 20, isYourTurn: true,
        customCounters: {},
      },
      commanders: [],
      graveyard: [],
      emblems: [],
    }];
    this.activePlayerId = 'player_0';
    this.nextPlayerId = 1;
  },
};
/* [END: BATTLEFIELD] */

/* [KEY: SCRYFALL] */
let _scryfallNextPage = null;
let _scryfallLastResults = [];

async function searchScryfall(query, opts = {}) {
  const { loadMore = false, searchTokens = false } = opts;
  let url;
  if (loadMore && _scryfallNextPage) {
    url = _scryfallNextPage;
  } else {
    let q = query;
    if (searchTokens) q = `is:token ${q}`;
    url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&order=name&unique=cards`;
    _scryfallLastResults = [];
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return _scryfallLastResults;
    const data = await res.json();
    const newCards = data.data || [];
    _scryfallNextPage = data.has_more ? data.next_page : null;
    _scryfallLastResults = loadMore ? [..._scryfallLastResults, ...newCards] : newCards;
    return _scryfallLastResults;
  } catch (e) {
    console.error('Scryfall search failed:', e);
    return _scryfallLastResults;
  }
}

function hasMoreScryfallResults() {
  return !!_scryfallNextPage;
}

async function fetchCardByName(name) {
  const url = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Scryfall fetch failed:', e);
    return null;
  }
}
/* [END: SCRYFALL] */

/* [KEY: PERMANENT] */
let _permIdCounter = 0;
function _escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* Layouts where only one face is active at a time (transformable) */
const TRANSFORMABLE_LAYOUTS = new Set(['transform', 'modal_dfc', 'reversible_card']);

/* Layouts where the user picks one half to play (split cards, aftermath, adventure) */
const CHOOSEABLE_FACE_LAYOUTS = new Set(['split', 'aftermath', 'adventure']);

/* Compute CMC from a mana cost string like "{2}{G}" → 3.
   Handles generic numbers, variable (X=0), twobrid ({2/W}=2), and all pip symbols (=1 each). */
function _cmcFromManaCost(manaCost) {
  if (!manaCost) return 0;
  let total = 0;
  for (const m of manaCost.matchAll(/\{([^}]+)\}/g)) {
    const sym = m[1];
    if (/^\d+$/.test(sym)) {
      total += parseInt(sym);
    } else if (/^[XYZ]$/.test(sym)) {
      // variable mana contributes 0
    } else if (/^\d+\//.test(sym)) {
      total += parseInt(sym.split('/')[0]); // twobrid: {2/W} → 2
    } else {
      total += 1; // colored pip, hybrid, phyrexian, snow, colorless
    }
  }
  return total;
}

/* Resolve card data for the active face of a multi-face card.
   For transform/modal_dfc: returns the active face's data merged with top-level card data.
   For split/adventure: uses the chosen face's data.
   For room: combines both faces' oracle text. */
function _resolveCardFace(card, faceIndex) {
  const faces = card.card_faces;
  if (!faces || faces.length < 2) return card;
  const layout = card.layout || '';

  // Room cards share layout:'split' with split cards but both halves coexist on the battlefield
  const isRoomCard = faces.some(f => (f.type_line || '').includes('Room'));
  if (isRoomCard) {
    const combinedOracle = faces.map(f => f.oracle_text || '').filter(Boolean).join('\n');
    return {
      ...card,
      oracle_text: card.oracle_text || combinedOracle,
      type_line: card.type_line || faces.map(f => f.type_line).filter(Boolean).join(' // '),
      mana_cost: card.mana_cost || faces.map(f => f.mana_cost || '').filter(Boolean).join(' // '),
      image_uris: card.image_uris || (faces[0] && faces[0].image_uris) || null,
      _isFaceResolved: true,
    };
  }

  if (TRANSFORMABLE_LAYOUTS.has(layout)) {
    // Transform/MDFC: use the specified face's data
    const face = faces[faceIndex] || faces[0];
    return {
      ...card,
      name: face.name || card.name,
      oracle_text: face.oracle_text || '',
      type_line: face.type_line || card.type_line || '',
      power: face.power,
      toughness: face.toughness,
      colors: face.colors || card.colors || [],
      mana_cost: face.mana_cost || '',
      image_uris: face.image_uris || card.image_uris || null,
      _activeFace: faceIndex,
      _isFaceResolved: true,
    };
  }
  
  if (layout === 'battle') {
    // Battles: front face is the battle, back face is what it transforms into
    const face = faces[faceIndex] || faces[0];
    return {
      ...card,
      name: faceIndex === 0 ? card.name : face.name || card.name,
      oracle_text: face.oracle_text || '',
      type_line: face.type_line || card.type_line || '',
      power: face.power,
      toughness: face.toughness,
      colors: face.colors || card.colors || [],
      mana_cost: face.mana_cost || card.mana_cost || '',
      image_uris: face.image_uris || card.image_uris || null,
      _activeFace: faceIndex,
      _isFaceResolved: true,
    };
  }

  // Chooseable-face (split/aftermath): use the specific face's data like transform
  if (CHOOSEABLE_FACE_LAYOUTS.has(layout)) {
    const face = faces[faceIndex] || faces[0];
    return {
      ...card,
      name: face.name || card.name,
      oracle_text: face.oracle_text || '',
      type_line: face.type_line || card.type_line || '',
      power: face.power,
      toughness: face.toughness,
      colors: face.colors || card.colors || [],
      mana_cost: face.mana_cost || '',
      image_uris: card.image_uris || face.image_uris || null,
      _activeFace: faceIndex,
      _isFaceResolved: true,
    };
  }

  // Room (and other fallback layouts): combine oracle text from all faces
  // Use the top-level card data but fill in missing fields from faces
  const combinedOracle = faces.map(f => f.oracle_text || '').filter(Boolean).join('\n');
  const combinedManaCost = faces.map(f => f.mana_cost || '').filter(Boolean).join(' // ');
  return {
    ...card,
    oracle_text: card.oracle_text || combinedOracle,
    type_line: card.type_line || faces.map(f => f.type_line).filter(Boolean).join(' // '),
    mana_cost: card.mana_cost || combinedManaCost,
    image_uris: card.image_uris || (faces[0] && faces[0].image_uris) || null,
    _isFaceResolved: true,
  };
}

function createPermanent(card, timestamp, opts = {}) {
  // Resolve multi-face card data
  const faceIndex = opts.faceIndex || 0;
  const resolvedCard = card._isFaceResolved ? card : _resolveCardFace(card, faceIndex);
  
  const types = parseTypeLine(resolvedCard.type_line || '');
  const isToken = opts.isToken || card.layout === 'token' || card.layout === 'double_faced_token' || false;
  // Fix 4: Replace proper nouns in oracle text that match the card name with "this card"/"this token"
  let oracleText = resolvedCard.oracle_text || '';
  oracleText = _stripReminderText(oracleText);
  oracleText = _replaceProperNounSelfRef(resolvedCard.name, oracleText, isToken);
  
  // For multi-face cards with card_faces, also try replacing the full card name (both faces)
  if (card.card_faces && card.name !== resolvedCard.name) {
    oracleText = _replaceProperNounSelfRef(card.name, oracleText, isToken);
  }
  
  // Fix 7: Detect X in mana cost and prompt for value (handled at addPermanent level)
  const imageUri = resolvedCard.image_uris?.small || resolvedCard.image_uris?.normal || null;
  
  const perm = {
    id: 'perm_' + (++_permIdCounter),
    name: resolvedCard.name,
    timestamp,
    owner: (typeof Battlefield !== 'undefined' ? Battlefield.activePlayerId : 'player_0'),
    controller: (typeof Battlefield !== 'undefined' ? Battlefield.activePlayerId : 'player_0'),
    printedTypes:      types.types,
    printedSupertypes: types.supertypes,
    printedSubtypes:   types.subtypes,
    printedPower:      resolvedCard.power !== undefined ? parseInt(resolvedCard.power) || 0 : null,
    printedToughness:  resolvedCard.toughness !== undefined ? parseInt(resolvedCard.toughness) || 0 : null,
    printedAbilities:  extractAbilities(oracleText),
    printedColors:     resolvedCard.colors || [],
    manaValue:         _cmcFromManaCost(resolvedCard.mana_cost) || resolvedCard.cmc || card.cmc || 0,
    manaCost:          resolvedCard.mana_cost || '',
    oracleText:        oracleText,
    imageUri:          imageUri,
    isManualEffect:    types.types.includes('Instant') || types.types.includes('Sorcery'),
    isToken:           isToken,
    scryfallData:      card,
    cdaUserValue:      null,
    counters:          {},
    counterTimestamps: {},
    oracleCounterTypes: _extractOracleCounterTypes(resolvedCard.oracle_text || '', types.subtypes, types.types),
  };
  // CR 305.6: basic land subtypes grant intrinsic mana abilities (stripped by Scryfall parentheses)
  _addIntrinsicLandMana(perm.printedAbilities, perm.printedSubtypes);

  // Store multi-face info for transform/flip support
  if (card.card_faces && card.card_faces.length >= 2) {
    const layout = card.layout || '';
    perm.isMultiFace = true;
    perm.cardLayout = layout;
    perm.activeFaceIndex = faceIndex;
    perm.isTransformable = TRANSFORMABLE_LAYOUTS.has(layout) || layout === 'battle';
    const _isRoomCard = card.card_faces.some(f => (f.type_line || '').includes('Room'));
    perm.isChooseableFace = CHOOSEABLE_FACE_LAYOUTS.has(layout) && !_isRoomCard;
    perm.isRoom = _isRoomCard;
    // Store face names for display
    perm.faceNames = card.card_faces.map(f => f.name || '');
    // Store face images
    perm.faceImages = card.card_faces.map(f => f.image_uris?.small || f.image_uris?.normal || null);
    // For non-transformable, non-chooseable, non-room layouts, store that all faces are active
    if (!perm.isTransformable && !perm.isChooseableFace && !perm.isRoom) {
      perm.allFacesActive = true;
    }
    // Store the full card name (e.g. "Commit // Memory") for chooseable-face cards
    if (perm.isChooseableFace) {
      perm.fullCardName = card.name;
    }
    // Room cards: store per-face data and start with both doors locked
    if (perm.isRoom) {
      perm.roomLocked = [true, true];
      perm.roomFaces = card.card_faces.map(f => ({
        name: f.name || '',
        mana_cost: f.mana_cost || '',
        type_line: f.type_line || '',
        oracle_text: f.oracle_text || '',
      }));
      perm.oracleText = '';
      perm.printedAbilities = [];
    }
  }

  // Detect sideways card layouts (Battles, split/Room cards)
  // These cards display their images rotated and need orientation adjustment
  const _layout = card.layout || '';
  if (_layout === 'battle' || _layout === 'split' || _layout === 'planar') {
    perm.isSideways = true;
  }

  // Detect Mutate keyword in oracle text
  if (/\bmutate\b/i.test(resolvedCard.oracle_text || '')) {
    perm.hasMutate = true;
  }

  // Detect Bestow keyword in oracle text (CR 702.102)
  if (/\bbestow\b/i.test(resolvedCard.oracle_text || '')) {
    perm.hasBestow = true;
  }

  // Detect saga chapter thresholds from ability lines
  // Roman numerals at start of ability lines indicate lore counter requirements
  if (types.subtypes.includes('Saga') && perm.printedAbilities.length > 0) {
    const sagaData = _parseSagaChapters(perm.printedAbilities);
    if (sagaData) {
      perm._sagaChapterThresholds = sagaData.thresholds;
      perm._sagaMaxChapter = sagaData.maxChapter;
    }
  }

  // Detect class level thresholds from ability lines
  // Lines like "{cost}: Level N" indicate level-up boundaries
  if (types.subtypes.includes('Class') && perm.printedAbilities.length > 0) {
    perm._classLevelThresholds = _parseClassLevels(perm.printedAbilities);
    perm.classLevel = 1; // Classes start at level 1
  }

  // Detect leveler (Level up) creatures from ability lines
  // Oracle format: "Level up {cost}" followed by "LEVEL N-M" / "LEVEL N+" brackets
  // Each bracket defines a P/T and optional abilities active only in that level range.
  if (perm.printedAbilities.length > 0 && !perm._classLevelThresholds) {
    perm._levelerData = _parseLevelerLevels(perm.printedAbilities, perm.printedPower, perm.printedToughness);
    if (perm._levelerData) {
      // Auto-add 'level' counter type so counter UI shows it
      if (!perm.oracleCounterTypes.includes('level')) {
        perm.oracleCounterTypes.push('level');
      }
    }
  }

  // Detect spacecraft station abilities from ability lines
  // Oracle format: "N+ | [ability]" lines gated by charge counters >= N (cumulative).
  if (perm.printedAbilities.length > 0 && !perm._classLevelThresholds && !perm._levelerData) {
    perm._spacecraftData = _parseSpacecraftStations(perm.printedAbilities, resolvedCard.oracle_text || '');
    if (perm._spacecraftData) {
      // Auto-add 'charge' counter type so counter UI shows it (station uses charge counters)
      if (!perm.oracleCounterTypes.includes('charge')) {
        perm.oracleCounterTypes.push('charge');
      }
    }
  }
  
  return perm;
}

/* Parse saga chapter roman numerals from ability lines.
   Returns { thresholds: Map<abilityIndex, requiredLoreCounters>, maxChapter: number } or null.
   E.g. "I, II — Draw a card." means indices for that line need lore >= 1 (for I) and lore >= 2 (for II).
   The threshold stored is the MINIMUM lore counters needed (the first roman numeral in the line).
   maxChapter is the HIGHEST roman numeral found across ALL chapter lines (the final chapter). */
function _parseSagaChapters(abilities) {
  const ROMAN_MAP = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
  const thresholds = new Map();
  let maxChapter = 0;
  // Match lines starting with roman numerals like "I —", "I, II —", "III, IV, V —"
  const chapterRegex = /^([IVXLC]+(?:\s*,\s*[IVXLC]+)*)\s*\u2014/;
  for (let i = 0; i < abilities.length; i++) {
    const match = abilities[i].match(chapterRegex);
    if (match) {
      // Parse the roman numerals in the chapter header
      const numerals = match[1].split(',').map(s => s.trim());
      const values = numerals.map(n => ROMAN_MAP[n]).filter(v => v !== undefined);
      if (values.length > 0) {
        // Store the minimum lore counter threshold needed to activate this chapter
        thresholds.set(i, Math.min(...values));
        // Track the highest chapter numeral across all lines
        maxChapter = Math.max(maxChapter, ...values);
      }
    }
  }
  return thresholds.size > 0 ? { thresholds, maxChapter } : null;
}

/* Parse class enchantment level lines from ability lines.
   Returns Map<abilityIndex, requiredLevel> or null.
   Class oracle text has lines like "{2}{U}: Level 2" which mark boundaries.
   Level 1 abilities appear before the first "Level 2" line.
   Level 2 abilities appear between "Level 2" and "Level 3" lines.
   Level 3 abilities appear after "Level 3" line.
   The level-up lines themselves are stored with threshold = the level they grant.
   E.g. "{2}{U}: Level 2" gets threshold = 2 (it's the activation line for level 2). */
function _parseClassLevels(abilities) {
  const thresholds = new Map();
  const levelLineRegex = /^[{][^}]*[}].*:\s*Level\s+(\d+)\s*$/i;
  let currentLevel = 1;
  for (let i = 0; i < abilities.length; i++) {
    const match = abilities[i].match(levelLineRegex);
    if (match) {
      const level = parseInt(match[1], 10);
      // The level-up line itself belongs to the level it grants
      thresholds.set(i, level);
      currentLevel = level;
    } else {
      // Ability line: belongs to currentLevel
      thresholds.set(i, currentLevel);
    }
  }
  return thresholds.size > 0 ? thresholds : null;
}

/* Parse leveler (Level up) creature ability lines.
   Leveler oracle text format:
     Level up {cost}
     LEVEL 1-3
     4/4
     LEVEL 4+
     6/6
     Trample
   Returns object with:
     brackets: array of { min, max, power, toughness, abilityIndices: [] }
     abilityIndexToBracket: Map<abilityIndex, bracketIndex>  (for display active/inactive)
     levelUpLineIndex: index of the "Level up {cost}" line
   Or null if not a leveler card. */
function _parseLevelerLevels(abilities, printedPower, printedToughness) {
  // First line must be "Level up {cost}"
  const levelUpIdx = abilities.findIndex(a => /^Level up\s+\{/i.test(a));
  if (levelUpIdx < 0) return null;

  const levelLineRegex = /^LEVEL\s+(\d+)([+-])(\d*)$/i;
  const ptRegex = /^(\*|\d+)\/(\*|\d+)$/;
  
  const brackets = [];
  // Bracket 0: the base level (level 0, before any LEVEL line)
  // The base P/T is the card's printed P/T, abilities are "Level up {cost}" line only
  brackets.push({
    min: 0, max: 0,
    power: printedPower, toughness: printedToughness,
    abilityIndices: [levelUpIdx], // Level up is always active
  });

  let currentBracket = null;
  const abilityIndexToBracket = new Map();
  // Level up line always belongs to bracket 0
  abilityIndexToBracket.set(levelUpIdx, 0);
  
  for (let i = 0; i < abilities.length; i++) {
    if (i === levelUpIdx) continue; // skip the level up line itself
    
    const levelMatch = abilities[i].match(levelLineRegex);
    if (levelMatch) {
      const minLevel = parseInt(levelMatch[1], 10);
      const op = levelMatch[2]; // '-' for range, '+' for open-ended
      const maxLevel = op === '+' ? Infinity : parseInt(levelMatch[3], 10);
      
      currentBracket = {
        min: minLevel, max: maxLevel,
        power: null, toughness: null,
        abilityIndices: [],
      };
      brackets.push(currentBracket);
      // The LEVEL line itself maps to this bracket
      abilityIndexToBracket.set(i, brackets.length - 1);
      continue;
    }
    
    // If we're inside a bracket, check for P/T line
    if (currentBracket) {
      const ptMatch = abilities[i].match(ptRegex);
      if (ptMatch && currentBracket.power === null) {
        currentBracket.power = ptMatch[1] === '*' ? 0 : parseInt(ptMatch[1], 10);
        currentBracket.toughness = ptMatch[2] === '*' ? 0 : parseInt(ptMatch[2], 10);
        abilityIndexToBracket.set(i, brackets.length - 1);
        continue;
      }
      // Otherwise it's an ability line for this bracket
      currentBracket.abilityIndices.push(i);
      abilityIndexToBracket.set(i, brackets.length - 1);
    }
  }
  
  // Must have at least one LEVEL bracket besides the base
  if (brackets.length < 2) return null;
  
  return {
    brackets,
    abilityIndexToBracket,
    levelUpLineIndex: levelUpIdx,
  };
}

/* Parse spacecraft station abilities from ability lines.
   Scryfall oracle text format (after reminder text stripping):
     Station
     2+ | Other creatures you control get +1/+1.
     12+ | Flying, lifelink
   "N+ | ability" on the same line, gated by charge counters >= N (cumulative).
   The creature transformation threshold comes from reminder text "artifact creature at N+".
   Returns object with:
     stationLineIndex: index of the "Station" keyword line
     thresholds: Map<abilityIndex, {min, abilityText}>
     abilityIndexToBracket: Map<abilityIndex, minCharge>  (-1 for keyword line)
     creatureThreshold: N from "artifact creature at N+" or null
   Or null if not a station card. */
function _parseSpacecraftStations(abilities, rawOracleText) {
  // Find the "Station" keyword line
  const stationKeyIdx = abilities.findIndex(a => /^Station$/i.test(a.trim()));
  if (stationKeyIdx < 0) return null;

  const stationAbilityRegex = /^(\d+)\+\s*\|\s*(.+)$/;
  const thresholds = new Map(); // abilityIndex → { min, abilityText }
  const abilityIndexToBracket = new Map();
  abilityIndexToBracket.set(stationKeyIdx, -1); // keyword line always active

  // First pass: find all N+ | lines and their thresholds
  let currentMin = -1; // track current threshold for subsequent lines
  let foundFirstThreshold = false;
  for (let i = 0; i < abilities.length; i++) {
    if (i === stationKeyIdx) continue;
    // Lines before the Station keyword are not station-gated
    if (i < stationKeyIdx) continue;
    const match = abilities[i].match(stationAbilityRegex);
    if (match) {
      const min = parseInt(match[1], 10);
      const abilityText = match[2].trim();
      thresholds.set(i, { min, abilityText });
      abilityIndexToBracket.set(i, min);
      currentMin = min;
      foundFirstThreshold = true;
    } else if (foundFirstThreshold && currentMin >= 0 && abilities[i].trim()) {
      // Subsequent line after a N+ | line inherits the same threshold
      thresholds.set(i, { min: currentMin, abilityText: abilities[i].trim() });
      abilityIndexToBracket.set(i, currentMin);
    }
  }

  if (thresholds.size === 0) return null;

  // Extract creature threshold from raw oracle text reminder: "It's an artifact creature at N+."
  let creatureThreshold = null;
  if (rawOracleText) {
    const ctMatch = rawOracleText.match(/it'?s an artifact creature at (\d+)\+/i);
    if (ctMatch) {
      creatureThreshold = parseInt(ctMatch[1], 10);
    }
  }

  return {
    stationLineIndex: stationKeyIdx,
    thresholds,
    abilityIndexToBracket,
    creatureThreshold,
  };
}

/* Scan oracle text for special counter type names (e.g., "slumber counter", "lore counter") */
function _extractOracleCounterTypes(oracleText, subtypes, types) {
  const found = new Set();
  // Auto-add lore counters for Sagas
  if (subtypes && subtypes.includes('Saga')) found.add('lore');
  // Auto-add loyalty counters for Planeswalkers
  if (types && types.includes('Planeswalker')) found.add('loyalty');
  if (!oracleText) return [...found];
  // Match P/T counter patterns: +N/+N, -N/-N, +N/+0, etc.
  const ptRegex = /([+-]\d+\/[+-]\d+)\s+counters?\b/gi;
  let ptm;
  while ((ptm = ptRegex.exec(oracleText)) !== null) {
    found.add(ptm[1]);
  }
  // Match "[word] counter(s)" patterns
  const regex = /\b(\w+)\s+counters?\b/gi;
  let m;
  while ((m = regex.exec(oracleText)) !== null) {
    const word = m[1].toLowerCase();
    // Skip generic/structural words
    const SKIP = new Set(['a', 'an', 'the', 'that', 'each', 'all', 'every', 'another',
      'its', 'more', 'no', 'those', 'these', 'this', 'any', 'such',
      'many', 'fewer', 'other', 'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten', 'with', 'or', 'and', 'of']);
    if (SKIP.has(word)) continue;
    // Skip +1/+1 and -1/-1 style (already in presets)
    if (/^[+-]?\d+$/.test(word)) continue;
    // Skip keyword abilities already in COUNTER_PRESETS
    const PRESET_TYPES = new Set(['+1/+1', '-1/-1', 'flying', 'first strike', 'double strike',
      'deathtouch', 'haste', 'hexproof', 'indestructible', 'lifelink', 'menace', 'reach',
      'trample', 'vigilance', 'defender', 'shield']);
    if (PRESET_TYPES.has(word)) continue;
    found.add(word);
  }
  return [...found];
}

/* Fix 4: Replace proper nouns in oracle text that match any word in the card name.
   E.g. "Blizidrox gets +2/+0" -> "this card gets +2/+0" if card is "Blizidrox, the Wyvern King"
   Uses "this token" for token cards, "this card" for all others.
   The replacement signals that the card is talking about itself. */
function _replaceProperNounSelfRef(cardName, oracleText, isToken = false) {
  if (!cardName || !oracleText) return oracleText;
  const selfWord = isToken ? 'this token' : 'this card';
  // Normalize curly apostrophes (U+2019) to straight for consistent matching
  // Scryfall uses curly in oracle text but card.name may use straight quotes
  const normalizedName = cardName.replace(/\u2019/g, "'");
  let result = oracleText.replace(/\u2019/g, "'");
  // Get first word of the name (the unique proper noun) and the full name
  // Try full name first, then first word (for "Blizidrox, the Wyvern King" -> "Blizidrox")
  const candidates = [normalizedName];
  const commaIdx = normalizedName.indexOf(',');
  if (commaIdx > 0) candidates.push(normalizedName.slice(0, commaIdx).trim());
  // Also try first word if it's a proper noun (capitalized, >2 chars)
  const firstWord = normalizedName.split(/[\s,]/)[0];
  if (firstWord.length > 2 && firstWord[0] === firstWord[0].toUpperCase() && !candidates.includes(firstWord)) {
    candidates.push(firstWord);
  }
  // Sort candidates longest first to prefer full matches
  candidates.sort((a, b) => b.length - a.length);
  for (const candidate of candidates) {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'g');
    if (!regex.test(result)) continue;
    // Only replace in subject position: start of line/sentence, after comma/semicolon,
    // or after clause words. NOT after "a/an", "is a", "becomes a", "type", "subtype".
    // This prevents replacing creature-type names (e.g. "is a colorless Noggle").
    result = result.replace(regex, (match, offset) => {
      // Check what comes before this match
      const before = result.substring(Math.max(0, offset - 30), offset);
      // Non-subject contexts: after articles, "is a/an", "becomes a", "colorless/color words"
      if (/\b(?:a|an|the|is\s+a|is\s+an|becomes?\s+a|becomes?\s+an|colorless|white|blue|black|red|green)\s*$/i.test(before)) {
        return match; // keep original, not a self-reference
      }
      // After "type" or "subtype" words
      if (/\b(?:the\s+type|the\s+subtype|type|subtype)\s*$/i.test(before)) {
        return match; // keep original
      }
      return selfWord;
    });
    break;
  }
  return result;
}

function parseTypeLine(typeLine) {
  const supertypeWords = ['Basic', 'Legendary', 'Snow', 'World', 'Ongoing'];
  // For multi-face type lines (e.g. "Enchantment — Room // Enchantment — Room"),
  // parse only the first face's type line (or the combined if no //)
  let effectiveTypeLine = typeLine;
  if (typeLine.includes(' // ')) {
    effectiveTypeLine = typeLine.split(' // ')[0].trim();
  }
  // Split on em-dash (U+2014), en-dash (U+2013), or similar separators
  const parts = effectiveTypeLine.split(/\s*[\u2014\u2013]\s*/).map(s => s.trim());
  if (parts.length === 1) {
    // Fallback: try splitting on " - " or other dash-like chars
    const fallback = effectiveTypeLine.split(/\s+[\u2014\u2013]\s+|\s+[-][-]\s+|\s+[-]\s+/).map(s => s.trim());
    if (fallback.length > 1) { parts.length = 0; parts.push(...fallback); }
  }
  const leftWords = (parts[0] || '').split(/\s+/).filter(Boolean);
  const supertypes = leftWords.filter(w => supertypeWords.includes(w));
  const types = leftWords.filter(w => !supertypeWords.includes(w) && w !== '//' && w !== 'Token');
  const subtypes = parts[1] ? parts[1].split(/\s+/).filter(Boolean) : [];
  
  // For multi-face cards, also grab types/subtypes from the second face
  if (typeLine.includes(' // ')) {
    const secondHalf = typeLine.split(' // ').slice(1).join(' // ').trim();
    const secondParts = secondHalf.split(/\s*[\u2014\u2013]\s*/).map(s => s.trim());
    const secondLeftWords = (secondParts[0] || '').split(/\s+/).filter(Boolean);
    for (const w of secondLeftWords) {
      if (supertypeWords.includes(w)) { if (!supertypes.includes(w)) supertypes.push(w); }
      else if (w !== '//' && w !== 'Token') { if (!types.includes(w)) types.push(w); }
    }
    if (secondParts[1]) {
      for (const w of secondParts[1].split(/\s+/).filter(Boolean)) {
        if (!subtypes.includes(w)) subtypes.push(w);
      }
    }
  }
  
  return { supertypes, types, subtypes };
}

/* Strip reminder text (parenthesized text) from oracle text.
   In MTG, parentheses in oracle text are exclusively reminder text and have no rules meaning. */
function _stripReminderText(text) {
  if (!text) return text;
  return text.replace(/\s*\([^)]*\)/g, '').replace(/  +/g, ' ').trim();
}

function extractAbilities(oracleText) {
  if (!oracleText) return [];
  return _stripReminderText(oracleText).split('\n').map(line => line.trim()).filter(Boolean);
}

/* CR 305.6: Basic land subtypes grant intrinsic mana abilities.
   Scryfall puts these in parentheses (reminder text) which gets stripped,
   so we re-add them based on the card's subtypes. */
function _addIntrinsicLandMana(abilities, subtypes) {
  if (typeof BASIC_LAND_MANA === 'undefined') return;
  for (const st of subtypes) {
    if (BASIC_LAND_MANA[st] && !abilities.includes(BASIC_LAND_MANA[st])) {
      abilities.push(BASIC_LAND_MANA[st]);
    }
  }
}
/* [END: PERMANENT] */

/* [KEY: PARSE]  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Convert a card's oracle text into Effect objects.
   Uses KNOWN_ABILITY_EFFECTS first (per-ability-line matching), then generic regex patterns.
   "You control" is interpreted as applying to the inspected permanent.
   Changeling creatures match every creature subtype check. */

const CARD_TYPE_WORDS = {
  'land': { check: 'type', value: 'Land' },
  'lands': { check: 'type', value: 'Land' },
  'creature': { check: 'type', value: 'Creature' },
  'creatures': { check: 'type', value: 'Creature' },
  'artifact': { check: 'type', value: 'Artifact' },
  'artifacts': { check: 'type', value: 'Artifact' },
  'enchantment': { check: 'type', value: 'Enchantment' },
  'enchantments': { check: 'type', value: 'Enchantment' },
  'planeswalker': { check: 'type', value: 'Planeswalker' },
  'planeswalkers': { check: 'type', value: 'Planeswalker' },
  'permanent': { check: 'any', value: null },
  'permanents': { check: 'any', value: null },
};
const LAND_SUBTYPE_WORDS = {
  'plains': 'Plains', 'island': 'Island', 'islands': 'Island',
  'swamp': 'Swamp', 'swamps': 'Swamp',
  'mountain': 'Mountain', 'mountains': 'Mountain',
  'forest': 'Forest', 'forests': 'Forest',
  'cave': 'Cave', 'caves': 'Cave',
  'desert': 'Desert', 'deserts': 'Desert',
  'gate': 'Gate', 'gates': 'Gate',
};

/* Fix 10: Check if a filter/subject text references permanents or permanent types.
   Used to skip non-permanent "is/are" clauses like "each opponent's hand size is increased by 5". */
function filterReferencesPermanents(filterText) {
  const f = filterText.toLowerCase().trim()
    .replace(/^(?:all|each|every|other)\s+/, '')
    .replace(/\s+you (?:control|own)(?=\s|$)/g, '');
  // Direct card type words — check at start, end, or as a standalone word within
  for (const w of Object.keys(CARD_TYPE_WORDS)) {
    if (f === w || f.endsWith(' ' + w) || f.startsWith(w + ' ') || f.includes(' ' + w + ' ')) return true;
  }
  // Land subtype words
  for (const w of Object.keys(LAND_SUBTYPE_WORDS)) {
    if (f === w || f.endsWith(' ' + w) || f.startsWith(w + ' ') || f.includes(' ' + w + ' ')) return true;
  }
  // Known creature subtypes (from TypeCatalog)
  if (typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0) {
    const words = f.split(/\s+/);
    for (const w of words) {
      const cap = w.charAt(0).toUpperCase() + w.slice(1).replace(/s$/, '');
      if (TypeCatalog.creatureTypes.has(cap)) return true;
      if (TypeCatalog.creatureTypes.has(w.charAt(0).toUpperCase() + w.slice(1))) return true;
    }
  }
  // Self-references
  if (/^(this creature|this permanent|this card|this token|it|itself|enchanted|equipped)/.test(f)) return true;
  // "non-[type]" patterns
  if (/^non-?\w+/.test(f)) {
    const inner = f.replace(/^non-?/, '');
    for (const w of Object.keys(CARD_TYPE_WORDS)) {
      if (inner === w || inner.startsWith(w)) return true;
    }
  }
  // Supertype words that indicate permanents
  if (/\b(legendary|basic|snow|token)\b/.test(f)) return true;
  // "commander" / "commanders" reference permanents in commander games
  if (/\bcommanders?\b/.test(f)) return true;
  return false;
}

/* Singularize creature type words. Handles irregular MTG plurals.
   Input: lowercase word (e.g. "elves", "humans", "wolves")
   Output: Title-cased singular (e.g. "Elf", "Human", "Wolf") */
const IRREGULAR_PLURALS = {
  'elves': 'Elf', 'dwarves': 'Dwarf', 'wolves': 'Wolf', 'halves': 'Half',
  'selves': 'Self', 'leaves': 'Leaf', 'knives': 'Knife', 'lives': 'Life',
  'thieves': 'Thief', 'calves': 'Calf', 'loaves': 'Loaf', 'hooves': 'Hoof',
  'werewolves': 'Werewolf', 'mice': 'Mouse', 'lice': 'Louse', 'geese': 'Goose',
  'oxen': 'Ox', 'children': 'Child', 'fungi': 'Fungus', 'cacti': 'Cactus',
  'octopi': 'Octopus', 'hippopotami': 'Hippo', 'djinn': 'Djinn',
  'efreet': 'Efreet', 'efreets': 'Efreet', 'sheep': 'Sheep', 'fish': 'Fish',
  'merfolk': 'Merfolk', 'kithkin': 'Kithkin', 'samurai': 'Samurai',
  'allies': 'Ally', 'faeries': 'Faerie', 'zombies': 'Zombie',
  'harpies': 'Harpy', 'valkyries': 'Valkyrie', 'banshees': 'Banshee',
  'gargoyles': 'Gargoyle',
};
function singularizeCreatureType(word) {
  const low = word.toLowerCase();
  // Check irregular map first
  if (IRREGULAR_PLURALS[low]) return IRREGULAR_PLURALS[low];
  const cap = low.charAt(0).toUpperCase() + low.slice(1);
  // Check TypeCatalog before stripping trailing s -- some types end in s (e.g. "Fungus")
  if (typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.has(cap)) return cap;
  // Remove trailing 's' for standard plurals (e.g. "Goblins" -> "Goblin")
  if (low.endsWith('s') && low.length > 2) {
    const withoutS = low.slice(0, -1);
    return withoutS.charAt(0).toUpperCase() + withoutS.slice(1);
  }
  return cap;
}

/* Reverse map: singular ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ irregular plural form. Built from IRREGULAR_PLURALS. */
const SINGULAR_TO_PLURAL = {};
for (const [plural, singular] of Object.entries(IRREGULAR_PLURALS)) {
  const singLow = singular.toLowerCase();
  if (!SINGULAR_TO_PLURAL[singLow] || plural.length > SINGULAR_TO_PLURAL[singLow].length) {
    SINGULAR_TO_PLURAL[singLow] = plural.charAt(0).toUpperCase() + plural.slice(1);
  }
}

/* Pluralize a creature type name.
   "Elf" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Elves", "Dwarf" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Dwarves", "Goblin" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Goblins", "Merfolk" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Merfolk" */
function pluralizeCreatureType(singular) {
  const low = singular.toLowerCase();
  const sameForm = ['merfolk', 'kithkin', 'samurai', 'djinn', 'efreet', 'sheep', 'fish'];
  if (sameForm.includes(low)) return singular;
  if (SINGULAR_TO_PLURAL[low]) return SINGULAR_TO_PLURAL[low];
  if (low.endsWith('s') || low.endsWith('x') || low.endsWith('z') || low.endsWith('sh') || low.endsWith('ch')) {
    return singular + 'es';
  }
  if (low.endsWith('y') && !'aeiou'.includes(low[low.length - 2])) {
    return singular.slice(0, -1) + 'ies';
  }
  return singular + 's';
}

/* Build all fromÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢to pairs for a creature type replacement, including plural forms.
   E.g. from="Wyvern", to="Elf" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ [{ from: "Wyvern", to: "Elf" }, { from: "Wyverns", to: "Elves" }]
   Ensures text like "Other Wyverns get +1/+1" properly becomes "Other Elves get +1/+1". */
function buildCreatureTypeReplacementPairs(from, to) {
  const fromSingular = singularizeCreatureType(from);
  const toSingular = singularizeCreatureType(to);
  const fromPlural = pluralizeCreatureType(fromSingular);
  const toPlural = pluralizeCreatureType(toSingular);
  const pairs = [{ from: fromSingular, to: toSingular }];
  if (fromPlural.toLowerCase() !== fromSingular.toLowerCase() ||
      toPlural.toLowerCase() !== toSingular.toLowerCase()) {
    pairs.push({ from: fromPlural, to: toPlural });
  }
  return pairs;
}

/* Build singular+plural replacement pairs for basic land type words.
   Handles the "Plains" edge case: singular and plural are the same word,
   so we use word-boundary context ("Plains" alone = singular "Swamp",
   but the engine's substring regex handles "Mountains" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Islands" naturally
   since "Mountain" is a substring of "Mountains").
   For PlainsÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢Swamp specifically: we must also generate "Plains"ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢"Swamps"
   as a separate plural-form pair, relying on context or longest-match. */
const LAND_SINGULAR_TO_PLURAL = {
  'plains': 'Plains',   // same form ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â special case
  'island': 'Islands',
  'swamp': 'Swamps',
  'mountain': 'Mountains',
  'forest': 'Forests',
};
const LAND_PLURAL_TO_SINGULAR = {};
for (const [s, p] of Object.entries(LAND_SINGULAR_TO_PLURAL)) {
  LAND_PLURAL_TO_SINGULAR[p.toLowerCase()] = s.charAt(0).toUpperCase() + s.slice(1);
}

function buildLandTypeReplacementPairs(from, to) {
  const fromLow = from.toLowerCase();
  const toLow = to.toLowerCase();
  // Only expand for land type words
  const landWords = ['plains', 'island', 'swamp', 'mountain', 'forest'];
  if (!landWords.includes(fromLow) || !landWords.includes(toLow)) {
    return [{ from, to }]; // not land types, return as-is
  }
  const fromSingular = LAND_PLURAL_TO_SINGULAR[fromLow]
    || from.charAt(0).toUpperCase() + from.slice(1);
  const toSingular = LAND_PLURAL_TO_SINGULAR[toLow]
    || to.charAt(0).toUpperCase() + to.slice(1);
  const fromPlural = LAND_SINGULAR_TO_PLURAL[fromSingular.toLowerCase()] || fromSingular + 's';
  const toPlural = LAND_SINGULAR_TO_PLURAL[toSingular.toLowerCase()] || toSingular + 's';
  const pairs = [];
  if (fromPlural.toLowerCase() !== fromSingular.toLowerCase()) {
    // Different singular/plural forms (Mountain/Mountains) ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â add both pairs
    pairs.push({ from: fromSingular, to: toSingular });
    pairs.push({ from: fromPlural, to: toPlural });
  } else {
    // Same singular/plural form (Plains) ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â single pair with pluralTo for context detection
    pairs.push({ from: fromSingular, to: toSingular, pluralTo: toPlural });
  }
  return pairs;
}

/* [KEY: TARGET-EXTRACT] — Extract "target"/"choose" metadata from filter text.
   Returns { cleaned, needsTargetSelection, maxTargets }.
   The cleaned text has "target"/"a target" stripped so buildAppliesToFromText can parse the type filter.
   "choose a creature" is normalized to the same output as "target creature". */
const _TARGET_NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
function extractTargetInfo(filterText) {
  const raw = filterText.toLowerCase().trim();
  let needsTargetSelection = false;
  let maxTargets = 1;
  let cleaned = filterText;

  // "up to N other target [type]" — e.g. "up to one other target creature" (Abigale)
  const upToOtherTargetMatch = raw.match(/^up to (\w+)\s+other\s+target\s+/i);
  if (upToOtherTargetMatch) {
    needsTargetSelection = true;
    const numWord = upToOtherTargetMatch[1].toLowerCase();
    maxTargets = _TARGET_NUMBER_WORDS[numWord] || parseInt(numWord) || 1;
    cleaned = filterText.replace(/^up to \w+\s+other\s+target\s+/i, '').trim();
    return { cleaned, needsTargetSelection, maxTargets };
  }

  // "up to N target [type]" — multi-target
  const upToTargetMatch = raw.match(/^up to (\w+)\s+target\s+/i);
  if (upToTargetMatch) {
    needsTargetSelection = true;
    const numWord = upToTargetMatch[1].toLowerCase();
    maxTargets = _TARGET_NUMBER_WORDS[numWord] || parseInt(numWord) || 1;
    cleaned = filterText.replace(/^up to \w+\s+target\s+/i, '').trim();
    return { cleaned, needsTargetSelection, maxTargets };
  }

  // "N target [type]" — exact count multi-target (e.g. "two target creatures")
  const nTargetMatch = raw.match(/^(\w+)\s+target\s+/i);
  if (nTargetMatch && _TARGET_NUMBER_WORDS[nTargetMatch[1].toLowerCase()]) {
    needsTargetSelection = true;
    maxTargets = _TARGET_NUMBER_WORDS[nTargetMatch[1].toLowerCase()];
    cleaned = filterText.replace(/^\w+\s+target\s+/i, '').trim();
    return { cleaned, needsTargetSelection, maxTargets };
  }

  // "target [type]" or "a target [type]" or "another target [type]" — single target
  const plainTargetMatch = raw.match(/^(?:a\s+|another\s+)?target\s+(.+)/i);
  if (plainTargetMatch) {
    needsTargetSelection = true;
    cleaned = plainTargetMatch[1].trim();
    return { cleaned, needsTargetSelection, maxTargets };
  }

  // "choose a [type] you control" / "choose [N] [type]" — choose pattern
  const chooseMatch = raw.match(/^choose\s+(?:a|an|up to (\w+))\s+(.+?)(?:\s+you (?:control|own))?$/i);
  if (chooseMatch) {
    needsTargetSelection = true;
    if (chooseMatch[1]) {
      const numWord = chooseMatch[1].toLowerCase();
      maxTargets = _TARGET_NUMBER_WORDS[numWord] || parseInt(numWord) || 1;
    }
    cleaned = chooseMatch[2].trim();
    return { cleaned, needsTargetSelection, maxTargets };
  }

  return { cleaned, needsTargetSelection, maxTargets };
}
/* [END: TARGET-EXTRACT] */

function buildAppliesToFromText(filterText) {
  // Extract target/choose metadata first
  const _tinfo = extractTargetInfo(filterText);
  const _result = _buildAppliesToFromTextInner(_tinfo.cleaned);
  // Attach targeting metadata to the result
  if (_tinfo.needsTargetSelection) {
    _result.needsTargetSelection = true;
    _result.maxTargets = _tinfo.maxTargets;
    // "target creature" is a targeted effect, similar to "enchanted creature"
    _result.isTargeted = true;
    // Mark as spell-target (not aura/equipment) so parsers can set targetRestriction
    _result.isSpellTarget = true;
  }
  // Multiplayer: wrap "you control" filter with controller check.
  // The inner function already handles "opponents control" directly.
  // For "you control", wrap the type filter so it only matches permanents
  // controlled by the effect's source controller (passed as 3rd arg by engine.js).
  const rawLower = filterText.toLowerCase();
  if (!_result.isOpponentsControl && !_result.isSelf && !_result.isTargeted &&
      /\byou (?:control|own)\b/.test(rawLower) && _result.fn) {
    const innerFn = _result.fn;
    _result.fn = (p, allStates, effectCtrl) => {
      if (effectCtrl && p.controller !== effectCtrl) return false;
      return innerFn(p, allStates, effectCtrl);
    };
    _result.isYouControl = true;
  }
  return _result;
}

function _buildAppliesToFromTextInner(filterText) {
  const raw = filterText.toLowerCase().trim();
  // Fix 5: Detect "your opponents control"  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  mark effect but return empty (nothing applies)
  const opponentsControl = raw.includes('your opponents control') || raw.includes("opponents' control")
    || raw.includes("opponent controls") || raw.includes("opponents control")
    || /\bopponent'?s?\b/.test(raw);
  const youControl = !opponentsControl && (/\byou (?:control|own)\b/.test(raw));
  const f = raw
    .replace(/^(?:all|each|every|up to \w+( other)?)\s+/, '')
    .replace(/\s+you (?:control|own)(?=\s|$)/g, '')
    .replace(/\s+your opponents control(?=\s|$)/g, '')
    .replace(/\s+opponents control(?=\s|$)/g, '')
    .replace(/^(?:other|another)\s+/, '');

  // --- "this creature" / "this permanent" / "it" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ selfTarget ---
  if (/^(this creature|this permanent|this card|this token|it|itself|that creature|that permanent)$/.test(f)) {
    return { fn: () => true, desc: 'Applies to: this permanent (self)', isSelf: true };
  }
  // "enchanted creature" and "equipped creature" are targeted (apply to attached permanent, not self)
  // Matches any "enchanted/equipped [optional-non-prefix] [type-word]" pattern
  if (/^(?:equipped|enchanted)\s+(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle)$/.test(f)) {
    return { fn: () => true, desc: `Applies to: ${f}`, isSelf: false, isTargeted: true };
  }

  // "enchanted creatures" / "equipped creatures" (plural) = filter for creatures with the Enchanted/Equipped trait
  const enchEquipPluralMatch = f.match(/^(enchanted|equipped)\s+(.+)$/);
  if (enchEquipPluralMatch) {
    const traitName = enchEquipPluralMatch[1] === 'enchanted' ? 'Enchanted' : 'Equipped';
    const typeWord = enchEquipPluralMatch[2].replace(/s$/, '');
    const typeInfo = CARD_TYPE_WORDS[typeWord] || CARD_TYPE_WORDS[enchEquipPluralMatch[2]];
    if (typeInfo && typeInfo.check === 'type') {
      return {
        fn: (p) => p.types.includes(typeInfo.value) && (p.traits || []).includes(traitName),
        desc: `Applies to: ${f} (${traitName.toLowerCase()} ${typeInfo.value}s)`,
      };
    }
    // Fallback: match any permanent with the trait
    return {
      fn: (p) => (p.traits || []).includes(traitName),
      desc: `Applies to: ${f} (${traitName.toLowerCase()} permanents)`,
    };
  }

  // --- Fix 5: "your opponents control"  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  nothing on your battlefield matches, but track it ---
  if (opponentsControl) {
    // Multiplayer: applies to permanents controlled by a different player than the effect's source
    // The 3rd argument (effectCtrl) is passed by effectAppliesToPerm in engine.js
    return {
      fn: (p, allStates, effectCtrl) => p.controller !== (effectCtrl || p.controller),
      desc: 'Applies to: permanents opponents control',
      isOpponentsControl: true,
    };
  }

  // --- "and/or" conditions: "Elves and/or Goblins" ---
  if (f.includes(' and/or ')) {
    const parts = f.split(/\s+and\/or\s+/);
    if (parts.length === 2) {
      const a = buildAppliesToFromText(parts[0]);
      const b = buildAppliesToFromText(parts[1]);
      if (!a.isFallback && !b.isFallback) {
        return {
          fn: (p) => a.fn(p) || b.fn(p),
          desc: `Applies to: ${a.desc.replace('Applies to: ', '')} OR ${b.desc.replace('Applies to: ', '')}`,
        };
      }
    }
  }

  // --- OR conditions: "Islands and Leviathans", "Elves and Goblins" ---
  // Also handles compound filters with trailing qualifiers:
  //   "non-Equipment artifact and non-Aura enchantment with mana value 4 or greater"
  //   → the "with ..." qualifier applies to the whole compound, not just the last part
  if (f.includes(' and ') && !f.includes(' and have') && !f.includes(' and get') && !f.includes(' and gain')) {
    // Extract trailing "with mana value/power/toughness N or greater/less" before splitting
    const trailingQualifier = f.match(/\s+with\s+(?:mana\s+value|converted\s+mana\s+cost|power|toughness)\s+\d+\s+or\s+(?:greater|more|less|fewer)$/);
    const baseF = trailingQualifier ? f.substring(0, trailingQualifier.index) : f;
    const parts = baseF.split(/\s+and\s+/);
    if (parts.length === 2) {
      const a = buildAppliesToFromText(parts[0]);
      const b = buildAppliesToFromText(parts[1]);
      if (!a.isFallback && !b.isFallback) {
        let combinedFn = (p) => a.fn(p) || b.fn(p);
        let combinedDesc = `${a.desc.replace('Applies to: ', '')} OR ${b.desc.replace('Applies to: ', '')}`;
        // If there was a trailing qualifier, wrap the combined filter with it
        if (trailingQualifier) {
          const qualText = trailingQualifier[0].trim();
          const mvMatch = qualText.match(/with\s+(?:mana\s+value|converted\s+mana\s+cost)\s+(\d+)\s+or\s+(greater|more|less|fewer)/);
          const pwMatch = qualText.match(/with\s+power\s+(\d+)\s+or\s+(greater|more|less|fewer)/);
          const thMatch = qualText.match(/with\s+toughness\s+(\d+)\s+or\s+(greater|more|less|fewer)/);
          const innerFn = combinedFn;
          if (mvMatch) {
            const val = parseInt(mvMatch[1]);
            const isGreater = /greater|more/.test(mvMatch[2]);
            combinedFn = (p) => innerFn(p) && (isGreater ? (p.manaValue || 0) >= val : (p.manaValue || 0) <= val);
            combinedDesc += ` with mana value ${isGreater ? val + '+' : val + '-'}`;
          } else if (pwMatch) {
            const val = parseInt(pwMatch[1]);
            const isGreater = /greater|more/.test(pwMatch[2]);
            combinedFn = (p) => innerFn(p) && p.power !== null && p.power !== undefined && (isGreater ? p.power >= val : p.power <= val);
            combinedDesc += ` with power ${isGreater ? val + '+' : val + '-'}`;
          } else if (thMatch) {
            const val = parseInt(thMatch[1]);
            const isGreater = /greater|more/.test(thMatch[2]);
            combinedFn = (p) => innerFn(p) && p.toughness !== null && p.toughness !== undefined && (isGreater ? p.toughness >= val : p.toughness <= val);
            combinedDesc += ` with toughness ${isGreater ? val + '+' : val + '-'}`;
          }
        }
        return {
          fn: combinedFn,
          desc: `Applies to: ${combinedDesc}`,
        };
      }
    }
  }

  // --- OR with "or": "Elves or Goblins" ---
  if (f.includes(' or ') && !f.includes('more or') && !/\d+\s+or\s+(?:greater|more|less|fewer)/i.test(f)) {
    const parts = f.split(/\s+or\s+/);
    if (parts.length === 2) {
      const a = buildAppliesToFromText(parts[0]);
      const b = buildAppliesToFromText(parts[1]);
      if (!a.isFallback && !b.isFallback) {
        return {
          fn: (p) => a.fn(p) || b.fn(p),
          desc: `Applies to: ${a.desc.replace('Applies to: ', '')} OR ${b.desc.replace('Applies to: ', '')}`,
        };
      }
    }
  }

  // --- Power/toughness filters: "creatures with power 4 or greater" ---
  const powerFilter = f.match(/^(.+?)\s+with\s+power\s+(\d+)\s+or\s+(?:greater|more)$/);
  if (powerFilter) {
    const baseFilter = buildAppliesToFromText(powerFilter[1]);
    const minPower = parseInt(powerFilter[2]);
    return {
      fn: (p) => baseFilter.fn(p) && p.power !== null && p.power !== undefined && p.power >= minPower,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with power ${minPower}+`,
    };
  }
  const toughnessFilter = f.match(/^(.+?)\s+with\s+toughness\s+(\d+)\s+or\s+(?:greater|more)$/);
  if (toughnessFilter) {
    const baseFilter = buildAppliesToFromText(toughnessFilter[1]);
    const minToughness = parseInt(toughnessFilter[2]);
    return {
      fn: (p) => baseFilter.fn(p) && p.toughness !== null && p.toughness !== undefined && p.toughness >= minToughness,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with toughness ${minToughness}+`,
    };
  }
  // --- Mana value filters: "artifacts with mana value 3 or greater" ---
  const manaValueFilter = f.match(/^(.+?)\s+with\s+(?:mana\s+value|converted\s+mana\s+cost)\s+(\d+)\s+or\s+(?:greater|more)$/);
  if (manaValueFilter) {
    const baseFilter = buildAppliesToFromText(manaValueFilter[1]);
    const minMV = parseInt(manaValueFilter[2]);
    return {
      fn: (p) => baseFilter.fn(p) && (p.manaValue || 0) >= minMV,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with mana value ${minMV}+`,
    };
  }
  const manaValueLessFilter = f.match(/^(.+?)\s+with\s+(?:mana\s+value|converted\s+mana\s+cost)\s+(\d+)\s+or\s+(?:less|fewer)$/);
  if (manaValueLessFilter) {
    const baseFilter = buildAppliesToFromText(manaValueLessFilter[1]);
    const maxMV = parseInt(manaValueLessFilter[2]);
    return {
      fn: (p) => baseFilter.fn(p) && (p.manaValue || 0) <= maxMV,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with mana value ${maxMV}-`,
    };
  }

  // --- "with no abilities" filter: "creatures with no abilities" ---
  const noAbilitiesFilter = f.match(/^(.+?)\s+with\s+no\s+abilit(?:y|ies)$/);
  if (noAbilitiesFilter) {
    const baseFilter = buildAppliesToFromText(noAbilitiesFilter[1]);
    return {
      fn: (p) => baseFilter.fn(p) && p.abilities.length === 0,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with no abilities`,
    };
  }

  // --- Counter filters: "creatures with a +1/+1 counter on it/them" ---
  const counterFilter = f.match(/^(.+?)\s+with\s+(?:a\s+)?([\w+/]+)\s+counter(?:s)?\s+on\s+(?:it|them)$/);
  if (counterFilter) {
    const baseFilter = buildAppliesToFromText(counterFilter[1]);
    const counterType = counterFilter[2];
    return {
      fn: (p) => baseFilter.fn(p) && p.counters && p.counters[counterType] && p.counters[counterType] > 0,
      desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with ${counterType} counters`,
    };
  }

  // --- Keyword ability filters: "creatures with flying", "creatures with haste" ---
  // Matches "with [keyword]" where keyword is a recognized MTG keyword ability.
  const FILTER_KEYWORDS = new Set([
    'flying', 'first strike', 'double strike', 'deathtouch', 'haste',
    'hexproof', 'indestructible', 'lifelink', 'menace', 'reach',
    'trample', 'vigilance', 'flash', 'defender', 'fear', 'intimidate',
    'shroud', 'wither', 'infect', 'prowess', 'shadow', 'horsemanship',
    'flanking', 'phasing', 'banding', 'undying', 'persist', 'skulk',
    'changeling', 'partner', 'decayed', 'training', 'toxic',
  ]);
  const withKeywordFilter = f.match(/^(.+?)\s+with\s+(.+)$/);
  if (withKeywordFilter) {
    const kwCandidate = withKeywordFilter[2].toLowerCase().trim();
    if (FILTER_KEYWORDS.has(kwCandidate)) {
      const baseFilter = buildAppliesToFromText(withKeywordFilter[1]);
      const kw = kwCandidate;
      return {
        fn: (p) => baseFilter.fn(p) && p.abilities.some(a => a.toLowerCase().trim() === kw),
        desc: `Applies to: ${baseFilter.desc.replace('Applies to: ', '')} with ${kw}`,
      };
    }
  }

  // --- Complex multi-qualifier: "non-human artifact enchantment creatures" ---
  // Tokenize the filter and build a set of required types, subtypes, and negations
  const words = f.split(/\s+/);
  const requiredTypes = [];
  const requiredSubtypes = [];
  const requiredSupertypes = [];
  const requiredColors = [];
  const requiredTraits = [];
  const negatedTypes = [];
  const negatedSubtypes = [];
  const negatedSupertypes = [];
  const negatedColors = [];
  let requireNontoken = false;
  let requireToken = false;
  let requireCommander = false;
  let requireTapped = false;
  let requireUntapped = false;
  let baseTypeWord = null;
  let hasNegation = false;
  const FILTER_COLOR_MAP = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };

  for (let i = 0; i < words.length; i++) {
    let word = words[i].replace(/,$/, ''); // strip trailing commas ("noncreature," → "noncreature")
    if (!word) continue;
    let isNeg = false;

    // Detect "non-" or "non" prefix
    if (word.startsWith('non-') || word.startsWith('non')) {
      const afterNon = word.startsWith('non-') ? word.slice(4) : word.slice(3);
      if (afterNon === 'token' || afterNon === 'tokens') { requireNontoken = true; continue; }
      if (afterNon.length > 0) {
        word = afterNon;
        isNeg = true;
        hasNegation = true;
      }
    }

    const singular = word.replace(/s$/, '');
    const typeInfo = CARD_TYPE_WORDS[word] || CARD_TYPE_WORDS[singular];
    const landSub = LAND_SUBTYPE_WORDS[word] || LAND_SUBTYPE_WORDS[singular];
    const cap = word.charAt(0).toUpperCase() + word.slice(1);

    if (typeInfo) {
      if (typeInfo.check === 'any') {
        baseTypeWord = 'any';
      } else if (isNeg) {
        negatedTypes.push(typeInfo.value);
      } else {
        // Last type word is the "base type" (e.g. "artifact enchantment creatures" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Creature is base)
        baseTypeWord = typeInfo.value;
        requiredTypes.push(typeInfo.value);
      }
    } else if (landSub) {
      if (isNeg) negatedSubtypes.push(landSub);
      else requiredSubtypes.push(landSub);
    } else if (word === 'nontoken' || singular === 'nontoken') {
      requireNontoken = true;
    } else if (word === 'token' || singular === 'token') {
      requireToken = true;
    } else if (word === 'commander' || word === 'commanders') {
      requireCommander = true;
    } else if (['basic', 'legendary', 'snow', 'world'].includes(singular)) {
      if (isNeg) negatedSupertypes.push(cap);
      else requiredSupertypes.push(cap);
    } else if (FILTER_COLOR_MAP[singular]) {
      // Color words: "white", "blue", "black", "red", "green"
      if (isNeg) negatedColors.push(FILTER_COLOR_MAP[singular]);
      else requiredColors.push(FILTER_COLOR_MAP[singular]);
    } else if (word === 'attacking' || word === 'attackers' || word === 'attacker') {
      // Trait-based filter: creature has 'Attacking' trait (set by toggleAttacking)
      requiredTraits.push('Attacking');
    } else if (word === 'blocking' || word === 'blockers' || word === 'blocker') {
      // Trait-based filter: creature has 'Blocking' trait (set by toggleBlocking)
      requiredTraits.push('Blocking');
    } else if (word === 'tapped') {
      requireTapped = true;
    } else if (word === 'untapped') {
      requireUntapped = true;
    } else {
      // Assume creature subtype
      const subtype = singularizeCreatureType(word);
      const knownGenerics = ['creature', 'permanent', 'land', 'artifact', 'enchantment',
        'a', 'an', 'the', 'each', 'every', 'all', 'those', 'these', 'that', 'also',
        'are', 'is', 'has', 'have', 'with', 'or', 'and', 'its', 'their', 'other',
        'it', 'they', 'was', 'were', 'been', 'being'];
      if (!knownGenerics.includes(singular) && !knownGenerics.includes(word)) {
        if (isNeg) negatedSubtypes.push(subtype);
        else requiredSubtypes.push(subtype);
      }
    }
  }

  // --- "nonbasic lands" / "non-basic lands" ---
  const nonMatch = f.match(/^non-?(\w+)\s+(\w+)s?$/);
  if (nonMatch && requiredTypes.length <= 1 && requiredSubtypes.length === 0) {
    const negated = nonMatch[1].charAt(0).toUpperCase() + nonMatch[1].slice(1);
    const baseWord = nonMatch[2].toLowerCase();
    const typeInfo = CARD_TYPE_WORDS[baseWord] || CARD_TYPE_WORDS[baseWord + 's'];
    if (typeInfo && typeInfo.check === 'type' && negated.toLowerCase() !== 'token') {
      // Fix 6: non-[creature subtype] should never match changelings / "all creature types"
      // Exception: if negated is a land subtype (non-Forest lands) or a supertype
      // (non-Basic lands), isAllCreatureTypes is irrelevant — having all creature types
      // doesn't make something a Forest or Basic.
      // "token" is excluded here: tokens are identified by p.isToken, not by a card type
      // named "Token". "nontoken creatures" must fall through to the nontokenMatch path.
      const isLandSub = Object.values(LAND_SUBTYPE_WORDS).includes(negated);
      const isSupertype = ['Basic', 'Legendary', 'Snow', 'World', 'Ongoing'].includes(negated);
      return {
        fn: (p) => p.types.includes(typeInfo.value) && !p.supertypes.includes(negated) && !p.types.includes(negated) && !p.subtypes.includes(negated) && (isLandSub || isSupertype || !p.isAllCreatureTypes),
        desc: `Applies to: non-${negated} ${typeInfo.value}s`,
      };
    }
  }

  // --- "nontoken creatures" ---
  const nontokenMatch = f.match(/^nontoken\s+(\w+)s?$/);
  if (nontokenMatch && requiredSubtypes.length === 0) {
    const baseWord = nontokenMatch[1].toLowerCase();
    const typeInfo = CARD_TYPE_WORDS[baseWord] || CARD_TYPE_WORDS[baseWord + 's'];
    if (typeInfo && typeInfo.check === 'type') {
      return {
        fn: (p) => p.types.includes(typeInfo.value) && !p.isToken,
        desc: `Applies to: nontoken ${typeInfo.value}s`,
      };
    }
  }

  // If we parsed multiple qualifiers, build a composite filter
  if (requiredTypes.length > 0 || requiredSubtypes.length > 0 || requiredSupertypes.length > 0 ||
      requiredColors.length > 0 || negatedColors.length > 0 || requiredTraits.length > 0 ||
      negatedTypes.length > 0 || negatedSubtypes.length > 0 || negatedSupertypes.length > 0 || requireNontoken || requireToken || requireCommander || requireTapped || requireUntapped) {
    const checks = [];
    const descParts = [];

    for (const t of requiredTypes) {
      checks.push((p) => p.types.includes(t));
      descParts.push(t);
    }
    for (const sup of requiredSupertypes) {
      checks.push((p) => p.supertypes.includes(sup));
      descParts.push(sup);
    }
    for (const c of requiredColors) {
      checks.push((p) => (p.colors || []).includes(c));
      descParts.push(c);
    }
    for (const c of negatedColors) {
      checks.push((p) => !(p.colors || []).includes(c));
      descParts.push(`non-${c}`);
    }
    for (const s of requiredSubtypes) {
      // Creature subtypes also check hasChangeling / isAllCreatureTypes
      const landSub = Object.values(LAND_SUBTYPE_WORDS).includes(s);
      const isCreatureSub = typeof TypeCatalog !== 'undefined' && TypeCatalog.loaded
        ? TypeCatalog.creatureTypes.has(s) : true; // fallback: assume creature type
      if (landSub) {
        checks.push((p) => p.subtypes.includes(s));
      } else if (isCreatureSub) {
        checks.push((p) => p.subtypes.includes(s) || p.isAllCreatureTypes);
      } else {
        // Non-creature subtype (e.g., Food, Treasure, Equipment): just check subtypes
        checks.push((p) => p.subtypes.includes(s));
      }
      descParts.push(s);
    }
    for (const t of negatedTypes) {
      checks.push((p) => !p.types.includes(t));
      descParts.push(`non-${t}`);
    }
    for (const s of negatedSubtypes) {
      checks.push((p) => !p.subtypes.includes(s) && !p.isAllCreatureTypes);
      descParts.push(`non-${s}`);
    }
    for (const s of negatedSupertypes) {
      checks.push((p) => !p.supertypes.includes(s));
      descParts.push(`non-${s}`);
    }
    for (const trait of requiredTraits) {
      checks.push((p) => (p.traits || []).includes(trait));
      descParts.push(trait.toLowerCase());
    }
    if (requireNontoken) {
      checks.push((p) => !p.isToken);
      descParts.push('nontoken');
    }
    if (requireToken) {
      checks.push((p) => p.isToken);
      descParts.push('token');
    }
    if (requireCommander) {
      checks.push((p) => p.isCommander);
      descParts.push('commander');
    }
    if (requireTapped) {
      checks.push((p) => p.tapped === true);
      descParts.push('tapped');
    }
    if (requireUntapped) {
      checks.push((p) => p.tapped === false);
      descParts.push('untapped');
    }

    if (checks.length > 0) {
      return {
        fn: (p) => checks.every(check => check(p)),
        desc: `Applies to: ${descParts.join(' ')}`,
      };
    }
  }

  // --- Simple single type word ---
  const singleWord = f.replace(/s$/, '');
  const typeInfo = CARD_TYPE_WORDS[f] || CARD_TYPE_WORDS[singleWord];
  if (typeInfo) {
    if (typeInfo.check === 'any') {
      return { fn: () => true, desc: 'Applies to: all permanents' };
    }
    return {
      fn: (p) => p.types.includes(typeInfo.value),
      desc: `Applies to: ${typeInfo.value}s`,
    };
  }

  // --- Simple land subtype ---
  const landSub = LAND_SUBTYPE_WORDS[f] || LAND_SUBTYPE_WORDS[singleWord];
  if (landSub) {
    return {
      fn: (p) => p.subtypes.includes(landSub),
      desc: `Applies to: ${landSub}s (land subtype)`,
    };
  }

  // "[Subtype] creatures" / "[Subtype]s" / "[Subtype] [Subtype] creatures"
  const subtypeCreatureMatch = f.match(/^(\w+)\s+creatures?$/);
  const knownGenerics = ['creature', 'permanent', 'land', 'artifact', 'enchantment'];
  if (subtypeCreatureMatch && !knownGenerics.includes(subtypeCreatureMatch[1])) {
    const sub = subtypeCreatureMatch[1];
    const maybeLand = LAND_SUBTYPE_WORDS[sub] || LAND_SUBTYPE_WORDS[sub + 's'];
    if (maybeLand) {
      return {
        fn: (p) => p.subtypes.includes(maybeLand),
        desc: `Applies to: ${maybeLand}s (land subtype)`,
      };
    }
    const subtype = singularizeCreatureType(sub);
    return {
      fn: (p) => p.types.includes('Creature') && (p.subtypes.includes(subtype) || p.isAllCreatureTypes),
      desc: `Applies to: ${subtype} creatures (or Changeling)`,
    };
  }

  // Bare subtype word: "elves", "zombies", "merfolk"
  // Use the full word for singularization (irregular plurals like "elves" need the full form)
  if (f.match(/^\w+$/) && !knownGenerics.includes(f) && !knownGenerics.includes(f.replace(/s$/, ''))) {
    const maybeLand = LAND_SUBTYPE_WORDS[f] || LAND_SUBTYPE_WORDS[f.replace(/s$/, '')];
    if (maybeLand) {
      return {
        fn: (p) => p.subtypes.includes(maybeLand),
        desc: `Applies to: ${maybeLand}s (land subtype)`,
      };
    }
    const subtype = singularizeCreatureType(f);
    return {
      fn: (p) => p.types.includes('Creature') && (p.subtypes.includes(subtype) || p.isAllCreatureTypes),
      desc: `Applies to: ${subtype} creatures (or Changeling)`,
    };
  }

  return {
    fn: (p) => p.types.includes('Creature'),
    desc: 'Applies to: all creatures',
    isFallback: true,
  };
}

function parseBecomesType(text) {
  const t = text.trim().replace(/\.$/, '');

  // Special case: "all basic land types" or "every basic land type" -> all 5 subtypes
  if (/\ball\s+basic\s+land\s+types?\b/i.test(t) || /\bevery\s+basic\s+land\s+type\b/i.test(t)) {
    return { types: ['Land'], subtypes: ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'], isLandSubtype: true, grantedAbilities: [] };
  }

  // Fix 18: Split on "with" to separate type info from granted abilities.
  // "1/1 green Insect creature with flying and trample" -> types+subtypes | abilities
  const withIdx = t.search(/\bwith\b/i);
  const typePart = withIdx >= 0 ? t.substring(0, withIdx).trim() : t;
  const withPart = withIdx >= 0 ? t.substring(withIdx + 4).trim() : '';

  const words = typePart.split(/\s+/);
  const types = [];
  const subtypes = [];
  let isLandSubtype = false;
  const grantedAbilities = [];

  for (const word of words) {
    const w = word.toLowerCase();
    if (['a', 'an', 'the', 'and', 'that', 'are', 'is', 'it', 'they'].includes(w)) continue;
    if (/^\d+\/\d+$/.test(w)) continue;
    if (/^\d+$/.test(w)) continue;
    const ct = CARD_TYPE_WORDS[w];
    if (ct && ct.check === 'type') { types.push(ct.value); continue; }
    const ls = LAND_SUBTYPE_WORDS[w];
    if (ls) { subtypes.push(ls); isLandSubtype = true; continue; }
    const cap = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    if (cap.length > 1 && !['In', 'To', 'Of', 'Their', 'Its', 'Other', 'Still', 'Also',
        'Addition', 'Types', 'Type', 'All', 'Each', 'Every', 'Basic', 'Nonbasic',
        'Non', 'Control', 'You', 'Your', 'Colors', 'Color', 'Mana', 'Any',
        'Has', 'Have', 'Gains', 'Gain', 'Gets', 'Get', 'Loses', 'Lose',
        'Abilities', 'Ability', 'Plus', 'Except', 'But', 'Not', 'No',
        'They', 'Them', 'These', 'Those', 'This', 'That', 'Same',
        'Colorless', 'White', 'Blue', 'Black', 'Red', 'Green',
        'Named', 'Called', 'Chosen', 'Target',
        // Keyword abilities should not be treated as subtypes
        'Flying', 'Lifelink', 'Deathtouch', 'Menace', 'Trample', 'Vigilance',
        'Haste', 'Hexproof', 'Indestructible', 'Reach', 'Defender', 'Flash',
        'Fear', 'Intimidate', 'Shroud', 'Wither', 'Infect', 'Prowess',
        'Ward', 'Shadow', 'Horsemanship', 'Undying', 'Persist', 'Decayed',
        'First', 'Double', 'Strike', 'Protection', 'From',
        'Commander', 'Commanders'].includes(cap)) {
      const singular = singularizeCreatureType(word);
      if (!subtypes.includes(singular)) subtypes.push(singular);
    }
  }
  if (isLandSubtype && !types.includes('Land')) {
    types.push('Land');
  }

  // Fix 18: Parse abilities from "with [abilities]" portion
  if (withPart) {
    if (/^no\s+abilit/i.test(withPart)) {
      grantedAbilities.push('__NO_ABILITIES__'); // sentinel for "with no abilities"
    } else {
      // Extract quoted abilities (allow apostrophes inside)
      const quotedMatch = withPart.match(/[""\u201c]((?:[^""\u201d]|'(?!(?:\s|$|,)))*)[""\u201d]/g);
      if (quotedMatch) {
        for (const q of quotedMatch) {
          grantedAbilities.push(q.replace(/^[""\u201c]|[""\u201d]$/g, '').trim());
        }
      }
      // Keyword abilities: "with flying, vigilance, and first strike"
      const kwText = withPart.replace(/[""\u201c](?:[^""\u201d]|'(?!(?:\s|$|,)))*[""\u201d]/g, '').trim();
      if (kwText) {
        // Handle "base power and toughness X/Y" ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â not an ability
        const cleaned = kwText.replace(/base\s+power\s+and\s+toughness\s+\d+\/\d+/i, '')
                              .replace(/power\s+and\s+toughness\s+\d+\/\d+/i, '').trim();
        if (cleaned) {
          const parts = cleaned.split(/\s*,\s*|\s+and\s+/i).filter(Boolean);
          for (const p of parts) {
            const trimmed = p.trim();
            if (trimmed) {
              // Capitalize each word: "first strike" ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ "First Strike"
              const capitalized = trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              grantedAbilities.push(capitalized);
            }
          }
        }
      }
    }
  }

  // Validate subtypes against Scryfall's TypeCatalog: filter out words that aren't
  // real MTG subtypes. This catches parser noise like "that's" or other misidentified words.
  const validatedSubtypes = (typeof TypeCatalog !== 'undefined' && TypeCatalog.loaded)
    ? [...new Set(subtypes)].filter(s => TypeCatalog.classifySubtype(s) !== 'unknown')
    : [...new Set(subtypes)];

  return { types: [...new Set(types)], subtypes: validatedSubtypes, isLandSubtype, grantedAbilities };
}
/* Build an aura restriction function from "Enchant [type(s)]" text.
   Supports any combination of permanent types joined by "or", "and/or", or commas.
   Handles negation: "nonland permanent" = any permanent that is NOT a Land.
   Returns null if the target cannot be a battlefield permanent (e.g. "player"). */
function buildAuraRestriction(enchantTarget) {
  const t = enchantTarget.toLowerCase();
  if (/\bplayer\b/.test(t) && !/\b(creature|artifact|planeswalker|enchantment|land|permanent)\b/.test(t)) {
    return null; // player-only auras have no permanent-targeting restriction; UI handles player picker
  }
  // Detect "non[type] permanent" patterns: "nonland permanent", "noncreature permanent", etc.
  const NON_TYPE_MAP = { nonland: 'Land', noncreature: 'Creature', nonartifact: 'Artifact',
    nonenchantment: 'Enchantment', nonplaneswalker: 'Planeswalker' };
  const excludedTypes = [];
  for (const [word, type] of Object.entries(NON_TYPE_MAP)) {
    if (t.includes(word)) excludedTypes.push(type);
  }
  // Detect "non[color] creature/permanent" patterns: "nonblack creature", "nonwhite permanent", etc.
  const NON_COLOR_MAP = { nonwhite: 'W', nonblue: 'U', nonblack: 'B', nonred: 'R', nongreen: 'G' };
  const excludedColors = [];
  for (const [word, color] of Object.entries(NON_COLOR_MAP)) {
    if (t.includes(word)) excludedColors.push(color);
  }
  if (/\bpermanent\b/.test(t)) {
    if (excludedTypes.length > 0 || excludedColors.length > 0) {
      return (p) => !excludedTypes.some(ex => p.types.includes(ex))
        && !excludedColors.some(ec => (p.colors || []).includes(ec));
    }
    return () => true;
  }
  // Handle "or" disjunction: "creature or Vehicle", "artifact or enchantment"
  if (/\bor\b/.test(t) && !excludedTypes.length && !excludedColors.length) {
    const orParts = t.split(/\s+or\s+/).map(s => s.trim()).filter(Boolean);
    if (orParts.length >= 2) {
      const subRestrictions = orParts.map(part => buildAuraRestriction(part)).filter(Boolean);
      if (subRestrictions.length >= 2) {
        return (p) => subRestrictions.some(r => r(p));
      }
      if (subRestrictions.length === 1) return subRestrictions[0];
    }
  }
  // Collect all type keywords present in the target string
  const TYPE_CHECKS = [
    ['Creature',     /\bcreature\b/],
    ['Artifact',     /\bartifact\b/],
    ['Enchantment',  /\bench[a-z]*ment\b/],
    ['Land',         /\bland\b/],
    ['Planeswalker', /\bplaneswalker\b/],
    ['Battle',       /\bbattle\b/],
  ];
  const required = TYPE_CHECKS.filter(([, rx]) => rx.test(t)).map(([type]) => type);
  // Remove types that appear in "non" form (e.g. "nonland" matched Land but we don't want to require it)
  const filtered = required.filter(r => !excludedTypes.includes(r));
  
  // Check for subtype-based restrictions: "Enchant Human", "Enchant Vehicle", "Enchant Goblin", etc.
  // Extract words from the enchant target that aren't card types, non-prefixes, or articles
  const SKIP_WORDS = new Set(['a', 'an', 'the', 'or', 'and', 'with', 'you', 'control',
    'creature', 'artifact', 'enchantment', 'land', 'planeswalker', 'permanent', 'battle',
    'nonland', 'noncreature', 'nonartifact', 'nonenchantment', 'nonplaneswalker',
    'nonwhite', 'nonblue', 'nonblack', 'nonred', 'nongreen', 'player', 'opponent']);
  const words = t.split(/\s+/);
  const requiredSubtypes = [];
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '');
    if (!clean || SKIP_WORDS.has(clean)) continue;
    // Skip color words
    if (['white', 'blue', 'black', 'red', 'green'].includes(clean)) continue;
    // Check if it could be a subtype (creature type, land type, etc.)
    const capWord = clean.charAt(0).toUpperCase() + clean.slice(1);
    // Check known creature types
    if (typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.size > 0) {
      if (TypeCatalog.creatureTypes.has(capWord)) {
        requiredSubtypes.push(capWord);
        continue;
      }
      // Also try singularized form
      const singular = singularizeCreatureType(clean);
      if (TypeCatalog.creatureTypes.has(singular)) {
        requiredSubtypes.push(singular);
        continue;
      }
    }
    // Check known land types
    if (typeof TypeCatalog !== 'undefined' && TypeCatalog.getSubtypeCategory) {
      const landTypes = TypeCatalog.getSubtypeCategory('land');
      if (landTypes.has(capWord)) {
        requiredSubtypes.push(capWord);
        continue;
      }
    }
    // Check common subtypes that might not be in TypeCatalog yet
    const KNOWN_SUBTYPES = ['Vehicle', 'Equipment', 'Aura', 'Saga', 'Food', 'Treasure',
      'Blood', 'Clue', 'Map', 'Powerstone', 'Shrine', 'Cartouche', 'Curse', 'Rune'];
    if (KNOWN_SUBTYPES.includes(capWord)) {
      requiredSubtypes.push(capWord);
      continue;
    }
    // If the word isn't a known type and isn't in the skip list, treat it as a potential subtype
    // This handles future creature types and edge cases
    if (!filtered.length && capWord.length > 2 && /^[A-Z][a-z]+$/.test(capWord)) {
      requiredSubtypes.push(capWord);
    }
  }
  
  if (!filtered.length && !excludedTypes.length && !excludedColors.length && !requiredSubtypes.length) return null;
  // Build combined restriction
  const checks = [];
  if (filtered.length === 1) {
    checks.push((p) => p.types.includes(filtered[0]));
  } else if (filtered.length > 1) {
    checks.push((p) => filtered.some(type => p.types.includes(type)));
  } else if (excludedTypes.length > 0) {
    checks.push((p) => !excludedTypes.some(ex => p.types.includes(ex)));
  }
  if (excludedColors.length > 0) {
    checks.push((p) => !excludedColors.some(ec => (p.colors || []).includes(ec)));
  }
  if (requiredSubtypes.length > 0) {
    checks.push((p) => requiredSubtypes.every(st => (p.subtypes || []).includes(st) || p.isAllCreatureTypes));
  }
  if (checks.length === 0) return null;
  if (checks.length === 1) return checks[0];
  return (p) => checks.every(check => check(p));
}

/* Evaluate a simple condition from a triggered ability's "if [condition]," prefix at fire time.
   Returns true/false if the condition is known and evaluable, null if unknown (don't block). */
function _evaluateTriggerCondition(condText, sourceState) {
  const ct = condText.toLowerCase().trim();
  const traits = sourceState ? (sourceState.traits || []) : [];
  if (/\bis monstrous\b/.test(ct)) return traits.includes('Monstrous');
  if (/\bisn'?t monstrous\b|\bis not monstrous\b/.test(ct)) return !traits.includes('Monstrous');
  if (/\bis saddled\b/.test(ct)) return traits.includes('Saddled');
  if (/\bisn'?t saddled\b|\bis not saddled\b/.test(ct)) return !traits.includes('Saddled');
  if (/\bis crewed\b/.test(ct)) return traits.includes('Crewed');
  if (/\bisn'?t crewed\b|\bis not crewed\b/.test(ct)) return !traits.includes('Crewed');
  if (/\b(?:it(?:'s| is)\s+your\s+turn|during\s+your\s+turn|on\s+your\s+turn)\b/.test(ct)) {
    return (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.isYourTurn : null;
  }
  if (/\b(?:it(?:'s| is)\s+not\s+your\s+turn|not\s+your\s+turn)\b/.test(ct)) {
    return (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? !Battlefield.gameState.isYourTurn : null;
  }
  return null; // unknown condition — don't block firing
}

function parseCardEffects(permanent, card, opts = {}) {
  const name = card.name.toLowerCase();
  const effects = [];
  // Detect if source is an Equipment - its targeted effects only apply to creatures
  const isEquipmentSource = permanent.printedSubtypes && permanent.printedSubtypes.includes('Equipment');

  // Track which oracle text lines were handled by KNOWN_ABILITY_EFFECTS so the
  // generic parser can skip them when assigning _conditionalAbilityIndices.
  const _knownHandledLines = new Set();

  // Check known ability database first (skip during re-parse after text change).
  // Instead of matching by card name, we normalize each ability line and check
  // if it matches a known ability pattern. This way any card that gains a known
  // ability (via copy, text exchange, etc.) automatically gets the correct effects.
  if (!opts.skipKnown) {
    const isTokenCard = permanent.isToken || false;
    const _knownNormalized = _replaceProperNounSelfRef(card.name, _stripReminderText(card.oracle_text || ''), isTokenCard);
    const _knownLines = _knownNormalized.split('\n').map(l => l.trim()).filter(Boolean);
    let _anyKnownMatch = false;
    const _handledLines = new Set();
    for (let li = 0; li < _knownLines.length; li++) {
      const lineKey = _knownLines[li].toLowerCase();
      if (!KNOWN_ABILITY_EFFECTS[lineKey]) continue;
      _anyKnownMatch = true;
      _handledLines.add(li);
      _knownHandledLines.add(li);
      for (const template of KNOWN_ABILITY_EFFECTS[lineKey]) {
        // Deep-clone params so each card instance has independent state (Fix 9)
        const clonedParams = JSON.parse(JSON.stringify(template.params || {}));
        // Restore non-serializable fields (functions) from the original
        if (template.params.restriction) clonedParams.restriction = template.params.restriction;
        if (template.params.compute) clonedParams.compute = template.params.compute;
        if (template.params.targetRestriction) clonedParams.targetRestriction = template.params.targetRestriction;
        const eff = {
          ...template,
          params: clonedParams,
          id: `${permanent.id}_eff_${effects.length}`,
          sourceId: permanent.id,
          sourceName: card.name,
          timestamp: permanent.timestamp,
          appliesTo: template.appliesTo || null,
        };
        // For CONTROL effects, set newController to the permanent's owner
        if (eff.type === EFFECT_TYPE.CONTROL && eff.params.newController === null) {
          eff.params.newController = permanent.owner || 'player_0';
        }
        effects.push(eff);
      }
    }
    if (_anyKnownMatch && _handledLines.size === _knownLines.length) {
      // All ability lines matched known patterns — return early (no generic parsing needed)
      // Also parse aura restriction from oracle text for known ability auras
      const oracleForAura = card.oracle_text || '';
      const enchantKnownMatch = oracleForAura.match(/^Enchant\s+(.+?)(?:\n|$)/im);
      if (enchantKnownMatch) {
        const enchantTarget = enchantKnownMatch[1].trim();
        const _isPlayerOnly = /\bplayer\b/i.test(enchantTarget) &&
          !/\b(creature|artifact|planeswalker|enchantment|land|permanent)\b/i.test(enchantTarget);
        if (_isPlayerOnly) permanent._isEnchantPlayer = true;
        const auraRestriction = buildAuraRestriction(enchantTarget);
        if (auraRestriction) {
          for (const eff of effects) {
            if (eff.scope === 'targeted' && !eff.selfTarget) eff.auraRestriction = auraRestriction;
          }
          permanent._auraRestriction = auraRestriction;
        }
        // "Enchant [type] an opponent controls" — restrict targeting to opponents' permanents
        if (/\bopponent(?:'?s?)?\s+controls?\b/i.test(enchantTarget)) {
          permanent._opponentControlRequired = true;
          for (const eff of effects) {
            if (eff.scope === 'targeted' && !eff.selfTarget) eff.opponentControlRequired = true;
          }
        }
        // "Enchant [type] you control" — restrict targeting to same-controller permanents
        if (/\byou\s+controls?\b/i.test(enchantTarget)) {
          permanent._youControlRequired = true;
          for (const eff of effects) {
            if (eff.scope === 'targeted' && !eff.selfTarget) eff.youControlRequired = true;
          }
        }
      }
      return _finalizeEffects(effects, isEquipmentSource, permanent, card.oracle_text);
    }
    // If some lines matched but not all, the matched effects are kept and
    // generic parsing will handle the remaining lines below.
  }

  // Generic oracle text parsing
  // Apply name replacement so self-references like "CardName has X" become "this card has X"
  const isTokenCard = permanent.isToken || false;
  let oracleRaw = _replaceProperNounSelfRef(card.name, _stripReminderText(card.oracle_text || ''), isTokenCard);

  // "Enchant player" cards: treat "enchanted player controls" as "you control"
  // since we assume the user is the enchanted player.
  if (/\benchant player\b/i.test(oracleRaw)) {
    if (permanent) permanent._isEnchantPlayer = true;
    oracleRaw = oracleRaw.replace(/\benchanted player(?:'s)?\s+controls?\b/gi, 'you control');
    oracleRaw = oracleRaw.replace(/\benchanted player\b/gi, 'you');
  }

  // Helper: apply target/choose metadata to an effect object.
  // bResult is the return value of buildAppliesToFromText; fn is the filter function.
  function _applyTargetInfo(eff, bResult, restrictionFn) {
    if (bResult.isSpellTarget) {
      eff.scope = 'targeted';
      eff.targetRestriction = restrictionFn || null;
      if (bResult.maxTargets > 1) {
        eff.maxTargets = bResult.maxTargets;
        eff.targetIds = [];
      }
    }
    return eff;
  }

  // --- "As long as" condition parsing ---
  // Instead of stripping conditions, parse them and attach to effects.
  // Store conditions found per line to attach to effects generated from that text.
  const _asLongAsConditions = []; // array of condition functions

  function _parseCondition(condText) {
    const ct = condText.toLowerCase().trim();
    // "an opponent controls a [type]" — multiplayer: check if any permanent
    // controlled by a different player matches the type filter.
    if (/\bopponent\s+controls?\b/.test(ct)) {
      const typeMatch = ct.match(/opponent\s+controls?\s+(?:a |an )?(.+)/);
      if (typeMatch) {
        const typeText = typeMatch[1].trim();
        const typeInfo = CARD_TYPE_WORDS[typeText] || CARD_TYPE_WORDS[typeText.replace(/s$/, '')];
        if (typeInfo) {
          return (state, allStates) => {
            if (!allStates) return false;
            const myCtrl = state.controller;
            for (const [, s] of allStates) {
              if (s.controller !== myCtrl) {
                if (typeInfo.check === 'type' && s.types.includes(typeInfo.value)) return true;
                if (typeInfo.check === 'subtype' && (s.subtypes.includes(typeInfo.value) || s.isAllCreatureTypes)) return true;
              }
            }
            return false;
          };
        }
      }
      // Fallback: check if any permanent is controlled by a different player
      return (state, allStates) => {
        if (!allStates) return false;
        const myCtrl = state.controller;
        for (const [, s] of allStates) {
          if (s.controller !== myCtrl) return true;
        }
        return false;
      };
    }
    // Handle compound "X and Y" conditions (e.g., "Cloud is equipped and it's your turn")
    // Split on "and" only when followed by a condition-like phrase
    const andParts = ct.split(/\s+and\s+(?=(?:it(?:\s+is|'s)?\s|this\s|you\s|there|during|on\s|\w+\s+(?:is|has)\s))/i);
    if (andParts.length >= 2) {
      const subConditions = [];
      for (const part of andParts) {
        const sub = _parseCondition(part.trim());
        if (sub) subConditions.push(sub);
      }
      if (subConditions.length >= 2) {
        return (state, allStates) => subConditions.every(c => c(state, allStates));
      }
    }
    // Handle comma-list compound conditions: "it is A, B, and C"
    // e.g., "this card is enchanted, equipped, and has a counter on it"
    if (ct.includes(',')) {
      const listParts = ct.split(/,\s*(?:and\s+)?/).map(s => s.trim()).filter(Boolean);
      if (listParts.length >= 2) {
        const subConditions = [];
        for (const part of listParts) {
          const sub = _parseCondition(part.trim());
          if (sub) subConditions.push(sub);
        }
        if (subConditions.length >= 2) {
          return (state, allStates) => subConditions.every(c => c(state, allStates));
        }
      }
    }
    // "it is legendary" / "enchanted creature is legendary"
    if (/\bis legendary\b/.test(ct)) return (state) => state.supertypes.includes('Legendary');
    // "it is a creature"
    if (/\bis a creature\b/.test(ct)) return (state) => state.types.includes('Creature');
    // "it is an? artifact"
    if (/\bis an? artifact\b/.test(ct)) return (state) => state.types.includes('Artifact');
    // "it is an? enchantment"
    if (/\bis an? enchantment\b/.test(ct)) return (state) => state.types.includes('Enchantment');
    // "it is a land"
    if (/\bis a land\b/.test(ct)) return (state) => state.types.includes('Land');
    // "it is a planeswalker"
    if (/\bis a planeswalker\b/.test(ct)) return (state) => state.types.includes('Planeswalker');
    // "it isn't a creature" / "it is not a creature"
    if (/\bisn'?t a creature\b|\bis not a creature\b/.test(ct)) return (state) => !state.types.includes('Creature');
    // "it is monstrous" / "this creature is monstrous" (CR 701.28)
    if (/\bis monstrous\b/.test(ct)) return (state) => (state.traits || []).includes('Monstrous');
    // "it isn't monstrous" / "this creature isn't monstrous"
    if (/\bisn'?t monstrous\b|\bis not monstrous\b/.test(ct)) return (state) => !(state.traits || []).includes('Monstrous');
    // "it is saddled" / "this mount is saddled" (CR 702.175)
    if (/\bis saddled\b/.test(ct)) return (state) => (state.traits || []).includes('Saddled');
    if (/\bisn'?t saddled\b|\bis not saddled\b/.test(ct)) return (state) => !(state.traits || []).includes('Saddled');
    // "it is crewed" / "this vehicle is crewed" (CR 702.122)
    if (/\bis crewed\b/.test(ct)) return (state) => (state.traits || []).includes('Crewed');
    if (/\bisn'?t crewed\b|\bis not crewed\b/.test(ct)) return (state) => !(state.traits || []).includes('Crewed');
    // "it is equipped or enchanted" (must be before individual equipped/enchanted checks)
    if (/\b(?:equipped\b.*\bor\b.*enchanted|enchanted\b.*\bor\b.*equipped)\b/.test(ct)) {
      return (state) => (state.traits || []).includes('Equipped') || (state.traits || []).includes('Enchanted');
    }
    // "it is equipped and enchanted" — both required
    if (/\bequipped\b.*\benchanted\b|\benchanted\b.*\bequipped\b/.test(ct)) {
      return (state) => (state.traits || []).includes('Equipped') && (state.traits || []).includes('Enchanted');
    }
    // "it is equipped" / "equipped creature" / "[name] is equipped"
    // Must be before isSubtypeMatch to prevent "equipped" from being treated as a subtype
    if (/\b(?:is\s+)?equipped\b/.test(ct) && !/enchanted/.test(ct)) {
      return (state) => (state.traits || []).includes('Equipped');
    }
    // "it is enchanted" / "enchanted creature" / "[name] is enchanted"
    // Must be before isSubtypeMatch to prevent "enchanted" from being treated as a subtype
    if (/\b(?:is\s+)?enchanted\b/.test(ct) && !/equipped/.test(ct)) {
      return (state) => (state.traits || []).includes('Enchanted');
    }
    // "it is a [subtype]" — e.g. "enchanted permanent is a Vehicle", "it is a Goblin"
    const isSubtypeMatch = ct.match(/\bis (?:a |an )?(\w+)\s*$/);
    if (isSubtypeMatch) {
      const word = isSubtypeMatch[1].toLowerCase();
      // Skip colors (handled below) and types (handled above)
      const COLOR_CHECK = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };
      if (!COLOR_CHECK[word] && !CARD_TYPE_WORDS[word]) {
        const subtype = singularizeCreatureType(word);
        return (state) => state.subtypes.includes(subtype) || (state.isAllCreatureTypes && typeof TypeCatalog !== 'undefined' && TypeCatalog.creatureTypes.has(subtype));
      }
    }
    // "enchanted permanent/creature is a creature/artifact/enchantment/land" 
    if (/\benchanted\b.*\bis a creature\b/.test(ct)) return (state) => state.types.includes('Creature');
    if (/\benchanted\b.*\bis an? artifact\b/.test(ct)) return (state) => state.types.includes('Artifact');
    if (/\benchanted\b.*\bis an? enchantment\b/.test(ct)) return (state) => state.types.includes('Enchantment');
    if (/\benchanted\b.*\bis a land\b/.test(ct)) return (state) => state.types.includes('Land');
    // "it is white/blue/black/red/green"
    const COLOR_COND = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };
    for (const [cName, cCode] of Object.entries(COLOR_COND)) {
      if (ct.includes(`is ${cName}`)) return (state) => state.colors.includes(cCode);
    }
    // --- Counter-based conditions ---
    // "it has [N] or more [type] counters on it" / "it has three or more +1/+1 counters"
    const counterCountMatch = ct.match(/has\s+(\w+)\s+or\s+more\s+([\w+/]+)\s+counter/);
    if (counterCountMatch) {
      const WORD_NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
      const numWord = counterCountMatch[1].toLowerCase();
      const threshold = WORD_NUMS[numWord] || parseInt(numWord) || 1;
      const counterType = counterCountMatch[2];
      return (state) => ((state.counters && state.counters[counterType]) || 0) >= threshold;
    }
    // "has a counter on it" — any counter type present
    if (/\bhas\s+a\s+counter\b/.test(ct) && !/has\s+a\s+[\w+/]+\s+counter/.test(ct)) {
      return (state) => {
        const counters = state.counters || {};
        return Object.values(counters).some(v => v > 0);
      };
    }
    // "it has a +1/+1 counter on it" / "it has a [type] counter on it"
    const hasCounterMatch = ct.match(/has\s+a\s+([\w+/]+)\s+counter\b/);
    if (hasCounterMatch) {
      const counterType = hasCounterMatch[1];
      return (state) => ((state.counters && state.counters[counterType]) || 0) > 0;
    }
    // --- Game state conditions (use Battlefield.gameState) ---
    // "it's your turn" / "it is your turn" / "during your turn"
    if (/\b(?:it(?:'s| is)\s+your\s+turn|during\s+your\s+turn|on\s+your\s+turn)\b/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.isYourTurn : true;
    }
    // "it's not your turn" / "it is not your turn" / "during an opponent's turn"
    if (/\b(?:it(?:'s| is)\s+not\s+your\s+turn|not\s+your\s+turn|during\s+(?:an?\s+)?opponent'?s?\s+turn)\b/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? !Battlefield.gameState.isYourTurn : true;
    }
    // "you have no cards in hand"
    if (/\bno cards in hand\b/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.handSize === 0 : true;
    }
    // "you have [N] or more cards in hand"
    const handSizeMatch = ct.match(/(\w+)\s+or\s+more\s+cards?\s+in\s+hand/);
    if (handSizeMatch) {
      const WORD_NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
      const numWord = handSizeMatch[1].toLowerCase();
      const threshold = WORD_NUMS[numWord] || parseInt(numWord) || 1;
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.handSize >= threshold : true;
    }
    // --- Life total conditions ---
    const LIFE_WORD_NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20, twenty5: 25, thirty: 30, forty: 40 };
    // "you have [N] or more life" (Serra Ascendant: "you have 30 or more life")
    const lifeThresholdMatch = ct.match(/you have (\w+)\s+or\s+more\s+life/);
    if (lifeThresholdMatch) {
      const numWord = lifeThresholdMatch[1].toLowerCase();
      const threshold = LIFE_WORD_NUMS[numWord] || parseInt(numWord) || 1;
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.currentLife >= threshold : true;
    }
    // "you have at least N life more than your starting life total" (Leyline of Hope actual Scryfall text)
    // Also: "your life total is [at least] N greater than your starting life total" (alternate phrasing)
    const lifeMoreThanStartMatch = ct.match(/you have (?:at least )?(\w+)\s+life\s+more\s+than\s+your\s+starting\s+life\s+total/);
    if (lifeMoreThanStartMatch) {
      const numWord = lifeMoreThanStartMatch[1].toLowerCase();
      const threshold = LIFE_WORD_NUMS[numWord] || parseInt(numWord) || 1;
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? (Battlefield.gameState.currentLife - Battlefield.gameState.startingLife) >= threshold : true;
    }
    const lifeGreaterByMatch = ct.match(/your life total is (?:at least )?(\w+)\s+greater than your starting life total/);
    if (lifeGreaterByMatch) {
      const numWord = lifeGreaterByMatch[1].toLowerCase();
      const threshold = LIFE_WORD_NUMS[numWord] || parseInt(numWord) || 1;
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? (Battlefield.gameState.currentLife - Battlefield.gameState.startingLife) >= threshold : true;
    }
    // "your life total is greater than your starting life total" (Elenda, Saint of Dusk)
    if (/your life total is greater than your starting life total/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.currentLife > Battlefield.gameState.startingLife : true;
    }
    // "your life total is less than your starting life total"
    if (/your life total is less than your starting life total/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined' && Battlefield.gameState) ? Battlefield.gameState.currentLife < Battlefield.gameState.startingLife : true;
    }
    // Eminence: "this card is in the command zone or on the battlefield"
    // This condition is about the SOURCE (the commander), not the target.
    // Check if the source permanent is a commander via allStates; if the source
    // isn't on the battlefield (command zone pseudo-permanent), always true.
    if (/\b(?:this card|it) is in the command zone or on the battlefield\b/.test(ct)) {
      const srcId = permanent.id;
      return (_state, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) return srcState.isCommander || false;
        }
        // Source not on battlefield (command zone ability) — eminence applies
        return true;
      };
    }
    // Lieutenant: "you control your commander" — check if any commander is on the battlefield
    // Must come before the generic "your commander" check below.
    if (/\byou control your commander\b/.test(ct)) {
      return () => (typeof Battlefield !== 'undefined') ? Battlefield.commanders.some(c => c.linkedPermId !== null) : true;
    }
    // "it is your commander" / "enchanted creature is your commander" / "equipped creature is your commander"
    if (/\b(?:is\s+)?your\s+commander\b/.test(ct)) {
      return (state) => state.isCommander || false;
    }
    // "enchanted creature has [ability]" / "it has [ability]"
    // Must come AFTER counter checks to avoid "has a +1/+1 counter" matching as ability
    const hasAbMatch = ct.match(/\bhas\s+(\w[\w\s]*\w|\w+)/);
    if (hasAbMatch) {
      const abText = hasAbMatch[1].toLowerCase().trim();
      // Skip counter-related matches that weren't caught above
      if (!/counter|card/.test(abText)) {
        return (state) => state.abilities.some(a => a.toLowerCase().includes(abText));
      }
    }
    // "you control a [color] or [color] permanent/creature" — check battlefield for colored permanents
    const COLOR_COND_MAP = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };
    // "you control a permanent/creature with a +1/+1 counter on it"
    const youControlWithCounterMatch = ct.match(/you control (?:a |an )?(\w+)\s+with\s+a\s+([\w+/]+)\s+counter/);
    if (youControlWithCounterMatch) {
      const typWord = youControlWithCounterMatch[1].toLowerCase();
      const counterType = youControlWithCounterMatch[2];
      const typeInfo = CARD_TYPE_WORDS[typWord];
      return (state, allStates) => {
        if (!allStates) return true;
        for (const [, s] of allStates) {
          const typeOk = !typeInfo || typeInfo.check === 'any' || (typeInfo.check === 'type' && s.types.includes(typeInfo.value));
          const hasCounter = (s.counters && s.counters[counterType] && s.counters[counterType] > 0);
          if (typeOk && hasCounter) return true;
        }
        return false;
      };
    }
    // "you control [N] or more [type]" (Starfield of Nyx: "you control five or more enchantments")
    // Multiplayer: only count permanents controlled by the same player as state
    const youControlCountMatch = ct.match(/you control (\w+)\s+or\s+more\s+(\w+)/);
    if (youControlCountMatch) {
      const WORD_NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
      const numWord = youControlCountMatch[1].toLowerCase();
      const threshold = WORD_NUMS[numWord] || parseInt(numWord) || 1;
      const typeWord = youControlCountMatch[2].toLowerCase();
      const typeInfo = CARD_TYPE_WORDS[typeWord] || CARD_TYPE_WORDS[typeWord.replace(/s$/, '')];
      if (typeInfo) {
        return (state, allStates) => {
          if (!allStates) return true;
          const myCtrl = state.controller;
          let count = 0;
          for (const [, s] of allStates) {
            if ((!myCtrl || s.controller === myCtrl) && (typeInfo.check === 'any' || (typeInfo.check === 'type' && s.types.includes(typeInfo.value)))) count++;
          }
          return count >= threshold;
        };
      }
    }
    const youControlColorMatch = ct.match(/you control (?:a |an )?(\w+)(?:\s+or\s+(\w+))?(?:\s+(?:permanent|creature|artifact|enchantment|land|planeswalker))/);    if (youControlColorMatch) {
      const colorNames = [youControlColorMatch[1].toLowerCase()];
      if (youControlColorMatch[2]) colorNames.push(youControlColorMatch[2].toLowerCase());
      const colorCodes = colorNames.map(c => COLOR_COND_MAP[c]).filter(Boolean);
      if (colorCodes.length > 0) {
        // Also check if a type restriction is present
        const typeRestrictionMatch = ct.match(/(?:white|blue|black|red|green)(?:\s+or\s+(?:white|blue|black|red|green))?\s+(\w+)$/);
        const typeRestriction = typeRestrictionMatch ? CARD_TYPE_WORDS[typeRestrictionMatch[1]] : null;
        return (state, allStates) => {
          if (!allStates) return true;
          const myCtrl = state.controller;
          for (const [, s] of allStates) {
            if (myCtrl && s.controller !== myCtrl) continue;
            const hasColor = colorCodes.some(c => (s.colors || []).includes(c));
            if (hasColor) {
              if (!typeRestriction || typeRestriction.check === 'any' || (typeRestriction.check === 'type' && s.types.includes(typeRestriction.value))) {
                return true;
              }
            }
          }
          return false;
        };
      }
    }
    // "you control a [Name] planeswalker" — check for planeswalker with specific subtype
    const youControlPWMatch = ct.match(/you control (?:a |an )?(\w+)\s+planeswalker/);
    if (youControlPWMatch) {
      const pwSubtype = youControlPWMatch[1].charAt(0).toUpperCase() + youControlPWMatch[1].slice(1).toLowerCase();
      return (state, allStates) => {
        if (!allStates) return true;
        const myCtrl = state.controller;
        for (const [, s] of allStates) {
          if (myCtrl && s.controller !== myCtrl) continue;
          if (s.types.includes('Planeswalker') && s.subtypes.includes(pwSubtype)) return true;
        }
        return false;
      };
    }
    // "you control a legendary creature" / "you control a [type]" — check battlefield
    // Multiplayer: "you" = the controller of the permanent this condition is on (state.controller)
    const youControlMatch = ct.match(/you control (?:a |an )?(?:legendary\s+)?(\w+)/);
    if (youControlMatch) {
      const controlWord = youControlMatch[1].toLowerCase();
      // Skip if controlWord is a color — already handled above
      if (COLOR_COND_MAP[controlWord]) {
        // Single color permanent check (no "or")
        const cCode = COLOR_COND_MAP[controlWord];
        return (state, allStates) => {
          if (!allStates) return true;
          const myCtrl = state.controller;
          for (const [, s] of allStates) {
            if ((!myCtrl || s.controller === myCtrl) && (s.colors || []).includes(cCode)) return true;
          }
          return false;
        };
      }
      const isLegendary = ct.includes('legendary');
      const typeInfo = CARD_TYPE_WORDS[controlWord] || CARD_TYPE_WORDS[controlWord.replace(/s$/, '')];
      if (typeInfo && typeInfo.check === 'type') {
        return (state, allStates) => {
          if (!allStates) return true; // fallback if no global state
          const myCtrl = state.controller;
          for (const [, s] of allStates) {
            if ((!myCtrl || s.controller === myCtrl) && s.types.includes(typeInfo.value) && (!isLegendary || s.supertypes.includes('Legendary'))) return true;
          }
          return false;
        };
      }
      // Land subtype check: "you control a Plains", "you control a Forest"
      const landSubtype = LAND_SUBTYPE_WORDS[controlWord];
      if (landSubtype) {
        return (state, allStates) => {
          if (!allStates) return true;
          const myCtrl = state.controller;
          for (const [, s] of allStates) {
            if ((!myCtrl || s.controller === myCtrl) && s.subtypes.includes(landSubtype)) return true;
          }
          return false;
        };
      }
      // Creature/general subtype check: "you control an Elf"
      const subtype = singularizeCreatureType(controlWord);
      return (state, allStates) => {
        if (!allStates) return true;
        const myCtrl = state.controller;
        for (const [, s] of allStates) {
          if ((!myCtrl || s.controller === myCtrl) && (s.subtypes.includes(subtype) || s.isAllCreatureTypes)) return true;
        }
        return false;
      };
    }
    // Fallback: unknown condition, always true (don't block effects)
    return null;
  }

  // Normalize "as long as [condition]" patterns.
  // Pattern A: "As long as [condition], it [effect]" at start of line → transform "it" to self-ref
  // Pattern B: "[effect] as long as [condition]" trailing → strip condition text
  // In both cases, parse condition and store it.
  let oracle = oracleRaw;

  // Normalize "Player N controls" → "you control" so the parser handles player-name-substituted text
  oracle = oracle.replace(/\bPlayer \d+\s+controls\b/gi, 'you control')
                 .replace(/\bPlayer \d+'s\s+control\b/gi, 'your control');

  // Detect whether this card is an aura/equipment to know what "it" refers to
  const isAuraCard = (card.type_line || '').toLowerCase().includes('aura');
  const isEquipmentCard = (card.type_line || '').toLowerCase().includes('equipment');
  const enchantedRef = isEquipmentCard ? 'Equipped creature' : isAuraCard ? 'Enchanted creature' : 'this card';

  // Normalize curly apostrophes (U+2019) to straight — Scryfall uses curly in oracle text
  oracle = oracle.replace(/\u2019/g, "'");
  // Normalize smart/curly double quotes (U+201C, U+201D) to straight ASCII double quotes
  oracle = oracle.replace(/[\u201c\u201d]/g, '"');

  // Strip leading duration clauses (e.g. "Until end of turn, ") from the start of lines.
  // Without this, the setTypeRegex captures "Until end of turn, target X" as the filter,
  // and extractTargetInfo() fails to detect "target" (it only checks at the string start).
  oracle = oracle.replace(/^Until end of turn,\s*/gim, '');

  // Normalize "this [card-type]" to "this card" so self-reference detection works for all card types.
  // e.g. "this enchantment becomes..." (Daxos' Torment), "this artifact gains...", etc.
  // Skip "this creature" and "this permanent" — those are already handled as self-refs.
  oracle = oracle.replace(/\bthis\s+(enchantment|artifact|land|planeswalker|battle|vehicle|instant|sorcery)\b/gi, 'this card');

  // Normalize common contractions so regex patterns work uniformly
  oracle = oracle.replace(/\bit's\b/gi, 'it is');
  oracle = oracle.replace(/\bthat's\b/gi, 'that is');
  oracle = oracle.replace(/\bthey're\b/gi, 'they are');
  oracle = oracle.replace(/\bwhat's\b/gi, 'what is');
  oracle = oracle.replace(/\bhere's\b/gi, 'here is');
  oracle = oracle.replace(/\bthere's\b/gi, 'there is');

  // Normalize gendered pronouns to "this card" for cards that self-reference with he/she/him/her.
  // "he's a" → "this card is a", "she's a" → "this card is a"
  // "he is" → "this card is", "she is" → "this card is"
  // "he has" → "this card has", "she has" → "this card has"
  // "he loses" → "this card loses", "she loses" → "this card loses"
  // Only when not an Aura/Equipment (for those, "it" refers to the enchanted permanent)
  if (!isAuraCard && !isEquipmentCard) {
    oracle = oracle.replace(/\b[Hh]e's\b/g, 'this card is');
    oracle = oracle.replace(/\b[Ss]he's\b/g, 'this card is');
    oracle = oracle.replace(/\b[Hh]e\s+(is|has|gains?|loses?|gets?|becomes?|can't|doesn't|isn't)\b/g, 'this card $1');
    oracle = oracle.replace(/\b[Ss]he\s+(is|has|gains?|loses?|gets?|becomes?|can't|doesn't|isn't)\b/g, 'this card $1');
    // "on him" / "on her" → "on it" for counter references
    oracle = oracle.replace(/\bon him\b/gi, 'on it');
    oracle = oracle.replace(/\bon her\b/gi, 'on it');
  }

  // Saga chapter lore counter conditions: before stripping em-dash prefixes,
  // detect saga chapter lines and store their thresholds by line index.
  // After all condition parsing, these will be injected into _lineConditionMap.
  const _sagaLineThresholds = new Map(); // lineIndex → minLoreThreshold
  if (permanent._sagaChapterThresholds && permanent._sagaChapterThresholds.size > 0) {
    const ROMAN_MAP = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
    const chapterRegex = /^([IVXLC]+(?:\s*,\s*[IVXLC]+)*)\s*\u2014/;
    const oLines = oracle.split('\n');
    for (let li = 0; li < oLines.length; li++) {
      const cm = oLines[li].match(chapterRegex);
      if (cm) {
        const numerals = cm[1].split(',').map(s => s.trim());
        const values = numerals.map(n => ROMAN_MAP[n]).filter(v => v !== undefined);
        if (values.length > 0) {
          _sagaLineThresholds.set(li, Math.min(...values));
        }
      }
    }
  }

  // Class enchantment level conditions: detect "{cost}: Level N" lines by line index.
  // These will be injected into _lineConditionMap so effects are gated by class level.
  const _classLineThresholds = new Map(); // lineIndex → requiredLevel
  if (permanent._classLevelThresholds && permanent._classLevelThresholds.size > 0) {
    const levelLineRegex = /^[{][^}]*[}].*:\s*Level\s+(\d+)\s*$/i;
    const oLines = oracle.split('\n');
    let currentLevel = 1;
    for (let li = 0; li < oLines.length; li++) {
      const lm = oLines[li].match(levelLineRegex);
      if (lm) {
        currentLevel = parseInt(lm[1], 10);
        // The level-up line itself: mark with its level so it shows correctly
        _classLineThresholds.set(li, currentLevel);
      } else {
        // Regular ability line: belongs to currentLevel
        _classLineThresholds.set(li, currentLevel);
      }
    }
  }

  // Leveler (Level up) creature conditions: detect "LEVEL N-M" / "LEVEL N+" lines by line index.
  // Track which oracle lines are structural (LEVEL headers, P/T lines) vs ability lines.
  // Ability lines get conditions based on level counter being in the right bracket.
  // P/T lines get special handling to generate SET_PT effects.
  const _levelerLineData = new Map(); // lineIndex → { bracket, isStructural, isPT, power, toughness }
  const _levelerBrackets = []; // { min, max, ptLineIdx, power, toughness }
  let _isLeveler = false;
  if (permanent._levelerData) {
    _isLeveler = true;
    const oLines = oracle.split('\n');
    const levelLineRegex = /^LEVEL\s+(\d+)([+-])(\d*)$/i;
    const ptRegex = /^(\*|\d+)\/(\*|\d+)$/;
    let currentBracketIdx = -1; // -1 = base level (before first LEVEL line)
    let foundLevelUp = false;
    
    for (let li = 0; li < oLines.length; li++) {
      const line = oLines[li].trim();
      
      // Check for "Level up {cost}" line
      if (!foundLevelUp && /^Level up\s+\{/i.test(line)) {
        foundLevelUp = true;
        // This is the level up activation line — always active, bracket -1 (base)
        _levelerLineData.set(li, { bracket: -1, isStructural: false, isPT: false, isLevelUp: true });
        continue;
      }
      
      // Check for "LEVEL N-M" or "LEVEL N+" header
      const levelMatch = line.match(levelLineRegex);
      if (levelMatch) {
        const minLevel = parseInt(levelMatch[1], 10);
        const op = levelMatch[2];
        const maxLevel = op === '+' ? Infinity : parseInt(levelMatch[3], 10);
        currentBracketIdx = _levelerBrackets.length;
        _levelerBrackets.push({ min: minLevel, max: maxLevel, ptLineIdx: -1, power: null, toughness: null });
        _levelerLineData.set(li, { bracket: currentBracketIdx, isStructural: true, isPT: false });
        continue;
      }
      
      // Check for P/T line within a bracket
      if (currentBracketIdx >= 0) {
        const ptMatch = line.match(ptRegex);
        if (ptMatch && _levelerBrackets[currentBracketIdx].power === null) {
          const p = ptMatch[1] === '*' ? 0 : parseInt(ptMatch[1], 10);
          const t = ptMatch[2] === '*' ? 0 : parseInt(ptMatch[2], 10);
          _levelerBrackets[currentBracketIdx].power = p;
          _levelerBrackets[currentBracketIdx].toughness = t;
          _levelerBrackets[currentBracketIdx].ptLineIdx = li;
          _levelerLineData.set(li, { bracket: currentBracketIdx, isStructural: true, isPT: true, power: p, toughness: t });
          continue;
        }
      }
      
      // Regular ability line — if we're in a bracket, mark it
      if (currentBracketIdx >= 0 && line) {
        _levelerLineData.set(li, { bracket: currentBracketIdx, isStructural: false, isPT: false });
      }
    }
  }

  // Spacecraft station conditions: detect "N+ | ability" lines and "Station" keyword line.
  // Uses the parsed _spacecraftData to map oracle line indices to charge counter thresholds.
  // Cumulative: charge counters >= N means the ability is active.
  const _spacecraftLineData = new Map(); // lineIndex → { min, isKeyword }
  let _isSpacecraft = false;
  if (permanent._spacecraftData) {
    _isSpacecraft = true;
    const oLines = oracle.split('\n');
    const stationAbilityRegex = /^(\d+)\+\s*\|\s*(.+)$/;
    let foundStationKeyword = false;
    let currentStationMin = -1; // track current threshold for subsequent lines

    for (let li = 0; li < oLines.length; li++) {
      const line = oLines[li].trim();

      // Check for "Station" keyword line
      if (!foundStationKeyword && /^Station$/i.test(line)) {
        foundStationKeyword = true;
        _spacecraftLineData.set(li, { min: 0, isKeyword: true });
        continue;
      }

      // Only process lines after the Station keyword
      if (!foundStationKeyword) continue;

      // Check for "N+ | ability" line
      const m = line.match(stationAbilityRegex);
      if (m) {
        currentStationMin = parseInt(m[1], 10);
        _spacecraftLineData.set(li, { min: currentStationMin, isKeyword: false });
      } else if (currentStationMin >= 0 && line) {
        // Subsequent line after a N+ | line inherits the same threshold
        _spacecraftLineData.set(li, { min: currentStationMin, isKeyword: false });
      }
    }
  }

  // --- Inline comma-separated choice normalization ---
  // Detects patterns like "choose first strike, vigilance, or lifelink. [rest of effect]"
  // Rewrites into modal format: "Choose one —\n• [rest] with first strike\n• [rest] with vigilance\n• [rest] with lifelink"
  // This runs BEFORE the main modal detection so the bullet-based system picks it up.
  {
    const inlineChoiceRegex = /^(.*?\bchoose\s+)([\w\s]+(?:,\s*[\w\s]+)*,?\s+or\s+[\w\s]+?)(\.\s*)(.+)$/i;
    const oLines = oracle.split('\n');
    const rebuilt = [];
    let didRewrite = false;
    for (const line of oLines) {
      const m = line.trim().match(inlineChoiceRegex);
      if (m) {
        // m[1] = prefix ending with "choose "
        // m[2] = "first strike, vigilance, or lifelink"
        // m[3] = ". "
        // m[4] = rest of sentence (the actual effect)
        const choiceStr = m[2].trim();
        // Split on ", " and " or "
        const choices = choiceStr.split(/,\s*(?:or\s+)?|\s+or\s+/).map(s => s.trim()).filter(Boolean);
        if (choices.length >= 2) {
          // Build modal header + bullet modes
          rebuilt.push('Choose one —');
          const rest = m[4].trim();
          for (const choice of choices) {
            // Substitute the choice into the rest of the sentence
            // Look for patterns like "gain that ability" / "that ability" / "gain it" / "gains it"
            let modeLine = rest
              .replace(/\bthat ability\b/gi, choice)
              .replace(/\bgains?\s+it\b/gi, `gains ${choice}`)
              .replace(/\bget\s+it\b/gi, `get ${choice}`);
            // If none of the above matched, just append the choice
            if (modeLine === rest) {
              modeLine = rest + ' (' + choice + ')';
            }
            rebuilt.push('\u2022 ' + modeLine);
          }
          didRewrite = true;
          continue;
        }
      }
      rebuilt.push(line);
    }
    if (didRewrite) oracle = rebuilt.join('\n');
  }

  // --- Modal spell preprocessing ---
  // Detects modal spells (Choose one/two/three, Spree, Tiered, pawprint modes)
  // and strips header lines + mode prefixes so downstream parsers see clean effect text.
  // Must run BEFORE em-dash stripping since Spree/Tiered/pawprint prefixes contain {.
  // Tracks mode indices so effects can be tagged with modalModeIndex for ordering + toggling.
  let _isModalSpell = false;
  const _modalModeLineMap = new Map(); // cleaned line index → modal mode index (0-based)
  {
    const oLines = oracle.split('\n');
    // Detect modal header: "Choose one/two/three/N", "Choose one or both", "Spree", "Tiered", or pawprint "Choose up to N {P}"
    const isModalHeader = (l) => /^(?:choose\s+(?:one|two|three|four|five|six|any number|up to\b|one or (?:both|more)\b)|spree\b|tiered\b)/i.test(l.trim());
    const hasModalHeader = oLines.some(l => isModalHeader(l));
    // Also detect by bullet/mode prefix patterns even without explicit header
    const hasModePrefixes = oLines.some(l => /^\s*(?:\u2022|(?:\+\s*)?{[^}]*}\s*[\u2014—])/m.test(l));
    if (hasModalHeader || hasModePrefixes) {
      _isModalSpell = true;
      permanent.isModalSpell = true;
      // Determine modal type and max active modes from the header
      // Default: choose-one (1 mode active)
      let modalMaxActive = 1;
      let modalMinActive = 0; // minimum modes required (0 = no minimum enforced)
      const headerLine = oLines.find(l => isModalHeader(l)) || '';
      const hLower = headerLine.trim().toLowerCase();
      const CHOOSE_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
      const chooseMatch = hLower.match(/^choose\s+(one|two|three|four|five|six)\b/);
      if (/^choose\s+one or both\b/.test(hLower)) {
        modalMaxActive = 2;
        modalMinActive = 1; // must choose at least one
      } else if (/^choose\s+one or more\b/.test(hLower)) {
        modalMaxActive = Infinity;
        modalMinActive = 1; // must choose at least one
      } else if (chooseMatch) {
        modalMaxActive = CHOOSE_NUM[chooseMatch[1]] || 1;
      } else if (/^choose\s+any number\b/.test(hLower)) {
        modalMaxActive = Infinity;
      } else if (/^spree\b/.test(hLower)) {
        modalMaxActive = Infinity; // Spree: one or more
      } else if (/^tiered\b/.test(hLower)) {
        modalMaxActive = 1; // Tiered: exactly one
      } else if (/^choose\s+up to\b/.test(hLower)) {
        modalMaxActive = Infinity; // Pawprint: flexible
      }
      // Check for "You may choose the same mode more than once" → repeatable
      const fullOracle = (card.oracle_text || '').toLowerCase();
      const modalRepeatable = /you may choose the same mode more than once/i.test(fullOracle);
      // Check for Entwine — allows all modes regardless
      if (/\bentwine\b/.test(fullOracle)) {
        modalMaxActive = Infinity;
      }
      permanent.modalMaxActive = modalMaxActive;
      permanent.modalMinActive = modalMinActive;
      permanent.modalRepeatable = modalRepeatable;
      const _modalModeTexts = []; // raw mode text for popup display
      const cleaned = [];
      let modeIdx = 0;
      for (const line of oLines) {
        const trimmed = line.trim();
        // Skip modal header lines entirely (no layer effects)
        if (isModalHeader(trimmed)) continue;
        let modeText = null;
        // Strip bullet "• " prefix (standard modal: "• Creatures you control get +2/+0...")
        if (trimmed.startsWith('\u2022')) {
          const afterBullet = trimmed.slice(1).trim();
          // Some bullets have named modes: "• Cure — {0} — effect"
          // For Tiered, strip the "ModeName — {cost} — " prefix
          const tieredPrefix = afterBullet.match(/^[A-Z]\w*(?:\+*)\s*[\u2014—]\s*(?:\{[^}]*\})+\s*[\u2014—]\s*/);
          modeText = tieredPrefix ? afterBullet.slice(tieredPrefix[0].length) : afterBullet;
        }
        // Strip Spree mode prefix: "+ {cost} — effect" or "+{cost} — effect"
        if (!modeText) {
          const spreeMatch = trimmed.match(/^\+\s*(\{[^}]*\}(?:\{[^}]*\})*)\s*[\u2014—]\s*(.*)/);
          if (spreeMatch) modeText = spreeMatch[2];
        }
        // Strip pawprint mode prefix: "{P}+ — effect" (one or more {P} then em-dash)
        if (!modeText) {
          const pawprintMatch = trimmed.match(/^(?:\{P\})+\s*[\u2014—]\s*(.*)/);
          if (pawprintMatch) modeText = pawprintMatch[1];
        }
        // Strip Tiered non-bullet format: "ModeName — {cost} — effect"
        if (!modeText && hasModalHeader) {
          const tieredMatch = trimmed.match(/^[A-Z]\w*(?:\+*)\s*[\u2014—]\s*(?:\{[^}]*\})+\s*[\u2014—]\s*(.*)/);
          if (tieredMatch) modeText = tieredMatch[1];
        }
        if (modeText !== null) {
          // This is a mode line — record its cleaned line index → mode index
          _modalModeLineMap.set(cleaned.length, modeIdx);
          _modalModeTexts.push(modeText);
          cleaned.push(modeText);
          modeIdx++;
        } else {
          // Keep other lines as-is (non-mode content)
          cleaned.push(trimmed);
        }
      }
      permanent.modalModeTexts = _modalModeTexts;
      oracle = cleaned.join('\n');
    }
  }

  // Note: "target player" is NOT normalized to "you control" — individual parsers
  // set _targetsChosenPlayer on the permanent when they produce a target-player effect,
  // and the UI shows a dropdown to select the beneficiary at that point.

  // Strip ability words (flavor words before em dashes at the start of lines).
  // E.g. "Jump — During your turn, this card has flying." → "During your turn, this card has flying."
  // Ability words have no rules meaning; the em dash separates them from the actual rules text.
  // Exclude lines with { before the em dash (those are activated ability costs, not ability words).
  // Exclude lines where the em dash appears inside a quoted string (e.g. "Ward—Pay 3 life,").
  // Loop to handle multiple prefixes: saga chapters + ability words, e.g.
  // "I, II, III, IV — Stampede! — Other creatures get +1/+0" → "Other creatures get +1/+0"
  { let prev; do { prev = oracle; oracle = oracle.replace(/^([^{\n.;"—\u2014]+)\s*[\u2014—]\s*/gm, ''); } while (oracle !== prev); }

  // Strip spacecraft station "N+ | " prefixes from oracle text so generic parsers see the ability text.
  // E.g. "2+ | Other creatures you control get +1/+1." → "Other creatures you control get +1/+1."
  // The conditions were already captured in _spacecraftLineData above.
  if (_isSpacecraft) {
    oracle = oracle.replace(/^\d+\+\s*\|\s*/gm, '');
  }


  // Normalize "During your turn, " prefix → "As long as it is your turn, " so existing
  // "As long as" patterns handle it uniformly. Scryfall uses "During your turn" for many cards
  // (e.g. Ahn-Crop Invader, Bilbo's Ring, Cloud). Handles compound forms like
  // "During your turn, as long as [X], [effect]" → "As long as it is your turn and [X], [effect]"
  oracle = oracle.replace(/^During your turn,\s*as long as\s+/gim, 'As long as it is your turn and ');
  oracle = oracle.replace(/^During your turn,\s*/gim, 'As long as it is your turn, ');
  oracle = oracle.replace(/^During turns other than yours,\s*/gim, 'As long as it is not your turn, ');
  // Normalize "While " at start of line → "As long as " so existing condition parsers handle it
  oracle = oracle.replace(/^While\b/gim, 'As long as');
  // Pattern A: "As long as [condition], it [effect]" at start of line
  oracle = oracle.replace(/^As long as\s+(?!your devotion\b)([^,]+),\s*it\s+/gim, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04` + enchantedRef + ' ';
    }
    return enchantedRef + ' ';
  });

  // Pattern A2: "As long as [condition], enchanted/equipped [type] [effect]" — just strip the condition prefix
  oracle = oracle.replace(/^As long as\s+(?!your devotion\b)[^,]+,\s*(?=(enchanted|equipped)\s)/gim, (match, condRef) => {
    const condText = match.replace(/^As long as\s+/i, '').replace(/,\s*$/, '');
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Pattern A3: "As long as [condition], this card/creature/permanent/token [effect]" — strip condition prefix
  oracle = oracle.replace(/^As long as\s+(?!your devotion\b)(.+),\s*(?=(?:this card|this creature|this permanent|this token)\s)/gim, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Pattern A4: "As long as [condition], each/all [filter] [effect]" — strip condition prefix
  // Handles cards like Bello: "As long as it's your turn, each non-Aura enchantment..."
  oracle = oracle.replace(/^As long as\s+(?!your devotion\b)([^,]+),\s*(?=(?:all|each)\s)/gim, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Pattern A5: "As long as [condition], [filter] [get/gain/have/are] [effect]"
  // Handles: "As long as X, creatures you control get +2/+2" (Leyline of Hope)
  // Uses a broad lookahead: any words followed by a verb keyword
  oracle = oracle.replace(/^As long as\s+(?!your devotion\b)([^,]+),\s*(?=.+?\b(?:get|gets|gain|gains|have|has|are|is|lose|loses)\s)/gim, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Pattern B: trailing "as long as [condition]" at end of sentence
  // Exception: preserve "as long as your devotion" (Theros gods)
  oracle = oracle.replace(/\s+as long as\s+(?!your devotion\b)([^.,;\n]+)(?=[.,;]|$)/gi, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      // Insert the marker at this position (it's mid-sentence, attach to current line)
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Pattern C: "if [condition], [effect]" at start of line — intervening-if clauses
  // Handles eminence ("if this card is in the command zone or on the battlefield, ...")
  // and lieutenant ("if you control your commander, ...") triggered ability effects.
  oracle = oracle.replace(/^if\s+([^,]+),\s*/gim, (match, condText) => {
    const cond = _parseCondition(condText);
    if (cond) {
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(cond);
      return `\x04${idx}\x04`;
    }
    return '';
  });

  // Clean condition markers from oracle text used by downstream parsers,
  // but track which lines have conditions for attaching to effects later.
  const _lineConditionMap = new Map(); // line text snippet → condition index
  const oracleLines = oracle.split('\n');
  for (let i = 0; i < oracleLines.length; i++) {
    const markerMatch = oracleLines[i].match(/\x04(\d+)\x04/);
    if (markerMatch) {
      _lineConditionMap.set(i, parseInt(markerMatch[1]));
      oracleLines[i] = oracleLines[i].replace(/\x04\d+\x04/g, '').trim();
    }
  }
  oracle = oracleLines.join('\n');

  // Inject saga chapter lore counter conditions into _lineConditionMap.
  // These lines were detected before em-dash stripping; now attach conditions
  // so effects parsed from these lines will be gated by lore counter thresholds.
  if (_sagaLineThresholds.size > 0) {
    const srcId = permanent.id;
    for (const [lineIdx, minThreshold] of _sagaLineThresholds) {
      if (!_lineConditionMap.has(lineIdx)) {
        const cond = (_permState, allStates) => {
          if (allStates) {
            const srcState = allStates.get(srcId);
            if (srcState) return ((srcState.counters && srcState.counters['lore']) || 0) >= minThreshold;
          }
          return false;
        };
        const idx = _asLongAsConditions.length;
        _asLongAsConditions.push(cond);
        _lineConditionMap.set(lineIdx, idx);
      }
    }
  }

  // Inject class level conditions into _lineConditionMap.
  // Effects from class abilities are gated by the permanent's classLevel.
  // If a line already has a condition (e.g. "as long as"), compose both (AND).
  if (_classLineThresholds.size > 0) {
    const srcId = permanent.id;
    for (const [lineIdx, requiredLevel] of _classLineThresholds) {
      const classCond = (_permState, allStates) => {
        const srcPerm = Battlefield.permanents.find(p => p.id === srcId);
        if (srcPerm) return (srcPerm.classLevel || 1) >= requiredLevel;
        return false;
      };
      if (_lineConditionMap.has(lineIdx)) {
        // Compose with existing condition: both must be true
        const existingIdx = _lineConditionMap.get(lineIdx);
        const existingCond = _asLongAsConditions[existingIdx];
        const composed = (permState, allStates) => classCond(permState, allStates) && existingCond(permState, allStates);
        const idx = _asLongAsConditions.length;
        _asLongAsConditions.push(composed);
        _lineConditionMap.set(lineIdx, idx);
      } else {
        const idx = _asLongAsConditions.length;
        _asLongAsConditions.push(classCond);
        _lineConditionMap.set(lineIdx, idx);
      }
    }
  }

  // Inject leveler bracket conditions into _lineConditionMap.
  // Leveler abilities are active only when level counters are in the matching bracket range.
  // Unlike Class enchantments, leveler abilities are EXCLUSIVE — only the current bracket is active.
  // The "Level up {cost}" line is always active (no condition needed).
  // Structural lines (LEVEL headers, P/T lines) get conditions too so they display correctly.
  if (_isLeveler && _levelerLineData.size > 0) {
    const srcId = permanent.id;
    for (const [lineIdx, data] of _levelerLineData) {
      // Level up activation line is always active — no condition
      if (data.isLevelUp) continue;
      
      const bracketIdx = data.bracket;
      if (bracketIdx < 0) continue; // base level, no condition
      const bracket = _levelerBrackets[bracketIdx];
      if (!bracket) continue;
      
      const minLvl = bracket.min;
      const maxLvl = bracket.max;
      
      const levelerCond = (_permState, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) {
            const lvlCount = (srcState.counters && srcState.counters['level']) || 0;
            return lvlCount >= minLvl && lvlCount <= maxLvl;
          }
        }
        return false;
      };
      
      const idx = _asLongAsConditions.length;
      _asLongAsConditions.push(levelerCond);
      _lineConditionMap.set(lineIdx, idx);
    }
  }

  // Inject spacecraft station conditions into _lineConditionMap.
  // Station abilities are CUMULATIVE: charge counters >= N means active.
  // The "Station" keyword line is always active (no condition needed).
  if (_isSpacecraft && _spacecraftLineData.size > 0) {
    const srcId = permanent.id;
    for (const [lineIdx, data] of _spacecraftLineData) {
      if (data.isKeyword) continue;

      const minCharge = data.min;

      const spacecraftCond = (_permState, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) {
            const chargeCount = (srcState.counters && srcState.counters['charge']) || 0;
            return chargeCount >= minCharge;
          }
        }
        return false;
      };

      if (_lineConditionMap.has(lineIdx)) {
        const existingIdx = _lineConditionMap.get(lineIdx);
        const existingCond = _asLongAsConditions[existingIdx];
        const composed = (permState, allStates) => spacecraftCond(permState, allStates) && existingCond(permState, allStates);
        const idx = _asLongAsConditions.length;
        _asLongAsConditions.push(composed);
        _lineConditionMap.set(lineIdx, idx);
      } else {
        const idx = _asLongAsConditions.length;
        _asLongAsConditions.push(spacecraftCond);
        _lineConditionMap.set(lineIdx, idx);
      }
    }
  }

  // Helper: get "as long as" condition for a regex match position in oracle
  function _getConditionForPos(pos) {
    // Advance past any sentence-ending punctuation and whitespace to find the
    // actual content line. Regex anchors like (?:^|\.|;)\s* can match the "."
    // from the end of the PREVIOUS line, then consume a newline — the content
    // is on the next line, but pos points to the "." on the previous line.
    let adjustedPos = pos;
    while (adjustedPos < oracle.length && /[.\s;]/.test(oracle[adjustedPos])) {
      adjustedPos++;
    }
    const textBefore = oracle.substring(0, adjustedPos);
    const lineNum = textBefore.split('\n').length - 1;
    const condIdx = _lineConditionMap.has(lineNum) ? _lineConditionMap.get(lineNum) : -1;
    return condIdx >= 0 ? _asLongAsConditions[condIdx] : null;
  }

  const oracleLower = oracle.toLowerCase();

  // Returns true if `matchIndex` lies in the effect portion of an activated ability
  // ("{cost}: effect"). Used by the generic static parsers so they don't treat the
  // effect text of an activated ability as a static continuous effect.
  // Boundary is the start of the enclosing line (activated abilities are single-line).
  function _isInActivatedEffect(matchIndex) {
    const lineStart = oracle.lastIndexOf('\n', matchIndex - 1) + 1;
    const prefix = oracle.substring(lineStart, matchIndex);
    // Any ":" in the prefix (inside the same line) means we're past a cost:effect separator.
    // Mana/tap symbols like {U}, {T} appearing before a colon are the canonical marker.
    return /:/.test(prefix);
  }

  // --- Generic Copy Effect Parsing (Layer 1) ---
  // Detects "enters the battlefield as a copy of" / "enter the battlefield as a copy of"
  // Also detects "except" clauses for copy modifications
  const copyRegex = /enters?\s+(?:the battlefield\s+)?as\s+a\s+copy\s+of\s+(?:any\s+|a\s+|target\s+)?([^.,]+?)(?:\s*,?\s*except\s+(.+?))?(?:\.|$)/i;
  const copyMatch = oracleLower.match(copyRegex);
  if (copyMatch) {
    // Determine restriction from what can be copied (e.g. "any creature", "a creature or artifact")
    const targetDesc = copyMatch[1].trim();
    const exceptClause = copyMatch[2] ? copyMatch[2].trim() : null;
    let restriction = null;
    if (/creature/.test(targetDesc) && /artifact/.test(targetDesc)) {
      restriction = (p) => p.types.includes('Creature') || p.types.includes('Artifact');
    } else if (/creature/.test(targetDesc)) {
      restriction = (p) => p.types.includes('Creature');
    } else if (/artifact/.test(targetDesc)) {
      restriction = (p) => p.types.includes('Artifact');
    } else if (/enchantment/.test(targetDesc)) {
      restriction = (p) => p.types.includes('Enchantment');
    } else if (/nonland/.test(targetDesc)) {
      restriction = (p) => !p.types.includes('Land');
    } else if (/permanent/.test(targetDesc)) {
      restriction = () => true;
    }
    // Parse "except" clause for copy modifications
    const copyParams = { copySource: null, restriction };
    if (exceptClause) {
      // "except it's also an artifact" / "except it's an artifact in addition to its other types" -> addTypes/addSubtypes
      const CARD_TYPES = ['Artifact', 'Creature', 'Enchantment', 'Land', 'Planeswalker'];
      const alsoMatch = exceptClause.match(/it(?:'s| is) also an? (\w+)/i)
        || exceptClause.match(/it(?:'s| is) an? (\w+) in addition to/i);
      if (alsoMatch) {
        const addType = alsoMatch[1].charAt(0).toUpperCase() + alsoMatch[1].slice(1);
        if (CARD_TYPES.includes(addType)) {
          copyParams.addTypes = [addType];
        } else {
          // Not a card type — treat as subtype (e.g. Ninja, Rogue, etc.)
          copyParams.addSubtypes = [addType];
        }
      }
      // "except its name is still [X]" -> keepName
      if (/its name is still/i.test(exceptClause) || /its name is/i.test(exceptClause)) {
        copyParams.keepName = true;
      }
      // "except it's [color]" -> setColors
      const COLOR_MAP = { 'white': 'W', 'blue': 'U', 'black': 'B', 'red': 'R', 'green': 'G' };
      for (const [cName, cCode] of Object.entries(COLOR_MAP)) {
        if (exceptClause.includes(cName) && /it(?:'s| is)\s/.test(exceptClause)) {
          if (!copyParams.setColors) copyParams.setColors = [];
          copyParams.setColors.push(cCode);
        }
      }
      // "except it has this card's other abilities" -> addAbilities from all other oracle lines
      if (/it (?:has|gains?)\s+this (?:card|token)'s other abilities/i.test(exceptClause)) {
        // Gather all other ability lines from the original card's oracle text,
        // excluding the copy line itself
        const allLines = _stripReminderText(card.oracle_text || '').split('\n').map(l => l.trim()).filter(Boolean);
        const copyLineRegex = /enters?\s+(?:the battlefield\s+)?as\s+a\s+copy\s+of/i;
        copyParams.addAbilities = allLines.filter(l => !copyLineRegex.test(l));
      }
      // "except it has [ability]" / "except it gains [ability]" -> addAbilities
      else {
        const hasMatch = exceptClause.match(/it (?:has|gains?)\s+"?([^"]+)"?/i);
        if (hasMatch) {
          copyParams.addAbilities = [hasMatch[1].trim()];
        }
      }
      // "except its power and toughness are X/Y" -> setPT
      const ptMatch = exceptClause.match(/power and toughness (?:are|is) (\d+)\/(\d+)/i);
      if (ptMatch) {
        copyParams.setPT = { power: parseInt(ptMatch[1]), toughness: parseInt(ptMatch[2]) };
      }
      // "except it's a [type]" -> setTypes
      const typeMatch = exceptClause.match(/it(?:'s| is) (?:a |an )?(\w+)\b(?! also)/i);
      if (typeMatch && !alsoMatch) {
        const typeCap = typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1);
        if (['Artifact', 'Creature', 'Enchantment', 'Land', 'Planeswalker'].includes(typeCap)) {
          copyParams.setTypes = [typeCap];
        }
      }
      // "except it's not legendary" / "except it isn't legendary" -> notLegendary
      // General form: "except it's not [type]" removes the specified type from the copy
      const NOT_TYPE_MAP = { legendary: 'Legendary', artifact: 'Artifact', creature: 'Creature',
        enchantment: 'Enchantment', land: 'Land', planeswalker: 'Planeswalker' };
      // "except it's still legendary" / "except it is still [type]" -> keepLegendary / addSupertypes
      const stillMatch = exceptClause.match(/it(?:'s| is)\s+still\s+(\w+)/i);
      if (stillMatch) {
        const kept = NOT_TYPE_MAP[stillMatch[1].toLowerCase()];
        if (kept === 'Legendary') copyParams.keepLegendary = true;
        else if (kept) { if (!copyParams.addSupertypes) copyParams.addSupertypes = []; copyParams.addSupertypes.push(kept); }
      }
      // "except it's legendary in addition to its other types" -> keepLegendary (Sakashima pattern)
      if (/it(?:'s| is)\s+legendary\s+in addition to/i.test(exceptClause)) {
        copyParams.keepLegendary = true;
      }
      const notTypeMatch = exceptClause.match(/it(?:'s| is)n?'?t?\s+(?:not\s+)?(\w+)/i);
      if (notTypeMatch && notTypeMatch[1].toLowerCase() !== 'still'
          && !/it(?:'s| is)\s+legendary\s+in addition/i.test(exceptClause)) {
        const removed = NOT_TYPE_MAP[notTypeMatch[1].toLowerCase()];
        if (removed === 'Legendary') copyParams.notLegendary = true;
        else if (removed) { if (!copyParams.removeTypes) copyParams.removeTypes = []; copyParams.removeTypes.push(removed); }
      }
    }
    // Also check full oracle for "that copy/it isn't legendary" (Spark Double pattern)
    if (!copyParams.notLegendary) {
      if (/(?:that copy|the copy|it(?:'s)?) (?:is not|isn'?t) legendary/i.test(oracle)) {
        copyParams.notLegendary = true;
      }
    }
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '1', type: EFFECT_TYPE.COPY,
      params: copyParams,
      appliesTo: null, scope: 'targeted', selfTarget: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `Enter as a copy of ${targetDesc}${exceptClause ? ', except ' + exceptClause : ''}.`,
    });
  }

  // --- Aura Target Restriction: parse "Enchant [permanent type(s)]" from oracle text ---
  // Auras have "Enchant [type]" as the first line; use it to restrict which permanents are valid targets.
  const enchantLineMatch = oracle.match(/^Enchant\s+(.+?)(?:\n|$)/im);
  if (enchantLineMatch) {
    const enchantTarget = enchantLineMatch[1].trim();
    const auraRestriction = buildAuraRestriction(enchantTarget);
    if (auraRestriction) {
      for (const eff of effects) {
        if (eff.scope === 'targeted' && !eff.selfTarget) eff.auraRestriction = auraRestriction;
      }
    }
    if (!permanent._auraRestriction) permanent._auraRestriction = auraRestriction;
    // "Enchant [type] an opponent controls" — restrict targeting to opponents' permanents
    if (/\bopponent(?:'?s?)?\s+controls?\b/i.test(enchantTarget)) {
      permanent._opponentControlRequired = true;
      for (const eff of effects) {
        if (eff.scope === 'targeted' && !eff.selfTarget) eff.opponentControlRequired = true;
      }
    }
    // "Enchant [type] you control" — restrict targeting to same-controller permanents
    if (/\byou\s+controls?\b/i.test(enchantTarget)) {
      permanent._youControlRequired = true;
      for (const eff of effects) {
        if (eff.scope === 'targeted' && !eff.selfTarget) eff.youControlRequired = true;
      }
    }
  }

  function detectSelfAffect(text) {
    const t = text.toLowerCase().trim();
    return !(t.startsWith('other ') || t.includes('each other') || /\bother\b/.test(t));
  }

  // Fix 10: Detect standalone "loses all creature types" (outside complex aura parser)
  // Guard: skip if the matched text appears in the effect portion of an activated ability
  // (i.e., the sentence containing "loses all creature types" has a colon before it, as in
  // "{Q}: Target creature loses all creature types until end of turn." on Amoeboid Changeling).
  const _losesAllCTMatch = /loses? all creature types/i.exec(oracle);
  const _isLosesInActivatedAbility = _losesAllCTMatch && (() => {
    const before = oracle.substring(0, _losesAllCTMatch.index);
    const clauseStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf(';'), before.lastIndexOf('\n')) + 1;
    return before.substring(clauseStart).includes(':');
  })();
  // Skip standalone handling when "lose all creature types" appears in the same clause as
  // "have base power and toughness" — generalBasePTRegex handles those with the correct filter.
  const _losesCTInBasePTClause = _losesAllCTMatch && (() => {
    const idx = _losesAllCTMatch.index;
    const before = oracle.substring(0, idx);
    const clauseStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf(';'), before.lastIndexOf('\n')) + 1;
    return /have\s+base\s+power\s+and\s+toughness/i.test(oracle.substring(clauseStart, idx + 30));
  })();
  // "Target creature gains all creature types until end of turn" (e.g. Amoeboid Changeling ability)
  // Guard: skip if the match is inside the effect portion of an activated ability (colon in same clause),
  // same as the _isLosesInActivatedAbility guard below. The effect is handled via the pseudo-perm instead.
  const gainsAllCTMatch = /\b(?:target\s+([\w][\w\s]*?(?=\s+gains?))|(?:this\s+(?:creature|permanent|card|token)|it))\s+gains?\s+all\s+creature\s+types/i.exec(oracle);
  const _isGainsInActivatedAbility = gainsAllCTMatch && (() => {
    const before = oracle.substring(0, gainsAllCTMatch.index);
    const clauseStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf(';'), before.lastIndexOf('\n')) + 1;
    return before.substring(clauseStart).includes(':');
  })();
  if (gainsAllCTMatch && !_isGainsInActivatedAbility && !effects.some(e => e.params && e.params.gainsAllCreatureTypes && e.selfTarget && e.sourceId === permanent.id)) {
    const rawFilter = gainsAllCTMatch[1];
    const isSelf = !rawFilter;
    const { fn } = rawFilter ? buildAppliesToFromText(rawFilter.trim()) : { fn: null };
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '4', type: EFFECT_TYPE.ADD_TYPE,
      params: { gainsAllCreatureTypes: true },
      appliesTo: fn,
      targetRestriction: fn,
      scope: 'targeted',
      selfTarget: isSelf,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: 'Gains all creature types.',
    });
  }

  // Changeling keyword ability → Layer 4 self-effect granting all creature types.
  // "Changeling" is an ability; its type-changing consequence is a Layer 4 effect.
  if (/\bchangeling\b/i.test(oracle) &&
      !effects.some(e => e.type === EFFECT_TYPE.ADD_TYPE && e.params.gainsAllCreatureTypes && e.selfTarget && e.sourceId === permanent.id)) {
    effects.push({
      id: `${permanent.id}_eff_changeling`,
      layer: '4', type: EFFECT_TYPE.ADD_TYPE,
      params: { gainsAllCreatureTypes: true },
      appliesTo: null,
      scope: 'targeted',
      selfTarget: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: 'Changeling — this permanent is every creature type.',
    });
  }

  if (/loses? all creature types/i.test(oracle) && !_isLosesInActivatedAbility && !_losesCTInBasePTClause && !effects.some(e => e.params.losesAllCreatureTypes || e.params.losesAllCreatureTypesOnly)) {
    // Determine scope: self, enchanted/equipped, or targeted ("target X")
    const isSelfLose = /\b(this creature|this permanent|this card|this token|it)\s+loses? all creature types/i.test(oracle);
    const isEnchanted = /(?:enchanted|equipped)\s+(?:(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\s+loses? all creature types/i.test(oracle);
    const isTargetedLose = /\btarget\s+\w+(?:\s+\w+)?\s+loses? all creature types/i.test(oracle);
    let losesAllCTAppliesTo = null;
    if (isTargetedLose) {
      const m = /\btarget\s+([\w][\w\s]*?(?=\s+loses?))/i.exec(oracle);
      if (m) losesAllCTAppliesTo = buildAppliesToFromText(m[1].trim()).fn;
    }
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
      // losesAllCreatureTypesOnly: only strip creature types, don't remove abilities.
      // Use the combined losesAllCreatureTypes (with ability removal) only when the oracle
      // also says "loses all abilities" — that path is handled by the aura/enchant parser.
      params: { losesAllCreatureTypesOnly: true },
      appliesTo: losesAllCTAppliesTo,
      targetRestriction: losesAllCTAppliesTo,
      scope: (isSelfLose || isEnchanted || isTargetedLose) ? 'targeted' : 'global',
      selfTarget: isSelfLose || false,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `Loses all creature types.`,
    });
  }

  // ---- Layer 4: Type changes ----
  const addTypeRegex = /(?:^|[.;])\s*(?:all\s+|each\s+)?(.+?)\s+(?:you (?:control|own)\s+)?(?:are|is|have|has|becomes?)\s+(.+?)\s+in addition to (?:its|their) other\b.*?types/gmi;
  const addTypeMatchRanges = [];
  let addTypeMatch;
  while ((addTypeMatch = addTypeRegex.exec(oracle)) !== null) {
    const filterText = addTypeMatch[1].trim();
    const becomesText = addTypeMatch[2].trim();
    // Skip triggered/activated ability text that matched the regex
    const _atFLower = filterText.toLowerCase();
    if (_atFLower.includes('whenever ') || _atFLower.includes('when ') ||
        _atFLower.includes('if ') || _atFLower.length > 100) continue;
    // Fix 10: Skip if filterText doesn't reference permanents (e.g. "hand size", "life total")
    if (!filterReferencesPermanents(filterText)) continue;
    // Skip compound enchantment clauses (handled by enchant transform parser Fix 17)
    if (/(?:enchanted|equipped)\s+\w+\s+has\s+base\s+power|loses\s+all/i.test(filterText)) continue;
    // Skip "have base power and toughness X/Y and are [type]" — handled by generalBasePTRegex
    if (/\bhave\s+base\s+power\s+and\s+toughness\b/i.test(filterText)) continue;
    // Multiplayer: restore "you control" stripped by optional regex group
    let addTypeFilterText = filterText;
    if (/\byou (?:control|own)\b/i.test(addTypeMatch[0]) && !/\byou (?:control|own)\b/i.test(addTypeFilterText)) {
      addTypeFilterText += ' you control';
    }
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(addTypeFilterText);
    const selfAffect = detectSelfAffect(addTypeFilterText);
    // Strip quoted ability text from becomesText before parsing types
    // e.g. 'lifelink and "Other commanders you control get +2/+2 and have lifelink," and is a Performer'
    // -> 'lifelink and  and is a Performer' -> parseBecomesType only sees type words
    const cleanedBecomesText = becomesText.replace(/"(?:[^"\\]|\\.)*"/g, '').replace(/\s{2,}/g, ' ').trim();
    const parsed = parseBecomesType(cleanedBecomesText);
    addTypeMatchRanges.push({ start: addTypeMatch.index, end: addTypeMatch.index + addTypeMatch[0].length });
    const addTypeCond = _getConditionForPos(addTypeMatch.index);
    const addTypeEffCountBefore = effects.length;

    // Determine whether "in addition to" covers colors, types, or both.
    // "in addition to its other colors and types" → both added
    // "in addition to their other creature types" → only types added, colors are SET
    const fullAdditionText = addTypeMatch[0];
    const inAdditionClause = fullAdditionText.match(/in addition to (?:its|their) other\b(.*?)types/i);
    const additionCoversColors = inAdditionClause && /colors?\b/i.test(inAdditionClause[1]);

    // Assign a shared abilityGroupId (CR 613: all parts of the same effect apply together)
    const _addAbilityGroupId = `${permanent.id}_addType_${effects.length}`;

    // Also extract P/T from becomesText (e.g. "6/6 blue Leviathan creatures")
    const ptMatch = becomesText.match(/(\d+)\/(\d+)/);
    if (ptMatch) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { power: parseInt(ptMatch[1]), toughness: parseInt(ptMatch[2]) },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have base P/T ${ptMatch[1]}/${ptMatch[2]}. ${desc}`,
      });
    }
    // "with power and toughness each equal to its mana value" (Opalescence, Starfield of Nyx)
    // Check both becomesText AND text immediately after the addTypeRegex match
    const afterMatchText = oracle.substring(addTypeMatch.index + addTypeMatch[0].length, oracle.indexOf('.', addTypeMatch.index + addTypeMatch[0].length) + 1) || '';
    const combinedMVText = becomesText + ' ' + afterMatchText;
    if (!ptMatch && /(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/i.test(combinedMVText)) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { useMV: true },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have P/T equal to mana value. ${desc}`,
      });
    }

    // Also extract colors from becomesText
    const COLOR_NAMES = { 'white': 'W', 'blue': 'U', 'black': 'B', 'red': 'R', 'green': 'G' };
    const addedColors = [];
    for (const [colorName, colorCode] of Object.entries(COLOR_NAMES)) {
      if (becomesText.toLowerCase().includes(colorName)) addedColors.push(colorCode);
    }
    if (addedColors.length > 0) {
      // If "in addition to" covers colors (e.g. "colors and types"), ADD color.
      // If it only covers types (e.g. "creature types"), SET color.
      const colorEffectType = additionCoversColors ? EFFECT_TYPE.ADD_COLOR : EFFECT_TYPE.SET_COLOR;
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '5', type: colorEffectType,
        params: { colors: addedColors },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} become ${addedColors.join(', ')}. ${desc}`,
      });
    }

    if (parsed.types.length > 0 || parsed.subtypes.length > 0) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.ADD_TYPE,
        params: { types: parsed.types, subtypes: parsed.subtypes },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} are also ${becomesText}. ${desc}`,
      });
    }

    // Fix 18: Handle "with [abilities]" from parseBecomesType
    if (parsed.grantedAbilities && parsed.grantedAbilities.length > 0) {
      if (parsed.grantedAbilities.includes('__NO_ABILITIES__')) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES, params: {},
          appliesTo: (isSelf || isTargeted) ? null : fn, scope: (isSelf || isTargeted) ? 'targeted' : 'global', selfTarget: isSelf || false, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} lose all abilities. ${desc}`,
        });
      } else {
        for (const ability of parsed.grantedAbilities) {
          effects.push({
            id: `${permanent.id}_eff_${effects.length}`,
            layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability },
            appliesTo: (isSelf || isTargeted) ? null : fn, scope: (isSelf || isTargeted) ? 'targeted' : 'global', selfTarget: isSelf || false, affectsSelf: selfAffect,
            sourceId: permanent.id, sourceName: card.name,
            timestamp: permanent.timestamp,
            desc: `${filterText} gain ${ability}. ${desc}`,
          });
        }
      }
    }

    // Parse "and has [abilities]" text that follows "in addition to its other types"
    // E.g., Bello: "...in addition to its other types and has indestructible, haste, and "...""
    const matchEndPos = addTypeMatch.index + addTypeMatch[0].length;
    const afterMatch = oracle.substring(matchEndPos);
    const andHasMatch = afterMatch.match(/^\s+and\s+(?:has|have|gains?)\s+(.+)/i);
    if (andHasMatch) {
      // Extend the match range to include the "and has..." text for overlap detection
      addTypeMatchRanges[addTypeMatchRanges.length - 1].end = matchEndPos + andHasMatch[0].length;
      const abilityText = andHasMatch[1].trim().replace(/\.\s*$/, '');
      // Extract quoted abilities
      const quotedAbilities = [];
      let cleanText = abilityText.replace(/[""\u201c]((?:[^""\u201d]|'(?!(?:\s|$|,)))*)[""\u201d]/g, (m, inner) => {
        quotedAbilities.push(inner.trim());
        return '';
      });
      // Parse keyword abilities with simple splitting (kwSet not available yet)
      const BASIC_KW = ['flying','first strike','double strike','deathtouch','haste',
        'hexproof','indestructible','lifelink','menace','reach','trample','vigilance',
        'flash','defender','fear','intimidate','shroud','wither','infect','prowess',
        'ward','shadow','horsemanship','totem armor','undying','persist','exalted',
        'decayed','training','reconfigure','living metal','toxic','backup','bargain'];
      const bkwSet = new Set(BASIC_KW);
      const kwParts = cleanText.toLowerCase().trim()
        .replace(/^(?:,\s*)?(?:and\s+)?/, '')
        .split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
      const parsedKws = [];
      for (const part of kwParts) {
        if (bkwSet.has(part)) {
          parsedKws.push(part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        } else {
          // Parameterized: "ward {2}", "toxic 1"
          const pm = part.match(/^(\w+(?:\s+\w+)?)\s+(.+)$/);
          if (pm && bkwSet.has(pm[1])) {
            parsedKws.push(pm[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' ' + pm[2]);
          }
        }
      }
      const allAbilities = [...parsedKws, ...quotedAbilities];
      for (const ability of allAbilities) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
          params: { ability },
          appliesTo: (isSelf || isTargeted) ? null : fn,
          scope: (isSelf || isTargeted) ? 'targeted' : 'global',
          selfTarget: isSelf || false,
          affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} gain ${ability}. ${desc}`,
        });
      }
    }

    // Attach "as long as" condition to all effects generated from this addType match
    if (addTypeCond) {
      for (let ei = addTypeEffCountBefore; ei < effects.length; ei++) {
        effects[ei].asLongAsCondition = addTypeCond;
      }
    }
    // CR 613: Tag all effects from this ability with a shared group ID
    for (let ei = addTypeEffCountBefore; ei < effects.length; ei++) {
      effects[ei].abilityGroupId = _addAbilityGroupId;
    }
  }

  const setTypeRegex = /(?:^|[.;])\s*(?:all\s+|each\s+)?(.+?)\s+(?:you (?:control|own)\s+)?(?:are|is|becomes?)\s+(.+?)(?:\.|$)/gmi;
  let setTypeMatch;
  while ((setTypeMatch = setTypeRegex.exec(oracle)) !== null) {
    const mStart = setTypeMatch.index;
    const mEnd = mStart + setTypeMatch[0].length;
    const overlaps = addTypeMatchRanges.some(r => mStart < r.end && mEnd > r.start);
    if (overlaps) continue;

    const filterText = setTypeMatch[1].trim();
    let becomesText = setTypeMatch[2].trim();
    if (becomesText.toLowerCase().includes('in addition to')) continue;

    // Fix: Extract trailing "and have base power and toughness X/Y" before skipWords check.
    // Cards like Kudo: "Other creatures you control are Bears and have base power and toughness 2/2."
    let trailingBasePT = null;
    const basePTSplit = becomesText.match(/^(.+?)\s+and\s+have\s+(?:base\s+)?power\s+and\s+toughness\s+(\d+)\/(\d+)/i);
    if (basePTSplit) {
      becomesText = basePTSplit[1].trim();
      trailingBasePT = { power: parseInt(basePTSplit[2]), toughness: parseInt(basePTSplit[3]) };
    }
    // Fix: Extract "with [base] power and toughness X/Y" (e.g., "a Bear with base power and toughness 4/2")
    if (!trailingBasePT) {
      const withPTSplit = becomesText.match(/^(.+?)\s+with\s+(?:base\s+)?power\s+and\s+toughness\s+(\d+)\/(\d+)/i);
      if (withPTSplit) {
        becomesText = withPTSplit[1].trim();
        trailingBasePT = { power: parseInt(withPTSplit[2]), toughness: parseInt(withPTSplit[3]) };
      }
    }
    // Fix: Extract "with power and toughness each equal to its mana value/converted mana cost"
    // (March of the Machines, Opalescence, Starfield of Nyx, etc.)
    let useManaValue = false;
    if (!trailingBasePT) {
      const mvPTSplit = becomesText.match(/^(.+?)\s+with\s+(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/i);
      if (mvPTSplit) {
        becomesText = mvPTSplit[1].trim();
        useManaValue = true;
      }
    }
    // Also handle trailing "and have/has power and toughness each equal to its mana value"
    if (!trailingBasePT && !useManaValue) {
      const trailingMVSplit = becomesText.match(/^(.+?)\s+and\s+(?:have|has)\s+(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/i);
      if (trailingMVSplit) {
        becomesText = trailingMVSplit[1].trim();
        useManaValue = true;
      }
    }

    // Strip "until end of turn" / "until your next turn" duration clauses from becomesText.
    // Without this, "creature until end of turn" adds "Until", "End", "Turn" as fake subtypes.
    becomesText = becomesText.replace(/\s+until\s+(?:end\s+of\s+(?:turn|combat|your\s+next\s+turn)|your\s+next\s+turn|the\s+end\s+of\s+(?:turn|combat)|beginning\s+of\s+(?:your|their)\s+next\s+\w+)/i, '').trim();

    // Extract "that's still a [type]" / "that is still a [type]" clauses (Gideon Blackblade pattern)
    // These indicate types to preserve (ADD_TYPE rather than losing them)
    const _stKeepTypes = [];
    const stillMatch = becomesText.match(/\s+that(?:'s| is)\s+still\s+(?:a\s+|an\s+)?(.+)$/i);
    if (stillMatch) {
      becomesText = becomesText.slice(0, becomesText.length - stillMatch[0].length).trim();
      const stillTypes = parseBecomesType(stillMatch[1]);
      _stKeepTypes.push(...stillTypes.types);
    }
    // Broad oracle-level scan for "still a/an [type]" — catches follow-up sentences with any
    // phrasing: "It's still a land.", "It is still a land.", "that's still a creature.", etc.
    // Handles contractions and sentence-boundary variations that inline regexes miss.
    if (_stKeepTypes.length === 0) {
      for (const m of oracle.matchAll(/\bstill\s+(?:a\s+|an\s+)?(\w+)/gi)) {
        const _sp = parseBecomesType(m[1]);
        _stKeepTypes.push(..._sp.types.filter(t => !_stKeepTypes.includes(t)));
      }
    }

    // Extract "with [keyword ability]" clauses from becomesText (e.g. "with indestructible", "with hexproof")
    // These are abilities to grant, not type-change text. Strip before skipWords check.
    const _stGrantAbilities = [];
    const KEYWORD_ABILITIES = ['deathtouch','defender','double strike','first strike','flash',
      'flying','haste','hexproof','indestructible','lifelink','menace','prowess',
      'reach','shroud','trample','vigilance','ward','fear','intimidate','shadow',
      'horsemanship','flanking','phasing','protection','banding','wither','infect',
      'undying','persist'];
    const withKWMatch = becomesText.match(/\s+with\s+(.+)$/i);
    if (withKWMatch) {
      const withText = withKWMatch[1].trim();
      // Check if the "with" clause contains keyword abilities (not "with power and toughness")
      const withWords = withText.toLowerCase().split(/\s+and\s+|\s*,\s*/);
      const foundKWs = withWords.filter(w => KEYWORD_ABILITIES.includes(w.trim()));
      if (foundKWs.length > 0) {
        becomesText = becomesText.slice(0, becomesText.length - withKWMatch[0].length).trim();
        _stGrantAbilities.push(...foundKWs.map(k => k.trim()));
      }
    }

    // Extract "and has/gains [ability]" or "and this card/creature has [ability]" trailing clauses
    const andHasMatch = becomesText.match(/\s+and\s+(?:(?:this\s+(?:card|creature|permanent|token)\s+)?(?:has|gains?|have))\s+(.+)$/i);
    if (andHasMatch && !andHasMatch[0].toLowerCase().includes('power and toughness')) {
      const abilText = andHasMatch[1].trim();
      const abilWords = abilText.toLowerCase().split(/\s+and\s+|\s*,\s*/);
      const foundAbils = abilWords.filter(w => KEYWORD_ABILITIES.includes(w.trim()));
      if (foundAbils.length > 0) {
        becomesText = becomesText.slice(0, becomesText.length - andHasMatch[0].length).trim();
        _stGrantAbilities.push(...foundAbils.map(k => k.trim()));
      }
    }

    // Extract "with equip {N}[ and "[ability]",][ where N is [source] mana value]"
    // This is the Bludgeon Brawl pattern: grants equip with cost = mana value,
    // plus an optional quoted ability (e.g. "Equipped creature gets +1/+0,").
    // Must be stripped before the skipWords check (blocks on "equipped"/"mana"/"cost"/etc.).
    let _stEquipManaValue = false;
    let _stEquipGrantedAbility = null; // the quoted ability text, with variable substituted
    const equipMVMatch = becomesText.match(
      /\s+with\s+equip\s+\{[^}]*\}(?:\s+and\s+([\u201c"][^\u201d"]*[\u201d"]))?[\s,]*(?:where\s+(\S+)\s+is\s+(?:its|that\s+[a-z]+(?:'s|s)?)\s+(?:mana\s+value|converted\s+mana\s+cost))?/i
    );
    if (equipMVMatch) {
      becomesText = becomesText.slice(0, becomesText.length - equipMVMatch[0].length).trim();
      _stEquipManaValue = true;
      // Capture the quoted ability (e.g. "Equipped creature gets +1/+0,") and replace
      // the numeric variable with "{mana value}" so it reads correctly regardless of cost.
      if (equipMVMatch[1]) {
        const varName = equipMVMatch[2] || '1'; // the variable token (e.g. "1" or "X")
        const varEscaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const raw = equipMVMatch[1].replace(/^[\u201c"]|[\u201d",]+$/g, '').trim();
        _stEquipGrantedAbility = raw.replace(new RegExp(`\\+${varEscaped}/`, 'g'), '+{mana value}/')
                                    .replace(new RegExp(`\\+${varEscaped}$`, 'g'), '+{mana value}');
      }
    }

    const skipWords = ['power', 'toughness', 'p/t', 'base', 'equal', 'unblockable',
      'indestructible', 'hexproof', 'lose', 'gain', 'get', 'put', 'draw',
      'counter', 'target', 'return', 'destroy', 'exile', 'sacrifice',
      'tap', 'untap', 'enters', 'leaves', 'dealt', 'damage', 'life',
      'mana', 'pay', 'cost', 'less', 'more', 'chosen', 'whenever',
      'enchanted', 'equipped', 'attached', 'control', 'own', 'cast',
      'each other', 'affected', 'able', 'unable', 'can\'t', 'don\'t',
      'may', 'must', 'would', 'could', 'should', 'if ', 'when ',
      'attacking', 'blocking', 'tapped', 'untapped', 'face',
      'increased', 'reduced', 'decreased', 'maximum', 'minimum',
      'number', 'total', 'amount', 'size', 'hand', 'library',
      'graveyard', 'revealed', 'discarded', 'prevent', 'instead'];
    const bLower = becomesText.toLowerCase();
    if (skipWords.some(w => bLower.includes(w))) continue;

    const fLower = filterText.toLowerCase();
    if (fLower.includes('if ') || fLower.includes('when ') || fLower.includes('whenever ') ||
        fLower.includes('that ') || fLower.includes('with ') || fLower.includes('enchanted') ||
        fLower.includes('equipped') || fLower.includes('opponent') || fLower.includes('player') ||
        fLower.includes('hand') || fLower.includes('library') || fLower.includes('graveyard') ||
        fLower.includes('life') || fLower.includes('spell') || fLower.length > 80) continue;

    // Fix 10: Skip if filterText doesn't reference permanents (e.g. "hand size", "life total")
    if (!filterReferencesPermanents(filterText)) continue;

    // "It is still a [type]." is a continuation sentence for enchantTransformRegex aura/equip effects.
    // Parsing it here would generate a selfTarget SET_TYPE on the source aura itself (wrong).
    // enchantTransformRegex already merges "It is/has..." continuations and handles them correctly.
    if (/^it$/i.test(filterText) && /\bstill\b/i.test(becomesText)) continue;

    // Fix: Handle "X loses all abilities and is Y" pattern (e.g. Titania's Song).
    // The setTypeRegex lazily matches the first standalone "is", so filterText becomes
    // "noncreature artifact loses all abilities and" instead of "noncreature artifact".
    // Strip the "loses ... and" suffix to recover the actual subject filter.
    let _stSubjectText = filterText;
    const losesAbilitiesAndMatch = filterText.match(/^(.+?)\s+loses\s+all\s+(?:its\s+)?abilities\s+and\s*$/i);
    if (losesAbilitiesAndMatch) {
      _stSubjectText = losesAbilitiesAndMatch[1].trim();
    }

    // Multiplayer: restore "you control" stripped by optional regex group
    if (/\byou (?:control|own)\b/i.test(setTypeMatch[0]) && !/\byou (?:control|own)\b/i.test(_stSubjectText)) {
      _stSubjectText += ' you control';
    }
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(_stSubjectText);
    const selfAffect = isSelf ? true : detectSelfAffect(_stSubjectText);
    const _stScope = (isSelf || isTargeted) ? 'targeted' : 'global';
    const _stAppliesTo = (isSelf || isTargeted) ? null : fn;
    const _stSelfTarget = isSelf || false;

    // Assign a shared abilityGroupId so the engine knows all these effects are part of the
    // same ability. CR 613: once any part of a continuous effect applies to a permanent,
    // all other parts of that same effect also apply to that permanent.
    const _stAbilityGroupId = `${permanent.id}_setType_${effects.length}`;

    // "is not a creature" / "isn't a creature" → REMOVE_TYPE instead of SET_TYPE
    const notATypeMatch = becomesText.match(/^not\s+(?:a\s+)?(.+)$/i);
    if (notATypeMatch) {
      const notParsed = parseBecomesType(notATypeMatch[1]);
      if (notParsed.types.length > 0) {
        const setTypeCond = _getConditionForPos(setTypeMatch.index);
        const eff = {
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: EFFECT_TYPE.REMOVE_TYPE,
          params: { types: notParsed.types },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} is not a ${notParsed.types.join(', ')}. ${desc}`,
        };
        if (setTypeCond) eff.asLongAsCondition = setTypeCond;
        effects.push(eff);
        continue;
      }
    }

    const parsed = parseBecomesType(becomesText);
    if (parsed.types.length === 0 && parsed.subtypes.length === 0) continue;
    const setTypeCond = _getConditionForPos(setTypeMatch.index);
    const setTypeEffCountBefore = effects.length;

    const filterClean = _stSubjectText.toLowerCase().replace(/^(?:all|each|other)\s+/, '').replace(/\s+you control$/, '');
    const filterTypeInfo = CARD_TYPE_WORDS[filterClean] || CARD_TYPE_WORDS[filterClean.replace(/s$/, '')];

    // Pre-compute the card types required by the filter — used in multiple branches below.
    const filterWords = filterClean.replace(/^non-?\w+,?\s*/, '').split(/\s+/);
    const filterTypes = [];
    for (const fw of filterWords) {
      const fti = CARD_TYPE_WORDS[fw] || CARD_TYPE_WORDS[fw.replace(/s$/, '')];
      if (fti && fti.check === 'type') filterTypes.push(fti.value);
    }

    if (filterTypeInfo && filterTypeInfo.check === 'type' && parsed.isLandSubtype) {
      const category = filterTypeInfo.value.toLowerCase();
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.SET_TYPE,
        params: { subtypes: parsed.subtypes, replaceSubtypeCategory: category, keepSupertypes: true, keepTypes: true },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} are ${becomesText}. ${desc}`,
      });
    } else if (parsed.isLandSubtype && !filterTypeInfo) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.SET_TYPE,
        params: { subtypes: parsed.subtypes, replaceSubtypeCategory: 'land', keepSupertypes: true, keepTypes: true },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} are ${becomesText}. ${desc}`,
      });
    } else if (parsed.types.length === 0 && parsed.subtypes.length > 0) {
      // Subtype-only: "are Bears" / "is a Juggernaut" → replace creature subtypes.
      // Exception: if the filter restricts to a non-creature card type (e.g. "artifact"),
      // the new subtype is an artifact/enchantment/etc. subtype, not a creature subtype.
      // In that case use ADD_TYPE to add it alongside any existing subtypes (Bludgeon Brawl
      // adds Equipment without removing other artifact subtypes the card may have).
      const filterHasNonCreatureType = filterTypes.some(
        ft => ft !== 'Creature' && ['Artifact', 'Enchantment', 'Land', 'Planeswalker', 'Battle'].includes(ft)
      );
      if (filterHasNonCreatureType || _stEquipManaValue) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: EFFECT_TYPE.ADD_TYPE,
          params: { subtypes: parsed.subtypes },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          abilityGroupId: _stAbilityGroupId,
          desc: `${filterText} gain subtype ${parsed.subtypes.join(', ')}. ${desc}`,
        });
      } else {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: EFFECT_TYPE.SET_TYPE,
          params: { subtypes: parsed.subtypes, replaceSubtypeCategory: 'creature', keepSupertypes: true, keepTypes: true },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} are ${becomesText}. ${desc}`,
        });
      }
    } else if (_stKeepTypes.length > 0) {
      // "still a [type]" — use ADD_TYPE to preserve existing types and subtypes.
      // keepTypes are merged into allTypes here, so the legacy push at line ~5413 is skipped.
      const allTypes = [...new Set([...parsed.types, ..._stKeepTypes])];
      _stKeepTypes.length = 0; // mark as merged so the legacy safety push below doesn't duplicate
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.ADD_TYPE,
        params: { types: allTypes, subtypes: parsed.subtypes },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} are ${becomesText}. ${desc}`,
      });
    } else {
      // Detect if becomesText types are a superset of the filter's required types.
      // E.g., filter "noncreature artifact" requires Artifact; becomes "artifact creature" = [Artifact, Creature].
      // In this case, use ADD_TYPE for just the new types (Creature), preserving other types the permanent may have.
      // (filterTypes is pre-computed above the if-else chain)
      const newTypes = parsed.types.filter(t => !filterTypes.includes(t));
      if (filterTypes.length > 0 && newTypes.length > 0 && filterTypes.every(ft => parsed.types.includes(ft))) {
        // Use ADD_TYPE for the new types only (e.g., add Creature to artifacts)
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: EFFECT_TYPE.ADD_TYPE,
          params: { types: newTypes, subtypes: parsed.subtypes },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} are ${becomesText}. ${desc}`,
        });
      } else {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: EFFECT_TYPE.SET_TYPE,
          params: { types: parsed.types, subtypes: parsed.subtypes, keepSupertypes: true },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} are ${becomesText}. ${desc}`,
        });
      }
    }

    // If the original oracle clause included "loses all [its] abilities and is ...",
    // generate a Layer 6 REMOVE_ABILITIES effect for the same subject.
    if (losesAbilitiesAndMatch) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES, params: {},
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${_stSubjectText} loses all abilities. ${desc}`,
      });
    }

    // Also extract P/T from "are X/Y ..." pattern (set variant, no "in addition to")
    const setPtMatch = becomesText.match(/(\d+)\/(\d+)/);
    if (setPtMatch) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { power: parseInt(setPtMatch[1]), toughness: parseInt(setPtMatch[2]) },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have base P/T ${setPtMatch[1]}/${setPtMatch[2]}. ${desc}`,
      });
    }

    // Handle trailing "and have base power and toughness X/Y" (Kudo pattern)
    if (trailingBasePT) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { power: trailingBasePT.power, toughness: trailingBasePT.toughness },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have base P/T ${trailingBasePT.power}/${trailingBasePT.toughness}. ${desc}`,
      });
    }

    // Handle "with/and power and toughness each equal to its mana value" (March of the Machines)
    if (useManaValue) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { useMV: true },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have P/T equal to mana value. ${desc}`,
      });
    }

    // Bludgeon Brawl pattern: "is an Equipment with equip {X}[ and "ability"], where X is its mana value"
    // Generates Layer 6 ADD_ABILITY effects for the equip ability and any quoted granted ability.
    if (_stEquipManaValue) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability: 'Equip {mana value}' },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        abilityGroupId: _stAbilityGroupId,
        desc: `${filterText} gain equip {mana value}. ${desc}`,
      });
      if (_stEquipGrantedAbility) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
          params: { ability: _stEquipGrantedAbility },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          abilityGroupId: _stAbilityGroupId,
          desc: `${filterText} gain "${_stEquipGrantedAbility}". ${desc}`,
        });
      }
    }

    // Also extract colors from "are ... [color] ..." pattern
    // When "still" is present, ADD colors (preserve existing); otherwise SET colors.
    const SET_COLOR_NAMES = { 'white': 'W', 'blue': 'U', 'black': 'B', 'red': 'R', 'green': 'G' };
    const setColors = [];
    for (const [colorName, colorCode] of Object.entries(SET_COLOR_NAMES)) {
      if (becomesText.toLowerCase().includes(colorName)) setColors.push(colorCode);
    }
    if (setColors.length > 0) {
      const colorEffectType = _stKeepTypes.length > 0 ? EFFECT_TYPE.ADD_COLOR : EFFECT_TYPE.SET_COLOR;
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '5', type: colorEffectType,
        params: { colors: setColors },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} become ${setColors.join(', ')}. ${desc}`,
      });
    } else if (becomesText.toLowerCase().includes('colorless')) {
      // "colorless" → set empty color array (SET_COLOR with no colors = colorless)
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '5', type: EFFECT_TYPE.SET_COLOR,
        params: { colors: [] },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} become colorless. ${desc}`,
      });
    }

    // Fix 18: Handle "with [abilities]" from parseBecomesType
    if (parsed.grantedAbilities && parsed.grantedAbilities.length > 0) {
      if (parsed.grantedAbilities.includes('__NO_ABILITIES__')) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES, params: {},
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} lose all abilities. ${desc}`,
        });
      } else {
        for (const ability of parsed.grantedAbilities) {
          effects.push({
            id: `${permanent.id}_eff_${effects.length}`,
            layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability },
            appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
            sourceId: permanent.id, sourceName: card.name,
            timestamp: permanent.timestamp,
            desc: `${filterText} gain ${ability}. ${desc}`,
          });
        }
      }
    }

    // Handle "that's still a [type]" → ADD_TYPE to preserve the type (e.g. Gideon: "still a planeswalker")
    if (_stKeepTypes.length > 0) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.ADD_TYPE,
        params: { types: _stKeepTypes, subtypes: [] },
        appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} is still a ${_stKeepTypes.join(', ')}. ${desc}`,
      });
    }

    // Handle "with [keyword]" and "and has [keyword]" → ADD_ABILITY
    if (_stGrantAbilities.length > 0) {
      for (const ability of _stGrantAbilities) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
          params: { ability },
          appliesTo: _stAppliesTo, scope: _stScope, selfTarget: _stSelfTarget, affectsSelf: selfAffect,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${filterText} gains ${ability}. ${desc}`,
        });
      }
    }

    // Attach "as long as" condition to all effects generated from this setType match
    if (setTypeCond) {
      for (let ei = setTypeEffCountBefore; ei < effects.length; ei++) {
        effects[ei].asLongAsCondition = setTypeCond;
      }
    }
    // CR 613: Tag all effects from this ability with a shared group ID so the engine
    // knows they are part of the same continuous effect. Once any part applies to a
    // permanent in its first layer, all subsequent parts also apply to that permanent.
    for (let ei = setTypeEffCountBefore; ei < effects.length; ei++) {
      effects[ei].abilityGroupId = _stAbilityGroupId;
    }
  }

  // ---- "[subject] isn't a [type/subtype]" → REMOVE_TYPE (layer 4) ----
  // Handles standalone "this creature isn't a Human" and compound activated-ability forms like
  // "this creature has base P/T 5/3, gains trample, and isn't a Human."
  {
    const isntTypeRegex = /(?:^|[.;])\s*(.+?)\s+isn't\s+(?:a\s+|an\s+)?(\w+)/gmi;
    let isntMatch;
    while ((isntMatch = isntTypeRegex.exec(oracle)) !== null) {
      if (_isInActivatedEffect(isntMatch.index)) continue;
      let isntFilter = isntMatch[1].trim();
      const isntWord = isntMatch[2];
      // Skip state-based words that are not card types/subtypes
      if (/^(?:monstrous|saddled|crewed|tapped|attacking|blocking|still|legendary)\b/i.test(isntWord)) continue;
      // Strip leading duration prefix
      isntFilter = isntFilter.replace(/^until\s+(?:end\s+of\s+turn|your\s+next\s+turn)\s*,\s*/i, '');
      // Strip "has base power and toughness X/Y[,]" clause (compound activated-ability pattern)
      isntFilter = isntFilter.replace(/\s+has\s+base\s+power\s+and\s+toughness\s+\d+\/\d+\s*,?\s*/i, ' ');
      // Strip ", gains [keywords], and" trailing clause
      isntFilter = isntFilter.replace(/\s+gains?\s+[^,]+,\s+and\s*$/i, '');
      isntFilter = isntFilter.replace(/\s+and\s*$/i, '').trim();
      if (!isntFilter || !filterReferencesPermanents(isntFilter)) continue;
      const isntParsed = parseBecomesType(isntWord);
      if (isntParsed.types.length === 0 && isntParsed.subtypes.length === 0) continue;
      const isntApplies = buildAppliesToFromText(isntFilter);
      const isntSelf = isntApplies.isSelf ? true : detectSelfAffect(isntFilter);
      const isntScope = (isntApplies.isSelf || isntApplies.isTargeted) ? 'targeted' : 'global';
      const isntAppliesTo = (isntApplies.isSelf || isntApplies.isTargeted) ? null : isntApplies.fn;
      const isntSelfTarget = isntApplies.isSelf || false;
      const isntCond = _getConditionForPos(isntMatch.index);
      const eff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.REMOVE_TYPE,
        params: { types: isntParsed.types, subtypes: isntParsed.subtypes },
        appliesTo: isntAppliesTo, scope: isntScope, selfTarget: isntSelfTarget,
        affectsSelf: isntSelf,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${isntFilter} isn't a ${isntWord}. ${isntApplies.desc}`,
      };
      if (isntCond) eff.asLongAsCondition = isntCond;
      effects.push(eff);
    }
  }

  // ---- Theros Gods: "As long as your devotion to [color] is less than [N], ~ isn't a creature" ----
  // Single color: "devotion to [color] is less than [N]"
  // Dual color: "devotion to [color] and [color] is less than [N]"
  // Scryfall uses word-form numbers (five, seven, etc.)
  const WORD_TO_NUM = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  };
  const devotionRegex = /as long as your devotion to (\w+)(?:\s+and\s+(\w+))?\s+is less than (\w+)/i;
  const devotionMatch = oracle.match(devotionRegex);
  if (devotionMatch) {
    const COLOR_NAME_MAP = { white: 'W', blue: 'U', black: 'B', red: 'R', green: 'G' };
    const color1 = COLOR_NAME_MAP[devotionMatch[1].toLowerCase()] || null;
    const color2 = devotionMatch[2] ? (COLOR_NAME_MAP[devotionMatch[2].toLowerCase()] || null) : null;
    const thresholdRaw = devotionMatch[3].toLowerCase();
    const threshold = WORD_TO_NUM[thresholdRaw] !== undefined ? WORD_TO_NUM[thresholdRaw] : parseInt(thresholdRaw) || 5;
    if (color1) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.REMOVE_TYPE,
        params: {
          types: ['Creature'],
          devotionCondition: { colors: color2 ? [color1, color2] : [color1], threshold },
        },
        appliesTo: null,
        scope: 'targeted', selfTarget: true,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Not a creature unless devotion to ${devotionMatch[1]}${color2 ? ' and ' + devotionMatch[2] : ''} is ${threshold}+.`,
      });
    }
  }

  // ---- Layer 7c: P/T modification ----
  // Standard: "[filter] get +X/+Y"
  // Anchor also matches after ", and " / " and " to catch compound sentences like
  // "red creatures get +2/+0 and white creatures get +0/+2" (e.g. Agrus Kos).
  const boostRegex = /(?:^|\.|,?\s+and\s+)\s*(.+?)\s+(?:you (?:control|own)\s+)?get[s]?\s+([+-]\d+)\/([+-]\d+)/gmi;
  let boostMatch;
  while ((boostMatch = boostRegex.exec(oracle)) !== null) {
    let filterText = boostMatch[1].trim();
    // Fix: If the regex matched across sentence boundaries (filter contains "."),
    // use only the last sentence segment as the actual filter text.
    if (filterText.includes('.')) {
      const segments = filterText.split(/\.\s*/);
      filterText = segments[segments.length - 1].trim();
      if (!filterText) continue;
    }
    // Fix: Strip trailing "gains [ability] and" artifact from "[filter] gains [ability] and gets [PT]" patterns.
    // The boostRegex captures everything before "gets", so "gains trample and" bleeds into the filter.
    filterText = filterText.replace(/\s+gains?\s+[\w\s]+?\s+and\s*$/i, '').trim();
    if (!filterText) continue;
    // Multiplayer: The optional "you control" group in boostRegex strips "you control" from group 1.
    // Re-append it so buildAppliesToFromText can apply the controller filter wrapper.
    if (/\byou (?:control|own)\b/i.test(boostMatch[0]) && !/\byou (?:control|own)\b/i.test(filterText)) {
      filterText += ' you control';
    }
    // Fix 10: Skip if filterText doesn't reference permanents
    if (!filterReferencesPermanents(filterText)) continue;
    // Skip if the filter contains a quote — it matched inside a quoted ability string
    // (e.g. a saga chapter: 'II — This Saga gains "{2}, {T}: Create…" token gets +1/+1').
    if (filterText.includes('"')) continue;
    // Skip if this match falls inside a triggered-ability sentence ("Whenever/When/At...").
    // e.g. "Whenever Agrus Kos attacks, attacking red creatures get +2/+0 and attacking
    // white creatures get +0/+2" — both "get" clauses are part of the trigger, not static
    // continuous effects. The trigger's pseudo-permanent parses them correctly on activation.
    const _prevDot = oracle.lastIndexOf('.', boostMatch.index);
    const _nextDot = oracle.indexOf('.', boostMatch.index);
    const _enclosingSentence = oracle.substring(
      _prevDot < 0 ? 0 : _prevDot + 1,
      _nextDot < 0 ? oracle.length : _nextDot + 1
    ).trimStart();
    if (/^(?:when(?:ever)?|at)\b/i.test(_enclosingSentence)) continue;
    // Skip matches inside the effect portion of an activated ability ("{cost}: ...")
    if (_isInActivatedEffect(boostMatch.index)) continue;
    const boostMatchCond = _getConditionForPos(boostMatch.index);
    const boostEffCountBefore = effects.length;
    const fullSentence = oracle.substring(boostMatch.index, oracle.indexOf('.', boostMatch.index + boostMatch[0].length) + 1) || boostMatch[0];
    const { fn, desc, isSelf, isTargeted, needsTargetSelection, maxTargets: _maxTgts } = buildAppliesToFromText(filterText);
    const _buildResult = { isSpellTarget: !!needsTargetSelection, maxTargets: _maxTgts || 1 };
    const _needsTarget = isTargeted;
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);

    // Check for "for each [thing]" pattern ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ make it a CDA with auto-compute
    const forEachMatch = fullSentence.match(/for each\s+(.+?)(?:\.|$)/i);
    if (forEachMatch) {
      let countTarget = forEachMatch[1].trim().replace(/\.$/, '');
      // Parse max cap: "to a maximum of N"
      let maxCount = undefined;
      const maxMatch = countTarget.match(/,?\s*to a maximum of (\d+)/i);
      if (maxMatch) {
        maxCount = parseInt(maxMatch[1]);
        countTarget = countTarget.replace(/,?\s*to a maximum of \d+/i, '').trim();
      }
      // Fix 8: Handle "for each X and each Y" or "for each X you control and each Y in your graveyard"
      const andEachParts = countTarget.split(/\s+and\s+(?:each|every)\s+/i);
      if (andEachParts.length > 1) {
        for (const part of andEachParts) {
          const cleanPart = part.trim().replace(/\s+in your graveyard$/i, '').replace(/\s+you control$/i, '');
          const isGraveyard = part.toLowerCase().includes('graveyard');
          const _eff = {
            id: `${permanent.id}_eff_${effects.length}`,
            layer: '7c', type: EFFECT_TYPE.MODIFY_PT,
            params: {
              power: parseInt(boostMatch[2]),
              toughness: parseInt(boostMatch[3]),
              userAdjustable: isGraveyard,
              isGraveyardCount: isGraveyard,
              basePower: parseInt(boostMatch[2]),
              baseToughness: parseInt(boostMatch[3]),
              forEachDesc: cleanPart,
              maxCount,
            },
            appliesTo: (isSelf || _needsTarget) ? null : fn,
            scope: (isSelf || _needsTarget) ? 'targeted' : 'global',
            selfTarget: isSelf || false,
            affectsSelf: selfAffect,
            sourceId: permanent.id, sourceName: card.name,
            timestamp: permanent.timestamp,
            desc: `Gets ${boostMatch[2]}/${boostMatch[3]} for each ${cleanPart}. ${desc}`,
          };
          effects.push(_applyTargetInfo(_eff, _buildResult, fn));
        }
        continue;
      }
      const cleanTarget = countTarget.replace(/\s+you control$/i, '').replace(/\s+in your graveyard$/i, '');
      const isGraveyard = countTarget.toLowerCase().includes('graveyard');
      const _effFe = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7c', type: EFFECT_TYPE.MODIFY_PT,
        params: {
          power: parseInt(boostMatch[2]),
          toughness: parseInt(boostMatch[3]),
          userAdjustable: isGraveyard,
          isGraveyardCount: isGraveyard,
          basePower: parseInt(boostMatch[2]),
          baseToughness: parseInt(boostMatch[3]),
          forEachDesc: cleanTarget,
          maxCount,
        },
        appliesTo: (isSelf || _needsTarget) ? null : fn,
        scope: (isSelf || _needsTarget) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Gets ${boostMatch[2]}/${boostMatch[3]} for each ${countTarget}. ${desc}`,
      };
      effects.push(_applyTargetInfo(_effFe, _buildResult, fn));
      continue;
    }

    const _effBoost = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7c', type: EFFECT_TYPE.MODIFY_PT,
      params: { power: parseInt(boostMatch[2]), toughness: parseInt(boostMatch[3]) },
      appliesTo: (isSelf || _needsTarget) ? null : fn,
      scope: (isSelf || _needsTarget) ? 'targeted' : 'global',
      selfTarget: isSelf || false,
      affectsSelf: selfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${filterText} get ${boostMatch[2]}/${boostMatch[3]}. ${desc}`,
      _oraclePos: boostMatch.index,
    };
    effects.push(_applyTargetInfo(_effBoost, _buildResult, fn));
    // Apply "as long as" condition to newly generated effects
    if (boostMatchCond) {
      for (let ei = boostEffCountBefore; ei < effects.length; ei++) {
        effects[ei].asLongAsCondition = boostMatchCond;
      }
    }
  }

  // ---- Layer 5: "[filter] are [color]" → SET_COLOR ----
  // Handles cards like Shifting Sky: "All nonland permanents are Blue."
  const COLOR_WORD_MAP = { 'white': 'W', 'blue': 'U', 'black': 'B', 'red': 'R', 'green': 'G' };
  const colorSetRegex = /(?:^|\.)\s*(?:all\s+)?(.+?)\s+(?:you (?:control|own)\s+)?(?:are|is)\s+(white|blue|black|red|green|colorless)(?:\s|\.|\,|$)/gmi;
  let colorSetMatch;
  while ((colorSetMatch = colorSetRegex.exec(oracle)) !== null) {
    const csFilterText = colorSetMatch[1].trim();
    if (!filterReferencesPermanents(csFilterText)) continue;
    // Skip if this overlaps with "in addition to" (handled by addTypeRegex)
    const afterMatch = oracle.substring(colorSetMatch.index + colorSetMatch[0].length, colorSetMatch.index + colorSetMatch[0].length + 30);
    if (/in addition to/i.test(afterMatch)) continue;
    const csColor = colorSetMatch[2].toLowerCase();
    // Multiplayer: restore "you control" stripped by optional regex group
    let csSubjectText = csFilterText;
    if (/\byou (?:control|own)\b/i.test(colorSetMatch[0]) && !/\byou (?:control|own)\b/i.test(csSubjectText)) {
      csSubjectText += ' you control';
    }
    const { fn: csFn, desc: csDesc, isSelf: csIsSelf, isTargeted: csIsTargeted } = buildAppliesToFromText(csSubjectText);
    const csSelfAffect = detectSelfAffect(csSubjectText);
    const csColors = csColor === 'colorless' ? [] : [COLOR_WORD_MAP[csColor]];
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '5', type: EFFECT_TYPE.SET_COLOR,
      params: { colors: csColors },
      appliesTo: (csIsSelf || csIsTargeted) ? null : csFn,
      scope: (csIsSelf || csIsTargeted) ? 'targeted' : 'global',
      selfTarget: csIsSelf || false,
      affectsSelf: csSelfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${csFilterText} are ${csColor}. ${csDesc}`,
    });
  }

  // ---- Layer 7b: Set P/T ----
  // Note: "enchanted/equipped creature gets +X/+Y" is handled by boostRegex above
  // (buildAppliesToFromText returns isTargeted:true for those filter phrases).
  // The old auraBoost parser was removed to prevent double-application.
  const auraSetPT = oracleLower.match(/(?:enchanted|equipped)\s+(?:(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\s+(?:has\s+)?base\s+power\s+and\s+toughness\s+(\d+)\/(\d+)/);
  if (auraSetPT) {
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7b', type: EFFECT_TYPE.SET_PT,
      params: { power: parseInt(auraSetPT[1]), toughness: parseInt(auraSetPT[2]) },
      appliesTo: null, scope: 'targeted',
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `Enchanted creature has base P/T ${auraSetPT[1]}/${auraSetPT[2]}.`,
    });
  }

  // General "[filter] have/has base power and toughness X/Y [and are [type] [in addition to...]]" pattern
  const generalBasePTRegex = /(?:^|\.)\s*(.+?)\s+(?:you (?:control|own)\s+)?(?:have|has)\s+base\s+power\s+and\s+toughness\s+(\d+)\/(\d+)(?:\s+and\s+(?:are|is)\s+(\w+)((?:\s+in addition to\b)?))?/gmi;
  let generalBasePTMatch;
  while ((generalBasePTMatch = generalBasePTRegex.exec(oracle)) !== null) {
    const gbpFilterText = generalBasePTMatch[1].trim();
    const gbpFLower = gbpFilterText.toLowerCase();
    // Skip enchanted/equipped (handled above) and non-permanent references
    if (/enchanted|equipped/i.test(gbpFLower)) continue;
    // Skip triggered/activated ability text
    if (gbpFLower.includes('whenever ') || gbpFLower.includes('when ') || gbpFLower.length > 50) continue;
    if (!filterReferencesPermanents(gbpFilterText)) continue;
    // Skip if filterText ends with "and" or contains "are" — already handled by setTypeRegex
    if (/\band\s*$/i.test(gbpFLower)) continue;
    if (/\bare\s+\w/i.test(gbpFLower)) continue;
    // Multiplayer: restore "you control" stripped by optional regex group
    const gbpSubjectText = (/\byou (?:control|own)\b/i.test(generalBasePTMatch[0]) && !/\byou (?:control|own)\b/i.test(gbpFilterText))
      ? gbpFilterText + ' you control' : gbpFilterText;
    const gbpApplies = buildAppliesToFromText(gbpSubjectText);
    const gbpSelf = gbpApplies.isSelf ? true : detectSelfAffect(gbpFilterText);
    const gbpCond = _getConditionForPos(generalBasePTMatch.index);
    const _gbpScope = (gbpApplies.isSelf || gbpApplies.isTargeted) ? 'targeted' : 'global';
    const _gbpAppliesTo = (gbpApplies.isSelf || gbpApplies.isTargeted) ? null : gbpApplies.fn;
    const _gbpSelfTarget = gbpApplies.isSelf || false;
    const eff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7b', type: EFFECT_TYPE.SET_PT,
      params: { power: parseInt(generalBasePTMatch[2]), toughness: parseInt(generalBasePTMatch[3]) },
      appliesTo: _gbpAppliesTo, scope: _gbpScope, selfTarget: _gbpSelfTarget,
      affectsSelf: gbpSelf,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${gbpFilterText} have base P/T ${generalBasePTMatch[2]}/${generalBasePTMatch[3]}. ${gbpApplies.desc}`,
    };
    if (gbpCond) eff.asLongAsCondition = gbpCond;
    effects.push(eff);

    // Handle trailing "and are [type]" (Kudo/Graaz pattern: "have base P/T X/Y and are Bears/Juggernauts")
    if (generalBasePTMatch[4]) {
      const trailingType = generalBasePTMatch[4];
      const isAddition = !!(generalBasePTMatch[5] && generalBasePTMatch[5].trim());
      const parsed = parseBecomesType(trailingType);
      if (parsed.subtypes.length > 0 || parsed.types.length > 0) {
        const effType = isAddition ? EFFECT_TYPE.ADD_TYPE : EFFECT_TYPE.SET_TYPE;
        const typeParams = isAddition
          ? { types: parsed.types, subtypes: parsed.subtypes }
          : (parsed.subtypes.length > 0 && parsed.types.length === 0
            ? { subtypes: parsed.subtypes, replaceSubtypeCategory: 'creature', keepSupertypes: true, keepTypes: true }
            : { types: parsed.types, subtypes: parsed.subtypes, keepSupertypes: true });
        const setEff = {
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '4', type: effType,
          params: typeParams,
          appliesTo: _gbpAppliesTo, scope: _gbpScope, selfTarget: _gbpSelfTarget,
          affectsSelf: gbpSelf,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `${gbpFilterText} are ${trailingType}s${isAddition ? ' in addition to their other types' : ''}. ${gbpApplies.desc}`,
        };
        if (gbpCond) setEff.asLongAsCondition = gbpCond;
        effects.push(setEff);
      }
    }
    // Handle trailing "and lose[s] all creature types" (Curse of Conformity pattern:
    // "Nonlegendary creatures you control have base P/T 3/3 and lose all creature types.")
    // Uses SET_TYPE at layer 4 with replaceSubtypeCategory:'creature' to clear ONLY creature
    // subtypes — abilities and the Creature type itself are preserved (CR 205.3 / layer 4).
    const _gbpMatchEnd = generalBasePTMatch.index + generalBasePTMatch[0].length;
    if (/^\s*and\s+loses?\s+all\s+creature\s+types/i.test(oracle.substring(_gbpMatchEnd, _gbpMatchEnd + 50))) {
      const lctEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.SET_TYPE,
        params: { subtypes: [], replaceSubtypeCategory: 'creature', keepTypes: true, keepSupertypes: true },
        appliesTo: _gbpAppliesTo, scope: _gbpScope, selfTarget: _gbpSelfTarget,
        affectsSelf: gbpSelf,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${gbpFilterText} lose all creature types. ${gbpApplies.desc}`,
      };
      if (gbpCond) lctEff.asLongAsCondition = gbpCond;
      effects.push(lctEff);
    }
  }

  // "[filter] have base power and toughness each equal to the number of [countOf]"
  // e.g. Porcelain Gallery: "Creatures you control have base power and toughness each equal
  //   to the number of creatures you control."
  const equalToCountRegex = /(?:^|\.)\s*(.+?)\s+(?:you (?:control|own)\s+)?have\s+base\s+power\s+and\s+toughness\s+each\s+equal\s+to\s+the\s+number\s+of\s+(.+?)\s*\./gmi;
  let equalToCountMatch;
  while ((equalToCountMatch = equalToCountRegex.exec(oracle)) !== null) {
    const etcFilterRaw = equalToCountMatch[1].trim();
    if (!filterReferencesPermanents(etcFilterRaw)) continue;
    if (/^when(?:ever)?|^at\b/i.test(etcFilterRaw)) continue;
    // Re-append "you control" if the optional regex group stripped it from the subject
    const etcSubjectText = (/\byou (?:control|own)\b/i.test(equalToCountMatch[0]) && !/\byou (?:control|own)\b/i.test(etcFilterRaw))
      ? etcFilterRaw + ' you control' : etcFilterRaw;
    const etcCountOf = equalToCountMatch[2].trim();
    const etcApplies = buildAppliesToFromText(etcSubjectText);
    const _etcScope = (etcApplies.isSelf || etcApplies.isTargeted) ? 'targeted' : 'global';
    const _etcAppliesTo = (etcApplies.isSelf || etcApplies.isTargeted) ? null : etcApplies.fn;
    const _etcSelfTarget = etcApplies.isSelf || false;
    const etcCond = _getConditionForPos(equalToCountMatch.index);
    const eff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7b', type: EFFECT_TYPE.SET_PT,
      params: { useCountOf: etcCountOf },
      appliesTo: _etcAppliesTo, scope: _etcScope, selfTarget: _etcSelfTarget,
      affectsSelf: etcApplies.isSelf || false,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${etcSubjectText} have base P/T equal to count of "${etcCountOf}". ${etcApplies.desc}`,
    };
    if (etcCond) eff.asLongAsCondition = etcCond;
    effects.push(eff);
  }

  // ---- Layer 7e: P/T switch ----
  // Handles "Switch [filter]'s power and toughness" (Twisted Reflection, Inside Out, Mannichi, etc.)
  // Three syntactic forms:
  //   A. "Switch [filter]'s power and toughness [until end of turn]"
  //   B. "Switch the power and toughness of [filter] [until end of turn]"
  //   C. "[filter]'s power and toughness are switched"
  const switchPTRegex = /(?:switch(?:es)?\s+(.+?)'s\s+(?:base\s+)?(?:power\s+and\s+toughness|toughness\s+and\s+power)|switch\s+the\s+(?:base\s+)?(?:power\s+and\s+toughness|toughness\s+and\s+power)\s+of\s+(.+?)|(.+?)'s\s+(?:base\s+)?(?:power\s+and\s+toughness|toughness\s+and\s+power)\s+(?:are|is)\s+switched)(?:\s+until\s+end\s+of\s+turn)?(?:\s*\.|$)/gmi;
  let switchPTMatch;
  while ((switchPTMatch = switchPTRegex.exec(oracle)) !== null) {
    const rawFilter = (switchPTMatch[1] || switchPTMatch[2] || switchPTMatch[3] || '').trim();
    if (!rawFilter) continue;
    if (!filterReferencesPermanents(rawFilter)) continue;
    const switchCond = _getConditionForPos(switchPTMatch.index);
    const { fn: switchFn, desc: switchDesc, isSelf: switchIsSelf, isTargeted: switchIsTargeted,
            needsTargetSelection: switchNeedsTarget, maxTargets: switchMaxTgts } = buildAppliesToFromText(rawFilter);
    const switchSelfAffect = switchIsSelf ? true : detectSelfAffect(rawFilter);
    const _switchBuildResult = { isSpellTarget: !!switchNeedsTarget, maxTargets: switchMaxTgts || 1 };
    const switchEff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7e', type: EFFECT_TYPE.SWITCH_PT,
      params: {},
      appliesTo: (switchIsSelf || switchIsTargeted) ? null : switchFn,
      scope: (switchIsSelf || switchIsTargeted) ? 'targeted' : 'global',
      selfTarget: switchIsSelf || false,
      affectsSelf: switchSelfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `Switch power/toughness of ${rawFilter}. ${switchDesc}`,
      _oraclePos: switchPTMatch.index,
    };
    if (switchCond) switchEff.asLongAsCondition = switchCond;
    effects.push(_applyTargetInfo(switchEff, _switchBuildResult, switchFn));
  }

  // ---- Layer 6: Ability granting ----
  // Fix 14: CDA "power and toughness are each equal to N plus the number of [thing]"
  // Handles cards like "This creature's power and toughness are each equal to 1 plus the number of Forests you control"
  // Also handles the simpler "equal to the number of [thing]" (Tarmogoyf, Nighthowler, etc.)
  const CDA_WORD_TO_NUM = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  };
  // "equal to N plus the number of [thing]"
  const cdaPlusRegex = /(?:power and toughness|power\/toughness)\s+(?:are|is)\s+(?:each\s+)?equal\s+to\s+(\w+)\s+plus\s+(?:the\s+)?(?:number|total number|amount)\s+of\s+(.+?)(?:\.|$)/gmi;
  let cdaPlusMatch;
  while ((cdaPlusMatch = cdaPlusRegex.exec(oracle)) !== null) {
    const baseRaw = cdaPlusMatch[1].toLowerCase();
    const baseVal = CDA_WORD_TO_NUM[baseRaw] !== undefined ? CDA_WORD_TO_NUM[baseRaw] : (parseInt(baseRaw) || 0);
    let countTarget = cdaPlusMatch[2].trim().replace(/\.$/, '');
    const isGraveyard = countTarget.toLowerCase().includes('graveyard') || countTarget.toLowerCase().includes('exile');
    const cleanTarget = countTarget.replace(/\s+you control$/i, '').replace(/\s+in your graveyard$/i, '').replace(/\s+in all graveyards$/i, '');
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7a', type: EFFECT_TYPE.CDA_PT,
      params: {
        userAdjustable: isGraveyard,
        isGraveyardCount: isGraveyard,
        forEachDesc: cleanTarget,
        compute: null,
        cdaBaseValue: baseVal,
      },
      appliesTo: null,
      scope: 'targeted', selfTarget: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `P/T equal to ${baseVal} plus the number of ${countTarget}.`,
    });
  }

  // Asymmetric CDA: "power is equal to the number of X and its toughness is that number plus N"
  // Handles cards like Tarmogoyf where power and toughness use different formulas.
  const cdaAsymRegex = /(?:power)\s+(?:is|are)\s+(?:each\s+)?equal\s+to\s+(?:the\s+)?(?:number|total number|amount)\s+of\s+(.+?)\s+and\s+its\s+toughness\s+is\s+that\s+(?:number|amount)\s+plus\s+(\w+)/gmi;
  let cdaAsymMatch;
  while ((cdaAsymMatch = cdaAsymRegex.exec(oracle)) !== null) {
    let countTarget = cdaAsymMatch[1].trim().replace(/\.$/, '');
    const bonusRaw = cdaAsymMatch[2].toLowerCase();
    const bonusVal = CDA_WORD_TO_NUM[bonusRaw] !== undefined ? CDA_WORD_TO_NUM[bonusRaw] : (parseInt(bonusRaw) || 0);
    const isGraveyard = countTarget.toLowerCase().includes('graveyard') || countTarget.toLowerCase().includes('exile');
    const cleanTarget = countTarget.replace(/\s+you control$/i, '').replace(/\s+in your graveyard$/i, '').replace(/\s+in all graveyards$/i, '');
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7a', type: EFFECT_TYPE.CDA_PT,
      params: {
        userAdjustable: isGraveyard,
        isGraveyardCount: isGraveyard,
        forEachDesc: cleanTarget,
        compute: null,
        toughBonus: bonusVal,
      },
      appliesTo: null,
      scope: 'targeted', selfTarget: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `Power equal to the number of ${countTarget}. Toughness is that plus ${bonusVal}.`,
    });
  }

  // Fix 10: CDA "power and toughness are each equal to the number of [thing]" with */
  // This handles cards like Nighthowler, etc.
  // Skip if already matched by cdaPlusRegex or cdaAsymRegex above
  const cdaEqualRegex = /(?:power and toughness|power\/toughness)\s+(?:are|is)\s+(?:each\s+)?equal\s+to\s+(?:the\s+)?(?:number|total number|amount)\s+of\s+(.+?)(?:\.|$)/gmi;
  let cdaEqualMatch;
  while ((cdaEqualMatch = cdaEqualRegex.exec(oracle)) !== null) {
    // Skip if this match overlaps with a "N plus" match (already handled above)
    const beforeMatch = oracle.substring(0, cdaEqualMatch.index + cdaEqualMatch[0].indexOf('of'));
    if (/\bplus\s+(?:the\s+)?(?:number|total number|amount)\s*$/i.test(beforeMatch)) continue;
    let countTarget = cdaEqualMatch[1].trim().replace(/\.$/, '');
    const isGraveyard = countTarget.toLowerCase().includes('graveyard') || countTarget.toLowerCase().includes('exile');
    const cleanTarget = countTarget.replace(/\s+you control$/i, '').replace(/\s+in your graveyard$/i, '').replace(/\s+in all graveyards$/i, '');
    // Check if power/toughness has * (CDA indicator) - check the card itself
    const hasStar = (card.power === '*' || card.toughness === '*');
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '7a', type: EFFECT_TYPE.CDA_PT,
      params: {
        userAdjustable: isGraveyard,
        isGraveyardCount: isGraveyard,
        forEachDesc: cleanTarget,
        compute: null,
      },
      appliesTo: null,
      scope: 'targeted', selfTarget: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `P/T equal to the number of ${countTarget}.`,
    });
  }

  // Known keywords: standard + landwalk + protection variants.
  // Landwalk names follow the pattern "[land-type]walk".
  const KEYWORD_LIST = [
    'flying', 'first strike', 'double strike', 'deathtouch', 'haste',
    'hexproof', 'indestructible', 'lifelink', 'menace', 'reach',
    'trample', 'vigilance', 'flash', 'defender', 'fear', 'intimidate',
    'shroud', 'wither', 'infect', 'prowess', 'ward',
    'plainswalk', 'islandwalk', 'swampwalk', 'mountainwalk', 'forestwalk',
    'landwalk', 'shadow', 'horsemanship', 'flanking', 'phasing',
    'banding', 'rampage', 'cumulative upkeep', 'bushido', 'soulshift',
    'splice', 'offering', 'ninjutsu', 'epic', 'convoke', 'dredge',
    'affinity', 'modular', 'sunburst', 'storm', 'cascade',
    'annihilator', 'totem armor', 'undying', 'persist', 'exalted',
    'battle cry', 'living weapon', 'extort', 'unleash', 'evolve',
    'bestow', 'tribute', 'dethrone', 'outlast', 'dash', 'exploit',
    'renown', 'skulk', 'emerge', 'crew', 'fabricate',
    'partner', 'afterlife', 'riot', 'spectacle', 'escape',
    'companion', 'mutate', 'boast', 'foretell', 'ward',
    'decayed', 'disturb', 'exploit', 'daybound', 'nightbound',
    'cleave', 'training', 'compleated', 'reconfigure', 'blitz',
    'casualty', 'enlist', 'read ahead', 'ravenous', 'squad',
    'prototype', 'living metal', 'for mirrodin!', 'toxic',
    'backup', 'bargain', 'craft', 'descend', 'discover',
    'plot', 'saddle', 'offspring', 'impending',
    'myriad', 'changeling', 'convoke', 'delve',
  ];
  const kwPattern = KEYWORD_LIST.join('|');
  const kwSet = new Set(KEYWORD_LIST);

  // Keywords that take a parameter (cost, number, etc.) after them
  // e.g. "Ward {2}", "Crew 3", "Toxic 1", "Annihilator 2"
  const PARAMETERIZED_KEYWORDS = new Set([
    'ward', 'crew', 'renown', 'fabricate', 'bushido', 'soulshift',
    'annihilator', 'modular', 'dredge', 'casualty', 'toxic', 'backup',
    'ravenous', 'squad', 'afterlife', 'tribute', 'rampage', 'flanking',
    'bushido', 'sunburst', 'storm', 'cascade', 'exalted', 'battle cry',
    'exploit', 'skulk', 'enlist',
  ]);

  // Helper: given a string like "flying, vigilance, and first strike", extract all keywords
  function parseKeywordList(text) {
    const raw = text.trim().replace(/^(?:,\s*)?(?:and\s+)?/i, '');
    if (!raw) return [];
    const keywords = [];

    // First, extract quoted abilities BEFORE lowercasing (preserve original case)
    let remaining = raw;
    const quotedAbilities = [];
    remaining = remaining.replace(/"((?:[^"\\]|\\.)*)"/g, (m, inner) => {
      // Clean trailing commas/periods from quoted abilities
      quotedAbilities.push(inner.trim().replace(/[,.]$/, '').trim());
      return '\x03'; // placeholder
    });

    // Now lowercase for keyword matching
    remaining = remaining.toLowerCase();

    // Extract protection phrases before splitting (they contain "from" which isn't a keyword)
    const protRegex = /protection from [^,]+(?:\s+and from [^,]+)*/gi;
    let protMatch;
    while ((protMatch = protRegex.exec(remaining)) !== null) {
      const splitProts = _splitProtectionAbilities(protMatch[0]);
      for (const prot of splitProts) keywords.push(prot);
      remaining = remaining.replace(protMatch[0], '\x02'); // placeholder
    }
    // Split on commas and "and"
    const parts = remaining.split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(s => s && s !== '\x02' && s !== '\x03');
    for (const part of parts) {
      if (kwSet.has(part)) {
        keywords.push(part.charAt(0).toUpperCase() + part.slice(1));
      } else {
        // Try two-word keywords like "first strike", "double strike", "totem armor"
        const twoWord = part.trim();
        if (kwSet.has(twoWord)) {
          keywords.push(twoWord.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        } else {
          // Check for parameterized keyword: "ward {2}", "crew 3", "toxic 1"
          const paramMatch = part.match(/^(\w+(?:\s+\w+)?)\s+(.+)$/);
          if (paramMatch && (kwSet.has(paramMatch[1]) || PARAMETERIZED_KEYWORDS.has(paramMatch[1]))) {
            const kwBase = paramMatch[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            keywords.push(`${kwBase} ${paramMatch[2]}`);
          }
        }
      }
    }
    // Append extracted quoted abilities at the end (original case preserved)
    for (const qa of quotedAbilities) {
      keywords.push(qa);
    }
    return keywords;
  }

  // Keyword abilities: "Creatures you control have trample"
  // Also handles: "[filter] get +X/+Y and have [keyword]" by stripping the "and" prefix.
  // Fix 11: Also handles comma-separated keywords: "have flying, vigilance, and first strike"
  const haveAbilityRegex = new RegExp(
    `(?:^|\\.|;)\\s*(.+?)\\s+(?:you (?:control|own)\\s+)?(?:have|has|gain|gains)\\s+(${kwPattern})`,
    'gmi'
  );
  let haveMatch;
  const haveAbilityParsed = new Set(); // track to avoid duplicates
  while ((haveMatch = haveAbilityRegex.exec(oracle)) !== null) {
    if (_isInActivatedEffect(haveMatch.index)) continue;
    let filterText = haveMatch[1].trim();
    const firstAbility = haveMatch[2].charAt(0).toUpperCase() + haveMatch[2].slice(1);
    // Fix: If the regex matched across sentence boundaries (filter contains "."),
    // use only the last sentence segment as the actual filter text.
    // e.g. "Put a +1/+1 counter on target creature you control. It" → "It"
    if (filterText.includes('.')) {
      const segments = filterText.split(/\.\s*/);
      filterText = segments[segments.length - 1].trim();
      if (!filterText) continue;
    }
    // Skip if this match overlaps with an addType match (already handled with "and has" parsing)
    const haveStart = haveMatch.index;
    const haveEnd = haveStart + haveMatch[0].length;
    if (addTypeMatchRanges.some(r => haveStart < r.end && haveEnd > r.start)) continue;
    // Skip only singular targeted enchanted/equipped patterns (e.g., "enchanted creature"),
    // NOT plural/global ones (e.g., "Equipped creatures you control", "Enchanted creatures")
    if (/^(?:enchanted|equipped)\s+(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle)$/i.test(filterText.trim())) continue;
    // Skip compound enchantment clauses (handled by enchant transform parser Fix 17)
    if (/(?:enchanted|equipped)\s+\w+\s+has\s+base\s+power|loses\s+all/i.test(filterText)) continue;
    // Skip "It has [keyword]" continuation of enchanted/equipped sentences
    // (e.g. "Enchanted creature is a Citizen... It has defender" — handled by enchant-transform)
    if (/^it$/i.test(filterText.trim())) {
      const textBefore = oracle.substring(0, haveMatch.index);
      if (/(?:enchanted|equipped)\s+(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle)\b/i.test(textBefore)) continue;
    }
    // Strip "... and" suffix from filter (e.g. "Other Merfolk get +1/+1 and" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ "Other Merfolk")
    // Fix: Compound "A gets +X/+Y and B have/has [keyword]" — extract B as the real filter.
    // E.g. "this card gets +2/+2 and creatures" → "creatures" (Angelic Field Marshal)
    // Strip leading "Until end of turn, " duration prefix that bleeds in from compound activated-ability
    // text like "Until end of turn, this creature has base P/T 5/3, gains trample"
    filterText = filterText.replace(/^until\s+(?:end\s+of\s+turn|your\s+next\s+turn)\s*,\s*/i, '');
    // Strip trailing "has base power and toughness X/Y[,]" clause
    filterText = filterText.replace(/\s+has\s+base\s+power\s+and\s+toughness\s+\d+\/\d+\s*,?\s*$/i, '');
    // Strip trailing "gains [keyword(s)], and" remainder after the P/T clause
    filterText = filterText.replace(/\s+gains?\s+[^,]+,\s+and\s*$/i, '');
    const _ptAndFilter = filterText.match(/^.+?\s+get[s]?\s+[+-]?\d+\/[+-]?\d+\s+and\s+(.+)$/i);
    if (_ptAndFilter) {
      filterText = _ptAndFilter[1].trim();
    }
    filterText = filterText.replace(/\s+and\s*$/i, '').replace(/\s+get[s]?\s+[+-]?\d+\/[+-]?\d+.*$/i, '').trim();
    if (!filterText) continue;
    // Fix 10: Skip if filterText doesn't reference permanents
    if (!filterReferencesPermanents(filterText)) continue;
    // Multiplayer: restore "you control" stripped by optional regex group
    if (/\byou (?:control|own)\b/i.test(haveMatch[0]) && !/\byou (?:control|own)\b/i.test(filterText)) {
      filterText += ' you control';
    }
    const { fn, desc, isSelf, isTargeted, needsTargetSelection: _haveNTS, maxTargets: _haveMaxT } = buildAppliesToFromText(filterText);
    const _haveBuildResult = { isSpellTarget: !!_haveNTS, maxTargets: _haveMaxT || 1 };
    const _haveNeedsTarget = isTargeted;
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);

    // Collect ALL keywords from this sentence (including comma-separated ones)
    // Look at text after the "have/has/gain/gains" up to end of sentence
    const matchEnd = haveMatch.index + haveMatch[0].length;
    const restOfSentence = oracle.substring(matchEnd);
    // Find sentence end outside quoted strings (skip .;\ inside "..." to preserve quoted abilities)
    let sentenceEnd = -1;
    { let inQ = false;
      for (let _i = 0; _i < restOfSentence.length; _i++) {
        const ch = restOfSentence[_i];
        if (ch === '"') { inQ = !inQ; continue; }
        if (!inQ && (ch === '.' || ch === ';' || ch === '\n')) { sentenceEnd = _i; break; }
      }
    }
    const remainingText = restOfSentence.substring(0, sentenceEnd === -1 ? undefined : sentenceEnd);
    // Strip duration clauses before parsing keywords — "until end of turn" / "until your next turn"
    // would otherwise get attached to the last keyword and prevent matching.
    const remainingForKw = remainingText.replace(/\s+until\s+(?:end of turn|your next turn|the end of your next turn)$/i, '');
    
    // Check if first ability is a parameterized keyword (e.g. "ward {2}", "toxic 1")
    let firstAbilityFull = firstAbility;
    if (PARAMETERIZED_KEYWORDS.has(haveMatch[2].toLowerCase())) {
      const paramCostMatch = remainingText.match(/^\s*(\{[^}]+\}|\d+)/);
      if (paramCostMatch) {
        firstAbilityFull = `${firstAbility} ${paramCostMatch[1]}`;
      }
    }
    
    // Parse all keywords: first ability + any comma-separated ones after it
    const allKeywords = [firstAbilityFull];
    if (remainingForKw.trim()) {
      const extraKws = parseKeywordList(remainingForKw);
      for (const kw of extraKws) {
        if (!allKeywords.some(k => k.toLowerCase() === kw.toLowerCase())) {
          allKeywords.push(kw);
        }
      }
    }

    for (const ability of allKeywords) {
      // For modal spells, include the match line position in the dedup key
      // so identical modes (e.g. Cure and Cura both granting hexproof) each produce effects.
      const linePos = _isModalSpell ? `@${haveMatch.index}` : '';
      const key = `${filterText}|${ability}${linePos}`.toLowerCase();
      if (haveAbilityParsed.has(key)) continue;
      haveAbilityParsed.add(key);
      const haveCond = _getConditionForPos(haveMatch.index);
      const eff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability },
        appliesTo: (isSelf || _haveNeedsTarget) ? null : fn,
        scope: (isSelf || _haveNeedsTarget) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have ${ability}. ${desc}`,
        _oraclePos: haveMatch.index,
      };
      if (haveCond) eff.asLongAsCondition = haveCond;
      effects.push(_applyTargetInfo(eff, _haveBuildResult, fn));
    }
  }

  // "This Saga/card/enchantment gains '[quoted ability]'" — used by Urza's Saga and similar cards.
  // Chapters that grant the card itself a static activated ability generate a layer-6 ADD_ABILITY
  // effect gated by the lore counter condition for that chapter.
  const sagaGainsQuotedRegex = /\bthis\s+(?:saga|card|enchantment|permanent)\s+gains?\s+"([^"]+)"/gmi;
  let sagaGainsMatch;
  while ((sagaGainsMatch = sagaGainsQuotedRegex.exec(oracle)) !== null) {
    if (_isInActivatedEffect(sagaGainsMatch.index)) continue;
    const quotedAbility = sagaGainsMatch[1].trim();
    const sagaGainsCond = _getConditionForPos(sagaGainsMatch.index);
    const isSagaSubtype = permanent.printedSubtypes && permanent.printedSubtypes.includes('Saga');
    const sagaGainsEff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
      params: { ability: quotedAbility },
      appliesTo: null,
      scope: 'targeted',
      selfTarget: true,
      affectsSelf: true,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `This ${isSagaSubtype ? 'Saga' : 'card'} gains "${quotedAbility}".`,
    };
    if (sagaGainsCond) sagaGainsEff.asLongAsCondition = sagaGainsCond;
    effects.push(sagaGainsEff);
  }

  // Catch-all for "[X]walk" abilities not in the keyword list (handles text-changed landwalk).
  const walkAbilityRegex = /(?:^|\.|;)\s*(.+?)\s+(?:you (?:control|own)\s+)?(?:have|has|gain|gains)\s+(\w+walk)\b/gmi;
  let walkMatch;
  while ((walkMatch = walkAbilityRegex.exec(oracle)) !== null) {
    let filterText = walkMatch[1].trim();
    const ability = walkMatch[2].charAt(0).toUpperCase() + walkMatch[2].slice(1);
    // Fix: cross-sentence filter cleanup
    if (filterText.includes('.')) {
      const segments = filterText.split(/\.\s*/);
      filterText = segments[segments.length - 1].trim();
      if (!filterText) continue;
    }
    if (/^(?:enchanted|equipped)\s+(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle)$/i.test(filterText.trim())) continue;
    filterText = filterText.replace(/\s+and\s*$/i, '').replace(/\s+get[s]?\s+[+-]?\d+\/[+-]?\d+.*$/i, '').trim();
    if (!filterText) continue;
    if (effects.some(e => e.layer === '6' && e.params.ability === ability && e.sourceId === permanent.id)) continue;
    // Fix 10: Skip if filterText doesn't reference permanents
    if (!filterReferencesPermanents(filterText)) continue;
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(filterText);
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);
    const walkCond = _getConditionForPos(walkMatch.index);
    const walkEff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
      params: { ability },
      appliesTo: (isSelf || isTargeted) ? null : fn,
      scope: (isSelf || isTargeted) ? 'targeted' : 'global',
      selfTarget: isSelf || false,
      affectsSelf: selfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${filterText} have ${ability}. ${desc}`,
    };
    if (walkCond) walkEff.asLongAsCondition = walkCond;
    effects.push(walkEff);
  }

  // Full-text abilities: 'Creatures you control have "Whenever this creature..."'
  // Use a smarter regex that handles apostrophes inside quoted abilities
  // Matches opening " then content (including apostrophes/single-quotes) until closing "
  const fullTextAbilityRegex = /(?:^|[.;])\s*(.+?)\s+(?:you (?:control|own)\s+)?(?:have|has)\s+"((?:[^"\\]|\\.)*)"/gmi;

  // Protection granting: "[filter] get/gets/gain/gains/has/have protection from [X]"
  // Also handles comma phrases: "[filter] get +1/+1, have protection from [X]"
  // Splits compound protection: "protection from black and from red" -> two separate abilities
  function _splitProtectionAbilities(protText) {
    // "protection from black and from red" -> ["Protection from black", "Protection from red"]
    // "protection from red, from blue, and from green" -> 3 separate
    // "protection from all colors" -> ["Protection from all colors"] (no split)
    // "protection from each color" -> ["Protection from each color"]
    const lower = protText.toLowerCase();
    // Split on ", from " and " and from "
    const parts = lower.replace(/^protection from\s+/i, '').split(/,?\s+and\s+from\s+|,\s+from\s+/);
    if (parts.length > 1) {
      return parts.map(p => 'Protection from ' + p.trim());
    }
    // Also handle "protection from black, blue, and red" (comma-separated colors)
    const colorNames = ['white', 'blue', 'black', 'red', 'green'];
    const colorList = lower.replace(/^protection from\s+/i, '');
    const colorParts = colorList.split(/,\s*(?:and\s+)?|\s+and\s+/).map(s => s.trim()).filter(Boolean);
    if (colorParts.length > 1 && colorParts.every(p => colorNames.includes(p))) {
      return colorParts.map(c => 'Protection from ' + c);
    }
    return [protText.charAt(0).toUpperCase() + protText.slice(1)];
  }

  const protectionRegex = /(?:^|[.;,])\s*(.+?)\s+(?:you (?:control|own)\s+)?(?:get[s]?|gain[s]?|ha(?:s|ve))\s+(protection from [^.,;]+(?:\s+and from [^.,;]+)*)/gmi;
  let protMatch;
  const protParsed = new Set();
  while ((protMatch = protectionRegex.exec(oracle)) !== null) {
    let filterText = protMatch[1].trim();
    const rawAbility = protMatch[2].trim();
    if (filterText.toLowerCase().includes('enchanted')) continue;
    // Fix: Compound "A gets +X/+Y and B have/has protection" — extract B as the real filter.
    const _protPtAndFilter = filterText.match(/^.+?\s+get[s]?\s+[+-]?\d+\/[+-]?\d+\s+and\s+(.+)$/i);
    if (_protPtAndFilter) {
      filterText = _protPtAndFilter[1].trim();
    }
    // Clean filter of preceding clauses
    filterText = filterText.replace(/\s+and\s*$/i, '').replace(/\s+get[s]?\s+[+-]?\d+\/[+-]?\d+.*$/i, '').trim();
    if (!filterText) continue;
    if (!filterReferencesPermanents(filterText)) continue;
    const splitAbilities = _splitProtectionAbilities(rawAbility);
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(filterText);
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);
    const protCond = _getConditionForPos(protMatch.index);
    for (const abilityCapitalized of splitAbilities) {
      const key = `${filterText}|${abilityCapitalized}`.toLowerCase();
      if (protParsed.has(key)) continue;
      protParsed.add(key);
      const protEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability: abilityCapitalized },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have ${abilityCapitalized}. ${desc}`,
      };
      // For "target X" wording, attach a target restriction so the UI picker filters
      // by type and so _pinAbilityEffectsToSource doesn't silently auto-target the source.
      if (isTargeted && !isSelf) protEff.targetRestriction = fn;
      // "you control" → restrict picker to permanents controlled by the source's controller.
      if (isTargeted && /\byou\s+control\b/i.test(filterText)) protEff.youControlRequired = true;
      if (protCond) protEff.asLongAsCondition = protCond;
      effects.push(protEff);
    }
  }

  // Enchanted/equipped creature protection: "enchanted creature has/gains protection from [X]"
  const enchantProtRegex = /(?:enchanted|equipped)\s+(?:(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\s+(?:has|gains?)\s+(protection from [^.,;]+(?:\s+and from [^.,;]+)*)/gmi;
  let enchantProtMatch;
  while ((enchantProtMatch = enchantProtRegex.exec(oracle)) !== null) {
    const rawAbility = enchantProtMatch[1].trim();
    const splitAbilities = _splitProtectionAbilities(rawAbility);
    const enchantProtCond = _getConditionForPos(enchantProtMatch.index);
    for (const abilityCapitalized of splitAbilities) {
      if (effects.some(e => e.layer === '6' && e.params.ability === abilityCapitalized && e.sourceId === permanent.id)) continue;
      const epEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability: abilityCapitalized },
        appliesTo: null, scope: 'targeted',
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Enchanted/equipped creature has ${abilityCapitalized}.`,
      };
      if (enchantProtCond) epEff.asLongAsCondition = enchantProtCond;
      effects.push(epEff);
    }
  }
  let ftMatch;
  while ((ftMatch = fullTextAbilityRegex.exec(oracle)) !== null) {
    let filterText = ftMatch[1].trim();
    const abilityText = ftMatch[2].trim();
    if (filterText.toLowerCase().includes('enchanted')) continue;
    // Skip triggered/activated ability text that matched the regex
    const _ftFLower = filterText.toLowerCase();
    if (_ftFLower.includes('whenever ') || _ftFLower.includes('when ') ||
        _ftFLower.length > 80) continue;
    // Fix: Compound "A gets +X/+Y and B has '[ability]'" — extract B as the real filter.
    // E.g. "this card gets +2/+2 and" → "this card" (Demon of Wailing Agonies)
    const _ftPtAndFilter = filterText.match(/^.+?\s+get[s]?\s+[+-]?\d+\/[+-]?\d+\s+and\s+(.+)$/i);
    if (_ftPtAndFilter) {
      filterText = _ftPtAndFilter[1].trim();
    }
    filterText = filterText.replace(/\s+and\s*$/i, '').replace(/\s+get[s]?\s+[+-]?\d+\/[+-]?\d+.*$/i, '').trim();
    if (!filterText) continue;
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(filterText);
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);
    const ftMatchCond = _getConditionForPos(ftMatch.index);
    const ftMatchEffectStart = effects.length; // track effects added in this match
    const ftEff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
      params: { ability: abilityText },
      appliesTo: (isSelf || isTargeted) ? null : fn,
      scope: (isSelf || isTargeted) ? 'targeted' : 'global',
      selfTarget: isSelf || false,
      affectsSelf: selfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${filterText} have "${abilityText}". ${desc}`,
    };
    if (ftMatchCond) ftEff.asLongAsCondition = ftMatchCond;
    effects.push(ftEff);
    // Fix #7: Check for "and" continuation quoted abilities after this match
    // Pattern: ... has "ability1" and "ability2" and "ability3" ...
    let restOfText = oracle.substring(ftMatch.index + ftMatch[0].length);
    const andQuoteRegex = /^\s+and\s+"((?:[^"\\]|\\.)*)"/gi;
    let andMatch;
    while ((andMatch = andQuoteRegex.exec(restOfText)) !== null) {
      const contAbility = andMatch[1].trim();
      const andEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability: contAbility },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} have "${contAbility}". ${desc}`,
      };
      if (ftMatchCond) andEff.asLongAsCondition = ftMatchCond;
      effects.push(andEff);
      // Advance the main regex past this and-continuation
      fullTextAbilityRegex.lastIndex = ftMatch.index + ftMatch[0].length + andMatch.index + andMatch[0].length;
      restOfText = restOfText.substring(andMatch.index + andMatch[0].length);
    }
    // Check for "and lose all other abilities" / "and lose all abilities" continuation
    const andLoseMatch = restOfText.match(/^\s+and\s+loses?\s+all(?:\s+other)?\s+abilities/i);
    if (andLoseMatch) {
      // Collect all quoted abilities added by this match (from ftMatchEffectStart onward)
      // and convert from ADD_ABILITY to REMOVE_ABILITIES with replaceWith
      const abilitiesToKeep = [];
      // Remove only effects added in this fullTextAbility match iteration
      for (let ei = effects.length - 1; ei >= ftMatchEffectStart; ei--) {
        const e = effects[ei];
        if (e.layer === '6' && e.type === EFFECT_TYPE.ADD_ABILITY) {
          abilitiesToKeep.unshift(e.params.ability);
          effects.splice(ei, 1);
        }
      }
      const laEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
        params: { replaceWith: abilitiesToKeep.length > 0 ? abilitiesToKeep : undefined },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} lose all abilities${abilitiesToKeep.length ? ' and gain: ' + abilitiesToKeep.join(', ') : ''}. ${desc}`,
      };
      if (ftMatchCond) laEff.asLongAsCondition = ftMatchCond;
      effects.push(laEff);
      // restOfText starts at: ftMatch.index + ftMatch[0].length (plus any and-quoted offsets)
      // andLoseMatch[0].length is the length consumed from restOfText
      fullTextAbilityRegex.lastIndex = oracle.length - restOfText.length + andLoseMatch[0].length;
    }
  }

  // Enchanted creature keyword abilities (includes landwalk + catch-all walk)
  // Fix 11: Handle comma-separated keywords: "enchanted creature has flying, vigilance, first strike"
  // Also handles parameterized keywords: "enchanted creature has ward {2}"
  const enchantAbilityRegex = new RegExp(
    `(?:enchanted|equipped)\\s+(?:(?:non\\w+\\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\\s+(?:has|gains?)\\s+((?:${kwPattern}|\\w+walk)(?:\\s+(?:\\{[^}]+\\}|\\d+))?(?:\\s*,\\s*(?:and\\s+)?(?:${kwPattern}|\\w+walk)(?:\\s+(?:\\{[^}]+\\}|\\d+))?)*)(?:\\s*,?\\s*and\\s+(?:${kwPattern}|\\w+walk)(?:\\s+(?:\\{[^}]+\\}|\\d+))?)?`,
    'gmi'
  );
  let enchantAbMatch;
  while ((enchantAbMatch = enchantAbilityRegex.exec(oracleLower)) !== null) {
    if (_isInActivatedEffect(enchantAbMatch.index)) continue;
    const matchCond = _getConditionForPos(enchantAbMatch.index);
    const fullAbilityText = enchantAbMatch[0].replace(/^(?:enchanted|equipped)\s+(?:(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\s+(?:has|gains?)\s+/i, '');
    const allKws = parseKeywordList(fullAbilityText);
    // Fallback: if parseKeywordList didn't find anything, try the original single match
    if (allKws.length === 0) {
      const singleKw = enchantAbMatch[1].trim();
      if (singleKw) allKws.push(singleKw.charAt(0).toUpperCase() + singleKw.slice(1));
    }
    for (const ability of allKws) {
      if (effects.some(e => e.layer === '6' && e.params.ability === ability && e.sourceId === permanent.id && e.scope === 'targeted')) continue;
      const eff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
        params: { ability },
        appliesTo: null, scope: 'targeted',
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Enchanted creature gains ${ability}.`,
      };
      if (matchCond) eff.asLongAsCondition = matchCond;
      effects.push(eff);
    }
  }

  // ---- "loses the type [X]" / "loses the subtype [Y]" patterns ----
  // E.g. Kaito: "this card loses the type planeswalker and the subtype Kaito"
  const losesTypeRegex = /(?:^|[.;])\s*(.+?)\s+loses?\s+(the\s+(?:type|subtype)\s+.+?)(?:\.|$)/gmi;
  let losesTypeMatch;
  while ((losesTypeMatch = losesTypeRegex.exec(oracle)) !== null) {
    const filterText = losesTypeMatch[1].trim();
    const lostDesc = losesTypeMatch[2].trim();
    if (!filterReferencesPermanents(filterText)) continue;
    const { fn, desc, isSelf, isTargeted } = buildAppliesToFromText(filterText);
    const selfAffect = isSelf ? true : detectSelfAffect(filterText);
    const ltCond = _getConditionForPos(losesTypeMatch.index);
    // Parse "the type X and the subtype Y" / "the type X" / "the subtype Y"
    const typeMatches = lostDesc.match(/the\s+type\s+(\w+)/gi);
    const subtypeMatches = lostDesc.match(/the\s+subtype\s+(\w+)/gi);
    const lostTypes = (typeMatches || []).map(m => {
      const w = m.replace(/^the\s+type\s+/i, '').trim();
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    const lostSubtypes = (subtypeMatches || []).map(m => {
      const w = m.replace(/^the\s+subtype\s+/i, '').trim();
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    if (lostTypes.length > 0 || lostSubtypes.length > 0) {
      const eff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.REMOVE_TYPE,
        params: { types: lostTypes, subtypes: lostSubtypes },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} loses ${lostDesc}. ${desc}`,
      };
      if (ltCond) eff.asLongAsCondition = ltCond;
      effects.push(eff);
    }
  }

  // ---- Fix: Specific ability removal: "loses flying", "loses deathtouch, vigilance, and first strike" ----
  // Also handles: "[filter] lose/loses [abilities]" and "enchanted creature loses [abilities]"
  const losesSpecificRegex = /(?:^|[.;])\s*(.+?)\s+(?:you (?:control|own)\s+)?(?:loses?)\s+(?!all\b)(.+?)(?:\.|$)/gmi;
  let losesSpecificMatch;
  while ((losesSpecificMatch = losesSpecificRegex.exec(oracle)) !== null) {
    const filterText = losesSpecificMatch[1].trim();
    const lostText = losesSpecificMatch[2].trim().toLowerCase()
      .replace(/\s+(?:until end of turn|until your next turn|for as long as[^.]*)\s*$/, '');
    // Skip if this looks like "loses all abilities" or "loses all creature types"
    if (lostText.includes('all ')) continue;
    // Skip "loses the type [X]" / "loses the subtype [X]" — handled by losesTypeRegex above
    if (/^the\s+(?:type|subtype)\b/.test(lostText)) continue;
    // Skip non-permanent filters
    if (!filterReferencesPermanents(filterText)) continue;
    // Parse the abilities list: "flying, deathtouch, and vigilance" -> ["Flying", "Deathtouch", "Vigilance"]
    const parts = lostText.split(/\s*,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
    const abilities = [];
    for (const part of parts) {
      if (kwSet.has(part) || KEYWORD_LIST.some(k => part === k)) {
        abilities.push(part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      } else if (part.length > 1) {
        abilities.push(part.charAt(0).toUpperCase() + part.slice(1));
      }
    }
    if (abilities.length > 0) {
      const _lsBResult = buildAppliesToFromText(filterText);
      const { fn, desc, isSelf, isTargeted } = _lsBResult;
      const selfAffect = isSelf ? true : detectSelfAffect(filterText);
      const matchCond = _getConditionForPos(losesSpecificMatch.index);
      const eff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
        params: { specificAbilities: abilities },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterText} loses ${abilities.join(', ')}. ${desc}`,
      };
      if (matchCond) eff.asLongAsCondition = matchCond;
      _applyTargetInfo(eff, _lsBResult, fn);
      effects.push(eff);
    }
  }

  // ---- General "lose all abilities" / "lose all other abilities" parser ----
  // Handles: "[filter] lose all abilities", "[filter] lose all other abilities",
  //          "[filter] lose all abilities except mana abilities"
  // Does NOT handle enchanted/equipped (those are handled by the enchant transform parser below).
  // Does NOT handle "have [ability] and lose all" (handled by fullTextAbilityRegex continuation above).
  const loseAllAbilitiesRegex = /(?:^|[.;])\s*(.+?)\s+(?:you (?:control|own)\s+)?loses?\s+all(?:\s+other)?\s+abilities(?:\s+except\s+mana\s+abilities)?/gmi;
  let loseAllMatch;
  while ((loseAllMatch = loseAllAbilitiesRegex.exec(oracle)) !== null) {
    const filterSubject = loseAllMatch[1].trim();
    // Skip enchanted/equipped — handled below
    if (/enchanted|equipped/i.test(filterSubject)) continue;
    if (!filterReferencesPermanents(filterSubject)) continue;
    // Skip if this match falls inside a triggered-ability sentence
    // ("When/Whenever/At ..."). Those effects apply only when the trigger
    // resolves (via the pseudo-permanent created by fireTriggeredAbility),
    // not as static continuous effects on the source permanent.
    {
      const _prevDot = oracle.lastIndexOf('.', loseAllMatch.index);
      const _nextDot = oracle.indexOf('.', loseAllMatch.index);
      const _enclosing = oracle.substring(
        _prevDot < 0 ? 0 : _prevDot + 1,
        _nextDot < 0 ? oracle.length : _nextDot + 1
      ).trimStart();
      if (/^(?:when(?:ever)?|at)\b/i.test(_enclosing)) continue;
    }
    // Skip if filterSubject contains a quoted ability (continuation case handled by fullTextAbilityRegex)
    if (/[""\u201c\u201d]/.test(filterSubject)) continue;
    // Skip if a REMOVE_ABILITIES effect for the same scope already exists from the fullTextAbility continuation
    const exceptMana = /except\s+mana\s+abilities/i.test(loseAllMatch[0]);
    const _laBResult = buildAppliesToFromText(filterSubject);
    const { fn, desc, isSelf, isTargeted } = _laBResult;
    const selfAffect = isSelf ? true : detectSelfAffect(filterSubject);
    // Check for duplicate (skip for modal spells — each mode is independent)
    if (!_isModalSpell) {
      const dupCheck = effects.some(e => e.type === EFFECT_TYPE.REMOVE_ABILITIES && e.sourceId === permanent.id
        && e.layer === '6' && !e.params.specificAbilities);
      if (dupCheck) continue;
    }
    const laCond = _getConditionForPos(loseAllMatch.index);
    const laParams = exceptMana ? { exceptManaAbilities: true } : {};
    const laEff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
      params: laParams,
      appliesTo: (isSelf || isTargeted) ? null : fn,
      scope: (isSelf || isTargeted) ? 'targeted' : 'global',
      selfTarget: isSelf || false,
      affectsSelf: selfAffect,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${filterSubject} lose all${exceptMana ? ' non-mana' : ''} abilities. ${desc}`,
      _oraclePos: loseAllMatch.index,
    };
    if (laCond) laEff.asLongAsCondition = laCond;
    // Apply target restriction so _pinAbilityEffectsToSource doesn't auto-pin
    // "target creature loses all abilities" effects to the source permanent.
    _applyTargetInfo(laEff, _laBResult, fn);
    effects.push(laEff);

    // Compound continuation: "lose all abilities and have base power and toughness X/Y"
    // (e.g. Humility: "Creatures lose all abilities and have base power and toughness 1/1.")
    const restAfterLose = oracle.substring(loseAllMatch.index + loseAllMatch[0].length);
    const compoundBasePT = restAfterLose.match(/^\s+and\s+(?:have|has)\s+base\s+power\s+and\s+toughness\s+(\d+)\/(\d+)/i);
    if (compoundBasePT) {
      const ptEff = {
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { power: parseInt(compoundBasePT[1]), toughness: parseInt(compoundBasePT[2]) },
        appliesTo: (isSelf || isTargeted) ? null : fn,
        scope: (isSelf || isTargeted) ? 'targeted' : 'global',
        selfTarget: isSelf || false,
        affectsSelf: selfAffect,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `${filterSubject} have base P/T ${compoundBasePT[1]}/${compoundBasePT[2]}. ${desc}`,
      };
      if (laCond) ptEff.asLongAsCondition = laCond;
      effects.push(ptEff);
      // Advance regex past the compound clause
      loseAllAbilitiesRegex.lastIndex = loseAllMatch.index + loseAllMatch[0].length + compoundBasePT[0].length;
    }
  }

  // ---- Fix 17: Unified enchantment transformation parser ----
  // Handles "Enchanted [permanent type] is a [color] [subtype] [type] with [P/T]" framework.
  // Uses "is" = REPLACE characteristics. "in addition to" = ADD characteristics.
  // Missing brackets (no color, no P/T, etc.) = no change in those areas.
  // Also handles compound clauses: loses all abilities, has [keyword], etc.
  const enchantTransformRegex = /(?:enchanted|equipped)\s+(?:(?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))\s+(.+)/gi;
  let enchantTransformMatch;
  while ((enchantTransformMatch = enchantTransformRegex.exec(oracle)) !== null) {
    // Extract the enchant target type (creature, permanent, land, etc.)
    // Used to determine whether the effect scopes to creature-only characteristics.
    const _enchantTargetTypeMatch = enchantTransformMatch[0].match(/(?:enchanted|equipped)\s+((?:non\w+\s+)?(?:creature|permanent|land|artifact|enchantment|planeswalker|battle|vehicle))/i);
    const enchantTargetIsCreatureOnly = _enchantTargetTypeMatch && _enchantTargetTypeMatch[1].toLowerCase().trim() === 'creature';

    // Determine if this match's line has an "as long as" condition
    const matchPos = enchantTransformMatch.index;
    const textBefore = oracle.substring(0, matchPos);
    const lineNum = textBefore.split('\n').length - 1;
    const _matchConditionIdx = _lineConditionMap.has(lineNum) ? _lineConditionMap.get(lineNum) : -1;
    const _matchCondition = _matchConditionIdx >= 0 ? _asLongAsConditions[_matchConditionIdx] : null;
    const effectCountBefore = effects.length; // track to apply condition to new effects

    // Merge multi-sentence continuations: "is a Citizen. It has defender and ..."
    // Sentences starting with "It " that continue the enchant effect are merged.
    let fullClauseText = enchantTransformMatch[1].replace(/\.\s*$/, '').trim();
    // Merge "It has/loses/is/gains" continuation sentences
    // Also handles ." It (quote then period before It)
    fullClauseText = fullClauseText.replace(/[.""\u201d]*\.\s+It\s+(has|loses|is|gains|gets|doesn't|can't|has\s+base)/gi,
      (m, verb) => ', ' + verb);
    // Also handle: '." It loses' where the period is inside or right after a quote
    fullClauseText = fullClauseText.replace(/[""\u201d]\s+It\s+(has|loses|is|gains|gets|doesn't|can't|has\s+base)/gi,
      (m, verb) => '", ' + verb);

    // Split into clauses on commas and "and" (but preserve compound phrases)
    // First, extract and protect quoted abilities from splitting
    const _quotedPlaceholders = [];
    let _fullClauseForSplit = fullClauseText.replace(/[""\u201c]([^""\u201d]*(?:'[^""\u201d]*)*)[""\u201d]/g, (m, inner) => {
      const idx = _quotedPlaceholders.length;
      _quotedPlaceholders.push(inner.trim());
      return `\x03QUOTE${idx}\x03`;
    });
    // Protect compound phrases from splitting
    let protectedText = _fullClauseForSplit
      .replace(/power and toughness/gi, 'power\x00and\x00toughness')
      .replace(/in addition to/gi, 'in\x00addition\x00to')
      .replace(/card types/gi, 'card\x00types')
      .replace(/creature types/gi, 'creature\x00types')
      .replace(/colors and types/gi, 'colors\x00and\x00types')
      .replace(/protection from/gi, 'protection\x00from')
      // Protect "and from" in compound protection: "protection from black and from red"
      .replace(/\band\s+from\b/gi, '\x00and\x00from')
      // Protect color pairs: "green and white", "red and black", etc.
      .replace(/\b(white|blue|black|red|green)\s+and\s+(white|blue|black|red|green)\b/gi,
        (m, a, b) => `${a}\x00and\x00${b}`);
    // Fix 19: Protect "with [abilities]" inside "is" clauses from being split.
    // "is a 1/1 Bird with flying, haste, and vigilance" must keep the "with" part intact.
    // Use \x01 as sentinel for commas within "with" clause (restored to comma after split).
    protectedText = protectedText.replace(
      /(\bwith\s+)((?:(?!\band\s+(?:it\s+)?(?:loses|is\b|has\b|gains?\b)).)*)/gi,
      (m, withWord, rest) => withWord + rest.replace(/,/g, '\x01').replace(/\band\b/gi, '\x00and\x00')
    );
    const rawClauses = protectedText.split(/,\s+(?:and\s+)?|,\s+|\s+and\s+/)
      .map(c => {
        let restored = c.replace(/\x00/g, ' ').replace(/\x01/g, ',').trim();
        // Restore quoted placeholders
        restored = restored.replace(/\x03QUOTE(\d+)\x03/g, (m, idx) => '"' + _quotedPlaceholders[parseInt(idx)] + '"');
        return restored;
      }).filter(Boolean);

    // Parsed components
    const COLOR_NAMES = { 'white': 'W', 'blue': 'U', 'black': 'B', 'red': 'R', 'green': 'G' };
    let extractedColors = [];
    let extractedTypes = [];
    let extractedSubtypes = [];
    let extractedPT = null;
    let hasLoseAbilities = false;
    let hasLoseAllCreatureTypes = false;
    let hasLoseCardTypes = false;
    let hasLoseSubtypes = false;
    let abilitiesToGrant = [];
    let quotedAbilities = [];
    let isTypeAddition = false;  // "in addition to ... types" = ADD types
    let isColorAddition = false; // "in addition to ... colors" = ADD colors
    let isColorless = false;
    let hasIsClause = false; // whether an "is a..." clause was found
    let isLandSubtype = false;
    let typeWasExplicit = false; // true if a permanent type word (Creature, Artifact, etc.) was explicitly stated
    let subtypeOnlyReplace = false; // true when "is a [subtype]" with no explicit type word
    let extractedUseMV = false; // true when "power and toughness each equal to its mana value"
    let extractedName = null; // "named X" from "is a [type] named X"
    let specificAbilityRemovals = []; // keywords removed by "loses [specific ability]" clauses

    for (const clause of rawClauses) {
      const cl = clause.toLowerCase();

      // Skip clauses already handled by earlier parsers
      if (cl.match(/^gets?\s+[+-]\d+\/[+-]\d+/)) continue; // auraBoost

      // "loses all creature types"
      if (cl.includes('loses all') && cl.includes('creature types')) {
        hasLoseAllCreatureTypes = true; continue;
      }
      // "loses all other abilities" / "loses all abilities"
      if (cl.includes('loses all') && (cl.includes('abilities') || cl.includes('ability'))) {
        hasLoseAbilities = true; continue;
      }
      // Standalone "all abilities" / "all creature types" from clause splitting on "and"
      // (e.g. "loses all other card types and all abilities" splits into "loses all other card types" + "all abilities")
      if (/^all\s+(?:other\s+)?(?:abilities|ability)[.\s]*$/.test(cl)) {
        hasLoseAbilities = true; continue;
      }
      if (/^all\s+(?:other\s+)?creature\s+types[.\s]*$/.test(cl)) {
        hasLoseAllCreatureTypes = true; continue;
      }
      // Bare "abilities" from splitting "loses all other card types and abilities"
      // The "loses all other" context is already captured by hasLoseCardTypes
      if (/^(?:other\s+)?(?:abilities|ability)[.\s]*$/.test(cl)) {
        hasLoseAbilities = true; continue;
      }
      // "loses ... card types, and subtypes" (Imprisoned in the Moon)
      if (cl.includes('card types')) { hasLoseCardTypes = true; continue; }
      if (cl === 'subtypes') { hasLoseSubtypes = true; continue; }

      // "loses [specific ability/abilities]" e.g. "loses flying", "loses flying and reach"
      const losesSpecificClause = cl.match(/^loses\s+(?!all\b)(.+?)(?:\s+until\s+\w.*)?$/);
      if (losesSpecificClause) {
        const lostAbilText = losesSpecificClause[1].trim();
        const parts = lostAbilText.split(/\s*,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
        for (const part of parts) {
          if (kwSet.has(part.toLowerCase()) || KEYWORD_LIST.some(k => part.toLowerCase() === k)) {
            const cap = part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            if (!specificAbilityRemovals.includes(cap)) specificAbilityRemovals.push(cap);
          }
        }
        continue;
      }

      // "has base power and toughness X/Y" (standalone only; skip if inside an "is" clause)
      const basePTMatch = !cl.startsWith('is ') && cl.match(/(?:has\s+)?base\s+power\s+and\s+toughness\s+(\d+)\/(\d+)/);
      if (basePTMatch) {
        extractedPT = { power: parseInt(basePTMatch[1]), toughness: parseInt(basePTMatch[2]) };
        continue;
      }
      // "has power and toughness each equal to its mana value" (standalone clause)
      if (!cl.startsWith('is ') && /(?:has\s+)?(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/.test(cl)) {
        extractedUseMV = true;
        continue;
      }

      // "is a [color] [subtype] [type] [with P/T]" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â the main "is" clause
      // "becomes" is semantically equivalent to "is" for continuous type-setting effects (Layer 4)
      const isMatch = cl.match(/^(?:is|becomes?)\s+(?:a\s+|an\s+)?(.+)/);
      if (isMatch) {
        hasIsClause = true;
        // Use original-case clause for text extraction (preserves {T}, {C} etc. in quoted abilities)
        const isMatchOriginal = clause.match(/^is\s+(?:a\s+|an\s+)?(.+)/i);
        let isText = isMatchOriginal ? isMatchOriginal[1] : isMatch[1];

        // Check "in addition to" — determine whether it covers colors, types, or both
        const addMatch = isText.match(/^(.+?)\s+in addition to\s+(?:its|their)\s+other\s+(.*)/i);
        if (addMatch) {
          const additionScope = (addMatch[2] || '').toLowerCase();
          isTypeAddition = /types?\b/.test(additionScope);
          isColorAddition = /colors?\b/.test(additionScope);
          // If neither matched (fallback), treat both as addition
          if (!isTypeAddition && !isColorAddition) {
            isTypeAddition = true;
            isColorAddition = true;
          }
          isText = addMatch[1];
        }

        // Check "that's still a [type]" — "still" means preserve existing types/subtypes,
        // functionally equivalent to "in addition to its other types".
        // E.g. Living Terrain: "is a 5/6 green Treefolk creature that's still a land."
        // Don't strip the "still" type — the word parser will pick it up as a type to add.
        // "still" itself is already in the exclusion list (skipped as a subtype).
        if (/\bstill\s+(?:a\s+|an\s+)?(?:creature|land|artifact|enchantment|planeswalker)\b/i.test(isText)) {
          isTypeAddition = true;
          isColorAddition = true;
        }

        // Extract inline P/T: "X/Y [subtype] [type]" or "[subtype] [type] with base power and toughness X/Y"
        // IMPORTANT: Check "with base power and toughness X/Y" FIRST so the greedy
        // inline P/T regex doesn't strip the digits and leave "with base power and toughness" mangled.
        const withPT = isText.match(/with\s+(?:base\s+)?power\s+and\s+toughness\s+(\d+)\/(\d+)/i);
        if (withPT) {
          extractedPT = { power: parseInt(withPT[1]), toughness: parseInt(withPT[2]) };
          isText = isText.replace(/with\s+(?:base\s+)?power\s+and\s+toughness\s+\d+\/\d+/i, '').trim();
        }
        if (!extractedPT) {
          const inlinePT = isText.match(/(\d+)\/(\d+)/);
          if (inlinePT) {
            extractedPT = { power: parseInt(inlinePT[1]), toughness: parseInt(inlinePT[2]) };
            isText = isText.replace(/\d+\/\d+/, '').trim();
          }
        }
        // "with power and toughness each equal to its mana value" (Animate Artifact, etc.)
        const withMVPT = isText.match(/with\s+(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/i);
        if (withMVPT) {
          extractedUseMV = true;
          isText = isText.replace(/\s*with\s+(?:base\s+)?power\s+and\s+(?:base\s+)?toughness\s+(?:each\s+)?equal\s+to\s+(?:its|their)\s+(?:mana\s+value|converted\s+mana\s+cost)/i, '').trim();
        }

        // Extract "with [abilities]" ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â quoted or keyword
        const withAbMatch = isText.match(/with\s+(.+)/i);
        if (withAbMatch) {
          const withText = withAbMatch[1];
          // "with no abilities" = remove abilities
          if (/^no\s+abilit/i.test(withText)) {
            hasLoseAbilities = true;
          } else {
            // Quoted abilities: "with '{T}: Add {C}'" or "with "{T}, Sacrifice a creature: You gain life equal to the sacrificed creature's toughness.""
            // Use double-quote matching that allows apostrophes inside
            const quotedMatch = withText.match(/[""\u201c]((?:[^""\u201d]|'(?!(?:\s|$|,)))*)[""\u201d]/g);
            if (quotedMatch) {
              for (const q of quotedMatch) {
                quotedAbilities.push(q.replace(/^[""\u201c]|[""\u201d]$/g, '').trim().replace(/\.$/, ''));
              }
            }
            // Keyword abilities: "with indestructible"
            const kwText = withText.replace(/[""\u201c](?:[^""\u201d]|'(?!(?:\s|$|,)))*[""\u201d]/g, '').trim();
            if (kwText) {
              const kws = parseKeywordList(kwText);
              for (const kw of kws) abilitiesToGrant.push(kw);
            }
          }
          isText = isText.replace(/\s+with\s+.*/i, '').trim();
        }

        // Now parse remaining isText for colors, types, subtypes
        // First, extract "named [Name]" — everything after "named" is the new name
        const namedMatch = isText.match(/\bnamed\s+(.+)/i);
        if (namedMatch) {
          extractedName = namedMatch[1].replace(/[.,;]+$/, '').trim();
          isText = isText.replace(/\s+named\s+.*/i, '').trim();
        }
        const words = isText.split(/\s+/);
        for (const word of words) {
          const wl = word.toLowerCase().replace(/[.,;]/g, '');
          if (['a', 'an', 'the', 'that', 'are', 'is', 'it', 'they', 'and', 'or', 'named'].includes(wl)) continue;
          if (/^\d+$/.test(wl)) continue;
          // "colorless" = set empty colors
          if (wl === 'colorless') { isColorless = true; continue; }
          // Color
          if (COLOR_NAMES[wl]) { extractedColors.push(COLOR_NAMES[wl]); continue; }
          // Card type
          const ct = CARD_TYPE_WORDS[wl];
          if (ct && ct.check === 'type') { extractedTypes.push(ct.value); typeWasExplicit = true; continue; }
          // Land subtype
          const ls = LAND_SUBTYPE_WORDS[wl];
          if (ls) { extractedSubtypes.push(ls); isLandSubtype = true; continue; }
          // Keyword that appeared before "with" (like "Indestructible 0/1")
          if (KEYWORD_LIST.some(k => wl === k)) {
            abilitiesToGrant.push(wl.charAt(0).toUpperCase() + wl.slice(1));
            continue;
          }
          // Subtype (capitalized word not in skip list)
          const cap = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[.,;]/g, '');
          if (cap.length > 1 && !['In', 'To', 'Of', 'Their', 'Its', 'Other', 'Still', 'Also',
              'Addition', 'Types', 'Type', 'All', 'Each', 'Every', 'Basic', 'Nonbasic',
              'Non', 'Control', 'You', 'Your', 'Colors', 'Color', 'Mana', 'Any',
              'Has', 'Have', 'Gains', 'Gain', 'Gets', 'Get', 'Loses', 'Lose',
              'Abilities', 'Ability', 'Plus', 'Except', 'But', 'Not', 'No',
              'They', 'Them', 'These', 'Those', 'This', 'That', 'Same',
              'Named', 'Called', 'Chosen', 'Target', 'Base', 'Power', 'Toughness'].includes(cap)) {
            const singular = singularizeCreatureType(cap);
            if (!extractedSubtypes.includes(singular)) extractedSubtypes.push(singular);
          }
        }
        continue;
      }

      // "has [keyword]" / "gains [keyword]" (standalone clause)
      const hasKw = cl.match(/^(?:has|gains?)\s+(.+)$/);
      if (hasKw) {
        const kwText = hasKw[1].trim();
        // Check for quoted ability (use original-case clause for proper display)
        const origHasKw = clause.match(/^(?:has|gains?)\s+(.+)$/i);
        const origKwText = origHasKw ? origHasKw[1].trim() : kwText;
        const quotedMatch = origKwText.match(/[""\u201c]((?:[^""\u201d]|'(?!(?:\s|$|,)))*)[""\u201d]/);
        if (quotedMatch) {
          quotedAbilities.push(quotedMatch[1].trim().replace(/\.$/, ''));
          continue;
        }
        // Check for protection (may be compound: "protection from black and from red")
        if (kwText.startsWith('protection from')) {
          const splitProts = _splitProtectionAbilities(kwText);
          for (const prot of splitProts) abilitiesToGrant.push(prot);
          continue;
        }
        const kws = parseKeywordList(kwText);
        if (kws.length > 0) {
          for (const kw of kws) abilitiesToGrant.push(kw);
          continue;
        }
        // Single keyword fallback
        if (KEYWORD_LIST.some(k => kwText.toLowerCase() === k) || /^\w+$/.test(kwText)) {
          abilitiesToGrant.push(kwText.charAt(0).toUpperCase() + kwText.slice(1));
          continue;
        }
      }

      // Standalone keyword without "has" prefix (e.g. "lifelink" as orphaned clause from "has trample and lifelink")
      if (kwSet.has(cl) || KEYWORD_LIST.some(k => cl === k)) {
        abilitiesToGrant.push(cl.charAt(0).toUpperCase() + cl.slice(1));
        continue;
      }
      // Parameterized keyword without "has" prefix (e.g. "ward {2}", "toxic 1")
      const paramKwMatch = cl.match(/^(\w+(?:\s+\w+)?)\s+(.+)$/);
      if (paramKwMatch && (kwSet.has(paramKwMatch[1]) || PARAMETERIZED_KEYWORDS.has(paramKwMatch[1]))) {
        const kwBase = paramKwMatch[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        abilitiesToGrant.push(`${kwBase} ${paramKwMatch[2]}`);
        continue;
      }
      // Two-word keyword without "has" (e.g. "first strike")
      if (kwSet.has(cl.toLowerCase())) {
        abilitiesToGrant.push(cl.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        continue;
      }
      // Fix #7: Bare quoted ability without "has" prefix (e.g. from 'has "ability1" and "ability2"')
      // After splitting on "and", the second clause may just be a quoted ability
      const bareQuotedMatch = clause.match(/^[""\u201c]((?:[^""\u201d]|'(?!(?:\s|$|,)))*)[""\u201d]$/);
      if (bareQuotedMatch) {
        quotedAbilities.push(bareQuotedMatch[1].trim().replace(/\.$/, ''));
        continue;
      }
    }

    // Validate extracted subtypes against Scryfall's TypeCatalog:
    // filter out words that aren't real MTG subtypes (parser noise).
    if (typeof TypeCatalog !== 'undefined' && TypeCatalog.loaded) {
      extractedSubtypes = extractedSubtypes.filter(s => TypeCatalog.classifySubtype(s) !== 'unknown');
    }

    // Infer: if land subtypes found but no Land type, add Land
    if (isLandSubtype && !extractedTypes.includes('Land')) extractedTypes.push('Land');
    // Infer: if creature subtypes found but no Creature type (and no Land/Artifact-only type), add Creature
    // This handles "is a Citizen" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "is a Creature ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Citizen", "is a Frog" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "is a Creature ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Frog"
    if (extractedSubtypes.length > 0 && !isLandSubtype && extractedTypes.length === 0) {
      extractedTypes.push('Creature');
    }
    // If creature subtypes present alongside other types (like Artifact), also add Creature
    // if the subtypes look like creature types (not artifact subtypes like Treasure, Equipment, etc.)
    if (extractedSubtypes.length > 0 && extractedTypes.length > 0 && !extractedTypes.includes('Creature')) {
      const ARTIFACT_SUBTYPES = ['Treasure', 'Equipment', 'Vehicle', 'Food', 'Clue', 'Blood', 'Gold', 'Map', 'Powerstone', 'Incubator'];
      const hasCreatureSubtype = extractedSubtypes.some(s => !ARTIFACT_SUBTYPES.includes(s) && !Object.values(LAND_SUBTYPE_WORDS).includes(s));
      if (hasCreatureSubtype) extractedTypes.push('Creature');
    }


    // General rule: unless the card explicitly states a new permanent type (e.g. "is a Creature"),
    // assume the enchanted permanent retains its existing types Ã¢â‚¬â€ only add the new subtypes.
    // typeWasExplicit is false when Creature was inferred from creature subtypes only.
    if (hasIsClause && !typeWasExplicit && !isLandSubtype && !isTypeAddition) {
      subtypeOnlyReplace = true; // replace subtypes only, keep existing permanent types
    }
    // --- Generate effects, deduplicating against earlier parsers ---
    const sid = permanent.id;
    const hasTargetedEffect = (type, layer) =>
      effects.some(e => e.type === type && (!layer || e.layer === layer) && e.sourceId === sid && e.scope === 'targeted');

    // Layer 3: Name change (e.g. "named Legitimate Businessperson")
    if (extractedName) {
      effects.push({
        id: `${sid}_eff_${effects.length}`, layer: '3', type: EFFECT_TYPE.SET_NAME,
        params: { name: extractedName },
        appliesTo: null, scope: 'targeted',
        sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
        desc: `Enchanted permanent is named "${extractedName}".`,
      });
    }

    // Layer 4: Type change (only if "is" clause found with types/subtypes)
    if (hasIsClause && (extractedTypes.length > 0 || extractedSubtypes.length > 0)) {
      if (isTypeAddition) {
        // "in addition to" = ADD_TYPE
        if (!hasTargetedEffect(EFFECT_TYPE.ADD_TYPE, '4')) {
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '4', type: EFFECT_TYPE.ADD_TYPE,
            params: { types: extractedTypes, subtypes: extractedSubtypes },
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent is also ${[...extractedTypes, ...extractedSubtypes].join(' ')}.`,
          });
        }
      } else if (subtypeOnlyReplace) {
        // "is a [subtype]" with no explicit type word and no "in addition to":
        // REPLACE subtypes with the new ones, but KEEP existing permanent types and supertypes.
        // Uses SET_TYPE with replaceSubtypeCategory:'creature' for creature subtypes.
        if (!hasTargetedEffect(EFFECT_TYPE.SET_TYPE, '4')) {
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '4', type: EFFECT_TYPE.SET_TYPE,
            params: { subtypes: extractedSubtypes, replaceSubtypeCategory: 'creature',
                      keepSupertypes: true, keepTypes: true },
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent's subtypes become ${extractedSubtypes.join(' ')}.`,
          });
        }
      } else {
        // "is a [Type]" with explicit type = SET_TYPE (full replacement of types + subtypes)
        // Always keepSupertypes: supertypes (like Legendary) are only removed by explicit text
        if (!hasTargetedEffect(EFFECT_TYPE.SET_TYPE, '4')) {
          // When the aura says "Enchant creature" (not "Enchant permanent"), and only the
          // Creature type is being explicitly set (no other card types like Artifact or Land),
          // the effect scopes to creature characteristics only. Non-creature card types (Land,
          // Artifact) and non-creature subtypes (Forest) are preserved — the card doesn't say
          // "loses all other card types," unlike Song of the Dryads / Imprisoned in the Moon
          // which say "Enchant permanent" and replace the full type line.
          // e.g. Kenrith's Transformation: "Enchant creature, is a 1/1 green Elk creature"
          //   → only replaces creature subtypes; Ashaya's Land type and Forest subtype survive.
          const useCreatureOnlySemantics = enchantTargetIsCreatureOnly && !hasLoseCardTypes
            && !isLandSubtype && extractedTypes.every(t => t === 'Creature');
          let params;
          if (useCreatureOnlySemantics) {
            params = { subtypes: extractedSubtypes, replaceSubtypeCategory: 'creature',
                       keepSupertypes: true, keepTypes: true };
          } else {
            // When isLandSubtype is true AND there are no other non-land types, the card says
            // "is a [basic land type]" (e.g. "is a Forest") — this replaces ALL types with Land
            // and ALL subtypes with the land subtype. Rule 305.7 then removes abilities.
            params = isLandSubtype
              ? { types: extractedTypes, subtypes: extractedSubtypes, keepSupertypes: true }
              : { types: extractedTypes, subtypes: extractedSubtypes, keepSupertypes: true };
          }
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '4', type: EFFECT_TYPE.SET_TYPE,
            params,
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent becomes ${[...extractedTypes, ...extractedSubtypes].join(' ')}.`,
          });
        }
      }
    }

    // Layer 5: Color change (only if colors explicitly mentioned or "colorless")
    if (extractedColors.length > 0 || isColorless) {
      if (isColorAddition) {
        if (!hasTargetedEffect(EFFECT_TYPE.ADD_COLOR, '5') && extractedColors.length > 0) {
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '5', type: EFFECT_TYPE.ADD_COLOR,
            params: { colors: extractedColors },
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent gains color${extractedColors.length > 1 ? 's' : ''}: ${extractedColors.join(', ')}.`,
          });
        }
      } else {
        if (!hasTargetedEffect(EFFECT_TYPE.SET_COLOR, '5')) {
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '5', type: EFFECT_TYPE.SET_COLOR,
            params: { colors: extractedColors },
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent is ${extractedColors.length ? extractedColors.join(', ') : 'colorless'}.`,
          });
        }
      }
    }

    // Layer 6: Ability removal / granting
    const allReplaceWith = [...abilitiesToGrant, ...quotedAbilities];
    if (hasLoseAbilities || hasLoseAllCreatureTypes) {
      if (!hasTargetedEffect(EFFECT_TYPE.REMOVE_ABILITIES, '6')) {
        effects.push({
          id: `${sid}_eff_${effects.length}`, layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
          params: { replaceWith: allReplaceWith.length > 0 ? allReplaceWith : undefined,
                    losesAllCreatureTypes: hasLoseAllCreatureTypes || undefined },
          appliesTo: null, scope: 'targeted',
          sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
          desc: `Enchanted permanent${hasLoseAbilities ? ' loses all abilities' : ''}${hasLoseAllCreatureTypes ? ' loses all creature types' : ''}${allReplaceWith.length ? ` and gains: ${allReplaceWith.join(', ')}` : ''}.`,
        });
      }
    } else {
      // Just grant abilities (no "loses all")
      for (const ab of allReplaceWith) {
        if (!effects.some(e => e.layer === '6' && e.params.ability === ab && e.sourceId === sid && e.scope === 'targeted')) {
          effects.push({
            id: `${sid}_eff_${effects.length}`, layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability: ab },
            appliesTo: null, scope: 'targeted',
            sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
            desc: `Enchanted permanent gains ${ab}.`,
          });
        }
      }
    }

    // Layer 6: Specific ability removal from "loses [keyword]" clauses (e.g. "loses flying")
    if (specificAbilityRemovals.length > 0) {
      effects.push({
        id: `${sid}_eff_${effects.length}`, layer: '6', type: EFFECT_TYPE.REMOVE_ABILITIES,
        params: { specificAbilities: specificAbilityRemovals },
        appliesTo: null, scope: 'targeted',
        sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
        desc: `Enchanted/Equipped permanent loses ${specificAbilityRemovals.join(', ')}.`,
      });
    }

    // Layer 7b: Set P/T (only if P/T was found)
    if (extractedPT) {
      if (!hasTargetedEffect(EFFECT_TYPE.SET_PT, '7b')) {
        effects.push({
          id: `${sid}_eff_${effects.length}`, layer: '7b', type: EFFECT_TYPE.SET_PT,
          params: { power: extractedPT.power, toughness: extractedPT.toughness },
          appliesTo: null, scope: 'targeted',
          sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
          desc: `Enchanted permanent has base P/T ${extractedPT.power}/${extractedPT.toughness}.`,
        });
      }
    }
    // Layer 7b: Set P/T equal to mana value (Animate Artifact, etc.)
    if (extractedUseMV && !extractedPT) {
      if (!hasTargetedEffect(EFFECT_TYPE.SET_PT, '7b')) {
        effects.push({
          id: `${sid}_eff_${effects.length}`, layer: '7b', type: EFFECT_TYPE.SET_PT,
          params: { useMV: true },
          appliesTo: null, scope: 'targeted',
          sourceId: sid, sourceName: card.name, timestamp: permanent.timestamp,
          desc: `Enchanted permanent has P/T equal to its mana value.`,
        });
      }
    }

    // Attach "as long as" condition to all effects generated from this match
    if (_matchCondition) {
      for (let ei = effectCountBefore; ei < effects.length; ei++) {
        effects[ei].asLongAsCondition = _matchCondition;
      }
    }
    // CR 613: Tag all effects from this enchant-transform ability with a shared group ID
    // so the engine knows they are all part of the same continuous effect.
    if (effects.length > effectCountBefore + 1) {
      const _enchGroupId = `${sid}_enchTransform_${effectCountBefore}`;
      for (let ei = effectCountBefore; ei < effects.length; ei++) {
        effects[ei].abilityGroupId = _enchGroupId;
      }
    }
  }

  // Store conditional ability indices on the permanent so the engine can exclude them
  // from the base state, while keeping them visible in the UI for display.
  // Saga chapter lines are NOT conditional abilities — they have separate saga threshold display.
  // Class level lines are NOT conditional abilities — they have separate class level display.
  // Leveler lines are NOT conditional abilities — they have separate leveler display.
  // Store as Map<abilityIndex, conditionFunction> so UI can evaluate condition state.
  if (_lineConditionMap.size > 0 && permanent.printedAbilities) {
    const condMap = new Map();
    for (const [li, condIdx] of _lineConditionMap) {
      // Exclude saga, class, and leveler lines
      if (_sagaLineThresholds.has(li)) continue;
      if (_classLineThresholds.has(li)) continue;
      if (_levelerLineData.has(li)) continue;
      if (_spacecraftLineData.has(li)) continue;
      // Exclude lines already handled by KNOWN_ABILITY_EFFECTS — those effects
      // have their own condition logic (e.g. asLongAsCondition) and should not
      // also be treated as conditional abilities by the generic display path.
      if (_knownHandledLines.has(li)) continue;
      condMap.set(li, _asLongAsConditions[condIdx]);
    }
    if (condMap.size > 0) {
      permanent._conditionalAbilityIndices = new Set(condMap.keys());
      permanent._conditionalAbilityConditions = condMap;
    }
  }

  // Generate SET_PT effects for leveler P/T brackets.
  // Each bracket's P/T override is conditional on level counters being in range.
  if (_isLeveler && _levelerBrackets.length > 0) {
    const srcId = permanent.id;
    for (const bracket of _levelerBrackets) {
      if (bracket.power === null || bracket.toughness === null) continue;
      const minLvl = bracket.min;
      const maxLvl = bracket.max;
      const levelerPTCond = (_permState, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) {
            const lvlCount = (srcState.counters && srcState.counters['level']) || 0;
            return lvlCount >= minLvl && lvlCount <= maxLvl;
          }
        }
        return false;
      };
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '7b', type: EFFECT_TYPE.SET_PT,
        params: { power: bracket.power, toughness: bracket.toughness },
        appliesTo: null, scope: 'targeted', selfTarget: true,
        affectsSelf: true,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `LEVEL ${minLvl}${maxLvl === Infinity ? '+' : '-' + maxLvl}: Set base P/T to ${bracket.power}/${bracket.toughness}.`,
        asLongAsCondition: levelerPTCond,
      });
    }
  }

  // Generate ADD_ABILITY effects for leveler bracket abilities.
  // Each ability line within a bracket is conditional on level counters being in range.
  // These replace the base state abilities that were filtered out.
  if (_isLeveler && _levelerBrackets.length > 0) {
    const srcId = permanent.id;
    for (let bIdx = 0; bIdx < _levelerBrackets.length; bIdx++) {
      const bracket = _levelerBrackets[bIdx];
      const minLvl = bracket.min;
      const maxLvl = bracket.max;
      
      // Find ability lines for this bracket from the leveler data
      for (const [lineIdx, data] of _levelerLineData) {
        if (data.bracket !== bIdx || data.isStructural || data.isPT || data.isLevelUp) continue;
        // This is an ability line in this bracket
        const abilityText = permanent.printedAbilities[lineIdx];
        if (!abilityText) continue;
        
        const levelerAbilCond = (_permState, allStates) => {
          if (allStates) {
            const srcState = allStates.get(srcId);
            if (srcState) {
              const lvlCount = (srcState.counters && srcState.counters['level']) || 0;
              return lvlCount >= minLvl && lvlCount <= maxLvl;
            }
          }
          return false;
        };
        
        // Add this ability as a conditional self-ability.
        // For keyword lists like "Flying, first strike" split into individual keywords.
        // For activated/complex abilities, add the full text as-is.
        const LEVELER_KW = new Set(['deathtouch','defender','double strike','first strike','flash',
          'flying','haste','hexproof','indestructible','lifelink','menace','protection',
          'reach','shroud','trample','vigilance','fear','intimidate','shadow','horsemanship',
          'wither','infect','prowess','ward','undying','persist','exalted','decayed']);
        const kwText = abilityText.trim();
        const kwLower = kwText.toLowerCase();
        // Check if this is a pure keyword line (possibly comma-separated)
        // Also handle parameterized keywords: "protection from X", "ward {N}", "hexproof from X"
        const kwCandidates = kwLower.split(/\s*,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
        const isKeywordLike = (k) => {
          if (LEVELER_KW.has(k)) return true;
          if (/^\w+\s+\d+$/.test(k)) return true; // "toxic 2"
          if (/^\w+\s+\{/.test(k)) return true; // "ward {2}"
          if (/^protection from\s+/.test(k)) return true; // "protection from instants"
          if (/^hexproof from\s+/.test(k)) return true; // "hexproof from blue"
          return false;
        };
        const allKeywords = kwCandidates.every(isKeywordLike);
        
        if (allKeywords && kwCandidates.length > 0) {
          // Pure keyword line — add each keyword separately
          for (const kw of kwCandidates) {
            effects.push({
              id: `${permanent.id}_eff_${effects.length}`,
              layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
              params: { ability: kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') },
              appliesTo: null, scope: 'targeted', selfTarget: true,
              affectsSelf: true,
              sourceId: permanent.id, sourceName: card.name,
              timestamp: permanent.timestamp,
              desc: `LEVEL ${minLvl}${maxLvl === Infinity ? '+' : '-' + maxLvl}: Gain ${kw}.`,
              asLongAsCondition: levelerAbilCond,
            });
          }
        } else {
          // Complex ability (activated/triggered) — add full text
          effects.push({
            id: `${permanent.id}_eff_${effects.length}`,
            layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability: kwText },
            appliesTo: null, scope: 'targeted', selfTarget: true,
            affectsSelf: true,
            sourceId: permanent.id, sourceName: card.name,
            timestamp: permanent.timestamp,
            desc: `LEVEL ${minLvl}${maxLvl === Infinity ? '+' : '-' + maxLvl}: Gain ability.`,
            asLongAsCondition: levelerAbilCond,
          });
        }
      }
    }
  }

  // Parse quoted ability text that itself grants global effects (e.g. Dancer's Chakram:

  // Generate effects for spacecraft station abilities.
  // For creature transformation: ADD_TYPE Creature + SET_PT at creatureThreshold.
  // For each N+ | ability line: parse the ability text part for keywords, boosts, etc.
  if (_isSpacecraft && permanent._spacecraftData) {
    const srcId = permanent.id;
    const sData = permanent._spacecraftData;

    // Creature transformation at creatureThreshold
    if (sData.creatureThreshold !== null) {
      const minCharge = sData.creatureThreshold;
      const ctCond = (_permState, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) return ((srcState.counters && srcState.counters['charge']) || 0) >= minCharge;
        }
        return false;
      };
      // ADD_TYPE Creature
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '4', type: EFFECT_TYPE.ADD_TYPE,
        params: { types: ['Creature'] },
        appliesTo: null, scope: 'targeted', selfTarget: true,
        affectsSelf: true,
        sourceId: permanent.id, sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Station ${minCharge}+: Becomes an artifact creature.`,
        asLongAsCondition: ctCond,
      });
      // SET_PT uses the card's printed P/T (spacecraft P/T is printed on the card)
      if (permanent.printedPower !== null && permanent.printedToughness !== null) {
        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '7b', type: EFFECT_TYPE.SET_PT,
          params: { power: permanent.printedPower, toughness: permanent.printedToughness },
          appliesTo: null, scope: 'targeted', selfTarget: true,
          affectsSelf: true,
          sourceId: permanent.id, sourceName: card.name,
          timestamp: permanent.timestamp,
          desc: `Station ${minCharge}+: Base P/T ${permanent.printedPower}/${permanent.printedToughness}.`,
          asLongAsCondition: ctCond,
        });
      }
    }

    // For each N+ | ability line, generate ADD_ABILITY effects for keywords.
    // The ability text after the pipe is what matters.
    for (const [lineIdx, info] of sData.thresholds) {
      const minCharge = info.min;
      const abilityText = info.abilityText;
      if (!abilityText) continue;

      const spacecraftAbilCond = (_permState, allStates) => {
        if (allStates) {
          const srcState = allStates.get(srcId);
          if (srcState) return ((srcState.counters && srcState.counters['charge']) || 0) >= minCharge;
        }
        return false;
      };

      // Check if this is a pure keyword line
      const STATION_KW = new Set(['deathtouch','defender','double strike','first strike','flash',
        'flying','haste','hexproof','indestructible','lifelink','menace','protection',
        'reach','shroud','trample','vigilance','fear','intimidate','shadow','horsemanship',
        'wither','infect','prowess','ward','undying','persist','exalted','decayed']);
      const kwLower = abilityText.toLowerCase();
      const kwCandidates = kwLower.split(/\s*,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
      const isKeywordLike = (k) => {
        if (STATION_KW.has(k)) return true;
        if (/^\w+\s+\d+$/.test(k)) return true;
        if (/^\w+\s+\{/.test(k)) return true;
        if (/^protection from\s+/.test(k)) return true;
        if (/^hexproof from\s+/.test(k)) return true;
        return false;
      };
      const allKeywords = kwCandidates.every(isKeywordLike);

      if (allKeywords && kwCandidates.length > 0) {
        for (const kw of kwCandidates) {
          effects.push({
            id: `${permanent.id}_eff_${effects.length}`,
            layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability: kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') },
            appliesTo: null, scope: 'targeted', selfTarget: true,
            affectsSelf: true,
            sourceId: permanent.id, sourceName: card.name,
            timestamp: permanent.timestamp,
            desc: `Station ${minCharge}+: Gain ${kw}.`,
            asLongAsCondition: spacecraftAbilCond,
          });
        }
      }
      // Non-keyword abilities (like "Other creatures you control get +1/+1") are handled
      // by the generic parser since the "N+ | " prefix gets stripped by em-dash stripping.
      // We don't need to generate ADD_ABILITY for those — they create their own effects.
    }
  }

  // --- Trait parsing: goaded, suspected, and similar status traits ---
  // Matches patterns like: "goads target creature", "suspect it", "becomes goaded",
  // "is goaded", "[filter] are goaded", "[filter] becomes suspected"
  const TRAIT_KEYWORDS = {
    'goaded': 'Goaded', 'goad': 'Goaded', 'goads': 'Goaded',
    'suspected': 'Suspected', 'suspect': 'Suspected', 'suspects': 'Suspected',
  };
  // Pattern: "[filter] is/are/becomes goaded/suspected"
  const traitStateRegex = /\b(.+?)\s+(?:is|are|becomes?)\s+(goaded|suspected)\b/gi;
  let traitStateMatch;
  while ((traitStateMatch = traitStateRegex.exec(oracle)) !== null) {
    const filterText = traitStateMatch[1].trim();
    const traitName = TRAIT_KEYWORDS[traitStateMatch[2].toLowerCase()];
    if (!traitName) continue;
    const { fn, desc: filterDesc } = buildAppliesToFromText(filterText);
    effects.push({
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
      params: { ability: traitName, isTrait: true },
      appliesTo: fn, scope: fn ? 'global' : 'targeted',
      selfTarget: !fn,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${filterText} ${traitStateMatch[0].includes('are') ? 'are' : 'is'} ${traitName.toLowerCase()}. ${filterDesc}`,
      _oraclePos: traitStateMatch.index,
    });
  }
  // Pattern: "goad/goads/suspect/suspects [target/filter]"
  const traitVerbRegex = /\b(goads?|suspects?)\s+(.+?)(?:\.|,|$)/gi;
  let traitVerbMatch;
  while ((traitVerbMatch = traitVerbRegex.exec(oracle)) !== null) {
    const verb = traitVerbMatch[1].toLowerCase();
    const traitName = TRAIT_KEYWORDS[verb];
    if (!traitName) continue;
    const targetText = traitVerbMatch[2].trim();
    const { fn, desc: filterDesc, isSpellTarget } = buildAppliesToFromText(targetText);
    const eff = {
      id: `${permanent.id}_eff_${effects.length}`,
      layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
      params: { ability: traitName, isTrait: true },
      appliesTo: fn, scope: fn ? 'global' : 'targeted',
      selfTarget: false,
      sourceId: permanent.id, sourceName: card.name,
      timestamp: permanent.timestamp,
      desc: `${verb} ${targetText}. ${filterDesc}`,
      _oraclePos: traitVerbMatch.index,
    };
    if (isSpellTarget) {
      eff.scope = 'targeted';
      eff.targetRestriction = fn || null;
    }
    effects.push(eff);
  }

  // Parse quoted ability text
  // equipped creature has "Other commanders you control get +2/+2 and have lifelink").
  // When such an ADD_ABILITY effect is targeted (scope:'targeted'), the quoted text may
  // contain boost or keyword-grant patterns that should generate real global effects,
  // conditioned on the source being equipped/attached (targetId being set).
  _parseGrantedGlobalAbilities(permanent, effects);

  // --- "target player gains control of target [types] you control" → Layer 2 CONTROL
  // effect where the new controller is a user-chosen player (dropdown). Pattern: Bazaar Trader.
  // Guard against activated abilities on the static permanent: only emit when this is a
  // fired/manual-effect pseudo-permanent (the `{T}:` prefix is stripped by extractActivatedAbilities).
  {
    const tpgcRegex = /\btarget player gains control of target (.+?) you control\b/i;
    const tpgcMatch = oracle.match(tpgcRegex);
    const isActivatedCost = /^[^\n]*\{[^}]+\}[^:\n]*:/m.test(oracle);
    if (tpgcMatch && !isActivatedCost && !effects.some(e => e.type === EFFECT_TYPE.CONTROL)) {
      permanent._targetsChosenPlayer = true;
      permanent._youControlRequired = true;
      const chosenPlayer = permanent._targetPlayerId || null;
      const typeText = tpgcMatch[1].trim();
      // Build a target-filter function from the captured type text so the UI can
      // render a permanent-picker dropdown filtered to e.g. "artifact, creature, or land".
      // Handle disjunctive type lists ("X, Y, or Z") by splitting and OR-ing, since
      // buildAppliesToFromText alone collapses comma-separated types into an AND.
      let targetRestriction = null;
      const parts = typeText.split(/\s*,\s*|\s+or\s+/i).map(s => s.trim()).filter(Boolean);
      const subFns = [];
      for (const part of parts) {
        const br = buildAppliesToFromText(part);
        if (br && br.fn) subFns.push(br.fn);
      }
      if (subFns.length) {
        targetRestriction = (st) => subFns.some(fn => fn(st));
      }
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '2',
        type: EFFECT_TYPE.CONTROL,
        params: { newController: chosenPlayer },
        appliesTo: null,
        scope: 'targeted',
        selfTarget: false,
        _targetPlayerControl: true,
        youControlRequired: true,
        targetRestriction,
        sourceId: permanent.id,
        sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `Target player gains control of target ${typeText} you control.`,
      });
    }
  }

  // --- "gain control of [target/enchanted] [type]" → Layer 2 CONTROL effect ---
  // Skip if KNOWN_ABILITY_EFFECTS already handled this card
  if (!effects.some(e => e.type === EFFECT_TYPE.CONTROL)) {
    const gainControlRegex = /\bgain control of (target |enchanted )?(.+?)(?:\s+until end of turn)?\.?(?:\s|$)/gi;
    let gcMatch;
    while ((gcMatch = gainControlRegex.exec(oracle)) !== null) {
      // Skip if inside a triggered ability sentence (When/Whenever/At)
      const lineStart = oracle.lastIndexOf('\n', gcMatch.index);
      const lineText = oracle.substring(lineStart + 1, gcMatch.index + gcMatch[0].length);
      if (/^(?:when(?:ever)?|at)\b/i.test(lineText.trim())) continue;
      // Skip if inside an activated ability (cost:effect format, e.g. "{T}: ...")
      const fullLine = oracle.substring(lineStart + 1, oracle.indexOf('\n', gcMatch.index) === -1 ? oracle.length : oracle.indexOf('\n', gcMatch.index));
      if (/^[^:]*\{[^}]+\}[^:]*:/.test(fullLine)) continue;
      // Skip "target player gains control of ..." — handled above with dropdown
      if (/\btarget player gains control of\b/i.test(lineText)) continue;

      const qualifier = (gcMatch[1] || '').trim(); // 'target' or 'enchanted' or ''
      const targetType = gcMatch[2].trim();
      const isTargeted = qualifier === 'target' || qualifier === 'enchanted';

      // The non-greedy (.+?) stops at the first space, so gcMatch[0] only contains
      // "gain control of target creature " — "an opponent controls" and "until end of turn"
      // are left unmatched. Use the full oracle sentence (to the next period) for these checks.
      const sentenceStart = oracle.lastIndexOf('\n', gcMatch.index) + 1;
      const dotIdx = oracle.indexOf('.', gcMatch.index);
      const sentenceEnd = dotIdx === -1 ? oracle.length : dotIdx + 1;
      const fullSentence = oracle.slice(sentenceStart, sentenceEnd);

      const isUntilEOT = /until end of turn/i.test(fullSentence);
      const opponentCtrlRequired = /\bopponent(?:'?s?)?\s+controls?\b/i.test(fullSentence);

      // For spells (isManualEffect): if "target" appears anywhere in the sentence
      // (e.g. "Untap target permanent and gain control of it"), the "it" pronoun
      // refers to the spell's target. Treat as 'targeted' so the engine requires
      // a targetId before applying — prevents contaminating all permanents' states.
      const sentenceHasTarget = /\btarget\b/i.test(fullSentence);
      const effectScope = (isTargeted || (permanent.isManualEffect && sentenceHasTarget))
        ? 'targeted' : 'global';

      // For global scope, extract the full target type from fullSentence (the non-greedy regex
      // only captures the first word of the type, e.g. "all" from "gain control of all creatures").
      // Also resolves pronouns: "gain control of them" where "them" refers to "all [type]"
      // earlier in the same sentence (e.g. Insurrection: "Untap all creatures and gain control
      // of them until end of turn.").
      // Build an appliesTo filter so e.g. Insurrection only affects creatures, not all permanents.
      let appliesToFn = null;
      if (effectScope === 'global') {
        const gcPhraseIdx = fullSentence.toLowerCase().indexOf('gain control of ');
        if (gcPhraseIdx !== -1) {
          let fullTypeText = fullSentence.slice(gcPhraseIdx + 'gain control of '.length);
          // Remove leading qualifier (target/enchanted)
          fullTypeText = fullTypeText.replace(/^(target|enchanted)\s+/i, '');
          // Remove "all/each/every" prefix
          fullTypeText = fullTypeText.replace(/^(?:all|each|every)\s+/i, '');
          // Remove " until end of turn" and everything after
          fullTypeText = fullTypeText.replace(/\s+until end of turn[\s\S]*$/i, '');
          // Remove controller qualifiers
          fullTypeText = fullTypeText.replace(/\s+(?:an?\s+)?(?:opponent(?:'?s?)?\s+controls?|you\s+control)$/i, '');
          // Remove trailing punctuation/whitespace
          fullTypeText = fullTypeText.replace(/[.,;]\s*$/, '').trim();
          // Resolve pronoun "them"/"it" by finding "all/each/every [type]" earlier in the sentence
          if (fullTypeText === 'it' || fullTypeText === 'them') {
            const pronounRef = fullSentence.slice(0, gcPhraseIdx)
              .match(/\b(?:all|each|every)\s+(\w+)/i);
            if (pronounRef) fullTypeText = pronounRef[1];
          }
          if (fullTypeText && fullTypeText !== 'it' && fullTypeText !== 'them') {
            const btResult = buildAppliesToFromText(fullTypeText);
            if (btResult && btResult.fn && !btResult.isSelf && !btResult.isTargeted) {
              appliesToFn = btResult.fn;
            }
          }
        }
      }

      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '2',
        type: EFFECT_TYPE.CONTROL,
        params: { newController: permanent.owner || 'player_0', untilEndOfTurn: isUntilEOT },
        appliesTo: appliesToFn,
        scope: effectScope,
        selfTarget: false,
        sourceId: permanent.id,
        sourceName: card.name,
        timestamp: permanent.timestamp,
        opponentControlRequired: opponentCtrlRequired,
        desc: `Gain control of ${qualifier ? qualifier + ' ' : ''}${targetType}${isUntilEOT ? ' until end of turn' : ''}.`,
      });
    }

    // "you control enchanted [type]" on auras → Layer 2 CONTROL for the enchanted permanent
    const youControlEnchanted = oracle.match(/\byou control enchanted (creature|permanent|artifact|enchantment|land|planeswalker)\b/i);
    if (youControlEnchanted && !effects.some(e => e.type === EFFECT_TYPE.CONTROL)) {
      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '2',
        type: EFFECT_TYPE.CONTROL,
        params: { newController: permanent.owner || 'player_0', useSourceController: true },
        appliesTo: null,
        scope: 'targeted',
        selfTarget: false,
        sourceId: permanent.id,
        sourceName: card.name,
        timestamp: permanent.timestamp,
        desc: `You control enchanted ${youControlEnchanted[1]}.`,
      });
    }
  }

  // --- "exchange control of ..." → Layer 2 CONTROL exchange effect ---
  if (!effects.some(e => e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl)) {
    const exchangeControlRegex = /\bexchange control of\s+(.+?)(?:\.\s*|$)/gi;
    let exchMatch;
    while ((exchMatch = exchangeControlRegex.exec(oracle)) !== null) {
      // Skip if inside a triggered ability sentence (When/Whenever/At)
      const lineStart = oracle.lastIndexOf('\n', exchMatch.index);
      const lineText = oracle.substring(lineStart + 1, exchMatch.index + exchMatch[0].length);
      if (/^(?:when(?:ever)?|at)\b/i.test(lineText.trim())) continue;

      const captured = exchMatch[1].trim();
      const capLower = captured.toLowerCase();

      // Classify the pattern
      let exchangeMode = 'two_targets';
      let exchangeSelfId = null;
      let shareTypeRequired = false;
      let differentPlayersRequired = false;
      let opponentCtrlRequired = false;
      let neitherOwnNorControlRequired = false;
      let targetTypeText = '';
      let maxTargets = 2;

      if (/^this\s+(?:creature|artifact|enchantment|permanent|card)\s+and\s+/i.test(captured)) {
        // Pattern A: "this [type] and [target type]"
        exchangeMode = 'self_and_target';
        exchangeSelfId = permanent.id;
        maxTargets = 1;
        targetTypeText = captured.replace(/^this\s+\S+\s+and\s+/i, '').trim();
      } else if (/^two\s+target\s+/i.test(captured)) {
        // Pattern B: "two target [type]"
        targetTypeText = captured.replace(/^two\s+target\s+/i, '').trim();
      } else if (/^target\s+.+?\s+and\s+target\s+/i.test(captured)) {
        // Pattern B variant: "target X and target Y" (Trade the Helm)
        targetTypeText = captured;
      } else if (/^those\s+/i.test(captured)) {
        // Pattern D: "those permanents/creatures" (Confusion in the Ranks pronoun)
        targetTypeText = captured.replace(/^those\s+/i, '').trim();
      } else {
        // Generic fallback
        targetTypeText = captured;
      }

      // Parse constraints from full sentence
      const sentenceStart = oracle.lastIndexOf('\n', exchMatch.index) + 1;
      const dotIdx = oracle.indexOf('.', exchMatch.index);
      const sentenceEnd = dotIdx === -1 ? oracle.length : dotIdx + 1;
      const fullSentence = oracle.slice(sentenceStart, sentenceEnd);
      if (/\bshare\s+a\s+(?:permanent|card)\s+type\b/i.test(fullSentence)) shareTypeRequired = true;
      if (/\bcontrolled\s+by\s+different\s+players\b/i.test(fullSentence)) differentPlayersRequired = true;
      if (/\bopponent(?:'?s?)?\s+controls?\b/i.test(fullSentence)) opponentCtrlRequired = true;
      if (/\byou\s+don'?t\s+control\b/i.test(fullSentence)) opponentCtrlRequired = true;
      if (/\byou\s+neither\s+own\s+nor\s+control\b/i.test(fullSentence)) { opponentCtrlRequired = true; neitherOwnNorControlRequired = true; }

      // Build target restriction function from the type text
      let targetRestriction = null;
      let cleanTypeText = targetTypeText
        .replace(/\s+(?:an?\s+)?(?:opponent(?:'?s?)?\s+controls?|you\s+(?:control|don'?t\s+control)).*$/i, '')
        .replace(/\s+you\s+neither\s+(?:own|control)\b.*$/i, '') // e.g. "target permanent you neither own nor control"
        .replace(/\s+controlled\s+by\s+different\s+players.*$/i, '')
        .replace(/\s+that\s+share\s+a\s+(?:permanent|card)\s+type.*$/i, '')
        .replace(/\s+(?:its|their)\s+controller\s+controls\b.*$/i, '') // e.g. "target permanent its controller controls"
        .replace(/^(?:up\s+to\s+\w+\s+)?(?:target\s+)?/i, '')
        .replace(/[.,;]\s*$/, '')
        .trim();
      // For "target X and target Y" split, use first type for restriction
      const splitTargets = cleanTypeText.match(/^(.+?)\s+and\s+target\s+(.+)$/i);
      if (splitTargets) {
        cleanTypeText = splitTargets[1].trim();
        // Could use splitTargets[2] for second target type — for now treat uniformly
      }
      if (cleanTypeText) {
        const btResult = buildAppliesToFromText(cleanTypeText);
        if (btResult && btResult.fn) {
          targetRestriction = (st) => btResult.fn(st);
        }
      }

      effects.push({
        id: `${permanent.id}_eff_${effects.length}`,
        layer: '2',
        type: EFFECT_TYPE.CONTROL,
        params: {
          exchangeControl: true,
          exchangeMode,
          exchangeTargetA: exchangeSelfId, // pre-set for self exchanges
          exchangeTargetB: null,
          snapshotControllerA: null,
          snapshotControllerB: null,
          exchangeSelfId,
          shareTypeRequired,
          differentPlayersRequired,
        },
        scope: 'targeted',
        selfTarget: false,
        sourceId: permanent.id,
        sourceName: card.name,
        timestamp: permanent.timestamp,
        opponentControlRequired: opponentCtrlRequired,
        neitherOwnNorControl: neitherOwnNorControlRequired,
        targetRestriction,
        maxTargets,
        desc: `Exchange control of ${captured}.`,
      });
    }
  }

  // Post-process: for instant/sorcery spell effects that have scope:'targeted' from
  // "target [type]" parsing, attach targetRestriction and maxTargets so the UI can
  // show appropriate target dropdowns with type filtering.
  if (permanent.isManualEffect) {
    // Tag all effects from spells so the engine can enforce timestamp-order targeting:
    // spell effects only affect permanents that existed before the spell was cast.
    for (const eff of effects) { eff.isSpellEffect = true; }
    // For spells, "It"/"that creature" pronouns refer to the spell's target, not
    // the spell card itself. Convert selfTarget effects to targeted effects with
    // a dropdown so the user can select which creature the spell targets.
    for (const eff of effects) {
      if (eff.selfTarget === true && eff.scope === 'targeted') {
        eff.selfTarget = false;
        eff.appliesTo = null;
      }
    }
    for (const eff of effects) {
      if (eff.scope === 'targeted' && !eff.selfTarget && !eff.targetRestriction) {
        // Re-extract target info from the effect's desc to get restriction + maxTargets
        const descLower = (eff.desc || '').toLowerCase();
        // Try to find the original filter text from the desc (before "get"/"have"/"gains" etc.)
        // The restriction fn is already set as appliesTo for global effects, but for targeted
        // effects appliesTo is null. We need to rebuild it from the desc or store it.
        // Since buildAppliesToFromText now returns the info, store it during creation.
        // For effects that didn't go through _applyTargetInfo, build from oracle text.
      }
    }
    // Also scan for maxTargets from any effect that has it and propagate to all from same source
    const maxT = effects.find(e => e.maxTargets)?.maxTargets;
    if (maxT) {
      for (const eff of effects) {
        if (eff.scope === 'targeted' && !eff.selfTarget) {
          eff.maxTargets = maxT;
          if (!eff.targetIds) eff.targetIds = [];
        }
      }
    }
  }

  // --- Tag and sort modal spell effects by mode order ---
  // For modal spells, tag each effect with its modalModeIndex based on which oracle
  // line it was parsed from. Uses _oraclePos (regex match position) when available,
  // falling back to desc-based specificity matching.
  if (_isModalSpell && _modalModeLineMap.size > 0) {
    // Helper: map oracle char position → modal mode index
    function _getModalModeForPos(pos) {
      let adj = pos;
      while (adj < oracle.length && /[.\s;]/.test(oracle[adj])) adj++;
      const lineNum = oracle.substring(0, adj).split('\n').length - 1;
      return _modalModeLineMap.has(lineNum) ? _modalModeLineMap.get(lineNum) : -1;
    }
    const oLines = oracle.split('\n');
    const sortedModes = [..._modalModeLineMap.entries()].sort((a, b) => a[0] - b[0]);
    for (const eff of effects) {
      // Primary: use _oraclePos if available (set by boost/haveAbility/loseAll parsers)
      if (eff._oraclePos !== undefined) {
        const mode = _getModalModeForPos(eff._oraclePos);
        if (mode >= 0) { eff.modalModeIndex = mode; continue; }
      }
      // Fallback: desc-based specificity matching (penalize unmatched line words)
      const effDesc = (eff.desc || '').toLowerCase();
      let bestMode = 0, bestSpec = -Infinity;
      for (const [lineIdx, modeIdx] of sortedModes) {
        const lineText = (oLines[lineIdx] || '').toLowerCase();
        if (!lineText) continue;
        const words = lineText.replace(/[^a-z0-9+\-/ ]/g, '').trim().split(/\s+/).filter(w => w.length > 2);
        const hits = words.filter(w => effDesc.includes(w)).length;
        const misses = words.filter(w => !effDesc.includes(w)).length;
        const spec = hits * 10 - misses;
        if (spec > bestSpec) { bestSpec = spec; bestMode = modeIdx; }
      }
      eff.modalModeIndex = bestMode;
    }
    // Sort effects by modalModeIndex to ensure card text order
    effects.sort((a, b) => (a.modalModeIndex ?? 999) - (b.modalModeIndex ?? 999));
  }

  // --- "exiled with" / "in exile with" ability-granting effects (Layer 6) ---
  // Generic parser for:
  //   "[subject] (has|have) all activated abilities of [all] cards [you own] (in exile with | exiled with) <ref>."
  // Covers Mairsil the Pretender ("...all cards you own in exile with cage counters on them")
  // and Agatha's Soul Cauldron ("creatures you control with +1/+1 counters ... exiled with this card").
  // oracleRaw is already self-ref-normalized (card name → "this card").
  if (!effects.some(e => e.type === EFFECT_TYPE.GAIN_ACTIVATED_FROM_EXILE)) {
    const exiledWithRegex = /^(.+?)\s+(?:has|have)\s+all\s+activated\s+abilities\s+of\s+(?:all\s+|each\s+)?(?:\w+\s+)?cards?\s+(?:you\s+own\s+)?(?:in\s+exile\s+with|exiled\s+with)\s+([^.\n]+)/im;
    const exiledWithMatch = exiledWithRegex.exec(oracleRaw);
    if (exiledWithMatch) {
      const subjectRaw = exiledWithMatch[1].trim().toLowerCase();
      const refRaw = exiledWithMatch[2].trim().toLowerCase();

      // Parse params from the reference clause
      let filterCounter = null;
      let filterTagToSource = false;
      // "cage counters on them" / "cage counter on them" → filterCounter='cage'
      const counterOnThemMatch = refRaw.match(/^([\w+\-/]+(?:\s+[\w+\-/]+)?)\s+counters?\s+on\s+them$/);
      if (counterOnThemMatch) {
        filterCounter = counterOnThemMatch[1].replace(/\s+counters?$/, '').trim();
        filterTagToSource = false;
      } else if (/^(?:it|this card)$/.test(refRaw)) {
        filterTagToSource = true;
      } else {
        // Unrecognized reference — skip
      }

      if (filterCounter !== null || filterTagToSource) {
        // Parse the subject into scope/appliesTo
        let selfTarget = false;
        let scope = 'global';
        let appliesToFn = null;

        if (subjectRaw === 'this card') {
          selfTarget = true;
          scope = 'targeted';
        } else {
          // Normalize for buildAppliesToFromText: "creatures you control with +1/+1 counters"
          // → "creatures you control with a +1/+1 counter on them" so existing filter matches
          let normalizedSubject = subjectRaw
            .replace(/\bwith\s+\+1\/\+1\s+counters(?:\s+on\s+(?:it|them))?\b/, 'with a +1/+1 counter on them')
            .replace(/\bwith\s+([\w+\-/]+)\s+counters(?:\s+on\s+(?:it|them))?\b/, 'with a $1 counter on them');
          const bResult = buildAppliesToFromText(normalizedSubject);
          appliesToFn = bResult ? bResult.fn : null;
        }

        // Build desc
        const descSubject = selfTarget ? 'This card' : subjectRaw.charAt(0).toUpperCase() + subjectRaw.slice(1);
        const descRef = filterCounter ? `cards exiled with ${filterCounter} counters on them` : 'cards exiled with this card';
        const desc = `${descSubject} has all activated abilities of ${descRef}.`;

        effects.push({
          id: `${permanent.id}_eff_${effects.length}`,
          layer: '6',
          type: EFFECT_TYPE.GAIN_ACTIVATED_FROM_EXILE,
          params: { filterCounter, filterTagToSource },
          appliesTo: appliesToFn || null,
          scope,
          selfTarget: selfTarget || undefined,
          affectsSelf: selfTarget || false,
          sourceId: permanent.id,
          sourceName: card.name,
          timestamp: permanent.timestamp,
          desc,
        });
      }
    }
  }

  return _finalizeEffects(effects, isEquipmentSource, permanent, card.oracle_text);
}

/* Helper: detect ADD_ABILITY effects whose ability text itself contains global effect
   patterns (boost or keyword grant), and generate real global effects from them.
   These are conditioned on the source having a targetId (i.e. being equipped/attached).
   Example: Dancer's Chakrams grants "Other commanders you control get +2/+2 and have lifelink"
   as an ability to the equipped creature. This generates a global MODIFY_PT + ADD_ABILITY. */
function _parseGrantedGlobalAbilities(permanent, effects) {
  const sid = permanent.id;
  const ts = permanent.timestamp;
  const cardName = permanent.name;
  const toAdd = [];
  for (const eff of effects) {
    if (eff.type !== EFFECT_TYPE.ADD_ABILITY) continue;
    const abilityText = (eff.params && eff.params.ability) || '';
    // Only process full-sentence abilities (not simple keywords or activated abilities)
    if (!abilityText || abilityText.length < 10 || !/\b(?:get[s]?|have|has|gain[s]?)\b/i.test(abilityText)) continue;
    // Skip activated abilities ("{cost}: effect") — their effect text describes token/spell
    // actions, not continuous static boosts on permanents in play.
    if (/^\{/.test(abilityText)) continue;
    // Check for boost pattern: "filter get[s] +N/+N"
    const boostInAbility = /^(.+?)\s+(?:you (?:control|own)\s+)?get[s]?\s+([+-]\d+)\/([+-]\d+)/i.exec(abilityText);
    if (boostInAbility) {
      const filterText = boostInAbility[1].trim();
      if (!filterReferencesPermanents(filterText)) continue;
      const { fn, desc } = buildAppliesToFromText(filterText);
      const sourceId = eff.sourceId || sid;
      const equippedCond = (state, allStates) => {
        return !!(Battlefield.effects.find(e => e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget && e.targetId));
      };
      toAdd.push({
        id: `${sid}_eff_granted_${toAdd.length}a`,
        layer: '7c', type: EFFECT_TYPE.MODIFY_PT,
        params: { power: parseInt(boostInAbility[2]), toughness: parseInt(boostInAbility[3]) },
        appliesTo: fn, scope: 'global', affectsSelf: false,
        sourceId: sid, sourceName: cardName, timestamp: ts,
        desc: `${filterText} get ${boostInAbility[2]}/${boostInAbility[3]} (from granted ability). ${desc}`,
        asLongAsCondition: equippedCond,
      });
      // Check for "and have [keyword]" continuation
      const afterBoost = abilityText.substring(boostInAbility[0].length);
      const andHaveMatch = /\s+and\s+(?:have|has|gain|gains)\s+(.+)/i.exec(afterBoost);
      if (andHaveMatch) {
        const kwText = andHaveMatch[1].replace(/[,.]$/, '').trim();
        for (const kw of _parseSimpleKeywordList(kwText)) {
          toAdd.push({
            id: `${sid}_eff_granted_${toAdd.length}b`,
            layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
            params: { ability: kw }, appliesTo: fn, scope: 'global', affectsSelf: false,
            sourceId: sid, sourceName: cardName, timestamp: ts,
            desc: `${filterText} have ${kw} (from granted ability). ${desc}`,
            asLongAsCondition: equippedCond,
          });
        }
      }
      continue;
    }
    // Check for pure keyword grant: "filter have/has/gain/gains keyword"
    const haveInAbility = /^(.+?)\s+(?:you (?:control|own)\s+)?(?:have|has|gain|gains)\s+(.+)/i.exec(abilityText);
    if (haveInAbility) {
      const filterText = haveInAbility[1].trim();
      if (!filterReferencesPermanents(filterText)) continue;
      const { fn, desc } = buildAppliesToFromText(filterText);
      const kwText = haveInAbility[2].replace(/[,.]$/, '').trim();
      const grantedKws = _parseSimpleKeywordList(kwText);
      if (grantedKws.length === 0) continue;
      const sourceId = eff.sourceId || sid;
      const equippedCond = (state, allStates) => {
        return !!(Battlefield.effects.find(e => e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget && e.targetId));
      };
      for (const kw of grantedKws) {
        toAdd.push({
          id: `${sid}_eff_granted_${toAdd.length}c`,
          layer: '6', type: EFFECT_TYPE.ADD_ABILITY,
          params: { ability: kw }, appliesTo: fn, scope: 'global', affectsSelf: false,
          sourceId: sid, sourceName: cardName, timestamp: ts,
          desc: `${filterText} have ${kw} (from granted ability). ${desc}`,
          asLongAsCondition: equippedCond,
        });
      }
    }
  }
  for (const e of toAdd) effects.push(e);
}

/* Simple keyword list parser for _parseGrantedGlobalAbilities. */
function _parseSimpleKeywordList(text) {
  const SIMPLE_KWS = new Set([
    'flying','deathtouch','lifelink','trample','vigilance','hexproof','indestructible',
    'menace','reach','first strike','double strike','haste','flash','ward',
    'toxic','wither','infect','undying','persist','changeling','devoid','shadow',
    'fear','intimidate','skulk','prowess',
  ]);
  const results = [];
  let rem = text.trim();
  rem = rem.replace(/"([^"]+)"/g, (_, inner) => { results.push(inner.trim()); return ''; });
  rem = rem.toLowerCase();
  const parts = rem.split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (SIMPLE_KWS.has(part)) {
      results.push(part.charAt(0).toUpperCase() + part.slice(1));
    } else {
      const pm = part.match(/^(\w+(?:\s+\w+)?)\s+(.+)$/);
      if (pm && SIMPLE_KWS.has(pm[1])) {
        const base = pm[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        results.push(`${base} ${pm[2]}`);
      }
    }
  }
  return results;
}

/* Helper: mark equipment effects with requiresCreatureTarget flag,
   and propagate auraRestriction to all targeted effects */
function _finalizeEffects(effects, isEquipmentSource, permanent, oracleText) {
  // "target opponent" — the source picks a single opponent; affects only that opponent's permanents.
  // We mark the permanent + every opponent-control-filtered effect so the UI can prompt the user
  // to pick which opponent and the engine can restrict the effect to that player's permanents.
  const _oracle = (oracleText || '').toLowerCase();
  if (/\btarget\s+opponent\b/.test(_oracle) && permanent) {
    const chosen = permanent._targetOpponentPlayerId || null;
    let tagged = false;
    for (const eff of effects) {
      // Tag global-scope effects (e.g. "each creature target opponent controls...")
      // so the engine restricts them to the chosen opponent's permanents only.
      if (eff.scope === 'global') {
        eff._targetsOpponentPlayer = true;
        if (chosen) eff._targetOpponentPlayerId = chosen;
        tagged = true;
      }
    }
    // Only expose the opponent picker on the permanent itself when there are
    // actual static effects that need it. Triggered/activated abilities whose
    // text contains "target opponent" get their own entry (and their own
    // dropdown) when fired — the source permanent shouldn't show one.
    if (tagged) permanent._targetsOpponentPlayer = true;
  }
  // "Enchant player" — tag global effects so the engine scopes them to the enchanted player.
  if (permanent?._isEnchantPlayer) {
    const chosenPlayer = permanent._enchantedPlayerId || null;
    for (const eff of effects) {
      if (eff.scope === 'global') {
        eff._enchantedPlayerScoped = true;
        if (chosenPlayer) eff._enchantedPlayerId = chosenPlayer;
      }
    }
  }
  if (isEquipmentSource) {
    for (const eff of effects) {
      if (eff.scope === 'targeted' && !eff.selfTarget) {
        eff.requiresCreatureTarget = true;
      }
    }
  }
  // Propagate auraRestriction: prefer an effect that already has it, then fall back to the
  // permanent-level flag (set during "Enchant [type]" parsing, before the main effects loop,
  // so effects added afterward — e.g. from enchantTransformRegex — don't inherit it inline).
  const auraR = effects.find(e => e.auraRestriction)?.auraRestriction
    || permanent?._auraRestriction;
  if (auraR) {
    for (const eff of effects) {
      if (eff.scope === 'targeted' && !eff.selfTarget && !eff.auraRestriction) {
        eff.auraRestriction = auraR;
      }
    }
  }
  // Propagate opponentControlRequired / youControlRequired from permanent-level flags to all
  // targeted non-self effects. Permanent flags are set during enchant-line parsing (which runs
  // before the main effects loop), so we use the permanent as the authoritative source here.
  if (permanent?._opponentControlRequired || effects.some(e => e.opponentControlRequired)) {
    for (const eff of effects) {
      if (eff.scope === 'targeted' && !eff.selfTarget) eff.opponentControlRequired = true;
    }
  }
  if (permanent?._youControlRequired || effects.some(e => e.youControlRequired)) {
    for (const eff of effects) {
      if (eff.scope === 'targeted' && !eff.selfTarget) eff.youControlRequired = true;
    }
  }
  // Stamp ownerId on every effect for multiplayer controller resolution
  if (permanent) {
    const ownerId = permanent.owner || 'player_0';
    for (const eff of effects) {
      if (!eff.ownerId) eff.ownerId = ownerId;
    }
  }
  return effects;
}
/* [END: PARSE] */
