# Habits Tracker App

A beautiful mobile habit tracking app built with Vue 3, Vite, Tailwind CSS, and Capacitor.

## Features

- 📝 **Daily Entry Form**: Track your mood, sleep, nutrition, reading, prayer, Bible reading, and custom activities
- 🏷️ **Customizable Mood Tags**: Create and customize mood tags with different colors
- 📊 **Week & Month Views**: Visualize your habits over time with calendar views
- 📈 **Progress Reports**: Weekly and monthly reports with goals tracking and encouragement
- 🎯 **Goal Setting**: Set weekly and monthly goals for any tracked activity
- ⚙️ **Flexible Settings**: Enable/disable fields, manage custom activities, and set reminder times
- 🔔 **Daily Reminders**: Get push notifications to fill out your daily entry
- 💾 **Local Storage**: All data is stored locally on your device

## Tech Stack

- **Vue 3** with Composition API
- **Vite** for fast development and building
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vue Router** for navigation
- **Capacitor** for native mobile deployment
- **Local Notifications** for daily reminders
- **Vitest** with @vue/test-utils for testing

## Development

### Prerequisites

- Node.js 18+ and Yarn 4+
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

### Install Dependencies

```bash
yarn install
```

### Run Development Server

```bash
yarn dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
yarn build
```

### Testing

Run the complete test suite:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test --watch
```

Run tests with UI:

```bash
yarn test:ui
```

Generate coverage report:

```bash
yarn test:coverage
```

**Test Coverage:**

- Storage utilities: 100%
- Date utilities: 100%
- Statistics composable: 98.57%
- Habits store: 97.05%
- Notifications composable: 69.76%

The test suite includes 103 tests covering:

- All utility functions (storage, date formatting)
- State management (Pinia store)
- Statistics calculations
- Notification scheduling
- Edge cases and error handling

## Mobile Development

### iOS Deployment

```bash
# Build the web app
yarn build

# Copy web assets to iOS
yarn cap:copy:ios

# Open in Xcode
yarn cap:open:ios
```

Then build and run from Xcode.

### Android Deployment

```bash
# Build the web app
yarn build

# Copy web assets to Android
yarn cap:copy:android

# Open in Android Studio
yarn cap:open:android
```

Then build and run from Android Studio.

### Sync After Installing Plugins

If you add new Capacitor plugins, sync them:

```bash
yarn cap:sync
```

## Project Structure

```
src/
├── components/        # Reusable Vue components
│   ├── DayDetailModal.vue
│   └── NavigationBar.vue
├── views/            # Page components
│   ├── TodayView.vue
│   ├── WeekView.vue
│   ├── MonthView.vue
│   ├── ReportsView.vue
│   └── SettingsView.vue
├── stores/           # Pinia stores
│   └── habits.ts
├── composables/      # Composable functions
│   ├── useStats.ts
│   └── useNotifications.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── storage.ts
│   └── dates.ts
├── router/           # Vue Router configuration
│   └── index.ts
├── App.vue           # Root component
└── main.ts           # App entry point
```

## Usage Guide

### Daily Tracking

1. Open the app and navigate to the "Today" tab
2. Fill out the fields for your day:
   - Select mood tags
   - Enter sleep times
   - Log calories and foods
   - Track reading time
   - Check off prayer and Bible reading
   - Mark custom activities
3. Tap "Save Entry" to store your data

### Viewing History

- **Week View**: See all entries for the current week, navigate between weeks
- **Month View**: Calendar view of the entire month with color-coded mood indicators
- Click any day to see detailed information

### Reports

- View weekly and monthly statistics
- Track goal progress
- See averages for reading, calories, and sleep
- Get positive encouragement messages

### Settings

- **Fields**: Enable or disable tracking fields
- **Mood Tags**: Create, edit, and delete mood tags with custom colors
- **Custom Items**: Add custom checkboxes for activities you want to track
- **Goals**: Set weekly or monthly targets for any activity
- **Reminder**: Set a daily notification time

## Building for Production

### iOS Production Build

1. Build the web app: `yarn build`
2. Copy to iOS: `yarn cap:copy:ios`
3. Open Xcode: `yarn cap:open:ios`
4. Configure signing & provisioning
5. Build and archive for App Store

### Android Production Build

1. Build the web app: `yarn build`
2. Copy to Android: `yarn cap:copy:android`
3. Open Android Studio: `yarn cap:open:android`
4. Configure signing keys
5. Build APK or AAB for Play Store

## License

MIT
