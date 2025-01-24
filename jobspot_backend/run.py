import os
from flask_migrate import Migrate
from app import create_app, db
from app.models import User, Job, Company, Subscription
from flask.cli import FlaskGroup

app = create_app()
migrate = Migrate(app, db)
cli = FlaskGroup(app)

@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print('Database initialized successfully!')

@app.cli.command("create-admin")
def create_admin():
    """Create an admin user."""
    email = input("Admin email: ")
    password = input("Admin password: ")
    
    if User.query.filter_by(email=email).first():
        print('Error: Email already exists')
        return

    user = User(
        email=email,
        full_name='Admin User',
        user_type='admin'
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    print('Admin user created successfully!')

if __name__ == '__main__':
    app.run(debug=True)