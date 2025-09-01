const mongoose = require('mongoose');
require('dotenv').config();

async function dropProblematicIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('medications');

    // List current indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:', indexes.map(idx => idx.name));

    // Drop the problematic medicationId index
    try {
      await collection.dropIndex('medicationId_1');
      console.log('✅ Dropped medicationId_1 index');
    } catch (error) {
      console.log('ℹ️ medicationId_1 index not found or already dropped');
    }

    // List indexes after cleanup
    const newIndexes = await collection.indexes();
    console.log('📋 Indexes after cleanup:', newIndexes.map(idx => idx.name));

    console.log('✅ Index cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropProblematicIndex();
