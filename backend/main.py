'''
----------------------
Imports
----------------------
'''
from flask import Flask, jsonify, request, send_from_directory, Response, session
from datetime import date
from flask_cors import CORS
import json
import os
#import messagingService
#import eventService
import userService
import confluent_kafka
'''
----------------------
Application Setup
----------------------
'''
kafka_producer = confluent_kafka.Producer({
    "bootstrap.servers": "kafka:9092"
})

app = Flask(__name__, static_folder='static')
app.secret_key = "password"
CORS(app,
     resources={r"/*": {"origins": "http://frontend:3000"}},
     supports_credentials=True)
#CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)
UPLOAD_FOLDER = 'uploads/'  # Ensure this folder exists


'''
----------------------
Status Codes
----------------------
'''
# Success
SUCCESS = 200
CREATED = 201
ACCEPTED = 202
NO_CONTENT = 204

# Client Errors
BAD_REQUEST = 400
AUTH_ERROR = 401
FORBIDDEN = 403
NOT_FOUND = 404
CONFLICT = 409
UNPROCESSABLE_ENTITY = 422

# Server Errors
INTERNAL_SERVER_ERROR = 500
NOT_IMPLEMENTED = 501
SERVICE_UNAVAILABLE = 503


'''
----------------------
API Endpoints
----------------------
'''
#------- HOME PAGE -------#
@app.route('/')
def home():
    return '<h1>Backend Online</h1>'


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username:
        return {'message': 'username required'}, BAD_REQUEST

    user = userService.User("username", username)

    if user is None or not user.verify_password(password):
        session['logged_in'] = False
        return {'message': 'invalid login'}, AUTH_ERROR

    session['user_id'] = user.id
    session['logged_in'] = True

    return {'message': 'login successful'}, SUCCESS

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return {'message': 'logout successful'}, SUCCESS

'''
----------------------
API User Endpoints
----------------------
'''

@app.route('/get_user_info/<username>', methods=['GET'])
def get_user_info(username):
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR

    user = userService.User("username", username)
    return jsonify(user.user_info_to_json_struct()), SUCCESS


"""
----------------------
API Event Endpoints (Kafka)
----------------------
"""
def encode_event(event: dict) -> bytes:
    return json.dumps(event).encode("utf-8")

@app.route("/create_event/<event_name>", methods=["GET"]) # making GET just for testing in browser
def create_event(event_name):
    kafka_producer.produce("create_event", encode_event({"name": event_name}))
    kafka_producer.flush(0)
    return f"<h1>{event_name} created!</h1>"


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Required fields
    required = ["username", "fname", "lname", "email", "password"]
    missing = [field for field in required if field not in data]

    if missing:
        return {
            "message": f"Missing fields: {', '.join(missing)}"
        }, 400

    # Build event payload
    event = {
            "username": data["username"],
            "fname": data["fname"],
            "lname": data["lname"],
            "email": data["email"],
            "password": data["password"]
        
        }

    # Produce event to Kafka
    try:
        kafka_producer.produce("create_user", encode_event(event))
    except Exception as e:
        print("Kafka error:", e)
        return {"message": "Internal error"}, 500

    return {
        "message": "Signup request received. User creation in progress."
    }, 202


'''
----------------------
Application Startup
----------------------
'''
if __name__ == '__main__':

    app.run(host='0.0.0.0', port=80, debug=True)