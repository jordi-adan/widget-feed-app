# Widget Feed App

A modern, single-screen widget feed application built with Clean Architecture, implementing the PRD-compliant widget system with TypeScript, React, and Node.js.

## 🎯 Overview

The Widget Feed App is a PRD-compliant application that displays a dynamic feed of interactive widgets. It supports 6 different widget types with both static and dynamic content loading, complete with loading states and error handling.

## ✨ Features

### 📱 Widget Types (PRD-Compliant)
- **Text Block** - Rich text content display
- **Expandable List** - Interactive collapsible lists
- **Horizontal Cards** - Scrollable card carousels with images
- **Image List** - Photo galleries with lightbox functionality
- **Highlight Banner** - Important announcements and messages
- **Quick Actions** - Action button grids with emoji icons

### 🔄 Dynamic Content System
- **Static Widgets** - Pre-defined content
- **Dynamic Widgets** - External data source integration
- **Loading States** - Skeleton loading and hidden states
- **Error Handling** - Retry mechanisms and error messages

### 🏗️ Architecture

Built with **Hexagonal Architecture** (Ports and Adapters) and **Domain-Driven Design**:

- **Domain Layer** - Pure business logic (entities, value objects, repositories)
- **Application Layer** - Use cases and application orchestration
- **Infrastructure Layer** - External integrations (in-memory storage, APIs)
- **Interface Layer** - REST controllers and Express.js routing

## 🚀 Quick Start

### Using Development Scripts (Recommended)

```bash
# Start both backend and frontend with dummy data
./start-dev.sh

# Stop all services
./stop-dev.sh
```

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run dev --dummy-data  # Start with sample data
npm test                  # Run 214 tests across 22 suites
```

#### Frontend
```bash
cd frontend
npm install
npm start                 # Start React development server
npm run build            # Build for production
```

## 📡 API Endpoints

### PRD-Compliant Widget Descriptors (Primary API)
- `GET /widgets` - Get all widget descriptors
- `POST /widgets` - Create new widget descriptor

### Legacy Widget API (Backward Compatibility)
- `GET /api/widgets` - Get legacy widgets with dummy data
- `POST /api/widgets` - Create legacy widget
- `PUT /api/widgets/:id` - Update widget content
- `DELETE /api/widgets/:id` - Delete widget

### Health & Utilities
- `GET /health` - Health check endpoint
- `GET /widget-data/:id` - Dynamic widget data (planned)

## 🧪 Testing

### Comprehensive Test Suite
```bash
cd backend
npm test                    # Run all 214 tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

### Test Coverage
- ✅ **22 test suites** passing
- ✅ **214 individual tests** passing
- ✅ Domain entities and value objects
- ✅ Application use cases
- ✅ Infrastructure repositories
- ✅ API controllers and endpoints

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Jest** for comprehensive testing
- **In-memory storage** (no database dependencies)
- **Hexagonal Architecture** with TDD

### Frontend  
- **React 18** with **TypeScript**
- **Create React App** foundation
- **CSS Modules** for styling
- **Error Boundaries** for resilience
- **Component-based architecture**

## 📁 Project Structure

```
widget-feed-app/
├── backend/
│   ├── src/
│   │   ├── domain/                    # Domain layer
│   │   │   ├── entities/              # Domain entities
│   │   │   │   ├── WidgetDescriptor.ts
│   │   │   │   └── value-objects/     # Value objects
│   │   │   └── repositories/          # Repository interfaces
│   │   ├── application/               # Application layer
│   │   │   ├── CreateWidgetDescriptorUseCase.ts
│   │   │   ├── GetAllWidgetDescriptorsUseCase.ts
│   │   │   └── __tests__/            # Use case tests
│   │   ├── infrastructure/           # Infrastructure layer
│   │   │   ├── repositories/         # In-memory implementations
│   │   │   └── services/            # External services
│   │   ├── controllers/             # Interface adapters
│   │   └── types/                   # Shared types
│   ├── jest.config.js
│   └── tsconfig.json
├── frontend/
│   └── src/
│       ├── components/              # React components
│       │   ├── widgets/            # Widget-specific components
│       │   ├── WidgetItem.tsx      # Generic widget renderer
│       │   └── BaseWidget.tsx     # Widget wrapper with states
│       ├── pages/
│       ├── services/              # API integration
│       └── types/                 # TypeScript definitions
├── start-dev.sh                   # Development startup script
├── stop-dev.sh                    # Development cleanup script
└── README.md
```

## 🎨 Widget System Architecture

### Widget Descriptor Structure
```typescript
interface WidgetDescriptor {
  id: string;
  type: 'static' | 'dynamic';
  widgetType: 'text_block' | 'expandable_list' | 'horizontal_cards' | 
              'image_list' | 'highlight_banner' | 'quick_actions';
  config: StaticConfig | DynamicConfig;
}
```

### Static vs Dynamic Widgets
- **Static Widgets** - Content embedded in descriptor
- **Dynamic Widgets** - Content fetched from external URLs
- **Loading States** - Skeleton animations or hidden loading
- **Error States** - Retry buttons, error messages, or hidden errors

## 🔄 Development Workflow

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

### ✅ Completed (Frontend - 70%)
- BaseWidget component with state management
- TextBlock and ExpandableList components
- Error boundaries and loading states
- TypeScript integration
- Component-based architecture

### 🔄 In Progress
- Remaining widget components (HorizontalCards, ImageList, HighlightBanner, QuickActions)
- Enhanced error handling
- Performance optimizations

### ⏳ Planned
- Dynamic data endpoint (`/widget-data/:id`)
- Widget management features (edit, delete, reorder)
- Advanced animations and transitions
- Mobile responsiveness improvements

## 🌐 Live API Testing

```bash
# Health check
curl http://localhost:3001/health

# Get all widgets (with dummy data)
curl http://localhost:3001/api/widgets

# Get widget descriptors (PRD API)
curl http://localhost:3001/widgets

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


## 🔗 Related Documentation

- [PRD Implementation Plan](./PRD_IMPLEMENTATION_PLAN.md) - Detailed implementation progress
- [API Documentation](./backend/README.md) - Backend API details  
- [Component Guide](./frontend/README.md) - Frontend component documentation