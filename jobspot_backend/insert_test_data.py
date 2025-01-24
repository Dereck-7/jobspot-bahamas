import os
import sys
from pathlib import Path

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from app import create_app
from app.utils.db import db
from app.models.company import Company
from app.models.job import Job
from datetime import datetime

app = create_app()

def insert_test_data():
    with app.app_context():
        try:
            # Clear existing data
            Job.query.delete()
            Company.query.delete()
            db.session.commit()
            print("Cleared existing data")

            # Create test company
            company = Company(
                name='Test Company',
                description='A test company',
                website='https://example.com'
            )
            db.session.add(company)
            db.session.commit()
            print(f"Created company: {company.name}")

            # Create test jobs
            jobs = [
                Job(
                    title='Software Developer',
                    company_id=company.id,
                    location='Nassau, Bahamas',
                    description='Full-stack developer needed',
                    requirements='3+ years experience',
                    salary_min=50000,
                    salary_max=70000,
                    job_type='Full-time',
                    source='direct',
                    latitude=25.0443,
                    longitude=-77.3504,
                    status='active'
                ),
                Job(
                    title='Marketing Manager',
                    company_id=company.id,
                    location='Paradise Island, Bahamas',
                    description='Lead marketing initiatives',
                    requirements='5+ years experience',
                    salary_min=60000,
                    salary_max=80000,
                    job_type='Full-time',
                    source='direct',
                    latitude=25.0867,
                    longitude=-77.3213,
                    status='active'
                )
            ]
            
            for job in jobs:
                db.session.add(job)
                print(f"Created job: {job.title}")
            
            db.session.commit()
            print("\nTest data inserted successfully!")

        except Exception as e:
            db.session.rollback()
            print(f"Error inserting test data: {str(e)}")
            sys.exit(1)

if __name__ == '__main__':
    insert_test_data()
