export const env = {
  // Hasura Configuration
  HASURA_GRAPHQL_URL: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  HASURA_ADMIN_SECRET: process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
  HASURA_WS_URL: process.env.NEXT_PUBLIC_HASURA_WS_URL!,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV!,
  
  // API URLs
  API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL,
}

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
    'NEXT_PUBLIC_HASURA_ADMIN_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
} 