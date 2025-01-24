from datetime import datetime
from app.utils.db import db

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(200))
    logo_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jobs = db.relationship(
        'Job',
        backref='company',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )

    def active_jobs_count(self):
        """Return count of active jobs for this company"""
        return self.jobs.filter_by(status='active').count()

    def to_dict(self):
        """Serialize company to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'website': self.website,
            'logo_url': self.logo_url,
            'active_jobs_count': self.active_jobs_count(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
