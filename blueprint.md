# Plan Wdrożenia Strony Logowania

## Faza 1: Stworzenie Formularza Logowania

**Cel:** Stworzenie interaktywnego formularza logowania z polami na e-mail i hasło.

**Kroki:**

1.  **Modyfikacja `logowanie.html`:** Dodam pola `input` dla e-maila i hasła oraz przycisk "Zaloguj się".
2.  **Modyfikacja `logowanie.css`:** Użyję nowoczesnych stylów CSS, aby nadać formularzowi estetyczny wygląd, w tym cienie, zaokrąglone rogi i odpowiednie odstępy.
3.  **Modyfikacja `logowanie.ts`:**
    *   Zaimportuję `ReactiveFormsModule`, aby użyć formularzy reaktywnych.
    *   Utworzę `FormGroup` z `FormControl` dla pól e-mail i hasło, z podstawową walidacją (`Validators.required`, `Validators.email`).
    *   Utworzę metodę `onSubmit()`, która będzie wywoływana po kliknięciu przycisku "Zaloguj się" i będzie wyświetlać w konsoli wartości z formularza.

## Faza 2: Integracja z Firebase Authentication

**Cel:** Podłączenie formularza logowania do usługi Firebase Authentication.

**Kroki:**

1.  **Konfiguracja Firebase:** Upewnię się, że Firebase jest poprawnie skonfigurowane w projekcie, a usługa Authentication jest włączona w konsoli Firebase.
2.  **Stworzenie serwisu `AuthService`:**
    *   Utworzę serwis, który będzie odpowiedzialny za komunikację z Firebase Authentication.
    *   Zaimplementuję metodę `login(email, password)`, która będzie używać `signInWithEmailAndPassword` z biblioteki AngularFire.
3.  **Modyfikacja `logowanie.ts`:**
    *   Wstrzyknę `AuthService` do komponentu `Logowanie`.
    *   W metodzie `onSubmit()` wywołam `authService.login()` z danymi z formularza.
    *   Dodam obsługę błędów (np. nieprawidłowe hasło, brak użytkownika) i sukcesu logowania.
4.  **Zarządzanie stanem użytkownika:**
    *   W `AuthService` stworzę sygnał, który będzie przechowywał informacje o zalogowanym użytkowniku.
    *   Dodam metody `logout()` i `isLoggedIn()` do serwisu.
    *   Zaktualizuję interfejs użytkownika, aby dynamicznie pokazywał stan zalogowania (np. przycisk "Wyloguj").

## Faza 3: Ulepszenia i Obsługa Uwierzytelniania

**Cel:** Dodanie dodatkowych funkcji i poprawa ogólnego doświadczenia użytkownika.

**Kroki:**

1.  **Ochrona tras (Route Guards):** Zaimplementuję `AuthGuard`, aby chronić trasy, które wymagają zalogowania.
2.  **Logowanie przez Google/Facebook:** Dodam przyciski umożliwiające logowanie za pomocą dostawców zewnętrznych.
3.  **Rejestracja nowego użytkownika:** Stworzę osobną stronę lub modal do rejestracji nowych użytkowników.
4.  **Resetowanie hasła:** Dodam funkcję "Zapomniałem hasła".
5.  **Walidacja w czasie rzeczywistym:** Zaimplementuję walidację pól formularza w czasie rzeczywistym, aby użytkownik od razu widział błędy.