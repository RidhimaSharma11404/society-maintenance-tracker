const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/env');

class AuthService {
  generateToken(user) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      unitNumber: user.unitNumber
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }

  async register({ name, email, password, role, unitNumber, phoneNumber }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('A user with this email address already exists.');
      error.statusCode = 400;
      throw error;
    }

    const assignedRole = role && ['admin', 'staff', 'resident'].includes(role) ? role : 'resident';

    const user = await userRepository.create({
      name,
      email,
      password,
      role: assignedRole,
      unitNumber,
      phoneNumber: phoneNumber || ''
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
