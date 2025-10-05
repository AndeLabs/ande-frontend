'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Wallet, Vote, Lock, Droplets, Wrench, Terminal } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const navLinks = [
    { href: "/dashboard", label: "Billetera", icon: Wallet },
    { href: "/dashboard/governance", label: "Gobernanza", icon: Vote },
    { href: "/dashboard/staking", label: "Staking", icon: Lock },
    { href: "/dashboard/faucet", label: "Faucet", icon: Droplets },
    { href: "/dashboard/tools", label: "Herramientas", icon: Wrench },
    { href: "/dashboard/logs", label: "Logs", icon: Terminal },
];

const logoImage = PlaceHolderImages.find(img => img.id === 'ande-logo');

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 border-r bg-background p-4 flex flex-col justify-between">
            <div>
                <Link href="/" className="flex items-center gap-2 mb-8" prefetch={false}>
                    {logoImage && <Image src={logoImage.imageUrl} alt={logoImage.description} width={40} height={40} className="rounded-full" />}
                    <span className="font-headline text-lg font-bold text-foreground">AndeChain</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${isActive ? "bg-muted font-semibold" : "text-muted-foreground"}`}>
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div>
                {/* Wallet connection button is now in the main header */}
            </div>
        </aside>
    );
}
