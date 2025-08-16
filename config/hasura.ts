export const hasuraConfig = {
  graphqlUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
  adminSecret: process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || '',
  wsUrl: process.env.NEXT_PUBLIC_HASURA_WS_URL || 'ws://localhost:8080/v1/graphql',
}

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': hasuraConfig.adminSecret,
}

export const authHeaders = (token?: string) => ({
  ...defaultHeaders,
  ...(token && { Authorization: `Bearer ${token}` }),
}) 