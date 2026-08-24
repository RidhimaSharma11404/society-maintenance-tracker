const { calculateExponentialDecay, calculateDueDate } = require('../../src/utils/mathUtils');

describe('Mathematical Risk Scoring Engine - Exponential Decay Verification', () => {
  const lambda = 0.0231; // Half-life ~ 30 days: ln(2)/30 = 0.0231049

  test('Should return the full base severity weight at Day 0 (t = 0)', () => {
    const weight = 4.0;
    const score = calculateExponentialDecay(weight, 0, lambda);
    expect(score).toBe(4.0);
  });

  test('Should decay to approximately half (~50%) of severity weight after 30 days', () => {
    const weight = 4.0;
    const score = calculateExponentialDecay(weight, 30, lambda);
    // 4.0 * exp(-0.0231 * 30) = 4.0 * exp(-0.693) ~ 4.0 * 0.50007 = 2.0003
    expect(score).toBeGreaterThanOrEqual(1.95);
    expect(score).toBeLessThanOrEqual(2.05);
  });

  test('Should decay to approximately 25% of severity weight after 60 days', () => {
    const weight = 4.0;
    const score = calculateExponentialDecay(weight, 60, lambda);
    // 4.0 * exp(-0.0231 * 60) ~ 4.0 * 0.2501 = 1.0004
    expect(score).toBeGreaterThanOrEqual(0.95);
    expect(score).toBeLessThanOrEqual(1.05);
  });

  test('Should decay to approximately 12.5% of severity weight after 90 days', () => {
    const weight = 4.0;
    const score = calculateExponentialDecay(weight, 90, lambda);
    // 4.0 * exp(-0.0231 * 90) ~ 4.0 * 0.1251 = 0.5004
    expect(score).toBeGreaterThanOrEqual(0.45);
    expect(score).toBeLessThanOrEqual(0.55);
  });

  test('Should handle edge cases gracefully (negative daysAgo treated as 0)', () => {
    const weight = 5.0;
    const score = calculateExponentialDecay(weight, -5, lambda);
    expect(score).toBe(5.0);
  });
});

describe('SLA Due Date Calculations', () => {
  test('Should compute accurate due timestamp based on SLA hours', () => {
    const baseDate = new Date('2026-08-01T10:00:00.000Z');
    const slaHours = 24;
    const dueDate = calculateDueDate(baseDate, slaHours);

    const expectedDate = new Date('2026-08-02T10:00:00.000Z');
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });

  test('Should accurately add fractional or short emergency SLA hours', () => {
    const baseDate = new Date('2026-08-01T08:00:00.000Z');
    const slaHours = 4; // emergency security SLA
    const dueDate = calculateDueDate(baseDate, slaHours);

    const expectedDate = new Date('2026-08-01T12:00:00.000Z');
    expect(dueDate.getTime()).toBe(expectedDate.getTime());
  });
});
