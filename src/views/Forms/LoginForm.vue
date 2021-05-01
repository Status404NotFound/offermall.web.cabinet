<template>
  <div class="login-wrap">
    <div class="center">
      <img style="margin-bottom: 15px" :src="logo" />
      <el-card shadow="hover">
        <div slot="header">
          <span>Login Form</span>
          <router-link
            style="
              text-decoration: none;
              float: right;
              color: rgb(51, 153, 153);
            "
            to="/register"
            >Create account
          </router-link>
        </div>
        <ValidationObserver ref="observer">
          <el-form
            ref="form"
            @keypress.enter.native="validate().then(login)"
            slot-scope="{ validate }"
            label-width="120px"
            label-position="top"
          >
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
            <el-form-item align="center" style="margin-bottom: 0">
              <el-button type="primary" @click="validate().then(login)"
                >Login</el-button
              >
            </el-form-item>
          </el-form>
        </ValidationObserver>
      </el-card>
    </div>
  </div>
</template>
<script>
import logo from "@/assets/logo-default.png";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "LoginForm",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  created() {
    document.title = "OfferMall Login Form";
  },
  data() {
    return {
      logo,
      username: "",
      password: "",
      errorMassage: "",
      errorCode: "",
    };
  },
  computed: {
    authStatus() {
      return this.$store.getters.authStatus;
    },
    authError() {
      return this.$store.getters.authError;
    },
  },
  methods: {
    login() {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {
          this.$message.error(this.authError);
        });
    },
  },
};
</script>
<style>
.el-form-item__label {
  line-height: 1.1 !important;
}

.login-wrap {
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
</style>