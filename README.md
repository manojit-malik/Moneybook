# Moneybook
MoneyBook is a full-stack personal finance tracker built with React and Spring Boot. It helps users manage income, expenses, loans, recoveries, and settlements with JWT security, real-time balance insights, advanced filters, charts, dark/light mode, and a fully responsive UI.

💰 MoneyBook – Personal Finance & Loan Tracker: 
MoneyBook is a full-stack personal finance management application that helps users track income, expenses, loans, recoveries, and settlements in a clean, secure, and intuitive way.
The application is designed with a production-ready architecture, focusing on usability, accuracy, security, and performance.

🎯 What Problem It Solves: 
Track daily expenses and income
Manage money lent to others and loans taken
Understand real balance vs outstanding loans
View financial insights visually
Keep all data secure per user

🚀 Key Features: 
🔐 Authentication & Security
JWT-based login & registration
Auto logout on token expiry
Secure API access with Spring Security
Stateless backend architecture

👤 User-Aware Experience: 
User name displayed across:
Header
Sidebar
Mobile layout
Personalized dashboard

📊 Financial Dashboard: 
Total balance calculation
Loan taken vs loan given
Interactive charts:
Balance overview
Expense & loan breakdown

💸 Transaction Management: 
Add & edit transactions
Supported types:
Income
Expense
Loan Taken
Loan Given
Recovery
Settlement
Accurate balance impact per type

🔍 Advanced Filtering & Sorting: 
Filter by transaction type
Sort by:
Latest
Amount (High → Low)
Amount (Low → High)
Date range filter
Single-day view
Range view
Future dates disabled
Filters work independently & together

🌙 UI & UX: 
Light & Dark mode
Fully responsive (desktop + mobile)
Clean, modern design using Tailwind CSS
Optimized layouts for readability

🛠 Technology Stack: 
Frontend: 
React 18 (Vite)
Tailwind CSS
React Router
Axios
JWT Decode
Chart.js / Recharts

Backend: 
Java 17+
Spring Boot
Spring Security
JWT (jjwt)
MongoDB
Lombok

🏗 Architecture Overview: 
Frontend: SPA consuming REST APIs
Backend: Secure stateless REST API
Database: MongoDB (user-scoped data)
Auth Flow: JWT stored in browser, decoded on client, validated on server
