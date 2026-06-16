const { useState, useEffect, useCallback } = React;
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_LESSONS = 4;
const ALL_LESSON_TIMES = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'];
const DEFAULT_LESSON_TIMES = ['4:00 PM', '3:30 PM', '3:00 PM', '2:30 PM']; // Default order for backward compatibility

// Parse a 'YYYY-MM-DD' date-window string as a LOCAL date (not UTC).
// Plain `new Date('2026-07-18')` parses as UTC midnight, which is a different
// instant than `new Date(2026, 6, 18)` (local midnight). In negative-UTC-offset
// timezones (all of the US) that mismatch makes the window's last day compare as
// "after the end date", so the final day of lessons silently drops out. Splitting
// the parts and building a local Date keeps both sides of every comparison aligned.
const parseLocalDate = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

// Calculate age from birthday - shared helper function
const calculateAge = (birthday) => { if (!birthday) return ''; const today = new Date(); const birth = new Date(birthday); let age = today.getFullYear() - birth.getFullYear(); const monthDiff = today.getMonth() - birth.getMonth(); if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--; return age; };
const formatBirthday = (birthday) => { if (!birthday) return ''; const d = new Date(birthday); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; };
