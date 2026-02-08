<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { getRecipeBySlug, getRelatedRecipes } = useRecipes()

const recipe = getRecipeBySlug(slug)

if (!recipe) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Retsepti ei leitud',
  })
}

const related = computed(() => getRelatedRecipes(recipe.relatedRecipes))

useHead({
  title: `${recipe.title} – BBQ Ässad Kokaraamat`,
  meta: [
    { name: 'description', content: recipe.description },
  ],
})
</script>

<template>
  <div v-if="recipe" class="recipe-detail container">
    <!-- Back navigation -->
    <NuxtLink to="/" class="back-link">
      <Icon name="lucide:arrow-left" />
      Tagasi retseptide juurde
    </NuxtLink>

    <!-- Title -->
    <h1 class="recipe-title">{{ recipe.title }}</h1>
    <p class="recipe-description">{{ recipe.description }}</p>

    <!-- Video -->
    <section class="section">
      <VideoEmbed :youtube-id="recipe.video.youtubeId" :title="recipe.video.title" />
    </section>

    <!-- Cooking Overview -->
    <section class="section">
      <h2 class="section-title">
        <Icon name="mdi:timer-outline" />
        Ülevaade
      </h2>
      <CookingOverview :overview="recipe.cookingOverview" />
    </section>

    <!-- Two Column Layout -->
    <div class="two-columns">
      <!-- Left: Seasonings + Meat + Equipment -->
      <div class="left-column">
        <!-- Seasonings -->
        <section class="section">
          <h2 class="section-title">
            <Icon name="mdi:shaker-outline" />
            Maitseained
          </h2>
          <div class="seasonings-list">
            <SeasoningBadge
              v-for="seasoning in recipe.seasonings"
              :key="seasoning.name"
              :seasoning="seasoning"
            />
          </div>
        </section>

        <!-- Meat -->
        <section class="section">
          <h2 class="section-title">
            <Icon name="mdi:food-steak" />
            Liha
          </h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Tüüp</span>
              <span class="info-value">{{ recipe.meat.cutDisplay }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Kaal</span>
              <span class="info-value">{{ recipe.meat.weight }}</span>
            </div>
            <div v-if="recipe.meat.notes" class="info-row">
              <span class="info-label">Märkused</span>
              <span class="info-value note">{{ recipe.meat.notes }}</span>
            </div>
          </div>
        </section>

        <!-- Equipment -->
        <section class="section">
          <h2 class="section-title">
            <Icon name="mdi:grill" />
            Varustus
          </h2>
          <ul class="equipment-list">
            <li v-for="item in recipe.equipment" :key="item" class="equipment-item">
              <Icon name="lucide:check" class="check-icon" />
              {{ item }}
            </li>
          </ul>
        </section>
      </div>

      <!-- Right: Steps -->
      <div class="right-column">
        <section class="section">
          <h2 class="section-title">
            <Icon name="mdi:format-list-numbered" />
            Samm-sammuline juhend
          </h2>
          <RecipeSteps :steps="recipe.steps" :youtube-id="recipe.video.youtubeId" />
        </section>
      </div>
    </div>

    <!-- Related Recipes -->
    <section v-if="related.length > 0" class="section related-section">
      <h2 class="section-title">
        <Icon name="mdi:bookmark-outline" />
        Seotud retseptid
      </h2>
      <div class="recipe-grid">
        <RecipeCard
          v-for="r in related"
          :key="r.id"
          :recipe="r"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.recipe-detail {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--bbq-text-muted);
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color var(--bbq-transition);
}

.back-link:hover {
  color: var(--bbq-primary);
}

.recipe-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--bbq-text);
  margin-bottom: 0.5rem;
}

.recipe-description {
  font-size: 1.05rem;
  color: var(--bbq-text-muted);
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--bbq-text);
  margin-bottom: 1rem;
}

.section-title :deep(.iconify) {
  color: var(--bbq-primary);
}

/* ===== Two Columns ===== */
.two-columns {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2.5rem;
  margin-top: 1rem;
}

.left-column {
  display: flex;
  flex-direction: column;
}

.right-column {
  display: flex;
  flex-direction: column;
}

/* ===== Seasonings ===== */
.seasonings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===== Info Card (Meat) ===== */
.info-card {
  background-color: var(--bbq-surface-card);
  border: 1px solid var(--bbq-border);
  border-radius: var(--bbq-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--bbq-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--bbq-text);
  text-align: right;
}

.info-value.note {
  font-size: 0.85rem;
  color: var(--bbq-primary-light);
  font-style: italic;
}

/* ===== Equipment ===== */
.equipment-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--bbq-text);
}

.check-icon {
  color: var(--bbq-primary);
  flex-shrink: 0;
}

/* ===== Related ===== */
.related-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--bbq-border);
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 640px) {
  .recipe-title {
    font-size: 1.5rem;
  }

  .recipe-description {
    font-size: 0.95rem;
  }
}
</style>
