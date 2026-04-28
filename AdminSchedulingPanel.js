    const AdminSchedulingPanel = ({ blockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd, handleStartDateChange, handleEndDateChange, setDateWindowStart, setDateWindowEnd, toggleBlockedDate, toggleBlockedWeekday, isDateBlocked, bookedLessons, cancelledLessons, firstAvailableDate, saveSettings, weekdayTimeSettings, setWeekdayTimeSettings, dateTimeSettings, setDateTimeSettings, pools, setPools, poolSettings, setPoolSettings, savePools, savePoolSettings, poolSaveError, setPoolSaveError }) => {
        const [currentDate, setCurrentDate] = useState(new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1));
        const [editingWeekday, setEditingWeekday] = useState(null);
        const [tempTimes, setTempTimes] = useState([]);
        const [showTimeWarning, setShowTimeWarning] = useState(false);
        const [pendingEditDay, setPendingEditDay] = useState(null);
        const [lessonsOnPendingDay, setLessonsOnPendingDay] = useState(0);
        // Pool management state
        const [selectedAdminPool, setSelectedAdminPool] = useState('');
        const [showAddPoolForm, setShowAddPoolForm] = useState(false);
        const [newPoolName, setNewPoolName] = useState('');
        const [newPoolAddress, setNewPoolAddress] = useState('');
        const [editingPoolId, setEditingPoolId] = useState(null);
        const [editPoolName, setEditPoolName] = useState('');
        const [editPoolAddress, setEditPoolAddress] = useState('');
        const [showDeletePoolConfirm, setShowDeletePoolConfirm] = useState(false);
        const [deletingPool, setDeletingPool] = useState(null);
        // Per-date editor state
        const [editingDate, setEditingDate] = useState(null); // { year, month, day, dateKey }
        const [dateEditTimes, setDateEditTimes] = useState([]);
        const [dateEditCustomize, setDateEditCustomize] = useState(false);
        const [dateEditBlocked, setDateEditBlocked] = useState(false);
        const getMonthData = (date) => ({ year: date.getFullYear(), month: date.getMonth(), firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(), daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() });
        const getActiveLessons = (dateKey) => (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
        const { year, month, firstDay, daysInMonth } = getMonthData(currentDate);
        const monthName = currentDate.toLocaleString('default', { month: 'long' });

        // Pool management helpers
        const addPool = () => {
            if (!newPoolName.trim()) return;
            const id = `pool-${Date.now()}`;
            const newPools = [...(pools || []), { id, name: newPoolName.trim(), address: newPoolAddress.trim() }];
            setPools(newPools);
            savePools(newPools);
            const newPs = { ...(poolSettings || {}), [id]: { weekdayTimeSettings: {}, dateWindowStart: '', dateWindowEnd: '', blockedDates: [], blockedWeekdays: [] } };
            setPoolSettings(newPs);
            savePoolSettings(newPs);
            setNewPoolName('');
            setNewPoolAddress('');
            setShowAddPoolForm(false);
            setSelectedAdminPool(id);
        };

        const savePoolEdit = () => {
            if (!editingPoolId || !editPoolName.trim()) return;
            const newPools = (pools || []).map(p => p.id === editingPoolId ? { ...p, name: editPoolName.trim(), address: editPoolAddress.trim() } : p);
            setPools(newPools);
            savePools(newPools);
            setEditingPoolId(null);
        };

        const confirmDeletePool = () => {
            if (!deletingPool) return;
            const newPools = (pools || []).filter(p => p.id !== deletingPool.id);
            setPools(newPools);
            savePools(newPools);
            const newPs = { ...(poolSettings || {}) };
            delete newPs[deletingPool.id];
            setPoolSettings(newPs);
            savePoolSettings(newPs);
            if (selectedAdminPool === deletingPool.id) setSelectedAdminPool('');
            setDeletingPool(null);
            setShowDeletePoolConfirm(false);
        };

        const getPoolLessonCount = (poolId) => {
            let count = 0;
            const today = new Date(); today.setHours(0,0,0,0);
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                if (new Date(y, m, d) >= today) {
                    lessons.forEach(l => {
                        if (l.poolId === poolId && !cancelledLessons.has(`${dateKey}-${l.time}`)) count++;
                    });
                }
            });
            return count;
        };

        // Per-pool setting helpers
        const getPoolSetting = (key, fallback = null) => {
            if (!selectedAdminPool || !poolSettings || !poolSettings[selectedAdminPool]) return fallback;
            return poolSettings[selectedAdminPool][key] ?? fallback;
        };

        const updatePoolSetting = (key, value) => {
            if (!selectedAdminPool) return;
            const current = poolSettings && poolSettings[selectedAdminPool] ? poolSettings[selectedAdminPool] : { weekdayTimeSettings: {}, dateWindowStart: '', dateWindowEnd: '', blockedDates: [], blockedWeekdays: [] };
            const newPs = { ...(poolSettings || {}), [selectedAdminPool]: { ...current, [key]: value } };
            setPoolSettings(newPs);
            savePoolSettings(newPs);
        };

        // Count lessons on a specific weekday for the selected pool
        const countLessonsOnWeekday = (dayIndex) => {
            const today = new Date(); today.setHours(0,0,0,0);
            let count = 0;

            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                if (lessonDate.getDay() === dayIndex && lessonDate >= today) {
                    lessons.forEach(lesson => {
                        // Count only lessons at the selected admin pool (or all if no pool selected)
                        const poolMatch = !selectedAdminPool || lesson.poolId === selectedAdminPool;
                        if (poolMatch && !cancelledLessons.has(`${dateKey}-${lesson.time}`)) {
                            count++;
                        }
                    });
                }
            });

            return count;
        };

        const handleEditClick = (dayIndex, currentTimes) => {
            const lessonCount = countLessonsOnWeekday(dayIndex);
            if (lessonCount > 0) {
                setPendingEditDay(dayIndex);
                setLessonsOnPendingDay(lessonCount);
                setTempTimes([...currentTimes]);
                setShowTimeWarning(true);
            } else {
                setEditingWeekday(dayIndex);
                setTempTimes([...currentTimes]);
            }
        };

        const confirmTimeEdit = () => {
            setEditingWeekday(pendingEditDay);
            setShowTimeWarning(false);
            setPendingEditDay(null);
        };

        // Weekday header is red only when that day has no time slots configured
        const isWeekdayBlocked = (dayIndex) => {
            const source = selectedAdminPool && poolSettings && poolSettings[selectedAdminPool]
                ? (poolSettings[selectedAdminPool].weekdayTimeSettings || {})
                : weekdayTimeSettings;
            const dayTimes = source[dayIndex];
            if (dayTimes !== undefined && dayTimes.length === 0) return true;
            if (!selectedAdminPool && blockedWeekdays && blockedWeekdays.has(dayIndex)) return true;
            return false;
        };

        const handleClearWindow = () => {
            if (selectedAdminPool) {
                updatePoolSetting('dateWindowStart', '');
                updatePoolSetting('dateWindowEnd', '');
            } else {
                setDateWindowStart('');
                setDateWindowEnd('');
                saveSettings(blockedDates, blockedWeekdays, '', '');
            }
        };

        // Effective values — pool-specific when a pool is selected, global otherwise
        const poolData = selectedAdminPool && poolSettings && poolSettings[selectedAdminPool]
            ? poolSettings[selectedAdminPool]
            : null;
        const effWindowStart = poolData ? (poolData.dateWindowStart || '') : dateWindowStart;
        const effWindowEnd = poolData ? (poolData.dateWindowEnd || '') : dateWindowEnd;
        const effBlockedDatesSet = poolData ? new Set(poolData.blockedDates || []) : blockedDates;
        const effWeekdayTimes = poolData ? (poolData.weekdayTimeSettings || {}) : weekdayTimeSettings;

        const handleEffectiveStartDateChange = (value) => {
            if (selectedAdminPool) {
                let newEnd = poolData?.dateWindowEnd || '';
                if (value) { const s = new Date(value); s.setMonth(s.getMonth() + 3); newEnd = s.toISOString().split('T')[0]; }
                const cur = poolSettings && poolSettings[selectedAdminPool] ? poolSettings[selectedAdminPool] : {};
                const newPs = { ...(poolSettings || {}), [selectedAdminPool]: { ...cur, dateWindowStart: value, dateWindowEnd: newEnd } };
                setPoolSettings(newPs); savePoolSettings(newPs);
            } else { handleStartDateChange(value); }
        };
        const handleEffectiveEndDateChange = (value) => {
            if (selectedAdminPool) { updatePoolSetting('dateWindowEnd', value); }
            else { handleEndDateChange(value); }
        };
        const toggleEffectiveBlockedDate = (dateKey) => {
            if (selectedAdminPool) {
                const cur = poolData?.blockedDates || [];
                updatePoolSetting('blockedDates', cur.includes(dateKey) ? cur.filter(d => d !== dateKey) : [...cur, dateKey]);
            } else { toggleBlockedDate(dateKey); }
        };

        // Per-date override helpers
        const effDateOverrides = poolData ? (poolData.dateTimeSettings || {}) : (dateTimeSettings || {});
        const effBlockedDatesList = poolData ? (poolData.blockedDates || []) : null; // null means use global Set

        const writeDateOverrides = (newOverrides, blockedOverride = null) => {
            if (selectedAdminPool) {
                const cur = poolSettings && poolSettings[selectedAdminPool] ? poolSettings[selectedAdminPool] : {};
                const newPs = { ...(poolSettings || {}), [selectedAdminPool]: { ...cur, dateTimeSettings: newOverrides } };
                setPoolSettings(newPs); savePoolSettings(newPs);
            } else {
                const effectiveBlocked = blockedOverride !== null ? blockedOverride : blockedDates;
                setDateTimeSettings(newOverrides);
                saveSettings(effectiveBlocked, blockedWeekdays, dateWindowStart, dateWindowEnd, weekdayTimeSettings, newOverrides);
            }
        };

        const setDateBlockedFlag = (dateKey, blocked) => {
            if (selectedAdminPool) {
                const cur = poolData?.blockedDates || [];
                const next = blocked ? (cur.includes(dateKey) ? cur : [...cur, dateKey]) : cur.filter(d => d !== dateKey);
                updatePoolSetting('blockedDates', next);
            } else {
                const newBlocked = new Set(blockedDates);
                if (blocked) newBlocked.add(dateKey); else newBlocked.delete(dateKey);
                // Use existing flow to catch "cancel existing lessons" confirmation when blocking
                if (blocked && !blockedDates.has(dateKey)) {
                    toggleBlockedDate(dateKey);
                } else if (!blocked && blockedDates.has(dateKey)) {
                    toggleBlockedDate(dateKey);
                }
            }
        };

        const openDateEditor = (year, month, day) => {
            const dateKey = `${year}-${month}-${day}`;
            const hasOverride = Object.prototype.hasOwnProperty.call(effDateOverrides, dateKey);
            const current = hasOverride
                ? effDateOverrides[dateKey]
                : (effWeekdayTimes[new Date(year, month, day).getDay()] !== undefined
                    ? effWeekdayTimes[new Date(year, month, day).getDay()]
                    : [...DEFAULT_LESSON_TIMES]);
            const blockedNow = selectedAdminPool
                ? (poolData?.blockedDates || []).includes(dateKey)
                : blockedDates.has(dateKey);
            setEditingDate({ year, month, day, dateKey });
            setDateEditBlocked(blockedNow);
            setDateEditCustomize(hasOverride);
            setDateEditTimes([...current]);
        };

        const closeDateEditor = () => { setEditingDate(null); setDateEditTimes([]); setDateEditCustomize(false); setDateEditBlocked(false); };

        const saveDateEditor = () => {
            if (!editingDate) return;
            const { dateKey } = editingDate;
            // Handle block/unblock
            setDateBlockedFlag(dateKey, dateEditBlocked);
            // Handle per-date time override
            const newOverrides = { ...effDateOverrides };
            if (dateEditCustomize) {
                newOverrides[dateKey] = [...dateEditTimes];
            } else {
                delete newOverrides[dateKey];
            }
            // React state updates from setDateBlockedFlag are async, so blockedDates is still
            // stale here. Compute the expected new set and pass it so writeDateOverrides doesn't
            // overwrite the blocked-date change. Skip this when a cancel modal will be shown
            // (active lessons present) — in that case setDateBlockedFlag made no state change.
            let blockedForSave = null;
            if (!selectedAdminPool) {
                const hasActiveLessons = (bookedLessons[dateKey] || [])
                    .some(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
                if (!hasActiveLessons) {
                    blockedForSave = new Set(blockedDates);
                    if (dateEditBlocked) blockedForSave.add(dateKey);
                    else blockedForSave.delete(dateKey);
                }
            }
            writeDateOverrides(newOverrides, blockedForSave);
            closeDateEditor();
        };

        const resetDateEditor = () => {
            if (!editingDate) return;
            const newOverrides = { ...effDateOverrides };
            delete newOverrides[editingDate.dateKey];
            writeDateOverrides(newOverrides);
            setDateEditBlocked(false);
            if (selectedAdminPool) {
                const cur = poolData?.blockedDates || [];
                if (cur.includes(editingDate.dateKey)) updatePoolSetting('blockedDates', cur.filter(d => d !== editingDate.dateKey));
            } else {
                if (blockedDates.has(editingDate.dateKey)) toggleBlockedDate(editingDate.dateKey);
            }
            closeDateEditor();
        };

        return (
            <div className="admin-scheduling">
                <h3>Availability Settings</h3>

                {/* ── Pool Management ── */}
                <div style={{marginBottom: '2rem', background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <h4 style={{margin: 0, color: '#1e40af'}}>Pool Management</h4>
                        {!showAddPoolForm && <button onClick={() => setShowAddPoolForm(true)} style={{padding: '0.5rem 1rem', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit'}}>+ Add Pool</button>}
                    </div>

                    {poolSaveError && (
                        <div style={{background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem'}}>
                            <div>
                                <strong style={{color: '#dc2626', fontSize: '0.875rem'}}>Pool save failed</strong>
                                <p style={{margin: '0.25rem 0 0 0', color: '#991b1b', fontSize: '0.8rem'}}>{poolSaveError}</p>
                                <p style={{margin: '0.25rem 0 0 0', color: '#991b1b', fontSize: '0.8rem'}}>To fix: open the <strong>Firebase console</strong> → Firestore Database → Rules, and ensure the "pools" and "poolSettings" documents are allowed for read/write.</p>
                            </div>
                            <button onClick={() => setPoolSaveError(null)} style={{background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, flexShrink: 0}}>✕</button>
                        </div>
                    )}

                    {showAddPoolForm && (
                        <div style={{background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem'}}>
                            <div style={{display: 'grid', gap: '0.5rem', marginBottom: '0.75rem'}}>
                                <input type="text" value={newPoolName} onChange={(e) => setNewPoolName(e.target.value)} placeholder="Pool name (e.g. Wood Valley Pool)" className="form-input" style={{margin: 0}} />
                                <input type="text" value={newPoolAddress} onChange={(e) => setNewPoolAddress(e.target.value)} placeholder="Address (e.g. 123 Main St, Raleigh NC)" className="form-input" style={{margin: 0}} />
                            </div>
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                <button onClick={addPool} disabled={!newPoolName.trim()} style={{padding: '0.5rem 1rem', background: newPoolName.trim() ? '#059669' : '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.875rem', cursor: newPoolName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit'}}>Save Pool</button>
                                <button onClick={() => { setShowAddPoolForm(false); setNewPoolName(''); setNewPoolAddress(''); }} style={{padding: '0.5rem 1rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit'}}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {(!pools || pools.length === 0) ? (
                        <p style={{color: '#64748b', fontSize: '0.875rem'}}>No pools added yet. Add a pool above to configure its schedule.</p>
                    ) : (
                        <div style={{display: 'grid', gap: '0.5rem'}}>
                            {pools.map(pool => {
                                const lessonCount = getPoolLessonCount(pool.id);
                                const isEditingThis = editingPoolId === pool.id;
                                return (
                                    <div key={pool.id} style={{padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                                        {isEditingThis ? (
                                            <div style={{display: 'grid', gap: '0.5rem'}}>
                                                <input type="text" value={editPoolName} onChange={(e) => setEditPoolName(e.target.value)} className="form-input" style={{margin: 0}} placeholder="Pool name" />
                                                <input type="text" value={editPoolAddress} onChange={(e) => setEditPoolAddress(e.target.value)} className="form-input" style={{margin: 0}} placeholder="Address" />
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <button onClick={savePoolEdit} style={{padding: '0.375rem 0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Save</button>
                                                    <button onClick={() => setEditingPoolId(null)} style={{padding: '0.375rem 0.75rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <div>
                                                    <div style={{fontWeight: 600, color: '#1e293b'}}>{pool.name}</div>
                                                    {pool.address && <div style={{fontSize: '0.8rem', color: '#64748b'}}>{pool.address}</div>}
                                                    {lessonCount > 0 && <div style={{fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem'}}>{lessonCount} upcoming lesson{lessonCount !== 1 ? 's' : ''}</div>}
                                                </div>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <button onClick={() => { setEditingPoolId(pool.id); setEditPoolName(pool.name); setEditPoolAddress(pool.address || ''); }} style={{padding: '0.375rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Edit</button>
                                                    <button onClick={() => { setDeletingPool(pool); setShowDeletePoolConfirm(true); }} style={{padding: '0.375rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Delete</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Pool Selector for Schedule Editing ── */}
                {pools && pools.length > 0 && (
                    <div style={{marginBottom: '1.5rem', padding: '1rem 1.25rem', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd'}}>
                        <label style={{fontWeight: 600, color: '#0369a1', marginBottom: '0.5rem', display: 'block'}}>Configure schedule for pool:</label>
                        <select value={selectedAdminPool} onChange={(e) => { setSelectedAdminPool(e.target.value); setEditingWeekday(null); }} className="form-select" style={{margin: 0}}>
                            <option value="">— Select a pool to configure —</option>
                            {pools.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {!selectedAdminPool && <p style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0}}>Select a pool above to edit its date window, blocked dates, and available time slots.</p>}
                    </div>
                )}

                {/* ── Availability Settings (shown only when a pool is selected, or no pools exist yet) ── */}
                {(selectedAdminPool || !pools || pools.length === 0) && (<>

                <div className="date-window-controls">
                    <h4>Available Date Window{selectedAdminPool && pools && <span style={{fontWeight: 400, color: '#64748b'}}> — {pools.find(p => p.id === selectedAdminPool)?.name}</span>}</h4>
                    <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem'}}>Set a range of dates when you're available for lessons. Setting a start date will automatically set an end date 3 months later.</p>
                    <div className="date-inputs">
                        <div className="date-input-group"><label>Start Date</label><input type="date" value={effWindowStart} onChange={(e) => handleEffectiveStartDateChange(e.target.value)} /></div>
                        <div className="date-input-group"><label>End Date</label><input type="date" value={effWindowEnd} onChange={(e) => handleEffectiveEndDateChange(e.target.value)} /></div>
                        <button className="btn btn-secondary" onClick={handleClearWindow} style={{flex: 'none', height: 'fit-content'}}>Clear Window</button>
                    </div>
                </div>

                <div className="admin-calendar-instructions"><strong>How to use:</strong><ul><li><strong>Click a day name</strong> to block/unblock ALL of that weekday within the window</li><li><strong>Click a specific date</strong> to block/unblock it and/or customize its time slots for that date only</li><li>If a day has lessons, you'll be asked to confirm cancellation</li></ul></div>
                <div className="calendar-container" style={{boxShadow: 'none', border: '1px solid #e2e8f0'}}>
                    <div className="calendar-header"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="nav-btn"><ChevronLeft /></button><h3>{monthName} {year}</h3><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="nav-btn"><ChevronRight /></button></div>
                    <div className="weekdays">{DAYS.map((day, i) => <div key={day} className={`weekday ${selectedAdminPool ? '' : 'clickable'} ${isWeekdayBlocked(i) ? 'blocked' : ''}`} onClick={() => !selectedAdminPool && toggleBlockedWeekday(i)}>{day}</div>)}</div>
                    <div className="days-grid">
                        {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} className="day-cell empty" />)}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1, dateKey = `${year}-${month}-${day}`, date = new Date(year, month, day);
                            const isPast = date < new Date(new Date().setHours(0,0,0,0));
                            const isSpecBlk = effBlockedDatesSet.has(dateKey);
                            const isOutWin = isDateBlocked(year, month, day, selectedAdminPool || null) && !isSpecBlk;
                            const bookedCount = getActiveLessons(dateKey).length;
                            const hasOverride = Object.prototype.hasOwnProperty.call(effDateOverrides, dateKey);
                            let cn = 'day-cell'; if (isPast) cn += ' past'; if (isSpecBlk) cn += ' admin-blocked'; if (isOutWin) cn += ' blocked';
                            return <div key={day} onClick={() => !isPast && openDateEditor(year, month, day)} className={cn}><div className="day-number">{day}</div>{!isPast && bookedCount > 0 && <div className="slots-container">{[...Array(bookedCount)].map((_, j) => <div key={j} className="slot-bar booked" />)}</div>}{isSpecBlk && !isPast && <div style={{fontSize: '0.65rem', color: '#dc2626', marginTop: '2px'}}>Blocked</div>}{hasOverride && !isSpecBlk && !isPast && <div style={{fontSize: '0.6rem', color: '#7c3aed', marginTop: '2px', fontWeight: 600}}>Custom</div>}</div>;
                        })}
                    </div>
                    <div className="legend" style={{marginTop: '1.5rem'}}><div className="legend-item"><div className="legend-box" style={{background: '#fee2e2', borderColor: '#fecaca'}}></div><span>Blocked</span></div><div className="legend-item"><div className="legend-bar" style={{background: '#cbd5e1'}}></div><span>Booked</span></div></div>
                </div>

                {/* Per-Weekday Time Settings */}
                <div style={{marginTop: '2rem', background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0'}}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#1e40af'}}>Time Slots by Day</h4>
                    <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem'}}>
                        Configure which time slots are available for each day of the week, and the order they're offered.
                        The first slot listed is offered first; subsequent slots open when the previous one is booked.
                    </p>

                    <div style={{display: 'grid', gap: '0.75rem'}}>
                        {DAYS.map((dayName, dayIndex) => {
                            const isBlocked = !selectedAdminPool && blockedWeekdays.has(dayIndex);
                            const currentTimes = effWeekdayTimes[dayIndex] !== undefined ? effWeekdayTimes[dayIndex] : DEFAULT_LESSON_TIMES;
                            const hasNoTimes = effWeekdayTimes[dayIndex] !== undefined && effWeekdayTimes[dayIndex].length === 0;
                            const isEditing = editingWeekday === dayIndex;
                            const lessonCount = countLessonsOnWeekday(dayIndex);

                            return (
                                <div key={dayIndex} style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: isBlocked ? '#fee2e2' : hasNoTimes ? '#fef3c7' : '#f8fafc',
                                    border: `1px solid ${isBlocked ? '#fecaca' : hasNoTimes ? '#fde68a' : '#e2e8f0'}`,
                                    opacity: isBlocked ? 0.6 : 1
                                }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isEditing ? '1rem' : 0}}>
                                        <div>
                                            <span style={{fontWeight: 600, color: isBlocked ? '#dc2626' : hasNoTimes ? '#92400e' : '#1e293b'}}>{dayName}</span>
                                            {isBlocked && <span style={{marginLeft: '0.5rem', fontSize: '0.75rem', color: '#dc2626'}}>(Blocked)</span>}
                                            {!isBlocked && hasNoTimes && <span style={{marginLeft: '0.5rem', fontSize: '0.75rem', color: '#92400e'}}>(No times - blocked for booking)</span>}
                                            {lessonCount > 0 && <span style={{marginLeft: '0.5rem', fontSize: '0.75rem', color: '#059669'}}>• {lessonCount} lesson{lessonCount !== 1 ? 's' : ''} booked</span>}
                                        </div>
                                        {!isBlocked && !isEditing && (
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                                {!hasNoTimes && (
                                                    <span style={{fontSize: '0.875rem', color: '#64748b'}}>
                                                        {currentTimes.length} slot{currentTimes.length !== 1 ? 's' : ''}: {currentTimes.slice(0, 3).join(', ')}{currentTimes.length > 3 ? '...' : ''}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleEditClick(dayIndex, currentTimes)}
                                                    style={{padding: '0.375rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                >Edit</button>
                                            </div>
                                        )}
                                        {!isBlocked && isEditing && (
                                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                                <button
                                                    onClick={() => {
                                                        if (selectedAdminPool) {
                                                            const newWts = { ...effWeekdayTimes, [dayIndex]: tempTimes };
                                                            const cur = poolSettings && poolSettings[selectedAdminPool] ? poolSettings[selectedAdminPool] : {};
                                                            const newPs = { ...(poolSettings || {}), [selectedAdminPool]: { ...cur, weekdayTimeSettings: newWts } };
                                                            setPoolSettings(newPs); savePoolSettings(newPs);
                                                        } else {
                                                            const newSettings = { ...weekdayTimeSettings, [dayIndex]: tempTimes };
                                                            setWeekdayTimeSettings(newSettings);
                                                            saveSettings(blockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd, newSettings);
                                                        }
                                                        setEditingWeekday(null);
                                                    }}
                                                    style={{padding: '0.375rem 0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                >Save</button>
                                                <button
                                                    onClick={() => setEditingWeekday(null)}
                                                    style={{padding: '0.375rem 0.75rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                >Cancel</button>
                                            </div>
                                        )}
                                    </div>

                                    {!isBlocked && isEditing && (
                                        <div>
                                            <p style={{fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem'}}>
                                                The first slot is offered first, then the next when it's booked, and so on.
                                            </p>

                                            {/* Current selected times - orderable list */}
                                            <div style={{marginBottom: '1rem'}}>
                                                <label style={{fontSize: '0.75rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem', display: 'block'}}>Selected Times (in order):</label>
                                                {tempTimes.length === 0 ? (
                                                    <p style={{fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic'}}>No times selected. Add times below.</p>
                                                ) : (
                                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                                        {tempTimes.map((time, idx) => (
                                                            <div key={time} style={{display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.5rem', background: '#dbeafe', borderRadius: '6px', fontSize: '0.75rem', color: '#1e40af'}}>
                                                                <span style={{fontWeight: 600, color: '#64748b', marginRight: '0.25rem'}}>{idx + 1}.</span>
                                                                {time}
                                                                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '0.25rem'}}>
                                                                    {idx > 0 && <button onClick={() => { const t=[...tempTimes]; [t[idx],t[idx-1]]=[t[idx-1],t[idx]]; setTempTimes(t); }} style={{background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1,fontSize:'0.625rem'}}>▲</button>}
                                                                    {idx < tempTimes.length - 1 && <button onClick={() => { const t=[...tempTimes]; [t[idx],t[idx+1]]=[t[idx+1],t[idx]]; setTempTimes(t); }} style={{background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1,fontSize:'0.625rem'}}>▼</button>}
                                                                </div>
                                                                <button onClick={() => setTempTimes(tempTimes.filter(t => t !== time))} style={{background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontWeight:'bold',marginLeft:'0.25rem',fontSize:'0.875rem'}}>×</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Available times to add */}
                                            <div>
                                                <label style={{fontSize: '0.75rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem', display: 'block'}}>Available Times (click to add):</label>
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.375rem'}}>
                                                    {ALL_LESSON_TIMES.filter(t => !tempTimes.includes(t)).map(time => (
                                                        <button key={time} onClick={() => setTempTimes([...tempTimes, time])} style={{padding: '0.375rem 0.625rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#475569', fontFamily: 'inherit'}}>{time}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quick actions */}
                                            <div style={{marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                                <button onClick={() => setTempTimes([...DEFAULT_LESSON_TIMES])} style={{padding: '0.375rem 0.625rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Reset to Default</button>
                                                <button onClick={() => setTempTimes([])} style={{padding: '0.375rem 0.625rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit'}}>Clear All</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                </>)} {/* end availability section */}

                {/* ── Modals ── */}
                {showTimeWarning && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h4 className="warning">⚠️ Existing Lessons Found</h4>
                            <p>There {lessonsOnPendingDay === 1 ? 'is' : 'are'} <strong>{lessonsOnPendingDay} lesson{lessonsOnPendingDay !== 1 ? 's' : ''}</strong> already scheduled on {DAYS[pendingEditDay]}s{selectedAdminPool && pools && ` at ${pools.find(p => p.id === selectedAdminPool)?.name}`}.</p>
                            <p style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.75rem'}}>
                                Changing the time slots may cause conflicts with existing bookings. If you remove a time slot that has an active lesson, customers may not see their booking correctly.
                            </p>
                            <div style={{background: '#fef3c7', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.875rem', color: '#92400e'}}>
                                <strong>Recommendation:</strong> Only add new time slots or reorder existing ones. Avoid removing time slots that may have active bookings.
                            </div>
                            <div className="btn-row" style={{marginTop: '1.5rem'}}>
                                <button onClick={confirmTimeEdit} className="btn btn-primary">Continue Editing</button>
                                <button onClick={() => { setShowTimeWarning(false); setPendingEditDay(null); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {editingDate && (() => {
                    const { year, month, day, dateKey } = editingDate;
                    const dow = new Date(year, month, day).getDay();
                    const weekdayDefault = effWeekdayTimes[dow] !== undefined ? effWeekdayTimes[dow] : DEFAULT_LESSON_TIMES;
                    const dateLabel = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                    const lessonsOnDate = getActiveLessons(dateKey).filter(l => !selectedAdminPool || l.poolId === selectedAdminPool);
                    return (
                        <div className="modal-overlay">
                            <div className="modal" style={{maxWidth: '560px'}}>
                                <h4 style={{color: '#1e40af', margin: 0}}>Edit {dateLabel}</h4>
                                {lessonsOnDate.length > 0 && (
                                    <div style={{background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.5rem 0.75rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#92400e'}}>
                                        {lessonsOnDate.length} lesson{lessonsOnDate.length !== 1 ? 's' : ''} booked on this date. Removing a time slot with an active booking may cause issues.
                                    </div>
                                )}

                                <div style={{marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                                        <input type="checkbox" checked={dateEditBlocked} onChange={(e) => setDateEditBlocked(e.target.checked)} />
                                        <span style={{fontWeight: 600, color: '#1e293b'}}>Block this date entirely</span>
                                    </label>
                                    <p style={{fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 1.5rem'}}>No bookings will be allowed on this day.</p>
                                </div>

                                <div style={{marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', opacity: dateEditBlocked ? 0.5 : 1}}>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: dateEditBlocked ? 'not-allowed' : 'pointer'}}>
                                        <input type="checkbox" disabled={dateEditBlocked} checked={dateEditCustomize} onChange={(e) => {
                                            const on = e.target.checked;
                                            setDateEditCustomize(on);
                                            if (on && dateEditTimes.length === 0) setDateEditTimes([...weekdayDefault]);
                                        }} />
                                        <span style={{fontWeight: 600, color: '#1e293b'}}>Customize time slots for this date only</span>
                                    </label>
                                    <p style={{fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0.5rem 1.5rem'}}>
                                        {dateEditCustomize
                                            ? `Overriding the weekday default (${weekdayDefault.length} slot${weekdayDefault.length !== 1 ? 's' : ''}).`
                                            : `Using the weekday default: ${weekdayDefault.length > 0 ? weekdayDefault.join(', ') : 'No slots'}.`}
                                    </p>

                                    {dateEditCustomize && !dateEditBlocked && (
                                        <div style={{marginTop: '0.5rem'}}>
                                            <label style={{fontSize: '0.75rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem', display: 'block'}}>Selected Times (in order):</label>
                                            {dateEditTimes.length === 0 ? (
                                                <p style={{fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic'}}>No times selected — this date will be blocked.</p>
                                            ) : (
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                                    {dateEditTimes.map((time, idx) => (
                                                        <div key={time} style={{display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.5rem', background: '#dbeafe', borderRadius: '6px', fontSize: '0.75rem', color: '#1e40af'}}>
                                                            <span style={{fontWeight: 600, color: '#64748b', marginRight: '0.25rem'}}>{idx + 1}.</span>
                                                            {time}
                                                            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '0.25rem'}}>
                                                                {idx > 0 && <button onClick={() => { const t=[...dateEditTimes]; [t[idx],t[idx-1]]=[t[idx-1],t[idx]]; setDateEditTimes(t); }} style={{background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1,fontSize:'0.625rem'}}>▲</button>}
                                                                {idx < dateEditTimes.length - 1 && <button onClick={() => { const t=[...dateEditTimes]; [t[idx],t[idx+1]]=[t[idx+1],t[idx]]; setDateEditTimes(t); }} style={{background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1,fontSize:'0.625rem'}}>▼</button>}
                                                            </div>
                                                            <button onClick={() => setDateEditTimes(dateEditTimes.filter(t => t !== time))} style={{background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontWeight:'bold',marginLeft:'0.25rem',fontSize:'0.875rem'}}>×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <label style={{fontSize: '0.75rem', fontWeight: 500, color: '#475569', margin: '0.75rem 0 0.5rem', display: 'block'}}>Available Times (click to add):</label>
                                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.375rem'}}>
                                                {ALL_LESSON_TIMES.filter(t => !dateEditTimes.includes(t)).map(time => (
                                                    <button key={time} onClick={() => setDateEditTimes([...dateEditTimes, time])} style={{padding: '0.375rem 0.625rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#475569', fontFamily: 'inherit'}}>{time}</button>
                                                ))}
                                            </div>

                                            <div style={{marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                                <button onClick={() => setDateEditTimes([...weekdayDefault])} style={{padding: '0.375rem 0.625rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Use Weekday Default</button>
                                                <button onClick={() => setDateEditTimes([])} style={{padding: '0.375rem 0.625rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit'}}>Clear All</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="btn-row" style={{marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                    <button onClick={saveDateEditor} className="btn btn-primary">Save</button>
                                    <button onClick={resetDateEditor} className="btn btn-secondary">Reset to Weekday Default</button>
                                    <button onClick={closeDateEditor} className="btn btn-secondary">Cancel</button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {showDeletePoolConfirm && deletingPool && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h4 className="danger">Delete Pool</h4>
                            <p>Are you sure you want to delete <strong>{deletingPool.name}</strong>?</p>
                            {getPoolLessonCount(deletingPool.id) > 0 && (
                                <p style={{color: '#dc2626', fontWeight: 500, marginTop: '0.5rem'}}>
                                    Warning: This pool has {getPoolLessonCount(deletingPool.id)} upcoming lesson(s). Those lessons will remain in the system but will no longer be associated with a pool.
                                </p>
                            )}
                            <div className="btn-row" style={{marginTop: '1.5rem'}}>
                                <button onClick={confirmDeletePool} className="btn btn-danger">Delete Pool</button>
                                <button onClick={() => { setShowDeletePoolConfirm(false); setDeletingPool(null); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };
