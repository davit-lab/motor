import { ListingsView } from "@/components/listings/ListingsView";

export default function ScootersPage() {
  return (
    <ListingsView
      title="სკუტერები"
      subtitle="ქალაქისთვის იდეალური სკუტერები — Vespa, Yamaha, Honda და სხვა."
      type="sale"
      context="scooter"
    />
  );
}
