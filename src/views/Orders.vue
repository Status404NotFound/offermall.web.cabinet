<template>
  <div v-on:keyup.enter="updateTable">
    <div class="table-filter">
      <div class="select-label">Filter by date</div>
      <el-date-picker
        v-model="filterData.date.value"
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
      <el-select v-model="filterData.offer.value" placeholder="Select">
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
      <el-select v-model="filterData.target.value" placeholder="Select">
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
      <el-select v-model="filterData.geo.value" placeholder="Select">
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
      <el-select v-model="filterData.status.value" placeholder="Select">
        <el-option
          v-for="item in filter.status"
          :key="item.status_name"
          :label="item.status_name"
          :value="item.status_id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="table-filter">
      <el-button type="primary" @click="updateTable" plain>
        Apply Filter
      </el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      :data="this.orders"
      style="width: 100%;min-width:1200px;"
    >
      <el-table-column
        prop="order_hash"
        label="Order id"
        class-name="table-column"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="created_at" label="Created at" width="100"></el-table-column>
      <el-table-column label="Offer info" width="190">
        <template slot-scope="scope" style="font-size: 10px !important">
          <div>
            <span> <b>Name: </b> {{ scope.row.offer_name }} </span>
          </div>
          <div
            v-for="target in filter.targets"
            :key="target.advert_offer_target_status"
          >
            <span
              v-if="
                target.advert_offer_target_status ==
                scope.row.advert_offer_target_status
              "
            >
              <b>Target: </b> {{ target.advert_offer_target_name }}
            </span>
          </div>
          <div>
            <span>
              <b>Geo: </b> <flag :iso="scope.row.iso" />
              {{ scope.row.country_name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="wm_commmission_usd"
        label="WM com."
        width="60"
        align="center"
      >
      </el-table-column>
      <el-table-column label="Customer info" >
        <template slot-scope="scope">
          <div><b>Name: </b> {{ scope.row.name }}</div>
          <div><b>Phone: </b> {{ scope.row.phone }}</div>
          <div><b>Address: </b> {{ scope.row.address }}</div>
          <div><b>Email: </b> {{ scope.row.email }}</div>
          <div><b>Region: </b> {{ scope.row.region_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100">
        <template slot-scope="scope">
          <div
              class="el-row-status"
              style="background: #e9e9eb;"
              v-if="scope.row.status === 'Not Valid'">
            <div style="margin-bottom: 30px">
              <el-tag size="mini" type="info">
                {{ scope.row.status }}
              </el-tag>
            </div>
            <div v-if="scope.row.reason">
              {{ scope.row.reason }}
            </div>
            <div v-if="scope.row.crm_resp">
              {{ JSON.parse(scope.row.crm_resp).errorMessage }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #fde2e2"
              v-if="scope.row.status === 'Rejected'">
            <div style="margin-bottom: 30px">
              <el-tag size="mini" type="danger">
                Rejected
              </el-tag>
            </div>
            <div v-if="scope.row.reason" style="color: red;font-size: 12px;line-height: 16px;">
              {{ scope.row.reason }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #faecd7"
              v-if="scope.row.status === 'Pending'">
            <el-tag size="mini" type="warning">
              {{ scope.row.status }}
            </el-tag>
            <div v-if="scope.row.reason" style="color: orange">
              {{ scope.row.reason }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #e6f7fb"
              v-if="scope.row.status === 'Delivery In Progress'"
          >
            <el-tag size="mini" style="height: auto;white-space:normal;max-width: 85%">
              Approved
            </el-tag>
          </div>
          <div
              class="el-row-status"
              style="background: #e6f7fb"
              v-if="scope.row.status === 'Success Delivery'"
          >
            <el-tag size="mini" style="height: auto;white-space:normal;max-width: 85%">
              Approved
            </el-tag>
          </div>
          <div
              class="el-row-status"
              style="background: #fde2e2"
              v-if="scope.row.status === 'Returned'">
            <div style="margin-bottom: 30px">
              <el-tag size="mini" type="danger">
                Rejected
              </el-tag>
            </div>
            <div v-if="scope.row.reason" style="color: red;font-size: 12px;line-height: 16px;">
              {{ scope.row.reason }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #fde2e2"
              v-if="scope.row.status === 'Not Paid'">
            <div style="margin-bottom: 30px">
              <el-tag size="mini" type="danger">
                Rejected
              </el-tag>
            </div>
            <div v-if="scope.row.reason" style="color: red;font-size: 12px;line-height: 16px;">
              {{ scope.row.reason }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #fde2e2"
              v-if="scope.row.status === 'Canceled'">
            <div style="margin-bottom: 30px">
              <el-tag size="mini" type="danger">
                Rejected
              </el-tag>
            </div>
            <div v-if="scope.row.reason" style="color: red;font-size: 12px;line-height: 16px;">
              {{ scope.row.reason }}
            </div>
          </div>
          <div
              class="el-row-status"
              style="background: #e6f7fb"
              v-if="scope.row.status === 'Waiting Delivery'"
          >
            <el-tag size="mini" style="height: auto;white-space:normal;max-width: 85%">
              Approved
            </el-tag>
          </div>
          <div
              class="el-row-status"
              style="background: #e1f3d8"
              v-if="scope.row.status === 'Approved'"
          >
            <el-tag size="mini" type="success">
              {{ scope.row.status }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Sub ID" width="150">
        <template slot-scope="scope">
          <div>
            Sub ID 1:
            <span v-if="scope.row.sub_id_1">
              {{ scope.row.sub_id_1 }}
            </span>
            <span v-else style="color: red"> Not Set </span>
          </div>
          <div>
            Sub ID 2:
            <span v-if="scope.row.sub_id_2">
              {{ scope.row.sub_id_2 }}
            </span>
            <span v-else style="color: red"> Not Set </span>
          </div>
          <div>
            Sub ID 3:
            <span v-if="scope.row.sub_id_3">
              {{ scope.row.sub_id_3 }}
            </span>
            <span v-else style="color: red"> Not Set </span>
          </div>
          <div>
            Sub ID 4:
            <span v-if="scope.row.sub_id_4">
              {{ scope.row.sub_id_4 }}
            </span>
            <span v-else style="color: red"> Not Set </span>
          </div>
          <div>
            Sub ID 5:
            <span v-if="scope.row.sub_id_5">
              {{ scope.row.sub_id_5 }}
            </span>
            <span v-else style="color: red"> Not Set </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Lead info">
        <template slot-scope="scope">
          <div><b>View time</b> {{ scope.row.view_time }}</div>
          <div><b>Browser</b> {{ scope.row.browser }}</div>
          <div><b>OS</b> {{ scope.row.os }}</div>
          <div><b>Flow name</b> {{ scope.row.flow_name }}</div>
          <div><b>Referrer</b> {{ scope.row.referrer }}</div>
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
      loading: true,
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
      filter: {
        date: {
          start: "",
          end: "",
        },
        offers: [],
        targets: [
          {
            advert_offer_target_name: "",
            advert_offer_target_status: "",
          },
        ],
        regions: [
          {
            geo_id: "",
            geo_name: "",
          },
        ],
        status: [
          {
            status_id: "",
            status_name: "",
          },
        ],
      },
      filterData: {
        date: {},
        offer: {
          matchMode: "equals",
        },
        target: {
          matchMode: "equals",
        },
        geo: {
          matchMode: "equals",
        },
        status: {
          matchMode: "equals",
        },
      },
      orders: [],
    };
  },
  created() {
    document.title = this.$route.name;
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/data-list/my-offers";
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterRegionsUrl = "http://back.w.crmka.net/wm_api/data-list/geo";
    let filterStatusUrl =
      "http://back.w.crmka.net/wm_api/data-list/status-list";

    const requestOffersFilter = axios.get(filterOffersUrl);
    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestRegionsFilter = axios.get(filterRegionsUrl);
    const requestStatusFilter = axios.get(filterStatusUrl);

    axios
      .all([
        requestOffersFilter,
        requestTargetsFilter,
        requestRegionsFilter,
        requestStatusFilter,
      ])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.regions = responses[2].data.data;
          this.filter.status = responses[3].data.data;
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
        this.filterData.date.value !== undefined &&
        this.filterData.date.value !== null
      ) {
        filter.time = {};
        filter.time.start = this.filterData.date.value[0];
        filter.time.end = this.filterData.date.value[1];
      }
      if (
        this.filterData.offer.value !== undefined &&
        this.filterData.offer.value !== null
      ) {
        filter.offer = {};
        filter.offer.matchMode = "equals";
        filter.offer.value = this.filterData.offer.value;
      }
      if (
        this.filterData.geo.value !== undefined &&
        this.filterData.geo.value !== null
      ) {
        filter.geo = {};
        filter.geo.matchMode = "equals";
        filter.geo.value = this.filterData.geo.value;
      }
      if (
        this.filterData.target.value !== undefined &&
        this.filterData.target.value !== null
      ) {
        filter.target = {};
        filter.target.matchMode = "equals";
        filter.target.value = this.filterData.target.value;
      }
      if (
        this.filterData.status.value !== undefined &&
        this.filterData.status.value !== null
      ) {
        filter.order_status = {};
        filter.order_status.matchMode = "equals";
        filter.order_status.value = this.filterData.status.value;
      }
      return filter;
    },
    updateTable() {
      this.loading = true;
      let ordersUrl = "http://back.w.crmka.net/wm_api/orders/my-orders";
      let ordersData = {
        filters: this.prepareFilters(),
        firstRow: 0,
        row: 50,
        sortOrder: 1,
      };
      axios({
        url: ordersUrl,
        method: "post",
        data: ordersData,
      })
        .then((resp) => {
          this.orders = resp.data.data.orders;
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
}

.select-label {
  margin-bottom: 3px;
  font-size: 13px;
  text-align: left;
  color: #afafaf;
}

.el-table {
  font-size: 0.8rem;
}

.el-row-status {
  padding-top: 15px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}

.table-column {
  padding: 5px; /* Поля в ячейках */
  vertical-align: top !important; /* Выравнивание по верхнему краю ячеек */
}
</style>