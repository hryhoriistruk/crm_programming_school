
# Project Setup Instructions

## Prerequisites

- Node.js and npm installed on your machine.
- Docker Desktop is running on your computer

## Running the app
### Backend Setup

```bash

# 1. Navigate to the backend directory:
$ cd backend

# 2. Install dependencies:
$ npm install

# 3. Start Docker containers:
$ npm run start:docker:db

# 4. Run database migrations:
$ npm run migration:run 

# 5. Start the development server
$ npm run start:dev
```
### Frontend Setup

```bash

# 1. Navigate to the frontend directory:
$ cd frontend 

# 2. Install dependencies:
$ npm install

# 3. Start the frontend server:
$ npm run start

```
### API Documentation

This project includes API documentation generated with Swagger. Once the application is running, you can access the Swagger documentation by navigating to: **http://localhost:4000/api**

## Using the Documentation
- Explore Endpoints: Browse all available API endpoints, view request parameters, response schemas, and possible HTTP status codes.
- Test Endpoints: Use the interactive interface to send requests directly to the API from your browser.
- Authorization: You can input a JWT token within the Swagger UI to test protected endpoints.
