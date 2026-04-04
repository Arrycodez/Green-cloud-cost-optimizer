import datetime
from app.db import get_db

class GuardrailsService:
    def __init__(self):
        self.default_limits = {
            "max_budget": 5000,
            "max_cpu": 80,
            "max_carbon": 500
        }

    def get_limits(self):
        db = get_db()
        limits = db.guardrails_limits.find_one({"id": "current_limits"})
        if not limits:
            db.guardrails_limits.insert_one({"id": "current_limits", **self.default_limits})
            return self.default_limits
        limits.pop("_id", None)
        limits.pop("id", None)
        return limits

    def set_limits(self, new_limits):
        db = get_db()
        db.guardrails_limits.update_one(
            {"id": "current_limits"},
            {"$set": new_limits},
            upsert=True
        )
        return self.get_limits()

    def get_status(self, current_usage):
        limits = self.get_limits()
        
        # Calculate risk level
        budget_ratio = current_usage.get("budget", 0) / limits["max_budget"]
        cpu_ratio = current_usage.get("cpu", 0) / limits["max_cpu"]
        carbon_ratio = current_usage.get("carbon", 0) / limits["max_carbon"]
        
        max_ratio = max(budget_ratio, cpu_ratio, carbon_ratio)
        
        if max_ratio > 0.9:
            risk = "High"
            score = 90
        elif max_ratio > 0.7:
            risk = "Medium"
            score = 70
        else:
            risk = "Low"
            score = 30
            
        return {
            "risk_level": risk,
            "risk_score": score,
            "metrics": {
                "budget": budget_ratio * 100,
                "cpu": cpu_ratio * 100,
                "carbon": carbon_ratio * 100
            }
        }

    def get_alerts(self, current_usage):
        limits = self.get_limits()
        alerts = []
        
        if current_usage.get("budget", 0) > limits["max_budget"]:
            alerts.append({
                "type": "budget",
                "message": f"Monthly budget exceeded: ${current_usage['budget']} > ${limits['max_budget']}",
                "severity": "critical",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
        elif current_usage.get("budget", 0) > limits["max_budget"] * 0.8:
            alerts.append({
                "type": "budget",
                "message": "Budget may exceed in 3 days based on current trend",
                "severity": "warning",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })

        if current_usage.get("cpu", 0) > limits["max_cpu"]:
            alerts.append({
                "type": "cpu",
                "message": f"CPU usage threshold breached: {current_usage['cpu']}%",
                "severity": "critical",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
            
        if current_usage.get("carbon", 0) > limits["max_carbon"]:
            alerts.append({
                "type": "carbon",
                "message": f"Carbon emission limit reached: {current_usage['carbon']}kg CO2",
                "severity": "warning",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
            
        return alerts

guardrails_service = GuardrailsService()
