❗Work In Progress❗

![logo](assets/stocker_logo.svg)
![logo](assets/stocker_name.svg)

# Stocker Backend

## About the project
Stocker is an inventory management system that allows users to track the stock of furniture items, monitor stock movements, and analyze stock levels through visualizations.

The backend is built with Node.js and handles user authentication, data management, stock movement tracking, and more.

You can find the frontend repository [here](https://github.com/Paul-Lecomte/stocker-frontend).
## Table of contents
* [Stocker Backend](#stocker-backend)
    * [About the project](#about-the-project)
    * [Table of contents](#table-of-contents)
    * [TODO](#todo)
    * [Installation](#installation)
        * [install script](#-installation-script)
        * [Clone the repo](#clone-the-repo)
        * [Install dependencies](#install-dependencies)
        * [Premade users](#premade-users)
    * [Usage](#usage)
        * [Example](#example)
    * [Development usage](#development-usage)

## TODO
Things done and not yet done:
- Backend
    - Stock Management
        - [x] Create, Read, Update, Delete furniture items
        - [x] Track stock movements (IN/OUT)
        - [x] Fetch stock movements by product
        - [x] Fetch stock count by product
    - User Management
        - [x] Authentication with JWT
        - [x] User roles and access control
        - [x] User registration, login, and profile management
    - Notifications
        - [x] Set up notification system for stock changes
    - Other
        - [ ] Optimisation

## Installation
### 🚀 Installation Script

This project includes an install script for easy setup.  
To install and run both the frontend and backend, use:

```bash
chmod +x install.sh && ./install.sh
### Clone the repo
Clone the repository to your local machine.
```bash
git clone https://github.com/Paul-Lecomte/stocker-backend.git
cd stocker-backend
```

### Install dependencies
Install the necessary backend dependencies.

```bash
NodeJs vers 20.6.1
```

```bash
npm install
```

## Usage
To use the backend, you'll need some environment variables. Create a `.env` file in the backend folder and add the following variables (Important info you need to use the app password for the email to work the account password will not work):
```env
PORT
NODE_ENV
DATABASE_URI
JWT_SECRET
```

### Example
```env
PORT=3000
NODE_ENV=dev
DATABASE_URI=mongodb://localhost:27017/stocker
JWT_SECRET=mysecret

# Email Configuration
EMAIL_USER=your-sender-email
EMAIL_PASS=your-app-password
```

## Premade Users

If you use the given users table, here are three premade accounts for testing:

| Role        | Email                  | Password |
|-------------|------------------------|-----|
| Super admin | superadmin@stocker.com | 123 |
| Admin       | admin@stocker.com      | 123 |
| User        | user@stocker.com       | 123 |

You can use these accounts to log in and test different user roles and permissions.


## Development usage
### Start the server
To start the backend server, run the following command:
```bash
npm run dev
```

### API Documentation
The backend exposes a variety of API endpoints for interacting with furniture, stock movements, and users. Ensure that the `.env` file is set up before making requests.

Also if you liked this project consider giving me a follow and a star it helps a lot thanks :3