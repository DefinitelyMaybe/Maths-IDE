<template>
  <div id="app">
    <number></number>
    <number setValue="090"></number>
    <number></number>
    <!--number initialValue="10"></number-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import matrix from './components/basematrix.vue';
import number from './components/basenumber.vue';

export default Vue.extend({
  name: 'app',
  components: {
    matrix,
    number,
  },
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #000000;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: start;
  align-content: center;
}
</style>
