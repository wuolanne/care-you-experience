# Admin v2 -regressiotestaus

## Testitasot

`npm run test:unit` ajaa Vitest-testit ilman ulkoista tietokantaa. Ne kattavat
sisältömallit, luonnos/julkaisu-erottelun, kielifallbackit, palvelukorttien ja
asiakasetujen näkyvyyden, hinnoittelun, henkilöstön, autentikoinnin ja
käyttöoikeuksien apufunktiot sekä virhetilanteiden mallinnuksen.

`npm run test:smoke` käynnistää paikallisen dev-palvelimen ja ajaa julkisten
reittien read-only-savutestit desktop- ja mobiiliprofiileilla.

`npm run test:e2e` ajaa julkiset savutestit ja anonyymin käyttäjän admin-reittien
suojauksen. Se ajaa lisäksi autentikoidut Admin v2:n read-only-testit vain, jos
`E2E_ADMIN_STORAGE_STATE` on asetettu.

`npm run test:all` ajaa yksikkötestit, buildin ja turvalliset E2E-testit.

## Autentikoitu Admin v2 -testaus

Autentikoitu testaus edellyttää erillistä Supabase-testiprojektia ja siinä
luotua admin-käyttäjää. Storage state -tiedostoa ei saa tallentaa GitHubiin.

```powershell
$env:E2E_BASE_URL = "http://127.0.0.1:5173"
$env:E2E_ADMIN_STORAGE_STATE = "C:\secure\tgn-admin-storage-state.json"
npm run test:e2e
```

Nykyinen testipaketti ei tee kirjoittavia Admin v2 -toimintoja Preview- tai
tuotantotietokantaan. Kirjoittavat E2E-testit voidaan lisätä vasta, kun
testipalvelin käyttää eristettyä Supabase-projektia ja testidatan siivous on
varmistettu. Oikean projektin tunnuksia tai service-role-avaimia ei saa käyttää
testien ympäristömuuttujina.

## GitHub Actions

CI ajaa TypeScript-tarkistuksen, yksikkötestit, buildin ja julkiset smoke-testit.
Adminin autentikoitua E2E-testausta ei ajeta CI:ssä ilman erillistä, suojattua
testiprojektia ja lyhytikäistä storage state -salaisuutta.

Playwright tallentaa epäonnistumisesta kuvakaappauksen ja trace-tiedoston.
HTML-raportti syntyy `playwright-report/`-hakemistoon, eikä sitä tule commitata.
