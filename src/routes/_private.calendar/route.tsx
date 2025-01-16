import { blushAppMeta } from "@frontend/routes/common/meta";
import { Calendar } from "@frontend/routes/_private.calendar/calendar";


export const meta = blushAppMeta;

export const Route = () => {
    return (
        <>

            <Calendar />

        </>
    );
};

export default Route;
