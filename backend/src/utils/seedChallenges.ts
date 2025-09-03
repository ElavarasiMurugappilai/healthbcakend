import { Challenge } from '../models/Challenge';

export const seedChallenges = async () => {
  try {
    console.log('🌱 Seeding challenges...');

    const challenges = [
      {
        title: 'Daily Steps Champion',
        description: 'Walk 10,000 steps every day for a week',
        type: 'fitness',
        difficulty: 'medium',
        target: 10000,
        unit: 'steps',
        duration: 7,
        points: 100,
        icon: '👟',
        tip: 'Start with smaller goals and gradually increase your daily step count.',
        isActive: true
      },
      {
        title: 'Hydration Hero',
        description: 'Drink 8 glasses of water daily',
        type: 'wellness',
        difficulty: 'easy',
        target: 8,
        unit: 'glasses',
        duration: 7,
        points: 50,
        icon: '💧',
        tip: 'Set reminders on your phone to drink water regularly throughout the day.',
        isActive: true
      },
      {
        title: 'Healthy Eating Challenge',
        description: 'Eat 5 servings of fruits and vegetables daily',
        type: 'nutrition',
        difficulty: 'hard',
        target: 5,
        unit: 'servings',
        duration: 14,
        points: 150,
        icon: '🥗',
        tip: 'Plan your meals ahead and keep healthy snacks readily available.',
        isActive: true
      },
      {
        title: 'Sleep Better',
        description: 'Get 8 hours of sleep every night',
        type: 'wellness',
        difficulty: 'medium',
        target: 8,
        unit: 'hours',
        duration: 7,
        points: 75,
        icon: '😴',
        tip: 'Establish a consistent bedtime routine and avoid screens before bed.',
        isActive: true
      },
      {
        title: 'Mindful Minutes',
        description: 'Practice mindfulness for 10 minutes daily',
        type: 'mental_health',
        difficulty: 'easy',
        target: 10,
        unit: 'minutes',
        duration: 7,
        points: 60,
        icon: '🧘',
        tip: 'Find a quiet space and focus on your breathing for better mental clarity.',
        isActive: true
      }
    ];

    // Only insert if they don't already exist
    for (const challengeData of challenges) {
      const existing = await Challenge.findOne({
        title: challengeData.title
      });

      if (!existing) {
        await Challenge.create(challengeData);
        console.log(`✅ Created challenge: ${challengeData.title}`);
      }
    }

    console.log('✅ Challenges seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  }
};