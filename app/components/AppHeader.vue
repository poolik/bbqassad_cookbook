<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/' || route.path === '/bbqassad_cookbook/' || route.path === '/bbqassad_cookbook')
</script>

<template>
  <header class="app-header">
    <div class="header-inner container">
      <NuxtLink to="/" class="logo-link">
        <Icon name="mdi:grill" class="logo-icon" />
        <div class="logo-text">
          <span class="logo-title">BBQ Ässad</span>
          <span class="logo-subtitle">Kokaraamat</span>
        </div>
      </NuxtLink>

      <nav class="header-nav">
        <NuxtLink to="/" class="nav-link" :class="{ active: isHome }">
          <Icon name="mdi:book-open-variant" />
          Retseptid
        </NuxtLink>
        <a
          href="https://bbqassad.ee"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-link shop-link"
        >
          <Icon name="mdi:shopping" />
          Pood
          <Icon name="lucide:external-link" class="external-icon" />
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--bbq-surface);
  border-bottom: 1px solid var(--bbq-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background-color: rgba(26, 26, 26, 0.9);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--bbq-text);
}

.logo-icon {
  font-size: 2rem;
  color: var(--bbq-primary);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--bbq-primary);
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--bbq-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--bbq-text-muted);
  text-decoration: none;
  transition: color var(--bbq-transition);
}

.nav-link:hover,
.nav-link.active {
  color: var(--bbq-primary);
}

.shop-link {
  background-color: var(--bbq-primary);
  color: white !important;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color var(--bbq-transition), transform var(--bbq-transition);
}

.shop-link:hover {
  background-color: var(--bbq-primary-light);
  color: white !important;
  transform: translateY(-1px);
}

.external-icon {
  font-size: 0.75rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .logo-subtitle {
    display: none;
  }

  .header-nav {
    gap: 0.75rem;
  }

  .nav-link span {
    display: none;
  }
}
</style>
