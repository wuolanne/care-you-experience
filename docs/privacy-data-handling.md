# TGN Services – henkilötietojen käsittelyn nykytila

Tämä dokumentti kuvaa tämän version lähdekoodiin perustuvan nykytilan. Se ei korvaa yrityksen omistajan tai juristin tekemää GDPR-arviointia. Julkinen seloste on reitissä `/tietosuoja`.

## Lähdekoodissa havaitut tietovirrat

| Toiminto | Kerättävät kentät | Tallennus |
| --- | --- | --- |
| Yhteydenottopyyntö | sähköposti, viesti, lomakkeen kieli | Supabase `contact_submissions` ja ilmoituksen `email_outbox` |
| Videopalaveripyyntö | sähköposti, toivottu päivämäärä, kellonaika, lomakkeen kieli | Supabase `booking_requests` ja ilmoituksen `email_outbox` |
| Palvelunaloituspyyntö | nimi, yhteyshenkilö, sähköposti, työkohteen osoite, aloituspäivä ja -aika, palvelutyyppi, kertakäynnin lisätiedot tai kuukausipaketin nimi, lomakkeen kieli | Supabase `service_start_requests` ja ilmoituksen `email_outbox` |
| Ylläpitotili | kirjautumiseen tarvittavat tilitiedot | Supabase Auth |

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

## Automaattisen poiston ehdotus (ei käytössä)

Omistajan ei tarvitse poistaa yksittäisiä yhteydenottoja käsin, mutta poistoa ei
voi turvallisesti perustaa pelkkään `created_at`-ikään. Nykyisissä
`contact_submissions`, `booking_requests` ja `service_start_requests` -tauluissa
ei ole pyynnön tilaa, sulkemispäivää, aktiiviseen asiakkuuteen yhdistävää
tunnistetta tai lakisääteistä säilytysestettä. Siksi automaatiota ei saa ottaa
käyttöön ennen näiden tietojen ja säilytyssääntöjen hyväksymistä.

Ehdotettu toteutus Supabase Cron / `pg_cron` -ympäristössä:

1. Lisätään erillisessä hyväksytyssä migraatiossa pyyntöjen elinkaaren tiedot,
   esimerkiksi `status`, `closed_at`, `retention_until` ja `legal_hold`. Aktiivinen
   asiakkuus tai avoin käsittely merkitään säilytyksen estäväksi ehdoksi.
2. Ajastettu, palvelinpuolen oikeuksilla suoritettava poistofunktio valitsee vain
   pyynnöt, joiden käsittely on suljettu, `retention_until` on ohitettu, aktiivista
   asiakkuutta ei ole, lakisääteistä säilytysestettä ei ole eikä oikeusriitaa tai
   muuta hyväksyttyä pidätystä ole.
3. `email_outbox` käsitellään yhdessä alkuperäisen pyynnön kanssa. Lähettämättömiä,
   epäonnistuneita tai vielä käsittelyssä olevia viestejä ei poisteta ennen kuin
   niiden käsittely- ja säilytysperuste on ratkaistu. Palveluntarjoajan omat
   viestikopiot ja lokit arvioidaan erikseen, koska tietokantarivin poistaminen ei
   poista niitä.
4. `form_rate_limits` ei ole asiakaspyyntöjen arkisto. Sen vanhentuneet
   rate-limit-avaimet voidaan myöhemmin siivota erillisellä, lyhyen operatiivisen
   säilytysperusteen mukaisella tehtävällä, mutta säilytysaikaa ei päätetä tässä.
5. Supabase Cronin ajo kirjataan vain metatietona: ajon aika, valittu tietuelukumäärä,
   poistettujen tietueiden lukumäärä, ohitusten lukumäärä ja virhe. Asiakastietoja
   tai sähköpostiosoitteita ei kirjoiteta lokiin. Hälytys tarvitaan, jos ajo
   epäonnistuu tai poistettujen tietueiden määrä poikkeaa hyväksytystä vaihtelusta.
6. Ennen käyttöönottoa tehdään kuivaharjoitus, jossa raportoidaan vain lukumäärät
   ja syyt. Varsinainen poisto vaatii erillisen hyväksynnän ja palautusmenettelyn.

Poiston käyttöönottoa varten yrityksen on päätettävä vähintään: pyyntöjen
elinkaaren tilat, eri käyttötarkoitusten säilytysperusteet, asiakkuuden ja
lakisääteisten velvoitteiden tunnistaminen, oikeusriitojen pidätys, outboxin ja
palveluntarjoajien kopioiden käsittely, cron-ajon valvonta sekä palautus- ja
poikkeusmenettely. Mitään näistä ei toteuteta tässä PR:ssä.

## Ennen julkaisua vahvistettava lista

- Rekisterinpitäjän virallinen postiosoite puuttuu vielä vahvistettavista yritystiedoista.
- Onko yritys nimennyt tietosuojavastaavan; jos on, hänen yhteystietonsa.
- Tavallisen yhteydenoton, videopalaveripyynnön ja väärinkäytösten torjunnan GDPR:n mukaiset käsittelyperusteet.
- Lomakkeiden pakollisten tietojen tarpeellisuus ja mahdolliset lakisääteiset vaatimukset.
- Tietokannan, sähköposti-outboxin, rate-limit-hashien, lokien ja varmuuskopioiden säilytysajat tai objektiiviset määräytymisperusteet.
- Supabasen, Resendin, Vercelin ja Google Fonts -palvelun käsittelijäehdot, sijainti, alikäsittelijät ja kansainvälisten siirtojen suojatoimet.
- Menettely rekisteröidyn tarkastus-, oikaisu-, poisto-, rajoitus- ja vastustamispyyntöihin sekä määräaikojen seuranta.
- Tietoturvaloukkausten ilmoitus- ja dokumentointimenettely.

Julkinen seloste sisältää nyt vahvistetun yritysnimen, Y-tunnuksen ja sähköpostin
sekä palvelunaloituspyynnön vahvistetun käsittelyperusteen. Postiosoite,
mahdollinen tietosuojavastaava, muut käsittelyperusteet ja säilytysmalli on
vahvistettava ennen kuin selostetta voidaan pitää lopullisesti julkaisuvalmiina.
