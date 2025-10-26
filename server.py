import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import os
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret_default')
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# --- Database sederhana ---
def simpan_pesan(user, pesan):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, user TEXT, pesan TEXT)")
    c.execute("INSERT INTO messages (user, pesan) VALUES (?, ?)", (user, pesan))
    conn.commit()
    conn.close()

def ambil_semua_pesan():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, user TEXT, pesan TEXT)")
    c.execute("SELECT user, pesan FROM messages ORDER BY id ASC")
    pesan = c.fetchall()
    conn.close()
    return pesan

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

# --- SocketIO Events ---
@socketio.on('message_kirim')
def handle_message(data):
    user = data.get('user', 'Anon')
    pesan = data.get('text', '')
    simpan_pesan(user, pesan)
    emit('message_terima', {'user': user, 'text': pesan}, broadcast=True)

@socketio.on('connect')
def on_connect():
    print("User connected")
    # Kirim semua pesan sebelumnya ke user baru
    for u, p in ambil_semua_pesan():
        emit('message_terima', {'user': u, 'text': p})

@socketio.on('disconnect')
def on_disconnect():
    print("User disconnected")

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
