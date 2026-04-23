# 🌿 Green Cloud Cost Optimizer

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<img width="1881" height="848" alt="image" src="https://github.com/user-attachments/assets/7b523f42-5a26-4358-9b8e-5fac4cf14317" />


**Neural-powered infrastructure optimization for a sustainable digital future.**

The **Green Cloud Cost Optimizer** is a next-generation FinOps and GreenOps platform designed to help organizations reduce cloud waste and minimize their environmental impact. By combining real-time telemetry with intelligent automation, it provides actionable insights that balance financial efficiency with ecological responsibility. https://green-cloud-cost-optimizer.vercel.app

---

## ⚠️ The Problem
Cloud over-provisioning is a silent crisis. Organizations typically waste **30-35%** of their cloud spend on idle or oversized resources. This doesn't just hurt the bottom line—it contributes significantly to global carbon emissions. Traditional cloud management tools focus purely on cost, often ignoring the environmental "carbon debt" of digital infrastructure.

## ✨ Features

### 🧠 Neural Optimizer
Intelligent right-sizing recommendations that analyze CPU, Memory, and Request patterns to suggest the most efficient instance types.
<img width="1873" height="831" alt="image" src="https://github.com/user-attachments/assets/12cdb5c4-9241-4f46-b344-e1e10774fa46" />

### 📊 Carbon Ledger
A transparent, real-time audit of your digital carbon footprint. Track emissions (kg CO2) across regions and instance families with high-fidelity data visualization.
<img width="1890" height="862" alt="image" src="https://github.com/user-attachments/assets/664bd6b7-3abf-47cb-9167-c735d78017ee" />

### 🤖 Automation Engine
Autonomous rules that act on your behalf:
- **Auto-Scaling**: Dynamic resource adjustment based on traffic.
- **Idle Shutdown**: Terminate resources with low utilization automatically.
- **Carbon-Aware Shifting**: Move non-critical workloads to "greener" regions during peak intensity.
<img width="1879" height="845" alt="image" src="https://github.com/user-attachments/assets/a4aa4ded-0921-4b9b-97d2-f5578a2ee982" />

### 🛡️ System Guardrails
Enforce operational safety with real-time risk monitoring. Set hard limits on monthly budget, CPU utilization, and carbon emissions to prevent "bill shock" and environmental breaches.
<img width="1876" height="855" alt="image" src="https://github.com/user-attachments/assets/c5087b05-115f-4e58-a8ac-be3a1251ed27" />

### ⚙️ Multi-Cloud Config
Seamlessly switch between AWS, GCP, and Azure. Customize your optimization priority—from "Budget First" to "Eco First"—to align with your corporate ESG goals.
<img width="1765" height="788" alt="image" src="https://github.com/user-attachments/assets/88893c4e-0812-4495-9c4d-00f0b708ce58" />

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
