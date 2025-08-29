# Health Dashboard Backend

A comprehensive Node.js backend for a Health Dashboard Quiz application with secure authentication, profile management, and health measurement tracking.

## Features

- **Authentication**: JWT-based auth with email verification
- **Profile Management**: Resilient quiz data handling with offline-first support
- **Health Measurements**: Timeseries data ingestion and querying
- **Validation**: Comprehensive input validation and sanitization
- **Testing**: Full test coverage with Jest and Supertest
- **Security**: Password hashing, rate limiting, CORS protection

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Testing**: Jest with Supertest
- **Security**: Helmet, CORS, rate limiting

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

1. Clone and navigate to backend directory:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Required
MONGO_URI=mongodb://localhost:27017/health-dashboard
JWT_SECRET=your-super-secret-jwt-key-here

# Optional
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "userId",
      "email": "user@example.com",
      "name": "John Doe",
      "isVerified": false
    },
    "token": "jwt-token-here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Verify Token
```http
GET /auth/verify
Authorization: Bearer <jwt-token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Profile Endpoints

#### Save Quiz Data (Resilient)
```http
POST /profile/quiz
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "personalInfo": {
    "age": 30,
    "gender": "female",
    "height": 165,
    "weight": 60
  },
  "healthConditions": ["diabetes", "hypertension"],
  "fitnessGoals": ["weight_loss", "strength"],
  "trackingPreferences": ["glucose", "blood_pressure", "weight"],
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "twice daily"
    }
  ],
  "careTeam": [
    {
      "name": "Dr. Smith",
      "role": "Primary Care",
      "contact": "dr.smith@clinic.com"
    }
  ],
  "initialMeasurements": [
    {
      "type": "glucose",
      "value": 120,
      "unit": "mg/dL"
    }
  ]
}
```

#### Get Profile
```http
GET /profile
Authorization: Bearer <jwt-token>
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "personalInfo": {
    "age": 31
  }
}
```

### Measurements Endpoints

#### Create Measurement
```http
POST /measurements
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "glucose",
  "value": 125,
  "unit": "mg/dL",
  "notes": "After breakfast",
  "source": "manual"
}
```

#### Create Blood Pressure Measurement
```http
POST /measurements
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "blood_pressure",
  "value": "120/80",
  "unit": "mmHg",
  "metadata": {
    "systolic": 120,
    "diastolic": 80
  }
}
```

#### Batch Create Measurements
```http
POST /measurements/batch
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "measurements": [
    {
      "type": "glucose",
      "value": 120,
      "unit": "mg/dL"
    },
    {
      "type": "weight",
      "value": 75,
      "unit": "kg"
    }
  ]
}
```

#### Get Measurements
```http
GET /measurements?type=glucose&startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `type`: Filter by measurement type
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

#### Get Latest Measurements
```http
GET /measurements/latest?types=glucose,weight,blood_pressure
Authorization: Bearer <jwt-token>
```

#### Get Measurement Statistics
```http
GET /measurements/stats?type=glucose&days=30
Authorization: Bearer <jwt-token>
```

#### Delete Measurement
```http
DELETE /measurements/:id
Authorization: Bearer <jwt-token>
```

## Data Models

### User Model
```typescript
{
  email: string;
  password: string; // hashed
  name: string;
  isVerified: boolean;
  verificationToken?: string;
  profile: {
    personalInfo: {
      age?: number;
      gender?: 'male' | 'female' | 'other';
      height?: number; // cm
      weight?: number; // kg
    };
    healthConditions: string[];
    fitnessGoals: string[];
    trackingPreferences: string[];
    medications: Array<{
      name: string;
      dosage?: string;
      frequency?: string;
    }>;
    careTeam: Array<{
      name: string;
      role: string;
      contact?: string;
    }>;
    // ... additional profile fields
  };
}
```

### Measurement Model
```typescript
{
  userId: ObjectId;
  type: 'glucose' | 'blood_pressure' | 'weight' | 'steps' | 'heart_rate' | 'sleep' | 'medication';
  value: number | string;
  unit?: string;
  timestamp: Date;
  notes?: string;
  source: 'manual' | 'device' | 'app';
  metadata?: Record<string, any>;
}
```

## Measurement Types

- **glucose**: Blood glucose (mg/dL or mmol/L)
- **blood_pressure**: Blood pressure with systolic/diastolic metadata
- **weight**: Body weight (kg or lbs)
- **steps**: Daily step count
- **heart_rate**: Heart rate (bpm)
- **sleep**: Sleep duration (hours)
- **medication**: Medication taken (boolean or dosage)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Stateless token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive validation with express-validator
- **CORS Protection**: Configurable cross-origin policies
- **Helmet**: Security headers middleware

## Development

### Project Structure
```
backend/
├── src/
│   ├── __tests__/          # Test files
│   ├── config/             # Configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.ts           # Main server file
├── dist/                  # Compiled JavaScript
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment mode |
| `FRONTEND_URL` | No | http://localhost:3000 | Frontend URL for CORS |
| `ADMIN_EMAILS` | No | - | Comma-separated admin emails |

## Deployment

### Production Checklist

1. Set strong `JWT_SECRET` (32+ characters)
2. Use production MongoDB instance
3. Set `NODE_ENV=production`
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Configure reverse proxy (nginx/Apache)
7. Set up monitoring and logging
8. Configure backup strategy

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

## Future Enhancements

- **File Upload**: Prescription and document storage
- **Notifications**: Email/SMS reminders and alerts
- **Data Export**: CSV/PDF report generation
- **Analytics**: Advanced health insights and trends
- **Integration**: Wearable device data sync
- **Multi-tenancy**: Support for healthcare organizations
- **Real-time**: WebSocket support for live updates

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create GitHub issue
- Email: support@healthdashboard.com
- Documentation: [API Docs](./docs/api.md)
