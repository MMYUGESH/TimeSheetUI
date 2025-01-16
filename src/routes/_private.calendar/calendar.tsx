import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";
import { calendarContext, useCalendarContext, useCalendarContextValue } from "@frontend/hooks/use-calendar-context";
import { Month } from "@frontend/routes/_private.calendar/month";
import { Button } from "@frontend/ui/button";
import { Card, CardContent } from "@frontend/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLessThan, faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import React from 'react';


export const CalendarHeader = ({ exportToCSV, exportToPDF }: { exportToCSV: () => void; exportToPDF: () => void }) => {
    const { handleNext, handlePrevious, date, handleToday } = useCalendarContext();
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center mt-3 gap-4 dark:text-white ">
                    <Button onClick={handlePrevious}>
                        <FontAwesomeIcon icon={faLessThan} />
                    </Button>

                    <Button onClick={handleToday} variant="outline" style={{ border: "1px solid green" }}>

                        {new DateFormatter(navigator.language, { day: "2-digit", month: "short", formatMatcher: "basic" }).format(today(getLocalTimeZone()).toDate(getLocalTimeZone()))
                        }
                    </Button>

                </div>
                <div className="flex items-center gap-2">



                    <strong>
                        {new DateFormatter(navigator.language, {
                            month: "long",
                            year: "numeric",

                        }).format(date.toDate())}
                    </strong>

                </div>
                <div className="flex items-center gap-2 mt-2 ">
                    <Button onClick={exportToCSV} className="btn btn-secondary">
                        Export as CSV
                    </Button>
                    <Button onClick={exportToPDF} className="btn btn-secondary">
                        Export as PDF
                    </Button>
                    <Button onClick={handleNext}>
                        <FontAwesomeIcon icon={faGreaterThan} />
                    </Button>
                </div>


            </div>
        </>
    )
}

export const CalendarBody = ({ setStatusesData }: any) => {
    const { date } = useCalendarContext();
    return (
        <div className="p-2 padding-top-3"><Month date={date} setStatusesData={setStatusesData} /></div>
    )
}

export const Calendar = () => {
    const value = useCalendarContextValue();
    const [statusesData, setStatusesData] = React.useState<Record<string, { status: string; hours?: number; note?: string }>>({});

    const exportToCSV = () => {
        const headers = ["Date", "Status", "Hours", "Note"];
        const rows = Object.entries(statusesData).map(([date, { status, hours, note }]) => [
            date,
            status,
            hours || "N/A",
            note || "N/A",
        ]);

        const csvContent =
            [headers, ...rows]
                .map((row) => row.join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "timesheet.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const headers = ["Date", "Status", "Hours", "Note"];
        const rows = Object.entries(statusesData).map(([date, { status, hours, note }]) => [
            date,
            status,
            hours || "N/A",
            note || "N/A",
        ]);

        doc.text("Timesheet", 14, 10);
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 20
        });

        doc.save("timesheet.pdf");
    };

    return (

        <calendarContext.Provider value={value}>
            <Card >
                <CardContent>
                    <CalendarHeader
                        exportToCSV={exportToCSV}
                        exportToPDF={exportToPDF}
                    />
                    <CalendarBody
                        setStatusesData={setStatusesData}
                    />
                </CardContent>
            </Card>
        </calendarContext.Provider>


    )
}