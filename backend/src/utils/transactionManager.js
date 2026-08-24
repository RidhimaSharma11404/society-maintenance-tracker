const mongoose = require('mongoose');

let supportsTransactions = null;

/**
 * Actively probes whether the connected MongoDB instance supports replica-set transactions.
 */
async function probeTransactionSupport() {
  if (mongoose.connection.readyState !== 1) {
    return false;
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    await session.abortTransaction();
    supportsTransactions = true;
    console.log('[Transaction Engine] Multi-document ACID transactions confirmed & enabled.');
  } catch (err) {
    supportsTransactions = false;
    console.warn('[Transaction Engine] Standalone mode detected. Executing with fallback consistency.');
  } finally {
    if (session) {
      await session.endSession();
    }
  }
  return supportsTransactions;
}

/**
 * Executes an operation inside a Mongoose transaction if supported,
 * otherwise runs as standard sequential operations.
 * 
 * @param {Function} operation - Async function receiving (session) as argument.
 * @returns {Promise<*>} Result of the operation.
 */
async function runInTransaction(operation) {
  if (supportsTransactions === null) {
    await probeTransactionSupport();
  }

  if (!supportsTransactions) {
    return await operation(null);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Reset transaction probe cache (used in testing).
 */
function resetProbeCache() {
  supportsTransactions = null;
}

module.exports = {
  probeTransactionSupport,
  runInTransaction,
  resetProbeCache
};
