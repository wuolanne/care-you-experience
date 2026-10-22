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
  pricingBanner: { title: string; paragraphs: string[]; languages: string; home: string; business: string };
  values: { eyebrow: string; title: string; more: string; items: { title: string; body: string }[] };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    headline: string;
    intro: string[];
    sections: { title: string; body: string }[];
    start: { title: string; items: { title: string; body: string }[] };
    closing: string;
    billing: string;
    team: string;
    firstName: string;
    staffPhoto: string;
  };
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
  footer: {
    tagline: string;
    contact: string;
    privacy: string;
    rights: string;
    businessId: string;
    follow: string;
    socialPending: string;
    adminDashboard: string;
  };
  privacy: {
    title: string;
    intro: string;
    updated: string;
    contactNotice: string;
    bookingNotice: string;
    serviceStartNotice: string;
    readMore: string;
    home: string;
    sections: { title: string; paragraphs: string[] }[];
  };
};

export const t: Record<Lang, Dict> = {
  fi: {
    nav: {
      home: "Etusivu",
      kotiin: "TGN KOTIIN",
      yrityksille: "TGN YRITYKSILLE",
      palveluseteli: "TGN PALVELUSETELI",
      hinnoittelu: "Hinnoittelu",
    },
    hero: {
      eyebrow: "Kumppanuutta, johon voi luottaa",
      title: "Laadukasta siivousta koteihin ja toimitiloihin – pidämme huolta asiakkaistamme",
      lead: "TGN Services hoitaa kotisi ja toimitilasi niin sisältä kuin ulkoa. Teemme tarvittaessa molemmat: sisäsiivouksen ja ulkotilojen hoidon. Kannamme kokonaisvaltaisen vastuun, jotta ympäristösi on siisti ja puhdas joka päivä. Haluamme, että sinulle jää aikaa olennaiseen – me pidämme huolta kumppanuudestamme.\n\nRaportoimme ennakoivasti ja pidämme viestinnän avoimena. Nimeämme asiakkuudellesi vastuuhenkilön ja huolehdimme henkilöstön jatkuvuudesta, jotta työntekijämme eivät vaihdu jatkuvasti.\n\nHinnoittelumallimme on selkeä, eikä meillä ole piilokuluja. Tarpeidesi muuttuminen ei automaattisesti tarkoita maksujen nousua. Olemme täällä sinua varten ja haluamme, että kaikilla on mahdollisuus laadukkaaseen ja tasalaatuiseen siivoukseen.\n\nKumppanuudessamme sinusta pidetään huolta!",
      cta: "Aloita yhteistyö",
      secondary: "Tutustu palveluihin",
    },
    pricingBanner: {
      title: "Hinnoittelu",
      paragraphs: [
        "Valitse arkeesi sopiva kiinteä kuukausihinnoittelu tai osta yksittäisiä palvelutunteja ilman kuukausiasiakkuutta.",
        "Kotona tuotettavilla palveluillamme on yksi yhtenäinen hinta ja yrityksille tuotettavilla palveluillamme omansa. Selkeä hinnoittelu tukee joustavaa sopimusmallia: voit muokata palvelusi sisältöä tarpeidesi mukaan sovitun sopimuksen puitteissa.",
      ],
      languages: "Palvelemme sinua suomeksi, ruotsiksi, englanniksi ja espanjaksi.",
      home: "TGN Kotiin",
      business: "TGN Yrityksille",
    },
    values: {
      eyebrow: "Arvomme",
      title: "Kumppanuutta johon voi luottaa",
      more: "Lyhyesti meistä",
      items: [
        { title: "Luotettava kumppanuus", body: "Käytössämme on laatuohjelma, joka sisältää laatutakuun. Jokaisella asiakkaalla on nimetty vastuuhenkilö, ja henkilöstö ei vaihdu koko ajan. Jokaisen asiakkaamme kanssa on yhteistyömalli, ja toteutamme säännöllisesti mielipidekyselyt sekä kehityspalaverit." },
        { title: "Avoin ja aktiivinen kommunikaatio", body: "Kommunikoimme ennakkoon ja aktiivisesti asiakkaidemme kanssa sekä tarvittaessa heidän omaistensa kanssa." },
        { title: "Yhdessä tekeminen", body: "Pidämme huolta henkilöstöstämme – ketään ei jätetä yksin, ja työskentelemme yhdessä." },
        { title: "Avoin ja joustava hinnoittelu", body: "Meidän kanssamme kaikilla on mahdollisuus laadukkaaseen siivoukseen, eikä meillä ole piilokuluja. Voit muuttaa kuukausisopimuksen sisältöä joustavasti ilman lisäkuluja." },
      ],
    },
    about: {
      eyebrow: "Meistä lyhyesti",
      title: "Siisti koti, toimivat toimitilat, huolehdittu arki!",
      body: "Olemme suomalainen kodin- ja toimitilahoidon yritys. Teemme siivouksen ja arjen tukipalvelut ammattitaidolla ja samalla tarkkuudella niin kotona kuin työpaikalla – luotettavasti, sovitusti ja läpinäkyvällä hinnalla.",
      headline: "Ensiluokkaista siivousta. Tuttua huolenpitoa.",
      intro: [
        "Puhdas koti ja siistit toimitilat tekevät arjesta sujuvampaa. TGN Services on kotimainen palveluyritys, joka yhdistää laadukkaan siivouksen henkilökohtaiseen palveluun – jotta sinulle jää aikaa olennaiseen.",
        "Saat oman nimetyn vastuuhenkilön, joka tuntee toiveesi ja huolehtii kokonaisuudesta. Tuttu henkilöstö, avoin viestintä ja ennakoiva yhteydenpito tekevät yhteistyöstä mutkatonta. Meille et ole vain yksi asiakas muiden joukossa, vaan kumppani, jonka arjesta pidämme huolta.",
      ],
      sections: [
        { title: "Selkeä hinta, joustava palvelu", body: "Valitse kiinteä kuukausipaketti tai tarpeisiisi sopiva tuntiveloitus. Sovimme palvelun sisällön ja hinnan avoimesti etukäteen. Käynnillä huolehdimme tarvittavista tehtävistä osana sovittua kokonaisuutta – ilman pikkutöistä kertyviä yllätyslaskuja tai piilokuluja." },
        { title: "Laatutakuu tuo mielenrauhaa", body: "Laatuohjelmamme ohjaa jokaista käyntiä ja on samalla lupauksemme sinulle. Jos työn jälki ei vastaa sovittua laatua, korjaamme puutteet viipymättä ja veloituksetta. Voit luottaa siihen, että kannamme vastuun työstämme." },
      ],
      start: {
        title: "Aloitetaan sinulle sopivalla tavalla",
        items: [
          { title: "Kerro toiveesi ja budjettisi.", body: "Lähetä yhteydenottokaavake, niin suunnittelemme sinulle sopivan palvelukokonaisuuden." },
          { title: "Varaa videopalaveri.", body: "Käydään tarpeesi yhdessä läpi. Voit kutsua mukaan perheenjäsenesi tai yrityksesi nimetyt henkilöt." },
          { title: "Valitse sopiva palvelupaketti ja aloita heti!", body: "Ilmoitat aloituspäivämäärän ja lisätiedot, niin saavumme paikalle." },
        ],
      },
      closing: "Kumppanuutta johon voit luottaa",
      billing: "Laskutustiedot",
      team: "Henkilöstömme",
      firstName: "Etunimi",
      staffPhoto: "Henkilöstön kuva",
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
      title: "Kolme tapaa saada TGN-laatua",
      kotiin: {
        title: "TGN Kotiin",
        body: "Kodinhoitoa ja siivousta – juuri niin usein kuin tarvitset.",
        items: ["Ylläpitosiivous ja perussiivous", "Ikkunat, kodinkoneet ja tekstiilit", "Muutto- ja suursiivoukset", "Arjen asiointiapu"],
      },
      yrityksille: {
        title: "TGN YRITYKSILLE",
        body: "Toimitilojen siisteys sovitulla rytmillä.",
        items: ["Toimitilasiivous 1–5 krt/vko", "Majoitus- ja kohdesiivoukset", "Taukotilat ja saniteettitilat", "Räätälöidyt sopimukset"],
      },
      palveluseteli: {
        title: "TGN PALVELUSETELI",
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
    splash: { kotiin: "TGN Kotiin", yrityksille: "TGN Yrityksille" },
    footer: { tagline: "Luotettavaa kumppanuutta kotiin ja yrityksille.", contact: "Yhteystiedot", privacy: "Tietosuojaseloste", rights: "Kaikki oikeudet pidätetään.", businessId: "Y-tunnus", follow: "Seuraa meitä", socialPending: "ei vielä linkkiä", adminDashboard: "Hallintapaneeli" },
    privacy: {
      title: "Tietosuojaseloste",
      intro: "Tämä seloste kuvaa, miten TGN Services käsittelee henkilötietoja verkkosivustolla ja sivuston lomakkeiden yhteydessä.",
      updated: "Päivitetty viimeksi: 22.10.2026",
      contactNotice: "Käsittelemme antamiasi tietoja yhteydenottopyyntöösi vastaamiseksi.",
      bookingNotice: "Käsittelemme antamiasi tietoja videopalaveripyyntösi käsittelemiseksi.",
      serviceStartNotice: "Käsittelemme antamiasi tietoja palvelun aloituksen suunnittelemiseksi.",
      readMore: "Lue tietosuojaseloste",
      home: "Takaisin etusivulle",
      sections: [
        { title: "1. Rekisterinpitäjä ja yhteystiedot", paragraphs: ["TGN Services / T & G Nordic Services", "Y-tunnus: 3664346-2", "Tietosuoja-asioissa voit ottaa yhteyttä osoitteeseen info@tgnservices.fi."] },
        { title: "2. Mitä tietoja käsittelemme ja miksi", paragraphs: ["Yhteydenottopyynnössä käsitellään sähköpostiosoitetta, viestiä ja lomakkeen kieltä. Videopalaveripyynnössä käsitellään sähköpostiosoitetta, toivottua päivää ja kellonaikaa sekä lomakkeen kieltä. Palvelunaloituspyynnössä käsitellään nimeä, yhteyshenkilöä, sähköpostiosoitetta, työkohteen osoitetta, aloituspäivää ja -aikaa, palvelun tyyppiä, mahdollisia lisätietoja tai paketin nimeä sekä lomakkeen kieltä.", "Tietoja käytetään pyyntöön vastaamiseen, videopalaveripyyntöjen käsittelyyn, palvelun aloituksen suunnitteluun, yritykselle lähetettävään ilmoitukseen, väärinkäytösten torjuntaan ja pyyntöjen tilan hallintaan. Lomakkeiden tietoja ei käytetä erilliseen suoramarkkinointiin. Ylläpitotilin tietoja käsitellään ylläpitopalvelun käyttöä varten."] },
        { title: "3. Tietojen lähde ja käsittelyn peruste", paragraphs: ["Tiedot saadaan suoraan sinulta lomakkeella tai ylläpitoon kirjautuessa. Älä lähetä lomakkeella tarpeettomia arkaluonteisia tietoja.", "Palvelunaloituspyynnön käsittely perustuu GDPR:n 6 artiklan 1 kohdan b alakohtaan: sopimusta edeltävät toimenpiteet rekisteröidyn pyynnöstä. Tavallisen yhteydenoton, videopalaveripyynnön ja väärinkäytösten torjunnan käsittelyperusteet arvioidaan erikseen. Lomakkeisiin ei lisätä suostumusvalintaa ilman tätä arviota."] },
        { title: "4. Vastaanottajat, suojaus ja siirrot", paragraphs: ["Tietoja käsitellään Supabasessa. Yritykselle lähetettävät sähköposti-ilmoitukset toimitetaan Resendin kautta. Sivustoa isännöi Vercel ja fontteja ladataan Google Fonts -palvelusta. Näiden palveluntarjoajien mahdolliset EU/ETA-alueen ulkopuoliset siirrot ja suojatoimet tarkistetaan ajantasaisista ehdoista."] },
        { title: "5. Tietojen säilyttäminen", paragraphs: ["Säilytämme henkilötietoja vain niin kauan kuin niitä tarvitaan yhteydenottopyynnön tai asiakkuuden hoitamiseen tai lakisääteisten velvoitteiden täyttämiseen.", "Poistamme tiedot, kun niiden säilyttämiselle ei enää ole perustetta. Voit myös pyytää tietojesi poistamista osoitteesta info@tgnservices.fi."] },
        { title: "6. Oikeudet, evästeet ja selosteen päivitys", paragraphs: ["Voit soveltuvin osin pyytää pääsyä tietoihisi, niiden oikaisua, poistamista tai käsittelyn rajoittamista ja vastustaa käsittelyä. Lähetä pyyntö osoitteeseen info@tgnservices.fi; henkilöllisyys voidaan varmistaa. Voit tehdä valituksen tietosuojavaltuutetun toimistolle. Lisätiedot: tietosuoja.fi.", "Sivustolla ei käytetä analytiikka- tai markkinointiseurantaa. Kieli ja kirjautumisistunto tallennetaan selaimen toiminnalliseen tallennustilaan, ja ylläpidon käyttöasetus voi tallentua evästeenä. Selostetta päivitetään, kun käsittely, palveluntarjoajat, käyttötarkoitukset tai yhteystiedot muuttuvat."] },
      ],
    },
  },
  sv: {
    nav: {
      home: "Hem",
      kotiin: "TGN Hem",
      yrityksille: "TGN Företag",
      palveluseteli: "TGN SERVICESEDEL",
      hinnoittelu: "Priser",
    },
    hero: {
      eyebrow: "Ett partnerskap du kan lita på",
      title: "Kvalitetsstädning för hem och lokaler – vi tar hand om våra kunder",
      lead: "TGN Services tar hand om ditt hem och dina lokaler både inomhus och utomhus. Vi gör båda vid behov: inomhusstädning och skötsel av utomhusområden. Vi tar ett helhetsansvar så att din omgivning är ren och välskött varje dag. Vi vill att du ska ha tid för det väsentliga – vi vårdar vårt partnerskap.\n\nVi rapporterar proaktivt och håller kommunikationen öppen. Du får en utsedd kontaktperson som ansvarar för kundrelationen, och vi värnar om kontinuiteten i personalen så att du inte ständigt möter nya medarbetare.\n\nVår prismodell är tydlig, utan dolda kostnader. Förändrade behov innebär inte automatiskt högre avgifter. Vi finns här för dig och vill att alla ska ha tillgång till städning av hög och jämn kvalitet.\n\nI vårt partnerskap tar vi hand om dig!",
      cta: "Inled samarbete",
      secondary: "Se våra tjänster",
    },
    pricingBanner: {
      title: "Priser",
      paragraphs: [
        "Välj ett fast månadspris som passar din vardag eller köp enstaka servicetimmar utan att bli månadskund.",
        "Våra tjänster i hemmet har ett enhetligt pris och våra tjänster för företag har ett eget enhetligt pris. Tydlig prissättning ger utrymme för en flexibel avtalsmodell: du kan anpassa tjänstens innehåll efter dina behov inom ramen för ditt avtal.",
      ],
      languages: "Vi betjänar dig på finska, svenska, engelska och spanska.",
      home: "TGN Hem",
      business: "TGN Företag",
    },
    values: {
      eyebrow: "Våra värderingar",
      title: "Ett partnerskap du kan lita på",
      more: "Kort om oss",
      items: [
        { title: "En pålitlig partner", body: "Vi arbetar enligt ett kvalitetsprogram som innehåller en kvalitetsgaranti. Varje kund har en namngiven ansvarsperson, och personalen byts inte ut hela tiden. Med varje kund finns en samarbetsmodell, och vi genomför återkommande opinionsundersökningar samt utvecklingssamtal." },
        { title: "Öppen och aktiv kommunikation", body: "Vi kommunicerar i förväg och aktivt med våra kunder samt vid behov med deras anhöriga." },
        { title: "Att göra tillsammans", body: "Vi tar hand om vår personal – ingen lämnas ensam, och vi arbetar tillsammans." },
        { title: "Öppen och flexibel prissättning", body: "Tillsammans med oss har alla möjlighet till kvalitativ städning, och vi har inga dolda avgifter. Hos oss kan du ändra innehållet i ditt månadsavtal flexibelt utan extra kostnader." },
      ],
    },
    about: {
      eyebrow: "Om oss",
      title: "Rent hem, fungerande lokaler, en vardag vi tar hand om!",
      body: "Vi är ett finländskt företag inom hem- och lokalistädning. Vi utför städning och stödtjänster med yrkeskunskap och samma noggrannhet hemma som på arbetsplatsen – pålitligt och med transparenta priser.",
      headline: "Förstklassig städning. Omtanke med ett välbekant ansikte.",
      intro: [
        "Ett rent hem och välstädade lokaler gör vardagen smidigare. TGN Services är ett finländskt serviceföretag som förenar högkvalitativ städning med personlig service – så att du får tid för det som är viktigt.",
        "Du får en egen utsedd kontaktperson som känner till dina önskemål och ansvarar för helheten. Välbekant personal, öppen kommunikation och proaktiv kontakt gör samarbetet enkelt. För oss är du inte bara en kund bland andra, utan en partner vars vardag vi tar hand om.",
      ],
      sections: [
        { title: "Tydligt pris, flexibel service", body: "Välj ett månadspaket till fast pris eller timdebitering som passar dina behov. Vi kommer öppet överens om tjänstens innehåll och pris i förväg. Under besöket utför vi de uppgifter som behövs inom den avtalade helheten – utan oväntade tillägg för småsysslor eller dolda kostnader." },
        { title: "Vår kvalitetsgaranti ger trygghet", body: "Vårt kvalitetsprogram vägleder varje besök och är samtidigt vårt löfte till dig. Om resultatet inte motsvarar den avtalade kvaliteten åtgärdar vi bristerna utan dröjsmål och utan kostnad. Du kan lita på att vi tar ansvar för vårt arbete." },
      ],
      start: {
        title: "Vi börjar på det sätt som passar dig",
        items: [
          { title: "Berätta om dina önskemål och din budget.", body: "Skicka kontaktformuläret, så planerar vi en servicehelhet som passar dig." },
          { title: "Boka ett videomöte.", body: "Vi går igenom dina behov tillsammans. Du kan bjuda in familjemedlemmar eller de utsedda personerna i ditt företag." },
          { title: "Välj ett lämpligt servicepaket och kom igång direkt!", body: "Du anger startdatum och tilläggsuppgifter, så kommer vi till dig." },
        ],
      },
      closing: "Ett partnerskap du kan lita på",
      billing: "Faktureringsuppgifter",
      team: "Vår personal",
      firstName: "Förnamn",
      staffPhoto: "Personalbild",
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
      title: "Tre sätt att få TGN-kvalitet",
      kotiin: {
        title: "TGN Hem",
        body: "Hemstädning och hemservice – så ofta du behöver.",
        items: ["Underhålls- och grundstädning", "Fönster, vitvaror och textilier", "Flytt- och storstädning", "Hjälp med vardagsärenden"],
      },
      yrityksille: {
        title: "TGN Företag",
        body: "Rena lokaler i avtalad rytm.",
        items: ["Lokalistädning 1–5 ggr/vecka", "Boende- och objektsstädning", "Pausrum och sanitetsutrymmen", "Skräddarsydda avtal"],
      },
      palveluseteli: {
        title: "TGN SERVICESEDEL",
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
    splash: { kotiin: "TGN Hem", yrityksille: "TGN för Företag" },
      footer: { tagline: "Ett pålitligt partnerskap för hem och företag.", contact: "Kontakt", privacy: "Integritetspolicy", rights: "Alla rättigheter förbehållna.", businessId: "Y-tunnus", follow: "Följ oss", socialPending: "inte länkad ännu", adminDashboard: "Administrationspanel" },
    privacy: {
      title: "Integritetspolicy",
      intro: "Den här policyn beskriver hur TGN Services behandlar personuppgifter på webbplatsen och i webbplatsens formulär.",
      updated: "Senast uppdaterad: 22.10.2026",
      contactNotice: "Vi behandlar uppgifterna du lämnar för att svara på din kontaktförfrågan.",
      bookingNotice: "Vi behandlar uppgifterna du lämnar för att hantera din videomötesförfrågan.",
      serviceStartNotice: "Vi behandlar uppgifterna du lämnar för att planera tjänstens start.",
      readMore: "Läs integritetspolicyn",
      home: "Tillbaka till startsidan",
      sections: [
        { title: "1. Personuppgiftsansvarig och kontakt", paragraphs: ["TGN Services / T & G Nordic Services", "FO-nummer: 3664346-2", "I dataskyddsfrågor kan du kontakta info@tgnservices.fi."] },
        { title: "2. Uppgifter och ändamål", paragraphs: ["I kontaktförfrågningar behandlas e-postadress, meddelande och formulärets språk. I videomötesförfrågningar behandlas e-postadress, önskat datum och klockslag samt formulärets språk. I tjänstestartsförfrågningar behandlas namn, kontaktperson, e-postadress, arbetsadress, startdatum och -tid, tjänstetyp, eventuella tilläggsuppgifter eller paketnamn samt formulärets språk.", "Uppgifterna används för att svara på förfrågningar, hantera videomötesförfrågningar, planera tjänstestarter, skicka meddelanden till företaget, motverka missbruk och hantera förfrågningarnas status. Uppgifter om administratörskonton behandlas för administrationens användning. Uppgifter från formulären används inte för separat direktmarknadsföring."] },
        { title: "3. Uppgifternas källa och rättslig grund", paragraphs: ["Uppgifterna lämnas direkt av dig i ett formulär eller vid inloggning till administrationen. Skicka inte onödiga känsliga uppgifter.", "Behandlingen av tjänstestartsförfrågningar grundar sig på artikel 6.1 b i GDPR: åtgärder före avtal på den registrerades begäran. Den rättsliga grunden för vanliga kontaktförfrågningar, videomötesförfrågningar och bekämpning av missbruk bedöms separat. Ingen samtyckesruta läggs till utan denna bedömning."] },
        { title: "4. Mottagare, skydd och överföringar", paragraphs: ["Uppgifter behandlas i Supabase. E-postmeddelanden till företaget skickas via Resend. Webbplatsen hostas av Vercel och typsnitt laddas från Google Fonts. Eventuella överföringar utanför EU/EES och tillämpliga skyddsåtgärder kontrolleras i leverantörernas aktuella villkor."] },
        { title: "5. Lagring", paragraphs: ["Vi sparar personuppgifter endast så länge de behövs för att hantera en kontaktförfrågan eller en kundrelation eller för att uppfylla lagstadgade skyldigheter.", "Vi raderar uppgifterna när det inte längre finns grund för att spara dem. Du kan också begära att dina uppgifter raderas genom att skriva till info@tgnservices.fi."] },
        { title: "6. Rättigheter, kakor och uppdatering", paragraphs: ["Du kan i tillämpliga fall begära tillgång till, rättelse av, radering av eller begränsning av behandlingen av dina uppgifter och invända mot behandling. Skicka begäran till info@tgnservices.fi; identiteten kan behöva verifieras. Du kan klaga hos Dataombudsmannens byrå. Mer information finns på tietosuoja.fi.", "Webbplatsen använder inte analys- eller marknadsföringsspårning. Språk och inloggningssession sparas i webbläsarens funktionella lagring, och en administrationsinställning kan sparas som kaka. Policyn uppdateras när behandling, leverantörer, ändamål eller kontaktuppgifter ändras."] },
      ],
    },
  },
  es: {
    nav: {
      home: "Inicio",
      kotiin: "TGN Hogar",
      yrityksille: "TGN Empresas",
      palveluseteli: "TGN Vale de Servicio",
      hinnoittelu: "Precios",
    },
    hero: {
      eyebrow: "Una colaboración de confianza",
      title: "Limpieza de calidad para hogares y locales – cuidamos de nuestros clientes",
      lead: "TGN Services cuida tu hogar y tus locales tanto por dentro como por fuera. Si es necesario, hacemos las dos cosas: la limpieza interior y el mantenimiento de las zonas exteriores. Asumimos la responsabilidad de forma integral para que tu entorno esté limpio y ordenado cada día. Queremos que tengas tiempo para lo esencial, mientras nosotros cuidamos de nuestra relación contigo.\n\nTe informamos de forma proactiva y mantenemos una comunicación abierta. Asignamos una persona responsable de tu cuenta y cuidamos la continuidad del equipo para evitar cambios constantes de personal.\n\nNuestro modelo de precios es claro y no hay costes ocultos. Un cambio en tus necesidades no implica automáticamente un aumento de las tarifas. Estamos aquí para ti y queremos que todo el mundo tenga acceso a una limpieza de calidad constante.\n\n¡En nuestra colaboración, cuidamos de ti!",
      cta: "Comenzar la colaboración",
      secondary: "Ver servicios",
    },
    pricingBanner: {
      title: "Precios",
      paragraphs: [
        "Elige una cuota mensual fija que se adapte a tu día a día o contrata horas sueltas de servicio sin necesidad de un contrato mensual.",
        "Nuestros servicios a domicilio tienen un precio unificado y nuestros servicios para empresas tienen su propio precio unificado. Esta claridad permite un modelo de contrato flexible: puedes adaptar el contenido del servicio a tus necesidades dentro de los términos acordados.",
      ],
      languages: "Te atendemos en finés, sueco, inglés y español.",
      home: "TGN Hogar",
      business: "TGN Empresas",
    },
    values: {
      eyebrow: "Nuestros valores",
      title: "Una colaboración en la que puedes confiar",
      more: "Sobre nosotros, en breve",
      items: [
        { title: "Colaboración fiable", body: "Trabajamos con un programa de calidad que incluye una garantía de calidad. Cada cliente tiene una persona de contacto designada y el personal no cambia constantemente. Con cada cliente hay un modelo de colaboración y realizamos regularmente encuestas de opinión y reuniones de desarrollo." },
        { title: "Comunicación abierta y activa", body: "Nos comunicamos de forma proactiva y activa con nuestros clientes y, cuando es necesario, con sus familiares." },
        { title: "Trabajo en equipo", body: "Cuidamos de nuestro personal: nadie queda solo y trabajamos juntos." },
        { title: "Precios abiertos y flexibles", body: "Con nosotros, todas las personas tienen la posibilidad de un servicio de limpieza de calidad y no tenemos costes ocultos. Puede cambiar el contenido de su contrato mensual de forma flexible y sin costes adicionales." },
      ],
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "¡Un hogar limpio, locales bien cuidados y un día a día atendido!",
      body: "Somos una empresa finlandesa de limpieza del hogar y de locales. Realizamos la limpieza y los servicios de apoyo con profesionalidad y el mismo rigor en casa y en el trabajo, con precios transparentes.",
      headline: "Limpieza de primera calidad. El cuidado de un equipo que conoces.",
      intro: [
        "Un hogar limpio y unos locales cuidados hacen más fácil el día a día. TGN Services es una empresa finlandesa de servicios que combina una limpieza de calidad con una atención personalizada, para que tengas tiempo para lo esencial.",
        "Tendrás una persona de contacto asignada que conoce tus preferencias y se encarga del servicio en su conjunto. Un equipo habitual, una comunicación abierta y un contacto proactivo hacen que nuestra colaboración sea sencilla. Para nosotros no eres un cliente más, sino alguien con quien colaboramos y cuyo día a día cuidamos.",
      ],
      sections: [
        { title: "Precios claros, servicio flexible", body: "Elige un paquete mensual de precio fijo o una tarifa por horas adaptada a tus necesidades. Acordamos contigo el contenido y el precio del servicio de forma transparente y por adelantado. En cada visita realizamos las tareas necesarias dentro del servicio acordado, sin cargos inesperados por pequeñas tareas ni costes ocultos." },
        { title: "Nuestra garantía de calidad te da tranquilidad", body: "Nuestro programa de calidad guía cada visita y es también nuestra promesa para ti. Si el resultado no cumple con la calidad acordada, corregimos las deficiencias sin demora y sin coste alguno. Puedes confiar en que asumimos la responsabilidad de nuestro trabajo." },
      ],
      start: {
        title: "Empecemos de la forma que más te convenga",
        items: [
          { title: "Cuéntanos tus preferencias y tu presupuesto.", body: "Envía el formulario de contacto y diseñamos un conjunto de servicios a tu medida." },
          { title: "Reserva una videollamada.", body: "Revisamos juntos tus necesidades. Puedes invitar a familiares o a las personas designadas de tu empresa." },
          { title: "Elige un paquete de servicios adecuado y empieza ya.", body: "Indicas la fecha de inicio y la información adicional, y nosotros acudimos al lugar." },
        ],
      },
      closing: "Una colaboración en la que puedes confiar",
      billing: "Datos de facturación",
      team: "Nuestro equipo",
      firstName: "Nombre",
      staffPhoto: "Foto del personal",
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
      title: "Tres formas de recibir la calidad TGN",
      kotiin: {
        title: "TGN Hogar",
        body: "Limpieza y cuidado del hogar, con la frecuencia que necesites.",
        items: ["Limpieza de mantenimiento y a fondo", "Ventanas, electrodomésticos y textiles", "Limpiezas de mudanza y generales", "Ayuda con gestiones diarias"],
      },
      yrityksille: {
        title: "TGN Empresas",
        body: "Locales impecables con la frecuencia acordada.",
        items: ["Limpieza de locales 1–5 veces/semana", "Limpieza de alojamientos y objetos", "Zonas de descanso y aseos", "Contratos a medida"],
      },
      palveluseteli: {
        title: "TGN Vale de Servicio",
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
    splash: { kotiin: "TGN Hogar", yrityksille: "TGN para Empresas" },
    footer: { tagline: "Una colaboración de confianza para hogares y empresas.", contact: "Contacto", privacy: "Política de privacidad", rights: "Todos los derechos reservados.", businessId: "NIF", follow: "Síguenos", socialPending: "sin enlace todavía", adminDashboard: "Panel de administración" },
    privacy: {
      title: "Política de privacidad",
      intro: "Esta política describe cómo TGN Services trata los datos personales en el sitio web y en sus formularios.",
      updated: "Última actualización: 22.10.2026",
      contactNotice: "Tratamos los datos que proporcionas para responder a tu solicitud de contacto.",
      bookingNotice: "Tratamos los datos que proporcionas para gestionar tu solicitud de videollamada.",
      serviceStartNotice: "Tratamos los datos que proporcionas para planificar el inicio del servicio.",
      readMore: "Leer la política de privacidad",
      home: "Volver al inicio",
      sections: [
        { title: "1. Responsable y contacto", paragraphs: ["TGN Services / T & G Nordic Services", "Identificación empresarial finlandesa: 3664346-2", "Para asuntos de protección de datos puedes escribir a info@tgnservices.fi."] },
        { title: "2. Datos y finalidades", paragraphs: ["En las solicitudes de contacto se tratan el correo electrónico, el mensaje y el idioma del formulario. En las solicitudes de videollamada se tratan el correo electrónico, la fecha y hora deseadas y el idioma. En las solicitudes de inicio del servicio se tratan el nombre, la persona de contacto, el correo electrónico, la dirección del trabajo, la fecha y hora de inicio, el tipo de servicio, los detalles adicionales o el nombre del paquete y el idioma.", "Los datos se utilizan para responder a solicitudes, gestionar solicitudes de videollamada, planificar el inicio del servicio, enviar avisos a la empresa, prevenir usos indebidos y gestionar el estado de las solicitudes. Los datos de las cuentas de administración se tratan para usar el servicio de administración. Los datos de los formularios no se utilizan para marketing directo separado."] },
        { title: "3. Origen y base jurídica", paragraphs: ["Los datos se reciben directamente de ti mediante un formulario o al iniciar sesión en la administración. No envíes datos sensibles innecesarios.", "El tratamiento de las solicitudes de inicio del servicio se basa en el artículo 6, apartado 1, letra b del RGPD: medidas precontractuales a petición de la persona interesada. La base jurídica de las solicitudes de contacto ordinarias, las solicitudes de videollamada y la prevención de usos indebidos se evalúa por separado. No se añade una casilla de consentimiento sin esta evaluación."] },
        { title: "4. Destinatarios, protección y transferencias", paragraphs: ["Los datos se tratan en Supabase. Los avisos por correo a la empresa se envían mediante Resend. El sitio está alojado en Vercel y las fuentes se cargan desde Google Fonts. Las posibles transferencias fuera de la UE/EEE y las garantías aplicables se comprueban en las condiciones vigentes de los proveedores."] },
        { title: "5. Conservación", paragraphs: ["Conservamos los datos personales solo durante el tiempo necesario para gestionar una solicitud de contacto o una relación con el cliente, o para cumplir obligaciones legales.", "Eliminamos los datos cuando ya no existe una base para conservarlos. También puedes solicitar la eliminación de tus datos escribiendo a info@tgnservices.fi."] },
        { title: "6. Derechos, cookies y actualización", paragraphs: ["Según corresponda, puedes solicitar acceso, rectificación, supresión o limitación del tratamiento y oponerte al mismo. Envía la solicitud a info@tgnservices.fi; puede ser necesario verificar tu identidad. Puedes reclamar ante la autoridad finlandesa de protección de datos. Más información: tietosuoja.fi.", "El sitio no utiliza seguimiento analítico ni de marketing. El idioma y la sesión de inicio de sesión se guardan en el almacenamiento funcional del navegador, y una preferencia de administración puede guardarse como cookie. La política se actualiza cuando cambian el tratamiento, los proveedores, las finalidades o los datos de contacto."] },
      ],
    },
  },
  en: {
    nav: {
      home: "Home",
      kotiin: "TGN Home",
      yrityksille: "TGN Business",
      palveluseteli: "TGN Service Voucher",
      hinnoittelu: "Pricing",
    },
    hero: {
      eyebrow: "A partnership you can trust",
      title: "Quality cleaning for homes and premises – we look after our customers",
      lead: "TGN Services takes care of your home and premises both indoors and outdoors. If needed, we do both: interior cleaning and outdoor upkeep. We take full responsibility so that your surroundings stay clean and tidy every day. We want you to have time for what matters – we take care of our partnership.\n\nWe report proactively and keep communication open. We assign a dedicated contact to manage your account and maintain continuity in our team, so you do not constantly have different staff.\n\nOur pricing model is clear, with no hidden costs. Changing needs do not automatically mean higher fees. We are here for you and want everyone to have access to reliable, consistently high-quality cleaning.\n\nIn our partnership, you are looked after!",
      cta: "Start the collaboration",
      secondary: "Explore services",
    },
    pricingBanner: {
      title: "Pricing",
      paragraphs: [
        "Choose fixed monthly pricing that suits your everyday needs, or book individual service hours without becoming a monthly customer.",
        "Our home services have one consistent price, and our business services have their own consistent price. Clear pricing supports a flexible agreement: you can adjust the scope of your service as your needs change, within the terms of your agreement.",
      ],
      languages: "We serve you in Finnish, Swedish, English and Spanish.",
      home: "TGN Home",
      business: "TGN Business",
    },
    values: {
      eyebrow: "Our values",
      title: "A partnership you can trust",
      more: "About us in brief",
      items: [
        { title: "Reliable partnership", body: "We work to a quality programme that includes a quality guarantee. Every customer has a named contact person, and our staff do not change constantly. With each customer we have a collaboration model, and we carry out regular satisfaction surveys and development meetings." },
        { title: "Open and active communication", body: "We communicate proactively and actively with our customers, and when needed, with their next of kin." },
        { title: "Working together", body: "We take care of our staff – no one is left alone, and we work together." },
        { title: "Open and flexible pricing", body: "With us, everyone has the opportunity to quality cleaning, and we have no hidden costs. You can change the contents of your monthly agreement flexibly and at no extra cost." },
      ],
    },
    about: {
      eyebrow: "About us",
      title: "A clean home, well-kept premises, everyday life taken care of!",
      body: "We are a Finnish home and business premises cleaning company. We deliver cleaning and everyday support services with professionalism and the same attention to detail at home and at work – reliably and with transparent pricing.",
      headline: "First-class cleaning. Care from a familiar team.",
      intro: [
        "A clean home and tidy premises make everyday life run more smoothly. TGN Services is a Finnish service company combining high-quality cleaning with personal service – so you have time for what matters.",
        "You have your own dedicated contact who knows your preferences and oversees the entire service. Familiar staff, open communication and proactive contact make working together effortless. To us, you are not just another customer, but a partner whose everyday life we care for.",
      ],
      sections: [
        { title: "Clear pricing, flexible service", body: "Choose a fixed-price monthly package or hourly billing that suits your needs. We agree on the scope and price of the service openly and in advance. During each visit, we take care of the necessary tasks within the agreed service – without unexpected charges for small jobs or hidden costs." },
        { title: "Our quality guarantee brings peace of mind", body: "Our quality programme guides every visit and is also our promise to you. If the result does not meet the agreed standard, we correct any shortcomings promptly and free of charge. You can trust us to take responsibility for our work." },
      ],
      start: {
        title: "Let’s start in the way that suits you",
        items: [
          { title: "Tell us your wishes and budget.", body: "Send the contact form and we design a service plan that suits you." },
          { title: "Book a video meeting.", body: "We go through your needs together. You can invite family members or the named people in your company." },
          { title: "Choose a suitable service package and get started right away!", body: "You give us the start date and any extra details, and we arrive on site." },
        ],
      },
      closing: "A partnership you can trust",
      billing: "Billing details",
      team: "Our team",
      firstName: "First name",
      staffPhoto: "Staff photo",
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
      title: "Three ways to receive TGN quality",
      kotiin: {
        title: "TGN Home",
        body: "Home cleaning and housekeeping – as often as you need.",
        items: ["Regular and deep cleaning", "Windows, appliances and textiles", "Moving and spring cleaning", "Everyday errands"],
      },
      yrityksille: {
        title: "TGN Business",
        body: "Clean business premises on an agreed rhythm.",
        items: ["Premises cleaning 1–5 times/week", "Accommodation and site cleaning", "Break rooms and sanitary spaces", "Tailored agreements"],
      },
      palveluseteli: {
        title: "TGN Service Voucher",
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
    splash: { kotiin: "TGN Home", yrityksille: "TGN for Business" },
    footer: { tagline: "Reliable partnership for homes and businesses.", contact: "Contact", privacy: "Privacy policy", rights: "All rights reserved.", businessId: "Business ID", follow: "Follow us", socialPending: "not linked yet", adminDashboard: "Admin dashboard" },
    privacy: {
      title: "Privacy policy",
      intro: "This policy describes how TGN Services processes personal data on the website and through its forms.",
      updated: "Last updated: 22 October 2026",
      contactNotice: "We process the information you provide to respond to your contact request.",
      bookingNotice: "We process the information you provide to handle your video meeting request.",
      serviceStartNotice: "We process the information you provide to plan the start of the service.",
      readMore: "Read the privacy policy",
      home: "Back to home",
      sections: [
        { title: "1. Controller and contact", paragraphs: ["TGN Services / T & G Nordic Services", "Finnish Business ID: 3664346-2", "For data protection matters, contact info@tgnservices.fi."] },
        { title: "2. Data and purposes", paragraphs: ["Contact requests include the email address, message and form language. Video meeting requests include the email address, preferred date and time, and form language. Service start requests include the name, contact person, email address, work address, start date and time, service type, additional details or package name, and form language.", "The data is used to respond to requests, handle video meeting requests, plan service starts, send notifications to the company, prevent misuse and manage request status. Administrator account details are processed to provide the administration service. Form data is not used for separate direct marketing."] },
        { title: "3. Source and legal basis", paragraphs: ["The data is provided directly by you through a form or when signing in to administration. Do not send unnecessary sensitive information.", "Processing service start requests is based on Article 6(1)(b) GDPR: taking steps at the data subject’s request prior to entering into a contract. The legal bases for ordinary contact requests, video meeting requests and preventing misuse are assessed separately. No consent checkbox is added without that assessment."] },
        { title: "4. Recipients, security and transfers", paragraphs: ["Data is processed in Supabase. Email notifications to the company are sent through Resend. The site is hosted by Vercel and fonts are loaded from Google Fonts. Any transfers outside the EU/EEA and the applicable safeguards are checked in the providers’ current terms."] },
        { title: "5. Retention", paragraphs: ["We retain personal data only for as long as it is needed to handle a contact request or customer relationship, or to fulfil legal obligations.", "We delete the data when there is no longer a basis for retaining it. You can also request deletion of your data by writing to info@tgnservices.fi."] },
        { title: "6. Rights, cookies and updates", paragraphs: ["Where applicable, you may request access to, correction or deletion of your data, restriction of processing, or object to processing. Send requests to info@tgnservices.fi; your identity may need to be verified. You may complain to the Finnish Data Protection Ombudsman. More information: tietosuoja.fi.", "The site does not use analytics or marketing tracking. Language and the sign-in session are stored in functional browser storage, and an administration preference may be stored as a cookie. This policy is updated when processing, providers, purposes or contact details change."] },
      ],
    },
  },
};
