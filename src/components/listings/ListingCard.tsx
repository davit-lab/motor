import { Link } from "react-router-dom";
import { Eye, Gauge, Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TierBadge } from "./TierBadge";
import type { Listing } from "@/types";
import { CATEGORY_LABEL, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { formatMileage, formatPrice, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  listing: Listing;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ListingCard({ listing, isFavorite, onToggleFavorite }: Props) {
  const isRent = listing.listing_type === "rent";
  const price =
    isRent && listing.rental_price_daily
      ? `${formatPrice(listing.rental_price_daily, listing.currency)}/დღე`
      : formatPrice(listing.price, listing.currency);

  const cover = listing.images[0];

  return (
    <Card
      className={cn(
        "group overflow-hidden border bg-card transition-all hover:shadow-elevated hover:-translate-y-0.5",
        listing.tier === "super_vip" && "ring-2 ring-accent/40"
      )}
    >
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {cover ? (
            <img
              src={cover}
              alt={`${listing.make} ${listing.model} ${listing.year}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground text-xs">
              ფოტო არაა
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <TierBadge tier={listing.tier} />
          </div>

          {onToggleFavorite && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur shadow-sm hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(listing.id);
              }}
              aria-label="favorite"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-destructive text-destructive" : "text-foreground"
                )}
              />
            </Button>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-foreground">
              {CATEGORY_LABEL[listing.category]}
            </span>
            <span className="rounded-full bg-foreground/90 text-background backdrop-blur px-2.5 py-1 text-[10px] font-semibold inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> {listing.views ?? 0}
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/listing/${listing.id}`}>
              <h3 className="font-semibold text-base leading-tight line-clamp-1 hover:text-accent transition-colors">
                {listing.make} {listing.model}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{listing.year}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-base text-accent">{price}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" /> {formatMileage(listing.mileage)}
          </span>
          <span>{TRANSMISSION_LABEL[listing.transmission]}</span>
          <span>{FUEL_LABEL[listing.fuel_type]}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {listing.location}
          </span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
