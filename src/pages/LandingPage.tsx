import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  Check,
  ChevronRight,
  Search,
  Shield,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListings, useServiceListings } from "@/hooks/useListings";
import { ListingCard } from "@/components/listings/ListingCard";

export default function LandingPage() {
  const { listings } = useListings();
  const { services } = useServiceListings();
  const featured = listings.filter((l) => l.tier !== "basic").slice(0, 3);

  const stats = [
    { value: listings.length, label: "აქტიური განცხადება" },
    { value: services.length, label: "სერვის-ცენტრი" },
    { value: "30+", label: "ბრენდი" },
    { value: "24/7", label: "მხარდაჭერა" },
  ];

  const categories = [
    { to: "/motorcycles", title: "მოტოციკლები", desc: "სპორტი, ნეიკედი, კრუიზერი", count: listings.filter(l => l.category !== "scooter" && l.listing_type === "sale").length },
    { to: "/scooters", title: "სკუტერები", desc: "ქალაქისთვის იდეალური", count: listings.filter(l => l.category === "scooter").length },
    { to: "/rentals", title: "გაქირავება", desc: "დღით ან კვირით", count: listings.filter(l => l.listing_type === "rent").length },
    { to: "/services", title: "სერვისი", desc: "ხელოსნები და დეტეილინგი", count: services.length },
  ];

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-accent-soft/50 via-background to-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative pt-16 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-background/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                საქართველოს მოტო პლატფორმა
              </div>

              <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.94] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                MotoMarket-ზე
                <br />
                შენი შემდეგი <span className="text-accent">ორი ბორბალი</span>
                <br />
                უკვე გელოდება.
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                გაყიდვები, გაქირავება და სერვისი ერთ სივრცეში. სუფთა ინტერფეისი, რეალური განცხადებები და კომუნიკაცია პირდაპირ გამყიდველთან.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg" className="h-12 gap-2 px-6 text-base">
                  <Link to="/motorcycles">
                    <Search className="h-4 w-4" />
                    განცხადებების ნახვა
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6 text-base bg-background/80">
                  <Link to="/sell">
                    განცხადების დამატება
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden border-accent/20 bg-card/90 p-6 shadow-soft backdrop-blur-sm sm:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    პლატფორმის სტატისტიკა
                  </p>
                  <img src="/favicon.png" alt="MotoMarket" className="h-8 w-8 rounded-md object-cover" />
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border/80 bg-background/80 p-4">
                      <dd className="text-3xl font-display font-bold tracking-tight">{s.value}</dd>
                      <dt className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                    </div>
                  ))}
                </dl>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  მონაცემები განახლდება განცხადებების მატებასთან ერთად, რომ ბაზრის რეალური სურათი ყოველთვის თვალწინ გქონდეს.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mt-16 sm:mt-20">
        <SectionHeader eyebrow="კატეგორიები" title="აირჩიე მიმართულება და დაიწყე" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
            >
              <div className="mb-7 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  {c.to === "/services" ? <Wrench className="h-5 w-5" /> : <Bike className="h-5 w-5" />}
                </div>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  {c.count}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <div className="mt-7 inline-flex items-center gap-1 text-sm font-medium text-accent">
                გახსნა
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container mt-20 sm:mt-24">
          <SectionHeader
            eyebrow="გამორჩეული განცხადებები"
            title="VIP და Super VIP არჩევანი"
            subtitle="მაღალი ხარისხის შეთავაზებები, რომლებიც ყველაზე ხშირად ინტერესდებიან მომხმარებლები."
            cta={{ to: "/motorcycles", label: "ყველა განცხადება" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <section className="container mt-20 sm:mt-24">
        <div className="rounded-3xl border border-border bg-gradient-surface p-8 sm:p-10 md:p-12">
          <SectionHeader eyebrow="რატომ მოტომარკეტი" title="ყველაფერი, რაც რეალურ გარიგებას სჭირდება" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title="უსაფრთხო კომუნიკაცია"
              desc="კონტაქტი გადის პლატფორმიდან, ისტორია ინახება და ყველა მნიშვნელოვანი დეტალი ხელმისაწვდომია ნებისმიერ დროს."
            />
            <FeatureCard
              icon={Zap}
              title="სწრაფი აღმოჩენა"
              desc="ფილტრებით და ჭკვიანი კატეგორიებით მომხმარებელი რამდენიმე წამში პოულობს მისთვის სწორ მოდელს."
            />
            <FeatureCard
              icon={Wrench}
              title="სერვისის ეკოსისტემა"
              desc="მომსახურების კატალოგი დაგეხმარება შეკეთებიდან დეტეილინგამდე სწორი სპეციალისტის შერჩევაში."
            />
          </div>
        </div>
      </section>

      <section className="container mt-20 sm:mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-primary p-9 text-primary-foreground sm:p-12 md:p-14">
          <div className="pointer-events-none absolute -right-14 -top-16 h-64 w-64 rounded-full bg-accent/35 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
                გახდი გამყიდველი
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
                გამოაქვეყნე მოტოციკლი,
                <br />
                მიაღწიე სწორ აუდიტორიამდე.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                განცხადების შექმნას რამდენიმე წუთი სჭირდება. შეგიძლია დაიწყო უფასოდ, შემდეგ კი გადახვიდე VIP ან Super VIP ფორმატზე.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="h-11">
                  <Link to="/sell">დაწყება ახლავე</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/pricing">
                    ფასების ნახვა
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <ul className="space-y-3 text-sm">
              {[
                "Basic პაკეტი — უფასო გამოქვეყნება და 30 დღიანი ვადა",
                "VIP პოზიციონირება შედეგებში და მთავარ გვერდზე",
                "Super VIP მაქსიმალური ხილვადობით და პრიორიტეტული მხარდაჭერით",
                "მონაცემთა ანალიტიკა: ნახვები, დაკლიკვები და დაინტერესებული მომხმარებლები",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3.5"
                >
                  <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-primary-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  cta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        {subtitle && <p className="text-muted-foreground max-w-xl">{subtitle}</p>}
      </div>
      {cta && (
        <Button asChild variant="ghost" className="gap-1 text-accent hover:text-accent">
          <Link to={cta.to}>{cta.label} <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      )}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <Card className="p-7 transition-all hover:border-accent/40 hover:shadow-sm">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}
