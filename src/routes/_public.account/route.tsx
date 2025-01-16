import { blushAppMeta } from "@frontend/routes/common/meta";
import { GalleryVerticalEnd } from "lucide-react";
import { Outlet } from "react-router";

export const meta = blushAppMeta;

export const Route = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
        <div className="flex flex-col w-full max-w-sm gap-6 md:max-w-3xl">
          <a
            href="#"
            className="flex items-center self-center gap-2 font-medium"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Blush App
          </a>

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Route;
