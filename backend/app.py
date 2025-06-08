from flask import Flask, request, session, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt

# Tworzymy instancję aplikacji Flask
app = Flask(__name__)
app.secret_key = 'tajny_klucz'  # Klucz do obsługi sesji
CORS(app, supports_credentials=True)  # Umożliwiamy komunikację z frontendem

# ========================================
# INICJALIZACJA BAZY DANYCH
# ========================================
def init_db():
    # Tworzymy połączenie z lokalną bazą SQLite
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Usuwamy tabele, jeśli już istnieją (resetowanie)
    c.execute('DROP TABLE IF EXISTS tasks')
    c.execute('DROP TABLE IF EXISTS users')

    # Tworzymy tabelę użytkowników
    c.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Tworzymy tabelę zadań powiązaną z użytkownikami
    c.execute('''
        CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            done INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            due_date TEXT,
            category TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()

# ========================================
# ENDPOINTY DOTYCZĄCE UŻYTKOWNIKA
# ========================================

@app.route('/api/register', methods=['POST'])
def register():
    """Rejestracja nowego użytkownika"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password').encode('utf-8')
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'success': False, 'message': 'Użytkownik już istnieje.'}), 409
    conn.close()
    return jsonify({'success': True, 'message': 'Zarejestrowano pomyślnie.'})


@app.route('/api/login', methods=['POST'])
def login():
    """Logowanie użytkownika"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password').encode('utf-8')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = c.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password, user[2]):
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({'success': True, 'username': user[1]})
    else:
        return jsonify({'success': False, 'message': 'Nieprawidłowe dane logowania.'}), 401


@app.route('/api/logout', methods=['GET'])
def logout():
    """Wylogowanie użytkownika (czyszczenie sesji)"""
    session.clear()
    return jsonify({'success': True, 'message': 'Wylogowano'})


@app.route('/api/user', methods=['GET'])
def get_current_user():
    """Pobranie aktualnie zalogowanego użytkownika"""
    if 'user_id' in session:
        return jsonify({'loggedIn': True, 'username': session['username']})
    else:
        return jsonify({'loggedIn': False}), 401

# ========================================
# ENDPOINTY DOTYCZĄCE ZADAŃ
# ========================================

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Pobranie zadań użytkownika"""
    if 'user_id' not in session:
        return jsonify({'error': 'Nieautoryzowany'}), 401

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT id, title, description, done, due_date, created_at, category FROM tasks WHERE user_id = ?', (session['user_id'],))
    tasks = c.fetchall()
    conn.close()

    # Zamiana wyników SQL na listę słowników JSON
    return jsonify([
        {
            'id': task[0],
            'title': task[1],
            'description': task[2],
            'done': bool(task[3]),
            'due_date': task[4],
            'created_at': task[5],
            'category': task[6]
        } for task in tasks
    ])


@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Dodanie nowego zadania"""
    if 'user_id' not in session:
        return jsonify({'error': 'Nieautoryzowany'}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    category = data.get('category')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO tasks (user_id, title, description, due_date, category)
        VALUES (?, ?, ?, ?, ?)
    ''', (session['user_id'], title, description, due_date, category))
    conn.commit()
    conn.close()

    return jsonify({'success': True})


@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Aktualizacja istniejącego zadania"""
    if 'user_id' not in session:
        return jsonify({'error': 'Nieautoryzowany'}), 401

    data = request.get_json()
    fields = []
    values = []

    if 'title' in data:
        fields.append("title = ?")
        values.append(data['title'])

    if 'description' in data:
        fields.append("description = ?")
        values.append(data['description'])

    if 'due_date' in data:
        fields.append("due_date = ?")
        values.append(data['due_date'])

    if 'done' in data:
        fields.append("done = ?")
        values.append(int(data['done']))

    if 'category' in data:
        fields.append("category = ?")
        values.append(data['category'])

    if not fields:
        return jsonify({'error': 'Brak danych do aktualizacji'}), 400

    values.append(task_id)
    values.append(session['user_id'])

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute(f'''
        UPDATE tasks SET {", ".join(fields)}
        WHERE id = ? AND user_id = ?
    ''', values)
    conn.commit()
    conn.close()

    return jsonify({'success': True})


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Usunięcie zadania"""
    if 'user_id' not in session:
        return jsonify({'error': 'Nieautoryzowany'}), 401

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', (task_id, session['user_id']))
    conn.commit()
    conn.close()

    return jsonify({'success': True})


@app.route('/api/change-password', methods=['POST'])
def change_password():
    """Zmiana hasła zalogowanego użytkownika"""
    if 'user_id' not in session:
        return jsonify({'error': 'Nieautoryzowany'}), 401

    data = request.get_json()
    current = data.get('currentPassword').encode('utf-8')
    new = data.get('newPassword').encode('utf-8')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT password FROM users WHERE id = ?', (session['user_id'],))
    row = c.fetchone()

    if row and bcrypt.checkpw(current, row[0]):
        hashed = bcrypt.hashpw(new, bcrypt.gensalt())
        c.execute('UPDATE users SET password = ? WHERE id = ?', (hashed, session['user_id']))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Hasło zostało zmienione.'})
    else:
        conn.close()
        return jsonify({'success': False, 'message': 'Obecne hasło jest nieprawidłowe.'}), 400

# ========================================
# URUCHOMIENIE APLIKACJI
# ========================================
if __name__ == '__main__':
    init_db()  # Tworzy tabele przy uruchomieniu serwera
    app.run(debug=True)  # Tryb debugowania – tylko do developmentu
