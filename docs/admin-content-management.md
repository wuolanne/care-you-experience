# Admin v2 – sisältöjen ja julkisten tietojen hallinta

Admin v2 käyttää nykyistä Supabase Auth -kirjautumista ja `user_roles`-taulun
`admin`-roolia. Uudet näkymät ovat:

- `/admin/sisallot` – sivukohtaiset luonnokset, julkaisut, yhteystiedot ja kuvat
- `/admin/asiakaspalautteet` – palautteen luonnos, julkaisulupa, julkaisu ja piilotus
- `/admin/sosiaalinen-media` – footerin nykyisten kuvakkeiden URL-, näkyvyys- ja järjestysasetukset

## Migraatio

Uusi repositorymigraatio on
`drizzle/migrations/0010_admin_content_management.sql`. Numero `0009` jätettiin
väliin, koska Lovable-kehityshaarassa voi olla samanniminen erillinen migraatio.
Migraatio 0010 luo seuraavat taulut:

- `site_content`
- `site_contact_details`
- `site_images`
- `customer_reviews`
- `social_links`

Lisäksi se luo julkaisuille julkisen `site-images`-bucketin ja luonnoksille
yksityisen `site-images-drafts`-bucketin sekä RLS-käytännöt. `news-images`-bucketia
ei muuteta. Migraatiota ei ajeta automaattisesti tässä branchissa. Supabaseen
kirjoittaminen edellyttää erillistä hyväksyntää ja Drizzlen migraatioseurannan
käyttöä.

## Sisältöjen toimintamalli

Jokainen sivu ja kieli tallennetaan erillisenä rivinä. Luonnos säilytetään
`draft_content`-kentässä ja julkinen versio `published_content`-kentässä.
Julkinen sivusto lukee vain julkaistun version. Jos riviä ei ole tai julkaistua
versiota ei ole, komponentti käyttää nykyistä lähdekoodiin pakattua käännöstä.
Ensimmäinen tallennus ei tyhjennä aiemmin julkaistua versiota.

Tuetut kielet ovat `fi`, `sv`, `es` ja `en`. Sisältöä ei käännetä automaattisesti.

## Kuvat

Sallitut tiedostot ovat PNG, JPEG, WebP ja AVIF, enintään 5 Mt. Sovellus tekee
turvallisen polun itse UUID-tunnisteella eikä käytä käyttäjän tiedostonimeä
Storage-polun rakentamiseen. Luonnoskuva ladataan yksityiseen
`site-images-drafts`-bucketiin ja kopioidaan `site-images`-bucketin julkiseksi
tiedostoksi vasta julkaisemisen yhteydessä. Vain admin voi ladata tai muokata
kuvia. Julkinen API lukee sisältöä ja kuvia vain julkaisuun tarkoitetuista
näkymistä; luonnospolut ja luonnostekstit haetaan adminille suojatuilla
funktioilla. `news-images`-bucketia ei muuteta.

## Palautteet

Palaute näkyy julkisella sivustolla vain, jos se on julkaistu, julkaisulupa on
vahvistettu ja palaute ei ole piilotettu. Jos julkaistuja palautteita ei ole,
palauteosio piilotetaan kokonaan. Arvosteluille ei lisätä Review- tai
AggregateRating-structured dataa.

Jos palautteen tallennus tai julkaisu epäonnistuu ennen migraation käyttöönottoa,
yleisin syy on puuttuva `customer_reviews`-taulu. Tällöin sovelluskoodia ei pidä
ohittaa tai kiertää, vaan migraatio 0010 on ensin tarkistettava ja ajettava
hyväksytyssä Supabase-ympäristössä. Käyttöliittymä näyttää käyttäjälle yleisen
virheilmoituksen eikä paljasta Supabase-virheen yksityiskohtia.

## Yhteystiedot ja Resend

Footerin julkiset yhteystiedot voidaan muuttaa admin-paneelista. Julkisen
sähköpostiosoitteen muuttaminen ei muuta Resend-ilmoitusten vastaanottajia;
ilmoitusreititys säilyy palvelinpuolen ympäristömuuttujissa.

## Manuaalinen käyttöönotto

1. Tarkista migration diff ja ota tietokannasta varmuuskopio.
2. Aja `0010_admin_content_management.sql` Drizzlen nykyistä migraatiohistoriaa
   käyttäen, älä suorita `0000–0008` uudelleen.
3. Varmista RLS-käytännöt, `site-images`- ja `site-images-drafts`-bucketit sekä
   admin-käyttäjän rooli.
4. Verceliin ei lisätä uusia salaisia avaimia. Nykyinen Supabase-julkinen URL ja
   publishable key riittävät selaimen käyttöön.
5. Testaa Previewssa ensin luonnos, julkaisu, palautteen lupatarkistus, kuva ja
   some-linkin validointi. Oikeita asiakaspyyntöjä tai sähköposteja ei tarvita.

Tuotannon logosivua, Production Branchia, DNS-asetuksia ja indeksointia ei muuteta
Admin v2:n käyttöönoton yhteydessä.
