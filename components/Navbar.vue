<script setup lang="ts">

</script>

<template>
  <nav>
    <div class="container">
      <span class="title">FileSharer</span>

      <div class="links">
        <NuxtLink to="/">Files</NuxtLink>
        <NuxtLink to="/upload">Upload</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
  nav {
    background-color: var(--gun-metal);
    padding-block: 1rem;
    padding-inline: 2rem;
    display: flex;
    justify-content: center;

    .container {
      width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 2rem;
      }

      .links {
        display: flex;
        column-gap: 1rem;
        font-size: 1.15rem;
      }
    }
  }
</style>