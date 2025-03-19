<template>
  <Navbar/>
  <div class="container">
    <slot/>
  </div>

  <Transition name="toast" mode="out-in">
    <div v-if="toasts.length" class="toast" @click="removeToast">
      <ExclamationCircleIcon class="icon" v-if="toasts[0].type === 'error'" />
      <InformationCircleIcon class="icon" v-else-if="toasts[0].type === 'info'" />
      <CheckCircleIcon class="icon" v-else />

      {{ toasts[0].message }}

      <div class="hiding-timer" style="--duration: 5;"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { useToaster } from '~/composables/useToaster';
  import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/vue/16/solid";

  const { removeToast, toasts } = useToaster();
</script>

<style scoped>
  .toast {
    position: fixed;
    bottom: 20px;
    left: 20px;

    padding-block: 20px;
    padding-inline: 15px;
    border-radius: 5px;

    min-width: 200px;
    max-width: 300px;

    cursor: pointer;

    background-color: rgba(12, 38, 51, 0.2);
    border: 1px solid var(--gun-metal);

    display: flex;
    align-items: center;
    gap: 1rem;

    overflow: hidden;
  }

  .hiding-timer {
    position: absolute;
    height: 3px;
    width: 100%;
    background-color: #60A3D233;
    left: 0;
    bottom: 0;

    animation: hiding-timer calc(var(--duration) * 1s) linear forwards;
    transform-origin: left center;
  }

  @keyframes hiding-timer {
    to {
      transform: scaleX(0);
    }
  }
</style>
