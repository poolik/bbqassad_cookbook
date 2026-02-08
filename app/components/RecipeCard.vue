<script setup lang="ts">
import type { Recipe } from '~/types/recipe'

const props = defineProps<{
  recipe: Recipe
}>()

const thumbnailUrl = computed(() => props.recipe.video.thumbnailUrl)

const difficultyColor = computed(() => {
  switch (props.recipe.cookingOverview.difficulty) {
    case 'lihtne':
      return 'success'
    case 'keskmine':
      return 'warn'
    case 'keeruline':
      return 'danger'
    default:
      return 'secondary'
  }
})

const difficultyLabel = computed(() => {
  switch (props.recipe.cookingOverview.difficulty) {
    case 'lihtne':
      return 'Lihtne'
    case 'keskmine':
      return 'Keskmine'
    case 'keeruline':
      return 'Keeruline'
    default:
      return props.recipe.cookingOverview.difficulty
  }
})
</script>

<template>
  <NuxtLink :to="`/retseptid/${recipe.slug}`" class="recipe-card card-hover">
    <div class="card-image-wrapper">
      <img
        :src="thumbnailUrl"
        :alt="recipe.title"
        class="card-image"
        loading="lazy"
      />
      <div class="card-image-overlay" />
      <div class="card-time-badge">
        <Icon name="mdi:timer-outline" />
        {{ recipe.cookingOverview.totalTime }}
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ recipe.title }}</h3>

      <p class="card-description">{{ recipe.description }}</p>

      <div class="card-meta">
        <Tag :value="recipe.meat.cutDisplay" severity="info" />
        <Tag :value="difficultyLabel" :severity="difficultyColor" />
      </div>

      <div class="card-seasonings">
        <span
          v-for="seasoning in recipe.seasonings.slice(0, 2)"
          :key="seasoning.name"
          class="seasoning-chip"
        >
          {{ seasoning.name }}
        </span>
        <span
          v-if="recipe.seasonings.length > 2"
          class="seasoning-more"
        >
          +{{ recipe.seasonings.length - 2 }}
        </span>
      </div>

      <div class="card-footer">
        <span class="servings">
          <Icon name="lucide:users" />
          {{ recipe.cookingOverview.servings }} portsjonit
        </span>
        <span class="temp">
          <Icon name="mdi:thermometer" />
          {{ recipe.cookingOverview.temperature }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bbq-surface-card);
  border-radius: var(--bbq-radius);
  overflow: hidden;
  text-decoration: none;
  color: var(--bbq-text);
  border: 1px solid var(--bbq-border);
  box-shadow: var(--bbq-shadow);
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.6));
  pointer-events: none;
}

.card-time-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.card-body {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--bbq-text);
}

.card-description {
  font-size: 0.825rem;
  color: var(--bbq-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.card-seasonings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.seasoning-chip {
  font-size: 0.7rem;
  background-color: var(--bbq-surface-hover);
  color: var(--bbq-primary-light);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--bbq-border);
}

.seasoning-more {
  font-size: 0.7rem;
  color: var(--bbq-text-muted);
  padding: 0.2rem 0.4rem;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px solid var(--bbq-border);
  font-size: 0.8rem;
  color: var(--bbq-text-muted);
}

.card-footer span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
