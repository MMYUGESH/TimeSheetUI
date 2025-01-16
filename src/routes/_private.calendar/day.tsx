
import { Button } from "@frontend/ui/button";
import { Separator } from "@frontend/ui/separator";
import { DateFormatter, ZonedDateTime } from "@internationalized/date";
// import { useCalendarContext } from "@frontend/hooks/use-calendar-context";
// import React from "react";
// export type DayProps = {
//     date: ZonedDateTime
//     status: string
// }
// export type DayTileProps = DayProps;
// export const DayTile = ({ date, status }: DayTileProps) => {
//     return (
//         <div className="flex flex-row h-40 w-full">
//             <div className="flex flex-col items-center justify-between w-full h-full">
//                 <Button disabled variant="ghost" className="text-blue-800 font-bold">

//                     {new DateFormatter(navigator.language, {
//                         day: "2-digit",
//                     }).format(date.toDate())}


//                 </Button>

//                 <div className="flex mb-4">
//                     {status}

//                 </div>

//             </div>

//         </div>
//     )
// }


export type DayProps = {
    date: ZonedDateTime;
    status: string;
};

export const DayTile = ({ date, status }: DayProps) => {
    return (
        <div className="flex flex-col items-center justify-between border border-gray-200  p-2 h-20 w-20">
            <span className="text-primary font-bold">
                {new DateFormatter(navigator.language, {
                    day: "2-digit",
                }).format(date.toDate())}
            </span>
            <span className="text-sm mt-2 capitalize">{status}</span>
            <Separator orientation="horizontal" />
        </div>
    );
};
