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
      <div class="select-label">Filter by flow</div>
      <el-select v-model="filterData.flow" clearable placeholder="Select">
        <el-option
          v-for="item in filter.flows"
          :key="item.flow_id"
          :label="item.flow_name"
          :value="item.flow_id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="table-filter">
      <el-button type="primary" @click="updateTable" plain>
        Apply Filter
      </el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <el-table :data="tableData" border v-loading="loading">
          <el-table-column prop="index_date" label="Interval">
          </el-table-column>
          <el-table-column prop="views" label="Views"> </el-table-column>
          <el-table-column prop="uniques" width="80" label="Unique">
          </el-table-column>
          <el-table-column prop="cr" width="80" label="CR (%)">
          </el-table-column>
          <el-table-column label="EPC">
            <template slot-scope="scope" v-if="scope.row.views != 0">
              {{ rounded(scope.row.cs / scope.row.views) }}
            </template>
          </el-table-column>
          <el-table-column prop="total" label="Orders"> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <line-chart :chartdata="getChartData()" :options="chartOptions" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "@/components/LineChart";

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      tableData: [],
      filterData: {},
      filter: {
        date: {},
        offers: [],
        targets: [],
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
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              id: "A",
              type: "linear",
              position: "left",
            },
            {
              id: "B",
              type: "linear",
              position: "right",
            },
          ],
        },
        loading: true,
      },
    };
  },
  created() {
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/data-list/my-offers";
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterFlowsUrl = "http://back.w.crmka.net/wm_api/data-list/flows";

    const requestOffersFilter = axios.get(filterOffersUrl);
    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestFlowsFilter = axios.get(filterFlowsUrl);

    axios
      .all([requestOffersFilter, requestTargetsFilter, requestFlowsFilter])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.flows = responses[2].data.data;
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
    this.updateTable();
  },
  methods: {
    updateTable() {
      this.loading = true;
      let statisticUrl = "http://back.w.crmka.net/wm_api/statistics/hourly";
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
        this.filterData.flow !== undefined &&
        this.filterData.flow !== null &&
        this.filterData.flow !== ""
      ) {
        filter.flow_id = this.filterData.flow;
      }
      return filter;
    },
    rounded(number) {
      return number.toFixed(2);
    },
    getChartData() {
      let date = [];
      let cr = [];
      let total = [];
      let views = [];
      let uniques = [];
      this.tableData.map((el) => {
        date.push(el.index_date.slice(0, -5));
        cr.push(el.cr);
        total.push(el.total);
        views.push(el.views);
        uniques.push(el.uniques);
      });
      return {
        labels: date,
        datasets: [
          {
            type: "bar",
            label: "CR",
            backgroundColor: "rgb(178, 255, 89)",
            borderColor: "rgb(178, 255, 89)",
            pointBackgroundColor: "rgb(178, 255, 89)",
            yAxisID: "B",
            data: cr,
          },
          {
            type: "bar",
            label: "Orders",
            backgroundColor: "rgba(83, 109, 254)",
            borderColor: "rgba(83, 109, 254)",
            pointBackgroundColor: "rgba(83, 109, 254)",
            yAxisID: "B",
            data: total,
          },
          {
            label: "Views",
            backgroundColor: "rgba(163, 130, 255, 0.7)",
            borderColor: "rgba(163, 130, 255, 0.50)",
            pointBackgroundColor: "rgba(163, 130, 255, 1)",
            yAxisID: "A",
            data: views,
          },
          {
            label: "Uniques",
            backgroundColor: "rgba(131, 213, 249, 0.7)",
            borderColor: "rgba(131, 213, 249, 0.50)",
            pointBackgroundColor: "rgba(131, 213, 249, 1)",
            yAxisID: "A",
            data: uniques,
          },
        ],
      };
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