from app.utils.db import db
from datetime import datetime

class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    plan_type = db.Column(db.String(50), nullable=False)  # basic, premium, enterprise
    status = db.Column(db.String(20), nullable=False, default='active')  # active, expired, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed
    amount = db.Column(db.Float, nullable=False)
    auto_renew = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Define relationship with cascade delete
    company = db.relationship(
        'Company',
        backref=db.backref('company_subscriptions', lazy='dynamic', cascade='all, delete-orphan'),
        lazy='joined'
    )

    def is_active(self):
        return (
            self.status == 'active' and
            self.payment_status == 'paid' and
            self.start_date <= datetime.utcnow() <= self.end_date
        )

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'plan_type': self.plan_type,
            'status': self.status,
            'payment_status': self.payment_status,
            'amount': self.amount,
            'auto_renew': self.auto_renew,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'is_active': self.is_active(),
            'created_at': self.created_at.isoformat()
        }

class CompanySubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscription.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, expired, cancelled
    payment_status = db.Column(db.String(20), default='paid')  # paid, pending, failed
    auto_renew = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = db.relationship('Company', backref='subscriptions', lazy=True)
    subscription = db.relationship('Subscription', backref='company_subscriptions', lazy=True)
