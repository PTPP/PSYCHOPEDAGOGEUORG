# Myapp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


Jak dziala system zabezpieczen:
Aplikacja Angular (Frontend):

Co robi: Zbiera dane od kandydata w formularzu.
Co wie: NIE ZNA Twojego sekretnego klucza API (SECRET_API_KEY). Klucz został całkowicie usunięty z kodu frontendu.
Jak działa: Zamiast wysyłać dane bezpośrednio do Google Apps Script, wysyła je na specjalny, bezpieczny adres URL naszej nowej Funkcji w Chmurze Firebase.
Funkcja w Chmurze (Bezpieczny Serwer Proxy):

Co to jest: Mały, bezpieczny fragment kodu działający na serwerach Google w ramach Twojego projektu Firebase. To nasz zaufany pośrednik.
Co wie: TYLKO ONA ma dostęp do sekretnego klucza API. Pobrała go z bezpiecznej konfiguracji Firebase (którą ustawiliśmy komendą firebase functions:config:set). Klucz ten nie jest widoczny dla nikogo z zewnątrz.
Jak działa: a. Odbiera dane formularza od aplikacji Angular. b. Dołącza do tych danych swój sekretny klucz API. c. Przekazuje kompletne, uwierzytelnione żądanie dalej, do Twojego skryptu Google Apps Script.
Google Apps Script (Backend):

Co robi: Odbiera dane wyłącznie od naszej zaufanej Funkcji w Chmurze.
Jak działa: Na samym początku sprawdza, czy żądanie zawiera poprawny SECRET_API_KEY.
Jeśli klucz jest poprawny: Przetwarza dane i zapisuje je w Arkuszu Google.
Jeśli klucz jest niepoprawny lub go brakuje: Odrzuca żądanie.
                          +-----------------------------+       +----------------------------+
                          |      FUNKCJA W CHMURZE      |       |    GOOGLE APPS SCRIPT      |
                          | (Bezpieczny serwer-proxy)   |       |         (Backend)          |
                          +-----------------------------+       +----------------------------+
                                  ^      | (3. Dodaje klucz API      ^      | (4. Weryfikuje klucz,
 (2. Wysyła dane              |      |    i wysyła dalej)        |      |    zapisuje dane)
     bez klucza)              |      V                           |      V
+-----------------------------+       +----------------------------+
|      APLIKACJA ANGULAR      |
|         (Frontend)          |
+-----------------------------+
          ^
          | (1. Użytkownik
          |    wypełnia formularz)
          |
    Użytkownik/Kandydat


W skrócie: Klucz API został przeniesiony z "przedniej kieszeni" (przeglądarki użytkownika), gdzie każdy mógł go zobaczyć, do "sejf" na serwerze (Firebase), do którego dostęp ma tylko zaufany pośrednik.

To jest dokładnie ta metoda, której używa się do ochrony komercyjnych interfejsów API.

===

Komenda do kluczy:
Ustaw klucz API:

firebase functions:secrets:set GAS_API_KEY



(Gdy zostaniesz poproszony, wklej swój SECRET_API_KEY)

Ustaw adres URL skryptu:

firebase functions:secrets:set GAS_URL

