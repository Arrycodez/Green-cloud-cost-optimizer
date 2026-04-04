from pymongo import MongoClient
from flask import current_app, g

def get_db():
    if 'db' not in g:
        client = MongoClient(current_app.config['MONGO_URI'])
        g.db = client.get_database()
    return g.db

def init_db(app):
    # This can be used to set up indexes or initial data
    with app.app_context():
        db = get_db()
        print(f"Connected to MongoDB: {db.name}")
