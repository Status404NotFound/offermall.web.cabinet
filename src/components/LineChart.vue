<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  methods: {
    reload() {
      return this.renderChart(this.$props.chartdata, this.options);
    },
  },
  mounted() {
    this.reload();
  },
  watch: {
    chartdata: function () {
      return this.reload();
    },
  },
};
</script>

<style scoped>
</style>