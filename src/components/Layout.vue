<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppNavbar from '@/components/AppNavbar'
import AppMain from '@/components/AppMain'
export default {
  components: {AppHeader, AppNavbar, AppMain}
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  right: 0;
  left: 0;
  background-color: #409eff;
}
.navbar {
    position: absolute;
        width: 230px;
        top: 50px;
        left: 0px;
        bottom: 0px;
        background-color: #000;
        overflow-y: auto;
}
.main {
        position: absolute;
        top: 50px;
        left: 230px;
        right: 0;
        bottom: 0;
        padding: 10px;
        overflow-y: auto;
    }
</style>