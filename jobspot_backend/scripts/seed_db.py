import os
import sys
from pathlib import Path

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from app import create_app
from app.models.company import Company
from app.models.job import Job
from app.utils.db import db
from datetime import datetime

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data - remove Job queries first
        try:
            db.session.query(Job).delete()
            db.session.query(Company).delete()
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error clearing data: {e}")

        # Create test companies
        companies = [
            Company(
                name="Atlantis",
                description="Leading resort in The Bahamas",
                website="https://www.atlantisbahamas.com",
            ),
            Company(
                name="Baha Mar",
                description="Luxury resort destination",
                website="https://www.bahamar.com",
            )
        ]
        
        for company in companies:
            db.session.add(company)
        db.session.commit()
        print("Companies created successfully!")

        # Create test jobs
        jobs = [
            Job(
                title="Front Desk Agent",
                company_id=companies[0].id,
                location="Paradise Island, Nassau",
                description="Join our guest services team",
                requirements=["Customer service experience", "Computer literacy"],
                job_type="full-time",
                salary_min=25000,
                salary_max=35000,
                latitude=25.0833,
                longitude=-77.3167,
                status="active"
            ),
            Job(
                title="Chef de Partie",
                company_id=companies[1].id,
                location="Cable Beach, Nassau",
                description="Join our culinary team",
                requirements=["Culinary degree", "3 years experience"],
                job_type="full-time",
                salary_min=35000,
                salary_max=45000,
                latitude=25.0800,
                longitude=-77.4000,
                status="active"
            )
        ]
        
        for job in jobs:
            db.session.add(job)
        db.session.commit()
        print("Jobs created successfully!")

if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully!")
