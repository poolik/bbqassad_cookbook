---
name: BBQ Cookbook Website
overview: Build a Nuxt 3 static cookbook website for BBQ Ässad recipes with PrimeVue components, a well-defined JSON recipe data structure, Estonian language UI, searchable by ingredients/sauces/meat cuts, and deployed to GitHub Pages.
todos:
  - id: scaffold-nuxt
    content: Scaffold Nuxt 3 project with PrimeVue, @nuxt/icon (Iconify), TypeScript, dark Aura theme, and nuxt.config.ts
    status: pending
  - id: typescript-types
    content: Define TypeScript interfaces in types/recipe.ts matching the JSON data structure
    status: pending
  - id: sample-data
    content: Create meta.json and 2-3 sample recipe JSON files in content/ directory
    status: pending
  - id: composables
    content: Build useRecipes.ts and useSearch.ts composables for data loading and search/filter logic
    status: pending
  - id: layout-header-footer
    content: Create default layout with AppHeader and AppFooter, dark branding matching bbqassad.ee
    status: pending
  - id: home-page
    content: Build index.vue with hero, search bar, filter chips/dropdowns, and recipe card grid
    status: pending
  - id: recipe-card
    content: Build RecipeCard.vue component with thumbnail, title, tags, cooking time
    status: pending
  - id: recipe-detail-page
    content: Build retseptid/[slug].vue with video embed, cooking overview, seasonings, meat, equipment
    status: pending
  - id: recipe-steps
    content: Build RecipeSteps.vue timeline component with thumbnails, timestamps, and tips
    status: pending
  - id: search-filters
    content: Build RecipeSearch.vue and RecipeFilters.vue with natural language tokenization + faceted filtering
    status: pending
  - id: responsive-styling
    content: Polish responsive design, mobile drawer filters, hover effects, custom dark theme CSS
    status: pending
  - id: github-actions
    content: Create .github/workflows/deploy.yml for GitHub Pages deployment
    status: pending
isProject: false
---

# BBQ Ässad Kokaraamat - Cookbook Website Plan

## Technology Stack

- **Framework**: Nuxt 3 (SSG mode for static generation)
- **UI Library**: PrimeVue 4 with `@primevue/nuxt-module`
- **Icons**: `@nuxt/icon` (Iconify) -- provides 200,000+ icons via `<Icon name="mdi:fire" />` syntax. Primary icon sets used: **Material Design Icons (mdi)** for BBQ-specific icons (thermometer, fire, timer, food-steak, silverware) and **Lucide** for general UI icons (search, shopping-cart, chevrons, external-link). PrimeIcons still used internally by PrimeVue components.
- **Styling**: PrimeVue Aura dark theme + custom CSS variables to match bbqassad.ee branding (dark background, orange/amber accents, smoky feel)
- **Language**: TypeScript throughout
- **Deployment**: GitHub Pages via GitHub Actions (`nuxt build --preset github_pages`)
- **Data**: Static JSON files in `content/recipes/` directory, loaded at build time

---

## JSON Recipe Data Structure

The core data model that the future AI tool will produce. Located at `content/recipes/*.json` (one file per recipe or a single `recipes.json`).

```json
{
  "id": "veise-brisket-blues-hog",
  "title": "Veise Brisket Blues Hog kastmega",
  "slug": "veise-brisket-blues-hog",
  "description": "Klassikaline Texase stiilis brisket, valmistatud Blues Hog Original kastmega ja Sweet & Savory maitseaineseguga.",
  "video": {
    "youtubeId": "dQw4w9WgXcQ",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Kuidas valmistada täiuslikku brisketit",
    "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "duration": "PT25M30S",
    "publishedAt": "2024-06-15"
  },
  "meat": {
    "type": "veis",
    "cut": "brisket",
    "cutDisplay": "Veise brisket (rinnaosa)",
    "weight": "5-7 kg",
    "notes": "Vali hästi marmorsena liha, USDA Choice või kõrgem"
  },
  "seasonings": [
    {
      "name": "Blues Hog Sweet and Savory",
      "type": "rub",
      "brand": "Blues Hog",
      "amount": "4 spl",
      "shopUrl": "https://bbqassad.ee/toode/blues-hog-sweet-and-savory/",
      "optional": false
    },
    {
      "name": "Blues Hog Original kaste",
      "type": "sauce",
      "brand": "Blues Hog",
      "amount": "200 ml",
      "shopUrl": "https://bbqassad.ee/toode/blues-hog-original/",
      "optional": false
    }
  ],
  "equipment": [
    "Kamado / offset suitsuahi",
    "Lihatermomeeter",
    "Foolium / butcher paper"
  ],
  "cookingOverview": {
    "totalTime": "12-14 tundi",
    "prepTime": "30 minutit",
    "cookTime": "10-12 tundi",
    "restTime": "1-2 tundi",
    "temperature": "110-120°C",
    "difficulty": "keskmine",
    "servings": 12
  },
  "steps": [
    {
      "stepNumber": 1,
      "title": "Liha ettevalmistus",
      "description": "Lõika üleliigne rasv ära, jättes umbes 5mm paksuse rasvakihi. Kata liha ühtlaselt maitseaineseguga.",
      "temperature": null,
      "duration": "20 minutit",
      "thumbnailUrl": "/images/recipes/veise-brisket/step-1.jpg",
      "videoTimestamp": 45,
      "tips": [
        "Lase lihal enne maitseainesegu lisamist toatemperatuurile jõuda"
      ]
    },
    {
      "stepNumber": 2,
      "title": "Suitsuahi ettevalmistus",
      "description": "Küta suitsuahi 110°C peale. Lisa tammepuidu tükke suitsu tekitamiseks.",
      "temperature": "110°C",
      "duration": "30 minutit",
      "thumbnailUrl": "/images/recipes/veise-brisket/step-2.jpg",
      "videoTimestamp": 180,
      "tips": ["Kasuta tamme- või hikkoripuitu"]
    }
  ],
  "tags": ["veis", "brisket", "suitsetamine", "low-and-slow", "blues-hog"],
  "relatedRecipes": ["pulled-pork-tennessee-red"],
  "createdAt": "2024-06-15",
  "updatedAt": "2024-06-15"
}
```

Key design decisions for the JSON structure:

- `meat.type` and `meat.cut` are normalized lowercase strings (used for filtering/search)
- `seasonings[].type` is one of: `"rub"`, `"sauce"`, `"marinade"`, `"injection"`, `"muu"` (other)
- `seasonings[].shopUrl` links back to bbqassad.ee shop (affiliate-friendly)
- `steps[].videoTimestamp` stores seconds into the YouTube video for deep-linking
- `steps[].thumbnailUrl` stores the path to a step screenshot from the video
- `tags` array enables flexible search/filtering
- `cookingOverview.difficulty` is one of: `"lihtne"`, `"keskmine"`, `"keeruline"`

A companion `meta.json` will hold all known values for faceted search:

```json
{
  "meatTypes": [
    { "id": "veis", "label": "Veis" },
    { "id": "siga", "label": "Siga" },
    { "id": "kana", "label": "Kana" },
    { "id": "lammas", "label": "Lammas" }
  ],
  "meatCuts": [
    { "id": "brisket", "label": "Brisket (rinnaosa)", "meatType": "veis" },
    { "id": "valisfilee", "label": "Välisfilee", "meatType": "veis" },
    { "id": "ribid", "label": "Ribid", "meatType": "siga" },
    { "id": "pulled-pork", "label": "Pulled Pork (abaluu)", "meatType": "siga" }
  ],
  "brands": [
    { "id": "blues-hog", "label": "Blues Hog" },
    { "id": "meat-church", "label": "Meat Church" },
    { "id": "kosmos-q", "label": "Kosmo's Q" },
    { "id": "heath-riles", "label": "Heath Riles" },
    { "id": "cooklounge", "label": "Cooklounge" }
  ],
  "seasoningTypes": [
    { "id": "rub", "label": "Maitseainesegu" },
    { "id": "sauce", "label": "Kaste" },
    { "id": "marinade", "label": "Marinaad" },
    { "id": "injection", "label": "Süstimine" }
  ]
}
```

---

## Project Structure

```
bbqassad_cookbook/
  nuxt.config.ts              # Nuxt config with PrimeVue, SSG, base URL
  package.json
  tsconfig.json
  app.vue                     # Root layout (dark theme wrapper)
  content/
    recipes/                  # All recipe JSON files
      veise-brisket-blues-hog.json
      ...
    meta.json                 # Faceted search metadata
  types/
    recipe.ts                 # TypeScript interfaces for the JSON structure
  composables/
    useRecipes.ts             # Load & search recipes composable
    useSearch.ts              # Full-text + faceted search logic
  components/
    AppHeader.vue             # Site header with logo + nav
    AppFooter.vue             # Footer
    RecipeCard.vue            # Card for recipe list (thumbnail, title, tags)
    RecipeSearch.vue          # Search bar + filter chips
    RecipeFilters.vue         # Sidebar/drawer with faceted filters
    RecipeSteps.vue           # Step-by-step cooking instructions
    SeasoningBadge.vue        # Badge linking to bbqassad.ee shop
    VideoEmbed.vue            # YouTube embed with timestamp deep-links
    CookingOverview.vue       # Time/temp/servings summary bar
  layouts/
    default.vue               # Default layout with header/footer
  pages/
    index.vue                 # Home: search + recipe grid
    retseptid/
      [slug].vue              # Individual recipe page
  public/
    images/
      logo.svg                # BBQ Ässad cookbook logo
      recipes/                # Step thumbnails per recipe
    favicon.ico
  .github/
    workflows/
      deploy.yml              # GitHub Actions for GitHub Pages deploy
```

---

## Pages and Components Detail

### Page 1: Home / Recipe List (`pages/index.vue`)

- **Hero section**: Dark background with smoky overlay, site title "BBQ Ässad Kokaraamat", subtitle "Parimad BBQ retseptid samm-sammult"
- **Search bar**: PrimeVue `InputText` (or `IconField`) with a prominent search input. Supports natural Estonian queries like "mul on Tennessee Red kaste" or "veise valisfilee"
- **Filter chips**: Row of PrimeVue `Chip` / `Tag` components showing active filters (meat type, brand, seasoning type)
- **Filter sidebar/panel**: PrimeVue `Select` or `MultiSelect` dropdowns for: liha tuurp (meat type), lihaloik (meat cut), brändi (brand), maitsestaja tuurp (seasoning type)
- **Recipe grid**: CSS Grid of `RecipeCard` components. Each card shows:
  - YouTube thumbnail as card image
  - Recipe title
  - Meat cut badge
  - Key seasonings as small tags
  - Cooking time + difficulty indicator
  - Hover effect with scale transform
- **Search logic** (in `useSearch.ts`):
  - Fuzzy text search across `title`, `description`, `meat.cutDisplay`, `seasonings[].name`, `tags`
  - Exact faceted filtering on `meat.type`, `meat.cut`, `seasonings[].brand`, `seasonings[].type`
  - The "natural language" style queries work by tokenizing the input and matching against known values from `meta.json`

### Page 2: Recipe Detail (`pages/retseptid/[slug].vue`)

- **Video section**: Embedded YouTube player (via `VideoEmbed.vue` using `<iframe>` with the `youtubeId`)
- **Cooking overview bar** (`CookingOverview.vue`): Horizontal bar showing prep time, cook time, rest time, temperature, servings, difficulty -- using Iconify icons (`mdi:timer-outline`, `mdi:thermometer`, `mdi:fire`, `lucide:users`, `mdi:speedometer`)
- **Ingredients/Seasonings panel**: List of all seasonings with:
  - Brand logo/icon
  - Product name
  - Amount needed
  - "Osta" (Buy) button linking to bbqassad.ee shop URL
  - PrimeVue `Tag` for type (rub/sauce/marinade)
- **Meat section**: Display the meat type, cut, weight, and any notes
- **Equipment list**: Simple list with Iconify icons (e.g. `mdi:grill`, `mdi:thermometer-lines`, `mdi:knife`)
- **Step-by-step instructions** (`RecipeSteps.vue`):
  - Vertical timeline layout (using PrimeVue `Timeline` component or custom CSS)
  - Each step shows: step number, title, description, temperature (if relevant), duration
  - Thumbnail image from the video for that step
  - "Vaata videos" (Watch in video) link that opens YouTube at `videoTimestamp`
  - Tips shown in a callout/info box
- **Related recipes**: Cards at the bottom linking to related recipes

---

## Visual Design (matching bbqassad.ee)

- **Theme**: PrimeVue Aura Dark preset, customized with:
  - Primary color: `#E87A20` (warm orange/amber, matching BBQ Ässad brand)
  - Surface/background: `#1a1a1a` / `#0d0d0d` (deep dark, near black)
  - Surface card: `#252525` (slightly lighter dark for cards)
  - Text: `#f5f5f5` (warm white)
  - Accent: `#c0392b` (deep red for BBQ accents, fire imagery)
- **Typography**: Clean sans-serif (Inter or similar), bold headings
- **Cards**: Rounded corners, subtle shadow, hover lift effect
- **Imagery**: Warm tones, smoky overlays where appropriate
- **Responsive**: Mobile-first grid, collapsible filters on mobile using PrimeVue `Drawer`

---

## Search Implementation Detail

The search in `useSearch.ts` will work as follows:

1. **Load all recipes** from JSON at build time (SSG) and hydrate into a reactive store
2. **Tokenize user input**: Split query into words, normalize Estonian characters
3. **Match against meta.json**: Check if any token matches a known sauce name, brand, meat type, or cut. Automatically apply as faceted filter
4. **Text search**: Remaining tokens do substring matching against recipe title, description, tags, and seasoning names
5. **Combine results**: Return recipes matching ALL active filters (AND logic for facets, OR within same facet)

This enables queries like:

- "Tennessee Red" -> matches `seasonings[].name` containing "Tennessee Red"
- "veise valisfilee" -> matches `meat.type: "veis"` + `meat.cut: "valisfilee"`
- "Blues Hog kana" -> matches `seasonings[].brand: "Blues Hog"` + `meat.type: "kana"`

---

## GitHub Pages Deployment

- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Runs `npx nuxt build --preset github_pages`
- Uploads `.output/public` as artifact
- Deploys via `actions/deploy-pages`
- Set `NUXT_APP_BASE_URL` to `/bbqassad_cookbook/` (repo name) unless using custom domain

---

## Sample Recipe Data

Include 2-3 example recipe JSON files with realistic (but placeholder) data to demonstrate the website works. These will serve as templates for the future AI extraction tool.
