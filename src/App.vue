<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MoveBox from './components/MoveBox.vue'
</script>

<template>
  <div
    class="wrapper svelte-1anl9sr"
    style="
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    "
    draggable="false"
  >
    <div class="title svelte-1anl9sr" style="text-align: center">Task</div>
    <MoveBox :list="['red', 'orange', 'green', 'blue']" :width="'width: 400px'" :height="'height: 60px'" :id="'above'" />
    <MoveBox :list="['indigo', 'purple']" :width="'width: 200px'" :height="'height: 120px'" :id="'under'"/>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
