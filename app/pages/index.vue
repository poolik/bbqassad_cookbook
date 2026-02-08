<script setup lang="ts">
const { recipes, meta } = useRecipes()
const { filters, filteredRecipes, setQuery, setFilter, clearFilters } = useSearch(recipes, meta)

const showFilters = ref(false)
const searchQuery = ref('')

function onSearch(q: string) {
  searchQuery.value = q
  setQuery(q)
}

function onFilter(key: string, value: string | null) {
  setFilter(key as any, value)
}

function onClearFilters() {
  searchQuery.value = ''
  clearFilters()
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner container">
        <div class="hero-content">
          <h1 class="hero-title">
            <Icon name="mdi:fire" class="hero-fire-icon" />
            BBQ Ässad Kokaraamat
          </h1>
          <p class="hero-subtitle">Parimad BBQ retseptid samm-sammult</p>
          <p class="hero-description">
            Avasta maailmatasemel BBQ retsepte koos videoõpetuste, maitseainete ja
            samm-sammult juhistega. Kõik vajalikud tooted leiad
            <a href="https://bbqassad.ee" target="_blank" rel="noopener noreferrer">bbqassad.ee</a>
            veebipoest.
          </p>
        </div>

        <div class="hero-search">
          <RecipeSearch v-model:query="searchQuery" @search="onSearch" />
        </div>
      </div>
    </section>

    <!-- Filters + Recipe Grid -->
    <section class="recipes-section container">
      <!-- Toggle Filters (mobile) -->
      <button class="toggle-filters-btn" @click="showFilters = !showFilters">
        <Icon name="mdi:filter-variant" />
        {{ showFilters ? 'Peida filtrid' : 'Näita filtreid' }}
      </button>

      <!-- Filters -->
      <div class="filters-wrapper" :class="{ visible: showFilters }">
        <RecipeFilters
          :meta="meta"
          :filters="filters"
          @filter="onFilter"
          @clear="onClearFilters"
        />
      </div>

      <!-- Results Count -->
      <div class="results-bar">
        <span class="results-count">
          {{ filteredRecipes.length }} retsepti{{ filteredRecipes.length === 1 ? '' : '' }}
        </span>
      </div>

      <!-- Recipe Grid -->
      <div v-if="filteredRecipes.length > 0" class="recipe-grid">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <Icon name="mdi:magnify-close" class="empty-icon" />
        <h3>Retsepte ei leitud</h3>
        <p>Proovi muuta otsingu- või filtrivalikuid</p>
        <button class="clear-btn-large" @click="onClearFilters">
          <Icon name="lucide:x" />
          Tühjenda filtrid
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== Hero ===== */
.hero {
  background: linear-gradient(
    135deg,
    rgba(13, 13, 13, 0.95) 0%,
    rgba(26, 26, 26, 0.9) 50%,
    rgba(40, 20, 5, 0.85) 100%
  );
  border-bottom: 1px solid var(--bbq-border);
  padding: 4rem 0 3rem;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.hero-content {
  max-width: 700px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--bbq-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hero-fire-icon {
  color: var(--bbq-primary);
  font-size: 2.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--bbq-primary-light);
  font-weight: 500;
  margin-top: 0.5rem;
}

.hero-description {
  font-size: 1rem;
  color: var(--bbq-text-muted);
  margin-top: 1rem;
  line-height: 1.6;
}

.hero-description a {
  color: var(--bbq-primary);
  font-weight: 600;
}

.hero-search {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* ===== Recipes Section ===== */
.recipes-section {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.toggle-filters-btn {
  display: none;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--bbq-surface-card);
  border: 1px solid var(--bbq-border);
  color: var(--bbq-text);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all var(--bbq-transition);
}

.toggle-filters-btn:hover {
  border-color: var(--bbq-primary);
  color: var(--bbq-primary);
}

.filters-wrapper {
  margin-bottom: 2rem;
}

.results-bar {
  margin-bottom: 1.25rem;
}

.results-count {
  font-size: 0.9rem;
  color: var(--bbq-text-muted);
  font-weight: 500;
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 0;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: var(--bbq-text-muted);
  opacity: 0.4;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--bbq-text);
}

.empty-state p {
  font-size: 0.95rem;
  color: var(--bbq-text-muted);
}

.clear-btn-large {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: var(--bbq-primary);
  color: white;
  border: none;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color var(--bbq-transition);
}

.clear-btn-large:hover {
  background-color: var(--bbq-primary-light);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .hero {
    padding: 2.5rem 0 2rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-fire-icon {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .toggle-filters-btn {
    display: flex;
  }

  .filters-wrapper {
    display: none;
  }

  .filters-wrapper.visible {
    display: block;
  }
}
</style>
