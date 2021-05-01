<template>
  <div>
    <el-button type="primary" @click="toggleCreateDomainModal"
    >Add New Domain
    </el-button>
    <div v-if="showCreateDomainModal === true && loading === false">
      <div>
        <div>
          <h3>Select mode:</h3>
          <span>
            <el-radio class="mode-item" v-model="mode" label="ExistDomain"
            >Use existing domain</el-radio
            >
            <el-input
                style="margin-left: 25px"
                class="mode-item"
                placeholder="Please input sub Domain"
                v-model="subDomain"
            />
            <span style="font-size: 2rem; margin: 10px">.</span>
            <el-select
                class="mode-item"
                slot="append"
                placeholder="Select Domain"
                v-model="selectedDomain"
            >
              <el-option
                  v-for="existDomain in existDomains"
                  :label="existDomain"
                  :key="existDomain.key"
                  :value="existDomain"
              ></el-option>
            </el-select>
          </span>
          <div>
            <el-radio v-model="mode" label="OwnDomain">Use own domain</el-radio>
            <el-input
                style="margin-top: 20px; margin-left: 14px"
                class="mode-item"
                placeholder="Please input Domain"
                v-model="ownDomainName"
            >
            </el-input>
            <el-alert
                v-if="mode === 'OwnDomain'"
                title="Important info"
                description="Add an A-record in the domain's DNS settings (in the registrar's office) with the value 51.91.251.136. Record name - by analogy with the previous paragraph. Domain parking can take up to 72 hours (DNS update time)."
                type="info"
                show-icon
            >
            </el-alert>
          </div>
        </div>
        <div>
          <h3>Select offer:</h3>
          <el-select
              v-model="selectedOfferId"
              placeholder="Select Offer"
              @change="getFlows"
          >
            <el-option
                v-for="offer in offers"
                :key="offer.offer_id"
                :label="offer.offer_name"
                :value="offer.offer_id"
            />
          </el-select>
        </div>
        <div v-if="selectedOfferId !== ''">
          <div v-if="selectedOfferId !== ''">
            <h3>Select flow:</h3>
            <el-select
                v-model="selectedFlowId"
                placeholder="Select Flow"
                @change="getLandings"
            >
              <el-option
                  v-for="flow in flows"
                  :key="flow.flow_id"
                  :label="flow.flow_name"
                  :value="flow.flow_id"
              />
            </el-select>
          </div>
          <div v-if="selectedFlowId !== ''">
            <div v-if="landings.length === 0" style="margin-top: 15px">
              <el-alert
                  title="Landings for this offer does not exist"
                  type="error"
                  description='Please to "Forms" and create some'
                  show-icon
                  :closable="false"
              >
              </el-alert>
            </div>
            <div v-else>
              <h3>Select landing:</h3>
              <div v-for="landing in landings" :key="landing.landing_id">
                <el-radio
                    v-model="selectedLandingId"
                    :label="landing.landing_id"
                    v-loading="loading"
                >
                  {{ landing.name }}
                  <a :href="landing.url">Preview</a>
                </el-radio>
              </div>
              <el-button
                  style="margin-top: 15px"
                  type="success"
                  @click="domainParking"
              >Domain Parking
              </el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-table
        :data="domains"
        style="width: 100%; margin-top: 10px"
        border
        v-loading="loading"
    >
      <el-table-column prop="id" label="Domain ID"/>
      <el-table-column label="Link">
        <template slot-scope="scope">
          <a :href="'http://' + scope.row.name">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Offer name" prop="offer_name" />
      <el-table-column label="Flow name" prop="flow_name" />
      <!--        <el-table-column-->
      <!--            label="Action"-->
      <!--        >-->
      <!--          <template slot-scope="scope">-->
      <!--            <el-button-->
      <!--                type="primary"-->
      <!--                @click="copyScript(scope.row.landing_id)"-->
      <!--                v-clipboard="fullScript"-->
      <!--                v-clipboard:success="clipboardSuccessHandler"-->
      <!--                v-clipboard:error="clipboardErrorHandler"-->
      <!--                round-->
      <!--            >Copy-->
      <!--            </el-button>-->
      <!--            <el-button-->
      <!--                type="warning"-->
      <!--                @click="viewScriptModal(scope.row.landing_id)"-->
      <!--                round-->
      <!--            >View-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    document.title = this.$route.name;
    let existDomainsUrl = "http://back.w.crmka.net/wm_api/domain/exist-domains";
    let offersUrl = "http://back.w.crmka.net/wm_api/flow/create-offers";
    let domainsUrl = "http://back.w.crmka.net/wm_api/domain/list";

    const getOffers = axios.get(offersUrl);
    const getExistDomains = axios.get(existDomainsUrl);
    const getDomains = axios.get(domainsUrl);

    axios
        .all([getOffers, getExistDomains, getDomains])
        .then(
            axios.spread((...responses) => {
              console.log(responses);
              this.offers = responses[0].data.data;
              this.existDomains = responses[1].data.data;
              this.domains = responses[2].data.data;
              this.loading = false;
            })
        )
        .catch((errors) => {
          console.log(errors);
        });
  },
  data() {
    return {
      loading: true,
      showCreateDomainModal: false,
      selectedOfferId: "",
      selectedFlowId: "",
      selectedLandingId: "",
      offers: [],
      flows: [],
      landings: [],
      ownDomainName: "",
      selectedDomain: "",
      mode: "ExistDomain",
      subDomain: "",
      existDomains: [],
      domains: [],
    };
  },
  computed: {
    domainName: function () {
      if (this.mode === "ExistDomain") {
        return this.subDomain + "." + this.selectedDomain;
      } else {
        return this.ownDomainName;
      }
    },
  },
  methods: {
    toggleCreateDomainModal() {
      this.showCreateDomainModal = !this.showCreateDomainModal;
    },
    getLandings() {
      axios({
        url:
            "http://back.w.crmka.net/wm_api/flow/offer-landings/" +
            this.selectedOfferId,
        methods: "get",
      })
          .then((resp) => {
            console.log(resp);
            this.landings = resp.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    getFlows() {
      this.selectedFlowId = "";
      this.selectedFlowName = "";
      axios({
        url: "http://back.w.crmka.net/wm_api/flow/flow-list",
        method: "post",
        data: {
          filters: {
            offer_id: this.selectedOfferId,
          },
        },
      })
          .then((resp) => {
            this.flows = resp.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    domainParking() {
      axios({
        url: "http://back.w.crmka.net/wm_api/domain/parking",
        method: "post",
        data: {
          domainName: this.domainName,
          landingId: this.selectedLandingId,
          offerId: this.selectedOfferId,
          flowId: this.selectedFlowId,
          mode: this.mode,
        },
      })
          .then((resp) => {
            this.domains = resp.data.data.domains;
          })
          .catch((err) => {
            console.log(err);
          });
    },
  },
};
</script>

<style scoped>
.mode-item {
  display: inline-block;
  width: 200px;
}
</style>