# 🚨 Complete Panic Alert Testing Guide

## Overview
This guide walks you through testing the complete panic alert flow:
1. Student clicks panic button on tracking page
2. Alert is sent to backend
3. Admin dashboard receives and displays the alert

---

## ✅ Step-by-Step Instructions

### PART 1: Start Backend & Login as Admin

#### Step 1.1: Start the Backend Server
```powershell
cd c:\Users\haris.HARISH\OneDrive\Documents\college_bus_management_system\backend
node server.js
```
**Expected Output:**
```
Backend running on http://localhost:3000
```
✅ Keep this terminal open - Backend must stay running!

#### Step 1.2: Open Admin Dashboard in Browser
1. Open `frontend/login.html` in your browser
2. Login with:
   - **Email:** `admin@college.edu`
   - **Password:** `admin`
   - **Role:** Administrator
3. You should see the admin dashboard

#### Step 1.3: Prepare Admin Dashboard
1. **Keep the admin dashboard open in this browser window/tab**
2. Open **DevTools** (Press F12)
3. Go to **Console** tab
4. You should see message: `[ADMIN] Loaded data:...`
5. Look for: "Active Panic Alerts: 0"

---

### PART 2: Test Student Panic Alert

#### Step 2.1: Open Student/Tracking Page
**In a NEW browser window or tab:**
1. Open `frontend/tracking.html`
2. Manually set localStorage values (since we're not logging in as student):
   - Open DevTools (F12)
   - Go to **Console** tab
   - Copy and paste this code:
   ```javascript
   localStorage.setItem('userRole', 'student');
   localStorage.setItem('userName', 'Test Student');
   localStorage.setItem('userId', '1');
   ```
   - Press Enter
3. Refresh the page (F5)
4. You should see the red **PANIC** button in the bottom-right corner

#### Step 2.2: Send Panic Alert
1. **Click the RED PANIC button**
2. You'll see a confirmation dialog asking: "Are you sure you want to send an SOS alert?"
3. Click **OK** to confirm
4. A dialog will ask for location access - **Click Allow**
5. You should see success message with your location

#### Step 2.3: Check Console Logs
In the console of the tracking page, you should see:
```
[PANIC] Triggered by: { role: 'student', userName: 'Test Student', ... }
[PANIC] Sending alert: { userId: 1, userName: 'Test Student', ... }
[PANIC] Response status: 201
[PANIC] Response data: { message: 'Panic alert broadcasted.' }
```

---

### PART 3: Verify Alert Appears on Admin Dashboard

#### Step 3.1: Check Admin Dashboard
**Switch back to your admin dashboard window/tab**

You should see:
- ✅ "Active Panic Alerts" count changed from **0 to 1**
- ✅ Alert card appears showing:
  - 🚨 STUDENT (STUDENT)
  - 🚨 EMERGENCY ALERT: STUDENT sent an SOS request!
  - ⏰ Timestamp
  - 📍 Location coordinates

#### Step 3.2: Check Admin Dashboard Console
In the admin dashboard DevTools Console, you should see:
```
[ADMIN] Loaded data: { alerts: 1, updates: 0, pending: 0 }
[ADMIN] Rendering 1 alerts
```

---

## 🔍 Troubleshooting

### ❌ Alert Not Appearing on Admin Dashboard

**Check 1: Is backend running?**
- Look at backend terminal
- Should show: `Backend running on http://localhost:3000`
- If not, start it: `node server.js`

**Check 2: Did panic alert get sent successfully?**
- Check student tracking page console
- Look for: `[PANIC] Response status: 201`
- If not 201, check error message above it

**Check 3: Is admin dashboard fetching alerts?**
- Check admin dashboard console
- Look for: `[ADMIN] Loaded data:`
- If not there every 5 seconds, dashboard is not fetching

**Check 4: Check Network Traffic**
1. In admin dashboard, open DevTools
2. Go to **Network** tab
3. Filter for: `panic-alerts`
4. Do you see requests going out?
5. Click a request → Click **Response** tab
6. Do you see alert data?

---

## 🧪 Full Test Scenario

### Scenario: Test Complete Flow

**Prerequisites:**
- ✅ Backend running (`node server.js`)
- ✅ Admin dashboard open with DevTools Console visible
- ✅ Student/tracking page open with panic button visible

**Test Steps:**
1. [ ] Admin dashboard shows: "Active Panic Alerts: 0"
2. [ ] Click panic button on student page
3. [ ] Allow location access popup
4. [ ] See success message with coordinates
5. [ ] Switch to admin dashboard
6. [ ] Within 5 seconds, count changes to 1
7. [ ] Alert card appears with student name and message
8. [ ] Click "Resolve" button on alert
9. [ ] Alert disappears from admin dashboard
10. [ ] Count goes back to 0

**Expected Result:** ✅ All 10 steps complete successfully!

---

## 📊 What Each Component Does

### Student/Tracking Page (frontend/tracking.html)
```
1. User clicks red PANIC button
   ↓
2. Geolocation requested
   ↓
3. Alert data created with location
   ↓
4. POST to /api/panic-alerts
   ↓
5. Success/Error message shown
```

### Backend (backend/server.js)
```
POST /api/panic-alerts receives:
   ↓
- Validates all required fields present
   ↓
- Inserts into database (status: 'active')
   ↓
- Returns 201 with success message
```

### Admin Dashboard (frontend/admin-dashboard.html)
```
Every 5 seconds:
   ↓
- GET /api/panic-alerts?status=active
   ↓
- Receives list of active alerts
   ↓
- Renders them on screen
   ↓
- Updates count
```

---

## 🛠️ Advanced Debugging

### If Alert Sends But Doesn't Appear on Admin

**Check Database Directly:**
```bash
# Open MySQL terminal and run:
mysql -u root
USE college_bus_db;
SELECT * FROM panic_alerts WHERE status = 'active';
```

You should see your alert in the table.

**If alert is in database but not showing on admin dashboard:**
- Admin dashboard fetching might be broken
- Check admin dashboard console for errors
- Try refreshing admin dashboard (F5)

### If Alert Doesn't Send from Tracking Page

**Check Backend Logs:**
- Look at terminal where `node server.js` is running
- You should see: `[PANIC ALERT] Received: ...`
- If you don't see this, POST didn't reach backend
- Check Network tab in tracking page console

### If Nothing Works

**Nuclear Option - Reset Everything:**
```bash
# 1. Stop backend (Ctrl+C on backend terminal)
# 2. Reset database
mysql -u root -e "DROP DATABASE IF EXISTS college_bus_db;"
# 3. Restart backend
node server.js
# Backend will auto-recreate database
# 4. Try test again
```

---

## ✅ Success Criteria

**Test PASSES when:**
- ✅ Student can click panic button
- ✅ Backend receives alert (check console logs)
- ✅ Alert appears in admin dashboard within 5 seconds
- ✅ Admin can see alert details (name, location, time)
- ✅ Admin can click "Resolve" to remove alert
- ✅ No red error messages in any console

**Test FAILS if:**
- ❌ Backend not running / crashes
- ❌ Alert doesn't send (no success message on tracking page)
- ❌ Alert sent but doesn't appear on admin (>5 seconds)
- ❌ Red error messages in console
- ❌ Admin dashboard shows 0 alerts after panic sent

---

## Quick Reference Commands

### Start Backend
```bash
cd backend && node server.js
```

### View Backend Logs
- Check terminal where backend is running
- Look for `[PANIC ALERT]` messages

### Reset Database
```bash
mysql -u root -e "DROP DATABASE IF EXISTS college_bus_db;"
# Then restart backend to recreate
```

### Check Database
```bash
mysql -u root
USE college_bus_db;
SELECT COUNT(*) as alert_count FROM panic_alerts WHERE status='active';
```

---

## Example Success Flow

**Backend Terminal:**
```
Backend running on http://localhost:3000
[PANIC ALERT] Received: { userId: 1, userName: 'Test Student', role: 'student', ... }
[PANIC ALERT] Successfully saved for Test Student
```

**Tracking Page Console:**
```
[PANIC] Triggered by: { role: 'student', userName: 'Test Student', userId: '1' }
[PANIC] Response status: 201
[PANIC] Response data: { message: 'Panic alert broadcasted.' }
```

**Admin Dashboard Console:**
```
[ADMIN] Loaded data: { alerts: 0, updates: 0, pending: 0 }
(after panic sent)
[ADMIN] Loaded data: { alerts: 1, updates: 0, pending: 0 }
[ADMIN] Rendering 1 alerts
```

**Admin Dashboard Screen:**
```
Active Panic Alerts: 1 ⚠️

🚨 STUDENT (STUDENT)
🚨 EMERGENCY ALERT: STUDENT sent an SOS request!
⏰ [timestamp]
📍 Latitude: 28.5355, Longitude: 77.3910

[Resolve Button]
```

---

## Ready to Test?

1. ✅ Start backend: `node server.js` in backend folder
2. ✅ Open admin dashboard and login
3. ✅ Open tracking page in new window
4. ✅ Click panic button
5. ✅ Check admin dashboard - alert should appear!

**Let me know what happens!** 🚀
