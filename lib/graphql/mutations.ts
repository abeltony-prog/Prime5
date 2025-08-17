import { gql } from '@apollo/client'

// Mutation to create a new season
export const ADD_SEASON = gql`
  mutation addSeason($teams: jsonb = "", $name: String = "", $EndDate: String = "", $startDate: String = "") {
    insert_seasons(objects: {teams: $teams, name: $name, EndDate: $EndDate, startDate: $startDate}) {
      affected_rows
      returning {
        id
        name
        startDate
        EndDate
        teams
      }
    }
  }
`

// Mutation to update season
export const UPDATE_SEASON = gql`
  mutation updateSeason($id: uuid!, $teams: jsonb, $name: String, $EndDate: String, $startDate: String) {
    update_seasons_by_pk(
      pk_columns: { id: $id }
      _set: { teams: $teams, name: $name, EndDate: $EndDate, startDate: $startDate }
    ) {
      id
      name
      startDate
      EndDate
      teams
    }
  }
`

// Mutation to delete season
export const DELETE_SEASON = gql`
  mutation deleteSeason($id: uuid!) {
    delete_seasons_by_pk(id: $id) {
      id
      name
    }
  }
`

// Mutation to create a new manager
export const CREATE_MANAGER = gql`
  mutation CreateManager($manager: managers_insert_input!) {
    insert_managers(objects: [$manager]) {
      affected_rows
      returning {
        id
        name
        email
        phone
        gender
        photo
        create_at
      }
    }
  }
`

// Mutation to create a new team
export const CREATE_TEAM = gql`
  mutation CreateTeam($team: Teams_insert_input!) {
    insert_Teams(objects: [$team]) {
      affected_rows
      returning {
        id
        name
        shortname
        location
        team_manager
        logo
      }
    }
  }
`

// Mutation to update team information
export const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: Int!, $updates: teams_set_input!) {
    update_teams_by_pk(
      pk_columns: { id: $id }
      _set: $updates
    ) {
      id
      name
      short_name
      group
      manager
      founded_year
      logo_url
      points
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_difference
      position
    }
  }
`

// Mutation to create a new match
export const CREATE_MATCH = gql`
  mutation CreateMatch($match: matches_insert_input!) {
    insert_matches_one(object: $match) {
      id
      date
      time
      team1_id
      team2_id
      group
      venue
      status
    }
  }
`

// Mutation to update match result
export const UPDATE_MATCH_RESULT = gql`
  mutation UpdateMatchResult($id: Int!, $team1_score: Int!, $team2_score: Int!, $status: String!) {
    update_matches_by_pk(
      pk_columns: { id: $id }
      _set: {
        team1_score: $team1_score
        team2_score: $team2_score
        status: $status
      }
    ) {
      id
      team1_score
      team2_score
      status
    }
  }
`

// Mutation to add a player to a team
export const ADD_PLAYER = gql`
  mutation AddPlayer($player: players_insert_input!) {
    insert_players_one(object: $player) {
      id
      name
      position
      team_id
      goals
      assists
      yellow_cards
      red_cards
      matches_played
      rating
      status
    }
  }
`

// Mutation to update player statistics
export const UPDATE_PLAYER_STATS = gql`
  mutation UpdatePlayerStats($id: Int!, $updates: players_set_input!) {
    update_players_by_pk(
      pk_columns: { id: $id }
      _set: $updates
    ) {
      id
      goals
      assists
      yellow_cards
      red_cards
      matches_played
      rating
      status
    }
  }
`

// Mutation to update team standings after match
export const UPDATE_TEAM_STANDINGS = gql`
  mutation UpdateTeamStandings($team_id: Int!, $updates: teams_set_input!) {
    update_teams_by_pk(
      pk_columns: { id: $team_id }
      _set: $updates
    ) {
      id
      points
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_difference
      position
    }
  }
`

// Mutation to delete a team (admin only)
export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: Int!) {
    delete_teams_by_pk(id: $id) {
      id
      name
    }
  }
`

// Mutation to delete a match (admin only)
export const DELETE_MATCH = gql`
  mutation DeleteMatch($id: Int!) {
    delete_matches_by_pk(id: $id) {
      id
    }
  }
` 