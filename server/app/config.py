import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    # Use MongoDB Atlas URI in production
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/green_cloud_db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
