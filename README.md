# PetShelter 🐾

A full-stack web application connecting pets in shelters with potential adopters.

![PetShelter Screenshot](https://via.placeholder.com/800x400?text=PetShelter+Screenshot)

## 🌟 Features

- Browse available pets from multiple shelters
- View detailed information about pets and shelters
- Submit adoption requests
- User authentication and profile management
- Shelter management dashboard
- Responsive design for all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/petshelter.git
   cd petshelter
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables
   ```bash
   # In the server directory
   cp .env.example .env
   
   # Edit .env file with your configuration
   ```

4. Start the development servers
   ```bash
   # Start the backend server (from the server directory)
   npm run dev

   # Start the frontend server (from the client directory)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
PetShelter/
├── client/                 # React frontend application
├── server/                 # Node.js backend application
├── .gitignore              # Git ignore file
├── package.json            # Root package.json
└── README.md               # This file
```

## 🛠️ Built With

- **Frontend**
  - React
  - TypeScript
  - React Router
  - Tailwind CSS
  - Axios

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server.

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 📦 Deployment

### Frontend Deployment

```bash
cd client
npm run build
```

The build artifacts will be stored in the `client/build` directory.

### Backend Deployment

```bash
cd server
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Unsplash](https://unsplash.com/) for pet images
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://reactjs.org/) for frontend framework

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/petshelter](https://github.com/yourusername/petshelter) 