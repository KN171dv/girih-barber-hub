import { useSiteSettings } from "@/lib/site-content";
import { cn } from "@/lib/utils";

/**
 * Logo da marca. Usa a imagem PNG cadastrada no painel (brand.logo_url) quando
 * existir, preservando proporção; caso contrário exibe o lettering tipográfico.
 */
export function BrandLogo({
  className,
  imgClassName,
  textClassName,
}: {
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}) {
  const { data: settings } = useSiteSettings();
  const logo = settings?.brand.logo_url;
  const name = settings?.brand.name || "Gireh Barber Shop";

  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={cn("h-auto w-auto max-w-full object-contain", imgClassName, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "min-w-0 truncate font-display leading-none tracking-[0.14em]",
        textClassName,
        className,
      )}
    >
      Gīreh <span className="text-primary">Barber</span>
    </span>
  );
}
