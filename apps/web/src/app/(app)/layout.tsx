import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-lg font-bold text-primary">
              CarScout
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/guide">Guide</NavLink>
            </nav>
          </div>
          <AppNav userEmail={user.email ?? ""} />
        </div>
      </header>
      <main className="flex-1 bg-muted/30 pb-16 sm:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex">
        <Link
          href="/dashboard"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/compare"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Compare
        </Link>
        <Link
          href="/guide"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Guide
        </Link>
      </nav>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
