# GraphicShop

A professional graphic design services platform built with Node.js, Express, and EJS.

## Features

- Portfolio showcase with categorized design examples
- Service descriptions and pricing
- Request quote functionality
- Responsive design for all screen sizes

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/graphic-shop.git
   cd graphic-shop
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_NAME=graphicshop
   DB_USER=root
   DB_PASSWORD=
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   BASE_URL=http://localhost:3000
   ```

4. Start the application:
   ```
   node server.js
   ```

5. Open your browser and visit `http://localhost:3000`

## Technologies Used

- Node.js
- Express
- EJS Templates
- Sequelize (ORM)
- MySQL/PostgreSQL
- Stripe Payment Processing
- Nodemailer

## Project Structure

- `server.js` - Main application file
- `models/` - Database models
- `views/` - EJS templates
- `routes/` - Route handlers
- `public/` - Static assets
- `middleware/` - Express middleware
- `utils/` - Utility functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
