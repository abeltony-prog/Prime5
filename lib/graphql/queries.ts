import { gql } from '@apollo/client'

// Query to get all seasons
export const GET_SEASONS = gql`
  query GetSeasons {
    seasons(order_by: { id: desc }) {
      id
      name
      startDate
      EndDate
      teams
    }
  }
`

// Query to get season by ID
export const GET_SEASON = gql`
  query GetSeason($id: uuid!) {
    seasons_by_pk(id: $id) {
      id
      name
      startDate
      EndDate
      teams
    }
  }
`

// Query to get groups for a season
export const GET_SEASON_GROUPS = gql`
  query GetSeasonGroups($season_id: uuid!) {
    groups(where: {season_id: {_eq: $season_id}}) {
      id
      name
      season_id
    }
  }
`

// Query to get team statistics for a season
export const GET_SEASON_TEAM_STATISTICS = gql`
  query GetSeasonTeamStatistics($season_id: uuid!) {
    team_statistics(where: {season_id: {_eq: $season_id}}) {
      id
      team_id
      group_id
      season_id
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_diff
      points
    }
  }
`

export const GET_MATCH_SCHEDULES = gql`
  query getMatchSchedules {
    matches(order_by: {dateAndtime: desc}) {
      created_at
      dateAndtime
      id
      location
      season_id
      status
      team1
      team1Goals
      team2
      team2Goals
      Team1 {
        id
        location
        logo
        name
        shortname
        team_manager
      }
      Team2 {
        id
        location
        logo
        name
        shortname
        team_manager
      }
    }
  }
`

// Query to get all teams with complete details
export const GET_TEAMS = gql`
  query getAllTeamsDetails {
    Teams {
      id
      location
      logo
      name
      shortname
      team_manager
      created_at
      matche1 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      matche2 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      manager {
        create_at
        email
        gender
        id
        name
        password
        phone
        photo
      }
    }
  }
`

// Query to get team by ID with complete details
export const GET_TEAM = gql`
  query GetTeam($id: Int!) {
    Teams_by_pk(id: $id) {
      id
      location
      logo
      name
      shortname
      team_manager
      matche1 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      matche2 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      manager {
        create_at
        email
        gender
        id
        name
        password
        phone
        photo
      }
    }
  }
`

// Query to get teams by IDs with complete details
export const GET_TEAMS_BY_IDS = gql`
  query GetTeamsByIds($ids: [uuid!]!) {
    Teams(where: {id: {_in: $ids}}) {
      id
      location
      logo
      name
      shortname
      team_manager
      matche1 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      matche2 {
        created_at
        dateAndtime
        id
        location
        season_id
        team1
        team2
      }
      manager {
        create_at
        email
        gender
        id
        name
        password
        phone
        photo
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

// Query to get all managers with their teams
export const GET_ALL_MANAGERS_DETAILS = gql`
  query getAllManagersDetails {
    managers {
      create_at
      email
      gender
      id
      name
      password
      phone
      photo
      Teams {
        approved
        id
        location
        logo
        name
        shortname
        team_manager
      }
    }
  }
`

// Query to get manager by email for authentication
export const GET_MANAGER_BY_EMAIL = gql`
  query GetManagerByEmail($email: String!) {
    managers(where: {email: {_eq: $email}}) {
      id
      name
      email
      password
      phone
      gender
      photo
      create_at
      Teams {
        approved
        id
        location
        logo
        name
        shortname
        team_manager
      }
    }
  }
`

// Query to get all players for a specific team
export const GET_ALL_PLAYERS_WHERE_TEAM_ID = gql`
  query getAllPlayersWhereTeamId($teamId: uuid = "") {
    players(where: {team_id: {_eq: $teamId}}) {
      create_at
      dob
      email
      gender
      id
      name
      phone
      team_id
    }
  }
`

// Query to get player statistics
export const GET_PLAYER_STATISTICS = gql`
  query getPlayerStatistics {
    player_statistics {
      assists
      goals
      id
      match_id
      minutes_played
      player_id
      red_cards
      season_id
      updated_at
      yellow_cards
    }
  }
`

// Query to get team with complete statistics and player data
export const GET_TEAM_COMPLETE_DATA = gql`
  query getTeamCompleteData($teamId: uuid!) {
    Teams(where: {id: {_eq: $teamId}}) {
      id
      name
      shortname
      location
      logo
      approved
      team_manager
      team_statistics {
        id
        team_id
        group_id
        season_id
        played
        wins
        draws
        losses
        goals_for
        goals_against
        goal_diff
        points
        updated_at
        groups {
          id
          name
          season_id
          created_at
        }
      }
      players {
        id
        name
        email
        phone
        gender
        dob
        create_at
        team_id
        player_statistics {
          id
          player_id
          match_id
          season_id
          goals
          assists
          minutes_played
          yellow_cards
          red_cards
          updated_at
        }
      }
    }
  }
`

// Query to get current season with groups
export const GET_CURRENT_SEASON_WITH_GROUPS = gql`
  query getCurrentSeasonWithGroups {
    seasons(order_by: {startDate: desc}, limit: 1) {
      id
      name
      startDate
      EndDate
      teams
      created_at
      groups {
        id
        name
        season_id
        created_at
      }
    }
  }
`

// Query to get matches for a specific team
export const GET_TEAM_MATCHES = gql`
  query getTeamMatches($teamId: uuid!) {
    matches(where: {_or: [{team1: {_eq: $teamId}}, {team2: {_eq: $teamId}}]}, order_by: {dateAndtime: desc}) {
      created_at
      dateAndtime
      id
      location
      season_id
      team1
      team1Goals
      team2
      team2Goals
      Team1 {
        id
        location
        logo
        name
        shortname
        team_manager
      }
      Team2 {
        id
        location
        logo
        name
        shortname
        team_manager
      }
    }
  }
`

// Query to get player statistics for a specific team
export const GET_TEAM_PLAYER_STATISTICS = gql`
  query getTeamPlayerStatistics {
    player_statistics {
      assists
      goals
      id
      match_id
      minutes_played
      player_id
      red_cards
      season_id
      updated_at
      yellow_cards
    }
  }
`

// Query to get team statistics
export const GET_TEAM_STATISTICS = gql`
  query getTeamStatistics {
    team_statistics {
      id
      team_id
      group_id
      season_id
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_diff
      points
    }
  }
`

// Query to get team statistics for a specific team
export const GET_TEAM_STATISTICS_BY_TEAM_ID = gql`
  query getTeamStatisticsByTeamId($teamId: uuid!) {
    team_statistics(where: {team_id: {_eq: $teamId}}) {
      id
      team_id
      group_id
      season_id
      played
      wins
      draws
      losses
      goals_for
      goals_against
      goal_diff
      points
    }
  }
`

// Query to get all jobs
export const GET_ALL_JOBS = gql`
  query GetAllJobs {
    jobs {
      Benefits
      Requirements
      amount
      created_at
      description
      experience
      id
      location
      title
    }
  }
`

// Query to get job by ID
export const GET_JOB_BY_ID = gql`
  query GetJobById($id: uuid!) {
    jobs_by_pk(id: $id) {
      Benefits
      Requirements
      amount
      created_at
      description
      experience
      id
      location
      title
    }
  }
`

// Query to get all applications
export const GET_ALL_APPLICATIONS = gql`
  query GetAllApplications {
    applications {
      cover_letter
      created_at
      email
      file
      id
      job_id
      name
      phone
      years
      job {
        title
        location
      }
    }
  }
`

// Query to get applications by job ID
export const GET_APPLICATIONS_BY_JOB_ID = gql`
  query GetApplicationsByJobId($job_id: uuid!) {
    applications(where: {job_id: {_eq: $job_id}}) {
      cover_letter
      created_at
      email
      file
      id
      job_id
      name
      phone
      years
      job {
        title
        location
      }
    }
  }
`

// Query to get application by ID
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: uuid!) {
    applications_by_pk(id: $id) {
      cover_letter
      created_at
      email
      file
      id
      job_id
      name
      phone
      years
      job {
        title
        location
        description
      }
    }
  }
`

 