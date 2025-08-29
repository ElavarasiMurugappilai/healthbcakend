import request from 'supertest';
import express from 'express';
import profileRoutes from '../routes/profile';
import authRoutes from '../routes/authRoutes';
import User from '../models/User';
import Measurement from '../models/Measurement';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

describe('Profile Routes', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create and login user to get token
    const user = new User({
      email: 'profile@example.com',
      password: 'Test123!',
      name: 'Profile User',
      isVerified: true
    });
    await user.save();
    userId = user._id.toString();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'profile@example.com',
        password: 'Test123!'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('POST /api/profile/quiz', () => {
    it('should save complete quiz data successfully', async () => {
      const quizData = {
        age: 30,
        gender: 'male',
        weight: 75,
        height: 180,
        conditions: [{ name: 'Diabetes', severity: 'mild' }],
        smoker: false,
        alcohol: 'occasional',
        sleepHours: [8],
        exercise: 'regular',
        exerciseTypes: ['running', 'cycling'],
        exerciseDuration: [45],
        fitnessGoals: 'weight_loss',
        waterIntake: [2.5],
        stepGoal: [10000],
        trackGlucose: true,
        trackBP: true,
        units: {
          weight: 'kg',
          height: 'cm',
          glucose: 'mg/dL'
        },
        initialMeasurements: [
          {
            type: 'glucose',
            value: 120,
            unit: 'mg/dL',
            timestamp: new Date().toISOString()
          }
        ]
      };

      const response = await request(app)
        .post('/api/profile/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.age).toBe(30);
      expect(response.body.data.profile.gender).toBe('male');
      expect(response.body.data.user._id).toBe(userId);
      expect(response.body.data.measurements).toHaveLength(1);
    });

    it('should handle partial quiz data (offline-first resilience)', async () => {
      const partialQuizData = {
        age: 25,
        trackGlucose: true
      };

      const response = await request(app)
        .post('/api/profile/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send(partialQuizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.age).toBe(25);
      expect(response.body.data.profile.trackGlucose).toBe(true);
    });

    it('should reject quiz data without authentication', async () => {
      const quizData = { age: 30 };

      const response = await request(app)
        .post('/api/profile/quiz')
        .send(quizData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should continue processing even if some measurements fail', async () => {
      const quizData = {
        age: 30,
        initialMeasurements: [
          {
            type: 'glucose',
            value: 120,
            unit: 'mg/dL'
          },
          {
            type: 'invalid_type', // This should fail
            value: 'invalid'
          },
          {
            type: 'weight',
            value: 75,
            unit: 'kg'
          }
        ]
      };

      const response = await request(app)
        .post('/api/profile/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.age).toBe(30);
      // Should save valid measurements even if some fail
      expect(response.body.data.measurements.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/profile', () => {
    beforeEach(async () => {
      // Add some profile data and measurements
      await User.findByIdAndUpdate(userId, {
        $set: {
          'profile.age': 30,
          'profile.gender': 'male',
          'profile.trackGlucose': true
        }
      });

      const measurement = new Measurement({
        userId,
        type: 'glucose',
        value: 120,
        unit: 'mg/dL',
        timestamp: new Date()
      });
      await measurement.save();
    });

    it('should get user profile with latest measurements', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.age).toBe(30);
      expect(response.body.data.user._id).toBe(userId);
      expect(response.body.data.latestMeasurements).toBeDefined();
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update profile data', async () => {
      const updateData = {
        age: 35,
        weight: 80,
        fitnessGoals: 'muscle_gain'
      };

      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.age).toBe(35);
      expect(response.body.data.profile.weight).toBe(80);
      expect(response.body.data.profile.fitnessGoals).toBe('muscle_gain');
    });

    it('should validate profile data', async () => {
      const invalidData = {
        age: -5, // Invalid age
        gender: 'invalid_gender'
      };

      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});
