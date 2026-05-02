const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'college_bus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;

async function initDatabase() {
  const initConnection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });

  await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await initConnection.end();

  pool = mysql.createPool(config);
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        role VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        rejectionReason VARCHAR(255),
        studentId VARCHAR(100),
        childName VARCHAR(255),
        licenseNumber VARCHAR(100),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        routeName VARCHAR(255) NOT NULL,
        busNumber VARCHAR(100),
        driverName VARCHAR(255),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS panic_alerts (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        userId BIGINT UNSIGNED,
        userName VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        message VARCHAR(255) NOT NULL,
        latitude DECIMAL(10,7) NOT NULL,
        longitude DECIMAL(10,7) NOT NULL,
        locationText VARCHAR(255) NOT NULL,
        status ENUM('active','resolved') NOT NULL DEFAULT 'active',
        timestamp VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS location_updates (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        userId BIGINT UNSIGNED,
        driverName VARCHAR(255),
        busNumber VARCHAR(100),
        stop VARCHAR(255) NOT NULL,
        stopNumber VARCHAR(50),
        latitude DECIMAL(10,7) NOT NULL,
        longitude DECIMAL(10,7) NOT NULL,
        locationText VARCHAR(255) NOT NULL,
        timestamp VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'harishmuthyala11@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin11';
    const [rows] = await connection.query('SELECT id FROM users WHERE email = ? AND role = ?', [adminEmail, 'admin']);

    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        'INSERT INTO users (role, name, email, password, status) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'College Administrator', adminEmail, passwordHash, 'approved']
      );
      console.log(`Created default admin user: ${adminEmail}`);
    }
  } finally {
    connection.release();
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
}

module.exports = {
  initDatabase,
  getPool,
};
