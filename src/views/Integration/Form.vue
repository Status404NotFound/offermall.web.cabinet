<template>
  <div>
    <el-button @click="toggleCreateFormModal">Create Form</el-button>
    <div v-if="showCreateFormModal">
      <el-row>
        <el-col :span="12">
          <div>
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
              <div v-if="flows.length === 0" style="margin-top: 15px">
                <el-alert
                    title="Flows for this offer does not exist"
                    type="error"
                    description='Please to "Offers" and create some'
                    show-icon
                    :closable="false"
                >
                </el-alert>
              </div>
              <div v-else>
                <h3>Select flow:</h3>
                <div v-for="flow in flows" :key="flow.flow_id">
                  <el-radio
                      v-model="selectedFlowId"
                      :label="flow.flow_id"
                      v-loading="loading"
                      @change="getFlowName"
                  >
                    {{ flow.flow_name }}
                  </el-radio>
                </div>
                <el-input
                    type="url"
                    placeholder="Please input Landing Url"
                    v-model="formUrl"
                    style="margin-top: 15px"
                >
                </el-input>

                <el-button
                    type="primary"
                    style="margin: 15px"
                    :disabled="
                    selectedFlowId === '' ||
                    formUrl === '' ||
                    selectedOfferId === ''
                  "
                    @click="generateForm"
                >
                  Generate Form
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-if="urlValidator.status" :span="12">
          <h3>
            {{ this.formCode }}
          </h3>
        </el-col>
        <el-col v-else :span="12">
          <div v-if="urlValidator.message !== ''">
            <el-alert
                :title="this.urlValidator.message"
                type="error"
                :description="this.urlValidator.description"
                show-icon
                :closable="false"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
        v-loading="loading"
        border
        :data="forms"
        style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="id" label="Form ID"/>
      <el-table-column prop="flow_name" label="Flow Name"/>
      <el-table-column prop="offer_name" label="Offer Name"/>
      <el-table-column prop="url" label="Url"/>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button
              type="primary"
              @click="copyScript(scope.row.landing_id)"
              v-clipboard="fullScript"
              v-clipboard:success="clipboardSuccessHandler"
              v-clipboard:error="clipboardErrorHandler"
              round
          >Copy
          </el-button>
          <el-button
              type="warning"
              @click="viewScriptModal(scope.row.landing_id)"
              round
          >View
          </el-button>
          <el-button
              type="danger"
              @click="deleteForm(scope.row.id)"
              round
          >Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <pre>
        <code ref="fullScript" id="fullScript" :class="fullScriptClass">
          {{ fullScript }}
        </code>
    </pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    fullScriptClass() {
      return this.showScriptModal ? "visible" : "hidden";
    },
    fullScript() {
      return ('\n' +
          'in head section(for default stylization): \n' +
          '<link rel="stylesheet" href="http://t.crmka.net/form.css">\n' +
          'in body section: \n' +
          '   <div class="form_block">\n' +
          "     <!-- if you want to add several form just add another div -->\n" +
          "   </div>\n" +
          '   <script src="http://t.crmka.net/generate-form.js"><' +
          "/script>\n" +
          "   <script>\n" +
          "     formInit(" +
          this.chosenLandingId +
          ");\n" +
          "   <" +
          "/script>\n"
      );
    },
  },
  data() {
    return {
      showCreateFormModal: false,
      showScriptModal: false,
      formCode: "",
      formUrl: "",
      chosenLandingId: "",
      selectedOfferId: "",
      selectedOfferName: "",
      offers: [],
      selectedFlowId: "",
      selectedFlowName: "",
      flows: [],

      forms: [],

      urlValidator: {
        message: "",
        status: false,
        description: "",
      },

      loading: true,
    };
  },
  created() {
    document.title = this.$route.name;
    this.getForms();
    axios({
      url: "http://back.w.crmka.net/wm_api/flow/create-offers",
      method: "get",
    })
        .then((resp) => {
          this.loading = false;
          this.offers = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
  },
  methods: {
    generateForm() {
      if (!this.validationUrl()) {
        this.urlValidator.message = "Url is invalid";
        this.urlValidator.status = false;
        this.urlValidator.description =
            "Url should be like http://www.example.com";
      } else {
        this.urlValidator.status = true;
        axios({
          url: "http://back.w.crmka.net/wm_api/form/generate-form",
          method: "post",
          data: {
            flowId: this.selectedFlowId,
            url: this.formUrl,
            offerId: this.selectedOfferId,
            flowName: this.selectedFlowName,
            offerName: this.selectedOfferName,
          },
        }).then((resp) => {
          this.formCode = resp.data.data.formCode;
          this.getForms();
        });
      }
    },
    deleteForm(formId) {
      console.log(formId)
      axios({
        url: "http://back.w.crmka.net/wm_api/form/delete-form",
        method: "post",
        data: {id: formId}
      }).then((resp) => {
        this.forms = resp.data.data;
      });
    },
    viewScriptModal(chosenLandingId) {
      this.showScriptModal = true;
      this.chosenLandingId = chosenLandingId;
    },
    getForms() {
      axios({
        url: "http://back.w.crmka.net/wm_api/form/list",
        methods: "get",
      }).then((resp) => {
        this.forms = resp.data.data;
      });
    },
    copyScript(landingId) {
      this.chosenLandingId = landingId;
      this.loading = true;
      setTimeout(() => {
        this.$clipboard(this.fullScript);
        this.loading = false;
        this.$message({
          message: "Congrats, this is a success message.",
          type: "success",
        });
      }, 3600);
    },
    getFlows() {
      this.loading = true;
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
            this.loading = false;
            this.flows = resp.data.data;
            this.getOfferName();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    clipboardSuccessHandler({value}) {
      console.log("success", value);
    },

    clipboardErrorHandler({value}) {
      console.log("error", value);
    },
    validationUrl() {
      let pattern = new RegExp(
          "^http[s]?\\:\\/\\/(www)?\\.?[\\w\\.-]+?\\.\\w+[.\\=\\?\\w\\/]*$"
      );
      return !!pattern.test(this.formUrl);
    },
    toggleCreateFormModal() {
      this.showCreateFormModal = !this.showCreateFormModal;
    },
    getOfferName() {
      this.offers.forEach((element) => {
        if (this.selectedOfferId === element.offer_id) {
          this.selectedOfferName = element.offer_name;
        }
      });
    },
    getFlowName() {
      this.flows.forEach((element) => {
        if (this.selectedFlowId === element.flow_id) {
          this.selectedFlowName = element.flow_name;
        }
      });
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}

.visible {
  display: block;
}
</style>