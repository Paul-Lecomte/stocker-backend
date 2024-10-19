
# Stocker Backend

Stocker is a backend service designed to handle the inventory management, stock control, and order processing for the Stocker application. This service is built with Node.js, Express, and MongoDB, following modern API practices with role-based access control (RBAC) and JWT authentication.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication & Authorization**: Secure user login and registration using JWT.
- **Role-Based Access Control (RBAC)**: Granular permission control based on user roles (e.g., admin, manager, staff).
- **Stock Management**: Create, update, and manage stock items.
- **Order Processing**: Handle and track orders with real-time status updates.
- **Inventory Tracking**: Keep track of stock levels and get notified on low stock.
- **RESTful API**: Clean and simple API following REST principles.
- **Scalable**: Built to scale with modular design and middleware architecture.

## Tech Stack

- **Node.js**: Backend server.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user, stock, and order data.
- **JWT**: Token-based authentication system.
- **Mongoose**: ODM library for MongoDB.

## Setup and Installation

1. Clone the repository:

   \`\`\`bash
   git clone https://github.com/Paul-Lecomte/stocker-backend.git
   cd stocker-backend
   \`\`\`

2. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

3. Set up the environment variables. Create a `.env` file in the root directory with the following variables:

   \`\`\`bash
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT secret>
   \`\`\`

4. Start the development server:

   \`\`\`bash
   npm run dev
   \`\`\`

   The server will run on `http://localhost:5000`.

## Environment Variables

- **PORT**: The port the server runs on (default: 5000).
- **MONGO_URI**: The connection string for the MongoDB database.
- **JWT_SECRET**: A secret key used to sign JWTs.

## API Documentation

The API provides endpoints for managing users, stock items, and orders. You can view the detailed API documentation via Swagger (or Postman collection):

- **Swagger UI**: [link to Swagger docs if applicable]

Some key endpoints:

- **Auth**
    - `POST /api/auth/register`: Register a new user.
    - `POST /api/auth/login`: Log in an existing user.

- **Stock**
    - `GET /api/stock`: Get all stock items.
    - `POST /api/stock`: Add a new stock item.

- **Orders**
    - `GET /api/orders`: Get all orders.
    - `POST /api/orders`: Create a new order.

## Contributing

We welcome contributions to improve Stocker Backend! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request.

Please ensure your code follows the existing style and conventions and is well tested.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
