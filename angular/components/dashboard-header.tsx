"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3">
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
              <div className="hidden md:block">
                <h1 className="font-bold text-lg gradient-text">MediAssist</h1>
                <p className="text-xs text-white/50">AI Health Platform</p>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}

          {/* Desktop Navigation */}
          <div
            className={`md:flex items-center space-x-4 ${isMobile ? (isMenuOpen ? "flex flex-col absolute top-16 left-0 right-0 bg-white/5 backdrop-blur-sm border-b border-white/10 p-4 space-y-4 shadow-md" : "hidden") : "flex"}`}
          >
            {/* Search */}
            <div className={`relative ${isMobile ? "w-full" : "w-64"}`}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
              <Input type="search" placeholder="Search..." className="w-full glass-input pl-9 h-9 text-sm" />
            </div>

            {/* Navigation Links */}
            <nav className={`${isMobile ? "w-full" : "flex items-center space-x-1"}`}>
              <Link href="/chat">
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${isMobile ? "w-full justify-start" : ""}`}
                >
                  AI Chat
                </Button>
              </Link>
              <Link href="#">
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${isMobile ? "w-full justify-start" : ""}`}
                >
                  Appointments
                </Button>
              </Link>
              <Link href="#">
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${isMobile ? "w-full justify-start" : ""}`}
                >
                  Records
                </Button>
              </Link>
            </nav>

            {/* User Menu */}
            <div className={`flex items-center space-x-2 ${isMobile ? "w-full justify-between" : ""}`}>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <Avatar className="h-8 w-8 ring-2 ring-purple-500/50">
                      <img src="/placeholder.svg?height=32&width=32" alt="User" />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/10 backdrop-blur-md border-white/10 text-white"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-white/50">sarah.j@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/20">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/20">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                    <Badge className="ml-auto bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">3</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/20">
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

