# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first Vue.js 3 scorekeeper application for badminton and other racket sports (tennis, ping-pong, volleyball). Built with Vite and Vant UI components, configured as a PWA for offline usage.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

**Two-Page Application Structure:**
- `App.vue`: Root component managing page routing between `sport-selection` and `game-play` pages
- `SportSelection.vue`: Initial page for selecting sport type, match format (1, 3-2, 5-3, 7-4), and points per set
- `GamePlay.vue`: Main scoring interface with vertical player cards, score tracking, and match progression

**Data Flow:**
1. `SportSelection` loads configuration from `/public/json/sports.json` on mount
2. On "开始比赛", emits `start-game` event with sport and settings object
3. `App.vue` passes gameData to `GamePlay` component via props
4. `GamePlay` manages score state, detects set/match end conditions, and shows dialogs

**Key State Management:**
- No Vuex/Pinia - all state managed in component data
- Game settings passed down via props from App to GamePlay
- Match progression tracked through: `currentSet`, `player1Score/player2Score`, `player1Sets/player2Sets`

## Important Implementation Details

**Sports Configuration (`public/json/sports.json`):**
- Defines available sports with icons, default formats, and point values
- `matchFormats` array defines set structures (e.g., "3-2" = best of 3, need 2 wins)
- `pointOptions` array defines available point values per set

**Match Logic (GamePlay.vue):**
- `setEnded`: triggered when either player reaches `targetScore`
- `matchEnded`: triggered when either player reaches `winsRequired` set wins
- Watchers on `setEnded` and `matchEnded` automatically show result dialogs after 500ms delay
- Adding points blocked when `setEnded || matchEnded`

**UI Components (Vant):**
- Uses Vant's `van-button`, `van-dialog`, `van-rate`, `van-nav-bar`
- Vant imported globally in `src/main.js`
- Custom styling with scoped styles, responsive breakpoints at 480px
- Landscape orientation support in GamePlay component

**PWA Configuration:**
- Vite PWA plugin with auto-update registration
- Manifest defines app name "羽毛球计分器" with theme color #42b883
- Expects icons at `public/icon-192x192.png` and `public/icon-512x512.png`

## File Structure Notes

- No router library - page navigation handled by v-if conditions in App.vue
- CSS reset in App.vue global styles
- Background image for GamePlay set via computed `backgroundStyle` property
- Mobile-first design with 100vh layouts and fixed nav bars
