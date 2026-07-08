import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

/**
 * HeroCollage — the home hero's 5-image bento (Raycast/Resend density, people-first).
 *
 * Desktop (lg): a 3×2 bento — the team photo is the 2×2 human anchor, infra shots
 * are supporting texture. Mobile: lead tile full-width, the other four in a 2×2.
 * Never a horizontal scroller. Each tile links to the service/sector it depicts
 * (real, named link) and carries a JetBrains-mono micro-label so the pictures
 * "speak to the solutions". Cohesion on the dark canvas comes from a shared
 * scrim + desaturation, so five different photos read as one family.
 *
 * Images live in /public/images/hero (downloaded locally — see the run script).
 */
type Tile = {
  key: string;
  src: string;
  /** Decorative alt: the anchor carries the accessible name via aria-label. */
  alt: string;
  label: string;
  aria: string;
  href: string;
  area: string;
  mobileAspect: string;
  sizes: string;
  priority?: boolean;
};

const TILES: Tile[] = [
  {
    key: "team",
    src: "/images/hero/hero-team-lagos.jpg",
    alt: "",
    label: "Managed IT",
    aria: "Managed IT services",
    href: "/services/managed-services",
    area: "col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1",
    mobileAspect: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
    priority: true,
  },
  {
    key: "cabling",
    src: "/images/hero/hero-cabling.jpg",
    alt: "",
    label: "Infrastructure",
    aria: "IT infrastructure and networking",
    href: "/services/infrastructure-solutions",
    area: "lg:col-start-3 lg:row-start-1",
    mobileAspect: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 19vw, 50vw",
  },
  {
    key: "engineer",
    src: "/images/hero/hero-engineer.jpg",
    alt: "",
    label: "Deployment",
    aria: "IT deployment and implementation",
    href: "/services/deployment-implementation",
    area: "lg:col-start-3 lg:row-start-2",
    mobileAspect: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 19vw, 50vw",
  },
  {
    key: "datacenter",
    src: "/images/hero/hero-datacenter.jpg",
    alt: "",
    label: "Data centre",
    aria: "Hardware supply and data-centre equipment",
    href: "/services/hardware-supply",
    area: "lg:col-start-1 lg:row-start-3",
    mobileAspect: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 19vw, 50vw",
  },
  {
    key: "enterprise",
    src: "/images/hero/hero-enterprise-user.jpg",
    alt: "",
    label: "Enterprise",
    aria: "Enterprise IT solutions",
    href: "/industries/enterprise",
    area: "lg:col-span-2 lg:col-start-2 lg:row-start-3",
    mobileAspect: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
];

export function HeroCollage() {
  return (
    <Stagger className="grid grid-cols-2 gap-3 lg:aspect-[7/6] lg:grid-cols-3 lg:grid-rows-3">
      {TILES.map((t, i) => (
        <StaggerItem key={t.key} delay={i * 70} className={cn("min-w-0", t.area)}>
          <a
            href={t.href}
            aria-label={t.aria}
            className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
          >
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-xl border border-hairline bg-surface",
                "transition-colors duration-[250ms] ease-[var(--ease-out)] group-hover:border-hairline-hover",
                t.mobileAspect,
                "lg:aspect-auto lg:h-full",
              )}
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                priority={t.priority}
                sizes={t.sizes}
                className="object-cover saturate-[0.85] brightness-[0.9] transition-transform duration-[250ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
              />
              {/* shared scrim — seats every photo into the near-black canvas */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-background/10 to-transparent"
                aria-hidden="true"
              />
              {/* mono micro-label — "speaks to the solution" */}
              <span
                aria-hidden="true"
                className="absolute bottom-2.5 left-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50 transition-colors duration-[250ms] group-hover:text-white/80"
              >
                {t.label}
              </span>
            </div>
          </a>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default HeroCollage;
