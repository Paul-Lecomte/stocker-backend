
# Stocker Backend

The backend of the Stocker project provides RESTful APIs for managing furniture inventory, tracking stock movements, and handling user authentication. It is built using Node.js and Express.js, and uses MongoDB for data storage.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Paul-Lecomte/stocker-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd stocker-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following variables:
    - `MONGO_URI`: MongoDB connection string
    - `PORT`: Port number for the backend server (default: 5000)

## Configuration

To run the backend server locally:

```bash
npm run dev
```

This will start the server in development mode.

## API Endpoints

The backend provides the following key endpoints:

### Furniture Routes

- **GET `/api/furniture`**: Fetch all furniture items
- **GET `/api/furniture/:id`**: Fetch a single furniture item by ID
- **POST `/api/furniture`**: Create a new furniture item
- **PUT `/api/furniture/:id`**: Update a furniture item by ID
- **DELETE `/api/furniture/:id`**: Delete a furniture item by ID

### Stock Movement Routes

- **GET `/api/movements`**: Fetch all stock movements
- **GET `/api/movements/:furnitureId`**: Fetch stock movements for a specific furniture item
- **POST `/api/movements`**: Record a new stock movement (IN/OUT)

### User Authentication Routes

- **POST `/api/users/register`**: Register a new user
- **POST `/api/users/login`**: Log in an existing user and return a JWT token

## Contributing

Contributions are welcome! To contribute, please fork this repository, create a new branch, and submit a pull request with your changes.
