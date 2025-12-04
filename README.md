# InsightStream - Project Report

**Project Name**: InsightStream  
**Type**: Web Application (News Aggregation Platform)  
**Date**: December 2025

---

## 1. Abstract

InsightStream is a modern, feature-rich news aggregation platform designed to provide users with a seamless and personalized news-reading experience. In an era of information overload, InsightStream filters and organizes news from diverse global sources into a unified, aesthetically pleasing interface. The application leverages a robust tech stack comprising React.js for the frontend, Node.js/Express for the backend proxy, and a custom mock server for data persistence. Key features include real-time news fetching, user authentication, personalized bookmarks, and a comprehensive theme customization system.

## 2. Introduction

### 2.1 Problem Statement
Users today are bombarded with news from countless sources, often leading to "doomscrolling" and information fatigue. Existing platforms are either too cluttered, paywalled, or lack personalization options. There is a need for a clean, fast, and customizable platform that aggregates news while respecting user preferences.

### 2.2 Objectives
-   **Aggregation**: To fetch and display real-time news from reputable global sources.
-   **Personalization**: To allow users to save articles, customize themes, and filter news by country and language.
-   **Performance**: To ensure fast load times and a responsive UI across all devices.
-   **Usability**: To provide a distraction-free reading environment.

### 2.3 Scope
The project covers the development of a web-based application with a responsive frontend, a proxy server to handle API requests securely, and a simulated backend for user management. It targets general news readers who value aesthetics and organization.

## 3. System Analysis

### 3.1 Existing System
Traditional news consumption involves visiting multiple websites or using rigid aggregator apps with limited customization. These systems often suffer from:
-   Inconsistent user interfaces.
-   Lack of dark mode or theme options.
-   Privacy concerns (excessive tracking).

### 3.2 Proposed System
InsightStream addresses these limitations by:
-   **Centralizing Content**: One interface for all news.
-   **Enhancing UX**: Offering 8+ themes and a custom theme creator.
-   **Privacy-Focused**: Storing preferences locally and using a lightweight backend.
-   **Offline Capabilities**: Caching mechanisms to reduce API calls and improve speed.

### 3.3 Feasibility Study
-   **Technical**: Built with standard, widely-supported technologies (React, Node.js).
-   **Operational**: Easy to deploy and maintain; intuitive for end-users.
-   **Economic**: Uses free tiers of NewsAPI and open-source libraries, making it cost-effective.

## 4. System Design

### 4.1 Architecture
The system follows a **Service-Oriented Architecture (SOA)** with three distinct components running concurrently:

1.  **Frontend (Client)**: A Single Page Application (SPA) built with React + Vite.
2.  **Proxy Server (Middleware)**: An Express.js server that acts as a gateway to external APIs, handling authentication and rate limiting.
3.  **Mock Server (Database)**: A JSON-server instance that simulates a RESTful API for user data (Auth, Bookmarks, Profiles).

### 4.2 Data Flow
1.  **User Action** -> **Frontend Component** (React)
2.  **Frontend** -> **Zustand Store** (State Management)
3.  **Store** -> **Axios Interceptor**
4.  **Axios** -> **Proxy Server** (for News) OR **Mock Server** (for User Data)
5.  **Proxy Server** -> **NewsAPI** (External)
6.  **Response** -> **Frontend** -> **UI Update**

### 4.3 Tech Stack

#### Frontend
-   **Framework**: React 18
-   **Build Tool**: Vite (for fast HMR and bundling)
-   **Styling**: Tailwind CSS (Utility-first CSS)
-   **State Management**: Zustand (Lightweight, hook-based state)
-   **Routing**: React Router DOM v6
-   **Icons**: React Icons
-   **HTTP Client**: Axios

#### Backend / Middleware
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Security**: CORS, Dotenv
-   **Caching**: In-memory Map (for API response caching)

#### Database / Persistence
-   **Engine**: JSON Server (LowDB)
-   **Data Format**: JSON (`db.json`)
-   **Authentication**: JWT (JSON Web Tokens)

## 5. Implementation Details

### 5.1 Frontend Implementation
The frontend is structured into modular components.
-   **`App.jsx`**: Handles the main routing logic, including protected routes for authenticated users.
-   **`useThemeStore.js`**: Manages the application's theme state. It persists the user's choice and applies CSS variables dynamically to the `:root` element, allowing for instant theme switching (e.g., Gold Light, Midnight Dark).
-   **`useAuthStore.js`**: Handles user authentication (Login, Signup, Logout). It stores the JWT token in `localStorage` and validates it on app launch.

### 5.2 Proxy Server (`proxy-server.js`)
To protect the `NEWS_API_KEY` and avoid CORS issues, requests are routed through a proxy.
-   **Caching**: Implements a time-based cache (TTL) to store responses for 5 minutes. This significantly reduces API usage and speeds up repeated requests.
-   **Rate Limiting**: Handles `429 Too Many Requests` errors gracefully by serving stale cache data if available.

### 5.3 Authentication & Database (`mock/server.js`)
A custom implementation using `json-server` provides full auth capabilities.
-   **Signup/Login**: Generates and verifies JWT tokens.
-   **Protected Routes**: Middleware ensures only requests with a valid `Bearer` token can access `/bookmarks` or update profiles.
-   **Data Models**:
    -   `Users`: ID, Name, Email, Password (hashed), Avatar, Preferences.
    -   `Bookmarks`: ID, UserID, Article Data, Timestamp.

## 6. Features & Modules

### 6.1 News Feed
-   **Top Headlines**: Fetches latest news based on country.
-   **Categories**: Filter by Business, Tech, Sports, etc.
-   **Search**: Powerful search functionality with date and source filters.

### 6.2 User Accounts
-   **Profile Management**: Users can update their name, avatar, and default country/language.
-   **Avatar Selection**: A fun, interactive page to choose from preset avatars.

### 6.3 Bookmarking System
-   **Save for Later**: Users can bookmark articles.
-   **Sync**: Bookmarks are saved to the database and synced across devices (simulated).

### 6.4 Theme System
-   **Predefined Themes**: 8 professionally designed themes.
-   **Custom Theme Creator**: Users can define their own color palettes.
-   **Dark Mode**: Fully supported across all components.

## 7. Testing

### 7.1 Unit Testing
-   Components are tested in isolation to ensure they render correctly.
-   Utility functions (e.g., date formatting) are verified for edge cases.

### 7.2 Integration Testing
-   **Auth Flow**: Verified that login tokens persist and expire correctly.
-   **API Integration**: Tested the Proxy Server's caching logic by making repeated requests and observing response times.

### 7.3 Cross-Browser Testing
-   Tested on Chrome, Firefox, and Edge to ensure consistent styling and behavior.

## 8. Installation & Setup

### Prerequisites
-   Node.js (v16+)
-   npm

### Steps
1.  **Clone the Repository**
2.  **Install Dependencies**:
    ```bash
    npm install
    cd frontend && npm install && cd ..
    ```
3.  **Configure Environment**:
    Create `.env` in root:
    ```env
    PORT=5000
    NEWS_API_KEY=your_key
    JWT_SUPER_SECRET_KEY=secret
    ```
4.  **Run Application**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`.

## 9. Conclusion
InsightStream successfully achieves its goal of providing a modern, customizable news reading experience. By decoupling the frontend from the external API via a proxy, we achieved better security and performance. The modular architecture allows for easy scalability in the future.

## 10. Future Scope
-   **Mobile App**: Convert the React app to React Native.
-   **AI Summarization**: Use LLMs to summarize long articles.
-   **Social Features**: Allow users to share and comment on articles.
-   **Real Backend**: Migrate from JSON Server to MongoDB/PostgreSQL for production.

---
*Report generated for InsightStream Project.*
