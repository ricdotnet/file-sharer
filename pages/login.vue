<template>
  <ClientOnly>
    <form method="post" @submit="onLoginSubmit">
      <div class="login-container">
        <h1>Login</h1>

        <div class="input-group">
          <label for="username">Username</label>
          <input ref="usernameInput" id="username" />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input ref="passwordInput" id="password" type="password" />
        </div>

        <Button type="submit" label="Login" :is-actioning="isLoggingIn" />
      </div>
    </form>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Button from '~/components/Button.vue';
  import { useAsyncData, useToaster, useUserStore } from '#imports';

  const { setIsAuthenticated, setAuthToken, isAuthenticated } = useUserStore();
  const { addToast } = useToaster();

  const isLoggingIn = ref(false);
  const usernameInput = ref<HTMLInputElement | null>(null);
  const passwordInput = ref<HTMLInputElement | null>(null);

  async function onLoginSubmit(event: Event) {
    event.preventDefault();
    if (!usernameInput.value?.value || !passwordInput.value?.value) {
      return;
    }

    isLoggingIn.value = true;

    const username = usernameInput.value.value;
    const password = passwordInput.value.value;

    const { data, error } = await useAsyncData<{ token: string }>(() => $fetch('/api/user/login', {
      method: 'POST',
      body: {
        username,
        password,
      },
    }));

    if (error.value) {
      console.error('Error:', error.value);
      addToast({ message: 'Something went wrong when trying to login.', type: 'error' });
      isLoggingIn.value = false;
      return;
    }

    setAuthToken(data.value!.token);
    setIsAuthenticated(true);
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
    box-sizing: border-box;
    padding-inline: 2rem;
    padding-block: 2rem;
    border-radius: 0.6rem;
    gap: 1.5rem;
    background-color: rgba(0, 0, 0, 0.35);

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
      border: 1px solid var(--zinc-90);
      border-radius: 0.5rem;
      padding: 1rem 1rem;
      color: white;
      background-color: transparent;
      transition: ease-in-out 150ms;
    }

    label {
      color: rgba(255, 255, 255, 0.5);
    }
  }
</style>
