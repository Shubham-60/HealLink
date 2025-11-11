# 🩺 HealLink – Unified Family Health & Wellness Dashboard

A single platform where families can **securely manage health records, prescriptions, and appointments** for all members in one organized dashboard.

---

## 🧾 Information Provided by Shubham Aggarwal

Below are the project details provided for creating this README:

1. **Project Title:**  
   HealLink – Unified Family Health & Wellness Dashboard  
   → A single platform where families can securely manage health records, prescriptions, and appointments for all members in one organized dashboard.

2. **Problem Statement:**  
   Managing family health records is often messy, with reports, prescriptions, and appointments scattered across different sources, making tracking and access difficult.  
   HealLink centralizes all family health information — records, prescriptions, and reminders — into one secure, easy-to-manage dashboard.

3. **System Architecture:**  
   **Frontend → Backend (API) → Database → External Platform APIs**

   - **Frontend:** Next.js (with routing for dashboard, member profiles, medical records, and appointments pages)  
   - **Backend:** Node.js + Express.js  
   - **Database:** MongoDB / PostgreSQL  
   - **Authentication:** JWT / Clerk / Firebase Authentication for secure login, signup, and role-based access (Family Admin / Member)

   **Hosting:**  
   - Frontend → Vercel  
   - Backend → Render / Railway  
   - Database → MongoDB Atlas / ElephantSQL / Aiven

4. **Key Features:**  
   - Authentication & Authorization  
   - CRUD Operations  
   - Filtering, Searching & Sorting  
   - Pagination  
   - Frontend Routing  
   - Dynamic Data Fetching

5. **Tech Stack:**  
   - Frontend: Next.js, TailwindCSS, ShadCN UI  
   - Backend: Node.js, Express.js  
   - Database: MongoDB / PostgreSQL  
   - Authentication: JWT / Clerk / Firebase Authentication

6. **API Overview:**  
   Includes endpoints for authentication, health records, appointments, and search.

---

## 🧩 Problem Statement

Managing family health records is often messy — reports, prescriptions, and appointments are scattered across multiple apps or physical copies, making it hard to track or access them easily.

**HealLink** solves this by **centralizing all family health information** (medical records, prescriptions, and reminders) into one **secure, easy-to-manage dashboard** accessible anytime, anywhere.

---

## 🏗️ System Architecture

### **Architecture Overview**
- **Frontend:** Next.js  
  - Routing for Dashboard, Member Profiles, Medical Records, and Appointments  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB / PostgreSQL  
- **Authentication:** JWT / Clerk / Firebase Authentication  
  - Role-based access: Family Admin / Member  

### **Hosting**
| Layer | Platform |
|-------|-----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas / ElephantSQL / Aiven |

---

## ✨ Key Features

| **Category** | **Features** |
|---------------|--------------|
| **Authentication & Authorization** | Secure signup, login, and logout using JWT / Clerk / Firebase Authentication with role-based access. |
| **CRUD Operations** | Create, Read, Update, and Delete health records and appointments. |
| **Filtering, Searching & Sorting** | Search and organize health records by member name, doctor, or date with filters and sorting. |
| **Pagination** | Paginated lists for records and appointments for smooth navigation. |
| **Frontend Routing** | Multiple pages — Home, Login, Dashboard, Health Records, and Appointments. |
| **Dynamic Data Fetching** | Real-time updates via API calls (Axios / Fetch). |

---

## 🧠 Tech Stack

| **Layer** | **Technologies** |
|------------|------------------|
| **Frontend** | Next.js, TailwindCSS, ShadCN UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / PostgreSQL |
| **Authentication** | JWT / Clerk / Firebase Authentication |

---

## 🔗 API Overview

| **Endpoint** | **Method** | **Description** | **Access** |
|---------------|------------|------------------|-------------|
| `/api/auth/signup` | `POST` | Register a new user (Admin / Member) | Public |
| `/api/auth/login` | `POST` | Authenticate user | Public |
| `/api/records` | `GET / POST` | Fetch all health records or add a new record | Authenticated |
| `/api/records/:id` | `PUT / DELETE` | Update or delete an existing record | Authenticated |
| `/api/appointments` | `GET / POST` | View all appointments or add a new appointment | Authenticated |
| `/api/appointments/:id` | `PUT / DELETE` | Update or cancel an appointment | Authenticated |
| `/api/search` | `GET` | Search or filter health records by name, date, or doctor | Authenticated |

