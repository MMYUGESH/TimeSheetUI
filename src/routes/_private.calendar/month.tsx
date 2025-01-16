import { useState, useEffect } from "react";
import {
    startOfMonth,
    endOfWeek,
    startOfWeek,
    endOfMonth,
    ZonedDateTime,
    DateFormatter,
} from "@internationalized/date";
import { Dialog, DialogContent, DialogTitle } from "@frontend/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@frontend/ui/dropdown-menu";
import { useToast } from "@frontend/hooks/use-toast"
import { Button } from "@frontend/ui/button";
import { Separator } from "@frontend/ui/separator";
import { useTheme } from "@frontend/hooks/theme-mode-context"
import { Textarea } from "@frontend/ui/textarea";

export type MonthProps = {
    date: ZonedDateTime;
    setStatusesData: React.Dispatch<
        React.SetStateAction<
            Record<string, { status: string; hours?: number; note?: string }>
        >
    >;
};

type StatusRecord = {
    status: string;
    hours?: number;
    note?: string;
};

const officialHolidays = [
    { date: "2025-01-01", status: "Holiday", note: "New Year" },
    { date: "2025-01-14", status: "Holiday", note: "Festival Day" },
    { date: "2025-01-26", status: "Holiday", note: "Republic Day" },
    { date: "2025-08-15", status: "Holiday", note: "Independence Day" },
    { date: "2025-10-02", status: "Holiday", note: "Gandhi Jayanti" },
];

export const Month = ({ date, setStatusesData }: MonthProps) => {

    const { theme } = useTheme();
    const { toast } = useToast();

    const startDate = startOfWeek(startOfMonth(date), navigator.language);
    const endDate = endOfWeek(endOfMonth(date), navigator.language);

    const [statuses, setStatuses] = useState<Record<string, StatusRecord>>({});
    const [selectedDate, setSelectedDate] = useState<ZonedDateTime | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<string>("");
    const [workingHours, setWorkingHours] = useState<number>(8);
    const [sickLeaveNote, setSickLeaveNote] = useState<string>("");
    const [holidayNote, setHolidayNote] = useState<string>("");
    const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
    const [recurringDay, setRecurringDay] = useState<number | null>(null);
    const [recurringStatus, setRecurringStatus] = useState<string>("");





    // Fetch initial statuses from the server
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch("http://localhost:3001/statuses");
            const data = await response.json();
            const formattedStatuses = data.reduce((acc: Record<string, StatusRecord>, item: any) => {
                acc[item.date] = {
                    status: item.status,
                    hours: item.hours,
                    note: item.note,
                };
                return acc;
            }, {});

            const prefilledData = officialHolidays.reduce((acc: Record<string, StatusRecord>, item: any) => {
                acc[item.date] = {
                    status: item.status,
                    note: item.note,
                }
                return acc;
            }, formattedStatuses)
            setStatuses(prefilledData);
            setStatusesData(prefilledData);
        };
        fetchStatuses();
    }, []);

    // Handle day click
    const handleDayClick = (date: ZonedDateTime) => {
        setSelectedDate(date);
        setCurrentStatus("");
        setWorkingHours(8);
        setSickLeaveNote("");
        setIsDialogOpen(true);
    };

    // Handle status change
    const handleStatusChange = () => {
        if (selectedDate) {
            const selectedDateString = selectedDate.toDate().toISOString().split("T")[0];
            const updatedStatus: StatusRecord = {
                status: currentStatus,
            };
            if (currentStatus === "Working") {
                updatedStatus.hours = workingHours;
            } else if (currentStatus === "Sick Leave") {
                updatedStatus.note = sickLeaveNote;
            } else if (currentStatus === "Holiday") {
                updatedStatus.note = holidayNote;
            }
            setStatuses((prev) => ({ ...prev, [selectedDateString]: updatedStatus }));


            setStatusesData(statuses);
        }
        setIsDialogOpen(false);
    };

    // Submit all statuses
    // const handleSubmit = async () => {
    //     const allStatuses = Object.keys(statuses).map((date) => ({
    //         date,
    //         ...statuses[date],
    //     }));
    //     await Promise.all(
    //         allStatuses.map(async (item) => {
    //             const response = await fetch(`http://localhost:3001/statuses?date=${item.date}`);
    //             const data = await response.json();
    //             if (data.length > 0) {
    //                 // Update existing status
    //                 await fetch(`http://localhost:3001/statuses/${data[0].id}`, {
    //                     method: "PUT",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify(item),
    //                 });
    //             } else {
    //                 // Create new status
    //                 await fetch("http://localhost:3001/statuses", {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify(item),
    //                 });
    //             }
    //         })
    //     );
    //     alert("Statuses submitted successfully!");
    // };
    const handleSubmit = async () => {

        const startOfMonthDate = startOfMonth(date);
        const endOfMonthDate = endOfMonth(date);


        // Generate all dates from start to end of the month
        const datesInMonth = [];
        for (
            let current = startOfMonthDate;
            current <= endOfMonthDate;
            current = current.add({ days: 1 })
        ) {
            datesInMonth.push(current.toDate().toISOString().split("T")[0]);
        }

        // Check if all dates have statuses
        const allDatesHaveStatuses = datesInMonth.every((date) => statuses[date]?.status
            || officialHolidays.some((holiday) => holiday.date === date)
        );

        if (!allDatesHaveStatuses) {
            toast({
                variant: "destructive",
                description: "Please assign a status to all days of the month before submitting!",
            })
            return;
        }

        // Prepare data for submission
        const allStatuses = datesInMonth.map((date) => ({
            date,
            ...statuses[date],
        }));

        // Submit the data
        await Promise.all(
            allStatuses.map(async (item) => {
                const response = await fetch(`http://localhost:3001/statuses?date=${item.date}`);
                const data = await response.json();
                if (data.length > 0) {
                    // Update existing status
                    await fetch(`http://localhost:3001/statuses/${data[0].id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item),
                    });
                } else {
                    // Create new status
                    await fetch("http://localhost:3001/statuses", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item),
                    });
                }
            })
        );
        toast({
            description: "Statuses submitted successfully!",
            className: "bg-green-700 text-white",
        })

    };

    // const handleRecurringStatus = () => {

    //     if (recurringDay !== null && recurringStatus) {
    //         const updatedStatuses = { ...statuses };
    //         for (let current = startDate; current <= endDate; current = current.add({ days: 1 })) {
    //             if (current.toDate().getDay() === recurringDay) {
    //                 const isoDate = current.toDate().toISOString().split("T")[0];
    //                 updatedStatuses[isoDate] = { status: recurringStatus };
    //             }
    //         }


    //         setStatuses(updatedStatuses);
    //     }
    //     setIsRecurringDialogOpen(false);
    // };
    const handleRecurringStatus = () => {
        if (recurringDay !== null && recurringStatus) {
            const updatedStatuses = { ...statuses };
            for (let current = startDate; current <= endDate; current = current.add({ days: 1 })) {
                if (current.toDate().getDay() === recurringDay) {
                    const isoDate = current.toDate().toISOString().split("T")[0];

                    // Set default fields based on the selected recurring status
                    if (recurringStatus === "Working") {
                        updatedStatuses[isoDate] = {
                            status: "Working",
                            hours: workingHours, // Default working hours (can be adjusted as needed)
                        };
                    } else if (recurringStatus === "Sick Leave") {
                        updatedStatuses[isoDate] = {
                            status: "Sick Leave",
                            note: sickLeaveNote, // Default note for sick leave
                        };
                    } else if (recurringStatus === "Holiday") {
                        updatedStatuses[isoDate] = {
                            status: "Holiday",
                            note: holidayNote, // Default note for holiday
                        };
                    } else {
                        updatedStatuses[isoDate] = { status: recurringStatus };
                    }
                }
            }
            setStatuses(updatedStatuses);
            setStatusesData(updatedStatuses);
        }
        setIsRecurringDialogOpen(false);
    };



    // Get the status for a specific day
    const getDayStatus = (date: ZonedDateTime) => {

        const selectedDateString = date.toDate().toISOString().split("T")[0];
        if (statuses[selectedDateString]?.status) {
            return statuses[selectedDateString];
        }
        const dayOfWeek = date.toDate().getDay();
        return {
            status: dayOfWeek === 0 || dayOfWeek === 6 ? "Vacation" : "No Status",
        };

        // return statuses[selectedDateString] || {};
    };

    // Render day tile content
    const renderDayContent = (status: StatusRecord) => {

        if (status.status === "Working") {
            return `${status.status} (${status.hours}h)`;
        }
        if (status.status === "Sick Leave") {
            return `${status.status} ${status.note !== "" ? `(${status.note})` : ""}`;
        }
        if (status.status === "Holiday") {
            console.log(status)
            return `${status.status} ${status.note !== "" ? `(${status.note})` : ""}`;
        }
        return status.status || "No Status";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Working":
                return "bg-green-300 dark:bg-green-700";
            case "Vacation":
                return "bg-blue-200 dark:bg-blue-700";
            case "Sick Leave":
                return "bg-red-200 dark:bg-red-700";
            case "Holiday":
                return "bg-violet-300 dark:bg-violet-700";
            default:
                return "bg-gray-200 dark:bg-gray-700";
        }
    };

    return (
        // <div
        //     className={theme === "light" ? "dark" : "light"}
        // >
        <div className={`grid grid-rows-[auto_1fr] gap-4 ${theme === "light" ? "dark" : "light"}`}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center font-bold text-sm">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                    const currentDay = startDate.add({ days: day });
                    return (
                        <div key={currentDay.toDate().toString()} className="py-2">
                            {new DateFormatter(navigator.language, { weekday: "long" }).format(
                                currentDay.toDate()
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Month Dates */}
            <div className="grid grid-cols-7 gap-2">
                {(() => {
                    const dates = [];
                    for (
                        let current = startDate;
                        current <= endDate;
                        current = current.add({ days: 1 })
                    ) {

                        const status = getDayStatus(current);
                        const colorClass = getStatusColor(status.status || "No Status");

                        dates.push(
                            <div
                                key={current.toDate().toString()}
                                className={`flex justify-center cursor-pointer ${colorClass} rounded p-2`}
                                onClick={() => handleDayClick(current)}
                            >
                                <DayTile date={current} status={renderDayContent(status)} />
                            </div>
                        );
                    }
                    return dates;
                })()}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
                <Button
                    className="btn btn-primary dark:text-white mr-2"
                    onClick={() => setIsRecurringDialogOpen(true)}
                >
                    Set Recurring Status
                </Button>
                <Button variant="default" className="btn btn-primary dark:text-white " onClick={handleSubmit}>
                    Submit TimeSheet
                </Button>
            </div>

            {/* Dialog */}
            {isDialogOpen && selectedDate && (
                <Dialog open={isDialogOpen}

                    onOpenChange={setIsDialogOpen}>
                    <DialogContent >
                        <div className="p-4">
                            <DialogTitle>
                                <h3 className="text-lg border font-bold mb-4">

                                    Select Status for{" "}
                                    {new DateFormatter(navigator.language, {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }).format(selectedDate.toDate())}
                                    <Separator />
                                </h3>

                            </DialogTitle >

                            {/* <DropdownMenuSeparator /> */}

                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="btn btn-primary">
                                        Select Status:  {currentStatus ? currentStatus : ""}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setCurrentStatus("Working")}>
                                        Working
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCurrentStatus("Vacation")}>
                                        Vacation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCurrentStatus("Sick Leave")}>
                                        Sick Leave
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCurrentStatus("Holiday")}>
                                        Holiday
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Additional Inputs */}
                            {currentStatus === "Working" && (
                                <div className="mt-4">
                                    <label>
                                        Working Hours:
                                        <input
                                            type="number"
                                            value={workingHours}
                                            onChange={(e) => setWorkingHours(Number(e.target.value))}
                                            className="input"
                                        />
                                    </label>
                                </div>
                            )}
                            {currentStatus === "Sick Leave" && (
                                <div className="mt-4">
                                    <label>
                                        Note:
                                        <Textarea
                                            value={sickLeaveNote}
                                            onChange={(e) => setSickLeaveNote(e.target.value)}
                                            className="textarea"
                                            maxLength={15}
                                        />
                                    </label>
                                </div>
                            )}
                            {currentStatus === "Holiday" && (
                                <div className="mt-4">
                                    <label>
                                        Note:
                                        <Textarea
                                            value={holidayNote}
                                            onChange={(e) => setHolidayNote(e.target.value)}
                                            className="textarea"
                                            maxLength={15}
                                        />
                                    </label>
                                </div>
                            )}

                            <div className="flex justify-end mt-4">
                                <Button className="btn btn-primary " onClick={handleStatusChange}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {isRecurringDialogOpen && (
                <Dialog open={isRecurringDialogOpen} onOpenChange={setIsRecurringDialogOpen}>
                    <DialogContent>
                        <div className="p-4">
                            <h3 className="text-lg font-bold mb-4">Set Recurring Status</h3>
                            <select
                                className="block w-full mb-4"
                                onChange={(e) => setRecurringDay(Number(e.target.value))}
                            >
                                <option value="">Select Day of the Week</option>
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                                    (day, index) => (
                                        <option value={index} key={day}>
                                            {day}
                                        </option>
                                    )
                                )}
                            </select>
                            {/*    <select
                                className="block w-full mb-4"
                                onChange={(e) => setRecurringStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="Working" onClick={() => setCurrentStatus("Working")}>Working</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Vacation">Vacation</option>
                            </select> */}
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="btn btn-primary">
                                        Select Status:  {currentStatus ? currentStatus : ""}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => { setCurrentStatus("Working"), setRecurringStatus("Working") }}>
                                        Working
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setCurrentStatus("Vacation"), setRecurringStatus("Vacation") }}>
                                        Vacation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setCurrentStatus("Sick Leave"), setRecurringStatus("Sick Leave") }}>
                                        Sick Leave
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setCurrentStatus("Holiday"), setRecurringStatus("Holiday") }}>
                                        Holiday
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <br></br>

                            {/* Additional Inputs */}
                            {currentStatus === "Working" && (
                                <div className="mt-4">
                                    <label>
                                        Working Hours:
                                        <input
                                            type="number"
                                            value={workingHours}
                                            onChange={(e) => setWorkingHours(Number(e.target.value))}
                                            className="input"
                                        />
                                    </label>
                                </div>
                            )}
                            {currentStatus === "Sick Leave" && (
                                <div className="mt-4">
                                    <label>
                                        Note:
                                        <Textarea
                                            value={sickLeaveNote}
                                            onChange={(e) => setSickLeaveNote(e.target.value)}
                                            className="textarea"
                                            maxLength={15}
                                        />
                                    </label>
                                </div>
                            )}
                            {currentStatus === "Holiday" && (
                                <div className="mt-4">
                                    <label>
                                        Note:
                                        <Textarea
                                            value={holidayNote}
                                            onChange={(e) => setHolidayNote(e.target.value)}
                                            className="textarea"
                                            maxLength={15}
                                        />
                                    </label>
                                </div>
                            )}

                            <Button className="btn btn-primary mt-4" onClick={handleRecurringStatus}>
                                Set Recurring
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
        // </div>
    );
};

export type DayProps = {
    date: ZonedDateTime;
    status: string;
};

export const DayTile = ({ date, status }: DayProps) => {
    const { theme } = useTheme();
    return (
        // <div
        // className={theme === "light" ? "dark" : "light"}
        // >
        <div className={`flex flex-col items-center justify-between border border-gray-200 rounded-lg p-2 h-40 w-40 ${theme === "light" ? "dark" : "light"}`}>
            <span className="text-primary dark:text-white font-bold">
                {new DateFormatter(navigator.language, {
                    day: "2-digit",
                }).format(date.toDate())}
            </span>
            <span className="text-sm mt-2 capitalize">{status}</span>
            <Separator className="dark:bg-white" orientation="horizontal" />
        </div>
        // </div>
    );
};
