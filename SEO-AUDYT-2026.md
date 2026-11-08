# Audyt SEO, UX i przebudowa wizualna — psychopedagog.org (08.11.2026)

## Zakres i identyfikacja źródła
- Repozytorium: `PTPP/PSYCHOPEDAGOGEUORG`.
- Publikowana wersja `www.psychopedagog.org` odpowiadała stanowi gałęzi `master` (HTML, CSS i katalog usług w JavaScript). Istniejąca gałąź `main` zawiera inny, starszy eksport Astro i nie została nadpisana.
- Zachowano adresy zewnętrznych rezerwacji: `https://rejestracja.psychopedagog.org/booking`, portalu klienta oraz formularzy dla instytucji.
- Materiały prawne z `regulamin/` i `polityka-prywatnosci/` zostały opakowane nową warstwą wizualną, **bez zmian w zapisach merytorycznych**.

## Problemy stwierdzone w pierwotnym kodzie
1. Duży, jednoplikowy dokument HTML zawierał katalog usług, zespół i FAQ w danych JavaScript; bez wykonania skryptów istotne sekcje były niedostępne w zwykłym HTML.
2. Cennik i oferta funkcjonowały jako zakładki `#...`; brakowało osobnych, opisowych adresów URL dla głównych usług.
3. Sitemap zawierała fragmenty adresów `#uslugi-cennik`, `#faq` itp. (nie są niezależnymi dokumentami indeksowalnymi).
4. Oznaczenie `hreflang=en` prowadziło na tę samą polską stronę, zamiast na odrębną wersję językową.
5. Odpowiedź błędu 404 miała `index,follow` i kanoniczny adres `/404/`, co nie jest pożądane.
6. Pod `/inspiracja/` znajdowała się indeksowalna makieta **innej firmy** o tematyce NDIS/Mackay, poza zakresem działalności TPP.
7. Styl wizualny opierał się na typowym zestawie gradientów, kart, ikon z CDN i generycznych komponentów; przekaz był mało charakterystyczny.

## Zmiany wdrożone na gałęzi roboczej
### Warstwa wizualna i użyteczność
- Autorski system typograficzny: szeryfowa typografia redakcyjna, oszczędne kolory papier / butelkowa zieleń / ceglasty akcent, podziały liniowe zamiast wielu „kart”.
- Ujednolicony wygląd strony głównej, ofert, cenników, regulaminu, prywatności i 404.
- CSS bez frameworka i bez zewnętrznych fontów; interakcje ograniczone do lekkiego skryptu filtrowania usług.
- Responsywność, widoczny focus, nawigacja klawiaturą, skip link, naturalne odsyłacze `<a>` oraz `prefers-reduced-motion`.
- Brak sztucznie generowanych ocen, zdjęć personelu czy certyfikatów.

### Architektura i treści
- Zachowane 25 pozycji z istniejącej oferty (ceny i opisy z kodu źródłowego), 12 osób w zespole oraz 8 FAQ; kluczowa treść znajduje się bezpośrednio w HTML.
- Nowe podstrony PL i ich odpowiedniki EN:
  1. Diagnostyka psychologiczna ADHD,
  2. Counselling i wsparcie indywidualne,
  3. Wsparcie dzieci i młodzieży,
  4. Kurs kompetencji rodzicielskich,
  5. Opinie i zaświadczenia,
  6. Zgłoszenia instytucjonalne.
- Pełny polski i angielski cennik oraz dwie rzeczywiste, odrębne wersje językowe strony głównej.
- Czytelne odróżnienie pomocy psychospołecznej i diagnostyki psychologicznej od świadczeń medycznych, zgodnie z aktualnym regulaminem TPP.

### SEO techniczne i wyszukiwanie AI
- Samodzielny tytuł i opis meta dla każdej strony; pojedyncze H1, semantyczne nagłówki i linki wewnętrzne.
- Samokanoniczne `rel=canonical` (www + slash na końcu adresu).
- Rzeczywiste pary wersji językowych z obustronnym `hreflang` i `x-default`.
- Dane JSON-LD: `Organization`, `LocalBusiness`, `WebSite`, `WebPage`, `Service`, `BreadcrumbList` — bez sugerowania statusu podmiotu leczniczego ani niepotwierdzonych recenzji.
- Sitemap wyłącznie z adresami dokumentów, bez fragmentów `#`, z alternatywami PL/EN. Znacznik `lastmod` tylko tam, gdzie zmieniła się główna treść strony; na nietkniętych merytorycznie dokumentach prawnych bez sztucznego odświeżania daty.
- Poprawiony 404 (`noindex`) i `/inspiracja/` (`noindex,nofollow`) bez usuwania pliku roboczego.
- Walidacja techniczna repozytorium przez `tools/validate_site.py` oraz workflow GitHub Actions.

## Jak interpretować „SEO pod AI” w 2026
Google Search Central podaje, że AI Overviews i AI Mode korzystają z podstawowych mechanizmów Search. **Nie ma specjalnego schematu, „AI SEO tagu” ani pliku `llms.txt`, który poprawiałby pozycje w Google.** Ważniejsze są: jednoznaczna struktura, dostępność treści, oryginalna wartość dla czytelnika, spójność informacji i wiarygodność autora.
Oferty pomocy psychologicznej dotyczą tematów bliskich zdrowiu i dobrostanowi. Istotna jest zgodność opisów z rzeczywistym zakresem usług i kwalifikacjami. Żadne zmiany w kodzie nie gwarantują widoczności w Google ani cytowania w odpowiedziach generatywnych.

## Czego sama zmiana kodu nie potwierdza
1. Połączenia i wskaźniki Google Search Console (indeksacja, kliknięcia, zapytania) — wymagają dostępu do konta właściciela.
2. Core Web Vitals, wyniki Lighthouse oraz zrzuty różnych ekranów — wymagają pomiaru publicznego wdrożenia w przeglądarce.
3. Statusu Google Business Profile, danych NAP i opinii z profilu firmowego — wymagają osobnej weryfikacji i uprawnień.
4. Poprawności merytorycznej oraz aktualności kwalifikacji wszystkich specjalistów — do potwierdzenia przez organizację.
5. Wyników pozycji organicznych, które zależą od indeksacji, konkurencji i czasu, nie tylko kodu.

## Testy odbiorowe po publikacji
- Zweryfikować `https://www.psychopedagog.org/` i przekierowanie `https://psychopedagog.org/` na kanoniczną domenę.
- Sprawdzić `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, wszystkie podstrony PL/EN oraz zachowanie 404.
- Przejść rezerwację, formularz instytucji, kontakt tel/mail i nawigację na telefonie.
- Uruchomić `python tools/validate_site.py`; wykonać Lighthouse mobile/desktop i testy na klawiaturze.
- Zgłosić sitemap do Search Console oraz przetestować indeksację kluczowych adresów w URL Inspection.
- Monitorować liczbę indeksowanych stron, Core Web Vitals, kliknięcia i wyszukiwania usługowe; nie traktować samej liczby wyświetleń jako celu.
- W razie modyfikacji cen, specjalizacji lub godzin kontaktu aktualizować odpowiednie strony i schemat danych, aby nie rozjechały się z cennikiem ClinicOS.

## Materiały referencyjne
- Google: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google: https://developers.google.com/search/docs/appearance/ai-features
- Google: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
