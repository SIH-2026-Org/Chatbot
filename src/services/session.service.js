/**
 * In-Memory User Session Service for SAARTHI-SETU
 * Manages user state, detected region, and selected conversation language.
 */

const sessions = new Map();

/**
 * Gets or initializes a user session
 * @param {string} phone - User phone number
 * @returns {object|null} Session data
 */
function getSession(phone) {
  return sessions.get(phone) || null;
}

/**
 * Sets or updates session data for a phone number
 * @param {string} phone - User phone number
 * @param {object} data - Session fields to merge
 * @returns {object} Updated session
 */
function updateSession(phone, data) {
  const current = sessions.get(phone) || { phone, createdAt: new Date() };
  const updated = {
    ...current,
    ...data,
    updatedAt: new Date(),
  };
  sessions.set(phone, updated);
  return updated;
}

/**
 * Clears a session (useful for resetting or testing)
 * @param {string} phone - User phone number
 */
function resetSession(phone) {
  sessions.delete(phone);
}

export {
  getSession,
  updateSession,
  resetSession,
  sessions,
};

export default {
  getSession,
  updateSession,
  resetSession,
  sessions,
};
