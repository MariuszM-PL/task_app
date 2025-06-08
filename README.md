# 📋 TaskMate – Aplikacja do zarządzania zadaniami

TaskMate to intuicyjna aplikacja webowa stworzona w React i Flask, która umożliwia użytkownikom zarządzanie codziennymi zadaniami, planowanie, filtrowanie, sortowanie oraz oznaczanie ich jako ukończone lub nieukończone. Zawiera także kalendarz z kategoriami, panel ustawień i powiadomienia.

## 📌 Funkcjonalności

- ✅ Rejestracja i logowanie użytkownika
- 📝 Dodawanie, edytowanie, usuwanie i oznaczanie zadań
- 📂 Kategorie zadań (Dom, Praca, Szkoła) + kolorowe oznaczenia
- 📅 Widok kalendarza z kategoriami
- 🔍 Filtrowanie i sortowanie zadań (po terminie, po kategorii, po nazwie)
- 🎨 Nowoczesny interfejs responsywny (RWD)
- ⚙️ Panel ustawień z możliwością zmiany hasła
- 🔔 Powiadomienia toast (info, error, success)

## 🔧 Wymagania wstępne

Upewnij się, że masz zainstalowane:
- [Node.js](https://nodejs.org/) (zalecana wersja: LTS v22.16.0)
- [Python 3.13](https://www.python.org/)
- `pip` – menedżer pakietów Pythona

Sprawdzenie wersji:
`bash
node -v
npm -v
python --version
pip --version`

## 🛠️ Technologie

### Frontend:
- React (z `react-router-dom`)
- `react-toastify` – powiadomienia
- `react-icons` – ikony
- `react-big-calendar` – kalendarz
- CSS (z dekoracyjnymi gradientami i responsywnością)

### Backend:
- Flask (REST API)
- Sesje i uwierzytelnianie
- SQLite (prosty backend do testów lokalnych)

## 🚀 Uruchomienie projektu lokalnie

### 1. Klonuj repozytorium:

```bash
git clone https://github.com/twoja-nazwa-uzytkownika/taskmate.git
cd taskmate
```

### 2. Instalacja frontend (React)

```bash
cd frontend
npm install
npm start
```

> Aplikacja dostępna pod adresem `http://localhost:3000`

### 3. Instalacja backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # lub `venv\Scripts\activate` na Windows
pip install -r requirements.txt
python app.py
```

> Backend nasłuchuje pod `http://localhost:5000`

## 📁 Struktura katalogów

```
taskmate/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── App.js
│
├── backend/
│   ├── app.py
│   ├── database.db
│   └── api/
```

## ✅ Jak testować?

1. Zaloguj się lub zarejestruj nowe konto.
2. Dodaj nowe zadanie z kategorią i terminem.
3. Sprawdź widoczność zadania w liście i w kalendarzu.
4. Edytuj zadanie, zmień kategorię lub datę.
5. Zmień hasło w ustawieniach.
6. Testuj reakcję UI na błędne logowanie lub puste pola.

## 👤 Autor

- Projekt stworzony w ramach przedmiotu Projektowanie Interfejsów Użytkownika **[Mariusz Mikołajczyk, Martyna Midzio, Alan Lekki]**
- Kierunek: Informatyka
- Rok akademicki: 2024/2025
