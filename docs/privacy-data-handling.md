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

## Ennen julkaisua vahvistettava lista

- Rekisterinpitäjän virallinen nimi ja postiosoite.
- Onko yritys nimennyt tietosuojavastaavan; jos on, hänen yhteystietonsa.
- Kunkin käyttötarkoituksen GDPR:n mukainen käsittelyperuste.
- Lomakkeiden pakollisten tietojen tarpeellisuus ja mahdolliset lakisääteiset vaatimukset.
- Tietokannan, sähköposti-outboxin, rate-limit-hashien, lokien ja varmuuskopioiden säilytysajat.
- Supabasen, Resendin, Vercelin ja Google Fonts -palvelun käsittelijäehdot, sijainti, alikäsittelijät ja kansainvälisten siirtojen suojatoimet.
- Menettely rekisteröidyn tarkastus-, oikaisu-, poisto-, rajoitus- ja vastustamispyyntöihin sekä määräaikojen seuranta.
- Tietoturvaloukkausten ilmoitus- ja dokumentointimenettely.

Kun nämä tiedot on vahvistettu, päivitä `/tietosuoja`-sivun tekstit ja tämä dokumentti. Älä esitä keskeneräisiä tietoja lopullisesti vahvistettuina.
