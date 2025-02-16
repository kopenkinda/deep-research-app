import { Outlet } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { ThemeProvider } from "~/components/theme-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function ChatLayout() {
  return (
    <ThemeProvider>
      <div className="[--header-height:calc(--spacing(12))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <Outlet />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}
