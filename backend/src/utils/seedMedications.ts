import MedicationSuggestion from '../models/MedicationSuggestion';
import Doctor from '../models/Doctor';

export const seedMedicationSuggestions = async () => {
  try {
    console.log('🌱 Seeding medication suggestions...');
    
    // Skip seeding medication suggestions as they require valid userId
    // These will be created when doctors actually suggest medications to users
    console.log('⚠️ Skipping medication suggestions seed - requires valid userId');
    
  } catch (error) {
    console.error('❌ Error seeding medication suggestions:', error);
  }
};