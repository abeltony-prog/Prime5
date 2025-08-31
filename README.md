# Prime5 League - Team Dashboard

A comprehensive football team management dashboard built with Next.js, GraphQL, and Apollo Client. This dashboard provides real-time team statistics, player management, match results, and analytics based on actual database data.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **State Management**: Apollo Client for GraphQL
- **UI Components**: Shadcn UI components
- **Styling**: Tailwind CSS with custom gradients
- **Authentication**: Custom auth context with protected routes
- **Database**: Hasura GraphQL API

### Project Structure
```
prime5-league/
├── app/team-dashboard/          # Main dashboard pages
├── components/team-dashboard/    # Dashboard tab components
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

### 2. Component Architecture
- Modular tab components for better maintainability
- Lazy loading of tab content
- Efficient re-rendering with proper state management

### 3. Data Caching
- Apollo Client handles GraphQL caching
- Automatic refetch on mutations
- Optimistic UI updates

## 🛠️ Development Guidelines

### Adding New Features
1. **Create GraphQL Query/Mutation** in `lib/graphql/`
2. **Add to Dashboard** using `useQuery`/`useMutation`
3. **Create Component** in `components/team-dashboard/`
4. **Update Types** if needed
5. **Test Data Flow** from database to UI

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

## 🔍 Troubleshooting

### Common Issues
1. **GraphQL Schema Errors**: Check field names match database schema
2. **Team Filtering Issues**: Verify `teamId` is passed correctly
3. **Season Filtering**: Ensure `season_id` exists in matches
4. **Player Stats**: Verify player-team relationships

### Debug Tips
- Use Apollo DevTools for GraphQL debugging
- Check browser console for error messages
- Verify database relationships and foreign keys
- Test queries in GraphQL playground

## 🎯 Future Enhancements

### Planned Features
- Real-time match updates with WebSockets
- Advanced analytics and charts
- Team comparison tools
- Export functionality for reports
- Mobile-responsive design improvements

### Performance Improvements
- Implement virtual scrolling for large datasets
- Add pagination for match history
- Optimize GraphQL query batching
- Implement offline support with service workers

---

**Note**: This dashboard is designed to be completely data-driven with no mock data. All statistics, charts, and information are calculated from actual database records, ensuring accuracy and real-time updates. 