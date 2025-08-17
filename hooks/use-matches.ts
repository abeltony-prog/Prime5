import { useQuery, useMutation } from '@apollo/client'
import { GET_MATCHES, GET_UPCOMING_MATCHES, GET_PAST_RESULTS, GET_MATCH_SCHEDULES } from '@/lib/graphql/queries'
import { CREATE_MATCH, UPDATE_MATCH_RESULT, DELETE_MATCH } from '@/lib/graphql/mutations'

export function useMatches() {
  const { data, loading, error, refetch } = useQuery(GET_MATCHES)

  return {
    matches: data?.matches || [],
    loading,
    error,
    refetch
  }
}

export function useMatchSchedules() {
  const { data, loading, error, refetch } = useQuery(GET_MATCH_SCHEDULES)

  return {
    matches: data?.matches || [],
    loading,
    error,
    refetch
  }
}

export function useUpcomingMatches() {
  const { data, loading, error, refetch } = useQuery(GET_UPCOMING_MATCHES)

  return {
    upcomingMatches: data?.matches || [],
    loading,
    error,
    refetch
  }
}

export function usePastResults() {
  const { data, loading, error, refetch } = useQuery(GET_PAST_RESULTS)

  return {
    pastResults: data?.matches || [],
    loading,
    error,
    refetch
  }
}

export function useCreateMatch() {
  const [createMatch, { loading, error }] = useMutation(CREATE_MATCH, {
    update: (cache, { data }) => {
      // Update the cache after creating a match
      const existingMatches = cache.readQuery({ query: GET_MATCHES })
      if (existingMatches && data?.insert_matches_one) {
        cache.writeQuery({
          query: GET_MATCHES,
          data: {
            matches: [data.insert_matches_one, ...(existingMatches as any).matches]
          }
        })
      }
    }
  })

  return {
    createMatch,
    loading,
    error
  }
}

export function useUpdateMatchResult() {
  const [updateMatchResult, { loading, error }] = useMutation(UPDATE_MATCH_RESULT, {
    update: (cache, { data }) => {
      // Update the cache after updating match result
      if (data?.update_matches_by_pk) {
        cache.modify({
          id: cache.identify({ __typename: 'matches', id: data.update_matches_by_pk.id }),
          fields: {
            team1_score: () => data.update_matches_by_pk.team1_score,
            team2_score: () => data.update_matches_by_pk.team2_score,
            status: () => data.update_matches_by_pk.status
          }
        })
      }
    }
  })

  return {
    updateMatchResult,
    loading,
    error
  }
}

export function useDeleteMatch() {
  const [deleteMatch, { loading, error }] = useMutation(DELETE_MATCH, {
    update: (cache, { data }) => {
      // Remove the match from cache after deletion
      if (data?.delete_matches_by_pk) {
        cache.modify({
          fields: {
            matches: (existingMatches = [], { readField }) => {
              return existingMatches.filter(
                (match: any) => readField('id', match) !== data.delete_matches_by_pk.id
              )
            }
          }
        })
      }
    }
  })

  return {
    deleteMatch,
    loading,
    error
  }
} 