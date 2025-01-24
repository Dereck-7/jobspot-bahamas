from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from app.config import Config  # Make sure this points to the correct config file
from app.utils.db import db

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS - single initialization
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": app.config['CORS_METHODS'],
            "allow_headers": app.config['CORS_HEADERS'],
            "supports_credentials": app.config['CORS_SUPPORTS_CREDENTIALS']
        }
    })

    # Enable logging
    if not app.debug:
        import logging
        logging.basicConfig(level=logging.DEBUG)
        app.logger.setLevel(logging.DEBUG)

    # Add root route
    @app.route('/')
    def index():
        return jsonify({
            'status': 'online',
            'message': 'JobSpot API is running'
        })

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # Remove this line as CORS is already initialized above
    # CORS(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.jobs import jobs_bp
    from app.routes.companies import companies_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')

    # Import models for migrations
    from app import models

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Not Found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500

    # Setup job scheduler
    scheduler = BackgroundScheduler()
    
    with app.app_context():
        from app.scrapers.jobs_242 import run_scraper
        scheduler.add_job(
            func=run_scraper,
            trigger='interval',
            hours=6,
            id='scrape_jobs',
            replace_existing=True
        )
        scheduler.start()

    return app
