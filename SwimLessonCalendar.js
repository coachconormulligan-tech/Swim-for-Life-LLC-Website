    const SwimLessonCalendar = ({ preselectedType, autoBookWeekly, bookedLessons, setBookedLessons, saveLessons, cancelledLessons, isDateBlocked, getFirstAvailableDate, getClosestAvailableTo, dateWindowEnd, lessonTypeUpdate, weekdayTimeSettings, dateTimeSettings, pools, poolSettings }) => {
        const [selectedPool, setSelectedPool] = useState('');
        const [currentDate, setCurrentDate] = useState(() => { const f = getFirstAvailableDate(); return new Date(f.getFullYear(), f.getMonth(), 1); });
        const [selectedDate, setSelectedDate] = useState(null);
        const [selectedTime, setSelectedTime] = useState('');
        const [conflictDates, setConflictDates] = useState([]);
        const [showConflictModal, setShowConflictModal] = useState(false);
        const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
        const [reschedulingConflict, setReschedulingConflict] = useState(null);
        const [reschedulingLessonInfo, setReschedulingLessonInfo] = useState(null);
        const [showBookingForm, setShowBookingForm] = useState(false);
        const [bookingType, setBookingType] = useState('weekly');
        const [showConfirmModal, setShowConfirmModal] = useState(false);
        const [formData, setFormData] = useState({ parentName: '', swimmer1Name: '', swimmer1Birthday: '', swimmer2Name: '', swimmer2Birthday: '', email: '', phone: '', lessonType: 'private' });
        const [formErrors, setFormErrors] = useState({});
        const [hasAutoSelected, setHasAutoSelected] = useState(false);
        const [lookupEmail, setLookupEmail] = useState('');
        const [lookupStatus, setLookupStatus] = useState(null); // 'found', 'not-found', 'select', null
        const [lookupData, setLookupData] = useState(null);
        const [lookupSwimmers, setLookupSwimmers] = useState([]); // All swimmers found for this email
        const [selectedSwimmerIndexes, setSelectedSwimmerIndexes] = useState([]); // Array of selected indexes (max 2)
        const [rescheduledLessons, setRescheduledLessons] = useState([]); // Track lessons rescheduled in this session
        const [showSameDayWarning, setShowSameDayWarning] = useState(false);
        const [sameDayExistingTime, setSameDayExistingTime] = useState(null);
        const [pendingLessonInfo, setPendingLessonInfo] = useState(null); // Store lesson info for delayed email
        const pendingEmailDatesRef = React.useRef([]); // Track dates synchronously for email
        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [bookedDatesForCalendar, setBookedDatesForCalendar] = useState([]);

        // Helper to get lesson times for a specific weekday (uses selected pool if set)
        const getLessonTimesForDay = (dayIndex) => {
            const settings = selectedPool && poolSettings && poolSettings[selectedPool]
                ? poolSettings[selectedPool].weekdayTimeSettings
                : weekdayTimeSettings;
            if (settings && settings[dayIndex] && settings[dayIndex].length > 0) {
                return settings[dayIndex];
            }
            return DEFAULT_LESSON_TIMES;
        };

        // Per-date override wins over weekday setting. Empty array = blocked.
        const getLessonTimesForDate = (year, month, day) => {
            const dateKey = `${year}-${month}-${day}`;
            const overrides = selectedPool && poolSettings && poolSettings[selectedPool]
                ? (poolSettings[selectedPool].dateTimeSettings || {})
                : (dateTimeSettings || {});
            if (Object.prototype.hasOwnProperty.call(overrides, dateKey)) return overrides[dateKey];
            return getLessonTimesForDay(new Date(year, month, day).getDay());
        };

        // Effective date window end: use pool-specific if available, else global
        const effectiveDateWindowEnd = (selectedPool && poolSettings && poolSettings[selectedPool] && poolSettings[selectedPool].dateWindowEnd)
            ? poolSettings[selectedPool].dateWindowEnd
            : dateWindowEnd;

        // Handle pool dropdown change: reset all selection state
        const handlePoolChange = (poolId) => {
            setSelectedPool(poolId);
            setSelectedDate(null);
            setSelectedTime('');
            setShowBookingForm(false);
            setConflictDates([]);
            setReschedulingConflict(null);
            setReschedulingLessonInfo(null);
            setRescheduledLessons([]);
            if (poolId) {
                const firstAvail = getFirstAvailableDate(poolId);
                setCurrentDate(new Date(firstAvail.getFullYear(), firstAvail.getMonth(), 1));
            }
        };

        const getMonthData = (date) => ({ year: date.getFullYear(), month: date.getMonth(), firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(), daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() });
        const formatDateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const getActiveLessons = (dateKey) => (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
        const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        const validatePhone = (p) => /^[\d\s\-\+\(\)]{10,}$/.test(p.replace(/\s/g, ''));
        const formatPhoneNumber = (v) => { const n = v.replace(/\D/g, ''); if (n.length <= 3) return n; if (n.length <= 6) return `(${n.slice(0, 3)}) ${n.slice(3)}`; return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 10)}`; };

        // Look up returning user by email - finds all unique swimmers
        const lookupUserByEmail = () => {
            if (!lookupEmail || !validateEmail(lookupEmail)) {
                setLookupStatus('invalid');
                return;
            }
            
            const emailLower = lookupEmail.toLowerCase().trim();
            const swimmersMap = {}; // key: swimmer name lowercase, value: swimmer data
            let parentInfo = { parentName: '', phone: '' };
            let mostRecentParentDate = null;
            
            // Search all booked lessons for this email
            Object.entries(bookedLessons).forEach(([dateKey, lessons]) => {
                const [y, m, d] = dateKey.split('-').map(Number);
                const lessonDate = new Date(y, m, d);
                
                lessons.forEach(lesson => {
                    if (lesson.email && lesson.email.toLowerCase().trim() === emailLower) {
                        // Track most recent parent info
                        if (!mostRecentParentDate || lessonDate > mostRecentParentDate) {
                            mostRecentParentDate = lessonDate;
                            parentInfo = {
                                parentName: lesson.parentName || '',
                                phone: lesson.phone || ''
                            };
                        }
                        
                        // Track swimmer 1
                        if (lesson.swimmer1Name) {
                            const key = lesson.swimmer1Name.toLowerCase().trim();
                            if (!swimmersMap[key] || lessonDate > swimmersMap[key].lastSeen) {
                                swimmersMap[key] = {
                                    name: lesson.swimmer1Name,
                                    birthday: lesson.swimmer1Birthday || '',
                                    lastSeen: lessonDate
                                };
                            }
                        }

                        // Track swimmer 2 (from group lessons)
                        if (lesson.swimmer2Name) {
                            const key = lesson.swimmer2Name.toLowerCase().trim();
                            if (!swimmersMap[key] || lessonDate > swimmersMap[key].lastSeen) {
                                swimmersMap[key] = {
                                    name: lesson.swimmer2Name,
                                    birthday: lesson.swimmer2Birthday || '',
                                    lastSeen: lessonDate
                                };
                            }
                        }
                    }
                });
            });
            
            const swimmers = Object.values(swimmersMap).sort((a, b) => b.lastSeen - a.lastSeen);
            
            if (swimmers.length === 0) {
                setLookupStatus('not-found');
                setLookupData(null);
                setLookupSwimmers([]);
            } else if (swimmers.length === 1) {
                // Single swimmer - auto-select
                setLookupStatus('found');
                setLookupData({
                    parentName: parentInfo.parentName,
                    phone: parentInfo.phone,
                    swimmer1Name: swimmers[0].name,
                    swimmer1Birthday: swimmers[0].birthday,
                    swimmer2Name: '',
                    swimmer2Birthday: '',
                    lessonType: 'private'
                });
                setLookupSwimmers(swimmers);
            } else {
                // Multiple swimmers - let user choose
                setLookupStatus('select');
                setLookupData({
                    parentName: parentInfo.parentName,
                    phone: parentInfo.phone
                });
                setLookupSwimmers(swimmers);
                setSelectedSwimmerIndexes([]);
            }
        };
        
        const toggleSwimmerSelection = (index) => {
            setSelectedSwimmerIndexes(prev => {
                if (prev.includes(index)) {
                    // Remove if already selected
                    return prev.filter(i => i !== index);
                } else if (prev.length < 2) {
                    // Add if under limit
                    return [...prev, index];
                }
                // At limit, don't add
                return prev;
            });
        };
        
        const confirmSwimmerSelection = () => {
            if (selectedSwimmerIndexes.length === 0) return;
            
            const swimmer1 = lookupSwimmers[selectedSwimmerIndexes[0]];
            const swimmer2 = selectedSwimmerIndexes.length > 1 ? lookupSwimmers[selectedSwimmerIndexes[1]] : null;
            
            setLookupStatus('found');
            setLookupData({
                ...lookupData,
                swimmer1Name: swimmer1.name,
                swimmer1Birthday: swimmer1.birthday,
                swimmer2Name: swimmer2 ? swimmer2.name : '',
                swimmer2Birthday: swimmer2 ? swimmer2.birthday : '',
                lessonType: swimmer2 ? 'group' : 'private'
            });
        };
        
        const applyLookupData = () => {
            if (lookupData) {
                setFormData({
                    ...formData,
                    email: lookupEmail,
                    parentName: lookupData.parentName,
                    phone: lookupData.phone,
                    swimmer1Name: lookupData.swimmer1Name,
                    swimmer1Birthday: lookupData.swimmer1Birthday,
                    swimmer2Name: lookupData.swimmer2Name,
                    swimmer2Birthday: lookupData.swimmer2Birthday,
                    lessonType: lookupData.lessonType
                });
                setLookupStatus(null);
                setLookupEmail('');
            }
        };
        
        const clearLookup = () => {
            setLookupStatus(null);
            setLookupData(null);
            setLookupEmail('');
            setLookupSwimmers([]);
            setSelectedSwimmerIndexes([]);
        };

        // Update lesson type when price card is clicked
        useEffect(() => {
            if (preselectedType && lessonTypeUpdate > 0) {
                setFormData(prev => ({ ...prev, lessonType: preselectedType }));
            }
        }, [preselectedType, lessonTypeUpdate]);

        const getAvailableTimes = (selDate) => {
            if (!selDate) return [];
            const dateKey = `${selDate.year}-${selDate.month}-${selDate.day}`;
            const bookedTimes = getActiveLessons(dateKey).map(l => l.time);
            const dayTimes = getLessonTimesForDate(selDate.year, selDate.month, selDate.day);
            return dayTimes.filter(t => !bookedTimes.includes(t)).slice(0, 2);
        };

        const countWeeklyLessons = (startDate, time) => {
            let count = 0;
            const endDate = effectiveDateWindowEnd ? new Date(effectiveDateWindowEnd) : null;
            for (let i = 0; i < 12; i++) {
                const lessonDate = new Date(startDate.year, startDate.month, startDate.day);
                lessonDate.setDate(lessonDate.getDate() + i * 7);
                if (endDate && lessonDate > endDate) break;
                // Count ALL days in the window - blocked/conflict days will be rescheduled
                count++;
            }
            return count;
        };

        const getLastLessonDate = (startDate, time) => {
            let lastDate = new Date(startDate.year, startDate.month, startDate.day);
            const endDate = effectiveDateWindowEnd ? new Date(effectiveDateWindowEnd) : null;
            for (let i = 0; i < 12; i++) {
                const lessonDate = new Date(startDate.year, startDate.month, startDate.day);
                lessonDate.setDate(lessonDate.getDate() + i * 7);
                if (endDate && lessonDate > endDate) break;
                lastDate = lessonDate;
            }
            return lastDate;
        };

        useEffect(() => {
            if (preselectedType && selectedPool && !hasAutoSelected) {
                setFormData(prev => ({ ...prev, lessonType: preselectedType }));
                if (autoBookWeekly) setBookingType('weekly');
                const firstAvailable = getFirstAvailableDate(selectedPool);
                setCurrentDate(new Date(firstAvailable.getFullYear(), firstAvailable.getMonth(), 1));
                const selDate = { year: firstAvailable.getFullYear(), month: firstAvailable.getMonth(), day: firstAvailable.getDate() };
                const availTime = getAvailableTimes(selDate)[0] || '';
                setSelectedDate(selDate);
                setSelectedTime(availTime);
                setShowBookingForm(true);
                setHasAutoSelected(true);
            }
        }, [preselectedType, autoBookWeekly, hasAutoSelected, selectedPool]);

        const handleDateSelect = (year, month, day) => {
            const selDate = { year, month, day };
            const availTime = getAvailableTimes(selDate)[0] || '';
            
            // During rescheduling, check if there's already a rescheduled lesson on this day
            if (reschedulingConflict) {
                const dateKey = `${year}-${month}-${day}`;
                const existingRescheduled = rescheduledLessons.find(r => r.dateKey === dateKey);
                if (existingRescheduled) {
                    setSameDayExistingTime(existingRescheduled.time);
                    setShowSameDayWarning(true);
                    setSelectedDate(selDate);
                    setSelectedTime(availTime);
                    return;
                }
            }
            
            setSelectedDate(selDate);
            setSelectedTime(availTime);
            if (availTime && !showBookingForm && !reschedulingConflict) setShowBookingForm(true);
        };

        const resetForm = () => { setFormData({ parentName: '', swimmer1Name: '', swimmer1Birthday: '', swimmer2Name: '', swimmer2Birthday: '', email: '', phone: '', lessonType: preselectedType || 'private' }); setFormErrors({}); setShowBookingForm(false); setBookingType('weekly'); };

        const bookLesson = (year, month, day, time, lessonInfo) => {
            const dateKey = `${year}-${month}-${day}`;
            const current = getActiveLessons(dateKey);
            const maxForDay = getLessonTimesForDate(year, month, day).length;
            if (current.length < maxForDay && !current.some(l => l.time === time)) {
                const newLessons = { ...bookedLessons, [dateKey]: [...(bookedLessons[dateKey] || []), lessonInfo || { time }] };
                setBookedLessons(newLessons);
                saveLessons(newLessons);
            }
        };

        const checkWeeklyConflicts = (year, month, day, time) => {
            const conflicts = [], startDate = new Date(year, month, day);
            const endDate = effectiveDateWindowEnd ? new Date(effectiveDateWindowEnd) : null;
            for (let i = 0; i < 12; i++) {
                const lessonDate = new Date(startDate); lessonDate.setDate(lessonDate.getDate() + i * 7);
                if (endDate && lessonDate > endDate) break;
                const dateKey = formatDateKey(lessonDate), booked = getActiveLessons(dateKey), blocked = isDateBlocked(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate(), selectedPool);
                const maxForDay = getLessonTimesForDate(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate()).length;
                if (blocked || booked.some(l => l.time === time) || booked.length >= maxForDay) conflicts.push({ date: lessonDate, dateString: lessonDate.toLocaleDateString(), dateKey });
            }
            return conflicts;
        };

        const bookWeeklyLesson = (year, month, day, time, lessonInfo) => {
            const conflicts = checkWeeklyConflicts(year, month, day, time);
            const conflictKeys = new Set(conflicts.map(c => c.dateKey));
            const endDate = effectiveDateWindowEnd ? new Date(effectiveDateWindowEnd) : null;
            setReschedulingLessonInfo(lessonInfo);
            
            // Batch all lessons into a single update
            let newLessons = { ...bookedLessons };
            for (let i = 0; i < 12; i++) {
                const lessonDate = new Date(year, month, day); 
                lessonDate.setDate(lessonDate.getDate() + i * 7);
                if (endDate && lessonDate > endDate) break;
                const dateKey = formatDateKey(lessonDate);
                if (!conflictKeys.has(dateKey)) {
                    const current = (newLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
                    const maxForDay = getLessonTimesForDate(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate()).length;
                    if (current.length < maxForDay && !current.some(l => l.time === time)) {
                        newLessons = { ...newLessons, [dateKey]: [...(newLessons[dateKey] || []), lessonInfo] };
                    }
                }
            }
            setBookedLessons(newLessons);
            saveLessons(newLessons);
            
            if (conflicts.length > 0) { setConflictDates(conflicts); setCurrentConflictIndex(0); setShowConflictModal(true); }
            else { setSelectedDate(null); setSelectedTime(''); setReschedulingLessonInfo(null); resetForm(); }
        };

        const handleBookClick = () => { if (!selectedDate || !selectedTime) return; if (!validateEmail(formData.email)) { setFormErrors(e => ({...e, email: 'Please enter a valid email'})); return; } if (!validatePhone(formData.phone)) { setFormErrors(e => ({...e, phone: 'Please enter a valid phone number'})); return; } setShowConfirmModal(true); };

        // Send booking confirmation emails
        const sendBookingEmails = (lessonInfo, bookedDates) => {
            const swimmerInfo = lessonInfo.lessonType === 'group'
                ? `${lessonInfo.swimmer1Name} (Age: ${calculateAge(lessonInfo.swimmer1Birthday)})\n${lessonInfo.swimmer2Name} (Age: ${calculateAge(lessonInfo.swimmer2Birthday)})`
                : `${lessonInfo.swimmer1Name} (Age: ${calculateAge(lessonInfo.swimmer1Birthday)})`;

            const lessonDatesFormatted = bookedDates.map((d, i) => {
                const date = new Date(d.year, d.month, d.day);
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                return `${i + 1}. ${dateStr} at ${d.time}`;
            }).join('\n');

            const totalLessons = bookedDates.length;
            const pricePerLesson = lessonInfo.price;
            const totalPrice = totalLessons * pricePerLesson;
            const lessonTypeDisplay = lessonInfo.lessonType === 'private' ? 'Private (1 swimmer)' : 'Group (2 swimmers)';

            const poolObj = pools && lessonInfo.poolId ? pools.find(p => p.id === lessonInfo.poolId) : null;
            const poolName = poolObj ? poolObj.name : '';
            const poolAddress = poolObj ? (poolObj.address || '') : '';

            // Customer email
            const customerParams = {
                parent_name: lessonInfo.parentName,
                lesson_type: lessonTypeDisplay,
                total_lessons: totalLessons,
                price_per_lesson: `$${pricePerLesson}`,
                swimmer_info: swimmerInfo,
                lesson_dates: lessonDatesFormatted,
                parent_email: lessonInfo.email,
                pool_name: poolName,
                pool_address: poolAddress
            };

            // Admin email
            const adminParams = {
                parent_name: lessonInfo.parentName,
                parent_email: lessonInfo.email,
                parent_phone: lessonInfo.phone,
                lesson_type: lessonTypeDisplay,
                total_lessons: totalLessons,
                total_price: `$${totalPrice}`,
                swimmer_info: swimmerInfo,
                lesson_dates: lessonDatesFormatted,
                pool_name: poolName,
                pool_address: poolAddress
            };
            
            // Send customer email
            emailjs.send('service_m2kd61t', 'template_8urgsqv', customerParams)
                .then(() => console.log('Customer email sent'))
                .catch(err => console.error('Customer email failed:', err));
            
            // Send admin email
            emailjs.send('service_m2kd61t', 'template_bj30128', adminParams)
                .then(() => console.log('Admin email sent'))
                .catch(err => console.error('Admin email failed:', err));
        };

        // Generate ICS content string
        const generateICSContent = (dates, swimmerName) => {
            const formatICSDate = (year, month, day, timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                const date = new Date(year, month, day, hours, minutes);
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };
            
            const formatICSEndDate = (year, month, day, timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                const date = new Date(year, month, day, hours, minutes + 30); // 30 min lesson
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Swim for Life//Lessons//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
            dates.forEach((d, i) => {
                icsContent += `BEGIN:VEVENT
UID:swimforlife-${Date.now()}-${i}@swimforlife.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${formatICSDate(d.year, d.month, d.day, d.time)}
DTEND:${formatICSEndDate(d.year, d.month, d.day, d.time)}
SUMMARY:Swim Lesson - ${swimmerName}
DESCRIPTION:Swim lesson for ${swimmerName}
END:VEVENT
`;
            });
            icsContent += 'END:VCALENDAR';
            return icsContent;
        };

        // Download ICS file
        const downloadICSFile = (dates, swimmerName, filename = 'swim-lessons.ics') => {
            const icsContent = generateICSContent(dates, swimmerName);
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        };

        const showBookingSuccess = (dates, lessonInfo) => {
            setBookedDatesForCalendar(dates.map(d => ({ ...d, swimmerName: lessonInfo.swimmer1Name + (lessonInfo.swimmer2Name ? ' & ' + lessonInfo.swimmer2Name : '') })));
            setShowSuccessModal(true);
        };

        const confirmBooking = () => {
            setShowConfirmModal(false);
            const lessonInfo = { time: selectedTime, parentName: formData.parentName, swimmer1Name: formData.swimmer1Name, swimmer1Birthday: formData.swimmer1Birthday, email: formData.email, phone: formData.phone, lessonType: formData.lessonType, price: formData.lessonType === 'private' ? 40 : 70, poolId: selectedPool };
            if (formData.lessonType === 'group') { lessonInfo.swimmer2Name = formData.swimmer2Name; lessonInfo.swimmer2Birthday = formData.swimmer2Birthday; }

            if (bookingType === 'single') {
                const singleDate = [{ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day, time: selectedTime }];
                bookLesson(selectedDate.year, selectedDate.month, selectedDate.day, selectedTime, lessonInfo);
                sendBookingEmails(lessonInfo, singleDate);
                showBookingSuccess(singleDate, lessonInfo);
                setSelectedDate(null); setSelectedTime(''); resetForm();
            } else {
                // Calculate which dates will be booked for weekly (non-conflict dates)
                const bookedDates = [];
                const conflicts = checkWeeklyConflicts(selectedDate.year, selectedDate.month, selectedDate.day, selectedTime);
                const conflictKeys = new Set(conflicts.map(c => c.dateKey));
                const endDate = effectiveDateWindowEnd ? new Date(effectiveDateWindowEnd) : null;
                
                for (let i = 0; i < 12; i++) {
                    const lessonDate = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
                    lessonDate.setDate(lessonDate.getDate() + i * 7);
                    if (endDate && lessonDate > endDate) break;
                    const dateKey = `${lessonDate.getFullYear()}-${lessonDate.getMonth()}-${lessonDate.getDate()}`;
                    if (!conflictKeys.has(dateKey)) {
                        const current = (bookedLessons[dateKey] || []).filter(l => !cancelledLessons.has(`${dateKey}-${l.time}`));
                        const maxForDay = getLessonTimesForDate(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate()).length;
                        if (current.length < maxForDay && !current.some(l => l.time === selectedTime)) {
                            bookedDates.push({ year: lessonDate.getFullYear(), month: lessonDate.getMonth(), day: lessonDate.getDate(), time: selectedTime });
                        }
                    }
                }
                
                if (conflicts.length > 0) {
                    // Store dates and info for later email after conflicts resolved
                    pendingEmailDatesRef.current = bookedDates;
                    setPendingLessonInfo(lessonInfo);
                } else {
                    // No conflicts, send email and show success immediately
                    sendBookingEmails(lessonInfo, bookedDates);
                    showBookingSuccess(bookedDates, lessonInfo);
                }
                
                bookWeeklyLesson(selectedDate.year, selectedDate.month, selectedDate.day, selectedTime, lessonInfo);
            }
        };

        const handleConflictResolution = (skip) => {
            if (skip) { 
                // User chose to skip all conflicts - send email with just the non-conflict dates
                if (pendingLessonInfo && pendingEmailDatesRef.current.length > 0) {
                    const sortedDates = [...pendingEmailDatesRef.current].sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day));
                    sendBookingEmails(pendingLessonInfo, sortedDates);
                    showBookingSuccess(sortedDates, pendingLessonInfo);
                }
                pendingEmailDatesRef.current = [];
                setShowConflictModal(false); setConflictDates([]); setCurrentConflictIndex(0); setSelectedDate(null); setSelectedTime(''); setReschedulingLessonInfo(null); setPendingLessonInfo(null); resetForm(); return; 
            }
            const conflict = conflictDates[currentConflictIndex];
            setReschedulingConflict(conflict);
            setShowConflictModal(false);
            const closest = getClosestAvailableTo ? getClosestAvailableTo(conflict.date, selectedPool) : null;
            if (closest) {
                setCurrentDate(new Date(closest.year, closest.month, 1));
                setSelectedDate({ year: closest.year, month: closest.month, day: closest.day });
                setSelectedTime(closest.time);
            } else {
                setCurrentDate(new Date(conflict.date.getFullYear(), conflict.date.getMonth(), 1));
                setSelectedDate(null);
                setSelectedTime('');
            }
        };

        const handleRescheduleComplete = (newTime) => {
            if (reschedulingLessonInfo && selectedDate) {
                bookLesson(selectedDate.year, selectedDate.month, selectedDate.day, newTime, { ...reschedulingLessonInfo, time: newTime });
                // Track this rescheduled lesson
                const dateKey = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
                setRescheduledLessons(prev => [...prev, { dateKey, time: newTime }]);
                // Add rescheduled date to pending email dates (synchronous)
                pendingEmailDatesRef.current.push({ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day, time: newTime });
            }
            const nextIndex = currentConflictIndex + 1;
            if (nextIndex < conflictDates.length) {
                setCurrentConflictIndex(nextIndex);
                const nextConflict = conflictDates[nextIndex];
                setReschedulingConflict(nextConflict);
                const nextClosest = getClosestAvailableTo ? getClosestAvailableTo(nextConflict.date, selectedPool, pendingEmailDatesRef.current) : null;
                if (nextClosest) {
                    setCurrentDate(new Date(nextClosest.year, nextClosest.month, 1));
                    setSelectedDate({ year: nextClosest.year, month: nextClosest.month, day: nextClosest.day });
                    setSelectedTime(nextClosest.time);
                } else {
                    setCurrentDate(new Date(nextConflict.date.getFullYear(), nextConflict.date.getMonth(), 1));
                    setSelectedDate(null);
                    setSelectedTime('');
                }
            }
            else {
                // All conflicts resolved - send email now with all dates
                if (pendingLessonInfo && pendingEmailDatesRef.current.length > 0) {
                    // Sort dates chronologically
                    const sortedDates = [...pendingEmailDatesRef.current].sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day));
                    sendBookingEmails(pendingLessonInfo, sortedDates);
                    showBookingSuccess(sortedDates, pendingLessonInfo);
                }
                pendingEmailDatesRef.current = [];
                setConflictDates([]); 
                setCurrentConflictIndex(0); 
                setReschedulingConflict(null); 
                setReschedulingLessonInfo(null); 
                setSelectedDate(null); 
                setSelectedTime(''); 
                setRescheduledLessons([]);
                setPendingLessonInfo(null);
                resetForm(); 
            }
        };

        const handleSkipReschedule = () => {
            // Skipping this conflict - don't add anything to pendingEmailDatesRef
            const nextIndex = currentConflictIndex + 1;
            if (nextIndex < conflictDates.length) {
                setCurrentConflictIndex(nextIndex);
                const nextConflict = conflictDates[nextIndex];
                setReschedulingConflict(nextConflict);
                const nextClosest = getClosestAvailableTo ? getClosestAvailableTo(nextConflict.date, selectedPool, pendingEmailDatesRef.current) : null;
                if (nextClosest) {
                    setCurrentDate(new Date(nextClosest.year, nextClosest.month, 1));
                    setSelectedDate({ year: nextClosest.year, month: nextClosest.month, day: nextClosest.day });
                    setSelectedTime(nextClosest.time);
                } else {
                    setCurrentDate(new Date(nextConflict.date.getFullYear(), nextConflict.date.getMonth(), 1));
                    setSelectedDate(null);
                    setSelectedTime('');
                }
            }
            else {
                // All conflicts done (this one skipped) - send email with current dates
                if (pendingLessonInfo && pendingEmailDatesRef.current.length > 0) {
                    const sortedDates = [...pendingEmailDatesRef.current].sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day));
                    sendBookingEmails(pendingLessonInfo, sortedDates);
                    showBookingSuccess(sortedDates, pendingLessonInfo);
                }
                pendingEmailDatesRef.current = [];
                setConflictDates([]); 
                setCurrentConflictIndex(0); 
                setReschedulingConflict(null); 
                setReschedulingLessonInfo(null); 
                setSelectedDate(null); 
                setSelectedTime(''); 
                setRescheduledLessons([]);
                setPendingLessonInfo(null);
                resetForm(); 
            }
        };

        const { year, month, firstDay, daysInMonth } = getMonthData(currentDate);
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const weeklyCount = selectedDate && selectedTime ? countWeeklyLessons(selectedDate, selectedTime) : 0;
        const lastLessonDate = selectedDate && selectedTime ? getLastLessonDate(selectedDate, selectedTime) : null;
        const startDateStr = selectedDate ? new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        const endDateStr = lastLessonDate ? lastLessonDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

        return (
            <div className="calendar-container">
                {/* Pool selector — must be chosen before date/time */}
                {pools && pools.length > 0 && (
                    <div className="form-group" style={{marginBottom: '1.5rem'}}>
                        <label style={{fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem', display: 'block'}}>Select a Pool *</label>
                        <select
                            value={selectedPool}
                            onChange={(e) => handlePoolChange(e.target.value)}
                            className="form-select"
                        >
                            <option value="">— Choose a pool to see availability —</option>
                            {pools.map(p => (
                                <option key={p.id} value={p.id}>{p.name}{p.address ? ` — ${p.address}` : ''}</option>
                            ))}
                        </select>
                        {!selectedPool && (
                            <p style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem'}}>Please select a pool above to view available dates and times.</p>
                        )}
                    </div>
                )}

                {/* Calendar (only shown once a pool is selected, or if no pools configured yet) */}
                {(selectedPool || !pools || pools.length === 0) && <>
                <div className="calendar-header"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="nav-btn"><ChevronLeft /></button><h3>{monthName} {year}</h3><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="nav-btn"><ChevronRight /></button></div>
                <div className="weekdays">{DAYS.map((d, i) => <div key={d} className={`weekday${getLessonTimesForDay(i).length === 0 ? ' blocked' : ''}`}>{d}</div>)}</div>
                <div className="days-grid">
                    {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} className="day-cell empty" />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1, dateKey = `${year}-${month}-${day}`, date = new Date(year, month, day);
                        const todayDate = new Date(); todayDate.setHours(0,0,0,0);
                        const isPast = date < todayDate;
                        const isTodayDate = date.getFullYear() === todayDate.getFullYear() && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate();
                        const blocked = isDateBlocked(year, month, day, selectedPool);
                        const isConflictDay = reschedulingConflict && reschedulingConflict.date.getFullYear() === year && reschedulingConflict.date.getMonth() === month && reschedulingConflict.date.getDate() === day;
                        const isSelected = selectedDate && selectedDate.year === year && selectedDate.month === month && selectedDate.day === day;
                        
                        // Check if this day is in the same week as the conflict (for green highlighting)
                        let isInConflictWeek = false;
                        if (reschedulingConflict && !isConflictDay) {
                            const conflictDate = reschedulingConflict.date;
                            const conflictDayOfWeek = conflictDate.getDay();
                            const weekStart = new Date(conflictDate);
                            weekStart.setDate(conflictDate.getDate() - conflictDayOfWeek);
                            const weekEnd = new Date(weekStart);
                            weekEnd.setDate(weekStart.getDate() + 6);
                            isInConflictWeek = date >= weekStart && date <= weekEnd;
                        }
                        
                        // Only count active (non-cancelled) lessons at the selected pool
                        const bookedCount = getActiveLessons(dateKey).filter(l => !selectedPool || l.poolId === selectedPool).length;
                        const maxForDay = getLessonTimesForDate(year, month, day).length;
                        const totalBars = Math.min(bookedCount + 1, maxForDay);
                        
                        let cn = 'day-cell';
                        if (isPast) cn += ' past';
                        else if (isTodayDate) cn += ' today';
                        else if (blocked) cn += ' blocked';
                        if (isConflictDay && !isPast) cn += ' conflict-highlight';
                        else if (isInConflictWeek && !isPast && !blocked && !isTodayDate) cn += ' conflict-week';
                        if (isSelected && !isConflictDay) cn += ' selected';
                        
                        const canClick = !isPast && !isTodayDate && !blocked;
                        
                        return (
                            <div key={day} onClick={() => canClick && handleDateSelect(year, month, day)} className={cn}>
                                <div className="day-number">{day}</div>
                                {!isPast && !blocked && !isTodayDate && (
                                    <div className="slots-container">
                                        {[...Array(totalBars)].map((_, j) => (
                                            <div key={j} className={`slot-bar ${j < bookedCount ? 'booked' : 'available'}`} />
                                        ))}
                                    </div>
                                )}
                                {isConflictDay && !isPast && <div style={{fontSize: '0.65rem', color: '#dc2626', marginTop: '4px', fontWeight: 600}}>Conflict</div>}
                                {isTodayDate && <div style={{fontSize: '0.65rem', color: '#92400e', marginTop: '4px'}}>Today</div>}
                                {blocked && !isPast && !isTodayDate && !isConflictDay && <div style={{fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px'}}>Unavailable</div>}
                            </div>
                        );
                    })}
                </div>

                {showBookingForm && !reschedulingConflict && selectedDate && (() => {
                    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(selectedDate.year, selectedDate.month, selectedDate.day).getDay()];
                    return (
                    <div className="booking-panel">
                        <h4>{bookingType === 'weekly' ? 'Weekly Lesson' : 'Single Lesson'} — {selectedTime} on {monthName} {selectedDate.day}, {selectedDate.year}</h4>
                        <div className="booking-dates">
                            <strong>Start Date:</strong> {startDateStr}
                            {bookingType === 'weekly' && lastLessonDate && <> &nbsp;|&nbsp; <strong>End Date:</strong> {endDateStr} &nbsp;|&nbsp; <strong>{weeklyCount} lesson(s)</strong></>}
                        </div>
                        <div className="booking-type-toggle"><button className={`booking-type-btn ${bookingType === 'weekly' ? 'active' : ''}`} onClick={() => setBookingType('weekly')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><span>Weekly ({weeklyCount})</span><span style={{fontSize: '0.75rem', fontWeight: 400, marginTop: '0.25rem'}}>{dayName}s, {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\w{3})/, '$1.')} - {lastLessonDate ? lastLessonDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\w{3})/, '$1.') : ''}</span></button><button className={`booking-type-btn ${bookingType === 'single' ? 'active' : ''}`} onClick={() => setBookingType('single')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><span>Single</span><span style={{fontSize: '0.75rem', fontWeight: 400, marginTop: '0.25rem'}}>{dayName}, {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\w{3})/, '$1.')}</span></button></div>
                        
                        {/* Returning User Lookup */}
                        <div style={{background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem', marginBottom: '1rem'}}>
                            <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#0369a1', marginBottom: '0.5rem'}}>🔄 Returning swimmer? Look up your info by entering your email.</div>
                            <div className="lookup-row">
                                <div style={{flex: 1}}>
                                    <input 
                                        type="email" 
                                        value={lookupEmail} 
                                        onChange={(e) => { setLookupEmail(e.target.value); setLookupStatus(null); }}
                                        onKeyPress={(e) => e.key === 'Enter' && lookupUserByEmail()}
                                        placeholder="Enter your email address" 
                                        className="form-input"
                                        style={{marginBottom: 0}}
                                    />
                                </div>
                                <button 
                                    onClick={lookupUserByEmail}
                                    disabled={!lookupEmail}
                                    style={{padding: '0.625rem 1rem', background: lookupEmail ? '#0ea5e9' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', cursor: lookupEmail ? 'pointer' : 'not-allowed', fontWeight: 500, fontSize: '0.875rem', fontFamily: 'inherit', whiteSpace: 'nowrap'}}
                                >Look Up</button>
                            </div>
                            
                            {lookupStatus === 'invalid' && (
                                <div style={{marginTop: '0.5rem', fontSize: '0.75rem', color: '#dc2626'}}>Please enter a valid email address</div>
                            )}
                            
                            {lookupStatus === 'not-found' && (
                                <div style={{marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b'}}>No previous bookings found for this email. Please fill in your information below.</div>
                            )}
                            
                            {lookupStatus === 'select' && lookupSwimmers.length > 1 && (
                                <div style={{marginTop: '0.75rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem'}}>
                                    <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem'}}>Multiple swimmers found!</div>
                                    <div style={{fontSize: '0.75rem', color: '#92400e', marginBottom: '0.5rem'}}>Select 1 for private lesson, or 2 for group lesson</div>
                                    <div style={{fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem'}}>
                                        <strong>{lookupData.parentName}</strong>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem'}}>
                                        {lookupSwimmers.map((swimmer, idx) => {
                                            const isSelected = selectedSwimmerIndexes.includes(idx);
                                            const isDisabled = !isSelected && selectedSwimmerIndexes.length >= 2;
                                            return (
                                            <label key={idx} style={{
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.5rem', 
                                                padding: '0.5rem 0.75rem',
                                                background: isSelected ? '#dbeafe' : 'white',
                                                border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`,
                                                borderRadius: '6px',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                opacity: isDisabled ? 0.5 : 1
                                            }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    disabled={isDisabled}
                                                    onChange={() => toggleSwimmerSelection(idx)}
                                                    style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                                                />
                                                <span style={{fontWeight: 500}}>{swimmer.name}</span>
                                                {swimmer.birthday && <span style={{color: '#64748b'}}>(age {calculateAge(swimmer.birthday)})</span>}
                                            </label>
                                            );
                                        })}
                                    </div>
                                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                                        <button 
                                            onClick={confirmSwimmerSelection} 
                                            disabled={selectedSwimmerIndexes.length === 0}
                                            style={{padding: '0.375rem 0.75rem', background: selectedSwimmerIndexes.length > 0 ? '#059669' : '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: selectedSwimmerIndexes.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit'}}
                                        >{selectedSwimmerIndexes.length === 2 ? 'Use Both (Group)' : selectedSwimmerIndexes.length === 1 ? 'Use Selected (Private)' : 'Select Swimmer(s)'}</button>
                                        <button onClick={clearLookup} style={{padding: '0.375rem 0.75rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Cancel</button>
                                    </div>
                                </div>
                            )}
                            
                            {lookupStatus === 'found' && lookupData && (
                                <div style={{marginTop: '0.75rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '0.75rem'}}>
                                    <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#059669', marginBottom: '0.5rem'}}>✓ Found your info!</div>
                                    <div style={{fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem'}}>
                                        <strong>{lookupData.parentName}</strong> • {lookupData.swimmer1Name}{lookupData.swimmer2Name && `, ${lookupData.swimmer2Name}`}
                                    </div>
                                    <div style={{display: 'flex', gap: '0.5rem'}}>
                                        <button onClick={applyLookupData} style={{padding: '0.375rem 0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Use This Info</button>
                                        <button onClick={clearLookup} style={{padding: '0.375rem 0.75rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'}}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group"><label>Time Slot *</label><select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="form-select">{getAvailableTimes(selectedDate).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div className="form-group"><label>Lesson Type *</label><select value={formData.lessonType} onChange={(e) => setFormData({...formData, lessonType: e.target.value})} className="form-select"><option value="private">Private (1 swimmer) - $40</option><option value="group">Group (2 swimmers) - $70</option></select></div>
                        <div className="form-group"><label>Parent Name *</label><input type="text" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} className="form-input" placeholder="Enter parent name" /></div>
                        <div className="form-group"><label>Email *</label><input type="email" value={formData.email} onChange={(e) => { setFormData({...formData, email: e.target.value}); if (formErrors.email && validateEmail(e.target.value)) setFormErrors({...formErrors, email: null}); }} className={`form-input ${formErrors.email ? 'error' : ''}`} placeholder="example@email.com" />{formErrors.email && <div className="error-message">{formErrors.email}</div>}</div>
                        <div className="form-group"><label>Phone Number *</label><input type="tel" value={formData.phone} onChange={(e) => { const f = formatPhoneNumber(e.target.value); setFormData({...formData, phone: f}); if (formErrors.phone && validatePhone(f)) setFormErrors({...formErrors, phone: null}); }} className={`form-input ${formErrors.phone ? 'error' : ''}`} placeholder="(555) 123-4567" />{formErrors.phone && <div className="error-message">{formErrors.phone}</div>}</div>
                        <div className="section-divider"><div className="section-title">Swimmer 1 Information</div><div className="form-group"><label>Swimmer Name *</label><input type="text" value={formData.swimmer1Name} onChange={(e) => setFormData({...formData, swimmer1Name: e.target.value})} className="form-input" placeholder="Enter swimmer name" /></div><div className="form-group"><label>Swimmer Birthday *</label><input type="date" value={formData.swimmer1Birthday} onChange={(e) => setFormData({...formData, swimmer1Birthday: e.target.value})} className="form-input" />{formData.swimmer1Birthday && <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem'}}>Age: {calculateAge(formData.swimmer1Birthday)}</div>}</div></div>
                        {formData.lessonType === 'group' && <div className="section-divider"><div className="section-title">Swimmer 2 Information</div><div className="form-group"><label>Swimmer Name *</label><input type="text" value={formData.swimmer2Name} onChange={(e) => setFormData({...formData, swimmer2Name: e.target.value})} className="form-input" placeholder="Enter swimmer name" /></div><div className="form-group"><label>Swimmer Birthday *</label><input type="date" value={formData.swimmer2Birthday} onChange={(e) => setFormData({...formData, swimmer2Birthday: e.target.value})} className="form-input" />{formData.swimmer2Birthday && <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem'}}>Age: {calculateAge(formData.swimmer2Birthday)}</div>}</div></div>}
                        <div className="btn-row"><button onClick={handleBookClick} disabled={!formData.parentName || !formData.email || !formData.phone || !formData.swimmer1Name || !formData.swimmer1Birthday || (formData.lessonType === 'group' && (!formData.swimmer2Name || !formData.swimmer2Birthday))} className="btn btn-success">Book</button><button onClick={() => { resetForm(); setSelectedTime(''); setSelectedDate(null); clearLookup(); }} className="btn btn-secondary">Cancel</button></div>
                    </div>
                    );
                })()}

                {showConfirmModal && (
                    <div className="modal-overlay"><div className="modal"><h4>Confirm Booking</h4><p style={{marginBottom: '1rem', color: '#64748b'}}>Please review the information below before confirming.</p>
                        <div className="confirm-details">
                            {selectedPool && pools && pools.find(p => p.id === selectedPool) && (() => { const pool = pools.find(p => p.id === selectedPool); return <div className="confirm-row"><span className="confirm-label">Pool</span><span className="confirm-value">{pool.name}{pool.address && <><br/><span style={{fontSize: '0.8em', color: '#64748b'}}>{pool.address}</span></>}</span></div>; })()}
                            <div className="confirm-row"><span className="confirm-label">Booking Type</span><span className="confirm-value">{bookingType === 'weekly' ? `Weekly (${weeklyCount} lessons)` : 'Single Lesson'}</span></div>
                            <div className="confirm-row"><span className="confirm-label">Start Date</span><span className="confirm-value">{startDateStr}</span></div>
                            {bookingType === 'weekly' && lastLessonDate && <div className="confirm-row"><span className="confirm-label">End Date</span><span className="confirm-value">{endDateStr}</span></div>}
                            <div className="confirm-row"><span className="confirm-label">Time</span><span className="confirm-value">{selectedTime}</span></div>
                            <div className="confirm-row"><span className="confirm-label">Lesson Type</span><span className="confirm-value">{formData.lessonType === 'private' ? 'Private ($40)' : 'Group ($70)'}</span></div>
                            <div className="confirm-row"><span className="confirm-label">Parent</span><span className="confirm-value">{formData.parentName}</span></div>
                            <div className="confirm-row"><span className="confirm-label">Swimmer(s)</span><span className="confirm-value">{formData.swimmer1Name} (Age: {calculateAge(formData.swimmer1Birthday)}){formData.swimmer2Name && <><br/>{formData.swimmer2Name} (Age: {calculateAge(formData.swimmer2Birthday)})</>}</span></div>
                            <div className="confirm-row"><span className="confirm-label">Contact</span><span className="confirm-value">{formData.email}<br/>{formData.phone}</span></div>
                        </div>
                        <div className="btn-row"><button onClick={confirmBooking} className="btn btn-success">Confirm Booking</button><button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary">Go Back</button></div>
                    </div></div>
                )}

                {showSuccessModal && bookedDatesForCalendar.length > 0 && (
                    <div className="modal-overlay"><div className="modal" style={{textAlign: 'center'}}>
                        <div style={{width: '60px', height: '60px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'}}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h4 style={{color: '#059669'}}>Booking Confirmed!</h4>
                        <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Your {bookedDatesForCalendar.length} lesson{bookedDatesForCalendar.length > 1 ? 's have' : ' has'} been booked. A confirmation email has been sent.</p>
                        
                        <div style={{background: '#f1f5f9', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem'}}>
                            <p style={{fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem'}}>Add to Calendar</p>
                            <button onClick={() => downloadICSFile(bookedDatesForCalendar, bookedDatesForCalendar[0].swimmerName)} style={{padding: '0.5rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit'}}>Download Calendar File (.ics)</button>
                            <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>Works with Apple Calendar, Google Calendar, Outlook, and more</p>
                        </div>
                        
                        <button onClick={() => { setShowSuccessModal(false); setBookedDatesForCalendar([]); }} className="btn btn-success" style={{width: '100%'}}>Done</button>
                    </div></div>
                )}

                {reschedulingConflict && (
                    <div className="reschedule-panel">
                        <h4>Scheduling Conflict</h4>
                        {reschedulingLessonInfo && <p style={{fontSize: '0.875rem', color: '#9a3412', marginBottom: '0.75rem'}}><strong>Lesson for:</strong> {reschedulingLessonInfo.swimmer1Name}{reschedulingLessonInfo.swimmer2Name && ` & ${reschedulingLessonInfo.swimmer2Name}`}</p>}

                        <p style={{fontSize: '0.95rem', color: '#7c2d12', marginBottom: '0.5rem'}}>
                            <strong>{reschedulingConflict.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}{reschedulingLessonInfo?.time ? ` at ${reschedulingLessonInfo.time.toLowerCase().replace(' ', '')}` : ''} is already booked.</strong>
                        </p>
                        <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem'}}>The next available day and time has been preselected for you. You may keep this time, select a different date/time above, or skip this conflict.</p>
                        <p style={{fontSize: '0.875rem', color: '#64748b'}}>Green highlighted days are in the same week as the conflict.</p>
                        
                        {selectedDate && (
                            <>
                                <p style={{fontWeight: 600, marginTop: '1rem'}}>Selected: {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                {getAvailableTimes(selectedDate).length > 0 ? (
                                    <>
                                        <div className="form-group" style={{marginTop: '1rem'}}>
                                            <label>Time:</label>
                                            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="form-select">
                                                {getAvailableTimes(selectedDate).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="btn-row">
                                            <button onClick={() => selectedTime && handleRescheduleComplete(selectedTime)} disabled={!selectedTime} className="btn btn-success">Confirm Reschedule</button>
                                            <button onClick={handleSkipReschedule} className="btn btn-secondary">Skip</button>
                                        </div>
                                    </>
                                ) : <p style={{color: '#dc2626', fontWeight: 600}}>All slots booked for this day. Select another date.</p>}
                            </>
                        )}
                        {!selectedDate && <button onClick={handleSkipReschedule} className="btn btn-secondary" style={{marginTop: '1rem'}}>Skip This Conflict</button>}
                        <p style={{fontSize: '0.75rem', color: '#9a3412', marginTop: '1rem'}}>Conflict {currentConflictIndex + 1} of {conflictDates.length}</p>
                    </div>
                )}

                {showSameDayWarning && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h4 className="warning">Multiple Lessons on Same Day</h4>
                            <p>You already have a lesson rescheduled for this day at <strong>{sameDayExistingTime}</strong>.</p>
                            <p style={{marginTop: '1rem', color: '#64748b'}}>Are you sure you want to schedule another lesson on the same day?</p>
                            <div className="btn-row">
                                <button onClick={() => { setShowSameDayWarning(false); }} className="btn btn-primary">Yes, Continue</button>
                                <button onClick={() => { setShowSameDayWarning(false); setSelectedDate(null); setSelectedTime(''); }} className="btn btn-secondary">Choose Different Day</button>
                            </div>
                        </div>
                    </div>
                )}

                {showConflictModal && (
                    <div className="modal-overlay"><div className="modal"><h4 className="warning">Scheduling Conflicts Detected</h4><p>Weekly lesson booked for non-conflicting dates. The following have conflicts:</p><div className="conflict-list">{conflictDates.map((c, i) => <div key={i} className="conflict-date">{c.dateString}</div>)}</div><p style={{fontSize: '0.875rem', marginBottom: '1rem'}}>Reschedule each conflicting date individually?</p><div className="btn-row"><button onClick={() => handleConflictResolution(false)} className="btn btn-primary">Reschedule Conflicts</button><button onClick={() => handleConflictResolution(true)} className="btn btn-secondary">Skip All</button></div></div></div>
                )}

                <div className="legend"><div className="legend-item"><div className="legend-bar" style={{background: '#cbd5e1'}}></div><span>Booked</span></div><div className="legend-item"><div className="legend-bar" style={{background: '#93c5fd'}}></div><span>Available</span></div></div>
                </> /* end pool-gated calendar section */}
            </div>
        );
    };
