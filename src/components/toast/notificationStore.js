// Module-level bridge between the Apollo error link (outside React) and the toast notification system.
// Follows the same pattern as src/auth/authStore.js for the unauthorizedHandler.
let _errorNotificationHandler = null;

export function setOnErrorNotification(handler) {
  _errorNotificationHandler = typeof handler === 'function' ? handler : null;
}

export function triggerErrorNotification(message) {
  if (_errorNotificationHandler) {
    try { _errorNotificationHandler(message); } catch { /* noop */ }
  }
}
