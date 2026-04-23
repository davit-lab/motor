import { ListingsView } from "@/components/listings/ListingsView";

export default function RentalsPage() {
  return (
    <ListingsView
      title="გაქირავება"
      subtitle="დაიქირავე მოტოციკლი ან სკუტერი დღით ან კვირით — ყველა ფასი ერთ ადგილას."
      type="rent"
      context="all"
    />
  );
}
