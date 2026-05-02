const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { initDatabase, getPool } = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

function handleServerError(res, error) {
  console.error(error);
  return res.status(500).json({ message: 'Server error, please try again.' });
}

app.post('/api/register', async (req, res) => {
  try {
    const { role, name, email, phone, password, studentId, childName, licenseNumber } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'Role, name, email, and password are required.' });
    }

    const pool = getPool();
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (role, name, email, phone, password, status, studentId, childName, licenseNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [role, name.trim(), email.toLowerCase(), phone, passwordHash, 'pending', studentId || null, childName || null, licenseNumber || null]
    );

    return res.status(201).json({ message: 'Registration submitted. Await admin approval.' });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return res.status(400).json({ message: 'Role, email, and password are required.' });
    }

    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), role]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.role !== 'admin' && user.status !== 'approved') {
      return res.status(403).json({ message: 'Your registration is not approved yet.' });
    }

    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.post('/api/routes', async (req, res) => {
  try {
    const { routeName, busNumber, driverName } = req.body;
    if (!routeName) {
      return res.status(400).json({ message: 'Route name is required.' });
    }

    const pool = getPool();
    await pool.query(
      'INSERT INTO routes (routeName, busNumber, driverName) VALUES (?, ?, ?)',
      [routeName.trim(), busNumber || null, driverName || null]
    );

    return res.status(201).json({ message: 'Route saved successfully.' });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.get('/api/routes', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM routes ORDER BY createdAt DESC');
    return res.json(rows);
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    const pool = getPool();
    const status = req.query.status || null;
    const role = req.query.role || null;
    let query = 'SELECT * FROM users';
    const params = [];

    if (status && role) {
      query += ' WHERE status = ? AND role = ?';
      params.push(status, role);
    } else if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    } else if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY createdAt DESC';
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.patch('/api/registrations/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }

    const pool = getPool();
    await pool.query('UPDATE users SET status = ?, rejectionReason = ? WHERE id = ?', [status, rejectionReason || null, userId]);
    return res.json({ message: `Registration ${status}.` });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.post('/api/panic-alerts', async (req, res) => {
  try {
    const { userId, userName, role, message, latitude, longitude, locationText } = req.body;
    console.log('[PANIC ALERT] Received:', { userId, userName, role, message, latitude, longitude, locationText });
    
    if (!userName || !role || !message || latitude == null || longitude == null || !locationText) {
      return res.status(400).json({ message: 'Panic alert is missing required fields.' });
    }

    const pool = getPool();
    await pool.query(
      'INSERT INTO panic_alerts (userId, userName, role, message, latitude, longitude, locationText, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId || null, userName, role, message, latitude, longitude, locationText, 'active', new Date().toLocaleString()]
    );

    console.log('[PANIC ALERT] Successfully saved for', userName);
    return res.status(201).json({ message: 'Panic alert broadcasted.' });
  } catch (error) {
    console.error('[PANIC ALERT ERROR]', error);
    return handleServerError(res, error);
  }
});

app.get('/api/panic-alerts', async (req, res) => {
  try {
    const pool = getPool();
    const status = req.query.status || 'active';
    const [rows] = await pool.query('SELECT * FROM panic_alerts WHERE status = ? ORDER BY createdAt DESC', [status]);
    console.log(`[PANIC ALERTS] Found ${rows.length} ${status} alerts`);
    return res.json(rows);
  } catch (error) {
    console.error('[PANIC ALERTS ERROR]', error);
    return handleServerError(res, error);
  }
});

app.patch('/api/panic-alerts/:alertId/resolve', async (req, res) => {
  try {
    const { alertId } = req.params;
    const pool = getPool();
    await pool.query('UPDATE panic_alerts SET status = ? WHERE id = ?', ['resolved', alertId]);
    return res.json({ message: 'Panic alert resolved.' });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.post('/api/location-updates', async (req, res) => {
  try {
    const { userId, driverName, busNumber, stop, stopNumber, latitude, longitude, locationText } = req.body;
    if (!stop || latitude == null || longitude == null || !locationText) {
      return res.status(400).json({ message: 'Location update is missing required fields.' });
    }

    const pool = getPool();
    await pool.query(
      'INSERT INTO location_updates (userId, driverName, busNumber, stop, stopNumber, latitude, longitude, locationText, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId || null, driverName || null, busNumber || null, stop, stopNumber || null, latitude, longitude, locationText, new Date().toLocaleString()]
    );

    return res.status(201).json({ message: 'Location update saved.' });
  } catch (error) {
    return handleServerError(res, error);
  }
});

app.get('/api/location-updates', async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.query.userId || null;
    let query = 'SELECT * FROM location_updates';
    const params = [];

    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }

    query += ' ORDER BY createdAt DESC LIMIT 10';
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return handleServerError(res, error);
  }
});

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
