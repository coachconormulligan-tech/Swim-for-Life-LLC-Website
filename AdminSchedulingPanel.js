    const AdminSchedulingPanel = ({ blockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd, handleStartDateChange, handleEndDateChange, setDateWindowStart, setDateWindowEnd, toggleBlockedDate, toggleBlockedWeekday, isDateBlocked, bookedLessons, cancelledLessons, firstAvailableDate, saveSettings, weekdayTimeSettings, setWeekdayTimeSettings }) => {
        const [currentDate, setCurrentDate] = useState(new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1));
        const [editingWeekday, setEditingWeekday] = useState(null);
        const [tempTimes, setTempTimes] = useState([]);
        const [showTimeWarning, setShowTimeWarning] = useState(false);
        const [pendingEditDay, setPendingEditDay] = useState(null);
        const [lessonsOnPendingDay, setLessonsOnPendingDay] = useState(0);
        const getMonthData = (date) => ({ year: date.getFullYear(), month: date.getMonth(), firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(), daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() });
        const getActiveLessons = (dateKey) => (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
        const { year, month, firstDay, daysInMonth } = getMonthData(currentDate);
        const monthName = currentDate.toLocaleString('default', { month: 'long' });

        // Count lessons on a specific weekday (all upcoming, not just in window)
        const countLessonsOnWeekday = (dayIndex) => {
            const today = new Date(); today.setHours(0,0,0,0);
            let count = 0;

            // Count from all booked lessons
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                if (lessonDate.getDay() === dayIndex && lessonDate >= today) {
                    lessons.forEach(lesson => {
                        if (!cancelledLessons.has(`${dateKey}-${lesson.time}`)) {
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

        // Check if any date on a weekday is blocked within the window, or if no times configured
        const isWeekdayBlocked = (dayIndex) => {
            // Check if no times configured for this day
            const dayTimes = weekdayTimeSettings[dayIndex];
            if (dayTimes && dayTimes.length === 0) return true;

            if (!dateWindowStart || !dateWindowEnd) return false;
            const start = new Date(dateWindowStart);
            const end = new Date(dateWindowEnd);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === dayIndex) {
                    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                    if (blockedDates.has(dateKey)) return true;
                }
            }
            return false;
        };

        const handleClearWindow = () => {
            setDateWindowStart('');
            setDateWindowEnd('');
            saveSettings(blockedDates, blockedWeekdays, '', '');
        };

        return (
            <div className="admin-scheduling">
                <h3>Availability Settings</h3>
                <div className="date-window-controls"><h4>Available Date Window</h4><p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem'}}>Set a range of dates when you're available for lessons. Setting a start date will automatically set an end date 3 months later.</p><div className="date-inputs"><div className="date-input-group"><label>Start Date</label><input type="date" value={dateWindowStart} onChange={(e) => handleStartDateChange(e.target.value)} /></div><div className="date-input-group"><label>End Date</label><input type="date" value={dateWindowEnd} onChange={(e) => handleEndDateChange(e.target.value)} /></div><button className="btn btn-secondary" onClick={handleClearWindow} style={{flex: 'none', height: 'fit-content'}}>Clear Window</button></div></div>
                <div className="admin-calendar-instructions"><strong>How to use:</strong><ul><li><strong>Click a day name</strong> to block/unblock ALL of that weekday within the window</li><li><strong>Click a specific date</strong> to block/unblock just that day</li><li>If a day has lessons, you'll be asked to confirm cancellation</li></ul></div>
                <div className="calendar-container" style={{boxShadow: 'none', border: '1px solid #e2e8f0'}}>
                    <div className="calendar-header"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="nav-btn"><ChevronLeft /></button><h3>{monthName} {year}</h3><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="nav-btn"><ChevronRight /></button></div>
                    <div className="weekdays">{DAYS.map((day, i) => <div key={day} className={`weekday clickable ${isWeekdayBlocked(i) ? 'blocked' : ''}`} onClick={() => toggleBlockedWeekday(i)}>{day}</div>)}</div>
                    <div className="days-grid">
                        {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} className="day-cell empty" />)}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1, dateKey = `${year}-${month}-${day}`, date = new Date(year, month, day), isPast = date < new Date(new Date().setHours(0,0,0,0)), isSpecBlk = blockedDates.has(dateKey), isOutWin = isDateBlocked(year, month, day) && !isSpecBlk, bookedCount = getActiveLessons(dateKey).length;
                            let cn = 'day-cell'; if (isPast) cn += ' past'; if (isSpecBlk) cn += ' admin-blocked'; if (isOutWin) cn += ' blocked';
                            return <div key={day} onClick={() => !isPast && toggleBlockedDate(dateKey)} className={cn}><div className="day-number">{day}</div>{!isPast && bookedCount > 0 && <div className="slots-container">{[...Array(bookedCount)].map((_, j) => <div key={j} className="slot-bar booked" />)}</div>}{isSpecBlk && !isPast && <div style={{fontSize: '0.65rem', color: '#dc2626', marginTop: '2px'}}>Blocked</div>}</div>;
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
                            const isBlocked = blockedWeekdays.has(dayIndex);
                            const currentTimes = weekdayTimeSettings[dayIndex] || DEFAULT_LESSON_TIMES;
                            const hasNoTimes = weekdayTimeSettings[dayIndex] && weekdayTimeSettings[dayIndex].length === 0;
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
                                                        const newSettings = { ...weekdayTimeSettings, [dayIndex]: tempTimes };
                                                        setWeekdayTimeSettings(newSettings);
                                                        saveSettings(blockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd, newSettings);
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
                                                Drag to reorder. The first slot is offered first, then the next when it's booked, and so on.
                                            </p>

                                            {/* Current selected times - orderable list */}
                                            <div style={{marginBottom: '1rem'}}>
                                                <label style={{fontSize: '0.75rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem', display: 'block'}}>Selected Times (in order):</label>
                                                {tempTimes.length === 0 ? (
                                                    <p style={{fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic'}}>No times selected. Add times below.</p>
                                                ) : (
                                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                                        {tempTimes.map((time, idx) => (
                                                            <div key={time} style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem',
                                                                padding: '0.375rem 0.5rem',
                                                                background: '#dbeafe',
                                                                borderRadius: '6px',
                                                                fontSize: '0.75rem',
                                                                color: '#1e40af'
                                                            }}>
                                                                <span style={{fontWeight: 600, color: '#64748b', marginRight: '0.25rem'}}>{idx + 1}.</span>
                                                                {time}
                                                                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '0.25rem'}}>
                                                                    {idx > 0 && (
                                                                        <button
                                                                            onClick={() => {
                                                                                const newTimes = [...tempTimes];
                                                                                [newTimes[idx], newTimes[idx-1]] = [newTimes[idx-1], newTimes[idx]];
                                                                                setTempTimes(newTimes);
                                                                            }}
                                                                            style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.625rem'}}
                                                                        >▲</button>
                                                                    )}
                                                                    {idx < tempTimes.length - 1 && (
                                                                        <button
                                                                            onClick={() => {
                                                                                const newTimes = [...tempTimes];
                                                                                [newTimes[idx], newTimes[idx+1]] = [newTimes[idx+1], newTimes[idx]];
                                                                                setTempTimes(newTimes);
                                                                            }}
                                                                            style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.625rem'}}
                                                                        >▼</button>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => setTempTimes(tempTimes.filter(t => t !== time))}
                                                                    style={{background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold', marginLeft: '0.25rem', fontSize: '0.875rem'}}
                                                                >×</button>
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
                                                        <button
                                                            key={time}
                                                            onClick={() => setTempTimes([...tempTimes, time])}
                                                            style={{
                                                                padding: '0.375rem 0.625rem',
                                                                background: '#f1f5f9',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '6px',
                                                                fontSize: '0.75rem',
                                                                cursor: 'pointer',
                                                                color: '#475569',
                                                                fontFamily: 'inherit'
                                                            }}
                                                        >{time}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quick actions */}
                                            <div style={{marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                                <button
                                                    onClick={() => setTempTimes([...DEFAULT_LESSON_TIMES])}
                                                    style={{padding: '0.375rem 0.625rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                >Reset to Default</button>
                                                <button
                                                    onClick={() => setTempTimes([])}
                                                    style={{padding: '0.375rem 0.625rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit'}}
                                                >Clear All</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Time Edit Warning Modal */}
                {showTimeWarning && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h4 className="warning">⚠️ Existing Lessons Found</h4>
                            <p>There {lessonsOnPendingDay === 1 ? 'is' : 'are'} <strong>{lessonsOnPendingDay} lesson{lessonsOnPendingDay !== 1 ? 's' : ''}</strong> already scheduled on {DAYS[pendingEditDay]}s.</p>
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
            </div>
        );
    };
