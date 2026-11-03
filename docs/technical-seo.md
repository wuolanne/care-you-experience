# TGN Services – tekninen SEO

## Nykyinen turvallinen oletus

Tämä haara valmistaa teknisen SEO-toteutuksen, mutta ei avaa indeksointia
automaattisesti. Julkisten sivujen `robots`-meta on oletuksena
`noindex,nofollow`, ellei `VITE_PUBLIC_SITE_INDEXING_ENABLED=true` ole asetettu.
Lisäksi `public/robots.txt` estää indeksoinnin kaikilta roboteilta ja ilmoittaa
sitemapin osoitteen.

Tuotannon logosivuhaaraa `feature/temporary-logo-page` ei ole muutettu. Sen
nykyinen tarkoituksellinen indeksoinnin esto säilyy ennallaan.

## Toteutettu SEO-rakenne

- Julkiset sivut käyttävät keskitettyä TanStack Router -`head()`-apuria.
- Jokaisella julkisella sivulla on nykyiseen sisältöön perustuva title,
  description, canonical, Open Graph- ja Twitter-metatieto.
- Canonical-domain on `https://tgnservices.fi`.
- Sosiaalisen jaon kuvana käytetään olemassa olevaa `public/favicon.png`-kuvaa;
  uutta yritys- tai kampanjakuvaa ei keksitty.
- Etusivulla on vain varmennettuihin tietoihin perustuva Organization JSON-LD:
  nimi, URL ja logo.
- Admin-, auth-, salasanan palautus-, pyyntö- ja uutisten ylläpitoreitit eivät
  ole indeksoitavia.
- `/care-palveluseteli` on merkitty `noindex`-tilaan, koska sivu ilmoittaa
  palvelun olevan tulossa myöhemmin.
- Yleiset sivukäännökset vaihtavat HTML:n `lang`-arvon asiakaspuolella. Uutisilla
  on erilliset kielikohtaiset jaettavat URL-osoitteet; yleisille sivuille ei ole
  lisätty `hreflang`-linkkejä.

## Sitemap

`/sitemap.xml` palvellaan palvelinreittinä osoitteessa
`https://tgnservices.fi/sitemap.xml`. Sitemap sisältää valmiit julkiset reitit:

- `/`
- `/care-kotiin`
- `/care-yrityksille`
- `/hinnoittelu`
- `/meista`
- `/varaa`
- `/tietosuoja`

Admin-, auth- ja keskeneräistä palvelusetelireittiä ei lisätä. Julkaistut uutiset
lisätään sitemap-palvelussa niiden FI/SV/ES/EN-osoitteina. Luonnoksia ja
piilotettuja uutisia ei kyselyn `published=true`-ehdon vuoksi lisätä. Sitemapissa
ei ole `lastmod`-kenttiä, koska lähdekoodissa ei ole julkisille sivuille
luotettavia sisältökohtaisia muutospäiviä. Build-päivää ei esitetä virheellisesti
sisällön muutosajankohtana.

Vanha `/osta`-osoite ohjataan pysyvästi HTTP 308 -uudelleenohjauksella
osoitteeseen `/hinnoittelu`, ja vanha `/tarjouspyynto`-osoite ohjataan
osoitteeseen `/`. Uudelleenohjaukset on määritelty Vercelin asetuksissa.

## Julkaisun yhteydessä tehtävä indeksoinnin avaus

Älä tee näitä muutoksia ennen kuin varsinainen sivusto on hyväksytty
tuotantoon:

1. Varmista, että Vercelin Production käyttää hyväksyttyä normaalia
   sivustohaaraa. Älä vaihda nykyistä Production Branchia tämän työn aikana.
2. Lisää Vercelin **Production**-ympäristöön
   `VITE_PUBLIC_SITE_INDEXING_ENABLED=true`. Älä lisää sitä Preview-ympäristöön.
3. Tee erillisessä hyväksytyssä julkaisumuutoksessa `public/robots.txt`:

   ```txt
   User-agent: *
   Allow: /

   Sitemap: https://tgnservices.fi/sitemap.xml
   ```

4. Varmista julkaisun jälkeen, että `/robots.txt`, `/sitemap.xml` ja
   etusivun lähde palauttavat odotetut tiedot.

Preview-ympäristöjen tulee jäädä estetyiksi. `noindex`-meta ja estävä
`robots.txt` eivät kuitenkaan korvaa Vercelin Deployment Protectionia, jos
Previewt halutaan pitää kokonaan kirjautumisen takana.

## Google Search Console

Kun tuotanto on hyväksytty:

1. Lisää `tgnservices.fi` Domain propertyksi Google Search Consoleen.
2. Lisää Googlen antama DNS TXT -varmennus verkkotunnuksen DNS-hallintaan.
3. Odota varmennuksen valmistumista.
4. Lähetä Search Consolessa sitemap-osoite
   `https://tgnservices.fi/sitemap.xml`.
5. Tarkista URL Inspection -toiminnolla etusivu ja tärkeimmät palvelusivut.

DNS-tietueita tai Vercelin asetuksia ei muutettu tässä branchissa.
