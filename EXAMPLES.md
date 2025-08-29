# API Examples and Sample Payloads

This document provides practical examples and sample curl commands for testing the Health Dashboard Backend API.

## Authentication Examples

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### Verify Token

```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Profile Management Examples

### Complete Quiz Data Submission

```bash
curl -X POST http://localhost:5000/api/profile/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "personalInfo": {
      "age": 35,
      "gender": "female",
      "height": 165,
      "weight": 62,
      "activityLevel": "moderate"
    },
    "healthConditions": [
      "diabetes_type2",
      "hypertension",
      "high_cholesterol"
    ],
    "fitnessGoals": [
      "weight_management",
      "blood_sugar_control",
      "cardiovascular_health"
    ],
    "trackingPreferences": [
      "glucose",
      "blood_pressure",
      "weight",
      "steps",
      "medication"
    ],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "twice daily",
        "prescribedBy": "Dr. Smith"
      },
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "once daily",
        "prescribedBy": "Dr. Johnson"
      }
    ],
    "careTeam": [
      {
        "name": "Dr. Sarah Smith",
        "role": "Endocrinologist",
        "contact": "sarah.smith@clinic.com",
        "phone": "+1-555-0123"
      },
      {
        "name": "Dr. Mike Johnson",
        "role": "Cardiologist",
        "contact": "mike.johnson@heartcenter.com"
      }
    ],
    "preferences": {
      "units": {
        "weight": "kg",
        "height": "cm",
        "glucose": "mg/dL",
        "temperature": "celsius"
      },
      "notifications": {
        "medication": true,
        "measurements": true,
        "appointments": false
      },
      "privacy": {
        "shareWithCareTeam": true,
        "anonymousData": false
      }
    },
    "initialMeasurements": [
      {
        "type": "glucose",
        "value": 145,
        "unit": "mg/dL",
        "notes": "Fasting glucose reading"
      },
      {
        "type": "blood_pressure",
        "value": "130/85",
        "unit": "mmHg",
        "metadata": {
          "systolic": 130,
          "diastolic": 85
        }
      },
      {
        "type": "weight",
        "value": 62,
        "unit": "kg"
      }
    ]
  }'
```

### Partial Quiz Update (Offline-First Support)

```bash
curl -X POST http://localhost:5000/api/profile/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "personalInfo": {
      "age": 36
    },
    "trackingPreferences": [
      "glucose",
      "blood_pressure",
      "weight",
      "heart_rate"
    ]
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Measurements Examples

### Single Glucose Measurement

```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "glucose",
    "value": 125,
    "unit": "mg/dL",
    "notes": "2 hours after lunch",
    "source": "manual"
  }'
```

### Blood Pressure Measurement

```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "blood_pressure",
    "value": "120/80",
    "unit": "mmHg",
    "metadata": {
      "systolic": 120,
      "diastolic": 80,
      "pulse": 72
    },
    "notes": "Morning reading, rested",
    "source": "device"
  }'
```

### Weight Measurement

```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "weight",
    "value": 61.5,
    "unit": "kg",
    "notes": "Morning weight after workout",
    "source": "device"
  }'
```

### Medication Tracking

```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "medication",
    "value": "taken",
    "metadata": {
      "medicationName": "Metformin",
      "dosage": "500mg",
      "adherence": true
    },
    "notes": "Taken with breakfast",
    "source": "manual"
  }'
```

### Batch Measurements Upload

```bash
curl -X POST http://localhost:5000/api/measurements/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "measurements": [
      {
        "type": "glucose",
        "value": 110,
        "unit": "mg/dL",
        "timestamp": "2024-01-15T08:00:00Z",
        "notes": "Fasting"
      },
      {
        "type": "steps",
        "value": 8500,
        "timestamp": "2024-01-15T23:59:59Z",
        "source": "device"
      },
      {
        "type": "sleep",
        "value": 7.5,
        "unit": "hours",
        "timestamp": "2024-01-15T07:00:00Z",
        "metadata": {
          "quality": "good",
          "deepSleep": 2.1,
          "remSleep": 1.8
        }
      }
    ]
  }'
```

## Querying Measurements

### Get All Measurements

```bash
curl -X GET "http://localhost:5000/api/measurements" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Filter by Type and Date Range

```bash
curl -X GET "http://localhost:5000/api/measurements?type=glucose&startDate=2024-01-01&endDate=2024-01-31&limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Latest Measurements by Type

```bash
curl -X GET "http://localhost:5000/api/measurements/latest?types=glucose,blood_pressure,weight" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Measurement Statistics

```bash
curl -X GET "http://localhost:5000/api/measurements/stats?type=glucose&days=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "glucose",
    "period": "30 days",
    "count": 45,
    "average": 128.5,
    "min": 95,
    "max": 180,
    "trend": "stable",
    "lastValue": 125,
    "targetRange": {
      "min": 80,
      "max": 130
    },
    "inRange": 38,
    "aboveRange": 7,
    "belowRange": 0
  }
}
```

## Sample Data Sets

### Diabetic Patient Profile

```json
{
  "personalInfo": {
    "age": 45,
    "gender": "male",
    "height": 175,
    "weight": 80,
    "activityLevel": "low"
  },
  "healthConditions": [
    "diabetes_type2",
    "obesity",
    "sleep_apnea"
  ],
  "fitnessGoals": [
    "weight_loss",
    "blood_sugar_control",
    "improve_sleep"
  ],
  "trackingPreferences": [
    "glucose",
    "weight",
    "sleep",
    "medication",
    "steps"
  ],
  "medications": [
    {
      "name": "Metformin",
      "dosage": "1000mg",
      "frequency": "twice daily"
    },
    {
      "name": "Insulin Glargine",
      "dosage": "20 units",
      "frequency": "once daily at bedtime"
    }
  ]
}
```

### Hypertensive Patient Profile

```json
{
  "personalInfo": {
    "age": 58,
    "gender": "female",
    "height": 160,
    "weight": 70,
    "activityLevel": "moderate"
  },
  "healthConditions": [
    "hypertension",
    "high_cholesterol"
  ],
  "fitnessGoals": [
    "cardiovascular_health",
    "stress_management"
  ],
  "trackingPreferences": [
    "blood_pressure",
    "heart_rate",
    "weight",
    "medication"
  ],
  "medications": [
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "once daily"
    },
    {
      "name": "Atorvastatin",
      "dosage": "20mg",
      "frequency": "once daily at bedtime"
    }
  ]
}
```

## Error Response Examples

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Access denied. No token provided or invalid format."
}
```

### Resource Not Found

```json
{
  "success": false,
  "message": "Measurement not found or access denied"
}
```

## Testing Workflows

### Complete User Registration and Setup Flow

1. **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!", "name": "Test User"}'
```

2. **Login and Get Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'
```

3. **Complete Profile Quiz**
```bash
curl -X POST http://localhost:5000/api/profile/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"personalInfo": {"age": 30}, "healthConditions": ["diabetes"], "trackingPreferences": ["glucose"]}'
```

4. **Add Initial Measurements**
```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type": "glucose", "value": 120, "unit": "mg/dL"}'
```

5. **Query Data**
```bash
curl -X GET "http://localhost:5000/api/measurements?type=glucose" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment-Specific Examples

### Development Environment

```bash
export API_BASE_URL="http://localhost:5000/api"
export JWT_TOKEN="your-development-token"

# Quick test script
curl -X GET "$API_BASE_URL/auth/verify" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Production Environment

```bash
export API_BASE_URL="https://api.healthdashboard.com/api"
export JWT_TOKEN="your-production-token"

# Health check
curl -X GET "$API_BASE_URL/health" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Postman Collection

Import this JSON into Postman for easy API testing:

```json
{
  "info": {
    "name": "Health Dashboard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\",\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```
