<script setup lang="ts">
import type { Seasoning } from '~/types/recipe'

defineProps<{
  seasoning: Seasoning
}>()

function getTypeLabel(type: string): string {
  switch (type) {
    case 'rub': return 'Maitseainesegu'
    case 'sauce': return 'Kaste'
    case 'marinade': return 'Marinaad'
    case 'injection': return 'Süstimine'
    case 'muu': return 'Muu'
    default: return type
  }
}

function getTypeSeverity(type: string) {
  switch (type) {
    case 'rub': return 'warn'
    case 'sauce': return 'danger'
    case 'marinade': return 'info'
    case 'injection': return 'success'
    default: return 'secondary'
  }
}
</script>

<template>
  <div class="seasoning-badge" :class="{ optional: seasoning.optional }">
    <div class="seasoning-main">
      <div class="seasoning-info">
        <span class="seasoning-name">{{ seasoning.name }}</span>
        <div class="seasoning-meta">
          <Tag
            :value="getTypeLabel(seasoning.type)"
            :severity="getTypeSeverity(seasoning.type)"
            class="type-tag"
          />
          <span class="seasoning-amount">{{ seasoning.amount }}</span>
          <span v-if="seasoning.optional" class="optional-label">(valikuline)</span>
        </div>
      </div>
      <a
        :href="seasoning.shopUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="buy-btn"
      >
        <Icon name="mdi:shopping" />
        Osta
      </a>
    </div>
  </div>
</template>

<style scoped>
.seasoning-badge {
  background-color: var(--bbq-surface-card);
  border: 1px solid var(--bbq-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: border-color var(--bbq-transition);
}

.seasoning-badge:hover {
  border-color: var(--bbq-primary);
}

.seasoning-badge.optional {
  opacity: 0.8;
  border-style: dashed;
}

.seasoning-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.seasoning-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.seasoning-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--bbq-text);
}

.seasoning-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-tag {
  font-size: 0.65rem !important;
}

.seasoning-amount {
  font-size: 0.8rem;
  color: var(--bbq-text-muted);
}

.optional-label {
  font-size: 0.75rem;
  color: var(--bbq-text-muted);
  font-style: italic;
}

.buy-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: var(--bbq-primary);
  color: white;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color var(--bbq-transition), transform var(--bbq-transition);
}

.buy-btn:hover {
  background-color: var(--bbq-primary-light);
  transform: translateY(-1px);
  color: white;
}
</style>
