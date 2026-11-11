import {
    BaggageClaim,
    BookOpen,
    BriefcaseBusiness,
    CarFront,
    Dumbbell,
    Gift,
    HeartPulse,
    House,
    Mailbox,
    PawPrint,
    PiggyBank,
    ReceiptText,
    ShoppingCart,
    Tag,
    Ticket,
    ToolCase,
    Utensils,
    type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "briefcase-business": BriefcaseBusiness,
    "car-front": CarFront,
    "heart-pulse": HeartPulse,
    "piggy-bank": PiggyBank,
    "shopping-cart": ShoppingCart,
    ticket: Ticket,
    "tool-case": ToolCase,
    utensils: Utensils,
    "paw-print": PawPrint,
    house: House,
    gift: Gift,
    dumbbell: Dumbbell,
    "book-open": BookOpen,
    "baggage-claim": BaggageClaim,
    mailbox: Mailbox,
    "receipt-text": ReceiptText,
    tag: Tag,
};

export const CATEGORY_COLORS = [
    "green",
    "blue",
    "purple",
    "pink",
    "red",
    "orange",
    "yellow",
] as const;

export const COLOR_STYLES: Record<string, { box: string; swatch: string }> = {
    blue: { box: "bg-blue-light text-blue-dark", swatch: "bg-blue-base" },
    purple: { box: "bg-purple-light text-purple-dark", swatch: "bg-purple-base" },
    pink: { box: "bg-pink-light text-pink-dark", swatch: "bg-pink-base" },
    red: { box: "bg-red-light text-red-dark", swatch: "bg-red-base" },
    orange: { box: "bg-orange-light text-orange-dark", swatch: "bg-orange-base" },
    yellow: { box: "bg-yellow-light text-yellow-dark", swatch: "bg-yellow-base" },
    green: { box: "bg-green-light text-green-dark", swatch: "bg-green-base" },
    gray: { box: "bg-gray-200 text-gray-600", swatch: "bg-gray-400" },
};

export const getCategoryIcon = (name: string) => CATEGORY_ICONS[name] ?? Tag;
