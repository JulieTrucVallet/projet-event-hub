export type PasswordValidationResult = {
  isValid: boolean;
  errors: string[];
};

const SPECIAL_CHARS_REGEX = /[+=%#\/ *!?.,]/;

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("12 caractères minimum");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("au moins 1 minuscule");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("au moins 1 majuscule");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("au moins 1 chiffre");
  }
  if (!SPECIAL_CHARS_REGEX.test(password)) {
    errors.push("au moins 1 caractère spécial (+=%#/ *!? ,.)");
  }

  return { isValid: errors.length === 0, errors };
}