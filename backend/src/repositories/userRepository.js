const User = require('../models/User');

class UserRepository {
  async create(userData, session = null) {
    const user = new User(userData);
    return await user.save({ session });
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findAll(filter = {}) {
    return await User.find(filter).sort({ createdAt: -1 });
  }

  async count(filter = {}) {
    return await User.countDocuments(filter);
  }
}

module.exports = new UserRepository();
