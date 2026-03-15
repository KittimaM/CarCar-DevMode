/**
 * Validates password: uppercase, lowercase, number, special char, min 8 chars.
 * @param {string} password
 * @returns {{ valid: boolean; message: string }}
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "รหัสผ่านต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "รหัสผ่านต้องมีตัวเลข",
    };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    return {
      valid: false,
      message: "รหัสผ่านต้องมีอักขระพิเศษ",
    };
  }
  return { valid: true, message: "" };
};
