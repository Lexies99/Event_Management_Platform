/**
 * Dynamic Per-Organization / Per-Event Branding Engine
 * Ported from Multi-School Thesis Repository (FinPlanner UI/UX System)
 * Supports Light & Dark modes with live WCAG AA contrast evaluation.
 */

export const DEFAULT_BRANDING = {
  primaryColor: "#5A6552",
  secondaryColor: "#DCE7D0",
  accentColor: "#3B7A57",
  neutralColor: "#FAFBF8",
  defaultTheme: "light",
};

export const PRESET_PALETTES = [
  {
    id: "sage-executive",
    name: "Executive Sage (Default)",
    description: "Calm olive & sage green signature look",
    primaryColor: "#5A6552",
    secondaryColor: "#DCE7D0",
    accentColor: "#3B7A57",
    neutralColor: "#FAFBF8",
  },
  {
    id: "royal-navy",
    name: "Royal Summit Navy",
    description: "Deep corporate navy with soft sky tint",
    primaryColor: "#17365D",
    secondaryColor: "#D9E4F2",
    accentColor: "#0F6CBD",
    neutralColor: "#F8FAFC",
  },
  {
    id: "crimson-gala",
    name: "Heritage Crimson",
    description: "Prestigious burgundy with warm parchment tint",
    primaryColor: "#7A1C1C",
    secondaryColor: "#F5E2DE",
    accentColor: "#9A6B12",
    neutralColor: "#FBF9F7",
  },
  {
    id: "emerald-forest",
    name: "Pan-African Emerald",
    description: "Deep emerald green with fresh mint surface",
    primaryColor: "#14532D",
    secondaryColor: "#D1FAE5",
    accentColor: "#047857",
    neutralColor: "#F7FCF9",
  },
  {
    id: "indigo-tech",
    name: "Modern Tech Indigo",
    description: "Contemporary summit indigo & cool mist",
    primaryColor: "#312E81",
    secondaryColor: "#E0E7FF",
    accentColor: "#4338CA",
    neutralColor: "#F8F9FE",
  },
  {
    id: "teal-coastal",
    name: "Coastal Teal",
    description: "Crisp maritime teal with light aqua surface",
    primaryColor: "#115E59",
    secondaryColor: "#CCFBF1",
    accentColor: "#0D9488",
    neutralColor: "#F6FCFB",
  },
];

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function normalizeHex(raw, fallback = "#5A6552") {
  const trimmed = (raw || "").trim();
  if (!trimmed) return fallback;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_RE.test(withHash) ? withHash.toUpperCase() : fallback;
}

export function isValidHex(raw) {
  const trimmed = (raw || "").trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_RE.test(withHash);
}

function hexToRgb(hex) {
  const clean = normalizeHex(hex, "#5A6552").slice(1);
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function mixHex(hexA, hexB, ratioB) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const t = Math.max(0, Math.min(1, ratioB));
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function channelLum(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b);
}

export function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function getAccessibleTextColor(bgHex) {
  const whiteRatio = contrastRatio(bgHex, "#FFFFFF");
  const darkRatio = contrastRatio(bgHex, "#1A1D1A");
  return whiteRatio >= darkRatio ? "#FFFFFF" : "#1A1D1A";
}

export function evaluatePaletteContrast(palette) {
  const primary = normalizeHex(palette?.primaryColor, DEFAULT_BRANDING.primaryColor);
  const secondary = normalizeHex(palette?.secondaryColor, DEFAULT_BRANDING.secondaryColor);
  const accent = normalizeHex(palette?.accentColor, DEFAULT_BRANDING.accentColor);

  const primaryText = getAccessibleTextColor(primary);
  const secondaryText = getAccessibleTextColor(secondary);
  const accentText = getAccessibleTextColor(accent);

  const primaryRatio = contrastRatio(primary, primaryText);
  const secondaryRatio = contrastRatio(secondary, secondaryText);
  const accentRatio = contrastRatio(accent, accentText);

  const warnings = [];
  if (primaryRatio < 4.5) {
    warnings.push(`Primary (${primary}) contrast is ${primaryRatio}:1 — use a darker or lighter shade for WCAG AA (4.5:1).`);
  }
  if (secondaryRatio < 4.5) {
    warnings.push(`Secondary (${secondary}) contrast is ${secondaryRatio}:1 — adjust tint for readable text.`);
  }
  if (accentRatio < 4.5) {
    warnings.push(`Accent (${accent}) contrast is ${accentRatio}:1 — adjust tone for WCAG AA.`);
  }

  return {
    primaryText,
    primaryRatio,
    primaryPassesAA: primaryRatio >= 4.5,
    secondaryText,
    secondaryRatio,
    secondaryPassesAA: secondaryRatio >= 4.5,
    accentText,
    accentRatio,
    accentPassesAA: accentRatio >= 4.5,
    warnings,
    accessible: warnings.length === 0,
  };
}

/**
 * Dynamically injects a tenant's branding colours into :root CSS custom properties.
 * Pass null to restore default EventPlan FinPlanner Sage/Olive theme.
 */
export function applyTenantBrandingCss(palette, themeMode = "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", themeMode);

  const p = palette || DEFAULT_BRANDING;
  const primary = normalizeHex(p.primaryColor || p.brandColor, DEFAULT_BRANDING.primaryColor);
  const secondary = normalizeHex(p.secondaryColor, DEFAULT_BRANDING.secondaryColor);
  const accent = normalizeHex(p.accentColor, DEFAULT_BRANDING.accentColor);
  const neutral = normalizeHex(p.neutralColor, DEFAULT_BRANDING.neutralColor);

  if (themeMode === "dark") {
    const darkBg = mixHex("#111413", primary, 0.12);
    const darkHeader = mixHex("#171c19", primary, 0.24);
    const darkBorder = mixHex("#262d29", primary, 0.28);
    const darkSage = mixHex("#1f2824", primary, 0.34);
    const darkSageHover = mixHex("#293630", primary, 0.42);
    const darkPrimary = mixHex(primary, "#FFFFFF", 0.22);
    const darkPrimaryHover = mixHex(primary, "#FFFFFF", 0.32);
    const darkAccent = mixHex(accent, "#FFFFFF", 0.28);
    const darkHeaderText = getAccessibleTextColor(darkHeader);

    root.style.setProperty("--bg-header", darkHeader);
    root.style.setProperty("--border-header", darkBorder);
    root.style.setProperty("--header-text", darkHeaderText);
    root.style.setProperty("--fp-sage", darkSage);
    root.style.setProperty("--fp-sage-hover", darkSageHover);
    root.style.setProperty("--fp-sage-text", getAccessibleTextColor(darkSage));
    root.style.setProperty("--fp-olive", darkPrimary);
    root.style.setProperty("--fp-olive-dark", darkPrimaryHover);
    root.style.setProperty("--fp-olive-text", getAccessibleTextColor(darkPrimary));
    root.style.setProperty("--fp-green", darkAccent);
    root.style.setProperty("--bg-card", mixHex(darkBg, "#FFFFFF", 0.04));
  } else {
    const headerBg = secondary;
    const headerBorder = mixHex(secondary, "#000000", 0.1);
    const sageHover = mixHex(secondary, "#000000", 0.07);
    const primaryHover = mixHex(primary, "#000000", 0.16);
    const headerText = getAccessibleTextColor(headerBg);

    root.style.setProperty("--bg-header", headerBg);
    root.style.setProperty("--border-header", headerBorder);
    root.style.setProperty("--header-text", headerText);
    root.style.setProperty("--fp-sage", secondary);
    root.style.setProperty("--fp-sage-hover", sageHover);
    root.style.setProperty("--fp-sage-text", getAccessibleTextColor(secondary));
    root.style.setProperty("--fp-olive", primary);
    root.style.setProperty("--fp-olive-dark", primaryHover);
    root.style.setProperty("--fp-olive-text", getAccessibleTextColor(primary));
    root.style.setProperty("--fp-green", accent);
    root.style.setProperty("--bg-card", neutral);
  }
}
