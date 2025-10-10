<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Strona Towarzystwa Psychopedagogicznego (Jekyll)

Ta strona jest zbudowana przy użyciu Jekylla, generatora stron statycznych. Jest zoptymalizowana pod kątem wydajności, SEO i łatwości zarządzania treścią.

## Uruchomienie lokalne

**Wymagania:**
- [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
- [Bundler](https://bundler.io/)

1.  **Zainstaluj zależności:**
    Otwórz terminal w głównym folderze projektu i uruchom komendę, aby zainstalować wszystkie potrzebne "gemy" (paczki Ruby) zdefiniowane w pliku `Gemfile`.
    ```bash
    bundle install
    ```

2.  **Uruchom serwer deweloperski:**
    Ta komenda zbuduje stronę i uruchomi lokalny serwer. Strona będzie automatycznie odświeżana po każdej zmianie w plikach.
    ```bash
    bundle exec jekyll serve
    ```
3.  **Otwórz stronę w przeglądarce:**
    Wejdź na adres `http://localhost:4000`.
