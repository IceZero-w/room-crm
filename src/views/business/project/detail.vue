<template>
  <div class="app-container">
    <el-form ref="projectForm" :model="projectForm" label-width="150px" label-suffix=":" :inline="true">
      <el-card class="project-base-box">
        <div slot="header" class="project-title">
          <span>项目基础信息</span>
        </div>
          <el-form-item label="项目编号" v-if="projectForm.projectCode">
            <div class="ip-w200">{{ projectForm.projectCode }}</div>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input class="ip-w200" v-model="projectForm.projectName" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目金额" prop="projectAmount">
            <el-input class="ip-w200" v-model="projectForm.projectAmount" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目签约时间" prop="sigingTime">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.sigingTime"
              type="datetime"
              placeholder="选择日期时间"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目地址" prop="projectAddress">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.projectAddress" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="监理单位名称" prop="supervisionConpany">
            <el-input class="ip-w200" v-model="projectForm.supervisionConpany" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="设计单位名称" prop="desginConpanyName">
            <el-input class="ip-w200" v-model="projectForm.desginConpanyName" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="甲方" prop="firstParty">
            <el-input class="ip-w200" v-model="projectForm.firstParty" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="建筑面积" prop="buildingArea">
            <el-input class="ip-w200" v-model="projectForm.buildingArea" size="mini" disabled>
              <template slot="append">平方米</template>
            </el-input>
          </el-form-item>
          <el-form-item label="创建人" prop="createName">
            <el-input class="ip-w200" v-model="projectForm.createName" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="项目开始时间" prop="startDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.startDate"
              type="datetime"
              placeholder="选择日期时间"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目计划竣工日期" prop="projectCompletionDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.projectCompletionDate"
              type="datetime"
              placeholder="选择日期时间"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目实际竣工日期" prop="actualCompletionDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.actualCompletionDate"
              type="datetime"
              placeholder="选择日期时间"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款说明" prop="payRemark">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.payRemark" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="保修期限" prop="warrantyPeriod">
            <el-input class="ip-w200" v-model="projectForm.warrantyPeriod" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目描述" prop="remark">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.remark" size="mini" disabled></el-input>
          </el-form-item>
      </el-card>

      <el-card class="project-base-box" v-if="projectForm.projectCode">
        <div slot="header" class="project-title">
          <span>项目人员信息</span>
        </div>
        <el-form-item label="关联用户">
          <template v-if="projectUserList && projectUserList.length">
            <el-tag class="user-tag" v-for="(item, index) in projectUserList" :key="index" closable @close="handleDelete(item)">{{ item.userName || '' }}</el-tag>
          </template>
          <span class="user-tag" v-else>暂无</span>
        </el-form-item>
      </el-card>

      <el-card class="project-base-box">
        <div slot="header" class="project-title">
          <span>项目结算信息</span>
        </div>
        <el-form-item label="结算状态" prop="settlementStates">
          <div>{{ projectSettlementStatesListObj[projectForm.settlementStates] || '--' }}</div>
        </el-form-item>
        <el-form-item label="结算金额" prop="auditStates">
          <div>{{ projectForm.projectSettlementAmount || '--' }}</div>
        </el-form-item>
      </el-card>


      <el-card class="project-base-box">
        <div slot="header" class="project-title">
          <span>审核信息</span>
        </div>
        <el-form-item label="关联工作流" prop="flowCode">
          <el-select class="ip-w200" v-model="projectForm.flowCode" placeholder="请选择" size="mini" disabled>
            <el-option
              v-for="(item, index) in flowCodeList"
              :key="index"
              :label="item.flowName"
              :value="item.flowCode"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStates">
          <div>
            <span v-if="projectForm.auditStates === 1">制单</span>
            <span v-else>{{ projectForm.auditName }}(已审核)</span>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="project-base-box">
        <!-- 按钮操作模块 -->
        <div>
          <!-- projectForm.nodeCount + 1 !== projectForm.auditStates 表示：审核已完结，不能再进行审核了 -->
          <el-button v-if="isAduit && (projectForm.nodeCount + 1 !== projectForm.auditStates)" type="danger" @click="handleAduitBtn()" :loading="isRequesting">审批</el-button>
          <el-button v-if="isAduit" type="primary" @click="cancelApplyFn()" :loading="isRequesting">取消审批</el-button>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>      
    </el-form>
    
    <aduitDialog :visible.sync="visible" :aduitStatusList="projectAduitStatusList" @handleAduit="handleAduit"></aduitDialog>
  </div>
</template>

<script>
import { updateProject, addProject, queryProjectBase, getProjectUserList, aduitProject, cancelApply, getProjectDetail } from "@/api/business/project.js";
import { getFlowDic } from '@/api/tool/aduitStream.js'
import aduitDialog from '../aduit-dialog.vue';

export default {
  components: {
    aduitDialog,
  },
  data() {
    return {
      isRequesting: false, // 是否再请求中
      isAduit: false, // 是否是审核的标识

      rules: {}, // 表单规则
      projectCode: undefined, // 项目code
      projectForm: {}, // 项目表单
      projectStatusList: [], // 审核状态
      projectSettlementStatesListObj: [], // 项目审核状态枚举
      flowCodeList: [], // 项目工作流列表

      showDistribProjectUserDailog: false, // 分配项目相关人员弹窗
      projectUserList: [], // 项目分配人员列表

      visible: false, // 审核结果
      projectAduitStatusList: [], // 审核可选项
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { projectCode, isAduit } = this.$route.query;
      this.isAduit = isAduit;
      this.projectCode = projectCode;
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.getProjectSettlementStatesListObj(); // 获取项目审核状态结果枚举
      this.getProjectAduitStatusList(); // 获取审核状态可选项枚举
      this.getFlowCodeList(); // 获取项目流枚举
    },
    // 初始化远程数据
    initRemoteData() {
      if (this.projectCode) {
        this.getProjectDetailFn();
        this.getProjectUserListFn();
      }
    },

    // 获取项目详情
    getProjectDetailFn() {
      const params = {
        projectCode: this.projectCode
      };
      getProjectDetail(params).then(res => {
        this.projectForm = res.data || {};
      })
    },
    
    // 获取项目审核状态枚举
    getProjectSettlementStatesListObj() {
      const data = {
        0: '未结算',
        1: '已结算',
      }
      this.projectSettlementStatesListObj = data;
    },
    // 获取审核状态列表
    getProjectAduitStatusList() {
      const data = [
        {
          dictLabel: '通过',
          dictValue: 1,
        },
        // {
        //   dictLabel: '不通过',
        //   dictValue: -1,
        // },
      ];
      this.projectAduitStatusList = data;
    },
    // 获取审核流列表
    getFlowCodeList() {
      getFlowDic().then(res => {
        this.flowCodeList = res.data;
      })
    },
    // 获取项目关联用户列表
    getProjectUserListFn() {
      const { projectCode } = this.projectForm;
      const params = {
        projectCode,
      };
      getProjectUserList(params).then(res => {
        this.projectUserList = res.data;
      })
    },
    // 进行审核
    handleAduitBtn() {
      this.visible = true;
    },
    // 弹窗审核后点击 ‘确定’的事件
    handleAduit(aduitForm) {
      const { status, remark } = aduitForm
      const { projectCode, flowCode, auditStates } = this.projectForm;
      const params = {
        projectCode,
        flowCode,
        auditStates: status === -1 ? -1 : auditStates, // 如果为不通过，则传-1
        remark,
        auditUserId: JSON.parse(localStorage.getItem('userInfo')).id,
      };
      aduitProject(params).then(res => {
        this.msgSuccess('审核完成');
        this.visible = false;
        this.getProjectDetailFn();
      }).finally(() => {
        this.isRequesting = false;
      });
    },

    // 取消审核
    cancelApplyFn() {
      this.$confirm('你确定要取消审批吗，项目状态将变成可修改状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { projectCode, flowCode, auditStates } = this.projectForm;
        const params = {
          projectCode,
          flowCode,
          auditStates, // 如果为不通过，则传-1
          auditUserId: JSON.parse(localStorage.getItem('userInfo')).id,
        };
        cancelApply(params).then((res) => {
          this.$message.success({
            message: '取消审核成功'
          });
          this.$router.back();
        })
      })
    },
    // 返回上一页
    goBack() {
      this.$router.back();
    }
  },
}
</script>
<style lang="scss">
.el-card__header {
  background-color: rgba(0, 0, 0, .05);
}
</style>
<style lang="scss" scoped>
.ip-w200 {
  width: 200px !important;
}

.project-base-box {
  margin-bottom: 20px;
}

.user-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>