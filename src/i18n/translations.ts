export type Lang = "fi" | "sv" | "es" | "en";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "fi", label: "Suomi", short: "FI" },
  { code: "sv", label: "Svenska", short: "SV" },
  { code: "es", label: "Español", short: "ES" },
  { code: "en", label: "English", short: "EN" },
];

type Dict = {
  nav: { home: string; kotiin: string; yrityksille: string; palveluseteli: string };
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
  footer: { tagline: string; contact: string; rights: string };
};

export const t: Record<Lang, Dict> = {
  fi: {
    nav: { home: "Etusivu", kotiin: "Care KOTIIN", yrityksille: "Care Yrityksille", palveluseteli: "Care Palveluseteli" },
    hero: {
      eyebrow: "Hoivaa ihmiseltä ihmiselle",
      title: "Laadukasta hoivaa ja huolenpitoa – kotiin ja yrityksille",
      lead: "Care & You Services tuottaa yksilöllistä, luotettavaa ja lämmintä palvelua. Jokainen kohtaaminen on meille lupaus laadusta.",
      cta: "Aloita yhteistyö",
      secondary: "Tutustu palveluihin",
    },
    about: {
      eyebrow: "Meistä lyhyesti",
      title: "Pieni tiimi, suuri sydän ja korkea standardi",
      body: "Olemme suomalainen hoiva- ja palvelualan yritys, joka yhdistää ammattitaidon ja aidon välittämisen. Palvelemme yksityisasiakkaita kotona, yrityksiä henkilöstön hyvinvoinnissa sekä palvelusetelin haltijoita.",
      points: ["Koulutettu ja luotettava henkilöstö", "Joustavat ja yksilölliset palvelut", "Selkeä hinnoittelu, ei yllätyksiä"],
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
      title: "Kolme tapaa saada Care & You -laatua",
      kotiin: {
        title: "Care KOTIIN",
        body: "Kotihoivaa, arjen apua ja seuraa – juuri niin usein kuin tarvitset.",
        items: ["Henkilökohtainen avustaminen", "Siivous ja kodinhoito", "Asiointiapu ja seuranpito", "Omaishoitajan tuki"],
      },
      yrityksille: {
        title: "Care Yrityksille",
        body: "Hyvinvointia ja tukipalveluita henkilöstöllenne sekä asiakkaillenne.",
        items: ["Henkilöstön hyvinvointipalvelut", "Toimitilojen siisteys", "Hoiva-alan sijaisuudet", "Räätälöidyt sopimukset"],
      },
      palveluseteli: {
        title: "Care Palveluseteli",
        body: "Hyväksytty palveluntuottaja – käytä kuntasi palveluseteli helposti meillä.",
        items: ["Palvelusetelin käyttö", "Neuvonta ja hakemusapu", "Kunnan kanssa yhteistyössä", "Ei piilokuluja"],
      },
      more: "Lue lisää",
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
    footer: { tagline: "Laadukasta hoivaa ja huolenpitoa.", contact: "Yhteystiedot", rights: "Kaikki oikeudet pidätetään." },
  },
  sv: {
    nav: { home: "Hem", kotiin: "Care HEM", yrityksille: "Care för Företag", palveluseteli: "Care Servicesedel" },
    hero: {
      eyebrow: "Omsorg från människa till människa",
      title: "Högklassig omsorg och service – hem och till företag",
      lead: "Care & You Services erbjuder individuell, pålitlig och varm service. Varje möte är ett löfte om kvalitet.",
      cta: "Inled samarbete",
      secondary: "Se våra tjänster",
    },
    about: {
      eyebrow: "Om oss",
      title: "Litet team, stort hjärta och hög standard",
      body: "Vi är ett finländskt omsorgs- och serviceföretag som förenar yrkeskunskap med äkta omtanke. Vi betjänar privatkunder i hemmet, företag inom personalens välbefinnande samt innehavare av servicesedel.",
      points: ["Utbildad och pålitlig personal", "Flexibla och individuella tjänster", "Tydlig prissättning utan överraskningar"],
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
      title: "Tre sätt att få Care & You-kvalitet",
      kotiin: {
        title: "Care HEM",
        body: "Hemvård, hjälp i vardagen och sällskap – så ofta du behöver.",
        items: ["Personlig assistans", "Städning och hemvård", "Ärendehjälp och sällskap", "Stöd för närståendevårdare"],
      },
      yrityksille: {
        title: "Care för Företag",
        body: "Välbefinnande och stödtjänster för er personal och era kunder.",
        items: ["Välbefinnandetjänster för personal", "Städning av lokaler", "Vikarier inom vårdbranschen", "Skräddarsydda avtal"],
      },
      palveluseteli: {
        title: "Care Servicesedel",
        body: "Godkänd serviceproducent – använd kommunens servicesedel enkelt hos oss.",
        items: ["Användning av servicesedel", "Rådgivning och ansökningshjälp", "Samarbete med kommunen", "Inga dolda kostnader"],
      },
      more: "Läs mer",
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
    footer: { tagline: "Högklassig omsorg och service.", contact: "Kontakt", rights: "Alla rättigheter förbehållna." },
  },
  es: {
    nav: { home: "Inicio", kotiin: "Care EN CASA", yrityksille: "Care para Empresas", palveluseteli: "Care Vale de Servicio" },
    hero: {
      eyebrow: "Cuidado de persona a persona",
      title: "Cuidado y servicios de alta calidad – en casa y para empresas",
      lead: "Care & You Services ofrece un servicio personalizado, fiable y cercano. Cada encuentro es nuestra promesa de calidad.",
      cta: "Comenzar la colaboración",
      secondary: "Ver servicios",
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "Equipo pequeño, gran corazón y alto estándar",
      body: "Somos una empresa finlandesa de cuidados y servicios que une profesionalidad con atención genuina. Atendemos a particulares en su hogar, a empresas en el bienestar de su personal y a titulares del vale de servicio.",
      points: ["Personal cualificado y de confianza", "Servicios flexibles y personalizados", "Precios claros, sin sorpresas"],
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
      title: "Tres formas de recibir la calidad Care & You",
      kotiin: {
        title: "Care EN CASA",
        body: "Cuidado en el hogar, ayuda diaria y compañía, con la frecuencia que necesites.",
        items: ["Asistencia personal", "Limpieza y tareas del hogar", "Acompañamiento y gestiones", "Apoyo al cuidador familiar"],
      },
      yrityksille: {
        title: "Care para Empresas",
        body: "Bienestar y servicios de apoyo para vuestro personal y clientes.",
        items: ["Bienestar del personal", "Limpieza de instalaciones", "Sustituciones del sector cuidados", "Contratos a medida"],
      },
      palveluseteli: {
        title: "Care Vale de Servicio",
        body: "Proveedor autorizado: utiliza fácilmente el vale de servicio de tu municipio.",
        items: ["Uso del vale de servicio", "Asesoramiento y ayuda con la solicitud", "Colaboración con el municipio", "Sin costes ocultos"],
      },
      more: "Saber más",
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
    footer: { tagline: "Cuidado y servicios de alta calidad.", contact: "Contacto", rights: "Todos los derechos reservados." },
  },
  en: {
    nav: { home: "Home", kotiin: "Care AT HOME", yrityksille: "Care for Business", palveluseteli: "Care Service Voucher" },
    hero: {
      eyebrow: "Care from one person to another",
      title: "High-quality care and services – at home and for business",
      lead: "Care & You Services delivers personal, reliable and warm service. Every encounter is our promise of quality.",
      cta: "Start the collaboration",
      secondary: "Explore services",
    },
    about: {
      eyebrow: "About us",
      title: "A small team, a big heart and a high standard",
      body: "We are a Finnish care and services company combining professionalism with genuine compassion. We serve private clients at home, companies in employee wellbeing, and holders of the municipal service voucher.",
      points: ["Trained and trustworthy staff", "Flexible, individual services", "Clear pricing, no surprises"],
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
      title: "Three ways to receive Care & You quality",
      kotiin: {
        title: "Care AT HOME",
        body: "Home care, everyday help and companionship – as often as you need.",
        items: ["Personal assistance", "Cleaning and housekeeping", "Errands and companionship", "Support for family carers"],
      },
      yrityksille: {
        title: "Care for Business",
        body: "Wellbeing and support services for your staff and your clients.",
        items: ["Employee wellbeing services", "Facility cleaning", "Care sector substitutes", "Tailored agreements"],
      },
      palveluseteli: {
        title: "Care Service Voucher",
        body: "Approved provider – use your municipal service voucher easily with us.",
        items: ["Using the service voucher", "Guidance and application help", "Cooperation with the municipality", "No hidden costs"],
      },
      more: "Read more",
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
    footer: { tagline: "High-quality care and services.", contact: "Contact", rights: "All rights reserved." },
  },
};
