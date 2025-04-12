"use client"

import { useState } from "react"
import { Home, User, Calendar, FileText, Settings, LogOut, Menu, X, Search, Bell, Video, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: User, label: "My Profile", active: false },
    { icon: Calendar, label: "Appointments", active: false, badge: "2" },
    { icon: FileText, label: "Health Records", active: true },
    { icon: Video, label: "Consultations", active: false },
    { icon: Shield, label: "Blockchain Data", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-slate-200 w-64 flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out z-40",
          isMobile && (isOpen ? "fixed inset-y-0 left-0" : "fixed -left-64"),
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                MediAssist
              </h1>
              <p className="text-xs text-slate-500">AI Health Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <img src="/placeholder.svg?height=40&width=40" alt="User" />
            </Avatar>
            <div>
              <h3 className="font-medium text-sm text-slate-800">Sarah Johnson</h3>
              <p className="text-xs text-slate-500">Patient ID: #28491</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-teal-50 text-teal-700 border-teal-200 text-xs">
              Premium
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-slate-50 border-slate-200 pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={item.active ? "subtle" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3",
                    item.active
                      ? "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && <Badge className="ml-auto bg-teal-500 text-white text-xs">{item.badge}</Badge>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Notifications */}
        <div className="p-3 border-t border-slate-200">
          <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-200">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <Badge className="ml-auto bg-teal-500 text-white text-xs">3</Badge>
          </Button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <Button variant="ghost" className="w-full justify-start text-slate-700">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}

