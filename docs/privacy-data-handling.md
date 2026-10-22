# TGN Services – henkilötietojen käsittelyn nykytila

Tämä dokumentti kuvaa tämän version lähdekoodiin perustuvan nykytilan. Se ei korvaa yrityksen omistajan tai juristin tekemää GDPR-arviointia. Julkinen seloste on reitissä `/tietosuoja`.

## Lähdekoodissa havaitut tietovirrat

| Toiminto              | Kerättävät kentät                                                                                                                                           | Tallennus                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Yhteydenottopyyntö    | sähköposti, viesti, lomakkeen kieli                                                                                                                         | Supabase `contact_submissions` ja ilmoituksen `email_outbox`    |
| Videopalaveripyyntö   | sähköposti, toivottu päivämäärä, kellonaika, lomakkeen kieli                                                                                                | Supabase `booking_requests` ja ilmoituksen `email_outbox`       |
| Palvelunaloituspyyntö | nimi, yhteyshenkilö, sähköposti, työkohteen osoite, aloituspäivä ja -aika, palvelutyyppi, kertakäynnin lisätiedot tai kuukausipaketin nimi, lomakkeen kieli | Supabase `service_start_requests` ja ilmoituksen `email_outbox` |
| Ylläpitotili          | kirjautumiseen tarvittavat tilitiedot                                                                                                                       | Supabase Auth                                                   |

`email_outbox` sisältää ilmoituksen muodostamiseen tarvittavan payloadin sekä viestin vastaanottajan, vastausosoitteen, tilan, yrityksen Resend-tunnisteen, yrityskertojen määrän ja idempotenssitunnisteen. Raakaa IP-osoitetta ei tallenneta. Rate limiting käyttää IP-osoitteesta laskettua hashia `form_rate_limits`-taulussa; hashin säilytysaikaa ei ole määritelty sovelluksessa.

Lähdekoodista ei löytynyt analytiikka- tai markkinointiseurantaa. Selain tallentaa kielivalinnan `localStorageen`, Supabase Auth istunnon selaimen tallennustilaan ja admin-sivupalkki voi tallentaa asetuksen evästeenä. Sivusto lataa fontit Google Fonts -palvelusta, joten sen tekninen tiedonsiirto pitää huomioida palveluntarjoaja-arviossa.

## Tietopyynnön käsittely

1. Vastaanota pyyntö osoitteeseen `info@tgnservices.fi`.
2. Varmista pyytäjän henkilöllisyys suhteellisesti ennen tietojen luovuttamista tai muuttamista.
3. Hae tiedot Supabasen tauluista ja tarvittaessa `email_outbox`-taulusta sekä soveltuvista ylläpidon lokeista.
4. Oikaise tiedot vain hyväksytyllä, jäljitettävällä ylläpitomenettelyllä.
5. Poista tiedot vain, kun poistopyyntö on arvioitu ja mahdolliset lakisääteiset tai riidan selvittämiseen liittyvät säilytysperusteet on tarkistettu.
6. Kirjaa käsitelty pyyntö ilman tarpeettomien asiakastietojen kopioimista lokiin.

Tämä branch ei lisää automaattista poistoa, anonymisointia tai tietokannan migraatiota.

## Vahvistetut käsittelyperusteet

Palvelunaloituspyynnön käsittelyperusteeksi on vahvistettu GDPR 6(1)(b):
sopimusta edeltävät toimenpiteet rekisteröidyn pyynnöstä. Tavallisen
yhteydenoton, videopalaveripyynnön ja väärinkäytösten torjunnan käsittelyperusteet
on arvioitava erikseen ennen lopullista julkaisemista. Niitä ei vahvisteta tässä
branchissa.

Lomakkeiden tietoja ei käytetä erilliseen suoramarkkinointiin. Sivuston
lähdekoodista ei löytynyt markkinointilistojen, uutiskirjeen tai
markkinointiseurannan toteutusta.

## Käsittelyperusteiden arviointiluonnos (ei lopullinen päätös)

GDPR 6(1)(b) soveltuu vain siltä osin kuin käsittely on objektiivisesti
tarpeellista käyttäjän pyytämien sopimusta edeltävien toimenpiteiden tekemiseksi.
GDPR 6(1)(f) edellyttää erikseen yksilöityä oikeutettua etua, tarpeellisuutta ja
intressipunnintaa. Seuraava jako on luonnos yrityksen hyväksyttäväksi:

| Toiminto                                                     | Mahdollinen peruste                                                            | Rajaus ennen hyväksyntää                                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Palvelua, tarjousta tai aloitusta koskeva yhteydenottopyyntö | GDPR 6(1)(b), jos pyyntö liittyy aidosti sopimusta edeltäviin toimiin          | Yleinen kysymys ei automaattisesti täytä 6(1)(b):tä; lomakkeen käyttötarkoitus ja kentät on luokiteltava.                             |
| Yleinen yhteydenottopyyntö                                   | Mahdollisesti GDPR 6(1)(f) tai muu yrityksen vahvistama peruste                | Omistajan on päätettävä, onko pyyntö aidosti sopimusta edeltävä vai yleinen yhteydenotto.                                             |
| Videopalaveripyyntö palvelun arviointia tai aloitusta varten | GDPR 6(1)(b), jos tapaaminen on pyydetty sopimusta edeltävää arviointia varten | Jos tapaaminen on vain yleinen esittely, 6(1)(b) ei ole automaattinen. Mahdollinen 6(1)(f) vaatii erillisen arvioinnin.               |
| Roskapostin ja väärinkäytösten torjunta                      | Mahdollisesti GDPR 6(1)(f)                                                     | Oikeutettu etu, tarpeellisuus, tietojen minimointi, lyhyt operatiivinen säilytys ja vastustamis-/poikkeustilanteet on dokumentoitava. |

### Oikeutetun edun tasapainotusarvion luonnos

- **Oikeutettu etu:** lomakkeiden ja sähköpostipalvelun suojaaminen roskapostilta,
  automaattiselta väärinkäytöltä ja palvelunestolta sekä palvelun saatavuuden
  ylläpito.
- **Tarpeellisuus:** nykyinen toteutus käyttää rate-limit-arvoa ja IP-osoitteesta
  laskettua hashia eikä tallenna raakaa IP-osoitetta. Hashin säilytysaika on silti
  määriteltävä, eikä tietoja saa käyttää laajempaan profilointiin.
- **Tasapaino:** käyttäjä odottaa kohtuullisia teknisiä väärinkäytösten estotoimia,
  mutta lomakkeiden sisältö ja yhteystiedot ovat henkilötietoja. Pääsy rajataan
  palvelinpuolelle ja ylläpitäjille, käyttö rajataan turvallisuustarkoitukseen ja
  vanhentuneet rate-limit-tiedot poistetaan hyväksytyn operatiivisen säännön mukaan.
- **Alustava johtopäätös:** 6(1)(f) voi olla perusteltavissa rajattuun
  väärinkäytösten torjuntaan, mutta tämä luonnos ei ole yrityksen hyväksymä LIA.
  Jos käsittely perustuu lakiin, kyseinen lakisääteinen velvoite on arvioitava
  erikseen GDPR 6(1)(c):n perusteella.

Julkiseen selosteeseen ei lisätä näitä perusteita lopullisina ennen kuin yritys
on hyväksynyt käyttötarkoituskohtaisen jaon sekä oikeutetun edun arvion.

## Palveluntarjoajien virallinen tietosuojatarkistus

Tarkistus tehtiin 22.10.2026 palveluntarjoajien omien julkisten dokumenttien
perusteella. Tämä ei vahvista TGN Servicesin tilikohtaisia sopimuksia,
asetuksia, projektialuetta tai tilaustasoa.

### Supabase

Supabasen virallisen dokumentaation mukaan projektin ensisijainen PostgreSQL-,
Auth- ja Storage-data sijoitetaan projektia luotaessa valittuun AWS-alueeseen.
Supabasen dokumentaatio kuitenkin korostaa, että aluevalinta ei yksin ole
vaatimustenmukaisuustodistus ja että esimerkiksi tuki, käyttötelemetria,
operatiiviset lokit ja CDN voivat liittyä alueen ulkopuoliseen käsittelyyn.
Supabase tarjoaa DPA:n ja ajantasaisen alikäsittelijälistan.

**Vahvistettu palveluntarjoajan dokumentaatiosta:** aluevalinta, DPA:n olemassaolo,
alikäsittelijälista ja mahdolliset rajatut alueen ulkopuoliset käsittelyt.

**Yrityksen vahvistettava:** `tgn-services`-projektin todellinen AWS-alue,
käytössä oleva DPA, alikäsittelijät, varmuuskopioiden sijainti, Storage-CDN:n
käyttö sekä Supabase-tilin asetukset.

Lähteet: [Supabase regions](https://supabase.com/docs/guides/platform/regions),
[Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum)
ja [Data Residency and Transfers FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq).

### Resend

Resend ilmoittaa virallisessa GDPR-dokumentaatiossaan, että asiakasdataa,
viestisisältöä ja toimituslokeja säilytetään Yhdysvalloissa. Lähetysalueen
valinta vaikuttaa viestin reititykseen ja lähetyspaikkaan, mutta ei siirrä
Resendin säilyttämää dataa EU-alueelle. Resendin DPA sisältää EU:n
vakiosopimuslausekkeet ja Resend kertoo olevansa EU–Yhdysvallat-
Data Privacy Framework -järjestelyssä.

**Vahvistettu palveluntarjoajan dokumentaatiosta:** DPA:n soveltuminen tileihin,
Yhdysvaltoihin sijoittuva säilytys, SCC/DPF-siirtomekanismit ja alikäsittelijälista.

**Yrityksen vahvistettava:** Resend-tilin DPA:n hyväksyntä, lähetysalue,
alikäsittelijät, viestien ja toimituslokien säilytys sekä se, ettei lomakkeiden
viesteihin sisälly tarpeettomia henkilötietoja.

Lähteet: [Resend GDPR](https://resend.com/security/gdpr) ja
[Resend DPA](https://resend.com/legal/dpa).

### Vercel

Vercelin DPA kattaa GDPR:n ja Vercel kertoo palveluinfrastruktuurinsa käyttävän
AWS-, Azure- ja Google Cloud -ympäristöjä. Vercel kertoo myös varmuuskopioiden
olevan alueiden välillä replikoituja. Tämä tarkoittaa, että tuotantoympäristön
palvelin- ja lokitietojen käsittelyalueita ei voi päätellä pelkästä domainista.

**Vahvistettu palveluntarjoajan dokumentaatiosta:** DPA:n olemassaolo,
monipilvi-infrastruktuuri, varmuuskopioiden redundanssi ja siirtoihin liittyvät
sopimusmekanismit.

**Yrityksen vahvistettava:** Vercel-projektin tilaustaso, lokien sisältö ja
säilytys, mahdollisten palvelinfunktioiden henkilötietokäsittely sekä valittu
alue- ja siirtokonfiguraatio.

Lähteet: [Vercel DPA](https://vercel.com/legal/dpa) ja
[Vercel Security & Compliance](https://vercel.com/docs/security/compliance).

### Google Fonts

Google Fontsin oman tietosuojakuvauksen mukaan selain tekee fonttipyynnön
Googlelle, eikä Google Fonts API lähetä evästeitä. Google kuitenkin vastaanottaa
pyynnön tekniset tiedot, kuten IP-osoitteen, ja Googlen yleisen tietosuojakuvauksen
mukaan Google käsittelee tietoja maailmanlaajuisissa palveluissa.

**Vahvistettu palveluntarjoajan dokumentaatiosta:** ulkoinen selainpyyntö,
evästeettömyys ja teknisen pyynnön välttämätön IP-osoite.

**Yrityksen vahvistettava:** Google Fonts -latauksen käyttötarkoitus ja peruste,
mahdolliset siirtojen suojatoimet sekä se, hyväksytäänkö ulkoinen fonttipyyntö.
Yksinkertaisin riskien pienennys olisi fonttien itseisännöinti, mutta sitä ei
toteuteta tässä PR:ssä.

Lähteet: [Google Fonts: Your Privacy and Google Fonts](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html),
[Google Fonts FAQ](https://fonts.google.com/faq) ja
[Google Privacy Policy](https://policies.google.com/privacy).

## Automaattisen poiston ehdotus (ei käytössä)

Omistajan ei tarvitse poistaa yksittäisiä yhteydenottoja käsin, mutta poistoa ei
voi turvallisesti perustaa pelkkään `created_at`-ikään. Nykyisissä
`contact_submissions`, `booking_requests` ja `service_start_requests` -tauluissa
ei ole pyynnön tilaa, sulkemispäivää, aktiiviseen asiakkuuteen yhdistävää
tunnistetta tai lakisääteistä säilytysestettä. Siksi automaatiota ei saa ottaa
käyttöön ennen näiden tietojen ja säilytyssääntöjen hyväksymistä.

### Omistajalle hyväksyttäväksi tarkoitettu malli

Yksinkertaisin turvallinen malli on yksi keskitetty poistofunktio ja yksi
Supabase Cron / `pg_cron` -ajo. Cron ei päätä säilytysajoista eikä arvaa niitä
luontipäivästä, vaan tarkistaa jokaiselta tietueelta ennalta hyväksytyn
elinkaaren ja `retention_until`-päivän.

1. Lisätään erillisessä hyväksytyssä migraatiossa kaikkiin pyyntötyyppeihin
   `status`, `closed_at`, `retention_until` ja `legal_hold`. Palvelun aloituspyyntö
   yhdistetään aktiiviseen asiakkuuteen joko `customer_id`-tunnisteella tai
   muulla yksiselitteisellä, hyväksytyllä viittauksella.
2. Käytetään samoja tiloja kaikissa kolmessa pyynnössä: `open`, `closed`,
   `rejected` ja `converted`. Avoin pyyntö, aktiivinen asiakkuus, oikeusriita,
   lakisääteinen pidätys tai voimassa oleva poistokielto estää poiston.
3. Omistaja hyväksyy etukäteen kullekin tilalle ja tietoryhmälle tapahtuman,
   joka käynnistää säilytysajan. Esimerkiksi hylätty pyyntö voi siirtyä
   poistokelpoiseksi vasta hylkäyksen jälkeen, kun taas `converted`-pyyntöä
   säilytetään aktiivisen asiakkuuden ja lakisääteisten velvoitteiden ajan.
   Tässä PR:ssä ei päätetä kuukausi- tai vuosimääriä.
4. Päivittäinen poistofunktio poistaa vain tietueet, joissa tila on suljettu,
   `retention_until` on ohitettu, aktiivista asiakkuutta ei ole ja `legal_hold`
   on epätosi. Se käsittelee lähdepyynnön ja sen `email_outbox`-tietueet yhdessä.
5. Lähettämättömiä, epäonnistuneita tai vielä käsittelyssä olevia viestejä ei
   poisteta ennen kuin niiden käsittely on ratkaistu. Resendin omat viestit,
   lokit ja varmuuskopiot käsitellään palveluntarjoajan säilytys- ja
   poistomekanismilla erikseen.
6. `form_rate_limits` käsitellään erillisenä operatiivisena datana. Koska
   IP-hash voi olla henkilötietoa, sille hyväksytään lyhyt, käyttötarkoitukseen
   sidottu säilytysikkuna ja se poistetaan erillisellä siivouksella.
7. Cron tekee ensin kuivaharjoituksen. Tuotannossa lokiin tallennetaan vain ajo,
   lukumäärät, ohitusten syyt ja virheet. Hälytys lähetetään epäonnistumisesta
   tai poikkeavasta poistomäärästä.

### Käyttöönoton hyväksymispäätökset

Yrityksen on hyväksyttävä ennen migraatiota ja Cron-ajon käyttöönottoa:

- pyyntöjen tilat ja kuka saa sulkea tai muuttaa niitä;
- kunkin tietoryhmän poistotapahtuma ja säilytysajan pituus tai muu objektiivinen
  kriteeri;
- miten aktiivinen asiakkuus, lakisääteinen velvoite ja oikeusriita merkitään;
- `email_outbox`-, Resend-, loki- ja varmuuskopiokopioiden poistaminen;
- kuivaharjoituksen hyväksymisraja, hälytysosoite ja palautusmenettely.

Ehdotusta ei toteuteta tässä PR:ssä eikä tietoja poisteta.

## Ennen julkaisua vahvistettava lista

- Rekisterinpitäjän virallinen postiosoite puuttuu vielä vahvistettavista yritystiedoista.
- Onko yritys nimennyt tietosuojavastaavan; jos on, hänen yhteystietonsa.
- Tavallisen yhteydenoton, videopalaveripyynnön ja väärinkäytösten torjunnan GDPR:n mukaiset käsittelyperusteet.
- Lomakkeiden pakollisten tietojen tarpeellisuus ja mahdolliset lakisääteiset vaatimukset.
- Tietokannan, sähköposti-outboxin, rate-limit-hashien, lokien ja varmuuskopioiden säilytysajat tai objektiiviset määräytymisperusteet.
- Supabasen, Resendin, Vercelin ja Google Fonts -palvelun tilikohtaiset ehdot, asetukset, alikäsittelijät ja kansainvälisten siirtojen suojatoimet.
- Menettely rekisteröidyn tarkastus-, oikaisu-, poisto-, rajoitus- ja vastustamispyyntöihin sekä määräaikojen seuranta.
- Tietoturvaloukkausten ilmoitus- ja dokumentointimenettely.

Julkinen seloste sisältää nyt vahvistetun yritysnimen, Y-tunnuksen ja sähköpostin,
palvelunaloituspyynnön vahvistetun käsittelyperusteen sekä tiedon siitä, ettei
lomaketietoja käytetä erilliseen suoramarkkinointiin. Postiosoite, mahdollinen
tietosuojavastaava, muut käsittelyperusteet ja säilytysmalli on vahvistettava
ennen kuin selostetta voidaan pitää lopullisesti julkaisuvalmiina.
