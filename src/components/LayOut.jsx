import { Outlet, Link, useLocation } from "react-router-dom"
import { LogOut, Home, Briefcase, FolderOpen, MessageSquare, BarChart3 } from "lucide-react"
import { useAuth } from "./contexts/AuthContext"

const AdminLayout = () => {
  const { logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", path: "/", icon: BarChart3 },
    { name: "Experiences", path: "/experiences", icon: Briefcase },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Testimonials", path: "/testimonials", icon: MessageSquare },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-700 h-screen shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-white hover:bg-gray-400 ${
                    isActive(item.path) ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600" : ""
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <Link to="https://thompsonsolomonportfolio.netlify.app/" className="flex items-center text-white hover:text-primary-600 mb-4">
              <Home size={20} className="mr-3" />
              View Website
            </Link>
            <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-700">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
