# Our Beautiful Summer API

A NestJS-based REST API for managing memories with photo uploads using Supabase as the backend storage solution.

## 📋 Features

- Create, read, update, and delete memories
- Photo upload and storage using Supabase Storage
- Data persistence with Supabase Database
- RESTful API endpoints
- API documentation with Swagger
- Input validation
- Error handling
- TypeScript support

## 🛠 Tech Stack

- NestJS
- TypeScript
- Supabase (Database & Storage)
- Class Validator & Class Transformer
- Swagger/OpenAPI

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## ⚙️ Environment Setup

1. Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Create a bucket named `photos` in your Supabase project:
   - Go to your Supabase project dashboard
   - Navigate to Storage
   - Create a new bucket named `photos`
   - Set the bucket's privacy settings according to your needs

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/handikatriarlan/our-beautiful-summer-api.git
cd our-beautiful-summer-api
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## 📝 API Documentation

After starting the server, visit `http://localhost:3001/api` to access the Swagger documentation.

### API Endpoints

#### Memories

- `POST /api/memories` - Create a new memory
- `GET /api/memories` - Get all memories
- `GET /api/memories/:id` - Get a specific memory
- `PUT /api/memories/:id` - Update a memory
- `DELETE /api/memories/:id` - Delete a memory

### Testing with Postman/Any API Tester

#### Creating a Memory

```http
POST http://localhost:3001/api/memories
Content-Type: multipart/form-data

Form Data:
- title: "Your Memory Title"
- description: "Your Memory Description"
- date: "2024-01-01T00:00:00Z"
- photo: [Select File]
```

#### Getting All Memories

```http
GET http://localhost:3001/api/memories
```

#### Getting a Specific Memory

```http
GET http://localhost:3001/api/memories/:id
```

#### Updating a Memory

```http
PUT http://localhost:3001/api/memories/:id
Content-Type: multipart/form-data

Form Data:
- title: "Updated Title" (optional)
- description: "Updated Description" (optional)
- date: "2024-01-02T00:00:00Z" (optional)
- photo: [Select File] (optional)
```

#### Deleting a Memory

```http
DELETE http://localhost:3001/api/memories/:id
```

## 🧪 Running Tests

```bash
# unit tests
npm run test

# test coverage
npm run test:coverage
```

## 📜 Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code using Prettier
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Lint the code
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🔒 Security

The API uses Supabase's Row Level Security (RLS) policies to ensure data security. Make sure to configure your RLS policies according to your security requirements.
