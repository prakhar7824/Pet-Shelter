# Pet Adoption Platform API

This is the backend API for the Pet Adoption Platform, a full-stack web application that connects animal shelters with adopters looking to give pets a new home.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time messaging
- Cloudinary for image storage
- Multer for file uploads

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth login/register

### Pets
- `GET /api/pets` - Get all pets with filters
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create a new pet listing (Shelter only)
- `PUT /api/pets/:id` - Update a pet listing (Shelter only)
- `DELETE /api/pets/:id` - Delete a pet listing (Shelter only)

### Shelters
- `GET /api/shelters` - Get all shelters
- `GET /api/shelters/:id` - Get shelter by ID
- `POST /api/shelters` - Create a new shelter
- `PUT /api/shelters/:id` - Update a shelter
- `POST /api/shelters/:id/review` - Add a review to a shelter
- `PUT /api/shelters/:id/verify` - Verify a shelter (Admin only)

### Adoptions
- `GET /api/adoptions` - Get all adoptions for current user
- `GET /api/adoptions/:id` - Get adoption by ID
- `POST /api/adoptions` - Create a new adoption request
- `PUT /api/adoptions/:id/status` - Update adoption status
- `PUT /api/adoptions/:id/schedule` - Schedule meeting or home visit
- `PUT /api/adoptions/:id/payment` - Update payment information

### Users
- `GET /api/users/profile` - Get current user's profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password
- `POST /api/users/save-pet/:petId` - Save a pet to user's saved pets
- `DELETE /api/users/save-pet/:petId` - Remove a pet from saved pets
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

## WebSocket Events
- `join_room` - Join a chat room
- `send_message` - Send a message
- `receive_message` - Receive a message 