# Vercel Preview -käyttöönotto

## Projektiasetukset

- **Framework Preset:** TanStack Start
- **Build Command:** `bun run build` (tai Vercelin automaattisesti tunnistama `vite build`)
- **Install Command:** `bun install`
- **Root Directory:** repositoryn juuri
- **Tuotantoa tai DNS:ää ei tarvitse muuttaa** tämän branchin testaamista varten.

Repo sisältää nyt `vercel.json`-tiedoston, joka tekee TanStack Start -framework-tunnistuksesta eksplisiittisen. Nitro muodostaa Vercel Build Output API v3 -rakenteen, kun build ajetaan Vercelin ympäristössä.

## Preview-ympäristöön tarvittavat muuttujat

Lisää Vercelin Project Settings → Environment Variables -näkymässä vähintään nämä muuttujat **Preview**-ympäristöön:

```text
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

`SUPABASE_SERVICE_ROLE_KEY` on vain server-side muuttuja. Älä lisää siihen `VITE_`-etuliitettä äläkä paljasta sitä selaimelle.

`SUPABASE_URL` ja `SUPABASE_PUBLISHABLE_KEY` tarvitaan server-side uutis- ja lomaketoimintoihin. `VITE_*`-muuttujat tarvitaan selaimen Supabase-clientille ja ne näkyvät buildin client-koodissa; niiden pitää siksi olla vain publishable-arvoja.

Vercelissä muuttujat pitää lisätä erikseen Preview-ympäristöön. Paikallinen `.env` ei ole luotettava tapa konfiguroida Vercelin runtimea.

## Väliaikainen logosivu

`versio-1.0`-haaran lähdekoodissa ei ole väliaikaisen logosivun toteutusta eikä se lue `VITE_TEMPORARY_LOGO_PAGE`-muuttujaa. Jos Vercel-projektissa on kyseinen muuttuja aiemman branchin jäljiltä, se ei vaikuta tähän branchiin.

## Deploy ja validointi

1. Pushaa branch tai avaa PR.
2. Varmista, että Preview-deploy käyttää tätä branchia.
3. Tee uusi deploy ympäristömuuttujien lisäämisen jälkeen.
4. Tarkista `/`, `/care-kotiin`, `/varaa` ja `/auth`.
5. Tarkista deploymentin Functions-logeista, ettei Supabase-muuttujista tule puuttumisvirheitä.

Jos Supabase-muuttujat puuttuvat, etusivu pystyy nyt renderöitymään ilman uutiskortteja. Lomakkeet, uutiset ja kirjautuminen tarvitsevat silti toimivan Supabase-konfiguraation.
