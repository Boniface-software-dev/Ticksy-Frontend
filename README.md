#  Ticksy — Event Ticketing & Management

**Tagline:** _"Plan It. Book It. Live It."_

Ticksy is a modern, mobile-friendly event ticketing platform built to streamline how people discover, attend, and manage events. This is the **frontend application** built using **ReactJS** with **Redux Toolkit** for efficient state management, fully integrated with a Flask/PostgreSQL backend.

---

##  Project Overview

In today’s fast-moving digital world, attending events should be effortless. Yet, many ticketing platforms suffer from:

- Cluttered, confusing interfaces
- Lack of real-time ticket updates
- Poor support for local payment methods like MPESA
- Rigid user roles and permissions

**Ticksy** solves these problems by delivering a clean, intuitive interface and robust functionality for **attendees**, **organizers**, and **admins** alike.

---

##  Key Features (Frontend)

###  Authentication & Authorization
- JWT-based login and signup
- Role-based access control (Attendee, Organizer, Admin)

###  Ticketing & Event Management
- Event creation, editing, and deletion (Organizers)
- Real-time ticket availability tracking
- Ticket tiers: Early Bird, Regular, VIP
- Secure checkout with MPESA STK Push integration

###  Attendee Features
- Search and filter events by category, location, and tags
- Add events to Google Calendar
- View and download previously purchased tickets
- Leave reviews after events

###  Admin Features
- User moderation: ban, deactivate, promote
- Event approval & moderation
- Platform analytics and reporting

---

##  Tech Stack

| Layer     | Tech                                   |
|-----------|----------------------------------------|
| **Frontend** | ReactJS + Redux Toolkit (for state)    |
| **Backend**  | Flask (Python)                        |
| **Database** | PostgreSQL                            |
| **Payment**  | MPESA STK Push Integration            |
| **Design**   | Figma (Mobile-first wireframes)       |

---

##  Frontend Folder Structure

```bash
ticksy-frontend/
├── public/
├── src/
│   ├── api/              # Axios config and API calls
│   ├── app/              # Redux store
│   ├── components/       # Shared UI components
│   ├── features/         # Redux slices (auth, events, orders, etc.)
│   ├── layouts/          # Role-based layouts (Admin, Organizer, Attendee)
│   ├── pages/            # All main routes/views
│   ├── routes/           # Route configuration
│   ├── styles/           # Global styles
│   └── utils/            # Helpers and utilities
```
---
## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Boniface-software-dev/Ticksy-Frontend
cd ticksy-frontend
```
### 2. Install dependencies:
```bash
npm install
```

### 3. Start the development server:
```bash
npm run dev
```

---

##  Connecting to Backend

This frontend app communicates with the **Ticksy Flask backend** via REST API:  
 [https://ticksy-backend.onrender.com](https://ticksy-backend.onrender.com)

- All requests use a shared **Axios instance** with automatic JWT token injection.
- Ensure CORS is enabled on the backend for all necessary origins.
- Authentication is based on JWT Bearer tokens sent in the `Authorization` header.

---

##  Future Enhancements

-  Social login (Google)
-  QR code-based event check-in
-  Notification system for attendees and organizers
-  PWA support for offline access

---

##  Wireframes & Design

All designs follow a **mobile-first** approach.  
 Figma Link: _[https://www.figma.com/design/wSEbubNj0xsuUFEPo1LXqt/Ticksy?node-id=1-3&p=f&t=sf1Uebh74eVhETVx-0]_

---

##  Contributors

Huge thanks to the amazing team behind **Ticksy**:

- **Joy Malinda**  
- **Boniface Muguro**  
- **Grace Zawadi**  
- **Aquila Jedidiah**  
- **Celestine Mecheo**  
- **Edwin Kipyego**  

---

## License

This project was developed as a collaborative group project for educational and demonstration purposes.  
All rights reserved by the contributors listed above. Please contact the team before any reuse or distribution.

---


##  Need Help?

Have questions, suggestions, or feedback?  
Open an issue or join the discussion via GitHub.

---

**Built with ❤️ by the Ticksy Team**

