<div align="center">
  <img src="https://github.com/user-attachments/assets/93b3fb76-371f-4fa4-b88c-927e28067a36" alt="Techflow Logo" width="100" height="100" />
  
# Techflow
### EEG Workflow Management System

[![Website](https://img.shields.io/badge/Website-Techflow-30b5b2?style=for-the-badge)](https://techflow-eeg.onrender.com)
[![YouTube](https://img.shields.io/badge/Video_Demo-YouTube-red?style=for-the-badge)](https://youtu.be/jFayn1NAa2k)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mario_Mujica-blue?style=for-the-badge)](https://www.linkedin.com/in/mario-mujica-903b19172)

> A comprehensive Progressive Web App (PWA) for EEG Technologists in the hospital neurophysiology department. This project streamlines EEG workflow management, equipment tracking, and team collaboration.

</div>

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

**Techflow** is a full-stack Progressive Web App designed specifically for **EEG (Electroencephalography) Technologists** working in hospital neurophysiology departments. The system addresses real-world challenges in managing complex medical procedures by providing:

- Digital workflow management replacing paper-based task tracking
- Real-time team coordination through interactive whiteboards
- Equipment monitoring for an overview of issues with inactive equipment
- Inventory tracking for medical supplies across multiple storage locations
- Role-based access control separating admin and member responsibilities

This application was built to demonstrate my full-stack development skills including authentication, complex state management, file uploads, data visualization, and responsive design.

**The Problems:**
- Manual Whiteboards: Staff must navigate through a chat to find the whiteboard picture of the day
- Communication Gaps: No centralized system for supply needs, leading to delays and out of stock supplies
- Information: Important images and reference materials not centralized
- Task Visibility: Difficult to track what's been completed versus what needs attention, especially across shifts
- Equipment Issues: Computer station problems aren't consistently documented or tracked

**Solution:** Techflow brings everything related to our department into one central, accessible location. Think of it as a digital command center for EEG operations.

---

## Demo

### **Desktop**

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/597c74bb-662d-4108-a791-310ec17b66e2" alt="Mac PWA Icon" width="100%" />
      <p align="center"><em>Mac PWA App Icon</em></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/5925f097-eb64-497e-8cb1-52278e2af187" alt="Safari Favorites" width="100%" />
      <p align="center"><em>Safari Favorites App Icon</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/44f2c110-e86e-4b7b-9bd4-21194ee23dbb" alt="Safari Install" width="100%" />
      <p align="center"><em>Safari Mac PWA Install</em></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/651bc97d-54cb-4f7f-ad30-006acb889977" alt="Chrome Install" width="100%" />
      <p align="center"><em>Chrome Mac PWA Install</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/5780cea4-18b9-4890-b8dd-79acef326d8f" alt="Techflow PWA Mac Log In Screen" width="100%"  />
      <p align="center"><em>Mac PWA Log In Screen</em></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/d6c6c49d-b4f1-4655-8b92-eb70901193f4" alt="Dashboard" width="100%" />
      <p align="center"><em>Mac PWA Dashboard</em></p>
    </td>
  </tr>
</table>


### **Video Demo**
[![Watch Full Demo](https://img.shields.io/badge/Watch_Demo-6:00_Full_Walkthrough-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/jFayn1NAa2k)

*Complete feature demonstration showcasing all pages and functionality on a mobile device (iPhone)*

## Website Access

### **Website Application**

[![Open Techflow](https://img.shields.io/badge/Open_Website-Techflow-30b5b2?style=for-the-badge&logo=link&logoColor=white)](https://techflow-eeg.onrender.com)

*Production deployment with full functionality - feel free to try it for yourself*

### **Demo Accounts**

**Member Account**
```
Email: userdemo@gmail.com
Password: Demo2025!
```

**Admin Account**
```
Email: admindemo@gmail.com
Password: Demo2025!
```

### **Demo Account Restrictions**

For the best experience for all users, demo accounts have **limited access**:

**Restricted Actions:**
- Profile editing (name, email, password, contact info)
- Account deletion
- Deleting users, providers, computer stations, or files

**Full Access:**
- Create and manage tasks
- Update whiteboards
- Manage supplies
- View all pages and features
- Download Excel reports

These restrictions preserve demo data integrity so everyone can explore the full application without encountering deleted or modified content.

**Note:** Please log out when you are finished testing the application to ensure availability for others.

---

## Key Features

### **Authentication & Authorization**
- Secure JWT-based authentication with 14-day token expiration
- Role-based access control (Admin/Member)
- Department and Admin invite token system for controlled registration
- Password hashing using bcrypt with salt rounds
- Profile customization with image uploads or color avatars
- Account management with secure deletion

### **Task Management System**
- **12 EEG Order Types** with specialized workflows:
  - Routine EEG (Inpatient, Outpatient, BMC, Pediatric, Neonate, WADA)
  - Continuous EEG (LTM, EMU, Pediatric, Neonate)
  - Continuous SEEG (Depth Electrodes)
  - Neuropsychiatric EEG
- **Dynamic Todo Checklists** - Automatically generated based on order type
- **Progress Tracking** - Visual progress bars with percentage completion
- **Priority Levels** - Routine, ASAP, STAT with color coding
- **Status Workflow** - Pending → In Progress → Completed/Disconnected
- **Multi-user Assignment** - Assign tasks to multiple team members
- **Comments & Annotations** - Add contextual notes to any task
- **Timestamp Tracking** - Every checklist item includes creation timestamp
- **Room-based Organization** - Tasks sorted by room numbers
- **Bulk Operations** - Delete multiple completed/disconnected tasks at once
- **Warning System** - Automatic alerts when task counts exceed thresholds (15+ disconnected, 25+ completed)

### **Whiteboard System**
- **Lab Whiteboard:**
  - **Coverage Assignments:**
    - **On-Call** - After-hours on-call coverage
    - **Surg-Call** - Surgical on-call coverage
    - **Scanning** - Scan EEG studies
    - **Surgicals** - Surgical EEG hook-up
    - **WADA** - WADA test procedure
  
  - **Outpatient Scheduling (6 Time Slots):**
    - **NP 8am** - Neuropsychiatric EEG appointments
      - Automatic task creation when users assigned to this slot
      - Creates pre-configured NP task with 75% completion (Hook-up, Transfer, Place Charge & Chart completed)
      - Only "Disconnect" remains unchecked for completion
    - **OP 8am-1, 8am-2, 10am, 12pm, 2pm** - Outpatient slots
    - Only two 8am slots can be selected for the day (8am 1|2|NP).
  
  - **Reading Provider Assignments:**
    - **EMU** - Epilepsy Monitoring Unit reading provider
    - **LTM** - Long-term monitoring reading provider
    - **Routine** - Routine EEG reading provider
  
  - **Automation Features:**
    - **Date Display** - Always shows current date for reference
    - **Last Updated Tracking** - Displays who made changes and precise timestamp
    - **Comments Section** - Add important notes or special instructions for the day
  
  - **Workflow Benefits:**
    - Single source of truth for daily coverage
    - Can be accessed anywhere
    - Supports shift handoffs
  
- **Floor Whiteboard:**
  - **Orders**
    - Displays today's active orders
    - Includes incomplete orders from previous days (Pending/In Progress status)
    - Automatically hides completed and disconnected orders from past days
    - Eliminates need to navigate between multiple screens
    - Orders display quick-view details
      - Real-time status badges (Pending, In Progress, Completed, Disconnected)
      - Priority indicators (Routine, ASAP, STAT) with color coding

  - **Multi-Section Task Management Per Room:**
    - **Skin Check** - Daily monitoring of skin integrity (Day 1, Day 2, Day 3, etc.)
    - **Electrode Fixes** - Repair or replace problematic electrodes
    - **Hyperventilation (HV)** - Breathing activation procedure
    - **Photic Stimulation** - Flashing light test
    - **Disconnect (DC's)** - End-of-study electrode removal and cleanup
    - **Rehooks** - Reconnect patient (multiple electrodes off)
    - **Patient Transfers** - Move patient between rooms (automatic room number update)
    - **Troubleshoots** - Address technical issues with equipment or recording quality

### **Computer Station Monitoring**
- Equipment types: EMU Stations & EEG Carts
- Location tracking: Inpatient, Outpatient, BMC
- Active/Inactive status management
- Issue description with IT ticket integration
- Filtering system (All, Inactive, by Type, by Location)
- Real-time equipment availability dashboard

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
- Excel export for procurement

### **Reading Provider Management**
- Provider profile creation with color-coded avatars
- Contact information (Phone, Pager, Email)
- Assignment to whiteboard sections

### **File Management System**
- Hierarchical folder structure
- Cloud storage via Cloudinary CDN
- Supported formats: PDF, Images (JPG, PNG)
- File upload with drag-and-drop (up to 50MB)
- Folder size calculation (recursive)
- Download functionality
- Delete with cascade (removes all folder contents)

### **Analytics & Reporting**
- **Interactive Dashboard:**
  - Real-time order statistics (Total, Pending, In Progress, Completed, Disconnected)
  - Pie chart for order status distribution
  - Bar chart for priority level analysis
  - Recent orders table with status badges
- **Excel Reports:**
  - Admin-only export functionality
  - Task details with room, order type, priority, status, dates
  - Team member directory with contact information
  - Reading provider contact list
  - Computer station inventory with issue tracking
  - Needed supplies by storage location

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
| **Recharts** | Data Visualization | 2.15.0 |
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
- **GitHub** - Store Code
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
│  │  - Error Handling Middleware                        │   │
│  │  - Multer File Upload                               │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas (Cloud)                              │   │
│  │  - Users, Tasks, Providers, ComStations             │   │
│  │  - Whiteboards, Supplies, Files                     │   │
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

**7 Core Collections:**
1. **Users** - Team members with authentication
2. **Tasks** - EEG orders with embedded todo sub-documents
3. **Providers** - Reading physicians
4. **ComStations** - Equipment tracking
5. **Supplies** - Inventory by storage room
6. **Whiteboards** - Daily assignments with user/provider references
7. **Files** - Document hierarchy with folder support

**Key Relationships:**
- Tasks → Users (many-to-many via assignedTo array)
- Tasks → ComStations (one-to-one reference)
- Whiteboards → Users (many-to-many via coverage arrays)
- Whiteboards → Providers (one-to-one via readingProviders)
- Files → Users (one-to-many via uploadedBy)
- Files → Files (self-referential for folder hierarchy)

---

## Frontend

### **State Management Strategy**
- **Context API** for global user authentication state
- **Local State** (useState) for component-specific data
- **Session Storage** for warning dismissal tracking
- **Local Storage** for JWT token persistence

### **Routing Architecture**
- **Public Routes:** Login, Sign Up
- **Private Routes (Members):** Dashboard, Tasks, Whiteboards, View-only access
- **Private Routes (Admins):** All member routes + Manage Tasks, Delete operations, Reports
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

#### **Tasks** (`/api/tasks`)
```
GET    /                          # Get tasks (filtered by role)
GET    /all                       # Get all tasks (everyone)
GET    /dashboard-data            # Get dashboard analytics
GET    /user-dashboard-data       # Get user-specific analytics
GET    /:id                       # Get single task
POST   /                          # Create task
PUT    /:id                       # Update task
PUT    /:id/status                # Update task status
PUT    /:id/todo                  # Update todo checklist
DELETE /:id                       # Delete task
DELETE /bulk/:status              # Bulk delete by status
```

#### **Users** (`/api/users`)
```
GET    /                          # Get all users (with task counts)
GET    /:id                       # Get user by ID
DELETE /:id                       # Delete user (admin only)
```

#### **Whiteboards** (`/api/lab-whiteboard`)
```
GET    /                          # Get whiteboard data
PUT    /                          # Update whiteboard
```

#### **Computer Stations** (`/api/com-stations`)
```
GET    /                          # Get stations (with filters)
POST   /                          # Create station
PUT    /:id                       # Update station
DELETE /:id                       # Delete station
```

#### **Providers** (`/api/providers`)
```
GET    /                          # Get all providers
GET    /:id                       # Get provider by ID
POST   /                          # Create provider
PUT    /:id                       # Update provider
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
GET    /export/tasks              # Excel: Task details
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
- **Rate Limiting:** 100 requests/hour for non-cached endpoints
- **Error Handling:** Never expose stack traces in production

---

## Learning Outcomes

#### **Full-Stack Development**
- Built complete MERN stack application
- Designed and implemented RESTful API architecture
- Managed complex client-server data flow
- Integrated third-party services

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
- MongoDB schema design with relationships
- File upload handling with Multer
- Excel report generation with ExcelJS
- Error handling and validation

#### **Database Design**
- NoSQL document modeling with MongoDB
- Mongoose ODM with schema validation
- Embedded documents (todos in tasks)
- Population of references across collections
- Complex query optimization
- Data integrity with cascading deletes

#### **Authentication & Security**
- Password hashing with bcrypt
- JWT token generation and verification
- Protected route middleware
- Role-based access control
- Secure file upload validation
- CORS configuration
- Environment variable management

#### **UI/UX Design**
- Responsive design with Tailwind CSS
- Mobile-first approach
- Intuitive navigation patterns
- Color-coded status indicators
- Toast notifications for user feedback
- Loading states and error handling
- Accessibility considerations

#### **Progressive Web App (PWA)**
- Service Worker implementation
- Web App Manifest configuration
- Installable application
- App icons for multiple platforms
- Safe area insets for mobile devices

#### **Data Visualization**
- Recharts integration for analytics
- Pie charts for status distribution
- Bar charts for priority analysis
- Interactive dashboard design
- Real-time data updates

#### **Cloud Services & Deployment**
- Cloudinary CDN integration
- MongoDB Atlas cloud database
- Render platform deployment
- Environment configuration for production
- HTTPS/SSL setup

#### **DevOps & Tools**
- GitHub
- API testing with Postman
- Vite build
- Production deployment workflow

#### **Problem-Solving & Architecture**
- Domain-driven design for healthcare workflow
- Code reusability and DRY principles
- Performance optimization strategies

#### **Soft Skills Demonstrated**
- Requirements gathering (understanding EEG workflow)
- Project planning and time management
- Attention to detail (medical context accuracy)
- Self-directed learning (new technologies)
- Documentation writing

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

This is a **personal portfolio project** built to demonstrate full-stack development skills. The project is for educational purposes and potential employer review. This project was created independently as a learning exercise and portfolio piece. It is not affiliated with, endorsed by, or connected to any healthcare organization and contains no real patient data. The information within the application is fictitious and created solely for demonstration purposes. Room numbers, staff members, and workflow tasks are simulated data. No real clinical data or protected health information (PHI) is used in any capacity.
