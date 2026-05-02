# Alert Flow Guide - Student to Admin

## 🎯 Complete Alert System Flow

```
Student sends alert via panic button
         ↓
Alert sent to Backend API
         ↓
Backend saves to Database
         ↓
Admin Dashboard auto-refreshes (every 5 seconds)
         ↓
Alert appears on Admin Dashboard
```

---

## ✅ **Step-by-Step Testing**

### **Phase 1: Setup**

**Terminal 1 - Backend Running**
```powershell
cd backend
npm start
# Wait for: "Backend running on http://localhost:3000"
```

**Terminal 2 - MySQL Running**
- Open XAMPP Control Panel
- Click **Start** next to MySQL
- Check status is green

**Terminal 3 - Frontend Running**
```powershell
cd frontend
npx http-server
```

---

### **Phase 2: Login Flow**

**Step 1: Create Student Account**
1. Go to **http://localhost:8080**
2. Click **Register tab**
3. Fill in:
   - Role: **Student**
   - Name: John Doe
   - Email: student@example.com
   - Student ID: 12345
   - Password: password123
4. Click **Register**
5. Message: "Registration submitted. Await admin approval."

**Step 2: Login as Admin & Approve Student**
1. Go back to Login tab
2. Login as **Admin**:
   - Role: admin
   - Email: harishmuthyala11@gmail.com
   - Password: admin11
3. Go to **Admin Dashboard** (click link or go to admin-dashboard.html)
4. Look for **User Registrations** tab
5. Find "John Doe" with status "pending"
6. Click **Approve**

**Step 3: Logout & Login as Student**
1. Click **Logout**
2. Login as student with email: student@example.com, password: password123
3. Should see dashboard

---

### **Phase 3: Send Alert & Receive in Admin Dashboard**

**Open Two Browser Tabs:**

**Tab 1: Student Dashboard**
- Logged in as student
- Can see panic button (red circle, bottom right)
- Has menu with Notifications, Tracking, etc.

**Tab 2: Admin Dashboard**
- Logged in as admin
- http://localhost:8080/admin-dashboard.html
- Watching for alerts

**Now Send Alert:**

1. In **Tab 1** (Student), click **red panic button** (bottom right)
2. Dialog appears: "EMERGENCY! Are you sure..."
3. Click **OK**
4. Browser asks: "Allow location access?"
5. Click **ALLOW** (important!)
6. Success message: "✅ SOS BROADCASTED!"

**Watch Tab 2 (Admin Dashboard):**
- Count at top changes from 0 → 1
- 🚨 Emergency Panic Alerts section appears
- Shows alert with:
  - Student name
  - Role: STUDENT
  - Message
  - Location
  - Timestamp
  - **Resolve button**

---

### **Phase 4: Admin Actions**

**Admin Dashboard Actions:**

1. **View Alert Details:**
   - Click on any alert to see full details
   - Location shown with coordinates
   - Timestamp of when alert was sent

2. **Resolve Alert:**
   - Click **Resolve** button on the alert
   - Alert disappears from Active Alerts
   - Count updates automatically

3. **Auto-Refresh:**
   - Dashboard auto-refreshes every 5 seconds
   - Don't need to manually refresh
   - New alerts appear automatically

---

## 🧪 **Alternative: Test Without Geolocation**

If geolocation permission is blocking:

1. Go to **http://localhost:8080/test-alerts.html**
2. Fill in:
   - Name: "Test Student"
   - Role: "student"
   - Latitude: 17.3850
   - Longitude: 78.4744
3. Click **Send Test Alert**
4. Watch **Admin Dashboard** (Tab 2)
5. Alert appears within 3-5 seconds

---

## 📊 **What Should Happen**

### **Alert Counter (Top of Admin Dashboard)**
```
Before: Active Panic Alerts: 0
After:  Active Panic Alerts: 1
After Resolve: Active Panic Alerts: 0
```

### **Alert Display Section**
```
BEFORE:
"No active panic alerts."

AFTER:
┌─────────────────────────────────┐
│ 🚨 John Doe (STUDENT)           │
│ EMERGENCY ALERT: STUDENT sent.. │ [Resolve]
│ ⏰ Apr 13, 2026 4:45 PM         │
│ 📍 Latitude: 17.3850...         │
└─────────────────────────────────┘
```

### **Browser Console (F12)**
```
[ADMIN] Loaded data: { alerts: 1, updates: 0, pending: 0 }
[ADMIN] Rendering 1 alerts
[ADMIN] Alert resolved: 5
```

---

## 🔍 **Troubleshooting During Test**

| Issue | Solution |
|-------|----------|
| No permission dialog | Check browser address bar lock icon |
| Alert not appearing | Refresh admin dashboard or wait 5 seconds |
| "Student not approved" | Login as admin, approve in Registrations |
| No geolocation | Use test-alerts.html instead |
| Backend error | Check terminal for `[PANIC ALERT]` errors |

---

## ✅ **Verification Checklist**

- [ ] Backend running (shows `Backend running on http://localhost:3000`)
- [ ] MySQL running (XAMPP green status)
- [ ] Frontend running (http://localhost:8080 works)
- [ ] Student account created
- [ ] Student approved by admin
- [ ] Student can login
- [ ] Admin can login
- [ ] Admin Dashboard shows "System Online"
- [ ] Alert count shows as 0 (no active alerts)
- [ ] Student clicks panic button
- [ ] Allow geolocation permission
- [ ] Alert appears in admin dashboard within 5 seconds
- [ ] Admin can see alert details
- [ ] Admin can click Resolve button
- [ ] Alert disappears and count updates

---

## 📈 **Real-World Scenario**

**Situation:** Student is on bus and feels unsafe

1. ✅ Student opens app
2. ✅ Student clicks panic button
3. ✅ Allows geolocation
4. ✅ Alert sent to backend
5. ✅ **Admin sees alert immediately** (within 5 seconds)
6. ✅ Admin can see student location
7. ✅ Admin can take action (call student, contact driver, etc.)
8. ✅ Admin marks as resolved when handled

---

## 🎯 **Expected Result**

**After following these steps, you should see:**

1. ✅ Student sends alert via panic button
2. ✅ Alert appears on Admin Dashboard automatically
3. ✅ Admin can see all alert details (name, location, timestamp)
4. ✅ Admin can resolve the alert
5. ✅ System works end-to-end

---

## 📱 **Where Alerts Appear**

- **Admin Dashboard**: Main place to see and manage alerts
- **Notifications Page**: Also shows alerts (refreshes every 3 seconds)
- **Database**: Stored in `panic_alerts` table
- **Backend Console**: Log messages show when alerts arrive

---

## 🆘 **Need Help?**

If something doesn't work:

1. Check **Backend Console** for error messages
2. Open **Browser F12 Console** for JavaScript errors
3. Check **phpMyAdmin** to verify data is in database
4. Try **test-alerts.html** to isolate the issue
5. Restart backend: `npm start`

---

## 📝 **Notes**

- Alerts auto-refresh every 5 seconds on admin dashboard
- Alerts auto-refresh every 3 seconds on notifications page
- Each alert shows: Name, Role, Message, Location, Timestamp
- Admin can resolve alerts one by one
- Test alerts work without geolocation permission
- Real alerts need browser geolocation permission

Good luck! The system is fully functional! 🚀
