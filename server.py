import eventlet # WAJIB: Di baris pertama untuk Eventlet/WebSocket
eventlet.monkey_patch() # WAJIB: Di baris kedua untuk Eventlet/WebSocket

from flask import Flask, render_template # Render HTML
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os # WAJIB: Untuk mengakses SECRET_KEY

app = Flask(__name__)
# SocketIO mengurus CORS untuk real-time
socketio = SocketIO(app, cors_allowed_origins="*")

# Konfigurasi SECRET_KEY
# (Meski ini aplikasi chat sederhana, SECRET_KEY wajib untuk Flask)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') 


# --- RUTE HTTP UTAMA (Menyajikan Website) ---
@app.route('/')
def home():
    # Menyajikan file index.html dari folder 'templates'
    return render_template('index.html') 

# --- EVENT LISTENERS SOCKETIO (Real-Time) ---

@socketio.on('message_kirim')
def handle_message(data):
    # Dijalankan ketika klien mengirim event 'message_kirim'
    print('Pesan diterima: ' + str(data))
    # Mengirim pesan balik ke SEMUA klien yang terhubung
    emit('message_terima', data, broadcast=True)

@socketio.on('connect')
def test_connect():
    # Dijalankan ketika klien baru berhasil membuka koneksi WebSocket
    print('Klien baru terhubung!')

# --- RUN SERVER ---
if __name__ == '__main__':
    # Gunakan socketio.run untuk menjalankan server SocketIO/Eventlet
    # Ini diperlukan untuk lingkungan lokal (local development)
    socketio.run(app, debug=True)
