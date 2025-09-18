# Multilingual Text-to-Speech Web Application

A Progressive Web App that allows users to input text in English, French, or Spanish and have it read aloud using the browser's speech synthesis capabilities.

## Features

- Text-to-speech in English, French, and Spanish
- Automatic language detection
- Male/Female voice selection
- Word count limit (500 words)
- Language composition analysis
- Works offline (PWA)
- No external APIs required

## Prerequisites

- Node.js (latest LTS version)
- Modern web browser (Chrome, Firefox, Edge, Safari)
- npm (comes with Node.js)

## Development Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ola-ws
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   This will open your default browser at `http://localhost:3000`

## Project Structure

```
ola-ws/
├── src/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # Styles
│   ├── js/
│   │   ├── app.js         # Main application logic
│   │   ├── languageDetection.js
│   │   └── speechSynthesis.js
│   ├── icons/             # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── service-worker.js  # PWA service worker
├── tests/
│   └── unit/
│       └── languageDetection.test.html
└── vite.config.js         # Vite configuration
```

## Testing

Open the test files in your browser to run the tests:
```
tests/unit/languageDetection.test.html
```

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

e-WTFPL