import { Heart } from "lucide-react";

export interface EventType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const eventTypes: EventType[] = [
  { id: "pernikahan", label: "Pernikahan", icon: Heart },
];
