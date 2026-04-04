# 🌿 Green Cloud Cost Optimizer

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Neural-powered infrastructure optimization for a sustainable digital future.**

The **Green Cloud Cost Optimizer** is a next-generation FinOps and GreenOps platform designed to help organizations reduce cloud waste and minimize their environmental impact. By combining real-time telemetry with intelligent automation, it provides actionable insights that balance financial efficiency with ecological responsibility.

---

## ⚠️ The Problem
Cloud over-provisioning is a silent crisis. Organizations typically waste **30-35%** of their cloud spend on idle or oversized resources. This doesn't just hurt the bottom line—it contributes significantly to global carbon emissions. Traditional cloud management tools focus purely on cost, often ignoring the environmental "carbon debt" of digital infrastructure.

## ✨ Features

### 🧠 Neural Optimizer
Intelligent right-sizing recommendations that analyze CPU, Memory, and Request patterns to suggest the most efficient instance types.

### 📊 Carbon Ledger
A transparent, real-time audit of your digital carbon footprint. Track emissions (kg CO2) across regions and instance families with high-fidelity data visualization.

### 🤖 Automation Engine
Autonomous rules that act on your behalf:
- **Auto-Scaling**: Dynamic resource adjustment based on traffic.
- **Idle Shutdown**: Terminate resources with low utilization automatically.
- **Carbon-Aware Shifting**: Move non-critical workloads to "greener" regions during peak intensity.

### 🛡️ System Guardrails
Enforce operational safety with real-time risk monitoring. Set hard limits on monthly budget, CPU utilization, and carbon emissions to prevent "bill shock" and environmental breaches.

### ⚙️ Multi-Cloud Config
Seamlessly switch between AWS, GCP, and Azure. Customize your optimization priority—from "Budget First" to "Eco First"—to align with your corporate ESG goals.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (Animations), Recharts (Data Viz), Lucide React (Icons).
- **Backend**: Flask (Python 3.x), MongoDB (NoSQL Database).
- **Deployment**: Vercel (Frontend), Render (Backend), MongoDB Atlas (Cloud DB).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create a .env file with your MONGO_URI
python run.py
```

### 2. Frontend Setup
```bash
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 🔮 Future Roadmap
- [ ] **Predictive Forecasting**: Use ML to predict future spend and emissions based on historical trends.
- [ ] **Infrastructure as Code (IaC) Integration**: Automatically generate Terraform or Pulumi PRs for recommended changes.
- [ ] **Kubernetes Support**: Deep-dive optimization for K8s clusters and pod-level efficiency.
- [ ] **Mobile App**: Real-time push notifications for guardrail breaches and critical alerts.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for a Greener Planet.**
