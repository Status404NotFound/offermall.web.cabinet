<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="Settings">
        <h3>Settings</h3>
        <div class="settings-item">
          <div class="input-label">Timezone:</div>
          <el-select v-model="settingsModel.timezone">
            <el-option
              v-for="item in timezoneList"
              :key="item.timezone"
              :value="item.timezone"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px">
          <el-button @click="save">Save</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Profile">
        <h3>Profile</h3>
        <el-row>
          <el-col :span="5">
            <div class="settings-item">
              <el-avatar :size="200" :src="profileData.avatar"> </el-avatar>
            </div>
          </el-col>
          <el-col :span="19">
            <div>
              Email:
              <strong v-if="profileData.email">{{ profileData.email }}</strong
              ><span style="color: red" v-else>Not Set</span>
            </div>
            <div>
              Telegram:
              <strong v-if="profileData.telegram">{{
                profileData.telegram
              }}</strong
              ><span style="color: red" v-else>Not Set</span>
            </div>
            <div>
              Timezone:
              <strong v-if="profileData.timezone">{{
                profileData.timezone
              }}</strong
              ><span style="color: red" v-else>Not Set</span>
            </div>
            <div>
              Registration time:
              <strong v-if="profileData.created_at">{{
                profileData.created_at
              }}</strong
              ><span style="color: red" v-else>Not Set</span>
            </div>
            <div style="margin-top: 10px">
              Select new Avatar: <input type="file" @change="onFileChange" />
            </div>
            <el-button style="margin-top: 10px" @click="setDefaultAvatar"
              >Set Default Avatar</el-button
            >
          </el-col>
        </el-row>
        <div class="settings-item">
          <span class="input-label">Skype:</span>
          <el-input v-model="profileModel.skype"></el-input>
        </div>
        <div class="settings-item">
          <span class="input-label">Email:</span>
          <el-input v-model="profileModel.email"></el-input>
        </div>
        <div class="settings-item">
          <span class="input-label">Telegram:</span>
          <el-input v-model="profileModel.telegram"></el-input>
        </div>
        <div class="settings-item">
          <span class="input-label">Facebook:</span>
          <el-input v-model="profileModel.facebook"></el-input>
        </div>
        <div class="settings-item">
          <span class="input-label">Visa / MasterCard:</span>
          <el-input v-model="profileModel.card"></el-input>
        </div>
        <div style="margin-top: 10px">
          <el-button @click="save">Save</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Password">
        <h3>Password</h3>
        <div class="settings-item">
          <span class="input-label">Password:</span>
          <el-input
            @change="matchCheck"
            show-password
            @blur="isPasswordTouched = true"
            v-model="passwordModel.newPassword"
          ></el-input>
        </div>
        <div class="settings-item">
          <span class="input-label">Confirm password:</span>
          <el-input
            @change="matchCheck"
            show-password
            v-model="passwordModel.replyPassword"
          ></el-input>
          <div v-if="!passwordMatch && isPasswordTouched" style="color: red">
            Password not match
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-button
            :disabled="!passwordMatch || !isPasswordTouched"
            @click="savePassword"
            >Save</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
    <modal
      name="change-avatar-modal"
      :width="400"
      :height="400"
      :adaptive="true"
    >
      <el-button
        type="danger"
        circle
        @click="closeChangeAvatarModal"
        style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
        >X
      </el-button>
      <h3 style="text-align: center">New Avatar</h3>
      <el-avatar :size="200" class="center" :src="profileModel.newAvatar" />
      <el-button
        @click="uploadAvatar"
        class="change-avatar-button"
        type="primary"
      >
        Change Avatar
      </el-button>
    </modal>
  </div>
</template>

<script>
import axios from "axios";
import avatarDefault from "@/assets/avatar-default.jpg";

export default {
  name: "Profile",
  data() {
    return {
      avatarDefault,
      timezoneList: [],
      profileData: {},
      settingsModel: {
        timezone: "",
      },
      profileModel: {
        avatar: "",
        newAvatar: "",
        phone_number: "",
        skype: "",
        email: "",
        telegram: "",
        facebook: "",
        card: "",
      },
      passwordModel: {
        newPassword: "",
        replyPassword: "",
      },
      passwordMatch: false,
      isPasswordTouched: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const timeListUrl =
        "http://back.w.crmka.net/wm_api/data-list/timezone-list";
      const profileDataUrl = "http://back.w.crmka.net/wm_api/profile/data";

      let timeListReq = axios(timeListUrl);
      let profileDataReq = axios(profileDataUrl);

      axios
        .all([timeListReq, profileDataReq])
        .then(
          axios.spread((...responses) => {
            this.timezoneList = responses[0].data.data;
            this.profileData = responses[1].data.data;
            this.applyData();
          })
        )
        .catch((errors) => {
          console.log(errors);
        });
    },
    openChangeAvatarModal() {
      this.$modal.show("change-avatar-modal");
    },
    closeChangeAvatarModal() {
      this.$modal.hide("change-avatar-modal");
    },
    applyData() {
      this.profileModel.avatar = this.profileData.avatar;
      this.profileModel.card = this.profileData.card;
      this.profileModel.confirmed_at = this.profileData.confirmed_at;
      this.profileModel.created_at = this.profileData.created_at;
      this.profileModel.email = this.profileData.email;
      this.profileModel.facebook = this.profileData.facebook;
      this.profileModel.name = this.profileData.name;
      this.profileModel.phone_number = this.profileData.phone_number;
      this.profileModel.skype = this.profileData.skype;
      this.profileModel.telegram = this.profileData.telegram;
      this.settingsModel.timezone = this.profileData.timezone;
    },
    setDefaultAvatar() {
      this.openChangeAvatarModal();
      this.profileModel.newAvatar =
        "data:image/jpeg;base64,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";
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      this.openChangeAvatarModal();
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.profileModel.newAvatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    uploadAvatar() {
      axios({
        url: "http://back.w.crmka.net/wm_api/profile/upload-avatar",
        method: "post",
        data: {
          photo: this.profileModel.newAvatar,
        },
      }).then((resp) => {
        this.closeChangeAvatarModal();
        this.$store.dispatch("avatar");
        this.getData();
        console.log(resp);
      });
    },
    matchCheck() {
      this.passwordMatch =
        this.passwordModel.newPassword === this.passwordModel.replyPassword;
    },
    save() {
      this.$confirm("Save change?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "Save completed",
          });
          axios({
            url: "http://back.w.crmka.net/wm_api/profile/update",
            method: "put",
            data: {
              avatar: this.profileModel.avatar,
              card: this.profileModel.card,
              confirmed_at: this.profileData.confirmed_at,
              created_at: this.profileData.created_at,
              email: this.profileModel.email,
              facebook: this.profileModel.facebook,
              name: this.profileModel.name,
              phone_number: this.profileModel.phone,
              skype: this.profileModel.skype,
              telegram: this.profileModel.telegram,
              timezone: this.settingsModel.timezone,
            },
          })
            .then((resp) => {
              console.log(resp);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Save canceled",
          });
        });
    },
    savePassword() {
      axios({
        url: "http://back.w.crmka.net/wm_api/profile/change-password",
        method: "post",
        data: {
          password: this.passwordModel.newPassword,
          reply_password: this.passwordModel.replyPassword,
        },
      });
    },
  },
};
</script>

<style scoped>
.settings-item {
  margin: 15px;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.change-avatar-button {
  margin-right: -50%;
  transform: translate(-50%, -50%);
  bottom: 0;
  left: 50%;
  position: absolute;
}
</style>