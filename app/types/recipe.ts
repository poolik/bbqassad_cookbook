// ===== BBQ Ässad Kokaraamat – Recipe Data Types =====

export interface Video {
  youtubeId: string
  url: string
  title: string
  thumbnailUrl: string
  duration: string // ISO 8601 duration, e.g. "PT25M30S"
  publishedAt: string // ISO date
}

export interface Meat {
  type: string // normalized lowercase, e.g. "veis", "siga"
  cut: string // normalized lowercase, e.g. "brisket", "ribid"
  cutDisplay: string // human-readable Estonian
  weight: string
  notes?: string
}

export type SeasoningType = 'rub' | 'sauce' | 'marinade' | 'injection' | 'muu'

export interface Seasoning {
  name: string
  type: SeasoningType
  brand: string
  amount: string
  shopUrl: string
  optional: boolean
}

export type Difficulty = 'lihtne' | 'keskmine' | 'keeruline'

export interface TemperaturePhase {
  temperature: string
  duration?: string
  description: string
}

export interface CookingOverview {
  totalTime: string
  prepTime: string
  cookTime: string
  restTime: string
  temperature: string
  temperaturePhases?: TemperaturePhase[]
  difficulty: Difficulty
  servings: number
}

export interface Step {
  stepNumber: number
  title: string
  description: string
  temperature: string | null
  duration: string
  thumbnailUrl: string
  videoTimestamp: number // seconds into the video
  tips: string[]
}

export interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  video: Video
  meat: Meat
  seasonings: Seasoning[]
  equipment: string[]
  cookingOverview: CookingOverview
  steps: Step[]
  tags: string[]
  relatedRecipes: string[]
  createdAt: string
  updatedAt: string
}

// ===== Meta / Faceted Search Types =====

export interface MetaOption {
  id: string
  label: string
}

export interface MeatCutOption extends MetaOption {
  meatType: string
}

export interface RecipeMeta {
  meatTypes: MetaOption[]
  meatCuts: MeatCutOption[]
  brands: MetaOption[]
  seasoningTypes: MetaOption[]
}

// ===== Search / Filter Types =====

export interface ActiveFilters {
  meatType: string | null
  meatCut: string | null
  brand: string | null
  seasoningType: string | null
  query: string
}
