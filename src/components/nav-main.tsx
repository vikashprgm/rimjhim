import { useRouterState } from "@tanstack/react-router"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

export function NavMain({ items }: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const { location } = useRouterState()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = item.url === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(item.url)

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link to={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}