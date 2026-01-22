export const defaultLang = "pl";
export const supportedLangs = {
    pl: "pl",
    en: "en",
} as const;

// Define specific path mappings
const pathMappings: Record<string, string> = {
    "/uslugi": "/en/services",
    "/nasze-akcje": "/en/projects",
    "/kontakt": "/en/contact",
    "/kariera": "/en/careers",
    "/partnerzy": "/en/partners",
    "/regulamin": "/en/terms-of-service",
    "/polityka-prywatnosci": "/en/privacy-policy",
};

// Create a reverse mapping for efficient lookup
const reverseMappings = Object.entries(pathMappings).reduce(
    (acc, [pl, en]) => {
        acc[en] = pl;
        return acc;
    },
    {} as Record<string, string>
);

/**
 * Gets the alternate language link for a given path.
 * @param currentPath The current URL path (e.g., "/uslugi", "/en/services")
 * @param currentLang The current language ("pl" or "en")
 * @returns An object containing the alternate link and language code
 */
export function getAlternateLink(
    currentPath: string,
    currentLang: "pl" | "en"
): { lang: "pl" | "en"; path: string } {
    // Normalize path (ensure it doesn't have trailing slash unless it's root, but Astro.url.pathname usually handles this well enough for this logic, better to be safe)
    // Actually, let's stick to exact matches as seen in Header.astro first for safety.

    // Logic from Header.astro:
    /*
      if (currentPath.includes("/uslugi")) return "/en/services"
      ...
    */

    // We should handle the root and basic switching first
    let targetLang: "pl" | "en" = currentLang === "pl" ? "en" : "pl";
    let targetPath = targetLang === "en" ? "/en" : "/";

    // Normalize path: remove trailing slash for lookup, except for root
    const normalizedPath = currentPath === "/" ? "/" : currentPath.replace(/\/$/, "");

    // Check specific mappings
    if (currentLang === "pl") {
        // We are in PL, looking for EN equivalent
        if (normalizedPath in pathMappings) {
            targetPath = pathMappings[normalizedPath];
        } else if (currentPath === "/") {
            targetPath = "/en";
        }
    } else {
        // We are in EN, looking for PL equivalent
        // Check reverse mappings
        if (normalizedPath in reverseMappings) {
            targetPath = reverseMappings[normalizedPath];
        } else if (currentPath === "/en" || currentPath === "/en/") {
            targetPath = "/";
        }
    }

    return { lang: targetLang, path: targetPath };
}

/**
 * Helper to get all hreflang links for the current page
 */
export function getHreflangLinks(currentPath: string): { lang: string; href: string }[] {
    const isEnglish = currentPath.startsWith("/en");
    const currentLang = isEnglish ? "en" : "pl";
    const alt = getAlternateLink(currentPath, currentLang);

    // Construct absolute URLs (assuming base domain is handled in Layout or config)
    // Actually, hreflang should usually be full URLs.

    const links = [
        { lang: currentLang, href: currentPath }, // Self
        { lang: alt.lang, href: alt.path } // Alternate
    ];

    return links;
}
