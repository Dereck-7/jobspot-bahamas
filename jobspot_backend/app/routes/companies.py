from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.company import Company
from app.models.job import Job
from app.utils.db import db

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/', methods=['GET'])
def get_companies():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '').strip()
        
        query = Company.query
        if search:
            query = query.filter(Company.name.ilike(f'%{search}%'))
            
        companies = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'companies': [company.to_dict() for company in companies.items],
            'total': companies.total,
            'pages': companies.pages,
            'current_page': companies.page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companies_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    try:
        data = request.get_json()
        
        company = Company(
            name=data['name'],
            description=data.get('description'),
            website=data.get('website'),
            logo_url=data.get('logo_url')
        )
        
        db.session.add(company)
        db.session.commit()
        
        return jsonify({
            'id': company.id,
            'message': 'Company created successfully'
        }), 201
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@companies_bp.route('/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company(company_id):
    try:
        company = Company.query.get_or_404(company_id)
        data = request.get_json()
        
        for key, value in data.items():
            if hasattr(company, key):
                setattr(company, key, value)
        
        db.session.commit()
        return jsonify({'message': 'Company updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@companies_bp.route('/<int:company_id>/jobs', methods=['GET'])
def get_company_jobs(company_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        jobs = Job.query.filter_by(
            company_id=company_id, 
            status='active'
        ).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'jobs': [{
                'id': job.id,
                'title': job.title,
                'location': job.location,
                'job_type': job.job_type,
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'created_at': job.created_at.isoformat()
            } for job in jobs.items],
            'total': jobs.total,
            'pages': jobs.pages,
            'current_page': jobs.page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ...rest of companies blueprint code...
