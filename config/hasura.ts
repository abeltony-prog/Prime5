import { env } from '@/lib/env'

export const hasuraConfig = {
  graphqlUrl: env.HASURA_GRAPHQL_URL,
  adminSecret: env.HASURA_ADMIN_SECRET,
  wsUrl: env.HASURA_WS_URL,
}

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': hasuraConfig.adminSecret,
}

export const authHeaders = (token?: string) => ({
  ...defaultHeaders,
  ...(token && { Authorization: `Bearer ${token}` }),
}) 