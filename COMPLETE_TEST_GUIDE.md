# 🚀 Complete Setup & Test Script for Panic Alert System

## What This Does
This script will:
1. ✅ Ensure backend is running
2. ✅ Create test credentials
3. ✅ Guide you through testing the panic alert flow

---

## 🎯 Quick Test (5 minutes)

### Step 1: Start Backend
Open PowerShell and run:
```powershell
cd c:\Users\haris.HARISH\OneDrive\Documents\college_bus_management_system\backend
node server.js
```

Wait for message: `Backend running on http://localhost:3000`

---

### Step 2: Login as Admin
1. Open browser: `frontend/login.html`
2. Enter:
   - Email: `admin@college.edu`
   - Password: `admin`
   - Role: `Administrator`
3. Click Login
4. You should see admin dashboard with:
   - Active Panic Alerts: 0
   - Recent Location Updates: 0
   - Pending Registrations: X

---

### Step 3: Test Panic Alert
1. **DO NOT close admin dashboard**
2. **Open NEW browser tab/window**
3. Go to: `frontend/tracking.html`
4. Open DevTools (F12) → Console
5. Paste this code and press Enter:
   ```javascript
   localStorage.setItem('userRole', 'student');
   localStorage.setItem('userName', 'Test Student');
   localStorage.setItem('userId', '1');
   ```
6. Refresh the page (F5)
7. Look for red **PANIC** button in bottom-right corner
8. **Click it!**
9. Click "OK" on confirmation
10. Click "Allow" on location permission

---

### Step 4: Verify Alert on Admin Dashboard
1. Switch back to admin dashboard tab
2. **Within 5 seconds**, you should see:
   - Count changed to: `Active Panic Alerts: 1`
   - Red alert card showing student info
3. Click **Resolve** button
4. Alert should disappear

---

## ✅ Expected Results

### If SUCCESS ✅
```
✅ When you click panic button:
  - You see success message with coordinates
  - Admin dashboard alerts count goes from 0 → 1
  - Alert card appears within 5 seconds
  - You can click Resolve to remove it

✅ Console shows no red errors
✅ Network tab shows successful POST to /api/panic-alerts
```

### If FAILED ❌
```
❌ No success message when clicking panic
❌ Console shows error message
❌ Admin dashboard doesn't update after 5 seconds
❌ Red error messages in console
```

---

## 🔍 Debugging

### Check Backend is Running
```powershell
# Should see this message:
Backend running on http://localhost:3000
```

### Check Panic Alert Sent Successfully
In tracking page console (F12), look for:
```
[PANIC] Triggered by: { role: 'student', userName: 'Test Student', ... }
[PANIC] Response status: 201
```

If you see `Response status: 201` = ✅ Backend received it

### Check Admin Dashboard Fetching Data
In admin dashboard console (F12), look for:
```
[ADMIN] Loaded data: { alerts: 1, updates: 0, pending: 0 }
```

If you see `alerts: 1` = ✅ Data reached dashboard

### Check Database
```bash
mysql -u root college_bus_db -e "SELECT COUNT(*) FROM panic_alerts WHERE status='active';"
```
Should return `1` if alert was saved.

---

## 📱 Test on Different Roles

### Test as Parent
1. Create alert from tracking page
2. Login as parent in separate tab
3. Go to: `frontend/parent-dashboard.html`
4. You should see alerts appearing

### Test as Driver
1. Create alert from driver-dashboard (has panic button)
2. Admin should see it immediately

### Test Multiple Alerts
1. Send 5 panic alerts
2. Admin dashboard should show: `Active Panic Alerts: 5`
3. Resolve some, others should remain
4. Count should update correctly

---

## 🛠️ If Something Breaks

### Reset Everything
```bash
# 1. Stop backend (Ctrl+C in backend terminal)

# 2. Drop database
mysql -u root -e "DROP DATABASE IF EXISTS college_bus_db;"

# 3. Restart backend
cd backend && node server.js

# 4. Backend will auto-recreate database
# 5. Try test again
```

### Check Backend Logs
Look at the terminal where you ran `node server.js`

You should see:
```
Backend running on http://localhost:3000
[PANIC ALERT] Received: { userId: 1, userName: 'Test Student', ... }
[PANIC ALERT] Successfully saved for Test Student
```

If you don't see `[PANIC ALERT] Received:` message, the POST didn't reach backend.

---

## 🎯 Test Checklist

- [ ] Backend starts successfully
- [ ] Admin can login with admin@college.edu / admin
- [ ] Admin dashboard loads and shows: "Active Panic Alerts: 0"
- [ ] Can open tracking.html
- [ ] Red panic button is visible on tracking page
- [ ] Panic button click shows confirmation dialog
- [ ] Clicking OK shows success message with location
- [ ] Admin dashboard count goes from 0 → 1 within 5 seconds
- [ ] Alert card appears on admin dashboard
- [ ] Alert shows student name and message
- [ ] Can click "Resolve" button
- [ ] Alert disappears after resolving
- [ ] Count goes back to 0
- [ ] No red error messages in any console

✅ All above = System working perfectly!

---

## 🚀 Full Scenario Test

**Open 2 browser windows:**
1. **Window 1:** Admin at `frontend/login.html` → admin-dashboard.html
2. **Window 2:** Student at `frontend/tracking.html`

**Progress:**
1. Admin dashboard shows "Active Panic Alerts: 0"
2. Click panic button in Window 2
3. Allow location access
4. See success message
5. Switch to Window 1
6. Within 5 seconds, count changes to 1
7. Red alert card appears
8. Alert shows "🚨 STUDENT" and timestamp
9. Click Resolve
10. Alert disappears, count goes to 0

✅ = Complete success!

---

## Terminal Commands Reference

```bash
# Start backend
cd backend && node server.js

# Check if MySQL is running
tasklist | findstr "mysqld"

# Reset database
mysql -u root -e "DROP DATABASE IF EXISTS college_bus_db;"

# Check alerts in database
mysql -u root -e "USE college_bus_db; SELECT * FROM panic_alerts;"

# Kill Node process if stuck
taskkill /IM node.exe /F

# Check if port 3000 is in use
netstat -ano | findstr "3000"
```

---

## 🎓 How the System Works

### Flow Diagram
```
Student clicks PANIC button
         ↓
Geolocation API gets location
         ↓
POST /api/panic-alerts with location
         ↓
Backend validates & saves to database
         ↓
Returns 201 (success)
         ↓
Student sees success message
         ↓
Admin dashboard polls every 5 seconds
         ↓
GET /api/panic-alerts?status=active
         ↓
Admin dashboard renders alert on screen
         ↓
Admin clicks Resolve
         ↓
PATCH /api/panic-alerts/:id/resolve
         ↓
Alert marked as resolved
         ↓
Alert disappears from dashboard
```

---

## Support

**If you're stuck at any point:**

1. Check backend terminal for `[PANIC ALERT]` logs
2. Check tracking page console for `[PANIC]` logs
3. Check admin dashboard console for `[ADMIN]` logs
4. Look at Network tab for failed requests
5. Verify database has the alert: `SELECT * FROM panic_alerts;`

---

**Ready to test? Let's go!** 🚀

Follow the "Quick Test (5 minutes)" section above and report what happens!
