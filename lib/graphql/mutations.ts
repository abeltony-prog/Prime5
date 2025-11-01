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

// Mutation to delete season and all related data
export const DELETE_SEASON = gql`
  mutation deleteSeason($id: uuid!) {
    # Delete player statistics first
    delete_player_statistics(where: {season_id: {_eq: $id}}) {
      affected_rows
    }
    # Delete team statistics (these reference groups, so delete before groups)
    delete_team_statistics(where: {season_id: {_eq: $id}}) {
      affected_rows
    }
    # Delete groups (after team statistics are deleted)
    delete_groups(where: {season_id: {_eq: $id}}) {
      affected_rows
    }
    # Delete match schedules
    delete_matches(where: {season_id: {_eq: $id}}) {
      affected_rows
    }
    # Finally delete the season
    delete_seasons_by_pk(id: $id) {
      id
      name
    }
  }
`

// Mutation to create groups and team statistics
export const CREATE_GROUPS_AND_TEAM_STATISTICS = gql`
  mutation createGroupsAndTeamsStatistics($name: String = "", $season_id: uuid = "", $draws: String = "", $goal_diff: String = "", $goals_against: String = "", $goals_for: String = "", $group_id: uuid = "", $losses: String = "", $played: String = "", $points: String = "", $season_id1: uuid = "", $team_id: uuid = "", $wins: String = "") {
    insert_groups(objects: {name: $name, season_id: $season_id}) {
      affected_rows
      returning {
        id
        name
        season_id
      }
    }
    insert_team_statistics(objects: {draws: $draws, goal_diff: $goal_diff, goals_against: $goals_against, goals_for: $goals_for, group_id: $group_id, losses: $losses, played: $played, points: $points, season_id: $season_id1, team_id: $team_id, wins: $wins}) {
      affected_rows
      returning {
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
  }
`

// Mutation to create just a group
export const CREATE_GROUP = gql`
  mutation createGroup($name: String!, $season_id: uuid!) {
    insert_groups(objects: {name: $name, season_id: $season_id}) {
      affected_rows
      returning {
        id
        name
        season_id
      }
    }
  }
`

// Mutation to create team statistics
export const CREATE_TEAM_STATISTICS = gql`
  mutation createTeamStatistics($team_id: uuid!, $group_id: uuid!, $season_id: uuid!, $played: String = "0", $wins: String = "0", $draws: String = "0", $losses: String = "0", $goals_for: String = "0", $goals_against: String = "0", $goal_diff: String = "0", $points: String = "0") {
    insert_team_statistics(objects: {team_id: $team_id, group_id: $group_id, season_id: $season_id, played: $played, wins: $wins, draws: $draws, losses: $losses, goals_for: $goals_for, goals_against: $goals_against, goal_diff: $goal_diff, points: $points}) {
      affected_rows
      returning {
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
  }
`

// Mutation to delete team statistics for a season (for re-randomization)
export const DELETE_TEAM_STATISTICS_FOR_SEASON = gql`
  mutation deleteTeamStatisticsForSeason($season_id: uuid!) {
    delete_team_statistics(where: {season_id: {_eq: $season_id}}) {
      affected_rows
    }
  }
`

// Mutation to delete groups for a season (for re-randomization)
export const DELETE_GROUPS_FOR_SEASON = gql`
  mutation deleteGroupsForSeason($season_id: uuid!) {
    delete_groups(where: {season_id: {_eq: $season_id}}) {
      affected_rows
    }
  }
`

export const ADD_MATCH_SCHEDULER = gql`
  mutation addMatchSchedylar($team2: uuid!, $team1: uuid!, $location: String!, $dateAndtime: String!, $season_id: uuid!) {
    insert_matches(objects: {team2: $team2, team1: $team1, location: $location, dateAndtime: $dateAndtime, season_id: $season_id}) {
      affected_rows
      returning { id team1 team2 location dateAndtime season_id }
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

// Mutation to delete a team (admin only) - for uuid IDs
export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: uuid!) {
    delete_Teams_by_pk(id: $id) {
      id
      name
    }
  }
`

// Mutation to delete a team (admin only) - for Int IDs (legacy)
export const DELETE_TEAM_INT = gql`
  mutation DeleteTeamInt($id: Int!) {
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

// Mutation to update manager password
export const UPDATE_MANAGER_PASSWORD = gql`
  mutation UpdateManagerPassword($id: uuid!, $password: String!) {
    update_managers_by_pk(
      pk_columns: { id: $id }
      _set: { password: $password }
    ) {
      id
      name
      email
    }
  }
`

// Mutation to add a new player to a team
export const ADD_TEAM_PLAYER_DETAILS = gql`
  mutation addTeamPlayerDetails($team_id: uuid = "", $phone: String = "", $name: String = "", $gender: String = "", $email: String = "", $dob: String = "") {
    insert_players(objects: {team_id: $team_id, phone: $phone, name: $name, gender: $gender, email: $email, dob: $dob}) {
      affected_rows
    }
  }
`

// Mutation to update player details
export const UPDATE_PLAYER_DETAILS = gql`
  mutation updatePlayerDetails($player_id: uuid!, $name: String, $email: String, $phone: String, $gender: String, $dob: String) {
    update_players(where: {id: {_eq: $player_id}}, _set: {name: $name, email: $email, phone: $phone, gender: $gender, dob: $dob}) {
      affected_rows
      returning {
        id
        name
        email
        phone
        gender
        dob
        team_id
      }
    }
  }
`

// Mutation to delete player
export const DELETE_PLAYER = gql`
  mutation deletePlayer($player_id: uuid!) {
    delete_players(where: {id: {_eq: $player_id}}) {
      affected_rows
    }
  }
`

// Mutation to update player statistics
export const UPDATE_PLAYER_STATS = gql`
  mutation updatePlayerStats($player_id: uuid = "", $match_id: uuid = "", $yellow_cards: String = "", $red_cards: String = "", $minutes_played: String = "", $goals: String = "", $assists: String = "") {
    update_player_statistics(where: {player_id: {_eq: $player_id}, match_id: {_eq: $match_id}}, _set: {yellow_cards: $yellow_cards, red_cards: $red_cards, minutes_played: $minutes_played, goals: $goals, assists: $assists}) {
      affected_rows
    }
  }
`

// Mutation to create player statistics
export const CREATE_PLAYER_STATISTICS = gql`
  mutation addPlayerStaticts($player_id: uuid = "", $red_cards: String = "", $season_id: uuid = "", $yellow_cards: String = "", $minutes_played: String = "", $goals: String = "", $assists: String = "", $match_id: uuid = "") {
    insert_player_statistics(objects: {player_id: $player_id, red_cards: $red_cards, season_id: $season_id, yellow_cards: $yellow_cards, minutes_played: $minutes_played, goals: $goals, assists: $assists, match_id: $match_id}) {
      affected_rows
      returning {
        id
        player_id
        match_id
        season_id
        goals
        assists
        yellow_cards
        red_cards
        minutes_played
      }
    }
  }
`

// Mutation to update team statistics
export const UPDATE_TEAM_STATISTICS = gql`
  mutation updateTeamStatistics($teamid: uuid = "", $wins: String = "", $points: String = "", $played: String = "", $losses: String = "", $goals_against: String = "", $goals_for: String = "", $goal_diff: String = "", $draws: String = "") {
    update_team_statistics(where: {team_id: {_eq: $teamid}}, _set: {wins: $wins, points: $points, played: $played, losses: $losses, goals_against: $goals_against, goals_for: $goals_for, goal_diff: $goal_diff, draws: $draws}) {
      affected_rows
    }
  }
`

// Mutation to update match result with status
export const UPDATE_MATCH_RESULT = gql`
  mutation updateMatchGoals($matchId: uuid = "", $status: String = "", $team1Goals: String = "", $team2Goals: String = "") {
    update_matches(where: {id: {_eq: $matchId}}, _set: {status: $status, team1Goals: $team1Goals, team2Goals: $team2Goals}) {
      affected_rows
    }
  }
`

// Mutation to update match schedule (teams, location, dateAndtime)
export const UPDATE_MATCH_SCHEDULER = gql`
  mutation updateMatchScheduler($matchId: uuid!, $team1: uuid, $team2: uuid, $location: String, $dateAndtime: String) {
    update_matches(where: {id: {_eq: $matchId}}, _set: {team1: $team1, team2: $team2, location: $location, dateAndtime: $dateAndtime}) {
      affected_rows
      returning { 
        id 
        team1 
        team2 
        location 
        dateAndtime 
        season_id 
      }
    }
  }
`

// Mutation to update team information (for UUID-based Teams table)
export const UPDATE_TEAM_INFO = gql`
  mutation updateTeamInfo($teamId: uuid = "", $name: String = "", $shortname: String = "", $location: String = "", $logo: String = "") {
    update_Teams(where: {id: {_eq: $teamId}}, _set: {name: $name, shortname: $shortname, location: $location, logo: $logo}) {
      affected_rows
      returning {
        id
        name
        shortname
        location
        logo
        team_manager
      }
    }
  }
`

// Mutation to create a new job
export const CREATE_JOB = gql`
  mutation CreateJob($title: String!, $description: String!, $location: String!, $experience: String!, $amount: String!, $requirements: String!, $benefits: String!) {
    insert_jobs_one(object: {
      title: $title,
      description: $description,
      location: $location,
      experience: $experience,
      amount: $amount,
      Requirements: $requirements,
      Benefits: $benefits
    }) {
      id
      title
      description
      location
      experience
      amount
      Requirements
      Benefits
      created_at
    }
  }
`

// Mutation to update a job
export const UPDATE_JOB = gql`
  mutation UpdateJob($id: uuid!, $title: String, $description: String, $location: String, $experience: String, $amount: String, $requirements: String, $benefits: String) {
    update_jobs_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title,
        description: $description,
        location: $location,
        experience: $experience,
        amount: $amount,
        Requirements: $requirements,
        Benefits: $benefits
      }
    ) {
      id
      title
      description
      location
      experience
      amount
      Requirements
      Benefits
      created_at
    }
  }
`

// Mutation to delete a job
export const DELETE_JOB = gql`
  mutation DeleteJob($id: uuid!) {
    delete_jobs_by_pk(id: $id) {
      id
      title
    }
  }
`

// Mutation to create a new application
export const CREATE_APPLICATION = gql`
  mutation CreateApplication($application: applications_insert_input!) {
    insert_applications_one(object: $application) {
      id
      name
      email
      phone
      years
      cover_letter
      file
      job_id
      created_at
    }
  }
`

// Mutation to delete an application
export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: uuid!) {
    delete_applications_by_pk(id: $id) {
      id
      name
    }
  }
`

// Mutation to update team approval status
export const UPDATE_TEAM_APPROVAL = gql`
  mutation UpdateTeamApproval($id: uuid!, $approved: Boolean!) {
    update_Teams_by_pk(
      pk_columns: { id: $id }
      _set: { approved: $approved }
    ) {
      id
      name
      approved
    }
  }
`

// Mutation to delete a manager (admin only)
export const DELETE_MANAGER = gql`
  mutation DeleteManager($id: uuid!) {
    delete_managers_by_pk(id: $id) {
      id
      name
      email
    }
  }
`

// Mutation to delete a manager by email (admin only)
export const DELETE_MANAGER_BY_EMAIL = gql`
  mutation DeleteManagerByEmail($email: String!) {
    delete_managers(where: {email: {_eq: $email}}) {
      affected_rows
      returning {
        id
        name
        email
      }
    }
  }
`

// Mutation to add fan details (free ticket registration)
export const ADD_FAN_DETAILS = gql`
  mutation addFanDetals($phone: String = "", $fullname: String = "", $email: String = "", $TicketNumber: String = "") {
    insert_fans(objects: {phone: $phone, fullname: $fullname, email: $email, TicketNumber: $TicketNumber}) {
      affected_rows
    }
  }
`