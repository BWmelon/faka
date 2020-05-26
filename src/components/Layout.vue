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
    line-height: 50px;
    overflow-y: auto;
    background-color: #12afe3;
}
.navbar {
    float: left;
    height: 100vh;
    display: block;
    position: relative;
    background-color: #222d32;
}
.main {
    padding: 10px;
    overflow-y: auto;
}
</style>
