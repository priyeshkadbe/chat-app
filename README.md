# Chat Backend Application

A RESTful API backend for a chat application that allows users to send messages and view chat history using phone numbers.

## Features

- Send messages between users
- View chat history between two users
- View all chat history for a specific user
- Phone number based user identification
- Clean API responses without internal IDs
- Request validation middleware
- Error handling middleware
- Database seeding with sample data
- Type-safe database operations with Prisma
- MongoDB integration

## Project Structure

```
chat-backend/
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma      # Database schema definition
│   └── migrations/        # Database migration files
├── src/
│   ├── config/            # Configuration files
│   │   └── index.ts
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.ts
│   │   └── requestValidator.ts
│   ├── routes/            # API routes
│   │   └── messageRoutes.ts
│   ├── services/          # Business logic
│   │   └── messageService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── index.ts
│   └── index.ts           # Application entry point
├── .env                   # Environment variables
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── pnpm-lock.yaml        # Dependency lock file
└── README.md             # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- pnpm (recommended) or npm

## Setup

1. Clone the repository:

```bash
git clone https://github.com/priyeshkadbe/chat-app.git
cd chat-backend
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="mongodb://localhost:27017/chat-app"
PORT=8080
```

4. Start MongoDB:

```bash
# If using MongoDB locally
mongod
```

5. Run database migrations:

```bash
pnpm prisma migrate dev
# or
npm run prisma migrate dev
```

6. Seed the database with sample data:

```bash
pnpm run seed
# or
npm run seed
```

## Running the Application

1. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The server will start on `http://localhost:8080`

## API Endpoints

### 1. Send a Message

```bash
curl -X POST "http://localhost:8080/api/v1/messages/send" \
-H "Content-Type: application/json" \
-d '{
  "senderPhone": "+1234567890",
  "receiverPhone": "+0987654321",
  "content": "Hello!"
}'
```

### 2. Get Chat History Between Two Users

```bash
curl -X GET "http://localhost:8080/api/v1/messages/chat/+1234567890-+0987654321"
```

### 3. Get All Chat History for a User

```bash
curl -X GET "http://localhost:8080/api/v1/messages/user/+1234567890/chats"
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "content": "Hello!",
      "createdAt": "2024-03-20T10:00:00Z",
      "senderPhone": "+1234567890",
      "receiverPhone": "+0987654321"
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm prisma generate` - Generate Prisma client
- `pnpm prisma migrate dev` - Run database migrations
- `pnpm run seed` - Seed the database with sample data

## License

MIT
