import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bike, Heart, Home, LayoutGrid, LogOut, Menu, MessageCircle, Plus, Sparkles, User as UserIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { to: "/motorcycles", label: "მოტოციკლები", icon: Bike },
  { to: "/scooters", label: "სკუტერები", icon: Bike },
  { to: "/rentals", label: "გაქირავება", icon: LayoutGrid },
  { to: "/services", label: "სერვისები", icon: Wrench },
  { to: "/pricing", label: "პაკეტები", icon: Sparkles },
  { to: "/blog", label: "ბლოგი", icon: Home },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="MotoMarket — საქართველოს #1 მოტო-პლატფორმა"
            className="h-8 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="hidden sm:inline-flex gap-1.5"
            onClick={() => navigate(user ? "/sell" : "/auth")}
          >
            <Plus className="h-4 w-4" />
            დაამატე განცხადება
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="h-4 w-4 mr-2" /> ჩემი პროფილი
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/messages")}>
                  <MessageCircle className="h-4 w-4 mr-2" /> შეტყობინებები
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile?tab=favorites")}>
                  <Heart className="h-4 w-4 mr-2" /> ფავორიტები
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/sell")}>
                  <Plus className="h-4 w-4 mr-2" /> ახალი განცხადება
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" /> გასვლა
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              შესვლა
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {NAV_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60"
                      )
                    }
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </NavLink>
                ))}
                <div className="border-t my-3" />
                <Button onClick={() => navigate(user ? "/sell" : "/auth")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  განცხადების დამატება
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
