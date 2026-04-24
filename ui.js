/* ============================================================
   MTG Layer Inspector  —  ui.js
   All DOM rendering, event binding, drag-drop, inspector output.
   [KEY: INIT]          —  Boot / bind events
   [KEY: SEARCH-UI]     —  Card search panel (cards + tokens)
   [KEY: BATTLEFIELD-UI]  —  Battlefield rendering
   [KEY: TIMESTAMP-UI]  —  Timestamp ordering panel (drag-drop + action buttons)
   [KEY: INSPECTOR-UI]  —  Layer inspector panel rendering
   [KEY: MODAL-COPY]    —  Copy source selection modal
   [KEY: MODAL-TEXT]    —  Text-change targeting/word-replacement modal
   [KEY: DRAGDROP]      —  Drag and drop logic
   [KEY: HELPERS]       —  Small UI utilities
   ============================================================ */

/* Shared UI helpers */
function _createModalOverlay(id, closeFn) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = id;
  overlay.onclick = (e) => { if (e.target === overlay) closeFn(); };
  return overlay;
}
function _setupDrag(handle, cursor, onMove) {
  handle.classList.add('dragging');
  document.body.style.cursor = cursor;
  document.body.style.userSelect = 'none';
  function onUp() {
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

/* Global toggle: show all effects in the layer vs only those affecting the inspected card */
let _orderShowAll = false;
function toggleOrderShowAll() {
  _orderShowAll = !_orderShowAll;
  // Re-render only the body of each layer section — preserves collapsed state and scroll position
  const result = Battlefield.evaluate();
  if (!result) return;
  const isRulesMode = Battlefield.explanationMode === 'rules';
  const cardName = result.base.name;
  document.querySelectorAll('.insp-section').forEach(section => {
    const badge = section.querySelector('.layer-badge');
    if (!badge) return;
    const layerId = badge.textContent.trim();
    const layer = result.layers.find(l => String(l.id) === layerId);
    if (!layer) return;
    const body = section.querySelector('.insp-section-body');
    if (body) body.innerHTML = renderLayerBody(layer, isRulesMode, cardName);
  });
}

/* Show / hide the dependency-reason popup attached to a '?' button.
   Clicking the same button a second time dismisses the popup (toggle). */
function showDepReasonPopup(btn) {
  const existing = document.getElementById('dep-reason-popup');
  if (existing) {
    const wasThisBtn = existing.dataset.srcBtn === btn.dataset.reason;
    existing.remove();
    if (wasThisBtn) return; // toggle off
  }

  const reason = btn.dataset.reason || '';
  const isLoop = btn.dataset.isLoop === 'true';
  const popup = document.createElement('div');
  popup.id = 'dep-reason-popup';
  popup.className = 'dep-reason-popup';
  popup.dataset.srcBtn = reason;
  popup.innerHTML = `<div class="dep-reason-popup-title">${isLoop ? 'Why is this a dependency loop?' : 'Why is this a dependency?'}</div>
    <div class="dep-reason-popup-text">${escapeHtml(reason)}</div>`;
  document.body.appendChild(popup);

  // Position below the button, aligned to its left edge
  const rect = btn.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  popup.style.left = `${rect.left + scrollX}px`;
  popup.style.top  = `${rect.bottom + scrollY + 4}px`;

  // Clamp to viewport width
  const popupW = 280;
  const maxLeft = document.documentElement.clientWidth - popupW - 8;
  if (rect.left + scrollX > maxLeft) {
    popup.style.left = `${maxLeft + scrollX}px`;
  }

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function _closeDep(e) {
      if (!popup.contains(e.target) && e.target !== btn) {
        popup.remove();
        document.removeEventListener('click', _closeDep);
      }
    });
  }, 0);
}

/* [KEY: INIT] */
document.addEventListener('DOMContentLoaded', () => {
  TypeCatalog.init();
  bindSearchUI();
  bindModeToggle();
  initPanelResize();
  initSectionResize();
  renderAll();
});

function renderAll() {
  renderPlayerTabs();
  renderBattlefield();
  renderTimestampPanel();
  renderCounterPanel();
  renderGameStatePanel();
  renderCommanderPanel();
  renderEmblemPanel();
  renderGraveyardPanel();
  renderInspector();
}

/* Player tab bar: switch between players' boards */
function renderPlayerTabs() {
  const container = document.getElementById('player-tabs');
  if (!container) return;

  container.style.display = 'flex';

  let html = '';
  for (const player of Battlefield.players) {
    const isActive = player.id === Battlefield.activePlayerId;
    html += `<button class="player-tab${isActive ? ' active' : ''}" onclick="switchPlayer('${player.id}')">
      <span class="player-tab-name">${escapeHtml(player.name)}</span>
      <span class="player-tab-life">${player.gameState.currentLife}</span>
      ${player.id !== 'player_0' ? `<span class="player-tab-remove" onclick="event.stopPropagation(); removePlayer('${player.id}')">&times;</span>` : ''}
    </button>`;
  }
  html += `<button class="player-tab player-tab-add" onclick="addPlayerPrompt()">+</button>`;
  container.innerHTML = html;
}

function switchPlayer(playerId) {
  Battlefield.setActivePlayer(playerId);
  renderAll();
}

function addPlayerPrompt() {
  const name = prompt('Enter player name:', 'Player ' + (Battlefield.players.length + 1));
  if (!name) return;
  Battlefield.addPlayer(name);
  renderAll();
}

function removePlayer(playerId) {
  if (!confirm('Remove this player and all their permanents?')) return;
  Battlefield.removePlayer(playerId);
  renderAll();
}

/* Draggable resize handle for left panel width */
function initPanelResize() {
  const handle = document.getElementById('left-resize-handle');
  if (!handle) return;
  const layout = document.querySelector('.app-layout');
  let startX, startWidth;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startWidth = document.querySelector('.left-panel').getBoundingClientRect().width;
    _setupDrag(handle, 'col-resize', (e2) => {
      const newWidth = Math.max(200, Math.min(600, startWidth + (e2.clientX - startX)));
      layout.style.setProperty('--left-panel-width', newWidth + 'px');
    });
  });
}
/* Vertical resize handles between left-panel sections.
   Dragging a handle resizes only the section ABOVE it (growing or shrinking it).
   The left panel scrolls naturally if total content exceeds viewport. */
function initSectionResize() {
  document.querySelectorAll('.section-v-resize').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const aboveSel = handle.dataset.resizeAbove;
      const above = handle.parentElement.querySelector(aboveSel);
      if (!above) return;

      const startY = e.clientY;
      const startAboveH = above.getBoundingClientRect().height;

      _setupDrag(handle, 'row-resize', (e2) => {
        const dy = e2.clientY - startY;
        const newAboveH = Math.max(60, startAboveH + dy);
        above.style.flex = `0 0 ${newAboveH}px`;
      });
    });
  });
}
/* [END: INIT] */

/* [KEY: SEARCH-UI] */
let _lastSearchQuery = '';
let _searchTokensMode = false;

function bindSearchUI() {
  const input = document.getElementById('card-search-input');
  const results = document.getElementById('search-results');
  const tokenToggle = document.getElementById('search-token-toggle');
  let debounce = null;

  if (tokenToggle) {
    tokenToggle.addEventListener('change', () => {
      _searchTokensMode = tokenToggle.checked;
      if (_lastSearchQuery.length >= 2) {
        doSearch(_lastSearchQuery);
      }
    });
  }

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) { results.innerHTML = ''; return; }
      _lastSearchQuery = q;
      doSearch(q);
    }, 350);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounce);
      const q = input.value.trim();
      if (!q) return;
      _lastSearchQuery = q;
      doSearch(q);
    }
  });
}

async function doSearch(query) {
  const results = document.getElementById('search-results');
  results.innerHTML = '<div class="search-loading">Searching…</div>';
  const cards = await searchScryfall(query, { searchTokens: _searchTokensMode });
  renderSearchResults(cards);
}

function renderSearchResults(cards) {
  const results = document.getElementById('search-results');
  if (!cards.length) {
    results.innerHTML = '<div class="search-empty">No cards found</div>';
    return;
  }

  let html = `<div class="search-results-header"><span class="search-count">${cards.length} result${cards.length !== 1 ? 's' : ''}</span><button class="search-close-btn" onclick="closeSearch()" title="Close search results">&#x2715; Close</button></div>`;
  html += cards.map((card, i) => {
    const isToken = card.layout === 'token' || card.layout === 'double_faced_token';
    const imgUri = card.image_uris?.small || (card.card_faces && card.card_faces[0]?.image_uris?.small) || '';
    return `
    <div class="search-result-card" data-idx="${i}">
      <img src="${imgUri}" alt="${escapeAttr(card.name)}" loading="lazy" onerror="this.style.display='none'">
      <div class="search-result-info">
        <strong>${escapeHtml(card.name)}${isToken ? '<span class="search-result-token-badge">TOKEN</span>' : ''}</strong>
        <span class="search-result-type">${escapeHtml(card.type_line || '')}</span>
      </div>
      <button class="btn-add-card" title="Add to battlefield">+</button>
    </div>`;
  }).join('');

  if (hasMoreScryfallResults()) {
    html += `<button class="btn-load-more" id="load-more-btn">Load more results…</button>`;
  }

  results.innerHTML = html;

  results.querySelectorAll('.btn-add-card').forEach((btn) => {
    const idx = parseInt(btn.closest('.search-result-card').dataset.idx);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addCardToBattlefield(cards[idx]);
    });
  });

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async () => {
      loadMoreBtn.textContent = 'Loading…';
      loadMoreBtn.disabled = true;
      const moreCards = await searchScryfall(_lastSearchQuery, { loadMore: true, searchTokens: _searchTokensMode });
      renderSearchResults(moreCards);
    });
  }
}

function addCardToBattlefield(card) {
  const layout = card.layout || '';
  const isRoom = card.card_faces?.some(f => (f.type_line || '').includes('Room'));
  const needsFaceChoice = !isRoom && card.card_faces?.length >= 2 &&
    (CHOOSEABLE_FACE_LAYOUTS.has(layout) || layout === 'modal_dfc');
  if (needsFaceChoice) {
    _showSplitFaceModal(card);
    return;
  }
  _doAddCardToBattlefield(card, {});
}

function _doAddCardToBattlefield(card, opts) {
  const isToken = card.layout === 'token' || card.layout === 'double_faced_token';
  const perm = Battlefield.addPermanent(card, { isToken, ...opts });
  document.getElementById('card-search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  renderAll();
  if (Battlefield.permanents.filter(p => !p.isManualEffect).length === 1) {
    selectPermanent(perm.id);
  }
}

let _pendingSplitCard = null;

function _showSplitFaceModal(card) {
  _pendingSplitCard = card;
  const faces = card.card_faces;
  const faceCards = faces.map((face, i) => `
    <div class="split-face-option" onclick="_confirmSplitFace(${i})">
      <div class="split-face-header">
        <span class="split-face-name">${escapeHtml(face.name || '')}</span>
        <span class="split-face-cost">${escapeHtml(face.mana_cost || '')}</span>
      </div>
      <div class="split-face-type">${escapeHtml(face.type_line || '')}</div>
      ${face.oracle_text ? `<div class="split-face-oracle">${escapeHtml(face.oracle_text).replace(/\n/g, '<br>')}</div>` : ''}
    </div>`).join('<div class="split-face-divider">//</div>');

  const html = `<div class="modal-overlay" id="split-face-modal" onclick="if(event.target===this)_closeSplitFaceModal()">
    <div class="modal split-face-modal-box">
      <div class="modal-header">
        <h3>Choose which half to play — <em>${escapeHtml(card.name)}</em></h3>
        <button class="modal-close" onclick="_closeSplitFaceModal()">\u00D7</button>
      </div>
      <div class="modal-body split-face-body">${faceCards}</div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function _confirmSplitFace(faceIndex) {
  const card = _pendingSplitCard;
  _closeSplitFaceModal();
  if (!card) return;
  _doAddCardToBattlefield(card, { faceIndex });
}

function _closeSplitFaceModal() {
  const modal = document.getElementById('split-face-modal');
  if (modal) modal.remove();
  _pendingSplitCard = null;
}

function switchSplitFace(id) {
  Battlefield.switchSplitFace(id);
  renderAll();
}

function toggleRoomLock(id, faceIndex) {
  Battlefield.toggleRoomLock(id, faceIndex);
  renderAll();
}

/* [KEY: DUAL-OPTIONS-POPUP]  —  Popup for Room / split cards */
let _dualOptionsPermId = null;
let _dualOptionsTempFace = null; // for split cards: temp selected face index

function openDualOptionsPopup(permId) {
  _dualOptionsPermId = permId;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;
  if (perm.isChooseableFace) {
    _dualOptionsTempFace = perm.activeFaceIndex ?? 0;
  }

  let overlay = document.getElementById('dual-options-overlay');
  if (!overlay) {
    overlay = _createModalOverlay('dual-options-overlay', closeDualOptionsPopup);
    document.body.appendChild(overlay);
  }
  overlay.onclick = (e) => { if (e.target === overlay) closeDualOptionsPopup(); };
  overlay.style.display = 'flex';
  _renderDualOptionsContent();
}

function _renderDualOptionsContent() {
  const permId = _dualOptionsPermId;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;
  const overlay = document.getElementById('dual-options-overlay');
  if (!overlay) return;

  const isRoom = perm.isRoom;
  const isChooseable = perm.isChooseableFace;

  let optionsHtml = '';
  let footerHtml = '';

  if (isRoom && perm.roomFaces) {
    const unlocked = perm.roomFaces.filter((_, i) => !perm.roomLocked[i]).length;
    optionsHtml = perm.roomFaces.map((rf, i) => {
      const locked = perm.roomLocked[i];
      return `<div class="dual-opt-entry ${locked ? '' : 'dual-opt-active'}">
        <div class="dual-opt-header">
          <span class="dual-opt-name">${escapeHtml(rf.name)}</span>
          <span class="dual-opt-cost">${escapeHtml(rf.mana_cost)}</span>
          <button class="dual-opt-toggle-btn ${locked ? 'dual-opt-locked' : 'dual-opt-unlocked'}"
            onclick="_dualOptionsRoomToggle(${i})">
            ${locked ? '\uD83D\uDD12 Locked' : '\uD83D\uDD13 Unlocked'}
          </button>
        </div>
        ${rf.oracle_text ? `<div class="dual-opt-oracle">${escapeHtml(rf.oracle_text).replace(/\n/g, '<br>')}</div>` : ''}
      </div>`;
    }).join('');
    // No footer needed for rooms — changes apply immediately
    footerHtml = `<div class="modal-footer">
      <button class="modal-popup-cancel-btn" onclick="closeDualOptionsPopup()">Done</button>
    </div>`;
  } else if (isChooseable && perm.scryfallData?.card_faces) {
    const faces = perm.scryfallData.card_faces;
    optionsHtml = faces.map((f, i) => {
      const isSelected = _dualOptionsTempFace === i;
      const oracleRaw = f.oracle_text || '';
      const typeLine = f.type_line || '';
      return `<div class="dual-opt-entry ${isSelected ? 'dual-opt-active' : ''}" onclick="_dualOptionsFaceSelect(${i})">
        <div class="dual-opt-header">
          <label class="dual-opt-radio-label">
            <input type="radio" name="dual_opt_face" ${isSelected ? 'checked' : ''}
              onchange="_dualOptionsFaceSelect(${i})">
            <span class="dual-opt-name">${escapeHtml(f.name || '')}</span>
          </label>
          <span class="dual-opt-cost">${escapeHtml(f.mana_cost || '')}</span>
        </div>
        ${typeLine ? `<div class="dual-opt-type">${escapeHtml(typeLine)}</div>` : ''}
        ${oracleRaw ? `<div class="dual-opt-oracle">${escapeHtml(oracleRaw).replace(/\n/g, '<br>')}</div>` : ''}
      </div>`;
    }).join('');
    footerHtml = `<div class="modal-footer">
      <button class="modal-popup-apply-btn" onclick="applyDualOptionsPopup()">Apply</button>
      <button class="modal-popup-cancel-btn" onclick="closeDualOptionsPopup()">Cancel</button>
    </div>`;
  }

  const title = isRoom ? `${perm.name} — Rooms` : `${perm.scryfallData?.name || perm.name} — Choose Half`;
  overlay.innerHTML = `
    <div class="modal modal-dual-options">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="modal-close" onclick="closeDualOptionsPopup()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="dual-opt-list">${optionsHtml}</div>
      </div>
      ${footerHtml}
    </div>`;
}

function _dualOptionsRoomToggle(faceIndex) {
  if (!_dualOptionsPermId) return;
  Battlefield.toggleRoomLock(_dualOptionsPermId, faceIndex);
  renderAll();
  _renderDualOptionsContent();
}

function _dualOptionsFaceSelect(faceIndex) {
  _dualOptionsTempFace = faceIndex;
  _renderDualOptionsContent();
}

function applyDualOptionsPopup() {
  if (!_dualOptionsPermId) return;
  const perm = Battlefield.permanents.find(p => p.id === _dualOptionsPermId);
  if (!perm || !perm.isChooseableFace) { closeDualOptionsPopup(); return; }
  if (_dualOptionsTempFace !== null && _dualOptionsTempFace !== perm.activeFaceIndex) {
    Battlefield.switchSplitFace(_dualOptionsPermId, _dualOptionsTempFace);
    renderAll();
  }
  closeDualOptionsPopup();
}

function closeDualOptionsPopup() {
  _dualOptionsPermId = null;
  _dualOptionsTempFace = null;
  const overlay = document.getElementById('dual-options-overlay');
  if (overlay) overlay.style.display = 'none';
}

function closeSearch() {
  document.getElementById('card-search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  _lastSearchQuery = '';
}

function toggleTimestampExpand() {
  const section = document.getElementById('timestamp-section');
  if (!section) return;
  section.classList.toggle('ts-collapsed');
}
/* [END: SEARCH-UI] */

/* [KEY: COMMANDER-UI] */
let _commanderSearchOpen = false;

function renderCommanderPanel() {
  const panel = document.getElementById('commander-panel');
  if (!panel) return;

  let html = '';

  // Show current commanders
  if (Battlefield.commanders.length > 0) {
    html += '<div class="commander-list">';
    Battlefield.commanders.forEach((c, i) => {
      const onBf = c.linkedPermId
        ? Battlefield.permanents.some(p => p.id === c.linkedPermId)
        : Battlefield.permanents.some(p => !p.isManualEffect && p.name === c.name);
      // Detect eminence abilities for commanders in the command zone only
      // (on the battlefield, eminence works as a normal parsed ability)
      let eminenceHtml = '';
      if (!onBf) {
        const face = c.card.card_faces ? c.card.card_faces[0] : c.card;
        const oracleText = face.oracle_text || c.card.oracle_text || '';
        const abilities = extractAbilities(oracleText);
        const eminenceAbilities = [];
        for (let ai = 0; ai < abilities.length; ai++) {
          if (/in the command zone or on the battlefield/i.test(abilities[ai])) {
            eminenceAbilities.push({ index: ai, text: abilities[ai] });
          }
        }
        if (eminenceAbilities.length > 0) {
          const sourceId = 'cmdzone_' + i;
          for (const ea of eminenceAbilities) {
            const strippedText = ea.text.replace(/^[^{\n.;"—\u2014]+[\u2014—]\s*/g, '');
            const triggers = Battlefield.extractTriggeredAbilities([strippedText]);
            const activated = Battlefield.extractActivatedAbilities([strippedText]);
            const tooltipText = escapeAttr(ea.text);
            if (triggers.length > 0) {
              const t = triggers[0];
              const count = Battlefield.getTriggerCount(sourceId, ea.index);
              const atLimit = t.triggerLimit !== null && count >= t.triggerLimit;
              eminenceHtml += `<div class="commander-eminence-row">
                <span class="commander-eminence-badge" data-tooltip="${tooltipText}">Eminence</span>
                <button class="btn btn-sm btn-commander-trigger${atLimit ? ' disabled' : ''}"
                  onclick="fireCommandZoneAbility(${i}, ${ea.index}, 'trigger')"
                  ${atLimit ? 'disabled' : ''}>Trigger</button>
              </div>`;
            } else if (activated.length > 0) {
              const a = activated[0];
              const count = Battlefield.getActivateCount(sourceId, ea.index);
              const atLimit = a.activateLimit !== null && count >= a.activateLimit;
              eminenceHtml += `<div class="commander-eminence-row">
                <span class="commander-eminence-badge" data-tooltip="${tooltipText}">Eminence</span>
                <button class="btn btn-sm btn-commander-trigger${atLimit ? ' disabled' : ''}"
                  onclick="fireCommandZoneAbility(${i}, ${ea.index}, 'activated')"
                  ${atLimit ? 'disabled' : ''}>Activate</button>
              </div>`;
            } else {
              eminenceHtml += `<div class="commander-eminence-row">
                <span class="commander-eminence-badge" data-tooltip="${tooltipText}">Eminence</span>
                <span class="commander-eminence-static">Static</span>
              </div>`;
            }
          }
        }
      }
      html += `<div class="commander-card">
        ${c.imageUri ? `<img src="${c.imageUri}" class="commander-img" alt="${escapeAttr(c.name)}">` : ''}
        <div class="commander-info">
          <span class="commander-name">${escapeHtml(c.name)}</span>
          <div class="commander-actions">
            ${!onBf ? `<button class="btn btn-sm btn-commander-add" onclick="putCommanderOnBattlefield(${i})" title="Put onto battlefield">⬇ Battlefield</button>` : '<span class="commander-on-bf">On battlefield</span>'}
            <button class="btn btn-sm btn-commander-remove" onclick="removeCommander(${i})" title="Remove">✕</button>
          </div>
          <div class="commander-cast-row">
            <span class="commander-cast-label">Times cast:</span>
            <button class="gs-btn" onclick="modifyCommanderCast(${i}, -1)">−</button>
            <span class="commander-cast-value">${c.castCount || 0}</span>
            <button class="gs-btn" onclick="modifyCommanderCast(${i}, 1)">+</button>
          </div>
          ${eminenceHtml ? `<div class="commander-eminence">${eminenceHtml}</div>` : ''}
        </div>
      </div>`;
    });
    html += '</div>';
  }

  // Set commander button / search
  if (_commanderSearchOpen) {
    html += `<div class="commander-search">
      <input type="text" id="commander-search-input" placeholder="Search legendary creature…" autocomplete="off">
      <div id="commander-search-results"></div>
      <button class="btn btn-sm" onclick="closeCommanderSearch()">Cancel</button>
    </div>`;
  } else {
    html += `<button class="btn btn-sm btn-set-commander" onclick="openCommanderSearch()">+ Set Commander</button>`;
  }

  panel.innerHTML = html;

  // Bind search if open
  if (_commanderSearchOpen) {
    const input = document.getElementById('commander-search-input');
    if (input) {
      let debounce = null;
      input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => doCommanderSearch(input.value.trim()), 300);
      });
      input.focus();
    }
  }
}

function openCommanderSearch() {
  _commanderSearchOpen = true;
  renderCommanderPanel();
}

function closeCommanderSearch() {
  _commanderSearchOpen = false;
  renderCommanderPanel();
}

async function doCommanderSearch(query) {
  const resultsDiv = document.getElementById('commander-search-results');
  if (!resultsDiv) return;
  if (query.length < 2) { resultsDiv.innerHTML = ''; return; }

  // Search scryfall for legendary creatures OR cards that can be commanders
  const scryfallQuery = `${query} (t:legendary t:creature OR o:"can be your commander")`;
  try {
    const cards = await searchScryfall(scryfallQuery);
    _commanderSearchResults = cards || [];
    resultsDiv.innerHTML = _commanderSearchResults.slice(0, 10).map((card, i) => {
      const face = card.card_faces ? card.card_faces[0] : card;
      const name = face.name || card.name;
      const imgUri = face.image_uris?.small || card.image_uris?.small || '';
      return `<div class="commander-search-result" onclick="selectCommander(${i})">
        ${imgUri ? `<img src="${imgUri}" class="commander-result-img">` : ''}
        <span>${escapeHtml(name)}</span>
      </div>`;
    }).join('') || '<div class="dim" style="padding:4px;">No results</div>';
  } catch (e) {
    resultsDiv.innerHTML = '<div class="dim" style="padding:4px;">Search error</div>';
  }
}

let _commanderSearchResults = [];

function selectCommander(index) {
  const card = _commanderSearchResults[index];
  if (!card) return;
  Battlefield.addCommander(card);
  _commanderSearchOpen = false;
  renderCommanderPanel();
}

function putCommanderOnBattlefield(index) {
  const commander = Battlefield.commanders[index];
  if (!commander) return;
  const isToken = commander.card.layout === 'token' || commander.card.layout === 'double_faced_token';
  const perm = Battlefield.addPermanent(commander.card, { isToken });
  commander.linkedPermId = perm.id;
  document.getElementById('card-search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  renderAll();
  if (Battlefield.permanents.filter(p => !p.isManualEffect).length === 1) {
    selectPermanent(perm.id);
  }
}

function removeCommander(index) {
  Battlefield.removeCommander(index);
  renderCommanderPanel();
}

function modifyCommanderCast(index, delta) {
  const c = Battlefield.commanders[index];
  if (!c) return;
  c.castCount = Math.max(0, (c.castCount || 0) + delta);
  renderCommanderPanel();
}

/* Fire an eminence ability from a commander in the command zone. */
function fireCommandZoneAbility(commanderIdx, abilityIdx, kind) {
  const commander = Battlefield.commanders[commanderIdx];
  if (!commander) return;
  const face = commander.card.card_faces ? commander.card.card_faces[0] : commander.card;
  const oracleText = face.oracle_text || commander.card.oracle_text || '';
  const abilities = extractAbilities(oracleText);
  const abilityText = abilities[abilityIdx];
  if (!abilityText) return;
  // Strip ability word prefix (e.g. "Eminence — ") so extract functions see "Whenever..."
  const strippedText = abilityText.replace(/^[^{\n.;"—\u2014]+[\u2014—]\s*/g, '');
  const extractFn = kind === 'trigger'
    ? Battlefield.extractTriggeredAbilities
    : Battlefield.extractActivatedAbilities;
  const extracted = extractFn([strippedText]);
  if (extracted.length === 0) return;
  const effectText = extracted[0].effectText;
  Battlefield.addCommandZoneAbility(commanderIdx, abilityIdx, effectText, abilityText, kind);
  renderAll();
}
/* [END: COMMANDER-UI] */

/* [KEY: EMBLEM-UI] */
let _emblemSearchOpen = false;
let _emblemSearchResults = [];

function renderEmblemPanel() {
  const panel = document.getElementById('emblem-panel');
  if (!panel) return;

  let html = '';

  if (Battlefield.emblems.length > 0) {
    html += '<div class="emblem-list">';
    Battlefield.emblems.forEach((e, i) => {
      const previewText = e.card.oracle_text || (e.card.card_faces?.[0]?.oracle_text) || '';
      html += `<div class="emblem-card">
        ${e.imageUri ? `<img src="${e.imageUri}" class="emblem-img" alt="${escapeAttr(e.name)}">` : '<div class="emblem-img-placeholder">🏅</div>'}
        <div class="emblem-info">
          <span class="emblem-name">${escapeHtml(e.name)}</span>
          ${previewText ? `<div class="emblem-oracle">${escapeHtml(previewText).replace(/\n/g, '<br>')}</div>` : ''}
          <div class="emblem-actions">
            <button class="btn btn-sm btn-emblem-remove" onclick="removeEmblemUI(${i})" title="Remove emblem">✕ Remove</button>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (_emblemSearchOpen) {
    html += `<div class="emblem-search">
      <input type="text" id="emblem-search-input" placeholder="Search emblem by planeswalker name…" autocomplete="off">
      <div id="emblem-search-results"></div>
      <button class="btn btn-sm" onclick="closeEmblemSearch()">Cancel</button>
    </div>`;
  } else {
    html += `<button class="btn btn-sm btn-set-commander" onclick="openEmblemSearch()">+ Add Emblem</button>`;
  }

  panel.innerHTML = html;

  if (_emblemSearchOpen) {
    const input = document.getElementById('emblem-search-input');
    if (input) {
      let debounce = null;
      input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => doEmblemSearch(input.value.trim()), 300);
      });
      input.focus();
    }
  }
}

function openEmblemSearch() {
  _emblemSearchOpen = true;
  renderEmblemPanel();
}

function closeEmblemSearch() {
  _emblemSearchOpen = false;
  renderEmblemPanel();
}

async function doEmblemSearch(query) {
  const resultsDiv = document.getElementById('emblem-search-results');
  if (!resultsDiv) return;
  if (query.length < 2) { resultsDiv.innerHTML = ''; return; }

  const scryfallQuery = `t:emblem ${query}`;
  try {
    const cards = await searchScryfall(scryfallQuery);
    _emblemSearchResults = cards || [];
    resultsDiv.innerHTML = _emblemSearchResults.slice(0, 10).map((card, i) => {
      const imgUri = card.image_uris?.small || '';
      return `<div class="commander-search-result" onclick="selectEmblem(${i})">
        ${imgUri ? `<img src="${imgUri}" class="commander-result-img">` : ''}
        <span>${escapeHtml(card.name)}</span>
      </div>`;
    }).join('') || '<div class="dim" style="padding:4px;">No results</div>';
  } catch (e) {
    resultsDiv.innerHTML = '<div class="dim" style="padding:4px;">Search error</div>';
  }
}

function selectEmblem(index) {
  const card = _emblemSearchResults[index];
  if (!card) return;
  Battlefield.addEmblem(card);
  _emblemSearchOpen = false;
  renderAll();
}

function removeEmblemUI(index) {
  Battlefield.removeEmblem(index);
  renderAll();
}
/* [END: EMBLEM-UI] */

/* [KEY: BATTLEFIELD-UI] */
function renderBattlefield() {
  const container = document.getElementById('battlefield');
  // Compute final states first so Layer 2 control-changing effects are reflected in the display
  const finalStates = Battlefield.getAllFinalStates();
  // Show permanents whose computed controller (post-layers) is the active player.
  // Fall back to p.owner (not p.controller) so a permanent with no active Layer 2
  // effects always appears on its owner's board.
  const perms = Battlefield.permanents.filter(p => {
    if (p.isEmblem) return false; // emblems live in command zone, not battlefield
    const ctrl = finalStates.get(p.id)?.controller || p.owner || 'player_0';
    return ctrl === Battlefield.activePlayerId;
  });

  if (perms.length === 0) {
    container.innerHTML = `<div class="bf-empty">
      <div class="bf-empty-icon">+</div>
      <div>Search and add cards to begin inspection</div>
    </div>`;
    return;
  }

  // Detect legend-rule-exempt permanent types from oracle text
  const legendExemptTypes = new Set();
  for (const [, st] of finalStates) {
    const txt = st.oracleText || '';
    const m = txt.match(/the\s+[\u201c"\'"]legend rule[\u201d"\'"]?\s+doesn'?t\s+apply\s+to\s+(.+)/i);
    if (m) {
      const raw = m[1].replace(/you control\.?/i, '').replace(/[.,;]+$/, '').trim().toLowerCase();
      const typeWords = { creatures: 'Creature', permanents: 'Permanent', artifacts: 'Artifact',
        enchantments: 'Enchantment', lands: 'Land', planeswalkers: 'Planeswalker',
        creature: 'Creature', permanent: 'Permanent', artifact: 'Artifact',
        enchantment: 'Enchantment', land: 'Land', planeswalker: 'Planeswalker' };
      for (const [word, type] of Object.entries(typeWords)) {
        if (raw.includes(word)) legendExemptTypes.add(type);
      }
      if (/\btokens?\b/i.test(raw)) legendExemptTypes.add('Token');
    }
  }

  const legendaryByName = new Map();
  for (const p of perms) {
    // Legend rule only checks final states, and a mutate stack counts as ONE card.
    // Only the top card of a mutate stack participates in the legend rule check.
    const myStack = Battlefield.getStack(p.id);
    if (myStack && myStack.length >= 2 && myStack[0] !== p.id) continue;
    const st = finalStates.get(p.id);
    if (!st) continue;
    if (st.supertypes && st.supertypes.includes('Legendary')) {
      const isExempt = (st.types && st.types.some(t => legendExemptTypes.has(t)))
        || legendExemptTypes.has('Permanent')
        || (legendExemptTypes.has('Token') && p.isToken);
      if (!isExempt) {
        const nm = st.name;
        if (!legendaryByName.has(nm)) legendaryByName.set(nm, []);
        legendaryByName.get(nm).push(p.id);
      }
    }
  }
  const legendViolationIds = new Set();
  for (const [, ids] of legendaryByName) {
    if (ids.length >= 2) ids.forEach(id => legendViolationIds.add(id));
  }

  const zeroToughnessIds = new Set();
  for (const p of perms) {
    const st = finalStates.get(p.id);
    if (!st) continue;
    if (st.types && st.types.includes('Creature') && st.toughness !== null && st.toughness !== undefined && st.toughness <= 0) {
      zeroToughnessIds.add(p.id);
    }
  }

  const noLoyaltyIds = new Set();
  for (const p of perms) {
    const st = finalStates.get(p.id);
    if (!st) continue;
    if (st.types && st.types.includes('Planeswalker')) {
      const loyaltyCount = (p.counters && p.counters['loyalty']) || 0;
      if (loyaltyCount <= 0) noLoyaltyIds.add(p.id);
    }
  }

  const sagaFinishedIds = new Set();
  for (const p of perms) {
    const st = finalStates.get(p.id);
    if (!st) continue;
    if (st.subtypes && st.subtypes.includes('Saga') && p._sagaMaxChapter) {
      const loreCount = (p.counters && p.counters['lore']) || 0;
      if (loreCount >= p._sagaMaxChapter) sagaFinishedIds.add(p.id);
    }
  }

  // CR 704.5p: If a creature is attached to an object or player, it becomes unattached.
  // Detect equipment that is currently a creature AND has a target assigned (is equipping).
  // Reconfigure cards are exempt because they lose creature type when equipping.
  const creatureAttachedIds = new Set();
  for (const p of perms) {
    const st = finalStates.get(p.id);
    if (!st) continue;
    if (!st.types || !st.types.includes('Creature')) continue;
    // Check if this permanent is currently equipping something (has targeted effects with a target set)
    const isEquipping = Battlefield.effects.some(e =>
      e.sourceId === p.id && e.scope === 'targeted' && !e.selfTarget && e.targetId && e.requiresCreatureTarget);
    if (isEquipping) {
      creatureAttachedIds.add(p.id);
      // Auto-unattach: clear the target so it's no longer equipping
      Battlefield.effects.forEach(e => {
        if (e.sourceId === p.id && e.scope === 'targeted' && !e.selfTarget) {
          e.targetId = null;
        }
      });
      _showSBAToast(`"${p.name}" is a creature and was attached to another object. As a state-based action (rule 704.5p), it has become unattached and remains on the battlefield.`);
      // Deferred re-render so UI reflects the unattached state
      if (!renderBattlefield._sbaRerender) {
        renderBattlefield._sbaRerender = true;
        setTimeout(() => { renderBattlefield._sbaRerender = false; renderAll(); }, 0);
      }
    }
  }

  const sbaIds = new Set([...legendViolationIds, ...zeroToughnessIds, ...noLoyaltyIds, ...sagaFinishedIds, ...creatureAttachedIds]);

  // Determine which perms are in mutate stacks
  const stackedIds = new Set();
  for (const stack of Battlefield.mutateStacks) {
    for (const id of stack) stackedIds.add(id);
  }

  // Build render order: groups (stacks) and standalone cards, maintaining timestamp order
  // For stacks, we render them as a group at the position of the earliest card in the stack.
  const permById = new Map(perms.map(p => [p.id, p]));
  const rendered = new Set();
  const renderItems = []; // each item: { type: 'stack'|'card', stack?, perm? }

  // Group Auras/Equipment/Bestow under their attached target so they visually sit behind the
  // target card in a fan. Attacher perms are removed from the main grid.
  const attachersByTarget = new Map();
  const attacherIds = new Set();
  for (const p of perms) {
    const fs = finalStates.get(p.id);
    const subs = fs ? (fs.subtypes || []) : (p.printedSubtypes || []);
    const isAura = subs.includes('Aura');
    const isEquipment = subs.includes('Equipment')
      || Battlefield.effects.some(e => e.sourceId === p.id && e.requiresCreatureTarget);
    if (!isAura && !isEquipment) continue;
    // Bestow cards track their target separately; fall back to regular effect targetId
    let targetId = p.hasBestow ? (Battlefield.getBestowTarget(p.id) || null) : null;
    if (!targetId) {
      const eff = Battlefield.effects.find(e =>
        e.sourceId === p.id && e.scope === 'targeted' && !e.selfTarget && e.targetId);
      targetId = eff ? eff.targetId : null;
    }
    if (!targetId) continue;
    if (!permById.has(targetId)) continue;
    if (targetId === p.id) continue;
    if (!attachersByTarget.has(targetId)) attachersByTarget.set(targetId, []);
    attachersByTarget.get(targetId).push(p);
    attacherIds.add(p.id);
  }
  for (const arr of attachersByTarget.values()) arr.sort((a, b) => b.timestamp - a.timestamp);

  // Ghost attachers: aura/equipment/bestow cards controlled by OTHER players that enchant/equip
  // a permanent on the active player's board. Shown faded as a visual reminder; clicking them
  // opens their Layer Inspector (they are still physically owned by another player).
  const ghostAttachersByTarget = new Map();
  for (const p of Battlefield.permanents) {
    if (p.isEmblem) continue;
    const ctrl = finalStates.get(p.id)?.controller || p.owner || 'player_0';
    if (ctrl === Battlefield.activePlayerId) continue;
    const fs = finalStates.get(p.id);
    const subs = fs ? (fs.subtypes || []) : (p.printedSubtypes || []);
    const isAura = subs.includes('Aura');
    const isEquipment = subs.includes('Equipment')
      || Battlefield.effects.some(e => e.sourceId === p.id && e.requiresCreatureTarget);
    if (!isAura && !isEquipment) continue;
    let targetId = p.hasBestow ? (Battlefield.getBestowTarget(p.id) || null) : null;
    if (!targetId) {
      const eff = Battlefield.effects.find(e =>
        e.sourceId === p.id && e.scope === 'targeted' && !e.selfTarget && e.targetId);
      targetId = eff ? eff.targetId : null;
    }
    if (!targetId) continue;
    if (!permById.has(targetId)) continue;
    if (targetId === p.id) continue;
    if (!ghostAttachersByTarget.has(targetId)) ghostAttachersByTarget.set(targetId, []);
    ghostAttachersByTarget.get(targetId).push(p);
  }
  for (const arr of ghostAttachersByTarget.values()) arr.sort((a, b) => b.timestamp - a.timestamp);

  // Sort perms by timestamp ascending: earlier cards on left, later on right
  const sortedPerms = [...perms].sort((a, b) => a.timestamp - b.timestamp);

  for (const p of sortedPerms) {
    if (rendered.has(p.id)) continue;
    if (attacherIds.has(p.id)) { rendered.add(p.id); continue; }
    const stack = Battlefield.getStack(p.id);
    const stackPerms = stack ? stack.map(id => permById.get(id)).filter(Boolean) : null;
    if (stackPerms && stackPerms.length >= 2) {
      // Only render the stack once (at the position of the first stack member we encounter)
      renderItems.push({ type: 'stack', stack, stackPerms });
      for (const sp of stackPerms) rendered.add(sp.id);
    } else {
      renderItems.push({ type: 'card', perm: p });
      rendered.add(p.id);
    }
  }

  function renderCardDiv(p) {
    const isSelected = p.id === Battlefield.inspectedId;
    const _cardFs = finalStates.get(p.id);
    const isCreature = _cardFs ? _cardFs.types.includes('Creature') : p.printedTypes.includes('Creature');
    const hasSBA = sbaIds.has(p.id);
    const sbaReasons = [];
    if (legendViolationIds.has(p.id)) sbaReasons.push('legend');
    if (zeroToughnessIds.has(p.id)) sbaReasons.push('toughness');
    if (noLoyaltyIds.has(p.id)) sbaReasons.push('loyalty');
    if (sagaFinishedIds.has(p.id)) sbaReasons.push('saga');
    if (creatureAttachedIds.has(p.id)) sbaReasons.push('creature-attached');
    // Use final computed state for type line and P/T when available
    const _supertypes = _cardFs ? (_cardFs.supertypes || []) : p.printedSupertypes;
    const _types = _cardFs ? (_cardFs.types || []) : p.printedTypes;
    const _subtypes = _cardFs ? (_cardFs.subtypes || []) : p.printedSubtypes;
    const _power = _cardFs && _cardFs.power !== null && _cardFs.power !== undefined ? _cardFs.power : p.printedPower;
    const _toughness = _cardFs && _cardFs.toughness !== null && _cardFs.toughness !== undefined ? _cardFs.toughness : p.printedToughness;
    return `
    <div class="bf-card ${isSelected ? 'bf-card-selected' : ''} ${hasSBA ? 'bf-card-sba' : ''} ${p.isManualEffect ? 'bf-card-spell' : ''} ${p.tapped ? 'bf-card-tapped' : ''} ${p.isSideways ? 'bf-card-sideways' : ''} ${p.isFaceDown ? 'bf-card-facedown' : ''}" data-id="${p.id}" data-sba="${sbaReasons.join(',')}" onclick="selectPermanent('${p.id}')">
      ${p.imageUri ? `<img src="${p.imageUri}" alt="${escapeAttr(p.name)}" class="bf-card-img">` : ''}
      ${p.label ? `<div class="bf-card-label" aria-hidden="true">${escapeHtml(p.label)}</div>` : ''}
      <div class="bf-card-overlay"></div>
      <button class="bf-card-remove" onclick="event.stopPropagation(); removePermanent('${p.id}')" title="Remove"> \u2014 </button>
      ${!p.isManualEffect ? `<button class="bf-card-tap" onclick="event.stopPropagation(); toggleTapped('${p.id}')" title="${p.tapped ? 'Untap' : 'Tap'}">\u21BB</button>` : ''}
      ${p.isTransformable ? `<button class="bf-card-flip" onclick="event.stopPropagation(); flipCard('${p.id}')" title="Transform / Flip">\u21C4</button>` : ''}
      ${p.isChooseableFace ? `<button class="bf-card-flip" onclick="event.stopPropagation(); openDualOptionsPopup('${p.id}')" title="Choose half">\u21C4</button>` : ''}
      ${!p.isManualEffect && !p.isFaceDown ? `<button class="bf-card-facedown-btn" onclick="event.stopPropagation(); openFaceDownMenu(event, '${p.id}')" title="Turn face down">\u29C9</button>` : ''}
      ${p.isFaceDown ? `<button class="bf-card-facedown-btn bf-card-faceup-btn" onclick="event.stopPropagation(); turnFaceUp('${p.id}')" title="Turn face up">\u25CE</button>` : ''}
      ${isCreature && !p.isManualEffect ? `<button class="bf-card-attack-btn${(p.traits||[]).includes('Attacking') ? ' bf-card-attack-btn-active' : ''}" onclick="event.stopPropagation(); toggleAttacking('${p.id}')" title="${(p.traits||[]).includes('Attacking') ? 'Remove Attacking' : 'Mark as Attacking'}">\u2694</button>` : ''}
      ${isCreature && !p.isManualEffect ? `<button class="bf-card-block-btn${(p.traits||[]).includes('Blocking') ? ' bf-card-block-btn-active' : ''}" onclick="event.stopPropagation(); toggleBlocking('${p.id}')" title="${(p.traits||[]).includes('Blocking') ? 'Remove Blocking' : 'Mark as Blocking'}">\ud83d\udee1</button>` : ''}
      ${p.isRoom && p.roomFaces ? (() => {
        const unlockedCount = p.roomFaces.filter((_, i) => !p.roomLocked[i]).length;
        return `<button class="bf-room-btn bf-room-popup-btn" style="bottom:18px"
          onclick="event.stopPropagation(); openDualOptionsPopup('${p.id}')"
          title="Room options — ${unlockedCount}/${p.roomFaces.length} unlocked"
        >\uD83D\uDEAA ${unlockedCount}/${p.roomFaces.length}</button>`;
      })() : ''}
      ${p.isToken ? '<div class="bf-card-token-badge">TOKEN</div>' : ''}
      ${p.isManualEffect && !p.isTriggeredAbility && !p.isActivatedAbility ? '<div class="bf-card-spell-badge">SPELL</div>' : ''}
      ${p.isTriggeredAbility ? '<div class="bf-card-spell-badge bf-card-trigger-badge">TRIGGER</div>' : ''}
      ${p._isCrewEffect ? '<div class="bf-card-spell-badge bf-card-crew-badge">CREWED</div>' : p._isSaddleEffect ? '<div class="bf-card-spell-badge bf-card-saddle-badge">SADDLED</div>' : p.isActivatedAbility ? '<div class="bf-card-spell-badge bf-card-activated-badge">ACTIVATED</div>' : ''}
      ${Battlefield.isCommander(p.id) ? '<div class="bf-card-commander-badge">CMDR</div>' : ''}
      ${p.classLevel ? `<div class="bf-card-class-badge">LVL ${p.classLevel}</div>` : ''}
      ${p.isFaceDown ? `<div class="bf-card-facedown-badge">${p.faceDownMode === 'cloak' ? 'CLOAK' : p.faceDownMode === 'manifest' ? 'MANIFEST' : 'MORPH'}</div>` : ''}
      ${hasSBA ? `<div class="bf-card-sba-badge" title="State-based action required">\u26a0</div>` : ''}
      ${renderBfCounterBadges(p)}
    </div>`;
  }

  function wrapWithAttachers(targetPerm, cardHtml) {
    const attachers = attachersByTarget.get(targetPerm.id) || [];
    const ghosts = ghostAttachersByTarget.get(targetPerm.id) || [];
    if (!attachers.length && !ghosts.length) return cardHtml;
    const total = attachers.length + ghosts.length;
    const fan = [
      ...attachers.map((ap, i) =>
        `<div class="bf-attached" style="--i:${i}; --n:${total};">${wrapWithAttachers(ap, renderCardDiv(ap))}</div>`),
      ...ghosts.map((ap, i) =>
        `<div class="bf-attached" style="--i:${attachers.length + i}; --n:${total};">${wrapWithAttachers(ap, renderGhostCardDiv(ap))}</div>`)
    ].join('');
    return `<div class="bf-attach-group"><div class="bf-attach-target">${cardHtml}</div><div class="bf-attached-fan">${fan}</div></div>`;
  }

  function renderGhostCardDiv(p) {
    const isSelected = p.id === Battlefield.inspectedId;
    const _cardFs = finalStates.get(p.id);
    const ctrl = _cardFs?.controller || p.owner || 'player_0';
    const ownerPlayer = Battlefield.getPlayer(ctrl);
    const ownerLabel = ownerPlayer ? ownerPlayer.name : ctrl;
    return `<div class="bf-card bf-card-ghost ${isSelected ? 'bf-card-selected' : ''}"
      data-id="${p.id}"
      title="Controlled by ${escapeAttr(ownerLabel)} — click to inspect"
      onclick="selectPermanent('${p.id}')">
      ${p.imageUri ? `<img src="${p.imageUri}" alt="${escapeAttr(p.name)}" class="bf-card-img">` : ''}
      <div class="bf-card-overlay"></div>
      <div class="bf-card-ghost-badge">${escapeHtml(ownerLabel)}</div>
      ${p.label ? `<div class="bf-card-label" aria-hidden="true">${escapeHtml(p.label)}</div>` : ''}
      ${renderBfCounterBadges(p)}
    </div>`;
  }

  container.innerHTML = renderItems.map(item => {
    if (item.type === 'card') {
      return wrapWithAttachers(item.perm, renderCardDiv(item.perm));
    } else {
      // Mutate stack: render as a grouped container with stacked cards (top first)
      const topPerm = item.stackPerms[0];
      const topFs = finalStates.get(topPerm ? topPerm.id : '');
      const mergedName = topFs ? topFs.name : (topPerm ? topPerm.name : '');
      const isAnySelected = item.stackPerms.some(sp => sp.id === Battlefield.inspectedId);
      return `<div class="bf-mutate-stack ${isAnySelected ? 'bf-mutate-stack-selected' : ''}">
        <div class="bf-mutate-stack-label">Mutate: ${escapeHtml(mergedName)}</div>
        <div class="bf-mutate-stack-cards">
          ${item.stackPerms.map((sp, idx) => {
            const isNonTop = idx !== 0;
            const stackLabel = idx === 0 ? '<div class="bf-mutate-pos-badge">TOP</div>'
              : (idx === item.stackPerms.length - 1 ? '<div class="bf-mutate-pos-badge bf-mutate-pos-bottom">BTM</div>' : '<div class="bf-mutate-pos-badge bf-mutate-pos-mid">MID</div>');
            // Non-top cards: add grayed class and block click
            let cardHtml = renderCardDiv(sp).replace('class="bf-card', `class="bf-card bf-card-in-stack${isNonTop ? ' bf-card-stack-non-top' : ''}`);
            if (isNonTop) {
              // Remove onclick from the top-level div for non-top cards
              cardHtml = cardHtml.replace(/onclick="selectPermanent\('[^']*'\)"/, 'onclick="event.stopPropagation()"');
            }
            return cardHtml + stackLabel;
          }).join('')}
        </div>
      </div>`;
    }
  }).join('');
}


function hasTargetedEffects(permId) {
  return Battlefield.effects.some(e => e.sourceId === permId && e.scope === 'targeted' && !e.selfTarget && !e._isCounterEffect);
}

function renderBfCounterBadges(perm) {
  const entries = Object.entries(perm.counters || {}).filter(([,v]) => v > 0);
  if (!entries.length) return '';

  function isPT(type) {
    return type === '+1/+1' || type === '-1/-1' ||
      /^\+\d+\/\+\d+$/.test(type) || /^-\d+\/-\d+$/.test(type);
  }
  function badgeClass(type) {
    if (type === '+1/+1') return 'bf-counter-plus';
    if (type === '-1/-1') return 'bf-counter-minus';
    if (/^\+\d+\/\+\d+$/.test(type)) return 'bf-counter-plus';
    if (/^-\d+\/-\d+$/.test(type)) return 'bf-counter-minus';
    return 'bf-counter-default';
  }

  const ptEntries = entries.filter(([t]) => isPT(t));
  const abilityEntries = entries.filter(([t]) => !isPT(t));

  const makeBadge = ([t, c]) => {
    const cls = badgeClass(t);
    const label = c > 1 ? `${c}× ${t}` : t;
    return `<span class="bf-counter-badge ${cls}" title="${c}× ${t} counter${c !== 1 ? 's' : ''}">${escapeHtml(label)}</span>`;
  };

  const left = abilityEntries.length
    ? `<div class="bf-card-counters-left">${abilityEntries.map(makeBadge).join('')}</div>` : '';
  const right = ptEntries.length
    ? `<div class="bf-card-counters-right">${ptEntries.map(makeBadge).join('')}</div>` : '';

  return left + right;
}

function selectPermanent(id) {
  Battlefield.inspectedId = id;
  renderAll();

  // Show SBA warnings after render
  const card = document.querySelector(`.bf-card[data-id="${id}"]`);
  if (card && card.dataset.sba) {
    const reasons = card.dataset.sba.split(',').filter(Boolean);
    if (reasons.length) {
      const perm = Battlefield.permanents.find(p => p.id === id);
      const msgs = [];
      if (reasons.includes('legend')) {
        msgs.push(`There are two or more legendary permanents named "${perm ? perm.name : '?'}" on the battlefield. As a state-based action, you must put all but one into the graveyard. Note: this does NOT count as sacrificing.`);
      }
      if (reasons.includes('toughness')) {
        msgs.push('This creature has 0 or less toughness. As a state-based action, it must be put into the graveyard.');
      }
      if (reasons.includes('loyalty')) {
        msgs.push('This planeswalker has no loyalty counters on it. As a state-based action, it must be put into the graveyard.');
      }
      if (reasons.includes('saga')) {
        msgs.push('This Saga has lore counters equal to or greater than its final chapter number. As a state-based action (rule 714.4), it must be sacrificed.');
      }
      if (reasons.includes('creature-attached')) {
        msgs.push('This permanent is a creature and was attached to another object. As a state-based action (rule 704.5p), it has become unattached and remains on the battlefield.');
      }
      // Use a non-blocking notification (small toast at top of battlefield)
      _showSBAToast(msgs.join('\n\n'));
    }
  }
}

function _showSBAToast(msg) {
  let toast = document.getElementById('sba-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sba-toast';
    toast.className = 'sba-toast';
    document.getElementById('battlefield').parentElement.prepend(toast);
  }
  toast.textContent = msg;
  toast.classList.add('sba-toast-visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('sba-toast-visible'), 8000);
}

function removePermanent(id) {
  Battlefield.removePermanent(id);
  renderAll();
}

function toggleTapped(id) {
  Battlefield.toggleTapped(id);
  renderAll();
}

function toggleAttacking(id) {
  Battlefield.toggleAttacking(id);
  renderAll();
}

function toggleBlocking(id) {
  Battlefield.toggleBlocking(id);
  renderAll();
}

function flipCard(id) {
  Battlefield.flipCard(id);
  renderAll();
}

/* Face-down menu for Morph/Cloak/Manifest */
function openFaceDownMenu(event, permId) {
  // Remove existing menu
  const existing = document.getElementById('facedown-menu');
  if (existing) existing.remove();
  const menu = document.createElement('div');
  menu.id = 'facedown-menu';
  menu.className = 'facedown-popup-menu';
  menu.innerHTML = `
    <div class="facedown-menu-title">Turn Face Down</div>
    <button class="facedown-menu-btn" onclick="setFaceDown('${permId}', 'morph')">
      <strong>Morph</strong><br><span class="facedown-menu-desc">2/2 creature, no abilities</span>
    </button>
    <button class="facedown-menu-btn" onclick="setFaceDown('${permId}', 'cloak')">
      <strong>Cloak</strong><br><span class="facedown-menu-desc">2/2 creature, Ward 2</span>
    </button>
    <button class="facedown-menu-btn" onclick="setFaceDown('${permId}', 'manifest')">
      <strong>Manifest</strong><br><span class="facedown-menu-desc">2/2 creature, no abilities</span>
    </button>
  `;
  document.body.appendChild(menu);
  // Position near the button
  const rect = event.target.getBoundingClientRect();
  menu.style.top = (rect.bottom + 4) + 'px';
  menu.style.left = rect.left + 'px';
  // Close on outside click
  const close = (e) => {
    if (!menu.contains(e.target) && e.target !== event.target) {
      menu.remove();
      document.removeEventListener('click', close, true);
    }
  };
  setTimeout(() => document.addEventListener('click', close, true), 0);
}

function setFaceDown(permId, mode) {
  const menu = document.getElementById('facedown-menu');
  if (menu) menu.remove();
  Battlefield.setFaceDown(permId, mode);
}

function turnFaceUp(permId) {
  Battlefield.setFaceDown(permId); // toggles back to face up
}
/* [END: BATTLEFIELD-UI] */

/* [KEY: TIMESTAMP-UI] */
function renderTimestampPanel() {
  const container = document.getElementById('timestamp-list');
  const allItems = Battlefield.permanents.slice().sort((a, b) => a.timestamp - b.timestamp);

  if (allItems.length === 0) {
    container.innerHTML = '<div class="ts-empty">No permanents yet</div>';
    return;
  }

  // Compute final states for all real permanents to extract triggered/activated abilities
  const finalStates = Battlefield.getAllFinalStates();

  container.innerHTML = allItems.map((p, i) => {
    const effInfo = getEffectInfo(p.id);
    let textBadgeLabel = 'text';
    if (effInfo.textChangeType === 'creature_type') textBadgeLabel = 'type-text';
    else if (effInfo.textChangeType === 'color_global') textBadgeLabel = 'color-all';
    else if (effInfo.textChangeType === 'exchange_text') textBadgeLabel = 'exchange';
    else if (effInfo.textChangeType === 'volrath_text') textBadgeLabel = 'volrath';
    const stack = Battlefield.getStack(p.id);
    const stackPresent = stack ? stack.filter(id => Battlefield.permanents.some(pp => pp.id === id)) : null;
    const inStack = stackPresent && stackPresent.length >= 2;
    const isTop = inStack && stackPresent[0] === p.id;
    const stackPos = inStack ? (isTop ? 'top' : (stackPresent[stackPresent.length-1] === p.id ? 'bottom' : 'middle')) : null;
    const mutateBadge = inStack
      ? `<span class="ts-badge ts-badge-mutate" title="Mutate stack position: ${stackPos}">mutate: ${stackPos}</span>`
      : '';
    const bestowTarget = Battlefield.getBestowTarget(p.id);
    const isBestowActive = !!bestowTarget;
    const bestowTargetPerm = bestowTarget ? Battlefield.permanents.find(pp => pp.id === bestowTarget) : null;
    const bestowBadge = isBestowActive
      ? `<span class="ts-badge ts-badge-bestow" title="Enchanting: ${bestowTargetPerm ? bestowTargetPerm.name : bestowTarget}">aura</span>`
      : '';
    const showBestowBtn = p.hasBestow && !p.isManualEffect && !_isNonTokenCopyCard(p);
    const showMutateBtn = p.hasMutate && !p.isManualEffect && !_isNonTokenCopyCard(p);

    // --- Triggered/activated ability badge for spell-like entries ---
    let abilityBadge = '';
    if (p.isTriggeredAbility) abilityBadge = '<span class="ts-badge ts-badge-trigger">triggered ability</span>';
    else if (p._isCrewEffect) abilityBadge = '<span class="ts-badge ts-badge-crew">crewed</span>';
    else if (p._isSaddleEffect) abilityBadge = '<span class="ts-badge ts-badge-saddle">saddled</span>';
    else if (p.isActivatedAbility) abilityBadge = '<span class="ts-badge ts-badge-activated">activated ability</span>';

    // --- Triggered/activated ability buttons for real permanents ---
    let abilityButtonsHtml = '';
    let hasAnyParsableAbility = false;
    if (!p.isManualEffect) {
      const fState = finalStates.get(p.id);
      const permEffects = Battlefield.effects.filter(e => e.sourceId === p.id);
      if (fState) {
        const triggers = Battlefield.extractTriggeredAbilities(fState.abilities || []);
        const activated = Battlefield.extractActivatedAbilities(fState.abilities || []);
        if (triggers.length || activated.length) {
          hasAnyParsableAbility = true;
          const total = triggers.length + activated.length;
          abilityButtonsHtml = `<div class="ts-ability-buttons">
            <button class="ts-ability-btn ts-ability-popup-btn"
              onclick="event.stopPropagation(); openAbilityPopup('${escapeAttr(p.id)}')"
              title="View triggered & activated abilities">Abilities (${total})</button>
          </div>`;
        }
      }
      if (permEffects.length > 0) hasAnyParsableAbility = true;
    } else {
      hasAnyParsableAbility = true; // manual effects are always "parsed"
    }

    // --- Remove button for triggered/activated ability entries ---
    const showAbilityRemove = p.isTriggeredAbility || p.isActivatedAbility;

    return `
    <div class="ts-item ${p.isManualEffect ? 'ts-item-manual' : ''}${p.isTriggeredAbility ? ' ts-item-trigger' : ''}${p.isActivatedAbility ? ' ts-item-activated' : ''}${p.isEmblem ? ' ts-item-emblem' : ''}" draggable="true" data-id="${p.id}">
      <span class="ts-handle">⠿</span>
      <span class="ts-number">${i + 1}.</span>
      <span class="ts-name">${escapeHtml(p.name)}${p.label ? ` <span class="ts-name-label">${escapeHtml(p.label)}</span>` : ''}${Battlefield.players.length > 1 && p.owner ? ` <span class="ts-player-badge">${escapeHtml(Battlefield.getPlayerName(p.owner))}</span>` : ''}</span>
      ${p.isEmblem ? '<span class="ts-badge ts-badge-emblem">emblem</span>' : ''}
      ${p.isManualEffect && !p.isTriggeredAbility && !p.isActivatedAbility ? '<span class="ts-badge ts-badge-spell">spell</span>' : ''}
      ${abilityBadge}
      ${effInfo.hasCopy ? '<span class="ts-badge ts-badge-copy">copy</span>' : ''}
      ${effInfo.hasText ? '<span class="ts-badge ts-badge-text">' + textBadgeLabel + '</span>' : ''}
      ${effInfo.hasExchangeControl ? '<span class="ts-badge ts-badge-exchange">exchange</span>' : ''}
      ${mutateBadge}
      ${bestowBadge}
      ${effInfo.hasCopyCard ? renderCopyTargetSelect(p.id) : ''}
      ${effInfo.hasModalTargets ? renderModalModeTargets(p.id, effInfo.activeModalTargetedModes) : effInfo.hasTargeted ? (effInfo.maxTargets > 1 ? renderMultiTargetSelect(p.id, effInfo.maxTargets) : renderTargetSelect(p.id)) : ''}
      ${p._targetsOpponentPlayer ? renderTargetOpponentSelect(p.id) : ''}
      ${p._targetsChosenPlayer ? renderTargetPlayerSelect(p.id) : ''}
      <div class="ts-actions">
        ${effInfo.hasCopyToken ? `<button class="ts-action-btn configure" onclick="event.stopPropagation(); openCopyModal('${p.id}')" title="Select copy source">copy</button>` : ''}
        ${effInfo.hasText && effInfo.textChangeType !== 'volrath_text' ? `<button class="ts-action-btn configure" onclick="event.stopPropagation(); openTextChangeModal('${p.id}')" title="Configure text change">edit</button>` : ''}
        ${effInfo.hasExchangeControl ? `<button class="ts-action-btn configure" onclick="event.stopPropagation(); openExchangeControlModal('${p.id}')" title="Configure exchange control">exchange</button>` : ''}
        ${showMutateBtn ? `<button class="ts-action-btn configure mutate-btn${inStack ? ' mutate-active' : ''}" onclick="event.stopPropagation(); openMutateModal('${p.id}')" title="Mutate">mutate</button>` : ''}
        ${inStack ? `<button class="ts-action-btn remove-mutate-btn" onclick="event.stopPropagation(); removeMutate('${p.id}')" title="Remove from mutate stack">✕</button>` : ''}
        ${showBestowBtn ? `<button class="ts-action-btn configure bestow-btn${isBestowActive ? ' bestow-active' : ''}" onclick="event.stopPropagation(); openBestowModal('${p.id}')" title="Bestow">bestow</button>` : ''}
        ${isBestowActive ? `<button class="ts-action-btn remove-mutate-btn" onclick="event.stopPropagation(); removeBestow('${p.id}')" title="Remove bestow">✕</button>` : ''}
        ${showAbilityRemove ? `<button class="ts-action-btn remove-mutate-btn" onclick="event.stopPropagation(); removeAbilityEffect('${p.id}')" title="Remove">✕</button>` : ''}
      </div>
      ${effInfo.hasCDA ? renderCDAInput(p) : ''}
      ${p.hasXValue ? renderXValueInput(p) : ''}
      ${p.needsChosenCardName ? renderChosenCardNameInput(p) : ''}
      ${p.needsChosenCreatureType ? renderChosenCreatureTypeInput(p) : ''}
      ${p.needsChosenLandType ? renderChosenLandTypeInput(p) : ''}
      ${p.needsChosenColor ? renderChosenColorInput(p) : ''}
      ${p.isModalSpell && p.modalModeTexts && p.modalModeTexts.length > 0 ? renderModalModeToggles(p.id) : ''}
      ${abilityButtonsHtml}
      ${!hasAnyParsableAbility ? '<div class="ts-no-parse-label">no parsable abilities</div>' : ''}
    </div>`;
  }).join('');

  initDragDrop(container);
}

/* --- Triggered / Activated Ability Handlers --- */

/* Fire a triggered ability: look up the ability from the final computed state,
   create a pseudo-permanent in the timeline, re-render. */
function fireTriggeredAbility(permId, abilityIdx) {
  const finalStates = Battlefield.getAllFinalStates();
  const fState = finalStates.get(permId);
  if (!fState) return;
  const triggers = Battlefield.extractTriggeredAbilities(fState.abilities || []);
  const t = triggers.find(tr => tr.index === abilityIdx);
  if (!t) return;
  // Check trigger limit
  if (t.triggerLimit !== null) {
    const count = Battlefield.getTriggerCount(permId, abilityIdx);
    if (count >= t.triggerLimit) return;
  }
  // Check "if [condition]," prefix — if the condition is evaluable and false, do nothing.
  const ifCondMatch = t.effectText.match(/^if\s+([^,]+),\s*/i);
  if (ifCondMatch) {
    const condResult = _evaluateTriggerCondition(ifCondMatch[1].trim(), fState);
    if (condResult === false) return;
  }
  const pseudo = Battlefield.addTriggeredAbility(permId, abilityIdx, t.effectText, t.fullText);
  // Exchange of Words: inject an exchange_text effect onto the trigger pseudo-permanent
  // so its inspector panel shows the "Edit" button for selecting targets.
  if (pseudo && /exchange the text boxes/i.test(t.effectText)) {
    pseudo._exchangeSourcePermId = permId;
    const exchEff = {
      id: pseudo.id + '_exchange',
      sourceId: pseudo.id,
      sourceName: pseudo.name,
      type: EFFECT_TYPE.TEXT_CHANGE,
      layer: '3',
      params: { changeType: 'exchange_text', exchangeTargetA: null, exchangeTargetB: null },
      scope: 'targeted',
      timestamp: pseudo.timestamp,
      _exchangeSourcePermId: permId,
    };
    Battlefield.effects.push(exchEff);
  }
  // Exchange control triggered abilities (Gilded Drake, Volatile Stormdrake, Confusion in the Ranks):
  // if parseCardEffects didn't produce an exchange CONTROL effect (e.g. "exchange control of those
  // permanents" pronoun pattern), inject one manually onto the pseudo-permanent.
  if (pseudo && /\bexchange control of\b/i.test(t.effectText)) {
    const hasExchCtrl = Battlefield.effects.some(e =>
      e.sourceId === pseudo.id && e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl);
    const isSelfExch = /\bthis\s+(?:creature|artifact|enchantment|permanent|card)\s+and\b/i.test(t.effectText);
    if (!hasExchCtrl) {
      const exchCtrlEff = {
        id: pseudo.id + '_exchctrl',
        sourceId: pseudo.id,
        sourceName: pseudo.name,
        type: EFFECT_TYPE.CONTROL,
        layer: '2',
        params: {
          exchangeControl: true,
          exchangeMode: isSelfExch ? 'self_and_target' : 'two_targets',
          exchangeTargetA: isSelfExch ? permId : null,
          exchangeTargetB: null,
          snapshotControllerA: null,
          snapshotControllerB: null,
          exchangeSelfId: isSelfExch ? permId : null,
          shareTypeRequired: /\bshare[s]?\s+a\s+(?:permanent|card)\s+type\b/i.test(t.effectText),
          differentPlayersRequired: false,
        },
        scope: 'targeted',
        timestamp: pseudo.timestamp,
        opponentControlRequired: /\bopponent(?:'?s?)?\s+controls?\b/i.test(t.effectText) || /\byou\s+neither\s+own\s+nor\s+control\b/i.test(t.effectText),
        neitherOwnNorControl: /\byou\s+neither\s+own\s+nor\s+control\b/i.test(t.effectText),
      };
      Battlefield.effects.push(exchCtrlEff);
    } else if (isSelfExch) {
      // If regex-parsed effect exists but needs the real source permanent ID for self-exchange
      Battlefield.effects.forEach(e => {
        if (e.sourceId === pseudo.id && e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl
            && e.params.exchangeMode === 'self_and_target') {
          e.params.exchangeSelfId = permId;
          e.params.exchangeTargetA = permId;
        }
      });
    }
  }
  renderAll();
}

/* Fire an activated ability: look up the ability from the final computed state,
   create a pseudo-permanent in the timeline, re-render. */
function fireActivatedAbility(permId, abilityIdx) {
  const finalStates = Battlefield.getAllFinalStates();
  const fState = finalStates.get(permId);
  if (!fState) return;
  const activated = Battlefield.extractActivatedAbilities(fState.abilities || []);
  const a = activated.find(ac => ac.index === abilityIdx);
  if (!a) return;
  // Check activation limit
  if (a.activateLimit !== null) {
    const count = Battlefield.getActivateCount(permId, abilityIdx);
    if (count >= a.activateLimit) return;
  }
  // Monstrosity: if the creature isn't already monstrous, add the Monstrous
  // trait. The +1/+1 counters are left for the user to place manually so they
  // can manage counter state themselves. No pseudo-permanent is created.
  if (a.isMonstrosity) {
    const perm = Battlefield.permanents.find(p => p.id === permId);
    if (!perm) return;
    if (!perm.traits) perm.traits = [];
    if (perm.traits.includes('Monstrous')) return;
    perm.traits.push('Monstrous');
    renderAll();
    return;
  }
  // Crew: add Crewed trait + create a battlefield effect entry (like other activated abilities).
  if (a.isCrew) {
    const perm = Battlefield.permanents.find(p => p.id === permId);
    if (!perm) return;
    if (!perm.traits) perm.traits = [];
    if (!perm.traits.includes('Crewed')) perm.traits.push('Crewed');
    const pseudo = Battlefield.addActivatedAbility(permId, abilityIdx, '', a.fullText);
    if (pseudo) {
      pseudo.name = (perm.label ? `${perm.name} ${perm.label}` : perm.name) + ' (crewed)';
      pseudo._isCrewEffect = true;
    }
    renderAll();
    return;
  }
  // Saddle: add Saddled trait + create a battlefield effect entry.
  if (a.isSaddle) {
    const perm = Battlefield.permanents.find(p => p.id === permId);
    if (!perm) return;
    if (!perm.traits) perm.traits = [];
    if (!perm.traits.includes('Saddled')) perm.traits.push('Saddled');
    const pseudo = Battlefield.addActivatedAbility(permId, abilityIdx, '', a.fullText);
    if (pseudo) {
      pseudo.name = (perm.label ? `${perm.name} ${perm.label}` : perm.name) + ' (saddled)';
      pseudo._isSaddleEffect = true;
    }
    renderAll();
    return;
  }
  // If the ability has split "or" options, let the user choose which to apply.
  if (a.options && a.options.length >= 2) {
    openActivateOptionsPopup(permId, abilityIdx, a);
    return;
  }
  Battlefield.addActivatedAbility(permId, abilityIdx, a.effectText, a.fullText);
  renderAll();
}

function openActivateOptionsPopup(permId, abilityIdx, a) {
  let overlay = document.getElementById('activate-options-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'activate-options-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  const optsHtml = a.options.map((opt, i) => `
    <button class="ability-popup-fire-btn ability-popup-activated-fire" style="display:block;width:100%;margin:6px 0;text-align:left;"
      onclick="_chooseActivateOption('${escapeAttr(permId)}', ${abilityIdx}, ${i})">${escapeHtml(opt)}</button>
  `).join('');
  overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div class="modal ability-popup">
      <div class="modal-header">
        <h3>Choose one</h3>
        <button class="modal-close" onclick="document.getElementById('activate-options-overlay').style.display='none'">&times;</button>
      </div>
      <div class="modal-body">
        <div style="color:var(--text-dim);margin-bottom:8px;font-size:13px;">${escapeHtml(a.fullText)}</div>
        ${optsHtml}
      </div>
    </div>`;
}

function _chooseActivateOption(permId, abilityIdx, optionIdx) {
  const finalStates = Battlefield.getAllFinalStates();
  const fState = finalStates.get(permId);
  if (!fState) return;
  const activated = Battlefield.extractActivatedAbilities(fState.abilities || []);
  const a = activated.find(ac => ac.index === abilityIdx);
  if (!a || !a.options) return;
  const chosen = a.options[optionIdx];
  Battlefield.addActivatedAbility(permId, abilityIdx, chosen, a.fullText);
  const _ovl = document.getElementById('activate-options-overlay');
  if (_ovl) _ovl.style.display = 'none';
  // Also refresh the parent ability popup if open.
  if (_abilityPopupPermId) _updateAbilityPopupContent();
  renderAll();
}

/* Remove a triggered or activated ability pseudo-permanent from the timeline. */
function removeAbilityEffect(permId) {
  Battlefield.removePermanent(permId);
  renderAll();
}

/* Reset trigger counts for a new turn. */
function resetTriggerCounts() {
  Battlefield.resetTriggerCounts();
  renderAll();
}

/* ---- Triggered / Activated Ability Popup ---- */
let _abilityPopupPermId = null;

function openAbilityPopup(permId) {
  _abilityPopupPermId = permId;
  let overlay = document.getElementById('ability-popup-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ability-popup-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.onclick = (e) => { if (e.target === overlay) closeAbilityPopup(); };
  overlay.style.display = 'flex';
  _updateAbilityPopupContent();
}

function _updateAbilityPopupContent() {
  const permId = _abilityPopupPermId;
  if (!permId) return;
  const overlay = document.getElementById('ability-popup-overlay');
  if (!overlay) return;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) { closeAbilityPopup(); return; }

  const finalStates = Battlefield.getAllFinalStates();
  const fState = finalStates.get(permId);
  if (!fState) { closeAbilityPopup(); return; }

  const triggers = Battlefield.extractTriggeredAbilities(fState.abilities || []);
  const activated = Battlefield.extractActivatedAbilities(fState.abilities || []);

  let rowsHtml = '';

  if (triggers.length) {
    rowsHtml += '<div class="ability-popup-section-label">Triggered Abilities</div>';
    for (const t of triggers) {
      const count = Battlefield.getTriggerCount(permId, t.index);
      const atLimit = t.triggerLimit !== null && count >= t.triggerLimit;
      const limitBadge = t.triggerLimit !== null
        ? `<span class="ability-popup-limit${atLimit ? ' at-limit' : ''}">${count}/${t.triggerLimit}</span>`
        : '';
      rowsHtml += `<div class="ability-popup-row">
        <div class="ability-popup-text">
          <span class="ability-popup-type-badge ability-popup-trigger-badge">Triggered Ability</span>
          ${limitBadge}
          <span class="ability-popup-ability-text">${escapeHtml(t.fullText)}</span>
        </div>
        <button class="ability-popup-fire-btn ability-popup-trigger-fire${atLimit ? ' disabled' : ''}"
          onclick="_fireTriggeredFromPopup('${escapeAttr(permId)}', ${t.index})"
          ${atLimit ? 'disabled' : ''}>Trigger</button>
      </div>`;
    }
  }

  if (activated.length) {
    rowsHtml += '<div class="ability-popup-section-label">Activated Abilities</div>';
    for (const a of activated) {
      const count = Battlefield.getActivateCount(permId, a.index);
      const isMonstrous = !!(perm.traits && perm.traits.includes('Monstrous'));
      const atLimit = (a.activateLimit !== null && count >= a.activateLimit)
        || (a.isMonstrosity && isMonstrous);
      const limitBadge = a.activateLimit !== null
        ? `<span class="ability-popup-limit${atLimit ? ' at-limit' : ''}">${count}/${a.activateLimit}</span>`
        : '';
      rowsHtml += `<div class="ability-popup-row">
        <div class="ability-popup-text">
          <span class="ability-popup-type-badge ability-popup-activated-badge">Activated Ability</span>
          ${limitBadge}
          <span class="ability-popup-ability-text">${escapeHtml(a.fullText)}</span>
        </div>
        <button class="ability-popup-fire-btn ability-popup-activated-fire${atLimit ? ' disabled' : ''}"
          onclick="_fireActivatedFromPopup('${escapeAttr(permId)}', ${a.index})"
          ${atLimit ? 'disabled' : ''}>Activate</button>
      </div>`;
    }
  }

  overlay.innerHTML = `
    <div class="modal ability-popup">
      <div class="modal-header">
        <h3>${escapeHtml(perm.name)} — Abilities</h3>
        <button class="modal-close" onclick="closeAbilityPopup()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="ability-popup-rows">${rowsHtml}</div>
      </div>
      <div class="modal-footer">
        <button class="modal-popup-cancel-btn" onclick="closeAbilityPopup()">Close</button>
      </div>
    </div>`;
}

function _fireTriggeredFromPopup(permId, abilityIdx) {
  fireTriggeredAbility(permId, abilityIdx);
  // Re-render popup content to update counts/limits
  _updateAbilityPopupContent();
}

function _fireActivatedFromPopup(permId, abilityIdx) {
  fireActivatedAbility(permId, abilityIdx);
  _updateAbilityPopupContent();
}

function closeAbilityPopup() {
  _abilityPopupPermId = null;
  const overlay = document.getElementById('ability-popup-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* Render a summary line + button to open the modal mode selection popup.
   Shows active mode count and opens the full popup on click. */
function renderModalModeToggles(sourceId) {
  const perm = Battlefield.permanents.find(p => p.id === sourceId);
  if (!perm) return '';
  const maxActive = perm.modalMaxActive ?? Infinity;
  const repeatable = !!perm.modalRepeatable;
  const effs = Battlefield.effects.filter(e => e.sourceId === sourceId && e.modalModeIndex !== undefined);
  // Count active modes (including unparseable selections)
  let activeCount = 0;
  if (repeatable && perm.modalModeCounts) {
    activeCount = Object.values(perm.modalModeCounts).reduce((s, v) => s + v, 0);
    if (perm._unparseableCounts) activeCount += Object.values(perm._unparseableCounts).reduce((s, v) => s + v, 0);
  } else {
    const activeIndices = new Set();
    for (const e of effs) { if (!e.disabled) activeIndices.add(e.modalModeIndex); }
    activeCount = activeIndices.size;
    if (perm._unparseableActive) activeCount += perm._unparseableActive.size;
  }
  const maxLabel = maxActive === Infinity ? '∞' : maxActive;
  const label = repeatable ? `Modes: ${activeCount}/${maxLabel}` : `Modes: ${activeCount}/${maxLabel}`;
  return `<div class="modal-mode-summary" onclick="event.stopPropagation()">
    <button class="ts-action-btn configure modal-mode-btn" onclick="event.stopPropagation(); openModalModePopup('${escapeAttr(sourceId)}')" title="Configure modes">⚙️ ${escapeHtml(label)}</button>
  </div>`;
}

/* ---- Modal Mode Selection Popup ---- */
let _modalModePopupPermId = null;
// For repeatable: temp counts during popup editing
let _modalModeTempCounts = {};
// For non-repeatable: temp active set during popup editing
let _modalModeTempActive = new Set();
// Track unparseable mode selections (count toward N but no game effect)
let _modalModeUnparseableActive = new Set();
// For repeatable unparseable
let _modalModeUnparseableCounts = {};
// Snapshot of initial state for change detection
let _modalModeInitialState = null;

function _snapshotModalState(repeatable) {
  if (repeatable) {
    return JSON.stringify({ c: _modalModeTempCounts, u: _modalModeUnparseableCounts });
  }
  return JSON.stringify({ a: [..._modalModeTempActive].sort(), u: [..._modalModeUnparseableActive].sort() });
}

function _modalStateChanged() {
  if (!_modalModePopupPermId || !_modalModeInitialState) return false;
  const perm = Battlefield.permanents.find(p => p.id === _modalModePopupPermId);
  if (!perm) return false;
  return _snapshotModalState(!!perm.modalRepeatable) !== _modalModeInitialState;
}

function openModalModePopup(permId) {
  _modalModePopupPermId = permId;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;
  const repeatable = !!perm.modalRepeatable;
  const effs = Battlefield.effects.filter(e => e.sourceId === permId && e.modalModeIndex !== undefined);

  // Initialize temp state from current state
  if (repeatable) {
    _modalModeTempCounts = {};
    _modalModeUnparseableCounts = {};
    if (perm.modalModeCounts) {
      for (const [k, v] of Object.entries(perm.modalModeCounts)) _modalModeTempCounts[parseInt(k)] = v;
    } else {
      for (const e of effs) {
        if (!e.disabled && _modalModeTempCounts[e.modalModeIndex] === undefined) {
          _modalModeTempCounts[e.modalModeIndex] = 1;
        }
      }
    }
    if (perm._unparseableCounts) {
      for (const [k, v] of Object.entries(perm._unparseableCounts)) _modalModeUnparseableCounts[parseInt(k)] = v;
    }
  } else {
    _modalModeTempActive = new Set();
    _modalModeUnparseableActive = new Set();
    for (const e of effs) {
      if (!e.disabled) _modalModeTempActive.add(e.modalModeIndex);
    }
    if (perm._unparseableActive) {
      for (const idx of perm._unparseableActive) _modalModeUnparseableActive.add(idx);
    }
  }

  // Snapshot initial state for change detection
  _modalModeInitialState = _snapshotModalState(repeatable);

  // Create overlay once, then populate inner content
  let overlay = document.getElementById('modal-mode-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-mode-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.onclick = (e) => { if (e.target === overlay) closeModalModePopup(); };
  overlay.style.display = 'flex';
  // Build the full shell once
  overlay.innerHTML = `
    <div class="modal modal-mode-popup">
      <div class="modal-header">
        <h3 id="modal-mode-title"></h3>
        <span class="modal-popup-count-badge" id="modal-mode-badge"></span>
        <button class="modal-close" onclick="closeModalModePopup()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-popup-modes" id="modal-mode-rows"></div>
      </div>
      <div class="modal-footer">
        <button class="modal-popup-apply-btn" id="modal-mode-apply-btn" onclick="applyModalModePopup()" disabled>Apply</button>
        <button class="modal-popup-cancel-btn" onclick="closeModalModePopup()">Cancel</button>
      </div>
    </div>`;
  _updateModalModeContent();
}

function _updateModalModeContent() {
  const permId = _modalModePopupPermId;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;
  const maxActive = perm.modalMaxActive ?? Infinity;
  const minActive = perm.modalMinActive ?? 0;
  const repeatable = !!perm.modalRepeatable;
  const modeTexts = perm.modalModeTexts || [];
  const effs = Battlefield.effects.filter(e => e.sourceId === permId && e.modalModeIndex !== undefined);
  const parsedModeIndices = new Set();
  for (const e of effs) { if (e.modalModeIndex !== undefined) parsedModeIndices.add(e.modalModeIndex); }

  // Calculate total active count (parsed + unparseable)
  let totalActive = 0;
  if (repeatable) {
    for (const v of Object.values(_modalModeTempCounts)) totalActive += v;
    for (const v of Object.values(_modalModeUnparseableCounts)) totalActive += v;
  } else {
    totalActive = _modalModeTempActive.size + _modalModeUnparseableActive.size;
  }

  const maxLabel = maxActive === Infinity ? '∞' : maxActive;
  const constraintLabel = maxActive === 1 ? 'Choose one'
    : minActive === 1 && maxActive === 2 ? 'Choose one or both'
    : minActive === 1 ? 'Choose one or more'
    : `Choose ${maxLabel}`;
  const repeatLabel = repeatable ? ' (may repeat)' : '';

  // Build mode rows
  const rows = modeTexts.map((text, modeIdx) => {
    const isParsed = parsedModeIndices.has(modeIdx);
    const truncText = text.length > 120 ? text.substring(0, 117) + '...' : text;

    if (repeatable) {
      const counts = isParsed ? _modalModeTempCounts : _modalModeUnparseableCounts;
      const count = counts[modeIdx] ?? 0;
      const canInc = maxActive === Infinity || totalActive < maxActive;
      const canDec = count > 0;
      return `<div class="modal-popup-mode ${!isParsed ? 'modal-popup-mode-unparsed' : ''}" title="${escapeAttr(text)}">
        <div class="modal-popup-mode-text">${escapeHtml(truncText)}${!isParsed ? ' <span class="modal-popup-unparsed-tag">(no game effect)</span>' : ''}</div>
        <div class="modal-popup-counter">
          <button class="modal-popup-counter-btn" ${!canDec ? 'disabled' : ''} onclick="event.stopPropagation(); _modalModeAdjust(${modeIdx}, -1, ${!isParsed})">−</button>
          <span class="modal-popup-counter-val">${count}</span>
          <button class="modal-popup-counter-btn" ${!canInc ? 'disabled' : ''} onclick="event.stopPropagation(); _modalModeAdjust(${modeIdx}, 1, ${!isParsed})">+</button>
        </div>
      </div>`;
    } else {
      // Checkbox/radio for non-repeatable
      const isActive = isParsed ? _modalModeTempActive.has(modeIdx) : _modalModeUnparseableActive.has(modeIdx);
      const isRadio = (maxActive === 1);
      const canActivate = isActive || maxActive === Infinity || totalActive < maxActive;
      const inputType = isRadio ? 'radio' : 'checkbox';
      const radioName = isRadio ? `name="modal_popup_radio"` : '';
      return `<div class="modal-popup-mode ${!isParsed ? 'modal-popup-mode-unparsed' : ''} ${isActive ? 'modal-popup-mode-active' : ''}" title="${escapeAttr(text)}">
        <label class="modal-popup-mode-label">
          <input type="${inputType}" ${radioName} ${isActive ? 'checked' : ''} ${!canActivate && !isActive ? 'disabled' : ''}
            onchange="event.stopPropagation(); _modalModeToggle(${modeIdx}, this.checked, ${!isParsed}, ${isRadio})">
          <span class="modal-popup-mode-text">${escapeHtml(truncText)}${!isParsed ? ' <span class="modal-popup-unparsed-tag">(no game effect)</span>' : ''}</span>
        </label>
      </div>`;
    }
  }).join('');

  // Update only the inner content (no overlay recreation = no flicker)
  const titleEl = document.getElementById('modal-mode-title');
  const badgeEl = document.getElementById('modal-mode-badge');
  const rowsEl = document.getElementById('modal-mode-rows');
  const applyBtn = document.getElementById('modal-mode-apply-btn');
  if (titleEl) titleEl.textContent = `${perm.name} — ${constraintLabel}${repeatLabel}`;
  if (badgeEl) badgeEl.textContent = `${totalActive}/${maxLabel}`;
  if (rowsEl) rowsEl.innerHTML = rows;

  // Enable Apply whenever minimum mode requirement is met.
  // No "changed" guard — the user should always be able to confirm a valid selection.
  const meetsMin = minActive === 0 || totalActive >= minActive;
  if (applyBtn) applyBtn.disabled = !meetsMin;
}

function _modalModeAdjust(modeIdx, delta, isUnparseable) {
  const perm = Battlefield.permanents.find(p => p.id === _modalModePopupPermId);
  if (!perm) return;
  const maxActive = perm.modalMaxActive ?? Infinity;
  const counts = isUnparseable ? _modalModeUnparseableCounts : _modalModeTempCounts;
  const cur = counts[modeIdx] ?? 0;
  const newVal = Math.max(0, cur + delta);
  // Check total doesn't exceed max
  if (delta > 0 && maxActive < Infinity) {
    let total = 0;
    for (const v of Object.values(_modalModeTempCounts)) total += v;
    for (const v of Object.values(_modalModeUnparseableCounts)) total += v;
    if (total >= maxActive) return;
  }
  counts[modeIdx] = newVal;
  _updateModalModeContent();
}

function _modalModeToggle(modeIdx, checked, isUnparseable, isRadio) {
  const perm = Battlefield.permanents.find(p => p.id === _modalModePopupPermId);
  if (!perm) return;
  const maxActive = perm.modalMaxActive ?? Infinity;

  if (isRadio) {
    // Radio: clear all, select this one
    _modalModeTempActive.clear();
    _modalModeUnparseableActive.clear();
    if (isUnparseable) _modalModeUnparseableActive.add(modeIdx);
    else _modalModeTempActive.add(modeIdx);
  } else {
    const activeSet = isUnparseable ? _modalModeUnparseableActive : _modalModeTempActive;
    if (checked) {
      // Check capacity
      const total = _modalModeTempActive.size + _modalModeUnparseableActive.size;
      if (maxActive < Infinity && total >= maxActive) {
        // At max - remove oldest to make room
        if (_modalModeTempActive.size > 0) {
          const oldest = _modalModeTempActive.values().next().value;
          _modalModeTempActive.delete(oldest);
        } else if (_modalModeUnparseableActive.size > 0) {
          const oldest = _modalModeUnparseableActive.values().next().value;
          _modalModeUnparseableActive.delete(oldest);
        }
      }
      activeSet.add(modeIdx);
    } else {
      activeSet.delete(modeIdx);
    }
  }
  _updateModalModeContent();
}

function closeModalModePopup() {
  _modalModePopupPermId = null;
  _modalModeInitialState = null;
  const overlay = document.getElementById('modal-mode-overlay');
  if (overlay) overlay.style.display = 'none';
}

function applyModalModePopup() {
  const permId = _modalModePopupPermId;
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) { closeModalModePopup(); return; }
  const repeatable = !!perm.modalRepeatable;

  if (repeatable) {
    Battlefield.setModalModeCounts(permId, { ..._modalModeTempCounts });
    perm._unparseableCounts = { ..._modalModeUnparseableCounts };
  } else {
    Battlefield.setModalModeSelections(permId, new Set(_modalModeTempActive));
    perm._unparseableActive = new Set(_modalModeUnparseableActive);
  }
  Battlefield.evaluate();
  closeModalModePopup();
  renderAll();
}


/* Returns true if permId is a non-token copy card (has COPY effect and is not a token).
   Copy tokens should show bestow/mutate buttons; copy cards should not. */
function _isNonTokenCopyCard(perm) {
  if (!perm || perm.isToken) return false;
  return Battlefield.effects.some(e => e.sourceId === perm.id && e.type === EFFECT_TYPE.COPY);
}

function getEffectInfo(permId) {
  const effs = Battlefield.effects.filter(e => e.sourceId === permId);
  const perm = Battlefield.permanents.find(p => p.id === permId);
  const textEff = effs.find(e => e.type === EFFECT_TYPE.TEXT_CHANGE);
  const copyEff = effs.find(e => e.type === EFFECT_TYPE.COPY);
  // If this permanent has a text-change effect, the text-change modal handles
  // targeting for ALL targeted effects from the same source (via setTextChangeConfig
  // propagation). So suppress the generic target dropdown entirely for such sources.
  const hasTextChange = !!textEff;
  const isToken = perm ? perm.isToken : false;
  // Bestow cards: targeting is handled by the bestow modal (bestow button), not the target dropdown.
  const isBestowCard = perm ? !!perm.hasBestow : false;
  // Non-top mutate stack members: they are part of a single merged permanent.
  // Their effects don't get individual target selects — the top card manages targeting.
  const stack = perm ? Battlefield.getStack(perm.id) : null;
  const isNonTopMutate = stack && stack.length >= 2 && stack[0] !== permId;
  const suppressTargeted = isBestowCard || isNonTopMutate;
  const isManual = perm ? perm.isManualEffect : false;
  // Multi-target: find first effect with maxTargets > 1
  const multiTargetEff = effs.find(e => e.maxTargets > 1 && e.scope === 'targeted' && !e.selfTarget);
  // Per-mode targeting: true when multiple distinct modal modes each need a separate target.
  // This occurs on Entwined/multi-mode spells (e.g. Twisted Reflection with Entwine) where
  // two different modes each target a creature independently.
  const activeModalTargetedModes = [...new Set(
    effs
      .filter(e => e.scope === 'targeted' && !e.selfTarget && !e.disabled && e.modalModeIndex !== undefined)
      .map(e => e.modalModeIndex)
  )];
  const hasModalTargets = !hasTextChange && !suppressTargeted && activeModalTargetedModes.length > 1;
  const exchangeControlEff = effs.find(e => e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl);
  const hasExchangeControl = !!exchangeControlEff;
  return {
    hasTargeted: !hasTextChange && !hasExchangeControl && !suppressTargeted && !hasModalTargets && effs.some(e => e.scope === 'targeted' && !e.selfTarget && !e._isCounterEffect && !e._autoTargetSource),
    hasCopy: !!copyEff,
    hasCopyToken: !!copyEff && isToken,    // token copy -> full editor modal
    hasCopyCard: !!copyEff && !isToken,     // non-token copy -> dropdown select
    hasText: hasTextChange,
    textChangeType: textEff?.params?.changeType || null,
    hasExchangeControl,
    exchangeControlMode: exchangeControlEff?.params?.exchangeMode || null,
    hasCDA: effs.some(e => (e.type === EFFECT_TYPE.CDA_PT && (e.params.userAdjustable || !e.params.compute)) || (e.type === EFFECT_TYPE.MODIFY_PT && e.params.forEachDesc !== undefined && e.params.userAdjustable)),
    isManualEffect: isManual,
    maxTargets: multiTargetEff ? multiTargetEff.maxTargets : 1,
    hasModalTargets,
    activeModalTargetedModes,
  };
}

/* Fix 10: Render X value input for cards with variable X */
function renderXValueInput(perm) {
  const val = perm.xValue ?? 0;
  // Show "X" in the input when value is 0 (the default/unset state)
  const displayVal = val === 0 ? '' : val;
  return `<div class="cda-counter-row" onclick="event.stopPropagation()">
    <span class="cda-label" title="Variable X value">X =</span>
    <input type="text" class="cda-counter-input" value="${displayVal}" 
           placeholder="X" title="Adjust X value (type a number, or 'X' for 0)"
           onchange="setXValue('${perm.id}', this.value)"
           style="width:50px;text-align:center;">
  </div>`;
}

function setXValue(permId, rawValue) {
  // Allow "X" or empty as input, treat as 0
  const strVal = String(rawValue).trim();
  const numVal = (strVal === '' || strVal.toLowerCase() === 'x') ? 0 : (parseInt(strVal) || 0);
  Battlefield.setXValue(permId, numVal);
  Battlefield.evaluate();
  renderAll();
}

function renderCDAInput(perm) {
  const val = perm.cdaUserValue ?? '';
  // Find the CDA effect to get forEachDesc if available
  const cdaEff = Battlefield.effects.find(e => e.sourceId === perm.id &&
    ((e.type === EFFECT_TYPE.CDA_PT && (e.params.userAdjustable || !e.params.compute)) ||
     (e.type === EFFECT_TYPE.MODIFY_PT && e.params.forEachDesc !== undefined && e.params.userAdjustable)));
  const forEachDesc = cdaEff?.params?.forEachDesc || '';
  const placeholder = forEachDesc ? `# ${forEachDesc}` : '#';
  const title = forEachDesc ? `Count of: ${forEachDesc}` : 'CDA count (e.g. card types in graveyard)';
  return `<div class="cda-counter-row" onclick="event.stopPropagation()">
    <input type="number" class="cda-counter-input" value="${val}" min="0" max="999"
           placeholder="${escapeAttr(placeholder)}"
           title="${escapeAttr(title)}"
           onchange="setCDAValue('${perm.id}', parseInt(this.value) || 0)">
    ${forEachDesc ? `<span class="cda-label" title="${escapeAttr(forEachDesc)}">${escapeHtml(forEachDesc.length > 20 ? forEachDesc.slice(0, 18) + '...' : forEachDesc)}</span>` : ''}
  </div>`;
}

function setCDAValue(permId, value) {
  Battlefield.setCDAValue(permId, value);
  renderInspector();
}

/* Render a card name text input for cards with "choose a creature card name" */
function renderChosenCardNameInput(perm) {
  const val = perm.chosenCardName || '';
  return `<div class="cda-counter-row chosen-type-row" onclick="event.stopPropagation()">
    <span class="cda-label" title="Choose a creature card name">Name:</span>
    <div class="chosen-type-wrapper">
      <input type="text" class="chosen-type-input" value="${escapeAttr(val)}"
             placeholder="e.g. Grizzly Bears" autocomplete="off"
             title="Choose a creature card name"
             id="chosen-name-${perm.id}"
             oninput="_cardNameAutocompleteForChosen('${perm.id}', this.value)"
             onchange="setChosenCardName('${perm.id}', this.value)"
             onkeydown="if(event.key==='Enter'){this.blur();}">
      <div class="chosen-type-autocomplete" id="chosen-name-ac-${perm.id}"></div>
    </div>
  </div>`;
}

let _cardNameSearchTimeout = null;
function _cardNameAutocompleteForChosen(permId, query) {
  const dropdown = document.getElementById('chosen-name-ac-' + permId);
  if (!dropdown) return;
  if (!query || query.length < 2) { dropdown.style.display = 'none'; return; }

  // Debounce Scryfall API calls
  if (_cardNameSearchTimeout) clearTimeout(_cardNameSearchTimeout);
  _cardNameSearchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}&include_extras=false`);
      const data = await res.json();
      const matches = (data.data || []).slice(0, 8);
      if (matches.length === 0) { dropdown.style.display = 'none'; return; }
      dropdown.innerHTML = matches.map(m =>
        `<div class="chosen-type-option" onmousedown="event.preventDefault(); _selectChosenCardName('${permId}', '${escapeAttr(m)}')">${escapeHtml(m)}</div>`
      ).join('');
      dropdown.style.display = 'block';
    } catch (e) {
      dropdown.style.display = 'none';
    }
  }, 250);
}

function _selectChosenCardName(permId, name) {
  const input = document.getElementById('chosen-name-' + permId);
  if (input) input.value = name;
  const dropdown = document.getElementById('chosen-name-ac-' + permId);
  if (dropdown) dropdown.style.display = 'none';
  setChosenCardName(permId, name);
}

function setChosenCardName(permId, name) {
  const trimmed = (name || '').trim();
  Battlefield.setChosenCardName(permId, trimmed || null);
  Battlefield.evaluate();
  renderAll();
}

/* Render a creature type text input for cards with "choose a creature type" */
function renderChosenCreatureTypeInput(perm) {
  const val = perm.chosenCreatureType || '';
  return `<div class="cda-counter-row chosen-type-row" onclick="event.stopPropagation()">
    <span class="cda-label" title="Choose a creature type">Type:</span>
    <div class="chosen-type-wrapper">
      <input type="text" class="chosen-type-input" value="${escapeAttr(val)}"
             placeholder="e.g. Vampire" autocomplete="off"
             title="Choose a creature type"
             id="chosen-type-${perm.id}"
             oninput="_creatureTypeAutocompleteForChosen('${perm.id}', this.value)"
             onchange="setChosenCreatureType('${perm.id}', this.value)"
             onkeydown="if(event.key==='Enter'){this.blur();}">
      <div class="chosen-type-autocomplete" id="chosen-type-ac-${perm.id}"></div>
    </div>
  </div>`;
}

function _creatureTypeAutocompleteForChosen(permId, query) {
  const dropdown = document.getElementById('chosen-type-ac-' + permId);
  if (!dropdown) return;
  if (!query || query.length < 1) { dropdown.style.display = 'none'; return; }
  const q = query.toLowerCase();
  const matches = (TypeCatalog.creatureTypes || []).filter(t => t.toLowerCase().startsWith(q)).slice(0, 8);
  if (matches.length === 0) { dropdown.style.display = 'none'; return; }
  dropdown.innerHTML = matches.map(m =>
    `<div class="chosen-type-option" onmousedown="event.preventDefault(); _selectChosenCreatureType('${permId}', '${escapeAttr(m)}')">${escapeHtml(m)}</div>`
  ).join('');
  dropdown.style.display = 'block';
}

function _selectChosenCreatureType(permId, type) {
  const input = document.getElementById('chosen-type-' + permId);
  if (input) input.value = type;
  const dropdown = document.getElementById('chosen-type-ac-' + permId);
  if (dropdown) dropdown.style.display = 'none';
  setChosenCreatureType(permId, type);
}

function setChosenCreatureType(permId, type) {
  const trimmed = (type || '').trim();
  // Capitalize first letter
  const capitalized = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
  Battlefield.setChosenCreatureType(permId, capitalized || null);
  Battlefield.evaluate();
  renderAll();
}

/* Render a basic land type dropdown for cards with "choose a basic land type" */
function renderChosenLandTypeInput(perm) {
  const val = perm.chosenLandType || '';
  const types = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
  const options = types.map(t =>
    `<option value="${t}" ${val === t ? 'selected' : ''}>${t}</option>`
  ).join('');
  return `<div class="cda-counter-row chosen-color-row" onclick="event.stopPropagation()">
    <span class="cda-label" title="Choose a basic land type">Land type:</span>
    <select class="chosen-color-select" onchange="setChosenLandType('${perm.id}', this.value)">
      <option value="">— pick —</option>
      ${options}
    </select>
  </div>`;
}

function setChosenLandType(permId, type) {
  Battlefield.setChosenLandType(permId, type || null);
  Battlefield.evaluate();
  renderAll();
}

/* Render a color dropdown for cards with "choose a color" */
function renderChosenColorInput(perm) {
  const val = perm.chosenColor || '';
  const colors = ['White', 'Blue', 'Black', 'Red', 'Green'];
  const options = colors.map(c =>
    `<option value="${c}" ${val === c ? 'selected' : ''}>${c}</option>`
  ).join('');
  return `<div class="cda-counter-row chosen-color-row" onclick="event.stopPropagation()">
    <span class="cda-label" title="Choose a color">Color:</span>
    <select class="chosen-color-select" onchange="setChosenColor('${perm.id}', this.value)">
      <option value="">— pick —</option>
      ${options}
    </select>
  </div>`;
}

function setChosenColor(permId, color) {
  Battlefield.setChosenColor(permId, color || null);
  Battlefield.evaluate();
  renderAll();
}

/* Render a copy-target dropdown for non-token copy cards.
   Uses final evaluated states so cards that gain types through Layer 1+ are valid targets. */
function renderCopyTargetSelect(sourceId) {
  const effect = Battlefield.effects.find(e => e.sourceId === sourceId && e.type === EFFECT_TYPE.COPY);
  if (!effect) return '';
  const restriction = effect.params.restriction;
  const currentCopyName = effect.params.copySource ? effect.params.copySource.name : '';

  // Use final evaluated states for restriction checking
  const finalStates = Battlefield.getAllFinalStates();
  // Only show top cards of mutate stacks (non-top cards are not valid copy targets)
  const targets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === sourceId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack[0] !== p.id) return false; // not top of stack
    return true;
  });

  // Find currently selected target by matching copySource name to a battlefield perm
  let currentTargetId = '';
  if (effect.params._copyTargetPermId) {
    currentTargetId = effect.params._copyTargetPermId;
  }

  return `<select class="ts-target-select" onchange="setCopyTargetFromBattlefield('${sourceId}', this.value)" onclick="event.stopPropagation()">
    <option value="">\u{1F4CB} copy\u2026</option>
    ${targets.map(t => {
      const fs = finalStates.get(t.id);
      const tState = fs
        ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes, isToken: t.isToken }
        : { types: t.printedTypes || [], supertypes: t.printedSupertypes || [], subtypes: t.printedSubtypes || [], colors: t.printedColors || [], isAllCreatureTypes: false, isToken: t.isToken };
      const valid = !restriction || restriction(tState);
      return valid ? `<option value="${t.id}" ${t.id === currentTargetId ? 'selected' : ''}>${escapeHtml(fs ? fs.name : t.name)}</option>` : '';
    }).join('')}
  </select>`;
}

/* When a non-token copy card selects a target from the battlefield dropdown,
   build the copySource from that permanent's scryfallData (Layer 1 copy uses the
   printed/base characteristics of the target, not the final evaluated state).
   If the target is the top of a mutate stack, the copy gets ALL abilities from
   all cards in the stack (CR 702.140). */
function setCopyTargetFromBattlefield(sourceId, targetPermId) {
  if (!targetPermId) {
    // Clear copy source
    const eff = Battlefield.effects.find(e => e.sourceId === sourceId && e.type === EFFECT_TYPE.COPY);
    if (eff) {
      eff.params.copySource = null;
      delete eff.params._copyTargetPermId;
      // Remove any injected known-card effects from a previous copy
      _removeInjectedCopyEffects(sourceId);
    }
    renderAll();
    return;
  }
  const targetPerm = Battlefield.permanents.find(p => p.id === targetPermId);
  if (!targetPerm) return;

  // Copies copy the target as it appears after Layer 1 ("copiable values").
  // If the target has a COPY effect, its Layer-1 state reflects the copy + except mods.
  // If not, just use raw scryfallData.
  let copyCard;
  const targetHasCopy = Battlefield.effects.some(
    e => e.sourceId === targetPermId && e.type === EFFECT_TYPE.COPY && e.params.copySource
  );
  if (targetHasCopy) {
    // Target is itself a copy — build synthetic card from its post-Layer-1 state
    const layer1State = Battlefield.getPostLayer1State(targetPermId);
    if (layer1State) {
      copyCard = {
        name: layer1State.name,
        type_line: [...(layer1State.supertypes || []), ...(layer1State.types || [])].join(' ')
          + (layer1State.subtypes && layer1State.subtypes.length
             ? ' \u2014 ' + layer1State.subtypes.join(' ') : ''),
        oracle_text: layer1State.oracleText || '',
        colors: layer1State.colors || [],
        power: layer1State.power != null ? String(layer1State.power) : undefined,
        toughness: layer1State.toughness != null ? String(layer1State.toughness) : undefined,
        cmc: targetPerm.scryfallData?.cmc || 0,
        mana_cost: targetPerm.scryfallData?.mana_cost || '',
      };
    } else {
      copyCard = targetPerm.scryfallData;
    }
  } else {
    copyCard = targetPerm.scryfallData;
  }

  if (!copyCard) return;

  // CR 702.140: If the target is the top of a mutate stack, the copy gets ALL
  // abilities from all cards in the stack merged together.
  const mutateStack = Battlefield.getStack(targetPermId);
  if (mutateStack && mutateStack[0] === targetPermId && mutateStack.length > 1) {
    // Gather abilities from all stack members (top card's oracle text first)
    const topOracle = (copyCard.oracle_text || '').split('\n').map(l => l.trim()).filter(Boolean);
    const seenAb = new Set(topOracle);
    const allAbilities = [...topOracle];
    for (let i = 1; i < mutateStack.length; i++) {
      const stackPerm = Battlefield.permanents.find(p => p.id === mutateStack[i]);
      if (!stackPerm || !stackPerm.scryfallData) continue;
      const stackOracle = (stackPerm.scryfallData.oracle_text || '').split('\n').map(l => l.trim()).filter(Boolean);
      for (const ab of stackOracle) {
        const abL = ab.toLowerCase().trimStart();
        const allowDup = /^(?:at|when|whenever)\b/.test(abL) ||
          /\bat the beginning\b|\bwhenever\b|\bwhen you do\b/i.test(abL) ||
          /^ward\b/i.test(ab);
        if (allowDup || !seenAb.has(ab)) {
          seenAb.add(ab);
          allAbilities.push(ab);
        }
      }
    }
    // Build a synthetic copyCard with merged oracle text
    copyCard = { ...copyCard, oracle_text: allAbilities.join('\n') };
  }

  // Store which perm we're copying for the dropdown selection state
  const eff = Battlefield.effects.find(e => e.sourceId === sourceId && e.type === EFFECT_TYPE.COPY);
  if (eff) eff.params._copyTargetPermId = targetPermId;

  Battlefield.setCopySource(sourceId, copyCard);

  // Check if the copy source matches a known card and inject those effects
  _injectKnownCardEffectsForCopy(sourceId, copyCard);

  renderAll();
}

/* Remove any previously injected known-card effects from a copy */
function _removeInjectedCopyEffects(sourceId) {
  Battlefield.effects = Battlefield.effects.filter(e => !(e._injectedByCopy === sourceId));
}

/* If the copy source is a known card (e.g. Deadpool, Exchange of Words),
   inject that card's known effects so the copy behaves like the original */
function _injectKnownCardEffectsForCopy(sourceId, copyCard) {
  // Remove any previously injected effects
  _removeInjectedCopyEffects(sourceId);

  const perm = Battlefield.permanents.find(p => p.id === sourceId);
  if (!perm) return;

  // Match by ability lines instead of card name — normalize the copy source's oracle text
  // and check each line against KNOWN_ABILITY_EFFECTS.
  const oracleText = copyCard.oracle_text || '';
  const stripped = _stripReminderText(oracleText);
  const normalized = _replaceProperNounSelfRef(copyCard.name || '', stripped, false);
  const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    const lineKey = line.toLowerCase();
    if (!KNOWN_ABILITY_EFFECTS[lineKey]) continue;

    for (const template of KNOWN_ABILITY_EFFECTS[lineKey]) {
      // Skip COPY effects - we already have one
      if (template.type === EFFECT_TYPE.COPY) continue;
      const eff = {
        ...template,
        id: `${sourceId}_copyinj_${Battlefield.effects.length}`,
        sourceId: sourceId,
        sourceName: perm.name,
        timestamp: perm.timestamp,
        _injectedByCopy: sourceId, // marker for cleanup
      };
      // Deep-copy params to avoid sharing references
      if (template.params) eff.params = { ...template.params };
      if (template.appliesTo) eff.appliesTo = { ...template.appliesTo };
      Battlefield.effects.push(eff);
    }
  }
}

function renderTargetSelect(sourceId) {
  const sourcePerm = Battlefield.permanents.find(p => p.id === sourceId);
  const current = Battlefield.effects.find(e => e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget && !e._isCounterEffect);
  const currentTarget = current?.targetId || '';
  // If ANY targeted effect from this source requires an opponent's permanent, apply that filter.
  // We scan all effects (not just `current`) because haste/untap effects parsed before the
  // CONTROL effect may be found first by the `current` finder, hiding the flag.
  const opponentControlRequired = Battlefield.effects.some(e =>
    e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget && e.opponentControlRequired)
    || !!(sourcePerm?._opponentControlRequired);
  const youControlRequired = Battlefield.effects.some(e =>
    e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget && e.youControlRequired)
    || !!(sourcePerm?._youControlRequired);
  const sourceCtrl = sourcePerm?.controller || sourcePerm?.owner || Battlefield.activePlayerId;
  // Exclude non-top mutate stack members — a stack is one target (only the top is selectable)
  const targets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === sourceId) return false;
    // "another" restriction: exclude the ability's source permanent itself (e.g. Arahbo can't target itself)
    if (sourcePerm?._excludeAbilitySource && sourcePerm.abilitySourceId && p.id === sourcePerm.abilitySourceId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    // Spell effects only affect permanents that existed before the spell (earlier timestamp),
    // but always include a permanent that is already the current target — targeting persists
    // even if the card is later moved to a timestamp after the spell.
    if (sourcePerm && sourcePerm.isManualEffect && p.timestamp >= sourcePerm.timestamp && p.id !== currentTarget) return false;
    // "target creature an opponent controls" — exclude permanents the source's controller controls
    if (opponentControlRequired && (p.controller || p.owner || 'player_0') === sourceCtrl) return false;
    // "enchant creature you control" — exclude permanents controlled by opponents
    if (youControlRequired && (p.controller || p.owner || 'player_0') !== sourceCtrl) return false;
    return true;
  });

  // Get aura restriction from the source's effects (parsed from "Enchant [type]")
  const auraRestriction = current?.auraRestriction
    || Battlefield.effects.find(e => e.sourceId === sourceId && e.auraRestriction)?.auraRestriction
    || Battlefield.permanents.find(p => p.id === sourceId)?._auraRestriction;

  // Get spell target restriction (from "target creature" parsing)
  const spellRestriction = current?.targetRestriction
    || Battlefield.effects.find(e => e.sourceId === sourceId && e.targetRestriction)?.targetRestriction;

  // Check if this is an equipment source (requires creature target)
  const isEquipment = Battlefield.effects.some(e => e.sourceId === sourceId && e.requiresCreatureTarget);

  // Use final computed states for validation so copies/tokens show correctly
  const finalStates = Battlefield.getAllFinalStates();

  // CR 704.5p: If this equipment is currently a creature, it can't equip
  // (unless it has reconfigure, which makes it lose creature type upon equipping).
  if (isEquipment) {
    const sourceFs = finalStates.get(sourceId);
    const sourceTypes = sourceFs ? (sourceFs.types || []) : (sourcePerm?.printedTypes || []);
    if (sourceTypes.includes('Creature')) {
      const sourceAbilities = sourceFs ? (sourceFs.abilities || []) : [];
      const hasReconfigure = sourceAbilities.some(a => /\breconfigure\b/i.test(a));
      if (!hasReconfigure) {
        return `<div class="ts-equip-blocked" style="color:#c44;font-size:0.85em;padding:2px 6px;">This Equipment is currently a creature and cannot equip. (Rule 704.5p)</div>`;
      }
    }
  }

  // Check if this is a non-targeting selection (from "it" pronoun conversion).
  // These abilities don't actually target, so they bypass shroud/hexproof.
  const isNonTargeting = sourcePerm && sourcePerm._nonTargetingSelection;

  // Check if this is a reconfigure card that currently has a target (is attached)
  const isReconfigure = isEquipment && sourcePerm && (sourcePerm.oracleText || '').toLowerCase().includes('reconfigure');
  const isAttached = isReconfigure && currentTarget;

  return `<select class="ts-target-select" onchange="setEffectTarget('${sourceId}', this.value)" onclick="event.stopPropagation()">
    <option value="">${isAttached ? '\u2192 Unattach' : isNonTargeting ? '\u2192 choose\u2026' : '\u2192 target\u2026'}</option>
    ${targets.map(t => {
      const fs = finalStates.get(t.id);
      const tState = fs
        ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes }
        : { types: t.printedTypes || [], supertypes: t.printedSupertypes || [], subtypes: t.printedSubtypes || [], colors: t.printedColors || [], isAllCreatureTypes: false };
      const validAura = !auraRestriction || auraRestriction(tState);
      const tCtrlForEquip = t.controller || t.owner || 'player_0';
      const validEquip = !isEquipment || (tState.types.includes('Creature') && tCtrlForEquip === sourceCtrl);
      const validSpell = !spellRestriction || spellRestriction(tState);
      // Shroud/hexproof prevent being targeted — but non-targeting selections bypass them
      const tAbilities = !isNonTargeting && fs ? (fs.abilities || []) : [];
      const hasShroud = tAbilities.some(a => /\bshroud\b/i.test(a));
      const tCtrl = t.controller || t.owner || 'player_0';
      const hasHexproof = tCtrl !== sourceCtrl && tAbilities.some(a => /\bhexproof\b/i.test(a));
      let tDisplayName = t.label ? `${t.name} ${t.label}` : t.name;
      if (Battlefield.players.length > 1 && t.owner) tDisplayName += ` [${Battlefield.getPlayerName(t.controller || t.owner)}]`;
      return (validAura && validEquip && validSpell && !hasShroud && !hasHexproof) ? `<option value="${t.id}" ${t.id === currentTarget ? 'selected' : ''}>${escapeHtml(tDisplayName)}</option>` : '';
    }).join('')}
  </select>`;
}

/* "Target opponent" dropdown — pick a single opponent (any player who is NOT the
   controller of this source's spell/ability). Used by cards like Curious Colossus
   whose effect reads "each creature target opponent controls...". */
function renderTargetOpponentSelect(sourceId) {
  const sourcePerm = Battlefield.permanents.find(p => p.id === sourceId);
  if (!sourcePerm) return '';
  const sourceCtrl = sourcePerm.controller || sourcePerm.owner || Battlefield.activePlayerId;
  const current = sourcePerm._targetOpponentPlayerId || '';
  const opponents = (Battlefield.players || []).filter(pl => pl.id !== sourceCtrl);
  if (opponents.length === 0) return '';
  return `<select class="ts-target-select ts-target-opponent" onchange="setTargetOpponent('${sourceId}', this.value)" onclick="event.stopPropagation()">
    <option value="">\u2192 target opponent\u2026</option>
    ${opponents.map(pl => `<option value="${escapeAttr(pl.id)}" ${pl.id === current ? 'selected' : ''}>${escapeHtml(pl.name)}</option>`).join('')}
  </select>`;
}

function setTargetOpponent(sourceId, playerId) {
  Battlefield.setTargetOpponent(sourceId, playerId || null);
  renderAll();
}

/* "Target player" dropdown — pick any player (including self). Used by cards like
   Bazaar Trader whose effect reads "target player gains control of target ... you control." */
function renderTargetPlayerSelect(sourceId) {
  const sourcePerm = Battlefield.permanents.find(p => p.id === sourceId);
  if (!sourcePerm) return '';
  const current = sourcePerm._targetPlayerId || '';
  const players = Battlefield.players || [];
  if (players.length === 0) return '';
  return `<select class="ts-target-select ts-target-player" onchange="setTargetPlayer('${sourceId}', this.value)" onclick="event.stopPropagation()">
    <option value="">\u2192 target player\u2026</option>
    ${players.map(pl => `<option value="${escapeAttr(pl.id)}" ${pl.id === current ? 'selected' : ''}>${escapeHtml(pl.name)}</option>`).join('')}
  </select>`;
}

function setTargetPlayer(sourceId, playerId) {
  Battlefield.setTargetPlayer(sourceId, playerId || null);
  renderAll();
}

/* Render multiple target dropdowns for "up to N target" effects */
function renderMultiTargetSelect(sourceId, maxTargets) {
  const sourcePerm = Battlefield.permanents.find(p => p.id === sourceId);
  const effs = Battlefield.effects.filter(e => e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget);
  const currentTargetIds = effs[0]?.targetIds || [];
  const targets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === sourceId) return false;
    if (sourcePerm?._excludeAbilitySource && sourcePerm.abilitySourceId && p.id === sourcePerm.abilitySourceId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    // Spell effects only affect permanents that existed before the spell (earlier timestamp),
    // but always include permanents that are already current targets — targeting persists
    // even if the card is later moved to a timestamp after the spell.
    if (sourcePerm && sourcePerm.isManualEffect && p.timestamp >= sourcePerm.timestamp && !currentTargetIds.includes(p.id)) return false;
    return true;
  });
  const spellRestriction = effs.find(e => e.targetRestriction)?.targetRestriction;

  const finalStates = Battlefield.getAllFinalStates();
  const isNonTargeting = sourcePerm && sourcePerm._nonTargetingSelection;
  const sourceCtrl = sourcePerm?.controller || sourcePerm?.owner || Battlefield.activePlayerId;

  let html = '<div class="multi-target-group" onclick="event.stopPropagation()">';
  for (let i = 0; i < maxTargets; i++) {
    const currentVal = currentTargetIds[i] || '';
    html += `<select class="ts-target-select ts-target-multi" onchange="setMultiTarget('${sourceId}', ${i}, this.value)">
      <option value="">${isNonTargeting ? '\u2192 choose' : '\u2192 target'} ${i + 1}\u2026</option>
      ${targets.map(t => {
        const fs = finalStates.get(t.id);
        const tState = fs
          ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes }
          : { types: t.printedTypes || [], supertypes: t.printedSupertypes || [], subtypes: t.printedSubtypes || [], colors: t.printedColors || [], isAllCreatureTypes: false };
        const valid = !spellRestriction || spellRestriction(tState);
        const tAbilities = !isNonTargeting && fs ? (fs.abilities || []) : [];
        const hasShroud = tAbilities.some(a => /\bshroud\b/i.test(a));
        const tCtrl = t.controller || t.owner || 'player_0';
        const hasHexproof = tCtrl !== sourceCtrl && tAbilities.some(a => /\bhexproof\b/i.test(a));
        let tDisplayName = t.label ? `${t.name} ${t.label}` : t.name;
        if (Battlefield.players.length > 1 && t.owner) tDisplayName += ` [${Battlefield.getPlayerName(t.controller || t.owner)}]`;
        return (valid && !hasShroud && !hasHexproof) ? `<option value="${t.id}" ${t.id === currentVal ? 'selected' : ''}>${escapeHtml(tDisplayName)}</option>` : '';
      }).join('')}
    </select>`;
  }
  html += '</div>';
  return html;
}

function setEffectTarget(sourceId, targetId) {
  Battlefield.setTarget(sourceId, targetId || null);
  renderAll();
}

/* Set a specific target slot for multi-target effects */
function setMultiTarget(sourceId, slotIndex, targetId) {
  Battlefield.setMultiTarget(sourceId, slotIndex, targetId || null);
  renderAll();
}

/* Render per-mode target dropdowns for modal spells whose active modes each need a
   separate target (e.g. Twisted Reflection with Entwine: mode 0 targets one creature,
   mode 1 targets another). One labeled dropdown per active targeted modal mode. */
function renderModalModeTargets(sourceId, activeModeIndices) {
  const sourcePerm = Battlefield.permanents.find(p => p.id === sourceId);
  const allEffs = Battlefield.effects.filter(e => e.sourceId === sourceId && e.scope === 'targeted' && !e.selfTarget);
  const finalStates = Battlefield.getAllFinalStates();
  const isNonTargeting = sourcePerm && sourcePerm._nonTargetingSelection;
  const sourceCtrl = sourcePerm?.controller || sourcePerm?.owner || Battlefield.activePlayerId;
  const targets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === sourceId) return false;
    if (sourcePerm?._excludeAbilitySource && sourcePerm.abilitySourceId && p.id === sourcePerm.abilitySourceId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    return true;
  });

  const modeTexts = sourcePerm && sourcePerm.modalModeTexts ? sourcePerm.modalModeTexts : [];
  let html = '<div class="multi-target-group" onclick="event.stopPropagation()">';
  for (const modeIdx of activeModeIndices) {
    const modeEff = allEffs.find(e => e.modalModeIndex === modeIdx);
    if (!modeEff) continue;
    const currentTarget = modeEff.targetId || '';
    const spellRestriction = modeEff.targetRestriction || null;
    const modeLabel = modeTexts[modeIdx]
      ? (modeTexts[modeIdx].length > 40 ? modeTexts[modeIdx].substring(0, 37) + '...' : modeTexts[modeIdx])
      : `Mode ${modeIdx + 1}`;
    html += `<select class="ts-target-select ts-target-multi" title="${escapeAttr(modeTexts[modeIdx] || '')}"
        onchange="setModalModeTarget('${escapeAttr(sourceId)}', ${modeIdx}, this.value)">
      <option value="">${isNonTargeting ? '\u2192 choose' : '\u2192 target'} (${escapeHtml(modeLabel)})\u2026</option>
      ${targets.map(t => {
        const fs = finalStates.get(t.id);
        const tState = fs
          ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes }
          : { types: t.printedTypes || [], supertypes: t.printedSupertypes || [], subtypes: t.printedSubtypes || [], colors: t.printedColors || [], isAllCreatureTypes: false };
        const valid = !spellRestriction || spellRestriction(tState);
        const tAbilities = !isNonTargeting && fs ? (fs.abilities || []) : [];
        const hasShroud = tAbilities.some(a => /\bshroud\b/i.test(a));
        const tCtrl = t.controller || t.owner || 'player_0';
        const hasHexproof = tCtrl !== sourceCtrl && tAbilities.some(a => /\bhexproof\b/i.test(a));
        const tDisplayName = t.label ? `${t.name} ${t.label}` : t.name;
        return (valid && !hasShroud && !hasHexproof) ? `<option value="${t.id}" ${t.id === currentTarget ? 'selected' : ''}>${escapeHtml(tDisplayName)}</option>` : '';
      }).join('')}
    </select>`;
  }
  html += '</div>';
  return html;
}

function setModalModeTarget(sourceId, modeIndex, targetId) {
  Battlefield.setModalModeTarget(sourceId, modeIndex, targetId || null);
  Battlefield.evaluate();
  renderAll();
}
/* [END: TIMESTAMP-UI] */

/* [KEY: COUNTER-UI] */
const COUNTER_PRESETS = [
  { label: '+1/+1', type: '+1/+1' },
  { label: '-1/-1', type: '-1/-1' },
  { label: '+1/+0', type: '+1/+0' },
  { label: '+0/+1', type: '+0/+1' },
  { label: '+2/+0', type: '+2/+0' },
  { label: '+0/+2', type: '+0/+2' },
  { label: '+1/+2', type: '+1/+2' },
  { label: '+2/+2', type: '+2/+2' },
  { label: '-0/-1', type: '-0/-1' },
  { label: '-1/-0', type: '-1/-0' },
  { label: '-2/-2', type: '-2/-2' },
  { label: 'Flying', type: 'flying' },
  { label: 'First Strike', type: 'first strike' },
  { label: 'Double Strike', type: 'double strike' },
  { label: 'Deathtouch', type: 'deathtouch' },
  { label: 'Haste', type: 'haste' },
  { label: 'Hexproof', type: 'hexproof' },
  { label: 'Indestructible', type: 'indestructible' },
  { label: 'Lifelink', type: 'lifelink' },
  { label: 'Menace', type: 'menace' },
  { label: 'Reach', type: 'reach' },
  { label: 'Trample', type: 'trample' },
  { label: 'Vigilance', type: 'vigilance' },
  { label: 'Defender', type: 'defender' },
  { label: 'Shield', type: 'shield' },
];

function renderCounterPanel() {
  const section = document.getElementById('counter-section');
  const panel = document.getElementById('counter-panel');
  if (!section) return;
  if (!Battlefield.inspectedId) { section.style.display = 'none'; return; }
  const perm = Battlefield.permanents.find(p => p.id === Battlefield.inspectedId);
  if (!perm || perm.isManualEffect) { section.style.display = 'none'; return; }
  section.style.display = '';

  const counters = perm.counters || {};
  const counterEntries = Object.entries(counters).filter(([,v]) => v > 0);

  let html = `<div class="counter-perm-name">${escapeHtml(perm.name)}</div>`;
  if (counterEntries.length > 0) {
    html += `<div class="counter-list">`;
    for (const [type, count] of counterEntries) {
      html += `<div class="counter-row">
        <span class="counter-type">${escapeHtml(type)}</span>
        <span class="counter-count">x${count}</span>
        <button class="counter-btn counter-minus" onclick="modifyCounter('${perm.id}', '${type}', -1)">−</button>
        <button class="counter-btn counter-plus" onclick="modifyCounter('${perm.id}', '${type}', 1)">+</button>
      </div>`;
    }
    html += `</div>`;
  } else {
    html += `<div class="dim" style="font-size:11px;padding:4px 0;">No counters</div>`;
  }
  // Collect oracle counter types from ALL permanents (not just this one)
  // so card-specific counter types are available everywhere
  const allOracleCounterTypes = new Set();
  for (const p2 of Battlefield.permanents) {
    if (p2.oracleCounterTypes) {
      for (const t of p2.oracleCounterTypes) allOracleCounterTypes.add(t);
    }
  }
  // Also include this permanent's own types first
  if (perm.oracleCounterTypes) {
    for (const t of perm.oracleCounterTypes) allOracleCounterTypes.add(t);
  }
  const oracleCounterTypes = [...allOracleCounterTypes];

  html += `<div class="counter-add">
    <select id="counter-type-select" class="counter-select">
      ${oracleCounterTypes.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
      ${COUNTER_PRESETS.map(p => `<option value="${p.type}">${p.label}</option>`).join('')}
    </select>
    <button class="btn btn-sm" onclick="addCounterFromUI('${perm.id}')">Add Counter</button>
  </div>`;

  // Class enchantment level controls
  if (perm._classLevelThresholds) {
    const maxLevel = Math.max(...perm._classLevelThresholds.values());
    const curLevel = perm.classLevel || 1;
    html += `<div class="class-level-control">
      <span class="class-level-label">Class Level</span>
      <div class="class-level-buttons">
        <button class="counter-btn counter-minus" onclick="modifyClassLevel('${perm.id}', -1)" ${curLevel <= 1 ? 'disabled' : ''}>−</button>
        <span class="class-level-value">${curLevel}</span>
        <button class="counter-btn counter-plus" onclick="modifyClassLevel('${perm.id}', 1)" ${curLevel >= maxLevel ? 'disabled' : ''}>+</button>
      </div>
    </div>`;
  }

  panel.innerHTML = html;
}

function modifyCounter(permId, counterType, delta) {
  if (delta > 0) Battlefield.addCounter(permId, counterType, delta);
  else Battlefield.removeCounter(permId, counterType, -delta);
  renderAll();
}

function addCounterFromUI(permId) {
  const select = document.getElementById('counter-type-select');
  if (!select) return;
  Battlefield.addCounter(permId, select.value, 1);
  renderAll();
}

function modifyClassLevel(permId, delta) {
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;
  Battlefield.setClassLevel(permId, (perm.classLevel || 1) + delta);
}
/* [END: COUNTER-UI] */

/* [KEY: GAME-STATE-UI] */
function toggleYourTurn() {
  const gs = Battlefield.gameState;
  const newValue = !gs.isYourTurn;
  gs.isYourTurn = newValue;
  // Turning on your turn: clear it for all other players (only one player can have their turn at a time)
  if (newValue) {
    for (const player of Battlefield.players) {
      if (player.id !== Battlefield.activePlayerId) {
        player.gameState.isYourTurn = false;
      }
    }
  }
  Battlefield.evaluate();
  renderAll();
}

function renderGameStatePanel() {
  const panel = document.getElementById('game-state-panel');
  if (!panel) return;
  const gs = Battlefield.gameState;
  const h = escapeHtml;
  let html = '';
  // Show player name header when multiplayer
  if (Battlefield.players.length > 1) {
    const playerName = Battlefield.getActivePlayer().name;
    html += `<div class="gs-player-name">${h(playerName)}'s Game State</div>`;
  }
  html += '<div class="game-state-grid">';

  // Your Turn toggle
  html += `<div class="gs-row gs-turn-row">
    <span class="gs-label">Your Turn</span>
    <div class="gs-controls">
      <button class="gs-turn-toggle ${gs.isYourTurn ? 'active' : ''}"
        onclick="toggleYourTurn();">
        ${gs.isYourTurn ? 'Yes' : 'No'}
      </button>
    </div>
  </div>`;

  // Life tracking
  html += `<div class="gs-row">
    <span class="gs-label">Starting Life</span>
    <div class="gs-controls">
      <input type="number" class="gs-input" value="${gs.startingLife}" min="0"
        onchange="Battlefield.gameState.startingLife=parseInt(this.value)||0; Battlefield.evaluate(); renderAll();">
    </div>
  </div>`;
  html += `<div class="gs-row">
    <span class="gs-label">Current Life</span>
    <div class="gs-controls">
      <button class="gs-btn" onclick="Battlefield.gameState.currentLife=Math.max(0,Battlefield.gameState.currentLife-1); Battlefield.evaluate(); renderAll();">−</button>
      <span class="gs-value">${gs.currentLife}</span>
      <button class="gs-btn" onclick="Battlefield.gameState.currentLife++; Battlefield.evaluate(); renderAll();">+</button>
    </div>
  </div>`;

  // Hand size
  html += `<div class="gs-row">
    <span class="gs-label">Cards in Hand</span>
    <div class="gs-controls">
      <button class="gs-btn" onclick="Battlefield.gameState.handSize=Math.max(0,Battlefield.gameState.handSize-1); Battlefield.evaluate(); renderAll();">−</button>
      <span class="gs-value">${gs.handSize}</span>
      <button class="gs-btn" onclick="Battlefield.gameState.handSize++; Battlefield.evaluate(); renderAll();">+</button>
    </div>
  </div>`;

  // Draws this turn
  html += `<div class="gs-row">
    <span class="gs-label">Draws This Turn</span>
    <div class="gs-controls">
      <button class="gs-btn" onclick="Battlefield.gameState.drawsThisTurn=Math.max(0,Battlefield.gameState.drawsThisTurn-1); Battlefield.evaluate(); renderAll();">−</button>
      <span class="gs-value">${gs.drawsThisTurn}</span>
      <button class="gs-btn" onclick="Battlefield.gameState.drawsThisTurn++; Battlefield.evaluate(); renderAll();">+</button>
    </div>
  </div>`;

  // Reset trigger counts (for once-per-turn triggered abilities)
  const hasTriggerCounts = Battlefield.triggerCounts.size > 0;
  if (hasTriggerCounts) {
    html += '<div class="gs-divider"></div>';
    html += `<div class="gs-custom-row">
      <span class="gs-label" style="flex:1">Trigger Counts</span>
      <button class="gs-add-btn" onclick="resetTriggerCounts()" title="Reset all once-per-turn trigger counts">↻ New Turn</button>
    </div>`;
  }

  html += '</div>';
  panel.innerHTML = html;
}

/* [END: GAME-STATE-UI] */

/* [KEY: DRAGDROP] */
function initDragDrop(container) {
  let draggedEl = null;

  container.querySelectorAll('.ts-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedEl = item;
      item.classList.add('ts-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('ts-dragging');
      container.querySelectorAll('.ts-item').forEach(el => el.classList.remove('ts-dragover'));
      const newOrder = [...container.querySelectorAll('.ts-item')].map(el => el.dataset.id);
      Battlefield.reorderTimestamps(newOrder);
      renderAll();
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (item === draggedEl) return;
      const rect = item.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (e.clientY < midY) {
        container.insertBefore(draggedEl, item);
      } else {
        container.insertBefore(draggedEl, item.nextSibling);
      }
    });

    item.addEventListener('dragenter', (e) => {
      e.preventDefault();
      if (item !== draggedEl) item.classList.add('ts-dragover');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('ts-dragover');
    });
  });
}
/* [END: DRAGDROP] */

/* [KEY: INSPECTOR-UI] */
function renderInspector() {
  const panel = document.getElementById('inspector');

  // Check if inspected card is a spell (instant/sorcery) or triggered/activated ability — show simplified view
  const inspPerm = Battlefield.inspectedId
    ? Battlefield.permanents.find(p => p.id === Battlefield.inspectedId) : null;
  if (inspPerm && inspPerm.isManualEffect) {
    const spellEffects = Battlefield.effects.filter(e => e.sourceId === inspPerm.id);
    const detailLabel = inspPerm.isTriggeredAbility ? 'Triggered Ability'
      : inspPerm.isActivatedAbility ? 'Activated Ability' : 'Spell Details';
    const sourcePerm = inspPerm.abilitySourceId
      ? Battlefield.permanents.find(p => p.id === inspPerm.abilitySourceId) : null;
    let html = `<div class="insp-header">
      <h2 class="insp-title">${escapeHtml(inspPerm.name)}${inspPerm.fullCardName ? `<span class="insp-split-full-name"> (${escapeHtml(inspPerm.fullCardName)})</span>` : ''}</h2>
      ${inspPerm.imageUri ? `<img src="${inspPerm.imageUri}" class="insp-thumb" alt="">` : ''}
      ${inspPerm.isChooseableFace ? `<button class="insp-flip-btn" onclick="switchSplitFace('${inspPerm.id}')" title="Switch to other half">\u21C4 Switch Half</button>` : ''}
    </div>`;
    html += `<div class="insp-section">
      <div class="insp-section-head"><h3>${detailLabel}</h3></div>
      <div class="insp-section-body">
        <div class="state-block">`;
    if (sourcePerm) {
      html += `<div class="state-row"><span class="state-label">Source:</span> ${escapeHtml(sourcePerm.name)}</div>`;
    }
    if (inspPerm.abilityFullText) {
      html += `<div class="state-row"><span class="state-label">Full Ability:</span></div>
        <div class="state-oracle">${escapeHtml(inspPerm.abilityFullText)}</div>`;
    }
    if (!inspPerm.isTriggeredAbility && !inspPerm.isActivatedAbility) {
      html += `<div class="state-row"><span class="state-label">Type:</span> ${escapeHtml([...inspPerm.printedSupertypes, ...inspPerm.printedTypes].join(' '))}${inspPerm.printedSubtypes.length ? ' — ' + escapeHtml(inspPerm.printedSubtypes.join(' ')) : ''}</div>
          <div class="state-row"><span class="state-label">Mana Cost:</span> ${escapeHtml(inspPerm.manaCost || '(none)')}</div>`;
    }
    html += `<div class="state-row"><span class="state-label">Effect Text:</span></div>
          <div class="state-oracle">${escapeHtml(inspPerm.oracleText || '(none)')}</div>
        </div>
      </div>
    </div>`;
    if (spellEffects.length) {
      html += `<div class="insp-section">
        <div class="insp-section-head"><h3>Effects Produced (${spellEffects.length})</h3></div>
        <div class="insp-section-body"><div class="state-block">`;
      for (const eff of spellEffects) {
        const layerName = LAYER_MAP[eff.layer]?.name || eff.layer;
        const targetName = eff.targetId
          ? (Battlefield.permanents.find(p => p.id === eff.targetId)?.name || 'unset')
          : (eff.scope === 'global' ? 'all matching' : 'self');
        html += `<div class="state-row">
          <span class="state-label">${escapeHtml(layerName)}:</span>
          ${escapeHtml(eff.description || eff.type)} → <em>${escapeHtml(targetName)}</em>
        </div>`;
      }
      html += `</div></div></div>`;
    }
    panel.innerHTML = html;
    return;
  }

  const result = Battlefield.evaluate();

  if (!result) {
    panel.innerHTML = `<div class="insp-empty">
      <div class="insp-empty-icon">?</div>
      <div>Select a permanent to inspect</div>
      <div class="insp-empty-sub">Click a card on the battlefield</div>
    </div>`;
    return;
  }

  const isRulesMode = Battlefield.explanationMode === 'rules';
  const perm = Battlefield.permanents.find(p => p.id === Battlefield.inspectedId);

  let html = '';

  html += `<div class="insp-header">
    <h2 class="insp-title">${escapeHtml(result.base.name)}${perm?.fullCardName ? `<span class="insp-split-full-name"> (${escapeHtml(perm.fullCardName)})</span>` : ''}</h2>
    ${perm?.imageUri ? `<img src="${perm.imageUri}" class="insp-thumb" alt="">` : ''}
    ${perm?.isTransformable ? `<button class="insp-flip-btn" onclick="flipCard('${perm.id}')" title="Transform / Flip">\u21C4 Flip</button>` : ''}
    ${perm?.isChooseableFace ? `<button class="insp-flip-btn" onclick="openDualOptionsPopup('${perm.id}')" title="Choose half">\u21C4 Choose Half</button>` : ''}
  </div>`;

  if (perm?.isRoom && perm.roomFaces) {
    html += `<div class="insp-section insp-rooms-section">
      <div class="insp-section-head" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="insp-section-arrow">\u25BC</span>
        <h3>Rooms</h3>
      </div>
      <div class="insp-section-body">
        ${perm.roomFaces.map((rf, i) => `
          <div class="insp-room-entry ${perm.roomLocked[i] ? 'insp-room-locked' : 'insp-room-unlocked'}">
            <div class="insp-room-header">
              <span class="insp-room-name">${escapeHtml(rf.name)}</span>
              <span class="insp-room-cost">${escapeHtml(rf.mana_cost)}</span>
              <button class="insp-room-toggle" onclick="toggleRoomLock('${perm.id}', ${i})">
                ${perm.roomLocked[i] ? '\uD83D\uDD12 Locked' : '\uD83D\uDD13 Unlocked'}
              </button>
            </div>
            ${rf.oracle_text ? `<div class="insp-room-oracle">${escapeHtml(rf.oracle_text).replace(/\n/g, '<br>')}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>`;
  }

  html += `<div class="insp-section">
    <div class="insp-section-head" onclick="this.parentElement.classList.toggle('collapsed')">
      <span class="insp-section-arrow">\u25BC</span>
      <h3>Base State (Printed Characteristics)</h3>
    </div>
    <div class="insp-section-body">
      ${renderStateBlock(result.base, isRulesMode, result.base.name)}
    </div>
  </div>`;

  for (const layer of result.layers) {
    const hasChanges = layer.applicationLog.some(a => a.changes.length > 0);
    const statusClass = !layer.active ? 'layer-inactive' : hasChanges ? 'layer-changed' : 'layer-unchanged';

    html += `<div class="insp-section ${statusClass} collapsed">
      <div class="insp-section-head" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="insp-section-arrow">\u25BC</span>
        <h3>
          <span class="layer-badge">${layer.id}</span>
          ${escapeHtml(layer.name)}
          ${!layer.active ? '<span class="layer-tag inactive">inactive</span>' : ''}
          ${hasChanges ? '<span class="layer-tag changed">modified</span>' : ''}
        </h3>
        <span class="layer-cr">${layer.cr}</span>
      </div>
      <div class="insp-section-body">
        ${renderLayerBody(layer, isRulesMode, result.base.name)}
      </div>
    </div>`;
  }

  html += `<div class="insp-section insp-final">
    <div class="insp-section-head">
      <h3>Final Computed State</h3>
    </div>
    <div class="insp-section-body">
      <div class="state-block">
        <div class="state-row"><span class="state-label">Name:</span> <span style="font-weight:600">${escapeHtml(result.final.name || '(none)')}</span></div>
        <div class="state-row"><span class="state-label">Mana Cost:</span> <span>${escapeHtml(result.final.manaCost || '(none)')}</span></div>
      </div>
      ${renderStateBlock(result.final, isRulesMode, result.final.name)}
      ${result.final.types.includes('Creature') ? `<div class="insp-final-pt">${result.final.power} / ${result.final.toughness}</div>` : ''}
    </div>
  </div>`;

  panel.innerHTML = html;
}

function renderLayerBody(layer, isRulesMode, cardName) {
  if (!layer.active) {
    return `<div class="layer-note">${isRulesMode
      ? `Layer ${layer.id} (${layer.cr}) is not active in the current MVP build.`
      : 'This layer is not yet active  —  planned for a future update.'}</div>`;
  }

  let html = '';

  if (layer.orderLog.length) {
    // Filter orderLog to only show entries mentioning effects that affect the selected card.
    // Include both the computed source name AND the display name (source + label) because
    // orderLog dependency entries are built with _effectDisplayName (which appends the
    // permanent's label, e.g. "Dralnu's Crusade A") while a.source stores only the base name.
    const relevantSources = new Set(
      layer.applicationLog
        .filter(a => a.changes.length > 0 || a.appliedToInspected || a.reason.includes('lost its abilities'))
        .flatMap(a => {
          const perm = a.sourceId
            ? (typeof Battlefield !== 'undefined' && Battlefield.permanents
                ? Battlefield.permanents.find(p => p.id === a.sourceId)
                : null)
            : null;
          const displayName = perm && perm.label ? `${a.source} ${perm.label}` : a.source;
          return [a.source, displayName];
        })
    );
    const filteredLog = layer.orderLog.filter(l => {
      // Always show general status messages and loop warnings
      if (/^No dependencies|^Fallback|^All effects|^Dependency loop/i.test(l)) return true;
      // Show dependency/ordering lines only if they mention a relevant source
      return [...relevantSources].some(s => l.includes(`"${s}"`));
    });

    const displayLog = _orderShowAll ? layer.orderLog : filteredLog;
    if (displayLog.length) {
      let orderHtml = '';
      let appliedCount = 0;
      for (const l of displayLog) {
        const isApplied = /^Applied "/i.test(l) || /^Skipped "/i.test(l);
        const isDep = /^Dependency/i.test(l);
        const isLoop = /^Dependency loop/i.test(l);
        if (isApplied) appliedCount++;
        const reason = layer.orderLogReasons && layer.orderLogReasons[l];
        const btn = reason
          ? ` <button class="dep-reason-btn" onclick="showDepReasonPopup(this)" data-reason="${escapeAttr(reason)}" data-is-loop="${isLoop}" title="${isLoop ? 'Why is this a dependency loop?' : 'Why is this a dependency?'}">?</button>`
          : '';
        const lineClass = isDep ? ' layer-order-dep' : '';
        const numHtml = isApplied ? `<span class="layer-order-num">${appliedCount}.</span>` : '';
        orderHtml += `<div class="layer-order-line${lineClass}">${numHtml}${escapeHtml(_replaceThisCard(l, cardName))}${btn}</div>`;
      }
      html += `<div class="layer-order">
        <div class="layer-order-title-row">
          <div class="layer-order-title">${isRulesMode ? 'Effect Ordering (CR 613.8):' : 'How effects are ordered:'}</div>
          <button class="layer-order-toggle" onclick="toggleOrderShowAll()">${_orderShowAll ? 'This card only' : 'Show all'}</button>
        </div>
        ${orderHtml}
      </div>`;
    }
  }

  if (layer.applicationLog.length) {
    // In "show all" mode, display every entry in the log.
    // In normal mode, only show effects that directly affected the inspected permanent.
    const logEntries = _orderShowAll
      ? layer.applicationLog
      : layer.applicationLog.filter(entry => entry.changes.length > 0 ||
          entry.appliedToInspected || entry.reason.includes('lost its abilities'));
    if (logEntries.length === 0) {
      html += `<div class="layer-note">${isRulesMode
        ? 'No applicable effects target this permanent in this layer.'
        : 'No effects affect this permanent in this layer.'}</div>`;
    } else {
    html += `<div class="layer-app-log">`;
    let entryNum = 0;
    for (const entry of logEntries) {
      entryNum++;
      const entrySourcePerm = entry.sourceId ? Battlefield.permanents.find(p => p.id === entry.sourceId) : null;
      const entryDisplaySource = entrySourcePerm && entrySourcePerm.label
        ? `${entry.source} ${entrySourcePerm.label}` : entry.source;
      const isOther = entry.changes.length === 0 && !entry.appliedToInspected && !entry.reason.includes('lost its abilities');
      html += `<div class="layer-app-entry${isOther ? ' layer-app-entry-other' : ''}">
        <div class="layer-app-source">
          <span class="layer-app-num">${entryNum}.</span>
          <strong>${escapeHtml(entryDisplaySource)}</strong>
          <span class="layer-app-ts">ts:${entry.timestamp}</span>
        </div>
        <div class="layer-app-reason">${isRulesMode
          ? escapeHtml(_replaceYouControl(_replaceThisCard(entry.reason, cardName), entry.sourceId))
          : escapeHtml(simplifyReason(_replaceYouControl(_replaceThisCard(entry.reason, cardName), entry.sourceId)))}</div>
        ${entry.changes.length ? entry.changes.map(c =>
          `<div class="layer-app-change">\u2192 ${escapeHtml(_replaceYouControl(_replaceThisCard(c, cardName), entry.sourceId))}</div>`).join('') :
          `<div class="layer-app-change dim">\u2192 ${isOther ? '(applied to other permanents)' : '(no change)'}</div>`}
      </div>`;
    }
    html += `</div>`;
    } // end logEntries check
  } else {
    html += `<div class="layer-note">${isRulesMode
      ? 'No applicable continuous effects in this layer and sublayer.'
      : 'No effects apply in this layer.'}</div>`;
  }

  html += `<div class="layer-state-after">
    <div class="layer-state-after-title">State after Layer ${layer.id}:</div>
    ${renderStateBlock(layer.stateAfter, isRulesMode, cardName)}
  </div>`;

  return html;
}

function _replaceThisCard(text, cardName) {
  if (!cardName || !text) return text;
  return text.replace(/\bthis (?:card|token)\b/gi, cardName);
}

function _replaceYouControl(text, sourceId) {
  if (!text || !sourceId) return text;
  const perm = Battlefield.permanents.find(p => p.id === sourceId);
  const ctrl = perm ? (perm.controller || perm.owner || 'player_0') : null;
  if (!ctrl) return text;
  const name = Battlefield.getPlayerName(ctrl);
  if (!name) return text;
  return text
    .replace(/\byou control\b/gi, `${name} controls`)
    .replace(/\byour control\b/gi, `${name}'s control`);
}

/* Sort ability lines so identical ones are grouped together.
   Preserves order of first occurrence for each unique line. */
function _groupAbilityLines(lines) {
  const firstIndex = new Map();
  for (let i = 0; i < lines.length; i++) {
    if (!firstIndex.has(lines[i])) firstIndex.set(lines[i], i);
  }
  return [...lines].sort((a, b) => firstIndex.get(a) - firstIndex.get(b));
}

function renderStateBlock(state, isRulesMode, cardName) {
  const _rcName = cardName || state.name;
  const typeLine = [...state.supertypes, ...state.types].join(' ')
    + (state.subtypes.length ? '  —  ' + state.subtypes.join(' ') : '');
  const colorDisplay = state.colors.length ? state.colors.join(', ') : 'Colorless';
  const traits = [];
  if (state.isToken) traits.push('Token');
  if (state.supertypes.includes('Basic')) traits.push('Basic');
  if (state.types.includes('Land') && !state.supertypes.includes('Basic')) traits.push('Nonbasic');
  if (state.supertypes.includes('Legendary')) traits.push('Legendary');
  if (state.isAllCreatureTypes) traits.push('All creature types');
  if (state.hasChangeling) traits.push('Changeling');
  // Add custom traits (e.g. "Has all card names" from Spy Kit)
  if (state.traits && state.traits.length) {
    for (const t of state.traits) {
      if (!traits.includes(t)) traits.push(t);
    }
  }

  const counterEntries = Object.entries(state.counters || {}).filter(([,v]) => v > 0);
  const counterHtml = counterEntries.length
    ? `<div class="state-row"><span class="state-label">Counters:</span> <span class="state-traits">${counterEntries.map(([t,c]) => c + 'x ' + escapeHtml(t)).join(', ')}</span></div>`
    : '';

  // Show abilities: active ones normally, conditional ones dimmed (from allPrintedAbilities)
  // Saga chapters: dim chapters whose lore counter threshold hasn't been reached
  // Class levels: dim abilities whose class level hasn't been reached
  // Leveler: dim abilities not in the active level bracket
  // Conditional abilities: dim when condition not met, normal when met
  // Only show printed abilities still present in state.abilities (effects may have removed some)
  let abilitiesHtml;
  const loreCount = (state.counters && state.counters['lore']) || 0;
  const sagaThresholds = state.sagaChapterThresholds;
  const classThresholds = state.classLevelThresholds;
  const classLevel = state.classLevel || 1;
  const levelerData = state.levelerData;
  const levelCount = (state.counters && state.counters['level']) || 0;
  const spacecraftData = state.spacecraftData;
  const chargeCount = (state.counters && state.counters['charge']) || 0;
  if (state.allPrintedAbilities && (state.conditionalAbilityIndices || sagaThresholds || classThresholds || levelerData || spacecraftData)) {
    const lines = [];
    for (let i = 0; i < state.allPrintedAbilities.length; i++) {
      const ab = state.allPrintedAbilities[i];
      if (levelerData && levelerData.abilityIndexToBracket && levelerData.abilityIndexToBracket.has(i)) {
        // Leveler ability: check if the current level counter is in this bracket's range
        const bracketIdx = levelerData.abilityIndexToBracket.get(i);
        const bracket = levelerData.brackets[bracketIdx];
        if (bracket) {
          const isLevelUpLine = (i === levelerData.levelUpLineIndex);
          const inRange = isLevelUpLine || (levelCount >= bracket.min && levelCount <= bracket.max);
          if (inRange) {
            const title = isLevelUpLine ? 'Level up ability (always active)' :
              `Level ${bracket.min}${bracket.max === Infinity ? '+' : '-' + bracket.max} (active, ${levelCount} level counters)`;
            lines.push(`<div class="state-ability-line state-ability-saga-active" title="${title}">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          } else {
            const title = `Level ${bracket.min}${bracket.max === Infinity ? '+' : '-' + bracket.max} (inactive, ${levelCount} level counters)`;
            lines.push(`<div class="state-ability-line state-ability-saga-inactive" title="${title}">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          }
        } else {
          lines.push(`<div class="state-ability-line">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        }
      } else if (classThresholds && classThresholds.has(i)) {
        // Class level ability: dim if class level hasn't reached threshold
        const threshold = classThresholds.get(i);
        if (classLevel >= threshold) {
          lines.push(`<div class="state-ability-line state-ability-saga-active" title="Level ${threshold} ability (active)">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        } else {
          lines.push(`<div class="state-ability-line state-ability-saga-inactive" title="Level ${threshold} ability (needs level ${threshold}, currently ${classLevel})">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        }
      } else if (spacecraftData && spacecraftData.abilityIndexToBracket && spacecraftData.abilityIndexToBracket.has(i)) {
        // Spacecraft station ability: check if charge counters >= threshold
        const minCharge = spacecraftData.abilityIndexToBracket.get(i);
        if (minCharge === -1) {
          // Station keyword line — always active
          lines.push(`<div class="state-ability-line state-ability-saga-active" title="Station keyword (always active)">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        } else {
          const isActive = chargeCount >= minCharge;
          if (isActive) {
            lines.push(`<div class="state-ability-line state-ability-saga-active" title="Station ${minCharge}+ (active, ${chargeCount} charge counters)">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          } else {
            lines.push(`<div class="state-ability-line state-ability-saga-inactive" title="Station ${minCharge}+ (inactive, needs ${minCharge} charge counters, currently ${chargeCount})">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          }
        }
      } else if (state.conditionalAbilityIndices && state.conditionalAbilityIndices.has(i)) {
        // Conditional abilities: evaluate condition to show active/inactive
        if (!state.allAbilitiesRemoved) {
          const isMet = state.conditionalAbilitiesMet && state.conditionalAbilitiesMet.has(i);
          if (isMet) {
            lines.push(`<div class="state-ability-line state-ability-conditional-active" title="Conditional (condition met)">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          } else {
            lines.push(`<div class="state-ability-line state-ability-conditional" title="Conditional (inactive — condition not met)">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
          }
        }
      } else if (sagaThresholds && sagaThresholds.has(i)) {
        // Saga chapter: dim if lore counters haven't reached threshold
        const threshold = sagaThresholds.get(i);
        if (loreCount >= threshold) {
          lines.push(`<div class="state-ability-line state-ability-saga-active" title="Chapter active (lore \u2265 ${threshold})">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        } else {
          lines.push(`<div class="state-ability-line state-ability-saga-inactive" title="Chapter inactive (needs lore \u2265 ${threshold}, currently ${loreCount})">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        }
      } else {
        // Non-conditional printed abilities: only show if still in state.abilities
        if (state.abilities.includes(ab)) {
          lines.push(`<div class="state-ability-line">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
        }
      }
    }
    // Also add any abilities in state.abilities that aren't in allPrintedAbilities (e.g. from effects)
    for (const ab of state.abilities) {
      if (!state.allPrintedAbilities.includes(ab)) {
        lines.push(`<div class="state-ability-line">${escapeHtml(_replaceThisCard(ab, _rcName))}</div>`);
      }
    }
    // Equip and Reconfigure always appear last in the text box
    lines.sort((a, b) => {
      const aLast = />\s*(?:equip|reconfigure)\b/i.test(a);
      const bLast = />\s*(?:equip|reconfigure)\b/i.test(b);
      return aLast === bLast ? 0 : aLast ? 1 : -1;
    });
    abilitiesHtml = lines.length > 0 ? _groupAbilityLines(lines).join('') : '<span class="dim">(none)</span>';
  } else {
    // Equip and Reconfigure always appear last in the text box
    const sortedAbilities = [...state.abilities].sort((a, b) => {
      const aLast = /^(?:equip|reconfigure)\b/i.test(a);
      const bLast = /^(?:equip|reconfigure)\b/i.test(b);
      return aLast === bLast ? 0 : aLast ? 1 : -1;
    });
    abilitiesHtml = sortedAbilities.length
      ? _groupAbilityLines(sortedAbilities.map(a => `<div class="state-ability-line">${escapeHtml(_replaceThisCard(a, _rcName))}</div>`)).join('')
      : '<span class="dim">(none)</span>';
  }

  return `<div class="state-block">
    <div class="state-row"><span class="state-label">Types:</span> <span>${escapeHtml(typeLine) || '(none)'}</span></div>
    <div class="state-row"><span class="state-label">Color:</span> <span>${escapeHtml(colorDisplay)}</span></div>
    ${state.types.includes('Creature') ? `<div class="state-row"><span class="state-label">P/T:</span> <span class="state-pt">${state.power}/${state.toughness}</span></div>` : ''}
    ${traits.length ? `<div class="state-row"><span class="state-label">Traits:</span> <span class="state-traits">${escapeHtml(traits.join(', '))}</span></div>` : ''}
    ${counterHtml}
    <div class="state-row state-row-abilities"><span class="state-label">Abilities:</span> <div class="state-abilities">${abilitiesHtml}</div></div>
  </div>`;
}

function simplifyReason(reason) {
  return reason.replace(/CR \d+\.\d+[a-z]?/g, '').replace(/\s{2,}/g, ' ').trim() || reason;
}

function bindModeToggle() {
  document.getElementById('mode-toggle').addEventListener('click', () => {
    Battlefield.explanationMode = Battlefield.explanationMode === 'teaching' ? 'rules' : 'teaching';
    const btn = document.getElementById('mode-toggle');
    btn.textContent = Battlefield.explanationMode === 'teaching' ? 'Teaching Mode' : 'Rules Mode';
    btn.classList.toggle('rules-active', Battlefield.explanationMode === 'rules');
    renderInspector();
  });
}
/* [END: INSPECTOR-UI] */

/* [KEY: MODAL-COPY]  — Copy source selection modal */
let _copyModalSourceId = null;
let _copyModalSelectedCard = null;

function openCopyModal(permId) {
  _copyModalSourceId = permId;
  _copyModalSelectedCard = null;
  const effect = Battlefield.effects.find(e => e.sourceId === permId && e.type === EFFECT_TYPE.COPY);
  if (!effect) return;

  const restriction = effect.params.restriction;
  const overlay = _createModalOverlay('copy-modal-overlay', closeCopyModal);

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>\u{1F4CB} Select Copy Source</h3>
        <button class="modal-close" onclick="closeCopyModal()"> \u2716 </button>
      </div>
      <div class="modal-body" id="copy-modal-body">
        <div class="modal-section-title">Search Scryfall</div>
        <div class="modal-search-bar">
          <input type="text" id="copy-search-input" placeholder="Search for a card\u2026" autocomplete="off">
        </div>
        <div class="modal-search-results" id="copy-search-results"></div>

        <div class="modal-section-title">Or Select from Battlefield</div>
        <div class="modal-perm-list" id="copy-bf-list"></div>
      </div>
      <div class="modal-footer" id="copy-modal-footer">
        <button class="btn btn-sm" onclick="closeCopyModal()">Cancel</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Populate battlefield list - use final evaluated states for restriction checking
  const bfList = document.getElementById('copy-bf-list');
  // Only show top cards of mutate stacks; non-top cards are not valid copy targets
  const perms = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === permId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack[0] !== p.id) return false;
    return true;
  });
  const finalStates = Battlefield.getAllFinalStates();
  bfList.innerHTML = perms.map(p => {
    const fs = finalStates.get(p.id);
    const state = fs
      ? { types: fs.types || [], supertypes: fs.supertypes || [], subtypes: fs.subtypes || [], colors: fs.colors || [], isAllCreatureTypes: fs.isAllCreatureTypes, isToken: p.isToken }
      : createBaseState(p);
    const valid = !restriction || restriction(state);
    return `
    <div class="modal-perm-item ${valid ? '' : 'disabled'}" data-id="${p.id}" ${valid ? `onclick="selectCopyFromBattlefield('${p.id}')"` : ''}>
      ${p.imageUri ? `<img src="${p.imageUri}" alt="">` : ''}
      <div class="perm-info">
        <div class="perm-name">${escapeHtml(fs ? fs.name : p.name)}</div>
        <div class="perm-type">${escapeHtml([...(fs ? fs.types : p.printedTypes)].join(' '))}${(fs ? fs.subtypes : p.printedSubtypes).length ? '  \u2014  ' + (fs ? fs.subtypes : p.printedSubtypes).join(' ') : ''}</div>
      </div>
      ${!valid ? '<span class="dim">(invalid target)</span>' : ''}
    </div>`;
  }).join('') || '<div class="dim" style="padding:8px">No other permanents on battlefield</div>';

  // Bind search
  const input = document.getElementById('copy-search-input');
  let debounce = null;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) { document.getElementById('copy-search-results').innerHTML = ''; return; }
      document.getElementById('copy-search-results').innerHTML = '<div class="search-loading">Searching\u2026</div>';
      const cards = await searchScryfall(q);
      renderCopySearchResults(cards, restriction);
    }, 350);
  });
  input.focus();
}

function renderCopySearchResults(cards, restriction) {
  const container = document.getElementById('copy-search-results');
  if (!cards.length) { container.innerHTML = '<div class="search-empty">No results</div>'; return; }
  container.innerHTML = cards.slice(0, 20).map((card, i) => {
    const parsed = parseTypeLine(card.type_line || '');
    const fakeState = {
      types: parsed.types,
      subtypes: parsed.subtypes,
      supertypes: parsed.supertypes,
    };
    const valid = !restriction || restriction(fakeState);
    return `
    <div class="modal-perm-item ${valid ? '' : 'disabled'}" ${valid ? `onclick="selectCopyFromSearch(${i})"` : ''}>
      <img src="${card.image_uris?.small || ''}" alt="" onerror="this.style.display='none'" style="width:28px;height:39px;object-fit:cover;border-radius:3px">
      <div class="perm-info">
        <div class="perm-name">${escapeHtml(card.name)}</div>
        <div class="perm-type">${escapeHtml(card.type_line || '')}</div>
      </div>
      ${!valid ? '<span class="dim">(invalid)</span>' : ''}
    </div>`;
  }).join('');
}

/* Phase 1 -> Phase 2: user selected a card, now show the copy editor */
function selectCopyFromSearch(idx) {
  const card = _scryfallLastResults[idx];
  if (!card) return;
  showCopyEditor(card);
}

function selectCopyFromBattlefield(permId) {
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm || !perm.scryfallData) return;

  // CR 702.140: If the target is the top of a mutate stack, include ALL abilities
  // from all cards in the stack merged together.
  const mutateStack = Battlefield.getStack(permId);
  if (mutateStack && mutateStack[0] === permId && mutateStack.length > 1) {
    const topOracle = (perm.scryfallData.oracle_text || '').split('\n').map(l => l.trim()).filter(Boolean);
    const seenAb = new Set(topOracle);
    const allAbilities = [...topOracle];
    for (let i = 1; i < mutateStack.length; i++) {
      const stackPerm = Battlefield.permanents.find(p => p.id === mutateStack[i]);
      if (!stackPerm || !stackPerm.scryfallData) continue;
      const stackOracle = (stackPerm.scryfallData.oracle_text || '').split('\n').map(l => l.trim()).filter(Boolean);
      for (const ab of stackOracle) {
        const abL = ab.toLowerCase().trimStart();
        const allowDup = /^(?:at|when|whenever)\b/.test(abL) ||
          /\bat the beginning\b|\bwhenever\b|\bwhen you do\b/i.test(abL) ||
          /^ward\b/i.test(ab);
        if (allowDup || !seenAb.has(ab)) { seenAb.add(ab); allAbilities.push(ab); }
      }
    }
    showCopyEditor({ ...perm.scryfallData, oracle_text: allAbilities.join('\n') });
  } else {
    showCopyEditor(perm.scryfallData);
  }
}

/* Phase 2: Copy Editor — show editable fields for the selected card */
function showCopyEditor(card) {
  _copyModalSelectedCard = card;
  const body = document.getElementById('copy-modal-body');
  const footer = document.getElementById('copy-modal-footer');
  const header = document.querySelector('#copy-modal-overlay .modal-header h3');
  if (!body || !footer) return;
  if (header) header.textContent = '\u270F\uFE0F Edit Copy';

  // Parse the type line into left (supertypes + types) and right (subtypes)
  const parsed = parseTypeLine(card.type_line || '');
  const leftPart = [...parsed.supertypes, ...parsed.types].join(' ');
  const rightPart = parsed.subtypes.join(' ');

  // Detect if creature for P/T display
  const isCreature = parsed.types.includes('Creature');
  const hasPT = card.power !== undefined || card.toughness !== undefined;

  // Color checkboxes
  const colorMap = [
    { code: 'W', label: 'White', symbol: 'W' },
    { code: 'U', label: 'Blue', symbol: 'U' },
    { code: 'B', label: 'Black', symbol: 'B' },
    { code: 'R', label: 'Red', symbol: 'R' },
    { code: 'G', label: 'Green', symbol: 'G' },
  ];
  const cardColors = (card.colors || []).map(c => c.toUpperCase());

  body.innerHTML = `
    <div class="copy-editor-banner">
      ${card.image_uris?.small ? `<img src="${card.image_uris.small}" alt="" class="copy-editor-thumb">` : ''}
      <div>
        <div style="font-weight:600;font-size:13px;">${escapeHtml(card.name)}</div>
        <div class="dim" style="font-size:11px;">${escapeHtml(card.type_line || '')}</div>
      </div>
    </div>
    <div style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">
      \u26A0\uFE0F Edit any field below. Incorrect oracle text wording may cause abilities to not parse properly.
    </div>

    <div class="copy-editor-field">
      <label class="copy-editor-label">Name</label>
      <input type="text" id="copy-ed-name" class="copy-editor-input" value="${escapeAttr(card.name || '')}">
    </div>

    <div class="copy-editor-field">
      <label class="copy-editor-label">Type Line</label>
      <div class="copy-editor-typeline">
        <input type="text" id="copy-ed-types-left" class="copy-editor-input" value="${escapeAttr(leftPart)}" placeholder="Supertypes + Types">
        <span class="copy-editor-mdash">\u2014</span>
        <input type="text" id="copy-ed-types-right" class="copy-editor-input" value="${escapeAttr(rightPart)}" placeholder="Subtypes">
      </div>
    </div>

    <div class="copy-editor-field">
      <label class="copy-editor-label">Colors</label>
      <div class="copy-editor-colors">
        ${colorMap.map(c => `
          <label class="copy-editor-color-cb">
            <input type="checkbox" id="copy-ed-color-${c.code}" ${cardColors.includes(c.code) ? 'checked' : ''}>
            <span>${c.symbol} ${c.label}</span>
          </label>
        `).join('')}
      </div>
    </div>

    <div class="copy-editor-field" id="copy-ed-pt-row" style="${(isCreature || hasPT) ? '' : 'display:none'}">
      <label class="copy-editor-label">Power / Toughness</label>
      <div style="display:flex;gap:6px;align-items:center;">
        <input type="text" id="copy-ed-power" class="copy-editor-input" style="width:60px;text-align:center;" value="${escapeAttr(card.power != null ? String(card.power) : '')}">
        <span style="color:var(--text-dim);font-weight:600;">/</span>
        <input type="text" id="copy-ed-toughness" class="copy-editor-input" style="width:60px;text-align:center;" value="${escapeAttr(card.toughness != null ? String(card.toughness) : '')}">
      </div>
    </div>

    <div class="copy-editor-field">
      <label class="copy-editor-label">Oracle Text</label>
      <textarea id="copy-ed-oracle" class="copy-editor-textarea" rows="5">${escapeHtml(_stripReminderText(card.oracle_text || ''))}</textarea>
    </div>`;

  footer.innerHTML = `
    <button class="btn btn-sm" onclick="copyEditorBack()">\u2190 Back</button>
    <button class="btn-accent" onclick="applyCopyFromEditor()">Apply Copy</button>`;

  // Auto-show/hide P/T row when types change
  const leftInput = document.getElementById('copy-ed-types-left');
  if (leftInput) {
    leftInput.addEventListener('input', () => {
      const ptRow = document.getElementById('copy-ed-pt-row');
      if (ptRow) {
        const val = leftInput.value.toLowerCase();
        ptRow.style.display = (val.includes('creature') || val.includes('vehicle')) ? '' : 'none';
      }
    });
  }
}

/* Phase 2 -> Phase 1: go back to card selection */
function copyEditorBack() {
  _copyModalSelectedCard = null;
  const sourceId = _copyModalSourceId;
  closeCopyModal();
  openCopyModal(sourceId);
}

/* Phase 2 -> Apply: build a synthetic card from the editor fields */
function applyCopyFromEditor() {
  const name = document.getElementById('copy-ed-name')?.value?.trim() || 'Unknown';
  const leftTypes = document.getElementById('copy-ed-types-left')?.value?.trim() || '';
  const rightTypes = document.getElementById('copy-ed-types-right')?.value?.trim() || '';
  const typeLine = rightTypes ? leftTypes + ' \u2014 ' + rightTypes : leftTypes;

  const colors = [];
  for (const code of ['W', 'U', 'B', 'R', 'G']) {
    if (document.getElementById('copy-ed-color-' + code)?.checked) colors.push(code);
  }

  const powerStr = document.getElementById('copy-ed-power')?.value?.trim();
  const toughStr = document.getElementById('copy-ed-toughness')?.value?.trim();
  const oracle = document.getElementById('copy-ed-oracle')?.value?.trim() || '';

  const syntheticCard = {
    name,
    type_line: typeLine,
    oracle_text: oracle,
    colors,
    power: powerStr !== undefined && powerStr !== '' ? powerStr : undefined,
    toughness: toughStr !== undefined && toughStr !== '' ? toughStr : undefined,
    cmc: _copyModalSelectedCard?.cmc || 0,
    mana_cost: _copyModalSelectedCard?.mana_cost || '',
  };

  Battlefield.setCopySource(_copyModalSourceId, syntheticCard);

  // If the copy source matches a known card, inject those effects (tokens too)
  _injectKnownCardEffectsForCopy(_copyModalSourceId, syntheticCard);

  closeCopyModal();
  renderAll();
}

function closeCopyModal() {
  const overlay = document.getElementById('copy-modal-overlay');
  if (overlay) overlay.remove();
  _copyModalSourceId = null;
  _copyModalSelectedCard = null;
}
/* [END: MODAL-COPY] */

/* [KEY: MODAL-TEXT]  —  Text-change targeting/word-replacement modal (expanded) */
let _textModalSourceId = null;
let _textModalReplacements = [];
let _textModalSelectedWord = null;

function openTextChangeModal(permId) {
  _textModalSourceId = permId;
  const effect = Battlefield.effects.find(e => e.sourceId === permId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  if (!effect) return;
  const changeType = effect.params.changeType || 'color_or_land';
  if (changeType === 'color_global') return openSwirlModal(permId, effect);
  if (changeType === 'exchange_text') return openExchangeModal(permId, effect);
  if (changeType === 'creature_type') return openCreatureTypeModal(permId, effect);
  openStandardTextModal(permId, effect);
}

/* --- Standard color/land text-change modal (Mind Bend etc.) --- */
function openStandardTextModal(permId, effect) {
  const changeType = effect.params.changeType || 'color_or_land';
  const currentTarget = effect.targetId || '';
  _textModalReplacements = [...(effect.params.replacements || [])];
  _textModalSelectedWord = null;

  const overlay = _createModalOverlay('text-modal-overlay', closeTextChangeModal);

  let otherPerms = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === permId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack[0] !== p.id) return false; // non-top mutate members are not valid targets
    return true;
  });
  if (effect.params.targetRestriction) {
    const finalStates = Battlefield.getAllFinalStates();
    otherPerms = otherPerms.filter(p => {
      const fs = finalStates.get(p.id);
      const state = fs || createBaseState(p);
      return effect.params.targetRestriction(state);
    });
  }
  // Also apply aura restriction from "Enchant [type]" line
  const _auraR = effect.auraRestriction
    || Battlefield.effects.find(e => e.sourceId === permId && e.auraRestriction)?.auraRestriction
    || Battlefield.permanents.find(p => p.id === permId)?._auraRestriction;
  if (_auraR) {
    otherPerms = otherPerms.filter(p => {
      const st = { types: p.printedTypes || [], supertypes: p.printedSupertypes || [], subtypes: p.printedSubtypes || [] };
      return _auraR(st);
    });
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>\u270f\ufe0f Configure Text Change</h3>
        <button class="modal-close" onclick="closeTextChangeModal()">\u00d7</button>
      </div>
      <div class="modal-body">
        <div class="text-change-target">
          <div class="modal-section-title">Target Permanent</div>
          <select id="text-target-select" onchange="textChangeTargetSelected()">
            <option value="">\u2014 Select target \u2014</option>
            ${otherPerms.map(p =>
              `<option value="${p.id}" ${p.id === currentTarget ? 'selected' : ''}>${escapeHtml(p.name)}</option>`
            ).join('')}
          </select>
        </div>
        <div id="text-oracle-container"></div>
        <div class="modal-section-title">Replacement</div>
        <div id="text-replacements-list"></div>
        <div id="text-add-section" style="margin-top:10px;">
          <div class="modal-section-title">Change Word</div>
          <div style="display:flex;gap:6px;align-items:center;">
            <select id="text-from-select" onchange="updateToOptions()" style="flex:1;padding:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;"></select>
            <span style="color:var(--text-dim)">\u2192</span>
            <select id="text-to-select" style="flex:1;padding:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;"></select>
            <button class="btn btn-sm" onclick="addTextReplacement()">Set</button>
          </div>
          <div class="dim" style="font-size:11px;margin-top:4px;">Click a highlighted word to pre-select it.</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm" onclick="closeTextChangeModal()">Cancel</button>
        <button class="btn-accent" onclick="applyTextChange()">Apply</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  renderTextReplacements();
  updateTextAddSectionVisibility();
  if (currentTarget) textChangeTargetSelected();
}

/* --- Swirl the Mists modal: pick a color, applies to all permanents --- */
function openSwirlModal(permId, effect) {
  const currentColor = effect.params.chosenColor || '';
  const overlay = _createModalOverlay('text-modal-overlay', closeTextChangeModal);

  const colors = ['white', 'blue', 'black', 'red', 'green'];
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>\ud83c\udf00 Swirl the Mists \u2014 Choose a Color</h3>
        <button class="modal-close" onclick="closeTextChangeModal()">\u00d7</button>
      </div>
      <div class="modal-body">
        <div class="modal-section-title">All color words on all other permanents become this color:</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          ${colors.map(c => `
            <button class="btn ${c === currentColor ? 'btn-accent' : ''}" style="min-width:80px;text-transform:capitalize;"
                    onclick="applySwirlColor('${permId}', '${c}')">${c}</button>
          `).join('')}
        </div>
        ${currentColor ? `<div style="margin-top:12px;color:var(--green);">Currently: <strong>${currentColor}</strong></div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm" onclick="closeTextChangeModal()">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function applySwirlColor(permId, color) {
  Battlefield.setSwirlColor(permId, color);
  closeTextChangeModal();
  renderAll();
}

/* --- Exchange of Words / Deadpool modal --- */
function openExchangeModal(permId, effect) {
  const isDeadpool = effect.params.exchangeTargetId !== undefined && effect.params.exchangeTargetA === undefined;
  // Use final evaluated states so copies that become creatures are valid targets
  const finalStates = Battlefield.getAllFinalStates();
  const creatures = Battlefield.permanents.filter(p => {
    if (p.isManualEffect) return false;
    // Non-top mutate stack members are part of a merged permanent; only top is selectable
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    const fs = finalStates.get(p.id);
    return fs ? fs.types.includes('Creature') : p.printedTypes.includes('Creature');
  });

  const overlay = _createModalOverlay('text-modal-overlay', closeTextChangeModal);

  if (isDeadpool) {
    const targets = creatures.filter(p => p.id !== permId);
    const currentTarget = effect.params.exchangeTargetId || '';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>\ud83d\udcac Exchange Text Boxes</h3>
          <button class="modal-close" onclick="closeTextChangeModal()">\u00d7</button>
        </div>
        <div class="modal-body">
          <div class="modal-section-title">Select target creature to exchange text with:</div>
          <div class="modal-perm-list">
            ${targets.map(p => `
              <div class="modal-perm-item" onclick="applyDeadpoolTarget('${permId}', '${p.id}')">
                ${p.imageUri ? `<img src="${p.imageUri}" alt="">` : ''}
                <div class="perm-info">
                  <div class="perm-name">${escapeHtml(p.name)}</div>
                  <div class="perm-type">${escapeHtml([...p.printedTypes].join(' '))}</div>
                </div>
              </div>
            `).join('') || '<div class="dim" style="padding:8px">No other creatures</div>'}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm" onclick="closeTextChangeModal()">Cancel</button>
        </div>
      </div>`;
  } else {
    const currentA = effect.params.exchangeTargetA || '';
    const currentB = effect.params.exchangeTargetB || '';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>\ud83d\udcac Exchange of Words \u2014 Select Two Creatures</h3>
          <button class="modal-close" onclick="closeTextChangeModal()">\u00d7</button>
        </div>
        <div class="modal-body">
          <div class="modal-section-title">Creature A</div>
          <select id="exchange-target-a" onchange="exchangeTargetChanged()" style="width:100%;padding:7px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
            <option value="">\u2014 Select \u2014</option>
            ${creatures.map(p => `<option value="${p.id}" ${p.id === currentA ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
          </select>
          <div class="modal-section-title" style="margin-top:10px;">Creature B</div>
          <select id="exchange-target-b" onchange="exchangeTargetChanged()" style="width:100%;padding:7px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
            <option value="">\u2014 Select \u2014</option>
            ${creatures.map(p => `<option value="${p.id}" ${p.id === currentB ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
          </select>
          <div id="exchange-warning" class="dim" style="margin-top:8px;color:var(--red);display:none;">Cannot exchange with itself.</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm" onclick="closeTextChangeModal()">Cancel</button>
          <button class="btn-accent" id="exchange-apply-btn" onclick="applyExchangeTargets('${permId}')">Apply</button>
        </div>
      </div>`;
  }
  document.body.appendChild(overlay);
}

function exchangeTargetChanged() {
  const a = document.getElementById('exchange-target-a')?.value;
  const b = document.getElementById('exchange-target-b')?.value;
  const warn = document.getElementById('exchange-warning');
  const btn = document.getElementById('exchange-apply-btn');
  if (a && b && a === b) {
    if (warn) warn.style.display = '';
    if (btn) btn.disabled = true;
  } else {
    if (warn) warn.style.display = 'none';
    if (btn) btn.disabled = false;
  }
}

function applyDeadpoolTarget(sourceId, targetId) {
  Battlefield.setDeadpoolTarget(sourceId, targetId);
  closeTextChangeModal();
  renderAll();
}

function applyExchangeTargets(sourceId) {
  const a = document.getElementById('exchange-target-a')?.value;
  const b = document.getElementById('exchange-target-b')?.value;
  if (!a || !b || a === b) return;
  Battlefield.setExchangeTargets(sourceId, a, b);
  closeTextChangeModal();
  renderAll();
}

/* ===== Exchange Control Modal ===== */

function openExchangeControlModal(permId) {
  const effect = Battlefield.effects.find(e =>
    e.sourceId === permId && e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl);
  if (!effect) return;

  const mode = effect.params.exchangeMode;
  const finalStates = Battlefield.getAllFinalStates();

  // Build candidate list: all non-manual permanents
  const candidates = Battlefield.permanents.filter(p => {
    if (p.isManualEffect) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    return true;
  });

  // Apply targeting restriction to get final state and filter
  const filterCandidate = (p) => {
    if (!effect.targetRestriction) return true;
    const fs = finalStates.get(p.id);
    const st = fs || {
      types: p.printedTypes || [], supertypes: p.printedSupertypes || [],
      subtypes: p.printedSubtypes || [], colors: p.printedColors || [],
      isAllCreatureTypes: false,
    };
    return effect.targetRestriction(st);
  };

  const overlay = _createModalOverlay('exchange-control-overlay', closeExchangeControlModal);
  const sourcePerm = Battlefield.permanents.find(p => p.id === permId);
  const activePlayerId = sourcePerm?.controller || sourcePerm?.owner || Battlefield.activePlayerId;

  if (mode === 'self_and_target') {
    // Pattern A: source permanent is auto-selected as A, user picks B
    const selfId = effect.params.exchangeSelfId || permId;
    const selfPerm = Battlefield.permanents.find(p => p.id === selfId);
    const targets = candidates.filter(p => {
      if (p.id === selfId) return false;
      if (!filterCandidate(p)) return false;
      if (effect.opponentControlRequired) {
        const ctrl = finalStates.get(p.id)?.controller || p.controller || p.owner;
        if (ctrl === activePlayerId) return false;
      }
      if (effect.neitherOwnNorControl) {
        const owner = p.owner || activePlayerId;
        if (owner === activePlayerId) return false;
      }
      return true;
    });
    const currentB = effect.params.exchangeTargetB || '';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>\u21c4 Exchange Control</h3>
          <button class="modal-close" onclick="closeExchangeControlModal()">\u00d7</button>
        </div>
        <div class="modal-body">
          <div class="modal-section-title">This permanent (fixed):</div>
          <div class="modal-perm-item" style="opacity:0.7;pointer-events:none;margin-bottom:10px;">
            ${selfPerm?.imageUri ? `<img src="${selfPerm.imageUri}" alt="">` : ''}
            <div class="perm-info">
              <div class="perm-name">${escapeHtml(selfPerm?.name || '?')}</div>
            </div>
          </div>
          <div class="modal-section-title">Exchange with:</div>
          <select id="exchctrl-target-b" style="width:100%;padding:7px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
            <option value="">\u2014 Select target \u2014</option>
            ${targets.map(p => {
              const fs = finalStates.get(p.id);
              const typeLine = fs ? [...(fs.supertypes||[]), ...(fs.types||[])].join(' ') : [...(p.printedSupertypes||[]), ...(p.printedTypes||[])].join(' ');
              const ctrl = fs?.controller || p.controller || p.owner;
              const playerTag = Battlefield.players.length > 1 && Battlefield.getPlayerName ? ` [${Battlefield.getPlayerName(ctrl)}]` : '';
              return `<option value="${p.id}" ${p.id === currentB ? 'selected' : ''}>${escapeHtml(p.name)}${p.label ? ' ' + p.label : ''} \u2014 ${escapeHtml(typeLine)}${playerTag}</option>`;
            }).join('') || '<option disabled>No valid targets</option>'}
          </select>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm" onclick="closeExchangeControlModal()">Cancel</button>
          <button class="btn-accent" onclick="applyExchangeControlSelf('${permId}', '${selfId}')">Apply</button>
        </div>
      </div>`;
  } else {
    // Pattern B: two target dropdowns
    const currentA = effect.params.exchangeTargetA || '';
    const currentB = effect.params.exchangeTargetB || '';
    const filtered = candidates.filter(p => filterCandidate(p));

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>\u21c4 Exchange Control</h3>
          <button class="modal-close" onclick="closeExchangeControlModal()">\u00d7</button>
        </div>
        <div class="modal-body">
          ${effect.params.shareTypeRequired ? '<div class="dim" style="margin-bottom:8px;">Targets must share a card type.</div>' : ''}
          ${effect.params.differentPlayersRequired ? '<div class="dim" style="margin-bottom:8px;">Targets must be controlled by different players.</div>' : ''}
          <div class="modal-section-title">Permanent A</div>
          <select id="exchctrl-target-a" onchange="exchCtrlTargetChanged('${permId}')" style="width:100%;padding:7px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
            <option value="">\u2014 Select \u2014</option>
            ${filtered.map(p => {
              const fs = finalStates.get(p.id);
              const typeLine = fs ? [...(fs.supertypes||[]), ...(fs.types||[])].join(' ') : [...(p.printedSupertypes||[]), ...(p.printedTypes||[])].join(' ');
              const ctrl = fs?.controller || p.controller || p.owner;
              const playerTag = Battlefield.players.length > 1 && Battlefield.getPlayerName ? ` [${Battlefield.getPlayerName(ctrl)}]` : '';
              return `<option value="${p.id}" ${p.id === currentA ? 'selected' : ''}>${escapeHtml(p.name)}${p.label ? ' ' + p.label : ''} \u2014 ${escapeHtml(typeLine)}${playerTag}</option>`;
            }).join('')}
          </select>
          <div class="modal-section-title" style="margin-top:10px;">Permanent B</div>
          <select id="exchctrl-target-b" onchange="exchCtrlTargetChanged('${permId}')" style="width:100%;padding:7px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
            <option value="">\u2014 Select \u2014</option>
            ${filtered.map(p => {
              const fs = finalStates.get(p.id);
              const typeLine = fs ? [...(fs.supertypes||[]), ...(fs.types||[])].join(' ') : [...(p.printedSupertypes||[]), ...(p.printedTypes||[])].join(' ');
              const ctrl = fs?.controller || p.controller || p.owner;
              const playerTag = Battlefield.players.length > 1 && Battlefield.getPlayerName ? ` [${Battlefield.getPlayerName(ctrl)}]` : '';
              return `<option value="${p.id}" ${p.id === currentB ? 'selected' : ''}>${escapeHtml(p.name)}${p.label ? ' ' + p.label : ''} \u2014 ${escapeHtml(typeLine)}${playerTag}</option>`;
            }).join('')}
          </select>
          <div id="exchctrl-warning" class="dim" style="margin-top:8px;color:var(--red);display:none;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm" onclick="closeExchangeControlModal()">Cancel</button>
          <button class="btn-accent" id="exchctrl-apply-btn" onclick="applyExchangeControlTwo('${permId}')">Apply</button>
        </div>
      </div>`;
  }

  document.body.appendChild(overlay);
  // Re-filter B options if share-type is required and A is already selected
  if (mode === 'two_targets' && effect.params.exchangeTargetA) exchCtrlTargetChanged(permId);
}

function closeExchangeControlModal() {
  const el = document.getElementById('exchange-control-overlay');
  if (el) el.remove();
}

function exchCtrlTargetChanged(permId) {
  const a = document.getElementById('exchctrl-target-a')?.value;
  const b = document.getElementById('exchctrl-target-b')?.value;
  const warn = document.getElementById('exchctrl-warning');
  const btn = document.getElementById('exchctrl-apply-btn');

  const effect = Battlefield.effects.find(e =>
    e.sourceId === permId && e.type === EFFECT_TYPE.CONTROL && e.params.exchangeControl);

  let warningText = '';
  if (a && b && a === b) {
    warningText = 'Cannot exchange with itself.';
  }

  // Share-type validation
  if (a && b && a !== b && effect?.params?.shareTypeRequired) {
    const finalStates = Battlefield.getAllFinalStates();
    const stA = finalStates.get(a);
    const stB = finalStates.get(b);
    if (stA && stB) {
      const typesA = new Set(stA.types || []);
      const shares = (stB.types || []).some(t => typesA.has(t));
      if (!shares) warningText = 'These permanents do not share a card type.';
    }
  }

  // Different-players validation
  if (a && b && a !== b && effect?.params?.differentPlayersRequired) {
    const finalStates = Battlefield.getAllFinalStates();
    const ctrlA = finalStates.get(a)?.controller;
    const ctrlB = finalStates.get(b)?.controller;
    if (ctrlA && ctrlB && ctrlA === ctrlB) warningText = 'These permanents must be controlled by different players.';
  }

  if (warningText) {
    if (warn) { warn.textContent = warningText; warn.style.display = ''; }
    if (btn) btn.disabled = true;
  } else {
    if (warn) warn.style.display = 'none';
    if (btn) btn.disabled = false;
  }

  // Dynamic B-dropdown filtering for share-type: re-filter options based on A's types
  if (effect?.params?.shareTypeRequired && a) {
    const finalStates = Battlefield.getAllFinalStates();
    const stA = finalStates.get(a);
    const typesA = new Set(stA?.types || []);
    const selB = document.getElementById('exchctrl-target-b');
    if (selB) {
      for (const opt of selB.options) {
        if (!opt.value) continue; // skip placeholder
        const stOpt = finalStates.get(opt.value);
        const shares = stOpt ? (stOpt.types || []).some(t => typesA.has(t)) : true;
        opt.style.display = (opt.value === a || !shares) ? 'none' : '';
      }
    }
  }
}

function applyExchangeControlSelf(sourceId, selfId) {
  const targetId = document.getElementById('exchctrl-target-b')?.value;
  if (!targetId) return;
  Battlefield.setExchangeControlTargets(sourceId, selfId, targetId);
  closeExchangeControlModal();
  renderAll();
}

function applyExchangeControlTwo(sourceId) {
  const a = document.getElementById('exchctrl-target-a')?.value;
  const b = document.getElementById('exchctrl-target-b')?.value;
  if (!a || !b || a === b) return;
  Battlefield.setExchangeControlTargets(sourceId, a, b);
  closeExchangeControlModal();
  renderAll();
}

/* ===== Graveyard Panel & Modal ===== */

function renderGraveyardPanel() {
  const panel = document.getElementById('graveyard-panel');
  if (!panel) return;

  let html = '';
  for (const player of Battlefield.players) {
    const graveyard = player.graveyard || [];
    const count = graveyard.length;
    const topCard = count > 0 ? graveyard[count - 1] : null;
    const playerLabel = Battlefield.players.length > 1
      ? escapeHtml(player.name) + "'s Graveyard"
      : 'Graveyard';
    html += `<div class="graveyard-row" onclick="openGraveyardModal('${player.id}')">
      <span class="graveyard-label">${playerLabel}</span>
      <span class="graveyard-count">${count}</span>
      ${topCard
        ? `<span class="graveyard-top-name dim">${escapeHtml(topCard.name)}</span>`
        : '<span class="graveyard-empty dim">empty</span>'}
    </div>`;
  }

  panel.innerHTML = html || '<div class="dim" style="font-size:11px;padding:4px 0;">No players</div>';
}

let _graveyardModalPlayerId = null;

function openGraveyardModal(playerId) {
  _graveyardModalPlayerId = playerId;
  const player = Battlefield.getPlayer(playerId);
  if (!player) return;

  const graveyard = player.graveyard || [];
  const playerLabel = Battlefield.players.length > 1
    ? escapeHtml(player.name) + "'s Graveyard"
    : 'Graveyard';

  const overlay = _createModalOverlay('graveyard-modal-overlay', closeGraveyardModal);

  overlay.innerHTML = `
    <div class="modal modal-graveyard">
      <div class="modal-header">
        <h3>&#x26B0; ${playerLabel}</h3>
        <button class="modal-close" onclick="closeGraveyardModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-section-title">Add a card to the graveyard:</div>
        <div class="modal-search-bar">
          <input type="text" id="graveyard-search-input" placeholder="Search for a card\u2026" autocomplete="off">
        </div>
        <div class="modal-search-results" id="graveyard-search-results"></div>
        <div class="graveyard-divider"></div>
        <div class="modal-section-title">Cards in graveyard <span class="graveyard-modal-count">(${graveyard.length})</span>:</div>
        <div id="graveyard-card-list">${_renderGraveyardList(graveyard, playerId)}</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm" onclick="closeGraveyardModal()">Close</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  const input = document.getElementById('graveyard-search-input');
  let debounce = null;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) { document.getElementById('graveyard-search-results').innerHTML = ''; return; }
      document.getElementById('graveyard-search-results').innerHTML = '<div class="search-loading">Searching\u2026</div>';
      const cards = await searchScryfall(q);
      _renderGraveyardSearchResults(cards);
    }, 350);
  });
  input.focus();
}

function _renderGraveyardList(graveyard, playerId) {
  if (!graveyard || graveyard.length === 0) {
    return '<div class="graveyard-empty-msg">No cards in graveyard.</div>';
  }
  // Show newest first (top of graveyard = last element in array)
  let html = '<div class="graveyard-list">';
  for (let i = graveyard.length - 1; i >= 0; i--) {
    const card = graveyard[i];
    const isTop = i === graveyard.length - 1;
    const imgUrl = card.image_uris?.small || card.card_faces?.[0]?.image_uris?.small || '';
    html += `<div class="graveyard-card-item${isTop ? ' graveyard-top-card' : ''}">
      ${imgUrl
        ? `<img src="${imgUrl}" alt="" onerror="this.style.display='none'" class="graveyard-card-img">`
        : '<div class="graveyard-card-img-placeholder"></div>'}
      <div class="perm-info">
        <div class="perm-name">${escapeHtml(card.name)}${isTop ? ' <span class="graveyard-top-badge">top</span>' : ''}</div>
        <div class="perm-type">${escapeHtml(card.type_line || '')}</div>
      </div>
      <button class="graveyard-remove-btn" onclick="graveyardRemoveCard('${escapeAttr(playerId)}', ${i})" title="Remove">&times;</button>
    </div>`;
  }
  html += '</div>';
  return html;
}

function _renderGraveyardSearchResults(cards) {
  const container = document.getElementById('graveyard-search-results');
  if (!container) return;
  if (!cards || !cards.length) { container.innerHTML = '<div class="search-empty">No results</div>'; return; }
  container.innerHTML = cards.slice(0, 20).map((card, i) => {
    const imgUrl = card.image_uris?.small || card.card_faces?.[0]?.image_uris?.small || '';
    return `<div class="modal-perm-item" onclick="graveyardAddCard(${i})">
      ${imgUrl ? `<img src="${imgUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <div class="perm-info">
        <div class="perm-name">${escapeHtml(card.name)}</div>
        <div class="perm-type">${escapeHtml(card.type_line || '')}</div>
      </div>
    </div>`;
  }).join('');
}

function graveyardAddCard(idx) {
  const card = _scryfallLastResults[idx];
  if (!card || !_graveyardModalPlayerId) return;
  Battlefield.addToGraveyard(_graveyardModalPlayerId, card);
  renderAll();
  // Refresh list inside the open modal
  const player = Battlefield.getPlayer(_graveyardModalPlayerId);
  if (player) {
    const listEl = document.getElementById('graveyard-card-list');
    if (listEl) listEl.innerHTML = _renderGraveyardList(player.graveyard || [], _graveyardModalPlayerId);
    const countEl = document.querySelector('.graveyard-modal-count');
    if (countEl) countEl.textContent = `(${(player.graveyard || []).length})`;
  }
  // Clear the search field and results
  const input = document.getElementById('graveyard-search-input');
  if (input) input.value = '';
  const results = document.getElementById('graveyard-search-results');
  if (results) results.innerHTML = '';
}

function graveyardRemoveCard(playerId, index) {
  Battlefield.removeFromGraveyard(playerId, index);
  renderAll();
  // Refresh list inside the open modal
  const player = Battlefield.getPlayer(playerId);
  if (player) {
    const listEl = document.getElementById('graveyard-card-list');
    if (listEl) listEl.innerHTML = _renderGraveyardList(player.graveyard || [], playerId);
    const countEl = document.querySelector('.graveyard-modal-count');
    if (countEl) countEl.textContent = `(${(player.graveyard || []).length})`;
  }
}

function closeGraveyardModal() {
  const overlay = document.getElementById('graveyard-modal-overlay');
  if (overlay) overlay.remove();
  _graveyardModalPlayerId = null;
}

/* --- Creature type text-change modal (Artificial Evolution, New Blood) --- */
function openCreatureTypeModal(permId, effect) {
  const currentTarget = effect.targetId || '';
  _textModalReplacements = [...(effect.params.replacements || [])];
  const toType = effect.params.toType || null;
  const excludeTypes = effect.params.excludeTypes || [];

  const overlay = _createModalOverlay('text-modal-overlay', closeTextChangeModal);
  overlay.dataset.excludeTypes = JSON.stringify(excludeTypes);

  let otherPerms = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === permId) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack[0] !== p.id) return false; // non-top mutate members are not valid targets
    return true;
  });
  // Apply target restriction from known ability params (e.g. New Blood: "target creature")
  if (effect.params.targetRestriction) {
    const finalStates = Battlefield.getAllFinalStates();
    otherPerms = otherPerms.filter(p => {
      const fs = finalStates.get(p.id);
      const state = fs || createBaseState(p);
      return effect.params.targetRestriction(state);
    });
  }
  // Apply aura restriction from "Enchant [type]" line
  const _auraR2 = effect.auraRestriction
    || Battlefield.effects.find(e => e.sourceId === permId && e.auraRestriction)?.auraRestriction
    || Battlefield.permanents.find(p => p.id === permId)?._auraRestriction;
  if (_auraR2) {
    otherPerms = otherPerms.filter(p => {
      const st = { types: p.printedTypes || [], supertypes: p.printedSupertypes || [], subtypes: p.printedSubtypes || [] };
      return _auraR2(st);
    });
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>\ud83e\uddec Creature Type Text Change</h3>
        <button class="modal-close" onclick="closeTextChangeModal()">\u00d7</button>
      </div>
      <div class="modal-body">
        <div class="text-change-target">
          <div class="modal-section-title">Target Permanent</div>
          <select id="text-target-select" onchange="creatureTypeTargetSelected()">
            <option value="">\u2014 Select target \u2014</option>
            ${otherPerms.map(p =>
              `<option value="${p.id}" ${p.id === currentTarget ? 'selected' : ''}>${escapeHtml(p.name)}</option>`
            ).join('')}
          </select>
        </div>
        <div id="text-oracle-container"></div>
        <div class="modal-section-title">Replacement</div>
        <div id="text-replacements-list"></div>
        <div id="text-add-section" style="margin-top:10px;">
          <div class="modal-section-title">Change Creature Type</div>
          <div style="display:flex;gap:6px;align-items:center;">
            <div style="flex:1;position:relative;">
              <input type="text" id="creature-type-from" placeholder="Type to search\u2026"
                     autocomplete="off" oninput="creatureTypeAutocomplete('creature-type-from', 'creature-type-from-dropdown')"
                     style="width:100%;padding:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
              <div id="creature-type-from-dropdown" class="creature-type-dropdown"></div>
            </div>
            <span style="color:var(--text-dim)">\u2192</span>
            <div style="flex:1;position:relative;">
              ${toType
                ? `<input type="text" id="creature-type-to" value="${toType}" readonly
                         style="width:100%;padding:5px;background:var(--surface2);color:var(--text-dim);border:1px solid var(--border);border-radius:4px;">`
                : `<input type="text" id="creature-type-to" placeholder="Type to search\u2026"
                         autocomplete="off" oninput="creatureTypeAutocomplete('creature-type-to', 'creature-type-to-dropdown')"
                         style="width:100%;padding:5px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;">
                   <div id="creature-type-to-dropdown" class="creature-type-dropdown"></div>`}
            </div>
            <button class="btn btn-sm" onclick="addCreatureTypeReplacement()">Set</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm" onclick="closeTextChangeModal()">Cancel</button>
        <button class="btn-accent" onclick="applyTextChange()">Apply</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  renderTextReplacements();
  if (currentTarget) creatureTypeTargetSelected();
}

function creatureTypeAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;
  const query = input.value.trim().toLowerCase();
  if (query.length < 1) { dropdown.style.display = 'none'; return; }

  const overlay = document.getElementById('text-modal-overlay');
  const excludeTypes = overlay?.dataset?.excludeTypes ? JSON.parse(overlay.dataset.excludeTypes) : [];
  const excludeSet = new Set(excludeTypes.map(t => t.toLowerCase()));

  let types = TypeCatalog.creatureTypes.size > 0 ? [...TypeCatalog.creatureTypes] :
    ['Human','Elf','Goblin','Merfolk','Zombie','Vampire','Angel','Dragon','Wizard','Warrior',
     'Soldier','Knight','Cleric','Rogue','Shaman','Beast','Elemental','Spirit','Demon','Bird',
     'Cat','Dog','Bear','Faerie','Giant','Dwarf','Treefolk','Saproling','Sliver','Insect',
     'Spider','Snake','Rat','Skeleton','Hydra','Sphinx','Phyrexian','Fungus','Horror','Wurm','Drake'];

  const filtered = types
    .filter(t => t.toLowerCase().startsWith(query) && !excludeSet.has(t.toLowerCase()))
    .slice(0, 10);

  if (filtered.length === 0) { dropdown.style.display = 'none'; return; }
  dropdown.style.display = 'block';
  dropdown.innerHTML = filtered.map(t =>
    `<div class="creature-type-option" onclick="selectCreatureType('${inputId}', '${dropdownId}', '${t}')">${escapeHtml(t)}</div>`
  ).join('');
}

function selectCreatureType(inputId, dropdownId, type) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (input) input.value = type;
  if (dropdown) dropdown.style.display = 'none';
}

function creatureTypeTargetSelected() {
  const targetId = document.getElementById('text-target-select').value;
  const container = document.getElementById('text-oracle-container');
  if (!targetId) { container.innerHTML = ''; return; }
  const perm = Battlefield.permanents.find(p => p.id === targetId);
  if (!perm) { container.innerHTML = ''; return; }

  const creatureTypes = TypeCatalog.creatureTypes.size > 0 ? [...TypeCatalog.creatureTypes] : [];
  // Show text as it appears after earlier Layer 3 effects
  const layer3Text = Battlefield.getLayer3Text(targetId, _textModalSourceId);
  const layer3Subtypes = Battlefield.getLayer3Subtypes(targetId, _textModalSourceId);

  // If target is top of a mutate stack, merge abilities from all cards in the stack
  const mutateStack = Battlefield.getStack(targetId);
  let displayOracleText = layer3Text;
  if (mutateStack && mutateStack[0] === targetId && mutateStack.length > 1) {
    const topLines = layer3Text.split('\n').map(l => l.trim()).filter(Boolean);
    const seenAb = new Set(topLines.map(l => l.toLowerCase()));
    const allLines = [...topLines];
    for (let i = 1; i < mutateStack.length; i++) {
      const stackText = Battlefield.getLayer3Text(mutateStack[i], _textModalSourceId);
      for (const line of stackText.split('\n').map(l => l.trim()).filter(Boolean)) {
        const lw = line.toLowerCase();
        const allowDup = /^(?:at|when|whenever)\b/.test(lw) || /\bat the beginning\b|\bwhenever\b/i.test(lw) || /^ward\b/i.test(lw);
        if (allowDup || !seenAb.has(lw)) { seenAb.add(lw); allLines.push(line); }
      }
    }
    displayOracleText = allLines.join('\n');
  }
  let html = escapeHtml(displayOracleText);
  // Build a combined set of words to highlight: each creature type + its plural form
  // When clicking a plural, we auto-fill the singular form (since replacements work on singular)
  const highlightWords = []; // { word, singularForm }
  const alreadyHighlighted = new Set();
  for (const ct of creatureTypes) {
    if (!alreadyHighlighted.has(ct.toLowerCase())) {
      highlightWords.push({ word: ct, singularForm: ct });
      alreadyHighlighted.add(ct.toLowerCase());
    }
    // Also highlight the plural form if present in text
    if (typeof pluralizeCreatureType === 'function') {
      const plural = pluralizeCreatureType(ct);
      if (plural.toLowerCase() !== ct.toLowerCase() && !alreadyHighlighted.has(plural.toLowerCase())) {
        highlightWords.push({ word: plural, singularForm: ct });
        alreadyHighlighted.add(plural.toLowerCase());
      }
    }
  }
  for (const st of layer3Subtypes) {
    if (!alreadyHighlighted.has(st.toLowerCase())) {
      highlightWords.push({ word: st, singularForm: st });
      alreadyHighlighted.add(st.toLowerCase());
    }
    if (typeof pluralizeCreatureType === 'function') {
      const plural = pluralizeCreatureType(st);
      if (plural.toLowerCase() !== st.toLowerCase() && !alreadyHighlighted.has(plural.toLowerCase())) {
        highlightWords.push({ word: plural, singularForm: st });
        alreadyHighlighted.add(plural.toLowerCase());
      }
    }
  }
  // Sort longest-first to avoid partial matches
  highlightWords.sort((a, b) => b.word.length - a.word.length);
  for (const { word, singularForm } of highlightWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b(' + escaped + ')\\b', 'gi');
    // When clicking, auto-fill the singular form for the replacement
    const safeSingular = singularForm.replace(/'/g, "\\'");
    html = html.replace(regex, `<span class="text-editable-word creature-type-word" title="Click to select: ${singularForm}" onclick="selectCreatureTypeWord('${safeSingular}')">$1</span>`);
  }
  // Build type line using computed state (post Layer 1 + Layer 4) so copies and type-changes are reflected
  const finalStates = Battlefield.getAllFinalStates();
  const fs = finalStates.get(targetId);
  const fullTypes = fs ? (fs.types || []) : (perm.printedTypes || []);
  const fullSupertypes = fs ? (fs.supertypes || []) : (perm.printedSupertypes || []);
  const typeLineParts = escapeHtml([...fullSupertypes, ...fullTypes].join(' '));
  const clickableSubtypes = layer3Subtypes
    .map(st => `<span class="text-editable-word creature-type-word" title="Click to select" onclick="selectCreatureTypeWord('${escapeAttr(st)}')">${escapeHtml(st)}</span>`)
    .join(' ');
  const typeLineDisplay = typeLineParts + (layer3Subtypes.length ? '  —  ' + clickableSubtypes : '');
  container.innerHTML = `
    ${perm.imageUri || perm.name ? `<div class="copy-editor-banner" style="margin-bottom:8px;">
      ${perm.imageUri ? `<img src="${perm.imageUri}" alt="" class="copy-editor-thumb">` : ''}
      <div>
        <div style="font-weight:600;font-size:13px;">${escapeHtml(perm.name)}</div>
        <div class="dim" style="font-size:11px;">${escapeHtml([...fullSupertypes, ...fullTypes].join(' ') + (layer3Subtypes.length ? ' — ' + layer3Subtypes.join(' ') : ''))}</div>
      </div>
    </div>` : ''}
    ${typeLineDisplay ? `<div class="modal-section-title">Type Line (click a subtype to select it)</div><div class="text-oracle-display" style="margin-bottom:8px;">${typeLineDisplay}</div>` : ''}
    <div class="modal-section-title">Oracle Text (click a creature type to select it)</div>
    <div class="text-oracle-display">${html}</div>`;
}

/* Fix 9: Auto-fill the "from" field when clicking a creature type word */
function selectCreatureTypeWord(word) {
  const fromInput = document.getElementById('creature-type-from');
  if (fromInput) {
    fromInput.value = word;
    // Highlight the clicked word AND its plural/singular forms
    const wordLow = word.toLowerCase();
    const plural = typeof pluralizeCreatureType === 'function' ? pluralizeCreatureType(word).toLowerCase() : '';
    const singular = typeof singularizeCreatureType === 'function' ? singularizeCreatureType(word).toLowerCase() : '';
    const matchSet = new Set([wordLow, plural, singular].filter(Boolean));
    document.querySelectorAll('.creature-type-word').forEach(el => {
      el.classList.toggle('selected', matchSet.has(el.textContent.toLowerCase()));
    });
  }
}

function addCreatureTypeReplacement() {
  const from = document.getElementById('creature-type-from')?.value?.trim();
  const to = document.getElementById('creature-type-to')?.value?.trim();
  if (!from || !to || from.toLowerCase() === to.toLowerCase()) return;
  // Fix 9: Validate that "to" type is not Wall for Artificial Evolution
  const overlay = document.getElementById('text-modal-overlay');
  const excludeTypes = overlay?.dataset?.excludeTypes ? JSON.parse(overlay.dataset.excludeTypes) : [];
  if (excludeTypes.map(t => t.toLowerCase()).includes(to.toLowerCase())) {
    alert(`Cannot choose "${to}"  —  pick a non-${to} creature type.`);
    return;
  }
  _textModalReplacements = _textModalReplacements.filter(r => r.from.toLowerCase() !== from.toLowerCase());
  _textModalReplacements.push({ from, to });
  renderTextReplacements();
}

/* --- Common helpers --- */
function getTextChangeMaxReps() {
  if (!_textModalSourceId) return 1;
  const effect = Battlefield.effects.find(e => e.sourceId === _textModalSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  return effect?.params?.maxReplacements || 1;
}

function updateTextAddSectionVisibility() {
  const addSection = document.getElementById('text-add-section');
  if (!addSection) return;
  addSection.style.display = _textModalReplacements.length >= getTextChangeMaxReps() ? 'none' : '';
}

function getReplacementOptionsForWord(word, changeType) {
  const w = word.toLowerCase();
  const colors = ['white', 'blue', 'black', 'red', 'green'];
  const lands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
  const isColor = colors.includes(w);
  const isLand = lands.map(l => l.toLowerCase()).includes(w);
  if (isColor && changeType !== 'land_only') return colors.filter(c => c !== w);
  if (isLand && changeType !== 'color_only') return lands.filter(l => l.toLowerCase() !== w);
  let all = [];
  if (changeType !== 'land_only') all.push(...colors);
  if (changeType !== 'color_only') all.push(...lands);
  return all.filter(x => x.toLowerCase() !== w);
}

function populateTextDropdowns(changeType, preselectedFrom) {
  const fromSelect = document.getElementById('text-from-select');
  const toSelect = document.getElementById('text-to-select');
  if (!fromSelect || !toSelect) return;
  const colors = ['white', 'blue', 'black', 'red', 'green'];
  const lands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
  let words = [];
  if (changeType === 'color_or_land') words = [...colors, ...lands];
  else if (changeType === 'land_only') words = [...lands];
  else if (changeType === 'color_only') words = [...colors];
  fromSelect.innerHTML = words.map(w =>
    `<option value="${w}" ${preselectedFrom && w.toLowerCase() === preselectedFrom.toLowerCase() ? 'selected' : ''}>${w}</option>`
  ).join('');
  updateToOptions();
}

function updateToOptions() {
  const fromSelect = document.getElementById('text-from-select');
  const toSelect = document.getElementById('text-to-select');
  if (!fromSelect || !toSelect) return;
  const effect = Battlefield.effects.find(e => e.sourceId === _textModalSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  const changeType = effect?.params.changeType || 'color_or_land';
  const options = getReplacementOptionsForWord(fromSelect.value, changeType);
  toSelect.innerHTML = options.map(w => `<option value="${w}">${w}</option>`).join('');
}

function textChangeTargetSelected() {
  const targetId = document.getElementById('text-target-select').value;
  const container = document.getElementById('text-oracle-container');
  if (!targetId) { container.innerHTML = ''; return; }
  const perm = Battlefield.permanents.find(p => p.id === targetId);
  if (!perm) { container.innerHTML = ''; return; }

  const effect = Battlefield.effects.find(e => e.sourceId === _textModalSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  const changeType = effect?.params.changeType || 'color_or_land';
  const colors = ['white', 'blue', 'black', 'red', 'green'];
  const lands = ['plains', 'island', 'swamp', 'mountain', 'forest'];
  const landPlurals = ['plains', 'islands', 'swamps', 'mountains', 'forests'];
  let editableWords = [];
  if (changeType !== 'land_only') editableWords.push(...colors);
  if (changeType !== 'color_only') {
    editableWords.push(...lands);
    // Also highlight plural forms so "Mountains" etc. are fully highlighted
    for (const pl of landPlurals) {
      if (!editableWords.includes(pl)) editableWords.push(pl);
    }
  }

  // Show text as it appears after earlier Layer 3 effects (Fix 6)
  const layer3Text = Battlefield.getLayer3Text(targetId, _textModalSourceId);
  // If target is top of a mutate stack, merge abilities from all cards in the stack
  const mutateStackTC = Battlefield.getStack(targetId);
  let displayText = layer3Text;
  if (mutateStackTC && mutateStackTC[0] === targetId && mutateStackTC.length > 1) {
    const topLines = layer3Text.split('\n').map(l => l.trim()).filter(Boolean);
    const seenAb = new Set(topLines.map(l => l.toLowerCase()));
    const allLines = [...topLines];
    for (let i = 1; i < mutateStackTC.length; i++) {
      const stackText = Battlefield.getLayer3Text(mutateStackTC[i], _textModalSourceId);
      for (const line of stackText.split('\n').map(l => l.trim()).filter(Boolean)) {
        const lw = line.toLowerCase();
        const allowDup = /^(?:at|when|whenever)\b/.test(lw) || /\bat the beginning\b|\bwhenever\b/i.test(lw) || /^ward\b/i.test(lw);
        if (allowDup || !seenAb.has(lw)) { seenAb.add(lw); allLines.push(line); }
      }
    }
    displayText = allLines.join('\n');
  }
  let html = escapeHtml(displayText);
  // Sort longest-first so "mountains" highlights before "mountain" could partially match
  const sortedWords = [...editableWords].sort((a, b) => b.length - a.length);
  for (const word of sortedWords) {
    const regex = new RegExp('(' + word + ')(?![a-z])', 'gi');
    html = html.replace(regex, `<span class="text-editable-word" onclick="selectEditableWord('$1')" title="Click to change">$1</span>`);
  }
  // Get final state for card display
  const finalStatesTC = Battlefield.getAllFinalStates();
  const fsTC = finalStatesTC.get(targetId);
  const displayName = fsTC ? fsTC.name : perm.name;
  const displayTypes = fsTC ? [...(fsTC.supertypes || []), ...(fsTC.types || [])].join(' ') + (fsTC.subtypes?.length ? ' — ' + fsTC.subtypes.join(' ') : '')
    : [...(perm.printedSupertypes || []), ...(perm.printedTypes || [])].join(' ');
  container.innerHTML = `
    <div class="copy-editor-banner" style="margin-bottom:8px;">
      ${perm.imageUri ? `<img src="${perm.imageUri}" alt="" class="copy-editor-thumb">` : ''}
      <div>
        <div style="font-weight:600;font-size:13px;">${escapeHtml(displayName)}</div>
        <div class="dim" style="font-size:11px;">${escapeHtml(displayTypes)}</div>
      </div>
    </div>
    <div class="modal-section-title">Oracle Text (click a highlighted word)</div>
    <div class="text-oracle-display">${html}</div>`;
  populateTextDropdowns(changeType, null);
}

function selectEditableWord(word) {
  // Map plural land forms to singular for the "from" dropdown
  const PLURAL_TO_SINGULAR_LAND = {
    'islands': 'Island', 'swamps': 'Swamp', 'mountains': 'Mountain', 'forests': 'Forest'
    // Plains is the same singular/plural — no mapping needed
  };
  const singularWord = PLURAL_TO_SINGULAR_LAND[word.toLowerCase()] || word;
  _textModalSelectedWord = singularWord;
  const effect = Battlefield.effects.find(e => e.sourceId === _textModalSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  const changeType = effect?.params.changeType || 'color_or_land';
  populateTextDropdowns(changeType, singularWord);
  // Highlight both singular and plural forms of the word
  const wordLow = word.toLowerCase();
  const singLow = singularWord.toLowerCase();
  document.querySelectorAll('.text-editable-word').forEach(el => {
    const elLow = el.textContent.toLowerCase();
    el.classList.toggle('selected', elLow === wordLow || elLow === singLow);
  });
}

function renderTextReplacements() {
  const container = document.getElementById('text-replacements-list');
  if (!container) return;
  if (!_textModalReplacements.length) {
    container.innerHTML = '<div class="dim" style="padding:4px 0">No replacements yet</div>';
    return;
  }
  // Check if this is a creature_type or land change to show plural info
  const effect = Battlefield.effects.find(e => e.sourceId === _textModalSourceId && e.type === EFFECT_TYPE.TEXT_CHANGE);
  const isCreatureType = effect?.params?.changeType === 'creature_type';
  const isLandType = effect?.params?.changeType === 'color_or_land' || effect?.params?.changeType === 'land_only';
  container.innerHTML = _textModalReplacements.map((r, i) => {
    let pluralInfo = '';
    if (isCreatureType && typeof pluralizeCreatureType === 'function') {
      const fromPlural = pluralizeCreatureType(r.from);
      const toPlural = pluralizeCreatureType(r.to);
      if (fromPlural.toLowerCase() !== r.from.toLowerCase() ||
          toPlural.toLowerCase() !== r.to.toLowerCase()) {
        pluralInfo = `<div class="dim" style="font-size:0.85em;margin-left:4px;">(also: ${escapeHtml(fromPlural)} \u2192 ${escapeHtml(toPlural)})</div>`;
      }
    }
    if (isLandType && typeof buildLandTypeReplacementPairs === 'function') {
      const pairs = buildLandTypeReplacementPairs(r.from, r.to);
      const extra = pairs.filter(p => p.from.toLowerCase() !== r.from.toLowerCase());
      if (extra.length) {
        pluralInfo = `<div class="dim" style="font-size:0.85em;margin-left:4px;">(also: ${extra.map(p => escapeHtml(p.from) + ' \u2192 ' + escapeHtml(p.to)).join(', ')})</div>`;
      }
    }
    return `
    <div class="text-replacement-row">
      <span class="from">${escapeHtml(r.from)}</span>
      <span class="arrow">\u2192</span>
      <span class="to">${escapeHtml(r.to)}</span>
      <button onclick="removeTextReplacement(${i})" title="Remove">\u00d7</button>
    </div>${pluralInfo}`;
  }).join('');
}

function addTextReplacement() {
  const from = document.getElementById('text-from-select').value;
  const to = document.getElementById('text-to-select').value;
  if (!from || !to || from.toLowerCase() === to.toLowerCase()) return;
  _textModalReplacements = _textModalReplacements.filter(r => r.from.toLowerCase() !== from.toLowerCase());
  _textModalReplacements.push({ from, to });
  renderTextReplacements();
  updateTextAddSectionVisibility();
}

function removeTextReplacement(index) {
  _textModalReplacements.splice(index, 1);
  renderTextReplacements();
  updateTextAddSectionVisibility();
}

function applyTextChange() {
  const targetSelect = document.getElementById('text-target-select');
  const targetId = targetSelect ? targetSelect.value : null;
  if (targetSelect && !targetId) { alert('Please select a target permanent.'); return; }
  Battlefield.setTextChangeConfig(_textModalSourceId, targetId, _textModalReplacements);
  closeTextChangeModal();
  renderAll();
}

function closeTextChangeModal() {
  const overlay = document.getElementById('text-modal-overlay');
  if (overlay) overlay.remove();
  _textModalSourceId = null;
  _textModalReplacements = [];
  _textModalSelectedWord = null;
}
/* [END: MODAL-TEXT] */


/* [KEY: MODAL-MUTATE]  —  Mutate position selection + target selection modal */
function openMutateModal(permId) {
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;

  // Find non-Human creature targets (other than this card itself or cards in its own stack)
  const myStack = Battlefield.getStack(permId) || [];
  const finalStates = Battlefield.getAllFinalStates();

  // Valid targets: non-Human creatures not in this card's own stack
  const validTargets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === permId) return false;
    if (myStack.includes(p.id)) return false; // can't mutate within same stack
    const fs = finalStates.get(p.id);
    const types = fs ? fs.types : p.printedTypes;
    const subtypes = fs ? fs.subtypes : (p.printedSubtypes || []);
    return types.includes('Creature') && !subtypes.includes('Human');
  });

  // Determine currently selected target (if already in a stack together)
  const currentStack = Battlefield.getStack(permId);
  let currentTargetId = '';
  if (currentStack) {
    const pos = currentStack.indexOf(permId);
    // Current adjacent card in the stack
    if (pos === 0) currentTargetId = currentStack[1] || '';
    else currentTargetId = currentStack[pos - 1] || '';
  }

  // Figure out current position in the stack
  const currentPos = currentStack
    ? (currentStack[0] === permId ? 'top' : 'under')
    : 'top';

  // Group targets: standalone vs already-in-a-stack
  const standaloneTargets = validTargets.filter(p => !Battlefield.getStack(p.id));
  const stackedTargets = validTargets.filter(p => {
    const s = Battlefield.getStack(p.id);
    return s && s.length >= 2;
  });
  // Deduplicate stacked targets — show one entry per stack (representing the whole stack)
  const shownStackIds = new Set();
  const stackTargetGroups = [];
  for (const p of stackedTargets) {
    const s = Battlefield.getStack(p.id);
    const key = s.join(',');
    if (!shownStackIds.has(key)) {
      shownStackIds.add(key);
      stackTargetGroups.push({ stack: s, perms: s.map(id => Battlefield.permanents.find(pp => pp.id === id)).filter(Boolean) });
    }
  }

  const overlay = _createModalOverlay('mutate-modal-overlay', closeMutateModal);

  function targetItem(t, targetIdToUse) {
    const fs = finalStates.get(t.id);
    const name = fs ? fs.name : t.name;
    const types = fs ? [...(fs.supertypes||[]), ...(fs.types||[])].join(' ') : [...t.printedSupertypes, ...t.printedTypes].join(' ');
    const subs = fs ? (fs.subtypes||[]) : (t.printedSubtypes||[]);
    const typeStr = subs.length ? types + ' — ' + subs.join(' ') : types;
    return `<div class="modal-perm-item ${targetIdToUse === currentTargetId ? 'mutate-target-selected' : ''}" onclick="selectMutateTarget('${permId}', '${targetIdToUse}', this)">
      ${t.imageUri ? `<img src="${t.imageUri}" alt="">` : ''}
      <div class="perm-info">
        <div class="perm-name">${escapeHtml(name)}</div>
        <div class="perm-type">${escapeHtml(typeStr)}</div>
      </div>
    </div>`;
  }

  let targetsHtml = '';
  if (standaloneTargets.length === 0 && stackTargetGroups.length === 0) {
    targetsHtml = '<div class="dim" style="padding:8px 0">No valid non-Human creatures on the battlefield.</div>';
  } else {
    if (standaloneTargets.length > 0) {
      targetsHtml += `<div class="modal-perm-list">${standaloneTargets.map(t => targetItem(t, t.id)).join('')}</div>`;
    }
    if (stackTargetGroups.length > 0) {
      targetsHtml += `<div class="modal-section-title">Existing Mutate Stacks</div>`;
      for (const grp of stackTargetGroups) {
        const topPerm = grp.perms[0];
        const topFs = finalStates.get(topPerm ? topPerm.id : '');
        const stackName = topFs ? topFs.name : (topPerm ? topPerm.name : 'Stack');
        // Use top card's id as the target id for the whole stack
        targetsHtml += `<div class="mutate-stack-group">
          <div class="mutate-stack-group-label">Mutate: ${escapeHtml(stackName)} (${grp.perms.length} cards)</div>
          <div class="modal-perm-list">${grp.perms.map(t => targetItem(t, t.id)).join('')}</div>
        </div>`;
      }
    }
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Mutate - ${escapeHtml(perm.name)}</h3>
        <button class="modal-close" onclick="closeMutateModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-section-title">Position</div>
        <div class="mutate-position-row">
          <label class="mutate-position-label">
            <input type="radio" name="mutate-pos" value="top" ${currentPos === 'top' ? 'checked' : ''}>
            <span><strong>On top</strong> — this card's name, types &amp; P/T become the merged creature's identity; it gains all abilities from the stack</span>
          </label>
          <label class="mutate-position-label">
            <input type="radio" name="mutate-pos" value="under" ${currentPos === 'under' ? 'checked' : ''}>
            <span><strong>Under</strong> — goes under the target (or stack); target's top card keeps its identity; this card contributes its abilities</span>
          </label>
        </div>
        <div class="modal-section-title">Select Non-Human Creature Target</div>
        ${targetsHtml}
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm" onclick="closeMutateModal()">Cancel</button>
        <button class="btn-accent" onclick="applyMutateModal('${permId}')">Apply Mutate</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Pre-select the currently tracked target if any
  if (currentTargetId) {
    _mutateSelectedTargetId = currentTargetId;
  }
}

let _mutateSelectedTargetId = null;

function selectMutateTarget(mutaterId, targetId, el) {
  _mutateSelectedTargetId = targetId;
  // Highlight selection — clear across the entire modal
  document.querySelectorAll('#mutate-modal-overlay .modal-perm-item').forEach(item => {
    item.classList.remove('mutate-target-selected');
  });
  el.classList.add('mutate-target-selected');
}

function applyMutateModal(mutaterId) {
  const posInput = document.querySelector('input[name="mutate-pos"]:checked');
  const position = posInput ? posInput.value : 'top';

  if (!_mutateSelectedTargetId) {
    alert('Please select a target creature.');
    return;
  }

  Battlefield.applyMutate(mutaterId, _mutateSelectedTargetId, position);
  _mutateSelectedTargetId = null;
  closeMutateModal();
  renderAll();
  // Re-select the currently inspected permanent so the inspector reflects the new mutate state
  if (Battlefield.inspectedId) {
    selectPermanent(Battlefield.inspectedId);
  }
}

function closeMutateModal() {
  const overlay = document.getElementById('mutate-modal-overlay');
  if (overlay) overlay.remove();
  _mutateSelectedTargetId = null;
}

function removeMutate(permId) {
  Battlefield.removeMutate(permId);
  renderAll();
}
/* [END: MODAL-MUTATE] */


/* [KEY: MODAL-BESTOW]  —  Bestow target selection modal */
function openBestowModal(permId) {
  const perm = Battlefield.permanents.find(p => p.id === permId);
  if (!perm) return;

  const finalStates = Battlefield.getAllFinalStates();
  const currentTargetId = Battlefield.getBestowTarget(permId) || '';

  const bestowCtrl = perm.controller || perm.owner || 'player_0';
  // Valid targets: any creature on the battlefield that is not the bestow creature itself.
  // Non-top mutate stack members are not independently targetable (CR 702.140 — stack is one permanent).
  const validTargets = Battlefield.permanents.filter(p => {
    if (p.isManualEffect || p.id === permId) return false;
    const fs = finalStates.get(p.id);
    const types = fs ? fs.types : (p.printedTypes || []);
    if (!types.includes('Creature')) return false;
    const stack = Battlefield.getStack(p.id);
    if (stack && stack.length >= 2 && stack[0] !== p.id) return false;
    const tAbilities = fs ? (fs.abilities || []) : [];
    // Shroud prevents being targeted by anyone
    if (tAbilities.some(a => /\bshroud\b/i.test(a))) return false;
    // Hexproof prevents being targeted by opponents
    const tCtrl = p.controller || p.owner || 'player_0';
    if (tCtrl !== bestowCtrl && tAbilities.some(a => /\bhexproof\b/i.test(a))) return false;
    return true;
  });

  const overlay = _createModalOverlay('bestow-modal-overlay', closeBestowModal);

  function targetItem(t) {
    const fs = finalStates.get(t.id);
    const name = fs ? fs.name : t.name;
    const supTypes = fs ? [...(fs.supertypes||[]), ...(fs.types||[])].join(' ') : [...(t.printedSupertypes||[]), ...(t.printedTypes||[])].join(' ');
    const subs = fs ? (fs.subtypes||[]) : (t.printedSubtypes||[]);
    const typeStr = subs.length ? supTypes + ' — ' + subs.join(' ') : supTypes;
    const sel = t.id === currentTargetId ? 'bestow-target-selected' : '';
    const img = t.imageUri ? '<img src="' + escapeAttr(t.imageUri) + '" alt="">' : '';
    return '<div class="modal-perm-item ' + sel + '" onclick="selectBestowTarget(\'' + permId + '\', \'' + t.id + '\', this)">'
      + img
      + '<div class="perm-info">'
      + '<div class="perm-name">' + escapeHtml(name) + '</div>'
      + '<div class="perm-type">' + escapeHtml(typeStr) + '</div>'
      + '</div></div>';
  }

  const targetsHtml = validTargets.length === 0
    ? '<div class="dim" style="padding:8px 0">No creatures on the battlefield to enchant.</div>'
    : '<div class="modal-perm-list">' + validTargets.map(t => targetItem(t)).join('') + '</div>';

  overlay.innerHTML = '<div class="modal">'
    + '<div class="modal-header">'
    + '<h3>Bestow - ' + escapeHtml(perm.name) + '</h3>'
    + '<button class="modal-close" onclick="closeBestowModal()">×</button>'
    + '</div>'
    + '<div class="modal-body">'
    + '<p class="dim" style="margin-bottom:10px;font-size:0.85em">'
    + 'CR 702.102: While enchanting a creature via bestow, this card is an Aura enchantment, not a creature. '
    + 'If the enchanted creature leaves the battlefield, this card becomes a creature again.'
    + '</p>'
    + '<div class="modal-section-title">Select Creature to Enchant</div>'
    + targetsHtml
    + '</div>'
    + '<div class="modal-footer">'
    + '<button class="btn btn-sm" onclick="closeBestowModal()">Cancel</button>'
    + '<button class="btn-accent" onclick="applyBestowModal(\'' + permId + '\')">Apply Bestow</button>'
    + '</div></div>';

  document.body.appendChild(overlay);

  if (currentTargetId) {
    _bestowSelectedTargetId = currentTargetId;
  }
}

let _bestowSelectedTargetId = null;

function selectBestowTarget(bestowPermId, targetId, el) {
  _bestowSelectedTargetId = targetId;
  document.querySelectorAll('#bestow-modal-overlay .modal-perm-item').forEach(item => {
    item.classList.remove('bestow-target-selected');
  });
  el.classList.add('bestow-target-selected');
}

function applyBestowModal(bestowPermId) {
  if (!_bestowSelectedTargetId) {
    alert('Please select a creature to enchant.');
    return;
  }
  Battlefield.applyBestow(bestowPermId, _bestowSelectedTargetId);
  _bestowSelectedTargetId = null;
  closeBestowModal();
  renderAll();
  if (Battlefield.inspectedId) {
    selectPermanent(Battlefield.inspectedId);
  }
}

function closeBestowModal() {
  const overlay = document.getElementById('bestow-modal-overlay');
  if (overlay) overlay.remove();
  _bestowSelectedTargetId = null;
}

function removeBestow(permId) {
  Battlefield.removeBestow(permId);
  renderAll();
}
/* [END: MODAL-BESTOW] */


/* [KEY: HELPERS] */
/* Strip MTG reminder text (text in parentheses) from oracle text.
   Lines that become empty after stripping are removed. */
function _stripReminderText(text) {
  return (text || '').split('\n').map(line =>
    line.replace(/\([^)]+\)/g, '').replace(/\s+/g, ' ').trim()
  ).filter(Boolean).join('\n');
}
function escapeHtml(str) {
  if (!str) return '';
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}
function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/* [END: HELPERS] */
