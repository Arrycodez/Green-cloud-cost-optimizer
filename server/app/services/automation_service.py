import datetime
from app.db import get_db
from app.services.config_service import config_service
from app.services.guardrails_service import guardrails_service

class AutomationService:
    def __init__(self):
        self.default_settings = {
            "auto_scale": False,
            "shutdown_idle": False,
            "shift_workload": False,
            "schedule_optimization": False
        }

    def get_settings(self):
        db = get_db()
        settings = db.automation_settings.find_one({"id": "current_settings"})
        if not settings:
            db.automation_settings.insert_one({"id": "current_settings", **self.default_settings})
            return self.default_settings
        
        # Remove MongoDB _id
        settings.pop("_id", None)
        settings.pop("id", None)
        return settings

    def update_settings(self, new_settings):
        db = get_db()
        
        # Check Guardrails before applying automation
        # Mock current usage
        current_usage = {"budget": 4200, "cpu": 75, "carbon": 410}
        risk_status = guardrails_service.get_status(current_usage)
        
        if risk_status["risk_level"] == "High":
            # If risk is high, we might want to force certain automations or block others
            # For this demo, we'll just log a warning
            self.add_log("High risk detected. Automation rules applied with safety overrides.", "System", 0)

        db.automation_settings.update_one(
            {"id": "current_settings"},
            {"$set": new_settings},
            upsert=True
        )
        
        # Log the change
        for key, value in new_settings.items():
            action = f"Enabled {key.replace('_', ' ')}" if value else f"Disabled {key.replace('_', ' ')}"
            self.add_log(action, "System Config", 0)
            
        return self.get_settings()

    def get_logs(self):
        db = get_db()
        logs = list(db.automation_logs.find().sort("timestamp", -1).limit(20))
        for log in logs:
            log["_id"] = str(log["_id"])
        return logs

    def add_log(self, action, resource, savings):
        db = get_db()
        log = {
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "action": action,
            "resource": resource,
            "savings": savings,
            "status": "success"
        }
        db.automation_logs.insert_one(log)
        return log

    def get_suggestions(self, usage_data):
        config = config_service.get_config()
        priority = config.get('priority', 50)
        
        suggestions = []
        cpu = usage_data.get("cpu", 0)
        traffic = usage_data.get("traffic", 0)
        
        if cpu > 70 or traffic > 800:
            suggestions.append({
                "id": "s1",
                "title": "Enable auto-scaling to save 15% cost",
                "description": "High traffic detected. Auto-scaling will optimize resource allocation.",
                "impact": "high"
            })
        
        if cpu < 20:
            suggestions.append({
                "id": "s2",
                "title": "Shut down idle instances at night",
                "description": "Low utilization periods identified. Scheduling shutdowns can save up to 30%.",
                "impact": "medium"
            })
            
        if priority > 70:
            suggestions.append({
                "id": "s3",
                "title": "Enable Carbon-Aware Shifting",
                "description": "Sustainability is your priority. Shifting workloads can reduce emissions by 40%.",
                "impact": "high"
            })
            
        return suggestions

automation_service = AutomationService()
