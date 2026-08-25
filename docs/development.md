# Development Onboarding & Coding Standards

This guide outlines standards and development setups to follow for building **SunoGov**.

---

## Code Quality Rules

1. **TypeScript Strict Mode**:
   * Enforced in `frontend/tsconfig.json`.
   * **Avoid `any`**: Ensure all interface objects, handlers, and service responses are strongly typed using models in `frontend/src/types/index.ts`.

2. **Backend Input Validation**:
   * All FastAPI inputs and outputs must pass through Pydantic schemas in `backend/app/schemas/schemas.py`.

3. **Centralized Service Layer**:
   * Keep React components lean.
   * Do **NOT** place direct `fetch` or `axios` calls within pages or components. Coordinate all networking via the central `apiService` in `frontend/src/services/api.ts`.

4. **Security & Data Integrity Policies**:
   * **Never commit API credentials** to source files.
   * Store secrets in local environment variables (.env files) ignored by Git.
   * **Synthetic Data Only**: All testing scenarios must feature mocked numbers, names, and emails. Do not store or display real Aadhaar, PAN, OTP, or payment details.

---

## Design System Tokens & Guidelines

### 1. Typography & Readability
We use **Inter** as our main sans-serif font face.
* Titles: `font-bold text-neutral-900 tracking-tight`
* Body Copy: `text-sm text-neutral-600` (High readability, sufficient contrast)

### 2. UI Palette
* **Primary Blue** (`bg-primary-500` / `#1d5e93`): Trustworthy core elements, main button background, and links.
* **Accent Green** (`bg-accent-500` / `#0f9f6e`): Success cues, validated steps, and checkmarks.
* **Neutral Slate** (`bg-neutral-50` / `#fafafa`): Background shading.
* **Custom Keyboard Focus Ring**: Emits `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 outline-none` to guarantee screen-reader and tab navigation visual focus.

### 3. Accessible Layouts
* Minimum touch region: `min-h-[44px]` for any user actions (buttons, input text boxes, hamburger toggles) to fit standard touch safety targets.
* Accessible button and input labels, with screen-reader friendly tags like `aria-describedby` or `aria-invalid` to support screen readers.
