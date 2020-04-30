<template>
  <div style="height: 100%;">
    <app-navbar></app-navbar>
    <app-header></app-header>
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppNavbar from "@/components/AppNavbar";
import AppMain from "@/components/AppMain";
export default {
  components: { AppHeader, AppNavbar, AppMain }
};
</script>

<style scoped>
.header {
  /* position: absolute; */
  line-height: 50px;
  /* top: 0; */
  /* width: 100px; */
  /* right: 0; */
  /* left: 0; */
  overflow-y: auto;
  background-color: #12afe3;
}
.navbar {
  /* position: absolute; */
  /* width: 230px; */
  /* top: 50px; */
  /* left: 0px; */
  /* bottom: 0px; */
  /* background-color: #222D32; */
  float: left;
  height: 100vh;
  display: block;
  position: relative;
  /* overflow-y: scroll; */
  background-color: #222d32;
}
.main {
  /* position: absolute; */
  /* top: 50px; */
  /* left: 230px; */
  /* right: 0; */
  /* bottom: 0; */
  padding: 10px;
  overflow-y: auto;
  /* float: left; */
}
</style>
