import { gql } from '@apollo/client'

// Query to get all teams
export const GET_TEAMS = gql`
  query GetTeams {
    teams {
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

// Query to get team by ID
export const GET_TEAM = gql`
  query GetTeam($id: Int!) {
    teams_by_pk(id: $id) {
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
      players {
        id
        name
        position
        goals
        assists
        yellow_cards
        red_cards
        matches_played
        rating
        status
      }
    }
  }
`

// Query to get all matches
export const GET_MATCHES = gql`
  query GetMatches {
    matches(order_by: { date: desc }) {
      id
      date
      time
      team1_id
      team2_id
      team1_score
      team2_score
      group
      venue
      status
      team1 {
        name
        short_name
        logo_url
      }
      team2 {
        name
        short_name
        logo_url
      }
    }
  }
`

// Query to get upcoming matches
export const GET_UPCOMING_MATCHES = gql`
  query GetUpcomingMatches {
    matches(
      where: { status: { _eq: "scheduled" } }
      order_by: { date: asc }
      limit: 10
    ) {
      id
      date
      time
      team1_id
      team2_id
      group
      venue
      team1 {
        name
        short_name
        logo_url
      }
      team2 {
        name
        short_name
        logo_url
      }
    }
  }
`

// Query to get past results
export const GET_PAST_RESULTS = gql`
  query GetPastResults {
    matches(
      where: { status: { _eq: "completed" } }
      order_by: { date: desc }
      limit: 20
    ) {
      id
      date
      team1_score
      team2_score
      group
      team1 {
        name
        short_name
        logo_url
      }
      team2 {
        name
        short_name
        logo_url
      }
    }
  }
`

// Query to get standings by group
export const GET_STANDINGS = gql`
  query GetStandings($group: String!) {
    teams(
      where: { group: { _eq: $group } }
      order_by: [
        { points: desc }
        { goal_difference: desc }
        { goals_for: desc }
      ]
    ) {
      id
      name
      short_name
      group
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_difference
      points
      position
    }
  }
`

// Query to get top scorers
export const GET_TOP_SCORERS = gql`
  query GetTopScorers {
    players(
      order_by: { goals: desc }
      limit: 10
    ) {
      id
      name
      team {
        name
        short_name
      }
      goals
      assists
      matches_played
      rating
    }
  }
`

// Query to get league statistics
export const GET_LEAGUE_STATS = gql`
  query GetLeagueStats {
    league_stats {
      total_teams
      total_matches
      total_goals
      average_goals_per_match
      clean_sheets
    }
  }
` 