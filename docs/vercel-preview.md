# Vercel Preview – versio-1.0

## Korjauksen tausta

Etusivun route loader lataa julkiset uutiset SSR-vaiheessa. Jos Preview-deploymentin
palvelinympäristöstä puuttuvat `SUPABASE_URL` tai `SUPABASE_PUBLISHABLE_KEY`,
uutisfunktio ei saa kaataa koko etusivua. Korjaus palauttaa tällöin tyhjän uutislistan
ja kirjaa varoituksen palvelinlogiin.

Vercel tarvitsee silti Supabase-muuttujat, jotta autentikointi, uutiset, ylläpito ja
lomakkeiden lähetys toimivat kokonaan.

## Vercel Preview -asetukset

Vercel-projektissa määritä nämä muuttujat **Preview**-ympäristöön:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

`SUPABASE_SERVICE_ROLE_KEY` on palvelinsalaisuus. Sitä ei saa nimetä `VITE_`-alkuiseksi
eikä lisätä GitHubiin tai selaimeen.

Suositeltavat Vercel-projektiasetukset:

- Framework Preset: `TanStack Start`
- Install Command: `bun install`
- Build Command: `bun run build`
- Root Directory: repositoryn juurikansio
- Environment: lisää muuttujat Preview-kohtaan

Tallenna muuttujat ja käynnistä uusi Preview-deployment branchista
`fix/versio-1.0-vercel`.

## Tietokanta ja Supabase

Repository sisältää Drizzle-migraatiot kansiossa `drizzle/migrations`. Vercel-build ei
aja niitä automaattisesti. Supabase-projektin ylläpitäjän on varmistettava, että kaikki
kuusi migraatiota on ajettu oikeaan Supabase-projektiin ja että `news-images`-storage-
bucket on olemassa.

Tarkistettu read-only API:n kautta:

- `news`-taulu vastaa HTTP 200
- `booking_requests`-taulu vastaa HTTP 200
- `contact_submissions`-taulu vastaa HTTP 200
- `service_start_requests`-taulu vastaa HTTP 200
- `has_role`-funktio on olemassa; anonyymi kutsu hylätään odotetusti oikeusvirheellä
- `news-images`-objektien listaus vastaa HTTP 200

Älä aja kirjoittavia lomaketestejä tuotannon tai oikean asiakkaan tiedoilla.

## Previewn tarkistus

Tarkista deploymentin lokista, ettei SSR-vastauksissa ole 500-virheitä. Käy vähintään
läpi `/`, `/care-kotiin`, `/care-yrityksille`, `/care-palveluseteli`,
`/hinnoittelu`, `/varaa`, `/meista` ja `/auth`.

Autentikointi ja ylläpitosivut vaativat Supabase Preview -muuttujat sekä vahvistetun
ylläpitäjätilin. Lomakkeet voidaan tarkistaa vain validoimalla käyttöliittymä ja
Supabase-konfiguraatio; oikeaa asiakasviestiä tai tilausta ei pidä lähettää.

Tämä branch ei muuta Vercelin Production Branch -asetusta, DNS-asetuksia tai
`main`-branchia.
