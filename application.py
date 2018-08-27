import os
import json

from datetime import datetime
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Set the max messages per channel.
maxChannelMessages = 100

# Create the default channel.
channels = {"general" : []}

@app.route("/")
def index():
    return render_template("index.html")

# Create the channel if it does not exist and then render the channel page.
@app.route("/chat/<channel>")
def chat(channel):
    if channel not in channels:
        channels[channel] = []
        #socketio.emit("add channel", json.dumps(channels), broadcast=True)
    return render_template("chat.html", channel=channel, channelList=list(channels.keys()))

# When a message is submitted, save the message and broadcast the channels messages.
@socketio.on("submit message")
def submit_message(data):
    # Get the data from the message.
    channel = data["channel"]
    user = data["display_name"]
    message = data["message"]
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # Create a message dictionary and save in the list of messages.
    tempDict = {"user": user, "message": message, "time": time}
    channels[channel].append(tempDict)
    # Remove messages over the limit.
    while len(channels[channel]) > maxChannelMessages:
        channels[channel].pop(0)
    # Create a dictonary to easily turn to JSON.
    tempDictOutput = {"channel": channel, "messages": channels[channel]}
    # Send out the channels messages to all users.
    emit("channel messages", json.dumps(tempDictOutput), broadcast=True)
    
# When a client requests a channel's messages, return the messages to that single client.
@socketio.on("get messages")
def get_messages(data):
    channel = data["channel"]
    tempDictOutput = {"channel": channel, "messages": channels[channel]}
    # Send the messages to the single client.
    emit("channel messages", json.dumps(tempDictOutput), broadcast=False)

# When the client creates a new channel, add to the dictionary and send a message to all clients.
@socketio.on("create channel")
def create_channel(data):
    channel = data["channel"]
    # If the channel is new, else do nothing.
    if channel not in channels:
        # Create the channel.
        channels[channel] = []
        # Send the message of a new channel to all users.
        emit("add channel", broadcast=True)
