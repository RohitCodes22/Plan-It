'''
----------------------
Imports
----------------------
'''
from flask import Flask, jsonify, request, send_from_directory, response
from datetime import date
from flask_cors import CORS
import os
import messagingService
import eventService

'''
----------------------
Application Setup
----------------------
'''
app = Flask(__name__, static_folder='static')
CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)
UPLOAD_FOLDER = 'uploads/'  # Ensure this folder exists


'''
----------------------
API Endpoints
----------------------
'''
#------- HOME PAGE -------#
@app.route('/')
def home():
    return '<h1>Backend Online</h1>'


@app.route('/login')
def login():
    # TODO: Implement authentication
    return {'message': 'login successful'}, 200


'''
----------------------
Application Startup
----------------------
'''
if __name__ == '__main__':

    app.run(host='0.0.0.0', port=80, debug=True)