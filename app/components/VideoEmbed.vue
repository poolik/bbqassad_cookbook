<script setup lang="ts">
defineProps<{
  youtubeId: string
  title: string
}>()
</script>

<template>
  <div class="video-embed">
    <div class="video-wrapper">
      <iframe
        :src="`https://www.youtube.com/embed/${youtubeId}?rel=0`"
        :title="title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped>
.video-embed {
  width: 100%;
  border-radius: var(--bbq-radius);
  overflow: hidden;
  box-shadow: var(--bbq-shadow);
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
