<template>
  <div class="reg-wrap">
    <div class="center">
      <img style="margin-bottom: 15px" :src="logo" />
      <el-card shadow="hover">
        <div slot="header">
          <span>Register Form</span>
          <router-link
            style="
              text-decoration: none;
              float: right;
              color: rgb(51, 153, 153);
            "
            to="/login"
            >Login
          </router-link>
        </div>
        <ValidationObserver v-if="!done" ref="observer">
          <el-form
            ref="form"
            @keypress.enter.native="validate().then(openContactInfoModal)"
            slot-scope="{ validate }"
            label-width="120px"
            label-position="top"
          >
            <ValidationProvider rules="required|email" name="Email">
              <el-form-item
                slot-scope="{ errors }"
                :error="errors[0]"
                label="Email"
              >
                <el-input
                  placeholder="Please input your email"
                  v-model.trim="email"
                >
                </el-input>
              </el-form-item>
            </ValidationProvider>

            <ValidationProvider rules="required" name="Username">
              <el-form-item
                slot-scope="{ errors }"
                :error="errors[0]"
                label="Username"
              >
                <el-input
                  placeholder="Please input your username"
                  v-model.trim="username"
                >
                  <label>Username</label>
                </el-input>
              </el-form-item>
            </ValidationProvider>

            <ValidationProvider rules="required" name="Password" vid="password">
              <el-form-item
                prop="pass"
                slot-scope="{ errors }"
                :error="errors[0]"
                label="Password"
              >
                <el-input
                  placeholder="Please input your password"
                  show-password
                  v-model="password"
                ></el-input>
              </el-form-item>
            </ValidationProvider>

            <ValidationProvider
              rules="required|confirmed:password"
              name="Password Confirmation"
            >
              <el-form-item
                prop="pass"
                slot-scope="{ errors }"
                :error="errors[0]"
                label="Password Confirmation"
              >
                <el-input
                  placeholder="Please input your password"
                  show-password
                  v-model="confirmation"
                ></el-input>
              </el-form-item>
            </ValidationProvider>
            <el-form-item align="center" style="margin-bottom: 0">
              <el-button
                type="primary"
                @click="validate().then(openContactInfoModal)"
                >Create Account</el-button
              >
            </el-form-item>
          </el-form>
        </ValidationObserver>
        <div v-else class="reg-done">
          <el-alert
            title="Thank you for registration"
            type="success"
            show-icon
            description="Our manager will contact you as soon as possible"
            :closable="false"
          >
          </el-alert>
        </div>
      </el-card>
    </div>
    <modal name="contact-info-modal" :width="500" :adaptive="true">
      <h3 style="margin: 10px">Contact info</h3>
      <el-button
        circle
        @click="closeContactInfoModal"
        style="font-size: 0.8rem; position: absolute; right: 10px; top: 10px"
        >X
      </el-button>
      <el-alert
        title="Please, input your telegram or skype username"
        type="info"
        center
        style="margin-top: 20px"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row>
        <div class="contact-item">
          <el-col :span="4">
            <span class="contact-item-input-label"> Telegram username </span>
          </el-col>
          <el-col :span="4">
            <el-input
              class="contact-item-input"
              placeholder="Please input your telegram username"
              v-model="telegram"
            ></el-input>
          </el-col>
        </div>
      </el-row>
      <el-row>
        <div class="contact-item">
          <el-col :span="4">
            <span class="contact-item-input-label"> Skype username </span>
          </el-col>
          <el-col :span="4">
            <el-input
              class="contact-item-input"
              placeholder="Please input your skype username"
              v-model="skype"
            ></el-input>
          </el-col>
        </div>
      </el-row>
      <el-row> </el-row>
      <div class="contact-item">
        <el-button type="primary" @click="createAccount">Submit</el-button>
      </div>
    </modal>
  </div>
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo-default.png";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "RegisterForm",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      logo,
      email: "",
      username: "",
      password: "",
      skype: "",
      telegram: "",
      confirmation: "",
      done: false,
    };
  },
  created() {
    document.title = "OfferMall Registration Form";
  },
  methods: {
    createAccount() {
      if (this.telegram === "" && this.skype === "") {
        this.$message.error("You must input telegram or skype username!");
      } else {
        axios({
          url: "http://back.l.crmka.net/angular_api/user/create",
          method: "post",
          data: {
            currency: "1",
            email: this.email,
            password: this.password,
            role: "3",
            timezone: "Europe/Moscow",
            username: this.username,
            telegram: this.telegram,
            skype: this.skype,
          },
        }).then(() => {
          this.closeContactInfoModal();
          this.done = true;
        });
      }
    },
    openContactInfoModal() {
      this.$modal.show("contact-info-modal");
    },
    closeContactInfoModal() {
      this.$modal.hide("contact-info-modal");
    },
  },
};
</script>

<style scoped>
.el-form-item__label {
  line-height: 1.1 !important;
}

.reg-wrap {
  height: 100vh;
  width: 100vw;
  background: rgb(67, 74, 80);
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.contact-item {
  margin-top: 20px;
  margin-left: 25px;
}

.contact-item-input {
  width: 300px;
  display: flex;
}

.contact-item-input-label {
  text-align: center;
}

.reg-done {
  width: 300px;
}
</style>