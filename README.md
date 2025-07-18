# 📚 LibraryConnect

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Phases & Progress](#project-phases--progress)
- [Getting Started](#getting-started)
- [Contact](#contact)

---

## 📌 About

**LibraryConnect** is a modern, **MERN stack-based Library Management System** designed to streamline library operations and enhance the experience for administrators, librarians, and members.  
Our mission is to provide an efficient and intuitive platform for managing books, users, and borrowing activities, making libraries more accessible and organized.

---

## 🚀 Features

### ✅ Core Features

- **Role-Based Access Control**  
  Differentiated access for Admins, Librarians, and Members.

- **User & Role Management**  
  Admins can manage user accounts and assign roles.

- **Book Management**  
  CRUD operations for books by Librarians and Admins.

- **Book Issuance & Return**  
  Easy issue and return process by Librarians.

- **Book Reservation System**  
  Members can request and reserve books.

- **Borrowing History**  
  Members can view their complete borrowing history.

- **Search & View Books**  
  Powerful search for available books in the catalog.

- **Reporting & Analytics**  
  Admins get insights into library activities.

- **Dashboard Views**  
  Role-specific dashboards with relevant metrics.

---

## 🛠 Technology Stack

### 🖥 Frontend

- **Next.js** – React framework with SSR & SSG.
- **App Router** – Next.js 13+ routing system.
- **Shadcn UI** – UI component library using Radix + Tailwind.
- **Formik** – Form state management.
- **Yup** – Form validation.
- **Axios** – For API communication.
- **Redux** – Global state management.

### ⚙️ Backend

- **Node.js** – JavaScript runtime.
- **Express.js** – Web framework for Node.
- **Mongoose** – MongoDB ODM.
- **bcrypt** – Password hashing.
- **jsonwebtoken (JWT)** – Token-based authentication.

### 🗂 Database

- **MongoDB** – NoSQL document database.

---

## 🔄 Project Phases & Progress

### ✅ Phase 1: Core Authentication & Admin Powerhouse

**Status:** ✅ Completed

- Secure login, registration, and JWT-based auth.
- Admin dashboard with role and user management.
- Fully integrated Redux store and API.

### ⚙️ Phase 2: Librarian's Command Center & Book Circulation

**Status:** 🚧 In Progress

- Librarian dashboard with:
  - Book CRUD
  - Issuance & Return
  - Manage reservations
- Backend endpoints for full librarian features.

### 🧑‍💼 Phase 3: Member's Gateway (Coming Soon)

**Goal:** Personalized experience for members.

- Borrowing history
- Book search & filter
- Reserve/request/return books

### 📈 Phase 4: Advanced Features (Planned)

- Reporting dashboards
- Notification system
- UX enhancements

---

## 🧰 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or cloud like MongoDB Atlas)

### 🔧 Installation

#### 1. Clone the repository

```bash
git clone <your-repository-url>
cd library-connect
