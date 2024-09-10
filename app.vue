<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import "~/assets/main.css";

  if (!localStorage.getItem("token")) {
    await navigateTo("/login");
  } else {
    const token = localStorage.getItem("token");
    const { data, error } = await useFetch("/api/user/auth", {
      headers: {
        Authorization: `${token}`,
      },
      lazy: false,
    });
  }
</script>
