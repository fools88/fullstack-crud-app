import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecret123')

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# ===== Rute utama =====
@app.route('/')
def home():
    return render_template('index.html')

# ===== Event Socket.IO =====
@socketio.on('message_kirim')
def handle_message(data):
    # Tambahin user info supaya frontend bisa bedain
    msg_data = {
        'text': data['text'],
        'user': 'server'  # semua broadcast dari server
    }
    print('Pesan diterima:', msg_data)
    emit('message_terima', msg_data, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print('Klien baru terhubung!')

# ===== Run server =====
if __name__ == '__main__':
    socketio.run(app, debug=True)
