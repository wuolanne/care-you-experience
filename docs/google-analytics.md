# Google Analytics 4

GA4:n mittaustunnus luetaan selaimeen muuttujasta `VITE_GA_MEASUREMENT_ID`.
Tässä toteutuksessa tunnus on `G-3DG3SZ1G35`, mutta tunnusta ei ole kovakoodattu
sovellukseen.

## Suostumus ja ympäristöt

- gtag.js-lähde lisätään vasta, kun käyttäjä on hyväksynyt analytiikan.
- Suostumusvalinta tallennetaan selaimen `localStorageen` avaimella
  `tgn-analytics-consent`.
- Google Consent Mode v2:n kaikki neljä kenttää alustetaan estetyiksi.
  Ainoastaan `analytics_storage` päivitetään sallituksi analytiikkavalinnalla;
  mainonnan consent-kentät jäävät estetyiksi.
- Paikallisessa kehityksessä, muissa kuin production-buildissa ja Vercelin
  Preview-ympäristöissä GA4 ei käynnisty, vaikka tunnus olisi ympäristössä.
- Preview- ja Production-ympäristöissä suostumusbanneri ja footerin
  Evästeasetukset-linkki ovat käytettävissä. Previewssa valinta tallennetaan, mutta
  analytiikkaskriptiä ei ladata eikä GA4-pyyntöjä tehdä.

Verceliin lisätään `VITE_GA_MEASUREMENT_ID=G-3DG3SZ1G35` vain **Production**-
ympäristöön. Muuttujaa ei lisätä Preview- tai Development-ympäristöihin.

## SPA-pageview’t

Sovellus asettaa GA4-konfiguraatiolle `send_page_view: false` ja lähettää yhden
manuaalisen `page_view`-tapahtuman alkulatauksesta sekä jokaisesta TanStack Routerin
reittimuutoksesta. Jo lähetetty URL muistetaan komponentin elinkaaren ajan, joten
sama renderöinti ei lähetä tapahtumaa uudelleen.

GA4:n hallinnassa pitää lisäksi poistaa Web data streamin Enhanced Measurement -
asetuksesta **Page changes based on browser history events**. Muuten GA4 voi luoda
historiatapahtumista automaattisia pageview’ejä, vaikka `send_page_view` on pois
käytöstä, ja manuaalinen seuranta voi tällöin tuplata sivukatselut.
