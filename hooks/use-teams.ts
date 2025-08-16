import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { GET_TEAMS, GET_TEAM } from '@/lib/graphql/queries'
import { CREATE_TEAM, UPDATE_TEAM, DELETE_TEAM } from '@/lib/graphql/mutations'

export function useTeams() {
  const { data, loading, error, refetch } = useQuery(GET_TEAMS)

  return {
    teams: data?.teams || [],
    loading,
    error,
    refetch
  }
}

export function useTeam(id: number) {
  const { data, loading, error, refetch } = useQuery(GET_TEAM, {
    variables: { id },
    skip: !id
  })

  return {
    team: data?.teams_by_pk,
    loading,
    error,
    refetch
  }
}

export function useCreateTeam() {
  const [createTeam, { loading, error }] = useMutation(CREATE_TEAM, {
    update: (cache, { data }) => {
      // Update the cache after creating a team
      const existingTeams = cache.readQuery({ query: GET_TEAMS })
      if (existingTeams && data?.insert_teams_one) {
        cache.writeQuery({
          query: GET_TEAMS,
          data: {
            teams: [...(existingTeams as any).teams, data.insert_teams_one]
          }
        })
      }
    }
  })

  return {
    createTeam,
    loading,
    error
  }
}

export function useUpdateTeam() {
  const [updateTeam, { loading, error }] = useMutation(UPDATE_TEAM, {
    update: (cache, { data }) => {
      // Update the cache after updating a team
      if (data?.update_teams_by_pk) {
        cache.modify({
          id: cache.identify({ __typename: 'teams', id: data.update_teams_by_pk.id }),
          fields: {
            name: () => data.update_teams_by_pk.name,
            short_name: () => data.update_teams_by_pk.short_name,
            manager: () => data.update_teams_by_pk.manager,
            points: () => data.update_teams_by_pk.points,
            played: () => data.update_teams_by_pk.played,
            wins: () => data.update_teams_by_pk.wins,
            draws: () => data.update_teams_by_pk.draws,
            losses: () => data.update_teams_by_pk.losses,
            goals_for: () => data.update_teams_by_pk.goals_for,
            goals_against: () => data.update_teams_by_pk.goals_against,
            goal_difference: () => data.update_teams_by_pk.goal_difference,
            position: () => data.update_teams_by_pk.position
          }
        })
      }
    }
  })

  return {
    updateTeam,
    loading,
    error
  }
}

export function useDeleteTeam() {
  const [deleteTeam, { loading, error }] = useMutation(DELETE_TEAM, {
    update: (cache, { data }) => {
      // Remove the team from cache after deletion
      if (data?.delete_teams_by_pk) {
        cache.modify({
          fields: {
            teams: (existingTeams = [], { readField }) => {
              return existingTeams.filter(
                (team: any) => readField('id', team) !== data.delete_teams_by_pk.id
              )
            }
          }
        })
      }
    }
  })

  return {
    deleteTeam,
    loading,
    error
  }
} 