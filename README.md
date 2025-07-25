# **Widget Feed App**

## 🗂 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Quick Start](#quick-start)
* [API Reference](#api-reference)
* [Project Structure](#project-structure)
* [Testing](#testing)
* [Tech Stack](#tech-stack)
* [Development Workflow](#development-workflow)
* [Future Roadmap](#future-roadmap)
* [Contributing](#contributing)
* [License](#license)

---

## 🚀 Overview

The **Widget Feed App** is a single-page, PRD-compliant application built on a Clean (Hexagonal) Architecture. It renders a dynamic feed of six widget types, supporting both static and live data, complete with robust loading states and error handling.

**Key Highlights:**

* Modern TypeScript-based stack (React + Node.js)
* Domain-Driven, test-first development
* Fully modular widget system with easy extensibility

---

## ✨ Features

* **Six PRD Widget Types**

  * **Text Block:** Rich text rendering
  * **Expandable List:** Collapsible, interactive lists
  * **Horizontal Cards:** Image carousels with swipe/scroll
  * **Image List:** Gallery with lightbox
  * **Highlight Banner:** Full-width announcements
  * **Quick Actions:** Emoji-labeled action buttons grid

* **Content Modes**

  * **Static:** Built-in, pre-defined content
  * **Dynamic:** Fetches external data with auto-refresh

* **UX Resilience**

  * Skeleton loaders and `Hidden` states during fetch
  * Retry buttons and user-friendly error messages

---

## 🏗 Architecture

The app follows **Hexagonal Architecture (Ports & Adapters)** and **Domain-Driven Design**, separated into four layers:

1. **Domain Layer**   – Business entities, value objects, repository interfaces
2. **Application Layer**   – Use-cases and orchestration
3. **Infrastructure Layer**   – External adapters (APIs, in-memory storage)
4. **Interface Layer**   – REST controllers (Express) & React UI

---

## ⚡ Quick Start

### Prerequisites

* Node.js ≥14
* npm or yarn

### Development (All-in-One)

```bash
./start-dev.sh   # Launches backend + frontend with dummy data
# ---
./stop-dev.sh    # Stops all services
```

### Manual Setup

#### Backend

```bash
cd backend
npm ci
npm run dev -- --dummy-data   # Starts server on :3001
npm test                      # Executes 214 tests
```

#### Frontend

```bash
cd frontend
npm ci
npm start                     # React dev on :3000
npm run build                 # Production bundle
```

---

## 📡 API Reference

| Endpoint                      | Description                      |
| ----------------------------- | -------------------------------- |
| **GET** `/widgets`            | List all widget descriptors      |
| **POST** `/widgets`           | Create a widget descriptor       |
| **GET** `/api/widgets`        | Legacy list (dummy data)         |
| **POST** `/api/widgets`       | Create legacy widget             |
| **PUT** `/api/widgets/:id`    | Update legacy widget             |
| **DELETE** `/api/widgets/:id` | Delete legacy widget             |
| **GET** `/health`             | Health check (200 OK)            |
| **GET** `/widget-data/:id`    | (Planned) Dynamic widget payload |

**Example**

```bash
curl -X GET http://localhost:3001/widgets
```

---

## 📁 Project Structure

```
widget-feed-app/
├── backend/
│   ├── src/
│   │   ├── domain/            # Entities, value objects, repos
│   │   ├── application/       # Use-cases & tests
│   │   ├── infrastructure/    # Adapters & services
│   │   └── controllers/       # Express routes
│   ├── jest.config.js
│   └── tsconfig.json
├── frontend/
│   └── src/
│       ├── components/        # Widgets & UI
│       ├── services/          # API clients
│       └── types/             # TS definitions
├── start-dev.sh
├── stop-dev.sh
└── README.md
```

---

## 🧪 Testing

* **Backend:** `npm test` (214 specs, 22 suites)
* **Coverage:** `npm run test:coverage`
* **Watch mode:** `npm run test:watch`
* **Frontend:** Integrates unit and snapshot testing via Jest

---

## 🛠 Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Backend      | Node.js, TypeScript, Express, Jest     |
| Frontend     | React 18, TypeScript, CRA, CSS Modules |
| Architecture | Hexagonal (Ports & Adapters), DDD, TDD |

---

## 📈 Development Workflow

1. **Fork** & **Clone**
2. Create feature branch: `feature/your-feature`
3. **Red** → Write failing test
4. **Green** → Implement minimal code
5. **Refactor** → Clean up and optimize
6. PR with clear description & reviewers

**Branching**

* `main` – production
* `feature/*` – new work
* `fix/*` – bugs
* `cleanup/*` – refactors

---

## 🚀 Future Roadmap

* Dynamic data endpoint (`/widget-data/:id`)
* Admin UI for widget management (CRUD/reorder)
* Advanced animations & transitions
* Performance profiling & optimizations
* Responsive layout enhancements

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
