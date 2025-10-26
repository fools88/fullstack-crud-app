import eventlet # WAJIB: Di baris pertama untuk Eventlet/WebSocket
eventlet.monkey_patch() # WAJIB: Di baris kedua untuk Eventlet/WebSocket

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os # Untuk mengakses SECRET_KEY

app = Flask(__name__)
# SocketIO mengurus CORS dan menginisialisasi Eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet') 

# Konfigurasi SECRET_KEY
# (Meski ini aplikasi chat, SECRET_KEY wajib untuk Flask)
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
if __name__ == '__main__':    # Digunakan untuk lingkungan lokal
    # Di Render, ini akan diabaikan karena menggunakan Gunicorn
    socketio.run(app, debug=True)