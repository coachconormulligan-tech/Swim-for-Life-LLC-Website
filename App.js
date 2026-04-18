    const App = () => {
        const [isLoading, setIsLoading] = useState(true);
        const [showCalendar, setShowCalendar] = useState(false);
        const [showAdmin, setShowAdmin] = useState(false);
        const [showAbout, setShowAbout] = useState(false);
        const [preselectedType, setPreselectedType] = useState(null);
        const [autoBookWeekly, setAutoBookWeekly] = useState(false);
        const [bookedLessons, setBookedLessons] = useState({});
        const [cancelledLessons, setCancelledLessons] = useState(new Set());
        const [adminTab, setAdminTab] = useState('lessons');
        const [adminWeekStart, setAdminWeekStart] = useState(() => {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const sunday = new Date(today);
            sunday.setDate(today.getDate() - dayOfWeek);
            sunday.setHours(0, 0, 0, 0);
            return sunday;
        });
        const [blockedDates, setBlockedDates] = useState(new Set());
        const [blockedWeekdays, setBlockedWeekdays] = useState(new Set());
        const [dateWindowStart, setDateWindowStart] = useState('');
        const [dateWindowEnd, setDateWindowEnd] = useState('');
        const [showCancelModal, setShowCancelModal] = useState(false);
        const [cancelTarget, setCancelTarget] = useState(null);
        const [lessonTypeUpdate, setLessonTypeUpdate] = useState(0);
        const [hideCancelled, setHideCancelled] = useState(true);
        const [showResetModal, setShowResetModal] = useState(false);
        const [studentNotes, setStudentNotes] = useState({});
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [studentSearch, setStudentSearch] = useState('');
        const [editingNote, setEditingNote] = useState('');
        // Per-weekday time settings: { 0: ['4:00 PM', '3:30 PM'], 1: [...], ... }
        const [weekdayTimeSettings, setWeekdayTimeSettings] = useState({});
        // Per-date time overrides (global): { 'Y-M-D': ['10:00 AM', ...] }. Empty array = blocked.
        const [dateTimeSettings, setDateTimeSettings] = useState({});
        // Pools and per-pool settings
        const [pools, setPools] = useState([]);
        const [poolSettings, setPoolSettings] = useState({});
        const [poolSaveError, setPoolSaveError] = useState(null);
        // Lesson editing state
        const [editingLesson, setEditingLesson] = useState(null);
        const [editLessonData, setEditLessonData] = useState({});
        // Student contact editing state
        const [editingStudentContact, setEditingStudentContact] = useState(null);
        const [editContactData, setEditContactData] = useState({ parentName: '', email: '', phone: '' });
        const [selectedRevenueYear, setSelectedRevenueYear] = useState(new Date().getFullYear());

        // Helper to get lesson times for a specific weekday (optionally pool-specific)
        const getLessonTimesForDay = (dayIndex, poolId = null) => {
            const settings = poolId && poolSettings[poolId] ? poolSettings[poolId].weekdayTimeSettings : weekdayTimeSettings;
            if (settings && settings[dayIndex] && settings[dayIndex].length > 0) {
                return settings[dayIndex];
            }
            return DEFAULT_LESSON_TIMES;
        };

        // Helper to get lesson times for a specific calendar date. Per-date override (if any) wins over weekday settings.
        const getLessonTimesForDate = (year, month, day, poolId = null) => {
            const dateKey = `${year}-${month}-${day}`;
            const overrides = poolId && poolSettings[poolId] ? (poolSettings[poolId].dateTimeSettings || {}) : dateTimeSettings;
            if (overrides && Object.prototype.hasOwnProperty.call(overrides, dateKey)) {
                return overrides[dateKey];
            }
            return getLessonTimesForDay(new Date(year, month, day).getDay(), poolId);
        };

        // Pool lookup helpers
        const getPoolName = (poolId) => {
            if (!poolId) return '—';
            const pool = pools.find(p => p.id === poolId);
            return pool ? pool.name : 'Unknown Pool';
        };
        const getPoolAddress = (poolId) => {
            if (!poolId) return '';
            const pool = pools.find(p => p.id === poolId);
            return pool ? pool.address : '';
        };

        // Helper to check if date is today
        const isToday = (year, month, day) => {
            const today = new Date();
            return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
        };

        // Load data from Firebase on mount
        useEffect(() => {
            const loadData = async () => {
                if (!firebaseReady || !db) {
                    console.log('Firebase not ready, using local state only');
                    setIsLoading(false);
                    return;
                }
                try {
                    const lessonsDoc = await db.collection('swimLessons').doc('lessons').get();
                    if (lessonsDoc.exists) setBookedLessons(lessonsDoc.data().data || {});
                    
                    const cancelledDoc = await db.collection('swimLessons').doc('cancelled').get();
                    if (cancelledDoc.exists) setCancelledLessons(new Set(cancelledDoc.data().data || []));
                    
                    const settingsDoc = await db.collection('swimLessons').doc('settings').get();
                    if (settingsDoc.exists) {
                        const s = settingsDoc.data();
                        setBlockedDates(new Set(s.blockedDates || []));
                        // Ensure weekday indices are numbers, not strings
                        setBlockedWeekdays(new Set((s.blockedWeekdays || []).map(Number)));
                        setDateWindowStart(s.dateWindowStart || '');
                        setDateWindowEnd(s.dateWindowEnd || '');
                        setWeekdayTimeSettings(s.weekdayTimeSettings || {});
                        setDateTimeSettings(s.dateTimeSettings || {});
                    }
                    
                    const notesDoc = await db.collection('swimLessons').doc('studentNotes').get();
                    if (notesDoc.exists) setStudentNotes(notesDoc.data().data || {});

                    const poolsDoc = await db.collection('swimLessons').doc('pools').get();
                    if (poolsDoc.exists) setPools(poolsDoc.data().data || []);

                    const poolSettingsDoc = await db.collection('swimLessons').doc('poolSettings').get();
                    if (poolSettingsDoc.exists) setPoolSettings(poolSettingsDoc.data().data || {});
                } catch (error) {
                    console.error('Error loading data:', error);
                }
                setIsLoading(false);
            };
            loadData();
        }, []);

        // Save functions
        const saveLessons = async (lessons) => {
            if (!db) return;
            try { await db.collection('swimLessons').doc('lessons').set({ data: lessons }); } 
            catch (e) { console.error('Error saving lessons:', e); }
        };
        const saveCancelled = async (cancelled) => {
            if (!db) return;
            try { await db.collection('swimLessons').doc('cancelled').set({ data: Array.from(cancelled) }); } 
            catch (e) { console.error('Error saving cancelled:', e); }
        };
        const saveSettings = async (blocked, weekdays, start, end, weekdayTimes = null, dateTimes = null) => {
            if (!db) return;
            try {
                const settingsData = {
                    blockedDates: Array.from(blocked),
                    blockedWeekdays: Array.from(weekdays),
                    dateWindowStart: start,
                    dateWindowEnd: end,
                    weekdayTimeSettings: weekdayTimes !== null ? weekdayTimes : weekdayTimeSettings,
                    dateTimeSettings: dateTimes !== null ? dateTimes : dateTimeSettings
                };
                await db.collection('swimLessons').doc('settings').set(settingsData);
            }
            catch (e) { console.error('Error saving settings:', e); }
        };
        const saveStudentNotes = async (notes) => {
            if (!db) return;
            try { await db.collection('swimLessons').doc('studentNotes').set({ data: notes }); }
            catch (e) { console.error('Error saving student notes:', e); }
        };
        const savePools = async (p) => {
            if (!db) { setPoolSaveError('Firebase is not connected. Pool data cannot be saved.'); return; }
            try {
                await db.collection('swimLessons').doc('pools').set({ data: p });
                setPoolSaveError(null);
            }
            catch (e) {
                console.error('Error saving pools:', e);
                setPoolSaveError(`Failed to save pool data: ${e.message || e.code || 'Unknown error'}. Check Firestore security rules — the "pools" document may not be permitted.`);
            }
        };
        const savePoolSettings = async (ps) => {
            if (!db) return;
            try {
                await db.collection('swimLessons').doc('poolSettings').set({ data: ps });
            }
            catch (e) {
                console.error('Error saving pool settings:', e);
                setPoolSaveError(prev => prev || `Failed to save pool settings: ${e.message || e.code || 'Unknown error'}.`);
            }
        };

        // Reset all booking data
        const resetAllData = async () => {
            setBookedLessons({});
            setCancelledLessons(new Set());
            setBlockedDates(new Set());
            setBlockedWeekdays(new Set());
            setDateWindowStart('');
            setDateWindowEnd('');
            if (db) {
                try {
                    await db.collection('swimLessons').doc('lessons').set({ data: {} });
                    await db.collection('swimLessons').doc('cancelled').set({ data: [] });
                    await db.collection('swimLessons').doc('settings').set({ blockedDates: [], blockedWeekdays: [], dateWindowStart: '', dateWindowEnd: '' });
                } catch (e) { console.error('Error resetting data:', e); }
            }
            setShowResetModal(false);
        };

        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('admin') === 'swimforlife2026') setShowAdmin(true);
        }, []);

        const handleBookingClick = (type) => {
            setPreselectedType(type);
            setAutoBookWeekly(type !== null);
            setLessonTypeUpdate(prev => prev + 1);
            setShowCalendar(true);
            setTimeout(() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' }), 100);
        };

        const isDateBlocked = (year, month, day, poolId = null) => {
            const date = new Date(year, month, day);
            const dateKey = `${year}-${month}-${day}`;
            const dayOfWeek = date.getDay();
            // Block today - too short notice
            if (isToday(year, month, day)) return true;

            if (poolId && poolSettings[poolId]) {
                const ps = poolSettings[poolId];
                if ((ps.blockedDates || []).includes(dateKey)) return true;
                // Per-date override wins if present. Empty array = blocked, non-empty = available even if weekday has none.
                const dateOverrides = ps.dateTimeSettings || {};
                if (Object.prototype.hasOwnProperty.call(dateOverrides, dateKey)) {
                    if (dateOverrides[dateKey].length === 0) return true;
                } else {
                    const dayTimes = ps.weekdayTimeSettings && ps.weekdayTimeSettings[dayOfWeek];
                    if (dayTimes && dayTimes.length === 0) return true;
                }
                if (ps.dateWindowStart || ps.dateWindowEnd) {
                    if (ps.dateWindowStart && date < new Date(ps.dateWindowStart)) return true;
                    if (ps.dateWindowEnd && date > new Date(ps.dateWindowEnd)) return true;
                }
                // Also respect globally blocked dates set by admin
                if (blockedDates.has(dateKey)) return true;
                return false;
            }

            // Fall back to global settings (used by admin panel or legacy)
            if (blockedDates.has(dateKey)) return true;
            if (Object.prototype.hasOwnProperty.call(dateTimeSettings, dateKey)) {
                if (dateTimeSettings[dateKey].length === 0) return true;
            } else {
                const dayTimes = weekdayTimeSettings[dayOfWeek];
                if (dayTimes && dayTimes.length === 0) return true;
            }
            if (dateWindowStart || dateWindowEnd) {
                if (dateWindowStart && date < new Date(dateWindowStart)) return true;
                if (dateWindowEnd && date > new Date(dateWindowEnd)) return true;
            }
            return false;
        };

        const getFirstAvailableDate = (poolId = null) => {
            let checkDate = new Date();
            checkDate.setDate(checkDate.getDate() + 1);
            for (let i = 0; i < 365; i++) {
                const { year, month, day } = { year: checkDate.getFullYear(), month: checkDate.getMonth(), day: checkDate.getDate() };
                const dateKey = `${year}-${month}-${day}`;
                const booked = (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
                const dayOfWeek = checkDate.getDay();
                const maxForDay = getLessonTimesForDate(year, month, day, poolId).length;
                if (!isDateBlocked(year, month, day, poolId) && booked.length < maxForDay) return checkDate;
                checkDate.setDate(checkDate.getDate() + 1);
            }
            return new Date();
        };

        const getClosestAvailableTo = (targetDate, poolId = null, additionalBooked = []) => {
            const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0);
            const findSlot = (date) => {
                const year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
                const dateKey = `${year}-${month}-${day}`;
                const dayTimes = getLessonTimesForDate(year, month, day, poolId);
                if (!isDateBlocked(year, month, day, poolId) && dayTimes.length > 0) {
                    const booked = (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
                    const bookedTimes = booked.map(l => l.time);
                    const pendingTimes = additionalBooked.filter(b => `${b.year}-${b.month}-${b.day}` === dateKey).map(b => b.time);
                    const allBookedTimes = [...new Set([...bookedTimes, ...pendingTimes])];
                    let availTime = null;
                    if (!allBookedTimes.includes(dayTimes[0])) availTime = dayTimes[0];
                    else { for (let j = 1; j < dayTimes.length; j++) { if (allBookedTimes.includes(dayTimes[j-1]) && !allBookedTimes.includes(dayTimes[j])) { availTime = dayTimes[j]; break; } } }
                    if (availTime) return { year, month, day, time: availTime };
                }
                return null;
            };
            // 1. Search forward within 1 week of the target date
            let checkDate = new Date(targetDate);
            for (let i = 0; i < 7; i++) {
                const result = findSlot(checkDate);
                if (result) return result;
                checkDate.setDate(checkDate.getDate() + 1);
            }
            // 2. Search backward up to 1 week (but not into the past)
            checkDate = new Date(targetDate); checkDate.setDate(checkDate.getDate() - 1);
            for (let i = 0; i < 7; i++) {
                if (checkDate >= tomorrow) {
                    const result = findSlot(checkDate);
                    if (result) return result;
                }
                checkDate.setDate(checkDate.getDate() - 1);
            }
            // 3. Continue searching forward beyond 1 week
            checkDate = new Date(targetDate); checkDate.setDate(checkDate.getDate() + 7);
            for (let i = 0; i < 358; i++) {
                const result = findSlot(checkDate);
                if (result) return result;
                checkDate.setDate(checkDate.getDate() + 1);
            }
            return null;
        };

        const getActiveLessons = (dateKey) => (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));

        const handleStartDateChange = (value) => {
            let newEnd = dateWindowEnd;
            if (value) {
                const start = new Date(value);
                start.setMonth(start.getMonth() + 3);
                newEnd = start.toISOString().split('T')[0];
            }
            setDateWindowStart(value);
            setDateWindowEnd(newEnd);
            saveSettings(blockedDates, blockedWeekdays, value, newEnd);
        };

        const handleEndDateChange = (value) => {
            setDateWindowEnd(value);
            saveSettings(blockedDates, blockedWeekdays, dateWindowStart, value);
        };

        const toggleBlockedDate = (dateKey) => {
            const activeLessons = getActiveLessons(dateKey);
            if (activeLessons.length > 0) {
                setCancelTarget({ type: 'date', dateKey, lessons: activeLessons });
                setShowCancelModal(true);
                return;
            }
            const newBlocked = new Set(blockedDates);
            newBlocked.has(dateKey) ? newBlocked.delete(dateKey) : newBlocked.add(dateKey);
            setBlockedDates(newBlocked);
            saveSettings(newBlocked, blockedWeekdays, dateWindowStart, dateWindowEnd);
        };

        const toggleBlockedWeekday = (dayIndex) => {
            // Get all dates within the window that fall on this weekday
            if (!dateWindowStart || !dateWindowEnd) return;
            
            const start = new Date(dateWindowStart);
            const end = new Date(dateWindowEnd);
            const datesOnWeekday = [];
            
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === dayIndex) {
                    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                    datesOnWeekday.push(dateKey);
                }
            }
            
            // Check if any of these dates are already blocked
            const anyBlocked = datesOnWeekday.some(dk => blockedDates.has(dk));
            
            // Check for lessons on these dates if we're about to block
            if (!anyBlocked) {
                const lessonsOnWeekday = [];
                datesOnWeekday.forEach(dateKey => {
                    const lessons = bookedLessons[dateKey] || [];
                    lessons.forEach(lesson => {
                        if (!cancelledLessons.has(`${dateKey}-${lesson.time}`)) {
                            lessonsOnWeekday.push({ dateKey, lesson });
                        }
                    });
                });
                
                if (lessonsOnWeekday.length > 0) {
                    setCancelTarget({ type: 'weekday', dayIndex, lessons: lessonsOnWeekday, datesToBlock: datesOnWeekday });
                    setShowCancelModal(true);
                    return;
                }
            }
            
            // Toggle all dates on this weekday
            const newBlocked = new Set(blockedDates);
            if (anyBlocked) {
                // Unblock all
                datesOnWeekday.forEach(dk => newBlocked.delete(dk));
            } else {
                // Block all
                datesOnWeekday.forEach(dk => newBlocked.add(dk));
            }
            setBlockedDates(newBlocked);
            saveSettings(newBlocked, blockedWeekdays, dateWindowStart, dateWindowEnd);
        };

        const confirmCancellation = () => {
            let newCancelled = new Set(cancelledLessons);
            let newBlockedDates = new Set(blockedDates);
            
            if (cancelTarget.type === 'date') {
                cancelTarget.lessons.forEach(l => newCancelled.add(`${cancelTarget.dateKey}-${l.time}`));
                newBlockedDates.add(cancelTarget.dateKey);
                setCancelledLessons(newCancelled);
                setBlockedDates(newBlockedDates);
                saveCancelled(newCancelled);
                saveSettings(newBlockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd);
            } else if (cancelTarget.type === 'weekday') {
                cancelTarget.lessons.forEach(({ dateKey, lesson }) => newCancelled.add(`${dateKey}-${lesson.time}`));
                // Block individual dates instead of weekday
                cancelTarget.datesToBlock.forEach(dk => newBlockedDates.add(dk));
                setCancelledLessons(newCancelled);
                setBlockedDates(newBlockedDates);
                saveCancelled(newCancelled);
                saveSettings(newBlockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd);
            } else if (cancelTarget.type === 'single') {
                newCancelled.add(`${cancelTarget.dateKey}-${cancelTarget.lesson.time}`);
                setCancelledLessons(newCancelled);
                saveCancelled(newCancelled);
            }
            setShowCancelModal(false);
            setCancelTarget(null);
        };

        const cancelSingleLesson = (dateKey, lesson) => {
            setCancelTarget({ type: 'single', dateKey, lesson });
            setShowCancelModal(true);
        };

        const startEditingLesson = (lesson) => {
            setEditingLesson(lesson);
            setEditLessonData({
                parentName: lesson.parentName || '',
                email: lesson.email || '',
                phone: lesson.phone || '',
                swimmer1Name: lesson.swimmer1Name || '',
                swimmer1Birthday: lesson.swimmer1Birthday || '',
                swimmer2Name: lesson.swimmer2Name || '',
                swimmer2Birthday: lesson.swimmer2Birthday || '',
                lessonType: lesson.lessonType || 'private',
                time: lesson.time,
                newDateKey: lesson.dateKey,
                poolId: lesson.poolId || ''
            });
        };

        const saveEditedLesson = async () => {
            if (!editingLesson) return;
            
            const oldDateKey = editingLesson.dateKey;
            const oldTime = editingLesson.time;
            const newDateKey = editLessonData.newDateKey;
            const newTime = editLessonData.time;
            
            // Create updated lesson object
            const updatedLesson = {
                ...editingLesson,
                parentName: editLessonData.parentName,
                email: editLessonData.email,
                phone: editLessonData.phone,
                swimmer1Name: editLessonData.swimmer1Name,
                swimmer1Birthday: editLessonData.swimmer1Birthday,
                swimmer2Name: editLessonData.swimmer2Name,
                swimmer2Birthday: editLessonData.swimmer2Birthday,
                lessonType: editLessonData.lessonType,
                time: newTime,
                price: editLessonData.lessonType === 'group' ? 70 : 40,
                poolId: editLessonData.poolId || editingLesson.poolId || ''
            };
            delete updatedLesson.date;
            delete updatedLesson.dateKey;
            delete updatedLesson.isCancelled;
            
            let newBookedLessons = { ...bookedLessons };
            
            // If date/time changed, we need to move the lesson
            if (oldDateKey !== newDateKey || oldTime !== newTime) {
                // Remove from old location
                if (newBookedLessons[oldDateKey]) {
                    newBookedLessons[oldDateKey] = newBookedLessons[oldDateKey].filter(l => l.time !== oldTime);
                    if (newBookedLessons[oldDateKey].length === 0) {
                        delete newBookedLessons[oldDateKey];
                    }
                }
                // Add to new location
                if (!newBookedLessons[newDateKey]) {
                    newBookedLessons[newDateKey] = [];
                }
                newBookedLessons[newDateKey].push(updatedLesson);
            } else {
                // Just update in place
                newBookedLessons[oldDateKey] = newBookedLessons[oldDateKey].map(l => 
                    l.time === oldTime ? updatedLesson : l
                );
            }
            
            setBookedLessons(newBookedLessons);
            await saveLessons(newBookedLessons);
            setEditingLesson(null);
            setEditLessonData({});
        };

        // Update contact info for a student across all their lessons
        const updateStudentContact = async (studentName, oldEmail, newContactData) => {
            const studentNameLower = studentName.toLowerCase().trim();
            let newBookedLessons = { ...bookedLessons };
            let updated = false;
            
            Object.entries(newBookedLessons).forEach(([dateKey, lessons]) => {
                newBookedLessons[dateKey] = lessons.map(lesson => {
                    // Check if this lesson belongs to the student (as swimmer1 or swimmer2)
                    const isSwimmer1 = lesson.swimmer1Name && lesson.swimmer1Name.toLowerCase().trim() === studentNameLower;
                    const isSwimmer2 = lesson.swimmer2Name && lesson.swimmer2Name.toLowerCase().trim() === studentNameLower;
                    
                    // Also verify by email to avoid false matches
                    const emailMatches = lesson.email && oldEmail && lesson.email.toLowerCase().trim() === oldEmail.toLowerCase().trim();
                    
                    if ((isSwimmer1 || isSwimmer2) && emailMatches) {
                        updated = true;
                        return {
                            ...lesson,
                            parentName: newContactData.parentName,
                            email: newContactData.email,
                            phone: newContactData.phone
                        };
                    }
                    return lesson;
                });
            });
            
            if (updated) {
                setBookedLessons(newBookedLessons);
                await saveLessons(newBookedLessons);
            }
            
            setEditingStudentContact(null);
            setEditContactData({ parentName: '', email: '', phone: '' });
        };

        const getAllLessons = () => {
            const allLessons = [];
            const today = new Date(); today.setHours(0, 0, 0, 0);
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                if (lessonDate >= today) {
                    lessons.forEach(lesson => {
                        allLessons.push({ date: lessonDate, dateKey, isCancelled: cancelledLessons.has(`${dateKey}-${lesson.time}`), ...lesson });
                    });
                }
            });
            return allLessons.sort((a, b) => a.date - b.date || a.time.localeCompare(b.time));
        };

        const getTotalRevenue = () => getAllLessons().filter(l => !l.isCancelled).reduce((sum, l) => sum + (l.price || 0), 0);

        const exportToExcel = () => {
            const lessons = getAllLessons().filter(l => !l.isCancelled);
            const data = lessons.map(l => ({
                'Date': l.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
                'Time': l.time,
                'Pool': getPoolName(l.poolId),
                'Address': getPoolAddress(l.poolId),
                'Type': l.lessonType === 'group' ? 'Group' : 'Private',
                'Parent': l.parentName || '',
                'Swimmer 1': l.swimmer1Name || '',
                'Birthday 1': l.swimmer1Birthday ? formatBirthday(l.swimmer1Birthday) : '',
                'Age 1': l.swimmer1Birthday ? calculateAge(l.swimmer1Birthday) : '',
                'Swimmer 2': l.swimmer2Name || '',
                'Birthday 2': l.swimmer2Birthday ? formatBirthday(l.swimmer2Birthday) : '',
                'Age 2': l.swimmer2Birthday ? calculateAge(l.swimmer2Birthday) : '',
                'Email': l.email || '',
                'Phone': l.phone || '',
                'Price': l.price || 0
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Lessons');
            XLSX.writeFile(wb, `swim-lessons-${new Date().toISOString().split('T')[0]}.xlsx`);
        };

        const exportCompletedToExcel = () => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(selectedRevenueYear, 0, 1);
            const yearEnd = selectedRevenueYear === currentYear ? today : new Date(selectedRevenueYear, 11, 31);
            const completedLessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
            if (completedLessons.length === 0) { alert(`No completed lessons found for ${selectedRevenueYear}.`); return; }
            const rows = [];
            completedLessons.forEach(l => {
                const addRow = (swimmerName) => {
                    rows.push({
                        'Date': l.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
                        'Time': l.time,
                        'Type': l.lessonType === 'group' ? 'Group' : 'Private',
                        'Swimmer': swimmerName,
                        'Parent': l.parentName || '',
                        'Price': l.price || 0,
                        'Date of Payment': ''
                    });
                };
                if (l.swimmer1Name) addRow(l.swimmer1Name);
                if (l.swimmer2Name) addRow(l.swimmer2Name);
            });
            const ws = XLSX.utils.json_to_sheet(rows);
            // Set column widths
            ws['!cols'] = [
                { wch: 36 }, // Date
                { wch: 10 }, // Time
                { wch: 8 },  // Type
                { wch: 22 }, // Swimmer
                { wch: 22 }, // Parent
                { wch: 8 },  // Price
                { wch: 18 }  // Date of Payment
            ];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Completed Lessons');
            XLSX.writeFile(wb, `completed-lessons-${selectedRevenueYear}.xlsx`);
        };

        const printSchedule = () => {
            const lessons = getAllLessons().filter(l => !l.isCancelled);
            const printContent = `
                <html><head><title>Swim for Life Schedule</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #1e40af; margin-bottom: 5px; }
                    .date { color: #64748b; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
                    th { background: #f1f5f9; font-weight: 600; }
                    tr:nth-child(even) { background: #f8fafc; }
                    .total { margin-top: 20px; font-weight: 600; }
                </style></head><body>
                <h1>Swim for Life - Lesson Schedule</h1>
                <div class="date">Printed: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <table>
                    <thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Swimmer(s)</th><th>Parent</th><th>Contact</th></tr></thead>
                    <tbody>
                        ${lessons.map(l => `<tr>
                            <td>${l.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                            <td>${l.time}</td>
                            <td>${l.lessonType === 'group' ? 'Group' : 'Private'}</td>
                            <td>${l.swimmer1Name || '-'}${l.swimmer2Name ? ', ' + l.swimmer2Name : ''}</td>
                            <td>${l.parentName || '-'}</td>
                            <td>${l.phone || l.email || '-'}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                <div class="total">Total Lessons: ${lessons.length} | Total Revenue: $${getTotalRevenue()}</div>
                </body></html>
            `;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        };

        const exportToCalendar = () => {
            const lessons = getAllLessons().filter(l => !l.isCancelled);
            if (lessons.length === 0) { alert('No upcoming lessons to export.'); return; }
            
            const formatICSDate = (date, timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
                return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };
            
            const formatICSEndDate = (date, timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes + 30);
                return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Swim for Life//Admin Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
            lessons.forEach((l, i) => {
                const swimmerName = l.swimmer1Name + (l.swimmer2Name ? ' & ' + l.swimmer2Name : '');
                const lessonType = l.lessonType === 'group' ? 'Group' : 'Private';
                icsContent += `BEGIN:VEVENT
UID:swimforlife-admin-${Date.now()}-${i}@swimforlife.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${formatICSDate(l.date, l.time)}
DTEND:${formatICSEndDate(l.date, l.time)}
SUMMARY:${lessonType} Lesson - ${swimmerName}
DESCRIPTION:${lessonType} lesson for ${swimmerName}\\nParent: ${l.parentName || 'N/A'}\\nPhone: ${l.phone || 'N/A'}\\nEmail: ${l.email || 'N/A'}
END:VEVENT
`;
            });
            icsContent += 'END:VCALENDAR';
            
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `swim-lessons-${new Date().toISOString().split('T')[0]}.ics`;
            a.click();
            URL.revokeObjectURL(url);
        };

        // Weekly calendar view helpers
        const getWeekDays = (startDate) => {
            const days = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                days.push(day);
            }
            return days;
        };

        const getWeekLessons = (weekStart) => {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);
            return getAllLessons().filter(l => !l.isCancelled && l.date >= weekStart && l.date < weekEnd);
        };

        const navigateWeek = (direction) => {
            const newStart = new Date(adminWeekStart);
            newStart.setDate(adminWeekStart.getDate() + (direction * 7));
            setAdminWeekStart(newStart);
        };

        // Revenue chart helpers - get all lessons including past for revenue tracking
        const getAllLessonsForRevenue = () => {
            const allLessons = [];
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                lessons.forEach(lesson => {
                    allLessons.push({ date: lessonDate, dateKey, isCancelled: cancelledLessons.has(`${dateKey}-${lesson.time}`), ...lesson });
                });
            });
            return allLessons.sort((a, b) => a.date - b.date);
        };

        const getRevenueByWeek = (year) => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(year, 0, 1);
            const yearEnd = year === currentYear ? today : new Date(year, 11, 31);
            const lessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
            const weeklyData = {};

            lessons.forEach(l => {
                const weekStart = new Date(l.date);
                const dayOfWeek = weekStart.getDay();
                weekStart.setDate(weekStart.getDate() - dayOfWeek);
                weekStart.setHours(0, 0, 0, 0);
                const weekKey = weekStart.toISOString().split('T')[0];

                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = { weekStart: new Date(weekStart), revenue: 0, lessons: 0 };
                }
                weeklyData[weekKey].revenue += (l.price || 0);
                weeklyData[weekKey].lessons += 1;
            });

            return Object.values(weeklyData).sort((a, b) => a.weekStart - b.weekStart);
        };

        const getRevenueByMonth = (year) => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(year, 0, 1);
            const yearEnd = year === currentYear ? today : new Date(year, 11, 31);
            const lessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
            const monthlyData = {};

            lessons.forEach(l => {
                const monthKey = `${l.date.getFullYear()}-${l.date.getMonth()}`;
                const monthStart = new Date(l.date.getFullYear(), l.date.getMonth(), 1);

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { monthStart, revenue: 0, lessons: 0 };
                }
                monthlyData[monthKey].revenue += (l.price || 0);
                monthlyData[monthKey].lessons += 1;
            });

            return Object.values(monthlyData).sort((a, b) => a.monthStart - b.monthStart);
        };

        const getAvailableRevenueYears = () => {
            const years = new Set(getAllLessonsForRevenue().map(l => l.date.getFullYear()));
            years.add(new Date().getFullYear());
            return Array.from(years).sort((a, b) => b - a); // Newest first
        };

        // Get all unique students from all lessons
        const getAllStudents = () => {
            const students = {};
            
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                
                lessons.forEach(lesson => {
                    const isCancelled = cancelledLessons.has(`${dateKey}-${lesson.time}`);
                    
                    // Process swimmer 1
                    if (lesson.swimmer1Name) {
                        const key = lesson.swimmer1Name.toLowerCase().trim();
                        if (!students[key]) {
                            students[key] = {
                                name: lesson.swimmer1Name,
                                birthdays: new Set(),
                                years: new Set(),
                                parents: {},
                                lessons: [],
                                totalLessons: 0,
                                completedLessons: 0,
                                upcomingLessons: 0,
                                totalSpent: 0,
                                firstLesson: null,
                                lastLesson: null
                            };
                        }
                        if (lesson.swimmer1Birthday) students[key].birthdays.add(lesson.swimmer1Birthday);
                        
                        // Track parent info
                        if (lesson.parentName) {
                            const parentKey = lesson.parentName.toLowerCase().trim();
                            if (!students[key].parents[parentKey]) {
                                students[key].parents[parentKey] = {
                                    name: lesson.parentName,
                                    email: lesson.email,
                                    phone: lesson.phone
                                };
                            }
                        }
                        
                        // Track lessons
                        if (!isCancelled) {
                            const today = new Date(); today.setHours(0,0,0,0);
                            students[key].totalLessons++;
                            students[key].years.add(lessonDate.getFullYear());
                            if (lessonDate < today) students[key].completedLessons++;
                            else students[key].upcomingLessons++;
                            
                            const price = lesson.lessonType === 'group' ? 35 : 40; // Split group price
                            students[key].totalSpent += price;
                            
                            if (!students[key].firstLesson || lessonDate < students[key].firstLesson) {
                                students[key].firstLesson = lessonDate;
                            }
                            if (!students[key].lastLesson || lessonDate > students[key].lastLesson) {
                                students[key].lastLesson = lessonDate;
                            }
                        }
                        
                        students[key].lessons.push({
                            date: lessonDate,
                            dateKey,
                            time: lesson.time,
                            type: lesson.lessonType,
                            isCancelled,
                            parentName: lesson.parentName
                        });
                    }
                    
                    // Process swimmer 2 (group lessons)
                    if (lesson.swimmer2Name) {
                        const key = lesson.swimmer2Name.toLowerCase().trim();
                        if (!students[key]) {
                            students[key] = {
                                name: lesson.swimmer2Name,
                                birthdays: new Set(),
                                years: new Set(),
                                parents: {},
                                lessons: [],
                                totalLessons: 0,
                                completedLessons: 0,
                                upcomingLessons: 0,
                                totalSpent: 0,
                                firstLesson: null,
                                lastLesson: null
                            };
                        }
                        if (lesson.swimmer2Birthday) students[key].birthdays.add(lesson.swimmer2Birthday);
                        
                        if (lesson.parentName) {
                            const parentKey = lesson.parentName.toLowerCase().trim();
                            if (!students[key].parents[parentKey]) {
                                students[key].parents[parentKey] = {
                                    name: lesson.parentName,
                                    email: lesson.email,
                                    phone: lesson.phone
                                };
                            }
                        }
                        
                        if (!isCancelled) {
                            const today = new Date(); today.setHours(0,0,0,0);
                            students[key].totalLessons++;
                            students[key].years.add(lessonDate.getFullYear());
                            if (lessonDate < today) students[key].completedLessons++;
                            else students[key].upcomingLessons++;
                            students[key].totalSpent += 35; // Split group price
                            
                            if (!students[key].firstLesson || lessonDate < students[key].firstLesson) {
                                students[key].firstLesson = lessonDate;
                            }
                            if (!students[key].lastLesson || lessonDate > students[key].lastLesson) {
                                students[key].lastLesson = lessonDate;
                            }
                        }
                        
                        students[key].lessons.push({
                            date: lessonDate,
                            dateKey,
                            time: lesson.time,
                            type: lesson.lessonType,
                            isCancelled,
                            parentName: lesson.parentName
                        });
                    }
                });
            });
            
            // Convert to array and sort lessons
            return Object.values(students).map(s => ({
                ...s,
                birthdays: Array.from(s.birthdays),
                years: Array.from(s.years),
                parents: Object.values(s.parents),
                lessons: s.lessons.sort((a, b) => a.date - b.date)
            })).sort((a, b) => a.name.localeCompare(b.name));
        };

        const updateStudentNote = (studentKey, note) => {
            const newNotes = { ...studentNotes, [studentKey]: note };
            setStudentNotes(newNotes);
            saveStudentNotes(newNotes);
        };

        if (isLoading) {
            return (
                <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)'}}>
                    <div style={{textAlign: 'center', color: 'white'}}>
                        <div style={{width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem'}}></div>
                        <p>Loading...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                </div>
            );
        }

        if (showAdmin) {
            const allLessons = getAllLessons();
            const displayedLessons = hideCancelled ? allLessons.filter(l => !l.isCancelled) : allLessons;
            const firstAvailable = getFirstAvailableDate();
            return (
                <div style={{minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem 1rem'}}>
                    <div className="admin-panel">
                        <div className="admin-header">
                            <h2>Admin Dashboard</h2>
                            <div className="admin-btn-group">
                                <button style={{padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}} onClick={() => setShowResetModal(true)}>Reset All Data</button>
                                <button className="admin-close-btn" onClick={() => { window.history.replaceState({}, document.title, window.location.pathname); setShowAdmin(false); }}>Exit Admin</button>
                            </div>
                        </div>
                        <div className="admin-tabs">
                            <button className={`admin-tab ${adminTab === 'lessons' ? 'active' : ''}`} onClick={() => setAdminTab('lessons')}>Upcoming Lessons</button>
                            <button className={`admin-tab ${adminTab === 'weekly' ? 'active' : ''}`} onClick={() => setAdminTab('weekly')}>Weekly View</button>
                            <button className={`admin-tab ${adminTab === 'revenue' ? 'active' : ''}`} onClick={() => setAdminTab('revenue')}>Revenue</button>
                            <button className={`admin-tab ${adminTab === 'students' ? 'active' : ''}`} onClick={() => setAdminTab('students')}>Students</button>
                            <button className={`admin-tab ${adminTab === 'scheduling' ? 'active' : ''}`} onClick={() => setAdminTab('scheduling')}>Availability</button>
                        </div>
                        {adminTab === 'lessons' && (
                            <>
                                <div className="admin-stats">
                                    <div className="stat-card"><h4>Upcoming Lessons</h4><div className="stat-value">{allLessons.filter(l => !l.isCancelled).length}</div></div>
                                    <div className="stat-card"><h4>Private Lessons</h4><div className="stat-value">{allLessons.filter(l => !l.isCancelled && l.lessonType === 'private').length}</div></div>
                                    <div className="stat-card"><h4>Group Lessons</h4><div className="stat-value">{allLessons.filter(l => !l.isCancelled && l.lessonType === 'group').length}</div></div>
                                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0'}}><h4 style={{color: '#047857'}}>Earned So Far</h4><div className="stat-value" style={{color: '#059669'}}>${(() => {
                                        const today = new Date(); today.setHours(0, 0, 0, 0);
                                        return getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date < today).reduce((sum, l) => sum + (l.price || 0), 0);
                                    })()}</div></div>
                                    <div className="stat-card"><h4>Still to Earn</h4><div className="stat-value">${getTotalRevenue()}</div></div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'white', borderRadius: '10px'}}>
                                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#475569'}}>
                                            <input type="checkbox" checked={hideCancelled} onChange={(e) => setHideCancelled(e.target.checked)} style={{width: '18px', height: '18px', cursor: 'pointer'}} />
                                            Hide cancelled lessons
                                        </label>
                                    </div>
                                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                        <button onClick={exportToExcel} style={{padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit'}}>Export to Excel</button>
                                        <button onClick={exportCompletedToExcel} style={{padding: '0.5rem 1rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit'}}>Export Completed Lessons ({selectedRevenueYear})</button>
                                        <button onClick={exportToCalendar} style={{padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit'}}>Export to Calendar</button>
                                        <button onClick={printSchedule} style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit'}}>Print Schedule</button>
                                    </div>
                                </div>
                                <table className="lessons-table">
                                    <thead><tr><th>Date</th><th>Time</th><th>Pool</th><th>Type</th><th>Parent</th><th>Swimmer(s)</th><th>Contact</th><th>Price</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {displayedLessons.length === 0 ? <tr><td colSpan="9" className="no-lessons">No upcoming lessons booked yet.</td></tr> : displayedLessons.map((lesson, i) => (
                                            <tr key={i} className={lesson.isCancelled ? 'cancelled' : ''}>
                                                <td>{lesson.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td>{lesson.time}</td>
                                                <td style={{fontSize: '0.8rem'}}>
                                                    <div style={{fontWeight: 500}}>{getPoolName(lesson.poolId)}</div>
                                                    {lesson.poolId && getPoolAddress(lesson.poolId) && <div style={{color: '#64748b', fontSize: '0.75rem'}}>{getPoolAddress(lesson.poolId)}</div>}
                                                </td>
                                                <td>{lesson.isCancelled ? <span className="lesson-type-badge cancelled">Cancelled</span> : <span className={`lesson-type-badge ${lesson.lessonType || 'private'}`}>{lesson.lessonType === 'group' ? 'Group' : 'Private'}</span>}</td>
                                                <td>{lesson.parentName || '-'}</td>
                                                <td>{lesson.swimmer1Name ? <>{lesson.swimmer1Name}{lesson.swimmer1Birthday ? ` (${calculateAge(lesson.swimmer1Birthday)})` : ''}{lesson.swimmer2Name && <><br/>{lesson.swimmer2Name}{lesson.swimmer2Birthday ? ` (${calculateAge(lesson.swimmer2Birthday)})` : ''}</>}</> : '-'}</td>
                                                <td>{lesson.email || lesson.phone ? <>{lesson.email && <div>{lesson.email}</div>}{lesson.phone && <div>{lesson.phone}</div>}</> : '-'}</td>
                                                <td>${lesson.price || 0}</td>
                                                <td>{!lesson.isCancelled ? (
                                                    <div style={{display: 'flex', gap: '0.25rem'}}>
                                                        <button className="btn btn-small" style={{background: '#3b82f6', color: 'white'}} onClick={() => startEditingLesson(lesson)}>Edit</button>
                                                        <button className="btn btn-danger btn-small" onClick={() => cancelSingleLesson(lesson.dateKey, lesson)}>Cancel</button>
                                                    </div>
                                                ) : <span style={{color: '#94a3b8', fontSize: '0.75rem'}}>—</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                        
                        {adminTab === 'weekly' && (
                            <>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <button onClick={() => navigateWeek(-1)} style={{padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500}}>← Previous</button>
                                        <button onClick={() => {
                                            const today = new Date();
                                            const dayOfWeek = today.getDay();
                                            const sunday = new Date(today);
                                            sunday.setDate(today.getDate() - dayOfWeek);
                                            sunday.setHours(0, 0, 0, 0);
                                            setAdminWeekStart(sunday);
                                        }} style={{padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500}}>Today</button>
                                        <button onClick={() => navigateWeek(1)} style={{padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500}}>Next →</button>
                                    </div>
                                    <h3 style={{margin: 0, color: '#1e40af'}}>
                                        {adminWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(adminWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </h3>
                                </div>
                                
                                <div style={{background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid #e2e8f0'}}>
                                        {getWeekDays(adminWeekStart).map((day, i) => {
                                            const isToday = day.toDateString() === new Date().toDateString();
                                            return (
                                                <div key={i} style={{padding: '1rem 0.5rem', textAlign: 'center', background: isToday ? '#dbeafe' : '#f8fafc', borderRight: i < 6 ? '1px solid #e2e8f0' : 'none'}}>
                                                    <div style={{fontWeight: 600, color: isToday ? '#1e40af' : '#64748b', fontSize: '0.75rem'}}>{DAYS[i]}</div>
                                                    <div style={{fontWeight: 700, color: isToday ? '#1e40af' : '#1e293b', fontSize: '1.25rem'}}>{day.getDate()}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '300px'}}>
                                        {getWeekDays(adminWeekStart).map((day, i) => {
                                            const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                                            const dayLessons = getWeekLessons(adminWeekStart).filter(l => l.dateKey === dateKey);
                                            const isToday = day.toDateString() === new Date().toDateString();
                                            return (
                                                <div key={i} style={{padding: '0.5rem', borderRight: i < 6 ? '1px solid #e2e8f0' : 'none', background: isToday ? '#f0f9ff' : 'transparent', minHeight: '200px'}}>
                                                    {dayLessons.length === 0 ? (
                                                        <div style={{color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem'}}>No lessons</div>
                                                    ) : (
                                                        dayLessons.sort((a, b) => a.time.localeCompare(b.time)).map((lesson, j) => (
                                                            <div key={j} style={{
                                                                background: lesson.lessonType === 'group' ? '#fef3c7' : '#dbeafe',
                                                                border: `1px solid ${lesson.lessonType === 'group' ? '#f59e0b' : '#3b82f6'}`,
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                marginBottom: '0.5rem',
                                                                fontSize: '0.75rem'
                                                            }}>
                                                                <div style={{fontWeight: 600, color: lesson.lessonType === 'group' ? '#92400e' : '#1e40af'}}>{lesson.time}</div>
                                                                <div style={{color: '#475569', marginTop: '0.25rem'}}>{lesson.swimmer1Name}{lesson.swimmer2Name && `, ${lesson.swimmer2Name}`}</div>
                                                                <div style={{color: '#64748b', fontSize: '0.675rem', marginTop: '0.25rem'}}>{lesson.lessonType === 'group' ? 'Group' : 'Private'} • ${lesson.price}</div>
                                                                {lesson.poolId && <div style={{color: '#3b82f6', fontSize: '0.65rem', marginTop: '0.25rem', fontWeight: 500}}>{getPoolName(lesson.poolId)}</div>}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b'}}>
                                        <div style={{width: '16px', height: '16px', background: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '4px'}}></div>
                                        Private Lesson
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b'}}>
                                        <div style={{width: '16px', height: '16px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px'}}></div>
                                        Group Lesson
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {adminTab === 'revenue' && (
                            <>
                                {/* Year selector */}
                                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                    <span style={{fontWeight: 600, color: '#475569', fontSize: '0.9rem'}}>Tax Year:</span>
                                    <select value={selectedRevenueYear} onChange={e => setSelectedRevenueYear(Number(e.target.value))} style={{padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontWeight: 600, color: '#1e40af', fontSize: '1rem', cursor: 'pointer', background: '#f8fafc'}}>
                                        {getAvailableRevenueYears().map(y => <option key={y} value={y}>{y}{y === new Date().getFullYear() ? ' (Current)' : ''}</option>)}
                                    </select>
                                    <span style={{fontSize: '0.85rem', color: '#64748b'}}>
                                        {selectedRevenueYear === new Date().getFullYear() ? `Jan 1 – Today (Year-to-Date)` : `Jan 1 – Dec 31, ${selectedRevenueYear} (Full Year)`}
                                    </span>
                                </div>

                                {/* Stat cards — year-aware */}
                                {(() => {
                                    const today = new Date(); today.setHours(0, 0, 0, 0);
                                    const currentYear = new Date().getFullYear();
                                    const yearStart = new Date(selectedRevenueYear, 0, 1);
                                    const yearEnd = selectedRevenueYear === currentYear ? today : new Date(selectedRevenueYear, 11, 31);
                                    const yearLessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
                                    const yearRevenue = yearLessons.reduce((sum, l) => sum + (l.price || 0), 0);
                                    const isCurrentYear = selectedRevenueYear === currentYear;
                                    const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay()); weekStart.setHours(0,0,0,0);
                                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                                    return (
                                        <div className="admin-stats">
                                            <div className="stat-card" style={{background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0'}}>
                                                <h4 style={{color: '#047857'}}>{isCurrentYear ? 'Year-to-Date Earned' : `Total Earned (${selectedRevenueYear})`}</h4>
                                                <div className="stat-value" style={{color: '#059669'}}>${yearRevenue}</div>
                                            </div>
                                            <div className="stat-card"><h4>Lessons ({selectedRevenueYear})</h4><div className="stat-value">{yearLessons.length}</div></div>
                                            {isCurrentYear && (
                                                <div className="stat-card"><h4>Upcoming Revenue</h4><div className="stat-value">${getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= today && l.date.getFullYear() === currentYear).reduce((sum, l) => sum + (l.price || 0), 0)}</div></div>
                                            )}
                                            {isCurrentYear && (
                                                <div className="stat-card"><h4>This Week (Earned)</h4><div className="stat-value">${yearLessons.filter(l => l.date >= weekStart).reduce((sum, l) => sum + (l.price || 0), 0)}</div></div>
                                            )}
                                            {isCurrentYear && (
                                                <div className="stat-card"><h4>This Month (Earned)</h4><div className="stat-value">${yearLessons.filter(l => l.date >= monthStart).reduce((sum, l) => sum + (l.price || 0), 0)}</div></div>
                                            )}
                                            {!isCurrentYear && (
                                                <div className="stat-card"><h4>Private Lessons</h4><div className="stat-value">{yearLessons.filter(l => l.lessonType === 'private').length}</div></div>
                                            )}
                                            {!isCurrentYear && (
                                                <div className="stat-card"><h4>Group Lessons</h4><div className="stat-value">{yearLessons.filter(l => l.lessonType === 'group').length}</div></div>
                                            )}
                                        </div>
                                    );
                                })()}

                                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                    <h4 style={{margin: '0 0 1rem 0', color: '#1e40af'}}>Weekly Revenue — {selectedRevenueYear}</h4>
                                    {getRevenueByWeek(selectedRevenueYear).length === 0 ? (
                                        <p style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>No revenue data for {selectedRevenueYear}</p>
                                    ) : (
                                        <div style={{display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px', padding: '0 0.5rem', overflowX: 'auto'}}>
                                            {(() => {
                                                const data = getRevenueByWeek(selectedRevenueYear);
                                                const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
                                                return data.map((week, i) => (
                                                    <div key={i} style={{flex: '0 0 auto', minWidth: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                                                        <div style={{fontSize: '0.75rem', fontWeight: 600, color: '#059669'}}>${week.revenue}</div>
                                                        <div style={{
                                                            width: '40px',
                                                            height: `${(week.revenue / maxRevenue) * 150}px`,
                                                            background: 'linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)',
                                                            borderRadius: '6px 6px 0 0',
                                                            minHeight: '4px',
                                                            transition: 'height 0.3s ease'
                                                        }}></div>
                                                        <div style={{fontSize: '0.675rem', color: '#64748b', textAlign: 'center', lineHeight: 1.2}}>
                                                            {week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    )}
                                </div>

                                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                    <h4 style={{margin: '0 0 1rem 0', color: '#1e40af'}}>Monthly Revenue — {selectedRevenueYear}</h4>
                                    {getRevenueByMonth(selectedRevenueYear).length === 0 ? (
                                        <p style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>No revenue data for {selectedRevenueYear}</p>
                                    ) : (
                                        <div style={{display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', padding: '0 0.5rem'}}>
                                            {(() => {
                                                const data = getRevenueByMonth(selectedRevenueYear);
                                                const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
                                                return data.map((month, i) => (
                                                    <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                                                        <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#059669'}}>${month.revenue}</div>
                                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>{month.lessons} lessons</div>
                                                        <div style={{
                                                            width: '100%',
                                                            height: `${(month.revenue / maxRevenue) * 120}px`,
                                                            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                                            borderRadius: '6px 6px 0 0',
                                                            minHeight: '4px',
                                                            transition: 'height 0.3s ease'
                                                        }}></div>
                                                        <div style={{fontSize: '0.75rem', color: '#475569', fontWeight: 500}}>
                                                            {month.monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem'}}>
                                    <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                        <h4 style={{margin: '0 0 1rem 0', color: '#1e40af'}}>Revenue by Type — {selectedRevenueYear}</h4>
                                        {(() => {
                                            const today = new Date(); today.setHours(0,0,0,0);
                                            const currentYear = new Date().getFullYear();
                                            const yearStart = new Date(selectedRevenueYear, 0, 1);
                                            const yearEnd = selectedRevenueYear === currentYear ? today : new Date(selectedRevenueYear, 11, 31);
                                            const lessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
                                            const privateRev = lessons.filter(l => l.lessonType === 'private').reduce((sum, l) => sum + (l.price || 0), 0);
                                            const groupRev = lessons.filter(l => l.lessonType === 'group').reduce((sum, l) => sum + (l.price || 0), 0);
                                            const total = privateRev + groupRev || 1;
                                            return (
                                                <>
                                                    <div style={{marginBottom: '1rem'}}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                                            <span style={{fontSize: '0.875rem', color: '#475569'}}>Private Lessons</span>
                                                            <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#1e40af'}}>${privateRev}</span>
                                                        </div>
                                                        <div style={{height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                                            <div style={{height: '100%', width: `${(privateRev / total) * 100}%`, background: '#3b82f6', borderRadius: '4px'}}></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                                            <span style={{fontSize: '0.875rem', color: '#475569'}}>Group Lessons</span>
                                                            <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b'}}>${groupRev}</span>
                                                        </div>
                                                        <div style={{height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                                            <div style={{height: '100%', width: `${(groupRev / total) * 100}%`, background: '#f59e0b', borderRadius: '4px'}}></div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    
                                    <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                        <h4 style={{margin: '0 0 1rem 0', color: '#1e40af'}}>Lesson Count by Type — {selectedRevenueYear}</h4>
                                        {(() => {
                                            const today = new Date(); today.setHours(0,0,0,0);
                                            const currentYear = new Date().getFullYear();
                                            const yearStart = new Date(selectedRevenueYear, 0, 1);
                                            const yearEnd = selectedRevenueYear === currentYear ? today : new Date(selectedRevenueYear, 11, 31);
                                            const lessons = getAllLessonsForRevenue().filter(l => !l.isCancelled && l.date >= yearStart && l.date < yearEnd);
                                            const privateCount = lessons.filter(l => l.lessonType === 'private').length;
                                            const groupCount = lessons.filter(l => l.lessonType === 'group').length;
                                            const total = privateCount + groupCount || 1;
                                            return (
                                                <>
                                                    <div style={{marginBottom: '1rem'}}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                                            <span style={{fontSize: '0.875rem', color: '#475569'}}>Private Lessons</span>
                                                            <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#1e40af'}}>{privateCount}</span>
                                                        </div>
                                                        <div style={{height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                                            <div style={{height: '100%', width: `${(privateCount / total) * 100}%`, background: '#3b82f6', borderRadius: '4px'}}></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                                            <span style={{fontSize: '0.875rem', color: '#475569'}}>Group Lessons</span>
                                                            <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b'}}>{groupCount}</span>
                                                        </div>
                                                        <div style={{height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                                            <div style={{height: '100%', width: `${(groupCount / total) * 100}%`, background: '#f59e0b', borderRadius: '4px'}}></div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                
                                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                    <h4 style={{margin: '0 0 0.25rem 0', color: '#1e40af'}}>Year-over-Year Comparison</h4>
                                    <p style={{fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem'}}>Past years show full year earned. Current year shows two bars: earned to date and projected full year (earned + all booked lessons).</p>
                                    {(() => {
                                        const today = new Date(); today.setHours(0, 0, 0, 0);
                                        const currentYear = today.getFullYear();
                                        const allLessons = getAllLessonsForRevenue().filter(l => !l.isCancelled);

                                        // Build per-year earned totals (completed only)
                                        const yearlyEarned = {};
                                        allLessons.forEach(l => {
                                            const yr = l.date.getFullYear();
                                            const cutoff = yr === currentYear ? today : new Date(yr, 11, 31);
                                            if (l.date >= new Date(yr, 0, 1) && l.date < cutoff) {
                                                if (!yearlyEarned[yr]) yearlyEarned[yr] = { revenue: 0, lessons: 0 };
                                                yearlyEarned[yr].revenue += (l.price || 0);
                                                yearlyEarned[yr].lessons += 1;
                                            }
                                        });

                                        // Always ensure currentYear is present even if no lessons are completed yet
                                        if (!yearlyEarned[currentYear]) yearlyEarned[currentYear] = { revenue: 0, lessons: 0 };

                                        // Projected = earned YTD + all future booked lessons this year
                                        const futureThisYear = allLessons.filter(l => l.date >= today && l.date.getFullYear() === currentYear);
                                        const projectedRevenue = yearlyEarned[currentYear].revenue + futureThisYear.reduce((sum, l) => sum + (l.price || 0), 0);
                                        const projectedLessons = yearlyEarned[currentYear].lessons + futureThisYear.length;

                                        const years = Object.keys(yearlyEarned).map(Number).sort();
                                        if (years.length === 0 && projectedRevenue === 0) {
                                            return <p style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>No yearly data yet</p>;
                                        }

                                        const maxRevenue = Math.max(...years.map(yr => yearlyEarned[yr].revenue), projectedRevenue, 1);
                                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

                                        return (
                                            <>
                                                <div style={{display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '240px', padding: '0 1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                                                    {years.map((year, i) => {
                                                        const isCurrent = year === currentYear;
                                                        const color = colors[i % colors.length];
                                                        const earned = yearlyEarned[year];
                                                        return (
                                                            <div key={year} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem'}}>
                                                                {/* Bar(s) */}
                                                                <div style={{display: 'flex', alignItems: 'flex-end', gap: isCurrent ? '6px' : '0'}}>
                                                                    {/* Earned bar (all years) */}
                                                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem'}}>
                                                                        <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#059669'}}>${earned.revenue}</div>
                                                                        <div style={{
                                                                            width: isCurrent ? '36px' : '56px',
                                                                            height: `${(earned.revenue / maxRevenue) * 150}px`,
                                                                            background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
                                                                            borderRadius: '6px 6px 0 0',
                                                                            minHeight: '4px',
                                                                            transition: 'height 0.3s ease'
                                                                        }}></div>
                                                                        {isCurrent && <div style={{fontSize: '0.6rem', color: '#475569', fontWeight: 600}}>Earned</div>}
                                                                    </div>
                                                                    {/* Projected bar (current year only) */}
                                                                    {isCurrent && (
                                                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem'}}>
                                                                            <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8'}}>${projectedRevenue}</div>
                                                                            <div style={{
                                                                                width: '36px',
                                                                                height: `${(projectedRevenue / maxRevenue) * 150}px`,
                                                                                background: `linear-gradient(180deg, ${color}55 0%, ${color}33 100%)`,
                                                                                border: `2px dashed ${color}99`,
                                                                                borderRadius: '6px 6px 0 0',
                                                                                minHeight: '4px',
                                                                                transition: 'height 0.3s ease',
                                                                                boxSizing: 'border-box'
                                                                            }}></div>
                                                                            <div style={{fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600}}>Projected</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {/* Year label */}
                                                                <div style={{fontSize: '0.9rem', fontWeight: 700, color: isCurrent ? color : '#1e293b', marginTop: '0.1rem'}}>{year}</div>
                                                                <div style={{fontSize: '0.7rem', color: '#94a3b8'}}>{isCurrent ? `${earned.lessons} earned / ${projectedLessons} proj.` : `${earned.lessons} lessons`}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Legend */}
                                                <div style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap'}}>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#475569'}}>
                                                        <div style={{width: '16px', height: '10px', background: '#3b82f6', borderRadius: '3px'}}></div>
                                                        Earned (completed lessons)
                                                    </div>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8'}}>
                                                        <div style={{width: '16px', height: '10px', background: '#3b82f655', border: '2px dashed #3b82f699', borderRadius: '3px', boxSizing: 'border-box'}}></div>
                                                        Projected (earned + upcoming)
                                                    </div>
                                                </div>

                                                {/* YTD comparison note */}
                                                {years.includes(currentYear - 1) && (
                                                    <div style={{marginTop: '1.25rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center'}}>
                                                        {(() => {
                                                            const lastYear = currentYear - 1;
                                                            const sameLastYear = new Date(lastYear, today.getMonth(), today.getDate());
                                                            const lastYearYTD = allLessons.filter(l => l.date.getFullYear() === lastYear && l.date >= new Date(lastYear, 0, 1) && l.date < sameLastYear).reduce((sum, l) => sum + (l.price || 0), 0);
                                                            const currentEarned = yearlyEarned[currentYear]?.revenue || 0;
                                                            const diff = currentEarned - lastYearYTD;
                                                            const pctChange = lastYearYTD === 0 ? null : Math.round((diff / lastYearYTD) * 100);
                                                            const isUp = diff >= 0;
                                                            return pctChange !== null ? (
                                                                <span style={{fontSize: '0.875rem'}}>
                                                                    <strong style={{color: isUp ? '#059669' : '#dc2626'}}>{isUp ? '↑' : '↓'} {isUp ? '+' : ''}{pctChange}%</strong>
                                                                    <span style={{color: '#64748b'}}> vs same period last year (${Math.abs(diff)} {isUp ? 'more' : 'less'} earned through {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})</span>
                                                                </span>
                                                            ) : <span style={{color: '#64748b', fontSize: '0.875rem'}}>No lessons recorded for last year's comparison period</span>;
                                                        })()}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                        
                        {adminTab === 'students' && (
                            <>
                                <div className="admin-stats">
                                    <div className="stat-card"><h4>Total Students</h4><div className="stat-value">{getAllStudents().length}</div></div>
                                    <div className="stat-card"><h4>Active Students</h4><div className="stat-value">{getAllStudents().filter(s => s.upcomingLessons > 0).length}</div></div>
                                    <div className="stat-card"><h4>Total Lessons Taught</h4><div className="stat-value">{getAllStudents().reduce((sum, s) => sum + s.completedLessons, 0)}</div></div>
                                    <div className="stat-card"><h4>Returning Students</h4><div className="stat-value">{getAllStudents().filter(s => s.years.length > 1).length}</div></div>
                                </div>
                                
                                <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
                                    {/* Student List */}
                                    <div style={{flex: '1 1 350px', minWidth: '300px'}}>
                                        <div style={{background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                            <div style={{marginBottom: '1rem'}}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Search students..." 
                                                    value={studentSearch}
                                                    onChange={(e) => setStudentSearch(e.target.value)}
                                                    style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit'}}
                                                />
                                            </div>
                                            <div style={{maxHeight: '500px', overflowY: 'auto'}}>
                                                {getAllStudents()
                                                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
                                                    .map((student, i) => {
                                                        const isSelected = selectedStudent?.name.toLowerCase() === student.name.toLowerCase();
                                                        const hasNotes = studentNotes[student.name.toLowerCase().trim()];
                                                        return (
                                                            <div 
                                                                key={i}
                                                                onClick={() => {
                                                                    setSelectedStudent(student);
                                                                    setEditingNote(studentNotes[student.name.toLowerCase().trim()] || '');
                                                                }}
                                                                style={{
                                                                    padding: '0.75rem 1rem',
                                                                    borderRadius: '8px',
                                                                    marginBottom: '0.5rem',
                                                                    cursor: 'pointer',
                                                                    background: isSelected ? '#dbeafe' : '#f8fafc',
                                                                    border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                    <div>
                                                                        <div style={{fontWeight: 600, color: '#1e293b'}}>
                                                                            {student.name}
                                                                            {hasNotes && <span style={{marginLeft: '0.5rem', color: '#f59e0b'}}>📝</span>}
                                                                        </div>
                                                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>
                                                                            {student.totalLessons} lesson{student.totalLessons !== 1 ? 's' : ''} 
                                                                            {student.upcomingLessons > 0 && <span style={{color: '#059669'}}> • {student.upcomingLessons} upcoming</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div style={{textAlign: 'right'}}>
                                                                        {student.birthdays.length > 0 && (
                                                                            <div style={{fontSize: '0.75rem', color: '#64748b'}}>Age: {student.birthdays.map(b => calculateAge(b)).join(', ')}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                {getAllStudents().filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 && (
                                                    <div style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                                                        {studentSearch ? 'No students found' : 'No students yet'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Student Detail */}
                                    <div style={{flex: '2 1 500px', minWidth: '300px'}}>
                                        {selectedStudent ? (
                                            <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                                                    <div>
                                                        <h3 style={{margin: 0, color: '#1e40af'}}>{selectedStudent.name}</h3>
                                                        {selectedStudent.birthdays.length > 0 && (
                                                            <p style={{margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem'}}>Age: {selectedStudent.birthdays.map(b => calculateAge(b)).join(', ')}</p>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => setSelectedStudent(null)}
                                                        style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b'}}
                                                    >×</button>
                                                </div>
                                                
                                                {/* Stats */}
                                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
                                                    <div style={{background: '#f0fdf4', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                                                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#059669'}}>{selectedStudent.completedLessons}</div>
                                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>Completed</div>
                                                    </div>
                                                    <div style={{background: '#dbeafe', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                                                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#1e40af'}}>{selectedStudent.upcomingLessons}</div>
                                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>Upcoming</div>
                                                    </div>
                                                    <div style={{background: '#fef3c7', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                                                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#92400e'}}>${selectedStudent.totalSpent}</div>
                                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>Total Profit</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Parent/Contact Info */}
                                                {selectedStudent.parents.length > 0 && (
                                                    <div style={{marginBottom: '1.5rem'}}>
                                                        <h4 style={{margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Contact Info</h4>
                                                        {selectedStudent.parents.map((parent, i) => (
                                                            <div key={i} style={{background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.5rem'}}>
                                                                {editingStudentContact === `${selectedStudent.name}-${i}` ? (
                                                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                                                        <input 
                                                                            type="text" 
                                                                            value={editContactData.parentName}
                                                                            onChange={(e) => setEditContactData({...editContactData, parentName: e.target.value})}
                                                                            placeholder="Parent Name"
                                                                            className="form-input"
                                                                            style={{margin: 0, padding: '0.5rem'}}
                                                                        />
                                                                        <input 
                                                                            type="email" 
                                                                            value={editContactData.email}
                                                                            onChange={(e) => setEditContactData({...editContactData, email: e.target.value})}
                                                                            placeholder="Email"
                                                                            className="form-input"
                                                                            style={{margin: 0, padding: '0.5rem'}}
                                                                        />
                                                                        <input 
                                                                            type="tel" 
                                                                            value={editContactData.phone}
                                                                            onChange={(e) => setEditContactData({...editContactData, phone: e.target.value})}
                                                                            placeholder="Phone"
                                                                            className="form-input"
                                                                            style={{margin: 0, padding: '0.5rem'}}
                                                                        />
                                                                        <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.25rem'}}>
                                                                            <button 
                                                                                onClick={() => updateStudentContact(selectedStudent.name, parent.email, editContactData)}
                                                                                style={{padding: '0.375rem 0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                                            >Save</button>
                                                                            <button 
                                                                                onClick={() => { setEditingStudentContact(null); setEditContactData({ parentName: '', email: '', phone: '' }); }}
                                                                                style={{padding: '0.375rem 0.75rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                                            >Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                                                        <div>
                                                                            <div style={{fontWeight: 500}}>{parent.name}</div>
                                                                            {parent.email && <div style={{fontSize: '0.875rem', color: '#3b82f6'}}>{parent.email}</div>}
                                                                            {parent.phone && <div style={{fontSize: '0.875rem', color: '#64748b'}}>{parent.phone}</div>}
                                                                        </div>
                                                                        <button 
                                                                            onClick={() => {
                                                                                setEditingStudentContact(`${selectedStudent.name}-${i}`);
                                                                                setEditContactData({
                                                                                    parentName: parent.name || '',
                                                                                    email: parent.email || '',
                                                                                    phone: parent.phone || ''
                                                                                });
                                                                            }}
                                                                            style={{padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                                        >Edit</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Notes */}
                                                <div style={{marginBottom: '1.5rem'}}>
                                                    <h4 style={{margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Notes & Progress</h4>
                                                    <textarea
                                                        value={editingNote}
                                                        onChange={(e) => setEditingNote(e.target.value)}
                                                        placeholder="Add notes about this student's progress, skill level, goals, etc..."
                                                        style={{width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical'}}
                                                    />
                                                    <button 
                                                        onClick={() => updateStudentNote(selectedStudent.name.toLowerCase().trim(), editingNote)}
                                                        style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                    >Save Notes</button>
                                                </div>
                                                
                                                {/* Lesson History */}
                                                <div>
                                                    <h4 style={{margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Lesson History</h4>
                                                    <div style={{maxHeight: '250px', overflowY: 'auto'}}>
                                                        {selectedStudent.lessons.slice().reverse().map((lesson, i) => {
                                                            const isPast = lesson.date < new Date();
                                                            return (
                                                                <div key={i} style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    padding: '0.5rem 0.75rem',
                                                                    borderRadius: '6px',
                                                                    marginBottom: '0.25rem',
                                                                    background: lesson.isCancelled ? '#fee2e2' : isPast ? '#f8fafc' : '#f0fdf4',
                                                                    opacity: lesson.isCancelled ? 0.6 : 1
                                                                }}>
                                                                    <div>
                                                                        <span style={{fontWeight: 500, fontSize: '0.875rem'}}>
                                                                            {lesson.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                                        </span>
                                                                        <span style={{color: '#64748b', fontSize: '0.875rem'}}> at {lesson.time}</span>
                                                                    </div>
                                                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                                        <span style={{
                                                                            fontSize: '0.75rem',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '4px',
                                                                            background: lesson.type === 'group' ? '#fef3c7' : '#dbeafe',
                                                                            color: lesson.type === 'group' ? '#92400e' : '#1e40af'
                                                                        }}>{lesson.type === 'group' ? 'Group' : 'Private'}</span>
                                                                        {lesson.isCancelled && <span style={{fontSize: '0.75rem', color: '#dc2626'}}>Cancelled</span>}
                                                                        {!lesson.isCancelled && !isPast && <span style={{fontSize: '0.75rem', color: '#059669'}}>Upcoming</span>}
                                                                        {!lesson.isCancelled && (
                                                                            <button 
                                                                                onClick={() => {
                                                                                    // Find the full lesson data from bookedLessons
                                                                                    const lessonsOnDay = bookedLessons[lesson.dateKey] || [];
                                                                                    const fullLesson = lessonsOnDay.find(l => l.time === lesson.time);
                                                                                    if (fullLesson) {
                                                                                        startEditingLesson({
                                                                                            ...fullLesson,
                                                                                            date: lesson.date,
                                                                                            dateKey: lesson.dateKey
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                style={{padding: '0.2rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'inherit'}}
                                                                            >Edit</button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                
                                                {/* Timeline */}
                                                {selectedStudent.firstLesson && (
                                                    <div style={{marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b'}}>
                                                        <strong>First lesson:</strong> {selectedStudent.firstLesson.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        {selectedStudent.lastLesson && selectedStudent.lastLesson > selectedStudent.firstLesson && (
                                                            <> • <strong>Most recent/upcoming:</strong> {selectedStudent.lastLesson.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{background: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                                                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>👈</div>
                                                <h3 style={{margin: '0 0 0.5rem 0', color: '#1e293b'}}>Select a Student</h3>
                                                <p style={{margin: 0, color: '#64748b'}}>Click on a student from the list to view their details, lesson history, and add notes.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {adminTab === 'scheduling' && <AdminSchedulingPanel {...{blockedDates, blockedWeekdays, dateWindowStart, dateWindowEnd, handleStartDateChange, handleEndDateChange, setDateWindowStart, setDateWindowEnd, toggleBlockedDate, toggleBlockedWeekday, isDateBlocked, bookedLessons, cancelledLessons, firstAvailableDate: firstAvailable, saveSettings, weekdayTimeSettings, setWeekdayTimeSettings, dateTimeSettings, setDateTimeSettings, pools, setPools, poolSettings, setPoolSettings, savePools, savePoolSettings, poolSaveError, setPoolSaveError}} />}
                    </div>
                    {showCancelModal && cancelTarget && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h4 className="danger">Confirm Cancellation</h4>
                                {cancelTarget.type === 'single' ? <p>Are you sure you want to cancel this lesson?</p> : cancelTarget.type === 'date' ? <p>This day has <strong>{cancelTarget.lessons.length} lesson(s)</strong> booked. Blocking this day will cancel all of them.</p> : <p>There are <strong>{cancelTarget.lessons.length} lesson(s)</strong> booked on {DAYS[cancelTarget.dayIndex]}s. Blocking all {DAYS[cancelTarget.dayIndex]}s will cancel all of them.</p>}
                                {cancelTarget.type !== 'single' && <div className="conflict-list">{(cancelTarget.type === 'date' ? cancelTarget.lessons : cancelTarget.lessons.slice(0, 5)).map((item, i) => { const lesson = cancelTarget.type === 'date' ? item : item.lesson; const dk = cancelTarget.type === 'date' ? cancelTarget.dateKey : item.dateKey; const [y, m, d] = dk.split('-').map(Number); return <div key={i} className="conflict-date">{new Date(y, m, d).toLocaleDateString()} - {lesson.time} - {lesson.swimmer1Name || 'Unknown'}</div>; })}{cancelTarget.type === 'weekday' && cancelTarget.lessons.length > 5 && <div className="conflict-date">...and {cancelTarget.lessons.length - 5} more</div>}</div>}
                                <div className="btn-row"><button onClick={confirmCancellation} className="btn btn-danger">Yes, Cancel {cancelTarget.type === 'single' ? 'Lesson' : `${cancelTarget.lessons.length} Lesson(s)`}</button><button onClick={() => { setShowCancelModal(false); setCancelTarget(null); }} className="btn btn-secondary">Go Back</button></div>
                            </div>
                        </div>
                    )}
                    {editingLesson && (
                        <div className="modal-overlay">
                            <div className="modal" style={{maxWidth: '500px'}}>
                                <h4 style={{color: '#1e40af'}}>Edit Lesson</h4>
                                <p style={{color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem'}}>
                                    Original: {editingLesson.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {editingLesson.time}
                                </p>
                                
                                <div style={{display: 'grid', gap: '0.75rem'}}>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
                                        <div className="form-group" style={{margin: 0}}>
                                            <label style={{fontSize: '0.75rem', fontWeight: 600}}>Date</label>
                                            <input 
                                                type="date" 
                                                value={(() => {
                                                    const [y, m, d] = editLessonData.newDateKey?.split('-').map(Number) || [];
                                                    if (!y) return '';
                                                    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                                })()}
                                                onChange={(e) => {
                                                    const d = new Date(e.target.value);
                                                    const newDateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                                                    setEditLessonData({...editLessonData, newDateKey});
                                                }}
                                                className="form-input"
                                                style={{margin: 0}}
                                            />
                                        </div>
                                        <div className="form-group" style={{margin: 0}}>
                                            <label style={{fontSize: '0.75rem', fontWeight: 600}}>Time</label>
                                            <select 
                                                value={editLessonData.time} 
                                                onChange={(e) => setEditLessonData({...editLessonData, time: e.target.value})}
                                                className="form-select"
                                                style={{margin: 0}}
                                            >
                                                {ALL_LESSON_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group" style={{margin: 0}}>
                                        <label style={{fontSize: '0.75rem', fontWeight: 600}}>Lesson Type</label>
                                        <select
                                            value={editLessonData.lessonType}
                                            onChange={(e) => setEditLessonData({...editLessonData, lessonType: e.target.value})}
                                            className="form-select"
                                            style={{margin: 0}}
                                        >
                                            <option value="private">Private ($40)</option>
                                            <option value="group">Group ($70)</option>
                                        </select>
                                    </div>

                                    {pools.length > 0 && (
                                        <div className="form-group" style={{margin: 0}}>
                                            <label style={{fontSize: '0.75rem', fontWeight: 600}}>Pool</label>
                                            <select
                                                value={editLessonData.poolId || ''}
                                                onChange={(e) => setEditLessonData({...editLessonData, poolId: e.target.value})}
                                                className="form-select"
                                                style={{margin: 0}}
                                            >
                                                <option value="">— No pool assigned —</option>
                                                {pools.map(p => <option key={p.id} value={p.id}>{p.name} — {p.address}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem'}}>
                                        <div style={{fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem'}}>Parent/Contact</div>
                                        <div className="form-group" style={{margin: '0 0 0.5rem 0'}}>
                                            <label style={{fontSize: '0.75rem'}}>Parent Name</label>
                                            <input type="text" value={editLessonData.parentName} onChange={(e) => setEditLessonData({...editLessonData, parentName: e.target.value})} className="form-input" style={{margin: 0}} />
                                        </div>
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
                                            <div className="form-group" style={{margin: 0}}>
                                                <label style={{fontSize: '0.75rem'}}>Email</label>
                                                <input type="email" value={editLessonData.email} onChange={(e) => setEditLessonData({...editLessonData, email: e.target.value})} className="form-input" style={{margin: 0}} />
                                            </div>
                                            <div className="form-group" style={{margin: 0}}>
                                                <label style={{fontSize: '0.75rem'}}>Phone</label>
                                                <input type="tel" value={editLessonData.phone} onChange={(e) => setEditLessonData({...editLessonData, phone: e.target.value})} className="form-input" style={{margin: 0}} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem'}}>
                                        <div style={{fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem'}}>Swimmer 1</div>
                                        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem'}}>
                                            <div className="form-group" style={{margin: 0}}>
                                                <label style={{fontSize: '0.75rem'}}>Name</label>
                                                <input type="text" value={editLessonData.swimmer1Name} onChange={(e) => setEditLessonData({...editLessonData, swimmer1Name: e.target.value})} className="form-input" style={{margin: 0}} />
                                            </div>
                                            <div className="form-group" style={{margin: 0}}>
                                                <label style={{fontSize: '0.75rem'}}>Birthday</label>
                                                <input type="date" value={editLessonData.swimmer1Birthday} onChange={(e) => setEditLessonData({...editLessonData, swimmer1Birthday: e.target.value})} className="form-input" style={{margin: 0}} />
                                                {editLessonData.swimmer1Birthday && <div style={{fontSize: '0.7rem', color: '#64748b'}}>Age: {calculateAge(editLessonData.swimmer1Birthday)}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    {editLessonData.lessonType === 'group' && (
                                        <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem'}}>
                                            <div style={{fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem'}}>Swimmer 2</div>
                                            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem'}}>
                                                <div className="form-group" style={{margin: 0}}>
                                                    <label style={{fontSize: '0.75rem'}}>Name</label>
                                                    <input type="text" value={editLessonData.swimmer2Name} onChange={(e) => setEditLessonData({...editLessonData, swimmer2Name: e.target.value})} className="form-input" style={{margin: 0}} />
                                                </div>
                                                <div className="form-group" style={{margin: 0}}>
                                                    <label style={{fontSize: '0.75rem'}}>Birthday</label>
                                                    <input type="date" value={editLessonData.swimmer2Birthday} onChange={(e) => setEditLessonData({...editLessonData, swimmer2Birthday: e.target.value})} className="form-input" style={{margin: 0}} />
                                                    {editLessonData.swimmer2Birthday && <div style={{fontSize: '0.7rem', color: '#64748b'}}>Age: {calculateAge(editLessonData.swimmer2Birthday)}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="btn-row" style={{marginTop: '1.5rem'}}>
                                    <button onClick={saveEditedLesson} className="btn btn-success">Save Changes</button>
                                    <button onClick={() => { setEditingLesson(null); setEditLessonData({}); }} className="btn btn-secondary">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showResetModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h4 className="danger">⚠️ Reset All Data</h4>
                                <p style={{marginBottom: '1rem'}}>This will permanently delete:</p>
                                <ul style={{marginLeft: '1.5rem', marginBottom: '1rem', color: '#64748b'}}>
                                    <li>All booked lessons</li>
                                    <li>All cancelled lessons</li>
                                    <li>All blocked dates and weekdays</li>
                                    <li>Date window settings</li>
                                </ul>
                                <p style={{fontWeight: 600, color: '#dc2626'}}>This action cannot be undone!</p>
                                <div className="btn-row">
                                    <button onClick={resetAllData} className="btn btn-danger">Yes, Reset Everything</button>
                                    <button onClick={() => setShowResetModal(false)} className="btn btn-secondary">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                <section className="hero"><div className="hero-content"><h1>Swim for Life</h1><p className="tagline">Private Swim Lessons · Ages 3 &amp; Up</p><p className="hero-subtagline">Swimming · Diving · Stroke Work</p><button className="hero-button" onClick={() => handleBookingClick(null)}>Book a private lesson</button><button className="hero-button hero-button-secondary" onClick={() => { setShowAbout(a => !a); setTimeout(() => { if (!showAbout) document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }, 50); }}>About Coach Conor</button></div></section>
                <section className={`about-section ${showAbout ? 'visible' : ''}`} id="about"><div className="about-content"><h2>About Coach Conor</h2><p>Coach Conor is a Raleigh native with a deep love of swimming and a life of experience in the sport. He currently serves as the head coach of the Wood Valley Otters, returning this year for his fifth year. He has over ten years of coaching experience working with swimmers of all ages on technique and stroke work.</p><p>When Coach Conor is not coaching in the summer, he works as a humanities teacher for middle and high schoolers at St. Thomas More Academy. He is the head coach of the school's swim team, which he started in 2015 while he was a student.</p><p>Coach Conor graduated from Hillsdale College and now lives in Knightdale with his lovely wife and daughter. During his free time, he enjoys reading, writing, and playing boardgames.</p><p className="about-certified">Coach Conor is lifeguard certified.</p></div></section>
                <section className="pricing"><h2>Pricing</h2><div className="price-grid"><div className="price-card" onClick={() => handleBookingClick('private')}><div className="swimmers">1 Swimmer</div><div className="amount">$40</div><div className="duration">30 minutes</div><div className="click-hint">Click to book</div></div><div className="price-card" onClick={() => handleBookingClick('group')}><div className="swimmers">2 Swimmers</div><div className="amount">$70</div><div className="duration">30 minutes</div><div className="click-hint">Click to book</div></div></div></section>
                <section className={`calendar-section ${showCalendar ? 'visible' : ''}`} id="calendar"><h2>Book Your Lesson</h2><SwimLessonCalendar {...{preselectedType, autoBookWeekly, bookedLessons, setBookedLessons, saveLessons, cancelledLessons, isDateBlocked, getFirstAvailableDate, getClosestAvailableTo, dateWindowEnd, lessonTypeUpdate, weekdayTimeSettings, dateTimeSettings, pools, poolSettings}} /></section>
                <section className="contact-section" id="contact"><div className="contact-content"><h2>Contact</h2><p className="contact-intro">Questions about lessons? Reach out anytime — I'm happy to help.</p><div className="contact-grid"><a className="contact-card" href="tel:+19196951534"><div className="contact-label">Phone</div><div className="contact-value">919-695-1534</div></a><a className="contact-card" href="mailto:coach.conor.mulligan@gmail.com"><div className="contact-label">Email</div><div className="contact-value">coach.conor.mulligan@gmail.com</div></a></div></div></section><footer><p>&copy; 2026 Swim for Life, LLC</p></footer>
            </>
        );
    };
