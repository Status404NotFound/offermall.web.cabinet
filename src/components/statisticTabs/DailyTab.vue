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
    <el-table :data="tableData" border v-loading="loading" :cell-class-name="setClassForCell">
      <el-table-column prop="index_date" width="100" label="Date" align="center">
      </el-table-column>
      <el-table-column label="Traffic" align="center" >
        <el-table-column prop="views" width="60" label="Views" align="center">
        </el-table-column>
        <el-table-column prop="uniques" label="Unique" align="center"> </el-table-column>
        <el-table-column prop="cr" label="CR" width="70" align="center"> </el-table-column>
        <el-table-column label="EPC" width="70" align="center">
          <template slot-scope="scope" v-if="scope.row.views != 0">
            {{ rounded(scope.row.commission_success / scope.row.views) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Conversion statistics" align="center">
        <el-table-column prop="total" width="70" label="Total" align="center"></el-table-column>
        <el-table-column prop="pending" label="Pending" align="center" color="primary"></el-table-column>
        <el-table-column prop="approved" width="90" label="Approved" align="center"></el-table-column>
        <el-table-column prop="rejected" label="Rejected" align="center"></el-table-column>
        <el-table-column prop="not_valid" label="Not Valid" align="center"></el-table-column>
        <!--        <el-table-column-->
        <!--            prop="success_delivery"-->
        <!--            label="Success delivery">-->
        <!--        </el-table-column>-->
      </el-table-column>
      <el-table-column label="Quality" align="center">
        <el-table-column label="Approve Rate" align="center">
          <template slot-scope="scope">{{scope.row.ar}} %</template>
        </el-table-column>
        <el-table-column label="Not Valid Rate" align="center">
          <template slot-scope="scope">{{scope.row.nr}} %</template>
        </el-table-column>
        <el-table-column label="Success Rate" align="center">
          <template slot-scope="scope">{{scope.row.sr}} %</template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Finance $" align="center">
        <el-table-column
          width="95"
          label="Potential"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.commission_potential}} $</template>
        </el-table-column>
        <el-table-column label="Success" align="center">
          <template slot-scope="scope">{{scope.row.commission_success}} $</template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <line-chart :chartdata="getChartData()" :options="chartOptions" />
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
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      loading: true,
    };
  },
  created() {
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/data-list/my-offers";
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterRegionsUrl = "http://back.w.crmka.net/wm_api/data-list/geo";
    let filterFlowsUrl = "http://back.w.crmka.net/wm_api/data-list/flows";

    const requestOffersFilter = axios.get(filterOffersUrl);
    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestRegionsFilter = axios.get(filterRegionsUrl);
    const requestFlowsFilter = axios.get(filterFlowsUrl);

    axios
      .all([
        requestOffersFilter,
        requestTargetsFilter,
        requestRegionsFilter,
        requestFlowsFilter,
      ])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.regions = responses[2].data.data;
          this.filter.flows = responses[3].data.data;
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
    this.updateTable();
  },
  methods: {
    setClassForCell(data) {
      let className = 'el-table-row '
      switch(data.columnIndex) {
        case 5: className += 'el-total'
          break
        case 6: className += 'el-pending'
          break
        case 7: className += 'el-approved'
          break
        case 8: className += 'el-rejected'
          break
        case 9: className += 'el-not-valid'
          break
      }
      return className
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
        this.filterData.geo !== undefined &&
        this.filterData.geo !== null &&
        this.filterData.geo !== ""
      ) {
        filter.geo_id = this.filterData.geo;
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
    updateTable() {
      this.loading = true;
      let statisticUrl = "http://back.w.crmka.net/wm_api/statistics/daily";
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
    rounded(number) {
      return number.toFixed(2);
    },
    getChartData() {
      let date = [];
      let pending = [];
      let waitingDelivery = [];
      let rejected = [];
      let deliveryInProgress = [];
      let successDelivery = [];
      this.tableData.map((el) => {
        date.push(el.index_date.slice(0, -5));
        pending.push(el.pending);
        waitingDelivery.push(el.waiting_for_delivery);
        rejected.push(el.rejected);
        deliveryInProgress.push(el.delivery_in_progress);
        successDelivery.push(el.success_delivery);
      });
      return {
        labels: date.reverse(),
        datasets: [
          {
            label: "Pending",
            backgroundColor: "#7FBAC6",
            data: pending.reverse(),
          },
          {
            label: "Waiting delivery",
            backgroundColor: "#83D5F9",
            data: waitingDelivery.reverse(),
          },
          {
            label: "Rejected",
            backgroundColor: "#F48684",
            data: rejected.reverse(),
          },
          {
            label: "Delivery in Progress",
            backgroundColor: "#92CBF9",
            data: deliveryInProgress.reverse(),
          },
          {
            label: "Success Delivery",
            backgroundColor: "#A7D8A9",
            data: successDelivery.reverse(),
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss">
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
.el-table-row {
  &.el-total {
    background: #e6f7fb !important;
  }
  &.el-pending {
    background: #faecd7 !important;
  }
  &.el-approved {
    background: #e1f3d8 !important;
  }
  &.el-rejected {
    background: #fde2e2 !important;
  }
  &.el-not-valid {
    background: #e9e9eb !important;
  }
}
</style>