// Import biblioteki React – umożliwia użycie JSX i tworzenie komponentów
import React from 'react';

// Import biblioteki ReactDOM do osadzenia aplikacji React w prawdziwym DOM-ie przeglądarki
import ReactDOM from 'react-dom/client';

// Import głównego komponentu aplikacji (App.js) – zawiera routing i strukturę aplikacji
import App from './App';

// Import globalnych stylów CSS (np. reset, czcionki, kolory tła)
import './index.css';

// Tworzymy tzw. "korzeń" Reacta – wskazujemy element <div id="root"></div> z index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderujemy naszą aplikację React wewnątrz "root" – start aplikacji
root.render(<App />);
