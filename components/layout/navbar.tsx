"use client";
import { Menu, Store, ShoppingCart, LogOut, User as UserIcon, Send, CircleCheckBig, HelpCircle, Home } from "lucide-react";
import leseicon from "../icons/g14.svg";
import React, { useEffect, useState } from 'react';
import { createClient } from "@/lib/sbClient";
import type { User } from '@supabase/supabase-js';

import {
  Sheet,
  SheetContent,
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
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";

const routeList: { href: string; label: string; icon?: React.ReactNode }[] = [
  { href: "/#about", label: "Hakkımızda", icon: <HelpCircle className="w-4 h-4" /> },
  { href: "/#services", label: "Hizmetlerimiz", icon: <CircleCheckBig className="w-4 h-4" /> },
  { href: "/#contact", label: "İletişim", icon: <Send className="w-4 h-4" /> },
  { href: "/magaza?page=1&limit=10", label: "Mağaza", icon: <Store className="w-4 h-4" /> },
  { href: "/sepet", label: "Sepet", icon: <ShoppingCart className="w-4 h-4" /> },
  { href: "/profil", label: "Profil", icon: <UserIcon className="w-4 h-4" /> },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  if (loading) {
    return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
        <Link href="/" className="font-bold text-lg flex items-center">
          <Image src={leseicon} alt="LESE logo" width={80} height={80} className="ml-4"/>
        </Link>
        {/* Render auth buttons immediately while loading */}
        <div className="hidden lg:flex">
          <ToggleTheme />
        </div>
      </header>
    );
  }

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <Image src={leseicon} alt="LESE logo" width={80} height={80} className="ml-4"/>
      </Link>

      {/* Mobile menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary">
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle>
                  <Link href="/" className="flex items-center">
                    <Image src={leseicon} alt="LESE logo" className="w-20" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {user && (
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
                    <Link href={href} className="flex items-center gap-2 py-8">
                      {icon}{label}
                    </Link>
                  </Button>
                ))}
                
                {/* Auth buttons */}
                {user ? (
                  <Button onClick={handleSignOut} variant="ghost" className="text-base justify-start gap-2">
                    <LogOut className="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" /> Çıkış Yap
                  </Button>
                ) : (
                  <Button onClick={() => setIsOpen(false)} asChild variant="outline"
                    style={{ backgroundColor: "#3235d1", color: "white", borderColor: "#3235d1" }}
                    className="text-base hover:opacity-90 transition">
                    <Link href="/auth">Giriş Yap</Link>
                  </Button>
                )}
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
              <Link href="/">
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
                      href={href}
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
                <Link href={href} className="flex items-center gap-2">
                  {icon}
                  {label}
                </Link>
              </Button>
            </NavigationMenuItem>
          ))}

          {/* Auth buttons */}
          {user ? (
            <NavigationMenuItem>
              <Button onClick={handleSignOut} variant="ghost" className="text-base justify-start">
                <LogOut className="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
              </Button>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/auth" className="text-base px-2">
                  <Button
                    variant="outline"
                    style={{ backgroundColor: "#3235d1", color: "white", borderColor: "#3235d1" }}
                    className="text-base hover:opacity-90 transition"
                  >
                    Giriş Yap
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex">
        <ToggleTheme />
      </div>
    </header>
  );
};
