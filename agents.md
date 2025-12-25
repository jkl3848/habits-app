# AI Agent Guidelines for Habits Tracker App

## Project Overview

This is a mobile habits tracking application built with Vue 3, TypeScript, Tailwind CSS, and Capacitor. It includes a comprehensive test suite.

## Core Technologies

- **Frontend**: Vue 3.5.24 with Composition API and TypeScript
- **Build**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18 with @tailwindcss/postcss
- **State**: Pinia 3.0.4
- **Mobile**: Capacitor 8.0.0
- **Testing**: Vitest 4.0.16 with @vue/test-utils
- **Package Manager**: Yarn 4.11.0 (use yarn, not npm)

## Important Guidelines

### Documentation

⚠️ **DO NOT create new markdown or documentation files unless explicitly requested by the user.**

The project already has comprehensive documentation:

- `README.md` - Main documentation
- `PROJECT_SUMMARY.md` - Project overview
- `TEST_CHECKLIST.md` - Testing documentation
- `setup.md` - Original requirements

### Package Manager

- Always use `yarn` commands, never `npm`
- Run scripts with `yarn <script>` not `npm run <script>`
- Capacitor commands use yarn: `yarn cap:sync`, `yarn cap:open:ios`, etc.

### Code Standards

**TypeScript**

- Strict mode is enabled
- All types are defined in `src/types/index.ts`
- Use explicit types, avoid `any` except in test mocks
- Use non-null assertions (`!`) sparingly and only when certain

**Vue**

- Use Composition API with `<script setup lang="ts">`
- Define props and emits with TypeScript
- Use Pinia stores for state management
- Lazy load routes in router configuration

**Styling**

- Use Tailwind CSS utility classes
- Tailwind v4 requires `@tailwindcss/postcss` plugin
- Do not use inline styles except for dynamic values (colors, CSS variables)
- Follow mobile-first responsive design

### Testing

**Test Requirements**

- Run tests before making significant changes: `yarn test`
- Maintain or improve existing coverage
- Mock external dependencies (localStorage, Capacitor APIs)
- Use AAA pattern (Arrange, Act, Assert)
- Handle edge cases (null, undefined, boundary values)

**Test Structure**

- Tests are in `src/__tests__/` mirroring source structure
- Use Vitest for all tests
- Use `@vue/test-utils` for Vue component testing
- Use `happy-dom` as the test environment

**Coverage Expectations**

- Utilities: Aim for 100% coverage
- Stores/Composables: Aim for 95%+ coverage
- Components: Test critical paths and user interactions

### File Organization

```
src/
├── __tests__/         # Test files (mirror source structure)
├── components/        # Reusable Vue components
├── views/            # Page components
├── stores/           # Pinia stores
├── composables/      # Composable functions
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── router/           # Vue Router configuration
```

### Common Tasks

**Running the App**

```bash
yarn dev              # Development server
yarn build            # Production build
yarn preview          # Preview production build
```

**Testing**

```bash
yarn test             # Run all tests
yarn test --watch     # Watch mode
yarn test:ui          # Interactive UI
yarn test:coverage    # Coverage report
```

**Mobile Development**

```bash
yarn cap:sync         # Sync web code with native
yarn cap:open:ios     # Open in Xcode
yarn cap:open:android # Open in Android Studio
```

### Data Storage

- All data is stored in localStorage
- Storage utilities are in `src/utils/storage.ts`
- All storage operations return Promises for consistency
- Keys: `habits-entries`, `habits-settings`

### State Management

- Central store: `src/stores/habits.ts`
- Initialize store on app startup
- Store includes entries, settings, tags, goals, and custom checkboxes
- Always save to storage after state changes

### Common Patterns

**Dates**

- Use `src/utils/dates.ts` for all date operations
- Dates are stored as ISO strings (YYYY-MM-DD)
- Use `formatDate()` for consistent formatting
- Handle overnight sleep calculations correctly

**Statistics**

- Use `src/composables/useStats.ts` for calculations
- Always filter out null values before averaging
- Return null when no valid data exists
- Calculate percentages as integers (0-100)

**Notifications**

- Use `src/composables/useNotifications.ts`
- Check `isNativePlatform` before using Capacitor APIs
- Notifications only work on real iOS/Android devices
- Request permissions before scheduling

### Error Handling

- Log errors to console with descriptive messages
- Return sensible defaults (null, empty array, false)
- Don't throw errors in production code
- Test error cases in test suite

### Making Changes

1. **Read before editing**: Always check current file contents
2. **Run tests**: Verify tests pass before and after changes
3. **Update tests**: Modify tests if you change functionality
4. **No new docs**: Don't create summary documents after changes
5. **Use yarn**: Never use npm commands

### Git

- User will handle commits and staging
- Never automatically stage or commit files
- Only commit if explicitly requested by user

### What NOT to Do

❌ Create new markdown files without explicit request  
❌ Create summary documents after making changes  
❌ Use npm instead of yarn  
❌ Add inline styles without good reason  
❌ Modify test files without running them  
❌ Create temporary files that aren't cleaned up  
❌ Ignore TypeScript errors  
❌ Break existing tests  
❌ Auto-commit changes

### Project-Specific Notes

**Tailwind v4 Changes**

- Uses `@tailwindcss/postcss` instead of `tailwindcss` plugin
- Config in `postcss.config.js` and `tailwind.config.js`
- CSS custom properties for dynamic colors: `--tw-ring-color`

**Capacitor Setup**

- iOS platform in `ios/` directory
- Android platform in `android/` directory
- Config in `capacitor.config.ts`
- Local Notifications plugin installed

**Type Definitions**

- `DailyEntry`: Core entry type with all tracked fields
- `Settings`: App settings including tags, goals, enabled fields
- `Tag`: Mood tag with id, text, color
- `Goal`: Goal with field key, targets (weekly/monthly)
- `CustomCheckbox`: User-defined tracking item

## Need Help?

- Check existing code for patterns
- Review test files to understand expected behavior
- Refer to `README.md` for user-facing documentation
- Check `setup.md` for original requirements
