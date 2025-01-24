import os
from dotenv import load_dotenv
f
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    if SQLALCHEMY_DATABASE_URI is None:
        raise ValueError("No DATABASE_URL set in environment")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
