const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to restrict access based on allowed user roles.
 * @param {Array<string>} allowedRoles - e.g. ['admin', 'staff']
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Unauthenticated user.', 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}].`,
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
