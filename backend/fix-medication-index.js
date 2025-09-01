const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixMedicationIndex() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('dashboard');
    const collection = db.collection('medications');

    // List existing indexes
    const indexes = await collection.indexes();
    console.log('Existing indexes:', indexes);

    // Drop the problematic medicationId index if it exists
    try {
      await collection.dropIndex('medicationId_1');
      console.log('✅ Dropped medicationId_1 index');
    } catch (error) {
      console.log('Index medicationId_1 does not exist or already dropped');
    }

    // List indexes after cleanup
    const newIndexes = await collection.indexes();
    console.log('Indexes after cleanup:', newIndexes);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixMedicationIndex();
