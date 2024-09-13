# Backend for Dynamic Forms Application

## Overview

This backend service is built using Node.js with the Express framework and PostgreSQL for database management. It handles form submissions, connecting to a PostgreSQL database to store form data.

## Features

- **Form Submission Endpoint**: Accepts form data via a POST request and stores it in a PostgreSQL database.

## Technologies

- **Node.js**
- **Express**
- **PostgreSQL**
- **CORS**
- **Body-Parser**

## Setup

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running
- Google sheets API setup for data synchronization (creds.json file in the root directory)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Aparajith24/form-app-backend
    cd form-app-backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up the PostgreSQL database:**

    - Create a PostgreSQL database and note the connection details (host, user, password, database name).
    - Create the `form_submissions` table in your database with the following schema:

      ```sql
      CREATE TABLE form_submissions (
        id SERIAL PRIMARY KEY,
        form_type VARCHAR(10) NOT NULL,
        name VARCHAR(100) NOT NULL,
        country_code VARCHAR(10) NOT NULL,
        phone_number VARCHAR(20) NOT NULL
      );
      ```

4. **Configure environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DB_USER=<your-db-username>
    DB_HOST=<your-db-host>
    DB_NAME=<your-db-name>
    DB_PASSWORD=<your-db-password>
    DB_PORT=<your-db-port>
    PORT=2000
    ```

5. **Run the server:**

    ```bash
    node --env-file=.env index.js
    ```

    The server will be available at `http://localhost:2000`.

## API Endpoints

### POST /api/submit-form

Submits form data to the database.
