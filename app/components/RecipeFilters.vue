<script setup lang="ts">
import type { RecipeMeta, ActiveFilters } from '~/types/recipe'

const props = defineProps<{
  meta: RecipeMeta
  filters: ActiveFilters
}>()

const emit = defineEmits<{
  filter: [key: string, value: string | null]
  clear: []
}>()

function onFilterChange(key: string, value: string | null) {
  emit('filter', key, value || null)
}

function clearAll() {
  emit('clear')
}

const hasActiveFilters = computed(() => {
  return props.filters.meatType || props.filters.meatCut || props.filters.brand || props.filters.seasoningType
})

const filteredCuts = computed(() => {
  if (!props.filters.meatType) return props.meta.meatCuts
  return props.meta.meatCuts.filter((c) => c.meatType === props.filters.meatType)
})
</script>

<template>
  <div class="recipe-filters">
    <div class="filters-row">
      <div class="filter-group">
        <label class="filter-label">
          <Icon name="mdi:food-steak" />
          Liha tüüp
        </label>
        <Select
          :modelValue="filters.meatType"
          :options="meta.meatTypes"
          optionLabel="label"
          optionValue="id"
          placeholder="Kõik"
          showClear
          class="filter-select"
          @update:modelValue="onFilterChange('meatType', $event)"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <Icon name="mdi:knife" />
          Lihakehosa
        </label>
        <Select
          :modelValue="filters.meatCut"
          :options="filteredCuts"
          optionLabel="label"
          optionValue="id"
          placeholder="Kõik"
          showClear
          class="filter-select"
          @update:modelValue="onFilterChange('meatCut', $event)"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <Icon name="mdi:tag" />
          Bränd
        </label>
        <Select
          :modelValue="filters.brand"
          :options="meta.brands"
          optionLabel="label"
          optionValue="id"
          placeholder="Kõik"
          showClear
          class="filter-select"
          @update:modelValue="onFilterChange('brand', $event)"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <Icon name="mdi:shaker-outline" />
          Maitsestaja tüüp
        </label>
        <Select
          :modelValue="filters.seasoningType"
          :options="meta.seasoningTypes"
          optionLabel="label"
          optionValue="id"
          placeholder="Kõik"
          showClear
          class="filter-select"
          @update:modelValue="onFilterChange('seasoningType', $event)"
        />
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-filters">
      <span class="active-label">Aktiivsed filtrid:</span>
      <Tag
        v-if="filters.meatType"
        :value="meta.meatTypes.find((m) => m.id === filters.meatType)?.label || filters.meatType"
        severity="info"
        class="filter-tag"
        removable
        @remove="onFilterChange('meatType', null)"
      />
      <Tag
        v-if="filters.meatCut"
        :value="meta.meatCuts.find((c) => c.id === filters.meatCut)?.label || filters.meatCut"
        severity="info"
        class="filter-tag"
        removable
        @remove="onFilterChange('meatCut', null)"
      />
      <Tag
        v-if="filters.brand"
        :value="meta.brands.find((b) => b.id === filters.brand)?.label || filters.brand"
        severity="warn"
        class="filter-tag"
        removable
        @remove="onFilterChange('brand', null)"
      />
      <Tag
        v-if="filters.seasoningType"
        :value="meta.seasoningTypes.find((s) => s.id === filters.seasoningType)?.label || filters.seasoningType"
        severity="secondary"
        class="filter-tag"
        removable
        @remove="onFilterChange('seasoningType', null)"
      />
      <button class="clear-all-btn" @click="clearAll">
        <Icon name="lucide:x" />
        Tühjenda kõik
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipe-filters {
  width: 100%;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 180px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--bbq-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.filter-select {
  width: 100%;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--bbq-border);
}

.active-label {
  font-size: 0.8rem;
  color: var(--bbq-text-muted);
  font-weight: 500;
}

.filter-tag {
  cursor: pointer;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: 1px solid var(--bbq-border);
  color: var(--bbq-text-muted);
  font-size: 0.75rem;
  font-family: inherit;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--bbq-transition);
}

.clear-all-btn:hover {
  color: var(--bbq-accent);
  border-color: var(--bbq-accent);
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
  }

  .filter-group {
    min-width: 100%;
  }
}
</style>
