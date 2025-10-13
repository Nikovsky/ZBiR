<p align="center">
  <img src="./img/Logo.png" alt="HARO logo" width="180"/>
</p>

<h2 align="center"><strong>Zarządzenie Budżetem i Rozliczeniami</strong></h2>

<div align="center">
    <p><img alt="Status" src="https://img.shields.io/badge/status-w%20trakcie%20budowy-orange">
    <img alt="Licencja" src="https://img.shields.io/badge/licencja-na%20zapytanie-lightgrey"></p>
    <p> <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white"> <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white"> <img alt="TanStack Table" src="https://img.shields.io/badge/TanStack_Table-FF4154?logo=react-table&logoColor=white"> <img alt="React Hook Form" src="https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white"> <img alt="Zod" src="https://img.shields.io/badge/Zod-4B32C3?logoColor=white"> <img alt="Zustand" src="https://img.shields.io/badge/Zustand-0A0A0A?logo=z&logoColor=white"> </p>
    <p> <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white"> <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white"> <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white"> <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white"> <img alt="RBAC" src="https://img.shields.io/badge/RBAC-%231A73E8?logo=google&logoColor=white"> <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white"> </p>
</div>

---

## 🎯 Cel projektu

Aplikacja **ZBiR** powstała jako odpowiedź na ograniczenia Excela w zarządzaniu finansami HAL/ZHL. Umożliwia:
- wygodne wprowadzanie danych,
- pracę wielu użytkowników (komendant, kwatermistrz),
- zatwierdzanie przez skarbnika okręgu,
- bezpieczne logowanie i kontrolę dostępu,
- eksport gotowego raportu PDF.

## 👤 Role użytkowników

| Rola                | Uprawnienia                                                                 |
|---------------------|------------------------------------------------------------------------------|
| Komendant/Kwatermistrz | tworzy wydarzenia, dodaje wpisy, zaprasza współpracowników                 |
| Skarbnik Okręgu     | zatwierdza konta i raporty, przegląda wszystkie wydarzenia                   |
| Administrator       | zarządza kontami, brak dostępu do danych finansowych                         |

## 🧱 Stack technologiczny

### Backend:
- **NestJS** – REST API
- **Prisma** – ORM
- **PostgreSQL** – relacyjna baza danych

### Frontend:
- **Next.js** – SSR + Middleware
- **Tailwind CSS** – stylowanie
- **TanStack Table** – tabela z edycją inline
- **React Hook Form + Yup** – formularze z walidacją
- **Zustand** – zarządzanie stanem

### Bezpieczeństwo:
- JWT Auth z rotacją tokenów
- Role-Based Access Control (RBAC)
- Dane osobowe szyfrowane i zabezpieczone
- Planowana integracja z Keycloak (SSO) i RLS (PostgreSQL)


## 📌 Status projektu

| Moduł / Funkcja           | Status     |
|---------------------------|------------|
| 🔐 Rejestracja i logowanie | ✅ Zrealizowane    |
| 🔑 JWT + Refresh Token     | ✅ Zrealizowane   |
| 🛂 RBAC                   | ✅ Zrealizowane  |
| 🏕 Moduł wydarzeń (`Camp`) | 🛠 W trakcie  |
| 💸 Wpisy finansowe (`Entry`) | 🛠 W trakcie |
| 📤 Eksport PDF             | 🛠 W trakcie |
| 📦 Docker Compose         | 🔜 Planowane |
| 🔭 Monitoring i CI/CD      | 🔜 W planach |

---

## 📈 Kierunki rozwoju
W kolejnych etapach planujemy rozszerzyć **ZBiR** o funkcjonalności umożliwiające:
- rozliczanie **pojedynczych jednostek** (np. drużyny, szczepy),
- Wydajne korzystanie z urządzen mobilnych (Progressive Web App)

Jeśli chcesz zasugerować inne funkcje – otwórz [issue](../../issues) lub skontaktuj się z nami bezpośrednio.

## 🧠 Architektura logiczna

- `Camp` → Wydarzenie (np. obóz)
- `Entry` → Pojedynczy wpis finansowy (wpływy, wydatki)
- `UserToCamp` → Powiązania użytkowników z wydarzeniami (rola, status zaproszenia)

## 💬 Jak się przyczynić?

Choć aplikacja nie jest open-source, zachęcamy do:
- zgłaszania propozycji przez Issues
- przesyłania uwag dot. ergonomii i UX
- zgłaszania błędów funkcjonalnych

## 📝 Licencja

Projekt objęty prywatną licencją – wszelkie wdrożenia możliwe wyłącznie po uzgodnieniu z autorami.

---

## Aplikacja stworzona przez:
![contributors badge](https://readme-contribs.as93.net/contributors/Nikovsky/ZBIR)
> © 2025 ZBiR - Zarządzenie Budżetem i Rozliczeniami
