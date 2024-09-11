// handleExecutionReport.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a connection to the SQLite database
const openDbConnection = async () => {
  return open({
    filename: './trade.db',
    driver: sqlite3.Database,
  });
};

// Initialize the database and create the table if it doesn't exist
const initializeDatabase = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS trade (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL,
      currency TEXT,
      secondaryAmount REAL,
      secondaryCurrency TEXT,
      side TEXT,
      symbol TEXT,
      deliveryDate TEXT,
      transactTime TEXT,
      quoteRequestID TEXT,
      quoteID TEXT,
      dealRequestID TEXT,
      dealID TEXT,
      clientID TEXT,
      rate REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Function to handle and persist the execution report
const handleExecutionReport = async (dealData) => {
  try {
    // Open database connection
    const db = await openDbConnection();

    // Initialize the database schema
    await initializeDatabase(db);

    // Insert the execution report data into the database
    await db.run(
      `
      INSERT INTO trade (
        amount, currency, secondaryAmount, secondaryCurrency, side,
        symbol, deliveryDate, transactTime, quoteRequestID, quoteID,
        dealRequestID, dealID, clientID, rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      dealData.amount,
      dealData.currency,
      dealData.secondaryAmount,
      dealData.secondaryCurrency,
      dealData.side,
      dealData.symbol,
      dealData.deliveryDate,
      dealData.transactTime,
      dealData.quoteRequestID,
      dealData.quoteID,
      dealData.dealRequestID,
      dealData.dealID,
      dealData.clientID,
      dealData.rate
    );

    console.log('Execution report saved successfully.');

    // Close the database connection
    await db.close();
  } catch (error) {
    console.error('Error saving execution report:', error);
  }
};

export default handleExecutionReport;

