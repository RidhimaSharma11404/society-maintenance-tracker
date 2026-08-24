const assistantService = require('../services/assistantService');
const ApiResponse = require('../utils/apiResponse');

class AssistantController {
  async chat(req, res, next) {
    try {
      const { prompt } = req.body;
      const response = await assistantService.processQuery(prompt, req.user);
      return ApiResponse.success(res, response, 'AI Copilot response generated.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssistantController();
