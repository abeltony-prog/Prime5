import { useMutation } from '@apollo/client'
import { CREATE_MANAGER } from '@/lib/graphql/mutations'

export function useCreateManager() {
  const [createManager, { loading, error }] = useMutation(CREATE_MANAGER)

  return {
    createManager,
    loading,
    error
  }
} 