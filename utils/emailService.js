const nodemailer = require('nodemailer');
const { User } = require('../models');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send order confirmation
exports.sendOrderConfirmation = async (order) => {
  try {
    const user = await User.findByPk(order.UserId);

    const mailOptions = {
      from: `"Graphic Shop" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Order Confirmation - Graphic Shop',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Hello ${user.name},</p>
        <p>Your order has been successfully placed and payment has been received.</p>
        <h2>Order Details</h2>
        <ul>
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Design Type:</strong> ${order.designType}</li>
          <li><strong>Size:</strong> ${order.size}</li>
          <li><strong>Price:</strong> $${order.price.toFixed(2)}</li>
        </ul>
        <p>We will start working on your design right away. You can track the status of your order in your account dashboard.</p>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,<br>The Graphic Shop Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

// Send work delivered notification
exports.sendWorkDeliveredNotification = async (order) => {
  try {
    const user = await User.findByPk(order.UserId);

    const mailOptions = {
      from: `"Graphic Shop" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Design is Ready! - Graphic Shop',
      html: `
        <h1>Your Design is Ready!</h1>
        <p>Hello ${user.name},</p>
        <p>Great news! Your design is complete and ready for download.</p>
        <h2>Order Details</h2>
        <ul>
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Design Type:</strong> ${order.designType}</li>
        </ul>
        <p>Please log in to your account to download your design and provide feedback:</p>
        <p><a href="${process.env.BASE_URL}/orders/${order.id}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">View My Design</a></p>
        <p>We hope you love your new design! If you have any questions or need any adjustments, please don't hesitate to contact us.</p>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,<br>The Graphic Shop Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Graphic Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Graphic Shop',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset for your Graphic Shop account.</p>
        <p>Click the button below to set a new password:</p>
        <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>This link is valid for 1 hour.</p>
        <p>If you didn't request this, please ignore this email or contact us if you have concerns.</p>
        <p>Best regards,<br>The Graphic Shop Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};
