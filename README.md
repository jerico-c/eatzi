# Eatzi - Smart Recipe Finder

## 1. Introduction

Eatzi is an innovative web application designed to help users discover recipes based on ingredients they currently have. It aims to reduce food waste and inspire culinary creativity. Key features include AI-powered (simulated) ingredient recognition from images, personalized recipe recommendations based on dietary preferences, and detailed nutritional information for each recipe.

The application is built with React.js, TypeScript, and Tailwind CSS, utilizing Vite as the module bundler. Our slogan, "eat smart, cook easy," reflects our mission to simplify meal preparation by intelligently suggesting what to cook with available ingredients.

## 2. Features

* **Ingredient-Based Recipe Search:**
    * **Manual Input:** Users can type a list of ingredients they possess.
    * **Image Upload:** Users can upload a photo of their ingredients.
    * **Camera Capture:** Users can take a photo of their ingredients using their device's camera.
    * **AI Ingredient Recognition (Simulated):** Uploaded or captured images are processed by a client-side simulated AI to identify ingredients.
    * **Recipe Matching:** The system matches available ingredients with its recipe database.
* **Dietary Preference Filtering:**
    * Users can select dietary preferences (e.g., vegan, vegetarian, gluten-free) to filter recipes.
* **Nutritional Information Display:**
    * Each recipe shows key nutritional values like calories, protein, fat, carbohydrates, and fiber.
* **Recipe Feedback:**
    * Users can "like" or "dislike" recipes.
    * Feedback counts are updated and displayed on each recipe.
* **Responsive User Interface:**
    * Modern and mobile-friendly design using Tailwind CSS.
    * Optimized for various screen sizes, including mobile devices (target 350px width, 600px height).
    * The primary color scheme revolves around pastel orange (the "foodie" theme).

## 3. Technology Stack

* **Frontend Framework:** React.js (v18.3.1)
* **Language:** TypeScript (v5.5.3) , JavaScript
* **Styling:** Tailwind CSS (v3.4.11) with PostCSS
* **UI Components:** Shadcn/ui
* **Module Bundler:** Vite (v5.4.1)
* **Routing:** React Router DOM (v6.26.2)
* **State Management:** React Hooks (`useState`, `useEffect`), Context API
* **Linting:** ESLint (v9.9.0) with TypeScript ESLint plugin
* **AI/ML (Simulated):** Fast API
* **Planned Backend API:** Hapi Framework
* **Planned Database:** PostgreSQL

## 4. Project Structure

The project follows a standard Vite + React + TypeScript structure:

```
eatzi/
├── public/
│   └── images/
│       └── logo-navbar.png       # Referenced in Header component
├── src/
│   ├── components/
│   │   ├── ui/                   # Shadcn/ui components (e.g., button.tsx, card.tsx)
│   │   ├── about/                # Components specific to the About page
│   │   ├── CameraInput.tsx
│   │   ├── DietaryFilter.tsx
│   │   ├── FileInput.tsx
│   │   ├── Header.tsx
│   │   ├── IngredientInput.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   └── RecipeList.tsx
│   ├── context/
│   │   └── RecipeContext.tsx     # Global state for recipes, ingredients, preferences
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts              # Utility functions (e.g., cn for classnames)
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Index.tsx             # Home page
│   │   ├── NotFound.tsx          # 404 page
│   │   ├── Recipe.tsx            # Single recipe view
│   │   └── Recipes.tsx           # Recipe listing page
│   ├── utils/
│   │   ├── aiRecognition.ts      # Simulated AI logic
│   │   └── mockData.ts           # Mock data for ingredients and recipes
│   ├── App.css
│   ├── App.tsx                   # Main application component with routing
│   ├── index.css                 # Tailwind CSS setup and custom styles
│   ├── main.tsx                  # React application entry point
│   └── vite-env.d.ts
├── .eslintrc.cjs                 # ESLint configuration (Note: filename is eslint.config.js in provided files)
├── components.json               # Shadcn/ui configuration
├── index.html                    # Main HTML file
├── package.json                  # Project metadata and dependencies
├── package-lock.json
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # Main TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.js                # Vite build tool configuration
```

*(Note: Some JSX files (`.jsx`) are present alongside `.tsx` files in the provided structure.)*

## 5. Getting Started

### Prerequisites

* Node.js (version specified in `package.json` or latest LTS)
* npm (comes with Node.js)

### Installation

1.  **Clone the repository (if applicable) or extract the project files.**
2.  **Navigate to the project directory:**
    ```bash
    cd path/to/eatzi
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the application in development mode:

```bash
npm run dev
```

This will start the Vite development server. By default, it should be accessible at `http://localhost:8080`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The bundled static assets will be placed in the `dist/` directory.

### Linting

To check the code for linting errors and warnings:

```bash
npm run lint
```

## 6. Key Components and Modules

* **`App.tsx`**:
    * Sets up main application routing using `react-router-dom`.
    * Wraps the application with context providers (`QueryClientProvider`, `TooltipProvider`, `RecipeProvider`).
    * Manages global UI elements like `Toaster` and `Sonner`.
* **`RecipeContext.tsx`**:
    * Handles global state for selected ingredients, dietary preferences, and recipe data (including likes/dislikes).
    * Provides functions for adding/removing ingredients, filtering recipes, and updating feedback.
* **`aiRecognition.ts`**:
    * Simulates AI-based ingredient recognition from image data.
    * Includes `captureImage` function to access the device camera via `navigator.mediaDevices.getUserMedia`.
* **Page Components (`src/pages/`)**:
    * `Index.tsx`: Landing page with ingredient input options.
    * `Recipes.tsx`: Displays filtered recipes based on selected ingredients and preferences.
    * `Recipe.tsx`: Shows detailed information for a single recipe.
    * `About.jsx`: Contains information about the project.
* **Input Components (`src/components/`)**:
    * `IngredientInput.tsx`: For manual and bulk ingredient entry.
    * `CameraInput.tsx`: For capturing ingredient images via camera.
    * `FileInput.tsx`: For uploading ingredient images.
* **UI (`src/components/ui/`)**:
    * Leverages Shadcn/ui for a consistent set of accessible and customizable UI components (Buttons, Cards, Dialogs, etc.).

## 7. Configuration

* **`vite.config.js`**: Vite configuration, including server options and plugins.
* **`tailwind.config.ts`**: Tailwind CSS theme customization, including the "foodie" color palette and custom animations.
* **`tsconfig.json` (and variants)**: TypeScript compiler settings.
* **`postcss.config.js`**: PostCSS plugin configuration (Tailwind CSS, Autoprefixer).
* **`eslint.config.js`**: ESLint rules and plugin configurations.

## 8. API (Planned)

The project aims to integrate with a RESTful API built using the **Hapi Framework**. This backend service will be responsible for:
* Storing and managing a comprehensive recipe database.
* Persisting user feedback (likes and dislikes).
* Potentially handling more sophisticated AI processing in future iterations.

Currently, the application relies on mock data located in `src/utils/mockData.ts`.

## 9. Future Enhancements

* **Full Backend API Integration:** Connect to a live Hapi API.
* **User Authentication:** Implement user accounts for personalized experiences.
* **Real AI Model Integration:** Replace simulated AI with a robust machine learning model for ingredient detection.
* **PWA Capabilities:** Enhance with service workers for offline access and caching.
* **Advanced Recipe Filtering:** Add options like cooking time, cuisine type, etc.
* **Meal Planning Features.**
