
import { Home, Search, Plus, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Pesquisar OS",
    url: "/admin/os",
    icon: Search,
  },
  {
    title: "Nova OS",
    url: "/admin/cpf-search",
    icon: Plus,
  },
  {
    title: "Modelos",
    url: "/admin/os/config",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <img 
              src="https://scontent.fcgh15-1.fna.fbcdn.net/v/t39.30808-6/275720226_156982293380916_8709792050201814711_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qYJQ1i3-7D0Q7kNvwFR23JM&_nc_oc=AdnfC2FBUH0nZoiNimBdOAVSt97C1IQmpOYeatOZ2-V_S6bVNNelxoruCio5I1TYW_U&_nc_zt=23&_nc_ht=scontent.fcgh15-1.fna&_nc_gid=dQyVVAr3pWNN5oqks1jj6g&oh=00_AfJs9gDR-lvdjERfYDo9torqwoVFZBtRLE3LQhS9XAqImA&oe=68455D9C" 
              alt="Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-sidebar-foreground/70">Sistema OS</p>
            <p className="text-xs font-semibold text-sidebar-foreground">Admin</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
