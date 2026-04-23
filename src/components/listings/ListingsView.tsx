import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownAZ, Grid2x2, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { FilterPanel, MobileFilterDrawer } from "@/components/listings/FilterPanel";
import { EmptyState } from "@/components/EmptyState";
import { useListings, useFavorites } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import type { Listing, MotoCategory, SearchFilters } from "@/types";

interface Props {
  title: string;
  subtitle?: string;
  type: "sale" | "rent";
  context: "motorcycle" | "scooter" | "all";
}

export function ListingsView({ title, subtitle, type, context }: Props) {
  const { listings, loading } = useListings(type);
  const { user } = useAuth();
  const { favorites, toggle } = useFavorites(user?.id);
  const navigate = useNavigate();
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc" | "tier">("tier");
  const [filters, setFilters] = useState<SearchFilters>({
    make: "", category: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", transmission: "",
  });

  const filtered = useMemo(() => {
    const scooterCats: MotoCategory[] = ["scooter"];
    let out = [...listings];

    if (context === "scooter") out = out.filter((l) => scooterCats.includes(l.category));
    if (context === "motorcycle") out = out.filter((l) => !scooterCats.includes(l.category));

    if (filters.make) out = out.filter((l) => l.make === filters.make);
    if (filters.category) out = out.filter((l) => l.category === filters.category);
    if (filters.transmission) out = out.filter((l) => l.transmission === filters.transmission);
    if (filters.minYear) out = out.filter((l) => l.year >= +filters.minYear);
    if (filters.maxYear) out = out.filter((l) => l.year <= +filters.maxYear);
    if (filters.minPrice) out = out.filter((l) => priceOf(l, type) >= +filters.minPrice);
    if (filters.maxPrice) out = out.filter((l) => priceOf(l, type) <= +filters.maxPrice);

    const tierRank = { super_vip: 3, vip: 2, basic: 1 } as const;
    out.sort((a, b) => {
      switch (sort) {
        case "newest":
          return +new Date(b.created_at) - +new Date(a.created_at);
        case "price-asc":
          return priceOf(a, type) - priceOf(b, type);
        case "price-desc":
          return priceOf(b, type) - priceOf(a, type);
        default:
          return tierRank[b.tier] - tierRank[a.tier];
      }
    });
    return out;
  }, [listings, filters, sort, context, type]);

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2 text-balance max-w-2xl">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <MobileFilterDrawer filters={filters} onChange={setFilters} context={context} />
          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className="w-[180px]">
              <ArrowDownAZ className="h-4 w-4 mr-2 opacity-60" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tier">პრემიუმი ჯერ</SelectItem>
              <SelectItem value="newest">ახლები ჯერ</SelectItem>
              <SelectItem value="price-asc">ფასი: ↑</SelectItem>
              <SelectItem value="price-desc">ფასი: ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        <aside className="hidden lg:block sticky top-20 rounded-3xl border bg-card p-6">
          <FilterPanel filters={filters} onChange={setFilters} context={context} />
        </aside>

        <section>
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>ნაპოვნია <strong className="text-foreground">{filtered.length}</strong> განცხადება</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="search"
              title="განცხადება ვერ მოიძებნა"
              description="სცადე ფილტრების შეცვლა ან დაამატე საკუთარი განცხადება."
              action={{ label: "დაამატე განცხადება", onClick: () => navigate("/sell") }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  isFavorite={favorites.includes(l.id)}
                  onToggleFavorite={user ? toggle : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function priceOf(l: Listing, type: "sale" | "rent") {
  return type === "rent" ? l.rental_price_daily ?? l.rental_price_weekly ?? 0 : l.price;
}
