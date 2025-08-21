// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

// Switch to the remittance-app database
db = db.getSiblingDB('remittance-app');

// Create collections with indexes
db.createCollection('users');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "niumCustomerHashId": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "createdAt": 1 });

console.log('✅ RemittanceApp database initialized successfully');
