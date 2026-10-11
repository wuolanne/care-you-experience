export type Lang = "fi" | "sv" | "es" | "en";

export const LANGS: { code: Lang; label: string; short: string; flag: string }[] = [
  { code: "fi", label: "Suomi", short: "FI", flag: "🇫🇮" },
  { code: "sv", label: "Svenska", short: "SV", flag: "🇸🇪" },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
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
      kotiin: "TSG KOTIIN",
      yrityksille: "TSG YRITYKSILLE",
      palveluseteli: "TSG PALVELUSETELI",
      hinnoittelu: "Hinnoittelu",
    },
    hero: {
      eyebrow: "Kumppanuutta, johon voi luottaa",
      title: "Laadukasta siivousta koteihin ja toimitiloihin – pidämme huolta asiakkaistamme",
      lead: "T&G Services hoitaa kotisi tai toimitilasi huolella ja kantaa kokonaisvaltaisen vastuun. Teemme sen, mitä tarvitaan, jotta ympäristösi on siisti ja puhdas joka päivä. Haluamme, että sinulle jää aikaa olennaiseen – me pidämme huolta kumppanuudestamme.\n\nRaportoimme ennakoivasti ja pidämme viestinnän avoimena. Nimeämme asiakkuudellesi vastuuhenkilön ja huolehdimme henkilöstön jatkuvuudesta, jotta työntekijämme eivät vaihdu jatkuvasti.\n\nHinnoittelumallimme on selkeä, eikä meillä ole piilokuluja. Tarpeidesi muuttuminen ei automaattisesti tarkoita maksujen nousua. Olemme täällä sinua varten ja haluamme, että kaikilla on mahdollisuus laadukkaaseen ja tasalaatuiseen siivoukseen.\n\nKumppanuudessamme sinusta pidetään huolta!",
      cta: "Aloita yhteistyö",
      secondary: "Tutustu palveluihin",
    },
    about: {
      eyebrow: "Meistä lyhyesti",
      title: "Siisti koti, toimivat toimitilat, huolehdittu arki",
      body: "Olemme suomalainen kodin- ja toimitilahoidon yritys. Teemme siivouksen ja arjen tukipalvelut ammattitaidolla ja samalla tarkkuudella niin kotona kuin työpaikalla – luotettavasti, sovitusti ja läpinäkyvällä hinnalla.",
      points: [
        "Koulutettu ja luotettava henkilöstö",
        "Kodin ja toimitilojen siivous samalta kumppanilta",
        "Läpinäkyvä hinnoittelu, ei yllätyksiä",
      ],
    },
    actions: {
      eyebrow: "Näin pääset alkuun",
      title: "Valitse sinulle sopivin tapa",
      book: { title: "Varaa videopalaveri", body: "Keskustellaan tarpeistasi rauhassa ja suunnitellaan yhteistyö.", cta: "Varaa aika" },
      quote: { title: "Jätä yhteydenottopyyntö", body: "Kerro tarpeistasi, niin otamme sinuun yhteyttä.", cta: "Jätä yhteydenottopyyntö" },
      buy: { title: "Osta palvelu", body: "Valitse valmis palvelupaketti ja aloita heti.", cta: "Katso paketit" },
    },
    services: {
      eyebrow: "Palvelumme",
      title: "Kolme tapaa saada TGS-laatua",
      kotiin: {
        title: "TSG Kotiin",
        body: "Kodinhoitoa ja siivousta – juuri niin usein kuin tarvitset.",
        items: ["Ylläpitosiivous ja perussiivous", "Ikkunat, kodinkoneet ja tekstiilit", "Muutto- ja suursiivoukset", "Arjen asiointiapu"],
      },
      yrityksille: {
        title: "TSG YRITYKSILLE",
        body: "Toimitilojen siisteys sovitulla rytmillä.",
        items: ["Toimitilasiivous 1–5 krt/vko", "Majoitus- ja kohdesiivoukset", "Taukotilat ja saniteettitilat", "Räätälöidyt sopimukset"],
      },
      palveluseteli: {
        title: "TSG PALVELUSETELI",
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
      cta: "Jätä yhteydenottopyyntö",
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
    quote: { title: "Jätä yhteydenottopyyntö", lead: "Kerro lyhyesti tarpeistasi ja jätä yhteystietosi." },
    buy: { title: "Osta palvelu", lead: "Selkeät palvelupaketit, joilla pääset alkuun heti.", from: "alkaen", select: "Valitse" },
    splash: { kotiin: "TGS Kotiin", yrityksille: "TGS Yrityksille" },
    footer: { tagline: "Luotettavaa kumppanuutta kotiin ja yrityksille.", contact: "Yhteystiedot", rights: "Kaikki oikeudet pidätetään." },
  },
  sv: {
    nav: {
      home: "Hem",
      kotiin: "TSG Hem",
      yrityksille: "TSG Företag",
      palveluseteli: "TSG Servicesedel",
      hinnoittelu: "Priser",
    },
    hero: {
      eyebrow: "Ett partnerskap du kan lita på",
      title: "Kvalitetsstädning för hem och lokaler – vi tar hand om våra kunder",
      lead: "T&G Services tar omsorgsfullt hand om ditt hem eller dina lokaler och tar ett helhetsansvar. Vi gör det som behövs för att din omgivning ska vara ren och välskött varje dag. Vi vill att du ska ha tid för det väsentliga – vi vårdar vårt partnerskap.\n\nVi rapporterar proaktivt och håller kommunikationen öppen. Du får en utsedd kontaktperson som ansvarar för kundrelationen, och vi värnar om kontinuiteten i personalen så att du inte ständigt möter nya medarbetare.\n\nVår prismodell är tydlig, utan dolda kostnader. Förändrade behov innebär inte automatiskt högre avgifter. Vi finns här för dig och vill att alla ska ha tillgång till städning av hög och jämn kvalitet.\n\nI vårt partnerskap tar vi hand om dig!",
      cta: "Inled samarbete",
      secondary: "Se våra tjänster",
    },
    about: {
      eyebrow: "Om oss",
      title: "Rent hem, fungerande lokaler, omhändertagen vardag",
      body: "Vi är ett finländskt företag inom hem- och lokalistädning. Vi utför städning och stödtjänster med yrkeskunskap och samma noggrannhet hemma som på arbetsplatsen – pålitligt och med transparenta priser.",
      points: [
        "Utbildad och pålitlig personal",
        "Hem och lokaler av samma partner",
        "Transparent prissättning utan överraskningar",
      ],
    },
    actions: {
      eyebrow: "Så kommer du igång",
      title: "Välj det sätt som passar dig",
      book: { title: "Boka videomöte", body: "Vi går igenom dina behov i lugn och ro och planerar samarbetet.", cta: "Boka tid" },
      quote: { title: "Be oss kontakta dig", body: "Berätta om dina behov så kontaktar vi dig.", cta: "Be oss kontakta dig" },
      buy: { title: "Köp tjänst", body: "Välj ett färdigt servicepaket och kom igång direkt.", cta: "Se paket" },
    },
    services: {
      eyebrow: "Våra tjänster",
      title: "Tre sätt att få TGS-kvalitet",
      kotiin: {
        title: "TSG Hem",
        body: "Hemstädning och hemservice – så ofta du behöver.",
        items: ["Underhålls- och grundstädning", "Fönster, vitvaror och textilier", "Flytt- och storstädning", "Hjälp med vardagsärenden"],
      },
      yrityksille: {
        title: "TSG Företag",
        body: "Rena lokaler i avtalad rytm.",
        items: ["Lokalistädning 1–5 ggr/vecka", "Boende- och objektsstädning", "Pausrum och sanitetsutrymmen", "Skräddarsydda avtal"],
      },
      palveluseteli: {
        title: "TSG Servicesedel",
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
      cta: "Be oss kontakta dig",
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
    quote: { title: "Be oss kontakta dig", lead: "Berätta kort om dina behov och lämna dina kontaktuppgifter." },
    buy: { title: "Köp tjänst", lead: "Tydliga servicepaket som gör att du kommer igång direkt.", from: "från", select: "Välj" },
    splash: { kotiin: "TGS Hem", yrityksille: "TGS för Företag" },
    footer: { tagline: "Ett pålitligt partnerskap för hem och företag.", contact: "Kontakt", rights: "Alla rättigheter förbehållna." },
  },
  es: {
    nav: {
      home: "Inicio",
      kotiin: "TSG Hogar",
      yrityksille: "TSG Empresas",
      palveluseteli: "TSG Vale de Servicio",
      hinnoittelu: "Precios",
    },
    hero: {
      eyebrow: "Una colaboración de confianza",
      title: "Limpieza de calidad para hogares y locales – cuidamos de nuestros clientes",
      lead: "T&G Services cuida tu hogar o tus locales con esmero y asume la responsabilidad de forma integral. Hacemos lo necesario para que tu entorno esté limpio y ordenado cada día. Queremos que tengas tiempo para lo esencial, mientras nosotros cuidamos de nuestra relación contigo.\n\nTe informamos de forma proactiva y mantenemos una comunicación abierta. Asignamos una persona responsable de tu cuenta y cuidamos la continuidad del equipo para evitar cambios constantes de personal.\n\nNuestro modelo de precios es claro y no hay costes ocultos. Un cambio en tus necesidades no implica automáticamente un aumento de las tarifas. Estamos aquí para ti y queremos que todo el mundo tenga acceso a una limpieza de calidad constante.\n\n¡En nuestra colaboración, cuidamos de ti!",
      cta: "Comenzar la colaboración",
      secondary: "Ver servicios",
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "Hogar limpio, locales que funcionan, día a día resuelto",
      body: "Somos una empresa finlandesa de limpieza del hogar y de locales. Realizamos la limpieza y los servicios de apoyo con profesionalidad y el mismo rigor en casa y en el trabajo, con precios transparentes.",
      points: [
        "Personal cualificado y de confianza",
        "Hogar y locales con un mismo socio",
        "Precios transparentes, sin sorpresas",
      ],
    },
    actions: {
      eyebrow: "Cómo empezar",
      title: "Elige la opción que mejor te convenga",
      book: { title: "Reservar videollamada", body: "Hablamos con calma de tus necesidades y planificamos la colaboración.", cta: "Reservar cita" },
      quote: { title: "Solicitar contacto", body: "Cuéntanos tus necesidades y nos pondremos en contacto contigo.", cta: "Solicitar contacto" },
      buy: { title: "Comprar servicio", body: "Elige un paquete listo y empieza hoy mismo.", cta: "Ver paquetes" },
    },
    services: {
      eyebrow: "Nuestros servicios",
      title: "Tres formas de recibir la calidad TGS",
      kotiin: {
        title: "TSG Hogar",
        body: "Limpieza y cuidado del hogar, con la frecuencia que necesites.",
        items: ["Limpieza de mantenimiento y a fondo", "Ventanas, electrodomésticos y textiles", "Limpiezas de mudanza y generales", "Ayuda con gestiones diarias"],
      },
      yrityksille: {
        title: "TSG Empresas",
        body: "Locales impecables con la frecuencia acordada.",
        items: ["Limpieza de locales 1–5 veces/semana", "Limpieza de alojamientos y objetos", "Zonas de descanso y aseos", "Contratos a medida"],
      },
      palveluseteli: {
        title: "TSG Vale de Servicio",
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
      cta: "Solicitar contacto",
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
    quote: { title: "Solicitar contacto", lead: "Cuéntanos brevemente tus necesidades y deja tus datos de contacto." },
    buy: { title: "Comprar servicio", lead: "Paquetes claros para empezar de inmediato.", from: "desde", select: "Elegir" },
    splash: { kotiin: "TGS Hogar", yrityksille: "TGS para Empresas" },
    footer: { tagline: "Una colaboración de confianza para hogares y empresas.", contact: "Contacto", rights: "Todos los derechos reservados." },
  },
  en: {
    nav: {
      home: "Home",
      kotiin: "TSG Home",
      yrityksille: "TSG Business",
      palveluseteli: "TSG Service Voucher",
      hinnoittelu: "Pricing",
    },
    hero: {
      eyebrow: "A partnership you can trust",
      title: "Quality cleaning for homes and premises – we look after our customers",
      lead: "T&G Services takes care of your home or premises and takes full responsibility. We do what is needed to keep your surroundings clean and tidy every day. We want you to have time for what matters – we take care of our partnership.\n\nWe report proactively and keep communication open. We assign a dedicated contact to manage your account and maintain continuity in our team, so you do not constantly have different staff.\n\nOur pricing model is clear, with no hidden costs. Changing needs do not automatically mean higher fees. We are here for you and want everyone to have access to reliable, consistently high-quality cleaning.\n\nIn our partnership, you are looked after!",
      cta: "Start the collaboration",
      secondary: "Explore services",
    },
    about: {
      eyebrow: "About us",
      title: "A clean home, well-kept premises, a day taken care of",
      body: "We are a Finnish home and business premises cleaning company. We deliver cleaning and everyday support services with professionalism and the same attention to detail at home and at work – reliably and with transparent pricing.",
      points: [
        "Trained and trustworthy staff",
        "Home and premises from one partner",
        "Transparent pricing, no surprises",
      ],
    },
    actions: {
      eyebrow: "How to get started",
      title: "Choose what suits you best",
      book: { title: "Book a video meeting", body: "We discuss your needs calmly and plan the collaboration together.", cta: "Book a time" },
      quote: { title: "Request a callback", body: "Tell us what you need and we will contact you.", cta: "Request a callback" },
      buy: { title: "Buy a service", body: "Pick a ready-made package and get started right away.", cta: "See packages" },
    },
    services: {
      eyebrow: "Our services",
      title: "Three ways to receive TGS quality",
      kotiin: {
        title: "TSG Home",
        body: "Home cleaning and housekeeping – as often as you need.",
        items: ["Regular and deep cleaning", "Windows, appliances and textiles", "Moving and spring cleaning", "Everyday errands"],
      },
      yrityksille: {
        title: "TSG Business",
        body: "Clean business premises on an agreed rhythm.",
        items: ["Premises cleaning 1–5 times/week", "Accommodation and site cleaning", "Break rooms and sanitary spaces", "Tailored agreements"],
      },
      palveluseteli: {
        title: "TSG Service Voucher",
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
      cta: "Request a callback",
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
    quote: { title: "Request a callback", lead: "Briefly describe your needs and leave your contact details." },
    buy: { title: "Buy a service", lead: "Clear service packages so you can start immediately.", from: "from", select: "Select" },
    splash: { kotiin: "TGS Home", yrityksille: "TGS for Business" },
    footer: { tagline: "Reliable partnership for homes and businesses.", contact: "Contact", rights: "All rights reserved." },
  },
};
