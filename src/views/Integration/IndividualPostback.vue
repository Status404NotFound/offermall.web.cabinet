<template>
  <div>
    <el-button @click="showCreatePostbackModal" type="primary" style="margin-bottom:15px; "
      >Create a postback</el-button
    >
    <modal
      :loading="loading"
      name="create-individual-postback-modal"
      :width="900"
      :height="900"
      :adaptive="true"
    >
      <el-button
        type="danger"
        circle
        @click="closeCreatePostbackModal"
        style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
        >X
      </el-button>
      <h3 style="margin: 10px">Settings for an individual flow</h3>
      <el-row style="position: relative; margin: 10px">
        <el-col :span="7"
          ><span class="modal-input-label">Select flow</span></el-col
        >
        <el-col :span="14">
          <el-select v-model="selectedFlow" placeholder="Select">
            <el-option
              v-for="flow in flows"
              :key="flow.flow_id"
              :label="flow.flow_name"
              :value="flow.flow_id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div></div>
        </el-col>
      </el-row>

      <el-row style="position: relative; margin: 10px">
        <el-col :span="7">
          <span class="modal-input-label">Postback Register URL Register</span>
        </el-col>
        <el-col :span="14" class="global-input">
          <el-input
            @focus="setFocusInput('postbackURL')"
            label="Postback URL Register"
            v-model="postbackURL"
            placeholder="Please, input the postback URL"
          >
          </el-input>
          <i class="el-icon-check" v-if="inputOnFocus === 'postbackURL'"></i>
        </el-col>
        <el-col :span="3">
          <div></div>
        </el-col>
      </el-row>
      <el-row style="position: relative; margin: 10px">
        <el-col :span="7">
          <span class="modal-input-label">Postback URL Approved</span>
        </el-col>
        <el-col :span="14" class="global-input">
          <el-input
            @focus="setFocusInput('postbackURLApproved')"
            label="Postback URL Approved"
            v-model="postbackURLApproved"
            placeholder="Please, input the postback URL Approved"
          >
          </el-input>
          <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLApproved'"></i>
        </el-col>
        <el-col :span="3">
          <div></div>
        </el-col>
      </el-row>
      <el-row style="position: relative; margin: 10px">
        <el-col :span="7">
          <span class="modal-input-label">Postback URL Rejected</span>
        </el-col>
        <el-col :span="14" class="global-input">
          <el-input
            @focus="setFocusInput('postbackURLCancelled')"
            label="Postback URL Rejected"
            v-model="postbackURLCancelled"
            placeholder="Please, input the postback URL Rejected"
          >
          </el-input>
          <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLCancelled'"></i>
        </el-col>
        <el-col :span="3">
          <div></div>
        </el-col>
      </el-row>
      <el-row style="position: relative; margin: 10px">
        <el-col :span="7">
          <span class="modal-input-label">Postback URL Not Valid</span>
        </el-col>
        <el-col :span="14" class="global-input">
          <el-input
            @focus="setFocusInput('postbackURLNotValid')"
            label="Postback URL Not Valid"
            v-model="postbackURLNotValid"
            placeholder="Please, input the postback URL Not Valid"
          >
          </el-input>
          <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLNotValid'"></i>
        </el-col>
      </el-row>
      <el-row style="margin: 10px">
        <el-col :span="12">
          <div class="el-postback">
            <el-button size="mini" @click="addParamToUrl('offer')" :class="{'active-param': checkParam('offer')}">
              {offer}
            </el-button> - Offer name <br />
            <el-button size="mini" @click="addParamToUrl('commission')" :class="{'active-param': checkParam('commission')}">
              {commission}
            </el-button> - Cost of lead <br />
            <el-button size="mini" @click="addParamToUrl('target')" :class="{'active-param': checkParam('target')}">
              {target}
            </el-button> - Status of target <br />
            <el-button size="mini" @click="addParamToUrl('status')" :class="{'active-param': checkParam('status')}">
              {status}
            </el-button> - Status of order <br />
            <el-button size="mini" @click="addParamToUrl('country')" :class="{'active-param': checkParam('country')}">
              {country}
            </el-button> - From which country <br />
            <el-button size="mini" @click="addParamToUrl('browser')" :class="{'active-param': checkParam('browser')}">
              {browser}
            </el-button> - Customer browser <br />
            <el-button size="mini" @click="addParamToUrl('flow')" :class="{'active-param': checkParam('flow')}">
              {flow}
            </el-button> - Unique key of flow <br />
            <el-button size="mini" @click="addParamToUrl('wm_id')" :class="{'active-param': checkParam('wm_id')}">
              {wm_id}
            </el-button> - webmaster id<br />
            <el-button size="mini" @click="addParamToUrl('referrer')" :class="{'active-param': checkParam('referrer')}">
              {referrer}
            </el-button> - referrer <br />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-postback">
            <el-button size="mini" @click="addParamToUrl('subid1')" :class="{'active-param': checkParam('subid1')}">
              {subid1}
            </el-button> - Sub account #1 <br />
            <el-button size="mini" @click="addParamToUrl('subid2')" :class="{'active-param': checkParam('subid2')}">
              {subid2}
            </el-button> - Sub account #2 <br />
            <el-button size="mini" @click="addParamToUrl('subid3')" :class="{'active-param': checkParam('subid3')}">
              {subid3}
            </el-button> - Sub account #3 <br />
            <el-button size="mini" @click="addParamToUrl('subid4')" :class="{'active-param': checkParam('subid4')}">
              {subid4}
            </el-button> - Sub account #4 <br />
            <el-button size="mini" @click="addParamToUrl('subid5')" :class="{'active-param': checkParam('subid5')}">
              {subid5}
            </el-button> - Sub account #5 <br />
            <el-button size="mini" @click="addParamToUrl('geo')" :class="{'active-param': checkParam('geo')}">
              {geo}
            </el-button> - geo <br />
            <el-button size="mini" @click="addParamToUrl('reason')" :class="{'active-param': checkParam('reason')}">
              {reason}
            </el-button> - reason <br />
          </div>
        </el-col>
        <el-col :span="24">
          <p>
            Example:
            http://example.com/postback.php?offer={offer}&commission={commission}&status={status}&referrer={referrer}&flow={flow}&subid1={subid1}&browser={browser}
          </p>
          <p>
            At the moment of transition {offer}, {commission}... {status} and
            {referrer} macros will be replaced with the corresponding values.
          </p>
        </el-col>
      </el-row>
      <el-button style="margin: 10px" @click="postbackSave">Save</el-button>
    </modal>
    <el-table :data="individualPostback">
      <el-table-column prop="postback_individual_id" label="ID">
      </el-table-column>
      <el-table-column prop="flow_name" label="Flow name"> </el-table-column>
      <el-table-column prop="url" label="Register Url"> </el-table-column>
      <el-table-column prop="url_approved" label="Approved Url">
      </el-table-column>
      <el-table-column prop="url_cancelled" label="Cancelled Url">
      </el-table-column>
      <el-table-column prop="url_notValid" label="Not Valid Url">
      </el-table-column>
      <el-table-column prop="created_at" label="Date"> </el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="deletePostback(scope.row.postback_individual_id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "IndividualPostback",
  data() {
    return {
      selectedFlow: "",
      flows: [],
      postbackURL: "",
      postbackURLApproved: "",
      postbackURLCancelled: "",
      postbackURLNotValid: "",

      individualPostback: [],

      inputOnFocus: 'postbackURL',
      activeParams: {
        postbackURL: [],
        postbackURLApproved: [],
        postbackURLCancelled: [],
        postbackURLNotValid: []
      },

      loading: true,
    };
  },
  methods: {
    checkParam(param) {
      let isParam = this.activeParams[this.inputOnFocus.toString()].find(p => p === param)
      return isParam
    },
    addParamToUrl(param) {
      let stringToAdd = `${param}={${param}}`
      let target = this[this.inputOnFocus.toString()]
      if (target !== null || target !== undefined) {
        if (target.includes('?')) {
          if (!target.includes(`${stringToAdd}`)) {
            this.activeParams[this.inputOnFocus.toString()].push(param)
            target += `&${stringToAdd}`
          } else {
            this.activeParams[this.inputOnFocus.toString()].splice(
                this.activeParams[this.inputOnFocus.toString()].indexOf(param), 1)
            target = target
                .replace(`&${stringToAdd}`, '')
                .replace(`?${stringToAdd}`, '')
          }
        }
        else {
          if (!target.includes(`${stringToAdd}`)) {
            this.activeParams[this.inputOnFocus.toString()].push(param)
            target += `?${stringToAdd}`
          } else {
            this.activeParams[this.inputOnFocus.toString()].splice(
                this.activeParams[this.inputOnFocus.toString()].indexOf(param), 1)
            target = target
                .replace(`?${stringToAdd}`, '')
                .replace(`&${stringToAdd}`, '')
          }
        }
        this[this.inputOnFocus.toString()] = target
      } else {
        this.$message('Set focus on some input');
      }
    },
    setFocusInput(value) {
      if (value) this.inputOnFocus = value
      else this.inputOnFocus = ''
    },
    showCreatePostbackModal() {
      this.$modal.show("create-individual-postback-modal");
    },
    closeCreatePostbackModal() {
      this.$modal.hide("create-individual-postback-modal");
    },
    deletePostback(postbackID) {
      axios({
        url:
          "http://back.w.crmka.net/wm_api/instruments/postback/individual/delete/" +
          postbackID,
        method: "delete",
      }).then((resp) => {
        if (resp.data.success) {
          this.individualPostback = resp.data.data.list;
          this.$message({
            showClose: true,
            message: "Postback is successfully deleted",
            type: "success",
          });
        }
      });
    },
    postbackSave() {
      axios({
        url:
          " http://back.w.crmka.net/wm_api/instruments/postback/individual/save",
        method: "put",
        data: {
          flow: this.selectedFlow,
          url: this.postbackURL,
          url_approved: this.postbackURLApproved,
          url_cancelled: this.postbackURLCancelled,
          url_notValid: this.postbackURLNotValid,
        },
      }).then((resp) => {
        if (resp.data.success) {
          this.individualPostback = resp.data.data.list;
          this.$message({
            showClose: true,
            message: "New postback is successfully add.",
            type: "success",
          });
        }
        this.closeCreatePostbackModal();
      });
    },
  },
  created() {
    axios.get("http://back.w.crmka.net/wm_api/data-list/flows").then((resp) => {
      this.flows = resp.data.data;
      this.loading = false;
    });
    axios({
      url: "http://back.w.crmka.net/wm_api/instruments/postback/list",
      method: "post",
      data: {
        filters: {},
        firstRow: 0,
        rows: 30,
        sortOrder: 1,
      },
    }).then((resp) => {
      this.individualPostback = resp.data.data;
    });
    axios({
      url: "http://back.w.crmka.net/wm_api/instruments/global-postback/list",
      method: "post",
      data: {
        filters: {},
        firstRow: 0,
        rows: 30,
        sortOrder: 1,
      },
    }).then((resp) => {
      this.globalPostback = resp.data.data;
    });
  },
};
</script>

<style scoped>
.global-input {
  position: relative;
}
.global-input .el-icon-check {
  position: absolute;
  bottom: 13px;
  right: -20px;
}
.el-postback button {
  margin-bottom: 5px;
}
.el-button.active-param {
  color: teal !important;
  border-color: #b3d9d9 !important;
  background-color: #e6f2f2 !important;
}
</style>