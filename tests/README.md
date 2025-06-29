# 🧪 Tests

Comprehensive test suite for the Cloud Configuration System using Bun's built-in test runner.

## 📁 Test Structure

```
tests/
├── index.test.ts           # Main application tests
├── configs.test.ts         # API routes integration tests
├── services/
│   └── config.service.test.ts  # Service layer unit tests
└── lib/
    └── prisma.test.ts      # Database client tests
```

## 🚀 Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test tests/configs.test.ts

# Run tests with coverage
bun test --coverage
```

## 🎯 Test Coverage

### Main Application (`index.test.ts`)

- ✅ Root endpoint returns API info
- ✅ 404 handling for unknown routes

### API Routes (`configs.test.ts`)

- ✅ GET `/api/configs` - List user configs
- ✅ GET `/api/configs/:id` - Get specific config
- ✅ POST `/api/configs` - Create new config
- ✅ PUT `/api/configs/:id` - Update config
- ✅ DELETE `/api/configs/:id` - Delete config
- ✅ Error handling and validation

### Service Layer (`config.service.test.ts`)

- ✅ `getMultiple()` - User configs with sorting
- ✅ `getSingle()` - Single config retrieval
- ✅ `create()` - Config creation with UUID
- ✅ `update()` - Config updates
- ✅ `delete()` - Config deletion
- ✅ Error scenarios

### Database (`prisma.test.ts`)

- ✅ Prisma client initialization
- ✅ Database connection
- ✅ Basic query operations

## 📋 Test Data Management

Tests use isolated test users and automatic cleanup:

- `beforeEach`: Cleans test data before each test
- `afterEach`: Cleans test data after each test
- Separate test users to avoid conflicts

## 🔧 Test Configuration

- Uses [Bun's built-in test runner](https://hono.dev/docs/getting-started/bun#testing)
- TypeScript support with `bun-types`
- Database integration with Prisma
- Clean test isolation and data management
