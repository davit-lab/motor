import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Listing, Profile, ServiceListing } from "@/types";
import { ListingCard } from "@/components/listings/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { useFavorites } from "@/hooks/useListings";
import { Camera, Trash2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/listings/TierBadge";
import { SERVICE_CATEGORY_LABEL } from "@/lib/constants";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myServices, setMyServices] = useState<ServiceListing[]>([]);
  const [favListings, setFavListings] = useState<Listing[]>([]);
  const { favorites, toggle } = useFavorites(user?.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as unknown as Profile));
    supabase.from("listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setMyListings((data || []) as unknown as Listing[]));
    supabase.from("service_listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setMyServices((data || []) as unknown as ServiceListing[]));
  }, [user]);

  useEffect(() => {
    if (!user || favorites.length === 0) {
      setFavListings([]);
      return;
    }
    supabase.from("listings").select("*").in("id", favorites)
      .then(({ data }) => setFavListings((data || []) as unknown as Listing[]));
  }, [user, favorites]);

  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        phone: profile.phone,
        city: profile.city,
        bio: profile.bio,
      })
      .eq("id", user.id);
    if (error) toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    else toast({ title: "შენახულია" });
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      toast({ title: "შეცდომა", description: upErr.message, variant: "destructive" });
      setUploadingAvatar(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    setProfile((p) => (p ? { ...p, avatar_url: data.publicUrl } : p));
    setUploadingAvatar(false);
    toast({ title: "ავატარი განახლდა" });
  };

  const deleteListing = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setMyListings((ls) => ls.filter((l) => l.id !== id));
  };

  const deleteService = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
    await supabase.from("service_listings").delete().eq("id", id);
    setMyServices((ls) => ls.filter((l) => l.id !== id));
  };

  if (!user || !profile) return <div className="container py-20" />;

  const initial = (profile.display_name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative group h-20 w-20 rounded-2xl overflow-hidden bg-secondary"
          disabled={uploadingAvatar}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-2xl font-bold">{initial}</div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
        />
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {profile.display_name || "ჩემი პროფილი"}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
        </div>
      </div>

      <Tabs defaultValue={params.get("tab") === "favorites" ? "favorites" : params.get("tab") === "services" ? "services" : "listings"}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="listings">განცხადებები ({myListings.length})</TabsTrigger>
          <TabsTrigger value="services">სერვისები ({myServices.length})</TabsTrigger>
          <TabsTrigger value="favorites">ფავორიტები ({favListings.length})</TabsTrigger>
          <TabsTrigger value="settings">პარამეტრები</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {myListings.length === 0 ? (
            <EmptyState
              icon="bike"
              title="ჯერ არ გაქვს განცხადება"
              description="დაამატე პირველი განცხადება და დაიწყე გაყიდვა."
              action={{ label: "დამატება", onClick: () => navigate("/sell") }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((l) => (
                <div key={l.id} className="relative group">
                  <ListingCard listing={l} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => deleteListing(l.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          {myServices.length === 0 ? (
            <EmptyState
              icon="question"
              title="ჯერ არ გაქვს სერვისი"
              description="დაამატე სერვისის განცხადება."
              action={{ label: "დამატება", onClick: () => navigate("/sell") }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((s) => (
                <Card key={s.id} className="overflow-hidden">
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    {s.images[0] ? (
                      <img src={s.images[0]} alt={s.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-muted-foreground">
                        <Wrench className="h-8 w-8 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">{s.title}</h3>
                      <TierBadge tier={s.tier} />
                    </div>
                    <Badge variant="secondary">{SERVICE_CATEGORY_LABEL[s.category]}</Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => deleteService(s.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> წაშლა
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favListings.length === 0 ? (
            <EmptyState icon="search" title="ფავორიტები ცარიელია" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favListings.map((l) => (
                <ListingCard key={l.id} listing={l} isFavorite={true} onToggleFavorite={toggle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="p-6 space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <Label>სახელი</Label>
              <Input value={profile.display_name || ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>ტელეფონი</Label>
              <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+995 555 12 34 56" />
            </div>
            <div className="space-y-1.5">
              <Label>ქალაქი</Label>
              <Input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>ჩემს შესახებ</Label>
              <Textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <Button onClick={saveProfile}>შენახვა</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
