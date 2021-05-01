<template>
  <div>
    <el-button style="margin-top: 20px" type="primary" @click="getNewApiKey"
    >Get New API Key
    </el-button
    >
    <el-button v-if="apiKeys !== []" style="margin-top: 20px" @click="showApiInfoModal"
    >API Documentation
    </el-button
    >
    <el-button v-if="apiKeys !== []" style="margin-top: 20px" @click="showApiScriptInfoModal"
    >API Script Documentation
    </el-button
    >
    <el-table
        v-loading="loading"
        border
        :data="this.apiKeys"
        style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="api_key" label="Api Key"></el-table-column>
      <el-table-column prop="status" label="Action">
        <template slot-scope="scope">
          <el-button
              style="margin: 10px"
              type="danger"
              @click="deleteApiKey(scope.row.api_key)"
          >Delete
          </el-button
          >
          <el-button style="margin: 10px" type="success"
          >Copy Api Key
          </el-button
          >
          <el-button
              type="primary"
              @click="showCreateApiScriptModal(scope.row.api_key)"
          >Create Script
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <modal
        name="api-script-info-modal"
        :width="800"
        :height="700"
        :adaptive="true"
    >
      <el-button
          circle
          @click="closeApiScriptInfoModal"
          style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
      >X
      </el-button>
      <div class="doc-card">
        <div slot="header" class="clearfix">
          <h3>API Script Documentation</h3>
        </div>
        <ul>
          <li>Make sure your landing page is processed with PHP</li>
          <li>Select from the list or create a new Api Key and click "Get Script"</li>
          <li>Select the flow and geo you need, and then download the script</li>
          <li>Drag the scripts to your site folder and follow these steps:
            <ul>
              <li>In the form tag:
                <pre> add "orderformcdn" to class list; onsubmit="return validationForm(this)"; method="post"</pre>
              </li>
              <li>Make sure your form contains the fields 'name' (required), 'phone' (required) and 'address' (optional)
                <div>
                  <pre>{{ desc.html }}</pre>
                </div>
              </li>
              <li>Add this script to your land
                <div>
                  <pre>{{ desc.jsScript }}</pre>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </modal>
    <modal
        name="api-info-modal"
        :width="700"
        :height="500"
        :adaptive="true"
    >
      <el-button
          circle
          @click="closeApiInfoModal"
          style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
      >X
      </el-button>
      <div class="doc-card">
        <div slot="header" class="clearfix">
          <h3>API Documentation</h3>
        </div>
        <el-tag type="warning">{{ this.api_doc.createOrder.method }}</el-tag>
        <span style="margin-left: 10px">{{
            this.api_doc.createOrder.requestUrl
          }}</span>
        <div class="doc_item">
          <span style="color: rgb(51, 153, 153)">Headers</span>
          <span>
          <div
              v-for="[key, value] in Object.entries(
              this.api_doc.createOrder.headers
            )"
              :key="key"
          >
            <span style="color: orange">{{ key }}</span
            >: <span style="color: #7f7f7f">{{ value }}</span>
          </div>
        </span>
        </div>
        <div class="doc_item">
        <span style="color: rgb(51, 153, 153)"
        >Required Data</span
        >
          <span>
          <div
              v-for="[key, value] in Object.entries(
              this.api_doc.createOrder.requiredData
            )"
              :key="key"
          >
            <span style="color: red">{{ key }}</span
            >: <span style="color: #7f7f7f">{{ value }}</span>
          </div>
        </span>
        </div>
        <div class="doc_item">
        <span style="color: rgb(51, 153, 153)"
        >Optional Data</span
        >
          <span>
          <div
              v-for="[key, value] in Object.entries(
              this.api_doc.createOrder.optionalData
            )"
              :key="key"
          >
            <span style="color: green">{{ key }}</span
            >: <span style="color: #7f7f7f">{{ value }}</span>
          </div>
        </span>
        </div>
      </div>
    </modal>
    <modal
        name="create-api-script-modal"
        :width="500"
        :height="300"
        :adaptive="true"
    >
      <el-button
          circle
          @click="closeCreateApiScriptModal"
          style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
      >X
      </el-button>
      <div>
        <div class="create-script-model-field">
          API Key: <strong>{{ this.createScriptModel.api_key }}</strong>
        </div>
        <div class="table-filter">
          <div class="select-label">Flow:</div>
          <el-select v-model="createScriptModel.flow" @change="getGeo()" value-key="flow_id">
            <el-option
                v-for="item in this.flows"
                :key="item.flow_id"
                :label="item.flow_name"
                :value="item">
            </el-option>
          </el-select>
        </div>
        <div v-if="createScriptModel.flow.flow_id" class="table-filter">
          <div class="select-label">Geo:</div>
          <el-select v-model="createScriptModel.geo">
            <el-option
                v-for="item in this.flowGeos"
                :key="item.geo_id"
                :label="item.geo_name"
                :value="item.iso">
            </el-option>
          </el-select>
        </div>
        <el-button class="create-script-model-field" @click="getScript"
        >Get Script
        </el-button
        >
      </div>
    </modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      apiKeys: [],
      loading: true,
      createScriptModel: {
        api_key: "",
        flow: {},
        geo: "",
      },
      desc: {
        html: '<input type="text" name="name" required>\n' +
            '<input type="tel" name="phone" required>\n' +
            '<input type="text" name="address">\n' +
            '<button type="submit">CLICK</button>',
        jsScript: '<script type="text/javascript" src="api.js"><'+'/script>\n' +
            '<script type="text/javascript">\n' +
            '    getLandData();\n' +
            '\n' +
            '    function validationForm(data) {\n' +
            '        if(data.name.value.length < 2){\n' +
            '            console.log(\'Name must be bigger or equals 2\')\n' +
            '            return false;\n' +
            '        } else phoneValid(data.phone.value, data.phone_num_count.value);\n' +
            '    }\n' +
            '    function phoneValid(phone, phone_num_count) {\n' +
            '        if (phone.length !== Number(phone_num_count)) {\n' +
            '            console.log(\'Phone number must be equals \' + phone_num_count)\n' +
            '            return false\n' +
            '        }\n' +
            '        return true;\n' +
            '    }\n' +
            '<'+'/script>'
      },
      flows: [],
      regions: [],
      flowGeos: [],
      api_doc: {
        createOrder: {
          requestUrl: "http://back.w.crmka.net/api/orders/create-order",
          method: "POST",
          requiredData: {
            "api-key": "Your Api Key",
            "flow-key": "Flow key with enabled API checkbox",
            name: "Customer name",
            phone: "Customer phone",
            geoiso: "Country in ISO format",
          },
          optionalData: {
            ip: "Customer IP address",
            address: "Customer Address",
            wm_ref: "Webmaster referrer",
            subid1: "Sub account #1",
            subid2: "Sub account #2",
            subid3: "Sub account #3",
            subid4: "Sub account #4",
            subid5: "Sub account #5",
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      },
    };
  },
  created() {
    this.getAllApiKeys();
    axios({
      url: "http://back.w.crmka.net/wm_api/flow/flow-list",
      method: "post",
      data: {
        filters: {},
      },
    }).then((resp) => {
      this.flows = resp.data.data
    })
    axios('http://back.w.crmka.net/wm_api/data-list/geo').then((resp) => {
      this.regions = resp.data.data
    })
    document.title = this.$route.name;
  },
  methods: {
    getNewApiKey() {
      axios({
        url: "http://back.w.crmka.net/api/api-key/new",
        method: "get",
      })
          .then((resp) => {
            console.log(resp.data.data.apiKey);
            this.getAllApiKeys();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    showCreateApiScriptModal(api_key) {
      this.createScriptModel.api_key = api_key;
      this.$modal.show("create-api-script-modal");
    },
    closeCreateApiScriptModal() {
      this.$modal.hide("create-api-script-modal");
    },
    showApiInfoModal() {
      this.$modal.show("api-info-modal");
    },
    closeApiInfoModal() {
      this.$modal.hide("api-info-modal");
    },
    showApiScriptInfoModal() {
      this.$modal.show("api-script-info-modal");
    },
    closeApiScriptInfoModal() {
      this.$modal.hide("api-script-info-modal");
    },
    getGeo() {
      console.log('test-string')
      axios('http://back.w.crmka.net/wm_api/data-list/flow-geo/' + this.createScriptModel.flow.flow_id).then((resp) => {
        this.flowGeos = resp.data.data
      })
    },
    getScript() {
      axios({
        url: "http://back.w.crmka.net/api/api-script/new",
        method: "POST",
        data: {
          api_key: this.createScriptModel.api_key,
          flow_key: this.createScriptModel.flow.flow_key,
          geo: this.createScriptModel.geo
        },
        responseType: "blob",
      })
          .then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement("a");

            fileLink.href = fileURL;
            fileLink.setAttribute("download", "api.zip");
            document.body.appendChild(fileLink);

            fileLink.click();
          })
          .catch((err) => console.log(err));
    },
    deleteApiKey(api_key) {
      this.$confirm(
          "This will permanently delete Api Key. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
      ).then(() => {
        axios({
          url: "http://back.w.crmka.net/api/api-key/delete-key",
          method: "post",
          data: {
            api_key: api_key,
          },
        })
            .then((resp) => {
              this.$message({
                type: "success",
                message: "Delete completed",
              });
              this.apiKeys = resp.data.data;
              this.getAllApiKeys();
            })
            .catch((err) => {
              console.log(err);
            });
      });
    },
    getAllApiKeys() {
      axios({
        url: "http://back.w.crmka.net/api/api-key/get-all-keys",
        method: "get",
      })
          .then((resp) => {
            this.apiKeys = resp.data.data;
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
.doc-card {
  margin: 10px;
}

.doc_item {
  margin: 10px;
}

.create-script-model-field {
  margin: 20px;
}

.table-filter {
  margin: 20px;
}

.select-label {
  text-align: left;
  color: #afafaf;
}
</style>