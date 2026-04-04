from typing import Dict, Any
from app.services.config_service import config_service

class CloudOptimizer:
    def __init__(self):
        # Mock Instance Catalog (AWS-like)
        # Format: { name: { cpu_cores, ram_gb, hourly_cost, carbon_factor } }
        self.instance_catalog = {
            "t3.nano":    {"cpu": 2, "ram": 0.5, "cost": 0.0052, "carbon": 0.01},
            "t3.micro":   {"cpu": 2, "ram": 1.0, "cost": 0.0104, "carbon": 0.02},
            "t3.small":   {"cpu": 2, "ram": 2.0, "cost": 0.0208, "carbon": 0.04},
            "t3.medium":  {"cpu": 2, "ram": 4.0, "cost": 0.0416, "carbon": 0.08},
            "t3.large":   {"cpu": 2, "ram": 8.0, "cost": 0.0832, "carbon": 0.16},
            "m5.large":   {"cpu": 2, "ram": 8.0, "cost": 0.0960, "carbon": 0.20},
            "m5.xlarge":  {"cpu": 4, "ram": 16.0, "cost": 0.1920, "carbon": 0.40},
        }

    def analyze(self, current_type: str, avg_cpu: float, avg_mem: float, rps: float, region: str = "us-east-1") -> Dict[str, Any]:
        """
        Analyzes current usage and suggests an optimized state with human-readable suggestions.
        """
        config = config_service.get_config()
        priority = config.get('priority', 50) # 0 = Cost, 100 = Sustainability
        
        current_spec = self.instance_catalog.get(current_type)
        if not current_spec:
            return {"error": "Instance type not found in catalog"}

        # 1. Determine Target Specs based on usage + 20% buffer
        target_cpu_req = (avg_cpu / 70) * current_spec["cpu"]
        target_mem_req = (avg_mem / 70) * current_spec["ram"]
        
        # Traffic-based buffer (Simple heuristic: 1 core per 500 RPS)
        traffic_cpu_buffer = rps / 500
        final_cpu_req = max(target_cpu_req, traffic_cpu_buffer)

        # 2. Find the best instance that meets the requirements based on priority
        recommended_type = current_type
        best_score = float('inf')

        for name, spec in self.instance_catalog.items():
            if spec["cpu"] >= final_cpu_req and spec["ram"] >= target_mem_req:
                # Calculate a "score" based on user priority
                # Lower is better (cost and emissions)
                cost_score = spec["cost"] / current_spec["cost"]
                emission_score = spec["carbon"] / current_spec["carbon"]
                
                # Weighted score based on priority
                total_score = (cost_score * (100 - priority) + emission_score * priority) / 100
                
                if total_score < best_score:
                    best_score = total_score
                    recommended_type = name

        # 3. Calculate Costs and Savings
        current_monthly_cost = current_spec["cost"] * 24 * 30
        optimized_monthly_cost = self.instance_catalog[recommended_type]["cost"] * 24 * 30
        monthly_savings = current_monthly_cost - optimized_monthly_cost
        
        current_monthly_carbon = current_spec["carbon"] * 24 * 30
        optimized_monthly_carbon = self.instance_catalog[recommended_type]["carbon"] * 24 * 30
        monthly_carbon_saved = current_monthly_carbon - optimized_monthly_carbon

        # 4. Determine Scaling Action
        if recommended_type == current_type:
            action = "MAINTAIN"
            if avg_cpu < 20 and avg_mem < 20:
                action = "DOWNSCALE (Underutilized)"
            elif avg_cpu > 85 or avg_mem > 85:
                action = "UPSCALE (Risk of Failure)"
        elif self.instance_catalog[recommended_type]["cost"] < current_spec["cost"]:
            action = "DOWNSCALE (Cost Optimization)"
        else:
            action = "UPSCALE (Performance Requirement)"

        # 5. Generate Intelligent Suggestions
        suggestions = []
        
        # Right-sizing suggestion
        if recommended_type != current_type:
            savings_pct = round((monthly_savings / current_monthly_cost) * 100) if current_monthly_cost > 0 else 0
            suggestions.append({
                "text": f"Switch to {recommended_type} instance to reduce costs by {savings_pct}% while maintaining performance.",
                "type": "high"
            })
        
        # Auto-scaling suggestion
        if rps > 500:
            suggestions.append({
                "text": f"Enable Auto-Scaling Groups to handle traffic spikes (current: {rps} RPS) without over-provisioning.",
                "type": "medium"
            })
        
        # Region shifting suggestion
        green_regions = ["ca-central-1", "sa-east-1", "us-west-2"]
        if priority > 70 and region not in green_regions:
            suggestions.append({
                "text": f"Shift non-critical workloads to ca-central-1 or us-west-2 for up to 90% lower carbon intensity (Sustainability Priority).",
                "type": "high"
            })
        elif region not in green_regions:
            suggestions.append({
                "text": f"Shift non-critical workloads to ca-central-1 or us-west-2 for up to 90% lower carbon intensity.",
                "type": "high"
            })
            
        # Idle resource suggestion
        if avg_cpu < 15:
            suggestions.append({
                "text": "Implement 'Instance Scheduler' to automatically stop resources during idle off-peak hours.",
                "type": "medium"
            })
            
        # Instance Family suggestion
        if "t3" in current_type or "m5" in current_type:
            suggestions.append({
                "text": "Consider ARM-based Graviton (t4g/m6g) instances for 40% better price-performance.",
                "type": "low"
            })

        # Ensure we always have at least 3 suggestions
        if len(suggestions) < 3:
            suggestions.append({
                "text": "Enable S3 Intelligent-Tiering to automate storage cost optimization for infrequently accessed data.",
                "type": "low"
            })

        return {
            "current_type": current_type,
            "recommended_type": recommended_type,
            "action": action,
            "current_monthly_cost": round(current_monthly_cost, 2),
            "optimized_monthly_cost": round(optimized_monthly_cost, 2),
            "monthly_savings_usd": round(monthly_savings, 2),
            "current_monthly_carbon_kg": round(current_monthly_carbon, 2),
            "optimized_monthly_carbon_kg": round(optimized_monthly_carbon, 2),
            "monthly_carbon_saved_kg": round(monthly_carbon_saved, 2),
            "efficiency_score": round(100 - ((avg_cpu + avg_mem) / 2), 1) if action == "MAINTAIN" else 40.0,
            "suggestions": suggestions[:4] # Return top 4 suggestions
        }

# Example Usage:
if __name__ == "__main__":
    optimizer = CloudOptimizer()
    # Scenario: Running a t3.large but only using 15% CPU and 20% Memory
    result = optimizer.analyze("t3.large", 15, 20, 50)
    print(f"Recommendation: {result['recommended_type']}")
    print(f"Action: {result['action']}")
    print(f"Monthly Savings: ${result['monthly_savings_usd']}")
