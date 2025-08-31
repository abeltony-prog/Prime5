# Prime5 League - Team Dashboard & Admin Panel

A comprehensive football team management system built with Next.js, GraphQL, and Apollo Client. This system provides both team dashboards for managers and an admin panel for league administrators, with real-time statistics, player management, match scheduling, and analytics based on actual database data.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **State Management**: Apollo Client for GraphQL
- **UI Components**: Shadcn UI components
- **Styling**: Tailwind CSS with custom gradients
- **Authentication**: Custom auth context with protected routes
- **Database**: Hasura GraphQL API
- **Charts**: Recharts for data visualization

### Project Structure
```
prime5-league/
├── app/
│   ├── team-dashboard/          # Team manager dashboard
│   └── admin/                   # Admin panel
├── components/
│   ├── team-dashboard/          # Team dashboard components
│   └── admin/                   # Admin panel components
├── lib/graphql/                 # GraphQL queries and mutations
├── contexts/                    # Authentication context
├── hooks/                       # Custom React hooks
└── public/                      # Static assets
```

## 🎯 Team Dashboard Features

### 1. Overview Tab
**Purpose**: Display team summary, statistics, and performance charts

**Data Sources**:
- `GET_TEAM_COMPLETE_DATA` - Team information and players
- `GET_TEAM_MATCHES` - Match results for current season
- `GET_CURRENT_SEASON_WITH_GROUPS` - Season and group information

**Key Calculations**:
```typescript
// Points System (Standard Football Scoring)
const points = (wins * 3) + draws + (losses * 0)

// Win Rate
const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : 0

// Goal Difference
const goalDifference = goalsFor - goalsAgainst

// Average Goals Per Match
const avgGoalsPerMatch = played > 0 ? (goalsFor / played).toFixed(1) : 0

// Clean Sheets
const cleanSheets = matches.filter(match => opponentGoals === 0).length
```

### 2. Players Tab
**Purpose**: Manage team roster and add new players

**Data Sources**:
- `GET_ALL_PLAYERS_WHERE_TEAM_ID` - Team's current players
- `ADD_TEAM_PLAYER_DETAILS` - Add new players to database

**Features**:
- Display player information (name, email, phone, gender, DOB)
- Add new players via modal dialog
- Player statistics integration
- Team-specific filtering

### 3. Matches Tab
**Purpose**: Show upcoming matches and completed match results

**Data Sources**:
- `GET_TEAM_MATCHES` - Matches where team is team1 OR team2

**Key Features**:
- **Upcoming Matches**: Future fixtures with date, time, venue
- **Match Results**: Completed matches with scores and results
- **Result Badges**: Won (Green), Lost (Red), Drew (Yellow)
- **Score Display**: Shows actual goals from `team1Goals`/`team2Goals`

**Match Filtering Logic**:
```typescript
// Only fetch matches involving the logged-in team
const teamMatches = matchesData?.matches || []

// Separate by date
const upcomingMatches = teamMatches.filter(match => 
  new Date(match.dateAndtime) > new Date()
)
const completedMatches = teamMatches.filter(match => 
  new Date(match.dateAndtime) <= new Date()
)
```

### 4. Analytics Tab
**Purpose**: Detailed team performance analytics and player statistics

**Data Sources**:
- `GET_TEAM_MATCHES` - Match results for statistics
- `GET_TEAM_PLAYER_STATISTICS` - Individual player performance

**Calculations**:
```typescript
// Team Performance Percentages
const winPercentage = played > 0 ? ((wins / played) * 100).toFixed(1) : 0
const drawPercentage = played > 0 ? ((draws / played) * 100).toFixed(1) : 0
const lossPercentage = played > 0 ? ((losses / played) * 100).toFixed(1) : 0

// Player Statistics Aggregation
const playerStats = currentTeam.players?.map(player => {
  const playerStats = allPlayerStats.filter(stat => stat.player_id === player.id)
  return {
    goals: playerStats.reduce((sum, stat) => sum + parseInt(stat.goals || "0"), 0),
    assists: playerStats.reduce((sum, stat) => sum + parseInt(stat.assists || "0"), 0),
    yellowCards: playerStats.reduce((sum, stat) => sum + parseInt(stat.yellow_cards || "0"), 0),
    redCards: playerStats.reduce((sum, stat) => sum + parseInt(stat.red_cards || "0"), 0)
  }
})
```

### 5. Settings Tab
**Purpose**: Manage team and manager settings

**Data Sources**:
- Team information from `GET_TEAM_COMPLETE_DATA`
- Manager information from auth context

**Features**:
- Team details (name, shortname, location)
- Manager profile settings
- Notification preferences
- Privacy settings

## 🏛️ Admin Panel Features

### 1. Overview Tab
**Purpose**: League-wide dashboard with KPIs, charts, and system overview

**Key Features**:
- **KPI Dashboard**: Revenue, active teams, matches played, average goals
- **Performance Charts**: Monthly match trends, team performance rankings
- **Registration Status**: Approved, pending, and rejected team counts
- **Recent Activity**: Real-time system activity feed
- **System Health**: Database connection status and environment config

**Data Visualization**:
```typescript
// KPI Data Structure
const kpiData = [
  {
    title: "Total Revenue",
    value: "$24,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  // ... other KPIs
]

// Chart Data
const matchesData = [
  { month: "Jan", matches: 12, goals: 38 },
  { month: "Feb", matches: 16, goals: 52 },
  // ... monthly data
]
```

### 2. Teams Management Tab
**Purpose**: Comprehensive team administration and management

**Key Features**:
- **Team Listing**: View all teams with search and filtering
- **Team Details**: Comprehensive team information and statistics
- **Manager Management**: View and manage team managers
- **Player Roster**: Team player lists and statistics
- **Team Actions**: Edit, delete, and manage team settings

**Team Data Structure**:
```typescript
interface Team {
  id: number
  name: string
  shortname: string
  team_manager: string
  manager: Manager
  matche1: Match[]
  matche2: Match[]
  players: Player[]
}

interface Manager {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  photo?: string
  create_at: string
}
```

**Team Management Functions**:
```typescript
// Search and filtering
const filteredTeams = teams.filter(team => 
  team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  team.shortname.toLowerCase().includes(searchTerm.toLowerCase())
)

// Team actions
const handleEditTeam = (team: Team) => { /* Edit logic */ }
const handleDeleteTeam = (teamId: number) => { /* Delete logic */ }
const handleViewDetails = (team: Team) => { /* View details */ }
```

### 3. Matches Management Tab
**Purpose**: Schedule, manage, and monitor all league matches

**Key Features**:
- **Match Scheduling**: Create and schedule new matches
- **Match Management**: Edit match details, venues, and times
- **Result Recording**: Update match scores and results
- **Match History**: View completed matches and statistics
- **Conflict Resolution**: Handle scheduling conflicts

**Match Management Logic**:
```typescript
// Match scheduling validation
const validateMatchSchedule = (match: Match) => {
  const conflicts = existingMatches.filter(existing => 
    existing.date === match.date && 
    (existing.team1 === match.team1 || existing.team2 === match.team2)
  )
  return conflicts.length === 0
}

// Result recording
const updateMatchResult = (matchId: string, team1Goals: number, team2Goals: number) => {
  // Update match goals and calculate team statistics
  // Update team standings and player statistics
}
```

### 4. Analytics Tab
**Purpose**: League-wide analytics and performance insights

**Key Features**:
- **League Statistics**: Overall league performance metrics
- **Team Rankings**: Points tables and performance comparisons
- **Player Analytics**: Top performers and statistics
- **Trend Analysis**: Performance trends over time
- **Export Functionality**: Data export for reporting

**Analytics Calculations**:
```typescript
// League-wide statistics
const leagueStats = {
  totalMatches: allMatches.length,
  totalGoals: allMatches.reduce((sum, match) => 
    sum + (match.team1Goals || 0) + (match.team2Goals || 0), 0
  ),
  averageGoalsPerMatch: totalGoals / totalMatches,
  totalTeams: teams.length,
  activeSeasons: seasons.filter(s => new Date(s.EndDate) > new Date()).length
}

// Team rankings
const teamRankings = teams.map(team => ({
  ...team,
  points: calculateTeamPoints(team.id),
  goalDifference: calculateGoalDifference(team.id),
  matchesPlayed: getMatchesPlayed(team.id)
})).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
```

### 5. Registrations Tab
**Purpose**: Manage team registration applications and approvals

**Key Features**:
- **Registration Queue**: View pending team applications
- **Approval Process**: Review and approve/reject applications
- **Team Validation**: Verify team information and requirements
- **Communication**: Contact teams about their applications
- **Registration History**: Track all registration activities

**Registration Workflow**:
```typescript
// Registration status management
const registrationStatuses = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  UNDER_REVIEW: "under_review"
}

// Approval process
const handleApproval = async (registrationId: string, status: string, notes?: string) => {
  try {
    await updateRegistrationStatus(registrationId, status, notes)
    await notifyTeam(registrationId, status, notes)
    refetchRegistrations()
    toast.success(`Registration ${status}`)
  } catch (error) {
    toast.error("Failed to update registration")
  }
}
```

### 6. Season Scheduler Tab
**Purpose**: Create and manage league seasons, groups, and schedules

**Key Features**:
- **Season Creation**: Set up new league seasons with dates
- **Group Management**: Organize teams into groups/divisions
- **Schedule Generation**: Automatically generate match schedules
- **Season Settings**: Configure season rules and parameters
- **Season Monitoring**: Track season progress and status

**Season Management Logic**:
```typescript
// Season data structure
interface Season {
  id: string
  name: string
  startDate: string
  EndDate: string
  teams: Record<string | number, string> // JSONB with team IDs and tokens
}

// Schedule generation
const generateMatchSchedule = (teams: Team[], seasonId: string) => {
  const matches = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        team1: teams[i].id,
        team2: teams[j].id,
        season_id: seasonId,
        dateAndtime: calculateMatchDate(i, j, seasonStartDate),
        location: "TBD"
      })
    }
  }
  return matches
}

// Season validation
const validateSeason = (season: Season) => {
  const errors = []
  if (new Date(season.startDate) >= new Date(season.EndDate)) {
    errors.push("End date must be after start date")
  }
  if (Object.keys(season.teams).length < 4) {
    errors.push("Season must have at least 4 teams")
  }
  return errors
}
```

### 7. Team Details Tab
**Purpose**: In-depth view of individual team information and statistics

**Key Features**:
- **Team Profile**: Complete team information and history
- **Player Management**: Add, edit, and remove team players
- **Match History**: Complete match record and results
- **Performance Metrics**: Detailed team statistics and trends
- **Manager Information**: Team manager details and contact

**Team Details Implementation**:
```typescript
// Team statistics calculation
const calculateTeamStats = (teamId: string, seasonId: string) => {
  const teamMatches = matches.filter(match => 
    (match.team1 === teamId || match.team2 === teamId) &&
    match.season_id === seasonId
  )
  
  return teamMatches.reduce((stats, match) => {
    const isHome = match.team1 === teamId
    const teamGoals = isHome ? match.team1Goals : match.team2Goals
    const opponentGoals = isHome ? match.team2Goals : match.team1Goals
    
    return {
      matches: stats.matches + 1,
      wins: stats.wins + (teamGoals > opponentGoals ? 1 : 0),
      draws: stats.draws + (teamGoals === opponentGoals ? 1 : 0),
      losses: stats.losses + (teamGoals < opponentGoals ? 1 : 0),
      goalsFor: stats.goalsFor + teamGoals,
      goalsAgainst: stats.goalsAgainst + opponentGoals
    }
  }, { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 })
}
```

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```typescript
// Protected route wrapper
<ProtectedRoute>
  <TeamDashboardContent />
</ProtectedRoute>

// Auth context provides manager and team information
const { manager, logout } = useAuth()
const teamId = manager?.team?.id
```

### 2. GraphQL Data Fetching
```typescript
// Team-specific queries with proper filtering
const { data: teamData } = useQuery(GET_TEAM_COMPLETE_DATA, {
  variables: { teamId: manager?.team?.id || "" },
  skip: !manager?.team?.id
})

const { data: matchesData } = useQuery(GET_TEAM_MATCHES, {
  variables: { teamId: manager?.team?.id || "" },
  skip: !manager?.team?.id
})

// Admin queries for league-wide data
const { data: managersData } = useQuery(GET_ALL_MANAGERS_DETAILS)
const { data: seasonsData } = useQuery(GET_SEASONS)
```

### 3. Data Processing Pipeline
```typescript
// 1. Fetch raw data from GraphQL
const currentTeam = teamData?.Teams?.[0]
const teamMatches = matchesData?.matches || []

// 2. Filter by season
const seasonMatches = teamMatches.filter(match => 
  match.season_id === currentSeason.id
)

// 3. Calculate statistics
const stats = calculateTeamStats(seasonMatches)

// 4. Pass to components
<OverviewTab teamData={stats} />
```

## 📊 Statistics Calculation Logic

### Match Result Determination
```typescript
seasonMatches.forEach(match => {
  const isHome = match.team1 === manager?.team?.id
  const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
  const opponentGoals = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
  
  // Determine result
  if (teamGoals > opponentGoals) {
    wins++
  } else if (teamGoals < opponentGoals) {
    losses++
  } else {
    draws++
  }
  
  // Count goals
  goalsFor += teamGoals
  goalsAgainst += opponentGoals
  
  // Count clean sheets
  if (opponentGoals === 0) cleanSheets++
})
```

### Points Calculation
```typescript
// Standard football points system
const points = (wins * 3) + draws + (losses * 0)

// Example:
// 3 wins = 9 points
// 2 draws = 2 points  
// 1 loss = 0 points
// Total = 11 points
```

### Performance Metrics
```typescript
const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : 0
const goalDifference = goalsFor - goalsAgainst
const avgGoalsPerMatch = played > 0 ? (goalsFor / played).toFixed(1) : 0
const cleanSheets = matches.filter(match => opponentGoals === 0).length
```

## 🔒 Security & Data Isolation

### Team-Specific Queries
- **`GET_TEAM_MATCHES`**: Only fetches matches where `team1 = teamId OR team2 = teamId`
- **`GET_ALL_PLAYERS_WHERE_TEAM_ID`**: Only fetches players belonging to the team
- **`GET_TEAM_COMPLETE_DATA`**: Only fetches data for the specified team

### Admin Access Control
- **Admin Routes**: Protected admin-only access
- **Data Permissions**: Admins can view all teams and data
- **Action Validation**: Admin actions require proper authentication
- **Audit Logging**: Track admin actions for security

### Client-Side Filtering
```typescript
// Additional filtering for player statistics
const allPlayerStats = playerStatsData?.player_statistics?.filter(stat => {
  return currentTeam?.players?.some(player => player.id === stat.player_id)
}) || []
```

## 🚀 Performance Optimizations

### 1. Query Optimization
- Team-specific queries reduce data transfer
- No client-side filtering of large datasets
- Proper use of GraphQL variables
- Admin queries optimized for league-wide data

### 2. Component Architecture
- Modular tab components for better maintainability
- Lazy loading of tab content
- Efficient re-rendering with proper state management
- Shared components between team and admin dashboards

### 3. Data Caching
- Apollo Client handles GraphQL caching
- Automatic refetch on mutations
- Optimistic UI updates
- Efficient data sharing between components

## 🛠️ Development Guidelines

### Adding New Features
1. **Create GraphQL Query/Mutation** in `lib/graphql/`
2. **Add to Dashboard** using `useQuery`/`useMutation`
3. **Create Component** in appropriate components directory
4. **Update Types** if needed
5. **Test Data Flow** from database to UI

### Admin vs Team Features
- **Team Dashboard**: Team-specific data and actions
- **Admin Panel**: League-wide management and oversight
- **Shared Logic**: Common calculations and utilities
- **Access Control**: Proper routing and authentication

### Data Validation
```typescript
// Always check for required data
if (!currentTeam || !currentSeason) {
  return fallbackData
}

// Use fallback values for missing data
const teamName = currentTeam?.name || "Team Dashboard"
const teamPoints = parseInt(stats?.points || "0")
```

### Error Handling
```typescript
// GraphQL error states
if (matchesError) {
  return <ErrorState message={matchesError.message} />
}

// Loading states
if (matchesLoading) {
  return <LoadingSpinner />
}
```

## 📝 Database Schema Requirements

### Matches Table
```sql
matches {
  id: uuid
  dateAndtime: timestamp
  location: string
  season_id: uuid
  team1: uuid
  team1Goals: integer
  team2: uuid
  team2Goals: integer
  Team1: Teams
  Team2: Teams
}
```

### Teams Table
```sql
Teams {
  id: uuid
  name: string
  shortname: string
  location: string
  logo: string
  team_manager: string
}
```

### Players Table
```sql
players {
  id: uuid
  name: string
  email: string
  phone: string
  gender: string
  dob: string
  team_id: uuid
}
```

### Player Statistics Table
```sql
player_statistics {
  id: uuid
  player_id: uuid
  match_id: uuid
  season_id: uuid
  goals: integer
  assists: integer
  yellow_cards: integer
  red_cards: integer
  minutes_played: integer
}
```

### Seasons Table
```sql
seasons {
  id: uuid
  name: string
  startDate: timestamp
  EndDate: timestamp
  teams: jsonb
  created_at: timestamp
}
```

### Groups Table
```sql
groups {
  id: uuid
  name: string
  season_id: uuid
  created_at: timestamp
}
```

## 🔍 Troubleshooting

### Common Issues
1. **GraphQL Schema Errors**: Check field names match database schema
2. **Team Filtering Issues**: Verify `teamId` is passed correctly
3. **Season Filtering**: Ensure `season_id` exists in matches
4. **Player Stats**: Verify player-team relationships
5. **Admin Access**: Check authentication and permissions

### Debug Tips
- Use Apollo DevTools for GraphQL debugging
- Check browser console for error messages
- Verify database relationships and foreign keys
- Test queries in GraphQL playground
- Check admin authentication status

## 🎯 Future Enhancements

### Planned Features
- Real-time match updates with WebSockets
- Advanced analytics and charts
- Team comparison tools
- Export functionality for reports
- Mobile-responsive design improvements
- Automated match scheduling algorithms
- Advanced reporting and analytics
- Integration with external football APIs

### Performance Improvements
- Implement virtual scrolling for large datasets
- Add pagination for match history
- Optimize GraphQL query batching
- Implement offline support with service workers
- Add caching strategies for frequently accessed data

---

**Note**: This system is designed to be completely data-driven with no mock data. All statistics, charts, and information are calculated from actual database records, ensuring accuracy and real-time updates. The admin panel provides comprehensive league management capabilities while maintaining the same data-driven approach. 