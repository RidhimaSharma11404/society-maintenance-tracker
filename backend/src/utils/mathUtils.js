const config = require('../config/env');

/**
 * Calculates exponential decay risk score.
 * Formula: S(t) = w * e^(-lambda * t)
 * 
 * @param {number} severityWeight - Base severity weight (1 to 5)
 * @param {number} daysAgo - Age of complaint in days (>= 0)
 * @param {number} lambda - Decay constant (default 0.0231 for ~30-day half-life)
 * @returns {number} Decayed risk score rounded to 4 decimal places
 */
function calculateExponentialDecay(
  severityWeight,
  daysAgo,
  lambda = config.riskScoring.decayConstant
) {
  if (typeof severityWeight !== 'number' || severityWeight < 0) {
    throw new Error('Invalid severity weight');
  }
  const days = Math.max(0, Number(daysAgo) || 0);
  const score = severityWeight * Math.exp(-lambda * days);
  return Number(score.toFixed(4));
}

/**
 * Calculates due date based on created timestamp and SLA hours.
 * 
 * @param {Date|string|number} startDate 
 * @param {number} slaHours 
 * @returns {Date}
 */
function calculateDueDate(startDate = new Date(), slaHours = 24) {
  const start = new Date(startDate);
  return new Date(start.getTime() + (Number(slaHours) || 24) * 60 * 60 * 1000);
}

module.exports = {
  calculateExponentialDecay,
  calculateDueDate
};
