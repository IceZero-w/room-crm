<template>
  <div class="login">
    <el-form ref="loginResetForm" :model="loginResetForm" :rules="loginRules" class="login-form">
      <h3 class="title">环城建设合同管理系统-重置密码</h3>
      <el-form-item prop="loginAccount">
        <el-input v-model="loginResetForm.loginAccount" type="text" auto-complete="off" placeholder="请填写手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="loginPassword">
        <el-input
          v-model="loginResetForm.loginPassword"
          type="password"
          auto-complete="off"
          placeholder="当前密码"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="newLoginPassword">
        <el-input
          v-model="loginResetForm.newLoginPassword"
          type="password"
          auto-complete="off"
          placeholder="新密码"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="loginResetForm.confirmPassword"
          type="password"
          auto-complete="off"
          placeholder="二次确认密码"
          @keyup.enter.native="handleResetPassword"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <div class="pwd-operate-box">
        <div />
        <el-button type="text" size="mini" @click="goLgin()">返回登陆</el-button>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleResetPassword"
        >重置密码</el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020-2020 crm All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { resetPwd } from '@/api/login'

export default {
  name: 'ResetPwd',
  data() {
    return {
      loginResetForm: {
        loginAccount: null,
        loginPassword: null, // 当前密码
        newLoginPassword: null, // 新密码
        confirmPassword: null, // 二次确认密码
      },
      loginRules: {
        loginAccount: [
          { required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, trigger: ['change', 'blur'], message: '手机号格式不正确' }
        ],
        loginPassword: [
          { required: true, trigger: ['change', 'blur'], message: '密码不能为空' }
        ],
        newLoginPassword: [
          { required: true, trigger: ['change', 'blur'], message: '新密码不能为空' }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: ['change', 'blur'],
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('二次确认密码不能为空'));
              } else if (value !== this.loginResetForm.newLoginPassword) {
                callback(new Error('密码不一致'));
              }
              callback();
            },
          }
        ],
      },
      loading: false,
      redirect: undefined
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
  created() {},
  methods: {
    // 表单校验
    handleResetPassword() {
      this.$refs.loginResetForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.resetPwdFn();
        }
      });
    },
    // 重置密码
    async resetPwdFn() {
      // 密码参数需不需要加密【todoList】
      const params = {
        ...this.loginResetForm,
      };
      this.loading = true;
      resetPwd(params).then(res => {
        if (res.code === 200) {
          this.$message.success({
            message: '密码重置成功',
          });
        }
      });
      this.loading = false;
    },
    // 返回登陆
    goLgin() {
      this.$router.go(-1);
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
  margin: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
}
</style>
