export type Pkg = {
  name: string;
  hours: number;
  monthly: number | null;
  hourly: number;
  desc: Record<"fi" | "sv" | "es" | "en", string>;
};

export const kotiinPackages: Pkg[] = [
  {
    name: "CareMini",
    hours: 4,
    monthly: 210,
    hourly: 52.5,
    desc: { fi: "2 käyntiä / kk", sv: "2 besök / mån", es: "2 visitas / mes", en: "2 visits / month" },
  },
  {
    name: "CareMedium",
    hours: 8,
    monthly: 390,
    hourly: 48.75,
    desc: { fi: "4 käyntiä / kk", sv: "4 besök / mån", es: "4 visitas / mes", en: "4 visits / month" },
  },
  {
    name: "CareMaxi",
    hours: 16,
    monthly: 740,
    hourly: 46.25,
    desc: { fi: "8 käyntiä / kk", sv: "8 besök / mån", es: "8 visitas / mes", en: "8 visits / month" },
  },
  {
    name: "CarePremium",
    hours: 30,
    monthly: 1350,
    hourly: 45,
    desc: { fi: "Laaja hoito, 30 h / kk", sv: "Omfattande, 30 h / mån", es: "Amplio, 30 h / mes", en: "Extensive, 30 h / month" },
  },
];

export const kotiinHourly = {
  hourly: 58,
  desc: { fi: "Kertatilaus tai tuntityö kotiin", sv: "Engångsbeställning eller timarbete hemma", es: "Servicio puntual u horas en casa", en: "One-off or hourly work at home" },
};

export const yrityksillePackages: Pkg[] = [
  {
    name: "CareMini B2B",
    hours: 8,
    monthly: 340,
    hourly: 42.5,
    desc: { fi: "1 krt / vko", sv: "1 gång / vecka", es: "1 vez / semana", en: "1 time / week" },
  },
  {
    name: "CareMedium B2B",
    hours: 16,
    monthly: 640,
    hourly: 40,
    desc: { fi: "2 krt / vko", sv: "2 ggr / vecka", es: "2 veces / semana", en: "2 times / week" },
  },
  {
    name: "CareMaxi B2B",
    hours: 30,
    monthly: 1170,
    hourly: 39,
    desc: { fi: "Majoitus- ja kohdesiivous", sv: "Boende- och objektsstädning", es: "Alojamientos y objetos", en: "Accommodation & site cleaning" },
  },
  {
    name: "CarePremium B2B",
    hours: 60,
    monthly: 2280,
    hourly: 38,
    desc: { fi: "Päivittäinen siivous", sv: "Daglig städning", es: "Limpieza diaria", en: "Daily cleaning" },
  },
];

export const yrityksilleHourly = {
  hourly: 48,
  desc: { fi: "Kertatilaus tai lisäkeikat", sv: "Engångsbeställning eller extrapass", es: "Servicio puntual o extras", en: "One-off or extra shifts" },
};

export const palveluseteliHourly = {
  hourly: 40,
  desc: {
    fi: "Palvelusetelityö, tuntiveloitus",
    sv: "Arbete med servicesedel, timdebitering",
    es: "Trabajo con vale de servicio, por hora",
    en: "Service voucher work, hourly rate",
  },
};
