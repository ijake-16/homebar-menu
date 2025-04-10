const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority';

async function testMongoConnection() {
  console.log('Testing MongoDB connection...');
  console.log(`URI (masked): ${uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('MongoDB connection successful!');
    
    // Get database info
    const adminDb = client.db('admin');
    const result = await adminDb.command({ serverStatus: 1 });
    console.log('MongoDB server info:');
    console.log(`- Version: ${result.version}`);
    console.log(`- Uptime: ${result.uptime} seconds`);
    
    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });

    // Test network latency
    console.log('\nPerforming network latency test...');
    const startTime = Date.now();
    await client.db('admin').command({ ping: 1 });
    const endTime = Date.now();
    console.log(`Network latency: ${endTime - startTime}ms`);
    
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testMongoConnection().catch(console.error); 