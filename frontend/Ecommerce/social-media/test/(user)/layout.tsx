import { Nav , NavLink } from "@/components/shared/nav"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/settings">Settings</NavLink>
        <NavLink href="/profile">Profile</NavLink>  
      </Nav> 

      <div>
        {children}
      </div>
    </div>
  )
}