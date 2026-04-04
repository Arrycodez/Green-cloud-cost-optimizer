from typing import Dict, Any

class CarbonService:
    def __init__(self):
        # Emission Factors (gCO2e per kWh)
        # Source: Average grid intensity by region (Approximate values)
        self.region_emission_factors = {
            "us-east-1": 379.0,    # Virginia (Mixed grid)
            "us-west-2": 298.0,    # Oregon (Higher renewables)
            "eu-west-1": 295.0,    # Ireland
            "eu-central-1": 311.0, # Frankfurt
            "ap-southeast-1": 408.0, # Singapore (High fossil fuel)
            "ca-central-1": 28.0,   # Canada (High Hydro - Very Green)
            "sa-east-1": 102.0      # Sao Paulo
        }
        
        # Constants for calculation
        self.PUE = 1.1             # Power Usage Effectiveness (Data center overhead)
        self.KWH_PER_CPU_HOUR = 0.012 # Avg power consumption (12W per core)

    def calculate_emissions(self, cpu_hours: float, region: str) -> float:
        """
        Calculates total CO2 emissions in kilograms.
        """
        emission_factor = self.region_emission_factors.get(region, 350.0) # Default to global avg
        
        # Formula: (CPU Hours * Power * PUE * Emission Factor) / 1000 (to get kg)
        energy_kwh = cpu_hours * self.KWH_PER_CPU_HOUR * self.PUE
        emissions_kg = (energy_kwh * emission_factor) / 1000
        
        return round(emissions_kg, 4)

    def get_impact_report(self, current_cpu_hours: float, optimized_cpu_hours: float, region: str) -> Dict[str, Any]:
        """
        Generates a comparison report showing the reduction in carbon footprint.
        """
        current_emissions = self.calculate_emissions(current_cpu_hours, region)
        optimized_emissions = self.calculate_emissions(optimized_cpu_hours, region)
        
        reduction = current_emissions - optimized_emissions
        reduction_pct = (reduction / current_emissions * 100) if current_emissions > 0 else 0
        
        # Environmental Equivalents (Approximate)
        # 1 tree absorbs ~21kg CO2 per year
        trees_equivalent = reduction / 21.0
        
        return {
            "region": region,
            "current_emissions_kg": current_emissions,
            "optimized_emissions_kg": optimized_emissions,
            "reduction_kg": round(reduction, 4),
            "reduction_percentage": round(reduction_pct, 2),
            "environmental_impact": {
                "trees_saved_yearly": round(trees_equivalent, 2),
                "miles_driven_equivalent": round(reduction * 2.4, 2) # ~2.4 miles per kg CO2
            }
        }

# Example Usage
if __name__ == "__main__":
    service = CarbonService()
    # Scenario: Reducing 1000 CPU hours to 600 in a "dirty" grid region
    report = service.get_impact_report(1000, 600, "ap-southeast-1")
    print(f"Carbon Saved: {report['reduction_kg']} kg")
    print(f"Equivalent to planting {report['environmental_impact']['trees_saved_yearly']} trees!")
