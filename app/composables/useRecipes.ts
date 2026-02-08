import type { Recipe, RecipeMeta } from '~/types/recipe'
import metaData from '../../content/meta.json'

// Dynamically import all recipe JSON files from content/recipes/
const recipeModules = import.meta.glob<Recipe>('../../content/recipes/*.json', { eager: true, import: 'default' })
const allRecipes: Recipe[] = Object.values(recipeModules)

export function useRecipes() {
  const recipes = ref<Recipe[]>(allRecipes)
  const meta = ref<RecipeMeta>(metaData as RecipeMeta)

  function getRecipeBySlug(slug: string): Recipe | undefined {
    return allRecipes.find((r) => r.slug === slug)
  }

  function getRelatedRecipes(slugs: string[]): Recipe[] {
    return allRecipes.filter((r) => slugs.includes(r.slug))
  }

  return {
    recipes,
    meta,
    getRecipeBySlug,
    getRelatedRecipes,
  }
}
