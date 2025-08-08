"use client";
import { Menu, Store, ShoppingCart, LogOut, LogIn, User as UserIcon, Send, CircleCheckBig, HelpCircle, Home } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/sbClient";
import type { User } from '@supabase/supabase-js';
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";

const routeList: { href: string; label: string; icon?: React.ReactNode }[] = [
  { href: "/#about", label: "Hakkımızda", icon: <HelpCircle className="w-4 h-4" /> },
  { href: "/#services", label: "Hizmetlerimiz", icon: <CircleCheckBig className="w-4 h-4" /> },
  { href: "/#contact", label: "İletişim", icon: <Send className="w-4 h-4" /> },
  { href: "/magaza", label: "Mağaza", icon: <Store className="w-4 h-4" /> },
  { href: "/sepet", label: "Sepet", icon: <ShoppingCart className="w-4 h-4" /> },
  { href: "/profil", label: "Profil", icon: <UserIcon className="w-4 h-4" /> },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [isInitialized]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthContent = () => {
    if (!isInitialized || loading) {
      return (
        <div className="hidden lg:block">
          <div className="flex items-center 
                          justify-center animate-pulse 
                          bg-transparent 
                          outline-[1px] h-8 w-26 rounded-md">
          <Loader2 className="size-5 text-gray-500 hover:text-gray-900 transition-colors animate-spin" />
          </div>
        </div>
      );
    }

    return user ? (
      <div className="hidden lg:block">
        <Button onClick={handleSignOut} variant="outline" className="text-xs justify-start" disabled={loading}>
          <LogOut className="size-5 text-red-500 hover:text-red-700 transition-colors" />
          {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </Button>
      </div>
    ) : (
      <div className="hidden lg:block">
        <Link href="/auth"  prefetch={true}>
          <Button variant="outline" className="text-xs justify-start" disabled={loading}>
            <LogIn className="size-5 text-blue-500 hover:text-blue-700 transition-colors" />
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </Link>
      </div>
    );
  };

const renderMobileAuthContent = () => {
  if (!isInitialized || loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-full rounded mx-4"></div>
    );
  }

  return user ? (
    <div className="mx-4">
      <Button onClick={handleSignOut} variant="outline" className="text-xs justify-start w-full" disabled={loading}>
        <LogOut className="size-5 text-red-500 hover:text-red-700 transition-colors mr-2" />
        {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
      </Button>
    </div>
  ) : (
    <div className="mx-4">
      <Link href="/auth"  prefetch={true} className="w-full">
        <Button variant="outline" className="text-xs justify-start w-full" disabled={loading}>
          <LogIn className="size-5 text-blue-500 hover:text-blue-700 transition-colors mr-2" />
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </Link>
    </div>
  );
};

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl h-16 top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center" prefetch={true}>
        <img src="/g14.svg" alt="LESE logo" width={80} height={80} className="ml-4 w-20 h-20" />
      </Link>

      {/* Mobile menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu 
              onClick={() => setIsOpen(!isOpen)} 
              className="cursor-pointer lg:hidden mx-4"
              aria-label="Menüyü aç"
            />
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <SheetHeader className="mb-4 ml-4">
              <SheetTitle>
                <Link href="/"  prefetch={true} className="flex items-center">
                  <img src="/g14.svg" alt="LESE logo" width={80} height={80} className="ml-4 w-20 h-20"/>
                </Link>
              </SheetTitle>
              <SheetDescription>
                Site navigasyon menüsü - Sayfalar arasında gezinmek için menü öğelerini kullanın
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col gap-2 mx-4">
                {isInitialized && user && (
                  <div className="px-4 py-4 border-b border-gray-300 text-md">
                    {user.email}
                  </div>
                )}

                {routeList.map(({ href, label, icon }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base flex gap-2"
                  >
                    <Link href={href} prefetch={true} className="flex items-center gap-2 py-8">
                      {icon}{label}
                    </Link>
                  </Button>
                ))}
                
                {/* Mobile Auth buttons */}
                {renderMobileAuthContent()}
              </div>
            </div>
            
            <SheetFooter className="flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop menu */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Home className="w-4 h-4 mr-2" />
              <Link href="/"  prefetch={true}>
                Anasayfa
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex flex-col p-2 space-y-1">
                {routeList.slice(0, 3).map(({ href, label, icon }) => (
                  <NavigationMenuLink
                    key={href}
                    asChild
                  >
                    <Link
                      href={href}  prefetch={true}
                      className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {icon}
                      {label}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Individual buttons for remaining items */}
          {routeList.slice(3).map(({ href, label, icon }) => (
            <NavigationMenuItem key={href}>
              <Button
                onClick={() => setIsOpen(false)}
                asChild
                variant="ghost"
                className="justify-start text-base"
              >
                <Link href={href}  prefetch={true} className="flex items-center gap-2">
                  {icon}
                  {label}
                </Link>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Auth buttons */}
      {renderAuthContent()}

      <div className="hidden lg:flex ml-4">
        <ToggleTheme />
      </div>
    </header>
  );
};