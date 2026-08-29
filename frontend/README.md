# SunoGov - Frontend

This is the citizen-facing React web client for **SunoGov**, built with TypeScript, Vite, Tailwind CSS, and React Router.

---

## Directory Structure

```text
frontend/
├── src/
│   ├── components/
│   │   └── ui/         # Accessible custom design tokens (Button, Input, Card, Badge)
│   ├── data/           # Local mock scenarios and diagnostic constants
│   ├── layouts/        # Page framework shells (RootLayout)
│   ├── pages/          # View path placeholders (Home, Report, Review, Success, Track, Resources)
│   ├── services/       # Centralized API query service wrapper
│   ├── types/          # Shared type contract definitions
│   ├── App.tsx         # Central routing configurations
│   ├── index.css       # Tailwind CSS base overrides
│   ├── main.tsx        # React bootstrap mounting point
│   └── vite-env.d.ts   # Vite environment definitions
├── index.html          # Web page entry template
├── package.json        # Build and package details
├── tailwind.config.js  # Color palette, spacing, and font properties
└── vite.config.ts      # Vite compiling settings
```

---

## Installation & Setup

1. **Install Dependencies**:
   Ensure you have Node.js (v20+) installed.
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Duplicate `.env.example` as `.env` and adjust the API URL if the backend runs on a different port:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The site will load at [http://localhost:5173](http://localhost:5173).

---

## UI Components & Design Rules

* **Mobile-First Responsive Layout**: Standardized on flex and grid layouts wrapping at the `sm` and `md` Tailwind breakpoints.
* **Accessible Inputs & Buttons**: All inputs are labeled, announce validation errors via `aria-describedby` alerts, and enforce a minimum vertical touch region of `44px` for touch accessibility.
* **Custom Keyboard Focus**: All clickable layout items feature custom `:focus-visible` focus rings (using the primary theme color).
* **Brand Protection**: Visual styling avoids copying official EPFO or Indian Government headers, emblems, colors, and slogans.


### Production Builds
Run `npm run build` to compile the app to the static `dist/` directory.