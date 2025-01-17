import { blushAppMeta } from "@frontend/routes/common/meta";
import React, { useEffect, useState } from "react";
import { parseDate, CalendarDate, startOfMonth, endOfMonth, getWeeksInMonth, DateFormatter, toLocalTimeZone, getLocalTimeZone, startOfWeek, endOfWeek } from "@internationalized/date";
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, Cell, Legend, Sector, Label } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@frontend/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@frontend/ui/chart";
import { Button } from "@frontend/ui/button";
import { Select } from "@frontend/ui/select";

const chartConfig = {
    desktop: {
        label: "Hours Worked",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;


export const meta = blushAppMeta;

interface Status {
    date: string;
    status: string;
    hours?: number;
    note?: string;
    id: string;
}


export const Route = () => {
    const [statuses, setStatuses] = React.useState<Status[]>([]);
    const [view, setView] = useState<"weekly" | "monthly">("weekly");
    const [selectedMonth, setSelectedMonth] = useState<CalendarDate>(parseDate("2025-01-01"));
    const [workedHoursPerWeek, setWorkedHoursPerWeek] = useState<number[]>([]);
    const [chartData, setChartData] = React.useState<{ label: string; hours: number }[]>([]);
    const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];
    const [activeIndex, setActiveIndex] = useState(0);
    const [view1, setView1] = useState<"weekly" | "monthly">("weekly");
    const [selectedMonth1, setSelectedMonth1] = useState<CalendarDate>(parseDate("2025-01-01"));
    const id = "pie-interactive"

    const fetchData = async () => {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.statuses;
    };


    useEffect(() => {
        fetchData()
            .then((data) => setStatuses(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // useEffect(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    
    const filteredData = statuses.filter((item) => {
        const itemDate = parseDate(item.date);
        return (
            itemDate.compare(monthStart) >= 0 && itemDate.compare(monthEnd) <= 0
        );
    });


    const totalDaysInMonth = monthEnd.day;

    // Calculate Key Metrics
    const totalWorkedHours = filteredData
        .filter((item: any) => item.status === "Working")
        .reduce((sum: any, item: any) => sum + (item.hours || 0), 0);

    const vacationDays = filteredData.filter((item: any) => item.status === "Vacation")
        .length;

    const sickLeaves = filteredData.filter((item: any) => item.status === "Sick Leave")
        .length;

    const workingDays = filteredData.filter((item: any) => item.status === "Working")
        .length;
    const nonWorkingDays = totalDaysInMonth - workingDays;
    const workingDaysPercentage = totalDaysInMonth
        ? (workingDays / totalDaysInMonth) * 100
        : 0;

    // }, [selectedMonth, statuses, view, view1, selectedMonth1])

    // Calculate weekly worked hours whenever the month or data changes
    useEffect(() => {
        const monthStart = startOfMonth(selectedMonth);
        const monthEnd = endOfMonth(selectedMonth);

        const filteredData = statuses.filter((item) => {
            const itemDate = parseDate(item.date);
            return (
                itemDate.compare(monthStart) >= 0 && itemDate.compare(monthEnd) <= 0
            );
        });

        if (view === "weekly") {

            const weeksInMonth = getWeeksInMonth(selectedMonth, navigator.language);
            const weeklyHours = Array(weeksInMonth).fill(0);
            const weeklyData = Array(weeksInMonth)
                .fill(0)
                .map((_, index) => ({
                    label: `Week ${index + 1}`,
                    hours: 0,
                }));

            filteredData.forEach((item) => {
                if (item.status === "Working" && item.hours) {
                    const itemDate = parseDate(item.date);
                    const weekIndex = Math.floor((itemDate.day - 1) / 7);
                    weeklyHours[weekIndex] += item.hours;
                    weeklyData[weekIndex].hours += item.hours;
                }
            });
            setChartData(weeklyData);
            setWorkedHoursPerWeek(weeklyHours);
        } else if (view === "monthly") {
            const totalHours = filteredData.reduce((sum, item) => {
                return item.status === "Working" && item.hours ? sum + item.hours : sum;
            }, 0);

            setChartData([
                {
                    label: selectedMonth.toString(),
                    hours: totalHours,
                },
            ]);

        }

        // Pie chart data (breakdown of statuses)
        // const pieFilteredData = statuses.filter((item) => {
        //     const itemDate = parseDate(item.date);
        //     if (view === "weekly") {
        //         const weekIndex = Math.floor((itemDate.day - 1) / 7);
        //         return weekIndex === activeIndex; 
        //     }
        //     return itemDate.compare(monthStart) >= 0 && itemDate.compare(monthEnd) <= 0;
        // });

        // const statusCounts = pieFilteredData.reduce(
        //     (acc, item) => {
        //         acc[item.status] = (acc[item.status] || 0) + 1;
        //         return acc;
        //     },
        //     {} as Record<string, number>
        // );
        // console.log(statusCounts)

        // const pieDataArray = Object.entries(statusCounts).map(([name, value]) => ({
        //     name,
        //     value,
        // }));

        // setPieData(pieDataArray);

        if (view === "weekly") {
            const weeksInMonth = getWeeksInMonth(selectedMonth, navigator.language);
            const weeklyData = Array(weeksInMonth)
                .fill(0)
                .map((_, index) => ({
                    label: `Week ${index + 1}`,
                    hours: 0,
                }));

            const startDate = selectedMonth.toDate(getLocalTimeZone());
            const weekIndex = Math.floor((startDate.getDate() - 1) / 7);
            const weekStart = new Date(selectedMonth.year, selectedMonth.month - 1, weekIndex * 7 + 1);
            const weekEnd = new Date(selectedMonth.year, selectedMonth.month - 1, (weekIndex + 1) * 7);

            const weeklyFilteredData = filteredData.filter((item) => {
                const itemDate = parseDate(item.date).toDate(getLocalTimeZone());
                return itemDate >= weekStart && itemDate <= weekEnd;
            });

            // Update pieData based on the weekly data
            const statusCounts = weeklyFilteredData.reduce(
                (acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            const pieDataArray = Object.entries(statusCounts).map(([name, value]) => ({
                name,
                value,
            }));

            setPieData(pieDataArray);
        } else if (view === "monthly") {
            // Monthly view logic remains unchanged
            const statusCounts = filteredData.reduce(
                (acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            const pieDataArray = Object.entries(statusCounts).map(([name, value]) => ({
                name,
                value,
            }));

            setPieData(pieDataArray);
        }

    }, [selectedMonth, statuses, view]);

    // const chartLabels = workedHoursPerWeek.map((_, i) => `Week ${i + 1}`);
    // console.log(chartLabels, workedHoursPerWeek, chartData, "chart")


    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const [year, month, day] = e.target.value.split("-").map(Number); // Parse input
            if (year && month && day) {
                setSelectedMonth(new CalendarDate(year, month, day));
                // console.log(selectedMonth, "handleoldmonth")
            } else {
                console.error("Invalid input for year or month:", e.target.value);
            }
        } catch (error) {
            console.error("Error updating the selected month:", error);
        }
    };

    const handleViewChange = (viewMode: "weekly" | "monthly") => {
        setView(viewMode);
    };


    // const handleMonthChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     try {
    //         const [year, month, day] = e.target.value.split("-").map(Number); // Parse input
    //         if (year && month && day) {
    //             setSelectedMonth1(new CalendarDate(year, month, day));
    //             console.log(selectedMonth, "handleoldmonth")
    //         } else {
    //             console.error("Invalid input for year or month:", e.target.value);
    //         }
    //     } catch (error) {
    //         console.error("Error updating the selected month:", error);
    //     }
    // };

    // const handleViewChanges = (viewMode: "weekly" | "monthly") => {
    //     setView1(viewMode);
    // };


    return (

        <div className="dark:text-white">

            <div className="dashboard">

                <Card>
                    <CardHeader>
                        <h1 className="text-xl font-bold">Total View Analytics</h1>

                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-4">
                            <div>Total Hours Worked:</div>
                            <div>{totalWorkedHours}</div>
                            <div>Vacation Days: </div>
                            <div>{vacationDays}</div>
                            <div>Sick Leaves: </div>
                            <div>{sickLeaves}</div>
                            <div>Percentage Working: </div>
                            <div>{workingDaysPercentage.toFixed(2)}%</div>
                            <div>Working Days:</div>
                            <div>{workingDays}</div>
                            <div>Non-Working Days:</div>
                            <div>{nonWorkingDays}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* <div className="charts">
                    <BarChart statuses={filteredStatuses} />
                    <PieChart statuses={filteredStatuses} />
                </div> */}

            </div>
            <br />
            <div className="flex flex-wrap ">
                <Card className="flex-1 max-w-[900px] mr-2 mt-1">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-xl font-bold">Hours Worked-{view === "weekly" ? "Weekly" : "Monthly"} View</h1>
                        </CardTitle>
                        <CardDescription>
                            {selectedMonth.toString()}
                        </CardDescription>
                        <div className="flex gap-4 mt-4 justify-between">
                            <input
                                type="date"
                                value={`${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}-${String(selectedMonth.day).padStart(2, "0")}`}
                                onChange={handleMonthChange}
                                className="mt-2 p-2 border rounded dark:text-black"
                            />
                            <div className="gap-3 mt-2 ">
                                <Button
                                    onClick={() => handleViewChange("weekly")}
                                    className={`p-2 border rounded ${view === "weekly" ? "bg-gray-200" : ""
                                        }`}
                                >
                                    Weekly
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    onClick={() => handleViewChange("monthly")}
                                    className={`p-2 border rounded ${view === "monthly" ? "bg-gray-200" : ""
                                        }`}
                                >
                                    Monthly
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="hours" fill="var(--color-desktop)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {view === "monthly" ? "Monthly Data" : "Weekly Data"}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total worked hours for the selected {view === "monthly" ? "Month" : "Week"}
                        </div>
                    </CardFooter>
                </Card>

                <Card data-chart={id} className="flex flex-col mt-1">
                    <ChartStyle id={id} config={chartConfig} />
                    <CardHeader >
                        <div className="grid gap-1">
                            <CardTitle className="text-xl font-bold">{view === "weekly" ? "Weekly" : "Monthly"} Status</CardTitle>
                            <CardDescription>{selectedMonth.toString()}</CardDescription>
                            <div className="flex gap-4 mt-1 justify-between">
                                <input
                                    type="date"
                                    value={`${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}-${String(selectedMonth.day).padStart(2, "0")}`}
                                    onChange={handleMonthChange}
                                    className="mt-2 p-2 border rounded dark:text-black"
                                />
                                <div className="gap-3 mt-2 ">
                                    <Button
                                        onClick={() => handleViewChange("weekly")}
                                        className={`p-2 border rounded ${view === "weekly" ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        Weekly
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        onClick={() => handleViewChange("monthly")}
                                        className={`p-2 border rounded ${view === "monthly" ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        Monthly
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 justify-center pb-0">
                        <ChartContainer
                            id={id}
                            config={chartConfig}
                            className="mx-auto aspect-square w-full min-w-[500px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="month"
                                    innerRadius={60}
                                    strokeWidth={5}
                                    activeIndex={activeIndex}
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    activeShape={({
                                        outerRadius = 0,
                                        ...props
                                    }: PieSectorDataItem) => (
                                        <g>
                                            <Sector {...props} outerRadius={outerRadius + 10} />
                                            <Sector
                                                {...props}
                                                outerRadius={outerRadius + 25}
                                                innerRadius={outerRadius + 12}
                                            />
                                        </g>
                                    )}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}

                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >

                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalWorkedHours}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Working Hours
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />

                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                        Breakdown of statuses for the selected {view === "weekly" ? "week" : "month"}.
                    </CardFooter>
                </Card>
            </div>
        </div>


    );
};

export default Route;
