<template>
  <div class="app-container">
    <el-form ref="invoiceForm" :model="invoiceForm" :rules="rules" label-width="150px" label-suffix=":" :inline="true">
      <el-card class="invoice-base-box">
        <div slot="header" class="invoice-title">
          <span>发票基础信息</span>
        </div>
          <el-form-item label="发票编号" v-if="invoiceCode">
            <div class="ip-w200">{{ invoiceCode }}</div>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectCode">
            <el-select class="ip-w200" v-model="invoiceForm.projectCode" :disabled="isAduit || !!invoiceCode">
              <el-option v-for="(item, index) in projectList" :label="item.projectName" :value="item.projectCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票开票说明" prop="invoiceExplain">
            <el-input class="ip-w200" type="textarea" v-model="invoiceForm.invoiceExplain" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="发票金额" prop="invoiceAmount">
            <el-input class="ip-w200" v-model="invoiceForm.invoiceAmount" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="发票开票日期" prop="invoiceDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="invoiceForm.invoiceDate"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="isAduit"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建人" prop="createUserName">
            <el-input class="ip-w200" v-model="invoiceForm.createUserName" size="mini" disabled></el-input>
          </el-form-item>
      </el-card>

      <el-card class="invoice-base-box">
        <div slot="header" class="invoice-title">
          <span>审核信息</span>
        </div>
        <el-form-item label="关联工作流" prop="flowCode">
          <el-select class="ip-w200" v-model="invoiceForm.flowCode" placeholder="请选择" size="mini" :disabled="isAduit || !!invoiceCode">
            <el-option
              v-for="(item, index) in flowCodeList"
              :key="index"
              :label="item.flowName"
              :value="item.flowCode"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStates">
          <div v-if="invoiceCode">
            <span v-if="invoiceForm.auditStates === 1">业务员审核</span>
            <span v-else>{{ invoiceForm.auditName }}(已审核)</span>
          </div>
          <div v-else>--</div>
        </el-form-item>
      </el-card>

      <el-card class="invoice-base-box">
        <!-- 按钮操作模块 -->
        <div>
          <template v-if="isAduit">
            <!-- invoiceForm.nodeCount + 1 !== invoiceForm.auditStates 表示：审核已完结，不能再进行审核了 -->
            <el-button v-if="isAduit && (invoiceForm.nodeCount + 1 !== invoiceForm.auditStates)" type="danger" @click="handleAduitBtn()" :loading="isRequesting">审批</el-button>
            <el-button v-if="isAduit" type="primary" @click="cancelApplyFn()" :loading="isRequesting">取消审批</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="handelOperate()" :loading="isRequesting">{{ invoiceCode ? '保存' : '新建' }}</el-button>
          </template>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>      
    </el-form>
    <aduitDialog :visible.sync="visible" :aduitStatusList="invoiceAduitStatusList" @handleAduit="handleAduit"></aduitDialog>
  </div>
</template>

<script>
import { listProject } from "@/api/business/project.js";
import { updateInvoice, addInvoice, aduitInvoice, queryAduitInvoiceRecord, getInvoiceDetail, cancelApply } from "@/api/business/invoice.js";
import { getFlowDic } from '@/api/tool/aduitStream.js';
import aduitDialog from '../aduit-dialog.vue';

export default {
  components: {
    aduitDialog,
  },
  computed: {},
  data() {
    return {
      isRequesting: false, // 是否再请求中
      isAduit: false, // 是否是审核
      projectList: [], // 项目列表
      pagination: {
        pageIndex: 1,
        pageSize: 999,
        totalCount: 0,
      }, // 分页数据

      rules: {}, // 表单规则
      invoiceCode: undefined, // 发票code
      invoiceForm: {}, // 发票表单
      invoiceStatusList: [], // 审核状态
      flowCodeList: [], // 发票工作流列表


      aduitInvoiceRecord: [], // 所有的审核记录
      visible: false, // 审核结果
      invoiceAduitStatusList: [], // 审核可选项

    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { invoiceCode, isAduit } = this.$route.query;
      this.isAduit = String(isAduit) === 'true';
      this.invoiceCode = invoiceCode;
      if (!invoiceCode) {
        this.invoiceForm.createUserName = this.$store.state.user.name;
      }
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.initRules();

      this.getInvoiceAduitStatusList(); // 获取审核状态可选项枚举
      this.getFlowDicFn(); // 获取发票流枚举
    },
    // 初始化远程数据
    initRemoteData() {
      this.getProjectList();
      if (this.invoiceCode) {
        this.getInvoiceDetailFn();
      }
    },
    // 获取项目列表枚举
    async getProjectList() {
      const params = {
        ...this.pagination,
      };
      listProject(this.addDateRange(params, this.dateRange)).then(response => {
        this.projectList = response.data;
      });
    },
    // 获取发票详情
    getInvoiceDetailFn() {
      const params = {
        invoiceCode: this.invoiceCode
      };
      getInvoiceDetail(params).then(res => {
        this.invoiceForm = res.data || {};
      })
    },
    // 初始化表单规则
    initRules() {
      const rules = {
        projectCode: [{ required: true, trigger: ['blur', 'change'], message: '所属项目必填' }],
        invoiceExplain: [{ required: true, trigger: ['blur', 'change'], message: '发票开票说明必填' }],
        invoiceAmount: [{ required: true, trigger: ['blur', 'change'], message: '发票金额必填' }],
        invoiceDate: [{ required: true, trigger: ['blur', 'change'], message: '创建时间必填' }],
        flowCode: [{ required: true, trigger: ['blur', 'change'], message: '必须关联审核流' }],
      };
      this.rules = rules;
    },
    
    // 获取审核状态列表
    getInvoiceAduitStatusList() {
      const data = [
        {
          dictLabel: '通过',
          dictValue: 0,
        },
        // {
        //   dictLabel: '不通过',
        //   dictValue: 1,
        // },
      ];
      this.invoiceAduitStatusList = data;
    },
    // 获取审核流列表
    getFlowDicFn() {
      getFlowDic().then(res => {
        this.flowCodeList = res.data;
      })
    },
    // 新建/保存发票
    handelOperate() {
      this.$refs['invoiceForm'].validate((valid) => {
        if (valid) {
          this.isRequesting = true;
          const { invoiceAmount, invoiceCode, warrantyPeriod, auditUserId, invoiceSettlementAmount } = this.invoiceForm;
          const params = {
            ...this.invoiceForm,
            invoiceAmount: Number(invoiceAmount),
            auditUserId: auditUserId || 0,
            invoiceSettlementAmount: invoiceSettlementAmount || 0,
          };
          if (invoiceCode) {
            this.handleUpdate(params);
          } else {
            this.handleAdd(params);
          }
        }
      });
    },
    // 编辑发票
    handleUpdate(params) {
      updateInvoice(params).then(response => {
        this.msgSuccess("修改成功");
        this.getInvoiceDetailFn();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 添加发票
    handleAdd(params) {
      addInvoice(params).then(response => {
        this.msgSuccess("发票已创建");
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
    },

    refreshList() {
      this.getInvoiceDetailFn();
    },

    // 返回上一页
    goBack() {
      this.$router.back();
    },

    // 进行审核
    handleAduitBtn() {
      this.visible = true;
    },
    // 弹窗审核后点击 ‘确定’的事件
    handleAduit(aduitForm) {
      const { status, remark } = aduitForm
      const { invoiceCode, flowCode, auditStates } = this.invoiceForm;
      const params = {
        invoiceCode,
        flowCode,
        auditStates: status === -1 ? -1 : auditStates, // 如果为不通过，则传-1
        remark,
        auditUserId: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).id : '',
      };
      aduitInvoice(params).then(res => {
        this.msgSuccess('审核完成');
        this.visible = false;
        this.getInvoiceDetailFn();
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
        const { invoiceCode, flowCode, auditStates } = this.invoiceForm;
        const params = {
          invoiceCode,
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

.invoice-base-box {
  margin-bottom: 20px;
}

.user-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>