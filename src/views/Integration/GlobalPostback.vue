<template>
  <div class="el-card">
    <div class="el-card__body">
      <div class="global-input">
        <span>Postback URL Register</span>
        <el-input
          @focus="setFocusInput('postbackURL')"
          label="Postback URL Register"
          v-model="postbackURL"
          placeholder="Please, input the postback URL"
        >
        </el-input>
        <i class="el-icon-check" v-if="inputOnFocus === 'postbackURL'"></i>
      </div>
      <div class="global-input">
        <span>Postback URL Approved</span>
        <el-input
          @focus="setFocusInput('postbackURLApproved')"
          label="Postback URL Approved"
          v-model="postbackURLApproved"
          placeholder="Please, input the postback URL Approved"
        >
        </el-input>
        <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLApproved'"></i>
      </div>
      <div class="global-input">
        <span>Postback URL Rejected</span>
        <el-input
          @focus="setFocusInput('postbackURLCancelled')"
          label="Postback URL Cancelled"
          v-model="postbackURLCancelled"
          placeholder="Please, input the postback URL Cancelled"
        >
        </el-input>
        <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLCancelled'"></i>
      </div>
      <div class="global-input">
        <span>Postback URL Not Valid</span>
        <el-input
          @focus="setFocusInput('postbackURLNotValid')"
          label="Postback URL Not Valid"
          v-model="postbackURLNotValid"
          placeholder="Please, input the postback URL Not Valid"
        >
        </el-input>
        <i class="el-icon-check" v-if="inputOnFocus === 'postbackURLNotValid'"></i>
      </div>
      <el-row style="margin: 10px;">
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
            http://example.com/postback.php?offer={offer}&commission={commission}&status={status}&referrer={referrer}&flow={flow}&sub_id_1={sub_id_1}&browser={browser}
          </p>
          <p>At the moment of transition {offer}, {commission}... {status} and
            {referrer} macros will be replaced with the corresponding values.</p>
        </el-col>
      </el-row>
      <el-button @click="postbackSave" type="primary">Save</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GlobalPostback",
  data() {
    return {
      postbackURL: "",
      postbackURLApproved: "",
      postbackURLCancelled: "",
      postbackURLNotValid: "",

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
            console.log('INDES', this.activeParams[this.inputOnFocus.toString()].indexOf(param))
            this.activeParams[this.inputOnFocus.toString()].splice(
                this.activeParams[this.inputOnFocus.toString()].indexOf(param), 1)
            console.log('AF', this.activeParams)
            target = target
                .replace(`&${stringToAdd}`, '')
                .replace(`?${stringToAdd}`, '')
          }
        } else {
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
    postbackSave() {
      axios({
        url: " http://back.w.crmka.net/wm_api/instruments/postback/global/save",
        method: "put",
        data: {
          url: this.postbackURL,
          url_approved: this.postbackURLApproved,
          url_cancelled: this.postbackURLCancelled,
          url_notValid: this.postbackURLNotValid,
        },
      }).then((resp) => {
        if (resp.data.success) {
          this.$message({
            showClose: true,
            message: "Global postback settings successfully save.",
            type: "success",
          });
        }
      });
    },
  },
  created() {
    axios("http://back.w.crmka.net/wm_api/instruments/postback/global").then(
      (resp) => {
        console.log(resp);
        this.postbackURL = resp.data.data.url;
        this.postbackURLApproved = resp.data.data.url_approved;
        this.postbackURLCancelled = resp.data.data.url_cancelled;
        this.postbackURLNotValid = resp.data.data.url_notValid;
      }
    );
  },
};
</script>

<style scoped>
.global-input {
  margin: 10px;
  width: 50%;
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