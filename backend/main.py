'''
----------------------
Imports
----------------------
'''
from flask import Flask, jsonify, request, send_from_directory, Response, session
from datetime import date
from parse_location import parse_mysql_point
from flask_cors import CORS
import json
import os
#import messagingService
import eventService
import userService
import confluent_kafka
import databaseService

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
     resources={r"/*": {"origins": "*"}}, #! Development Only !#
     supports_credentials=True)
#CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# Ensure uploads folder exsits
os.makedirs(UPLOADS_DIR, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

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

#Kafka endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Required fields
    required = ["username", "fname", "lname", "email", "password"]
    missing = [field for field in required if field not in data]

    if missing:
        return {
            "message": f"Missing fields: {', '.join(missing)}"
        }, BAD_REQUEST

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
        return {"message": "Internal error"}, INTERNAL_SERVER_ERROR

    return {
        "message": "Signup request received. User creation in progress."
    }, ACCEPTED

@app.route('/delete_account', methods=['DELETE'])
def delete_account():
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR

    user = userService.User("id", session["user_id"])
    if not user:
        return BAD_REQUEST

    user.delete_user()
    session.clear()
    return {'message': 'account deleted'}, SUCCESS

'''
----------------------
API User Endpoints
----------------------
'''

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR

    user = userService.User("id", session["user_id"])
    return jsonify(user.user_info_to_json_struct()), SUCCESS

@app.route("/get_user_info/<user_id>", methods=["GET"])
def get_user_public_info(user_id: str):
    user = userService.User("id", int(user_id))
    return jsonify(user.user_info_to_json_struct()), SUCCESS

@app.route('/user/get_user_events', methods=['GET'])
def get_user_events():
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR
    
    
    user = userService.User("id", session["user_id"])
    
    if not user:
        return BAD_REQUEST
    
    return jsonify(user.get_user_events()), SUCCESS

    
@app.route("/profile/picture/<user_id>", methods=["GET"])
def get_profile_picture_username(user_id):
    
    if not session.get('logged_in') or session.get('user_id') is None:
            return {'message': 'not logged in'}, AUTH_ERROR
        
    if not user_id:
        return {'message': 'not logged in'}, AUTH_ERROR

    username = userService.User("id", int(user_id)).username

    # Try supported extensions
    for ext in ("jpg", "jpeg", "png", "webp"):
        filename = f"{username}.{ext}"
        filepath = os.path.join(UPLOADS_DIR, filename)

        if os.path.exists(filepath):
            return send_from_directory(UPLOADS_DIR, filename)

    # Fallback
    return send_from_directory(
        UPLOADS_DIR,
        "unknown_rohit.jpg"
    )
    
    
@app.route("/user/update", methods=["PATCH"])
def update_user_profile():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), AUTH_ERROR

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), BAD_REQUEST

    try:
        user = userService.User("id", session["user_id"])
    except Exception:
        return jsonify({"error": "User not found"}), NOT_FOUND

    success = user.update_profile(data)

    if not success:
        return jsonify({"error": "No valid fields to update"}), BAD_REQUEST

    return jsonify({
        "message": "Profile updated",
        "user": user.user_info_to_json_struct()
    }), SUCCESS

@app.route("/user/update_profile_image", methods=["POST"])
def update_profile_image():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), AUTH_ERROR

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), BAD_REQUEST

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), BAD_REQUEST

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), BAD_REQUEST

    # Get user
    user = userService.User("id", session["user_id"])
    username = user.username
    
    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{username}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)

    # Delete existing image with same username
    for f in os.listdir(UPLOADS_DIR):
        if f.startswith(username + "."):
            os.remove(os.path.join(UPLOADS_DIR, f))

    # Save new image
    file.save(filepath)

    return jsonify({
        "message": "Profile image updated",
        "image_url": f"/profile/picture/{user.id}"
    }), 200


"""
----------------------
API Event Endpoints (Kafka)
----------------------
"""
def encode_event(event: dict) -> bytes:
    return json.dumps(event).encode("utf-8")

@app.route("/attend_event/<event_id>", methods=["POST"])
def attend_event(event_id: str):
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR
    
    databaseService.add_attendee(event_id, session.get("user_id"))
    return "Attending event", SUCCESS

@app.route("/create_event", methods=["POST"]) # making GET just for testing in browser
def create_event():
    if not session.get('logged_in') or session.get('user_id') is None:
        return {'message': 'not logged in'}, AUTH_ERROR
    
    data = request.get_json()
    test_str = f"ST_SRID(POINT({data['location']['latitude']}, {data['location']['longitude']}), {data['location']['srid']})"
    print(f"\n\n\n\n\n {test_str} \n\n\n\n\n", flush=True)

    e_id = databaseService.create_event(
        data["name"], 
        data["organizer_id"], 
        data['location']['longitude'],
        data['location']['latitude'],
        json.dumps(data["tags"]), 
        data["description"]
    )

    attend_event(e_id)

    # kafka_producer.produce("create_event", encode_event(data))
    # kafka_producer.flush(0)
    return f"{e_id}", SUCCESS

@app.route("/get_event/<event_id>", methods=["GET"])
def get_event(event_id: int):
    e = eventService.Event.read_event(event_id)
    e["location"] = parse_mysql_point(e["location"])
    if e == None:
        return jsonify(e), NO_CONTENT 
    return jsonify(e), SUCCESS

@app.route("/get_event/all", methods=["GET"])
def get_all_events():
    events = eventService.get_all_events()  
    for e in events:
        e["location"] = parse_mysql_point(e["location"])
    return jsonify(events), SUCCESS

@app.get("/events/nearby")
def get_events_nearby():
    try:
        lat = float(request.args.get("lat"))
        lng = float(request.args.get("lng"))
        distance = float(request.args.get("distance"))  # meters
    except (TypeError, ValueError):
        return jsonify({"error": "lat, lng, distance must be valid numbers"}), BAD_REQUEST

    events = eventService.get_events_within_distance(lat, lng, distance)
    print(events, flush=True)
    return jsonify(events), SUCCESS

@app.route("/events/feed", methods=["POST"])
def event_feed_endpoint():
    data = request.get_json()

    try:
        lat = data["latitude"]
        print(data, flush=True)
        long = data["longitude"]
        filters = set(data.get("filters", []))
        max_distance = data["max_distance"]
        num_events = data.get("num_events", -1)
    except KeyError as e:
        print(e, flush=True)
        return jsonify({"error": f"Missing required field: {str(e)}"}), BAD_REQUEST

    events = eventService.generate_event_feed((lat, long), filters, max_distance, num_events)
    return jsonify(events), SUCCESS

'''
----------------------
API Comments Endpoints
----------------------
'''

@app.route("/get_comments/<event_id>", methods=["GET"])
def get_comments(event_id: str):
    comments = databaseService.get_comments(int(event_id))
    return comments, SUCCESS


@app.route("/post_comment", methods=["POST"])
def post_comment():
    data = request.get_json()

    # Required fields
    required = ["user_id", "event_id", "contents"]
    missing = [field for field in required if field not in data]
    print(f"Missing fields in comment post: {missing}", flush=True)

    if missing:
        return {
            "message": f"Missing fields: {', '.join(missing)}"
        }, BAD_REQUEST

    # write comment to DB
    databaseService.add_comment(str(data["event_id"]), str(data["user_id"]), data["contents"])

    return {
        "message": "comment received."
    }, ACCEPTED
'''
----------------------
Application Startup
----------------------
'''
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)