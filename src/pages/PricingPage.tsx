import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TIER_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const { toast } = useToast();
  const paidPlans = useMemo(() => TIER_PLANS.filter((plan) => plan.price > 0), []);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(paidPlans[0]?.id ?? "");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedPlan = TIER_PLANS.find((plan) => plan.id === selectedPlanId) ?? null;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const runPaymentSdk = async () => {
    // SDK integration point:
    // 1) create payment intent on backend
    // 2) tokenize card data via provider SDK
    // 3) confirm payment + store purchased plan
    await new Promise((resolve) => setTimeout(resolve, 900));
  };

  const submitPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || selectedPlan.price === 0) {
      toast({ title: "აირჩიე ფასიანი პაკეტი", description: "გადახდა ხელმისაწვდომია VIP და Super VIP პაკეტებისთვის." });
      return;
    }

    setProcessing(true);
    try {
      await runPaymentSdk();
      toast({
        title: "გადახდის ინიციაცია წარმატებულია",
        description: `${selectedPlan.name} პაკეტის გადახდის flow მზადაა. SDK-ის რეალურ ნაწილს შემდეგ დავამატებთ.`,
      });
    } catch {
      toast({ title: "გადახდა ვერ შესრულდა", description: "სცადე თავიდან.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-slide-up">
        <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent w-fit mx-auto">
          <Sparkles className="h-3 w-3 mr-1.5" />
          განცხადების პაკეტები
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
          აირჩიე პაკეტი, რომელიც <span className="text-accent">გყიდის სწრაფად</span>
        </h1>
        <p className="text-muted-foreground text-balance">
          Basic უფასოა და მუდამ ხელმისაწვდომი. VIP და Super VIP გაძლევს მაქსიმალურ დანახვას, ფავორიტ პოზიციას სიაში და დამატებით ბენეფიტებს.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TIER_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative p-8 flex flex-col transition-all hover:-translate-y-1 hover:shadow-elevated",
              plan.popular && "border-accent ring-2 ring-accent/20",
              plan.premium && "bg-gradient-hero text-primary-foreground border-transparent shadow-elevated"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                პოპულარული
              </Badge>
            )}
            {plan.premium && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                <Sparkles className="h-3 w-3 mr-1" /> პრემიუმი
              </Badge>
            )}

            <div className="space-y-1">
              <h3 className={cn("font-display text-2xl font-bold", plan.premium && "text-white")}>
                {plan.name}
              </h3>
              <p className={cn("text-sm", plan.premium ? "text-white/60" : "text-muted-foreground")}>
                {plan.tagline}
              </p>
            </div>

            <div className="my-6 flex items-baseline gap-1">
              <span className={cn("font-display text-5xl font-bold", plan.premium ? "text-accent" : "text-foreground")}>
                {plan.price === 0 ? "უფასო" : `${plan.price}₾`}
              </span>
              {plan.price > 0 && (
                <span className={cn("text-sm", plan.premium ? "text-white/60" : "text-muted-foreground")}>
                  / {plan.duration}
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <div
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full shrink-0 mt-0.5",
                      plan.premium ? "bg-accent text-accent-foreground" : "bg-accent/15 text-accent"
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                  <span className={plan.premium ? "text-white/90" : "text-foreground"}>{f}</span>
                </li>
              ))}
            </ul>

            {plan.price === 0 ? (
              <Button
                asChild
                size="lg"
                className={cn(
                  "w-full",
                  plan.premium
                    ? "bg-accent text-accent-foreground hover:bg-accent-strong"
                    : plan.popular
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Link to="/sell">აირჩიე {plan.name}</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  document.getElementById("payment-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "w-full",
                  plan.premium
                    ? "bg-accent text-accent-foreground hover:bg-accent-strong"
                    : plan.popular
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                იყიდე {plan.name}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <section id="payment-checkout" className="max-w-3xl mx-auto mt-16">
        <Card className="p-6 md:p-8 space-y-6 border-accent/30">
          <div className="space-y-2">
            <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent">
              ბარათით გადახდა
            </Badge>
            <h2 className="font-display text-2xl font-bold tracking-tight">პაკეტის ყიდვა</h2>
            <p className="text-sm text-muted-foreground">
              ეს არის checkout-ის სამუშაო ვერსია. SDK-ის რეალურ ინტეგრაციას (Stripe/TBC/BOG და ა.შ.) შემდეგ ეტაპზე დაამატებ.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitPayment}>
            <div className="space-y-1.5">
              <Label>პაკეტი</Label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {paidPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price}₾ / {plan.duration}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>ბარათის მფლობელი</Label>
              <Input
                required
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                placeholder="მაგ: NIKO BERIDZE"
              />
            </div>

            <div className="space-y-1.5">
              <Label>ბარათის ნომერი</Label>
              <Input
                required
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>ვადა (MM/YY)</Label>
                <Input
                  required
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="12/29"
                />
              </div>
              <div className="space-y-1.5">
                <Label>CVV</Label>
                <Input
                  required
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={processing || !selectedPlan}>
              {processing ? "მუშავდება..." : `გადახდა${selectedPlan ? ` - ${selectedPlan.price}₾` : ""}`}
            </Button>
          </form>
        </Card>
      </section>

      <div className="max-w-3xl mx-auto mt-20 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">ხშირი კითხვები</h2>
        <p className="text-muted-foreground text-sm">
          ყველა პაკეტის ხანგრძლივობა — 30 დღე. გადახდა ხდება უსაფრთხო არხებით. პაკეტის შეცვლა შესაძლებელია ნებისმიერ დროს განცხადების რედაქტირებისას.
        </p>
      </div>
    </div>
  );
}
