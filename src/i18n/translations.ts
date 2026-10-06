export type Lang = "fi" | "sv" | "es" | "en";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "fi", label: "Suomi", short: "FI" },
  { code: "sv", label: "Svenska", short: "SV" },
  { code: "es", label: "Español", short: "ES" },
  { code: "en", label: "English", short: "EN" },
];

type Dict = {
  nav: {
    home: string;
    kotiin: string;
    yrityksille: string;
    palveluseteli: string;
    hinnoittelu: string;
  };
  hero: { eyebrow: string; title: string; lead: string; cta: string; secondary: string };
  about: { eyebrow: string; title: string; body: string; points: string[] };
  actions: {
    eyebrow: string;
    title: string;
    book: { title: string; body: string; cta: string };
    quote: { title: string; body: string; cta: string };
    buy: { title: string; body: string; cta: string };
  };
  services: {
    eyebrow: string;
    title: string;
    kotiin: { title: string; body: string; items: string[] };
    yrityksille: { title: string; body: string; items: string[] };
    palveluseteli: { title: string; body: string; items: string[] };
    more: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    monthly: string;
    hourly: string;
    perMonth: string;
    perHour: string;
    hoursPerMonth: string;
    single: string;
    vat: string;
    cta: string;
    note: string;
  };
  form: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    thanks: string;
    preferredTime: string;
    service: string;
  };
  book: { title: string; lead: string };
  quote: { title: string; lead: string };
  buy: { title: string; lead: string; from: string; select: string };
  splash: { kotiin: string; yrityksille: string };
  footer: { tagline: string; contact: string; rights: string };
};

export const t: Record<Lang, Dict> = {
  fi: {
    nav: {
      home: "Etusivu",
      kotiin: "Care KOTIIN",
      yrityksille: "Care Yrityksille",
      palveluseteli: "Care Palveluseteli",
      hinnoittelu: "Hinnoittelu",
    },
    hero: {
      eyebrow: "Kumppanuutta, johon voi luottaa",
      title: "Laadukasta kodin ja toimistonhoitoa – ja pidämme huolta sinusta",
      lead: "T & G Services hoitaa kotisi ja toimistosi huolella, jotta sinulle jää aikaa olennaiseen. Kumppanuudessamme sinusta pidetään huolta.",
      cta: "Aloita yhteistyö",
      secondary: "Tutustu palveluihin",
    },
    about: {
      eyebrow: "Meistä lyhyesti",
      title: "Siisti koti, toimiva toimisto, huolehdittu arki",
      body: "Olemme suomalainen kodin- ja toimistonhoidon yritys. Teemme siivouksen ja arjen tukipalvelut ammattitaidolla ja samalla tarkkuudella niin kotona kuin työpaikalla – luotettavasti, sovitusti ja läpinäkyvällä hinnalla.",
      points: [
        "Koulutettu ja luotettava henkilöstö",
        "Kodin ja toimiston siivous samalta kumppanilta",
        "Läpinäkyvä hinnoittelu, ei yllätyksiä",
      ],
    },
    actions: {
      eyebrow: "Näin pääset alkuun",
      title: "Valitse sinulle sopivin tapa",
      book: { title: "Varaa videopalaveri", body: "Keskustellaan tarpeistasi rauhassa ja suunnitellaan yhteistyö.", cta: "Varaa aika" },
      quote: { title: "Jätä tarjouspyyntö", body: "Kerro tilanteestasi, laadimme selkeän tarjouksen nopeasti.", cta: "Pyydä tarjous" },
      buy: { title: "Osta palvelu", body: "Valitse valmis palvelupaketti ja aloita heti.", cta: "Katso paketit" },
    },
    services: {
      eyebrow: "Palvelumme",
      title: "Kolme tapaa saada TGS-laatua",
      kotiin: {
        title: "Care KOTIIN",
        body: "Kodinhoitoa ja siivousta – juuri niin usein kuin tarvitset.",
        items: ["Ylläpitosiivous ja perussiivous", "Ikkunat, kodinkoneet ja tekstiilit", "Muutto- ja suursiivoukset", "Arjen asiointiapu"],
      },
      yrityksille: {
        title: "Care Yrityksille",
        body: "Toimiston ja liiketilojen siisteys sovitulla rytmillä.",
        items: ["Toimistosiivous 1–5 krt/vko", "Majoitus- ja kohdesiivoukset", "Taukotilat ja saniteettitilat", "Räätälöidyt sopimukset"],
      },
      palveluseteli: {
        title: "Care Palveluseteli",
        body: "Kotipalvelun tukipalvelut palvelusetelillä – helposti ja selkeästi.",
        items: ["Palvelusetelin käyttö", "Neuvonta ja hakemusapu", "Kunnan kanssa yhteistyössä", "Ei piilokuluja"],
      },
      more: "Lue lisää",
    },
    pricing: {
      eyebrow: "Hinnoittelu",
      title: "Läpinäkyvä hinnoittelu",
      lead: "Meillä hinnoittelu on läpinäkyvää: voit valita joko kuukausipaketin tai tuntiveloituksen. Näet kaikki hinnat suoraan alta – ilman piilokuluja tai yllätyksiä.",
      monthly: "Kuukausipaketit",
      hourly: "Tuntiveloitus",
      perMonth: "€ / kk",
      perHour: "€ / h",
      hoursPerMonth: "h / kk",
      single: "Kertatilaus",
      vat: "Hinnat ALV 0 %.",
      cta: "Pyydä tarjous",
      note: "Kotitalousvähennys huomioidaan yksityisasiakkaiden laskuilla.",
    },
    form: {
      name: "Nimi",
      email: "Sähköposti",
      phone: "Puhelin",
      message: "Viesti",
      submit: "Lähetä",
      thanks: "Kiitos! Olemme sinuun yhteydessä pian.",
      preferredTime: "Toivottu ajankohta",
      service: "Palvelu",
    },
    book: { title: "Varaa videopalaveri", lead: "Sovitaan 30 minuutin etätapaaminen, jossa käymme läpi tarpeesi ja yhteistyön aloituksen." },
    quote: { title: "Jätä tarjouspyyntö", lead: "Kerro lyhyesti tilanteestasi – saat henkilökohtaisen tarjouksen kahden arkipäivän kuluessa." },
    buy: { title: "Osta palvelu", lead: "Selkeät palvelupaketit, joilla pääset alkuun heti.", from: "alkaen", select: "Valitse" },
    splash: { kotiin: "TGS Kotiin", yrityksille: "TGS Yrityksille" },
    footer: { tagline: "Laadukasta kodin ja toimistonhoitoa.", contact: "Yhteystiedot", rights: "Kaikki oikeudet pidätetään." },
  },
  sv: {
    nav: {
      home: "Hem",
      kotiin: "Care HEM",
      yrityksille: "Care för Företag",
      palveluseteli: "Care Servicesedel",
      hinnoittelu: "Priser",
    },
    hero: {
      eyebrow: "Ett partnerskap du kan lita på",
      title: "Högklassig hem- och kontorsstädning – och vi tar hand om dig",
      lead: "T & G Services sköter ditt hem och ditt kontor med omsorg så att du får tid till det viktiga. I vårt partnerskap tas du om hand.",
      cta: "Inled samarbete",
      secondary: "Se våra tjänster",
    },
    about: {
      eyebrow: "Om oss",
      title: "Rent hem, fungerande kontor, omhändertagen vardag",
      body: "Vi är ett finländskt företag inom hem- och kontorsstädning. Vi utför städning och stödtjänster med yrkeskunskap och samma noggrannhet hemma som på arbetsplatsen – pålitligt och med transparenta priser.",
      points: [
        "Utbildad och pålitlig personal",
        "Hem och kontor av samma partner",
        "Transparent prissättning utan överraskningar",
      ],
    },
    actions: {
      eyebrow: "Så kommer du igång",
      title: "Välj det sätt som passar dig",
      book: { title: "Boka videomöte", body: "Vi går igenom dina behov i lugn och ro och planerar samarbetet.", cta: "Boka tid" },
      quote: { title: "Begär offert", body: "Berätta om din situation, vi ger dig en tydlig offert snabbt.", cta: "Begär offert" },
      buy: { title: "Köp tjänst", body: "Välj ett färdigt servicepaket och kom igång direkt.", cta: "Se paket" },
    },
    services: {
      eyebrow: "Våra tjänster",
      title: "Tre sätt att få TGS-kvalitet",
      kotiin: {
        title: "Care HEM",
        body: "Hemstädning och hemservice – så ofta du behöver.",
        items: ["Underhålls- och grundstädning", "Fönster, vitvaror och textilier", "Flytt- och storstädning", "Hjälp med vardagsärenden"],
      },
      yrityksille: {
        title: "Care för Företag",
        body: "Rena kontor och affärslokaler i avtalad rytm.",
        items: ["Kontorsstädning 1–5 ggr/vecka", "Boende- och objektsstädning", "Pausrum och sanitetsutrymmen", "Skräddarsydda avtal"],
      },
      palveluseteli: {
        title: "Care Servicesedel",
        body: "Stödtjänster inom hemservice med servicesedel – enkelt och tydligt.",
        items: ["Användning av servicesedel", "Rådgivning och ansökningshjälp", "Samarbete med kommunen", "Inga dolda kostnader"],
      },
      more: "Läs mer",
    },
    pricing: {
      eyebrow: "Priser",
      title: "Transparent prissättning",
      lead: "Hos oss är prissättningen transparent: du kan välja antingen ett månadspaket eller timdebitering. Alla priser ser du direkt nedan – utan dolda kostnader.",
      monthly: "Månadspaket",
      hourly: "Timdebitering",
      perMonth: "€ / mån",
      perHour: "€ / h",
      hoursPerMonth: "h / mån",
      single: "Engångsbeställning",
      vat: "Priser moms 0 %.",
      cta: "Begär offert",
      note: "Hushållsavdraget beaktas på privatkunders fakturor.",
    },
    form: {
      name: "Namn",
      email: "E-post",
      phone: "Telefon",
      message: "Meddelande",
      submit: "Skicka",
      thanks: "Tack! Vi kontaktar dig snart.",
      preferredTime: "Önskad tidpunkt",
      service: "Tjänst",
    },
    book: { title: "Boka videomöte", lead: "Vi bokar ett 30 minuters distansmöte där vi går igenom dina behov och hur vi startar samarbetet." },
    quote: { title: "Begär offert", lead: "Berätta kort om din situation – du får en personlig offert inom två vardagar." },
    buy: { title: "Köp tjänst", lead: "Tydliga servicepaket som gör att du kommer igång direkt.", from: "från", select: "Välj" },
    splash: { kotiin: "TGS Hem", yrityksille: "TGS för Företag" },
    footer: { tagline: "Högklassig hem- och kontorsstädning.", contact: "Kontakt", rights: "Alla rättigheter förbehållna." },
  },
  es: {
    nav: {
      home: "Inicio",
      kotiin: "Care EN CASA",
      yrityksille: "Care para Empresas",
      palveluseteli: "Care Vale de Servicio",
      hinnoittelu: "Precios",
    },
    hero: {
      eyebrow: "Una colaboración de confianza",
      title: "Limpieza de alta calidad para tu hogar y tu oficina – y cuidamos de ti",
      lead: "T & G Services cuida tu hogar y tu oficina con esmero para que tengas tiempo para lo importante. En nuestra colaboración, cuidamos de ti.",
      cta: "Comenzar la colaboración",
      secondary: "Ver servicios",
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "Hogar limpio, oficina que funciona, día a día resuelto",
      body: "Somos una empresa finlandesa de limpieza del hogar y de oficinas. Realizamos la limpieza y los servicios de apoyo con profesionalidad y el mismo rigor en casa y en el trabajo, con precios transparentes.",
      points: [
        "Personal cualificado y de confianza",
        "Hogar y oficina con un mismo socio",
        "Precios transparentes, sin sorpresas",
      ],
    },
    actions: {
      eyebrow: "Cómo empezar",
      title: "Elige la opción que mejor te convenga",
      book: { title: "Reservar videollamada", body: "Hablamos con calma de tus necesidades y planificamos la colaboración.", cta: "Reservar cita" },
      quote: { title: "Solicitar presupuesto", body: "Cuéntanos tu situación y te enviaremos una oferta clara rápidamente.", cta: "Pedir presupuesto" },
      buy: { title: "Comprar servicio", body: "Elige un paquete listo y empieza hoy mismo.", cta: "Ver paquetes" },
    },
    services: {
      eyebrow: "Nuestros servicios",
      title: "Tres formas de recibir la calidad TGS",
      kotiin: {
        title: "Care EN CASA",
        body: "Limpieza y cuidado del hogar, con la frecuencia que necesites.",
        items: ["Limpieza de mantenimiento y a fondo", "Ventanas, electrodomésticos y textiles", "Limpiezas de mudanza y generales", "Ayuda con gestiones diarias"],
      },
      yrityksille: {
        title: "Care para Empresas",
        body: "Oficinas y locales impecables con la frecuencia acordada.",
        items: ["Limpieza de oficinas 1–5 veces/semana", "Limpieza de alojamientos y objetos", "Zonas de descanso y aseos", "Contratos a medida"],
      },
      palveluseteli: {
        title: "Care Vale de Servicio",
        body: "Servicios de apoyo domiciliario con el vale de servicio, de forma sencilla.",
        items: ["Uso del vale de servicio", "Asesoramiento y ayuda con la solicitud", "Colaboración con el municipio", "Sin costes ocultos"],
      },
      more: "Saber más",
    },
    pricing: {
      eyebrow: "Precios",
      title: "Precios transparentes",
      lead: "Nuestra tarificación es transparente: puedes elegir un paquete mensual o el pago por horas. Todos los precios están abajo, sin costes ocultos ni sorpresas.",
      monthly: "Paquetes mensuales",
      hourly: "Precio por hora",
      perMonth: "€ / mes",
      perHour: "€ / h",
      hoursPerMonth: "h / mes",
      single: "Servicio puntual",
      vat: "Precios sin IVA (0 %).",
      cta: "Pedir presupuesto",
      note: "La deducción fiscal del hogar se aplica en las facturas de particulares.",
    },
    form: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      message: "Mensaje",
      submit: "Enviar",
      thanks: "¡Gracias! Te contactaremos pronto.",
      preferredTime: "Horario preferido",
      service: "Servicio",
    },
    book: { title: "Reservar videollamada", lead: "Reservamos una reunión de 30 minutos para revisar tus necesidades e iniciar la colaboración." },
    quote: { title: "Solicitar presupuesto", lead: "Cuéntanos brevemente tu situación: recibirás una oferta personal en dos días laborables." },
    buy: { title: "Comprar servicio", lead: "Paquetes claros para empezar de inmediato.", from: "desde", select: "Elegir" },
    splash: { kotiin: "TGS Hogar", yrityksille: "TGS para Empresas" },
    footer: { tagline: "Limpieza de alta calidad para hogar y oficina.", contact: "Contacto", rights: "Todos los derechos reservados." },
  },
  en: {
    nav: {
      home: "Home",
      kotiin: "Care AT HOME",
      yrityksille: "Care for Business",
      palveluseteli: "Care Service Voucher",
      hinnoittelu: "Pricing",
    },
    hero: {
      eyebrow: "A partnership you can trust",
      title: "High-quality home and office care – and we look after you",
      lead: "T & G Services takes care of your home and your office with precision, so you have time for what matters. In our partnership, you are looked after.",
      cta: "Start the collaboration",
      secondary: "Explore services",
    },
    about: {
      eyebrow: "About us",
      title: "A clean home, a working office, a day taken care of",
      body: "We are a Finnish home and office care company. We deliver cleaning and everyday support services with professionalism and the same attention to detail at home and at work – reliably and with transparent pricing.",
      points: [
        "Trained and trustworthy staff",
        "Home and office from one partner",
        "Transparent pricing, no surprises",
      ],
    },
    actions: {
      eyebrow: "How to get started",
      title: "Choose what suits you best",
      book: { title: "Book a video meeting", body: "We discuss your needs calmly and plan the collaboration together.", cta: "Book a time" },
      quote: { title: "Request a quote", body: "Tell us about your situation and get a clear offer quickly.", cta: "Request a quote" },
      buy: { title: "Buy a service", body: "Pick a ready-made package and get started right away.", cta: "See packages" },
    },
    services: {
      eyebrow: "Our services",
      title: "Three ways to receive TGS quality",
      kotiin: {
        title: "Care AT HOME",
        body: "Home cleaning and housekeeping – as often as you need.",
        items: ["Regular and deep cleaning", "Windows, appliances and textiles", "Moving and spring cleaning", "Everyday errands"],
      },
      yrityksille: {
        title: "Care for Business",
        body: "Clean offices and business premises on an agreed rhythm.",
        items: ["Office cleaning 1–5 times/week", "Accommodation and site cleaning", "Break rooms and sanitary spaces", "Tailored agreements"],
      },
      palveluseteli: {
        title: "Care Service Voucher",
        body: "Home support services with the municipal service voucher – simple and clear.",
        items: ["Using the service voucher", "Guidance and application help", "Cooperation with the municipality", "No hidden costs"],
      },
      more: "Read more",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Transparent pricing",
      lead: "Our pricing is transparent: choose either a monthly package or hourly billing. Every price is listed below – no hidden costs, no surprises.",
      monthly: "Monthly packages",
      hourly: "Hourly rate",
      perMonth: "€ / month",
      perHour: "€ / h",
      hoursPerMonth: "h / month",
      single: "One-off booking",
      vat: "Prices excl. VAT (0 %).",
      cta: "Request a quote",
      note: "The Finnish household tax credit is applied to private customers' invoices.",
    },
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      submit: "Send",
      thanks: "Thank you! We will be in touch shortly.",
      preferredTime: "Preferred time",
      service: "Service",
    },
    book: { title: "Book a video meeting", lead: "Let's set up a 30-minute online meeting to go through your needs and start the collaboration." },
    quote: { title: "Request a quote", lead: "Briefly describe your situation – you'll receive a personal offer within two business days." },
    buy: { title: "Buy a service", lead: "Clear service packages so you can start immediately.", from: "from", select: "Select" },
    splash: { kotiin: "TGS Home", yrityksille: "TGS for Business" },
    footer: { tagline: "High-quality home and office care.", contact: "Contact", rights: "All rights reserved." },
  },
};
