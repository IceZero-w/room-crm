<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="loginPassword">
      <el-input v-model="user.loginPassword" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newLoginPassword">
      <el-input v-model="user.newLoginPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { resetPwd } from '@/api/login'

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newLoginPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      user: {
        loginPassword: undefined,
        newLoginPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        loginPassword: [
          { required: true, message: "旧密码不能为空", trigger: ["blur","change"] }
        ],
        newLoginPassword: [
          { required: true, message: "新密码不能为空", trigger: ["blur","change"] },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: ["blur","change"] }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: ["blur","change"] },
          { required: true, validator: equalToPassword, trigger: ["blur","change"] }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const { telePhone: loginAccount } = this.userInfo;
          const { loginPassword, newLoginPassword, confirmPassword } = this.user;
          const params = {
            loginAccount,
            loginPassword,
            newLoginPassword,
            confirmPassword,
          }
          resetPwd(params).then(
            res => {
              if (res.code === 200) {
                this.$message.success({
                  message: '密码重置成功',
                });
              }
            }
          );
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
