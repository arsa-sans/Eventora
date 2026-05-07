export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  isNew?: boolean;
  isHot?: boolean;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  tags: string[];
}

export const templates: TemplateItem[] = [
  {
    id: "emerald-garden",
    name: "Emerald Garden",
    category: "pernikahan",
    categoryLabel: "Pernikahan",
    price: 49000,
    isHot: true,
    primaryColor: "#059669",
    bgColor: "#F0FDF4",
    textColor: "#1E293B",
    accentColor: "#A7F3D0",
    tags: ["pernikahan", "formal"],
  },
  {
    id: "rose-blush",
    name: "Rose Blush",
    category: "pernikahan",
    categoryLabel: "Pernikahan",
    price: 49000,
    isHot: true,
    primaryColor: "#E11D48",
    bgColor: "#FFF1F2",
    textColor: "#1E293B",
    accentColor: "#FECDD3",
    tags: ["pernikahan"],
  },
  {
    id: "midnight-noir",
    name: "Midnight Noir",
    category: "pernikahan",
    categoryLabel: "Pernikahan",
    price: 39000,
    primaryColor: "#D4AF37",
    bgColor: "#0A0A0A",
    textColor: "#F5F5F5",
    accentColor: "#1E1E1E",
    tags: ["pernikahan", "formal", "mewah"],
  },
  {
    id: "minimalist-white",
    name: "Minimalist White",
    category: "pernikahan",
    categoryLabel: "Pernikahan",
    price: 39000,
    primaryColor: "#1E293B",
    bgColor: "#FFFFFF",
    textColor: "#1E293B",
    accentColor: "#94A3B8",
    tags: ["pernikahan", "formal"],
  },
];

export const templateCategories = [
  { id: "all",        label: "Semua Tema" },
  { id: "pernikahan", label: "Pernikahan" },
];
