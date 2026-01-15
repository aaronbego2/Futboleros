# Futbol App - Live Match Dashboard

A real-time football (soccer) management application built with React, Vite, InstantDB, and Framer Motion. Features a glassmorphism/HUD design archetype for displaying live match scores, statistics, and events.

## Features

- **Live Match Dashboard**: Real-time score updates with glassmorphic design
- **Score Ticker**: Horizontal scrolling banner showing all active matches
- **Match Detail Panel**: Expandable side drawer with player stats, events, and possession data
- **Quick Stats Grid**: Dashboard widgets for key metrics (goals, active matches, top scorer)
- **Status Filters**: Filter matches by Live, Upcoming, or Finished status
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Real-time Sync**: InstantDB integration for live data updates (ready to connect)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling with custom glassmorphism utilities
- **Framer Motion** for animations
- **InstantDB** for real-time database (configuration ready)
- **Lucide React** for icons
- **ShadCN UI** components

## Design System

### Colors
- Background: `#0f1419` (Deep charcoal)
- Primary Accent: `#00d9ff` (Teal)
- Secondary Accent: `#b4ff39` (Electric lime)

### Typography
- **JetBrains Mono**: Scores, times, data labels (200, 400, 800 weights)
- **Space Grotesk**: Team names, headings (400, 500, 700, 800 weights)

### Visual Elements
- Glassmorphic cards with `backdrop-filter: blur(12px)`
- Colored glows and shadows for depth
- Noise texture overlay for authenticity
- Staggered animations with 80ms delays

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your InstantDB App ID to `.env`:
```env
VITE_INSTANT_APP_ID=your_instant_app_id_here
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   └── LiveMatchDashboard.tsx    # Main dashboard component
│   ├── match/
│   │   ├── MatchCard.tsx              # Individual match card
│   │   ├── MatchDetailPanel.tsx       # Expandable match details
│   │   ├── ScoreTicker.tsx            # Scrolling score banner
│   │   ├── StatusFilter.tsx           # Match status filter
│   │   ├── StatsGrid.tsx              # Statistics widgets
│   │   └── SyncIndicator.tsx          # Live sync status
│   └── ui/                            # ShadCN UI components
├── lib/
│   ├── instant.ts                     # InstantDB configuration
│   ├── mockData.ts                    # Mock match data & utilities
│   └── utils.ts                       # Utility functions
├── types/
│   └── football.ts                    # TypeScript type definitions
└── index.css                          # Global styles & custom utilities
```

## InstantDB Integration

The app is pre-configured for InstantDB but currently uses mock data. To connect to a real database:

1. Create an InstantDB app at [instantdb.com](https://instantdb.com)
2. Add your App ID to the `.env` file
3. Update `src/lib/instant.ts` to define your schema
4. Replace mock data usage in components with InstantDB queries

Example InstantDB query:
```typescript
import { db } from '@/lib/instant';

// In your component
const { data } = db.useQuery({ matches: {} });
```

## Customization

### Adding New Match Statuses
Edit `src/types/football.ts` to add new status types to the `Match` interface.

### Modifying Animations
Adjust animation timings in components using Framer Motion's `transition` prop.

### Changing Colors
Update the color values in `src/index.css` under the custom utility classes:
- `.glass-card` - Card background and blur
- `.glow-teal` - Teal glow effect
- `.glow-lime` - Lime glow effect

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## License

MIT
