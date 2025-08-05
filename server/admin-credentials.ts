// Security configuration for admin credentials - JavaScript version

// Predefined secure admin accounts
const PREDEFINED_ADMINS = [
  {
    username: process.env.ADMIN_USERNAME || "templeadmin",
    password: process.env.ADMIN_PASSWORD || "Temple@2025#Secure",
    role: 'superadmin',
    createdAt: new Date(),
  },
  {
    username: process.env.ADMIN_USERNAME_2 || "donations_admin",
    password: process.env.ADMIN_PASSWORD_2 || "Donate#2025$Safe",
    role: 'admin',
    createdAt: new Date(),
  },
  {
    username: process.env.ADMIN_USERNAME_3 || "temple_manager",
    password: process.env.ADMIN_PASSWORD_3 || "Manage!Temple#2025",
    role: 'admin',
    createdAt: new Date(),
  }
];

// Password strength validation
export function validatePasswordStrength(password: string) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  // Check for common weak patterns
  const commonPatterns = [
    /^password/i,
    /^123456/,
    /^admin/i,
    /^temple/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push("Password contains common patterns and is not secure");
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate secure random password
export function generateSecurePassword(length: number = 16) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Get admin user by username
export function getAdminUser(username: string) {
  return PREDEFINED_ADMINS.find(admin => admin.username === username);
}

// Validate admin credentials
export function validateAdminCredentials(username: string, password: string) {
  const admin = getAdminUser(username);
  if (!admin) return null;
  
  // In production, you should hash passwords
  if (admin.password === password) {
    // Update last login - create new object to avoid mutating original
    return { ...admin, lastLogin: new Date() };

  }
  
  return null;
}

// Get all admin users (without passwords)
export function getAllAdmins() {
  return PREDEFINED_ADMINS.map(({ password, ...admin }) => admin);
}

// Change admin credentials (in-memory update)
export function changeAdminCredentials(currentUsername: string, newUsername: string, newPassword: string): boolean {
  const adminIndex = PREDEFINED_ADMINS.findIndex(admin => admin.username === currentUsername);
  
  if (adminIndex === -1) {
    return false;
  }
  
  // Validate new password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }
  
  // Update credentials in memory
  PREDEFINED_ADMINS[adminIndex].username = newUsername;
  PREDEFINED_ADMINS[adminIndex].password = newPassword;
  
  console.log(`Admin credentials updated: ${currentUsername} -> ${newUsername}`);
  return true;
}

// Security recommendations
export const SECURITY_RECOMMENDATIONS = {
  en: {
    title: "Security Recommendations",
    points: [
      "Use environment variables to set secure admin credentials",
      "Change default passwords immediately in production",
      "Use strong passwords with mixed case, numbers, and symbols",
      "Enable HTTPS in production environments",
      "Regularly update admin passwords",
      "Monitor admin login activities",
      "Use different credentials for different environments"
    ]
  },
  ta: {
    title: "பாதுகாப்பு பரிந்துரைகள்",
    points: [
      "பாதுகாப்பான நிர்வாக அறிமுக தகவல்களை அமைக்க சூழல் மாறிகளைப் பயன்படுத்தவும்",
      "உற்பத்தியில் இயல்புநிலை கடவுச்சொற்களை உடனே மாற்றவும்",
      "கலப்பு வழக்கு, எண்கள் மற்றும் குறியீடுகளுடன் வலுவான கடவுச்சொற்களைப் பயன்படுத்தவும்",
      "உற்பத்தி சூழல்களில் HTTPS ஐ இயக்கவும்",
      "நிர்வாக கடவுச்சொற்களை தொடர்ந்து புதுப்பிக்கவும்",
      "நிர்வாக உள்நுழைவு செயல்பாடுகளைக் கண்காணிக்கவும்",
      "வெவ்வேறு சூழல்களுக்கு வெவ்வேறு அறிமுக தகவல்களைப் பயன்படுத்தவும்"
    ]
  }
};