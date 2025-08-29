"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const measurements_1 = __importDefault(require("../routes/measurements"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const User_1 = __importDefault(require("../models/User"));
const Measurement_1 = __importDefault(require("../models/Measurement"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/measurements', measurements_1.default);
describe('Measurements Routes', () => {
    let authToken;
    let userId;
    beforeEach(async () => {
        const user = new User_1.default({
            email: 'measurements@example.com',
            password: 'Test123!',
            name: 'Measurements User',
            isVerified: true
        });
        await user.save();
        userId = user._id.toString();
        const loginResponse = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({
            email: 'measurements@example.com',
            password: 'Test123!'
        });
        authToken = loginResponse.body.data.token;
    });
    describe('POST /api/measurements', () => {
        it('should create glucose measurement successfully', async () => {
            const measurementData = {
                type: 'glucose',
                value: 120,
                unit: 'mg/dL',
                notes: 'Morning reading',
                source: 'manual'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements')
                .set('Authorization', `Bearer ${authToken}`)
                .send(measurementData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe('glucose');
            expect(response.body.data.value).toBe(120);
            expect(response.body.data.userId).toBe(userId);
        });
        it('should create blood pressure measurement with metadata', async () => {
            const measurementData = {
                type: 'blood_pressure',
                value: '120/80',
                unit: 'mmHg',
                metadata: {
                    systolic: 120,
                    diastolic: 80
                }
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements')
                .set('Authorization', `Bearer ${authToken}`)
                .send(measurementData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe('blood_pressure');
            expect(response.body.data.metadata.systolic).toBe(120);
            expect(response.body.data.metadata.diastolic).toBe(80);
        });
        it('should validate measurement type', async () => {
            const measurementData = {
                type: 'invalid_type',
                value: 120
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements')
                .set('Authorization', `Bearer ${authToken}`)
                .send(measurementData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        it('should validate blood pressure metadata', async () => {
            const measurementData = {
                type: 'blood_pressure',
                value: '120/80',
                metadata: {
                    systolic: 500,
                    diastolic: 80
                }
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements')
                .set('Authorization', `Bearer ${authToken}`)
                .send(measurementData)
                .expect(400);
            expect(response.body.success).toBe(false);
        });
        it('should reject measurement without authentication', async () => {
            const measurementData = {
                type: 'glucose',
                value: 120
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements')
                .send(measurementData)
                .expect(401);
            expect(response.body.success).toBe(false);
        });
    });
    describe('POST /api/measurements/batch', () => {
        it('should create multiple measurements', async () => {
            const batchData = {
                measurements: [
                    {
                        type: 'glucose',
                        value: 120,
                        unit: 'mg/dL'
                    },
                    {
                        type: 'weight',
                        value: 75,
                        unit: 'kg'
                    },
                    {
                        type: 'steps',
                        value: 8500
                    }
                ]
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements/batch')
                .set('Authorization', `Bearer ${authToken}`)
                .send(batchData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.saved).toHaveLength(3);
            expect(response.body.data.errors).toHaveLength(0);
        });
        it('should handle partial batch failures', async () => {
            const batchData = {
                measurements: [
                    {
                        type: 'glucose',
                        value: 120,
                        unit: 'mg/dL'
                    },
                    {
                        type: 'invalid_type',
                        value: 'invalid'
                    },
                    {
                        type: 'weight',
                        value: 75,
                        unit: 'kg'
                    }
                ]
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/measurements/batch')
                .set('Authorization', `Bearer ${authToken}`)
                .send(batchData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.saved).toHaveLength(2);
            expect(response.body.data.errors).toHaveLength(1);
        });
    });
    describe('GET /api/measurements', () => {
        beforeEach(async () => {
            const measurements = [
                {
                    userId,
                    type: 'glucose',
                    value: 120,
                    unit: 'mg/dL',
                    timestamp: new Date('2024-01-01T10:00:00Z')
                },
                {
                    userId,
                    type: 'glucose',
                    value: 115,
                    unit: 'mg/dL',
                    timestamp: new Date('2024-01-02T10:00:00Z')
                },
                {
                    userId,
                    type: 'weight',
                    value: 75,
                    unit: 'kg',
                    timestamp: new Date('2024-01-01T08:00:00Z')
                }
            ];
            await Measurement_1.default.insertMany(measurements);
        });
        it('should get all measurements for user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.measurements).toHaveLength(3);
            expect(response.body.data.pagination.total).toBe(3);
        });
        it('should filter measurements by type', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements?type=glucose')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.measurements).toHaveLength(2);
            expect(response.body.data.measurements[0].type).toBe('glucose');
        });
        it('should filter measurements by date range', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements?startDate=2024-01-01&endDate=2024-01-01')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.measurements).toHaveLength(2);
        });
        it('should paginate measurements', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements?limit=2&offset=0')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.measurements).toHaveLength(2);
            expect(response.body.data.pagination.hasMore).toBe(true);
        });
    });
    describe('GET /api/measurements/latest', () => {
        beforeEach(async () => {
            const measurements = [
                {
                    userId,
                    type: 'glucose',
                    value: 120,
                    timestamp: new Date('2024-01-01T10:00:00Z')
                },
                {
                    userId,
                    type: 'glucose',
                    value: 115,
                    timestamp: new Date('2024-01-02T10:00:00Z')
                },
                {
                    userId,
                    type: 'weight',
                    value: 75,
                    timestamp: new Date('2024-01-01T08:00:00Z')
                }
            ];
            await Measurement_1.default.insertMany(measurements);
        });
        it('should get latest measurements by type', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements/latest?types=glucose,weight')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            const glucoseMeasurement = response.body.data.find((m) => m.type === 'glucose');
            expect(glucoseMeasurement.value).toBe(115);
        });
    });
    describe('GET /api/measurements/stats', () => {
        beforeEach(async () => {
            const measurements = [
                {
                    userId,
                    type: 'glucose',
                    value: 100,
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    userId,
                    type: 'glucose',
                    value: 120,
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                },
                {
                    userId,
                    type: 'glucose',
                    value: 110,
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                }
            ];
            await Measurement_1.default.insertMany(measurements);
        });
        it('should calculate measurement statistics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements/stats?type=glucose&days=7')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.count).toBe(3);
            expect(response.body.data.average).toBe(110);
            expect(response.body.data.min).toBe(100);
            expect(response.body.data.max).toBe(120);
            expect(response.body.data.trend).toBeDefined();
        });
        it('should require measurement type', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/measurements/stats')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('type is required');
        });
    });
    describe('DELETE /api/measurements/:id', () => {
        let measurementId;
        beforeEach(async () => {
            const measurement = new Measurement_1.default({
                userId,
                type: 'glucose',
                value: 120,
                timestamp: new Date()
            });
            const saved = await measurement.save();
            measurementId = saved._id.toString();
        });
        it('should delete measurement successfully', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/measurements/${measurementId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('deleted successfully');
            const deletedMeasurement = await Measurement_1.default.findById(measurementId);
            expect(deletedMeasurement).toBeNull();
        });
        it('should not delete measurement of another user', async () => {
            const otherUser = new User_1.default({
                email: 'other@example.com',
                password: 'Test123!',
                isVerified: true
            });
            await otherUser.save();
            const otherMeasurement = new Measurement_1.default({
                userId: otherUser._id,
                type: 'glucose',
                value: 130,
                timestamp: new Date()
            });
            const saved = await otherMeasurement.save();
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/measurements/${saved._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('not found');
        });
    });
});
//# sourceMappingURL=measurements.test.js.map