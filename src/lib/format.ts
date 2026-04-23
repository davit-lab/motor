import { type Currency } from "@/types";
import { GEL_USD_RATE } from "@/lib/constants";

export function formatPrice(price: number, currency: Currency = "USD"): string {
  if (!price) return "შეთანხმებით";
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₾";
  return `${symbol}${Math.round(price).toLocaleString("en-US")}`;
}

export function convertPrice(price: number, from: Currency, to: Currency): number {
  if (from === to) return price;
  if (from === "USD" && to === "GEL") return price * GEL_USD_RATE;
  if (from === "GEL" && to === "USD") return price / GEL_USD_RATE;
  return price;
}

export function formatMileage(km: number): string {
  return `${(km || 0).toLocaleString("en-US")} კმ`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ახლახანს";
  if (m < 60) return `${m} წთ წინ`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} სთ წინ`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} დღის წინ`;
  const mo = Math.floor(d / 30);
  return `${mo} თვის წინ`;
}
