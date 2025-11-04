"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  Target,
  FileText,
  Star,
  Menu,
  LogOut,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push("/");
    }
  };

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const navigationItems = [
    {
      name: "Sales Stats",
      href: "/sales-stats",
      disabled: false,
      icon: BarChart3,
      badge: null,
    },
    {
      name: "CSM Stats",
      href: "/csm-stats",
      disabled: false,
      icon: BarChart3,
      badge: null,
    },
    {
      name: "VA Stats",
      href: "/va-stats",
      disabled: false,
      icon: BarChart3,
      badge: null,
    },
    {
      name: "Clients",
      href: "/clients",
      disabled: false,
      icon: Users,
      badge: null,
    },
    // {
    //   name: "Appointments",
    //   href: "#",
    //   disabled: true,
    //   icon: Calendar,
    //   badge: "Soon",
    // },
    // {
    //   name: "Opportunities",
    //   href: "#",
    //   disabled: true,
    //   icon: Target,
    //   badge: "Soon",
    // },
  ];

  const handleNavigation = (href: string, disabled: boolean) => {
    if (!disabled && href !== "#") {
      router.push(href);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          {/* Left Column - Logo and Brand */}
          <div className="flex items-center">
            <a className="flex items-center space-x-2" href="/dashboard">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="hidden font-bold sm:inline-block text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </a>
          </div>

          {/* Center Column - Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.href, item.disabled)}
                  disabled={item.disabled}
                  className={`relative h-9 px-3 ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : item.disabled
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Right Column - Mobile Menu, Notifications, and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Dashboard
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through your dashboard sections
                  </SheetDescription>
                </SheetHeader>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                  <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.name}
                          variant={isActive(item.href) ? "default" : "ghost"}
                          size="sm"
                          onClick={() =>
                            handleNavigation(item.href, item.disabled)
                          }
                          disabled={item.disabled}
                          className={`justify-start h-10 px-3 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : item.disabled
                              ? "text-muted-foreground cursor-not-allowed"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 h-5 px-1.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                >
                  <span className="text-sm font-medium">
                    {user?.email ? getInitials(user.email) : "U"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.created_at
                        ? `Member since ${new Date(
                            user.created_at
                          ).toLocaleDateString()}`
                        : "Dashboard User"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
