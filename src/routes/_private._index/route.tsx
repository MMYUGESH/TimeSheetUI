import { blushAppMeta } from "@frontend/routes/common/meta";


export const meta = blushAppMeta;

export const Route = () => {
  return (
    <div className="dark:text-white">
      This is a private route. This is also the home route.

    </div>
  );
};

export default Route;
