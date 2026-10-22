# Julkisten sisältöjen käyttöoikeusauditointi

Auditointi tehtiin branchissa fix/privacy-footer lähdekoodin, migraatioiden
0000–0013 ja julkisten kyselyjen perusteella. Tämä dokumentti ei sisällä
asiakastietoja eikä muuta tietokantaa.

## Rajat ja varmistustaso

Staattisesti vahvistettu:

- julkiset Supabase-kyselyt ja niiden käyttämät taulut, näkymät ja RPC:t;
- migraatioiden RLS-politiikat, GRANT/REVOKE-määritykset ja SECURITY DEFINER -funktiot;
- hiljaiset virhemuunnokset tyhjäksi listaksi, null-arvoksi tai fallback-sisällöksi;
- has_role()-funktion käyttö ja roolikohtaiset EXECUTE-oikeudet.

Live-tietokantatestiä ei voitu vahvistaa tässä ympäristössä. Supabase CLI:tä ei
ole käytettävissä eikä SUPABASE_ACCESS_TOKEN ole tämän prosessin ympäristössä.
Paikallinen .env osoittaa Supabase-projektiin glzmuhrbcmbvykpbcrst, ei
tarkoitettuun projektiin yhqtdbbrymtrnkifcyws. Vercel Previewn muuttujia ei
voitu lukea turvallisesti tästä checkoutista. Siksi anon-, tavallisen käyttäjän
ja adminin live-tuloksia ei merkitä testatuiksi.

## Sisältöryhmien auditointitaulukko

| Sisältö / toiminto | Supabase-taulu, näkymä tai RPC | Julkinen kysely | RLS / käyttöoikeus | Anon-tulos | Tavallinen käyttäjä | Admin | Havaitut virheet | Korjausehdotus | Riski |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Asiakaspalautteet ja tähtiarviot | customer_reviews | publicReviewsQuery | customer_reviews_public_read + customer_reviews_admin_write | Live vahvistamatta; SQL:n perusteella politiikka voi kaatua has_role()-oikeusvirheeseen. | Julkaistu, suostumuksellinen ja piilottamaton sisältö on tarkoitettu näkyväksi. | Kaikki rivit admin-politiikan kautta. | Julkisessa politiikassa on OR public.has_role(...), mutta 0002 poistaa anon-roolilta funktion EXECUTE-oikeuden. Kysely käyttää select("*"). | Erottele julkinen politiikka ilman has_role()-kutsua ja admin-politiikka authenticated-roolille. Harkitse rajattua julkista näkymää. | Korkea |
| Sosiaalisen median linkit | social_links | publicSocialLinksQuery | social_links_public_read + social_links_admin_write | Live vahvistamatta; sama anon-funktion käyttöoikeusriski kuin palautteissa. | visible = true -rivit on tarkoitettu näkyviksi. | Kaikki rivit admin-politiikan kautta. | Julkinen politiikka kutsuu has_role()-funktiota anon-kontekstissa. Virhe muuttuu tyhjäksi listaksi ja footer voi käyttää staattista fallbackia. | Poista admin-tarkistus julkisesta politiikasta ja pidä admin-politiikka erillisenä. | Korkea |
| Yrityksen yhteystiedot | site_contact_details | publicSiteContactQuery | site_contact_public_read, vain id = default | Tarkoitus on näkyä; live vahvistamatta. | Sama julkinen rivi. | Admin voi lukea ja kirjoittaa. | Kysely käyttää select("*"), joten mukana voi olla ylläpidollisia metatietoja. Virhe muuttuu null-arvoksi ja footer käyttää fallbackia. | Rajattu julkinen näkymä tai select vain julkisille kentille; erottele virhe ja puuttuva rivi. | Keskitaso |
| Uutisten tekstit | news | palvelinfunktio listNews / newsQuery | published_news anon/authenticated; editoripolitiikat adminille | Vain published = true -uutiset on tarkoitettu näkyviksi; live vahvistamatta. | Sama julkaistu sisältö. | Admin näkee julkaistut ja luonnokset. | Puuttuvat SUPABASE_URL tai SUPABASE_PUBLISHABLE_KEY muuttavat tuloksen tyhjäksi listaksi. Tietokantavirhe heitetään geneerisenä virheenä. | Varmista Previewn serverimuuttujat ja lokita diagnostiikka vain palvelimelle. | Keskitaso |
| Uutiskuvat | storage.objects, bucket news-images | listNews luo julkaistulle uutiselle allekirjoitetun URL:n | news_image_read rajoittaa objektin julkaistuun uutiseen; editoripolitiikka käyttää has_role()-funktiota vain authenticated-roolilla | Vain julkaistun uutisen kuva on tarkoitettu näkyväksi; live vahvistamatta. | Sama. | Admin voi käyttää editorin kuvia. | Bucketin ja migration 0001:n todellinen tila pitää varmistaa live-projektista. | Varmista, ettei private-bucketissa ole yleistä public-politiikkaa ja että image_path vastaa objektin nimeä. | Keskitaso |
| Etusivun ja muiden sivujen muokattavat tekstit | public_site_content → site_content | publicContentQuery(pageKey, lang) | Julkisella näkymällä SELECT anon/authenticated; luonnokset suljettu | Julkaistu sisältö on tarkoitettu näkyväksi; live vahvistamatta. | Sama julkaistu sisältö. | admin_site_content palauttaa luonnokset. | Kyselyvirhe muuttuu {}-arvoksi ja komponentti näyttää lähdekoodin käännöksen. | Erota kyselyvirhe aidosti puuttuvasta julkaistusta rivistä. | Keskitaso |
| TGN kotiin / yrityksille / palveluseteli | public_site_content ja palveluosioiden näkymät | publicContentQuery ja publicServiceSectionQuery | 0010 ja 0013 myöntävät näkymille SELECT-oikeuden anon/authenticated-rooleille | Julkaistu sisältö on tarkoitettu näkyväksi; live vahvistamatta. | Sama. | Admin-RPC:t palauttavat luonnokset. | Rinnakkaiskyselyjen virheet muutetaan tyhjiksi taulukoiksi. Fallback voi näyttää vanhaa lähdekoodisisältöä tai tyhjän osion. | Säilytä virhe erillisenä tilana, älä käytä fallbackia RLS-, näkymä- tai yhteysvirheen jälkeen. | Korkea toiminnallinen |
| Palvelujen ja hyötyjen kuvaukset | public_service_sections, public_service_section_items, public_service_section_item_texts | publicServiceSectionQuery | 0013 suodattaa julkaistut, näkyvät ja poistamattomat arvot | Julkaistut kortit on tarkoitettu näkyviksi; 0013:n etäasennus ja live-tulos vahvistamatta. | Sama. | admin_service_sections tarkistaa admin-roolin. | Jos 0013 puuttuu, kyselyt voivat epäonnistua ja käyttöliittymä näyttää fallbackit ilman virheilmoitusta. | Varmista 0013:n migraatiotila ja erottele no rows sekä kyselyvirhe. | Korkea toiminnallinen |
| Hinnoittelu ja palvelupaketit | public_service_pricing_* → service_pricing_* | publicPricingQuery | 0011:n näkymät palauttavat vain julkaistut sarakkeet | Julkaistut hinnat on tarkoitettu näkyviksi; live vahvistamatta. | Sama. | admin_service_pricing() tarkistaa admin-roolin. | Neljän rinnakkaiskyselyn virhe muuttuu lähdekoodin oletushinnoiksi. Tämä voi näyttää vanhaa hintaa virheen peittona. | Välitä virhe erillisenä ja käytä fallbackia vain puuttuvaan julkaistuun sisältöön. | Keskitaso |
| Henkilöstön nimet, tekstit ja kuvat | public_staff_members, public_staff_member_texts, site-images | publicStaffQuery(lang) + publicImageUrl | 0012 näyttää published_visible = true -jäsenet; site-images on public | Julkaistut jäsenet on tarkoitettu näkyviksi; live vahvistamatta. | Sama. | admin_staff_members palauttaa luonnokset; draft-bucket admin-only. | Kyselyvirhe muuttuu tyhjäksi listaksi. Public bucketin kaikki objektit ovat URL:lla julkisia. | Erota virhe ja tyhjä tulos. Älä tallenna luonnoksia public-bucketiin. | Keskitaso |
| Lyhyesti meistä -teksti ja kuva | public_site_content, public_shared_about_image, site-images | publicContentQuery, publicImageQuery, publicStaffQuery | 0010/0012:n julkiset näkymät; site-images public, site-images-drafts private | Julkaistu sisältö on tarkoitettu näkyväksi; live vahvistamatta. | Sama. | Admin-RPC:t näkevät luonnokset. | Kuvakyselyn virhe muuttuu null-arvoksi ja sivu näyttää kuvapaikan. | Säilytä virhetila erillään aidosti puuttuvasta kuvasta. | Keskitaso |
| Lomake- ja onnistumisviestit | public_site_content, pageKey forms | publicContentQuery("forms", lang) | Sama kuin muissa julkisissa sisältönäkymissä | Julkaistu teksti tai lähdekoodin käännös; live vahvistamatta. | Sama. | Admin-RPC luonnoksineen. | Kyselyvirhe palautuu {}-arvoksi ja lähdekoodin teksti voi peittää ympäristövirheen. | Keskitetty typed-result-virheenkäsittely. | Matala–keskitaso |

## Roolien ja has_role()-funktion tarkistus

0000 luo public.has_role-funktion SECURITY DEFINER -muodossa ja rajaa
search_path-arvon. EXECUTE-oikeus myönnetään authenticated-roolille.
0002_restrict_role_function_execution.sql poistaa EXECUTE-oikeuden anon-roolilta.

Tämä on oikea rajaus admin-politiikoille, jotka koskevat vain
authenticated-roolia. Se ei sovi 0010:n kahteen julkiseen politiikkaan, jotka
koskevat myös anon-roolia ja kutsuvat samaa funktiota:

- customer_reviews_public_read;
- social_links_public_read.

Julkisen politiikan tulee perustua vain julkaisu- ja näkyvyyslippuihin.
Admin-politiikan tulee olla erillinen SELECT-politiikka authenticated-roolille,
jossa has_role(auth.uid(), 'admin') tarkistetaan.

Muut tarkistetut has_role()-käytöt ovat admin-politiikoissa tai
SECURITY DEFINER -RPC-funktioissa, joiden EXECUTE-oikeus on rajattu
authenticated-roolille. Live-toimintaa ei voitu todentaa ilman yhteyttä
tgn-services-projektiin.

## Virheenkäsittelyn riskit

Julkisissa kyselyissä on nämä hiljaiset muunnokset:

- publicReviewsQuery: virhe → [] → CustomerReviews palauttaa null;
- publicSocialLinksQuery: virhe → [] → footer voi käyttää staattista fallbackia;
- publicContentQuery: virhe → {} → komponentti käyttää lähdekäännöstä;
- publicSiteContactQuery: virhe → null → footer käyttää kovakoodattua fallbackia;
- publicImageQuery: virhe → null → sivu näyttää kuvapaikan;
- publicStaffQuery: jommankumman kyselyn virhe → tyhjä lista;
- publicServiceSectionQuery: yksittäinen virhe → fallback-kortteja tai tyhjä osio;
- publicPricingQuery: yksittäinen virhe → lähdekoodin hinnat ja tekstit;
- listNews: puuttuvat serverimuuttujat → [], mutta tietokantavirhe heitetään.

Kävijälle ei pidä paljastaa sisäisiä virheilmoituksia. Diagnostiikka pitää
säilyttää palvelin- tai observability-lokeissa ilman henkilötietoja. Aito tyhjä
tulos, julkaisematon sisältö, RLS-virhe, puuttuva näkymä ja ympäristövirhe pitää
erotella sovelluksen sisäisessä tulostyypissä.

## Live-testimatriisi

Seuraavat testit ovat suorittamatta oikeassa yhqtdbbrymtrnkifcyws-projektissa:

| Lähde | Anon | Tavallinen authenticated | Admin | Syy |
| --- | --- | --- | --- | --- |
| Asiakaspalautteet | Ei vahvistettu | Ei vahvistettu | Ei vahvistettu | Kohdeprojektin lukuoikeutta ei ollut tässä prosessissa |
| Sosiaalilinkit | Ei vahvistettu | Ei vahvistettu | Ei vahvistettu | Sama |
| Yhteystiedot | Ei vahvistettu | Ei vahvistettu | Ei vahvistettu | Sama |
| Uutiset ja kuvat | Ei vahvistettu | Ei vahvistettu | Ei vahvistettu | Sama sekä Previewn serverimuuttujat |
| Sisällöt, kuvat, henkilöstö, palvelut ja hinnat | Ei vahvistettu | Ei vahvistettu | Ei vahvistettu | Sama; 0010–0013:n etätila vahvistamatta |

Staattinen odotus on, että julkaistut julkiset rivit ovat anon-käytettävissä
näkymissä. Asiakaspalautteiden ja sosiaalilinkkien 0010-politiikat ovat poikkeus
ja voivat aiheuttaa permission denied for function has_role -virheen. Tätä ei
merkitä live-vahvistetuksi ennen kyselyä oikeasta projektista.

## Korjaussuunnitelma, ei toteutettu

1. Luo uusi erillinen migraatio, joka korvaa 0010:n kaksi julkista politiikkaa:
   - customer_reviews-julkinen SELECT käyttää vain published = true,
     consent_granted = true ja hidden = false;
   - social_links-julkinen SELECT käyttää vain visible = true;
   - erilliset admin-SELECT-politiikat käyttävät has_role()-funktiota vain
     authenticated-roolissa.
2. Harkitse rajattuja julkisia näkymiä palautteille, sosiaalilinkeille ja
   yhteystiedoille, jotta select("*") ei paljasta ylläpidollisia metatietoja.
3. Muuta julkiset query-funktiot palauttamaan sisäisesti data/error-tulos tai
   heittämään geneerisen käyttäjälle turvallisen virheen. Käytä fallbackia vain,
   kun julkaistua riviä ei ole, ei silloin kun kysely epäonnistuu.
4. Varmista Vercel Previewn palvelin- ja client-muuttujat projektiin
   yhqtdbbrymtrnkifcyws nähden. Verceliin ei tehty muutoksia.
5. Tee erillinen read-only-testi anon-, tavallisella authenticated- ja admin-
   istunnolla. Tarkista myös luonnoksen, piilotetun palautteen, draft-bucketin
   tiedoston ja admin-RPC:n suora käyttö.

Korjauksia, migraatioita, ympäristöasetuksia tai tietokantakirjoituksia ei tehty
tämän auditin yhteydessä.
