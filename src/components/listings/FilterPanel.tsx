import { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchFilters } from "@/types";
import { ALL_MAKES, CATEGORY_LABEL, MOTO_MAKES, SCOOTER_MAKES, TRANSMISSION_LABEL } from "@/lib/constants";
import type { MotoCategory, Transmission } from "@/types";

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  context?: "motorcycle" | "scooter" | "all";
}

const CATEGORIES_FOR: Record<string, MotoCategory[]> = {
  motorcycle: ["sport", "cruiser", "adventure", "naked", "touring", "dirt"],
  scooter: ["scooter"],
  all: ["sport", "cruiser", "adventure", "naked", "touring", "dirt", "scooter"],
};

export function FilterPanel({ filters, onChange, context = "all" }: Props) {
  const set = <K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) =>
    onChange({ ...filters, [k]: v });

  const clear = () =>
    onChange({ make: "", category: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", transmission: "" });

  const makes = context === "scooter" ? SCOOTER_MAKES : context === "motorcycle" ? MOTO_MAKES : ALL_MAKES;
  const cats = CATEGORIES_FOR[context];

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">ფილტრი</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-xs h-7">
            <X className="h-3 w-3 mr-1" /> გასუფთავება
          </Button>
        )}
      </div>

      <FilterField label="მწარმოებელი">
        <Select value={filters.make || "all"} onValueChange={(v) => set("make", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="ყველა" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა</SelectItem>
            {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterField>

      {cats.length > 1 && (
        <FilterField label="კატეგორია">
          <Select value={filters.category || "all"} onValueChange={(v) => set("category", v === "all" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="ყველა" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა</SelectItem>
              {cats.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterField>
      )}

      <FilterField label="ფასი">
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="დან" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} />
          <Input type="number" placeholder="მდე" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} />
        </div>
      </FilterField>

      <FilterField label="წელი">
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="დან" value={filters.minYear} onChange={(e) => set("minYear", e.target.value)} />
          <Input type="number" placeholder="მდე" value={filters.maxYear} onChange={(e) => set("maxYear", e.target.value)} />
        </div>
      </FilterField>

      <FilterField label="გადაცემათა კოლოფი">
        <Select value={filters.transmission || "all"} onValueChange={(v) => set("transmission", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="ყველა" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა</SelectItem>
            {(["manual", "automatic", "dct"] as Transmission[]).map((t) => (
              <SelectItem key={t} value={t}>{TRANSMISSION_LABEL[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function MobileFilterDrawer(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden gap-2">
          <Filter className="h-4 w-4" /> ფილტრი
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>ფილტრი</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
