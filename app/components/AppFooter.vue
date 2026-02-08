<template>
  <footer class="app-footer">
    <div class="footer-inner container">
      <div class="footer-brand">
        <Icon name="mdi:grill" class="footer-icon" />
        <span class="footer-title">BBQ Ässad Kokaraamat</span>
      </div>

      <p class="footer-text">
        Parimad BBQ retseptid samm-sammult.
        Maitseained ja varustus saadaval
        <a href="https://bbqassad.ee" target="_blank" rel="noopener noreferrer">
          bbqassad.ee
          <Icon name="lucide:external-link" class="inline-icon" />
        </a>
        veebipoes.
      </p>

      <div class="footer-bottom">
        <span>&copy; {{ new Date().getFullYear() }} BBQ Ässad</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--bbq-surface);
  border-top: 1px solid var(--bbq-border);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-icon {
  font-size: 1.5rem;
  color: var(--bbq-primary);
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--bbq-text);
}

.footer-text {
  font-size: 0.875rem;
  color: var(--bbq-text-muted);
  max-width: 500px;
  line-height: 1.6;
}

.footer-text a {
  color: var(--bbq-primary);
  font-weight: 600;
}

.inline-icon {
  font-size: 0.7rem;
  vertical-align: middle;
}

.footer-bottom {
  font-size: 0.8rem;
  color: var(--bbq-text-muted);
  opacity: 0.6;
}
</style>
