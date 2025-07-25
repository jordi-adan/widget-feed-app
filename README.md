# Widget Feed App

A modern widget feed application built with Clean Architecture, DDD, and TDD principles.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports and Adapters) with **Domain-Driven Design** principles:

- **Domain Layer**: Pure business logic (entities, value objects, domain services)
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (repositories, databases, external APIs)
- **Interface Adapters**: Controllers, presenters, and gateways

## 🧪 Development Approach

Built using **Test-Driven Development** (TDD):
- ✅ Tests written first
- ✅ Red-Green-Refactor cycle
- ✅ 100% test coverage for business logic

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm test          # Run tests
npm run dev       # Start development server
```

The backend API will be available at `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm start         # Start development server
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Widgets

- `GET /api/widgets` - Get all widgets
- `POST /api/widgets` - Create a new widget

### Widget Types

Supported widget types:
- `text` - Text content
- `image` - Image content  
- `video` - Video content
- `link` - Link content
- `chart` - Chart content

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Test Structure

- **Unit Tests**: Domain entities and value objects
- **Integration Tests**: Use cases and controllers
- **Acceptance Tests**: Full API endpoints

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Jest** for testing
- **Clean Architecture** pattern

### Frontend
- **React** with **TypeScript**
- **Create React App**
- Modern React patterns

## 📁 Project Structure

```
widget-feed-app/
├── backend/
│   ├── src/
│   │   ├── domain/           # Domain layer
│   │   │   ├── entities/     # Domain entities
│   │   │   └── repositories/ # Repository interfaces
│   │   ├── application/      # Application layer
│   │   ├── infrastructure/   # Infrastructure layer
│   │   ├── controllers/      # Interface adapters
│   │   └── types/           # Shared types
│   └── __tests__/           # Test files
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── types/
└── README.md
```

## 🎯 Clean Code Principles

- **Single Responsibility Principle**: Each class has one reason to change
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Interface Segregation**: Small, focused interfaces
- **Clean naming**: Descriptive variable and function names
- **Small functions**: Functions do one thing well

## 🔄 Development Workflow

<<<<<<< HEAD
1. **Write failing tests** (Red)
2. **Write minimal code** to pass (Green)
3. **Refactor** while keeping tests green (Refactor)
4. **Commit** with descriptive messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.: Understand the PRD
Before you start coding, make sure you thoroughly understand the requirements outlined in the PRD. Identify the key features, user stories, and any specific technologies or platforms mentioned.

### Step 2: Choose Your Tech Stack
Based on the requirements, choose a tech stack for your app and backend. Here’s a common stack:
=======
### Test-Driven Development (TDD)
1. **Red** - Write failing tests first
2. **Green** - Write minimal code to pass tests  
3. **Refactor** - Improve code while maintaining tests
4. **Commit** - Clean commits with descriptive messages

### Branch Strategy
- `main` - Production-ready code
- `feature/*` - New features and improvements
- `fix/*` - Bug fixes and patches
- `cleanup/*` - Code cleanup and refactoring

## 📊 Current Implementation Status

### ✅ Completed (Backend - 100%)
- Hexagonal Architecture implementation
- All 6 PRD widget types
- Complete test suite (214 tests)
- In-memory repositories
- REST API with Express.js
- Widget descriptor system
- Dummy data service with high-quality images

### ✅ Completed (Frontend - 100%)
- BaseWidget component with state management
- **All 6 PRD Widget Components:**
  - TextBlock ✅
  - ExpandableList ✅ 
  - HorizontalCards ✅
  - ImageList ✅
  - HighlightBanner ✅
  - QuickActions ✅
- WidgetRenderer for smart component routing
- Error boundaries and loading states
- TypeScript integration
- Component-based architecture
- Comprehensive test coverage (4 test suites)

### ⏳ Future Enhancements
- Dynamic data endpoint (`/widget-data/:id`) for external data sources
- Widget management features (edit, delete, reorder)
- Advanced animations and transitions
- Performance optimizations
- Mobile responsiveness improvements

## 🌐 Live API Testing

```bash
# Health check
curl http://localhost:3001/health

# Get all widgets (with dummy data)
curl http://localhost:3001/api/widgets

# Get widget descriptors (PRD API)
curl http://localhost:3001/widgets

# Create new widget descriptor
curl -X POST http://localhost:3001/widgets 
  -H "Content-Type: application/json" 
  -d '{"widgetType":"text_block","contentType":"static","staticContent":{"title":"Test"}}'
```

## 🔗 Related Documentation
>>>>>>> b858893 (docs: Update documentation to reflect 100% completion status)

- **Frontend (App)**: React Native (for mobile apps), or React.js (for web apps)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (NoSQL) or PostgreSQL (SQL)
- **Authentication**: JWT (JSON Web Tokens) or OAuth
- **Hosting**: Heroku, AWS, or DigitalOcean

### Step 3: Set Up Your Development Environment
1. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).
2. **Install MongoDB**: If you choose MongoDB, install it locally or use a cloud service like MongoDB Atlas.
3. **Install React Native CLI**: If you're building a mobile app, install the React Native CLI.
   ```bash
   npm install -g react-native-cli
   ```

### Step 4: Create the Backend
1. **Initialize a new Node.js project**:
   ```bash
   mkdir my-backend
   cd my-backend
   npm init -y
   ```
2. **Install Express and other dependencies**:
   ```bash
   npm install express mongoose cors dotenv
   ```
3. **Create a basic server**:
   Create a file named `server.js`:
   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   // Connect to MongoDB
   mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

   // Define routes
   app.get('/', (req, res) => {
       res.send('API is running...');
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });
   ```
4. **Set up your database models** based on the PRD.

### Step 5: Create the Frontend
1. **Initialize a new React Native project**:
   ```bash
   npx react-native init MyApp
   cd MyApp
   ```
2. **Install Axios for API calls**:
   ```bash
   npm install axios
   ```
3. **Create components and screens** based on the features outlined in the PRD.

### Step 6: Connect Frontend and Backend
In your React Native app, use Axios to make API calls to your backend. For example:
```javascript
import axios from 'axios';

const fetchData = async () => {
    try {
        const response = await axios.get('http://your-backend-url/api/endpoint');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};
```

### Step 7: Run Your Application
1. **Run the Backend**:
   - Navigate to your backend directory and run:
   ```bash
   node server.js
   ```
   - Ensure your MongoDB service is running.

2. **Run the Frontend**:
   - Navigate to your React Native project directory and run:
   ```bash
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS
   ```

### Step 8: Deployment
- **Backend**: Deploy your backend to a service like Heroku or AWS.
- **Frontend**: If it's a web app, you can deploy it using services like Vercel or Netlify. For mobile apps, you can publish them to the App Store or Google Play.

### Conclusion
This is a high-level overview of how to create an app and backend based on a PRD. Each step can be expanded with more details based on the specific requirements of your project. If you have any specific questions or need further clarification on any step, feel free to ask!