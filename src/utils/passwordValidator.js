/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*)
 */

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    requirements: {
      minLength: { met: password.length >= minLength, label: `Minimum ${minLength} characters` },
      uppercase: { met: hasUpperCase, label: "At least one uppercase letter (A-Z)" },
      lowercase: { met: hasLowerCase, label: "At least one lowercase letter (a-z)" },
      number: { met: hasNumber, label: "At least one number (0-9)" },
      specialChar: { met: hasSpecialChar, label: "At least one special character (!@#$%^&*)" }
    }
  };
};
