# 🚨 Panic Alert System - Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Browser)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐         │
│  │  tracking.html       │         │  admin-dashboard.html│         │
│  │  (Student Page)      │         │  (Admin Page)        │         │
│  │                      │         │                      │         │
│  │  RED PANIC BUTTON    │         │  Shows Alerts        │         │
│  │       │              │         │  Updates every 5sec  │         │
│  │       │              │         │       ▲              │         │
│  │       │              │         │       │              │         │
│  └───────┼──────────────┘         └───────┼──────────────┘         │
│          │                                 │                        │
│          │ POST /api/panic-alerts         │ GET /api/panic-alerts  │
│          │ {userId, userName, role,      │ ?status=active         │
│          │  lat, lng, location}          │ (polling every 5 sec)  │
│          │                                 │                        │
└──────────┼─────────────────────────────────┼────────────────────────┘
           │                                 │
        NETWORK                            NETWORK
           │                                 │
┌──────────▼─────────────────────────────────▼────────────────────────┐
│                      BACKEND API (Node.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  POST /api/panic-alerts                                            │
│  ├─ Receive alert data                                            │
│  ├─ Validate all fields present                                   │
│  ├─ Insert into database (status: 'active')                       │
│  └─ Return 201 Created                                            │
│                                                                     │
│  GET /api/panic-alerts?status=active                              │
│  ├─ Query database for active alerts                              │
│  ├─ Return JSON array                                             │
│  └─ Admin dashboard renders them                                  │
│                                                                     │
│  PATCH /api/panic-alerts/:id/resolve                              │
│  ├─ Update alert status to 'resolved'                             │
│  ├─ Remove from active alerts list                                │
│  └─ Return success message                                        │
│                                                                     │
└──────────┬──────────────────────────────────────────────────────────┘
           │
        DATABASE
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                    MySQL Database                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  college_bus_db                                                     │
│  └─ Table: panic_alerts                                            │
│     ├─ id                                                          │
│     ├─ userId                                                      │
│     ├─ userName                                                    │
│     ├─ role (student, driver, etc)                                │
│     ├─ message                                                     │
│     ├─ latitude                                                    │
│     ├─ longitude                                                   │
│     ├─ locationText                                               │
│     ├─ status (active, resolved)                                  │
│     ├─ timestamp                                                   │
│     └─ createdAt                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Complete Flow Diagram

```
STUDENT INITIATES ALERT
│
├─ 1. Opens tracking.html
│
├─ 2. Clicks RED PANIC button
│     │
│     ├─ Confirmation dialog appears
│     │  "Are you sure you want to send an SOS alert?"
│     │
│     └─ User clicks OK
│
├─ 3. Geolocation API gets location
│     │
│     └─ Browser asks for location permission
│         User clicks "Allow"
│
├─ 4. Frontend sends POST to backend
│     │
│     └─ POST /api/panic-alerts
│         {
│           userId: 1,
│           userName: "Test Student",
│           role: "student",
│           message: "🚨 EMERGENCY ALERT: STUDENT sent an SOS request!",
│           latitude: 28.5355,
│           longitude: 77.3910,
│           locationText: "Latitude: 28.5355, Longitude: 77.3910"
│         }
│
├─ 5. Backend receives alert
│     │
│     ├─ Validates all fields present
│     ├─ Compares with database
│     └─ Inserts new row into panic_alerts table
│         with status: 'active'
│
├─ 6. Backend returns 201 Created
│     │
│     └─ Response: { message: "Panic alert broadcasted." }
│
├─ 7. Frontend shows success message
│     │
│     └─ Alert box: "✅ SOS BROADCASTED!"
│         "Role: STUDENT"
│         "Name: Test Student"
│         "Location: 28.5355, 77.3910"
│         "Help is being dispatched."
│
└─ 8. Database now contains active alert
    
    MEANWHILE...

ADMIN DASHBOARD POLLS FOR ALERTS
│
├─ Every 5 seconds:
│
├─ Sends GET /api/panic-alerts?status=active
│
├─ Backend queries database:
│  SELECT * FROM panic_alerts WHERE status = 'active'
│
├─ Returns active alerts
│
├─ Frontend renders on screen:
│  │
│  ├─ Alert count: 0 → 1
│  │
│  └─ Alert card appears:
│     ┌─────────────────────────────────┐
│     │ 🚨 STUDENT (STUDENT)            │
│     │ 🚨 EMERGENCY ALERT: STUDENT ... │
│     │ ⏰ [timestamp]                  │
│     │ 📍 Latitude: 28.5355...         │
│     │ 📍 Longitude: 77.3910...        │
│     │ [Resolve Button]                │
│     └─────────────────────────────────┘
│
└─ DONE! Alert visible to admin

ADMIN RESOLVES ALERT
│
├─ Admin clicks "Resolve" button
│
├─ Frontend sends PATCH to backend
│  │
│  └─ PATCH /api/panic-alerts/1/resolve
│
├─ Backend updates database
│  │
│  └─ UPDATE panic_alerts SET status = 'resolved' WHERE id = 1
│
├─ Backend returns success
│  │
│  └─ Response: { message: "Panic alert resolved." }
│
├─ Admin dashboard refreshes (within 5 seconds)
│
├─ Alert no longer in results
│
└─ Alert card disappears from screen
   Alert count: 1 → 0
```

---

## Data Flow Timeline

```
SECOND 0: Student clicks panic button
          └─ Geolocation request sent

SECOND 1: Location permission granted
          └─ POST /api/panic-alerts sent

SECOND 2: Backend receives and saves
          └─ Database updated

SECOND 3: Student sees success message
          
SECOND 5: Admin dashboard polls
          └─ GET /api/panic-alerts

SECOND 6: Admin dashboard receives alerts
          └─ Renders alert on screen

SECOND X: Admin clicks Resolve
          └─ PATCH /api/panic-alerts/:id/resolve

SECOND 10: Admin dashboard polls again
           └─ Alert no longer in results
           └─ Alert card disappears
```

---

## File Relationships

```
frontend/
│
├─ login.html
│  └─ js/auth.js (handles login)
│
├─ admin-dashboard.html
│  └─ Polls for alerts every 5 seconds
│     └─ GET /api/panic-alerts?status=active
│     └─ PATCH /api/panic-alerts/:id/resolve
│
├─ tracking.html
│  ├─ js/panic.js
│  │  └─ triggerPanic() function
│  │     └─ POST /api/panic-alerts
│  │
│  └─ js/tracking.js (map functionality)
│
└─ parent-dashboard.html, driver-dashboard.html, etc.
   └─ Also poll for alerts

backend/
│
└─ server.js
   │
   ├─ POST /api/panic-alerts
   │  └─ db.js → pool.query(INSERT)
   │
   ├─ GET /api/panic-alerts
   │  └─ db.js → pool.query(SELECT)
   │
   └─ PATCH /api/panic-alerts/:id/resolve
      └─ db.js → pool.query(UPDATE)

mysql
│
└─ college_bus_db
   └─ panic_alerts table
      └─ Stores all alerts with status
      └─ Query by status: active/resolved
```

---

## API Endpoints

```
POST /api/panic-alerts
  Request: {userId, userName, role, message, latitude, longitude, locationText}
  Response: 201 Created { message: "Panic alert broadcasted." }
  Database: INSERT into panic_alerts (status: 'active')

GET /api/panic-alerts?status=active
  Request: No body
  Response: 200 OK [ {id, userId, userName, role, message, ...}, ... ]
  Database: SELECT * WHERE status = 'active'

GET /api/panic-alerts?status=resolved
  Request: No body
  Response: 200 OK [ {id, userId, userName, role, message, ...}, ... ]
  Database: SELECT * WHERE status = 'resolved'

PATCH /api/panic-alerts/:id/resolve
  Request: No body (alertId in URL)
  Response: 200 OK { message: "Panic alert resolved." }
  Database: UPDATE panic_alerts SET status = 'resolved' WHERE id = :id
```

---

## Key Components

### Frontend - panic.js
```javascript
function triggerPanic() {
  1. Get user info from localStorage
  2. Request geolocation
  3. Send POST to /api/panic-alerts
  4. Show success/error message
}
```

### Frontend - admin-dashboard.js
```javascript
function loadAdminData() {
  1. GET /api/panic-alerts?status=active
  2. GET /api/location-updates
  3. GET /api/registrations?status=pending
  4. Update counts
  5. Render alert cards
  6. Auto-call every 5 seconds with setInterval
}
```

### Backend - server.js
```javascript
POST /api/panic-alerts {
  1. Validate request body
  2. Insert into database
  3. Return 201 Created
}

GET /api/panic-alerts {
  1. Query database by status
  2. Return JSON array
}

PATCH /api/panic-alerts/:id/resolve {
  1. Update status to 'resolved'
  2. Return success message
}
```

---

## Status Flow

```
Alert Lifecycle:
┌────────────────────────────────────────────────┐
│         NEW ALERT CREATED                      │
│         (inserted into database)               │
└────────────┬─────────────────────────────────┘
             │
             ├─ status = 'active'
             │
             ├─ appears in GET results
             │
             ├─ displays on admin dashboard
             │
             └─ admin can click Resolve
                │
                ├─ status changed to 'resolved'
                │
                ├─ removed from active list
                │
                ├─ no longer appears on dashboard
                │
                └─ can be viewed in history
```

---

This is your complete panic alert system!

**Ready to test?** See README_PANIC_ALERT.md for quick start guide!
