import type { Recipe, RecipeMeta, ActiveFilters } from '~/types/recipe'

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/õ/g, 'o')
    .trim()
}

function tokenize(query: string): string[] {
  return query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function matchesText(recipe: Recipe, tokens: string[]): boolean {
  if (tokens.length === 0) return true

  const searchableText = normalize(
    [
      recipe.title,
      recipe.description,
      recipe.meat.cutDisplay,
      recipe.meat.type,
      recipe.meat.cut,
      ...recipe.seasonings.map((s) => s.name),
      ...recipe.seasonings.map((s) => s.brand),
      ...recipe.tags,
    ].join(' ')
  )

  return tokens.every((token) => searchableText.includes(normalize(token)))
}

function autoDetectFilters(
  tokens: string[],
  meta: RecipeMeta
): { filters: Partial<ActiveFilters>; remainingTokens: string[] } {
  const filters: Partial<ActiveFilters> = {}
  const remaining: string[] = []

  // Try to match multi-word brand names first (e.g. "Blues Hog", "Meat Church")
  const fullQuery = tokens.join(' ')

  for (const brand of meta.brands) {
    if (normalize(fullQuery).includes(normalize(brand.label))) {
      filters.brand = brand.id
      // Remove matched brand tokens
      const brandTokens = tokenize(normalize(brand.label))
      const filteredTokens = tokens.filter(
        (t) => !brandTokens.includes(normalize(t))
      )
      tokens = filteredTokens
      break
    }
  }

  for (const token of tokens) {
    const norm = normalize(token)
    let matched = false

    // Check meat types
    for (const mt of meta.meatTypes) {
      if (normalize(mt.label) === norm || normalize(mt.id) === norm) {
        filters.meatType = mt.id
        matched = true
        break
      }
    }
    if (matched) continue

    // Check meat cuts
    for (const mc of meta.meatCuts) {
      if (
        normalize(mc.id) === norm ||
        normalize(mc.label).includes(norm)
      ) {
        filters.meatCut = mc.id
        matched = true
        break
      }
    }
    if (matched) continue

    // Check seasoning types
    for (const st of meta.seasoningTypes) {
      if (normalize(st.label) === norm || normalize(st.id) === norm) {
        filters.seasoningType = st.id
        matched = true
        break
      }
    }
    if (matched) continue

    remaining.push(token)
  }

  return { filters, remainingTokens: remaining }
}

export function useSearch(recipes: Ref<Recipe[]>, meta: Ref<RecipeMeta>) {
  const filters = reactive<ActiveFilters>({
    meatType: null,
    meatCut: null,
    brand: null,
    seasoningType: null,
    query: '',
  })

  const filteredRecipes = computed(() => {
    let result = [...recipes.value]

    // Apply faceted filters
    if (filters.meatType) {
      result = result.filter((r) => r.meat.type === filters.meatType)
    }

    if (filters.meatCut) {
      result = result.filter((r) => r.meat.cut === filters.meatCut)
    }

    if (filters.brand) {
      result = result.filter((r) =>
        r.seasonings.some(
          (s) => normalize(s.brand) === normalize(filters.brand!)
        )
      )
    }

    if (filters.seasoningType) {
      result = result.filter((r) =>
        r.seasonings.some((s) => s.type === filters.seasoningType)
      )
    }

    // Apply text search from query
    if (filters.query.trim()) {
      const tokens = tokenize(filters.query)
      const { filters: autoFilters, remainingTokens } = autoDetectFilters(
        tokens,
        meta.value
      )

      // Apply auto-detected filters (only if not already set manually)
      if (autoFilters.meatType && !filters.meatType) {
        result = result.filter((r) => r.meat.type === autoFilters.meatType)
      }
      if (autoFilters.meatCut && !filters.meatCut) {
        result = result.filter((r) => r.meat.cut === autoFilters.meatCut)
      }
      if (autoFilters.brand && !filters.brand) {
        result = result.filter((r) =>
          r.seasonings.some(
            (s) => normalize(s.brand) === normalize(autoFilters.brand!)
          )
        )
      }
      if (autoFilters.seasoningType && !filters.seasoningType) {
        result = result.filter((r) =>
          r.seasonings.some((s) => s.type === autoFilters.seasoningType)
        )
      }

      // Text match on remaining tokens
      if (remainingTokens.length > 0) {
        result = result.filter((r) => matchesText(r, remainingTokens))
      }
    }

    return result
  })

  function setQuery(q: string) {
    filters.query = q
  }

  function setFilter(key: keyof Omit<ActiveFilters, 'query'>, value: string | null) {
    filters[key] = value
  }

  function clearFilters() {
    filters.meatType = null
    filters.meatCut = null
    filters.brand = null
    filters.seasoningType = null
    filters.query = ''
  }

  function removeFilter(key: keyof Omit<ActiveFilters, 'query'>) {
    filters[key] = null
  }

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.meatType) count++
    if (filters.meatCut) count++
    if (filters.brand) count++
    if (filters.seasoningType) count++
    return count
  })

  return {
    filters,
    filteredRecipes,
    activeFilterCount,
    setQuery,
    setFilter,
    clearFilters,
    removeFilter,
  }
}
