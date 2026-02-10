'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, Settings, LayoutDashboard, User as UserIcon, Menu } from 'lucide-react'

export function NavBar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isNavigating, startNavigation] = useTransition()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavigate = useCallback(
    (path: string) => {
      startNavigation(() => {
        router.push(path)
      })
      setIsMobileMenuOpen(false)
    },
    [router, startNavigation]
  )

  const handleLogout = useCallback(() => {
    logout()
    setIsMobileMenuOpen(false)
  }, [logout])

  // Get user initials for avatar
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email
      ? user.email.substring(0, 1).toUpperCase()
      : '?'

  return (
    <nav
      className="fixed top-0 w-full bg-black/80 backdrop-blur border-b border-gray-800"
      style={{ zIndex: 40 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNavigate('/')}>
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold group-hover:animate-glow transition-all">
            CR
          </div>
          <span className="font-bold text-lg tracking-widest">CodeRefine</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-gray-400 hover:text-white text-sm transition duration-300"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-400 hover:text-white text-sm transition duration-300"
          >
            Pricing
          </a>
          <a href="#docs" className="text-gray-400 hover:text-white text-sm transition duration-300">
            Docs
          </a>
        </div>

        {/* Auth Section - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            // User is logged in - show profile dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg hover:bg-white/15 hover:border-white/40 transition-all duration-300 group"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-xs font-bold text-black group-hover:animate-glow transition-all">
                    {userInitials}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{user.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">{user.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-gray-400 text-xs">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigate('/analyzer')}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate('/profile')}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate('/settings')}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // User is not logged in - show login and signup buttons
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => handleNavigate('/login')}
                disabled={isNavigating}
              >
                Log In
              </Button>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                onClick={() => handleNavigate('/signup')}
                disabled={isNavigating}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black/40 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <a href="#features" className="block text-gray-400 hover:text-white text-sm transition">
              Features
            </a>
            <a href="#pricing" className="block text-gray-400 hover:text-white text-sm transition">
              Pricing
            </a>
            <a href="#docs" className="block text-gray-400 hover:text-white text-sm transition">
              Docs
            </a>
            <div className="border-t border-gray-800 pt-4 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-white/5 rounded-lg mb-3">
                    <p className="text-sm font-semibold text-white">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleNavigate('/analyzer')}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleNavigate('/profile')}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleNavigate('/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleNavigate('/login')}
                  >
                    Log In
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                    onClick={() => handleNavigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
