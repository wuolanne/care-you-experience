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
- Käännökset vaihtavat HTML:n `lang`-arvon asiakaspuolella. Erillisiä
  kieliversioiden URL-osoitteita ei ole, joten `hreflang`-linkkejä ei lisätty.

## Sitemap

Versionhallittu `public/sitemap.xml` palvellaan osoitteessa
`https://tgnservices.fi/sitemap.xml`. Sitemap sisältää vain valmiit julkiset
reitit:

- `/`
- `/care-kotiin`
- `/care-yrityksille`
- `/hinnoittelu`
- `/meista`
- `/osta`
- `/tarjouspyynto`
- `/varaa`

Admin-, auth-, keskeneräinen palveluseteli- ja uutisten ylläpitoreittejä ei
lisätä. Yksittäisiä uutis-URL-osoitteita ei tällä hetkellä ole sovelluksen
reitityksessä. Sitemapissa ei ole `lastmod`-kenttiä, koska lähdekoodissa ei ole
julkisille sivuille luotettavia sisältökohtaisia muutospäiviä. Build-päivää ei
esitetä virheellisesti sisällön muutosajankohtana. Kun sivuille tai uutisille
on myöhemmin saatavilla oikeat muutospäivät, ne voidaan lisätä ISO 8601
-muodossa erillisellä hyväksytyllä muutoksella.

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
