import {
  Building2,
  CalendarCheck,
  Footprints,
  House,
  Leaf,
  PackageCheck,
  PanelsTopLeft,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ServiceIconKey } from "./model";

const icons: Record<ServiceIconKey, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  house: House,
  panels: PanelsTopLeft,
  sparkles: Sparkles,
  leaf: Leaf,
  footprints: Footprints,
  package: PackageCheck,
  building: Building2,
  snowflake: Snowflake,
  refresh: RefreshCw,
  contact: UserRoundCheck,
  shield: ShieldCheck,
  calendar: CalendarCheck,
  truck: Truck,
};

export const serviceIconOptions: Array<{ value: ServiceIconKey; label: string }> = [
  { value: "house", label: "Talo" },
  { value: "panels", label: "Pinnat" },
  { value: "sparkles", label: "Kipinät" },
  { value: "leaf", label: "Lehti" },
  { value: "footprints", label: "Askeleet" },
  { value: "package", label: "Paketti" },
  { value: "building", label: "Rakennus" },
  { value: "snowflake", label: "Lumi" },
  { value: "refresh", label: "Jatkuvuus" },
  { value: "contact", label: "Yhteyshenkilö" },
  { value: "shield", label: "Laatutakuu" },
  { value: "calendar", label: "Kalenteri" },
  { value: "truck", label: "Nouto" },
];

export function serviceIconFor(key: ServiceIconKey) {
  return icons[key] ?? Sparkles;
}
