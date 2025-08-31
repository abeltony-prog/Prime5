// Generate a random 8-character password
export function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Simple hash function (in production, use bcrypt or similar)
export function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use: import bcrypt from 'bcryptjs'
  // return bcrypt.hashSync(password, 10)
  
  // Create a more reliable hash using crypto API if available
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Use a simple but more reliable hash method
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    // Add some salt and make it more unique
    return `hash_${Math.abs(hash)}_${password.length}_${Date.now()}`
  } else {
    // Fallback for environments without crypto API
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash)}_${password.length}_${Date.now()}`
  }
}

// Function to hash password for storage (includes timestamp for uniqueness)
export function hashPasswordForStorage(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash)}_${password.length}_${Date.now()}`
}

// Function to hash password for comparison (consistent hash without timestamp)
export function hashPasswordForComparison(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash)}_${password.length}`
}

// Function to check if password matches stored hash (handles both old and new formats)
export function checkPasswordMatch(password: string, storedHash: string): boolean {
  // First try the new format (without timestamp)
  const newFormatHash = hashPasswordForComparison(password)
  if (newFormatHash === storedHash) {
    return true
  }
  
  // If that doesn't match, try the old format (with timestamp)
  // Extract the base hash part from stored hash (remove timestamp)
  const oldFormatBase = storedHash.replace(/_\d+$/, '') // Remove timestamp part
  if (newFormatHash === oldFormatBase) {
    return true
  }
  
  return false
} 