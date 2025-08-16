import { useQuery } from '@apollo/client'
import { GET_STANDINGS, GET_TOP_SCORERS, GET_LEAGUE_STATS } from '@/lib/graphql/queries'

export function useStandings(group: string) {
  const { data, loading, error, refetch } = useQuery(GET_STANDINGS, {
    variables: { group },
    skip: !group
  })

  return {
    standings: data?.teams || [],
    loading,
    error,
    refetch
  }
}

export function useTopScorers() {
  const { data, loading, error, refetch } = useQuery(GET_TOP_SCORERS)

  return {
    topScorers: data?.players || [],
    loading,
    error,
    refetch
  }
}

export function useLeagueStats() {
  const { data, loading, error, refetch } = useQuery(GET_LEAGUE_STATS)

  return {
    leagueStats: data?.league_stats?.[0] || null,
    loading,
    error,
    refetch
  }
} 