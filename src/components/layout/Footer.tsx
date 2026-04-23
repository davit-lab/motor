import { Link } from "react-router-dom";
import { Github, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t bg-surface/40 mt-24">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <img src={logo} alt="MotoMarket" className="h-8 w-auto" />
            <p className="text-sm text-muted-foreground max-w-xs">
              საქართველოს უდიდესი მოტოციკლების და სკუტერების პლატფორმა. ყიდვა,
              გაქირავება, სერვისი — ერთ ადგილას.
            </p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border hover:border-accent hover:text-accent transition-colors"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="პლატფორმა" links={[
            { to: "/motorcycles", label: "მოტოციკლები" },
            { to: "/scooters", label: "სკუტერები" },
            { to: "/rentals", label: "გაქირავება" },
            { to: "/services", label: "სერვისები" },
          ]} />

          <FooterCol title="კომპანია" links={[
            { to: "/blog", label: "ბლოგი" },
            { to: "/pricing", label: "პაკეტები" },
            { to: "/about", label: "ჩვენ შესახებ" },
            { to: "/contact", label: "კონტაქტი" },
          ]} />

          <FooterCol title="დახმარება" links={[
            { to: "/help", label: "ხშირი კითხვები" },
            { to: "/terms", label: "წესები" },
            { to: "/privacy", label: "კონფიდენციალურობა" },
          ]} />
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MotoMarket Pro. ყველა უფლება დაცულია.</p>
          <p>დამზადებულია codezero academy მიერ</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-accent transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
