<script setup lang="ts">
import MoveBox from '@/components/MoveBox.vue'
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
    <MoveBox :list="['red', 'orange', 'green', 'blue']" :width="'width: 350px'" :height="'height: 60px'" :id="'above'" />
    <MoveBox :list="['indigo', 'purple']" :width="'width: 200px'" :height="'height: 120px'" :id="'under'"/>    
  </div>
</template>
