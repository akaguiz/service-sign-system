
import { Home, Search, Plus, Settings, LogOut, Users, QrCode } from "lucide-react";
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
    title: "OS em Massa",
    url: "/admin/os-massa",
    icon: Users,
  },
  {
    title: "QR Code",
    url: "/admin/qrcode",
    icon: QrCode,
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
              src="https://scontent.fcgh15-1.fna.fbcdn.net/v/t39.30808-6/275720226_156982293380916_8709792050201814711_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=g8LAvwjZeacQ7kNvwG5BPlz&_nc_oc=AdnAuLw-QSXbkahnKBbKYZmSLPQS3U7wNSdFFBjR0sZSKmZodoxSc6-X_7QfnF1_DQY&_nc_zt=23&_nc_ht=scontent.fcgh15-1.fna&_nc_gid=pNEJA9TZnntmPSaDSTUHuQ&oh=00_AfM6BU4TJ97bMGp8H_-3aHqi4F23ABokxcJIIFHCBHzTDQ&oe=684CD61C" 
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
