import firebase_admin
import flask
from firebase_admin import *
from firebase_admin import firestore
from flask_cors import  CORS
from flask import request, jsonify

# defines the connection with the real time database in firebase
cred = credentials.Certificate("credentials.json")
firebase = firebase_admin.initialize_app(cred)
db = firestore.client()

#creates a local host instance of the flask
app = flask.Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "welcome to command line"

@app.route('/mortgage_records', methods=['POST'])
def ADD_TABLE_mortgage_records():
    client_ref = db.collection('mortgage_records')
    doc_id = request.json['id']
    client_ref.document(doc_id).set(request.json)
    return jsonify({"success": True}), 200

@app.route('/mortgage_records', methods=['GET'])
def GET_TABLE_mortgage_records():
    mortgage_records_ref = db.collection('mortgage_records').stream()
    mortgage_records = [{**mortgage_records.to_dict(), 'id': mortgage_records.id} for mortgage_records in mortgage_records_ref]
    return jsonify(mortgage_records)

@app.route('/mortgage_records/<mortgage_records_id>', methods=['GET'])
def get_mortgage_records(mortgage_records_id):
    mortgage_records_ref = db.collection('mortgage_records').document(mortgage_records_id).get()
    if mortgage_records_ref.exists:
        return jsonify({**mortgage_records_ref.to_dict(), 'id': mortgage_records_ref.id})
    return jsonify({'message': 'mortgage_records not found'}), 404

@app.route('/mortgage_records/<mortgage_records_id>', methods=['PUT'])
def update_mortgage_records(mortgage_records_id):
    client_ref = db.collection('mortgage_records')
    client_ref.document(mortgage_records_id).update(request.json)
    return jsonify({"success": True}), 200

@app.route('/mortgage_records/<mortgage_records_id>', methods=['DELETE'])
def delete_mortgage_records(mortgage_records_id):
    mortgage_records_ref = db.collection('mortgage_records').document(mortgage_records_id)
    if mortgage_records_ref.get().exists:
        mortgage_records_ref.delete()
        return jsonify({'message': 'mortgage_records deleted'}), 204
    return jsonify({'message': 'mortgage_records not found'}), 404

@app.route('/web_users', methods=['POST'])
def ADD_TABLE_web_users():
    client_ref = db.collection('web_users')
    doc_id = request.json['id']
    client_ref.document(doc_id).set(request.json)
    return jsonify({"success": True}), 200

@app.route('/web_users', methods=['GET'])
def GET_TABLE_web_users():
    web_users_ref = db.collection('web_users').stream()
    web_users = [{**web_users.to_dict(), 'id': web_users.id} for web_users in web_users_ref]
    return jsonify(web_users)

@app.route('/web_users/<web_users_id>', methods=['GET'])
def get_web_users(web_users_id):
    web_users_ref = db.collection('web_users').document(web_users_id).get()
    if web_users_ref.exists:
        return jsonify({**web_users_ref.to_dict(), 'id': web_users_ref.id})
    return jsonify({'message': 'web_users not found'}), 404

@app.route('/web_users/<web_users_id>', methods=['PUT'])
def update_web_users(web_users_id):
    client_ref = db.collection('web_users_id')
    client_ref.document(web_users_id).update(request.json)
    return jsonify({"success": True}), 200

@app.route('/web_users/<web_users_id>', methods=['DELETE'])
def delete_web_users(web_users_id):
    web_users_ref = db.collection('web_users').document(web_users_id)
    if web_users_ref.get().exists:
        web_users_ref.delete()
        return jsonify({'message': 'web_users deleted'}), 204
    return jsonify({'message': 'web_users not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)