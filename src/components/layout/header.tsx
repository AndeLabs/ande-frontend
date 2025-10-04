"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Mountain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#problema-solucion", label: "Solución" },
  { href: "#abob-pay", label: "ABOB-Pay" },
  { href: "#andechain", label: "Infraestructura" },
  { href: "#tritoken", label: "Tokens" },
  { href: "#demo", label: "Demo" },
  { href: "#comunidad", label: "Comunidad" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-sm border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold text-foreground">
            AndeChain
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 transition-colors hover:text-foreground"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">Probar ABOB-Pay</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                  prefetch={false}
                >
                  <Mountain className="h-6 w-6 text-primary" />
                  <span className="sr-only">AndeChain</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
