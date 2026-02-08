<script setup lang="ts">
import type { Step } from '~/types/recipe'

const props = defineProps<{
  steps: Step[]
  youtubeId: string
}>()

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getYouTubeLink(seconds: number): string {
  return `https://www.youtube.com/watch?v=${props.youtubeId}&t=${seconds}`
}
</script>

<template>
  <div class="recipe-steps">
    <div
      v-for="step in steps"
      :key="step.stepNumber"
      class="step-item"
    >
      <div class="step-marker">
        <div class="step-number">{{ step.stepNumber }}</div>
        <div v-if="step.stepNumber < steps.length" class="step-connector" />
      </div>

      <div class="step-content">
        <div class="step-header">
          <h3 class="step-title">{{ step.title }}</h3>
          <div class="step-badges">
            <span v-if="step.temperature" class="step-badge temp-badge">
              <Icon name="mdi:thermometer" />
              {{ step.temperature }}
            </span>
            <span class="step-badge duration-badge">
              <Icon name="mdi:timer-outline" />
              {{ step.duration }}
            </span>
          </div>
        </div>

        <p class="step-description">{{ step.description }}</p>

        <div v-if="step.tips.length > 0" class="step-tips">
          <div
            v-for="(tip, idx) in step.tips"
            :key="idx"
            class="tip-item"
          >
            <Icon name="mdi:lightbulb-outline" class="tip-icon" />
            <span>{{ tip }}</span>
          </div>
        </div>

        <a
          :href="getYouTubeLink(step.videoTimestamp)"
          target="_blank"
          rel="noopener noreferrer"
          class="video-link"
        >
          <Icon name="mdi:play-circle-outline" />
          Vaata videos ({{ formatTimestamp(step.videoTimestamp) }})
          <Icon name="lucide:external-link" class="ext-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-steps {
  display: flex;
  flex-direction: column;
}

.step-item {
  display: flex;
  gap: 1.25rem;
}

.step-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bbq-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.step-connector {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: linear-gradient(to bottom, var(--bbq-primary), var(--bbq-border));
  margin: 0.5rem 0;
}

.step-content {
  flex: 1;
  padding-bottom: 2rem;
}

.step-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--bbq-text);
}

.step-badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.step-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.temp-badge {
  background-color: rgba(192, 57, 43, 0.15);
  color: #e74c3c;
}

.duration-badge {
  background-color: rgba(232, 122, 32, 0.15);
  color: var(--bbq-primary-light);
}

.step-description {
  font-size: 0.95rem;
  color: var(--bbq-text);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.step-tips {
  background-color: rgba(232, 122, 32, 0.08);
  border: 1px solid rgba(232, 122, 32, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--bbq-primary-light);
  line-height: 1.5;
}

.tip-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--bbq-primary);
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bbq-primary);
  text-decoration: none;
  transition: color var(--bbq-transition);
}

.video-link:hover {
  color: var(--bbq-primary-light);
}

.ext-icon {
  font-size: 0.7rem;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .step-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
