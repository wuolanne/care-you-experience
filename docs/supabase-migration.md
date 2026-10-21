# TGN Services – oman Supabase-projektin käyttöönotto

Tämä ohje valmistaa puhtaan Supabase-projektin nimeltä `tgn-services`. Vanhan
Lovable Cloud -projektin rivejä ei siirretä eikä vanhaa projektia poisteta.

## Migraatiot

Aja migraatiot järjestyksessä puhtaaseen Supabase-projektiin:

1. `0000_news_and_editor_roles.sql`
2. `0001_verified_news_administrator.sql`
3. `0002_restrict_role_function_execution.sql`
4. `0003_booking_requests.sql`
5. `0004_home_service_requests.sql`
6. `0005_service_start_request_details.sql`
7. `0006_email_outbox.sql` – sama migraatio kuin avoimessa PR #3:ssa
8. `0007_news_images_bucket.sql`

`0006_email_outbox.sql` otetaan tässä branchissa mukaan vain tietokannan
valmiuden ja PR #3 -yhteensopivuuden vuoksi. Sähköpostin palvelinkoodi tulee
käyttöön vasta, kun PR #3 hyväksytään ja yhdistetään erikseen. Migraatiota ei
saa ajaa uudelleen, jos Supabase on jo merkinnyt sen suoritetuksi.

Migraatiot voi ajaa Drizzlillä käyttäen suoraa Postgres-yhteyttä:

```powershell
$env:SUPABASE_DB_URL = "postgresql://postgres:<salasana>@db.<project-ref>.supabase.co:5432/postgres"
bunx drizzle-kit migrate
```

Vaihtoehtoisesti SQL-tiedostot voi suorittaa Supabase SQL Editorissa yksi
kerrallaan samassa järjestyksessä. Tätä branchia ei ole yhdistetty etäiseen
Supabaseen, eikä migraatioita ole ajettu automaattisesti.

## Luotavat ominaisuudet

Migraatiot luovat:

- uutiset, monikieliset uutiskentät ja julkaisutilan,
- `user_roles`-taulun ja admin-roolin tarkistuksen,
- varmistetun ylläpitäjän Auth-triggerin,
- uutisten, yhteydenottojen, videopalaverien ja palvelun aloitusten RLS:t,
- lomakepyyntöjen sähköposti-outboxin ja idempotenssin PR #3:a varten,
- yksityisen `news-images`-bucketin,
- bucketin julkaistujen kuvien luku- ja ylläpitäjän muokkauskäytännöt.

`news-images` ei ole julkinen bucket. Julkaistujen uutisten kuvat luetaan
allekirjoitetuilla URL-osoitteilla; ylläpitäjän kuvien lataus, päivitys ja poisto
vaatii Auth-käyttäjältä `admin`-roolin.

## Ensimmäisen admin-käyttäjän valmistelu

1. Luo ylläpitäjän käyttäjä Supabase Authissa tai sovelluksen
   `/auth`-rekisteröinnillä.
2. Vahvista sähköpostiosoite.
3. Tarkista käyttäjän UUID Supabase Authin käyttäjälistasta.
4. Jos nykyinen triggeri ei lisää roolia automaattisesti, lisää rooli SQL
   Editorissa käyttäen oikeaa UUID:tä:

```sql
insert into public.user_roles (user_id, role)
values ('<auth-user-uuid>', 'admin')
on conflict (user_id, role) do nothing;
```

Älä anna `service_role`-avainta selaimelle. Admin-sivun palvelinfunktio
varmistaa käyttäjän JWT:n ja `has_role` tarkistaa roolin RLS:n rinnalla.

## Ympäristömuuttujat

Vercelin Preview-ympäristöön tarvitaan:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_SUPABASE_PROJECT_ID=<project-ref>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

`SUPABASE_SERVICE_ROLE_KEY` on vain palvelinpuolen muuttuja. `SUPABASE_DB_URL`
on tarkoitettu migraatiokoneelle, eikä sitä tarvitse lisätä Verceliin.

Kun PR #3 otetaan käyttöön, lisää Preview-ympäristöön lisäksi `RESEND_API_KEY`,
`EMAIL_FROM`, `CONTACT_EMAIL` ja tarvittaessa `BOOKING_EMAIL` sekä
`SERVICE_START_EMAIL`. PR #3:n sähköpostikoodi käyttää samaa Supabase-projektia
ja `0006_email_outbox.sql`-migraatiota; sitä ei pidä toteuttaa uudelleen tässä
siirtotyössä.

## Auth ja OAuth

Sovellus käyttää oman Supabase-projektin Authia. Aseta Supabase Dashboardissa:

- Site URL Preview-deploymentin osoitteeseen,
- Redirect URL `https://<preview-domain>/auth`,
- Google-providerin OAuth-tunnukset, jos Google-kirjautumista käytetään.

Sovelluksen kirjautumissivu käyttää Supabase Password Authia ja Supabase
Google OAuthia. Lovable-tilin kirjautumisadapteri ei enää kuulu runtimeen.

## Lovable Cloudin säilyttäminen

Vanhaa Lovable Cloud -projektia, tietokantaa tai testidataa ei poisteta tässä
muutoksessa. Tuotannon logosivuhaaraan tai Vercelin Production Branchiin ei
tehdä muutoksia. Lovable-editorin Vite-integraatio voidaan säilyttää
kehitystyötä varten, mutta sovelluksen runtime-data, Auth ja Storage tulevat
omasta Supabasesta.
