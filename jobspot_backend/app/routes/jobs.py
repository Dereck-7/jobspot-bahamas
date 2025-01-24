from flask import Blueprint, request, jsonify, make_response, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from app.models.job import Job
from app.utils.db import db
from sqlalchemy import or_
from app.utils.geocoding import geocode_address

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Job.query.filter_by(status='active')
        
        # Apply filters
        location = request.args.get('location')
        job_type = request.args.get('job_type')
        company_id = request.args.get('company_id')
        search = request.args.get('search')
        
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))
        if job_type:
            query = query.filter_by(job_type=job_type)
        if company_id:
            query = query.filter_by(company_id=company_id)
        if search:
            query = query.filter(
                or_(
                    Job.title.ilike(f"%{search}%"),
                    Job.description.ilike(f"%{search}%")
                )
            )
            
        jobs = query.order_by(Job.created_at.desc()).paginate(
            page=page, per_page=per_page
        )
        
        return jsonify({
            'jobs': [job.to_dict() for job in jobs.items],
            'total': jobs.total,
            'pages': jobs.pages,
            'current_page': jobs.page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/search', methods=['GET', 'OPTIONS'])
@cross_origin()
def search_jobs():
    try:
        current_app.logger.debug(f"Search params: {request.args}")
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        try:
            # Modify query to handle possible missing company relationships
            query = Job.query.filter_by(status='active')
            
            # Execute query with error handling
            jobs = query.order_by(Job.created_at.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            # Prepare response with safe company access
            response_data = {
                'jobs': [{
                    'id': job.id,
                    'title': job.title,
                    'company': job.company.name if job.company else "Unknown Company",
                    'location': job.location,
                    'job_type': job.job_type,
                    'salary_min': job.salary_min,
                    'salary_max': job.salary_max,
                    'created_at': job.created_at.isoformat() if job.created_at else None
                } for job in jobs.items],
                'total': jobs.total,
                'pages': jobs.pages,
                'current_page': jobs.page
            }
            
            current_app.logger.debug(f"Successfully fetched {len(jobs.items)} jobs")
            
            response = make_response(jsonify(response_data))
            response.headers.update({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            })
            return response
            
        except Exception as e:
            current_app.logger.error(f"Database error in search_jobs: {str(e)}")
            return jsonify({
                'error': 'Database error',
                'message': str(e),
                'jobs': [],
                'total': 0,
                'pages': 0,
                'current_page': page
            }), 200  # Return empty result instead of 500
            
    except Exception as e:
        current_app.logger.error(f"Server error in search_jobs: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

@jobs_bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    try:
        data = request.get_json()
        
        # Get coordinates for the job location
        lat, lng = geocode_address(data['location'])
        
        job = Job(
            title=data['title'],
            company_id=data['company_id'],
            location=data['location'],
            description=data['description'],
            requirements=data['requirements'],
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            job_type=data['job_type'],
            source='direct',
            latitude=lat,
            longitude=lng,
            status='active'
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'id': job.id,
            'message': 'Job posted successfully',
            'geocoded': bool(lat and lng)
        }), 201
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    try:
        job = Job.query.get_or_404(job_id)
        data = request.get_json()
        
        for key, value in data.items():
            if hasattr(job, key):
                setattr(job, key, value)
        
        db.session.commit()
        return jsonify({'message': 'Job updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    try:
        job = Job.query.get_or_404(job_id)
        job.status = 'deleted'
        db.session.commit()
        return jsonify({'message': 'Job deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    job = Job.query.get_or_404(job_id)

@jobs_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify(job.to_dict())

    return jsonify(job.to_dict())
