'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect, useConnectors } from 'wagmi';
import { Menu, Wallet, LogOut } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChainStatus from "@/components/blockchain/ChainStatus";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const landingNavLinks = [
  { href: "#solucion", label: "Solución" },
  { href: "#infraestructura", label: "Infraestructura" },
  { href: "#tokens", label: "Tokens" },
  { href: "#comunidad", label: "Comunidad" },
];

const logoImage = PlaceHolderImages.find(img => img.id === 'ande-logo');

function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const connectors = useConnectors();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    if (isConnected) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <span className="font-mono truncate max-w-[100px]">{address}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => disconnect()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Desconectar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button><Wallet className="mr-2" /> Conectar Billetera</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {connectors.map((conn) => (
                    <DropdownMenuItem key={conn.uid} onClick={() => connect({ connector: conn })}>
                        {conn.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render a minimal header for the dashboard
  if (isDashboard) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <ChainStatus />
                <ConnectWallet />
            </div>
        </header>
    );
  }

  // Render the full landing page header
  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          {logoImage && <Image src={logoImage.imageUrl} alt={logoImage.description} width={40} height={40} className="rounded-full" />}
          <span className="font-headline text-lg font-bold text-foreground">AndeChain</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/70 transition-colors hover:text-foreground" prefetch={false}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <ConnectWallet />
            <Link href="/dashboard" passHref>
                <Button>Lanzar dApp</Button>
            </Link>
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden"><Menu className="h-6 w-6" /><span className="sr-only">Toggle nav</span></Button>
                </SheetTrigger>
                <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                        {logoImage && <Image src={logoImage.imageUrl} alt={logoImage.description} width={40} height={40} className="rounded-full" />}
                        <span className="sr-only">AndeChain</span>
                    </Link>
                    {landingNavLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground" prefetch={false}>{link.label}</Link>
                    ))}
                </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}