<script setup lang="ts">
  import {File, Target} from "~/types";

  const fileCardRef = ref<HTMLAnchorElement | null>(null);

  defineProps<{
    file: File;
  }>();

  onMounted(() => {
    if (!fileCardRef.value) return;

    fileCardRef.value.addEventListener('mousemove', (event: MouseEvent) => {
      const target: Target | null = event.target as Target;
      if (!target) return;

      const x = event.offsetX;
      const y = event.offsetY;

      target.style = `--x: ${x}px; --y: ${y}px;`;
    });

    fileCardRef.value.addEventListener('mouseleave', (event: MouseEvent) => {
      const target: Target | null = event.target as Target;
      if (!target) return;

      target.style = '';
    });
  });

  function convertSize(size: number) {
    if (size < 1000) {
      return size + 'b';
    }
    if (size < 1000000) {
      return size / 1000 + 'KB';
    }

    return size / 1000000 + 'MB';
  }
  
  function onClickDelete(event: MouseEvent) {
    event.stopPropagation();
    alert('hello world');
  }
</script>

<template>
  <a ref="fileCardRef" class="file" :href="`/api/download/${file.filename}`">
    <div>{{ file.filename }}</div>
    <div>Size: {{ convertSize(file.size) }}</div>
    <div>Uploaded: {{ file.created }}</div>
    <button v-if="file.canDelete" @click="onClickDelete">DELETE</button>
  </a>
</template>

<style scoped>
  .file {
    height: auto;
    padding: 2rem 2.5rem;
    border: 1px solid var(--gun-metal);
    flex-grow: 1;
    flex-shrink: 1;
    border-radius: 1.1rem;
    box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, .5);
    position: relative;
    overflow: hidden;
    cursor: pointer;

    transition: ease-in-out 200ms;

    * {
      pointer-events: none;
      user-select: none;

      color: white;
    }

    &:hover {
      border: 1px solid var(--air-blue);
    }

    &::before {
      content: "";
      background: radial-gradient(
        100px circle at var(--x) var(--y),
        rgba(58, 236, 248, 0.3) 0,
        rgba(82, 149, 220, 0.2) 30%,
        rgba(0, 212, 255, 0.1) 50%,
        transparent 100%
      );
      inset: -1px;
      position: absolute;
      z-index: -1;
    }
  }
</style>