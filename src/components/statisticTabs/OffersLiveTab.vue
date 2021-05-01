<template>
  <div>
    <div class="table-filter">
      <div class="select-label">Filter by offers</div>
      <el-select v-model="filterData.offer" clearable placeholder="Select">
        <el-option
          v-for="item in filter.offers"
          :key="item.offer_name"
          :label="item.offer_name"
          :value="item.offer_id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="table-filter">
      <div class="select-label">Filter by target</div>
      <el-select v-model="filterData.target" clearable placeholder="Select">
        <el-option
          v-for="item in filter.targets"
          :key="item.advert_offer_target_name"
          :value="item.advert_offer_target_status"
          :label="item.advert_offer_target_name"
        >
        </el-option>
      </el-select>
    </div>
    <div class="table-filter">
      <div class="select-label">Filter by region</div>
      <el-select v-model="filterData.geo" clearable placeholder="Select">
        <el-option
          v-for="item in filter.regions"
          :key="item.geo_name"
          :label="item.geo_name"
          :value="item.geo_id"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      filterData: {},
      filter: {
        status: [
          {
            id: "0",
            title: "Not valid",
          },
          {
            id: "1",
            title: "Not valid checked",
          },
          {
            id: "10",
            title: "Pending",
          },
          {
            id: "11",
            title: "Back to pending",
          },
          {
            id: "20",
            title: "Canceled",
          },
          {
            id: "21",
            title: "Rejected",
          },
          {
            id: "22",
            title: "Not paid",
          },
          {
            id: "40",
            title: "Waiting for delivery",
          },
          {
            id: "50",
            title: "Delivery in progress",
          },
          {
            id: "100",
            title: "Success delivery",
          },
          {
            id: "101",
            title: "Returned",
          },
        ],
        date: {},
        offers: [],
        targets: [],
        regions: [],
        flows: [],
      },
      loading: true,
    };
  },
  created() {
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/data-list/my-offers";
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterRegionsUrl = "http://back.w.crmka.net/wm_api/data-list/geo";

    const requestOffersFilter = axios.get(filterOffersUrl);
    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestRegionsFilter = axios.get(filterRegionsUrl);

    axios
      .all([requestOffersFilter, requestTargetsFilter, requestRegionsFilter])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.regions = responses[2].data.data;
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
    this.updateTable();
  },
  methods: {
    prepareFilters() {
      let filter = {};

      if (
        this.filterData.offer !== undefined &&
        this.filterData.offer !== null &&
        this.filterData.offer !== ""
      ) {
        filter.offer_id = this.filterData.offer;
      }
      if (
        this.filterData.target !== undefined &&
        this.filterData.target !== null &&
        this.filterData.target !== ""
      ) {
        filter.advert_offer_target_status = this.filterData.target;
      }
      if (
        this.filterData.geo !== undefined &&
        this.filterData.geo !== null &&
        this.filterData.geo !== ""
      ) {
        filter.geo_id = this.filterData.geo;
      }

      return filter;
    },
    updateTable() {
      this.loading = true;
      let statisticUrl = "http://back.w.crmka.net/wm_api/statistics/live/offer";
      let filters = this.prepareFilters();
      axios({
        url: statisticUrl,
        method: "post",
        data: {
          filters: filters,
        },
      })
        .then((resp) => {
          this.tableData = resp.data.data.statistics;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.table-filter {
  display: inline-block;
  margin: 10px;
  text-align: center;
  margin-left: 0;
  margin-bottom: 25px;
}
.select-label {
  margin-bottom: 3px;
  font-size: 13px;
  text-align: left;
  color: #afafaf;
}
</style>