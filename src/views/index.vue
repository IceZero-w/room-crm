<template>
  <div class="dashboard-editor-container">
    欢迎来到【{{ config.title }}】
  </div>
</template>

<script>
import config from '../settings.js';

export default {
  name: 'Index',
  components: {},
  data() {
    return {
      config,
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  margin: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  text-align: center;

}
</style>
