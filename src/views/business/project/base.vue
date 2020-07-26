<template>
  <div class="app-container">
    <el-form ref="projectForm" :model="projectForm" :rules="rules" label-width="150px" :inline="true">
      <el-form-item label="项目编号" v-if="projectForm.projectCode">
        <div class="ip-w200">{{ projectForm.projectCode }}</div>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input class="ip-w200" v-model="projectForm.projectName" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="项目金额" prop="projectAmount">
        <el-input class="ip-w200" v-model="projectForm.projectAmount" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="项目签约时间" prop="signTime">
        <el-date-picker
          class="ip-w200"
          size="mini"
          v-model="projectForm.signTime"
          type="datetime"
          placeholder="选择日期时间"
          :disabled="disabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目地址" prop="projectAddreee">
        <el-input class="ip-w200" type="textarea" v-model.number="projectForm.projectAddreee" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="监理单位名称" prop="supervisionConpany">
        <el-input class="ip-w200" v-model="projectForm.supervisionConpany" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="设计单位名称" prop="designConpanyName">
        <el-input class="ip-w200" v-model="projectForm.designConpanyName" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="甲方" prop="firstParty">
        <el-input class="ip-w200" v-model="projectForm.firstParty" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="建筑面积" prop="buildingArea">
        <el-input class="ip-w200" v-model="projectForm.buildingArea" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createName">
        <el-input class="ip-w200" v-model="projectForm.createName" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="项目开始时间" prop="startDate">
        <el-date-picker
          class="ip-w200"
          size="mini"
          v-model="projectForm.startDate"
          type="datetime"
          placeholder="选择日期时间"
          :disabled="disabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目计划竣工日期" prop="projectComplationDate">
        <el-date-picker
          class="ip-w200"
          size="mini"
          v-model="projectForm.projectComplationDate"
          type="datetime"
          placeholder="选择日期时间"
          :disabled="disabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目实际竣工日期" prop="actulComplationDate">
        <el-date-picker
          class="ip-w200"
          size="mini"
          v-model="projectForm.actulComplationDate"
          type="datetime"
          placeholder="选择日期时间"
          :disabled="disabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款说明" prop="payRemark">
        <el-input class="ip-w200" type="textarea" v-model.number="projectForm.payRemark" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="保修期限" prop="warrantyPeriod">
        <el-input class="ip-w200" v-model="projectForm.warrantyPeriod" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="审核状态" prop="aduitStates">
        <el-select class="ip-w200" v-model="projectForm.aduitStates" placeholder="请选择" size="mini" :disabled="disabled">
          <el-option
            v-for="(item, index) in projectStatusList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态" prop="settlementStates">
        <el-select class="ip-w200" v-model="projectForm.settlementStates" placeholder="请选择" size="mini" :disabled="disabled">
          <el-option
            v-for="(item, index) in projectSettlementStatesList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目描述" prop="desc">
        <el-input class="ip-w200" type="textarea" v-model.number="projectForm.desc" size="mini" :disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left: 150px;">
      <!-- 审核进度 -->
      <!-- <el-table style="width: calc(100% - 150px);" v-if="isAduit" :data="aduitProjectRecord">
        <el-table-column align="center" label="审核进度" prop="progress"></el-table-column>
        <el-table-column align="center" label="审核备注" prop="remark"></el-table-column>
      </el-table> -->
      <!-- 按钮操作模块 -->
      <div class="margin-t20">
        <el-button type="primary" @click="handelOperate()" v-if="isEdit" :loading="isRequesting">{{ projectForm.projectCode ? '保存' : '新建' }}</el-button>
        <el-button type="danger" @click="handleAduitBtn()" v-if="isAduit" :loading="isRequesting">审批</el-button>
        <el-button type="default" @click="goBack()">返回</el-button>
      </div>
    </div>
    
    <aduitDialog :visible.sync="visible" :aduitStatusList="projectAduitStatusList" @handleAduit="handleAduit"></aduitDialog>
  </div>
</template>

<script>
import { updateProject, addProject, queryProjectBase, aduitProject, queryAduitProjectRecord } from "@/api/business/project.js";
import aduitDialog from '../aduit-dialog.vue';

export default {
  components: {
    aduitDialog,
  },
  computed: {
    disabled() {
      return !!this.isAduit;
    }
  },
  data() {
    return {
      isEdit: false, // 是否显示 新建/编辑 按钮
      isAduit: false, // 是否再审核
      isRequesting: false, // 是否再请求中

      rules: {}, // 表单规则
      projectForm: {}, // 项目表单
      projectStatusList: [], // 审核状态
      projectSettlementStatesList: [], // 项目审核状态枚举

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
      const { projectCode, isEdit, isAduit, } = this.$route.query;
      console.log(this.$route.query, 'skosko')
      this.projectForm.projectCode = projectCode;
      this.isEdit = isEdit;
      this.isAduit = isAduit;
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.initRules();
      this.getProjectStatusList(); // 获取审核状态
      this.getProjectSettlementStatesList(); // 获取项目审核状态结果枚举
      this.getProjectAduitStatusList(); // 获取审核状态可选项枚举
    },
    // 初始化远程数据
    initRemoteData() {
      if (this.projectForm.projectCode) {
        this.getProjectBaseInfo();
        this.getAduitProjectRecord();
      }
    },
    // 初始化表单规则
    initRules() {
      const rules = {
        projectName: [{ required: true, trigger: ['blur', 'change'], message: '项目名称必填' }],
        signTime: [{ required: true, trigger: ['blur', 'change'], message: '创建时间必填' }],
        projectAddreee: [{ required: true, trigger: ['blur', 'change'], message: '项目地址必填' }],
        createName: [{ required: true, trigger: ['blur', 'change'], message: '创建人必填' }],
        settlementStates: [{ required: true, trigger: ['blur', 'change'], message: '结算状态必填' }],
        desc: [{ required: true, trigger: ['blur', 'change'], message: '项目描述必填' }],
        status: [{ required: true, trigger: ['blur', 'change'], message: '审核状态必填' }],
        projectAmount: [{ required: true, trigger: ['blur', 'change'], message: '项目金额必填' }],
      };
      this.rules = rules;
    },
    // 获取项目审核状态枚举
    getProjectStatusList() {
      const data = [
        {
          dictLabel: '审核中',
          dictValue: 0,
        },
        {
          dictLabel: '启动中',
          dictValue: 1,
        },
        {
          dictLabel: '废除',
          dictValue: 2,
        },
      ];
      this.projectStatusList = data;
    },
    // 获取项目审核状态枚举
    getProjectSettlementStatesList() {
      const data = [
        {
          dictLabel: '制单',
          dictValue: 0,
        },
        {
          dictLabel: '项目经理已审核',
          dictValue: 1,
        },
        {
          dictLabel: '财务经理已审核',
          dictValue: 2,
        },
        {
          dictLabel: '董事长已审核',
          dictValue: 3,
        },
      ];
      this.projectSettlementStatesList = data;
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
    // 获取项目的详细信息
    getProjectBaseInfo() {
      const { projectCode } = this.projectForm;
      const params = {
        projectCode,
      };
      queryProjectBase(params).then(response => {
        const { projectAmount } = response.data;
        this.projectForm = {
          ...response.data,
          projectAmount: this.getPrice(projectAmount),
        }
      });
    },
    // 获取审核进度的详情
    getAduitProjectRecord() {
      const { projectCode } = this.projectForm;
      const params = {
        projectCode,
      };
      queryAduitProjectRecord().then(res => {
        this.aduitProjectRecord = res.data;
      })
    },
    // 新建/保存项目
    handelOperate() {
      this.$refs['projectForm'].validate((valid) => {
        if (valid) {
          this.isRequesting = true;
          const { projectAmount, projectCode } = this.projectForm;
          const params = {
            ...this.projectForm,
            projectAmount: this.setPrice(projectAmount),
          };
          if (projectCode) {
            this.handleUpdate(params);
          } else {
            this.handleAdd(params);
          }
        }
      });
      
    },
    // 编辑项目
    handleUpdate(params) {
      updateProject(params).then(response => {
        this.msgSuccess("修改成功");
        this.$router.back();
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

    // 进行审核
    handleAduitBtn() {
      this.visible = true;
    },
    // 弹窗审核后点击 ‘确定’的事件
    handleAduit(aduitForm) {
      const params = {
        ...this.aduitForm,
        projectCode: this.projectForm.projectCode,
      };
      aduitProject(params).then(res => {
        this.msgSuccess('审核完成');
        this.visible = false;
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 返回上一页
    goBack() {
      this.$router.back();
    }
  },
}
</script>
<style lang="scss">
.ip-w200 {
  width: 200px !important;
}
</style>