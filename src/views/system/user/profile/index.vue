<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" /><span style="margin-left: 10px;">用户名称</span>
                <div class="pull-right">{{ userInfo.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" /><span style="margin-left: 10px;">手机号码</span>
                <div class="pull-right">{{ userInfo.telePhone }}</div>
              </li>
              <!-- <li class="list-group-item">
                <svg-icon icon-class="tree" /><span style="margin-left: 10px;">所属部门</span>
                <div class="pull-right" v-if="userInfo.dept">{{ userInfo.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" /><span style="margin-left: 10px;">所属角色</span>
                <div class="pull-right">{{ roleGroup }}</div>
              </li> -->
              <li class="list-group-item">
                <svg-icon icon-class="date" /><span style="margin-left: 10px;">创建日期</span>
                <div class="pull-right">{{ userInfo.createDate }}</div>
              </li>
            </ul>
          </div>
          <div style="display: flex; justify-content: center;">
            <el-button type="primary" @click="goWorkLog()">查看工作日志</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :userInfo="userInfo" />
            </el-tab-pane> -->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :userInfo="userInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { resetPwd },
  data() {
    return {
      userInfo: {},
      activeTab: "resetPwd"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
    },
    goWorkLog() {
      this.$router.push({ path: '/system/user/work-log' })
    },
  }
};
</script>
