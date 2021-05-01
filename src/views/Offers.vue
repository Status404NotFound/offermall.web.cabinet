<template>
  <div>
    <modal
      :loading="loading"
      name="offer-info-modal"
      :width="700"
      :height="700"
      :adaptive="true"
    >
      <el-button
        type="danger"
        circle
        @click="closeCreatePostbackModal"
        class="el-modal-close"
        >X</el-button>
      <p style="margin: 10px; font-size: 24px">
        Information about offer
        <strong>{{ this.selectedOfferInfo.offer_name }}</strong>
      </p>
      <strong style="margin-left: 10px">List of available landings:</strong>
      <ul>
        <li
          v-for="item in this.selectedOfferInfo.offer_landings"
          :key="item.url">
          <el-link style="font-size: 16px;" :href="'https://' + item.url" target="_blank">{{ item.name }} </el-link>
        </li>
      </ul>
      <strong style="margin-left: 10px">Description:</strong>
      <p style="margin-left: 20px">{{ this.selectedOfferInfo.description }}</p>
      <strong style="margin-left: 10px">Targets and prices:</strong>
      <el-table :data="selectedOfferInfo.targets">
        <el-table-column prop="target" label="Target"></el-table-column>
        <el-table-column label="Geo">
          <template slot-scope="scope">
            <flag :iso="scope.row.iso" />
            {{ scope.row.geo_name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="landing_price"
          label="Landing price"
        ></el-table-column>
        <el-table-column label="Commission">
          <template slot-scope="scope">
            {{ scope.row.commission.base_commission }}
          </template>
        </el-table-column>
        <el-table-column label="Hold (days)" prop="hold"> </el-table-column>
      </el-table>
    </modal>
    <el-card class="box-card" shadow="hover" v-loading="loading">
      <div v-if="showCreateFlowModal" @close="showCreateFlowModal = false">
        <div class="modal-backdrop">
          <div slot="header" class="clearfix el-card__header">
            <span >Create flow</span>
            <el-button
              @click="closeCreateFlowModal"
              style="float: right; padding: 3px 0"
              type="text"
              >Close
            </el-button>
          </div>
          <div class="el-card__body" slot="body">
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
                  <el-button @click="createFlow">Create</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-else-if="showTakeOfferModal" @close="showTakeOfferModal = false">
        <div class="modal-backdrop">
          <div slot="header" class="clearfix">
            <span style="font-size: 1.8rem"
              >Take Offer: {{ this.takeOfferModal.currentOffer.name }}</span
            >
            <el-button
              @click="closeTakeOfferModal"
              style="float: right; padding: 3px 0"
              type="text"
              >Close
            </el-button>
          </div>
          <h3 style="text-align: center">Offer conditions</h3>
          <div style="text-align: center">
            <el-checkbox v-model="takeOfferModal.agree"
              ><h4>I agree with 'Offer Conditions'</h4></el-checkbox
            >
          </div>
          <div v-if="takeOfferModal.agree">
            <el-row>
              <el-col :span="11" style="margin: 10px 5px">
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.websites"
                    >Websites</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.doorway"
                    >Doorway</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox
                    v-model="takeOfferModal.data.contextual_advertising"
                    >Contextual advertising</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.for_the_brand"
                    >Contextual advertising for the brand
                  </el-checkbox>
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.teaser_advertising"
                    >Teaser advertising</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.banner_advertising"
                    >Banner advertising</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox
                    v-model="takeOfferModal.data.social_networks_targeting_ads"
                    >Social networks: targeting advertising
                  </el-checkbox>
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.games_applications"
                    >Social networks: public relations, games, applications
                  </el-checkbox>
                </div>
              </el-col>
              <el-col :span="11" style="margin: 10px 5px">
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.email_marketing"
                    >Email marketing</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.cash_back"
                    >Cash back</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.click_under"
                    >ClickUnder/PopUnder</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.motivated"
                    >Motivated</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.adult"
                    >Adult</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.toolbar_traffic"
                    >Toolbar traffic</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.sms_sending"
                    >SMS sending</el-checkbox
                  >
                </div>
                <div class="checkbox">
                  <el-checkbox v-model="takeOfferModal.data.spam"
                    >Spam</el-checkbox
                  >
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div style="font-size: 1.5rem; margin-top: 20px">
                Number of leads:
              </div>
              <el-input-number
                v-model="takeOfferModal.data.leads"
                :min="1"
                :max="10"
              ></el-input-number>
              <span style="float: right">
                <el-button
                  @click="confirmTakeOffer(takeOfferModal.currentOffer.id)"
                >
                  Submit
                </el-button>
              </span>
            </el-row>
          </div>
        </div>
      </div>
      <div v-on:keyup.enter="updateTable" v-else>
        <div slot="header">
          <div class="table-filter">
            <div class="select-label">Filter by offers</div>
            <el-select
              v-model="filterData.offers"
              multiple
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
            <div class="select-label">Filter by target</div>
            <el-select
              v-model="filterData.targets"
              multiple
              placeholder="Select"
            >
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
            <el-select
              v-model="filterData.regions"
              multiple
              placeholder="Select"
            >
              <el-option
                v-for="item in filter.regions"
                :key="item.geo_id"
                :value="item.geo_id"
                :label="item.geo_name"
              >
              </el-option>
            </el-select>
          </div>
          <div
            v-if="this.$store.getters.role !== 'Webmaster'"
            class="table-filter"
          >
            <div class="select-label">Filter by wm</div>
            <el-select v-model="filterData.wm" multiple placeholder="Select">
              <el-option
                v-for="item in filter.wm"
                :key="item.user_id"
                :value="item.user_id"
                :label="item.user_name"
              >
              </el-option>
            </el-select>
          </div>
          <div class="table-filter">
            <el-switch
              v-model="isMyOffer"
              active-text="My Offer"
              inactive-text="All Offer"
            >
            </el-switch>
          </div>
          <div class="table-filter">
            <el-button type="primary" @click="updateTable" plain>
              Apply Filter
            </el-button>
          </div>
        </div>
        <el-table :data="offers" border>
          <el-table-column prop="offer_id" label="ID" width="70">
          </el-table-column>
          <el-table-column prop="img" label="Image" width="70">
            <template slot-scope="scope">
              <img alt="" :src="scope.row.img" height="50" width="50" />
            </template>
          </el-table-column>
          <el-table-column label="Offer name" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.offer_name }}</div>
              <el-tag
                v-if="scope.row.offer_status === 'Active'"
                type="success"
                >{{ scope.row.offer_status }}</el-tag
              >
              <el-tag
                v-if="scope.row.offer_status === 'On pause'"
                type="info"
                >{{ scope.row.offer_status }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="targets" label="Target">
            <template slot-scope="scope">
              <ul class="el-list">
                <li v-for="target in scope.row.targets" :key="target.key">
                  {{ target.advert_offer_target_name }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="targets" label="Region">
            <template slot-scope="scope">
              <ul class="el-list">
                <li v-for="target in scope.row.targets" :key="target.key">
                  <flag :iso="target.iso" />
                  {{ target.geo_name }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="targets" label="Commission">
            <template slot-scope="scope">
              <ul class="el-list">
                <li v-for="target in scope.row.targets" :key="target.key">
                  {{ target.commission.base_commission }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="Hold(Days)">
            <template slot-scope="scope">
              <ul class="el-list">
                <li v-for="target in scope.row.targets" :key="target.key">
                  {{ target.hold }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            prop="offer_id"
            label="Action"
            align="center"
            width="250"
          >
            <template slot-scope="scope">
              <div
                class="el-table-button-wrapper"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                "
              >
                <el-button size="mini" @click="offerInfo(scope.row.offer_id)"
                  >Info</el-button
                >
                <span
                  v-if="
                    scope.row.hasWebmaster && scope.row.webmaster.status === '2'
                  "
                >
                  <el-button
                    size="mini"
                    type="primary"
                    @click="openCreateFlowModal(scope.row.offer_id)"
                    >Create Flow</el-button
                  >
                </span>
                <span
                  v-else-if="
                    scope.row.hasWebmaster && scope.row.webmaster.status === '1'
                  "
                >
                  <el-button size="mini" type="warning" disabled
                    >Waiting</el-button
                  >
                </span>
                <span v-else>
                  <el-button
                    size="mini"
                    type="success"
                    @click="
                      openTakeOfferModal(
                        scope.row.offer_name,
                        scope.row.offer_id
                      )
                    "
                    >Take Offer</el-button
                  >
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  comments: ["flag"],
  data() {
    return {
      isMyOffer: false,
      loading: true,
      showTakeOfferModal: false,
      selectedOfferInfo: {},
      takeOfferModal: {
        currentOffer: "",
        agree: false,
        data: {
          websites: false,
          doorway: false,
          contextual_advertising: false,
          for_the_brand: false,
          teaser_advertising: false,
          banner_advertising: false,
          social_networks_targeting_ads: false,
          games_applications: false,
          email_marketing: false,
          cash_back: false,
          click_under: false,
          motivated: false,
          adult: false,
          toolbar_traffic: false,
          sms_sending: false,
          spam: false,
          leads: 0,
        },
      },
      showCreateFlowModal: false,
      createFlowModal: {
        flowName: "",
        offers: [],
        chouseOffer: "",
        chouseTarget: "",
        chouseLanding: "",
        offerIsSelected: false,
      },
      filter: {
        offers: [
          {
            offer_id: "",
            offer_name: "",
          },
        ],
        targets: [],
        regions: [],
        wm: [],
      },
      filterData: {},
      offers: [],
    };
  },
  created() {
    document.title = this.$route.name;
    let filterOffersUrl = "http://back.w.crmka.net/wm_api/data-list/offers";
    let filterTargetsUrl = "http://back.w.crmka.net/wm_api/data-list/targets";
    let filterRegionsUrl = "http://back.w.crmka.net/wm_api/data-list/geo";
    let filterWmUrl = "http://back.w.crmka.net/wm_api/data-list/webmaster-list";

    const requestOffersFilter = axios.get(filterOffersUrl);
    const requestTargetsFilter = axios.get(filterTargetsUrl);
    const requestRegionsFilter = axios.get(filterRegionsUrl);
    const requestWmFilter = axios.get(filterWmUrl);

    axios
      .all([
        requestOffersFilter,
        requestTargetsFilter,
        requestRegionsFilter,
        requestWmFilter,
      ])
      .then(
        axios.spread((...responses) => {
          this.filter.offers = responses[0].data.data;
          this.filter.targets = responses[1].data.data;
          this.filter.regions = responses[2].data.data;
          this.filter.wm = responses[3].data.data;
        })
      )
      .catch((errors) => {
        console.log(errors);
      });

    this.updateTable();
  },

  methods: {
    openCreateFlowModal(offerId) {
      this.showCreateFlowModal = true;
      console.log(offerId);
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/create-offers",
        method: "get",
      })
        .then((resp) => {
          this.createFlowModal.offers = resp.data.data;
          this.createFlowModal.chouseOffer = offerId;
          console.log(this.createFlowModal);
          this.getTargetAndLanding();
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
    offerInfo(offerID) {
      axios("http://back.w.crmka.net/wm_api/offers/offer-info/" + offerID).then(
        (resp) => {
          this.selectedOfferInfo = resp.data.data;
          this.showCreatePostbackModal();
        }
      );
    },
    getTargetAndLanding() {
      let data = this.createFlowModal;
      this.loading = true;
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
            this.loading = false;
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
          this.$message({
            message: "Success. Flow created.",
            type: "success",
          });
          this.updateTable();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Error. Something went wrong.",
            type: "error",
          });
        });
    },
    openTakeOfferModal(offerName, offerId) {
      this.showTakeOfferModal = true;
      this.takeOfferModal.currentOffer = {
        name: offerName,
        id: offerId,
      };
    },
    closeTakeOfferModal() {
      this.showTakeOfferModal = false;
      this.takeOfferModal = {
        currentOffer: "",
        agree: false,
        data: {
          websites: false,
          doorway: false,
          contextual_advertising: false,
          for_the_brand: false,
          teaser_advertising: false,
          banner_advertising: false,
          social_networks_targeting_ads: false,
          games_applications: false,
          email_marketing: false,
          cash_back: false,
          click_under: false,
          motivated: false,
          adult: false,
          toolbar_traffic: false,
          sms_sending: false,
          spam: false,
          leads: 0,
        },
      };
    },
    confirmTakeOffer(offerId) {
      let url = "http://back.w.crmka.net/wm_api/offers/take-offer/" + offerId;
      console.log(url);
      console.log(this.takeOfferModal.data);
      axios({
        url: url,
        method: "post",
        data: this.takeOfferModal.data,
      })
        .then(() => {
          this.closeTakeOfferModal();
          this.$message("Offer has been sent for processing.");
          this.updateTable();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Error. Something went wrong.",
            type: "error",
          });
        });
    },
    showCreatePostbackModal() {
      this.$modal.show("offer-info-modal");
    },
    closeCreatePostbackModal() {
      this.$modal.hide("offer-info-modal");
      this.selectedOfferInfo = {};
    },
    updateTable() {
      this.loading = true;
      let filters = {
        advert_offer_target_status: this.filterData.targets,
        offer_id: this.filterData.offers,
        geo_id: this.filterData.regions,
        wm_id: this.filterData.wm,
      };
      if (this.isMyOffer) {
        filters.my = "1";
      }
      let offersUrl = "http://back.w.crmka.net/wm_api/offers/offer-list";
      let offersData = {
        filters: filters,
        firstRow: 0,
        row: 50,
        sortOrder: 1,
      };
      axios({
        url: offersUrl,
        method: "post",
        data: offersData,
      })
        .then((resp) => {
          this.offers = resp.data.data;
          this.offers.forEach((item) => {
            item.hasWebmaster = item.webmaster !== 0;
          });
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

.el-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.el-table-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.el-table-button-wrapper span {
  width: 100%;
}

.el-table-button-wrapper button {
  width: 50%;
}

.checkbox {
  margin: 10px;
}
.el-modal-close {
  font-size: 0.8rem;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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