import { AppSidebar } from "@frontend/routes/_private/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@frontend/components/ui/breadcrumb";
import { Separator } from "@frontend/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@frontend/components/ui/sidebar";
import { blushAppMeta } from "@frontend/routes/common/meta";
import { Outlet } from "react-router";
import { useTheme } from "@frontend/hooks/theme-mode-context"
import { Button } from "@frontend/ui/button";

export const meta = blushAppMeta;

export const Route = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <SidebarProvider className={theme === "light" ? "dark" : "light"}>
        <AppSidebar />
        <SidebarInset >
          <header className="flex items-center justify-between h-16 gap-2 shrink-0">
            <>
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 dark:text-white" />
                <Separator orientation="vertical" className="h-4 mr-2" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block ">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Time Sheet</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <Button
                onClick={toggleTheme}
                className="p-2 text-sm font-medium rounded-md shadow-md text-white bg-blue-500 dark:bg-violet-600 dark:text-white hover:bg-violet-400 dark:hover:bg-blue-400 mr-5 "
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </Button>

            </>

          </header>
          <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Route;
