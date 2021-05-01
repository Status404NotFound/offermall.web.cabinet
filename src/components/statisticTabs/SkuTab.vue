<template>
  <div>
    <div class="table-filter">
      <div class="select-label">Filter by date</div>
      <el-date-picker
        v-model="filterData.date"
        type="daterange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        value-format="dd.MM.yyyy"
        v-bind:picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
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
    <div class="table-filter">
      <div class="select-label">Filter by status</div>
      <el-select v-model="filterData.status_id" multiple placeholder="Select">
        <el-option
          v-for="item in filter.status"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="table-filter">
      <el-button @click="updateTable"> Apply Filter </el-button>
    </div>
    <el-table :data="tableData" border width="100%" v-loading="loading">
      <el-table-column prop="offer_name" label="Offer name"> </el-table-column>
      <el-table-column prop="sku_name" label="Sku name"> </el-table-column>
      <el-table-column prop="amount" label="Amount"> </el-table-column>
      <el-table-column label="Status">
        <template slot-scope="scope">
          <li v-for="status in scope.row.status_name" :key="status.key">
            {{ status }}
          </li>
        </template>
      </el-table-column>
    </el-table>
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
      pickerOptions: {
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Yesterday",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 7 days",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 30 days",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "This month",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last month",
            onClick(picker) {
              const oDate = new Date();
              var year = oDate.getFullYear();
              var month = oDate.getMonth();
              var start, end;
              if (month == 0) {
                year--;
                start = new Date(year, 11, 1);
                end = new Date(year, 11, 31);
              } else {
                start = new Date(year, month - 1, 1);
                end = new Date(year, month, 0);
              }

              picker.$emit("pick", [start, end]);
            },
          },
        ],
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
      if (this.filterData.date !== undefined && this.filterData.date !== null) {
        filter.date = {};
        filter.date.start = this.filterData.date[0];
        filter.date.end = this.filterData.date[1];
      }
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
      if (
        this.filterData.status_id !== undefined &&
        this.filterData.status_id !== null &&
        this.filterData.status_id.length !== 0
      ) {
        filter.status_id = this.filterData.status_id;
      }
      return filter;
    },
    updateTable() {
      this.loading = true;
      let statisticUrl =
        "http://back.w.crmka.net/wm_api/statistics/delivery-sku";
      let filters = this.prepareFilters();
      axios({
        url: statisticUrl,
        method: "post",
        data: {
          filters: filters,
        },
      })
        .then((resp) => {
          this.tableData = resp.data.data;
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