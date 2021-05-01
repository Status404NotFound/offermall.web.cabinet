<template>
  <div>
    <div v-if="showCreateFlowModal" @close="showCreateFlowModal = false">
      <div class="modal-backdrop">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Create flow</span>
            <el-button
              @click="closeCreateFlowModal"
              style="float: right; padding: 3px 0"
              type="text"
              >Close
            </el-button>
          </div>
          <el-row>
            <el-col :span="11" style="margin: 0px 5px">
              <div>
                <h3 class="el-flow-h3">Flow name:</h3>
                <el-input v-model="createFlowModal.flowName"></el-input>
              </div>
              <div>
                <h3 class="el-flow-h3">Select offer:</h3>
                <el-select
                  @change="getTargetAndLanding"
                  v-model="createFlowModal.chouseOffer"
                  placeholder="Select"
                  style="width:100%"
                >
                  <el-option
                    v-for="offer in createFlowModal.offers"
                    :key="offer.offer_id"
                    :label="offer.offer_name"
                    :value="offer.offer_id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="createFlowModal.offerIsSelected">
                <div>
                  <h3 class="el-flow-h3">Select target:</h3>
                  <el-select
                    v-model="createFlowModal.chouseTarget"
                    placeholder="Select"
                    style="width:100%"
                  >
                    <el-option
                      v-for="target in createFlowModal.targets"
                      :key="target.advert_offer_target_name"
                      :label="target.advert_offer_target_name"
                      :value="target.advert_offer_target_status"
                      v-loading="loading"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <h3 class="el-flow-h3">Select landing</h3>
                  <div
                    v-for="landing in createFlowModal.landings"
                    :key="landing.landing_id"
                  >
                    <el-radio
                      v-model="createFlowModal.chouseLanding"
                      :label="landing.landing_id"
                      v-loading="loading"
                    >
                      <el-link style="font-size:16px;" :href="landing.url">{{ landing.name }}</el-link>
                    </el-radio>
                  </div>
                </div>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="createFlow()">Create</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <div v-else-if="showLinkModal" @close="showLinkModal = false">
      <div class="modal-backdrop">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              @click="closeLinkModal"
              style="float: right; padding: 3px 0"
              type="text"
            >
              Close
            </el-button>
            <p>
              Offer: <b>{{ linkModalData.offer }}</b>
            </p>
            <p>
              Flow: <b>{{ linkModalData.flow }}</b>
            </p>
          </div>
          <h3 class="el-flow-h3">Input SubID</h3>
          <el-row type="flex">
            <el-col :span="12" style="margin-top: 15px">
              <div class="el-form-group">
                <label for="Subid1">Subid1</label>
                <el-input
                  id="Subid1"
                  placeholder="Subid1"
                  v-model="linkModalData.inputs.Subid1"
                ></el-input>
              </div>
              <div class="el-form-group">
                <label for="Subid2">Subid2</label>
                <el-input
                  id="Subid2"
                  placeholder="Subid2"
                  v-model="linkModalData.inputs.Subid2"
                ></el-input>
              </div>
              <div class="el-form-group">
                <label for="Subid3">Subid3</label>
                <el-input
                  id="Subid3"
                  placeholder="Subid3"
                  v-model="linkModalData.inputs.Subid3"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12" style="margin: 15px">
              <div class="el-form-group">
                <label for="Subid4">Subid4</label>
                <el-input
                  placeholder="Subid4"
                  id="Subid4"
                  v-model="linkModalData.inputs.Subid4"
                ></el-input>
              </div>
              <div class="el-form-group">
                <label for="Subid5">Subid5</label>
                <el-input
                    id="Subid5"
                  placeholder="Subid5"
                  v-model="linkModalData.inputs.Subid5"
                ></el-input>
              </div>
              <div class="el-form-group">
                <label class="el-hidden">Copy Link</label>
                <div>
                  <el-button @click="copyLink()" type="success" plain>
                    Copy link
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <h3 class="el-flow-h3">Your Link</h3>
            <el-input id="fullUrl" :value="this.fullUrl"></el-input>
            <p style="color:#909399">If you need to forcefully add Geo, then add ?geo=ae at the end of the link (result: https://site.com<b>?geo=ae</b>)<br>
              Instead of "ae", the international country code in binary format (ae, om, sa, kw etc.)</p>
          </el-row>
        </el-card>
      </div>
    </div>
    <div v-else-if="showEditModal" @close="showEditModal = false">
      <div class="modal-backdrop">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              @click="closeEditModal"
              style="float: right; padding: 3px 0"
              type="text"
            >
              Close
            </el-button>
            <p>
              Offer: <b>{{ editModalData.offer }}</b>
            </p>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <h3 class="el-flow-h3">Flow name</h3>
              <el-input
                style=""
                placeholder="Flow name"
                v-model="editModalData.flowName"
              ></el-input>
              <p>Target: <span :style="'color:' + checkTarget(editModalData.target)">{{ editModalData.target }}</span></p>
            </el-col>
            <el-col :span="12">
              <h3 class="el-flow-h3">Select landing</h3>
              <div
                class="el-radio__label-wrapper"
                v-for="landing in editModalData.offerLandings"
                style="margin-bottom: 5px;"
                :key="landing.landing_id">
                <el-radio
                  v-model="editModalData.selectLanding"
                  :label="landing.landing_id"
                  >{{ landing.name }}
                  <el-link :href="landing.url"> <small>(preview)</small></el-link>
                </el-radio>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 5px">
            <el-button @click="editSubmit(editModalData.flowId)" type="primary"
              >Save</el-button
            >
          </el-row>
        </el-card>
      </div>
    </div>
    <div v-else-if="showDeleteModal" @close="showDeleteModal = false">
      <div class="modal-backdrop">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Create flow</span>
            <el-button
              @click="showDeleteModal = false"
              style="float: right; padding: 3px 0"
              type="text"
              >Close
            </el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ "List item " + o }}
          </div>
        </el-card>
      </div>
    </div>
    <div v-on:keyup.enter="getFlowsList" v-else>
      <div>
        <el-button
          style="margin: 10px; margin-left: 0"
          @click="openCreateFlowModal"
          >Create Flow
        </el-button>
      </div>
      <div class="table-filter">
        <div class="select-label">Filter by key</div>
        <el-input v-model="filterData.flow_key"> </el-input>
      </div>
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
        <div class="select-label">Filter by flow</div>
        <el-input v-model="filterData.flow_name"> </el-input>
      </div>
      <div class="table-filter">
        <div class="select-label">Filter by offer</div>
        <el-select v-model="filterData.offer">
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
        <el-select v-model="filterData.target">
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
        <el-button type="primary" @click="getFlowsList">Apply Filter</el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        :data="this.flows"
        style="width: 100%"
      >
        <el-table-column prop="flow_key" label="Key"> </el-table-column>
        <el-table-column prop="created_at" label="Date"> </el-table-column>
        <el-table-column prop="flow_name" label="Flow name"> </el-table-column>
        <el-table-column prop="geo" label="Geo"> </el-table-column>
        <el-table-column label="Offer name" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.offer_name }}
            </div>
            <el-tag type="success" effect="dark">
              {{ scope.row.offer_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Target" prop="target"> </el-table-column>
        <el-table-column label="Action" width="300">
          <template slot-scope="scope">
            <el-button @click="openLinkModal(scope.row.flow_id)">
              Get link
            </el-button>
            <el-button @click="openEditModal(scope.row.flow_id)">
              Edit
            </el-button>
            <el-button @click="deleteFlow(scope.row.flow_id)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      checked: true,
      flows: [],
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
        flow_key: "",
        flow_name: "",
        offer: "",
        target: "",
      },
      loading: true,
      showCreateFlowModal: false,
      createFlowModal: {
        flowName: "",
        offers: [],
        chouseOffer: "",
        chouseTarget: "",
        chouseLanding: "",
        offerIsSelected: false,
      },
      showLinkModal: false,
      linkModalData: {
        inputs: {
          Subid1: "",
          Subid2: "",
          Subid3: "",
          Subid4: "",
          Subid5: "",
        },
        baseUrl: "",
      },
      showEditModal: false,
      editModalData: {
        offerName: "",
        flowName: "",
        target: "",
        image: "",
        offerLandings: [],
        selectLanding: "",
      },
      showDeleteModal: false,
    };
  },
  watch: {
    flows: function () {
      return this.flows;
    },
  },
  computed: {
    fullUrl: function () {
      return (
        this.linkModalData.baseUrl +
        "/" +
        this.linkModalData.flowKey +
        "/" +
        this.urlParamsStr()
      );
    },
  },
  created() {
    document.title = this.$route.name;
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterWmUrl = "http://back.w.crmka.net/wm_api/data-list/webmaster-list";
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/flow/create-offers";

    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestWmFilter = axios.get(filterWmUrl);
    const requestOffersFilter = axios.get(filterOffersUrl);
    axios
      .all([requestOffersFilter, requestTargetsFilter, requestWmFilter])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.wm = responses[2].data.data;
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
    this.getFlowsList();
  },
  methods: {
    checkTarget(target) {
      if (target === 'Success Delivery' && target === 'Approved') return '#67C23A'
      else return '#666'
    },
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
        this.filterData.flow_key !== undefined &&
        this.filterData.flow_key !== null
      ) {
        filter.flow_key = {};
        filter.flow_key.matchMode = "equals";
        filter.flow_key.value = this.filterData.flow_key;
      }
      if (
        this.filterData.offer !== undefined &&
        this.filterData.offer !== null
      ) {
        filter.offer_id = this.filterData.offer;
      }
      if (
        this.filterData.flow_name !== undefined &&
        this.filterData.flow_name !== null
      ) {
        filter.flow_name = {};
        filter.flow_name.matchMode = "equals";
        filter.flow_name.value = this.filterData.flow_name;
      }
      if (
        this.filterData.target !== undefined &&
        this.filterData.target !== null
      ) {
        filter.advert_offer_target_status = this.filterData.target;
      }
      console.log(filter);
      return filter;
    },
    getFlowsList() {
      let flowUrl = "http://back.w.crmka.net/wm_api/flow/flow-list";
      let flowData = {
        filters: this.prepareFilters(),
        firstRow: 0,
        row: 30,
        sortOrder: 1,
      };
      axios({
        url: flowUrl,
        method: "post",
        data: flowData,
      })
        .then((resp) => {
          this.flows = resp.data.data;
          this.loading = false;
          console.log(this.flows)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openLinkModal(flow_id) {
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/flow-url/" + flow_id,
        method: "get",
      })
        .then((resp) => {
          this.linkModalData = {
            offer: resp.data.data.offer_name,
            flow: resp.data.data.flow_name,
            flowKey: resp.data.data.flow_key,
            inputs: this.linkModalData.inputs,
            baseUrl: resp.data.data.url,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      this.showLinkModal = true;
    },
    closeLinkModal() {
      this.showLinkModal = false;
      this.linkModalData = {
        inputs: {
          Subid1: "",
          Subid2: "",
          Subid3: "",
          Subid4: "",
          Subid5: "",
        },
        baseUrl: "",
      };
    },
    urlParamsStr() {
      let inputs = this.linkModalData.inputs;
      let paramsStr = "";
      for (const [key, value] of Object.entries(inputs)) {
        if (value !== "") {
          paramsStr += key.toLowerCase() + "=" + value + "&";
        }
      }
      if (paramsStr != "") {
        paramsStr = "?" + paramsStr;
      }
      return paramsStr;
    },
    copyLink() {
      let testingCodeToCopy = document.querySelector("#fullUrl");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      try {
        document.execCommand("copy");
        this.$message({
          message: "Success. Link copied to clipboard.",
          type: "success",
        });
      } catch (err) {
        this.$message({
          message: "Error. Something went wrong.",
          type: "error",
        });
      }
    },
    openEditModal(flow_id) {
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/" + flow_id,
        method: "get",
      })
        .then((resp) => {
          this.editModalData = {
            active: resp.data.data.flow.active,
            flowId: flow_id,
            offer: resp.data.data.flow.offer_name,
            offerLandings: resp.data.data.offer_landings,
            flowName: resp.data.data.flow.flow_name,
            wm_id: resp.data.data.flow.wm_id,
            use_tds: resp.data.data.flow.use_tds,
            target: resp.data.data.flow.advert_offer_target_name,
            flowKey: resp.data.data.flow.flow_key,
            offer_id: resp.data.data.flow.offer_id,
            image: resp.data.data.flow.img,
            selectLanding: resp.data.data.flow_landings[0].landing_id,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editModalData = {
        offer: "",
        flowName: "",
        target: "",
        image: "",
        offerLandings: [],
        selectLanding: "",
      };
    },
    editSubmit(flow_id) {
      let landings = this.editModalData.offerLandings;
      let landing_id = this.editModalData.selectLanding;
      let url = "";

      landings.forEach((el) => {
        if (el.landing_id === landing_id) {
          url = el.url;
        }
      });
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/edit/" + flow_id,
        method: "put",
        data: {
          active: this.editModalData.active,
          advert_offer_target_name: this.editModalData.target,
          flow_id: this.editModalData.flowId,
          flow_key: this.editModalData.flowKey,
          flow_landings: [this.editModalData.selectLanding],
          flow_name: this.editModalData.flowName,
          img: this.editModalData.image,
          offer_id: this.editModalData.offer_id,
          offer_landings: this.editModalData.offerLandings,
          offer_name: this.editModalData.offer,
          url: url,
          use_tds: this.editModalData.use_tds,
          wm_id: this.editModalData.wm_id,
        },
      })
        .then(() => {
          this.closeEditModal();
          this.getFlowsList();
          this.$message({
            message: "Success. Change completed.",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: "Error. Something went wrong.",
            type: "error",
          });
          console.log(err);
        });
    },
    openCreateFlowModal() {
      this.showCreateFlowModal = true;
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/create-offers",
        method: "get",
      })
        .then((resp) => {
          this.createFlowModal.offers = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeCreateFlowModal() {
      this.showCreateFlowModal = false;
      this.createFlowModal = {
        flowName: "",
        offers: [],
        chouseOffer: "",
        chouseTarget: "",
        chouseLanding: "",
        offerIsSelected: false,
      };
    },
    getTargetAndLanding() {
      let data = this.createFlowModal;
      const targetReq = axios({
        url: "http://back.w.crmka.net/wm_api/flow/target",
        method: "post",
        data: {
          offer_id: data.chouseOffer,
        },
      });
      const landingReq = axios({
        url:
          "http://back.w.crmka.net/wm_api/flow/offer-landings/" +
          data.chouseOffer,
        method: "get",
      });
      axios
        .all([targetReq, landingReq])
        .then(
          axios.spread((...responses) => {
            this.createFlowModal.offerIsSelected = true;
            this.createFlowModal.targets = responses[0].data.data;
            this.createFlowModal.landings = responses[1].data.data;
            this.createFlowModal.chouseTarget = "";
          })
        )
        .catch((errors) => {
          console.log(errors);
        });
    },
    createFlow() {
      let data = {
        active: 1,
        advert_offer_target_status: this.createFlowModal.chouseTarget,
        flow_landings: [this.createFlowModal.chouseLanding],
        flow_name: this.createFlowModal.flowName,
        offer_id: this.createFlowModal.chouseOffer,
        use_tds: 0,
      };
      let url = "http://back.w.crmka.net/wm_api/flow/create";
      axios({
        url: url,
        method: "post",
        data: data,
      })
        .then(() => {
          this.closeCreateFlowModal();
          this.getFlowsList();
          this.$message({
            message: "Success. Flow created.",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: "Error. Something went wrong.",
            type: "error",
          });
          console.log(err);
        });
    },
    deleteFlow(flow_id) {
      this.$confirm("This will delete the flow. Continue?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          axios({
            url: "http://back.w.crmka.net/wm_api/flow/delete/" + flow_id,
            method: "delete",
          })
            .then(() => {
              this.getFlowsList();
              this.$message({
                message: "Success. Deletion completed.",
                type: "success",
              });
            })
            .catch((err) => {
              this.$message({
                message: "Error. Something went wrong.",
                type: "error",
              });
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },
};
</script>

<style>
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
.el-flow-h3 {
  margin: 15px 0 5px 0;
  font-size: 16px;
}
.el-form-group {
  margin-bottom: 15px;
}
.el-form-group label {
  display: inline-block;
  margin-bottom: 5px;
}
.el-hidden {
  visibility: hidden !important;
}
.el-radio__label-wrapper .el-radio__label {
  font-size: 16px !important;
}
</style>