import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavProjects({
  projects,
  isLoading,
}: {
  projects: {
    topic: string;
    id: number;
  }[];
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Researches</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <SidebarMenuItem>
            {Array.from({ length: 10 }).map((_, i) => (
              <SidebarMenuButton
                className="animate-pulse bg-muted h-6 mt-2"
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
              />
            ))}
          </SidebarMenuItem>
        )}
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link to={`/chat/${item.id}`}>
                <span>{item.topic}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Trash2Icon className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
