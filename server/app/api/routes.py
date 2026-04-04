from flask import Blueprint, jsonify, request
from app.db import get_db
from app.services.optimizer_logic import CloudOptimizer
from app.services.carbon_service import CarbonService
from app.services.automation_service import automation_service
from app.services.guardrails_service import guardrails_service
from app.services.config_service import config_service

api_blueprint = Blueprint('api', __name__)

# Initialize services
optimizer = CloudOptimizer()
carbon_service = CarbonService()

@api_blueprint.route('/guardrails/set', methods=['POST'])
def set_guardrails():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    limits = guardrails_service.set_limits(data)
    return jsonify(limits), 200

@api_blueprint.route('/guardrails/status', methods=['GET'])
def get_guardrails_status():
    # Mock current usage for demo purposes
    current_usage = {
        "budget": 4200,
        "cpu": 75,
        "carbon": 410
    }
    status = guardrails_service.get_status(current_usage)
    return jsonify(status), 200

@api_blueprint.route('/guardrails/alerts', methods=['GET'])
def get_guardrails_alerts():
    # Mock current usage for demo purposes
    current_usage = {
        "budget": 4200,
        "cpu": 75,
        "carbon": 410
    }
    alerts = guardrails_service.get_alerts(current_usage)
    return jsonify(alerts), 200

@api_blueprint.route('/config/save', methods=['POST'])
def save_config():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    config = config_service.save_config(data)
    return jsonify(config), 200

@api_blueprint.route('/config/get', methods=['GET'])
def get_config():
    config = config_service.get_config()
    return jsonify(config), 200

@api_blueprint.route('/automation', methods=['GET'])
def get_automation_settings():
    settings = automation_service.get_settings()
    return jsonify(settings), 200

@api_blueprint.route('/automation/update', methods=['POST'])
def update_automation_settings():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    updated_settings = automation_service.update_settings(data)
    return jsonify(updated_settings), 200

@api_blueprint.route('/automation/logs', methods=['GET'])
def get_automation_logs():
    logs = automation_service.get_logs()
    return jsonify(logs), 200

@api_blueprint.route('/automation/suggestions', methods=['POST'])
def get_automation_suggestions():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    suggestions = automation_service.get_suggestions(data)
    return jsonify(suggestions), 200

@api_blueprint.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Green Cloud Optimizer API"}), 200

@api_blueprint.route('/optimize', methods=['POST'])
def optimize_plan():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Required fields: current_type, avg_cpu, avg_mem, rps, region
    try:
        result = optimizer.analyze(
            current_type=data.get('current_type', 't3.medium'),
            avg_cpu=float(data.get('avg_cpu', 0)),
            avg_mem=float(data.get('avg_mem', 0)),
            rps=float(data.get('rps', 0)),
            region=data.get('region', 'us-east-1')
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/carbon', methods=['POST'])
def estimate_carbon():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Required fields: cpu_hours, region
    try:
        cpu_hours = float(data.get('cpu_hours', 0))
        region = data.get('region', 'us-east-1')
        
        emissions = carbon_service.calculate_emissions(cpu_hours, region)
        return jsonify({
            "cpu_hours": cpu_hours,
            "region": region,
            "estimated_co2_kg": emissions
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/report', methods=['POST'])
def full_report():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        region = data.get('region', 'us-east-1')
        # 1. Optimization Analysis
        opt_result = optimizer.analyze(
            current_type=data.get('current_type', 't3.medium'),
            avg_cpu=float(data.get('avg_cpu', 0)),
            avg_mem=float(data.get('avg_mem', 0)),
            rps=float(data.get('rps', 0)),
            region=region
        )
        
        # 2. Carbon Impact Analysis
        # Assume monthly cpu_hours for the report (24 * 30 = 720)
        region = data.get('region', 'us-east-1')
        carbon_report = carbon_service.get_impact_report(
            current_cpu_hours=720, # Baseline: 1 month of full usage
            optimized_cpu_hours=720 * (0.6 if opt_result['action'] != 'MAINTAIN' else 1.0), # Mock reduction factor
            region=region
        )
        
        # 3. Combine and Save to DB
        db = get_db()
        report_doc = {
            "optimization": opt_result,
            "carbon": carbon_report,
            "metadata": {
                "input": data,
                "timestamp": "2026-04-04T05:02:00Z" # In a real app, use datetime.utcnow()
            }
        }
        db.reports.insert_one(report_doc)
        
        # Remove MongoDB _id for JSON response
        if '_id' in report_doc:
            report_doc.pop('_id')
            
        return jsonify(report_doc), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
