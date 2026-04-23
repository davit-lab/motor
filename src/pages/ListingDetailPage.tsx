import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TierBadge } from "@/components/listings/TierBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useListings";
import { getOrCreateConversation } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import type { Listing, Profile } from "@/types";
import { CATEGORY_LABEL, FUEL_LABEL, LICENSE_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { formatMileage, formatPrice, timeAgo } from "@/lib/format";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { favorites, toggle } = useFavorites(user?.id);
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (data) {
        setListing(data as unknown as Listing);
        supabase.from("listings").update({ views: (data.views ?? 0) + 1 }).eq("id", id);
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.owner_id).maybeSingle();
        if (prof) setSeller(prof as unknown as Profile);
      }
      setLoading(false);
    })();
  }, [id]);

  const startChat = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!listing || !seller) return;
    if (user.id === listing.owner_id) {
      toast({ title: "ეს თქვენი განცხადებაა" });
      return;
    }
    setChatLoading(true);
    const convId = await getOrCreateConversation({
      listingId: listing.id,
      buyerId: user.id,
      sellerId: listing.owner_id,
    });
    setChatLoading(false);
    if (convId) navigate(`/messages?c=${convId}`);
    else toast({ title: "ვერ შევქმენი ჩატი", variant: "destructive" });
  };

  if (loading) {
    return (
      <div className="container py-10 grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <Skeleton className="aspect-[4/3] rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">განცხადება ვერ მოიძებნა</h1>
        <Button asChild className="mt-4"><Link to="/motorcycles">ყველა განცხადება</Link></Button>
      </div>
    );
  }

  const isFav = favorites.includes(listing.id);
  const cover = listing.images[activeImg] || listing.images[0];
  const isOwner = user?.id === listing.owner_id;

  const specs = [
    { label: "წელი", value: listing.year },
    { label: "გარბენი", value: formatMileage(listing.mileage) },
    { label: "ძრავი", value: `${listing.engine_size ?? "—"} cc` },
    { label: "კატეგორია", value: CATEGORY_LABEL[listing.category] },
    { label: "გადაცემა", value: TRANSMISSION_LABEL[listing.transmission] },
    { label: "საწვავი", value: FUEL_LABEL[listing.fuel_type] },
    { label: "მართვის კატეგორია", value: LICENSE_LABEL[listing.license_category] },
    { label: "მდგომარეობა", value: listing.condition || "—" },
  ];

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/motorcycles"><ArrowLeft className="h-4 w-4" /> უკან</Link>
      </Button>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-3">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted">
            {cover ? (
              <img src={cover} alt={`${listing.make} ${listing.model}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">ფოტო არაა</div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 ${
                    i === activeImg ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <TierBadge tier={listing.tier} size="md" />
                <h1 className="font-display text-2xl font-bold mt-2">
                  {listing.make} {listing.model}
                </h1>
                <p className="text-sm text-muted-foreground">{listing.year}</p>
              </div>
              {user && !isOwner && (
                <Button variant="outline" size="icon" onClick={() => toggle(listing.id)}>
                  <Heart className={isFav ? "h-4 w-4 fill-destructive text-destructive" : "h-4 w-4"} />
                </Button>
              )}
            </div>

            <div className="text-3xl font-display font-bold text-accent">
              {listing.listing_type === "rent" && listing.rental_price_daily
                ? `${formatPrice(listing.rental_price_daily, listing.currency)}/დღე`
                : formatPrice(listing.price, listing.currency)}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground border-t pt-4">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing.location}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {listing.views ?? 0}</span>
              <span>•</span>
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </Card>

          {seller && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">გამყიდველი</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary grid place-items-center font-semibold">
                  {seller.avatar_url ? (
                    <img src={seller.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (seller.display_name || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{seller.display_name || "მომხმარებელი"}</p>
                  {seller.city && <p className="text-xs text-muted-foreground">{seller.city}</p>}
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-2">
                  {seller.phone ? (
                    showPhone ? (
                      <Button asChild className="w-full gap-2">
                        <a href={`tel:${seller.phone}`}><Phone className="h-4 w-4" /> {seller.phone}</a>
                      </Button>
                    ) : (
                      <Button onClick={() => setShowPhone(true)} variant="outline" className="w-full gap-2">
                        <Phone className="h-4 w-4" /> ნომრის ნახვა
                      </Button>
                    )
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">ნომერი არაა მითითებული</p>
                  )}
                  <Button onClick={startChat} disabled={chatLoading} className="w-full gap-2" variant="default">
                    <MessageCircle className="h-4 w-4" />
                    {chatLoading ? "..." : "შიდა ჩატი"}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </aside>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mt-8">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">აღწერა</h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {listing.description || "აღწერა არ არის მითითებული."}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">მახასიათებლები</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
