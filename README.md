# EazyBlog

A full-stack blog application built with Express.js and MongoDB. It allows users to create, manage, and publish blog posts, manage categories and tags, and provide a clean responsive front-end for readers.

## Features

- User authentication and session-based login
- Admin dashboard for managing posts and users
- Post creation, editing, and deletion
- Image upload support via Multer
- Featured post functionality
- Category and tag-based organization
- Related posts suggestions
- SEO support with sitemap and robots.txt
- TinyMCE rich text editor
- Responsive Bootstrap-based UI

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- Pug for templating
- Bootstrap for front-end styling
- Multer for file uploads
- Moment.js for date formatting

## Project Structure

```text
Blog-app-with-expressjs/
├── app.js
├── config/
│   ├── database.js
│   ├── eazyblog.env
│   ├── ensureAuthenticated.js
│   ├── ensureGuest.js
│   ├── multer.js
│   └── passport.js
├── data/
├── models/
│   ├── article.js
│   ├── settings.js
│   └── user.js
├── public/
├── routes/
│   ├── Admin.js
│   ├── category.js
│   ├── error/
│   ├── featuredPost.js
│   ├── index.js
│   ├── pages.js
│   ├── posts.js
│   ├── profile.js
│   ├── search.js
│   ├── settings.js
│   ├── tags.js
│   └── user.js
├── Seo/
├── views/
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB connection URL available
- npm installed

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Eazyguy/Blog-app-with-expressjs.git
cd Blog-app-with-expressjs
```

2. Install dependencies:

```bash
npm install
```

3. Configure the environment file:

Create or update `config/eazyblog.env` with your MongoDB connection string and session secret, for example:

```env
DATABASE=mongodb://127.0.0.1:27017/eazyblog
SECRET=your_secret_key
```

## Running the App

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The application will run on the default port `3000` unless a different `PORT` is set in the environment.

## Usage

- Open the app in your browser at `http://localhost:3000`
- Register a new account or log in with an admin account
- Create posts from the dashboard
- Manage categories, featured posts, and profile details
- Publish content and view the blog homepage

## Deployment

This project includes a Vercel configuration and can be deployed with a MongoDB-backed environment setup. For production deployments, ensure that:

- `DATABASE` points to a live MongoDB instance
- `SECRET` is set to a secure value
- static uploads and session storage are configured correctly for the target hosting environment

## License

This project is licensed under the ISC License.

## Demo

A live demo is available here:

https://eazyblog.vercel.app

