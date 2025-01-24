"""
Models package initialization.
Imports all models and registers them with SQLAlchemy.
"""
from typing import List, Type
from sqlalchemy.orm import DeclarativeMeta
from app.utils.db import db

# Import all models
from .user import User
from .job import Job
from .company import Company
from .subscription import Subscription

# Export models
__all__ = [
    'User',
    'Job',
    'Company',
    'Subscription'
]

# Register models with SQLAlchemy
models: List[Type[DeclarativeMeta]] = [
    model for name in __all__ 
    if isinstance((model := globals().get(name)), type) 
    and hasattr(model, '__table__')
]

# Ensure all models are properly registered
for model in models:
    if not model.__table__.info.get('_is_registered', False):
        model.__table__.info['_is_registered'] = True
