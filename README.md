<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">Image Management API</h1>

<p align="center">
  A robust backend application built with NestJS for managing users and their private image galleries, leveraging AWS for scalable storage and database services.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10.x-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-v5.x-blue" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📌 Description

This project is a scalable server-side application designed to provide a secure and efficient way for users to manage their personal image collections.  
It features a complete authentication system, integration with **Amazon S3** for file storage, and **Amazon DynamoDB** for a fast and flexible NoSQL database solution.  
The API is fully unit-tested with **Jest**, ensuring high reliability and code quality.

---

## ✨ Key Features

- **Secure User Management**: User registration and JWT-based authentication.  
- **AWS S3 Integration**: High-availability, durable, and scalable cloud storage for all images.  
- **AWS DynamoDB Integration**: Fast, scalable NoSQL database for storing user and image metadata.  
- **Image Operations**: Upload, list, search, and delete images, securely scoped to the authenticated user.  
- **Data Export**: Performant export of a user's image metadata to a CSV file.  
- **Robust Testing**: High unit test coverage (~90%) using Jest.  
- **Configuration-driven**: Uses a `.env` file for easy configuration of credentials and settings.  
- **Validation**: Built-in request validation (file size, type, etc.) using NestJS Pipes.  

---

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js, TypeScript)  
- **Database**: Amazon DynamoDB (NoSQL)  
- **File Storage**: Amazon S3  
- **Authentication**: JSON Web Tokens (JWT)  
- **Testing**: Jest  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)  
- An AWS Account with IAM credentials (Access Key, Secret Key)  
- An AWS S3 Bucket  
- Two Amazon DynamoDB tables (`Users` and `Images`) configured  

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://your-repository-url.com/project-name
    cd project-name
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Fill it with your AWS and JWT credentials:

    ```env
    # AWS Configuration
    AWS_REGION=us-east-1
    PROVIDER_BUCKET=your-s3-bucket-name
    PROVIDER_ACCESS_KEY_ID=your_aws_access_key
    PROVIDER_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_SESSION_TOKEN=your_aws_session_token # Optional

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=3600s
    ```

### ▶️ Running the Application

-   **Development mode with watch:**
    ```bash
    npm run start:dev
    ```

-   **Production mode:**
    ```bash
    npm run start:prod
    ```

The app will be running on <http://localhost:3000>.

---

## 🧪 Running Tests

-   **Run all unit tests:**
    ```bash
    npm run test
    ```

-   **Run tests and generate coverage report:**
    ```bash
    npm run test -- --coverage
    ```

---

## 📖 API Endpoints Documentation

> **Note**: All protected routes require an `Authorization: Bearer <token>` header.

### 🔑 Auth Endpoints

#### Login

`POST /auth/login` (Public)

-   **Request body:**

    ```json
    {
      "email": "user@example.com",
      "senha": "password123"
    }
    ```

-   **Response (200):**

    ```json
    {
      "access_token": "ey..."
    }
    ```

### 👤 Users Endpoints

#### Create User

`POST /users` (Public)

-   **Request body:**

    ```json
    {
      "nome": "John Doe",
      "email": "john.doe@example.com",
      "senha": "strongPassword123"
    }
    ```

-   **Response (201):**

    ```json
    {
      "id": "generated-uuid",
      "nome": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

#### Upload User Avatar

`PATCH /users/avatar` (Protected)

-   **Request body:** `form-data` with a `file` field.

-   **Response (200):**

    ```json
    {
      "message": "Avatar uploaded successfully!",
      "avatarUrl": "https://..."
    }
    ```

### 🖼️ Images Endpoints

#### Upload an Image

`POST /images/upload` (Protected)

-   **Request body:** `form-data` with a `file` field.

-   **Response (201):**

    ```json
    {
      "message": "Image uploaded successfully!",
      "data": {
        "id": "image-uuid",
        "userId": "user-uuid",
        "s3Key": "images/user-uuid/...",
        "url": "https://...",
        "fileName": "original-filename.jpg",
        "createdAt": 1678886400000
      }
    }
    ```

#### List User's Images

`GET /images?page=1&limit=5&search=vacation` (Protected)

-   **Response (200):**

    ```json
    {
      "data": [
        { "id": "...", "url": "...", "fileName": "vacation-1.jpg", "createdAt": "..." }
      ],
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
    ```

#### Delete an Image

`DELETE /images/:id` (Protected)

-   **Response (200):**

    ```json
    {
      "message": "Image deleted successfully."
    }
    ```

#### Export Images to CSV

`GET /images/export/csv` (Protected)

-   **Response:** Triggers a CSV file download (`export-images-xxxx.csv`).

---

📜 License

This project is MIT licensed.