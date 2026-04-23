import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useServiceListings } from "@/hooks/useListings";
import { SERVICE_CATEGORY_LABEL } from "@/lib/constants";
import { MapPin, Phone } from "lucide-react";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { TierBadge } from "@/components/listings/TierBadge";

export default function ServicesPage() {
  const { services, loading } = useServiceListings();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">სერვისები</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          იპოვე საუკეთესო სერვის-ცენტრები — შეკეთება, დეტეილინგი, ტიუნინგი და ელექტრობა.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState icon="search" title="სერვისი ვერ მოიძებნა" description="ჯერჯერობით სერვისები არაა დამატებული." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card key={s.id} className="overflow-hidden hover:shadow-elevated transition-all">
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                {s.images[0] && <img src={s.images[0]} alt={s.title} loading="lazy" className="h-full w-full object-cover" />}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{s.title}</h3>
                  <TierBadge tier={s.tier} />
                </div>
                <Badge variant="secondary">{SERVICE_CATEGORY_LABEL[s.category]}</Badge>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</span>
                  {s.provider_phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {s.provider_phone}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
