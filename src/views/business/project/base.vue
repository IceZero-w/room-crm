<template>
  <div class="app-container">
    <el-form ref="projectForm" :model="projectForm" :rules="rules" label-width="150px" label-suffix=":" :inline="true">
      <el-card class="project-base-box">
        <div slot="header" class="project-title">
          <span>项目基础信息</span>
        </div>
          <el-form-item label="项目编号" v-if="projectCode">
            <div class="ip-w200">{{ projectCode }}</div>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input class="ip-w200" v-model="projectForm.projectName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="项目金额" prop="projectAmount">
            <el-input class="ip-w200" v-model="projectForm.projectAmount" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="项目签约时间" prop="sigingTime">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.sigingTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目地址" prop="projectAddress">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.projectAddress" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="监理单位名称" prop="supervisionConpany">
            <el-input class="ip-w200" v-model="projectForm.supervisionConpany" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="设计单位名称" prop="desginConpanyName">
            <el-input class="ip-w200" v-model="projectForm.desginConpanyName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="甲方" prop="firstParty">
            <el-input class="ip-w200" v-model="projectForm.firstParty" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="建筑面积" prop="buildingArea">
            <el-input class="ip-w200" v-model="projectForm.buildingArea" size="mini">
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
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目计划竣工日期" prop="projectCompletionDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.projectCompletionDate"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目实际竣工日期" prop="actualCompletionDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="projectForm.actualCompletionDate"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款说明" prop="payRemark">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.payRemark" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="保修期限" prop="warrantyPeriod">
            <el-input class="ip-w200" v-model="projectForm.warrantyPeriod" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="项目描述" prop="remark">
            <el-input class="ip-w200" type="textarea" v-model="projectForm.remark" size="mini"></el-input>
          </el-form-item>
      </el-card>

      <el-card class="project-base-box" v-if="projectCode">
        <div slot="header" class="project-title">
          <span>项目人员信息</span>
        </div>
        <el-form-item label="关联用户">
          <template v-if="projectUserList && projectUserList.length">
            <el-tag class="user-tag" v-for="(item, index) in projectUserList" :key="index">{{ item.userName || '' }}</el-tag>
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
          <el-select class="ip-w200" v-model="projectForm.flowCode" placeholder="请选择" size="mini">
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
          <el-button type="danger" @click="showDistribProjectUserDailog = true" v-if="projectCode">分配项目关联用户</el-button>
          <el-button type="primary" @click="handelOperate()" :loading="isRequesting">{{ projectCode ? '保存' : '新建' }}</el-button>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>      
    </el-form>
    <!-- 分配项目关联用户 -->
    <distribProjectUserDailog v-if="projectCode" :visible.sync="showDistribProjectUserDailog" :projectCode="projectCode" @refreshList="refreshList"></distribProjectUserDailog>
  </div>
</template>

<script>
import { updateProject, addProject, aduitProject, queryAduitProjectRecord, getProjectUserList, getProjectDetail } from "@/api/business/project.js";
import { getFlowDic } from '@/api/tool/aduitStream.js'
import distribProjectUserDailog from './distrib-project-user-dailog.vue'

export default {
  components: {
    distribProjectUserDailog,
  },
  computed: {},
  data() {
    return {
      isRequesting: false, // 是否再请求中

      rules: {}, // 表单规则
      projectCode: undefined, // 项目code
      projectForm: {}, // 项目表单
      projectStatusList: [], // 审核状态
      projectSettlementStatesListObj: {}, // 项目审核状态枚举
      flowCodeList: [], // 项目工作流列表

      showDistribProjectUserDailog: false, // 分配项目相关人员弹窗
      projectUserList: [], // 项目分配人员列表

      aduitProjectRecord: [], // 所有的审核记录
      visible: false, // 审核结果
      projectAduitStatusList: [], // 审核可选项
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { projectCode, } = this.$route.query;
      this.projectCode = projectCode;
      if (!projectCode) {
        this.projectForm.createName = this.$store.state.user.name;
      }
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.initRules();
      this.getProjectSettlementStatesListObj(); // 获取项目审核状态结果枚举
      this.getProjectAduitStatusList(); // 获取审核状态可选项枚举
      this.getFlowDicFn(); // 获取项目流枚举
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
    // 初始化表单规则
    initRules() {
      const rules = {
        projectName: [{ required: true, trigger: ['blur', 'change'], message: '项目名称必填' }],
        sigingTime: [{ required: true, trigger: ['blur', 'change'], message: '创建时间必填' }],
        projectAddress: [{ required: true, trigger: ['blur', 'change'], message: '项目地址必填' }],
        projectAmount: [{ required: true, trigger: ['blur', 'change'], message: '项目金额必填' }],
        flowCode: [{ required: true, trigger: ['blur', 'change'], message: '必须关联审核流' }],
      };
      this.rules = rules;
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
          dictValue: 0,
        },
        {
          dictLabel: '不通过',
          dictValue: 1,
        },
      ];
      this.projectAduitStatusList = data;
    },
    // 获取审核流列表
    getFlowDicFn() {
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
    // 新建/保存项目
    handelOperate() {
      this.$refs['projectForm'].validate((valid) => {
        if (valid) {
          this.isRequesting = true;
          const { projectAmount, projectCode, warrantyPeriod, auditUserId, projectSettlementAmount } = this.projectForm;
          const params = {
            ...this.projectForm,
            projectAmount: Number(projectAmount),
            auditUserId: auditUserId || 0,
            projectSettlementAmount: projectSettlementAmount || 0,
          };
          if (projectCode) {
            this.handleUpdate(params);
          } else {
            this.handleAdd(params);
          }
        }
      });
    },
    // 修改项目
    handleUpdate(params) {
      updateProject(params).then(response => {
        this.msgSuccess("修改成功");
        this.getProjectDetailFn();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 添加项目
    handleAdd(params) {
      addProject(params).then(response => {
        this.msgSuccess("项目已创建");
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
    },

    refreshList() {
      this.getProjectDetailFn();
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