# Sähköposti-ilmoitukset

Lomakkeet tallentavat pyynnön ensin Supabaseen ja muodostavat samalla `email_outbox`-rivin. Palvelin yrittää tämän jälkeen lähettää ilmoituksen Resendin kautta. Tietokantaan tallennettu pyyntö ei katoa, vaikka Resend tai ympäristömuuttujat eivät olisi käytettävissä.

## Lomakkeet

Ilmoitukset lähetetään näistä lomakkeista:

- yhteydenottopyyntö (`/tarjouspyynto`)
- videopalaveripyyntö (`/varaa`)
- palvelun aloituspyyntö (`RequestForm`, esimerkiksi `/care-kotiin` ja `/care-yrityksille`)

Sähköpostiin sisällytetään vain lomakkeen olemassa olevat kentät. Asiakkaan sähköpostiosoite asetetaan `reply_to`-osoitteeksi.

## Resend-käyttöönotto

1. Luo Resend-tili ja lisää lähettävä domain.
2. Lisää Resendin DNS-ohjeiden mukaiset varmennustietueet.
3. Odota, että domain on Resendissä tilassa `Verified`.
4. Luo API-avain, jolla on vain tarvittava lähetysoikeus.
5. Aseta `EMAIL_FROM` käyttämään varmennettua domainia, esimerkiksi `TGN Services <noreply@oma-verifioitu-domain.fi>`.

Älä käytä keksittyä tai varmentamatonta osoitetta. Yrityksen varsinaista lähettäjä- tai vastaanottajaosoitetta ei säilytetä tässä repositoriossa.

## Ympäristömuuttujat

Palvelinpuolen muuttujat Vercelin Preview-ympäristöön:

```text
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-role-key>
RESEND_API_KEY=<server-only-resend-api-key>
EMAIL_FROM=TGN Services <noreply@verified-domain.example>
CONTACT_EMAIL=<company-contact-address>
BOOKING_EMAIL=
SERVICE_START_EMAIL=
```

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` ja `VITE_SUPABASE_PROJECT_ID` säilyvät selaimen Supabase-clientiä varten. `RESEND_API_KEY` ja `SUPABASE_SERVICE_ROLE_KEY` eivät saa koskaan alkaa `VITE_`-etuliitteellä.

Vastaanottajat valitaan keskitetysti näin:

- `CONTACT_EMAIL` on oletus kaikille ilmoituksille.
- `BOOKING_EMAIL` korvaa oletuksen videopalavereille, jos se on asetettu.
- `SERVICE_START_EMAIL` korvaa oletuksen palvelun aloituspyynnöille, jos se on asetettu.
- Yhdessä muuttujassa voi käyttää pilkulla eroteltuja osoitteita.

## Vercel Preview

Lisää muuttujat Vercelissä Project Settings → Environment Variables → Preview. Tee uusi Preview-deployment muuttujien lisäämisen jälkeen. Älä muuta Production Branchia, DNS-asetuksia tai tuotannon logosivua tämän työn yhteydessä.

Supabase-migraatio `drizzle/migrations/0006_email_outbox.sql` on ajettava siihen Supabase-projektiin, jota Preview käyttää. Migraatio luo atomiset tallennusfunktiot, outbox-taulun, lomakekohtaisen hashatun IP-bucket-rajoituksen ja videopalaveripyyntöjen kestävän sähköpostikohtaisen rate limitin. Raakoja IP-osoitteita ei tallenneta.

## Tilat ja virheenkäsittely

Outbox erottaa nämä tilat:

- `pending`: tallennettu ja valmis lähetysyritykseen
- `processing`: yksi worker käsittelee lähetystä
- `accepted`: Resend hyväksyi pyynnön API:ssa
- `failed`: Resendin kutsu epäonnistui; seuraava yritys voi yrittää uudelleen
- `blocked`: lähetys on estetty puuttuvan konfiguraation vuoksi

`accepted` ei tarkoita, että sähköposti on varmasti toimitettu vastaanottajan postilaatikkoon. Lopullinen toimitus, bounce- ja complaint-tieto tulee tarkistaa Resendistä ja tarvittaessa ottaa webhookit käyttöön erillisenä jatkotyönä.

Palvelin palauttaa asiakkaalle onnistumisen, kun Supabase-tallennus on onnistunut. Resend-virhe ei paljasta sisäistä virhettä eikä hävitä tallennettua pyyntöä.

## Uudelleenlähetys

Outbox käyttää lomakkeen idempotenssiavainta sekä Resendin `Idempotency-Key`-otsaketta. Sama pyyntö ei luo uutta tietokantariviä eikä samaa lähetysyritystä tule käsitellä kahdesti. Epäonnistuneet yritykset säilyvät outboxissa ja niille asetetaan uusi `available_at`-aika.

Palvelinmoduulin `retryPendingEmailOutbox()` on tarkoitettu suojatun cron-ajon tai muun ylläpitotyön kutsuttavaksi. Se tulee kytkeä ympäristön omaan scheduler-ratkaisuun ennen tuotantokäyttöönottoa; tässä branchissa ei muuteta Vercelin tuotantoasetuksia automaattisesti.

## SPF, DKIM ja DMARC

Lisää Resendin antamat SPF- ja DKIM-tietueet lähettävälle domainille. Julkaise lisäksi DMARC-politiikka organisaation sähköpostikäytännön mukaisesti. Aloita valvovalla politiikalla (`p=none`), tarkista raportointi ja kiristä politiikkaa vasta hallitun käyttöönoton jälkeen.

## Testaus

Testit käyttävät mockattua `fetch`-toteutusta. Ne eivät lähetä oikeita sähköposteja tai asiakaspyyntöjä.

```text
bun install --frozen-lockfile
bun run vitest run
bun run build
```

Ennen tuotantoa tarkista lisäksi Resendin testilähetys varmennetulla domainilla, Supabase-migraation tila, outboxin `accepted`-rivit ja Resendin delivery/bounce-tapahtumat. Tuotannon käyttöönotto vaatii myös todelliset Vercel Preview -ympäristömuuttujat sekä erillisen hyväksynnän.
