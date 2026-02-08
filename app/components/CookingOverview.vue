<script setup lang="ts">
import type { CookingOverview } from '~/types/recipe'

defineProps<{
  overview: CookingOverview
}>()

function getDifficultyIcon(d: string) {
  switch (d) {
    case 'lihtne': return 'mdi:speedometer-slow'
    case 'keskmine': return 'mdi:speedometer-medium'
    case 'keeruline': return 'mdi:speedometer'
    default: return 'mdi:speedometer-medium'
  }
}

function getDifficultyLabel(d: string) {
  switch (d) {
    case 'lihtne': return 'Lihtne'
    case 'keskmine': return 'Keskmine'
    case 'keeruline': return 'Keeruline'
    default: return d
  }
}
</script>

<template>
  <div class="cooking-overview">
    <div class="overview-item">
      <Icon name="mdi:knife" class="overview-icon" />
      <div class="overview-detail">
        <span class="overview-label">Ettevalmistus</span>
        <span class="overview-value">{{ overview.prepTime }}</span>
      </div>
    </div>

    <div class="overview-divider" />

    <div class="overview-item">
      <Icon name="mdi:fire" class="overview-icon fire" />
      <div class="overview-detail">
        <span class="overview-label">Küpsetamine</span>
        <span class="overview-value">{{ overview.cookTime }}</span>
      </div>
    </div>

    <div class="overview-divider" />

    <div class="overview-item">
      <Icon name="mdi:timer-sand" class="overview-icon" />
      <div class="overview-detail">
        <span class="overview-label">Puhkamine</span>
        <span class="overview-value">{{ overview.restTime }}</span>
      </div>
    </div>

    <div class="overview-divider" />

    <div class="overview-item">
      <Icon name="mdi:thermometer" class="overview-icon temp" />
      <div class="overview-detail">
        <span class="overview-label">Temperatuur</span>
        <span class="overview-value">{{ overview.temperature }}</span>
      </div>
    </div>

    <div class="overview-divider" />

    <div class="overview-item">
      <Icon name="lucide:users" class="overview-icon" />
      <div class="overview-detail">
        <span class="overview-label">Portsjonid</span>
        <span class="overview-value">{{ overview.servings }}</span>
      </div>
    </div>

    <div class="overview-divider" />

    <div class="overview-item">
      <Icon :name="getDifficultyIcon(overview.difficulty)" class="overview-icon difficulty" />
      <div class="overview-detail">
        <span class="overview-label">Raskusaste</span>
        <span class="overview-value">{{ getDifficultyLabel(overview.difficulty) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cooking-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--bbq-surface-card);
  border: 1px solid var(--bbq-border);
  border-radius: var(--bbq-radius);
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 120px;
}

.overview-icon {
  font-size: 1.5rem;
  color: var(--bbq-primary);
  flex-shrink: 0;
}

.overview-icon.fire {
  color: var(--bbq-accent);
}

.overview-icon.temp {
  color: #e74c3c;
}

.overview-icon.difficulty {
  color: var(--bbq-primary-light);
}

.overview-detail {
  display: flex;
  flex-direction: column;
}

.overview-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--bbq-text-muted);
}

.overview-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--bbq-text);
}

.overview-divider {
  width: 1px;
  height: 36px;
  background-color: var(--bbq-border);
}

@media (max-width: 768px) {
  .cooking-overview {
    gap: 0.75rem;
  }

  .overview-item {
    min-width: calc(50% - 1rem);
  }

  .overview-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .overview-item {
    min-width: 100%;
  }
}
</style>
