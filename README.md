# 🚀 Full-Stack User Management System (UMS)

This project is a robust, full-stack implementation of a User Management System (UMS), adhering strictly to the technical assignment specifications. It emphasizes security, RESTful architecture, and role-based access control (RBAC).

## 🛠️ Technology Stack & Key Features

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Client-side dashboard and user interface. |
| **Backend** | **Node.js** (Express.js) | REST API endpoints and business logic. |
| **Database** | **MySQL** | Persistent data storage and user management. |
| **Security** | **JWT** (Access/Refresh Tokens) | Secure authentication and session management. |
| **Hashing** | **bcrypt** | Secure one-way password hashing for user credentials. |
| **Access Control** | **RBAC** | Role-Based Access Control protecting the Admin Panel. |

---

## 📁 Project Structure

The project uses a clean, separated service architecture within a single workspace:

ums/ ├── ums-backend/ # Node.js API (Port 5000) ├── ums-frontend/ # React Application (Port 3000) └── README.md # This file

---

## ⚙️ I. Getting Started: Local Setup

### 1. Prerequisites

Before starting, ensure you have the following installed on your system:

* **Node.js** (Version 18 or higher recommended)
* **MySQL Server**
* **Git**

### 2. Database Configuration

1.  Ensure your **MySQL Server** is running.
2.  Create an empty database named **`ums_db`**.
3.  Create a file named **`.env`** inside the **`ums-backend`** directory and configure your local database credentials and JWT secrets:

    ```env
    # ums-backend/.env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=ums_db

    PORT=5000
    JWT_SECRET=SUPER_SECURE_JWT_KEY_1
    REFRESH_SECRET=SUPER_SECURE_REFRESH_KEY_2
    ```

### 3. Install Dependencies

You must install dependencies for both the frontend and backend. Run these commands from the **root** folder (`ums/`), navigating into each sub-folder:

```bash
# Install backend dependencies
cd ums-backend
npm install
npm run dev

# Install frontend dependencies
cd ../ums-frontend
npm install
npm start