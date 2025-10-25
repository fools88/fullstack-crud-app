from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy 
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

@socketio.on('message_kirim')
def handle_message(data):
    print('Pesan diterima: ' + str(data))
    emit('message_terima', data, broadcast=True)

@socketio.on('connect')
def test_connect():
    print('Klien baru terhubung!')

if __name__ == '__main__':
    socketio.run(app, debug=True)