import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function DashboardLayout({
  children,
  className,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
}: DashboardLayoutProps) {
  return (
    <div className={cn("flex min-h-screen w-full bg-background text-foreground", className)}>
      {showSidebar && <Sidebar />}
      <div className="flex flex-col flex-1">
        {showHeader && <Header />}
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
}