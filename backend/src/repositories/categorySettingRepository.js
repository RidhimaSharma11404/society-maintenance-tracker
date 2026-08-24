const CategorySetting = require('../models/CategorySetting');

class CategorySettingRepository {
  async findAll() {
    return await CategorySetting.find().sort({ category: 1 });
  }

  async findByCategory(category) {
    return await CategorySetting.findOne({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') } 
    });
  }

  async upsert(category, data, session = null) {
    return await CategorySetting.findOneAndUpdate(
      { category: { $regex: new RegExp(`^${category}$`, 'i') } },
      { $set: { category, ...data } },
      { new: true, upsert: true, runValidators: true, session }
    );
  }

  async findById(id) {
    return await CategorySetting.findById(id);
  }

  async count() {
    return await CategorySetting.countDocuments();
  }
}

module.exports = new CategorySettingRepository();
