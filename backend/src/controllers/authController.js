const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role, unitNumber, phoneNumber } = req.body;

      if (!name || !email || !password || !unitNumber) {
        return ApiResponse.error(res, 'Name, email, password, and unitNumber are required.', 400);
      }

      const result = await authService.register({
        name,
        email,
        password,
        role,
        unitNumber,
        phoneNumber
      });

      return ApiResponse.created(res, result, 'User registered successfully.');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.error(res, 'Email and password are required.', 400);
      }

      const result = await authService.login(email, password);
      return ApiResponse.success(res, result, 'Authenticated successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return ApiResponse.success(res, { user }, 'Profile retrieved.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
