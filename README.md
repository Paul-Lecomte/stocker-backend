![Alt text](assets/stocker_logo.svg) ![Alt text](assets/stocker_name.svg)
# Stocker Backend

The backend service for the **Stocker** project, designed to manage inventory and stock movements efficiently.

## Features

- User authentication and management using JWT.
- Furniture inventory CRUD operations.
- Logging and tracking stock movements (e.g., IN, OUT).
- Aisle management for organizing furniture items.
- Analytics endpoints for actionable insights:
   - Most sold furniture.
   - Highest-priced furniture.

## Technologies

- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication mechanism.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Paul-Lecomte/stocker-backend.git
   cd stocker-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=<your-preferred-port>
   ```

4. Start the development server:
- `3000`: This is the port the server will run on
   ```bash
   npm run dev
   ```
5. You can find the frontend here:
   [Stocker Frontend Repository](https://github.com/Paul-Lecomte/stocker-frontend)


## API Endpoints

### Users
- `POST /users/login` - Authenticate a user and retrieve a JWT token.
- `GET /users` - Fetch all users (admin-only).

### Furniture
- `GET /furniture` - Retrieve all furniture items.
- `POST /furniture` - Create a new furniture entry.
- `PUT /furniture/:id` - Update details of an existing furniture item.
- `DELETE /furniture/:id` - Remove a furniture entry.

### Stock Movements
- `GET /movements/:id` - Retrieve stock movements by furniture ID.
- `POST /movements` - Log a new stock movement.

### Aisles
- `GET /aisles` - List all aisles.
- `POST /aisles` - Create a new aisle.

### Analytics
- `GET /analytics/most-sold` - Retrieve the most-sold furniture items.
- `GET /analytics/highest-priced` - Retrieve the highest-priced furniture.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License.

---