# 🩺 HealLink – Unified Family Health & Wellness Dashboard

A single platform where families can **securely manage health records, prescriptions, and appointments** for all members in one organized dashboard.


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


### **Hosting**
| Layer | Platform |
|-------|-----------|
| Frontend | Vercel (https://heal-link-ten.vercel.app) |
| Backend | Render (https://heallink-b8r5.onrender.com/api) |
| Database | MongoDB Atlas (mongodb+srv://admin:admin1155@heallink.u5pppye.mongodb.net/?appName=HealLink) |

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

