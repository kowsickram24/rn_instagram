# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Instagram clone with Firebase backend, AWS S3/CloudFront media CDN, and multi-environment build support (development, staging, production).

## Commands

```bash
# Development
npm start                # Start Metro bundler
npm run android:dev      # Run Android dev build (com.instagram.development)
npm run android:stag     # Run Android staging build (com.instagram.staging)
npm run android:prod     # Run Android production build (com.instagram)
npm run ios              # Run iOS build

# Maintenance
npm run gradlew:clean    # Clean Android Gradle build
npm run lint             # ESLint
npm test                 # Jest (react-native preset)
```

## Architecture

### State Management (Hybrid approach)
- **Redux Toolkit** (`src/store/`) — Auth state (`userSlice`) and post interactions (`postSlice`)
- **RTK Query** — Server-state caching for user search (`apiSlice`), chats (`chatsApi`), stories (`storiesApi`). Each uses custom `baseQuery` wrapping Firestore calls
- **React Query** (`src/hooks/data/fetchPosts.js`) — `usePosts()` and `usePostbyId()` for post data fetching
- **React Context** (`src/context/`) — Network connectivity status, upload progress tracking

### Navigation (`src/navigation/`)
- Auth gate in `Stack/index.js`: checks AsyncStorage for logged-in user, routes to AuthStack or UserStack
- **UserStack**: 19+ screens with modal presentations for Stories
- **BottomTab**: Home, Explore, NewPost, Notification, Profile
- **TopTab**: Material top tabs for Profile and Reach screens
- Deep linking configured via `linking.js` (`instagram://` and `https://instagram.com`)

### Backend Services
- **Firebase**: Auth, Firestore (primary DB), Storage, Crashlytics, Analytics
- **AWS S3 + CloudFront**: Media CDN delivery (`src/services/aws/`)
- **Notifee**: Local/push notifications (`src/services/notifiee/`)
- Environment variables managed via `react-native-config` with `.env.development`, `.env.staging`, `.env.production`

### UI Layer
- **@rneui/themed** — Primary UI component library
- **Shopify Restyle** (`src/theme/`) — Type-safe theming with design tokens
- **react-native-paper** — Material components (Snackbar)
- SVG icons configured through `metro.config.js` transformer; exported from `src/constants/assets.js`

### Key Patterns
- Form handling: Formik + Yup validation schemas (`src/utils/validation.js`)
- Internationalization: i18next with 3 locales (en, fr, ar) in `src/language/`
- Images: `react-native-fast-image` for optimized loading, `react-native-image-crop-picker` for selection
- Firebase config initialized in `firebase.config.js` at root using env vars

## Code Style

- Prettier: single quotes, trailing commas, no bracket spacing, arrow parens avoided
- ESLint enforces: no unused styles, no console logs (warn), strict import validation, split platform components
- Prefix unused function params with `_` to satisfy no-unused-vars rule
