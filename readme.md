# Blogi - Fullstack Blogging Platform

## Introduction

Blogi is a fullstack blogging platform built with **FastAPI** and **PostgreSQL** for the backend and **Next.js** for the frontend. Users can register, log in, create, edit, and delete blog posts. The platform ensures secure authentication using JWT tokens and follows best practices for API interaction and error handling.

---

## Features

### Authentication

- User registration with a unique username and password.
- Login functionality with username and password.
- JWT-based authentication for securing API requests.
- Logout feature that clears stored tokens.

### Blog Posts

- Users can create blog posts with a title and content.
- Users can view a list of all blog posts.
- Users can edit and delete their own blog posts.
- Blog post list is sorted by most recently created.

## Tech Stack

### Backend

- **FastAPI** - Lightweight and high-performance API framework.
- **PostgreSQL** - Relational database for storing users and blog posts.
- **SQLAlchemy** - ORM for database interactions.
- **PyJWT** - Handling JWT authentication.

### Frontend

- **Next.js** - For building the frontend interface.
- **Tailwind CSS/Shadcn UI** - For styling.
- **Axios/Fetch API** - For making API calls.
- **Context API** - For state management.

---

## Setup and Installation

### Prerequisites

- Docker
- Docker Compose
- Node.js 16+

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/Yashgupta9330/blog.git

2. Navigate:
   ```sh
   cd blog

3. Start the backend services using Docker Compose:
   ```sh
   docker-compose up --build


### Frontend Setup


1. Navigate:
   ```sh
   cd client

2. install dependencies:
   ```sh
   npm i

3. Start the frontend services :
   ```sh
   npm run dev