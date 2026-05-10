/**
 * Validators for authentication-related requests.
 * Each function receives the request body and returns { isValid, errors }.
 */

const validateRegister = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else {
    if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one number');
    }
  }

  if (!data.passwordConfirm || data.password !== data.passwordConfirm) {
    errors.push('Passwords do not match');
  }

  return { isValid: errors.length === 0, errors };
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return { isValid: errors.length === 0, errors };
};

const validateUpdatePassword = (data) => {
  const errors = [];

  if (!data.currentPassword) {
    errors.push('Current password is required');
  }

  if (!data.newPassword || typeof data.newPassword !== 'string') {
    errors.push('New password is required');
  } else if (data.newPassword.length < 8) {
    errors.push('New password must be at least 8 characters');
  }

  if (!data.newPasswordConfirm || data.newPassword !== data.newPasswordConfirm) {
    errors.push('New passwords do not match');
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = { validateRegister, validateLogin, validateUpdatePassword };
