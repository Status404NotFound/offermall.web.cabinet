<template>
  <el-tabs
    v-loading="loading"
    v-model="activeTab"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.tabName"
      :name="tab.tabName"
      :label="tab.title"
      :disabled="disableActive(tab)"
    />
    <router-view v-show="activeTab" />
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "",
      loading: false,
      tabs: [
        {
          title: "Daily",
          tabUrl: "daily",
          tabName: "Statistics by days",
        },
        {
          title: "Hourly",
          tabUrl: "hourly",
          tabName: "Statistics by hours",
        },
        {
          title: "Offers",
          tabUrl: "offer",
          tabName: "Statistics by offers",
        },
        {
          title: "Flows",
          tabUrl: "flow",
          tabName: "Statistics by flows",
        },
        {
          title: "Sub",
          tabUrl: "sub",
          tabName: "Statistics by sub",
        },
        {
          title: "Offers Live",
          tabUrl: "offers-live",
          tabName: "Offers Live",
        },
        {
          title: "Geo Live",
          tabUrl: "geo-live",
          tabName: "Geo Live",
        },
      ],
    };
  },
  created() {
    document.title = this.$route.name;
    this.activeTab = this.$route.name;
  },
  methods: {
    handleClick(obj) {
      this.$router.push({ name: obj.$vnode.key });
    },
    disableActive(tab) {
      return tab.tabName === this.activeTab;
    },
  },
};
</script>

<style scoped>
</style>