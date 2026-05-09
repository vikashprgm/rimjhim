import { createRootRoute, Outlet } from '@tanstack/react-router'
import appCss from '../styles/styles.css?url'
import { Titlebar } from "../components/Titlebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { ResizeHandles } from "../components/ResizeHandles";
import { ThemeToggle } from "../components/tiptap-templates/simple/theme-toggle";
import { Toaster } from 'sonner';


const RootLayout = () => (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <ResizeHandles/>
    <Titlebar title="Untitled Note" />
    <SidebarProvider style={{ flex: 1, overflow: "hidden",minHeight: "0" }}>
      <AppSidebar/>
      <main className="overflow-y-hidden flex-1 min-w-0">
        <div className="flex items-center pl-1">
          <SidebarTrigger size="default"/>
          <ThemeToggle/>
        </div>
        <Toaster richColors position="top-center" />
        <Outlet/>
      </main>
    </SidebarProvider>
  </div>
)

export const Route = createRootRoute({
  head : ()=> ({
    links : [
      { rel: 'stylesheet', href: appCss },
      
    ]
  }),
  component: RootLayout 
})