import { DateFormatter, endOfMonth, endOfWeek, endOfYear, fromDate, getLocalTimeZone, now, startOfMonth, startOfWeek, startOfYear, ZonedDateTime } from '@internationalized/date';
import React from 'react';



export type CalendarContextValue = {
    date: ZonedDateTime;
    handleNext: () => void;
    handlePrevious: () => void;
    handleToday: () => void;
}

export const calendarContext = React.createContext<CalendarContextValue | null>(null)


export const useCalendarContextValue = () => {
    const [date, setDate] = React.useState<CalendarContextValue["date"]>(now(getLocalTimeZone()));

    const handleNext = React.useCallback(() => {
        return setDate((date) => date.add({ months: 1 }))
    }, []);

    const handlePrevious = React.useCallback(() => {
        return setDate((date) => date.subtract({ months: 1 }))
    }, []);

    const handleToday = React.useCallback(() => {
        setDate(now(getLocalTimeZone()));
    }, []);
    return {
        date,
        handleNext,
        handlePrevious,
        handleToday
    }
}

export const useCalendarContext = () => {
    const context = React.useContext(calendarContext);

    if (!context) {
        throw new Error("useCalnedarContext must be used within a Calendar Component");
    }

    return context;
}

