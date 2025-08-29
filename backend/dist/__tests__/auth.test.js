"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const User_1 = __importDefault(require("../models/User"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
describe('Auth Routes', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBe(userData.name);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        });
        it('should not register user with invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'Test123!',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        it('should not register user with weak password', async () => {
            const userData = {
                email: 'test@example.com',
                password: '123',
                name: 'Test User'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        it('should not register duplicate user', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'Test123!',
                name: 'Test User'
            };
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            const user = new User_1.default({
                email: 'login@example.com',
                password: 'Test123!',
                name: 'Login User',
                isVerified: true
            });
            await user.save();
        });
        it('should login with valid credentials', async () => {
            const loginData = {
                email: 'login@example.com',
                password: 'Test123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        });
        it('should not login with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'Test123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email or password');
        });
        it('should not login with invalid password', async () => {
            const loginData = {
                email: 'login@example.com',
                password: 'wrongpassword'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email or password');
        });
        it('should not login unverified user', async () => {
            const unverifiedUser = new User_1.default({
                email: 'unverified@example.com',
                password: 'Test123!',
                name: 'Unverified User',
                isVerified: false
            });
            await unverifiedUser.save();
            const loginData = {
                email: 'unverified@example.com',
                password: 'Test123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('verify your email');
            expect(response.body.requiresVerification).toBe(true);
        });
    });
    describe('GET /api/auth/verify', () => {
        let authToken;
        let userId;
        beforeEach(async () => {
            const user = new User_1.default({
                email: 'verify@example.com',
                password: 'Test123!',
                name: 'Verify User',
                isVerified: true
            });
            await user.save();
            userId = user._id.toString();
            const loginResponse = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'verify@example.com',
                password: 'Test123!'
            });
            authToken = loginResponse.body.data.token;
        });
        it('should verify valid token', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/verify')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user._id).toBe(userId);
        });
        it('should reject invalid token', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/verify')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid token');
        });
        it('should reject missing token', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/verify')
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('No token provided');
        });
    });
});
//# sourceMappingURL=auth.test.js.map