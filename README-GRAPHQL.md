# Prime5 League - GraphQL Integration

This project now includes full GraphQL integration using Apollo Client and Hasura.

## 🚀 **What's Been Added**

### **GraphQL Packages**
- `@apollo/client` - Apollo Client for React
- `graphql` - GraphQL JavaScript implementation
- Custom hooks for data management
- Type-safe queries and mutations

### **Features**
- **Apollo Client Configuration** - Set up with error handling and auth
- **GraphQL Queries** - For teams, matches, standings, and statistics
- **GraphQL Mutations** - For creating, updating, and deleting data
- **Custom Hooks** - Easy-to-use hooks for GraphQL operations
- **Cache Management** - Automatic cache updates and optimistic UI

## 🛠 **Setup Instructions**

### **1. Environment Variables**
Create a `.env.local` file in your project root:

```bash
# Hasura GraphQL Configuration
NEXT_PUBLIC_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_admin_secret_here

# For production
# NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-project.hasura.app/v1/graphql
```

### **2. Hasura Setup**
You can use Hasura in several ways:

#### **Option A: Hasura Cloud (Recommended)**
1. Go to [hasura.io](https://hasura.io)
2. Create a new project
3. Get your GraphQL endpoint and admin secret
4. Update your `.env.local` file

#### **Option B: Local Hasura with Docker**
```bash
# Create a docker-compose.yml file
version: '3.6'
services:
  postgres:
    image: postgres:12
    restart: always
    environment:
      POSTGRES_PASSWORD: postgrespassword
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  hasura:
    image: hasura/graphql-engine:latest
    ports:
      - "8080:8080"
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      HASURA_GRAPHQL_ADMIN_SECRET: your_admin_secret_here

volumes:
  db_data:
```

### **3. Database Schema**
Set up these tables in Hasura:

#### **Teams Table**
```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(10) NOT NULL,
  group VARCHAR(1) NOT NULL,
  manager VARCHAR(100),
  founded_year INTEGER,
  logo_url TEXT,
  points INTEGER DEFAULT 0,
  played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Players Table**
```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(50) NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0.0,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Matches Table**
```sql
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  team1_id INTEGER REFERENCES teams(id),
  team2_id INTEGER REFERENCES teams(id),
  team1_score INTEGER,
  team2_score INTEGER,
  group VARCHAR(1) NOT NULL,
  venue VARCHAR(100),
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 **Usage Examples**

### **Using the Custom Hooks**

#### **Fetch Teams**
```tsx
import { useTeams } from '@/hooks/use-teams'

function TeamsList() {
  const { teams, loading, error } = useTeams()

  if (loading) return <div>Loading teams...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {teams.map(team => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  )
}
```

#### **Create a Team**
```tsx
import { useCreateTeam } from '@/hooks/use-teams'

function CreateTeamForm() {
  const { createTeam, loading } = useCreateTeam()

  const handleSubmit = async (formData) => {
    try {
      await createTeam({
        variables: {
          team: {
            name: formData.name,
            short_name: formData.shortName,
            group: formData.group,
            manager: formData.manager
          }
        }
      })
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  )
}
```

#### **Fetch Standings**
```tsx
import { useStandings } from '@/hooks/use-standings'

function GroupStandings({ group }: { group: string }) {
  const { standings, loading, error } = useStandings(group)

  if (loading) return <div>Loading standings...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team, index) => (
          <tr key={team.id}>
            <td>{index + 1}</td>
            <td>{team.name}</td>
            <td>{team.played}</td>
            <td>{team.wins}</td>
            <td>{team.draws}</td>
            <td>{team.losses}</td>
            <td>{team.goals_for}</td>
            <td>{team.goals_against}</td>
            <td>{team.goal_difference}</td>
            <td>{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 🔧 **Available Hooks**

### **Team Hooks**
- `useTeams()` - Fetch all teams
- `useTeam(id)` - Fetch specific team
- `useCreateTeam()` - Create new team
- `useUpdateTeam()` - Update team
- `useDeleteTeam()` - Delete team

### **Match Hooks**
- `useMatches()` - Fetch all matches
- `useUpcomingMatches()` - Fetch upcoming matches
- `usePastResults()` - Fetch completed matches
- `useCreateMatch()` - Create new match
- `useUpdateMatchResult()` - Update match result
- `useDeleteMatch()` - Delete match

### **Statistics Hooks**
- `useStandings(group)` - Fetch group standings
- `useTopScorers()` - Fetch top goal scorers
- `useLeagueStats()` - Fetch league statistics

## 🚀 **Next Steps**

1. **Set up Hasura** using one of the options above
2. **Create your database schema** with the provided SQL
3. **Update environment variables** with your Hasura endpoint
4. **Test the GraphQL integration** using the custom hooks
5. **Replace mock data** in your components with real GraphQL queries

## 📚 **Additional Resources**

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Hasura Documentation](https://hasura.io/docs/)
- [GraphQL Tutorial](https://graphql.org/learn/)

## 🎯 **Benefits of This Setup**

- **Real-time data** with GraphQL subscriptions
- **Type-safe operations** with TypeScript
- **Automatic cache management** for better performance
- **Optimistic UI updates** for better user experience
- **Centralized data management** with Apollo Client
- **Scalable architecture** ready for production use

Your Prime5 League project now has enterprise-grade GraphQL capabilities! 🏆 