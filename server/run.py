from flask import Flask
from flask_cors import CORS
from app.api.routes import api_blueprint
from app.config import Config
from app.db import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for frontend communication
    CORS(app)
    
    # Initialize MongoDB
    init_db(app)
    
    # Register API routes
    app.register_blueprint(api_blueprint, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
