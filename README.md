# E-Commerce Platform

## Overview

This is a full-stack E-Commerce application built with a React frontend and a Express.js backend. The frontend provides a responsive shopping experience, while the backend manages authentication, product data, and cart functionality. Users can browse products, manage their carts, and apply discount codes. Vendors can manage products by adding and editing them.

## Tech Stack

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Redux & Redux Thunk**: State management library for managing global state and handling async actions.
- **TypeScript**: Provides static typing for better code quality.
- **Ant Design**: UI component library for React.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.
- **Axios**: HTTP client for making requests to the backend.

### Backend
- **Node.js**: A JavaScript runtime used for building the server-side.
- **Express.js**: A minimalist web framework for Node.js to handle routes and middleware.
- **MongoDB**: NoSQL database for storing product, user, and cart information.
- **Mongoose**: ODM for MongoDB, providing schema-based solutions for data modeling.
- **JWT**: Token-based authentication system for secure access to API routes.
- **Multer**: Middleware for handling file uploads for product images.

---

## Features

### User Features
- **Authentication**: Users can register, login, and manage their accounts.
- **Browse Products**: Users can browse all available products.
- **Cart Management**: Users can add, update, and remove products from their carts.
- **Discount Codes**: Apply discount codes in the cart.
- **Responsive Design**: The frontend is fully responsive, adapting to various screen sizes using Tailwind CSS.

### Vendor Additional Features
- **Product Management**: Admins can add and update products.

---

## APIs

### **User Routes**

| HTTP Method | Endpoint               | Description                                    |
|-------------|------------------------|------------------------------------------------|
| `POST`      | `/api/users/login`      | Authenticate a user (login)                    |
| `POST`      | `/api/users/register`   | Register a new user                            |
| `POST`      | `/api/users/logout`     | Logout a user                                  |
| `POST`      | `/api/users/forgot-password` | Trigger password reset via email         |
| `POST`      | `/api/users/reset-password/:token` | Reset password using token             |

### **Product Routes**

| HTTP Method | Endpoint              | Description                                    |
|-------------|-----------------------|------------------------------------------------|
| `GET`       | `/api/products/`       | Fetch all products                             |
| `GET`       | `/api/products/:id`    | Get details of a single product by its ID      |
| `POST`      | `/api/products/`       | Create a new product (vendor only)              |
| `PUT`       | `/api/products/:id`    | Update an existing product (vendor only)        |
| `DELETE`    | `/api/products/:id`    | Delete a product by its ID (vendor only)        |
| `POST`      | `/api/products/upload` | Upload a product image (vendor only)            |

### **Cart Routes**

| HTTP Method | Endpoint               | Description                                              |
|-------------|------------------------|----------------------------------------------------------|
| `POST`      | `/api/cart/add`         | Add an item to the user's cart                           |
| `DELETE`    | `/api/cart/remove/:productId` | Remove an item from the cart                         |
| `POST`      | `/api/cart/discount`    | Apply a discount code to the cart                        |
| `GET`       | `/api/cart/`            | Get the user's current cart                              |
| `PUT`       | `/api/cart/update`      | Update the quantity of a product in the cart             |
| `POST`      | `/api/cart/sync`        | Sync the guest cart with the backend after user login    |

---

## Installation and Setup

### Backend Setup

1. **Clone the Repository**:
```
   git clone https://github.com/Binwu-Hu/eCommerce-Platform.git
   cd eCommerce-Platform
```

2. **Install Backend Dependencies**:
```
    cd backend
    npm install
```

3. **Configure Environment Variables**:
```
    #.env
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-secret-key>
    SENDGRID_API_KEY=<your-sendgrid-api-key>
```

4. **Install Frontend Dependencies**:
```
    cd frontend
    npm install
```

5. **Start the application**:
```
    npm run dev
```



