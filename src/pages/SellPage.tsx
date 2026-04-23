import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ALL_MAKES,
  CATEGORY_LABEL,
  FUEL_LABEL,
  LICENSE_LABEL,
  SERVICE_CATEGORY_LABEL,
  TIER_PLANS,
  TRANSMISSION_LABEL,
} from "@/lib/constants";
import type {
  FuelType,
  LicenseCategory,
  ListingTier,
  ListingType,
  MotoCategory,
  ServiceCategory,
  Transmission,
} from "@/types";
import { Check, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"vehicle" | "service">("vehicle");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  if (!user) return <div className="container py-20" />;

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">ახალი განცხადება</h1>
      <p className="text-muted-foreground mb-8">აირჩიე ტიპი და შეავსე ფორმა.</p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "vehicle" | "service")}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="vehicle">მოტო/სკუტერი</TabsTrigger>
          <TabsTrigger value="service">სერვისი</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle">
          <VehicleForm userId={user.id} onCreated={() => navigate("/motorcycles")} toast={toast} />
        </TabsContent>
        <TabsContent value="service">
          <ServiceForm userId={user.id} onCreated={() => navigate("/services")} toast={toast} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== Image upload helper ==============

function useImageUpload(userId: string, bucket: "listing-images" | "avatars") {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) continue;
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setUploading(false);
    return urls;
  };

  return { upload, uploading, inputRef };
}

function ImageUploader({
  userId,
  images,
  setImages,
  max = 10,
}: {
  userId: string;
  images: string[];
  setImages: (urls: string[]) => void;
  max?: number;
}) {
  const { upload, uploading, inputRef } = useImageUpload(userId, "listing-images");

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const remaining = max - images.length;
          if (remaining <= 0) return;
          const slice = Array.from(e.target.files || []).slice(0, remaining);
          const dt = new DataTransfer();
          slice.forEach((f) => dt.items.add(f));
          const urls = await upload(dt.files);
          setImages([...images, ...urls]);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= max}
        className="w-full border-2 border-dashed rounded-2xl p-6 text-center hover:border-accent/40 transition-colors disabled:opacity-50"
      >
        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          {uploading ? "იტვირთება..." : "ატვირთე ფოტოები"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {images.length}/{max} • max 5MB თითოეული
        </p>
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-background/80 hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

// ============== Vehicle form ==============

function VehicleForm({
  userId,
  onCreated,
  toast,
}: {
  userId: string;
  onCreated: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    listing_type: "sale" as ListingType,
    make: "Yamaha",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    rental_price_daily: 0,
    currency: "USD" as "USD" | "GEL",
    mileage: 0,
    engine_size: 600,
    category: "sport" as MotoCategory,
    transmission: "manual" as Transmission,
    fuel_type: "petrol" as FuelType,
    license_category: "A" as LicenseCategory,
    location: "თბილისი",
    description: "",
    phone: "",
    tier: "basic" as ListingTier,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save phone on profile if provided
    if (form.phone) {
      await supabase.from("profiles").update({ phone: form.phone }).eq("id", userId);
    }

    const { error } = await supabase.from("listings").insert({
      owner_id: userId,
      listing_type: form.listing_type,
      make: form.make,
      model: form.model,
      year: form.year,
      price: form.price,
      rental_price_daily: form.listing_type === "rent" ? form.rental_price_daily : null,
      currency: form.currency,
      mileage: form.mileage,
      engine_size: form.engine_size,
      category: form.category,
      transmission: form.transmission,
      fuel_type: form.fuel_type,
      license_category: form.license_category,
      location: form.location,
      description: form.description,
      images,
      tier: form.tier,
    });

    setSubmitting(false);
    if (error) toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    else {
      toast({ title: "განცხადება დაემატა!" });
      onCreated();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">ძირითადი</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="ტიპი">
            <Select value={form.listing_type} onValueChange={(v) => set("listing_type", v as ListingType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">გაყიდვა</SelectItem>
                <SelectItem value="rent">გაქირავება</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="კატეგორია">
            <Select value={form.category} onValueChange={(v) => set("category", v as MotoCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="მწარმოებელი">
            <Select value={form.make} onValueChange={(v) => set("make", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="მოდელი">
            <Input required value={form.model} onChange={(e) => set("model", e.target.value)} />
          </Field>
          <Field label="წელი">
            <Input type="number" required value={form.year} onChange={(e) => set("year", +e.target.value)} />
          </Field>
          <Field label="გარბენი (კმ)">
            <Input type="number" value={form.mileage} onChange={(e) => set("mileage", +e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">ფასი და კონტაქტი</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label={form.listing_type === "rent" ? "ფასი დღეში" : "ფასი"}>
            <Input
              type="number"
              required
              value={form.listing_type === "rent" ? form.rental_price_daily : form.price}
              onChange={(e) =>
                form.listing_type === "rent"
                  ? set("rental_price_daily", +e.target.value)
                  : set("price", +e.target.value)
              }
            />
          </Field>
          <Field label="ვალუტა">
            <Select value={form.currency} onValueChange={(v) => set("currency", v as "USD" | "GEL")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GEL">GEL</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="ლოკაცია">
            <Input required value={form.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <Field label="ტელეფონის ნომერი (გამოჩნდება განცხადებაში)">
          <Input
            type="tel"
            placeholder="+995 555 12 34 56"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">ტექნიკური მონაცემები</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="ძრავის მოცულობა (cc)">
            <Input type="number" value={form.engine_size} onChange={(e) => set("engine_size", +e.target.value)} />
          </Field>
          <Field label="გადაცემათა კოლოფი">
            <Select value={form.transmission} onValueChange={(v) => set("transmission", v as Transmission)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSMISSION_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="საწვავი">
            <Select value={form.fuel_type} onValueChange={(v) => set("fuel_type", v as FuelType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(FUEL_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="მართვის კატეგორია">
            <Select value={form.license_category} onValueChange={(v) => set("license_category", v as LicenseCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(LICENSE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">აღწერა და ფოტოები</h2>
        <Field label="აღწერა">
          <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="ფოტოები">
          <ImageUploader userId={userId} images={images} setImages={setImages} max={10} />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">პაკეტი</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {TIER_PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => set("tier", p.id)}
              className={cn(
                "text-left rounded-2xl border-2 p-5 transition-all",
                form.tier === p.id
                  ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                  : "border-border hover:border-accent/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{p.name}</span>
                {form.tier === p.id && <Check className="h-4 w-4 text-accent" />}
              </div>
              <p className="text-2xl font-display font-bold text-accent">
                {p.price === 0 ? "უფასო" : `${p.price}₾`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
            </button>
          ))}
        </div>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "მიმდინარეობს..." : "გამოაქვეყნე განცხადება"}
      </Button>
    </form>
  );
}

// ============== Service form ==============

function ServiceForm({
  userId,
  onCreated,
  toast,
}: {
  userId: string;
  onCreated: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [offered, setOffered] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "repair" as ServiceCategory,
    location: "თბილისი",
    price_estimate: 0,
    provider_name: "",
    provider_phone: "",
    tier: "basic" as ListingTier,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (form.provider_phone) {
      await supabase.from("profiles").update({ phone: form.provider_phone }).eq("id", userId);
    }

    const { error } = await supabase.from("service_listings").insert({
      owner_id: userId,
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      price_estimate: form.price_estimate || null,
      offered_services: offered.split(",").map((s) => s.trim()).filter(Boolean),
      provider_name: form.provider_name,
      provider_phone: form.provider_phone || null,
      images,
      tier: form.tier,
    });

    setSubmitting(false);
    if (error) toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    else {
      toast({ title: "სერვისი დაემატა!" });
      onCreated();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">სერვისის ინფო</h2>
        <Field label="სათაური">
          <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="მაგ: MotoFix - შეკეთება და დიაგნოსტიკა" />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="კატეგორია">
            <Select value={form.category} onValueChange={(v) => set("category", v as ServiceCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SERVICE_CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="ლოკაცია">
            <Input required value={form.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <Field label="აღწერა">
          <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="შემოთავაზებული სერვისები (გამოყავი მძიმით)">
          <Input
            value={offered}
            onChange={(e) => setOffered(e.target.value)}
            placeholder="ზეთის შეცვლა, დიაგნოსტიკა, ჯაჭვის რეგულირება"
          />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">კონტაქტი</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="პასუხისმგებელი პირი">
            <Input required value={form.provider_name} onChange={(e) => set("provider_name", e.target.value)} />
          </Field>
          <Field label="ტელეფონი">
            <Input
              type="tel"
              placeholder="+995 555 12 34 56"
              value={form.provider_phone}
              onChange={(e) => set("provider_phone", e.target.value)}
            />
          </Field>
          <Field label="საშუალო ფასი (₾)">
            <Input type="number" value={form.price_estimate} onChange={(e) => set("price_estimate", +e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">ფოტოები</h2>
        <ImageUploader userId={userId} images={images} setImages={setImages} max={6} />
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-lg">პაკეტი</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {TIER_PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => set("tier", p.id)}
              className={cn(
                "text-left rounded-2xl border-2 p-5 transition-all",
                form.tier === p.id
                  ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                  : "border-border hover:border-accent/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{p.name}</span>
                {form.tier === p.id && <Check className="h-4 w-4 text-accent" />}
              </div>
              <p className="text-2xl font-display font-bold text-accent">
                {p.price === 0 ? "უფასო" : `${p.price}₾`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
            </button>
          ))}
        </div>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "მიმდინარეობს..." : "გამოაქვეყნე სერვისი"}
      </Button>
    </form>
  );
}
