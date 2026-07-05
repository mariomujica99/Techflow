<div align="center">
  <img src="https://github.com/user-attachments/assets/93b3fb76-371f-4fa4-b88c-927e28067a36" alt="Techflow Logo" width="100" height="100" />
  
# Techflow Portal
### EEG Workflow Management Portal

[![Website](https://img.shields.io/badge/Website-Techflow-30b5b2?style=for-the-badge)](https://techflow-portal.onrender.com)
[![YouTube](https://img.shields.io/badge/Video_Demo-YouTube-red?style=for-the-badge)](https://www.youtube.com/watch?v=th6pe1BtIMc)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mario_Mujica-blue?style=for-the-badge)](https://www.linkedin.com/in/mario-mujica-903b19172)

A Progressive Web App (PWA) for EEG Technologists in the hospital neurophysiology department. Techflow streamlines EEG workflow management (equipment tracking, supply coordination, team collaboration) into one accessible platform.

</div>

---

> ### About This Repository
> This is the **department-ready version** of Techflow, built specifically for potential adoption in a hospital neurophysiology department.
>
> A Task Management System (EEG orders, patient task checklists, procedure-level data) requires a formal HIPAA compliance review for deployment in a clinical environment. This version intentionally excludes those features as a deliberate compliance decision, and adds multi-department architecture.
> 
> This version was demonstrated to my department, but ultimately, the department did not move forward with implementation. The full feature set, including the Task Management System, is preserved in a separate repository and is the primary showcase of this project.
>
> ### Task Management Version
> [![Techflow](https://img.shields.io/badge/Techflow-EEG_Task_Manager_Repo-30b5b2?style=for-the-badge&logo=github)](https://github.com/mariomujica99/eeg-task-manager)  
> **Want to explore the full task management tools?**  
> Techflow EEG Task Manager includes everything in this app, plus a complete **Task Management System** for EEG orders.

---

## Table of Contents
- [Overview](#overview)
- [Demo](#demo)
- [Website Access](#website-access)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)
- [Disclaimer](#disclaimer)

---

## Overview

**Techflow** is a full-stack Progressive Web App designed specifically for **EEG (Electroencephalography) Technologists** working in hospital neurophysiology departments. The system addresses real-world operational challenges by providing:

- Team coordination through an interactive digital whiteboard
- Equipment monitoring for an overview of issues with computer stations
- Inventory tracking for medical supplies across multiple storage locations
- Role-based access control separating admin and member responsibilities
- Multi-department architecture allowing each department to operate independently

This application was built to demonstrate my full-stack development skills including authentication, state management, file uploads, and responsive design.

**The Problems:**
- Manual Whiteboard: Staff must navigate through a chat to find the whiteboard picture of the day
- Communication Gaps: No centralized system for supply needs, leading to delays and out of stock supplies
- Information: Important images and reference materials not centralized
- Equipment Issues: Computer station problems aren't consistently documented or tracked

**Solution:** Techflow brings everything related to our department into one central, accessible location. It is as a digital command center for EEG operations.

---

## Demo

### **Desktop**

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/597c74bb-662d-4108-a791-310ec17b66e2" alt="Mac PWA Icon" width="100%" />
      <p align="center">Mac PWA App Icon</p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/6609dfb0-dd5a-41dd-81dd-2f5cbbadbfba" alt="Safari Favorites" width="100%" />
      <p align="center">Safari Favorites App Icon</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/44f2c110-e86e-4b7b-9bd4-21194ee23dbb" alt="Safari Install" width="100%" />
      <p align="center">Safari Mac PWA Install</p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/651bc97d-54cb-4f7f-ad30-006acb889977" alt="Chrome Install" width="100%" />
      <p align="center">Chrome Mac PWA Install</p>
    </td>
  </tr>
</table>


### **Video Demo**
[![Watch Full Demo](https://img.shields.io/badge/Watch_Demo-4:14_Full_Walkthrough-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=th6pe1BtIMc)

*Complete feature demonstration showcasing all pages and functionality on a mobile device (iPhone)*

## Website Access

### **Website Application**

[![Open Techflow](https://img.shields.io/badge/Open_Website-Techflow-30b5b2?style=for-the-badge&logo=link&logoColor=white)](https://techflow-portal.onrender.com)

*Production deployment with full functionality - feel free to try it for yourself*

### **Demo Accounts**

**User Account**
```
Email: userdemo@gmail.com
Password: Demo2026!
```

**Admin Account**
```
Email: admindemo@gmail.com
Password: Demo2026!
```

### **Demo Account Restrictions**

For the best experience for all users, demo accounts have **limited access**:

**Restricted Actions:**
- Profile editing (name, email, password, contact info)
- Account deletion
- Deleting users, providers, computer stations, or files

**Full Access:**
- Update the whiteboard
- Manage supplies
- View all pages and features
- Download Excel reports (Admin)

These restrictions preserve demo data integrity so everyone can explore the full application without encountering deleted or modified content.

**Note:** Please log out when you are finished testing the application to ensure availability for others.

---

## Key Features

### **Whiteboard**
- **Coverage Assignments:**
  - **On-Call** - After-hours on-call coverage
  - **Surg-Call** - Surgical on-call coverage
  - **Scanning** - Scan EEG studies
  - **Surgicals** - Surgical EEG hook-up
  - **WADA** - WADA test procedure

- **Outpatient Scheduling (6 Time Slots):**
  - **NP 8am** - Neuropsychiatric EEG slot
  - **OP 8am-1, 8am-2, 10am, 12pm, 2pm** - Outpatient slots
  - Only two 8am slots can be selected for the day (8am 1|2|NP).

- **Reading Provider Assignments:**
  - **EMU** - Epilepsy Monitoring Unit reading provider
  - **LTM** - Long-term monitoring reading provider
  - **Routine** - Routine EEG reading provider
    - All Day Reader or AM Reader and PM Reader

- **Extra:**
  - **Comments Section** - Add important notes or special instructions for the day
  - **Birthdays & Anniversaries** - Celebrate team milestones on the whiteboard
  - **Date Display** - Always shows current date for reference
  - **Last Updated Tracking** - Displays who made changes and precise timestamp

### **Supplies Management**
- **5 Storage Locations:**
  - Department
  - Outpatient Rooms
  - 2nd Floor Storage
  - 6th Floor Storage
  - 8th Floor Storage
- Pre-populated supply catalog (35+ items)
- Custom supply item creation
- One-click "Check All" to clear supply lists
- Last updated by tracking with timestamps
- Excel export for procurement (Admin Only)

### **Computer Station Monitoring**
- Equipment types: EMU Stations & EEG Carts
- Location tracking: Inpatient, Outpatient, BMC
- Active/Inactive status management
- Normal/Issue condition management
- Issue description with IT ticket integration
- Filtering system (All, Inactive, with Issue, by Type, by Location)
- Real-time equipment availability dashboard
- Excel export for reporting (Admin Only)

### **File Management System**
- Hierarchical folder structure
- Cloud storage via Cloudinary CDN
- Supported formats: PDF, Images (JPG, PNG)
- File upload with drag-and-drop (up to 50MB)
- In-browser preview for PDFs and images
- Folder size calculation (recursive)
- Download functionality
- Folder deletion with cascade (removes all folder contents)

### **Team Member Directory**
- View all department members alphabetically
- Contact information display (Email, Phone, Pager)
- Admin view includes user deletion
- Excel export for team directory (Admin Only)

### **Reading Provider Management**
- Provider profile creation with color-coded avatars (Admin Only)
- Contact information (Email, Phone Number, Pager, Office Number)
- Assignment to whiteboard reading sections
- Excel export with provider directory (Admin Only)

### Multi-Department Support
Techflow is architected for **multi-department deployment**. Each department operates in a fully isolated environment. Data, users, whiteboards, supplies, and files are all scoped per department. No data crosses department boundaries.

**How it works:**
- Department administrators receive a unique **Department Invite Token** to share with their team
- All users who register with that token are automatically scoped to that department
- An optional **Admin Invite Token** grants elevated admin privileges within a department
- Each department has its own independent whiteboard, supply lists, computer stations, file storage, and user directory

This design allows multiple hospital departments to run Techflow simultaneously without any overlap in data or operations.

### **Authentication & Authorization**
- Secure JWT-based authentication with 14-day token expiration
- Role-based access control (Admin/User)
- Department and Admin invite token system for controlled registration
- Password hashing using bcrypt with salt rounds
- Profile customization with image uploads or color avatars
- Account management with secure deletion

### **Progressive Web App (PWA)**
- Installable on desktop and mobile devices
- Add to home screen functionality
- App-like experience with custom icons
- Safe area insets for notched devices

---

## Tech Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.3.1 |
| **Vite** | Build Tool & Dev Server | 6.0.11 |
| **Tailwind CSS** | Styling Framework | v4 |
| **React Router** | Client-side Routing | 7.1.5 |
| **Axios** | HTTP Client | 1.7.9 |
| **Moment.js** | Date Formatting | 2.30.1 |
| **React Hot Toast** | Toast Notifications | 2.4.1 |
| **React Icons** | Icon Library | 5.4.0 |

### **Backend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript Runtime | - |
| **Express.js** | Web Framework | 4.19.2 |
| **MongoDB** | NoSQL Database | - |
| **Mongoose** | MongoDB ODM | 8.16.5 |
| **JWT** | Authentication | 9.0.2 |
| **bcrypt.js** | Password Hashing | 3.0.2 |
| **Cloudinary** | Cloud Storage | 1.41.3 |
| **Multer** | File Upload Middleware | 2.0.2 |
| **ExcelJS** | Report Generation | 4.4.0 |
| **CORS** | Cross-Origin Resource Sharing | 2.8.5 |

### **Development Tools**
- **Postman** - API Testing
- **GitHub** - Source Control
- **Render** - Cloud Deployment
- **MongoDB Atlas** - Database Hosting

---

## Architecture

### **System Design**

```
┌────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite)                                   │   │
│  │  - Context API for State Management                 │   │
│  │  - React Router for Navigation                      │   │
│  │  - Axios Interceptors for API Calls                 │   │
│  │  - Service Worker for PWA                           │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/REST
┌────────────────────────────────────────────────────────────┐
│                         API LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Express.js REST API                                │   │
│  │  - JWT Authentication Middleware                    │   │
│  │  - Role-based Authorization                         │   │
│  │  - Department-scoped Data Isolation                 │   │
│  │  - Error Handling Middleware                        │   │
│  │  - Multer File Upload                               │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas (Cloud)                              │   │
│  │  - Users, Providers, ComStations                    │   │
│  │  - Whiteboards, Supplies, Files                     │   │
│  │  - Department-scoped via departmentId               │   │
│  │  - Mongoose ODM with Schema Validation              │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cloudinary CDN                                     │   │
│  │  - Profile Images                                   │   │
│  │  - Uploaded Files (PDF, Images)                     │   │
│  │  - Automatic Optimization                           │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### **Database Schema Design**

**6 Core Collections:**
1. **Users** - Team members with authentication and department scoping
2. **Providers** - Reading physicians
3. **ComStations** - Equipment tracking
4. **Supplies** - Inventory by storage room
5. **Whiteboards** - Daily assignments with user/provider references
6. **Files** - Document hierarchy with folder support

**Key Relationships:**
- All resources scoped to `departmentId` for data isolation
- Whiteboards → Users (many-to-many via coverage arrays)
- Whiteboards → Providers (one-to-one via readingProviders)
- Files → Users (one-to-many via uploadedBy)
- Files → Files (self-referential for folder hierarchy)

---

## Frontend

### **State Management Strategy**
- **Context API** for global user authentication state
- **Local State** (useState) for component-specific data
- **Local Storage** for JWT token persistence

### **Routing Architecture**
- **Public Routes:** Login, Sign Up
- **Private Routes (Members):** Whiteboard, Supplies, Computer Stations, Files, Team Members, Providers, Edit Profile
- **Private Routes (Admins):** All member routes + Create/Delete operations, Reports
- **Role-based redirects** on login based on user role

### **Responsive Design Approach**
- **Mobile-First** Tailwind CSS classes
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px), 3xl (1920px)
- **Touch-Optimized** UI elements for mobile devices
- **Viewport Fit** for notched devices (iPhone X+)
- **Safe Area Insets** for PWA installation

---

## Backend

### **API Endpoints**

#### **Authentication** (`/api/auth`)
```
POST   /register                  # Create new user account
POST   /login                     # Authenticate user
GET    /profile                   # Get current user
PUT    /profile                   # Update user profile
DELETE /profile                   # Delete user account
POST   /upload-profile-image      # Upload profile picture
```

#### **Users** (`/api/users`)
```
GET    /                          # Get all users in department
GET    /:id                       # Get user by ID
DELETE /:id                       # Delete user (admin only)
```

#### **Whiteboards** (`/api/whiteboard`)
```
GET    /                          # Get whiteboard data
PUT    /                          # Update whiteboard
```

#### **Computer Stations** (`/api/com-stations`)
```
GET    /                          # Get stations (with filters)
POST   /                          # Create station (admin only)
PUT    /:id                       # Update station
DELETE /:id                       # Delete station (admin only)
```

#### **Providers** (`/api/providers`)
```
GET    /                          # Get all providers
GET    /:id                       # Get provider by ID
POST   /                          # Create provider (admin only)
PUT    /:id                       # Update provider (admin only)
DELETE /:id                       # Delete provider (admin only)
```

#### **Supplies** (`/api/supplies`)
```
GET    /                          # Get all supplies
PUT    /:storageRoom              # Update supplies for room
```

#### **Files** (`/api/files`)
```
GET    /                          # Get files (with folder filter)
POST   /folder                    # Create folder (admin only)
POST   /upload                    # Upload file (admin only)
GET    /download/:id              # Download file
DELETE /:id                       # Delete file/folder (admin only)
```

#### **Reports** (`/api/reports`)
```
GET    /export/users              # Excel: Team directory
GET    /export/providers          # Excel: Provider contacts
GET    /export/com-stations       # Excel: Equipment inventory
GET    /export/supplies           # Excel: Needed supplies
```

### **Security Implementations**
- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Secrets:** Stored in environment variables
- **CORS Configuration:** Whitelist specific origins
- **Input Validation:** Mongoose schema validation
- **File Type Restrictions:** Multer fileFilter
- **Department Isolation:** All queries scoped by departmentId
- **Error Handling:** Never expose stack traces in production

---

## Learning Outcomes

#### **Full-Stack Development**
- Built complete MERN stack application
- Designed and implemented RESTful API architecture
- Managed complex client-server data flow
- Integrated third-party cloud services

#### **React & Frontend Engineering**
- Component composition and reusability patterns
- Context API for global state management
- Custom hooks for logic abstraction
- React Router for multi-page navigation
- Controlled forms with validation
- Conditional rendering and dynamic UI

#### **Backend Development & APIs**
- Express.js middleware architecture
- JWT-based authentication system
- Role-based authorization (RBAC)
- MongoDB schema design with multi-tenant relationships
- File upload handling with Multer
- Excel report generation with ExcelJS
- Error handling and validation

#### **Database Design**
- NoSQL document modeling with MongoDB
- Mongoose ODM with schema validation
- Department-scoped multi-tenant data isolation
- Population of references across collections
- Data integrity with cascading deletes

#### **Authentication & Security**
- Password hashing with bcrypt
- JWT token generation and verification
- Protected route middleware
- Role-based access control
- Secure file upload validation
- CORS configuration
- Environment variable management
- Multi-department isolation via departmentId

#### **UI/UX Design**
- Responsive design with Tailwind CSS
- Mobile-first approach
- Intuitive navigation patterns
- Color-coded status indicators
- Toast notifications for user feedback
- Loading states and error handling

#### **Progressive Web App (PWA)**
- Service Worker implementation
- Web App Manifest configuration
- Installable application
- App icons for multiple platforms
- Safe area insets for mobile devices

#### **Cloud Services & Deployment**
- Cloudinary CDN integration
- MongoDB Atlas cloud database
- Render platform deployment
- Environment configuration for production
- HTTPS/SSL setup

#### **Problem-Solving & Architecture**
- Domain-driven design for healthcare workflow
- Multi-tenant architecture with department-scoped data isolation
- Code reusability and DRY principles
- Performance optimization strategies
- Compliance-aware feature scoping

---

## Author

**Mario Mujica**  
*Neurodiagnostic Technologist*  
*Full-Stack Software Developer*  
*B.S. in Neuroscience*

I’m a full-stack developer with a clinical background in neurodiagnostics and a Bachelor’s degree in Neuroscience. I specialize in building modern web applications that solve real-world operational challenges in complex domains such as the neurophysiology department.

Techflow reflects both my technical skill set and my firsthand understanding of EEG department workflows, bridging clinical insight with scalable software design.

- **LinkedIn:** [www.linkedin.com/in/mario-mujica-903b19172](https://www.linkedin.com/in/mario-mujica-903b19172)
- **GitHub:** [@mariomujica99](https://github.com/mariomujica99)
- **Handshake:** [unomaha.joinhandshake.com/profiles/nbw72u](https://unomaha.joinhandshake.com/profiles/nbw72u)
- **Email:** [mariomujica99@gmail.com](mailto:mariomujica99@gmail.com)

---

## Disclaimer

This is a **personal portfolio project** built to demonstrate full-stack development skills. The project is for educational purposes and potential employer review. This project was created independently as a learning exercise and portfolio piece. It is not affiliated with, endorsed by, or connected to any healthcare organization. The demonstration department, staff members, and providers are simulated data. No real clinical data or protected health information (PHI) is used in any capacity.
