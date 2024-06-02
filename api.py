# Standard Library Imports
import asyncio
from Secret import Secret

# Third Party Import
from dotenv import load_dotenv
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import logging
import signal
from telegram.error import InvalidToken 

import os


# Local Application Import
from UploadsController import UploadsController

# Load environment variables from .env file
load_dotenv()

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Route for the home page, returns the home.html template


@app.route('/')
def home():
    return render_template('home.html')

# Route to validate user's Bot Token and ChatID


@app.route('/secret', methods=['GET', 'POST'])
def validate_user():
    if request.method == 'POST':
        token = request.json['token']
        chat_id = request.json['chat_id']
        secret = Secret()
        secret['token'] = token
        secret['chat_id'] = chat_id
        return jsonify({"message": "Token and ChatID saved successfully"}), 200
    elif request.method == "GET":
        secret = Secret()
        return jsonify(secret.toJSON()), 200


@app.route("/start", methods=["GET"])
def start():
    os.system("python3 start.py")
    return jsonify({"message": "Chat ID was written successfully!"}), 200

# Routes for handling file uploads. Supports GET, POST, and DELETE methods.
@app.route('/uploads/', methods=['GET', 'POST'])
@app.route('/uploads/<int:uid>', methods=['GET', 'DELETE'])
def handle_uploads(uid=None):
    # Initialize bot to handle requests
    bot = UploadsController()

    '''GET request: Retrieve file(s) information. If UID is provided, retrieves info or
    downloads specific file '''
    if request.method == 'GET':
        return bot.read(uid)

    # POST request: Handle file upload
    elif request.method == 'POST':
        return bot.create()

    # DELETE request: Delete a specific file based on UID
    elif request.method == 'DELETE':
        return bot.delete(uid)


# Run the Flask app with asyncio support
if __name__ == "__main__":
    def signal_handler(sig, frame):
        logging.info('Gracefully shutting down the application...')
        exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    asyncio.run(app.run(debug=True, port=3000))
