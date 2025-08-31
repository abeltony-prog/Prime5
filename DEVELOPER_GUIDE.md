# Team Dashboard Developer Guide

## 🚀 Quick Start for Developers

### Prerequisites
- Node.js 18+ and pnpm
- Understanding of Next.js, GraphQL, and TypeScript
- Access to the Prime5 League database

### Setup
```bash
cd prime5-league
pnpm install
pnpm dev
```

## 🔍 Core Implementation Details

### 1. Data Fetching Architecture

#### GraphQL Query Structure
```typescript
// Team-specific matches query
export const GET_TEAM_MATCHES = gql`
  query getTeamMatches($teamId: uuid!) {
    matches(where: {_or: [{team1: {_eq: $teamId}}, {team2: {_eq: $teamId}}]}) {
      created_at
      dateAndtime
      id
      location
      season_id
      team1
      team1Goals
      team2
      team2Goals
      Team1 { ... }
      Team2 { ... }
    }
  }
`
```

#### Query Hooks Implementation
```typescript
// In app/team-dashboard/page.tsx
const { data: matchesData, loading: matchesLoading } = useQuery(GET_TEAM_MATCHES, {
  variables: { teamId: manager?.team?.id || "" },
  skip: !manager?.team?.id
})

// Data extraction
const teamMatches = matchesData?.matches || []
const currentTeam = teamData?.Teams?.[0]
const currentSeason = seasonData?.seasons?.[0]
```

### 2. Statistics Calculation Engine

#### Match Result Analysis
```typescript
// Core calculation logic in getRealTeamData()
seasonGroupMatches.forEach((match: any) => {
  const isHome = match.team1 === manager?.team?.id
  const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
  const opponentGoals = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
  
  // Count goals
  goalsFor += teamGoals
  goalsAgainst += opponentGoals
  
  // Determine match result
  if (teamGoals > opponentGoals) {
    wins++
  } else if (teamGoals < opponentGoals) {
    losses++
  } else {
    draws++
  }
  
  // Count clean sheets
  if (opponentGoals === 0) {
    cleanSheets++
  }
})
```

#### Points Calculation System
```typescript
// Standard football scoring (3-1-0)
const points = (wins * 3) + draws + (losses * 0)

// Derived statistics
const played = wins + draws + losses
const goalDifference = goalsFor - goalsAgainst
const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : 0
const avgGoalsPerMatch = played > 0 ? (goalsFor / played).toFixed(1) : 0
```

### 3. Data Filtering & Security

#### Season-Based Filtering
```typescript
// Filter matches by current season
const seasonGroupMatches = teamMatches.filter((match: any) => 
  match.season_id === currentSeasonId
)
```

#### Team Isolation
```typescript
// Player statistics filtered by team
const allPlayerStats = playerStatsData?.player_statistics?.filter((stat: any) => {
  return currentTeam?.players?.some((player: any) => player.id === stat.player_id)
}) || []
```

## 🏗️ Component Architecture

### Tab Component Structure
```
components/team-dashboard/
├── overview-tab.tsx      # Team overview and statistics
├── players-tab.tsx       # Player management
├── matches-tab.tsx       # Match schedule and results
├── analytics-tab.tsx     # Performance analytics
├── settings-tab.tsx      # Team and manager settings
└── index.ts             # Component exports
```

### Data Flow Pattern
```typescript
// 1. Main dashboard fetches data
const realTeamData = getRealTeamData()
const realAnalyticsData = getRealAnalyticsData()

// 2. Pass processed data to components
<OverviewTab teamData={realTeamData || {}} performanceData={realPerformanceData || []} />
<AnalyticsTab analyticsData={realAnalyticsData || {}} />
```

## 🔄 State Management

### Local State
```typescript
const [activeTab, setActiveTab] = useState("overview")
const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false)
const [newPlayer, setNewPlayer] = useState({
  name: "", email: "", phone: "", gender: "", dob: ""
})
```

### GraphQL State
```typescript
// Apollo Client handles caching and state
const { data, loading, error, refetch } = useQuery(QUERY_NAME, {
  variables: { teamId: manager?.team?.id || "" },
  skip: !manager?.team?.id
})
```

## 🎨 UI Component Integration

### Shadcn UI Usage
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
```

### Custom Styling
```typescript
// Professional gradient backgrounds
className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl"

// Hover effects
className="hover:bg-white/10 transition-all duration-200"

// Status-based colors
className={`bg-gradient-to-br ${
  isHomeMatch(match) 
    ? 'from-blue-500/20 to-blue-600/20' 
    : 'from-red-500/20 to-red-600/20'
}`}
```

## 📊 Data Processing Functions

### Team Data Processing
```typescript
const getRealTeamData = () => {
  if (!currentTeam || !currentSeason) {
    return fallbackData
  }
  
  // Process match data to calculate statistics
  const stats = processMatchData(seasonGroupMatches)
  
  return {
    name: currentTeam.name,
    points: stats.points,
    played: stats.played,
    wins: stats.wins,
    draws: stats.draws,
    losses: stats.losses,
    // ... other calculated fields
  }
}
```

### Analytics Processing
```typescript
const getRealAnalyticsData = () => {
  // Calculate team performance metrics
  const teamStats = calculateTeamStats(seasonGroupMatches)
  
  // Aggregate player statistics
  const playerStats = aggregatePlayerStats(currentTeam.players, allPlayerStats)
  
  return {
    teamStats,
    playerStats,
    monthlyPerformance: generateMonthlyPerformance(teamStats),
    formData: getRealPerformanceData()
  }
}
```

## 🚨 Error Handling

### GraphQL Error States
```typescript
if (matchesError) {
  return (
    <div className="text-center text-red-300">
      <AlertCircleIcon className="h-12 w-12 mx-auto mb-4" />
      <p className="font-medium">Error loading matches from database</p>
      <p className="text-white/70 mt-2">{matchesError.message}</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  )
}
```

### Loading States
```typescript
if (matchesLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
        <p>Loading matches from database...</p>
      </div>
    </div>
  )
}
```

### Data Validation
```typescript
// Always provide fallback values
const teamName = currentTeam?.name || "Team Dashboard"
const teamPoints = parseInt(stats?.points || "0")
const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : 0
```

## 🔧 Development Workflow

### Adding New Features
1. **Create GraphQL Query** in `lib/graphql/queries.ts`
2. **Add Query Hook** in dashboard component
3. **Create Processing Function** for data transformation
4. **Build UI Component** using Shadcn UI
5. **Integrate with Dashboard** and test data flow

### Testing Data Flow
```typescript
// Test query execution
console.log('Team Data:', teamData)
console.log('Matches:', teamMatches)
console.log('Processed Data:', realTeamData)

// Test calculations
console.log('Wins:', wins, 'Draws:', draws, 'Losses:', losses)
console.log('Points:', points, 'Goal Difference:', goalDifference)
```

### Debugging Tips
- Use Apollo DevTools for GraphQL debugging
- Check browser console for calculation logs
- Verify database relationships and data integrity
- Test with different team IDs and seasons

## 📈 Performance Considerations

### Query Optimization
- Use team-specific queries to reduce data transfer
- Implement proper loading and error states
- Cache frequently accessed data
- Avoid unnecessary re-renders

### Component Optimization
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Lazy load tab content when possible
- Optimize re-rendering with proper state management

## 🔮 Future Development

### Planned Enhancements
- Real-time updates with WebSockets
- Advanced filtering and search
- Export functionality for reports
- Mobile-responsive improvements
- Performance analytics dashboard

### Scalability Considerations
- Implement pagination for large datasets
- Add virtual scrolling for long lists
- Optimize GraphQL query batching
- Consider implementing offline support

---

**Key Principle**: This dashboard is designed to be completely data-driven. All statistics, charts, and information are calculated from actual database records, ensuring accuracy and real-time updates. Never use mock data - always fetch and process real data from the database. 