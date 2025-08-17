import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { GET_SEASONS, GET_SEASON, GET_SEASON_GROUPS, GET_SEASON_TEAM_STATISTICS } from '@/lib/graphql/queries'
import { ADD_SEASON, UPDATE_SEASON, DELETE_SEASON, CREATE_GROUPS_AND_TEAM_STATISTICS, CREATE_GROUP, CREATE_TEAM_STATISTICS } from '@/lib/graphql/mutations'

export function useSeasons() {
  const { data, loading, error, refetch } = useQuery(GET_SEASONS)

  return {
    seasons: data?.seasons || [],
    loading,
    error,
    refetch
  }
}

export function useSeason(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_SEASON, {
    variables: { id },
    skip: !id
  })

  return {
    season: data?.seasons_by_pk,
    loading,
    error,
    refetch
  }
}

export function useCreateSeason() {
  const [createSeason, { loading, error }] = useMutation(ADD_SEASON, {
    update: (cache, { data }) => {
      // Update the cache after creating a season
      const existingSeasons = cache.readQuery({ query: GET_SEASONS })
      if (existingSeasons && data?.insert_seasons_one) {
        cache.writeQuery({
          query: GET_SEASONS,
          data: {
            seasons: [data.insert_seasons_one, ...(existingSeasons as any).seasons]
          }
        })
      }
    }
  })

  return {
    createSeason,
    loading,
    error
  }
}

export function useUpdateSeason() {
  const [updateSeason, { loading, error }] = useMutation(UPDATE_SEASON, {
    update: (cache, { data }) => {
      // Update the cache after updating a season
      if (data?.update_seasons_by_pk) {
        cache.modify({
          id: cache.identify({ __typename: 'seasons', id: data.update_seasons_by_pk.id }),
          fields: {
            name: () => data.update_seasons_by_pk.name,
            startDate: () => data.update_seasons_by_pk.startDate,
            EndDate: () => data.update_seasons_by_pk.EndDate,
            teams: () => data.update_seasons_by_pk.teams
          }
        })
      }
    }
  })

  return {
    updateSeason,
    loading,
    error
  }
}

export function useDeleteSeason() {
  const [deleteSeason, { loading, error }] = useMutation(DELETE_SEASON, {
    update: (cache, { data }) => {
      // Remove the season from cache after deletion
      if (data?.delete_seasons_by_pk) {
        cache.modify({
          fields: {
            seasons: (existingSeasons = [], { readField }) => {
              return existingSeasons.filter(
                (season: any) => readField('id', season) !== data.delete_seasons_by_pk.id
              )
            }
          }
        })
      }
    }
  })

  return {
    deleteSeason,
    loading,
    error
  }
}

export function useCreateGroupsAndTeamStatistics() {
  const [createGroupsAndTeamStatistics, { loading, error }] = useMutation(CREATE_GROUPS_AND_TEAM_STATISTICS)

  return {
    createGroupsAndTeamStatistics,
    loading,
    error
  }
}

export function useCreateGroup() {
  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP)

  return {
    createGroup,
    loading,
    error
  }
}

export function useCreateTeamStatistics() {
  const [createTeamStatistics, { loading, error }] = useMutation(CREATE_TEAM_STATISTICS)

  return {
    createTeamStatistics,
    loading,
    error
  }
}

export function useSeasonGroups(seasonId: string) {
  const { data, loading, error, refetch } = useQuery(GET_SEASON_GROUPS, {
    variables: { season_id: seasonId },
    skip: !seasonId
  })

  return {
    groups: data?.groups || [],
    loading,
    error,
    refetch
  }
}

export function useSeasonTeamStatistics(seasonId: string) {
  const { data, loading, error, refetch } = useQuery(GET_SEASON_TEAM_STATISTICS, {
    variables: { season_id: seasonId },
    skip: !seasonId
  })

  return {
    teamStatistics: data?.team_statistics || [],
    loading,
    error,
    refetch
  }
} 