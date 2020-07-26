<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">环城建设合同管理系统-登陆</h3>
      <el-form-item prop="loginAccount">
        <el-input v-model="loginForm.loginAccount" type="text" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="loginPassword">
        <el-input
          v-model="loginForm.loginPassword"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <div class="pwd-operate-box">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        <el-button type="text" size="mini" @click="goResetPwd()">重置密码</el-button>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020-2020 crm All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        loginAccount: null,
        loginPassword: null,
        rememberMe: false,
      },
      loginRules: {
        loginAccount: [
          { required: true, trigger: ['blur', 'change'], pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '手机号格式不正确' }
        ],
        loginPassword: [
          { required: true, trigger: ['blur', 'change'], message: '密码不能为空' }
        ],
      },
      loading: false,
      redirect: undefined, // 记录来登陆页之前的想进入的页面
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
  },
  methods: {
    // 回填上回填写的密码
    getCookie() {
      const loginAccount = Cookies.get('loginAccount');
      const loginPassword = Cookies.get('loginPassword');
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        loginAccount: loginAccount === undefined ? this.loginForm.loginAccount : loginAccount,
        loginPassword: loginPassword === undefined ? this.loginForm.loginPassword : decrypt(loginPassword),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    // 进行登陆表单校验
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("loginAccount", this.loginForm.loginAccount, { expires: 30 });
            Cookies.set("loginPassword", encrypt(this.loginForm.loginPassword), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("loginAccount");
            Cookies.remove("loginPassword");
            Cookies.remove('rememberMe');
          }
          const params = {
            ...this.loginForm,
          };
          this.$store
            .dispatch('Login', params)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    // 前往重置密码
    goResetPwd() {
      const query = this.$route.query;
      this.$router.push({
        path: '/resetPwd',
        query,
      })
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.pwd-operate-box {
  margin: 0px 0px 25px 0px;
  display: flex;
  justify-content: space-between;
}
</style>
