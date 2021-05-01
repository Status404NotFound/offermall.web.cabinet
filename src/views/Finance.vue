<template>
  <div>
    <el-row :gutter="20" class="el-row">
      <el-col :span="8">
        <el-card shadow="hover">
          <el-button
            @click="showOrderPaymentModal()"
            type="primary"
            icon="el-icon-coin"
            >Order a payment</el-button
          >
          <modal
            name="order-payment-modal"
            :width="500"
            :height="300"
            :adaptive="true"
          >
            <el-button
              circle
              @click="closeOrderPaymentModal"
              style="
                font-size: 0.8rem;
                position: absolute;
                right: 10px;
                top: 10px;
              "
              >X
            </el-button>
            <h3 style="margin: 10px">Order a payment</h3>
            <el-row style="position: relative">
              <el-col :span="7"
                ><span class="modal-input-label">Amount</span></el-col
              >
              <el-col :span="14">
                <el-input-number
                  :max="this.$store.getters.finance.balance"
                  :min="minAmount"
                  v-model="amount"
                  placeholder="Please, input the amount"
                ></el-input-number>
              </el-col>
              <el-col :span="3">
                <div></div>
              </el-col>
            </el-row>

            <el-row style="position: relative">
              <el-col :span="7"
                ><span class="modal-input-label">Comment</span></el-col
              >
              <el-col :span="14">
                <el-input
                  label="Comment"
                  v-model="comment"
                  placeholder="Please, input the comment"
                ></el-input>
              </el-col>
              <el-col :span="3">
                <div></div>
              </el-col>
            </el-row>
            <el-button @click="orderPayment">Submit</el-button>
          </modal>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>Your balance: {{ this.$store.getters.finance.balance }}$</h3>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>
            Your hold balance: {{ this.$store.getters.finance.hold_balance }}$
          </h3>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-tabs type="border-card">
          <el-tab-pane label="Income">
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
              <el-select
                v-model="filterData.offer"
                clearable
                placeholder="Select"
              >
                <el-option
                  v-for="item in filter.offers"
                  :key="item.offer_id"
                  :value="item.offer_id"
                  :label="item.offer_name"
                >
                </el-option>
              </el-select>
            </div>
            <div class="table-filter">
              <div class="select-label">Filter by geo</div>
              <el-select
                v-model="filterData.geo"
                clearable
                placeholder="Select"
              >
                <el-option
                  v-for="item in filter.geo"
                  :key="item.geo_id"
                  :value="item.geo_id"
                  :label="item.geo_name"
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
              :data="incomeTableData.table_data"
              border
              style="width: 100%"
            >
              <el-table-column prop="date" label="Date"> </el-table-column>
              <el-table-column prop="offer_name" label="Offer name">
              </el-table-column>
              <el-table-column label="Lead cost">
                <template slot-scope="scope">
                  {{ scope.row.commission.base_commission }} $
                </template>
              </el-table-column>
              <el-table-column prop="leads" label="Leads"> </el-table-column>
              <el-table-column prop="pcs" label="PCS"> </el-table-column>
              <el-table-column prop="total" label="Total"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Hold">Hold</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>Checkouts list</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    balance() {
      return this.$store.getters.finance.balance;
    },
  },
  data() {
    return {
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

      filterData: {},
      filter: {
        date: {},
        offers: {},
        geo: {},
      },

      minAmount: 20,
      amount: "",
      comment: "",

      incomeTableData: [],
    };
  },
  methods: {
    showOrderPaymentModal() {
      this.$modal.show("order-payment-modal");
    },
    closeOrderPaymentModal() {
      this.$modal.hide("order-payment-modal");
    },
    updateTable() {
      let filter = this.prepareFilter();
      let incomeUrl = "http://back.w.crmka.net/wm_api/finance/history-data";
      axios({
        url: incomeUrl,
        method: "post",
        data: filter,
      })
        .then((resp) => {
          this.incomeTableData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validatePayment() {
      if (this.amount === "" || this.comment === "") {
        this.$message({
          message: "Amount and comment are required",
          type: "error",
        });
        return false;
      }

      if (this.amount > this.balance) {
        this.$message({
          message:
            "There are not enough money on your balance(" + this.balance + "$)",
          type: "error",
        });
        return false;
      }

      if (this.amount < this.minAmount) {
        this.$message({
          message: "The minimum order for payment is " + this.minAmount,
          type: "error",
        });
        return false;
      } else {
        return true;
      }
    },
    orderPayment() {
      if (this.validatePayment) {
        axios({
          url: "http://back.w.crmka.net/wm_api/finance/payment",
          method: "post",
          data: {
            amount: this.amount,
            comment: this.comment,
          },
        })
          .then((resp) => {
            console.log(resp);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    prepareFilter() {
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
        this.filterData.geo !== undefined &&
        this.filterData.geo !== null &&
        this.filterData.geo !== ""
      ) {
        filter.geo_id = this.filterData.geo;
      }
      return filter;
    },
  },
  created() {
    document.title = this.$route.name;
    let geoUrl = "http://back.w.crmka.net/wm_api/data-list/geo";
    let offerUrl = "http://back.w.crmka.net/wm_api/data-list/offers";

    const requestGeo = axios.get(geoUrl);
    const requestOffer = axios.get(offerUrl);

    axios
      .all([requestGeo, requestOffer])
      .then((resp) => {
        this.filter.geo = resp[0].data.data;
        this.filter.offers = resp[1].data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    this.updateTable();
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.modal-input-label {
  display: inline-block;
  margin-top: 10px;
  margin-left: 30px;
}

.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all 0.5s;
  text-align: center;
}

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

input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
}

.dirty {
  border-color: #5a5;
  background: #efe;
}

.dirty:focus {
  outline-color: #8e8;
}

.error {
  border-color: red;
  background: #fdd;
}

.error:focus {
  outline-color: #f99;
}
</style>