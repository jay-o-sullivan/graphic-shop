# GraphicShop - Freelance Graphic Design Service Platform

GraphicShop is a full-featured web application for selling graphic design services. Clients can browse a portfolio, request quotes, place orders for custom designs, and make payments. Designers can manage orders, upload completed work, and build their portfolio.

## Features

- User authentication (register, login, password reset)
- Portfolio showcase with categorized design examples
- Automated price calculator
- Secure payment processing with Stripe
- Order management system
- Admin dashboard for managing orders and portfolio
- Email notifications
- Responsive design for all device sizes

## Tech Stack

- Backend: Node.js with Express
- Frontend: HTML, CSS, JavaScript, EJS templates
- Database: MySQL with Sequelize ORM
- Payment Processing: Stripe
- Email Service: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/graphic-shop.git
   cd graphic-shop
   ```

2. Create a MySQL database:
   ```sql
   CREATE DATABASE graphic_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Copy the example environment file and update it with your settings:
   ```
   cp .env.example .env
   ```
   Edit `.env` with your database credentials, Stripe API keys, etc.

4. Run the setup script to install dependencies, fetch sample images, and initialize the database:
   ```
   npm run setup
   ```

5. Start the application:
   ```
   npm start
   ```

6. Access the application at http://localhost:3000

## Development

For development with automatic reloading:
```
npm run dev
```

## Admin Access

After running the initialization script, you can log in as admin with:
- Email: admin@graphicshop.com
- Password: admin123 (or the value you set in ADMIN_INITIAL_PASSWORD in your .env file)

## Project Structure

```
graphic-shop/
├── config/           # Configuration files
├── models/           # Database models
├── public/           # Static assets
│   ├── css/          # CSS stylesheets
│   ├── js/           # Client-side JavaScript
│   ├── images/       # Images for the site
│   └── uploads/      # Uploaded designs & portfolio items
├── routes/           # Express routes
├── scripts/          # Utility scripts
├── utils/            # Utility functions
├── views/            # EJS templates
│   └── partials/     # Reusable template parts
├── middleware/       # Express middleware
├── .env.example      # Example environment variables
├── package.json      # Node.js dependencies
├── server.js         # Express application
└── README.md         # This file
```

## License

