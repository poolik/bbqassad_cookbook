<script setup lang="ts">
const emit = defineEmits<{
  search: [query: string]
}>()

const query = defineModel<string>('query', { default: '' })

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  query.value = value
  emit('search', value)
}

function clear() {
  query.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="recipe-search">
    <div class="search-input-wrapper">
      <Icon name="lucide:search" class="search-icon" />
      <input
        :value="query"
        type="text"
        class="search-input"
        placeholder="Otsi retsepti... nt &quot;Blues Hog brisket&quot; või &quot;kana tiivad&quot;"
        @input="onInput"
      />
      <button
        v-if="query"
        class="clear-btn"
        @click="clear"
        aria-label="Tühjenda otsing"
      >
        <Icon name="lucide:x" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipe-search {
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  color: var(--bbq-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.75rem 0.875rem 3rem;
  background-color: var(--bbq-surface-card);
  border: 1px solid var(--bbq-border);
  border-radius: var(--bbq-radius);
  color: var(--bbq-text);
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color var(--bbq-transition), box-shadow var(--bbq-transition);
}

.search-input::placeholder {
  color: var(--bbq-text-muted);
  opacity: 0.7;
}

.search-input:focus {
  border-color: var(--bbq-primary);
  box-shadow: 0 0 0 3px rgba(232, 122, 32, 0.15);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--bbq-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color var(--bbq-transition), background-color var(--bbq-transition);
}

.clear-btn:hover {
  color: var(--bbq-text);
  background-color: var(--bbq-surface-hover);
}
</style>
