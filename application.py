import os
import json

from datetime import datetime
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

maxChannelMessages = 100
channels = {"general" : [], "test" : []}


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat/<channel>")
def chat(channel):
    return render_template("chat.html", channel=channel, channelList=list(channels.keys()))

@socketio.on("submit message")
def submit_message(data):
    channel = data["channel"]
    user = data["display_name"]
    message = data["message"]
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    tempDict = {"user": user, "message": message, "time": time}
    channels[channel].append(tempDict)
    while len(channels[channel]) > maxChannelMessages:
        channels[channel].pop(0)
    tempDictOutput = {"channel": channel, "messages": channels[channel]}
    emit("channel messages", json.dumps(tempDictOutput), broadcast=True)
    

@socketio.on("get messages")
def get_messages(data):
    channel = data["channel"]
    tempDictOutput = {"channel": channel, "messages": channels[channel]}
    emit("channel messages", json.dumps(tempDictOutput), broadcast=False)
