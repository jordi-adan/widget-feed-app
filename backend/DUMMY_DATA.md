# Dummy Data Feature

The Widget Feed backend now supports loading sample data on startup using command-line flags.

## 🎭 Features

- **Command-line flags**: Use `--dummy-data` or `-d` to enable dummy data loading
- **PRD-compliant widgets**: Creates sample widgets using all 6 PRD widget types
- **Realistic content**: Each widget contains properly formatted JSON content
- **Staggered timestamps**: Widgets are created with different timestamps for natural ordering
- **Clear feedback**: Console logging shows loading progress and results

## 🚀 Usage

### Development Mode
```bash
# Start development server with dummy data
npm run dev:dummy

# Or manually with flag
npm run dev -- --dummy-data
```

### Production Mode
```bash
# Build and start with dummy data
npm run build
npm run start:dummy

# Or manually with flag
node dist/app.js --dummy-data
```

### Direct Execution
```bash
# Using short flag
node dist/app.js -d

# Using full flag
node dist/app.js --dummy-data
```

## 📊 Sample Data

The dummy data service creates **8 sample widgets** covering all PRD widget types:

1. **text_block** - Welcome message and getting started guide
2. **expandable_list** - Features list and recent updates
3. **horizontal_cards** - Popular categories showcase
4. **image_list** - Image gallery with placeholder images
5. **highlight_banner** - Special announcements
6. **quick_actions** - Action buttons and shortcuts

## 🧪 Testing

```bash
# Run all tests including dummy data service tests
npm test

# Run only dummy data service tests
npm test -- --testPathPattern=DummyDataService
```

## 📝 Example Output

When starting with dummy data flag:

```
🎭 Dummy data flag detected, loading sample data...
🎭 Loading dummy data...
✅ Successfully loaded 8 dummy widgets
🚀 Widget Feed API Server is running on http://localhost:3001
📊 Health check available at http://localhost:3001/health
🎯 PRD Widget API at http://localhost:3001/widgets
🔗 Legacy Widget API at http://localhost:3001/api/widgets
🎭 Server started with dummy data loaded
```

When starting without dummy data flag:

```
🚀 Widget Feed API Server is running on http://localhost:3001
📊 Health check available at http://localhost:3001/health
🎯 PRD Widget API at http://localhost:3001/widgets
🔗 Legacy Widget API at http://localhost:3001/api/widgets
💡 Tip: Use --dummy-data or -d flag to load sample data
```

## 🔧 Implementation Details

- **DummyDataService**: Located in `src/infrastructure/services/DummyDataService.ts`
- **Command-line parsing**: Built into `src/app.ts`
- **Widget validation**: All widgets use PRD-compliant types only
- **Content format**: All content is valid JSON matching widget type expectations
- **Error handling**: Graceful handling of widget creation failures
- **Repository integration**: Works with InMemory repository implementation

## 📋 Widget Type Coverage

All PRD-compliant widget types are included:

| Type | Count | Description |
|------|-------|-------------|
| `text_block` | 2 | Text content with titles and styling |
| `expandable_list` | 2 | Collapsible lists with items |
| `horizontal_cards` | 1 | Card layout with images |
| `image_list` | 1 | Gallery-style image display |
| `highlight_banner` | 1 | Announcement banners |
| `quick_actions` | 1 | Action button grids |

**Total: 8 sample widgets**
