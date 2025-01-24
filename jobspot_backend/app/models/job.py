from app.utils.db import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'))
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    salary_min = db.Column(db.Float)
    salary_max = db.Column(db.Float)
    job_type = db.Column(db.String(50))
    source = db.Column(db.String(50))
    source_url = db.Column(db.String(500))
    external_id = db.Column(db.String(100))
    status = db.Column(db.String(20), default='active')
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_salary_range(self):
        if self.salary_min and self.salary_max:
            return f"${self.salary_min:,.2f} - ${self.salary_max:,.2f}"
        elif self.salary_min:
            return f"From ${self.salary_min:,.2f}"
        elif self.salary_max:
            return f"Up to ${self.salary_max:,.2f}"
        return None

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company.to_dict() if self.company else None,
            'location': self.location,
            'description': self.description,
            'requirements': self.requirements,
            'salary_range': self.get_salary_range(),
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'job_type': self.job_type,
            'source': self.source,
            'source_url': self.source_url,
            'status': self.status,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }