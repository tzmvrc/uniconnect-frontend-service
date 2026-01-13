# Uniconnect – Frontend

Uniconnect – Frontend is the **client-side application** of the **Uniconnect Forum**, responsible for delivering an interactive, responsive, and user-friendly interface for users. It communicates with the Uniconnect backend service via REST APIs and is deployed using **Vercel**.

## 🌐 Live Deployment

The frontend application is hosted on **Vercel**, providing fast load times and continuous deployment from the GitHub repository.

## 📌 Project Overview

The Uniconnect Forum is an academic-focused discussion platform that allows users to create posts, participate in discussions, and interact with content in a structured and intuitive environment. This frontend handles all user interactions, UI rendering, and API communication.

## 🛠️ Tech Stack

* **Framework:** React.js
* **Styling:** Tailwind CSS
* **State Management:** React Hooks
* **API Communication:** Axios
* **Deployment:** Vercel

## ✨ Key Features

* Responsive user interface
* User authentication and session handling
* Forum posts and announcements display
* Commenting and interaction system
* Profile management UI
* API integration with backend services

## 📂 Project Structure

```
Uniconnect-Frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── services/      # API calls and helpers
│   ├── hooks/         # Custom React hooks
│   ├── context/       # Global state management
│   └── App.jsx        # Root component
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

* Node.js (v16 or later recommended)
* npm 

### Installation

```bash
git clone https://github.com/your-username/uniconnect-frontend.git
cd uniconnect-frontend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=https://your-backend-api-url
```

### Running Locally

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

## 🔌 API Integration

This frontend consumes RESTful APIs provided by the **Uniconnect – Service** backend. All API configurations are centralized for maintainability and scalability.

## 🎓 Purpose

This project was developed as part of an **academic and learning-focused initiative**, emphasizing frontend development, UI/UX design, and real-world deployment practices.

## 📌 Notes

* This repository contains **frontend-only code**.
* Backend services are maintained in a separate repository.

## 👤 Author

**Marc Aspa** <br>
**Samantha Paradero**<br>
**Lawrence De Guia**<br>
**Chasie Caduhada**<br>
**Joshua Natino**

---

You may update this README as features and integrations evolve.
