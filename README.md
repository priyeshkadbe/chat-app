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

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- pnpm (recommended) or npm

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
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
      "receiverPhone": "+0987654321",
      "senderName": "Alice Smith",
      "receiverName": "Bob Johnson"
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Error Codes

- 400: Bad Request (missing required fields, invalid phone number format)
- 404: Not Found (user not found)
- 500: Internal Server Error

## Middleware

The application uses several middleware for request validation and error handling:

### Validation Middleware

- `validateSendMessage`: Validates message sending requests

  - Checks for required fields (senderPhone, receiverPhone, content)
  - Validates phone number format
  - Validates message content

- `validatePhoneNumber`: Validates single phone number in URL parameters

  - Checks phone number format

- `validatePhoneNumbers`: Validates hyphen-separated phone numbers in URL
  - Checks format of both phone numbers

### Error Handling Middleware

- `errorHandler`: Centralized error handling
  - Handles specific error types (user not found)
  - Provides consistent error responses
  - Logs errors for debugging

## Development

### Project Structure

```
src/
  ├── controllers/    # Request handlers
  ├── routes/         # API routes
  ├── services/       # Business logic
  ├── middleware/     # Request validation and error handling
  ├── types/          # TypeScript types
  └── app.ts          # Application entry point
```

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build the application
- `pnpm start`: Start production server
- `pnpm test`: Run tests
- `pnpm lint`: Run linter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
