const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../../src/services/authService');
const config = require('../../src/config/env');

describe('Authentication & Security Utilities', () => {
  test('Should generate valid signed JWT with correct payload claims', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Eleanor Vance',
      email: 'admin@greenwood.com',
      role: 'admin',
      unitNumber: 'Management Office'
    };

    const token = authService.generateToken(mockUser);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, config.jwtSecret);
    expect(decoded.id).toBe(mockUser._id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe('admin');
    expect(decoded.unitNumber).toBe(mockUser.unitNumber);
  });

  test('Should securely hash password and verify match with bcrypt', async () => {
    const plainPassword = 'CorporatePassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    expect(hash).not.toBe(plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });
});
