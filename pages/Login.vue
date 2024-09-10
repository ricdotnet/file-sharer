<template>
  <form method="post" @submit="onLoginSubmit">
    <div class="login-container">
      <div class="input-group">
        <label for="username">Username</label>
        <input ref="usernameInput" id="username"/>
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input ref="passwordInput" id="password"/>
      </div>

      <Button type="submit" label="Login"/>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Button from '~/components/Button.vue';

  const usernameInput = ref<HTMLInputElement | null>(null);
  const passwordInput = ref<HTMLInputElement | null>(null);

  async function onLoginSubmit(event: Event) {
    event.preventDefault();
    if (!usernameInput.value?.value || !passwordInput.value?.value) return;

    const username = usernameInput.value.value;
    const password = passwordInput.value.value;

    const { data, error } = await useFetch('/api/user/login', {
      method: 'POST',
      body: {
        username,
        password,
      },
    });

    if (error.value) {
      console.error('Error:', error.value);
      return;
    }

    if (data?.value?.token) {
      localStorage.setItem('token', data.value.token);
    }

    navigateTo('/');
  }
</script>

<style scoped>
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    height: auto;
    width: 30%;
    background-color: var(--gun-metal);
    box-sizing: border-box;
    padding-inline: 2rem;
    padding-block: 2rem;
    border-radius: 0.6rem;
    gap: 1.5rem;

    @media screen and (max-width: 1280px) {
      width: 40%;
    }

    @media screen and (max-width: 1024px) {
      width: 50%;
    }

    @media screen and (max-width: 768px) {
      width: 70%;
    }

    @media screen and (max-width: 640px) {
      width: 90%;
      padding-inline: 1rem;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: none;
    position: relative;

    input {
      box-sizing: border-box;
      width: 100%;
      padding-inline: 0.7rem;
      padding-block: 0.5rem;
      border-radius: 0.4rem;
      color: white;
      background-color: transparent;
      border: 1px solid var(--air-blue);
    }
  }
</style>
