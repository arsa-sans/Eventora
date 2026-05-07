import dynamic from "next/dynamic";
import type { InvitationData } from "@/types/invitation";

export interface ThemeEntry {
  name: string;
  category: string;
  price: number;
  primaryColor: string;
  bgColor: string;
  component: React.ComponentType<{ data: InvitationData }>;
}

export const themeRegistry: Record<string, ThemeEntry> = {
  "emerald-garden": {
    name: "Emerald Garden",
    category: "pernikahan",
    price: 69000,
    primaryColor: "#059669",
    bgColor: "#F0FDF4",
    component: dynamic(() =>
      import("@/components/themes/EmeraldGarden").then((m) => m.EmeraldGarden)
    ),
  },
  "rose-blush": {
    name: "Rose Blush",
    category: "pernikahan",
    price: 69000,
    primaryColor: "#E11D48",
    bgColor: "#FFF1F2",
    component: dynamic(() =>
      import("@/components/themes/RoseBlush").then((m) => m.RoseBlush)
    ),
  },
  "midnight-noir": {
    name: "Midnight Noir",
    category: "pernikahan",
    price: 99000,
    primaryColor: "#D4AF37",
    bgColor: "#0A0A0A",
    component: dynamic(() =>
      import("@/components/themes/MidnightNoir").then((m) => m.MidnightNoir)
    ),
  },
  "minimalist-white": {
    name: "Minimalist White",
    category: "formal",
    price: 39000,
    primaryColor: "#1E293B",
    bgColor: "#FFFFFF",
    component: dynamic(() =>
      import("@/components/themes/MinimalistWhite").then((m) => m.MinimalistWhite)
    ),
  },
};

export function getTheme(themeId: string): ThemeEntry | null {
  return themeRegistry[themeId] ?? null;
}
