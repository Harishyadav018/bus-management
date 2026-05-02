# Alert System Troubleshooting Guide

## 🆘 Issue: "Alerts are not being sent"

### Root Causes & Solutions

---

## 1️⃣ **Backend Not Running**

**Symptoms:**
- ❌ "Failed to fetch" error in browser
- ❌ API endpoints unreachable

**Check:**
```bash
curl http://localhost:3000/api/panic-alerts?status=active
```

Should return JSON array, not error.

**Fix:**
```powershell
cd backend
npm start
```

Watch terminal for:
```
Backend running on http://localhost:3000
Database initialized successfully
```

---

## 2️⃣ **MySQL Database Issues**

**Symptoms:**
- ❌ Backend shows "Cannot connect to database"
- ❌ Alerts not saved in database

**Check in XAMPP:**
1. Open XAMPP Control Panel
2. Click **MySQL** → **Admin**
3. Verify you can access phpMyAdmin
4. Check `college_bus_db` database exists

**Fix:**
```powershell
# 1. Start MySQL in XAMPP (green status)
# 2. Restart backend
cd backend
npm start
```

---

## 3️⃣ **Geolocation Permission Denied**

**Symptoms:**
- ✅ Alert button clicked
- ❌ "Enable location services" message
- ❌ Alert never sent

**Causes:**
- Browser blocked geolocation
- HTTPS required (for production)
- Location services disabled on device

**Fix:**
```
Option 1: Use HTTP server with localhost
Option 2: Check browser geolocation permissions:
  - Click address bar lock icon
  - Set Location to "Allow"
Option 3: Use test-alerts.html instead (no geolocation needed)
```

---

## 4️⃣ **Alerts Not Appearing in Notifications**

**Symptoms:**
- ✅ Alert sent successfully
- ✅ Alert saved to database
- ❌ Not visible in notifications.html

**Causes:**
- Page not auto-refreshing
- Browser cache issue
- Wrong user role

**Fix:**
```
1. Hard refresh browser: Ctrl+Shift+Delete (clear cache)
2. Go to notifications.html
3. Page auto-refreshes every 3 seconds
4. Should see alert appear
```

---

## 5️⃣ **Admin Dashboard Not Showing Alerts**

**Symptoms:**
- ✅ Alerts saved in database
- ❌ Not visible in admin-dashboard.html

**Check:**
```
1. Login as admin
2. Go to Admin Dashboard
3. Watch the "🚨 Active Panic Alerts" section
4. Should show alerts (auto-refreshes every 5 seconds)
```

**Fix if not showing:**
```
1. Hard refresh: Ctrl+Shift+Delete
2. Make sure logged in as admin
3. Restart backend: npm start
```

---

## 6️⃣ **Using Test Alert System**

**If real alerts don't work, use the test system:**

1. Open: **http://localhost:8080/test-alerts.html**

2. Fill in:
   - Alert Sender Name: "John Doe"
   - Role: "student" or "driver"
   - Latitude: 17.3850
   - Longitude: 78.4744

3. Click "Send Test Alert"

4. Check:
   - Active Alerts section below
   - Open notifications.html in new tab
   - Should see alert appear in real-time

---

## 🔍 **Debug Steps**

### Step 1: Open Browser Developer Tools
```
Press F12 → Console tab
```

You should see logs like:
```
[PANIC] Triggered by: { role: 'student', userName: 'John', userId: 5 }
[PANIC] Sending alert: { userId: 5, userName: 'John', role: 'student', ... }
[PANIC] Response status: 201
[PANIC] Response data: { message: 'Panic alert broadcasted.' }
```

### Step 2: Check Backend Console
When you start `npm start`, watch for:
```
[PANIC ALERT] Received: { userId: 5, userName: 'John', role: 'student', ... }
[PANIC ALERT] Successfully saved for John
[PANIC ALERTS] Found 1 active alerts
```

### Step 3: Check Database Directly
```
XAMPP → phpMyAdmin → college_bus_db → alerts table
```

Or SQL query:
```sql
SELECT * FROM panic_alerts WHERE status = 'active' ORDER BY createdAt DESC;
```

---

## ✅ Full Working Flow

### Step 1: Backend Running
```powershell
cd backend
npm start
# Watch for: "Backend running on http://localhost:3000"
```

### Step 2: Frontend Running
```powershell
cd frontend
npx http-server
# Watch for: "http-server is running" on port 8080
```

### Step 3: MySQL Running
- XAMPP Control Panel → MySQL must show "Running" (green)

### Step 4: Login as Student/Driver
- Go to http://localhost:8080
- Login or Register as student/driver
- Status must be "approved"

### Step 5: Send Alert
- Click red panic button (bottom right)
- Confirm in dialog
- Wait for geolocation permission
- Alert should show success message

### Step 6: View in Notifications
- Open notifications.html (or click Notifications in menu)
- Should see alert appear immediately (or within 3 seconds of auto-refresh)

### Step 7: View in Admin Dashboard
- Login as admin
- Go to admin-dashboard.html
- "🚨 Active Panic Alerts" section should show it

---

## 🧪 Test Using test-alerts.html

**Easiest way to test without geolocation:**

1. Go to: http://localhost:8080/test-alerts.html
2. Click "Send Test Alert" (no location permission needed)
3. Alerts appear in "Active Alerts" section below
4. Open notifications.html in new tab
5. Alert appears in real-time

---

## 📋 Checklist

- [ ] Backend running (`npm start`)
- [ ] MySQL running (XAMPP green status)
- [ ] Frontend running (`npx http-server`)
- [ ] Logged in as student/driver
- [ ] User status is "approved"
- [ ] Browser geolocation allowed
- [ ] Browser cache cleared
- [ ] Opened notifications.html or admin-dashboard.html
- [ ] Page auto-refreshing (should see loading spinner briefly)

---

## 🆘 Still Not Working?

1. **Check backend console** for error messages
2. **Try test-alerts.html** (eliminates geolocation issues)
3. **Check browser console** (F12) for JavaScript errors
4. **Verify database** has alerts table with data
5. **Restart everything**:
   ```powershell
   # Kill all processes
   Get-Process node | Stop-Process -Force
   
   # Restart MySQL in XAMPP
   # Restart backend and frontend
   ```

6. **Reset database** (if corrupted):
   ```sql
   DROP TABLE panic_alerts;
   # Run schema.sql again
   ```

---

## 📞 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Run `npm start` |
| "Cannot connect to database" | MySQL not running | Start MySQL in XAMPP |
| "Geolocation error" | Permission denied | Allow location in browser |
| "Alert missing required fields" | Incomplete data sent | Check all fields filled |
| "No active alerts" | No alerts in database | Send a test alert |

---

## 🎯 Quick Links

- **Test Alerts**: http://localhost:8080/test-alerts.html
- **View Notifications**: http://localhost:8080/notifications.html
- **Admin Dashboard**: http://localhost:8080/admin-dashboard.html
- **Database**: http://localhost/phpmyadmin → college_bus_db

---

Good luck! If you follow these steps, alerts will definitely work! 🚀
