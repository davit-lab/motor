import { cn } from "@/lib/utils";
import type { ListingTier } from "@/types";
import { Crown, Sparkles, Tag } from "lucide-react";

const CONFIG: Record<ListingTier, { label: string; icon: any; cls: string }> = {
  basic: {
    label: "Basic",
    icon: Tag,
    cls: "bg-tier-basic text-tier-basic-foreground",
  },
  vip: {
    label: "VIP",
    icon: Crown,
    cls: "bg-tier-vip text-tier-vip-foreground",
  },
  super_vip: {
    label: "Super VIP",
    icon: Sparkles,
    cls: "bg-tier-supervip text-tier-supervip-foreground shadow-glow",
  },
};

export function TierBadge({
  tier,
  size = "sm",
}: {
  tier: ListingTier;
  size?: "sm" | "md";
}) {
  const c = CONFIG[tier];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide",
        c.cls,
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {c.label}
    </span>
  );
}
