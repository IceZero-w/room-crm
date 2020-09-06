<template>
  <div class="app-container">
    <el-form ref="contractForm" :model="contractForm" :rules="rules" label-width="150px" label-suffix=":" :inline="true">
      <el-card class="contract-base-box">
        <div slot="header" class="contract-title">
          <span>合同基础信息</span>
        </div>
          <el-form-item label="合同编号" v-if="contractCode">
            <div class="ip-w200">{{ contractCode }}</div>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectCode">
            <el-select class="ip-w200" v-model="contractForm.projectCode" :disabled="isAduit">
              <el-option v-for="(item, index) in projectList" :label="item.projectName" :value="item.projectCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同名称" prop="contractName">
            <el-input class="ip-w200" v-model="contractForm.contractName" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="合同类型" prop="contractType">
            <el-select class="ip-w200" v-model="contractForm.contractType" :disabled="isAduit">
              <el-option v-for="(item, index) in contractTypeList" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同签约编号" prop="contractMaterialCode">
            <el-input class="ip-w200" v-model="contractForm.contractMaterialCode" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="合同金额" prop="contractMoney">
            <el-input class="ip-w200" v-model="contractForm.contractMoney" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="签约公司" prop="contractCompany">
            <el-input class="ip-w200" v-model="contractForm.contractCompany" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="签约负责人" prop="contractSigner">
            <el-input class="ip-w200" v-model="contractForm.contractSigner" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="签约负责人手机号" prop="contractSignerPhone">
            <el-input class="ip-w200" maxlength="11" v-model="contractForm.contractSignerPhone" size="mini" :disabled="isAduit"></el-input>
          </el-form-item>
          <el-form-item label="签约时间" prop="signerDate">
            <el-date-picker
              class="ip-w200"
              size="mini"
              v-model="contractForm.signerDate"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="isAduit"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否含税" prop="isTax">
            <el-select class="ip-w200" v-model="contractForm.isTax" :disabled="isAduit">
              <el-option v-for="(item, index) in taxList" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="创建人" prop="createName">
            <el-input class="ip-w200" v-model="contractForm.createName" size="mini" disabled></el-input>
          </el-form-item>
      </el-card>

      <el-card class="contract-base-box">
        <div slot="header" class="contract-title">
          <span>审核信息</span>
        </div>
        <el-form-item label="关联工作流" prop="flowCode">
          <el-select class="ip-w200" v-model="contractForm.flowCode" placeholder="请选择" size="mini" :disabled="isAduit">
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
            <span v-if="contractForm.auditStates === 1">业务员审核</span>
            <span v-else>{{ contractForm.auditName }}(已审核)</span>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="contract-base-box" v-if="contractCode">
        <div slot="header" class="contract-title">
          <span>子合同信息</span>
          <el-button type="primary" size="small" style="margin-left: 20px;" @click="handleAddSubContract()" v-if="!isAduit">添加子合同</el-button>
        </div>
        <el-table :data="subContractList">
          <el-table-column label="子合同编号" prop="subContractCode"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="采购时间" prop="purchaseDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.purchaseDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付日期" prop="payDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.payDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" prop="payWay"></el-table-column>
          <el-table-column label="支付金额" prop="payAmount"></el-table-column>
          <el-table-column label="采购数量" prop="purchaseNumber"></el-table-column>
          <el-table-column label="已收数量" prop="quantityReceived"></el-table-column>
          <el-table-column label="创建日期" prop="createDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="!isAduit">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEditSubContract(scope.row.subContractCode)">编辑</el-button>
              <br />
              <el-button type="text" size="small" @click="deleteSubContractFn(scope.row.subContractCode)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="contract-base-box">
        <!-- 按钮操作模块 -->
        <div>
          <template v-if="isAduit">
            <!-- contractForm.nodeCount + 1 !== contractForm.auditStates 表示：审核已完结，不能再进行审核了 -->
            <el-button v-if="isAduit && (contractForm.nodeCount + 1 !== contractForm.auditStates)" type="danger" @click="handleAduitBtn()" :loading="isRequesting">审批</el-button>
            <el-button v-if="isAduit" type="primary" @click="cancelApplyFn()" :loading="isRequesting">取消审批</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="handelOperate()" :loading="isRequesting">{{ contractCode ? '保存' : '新建' }}</el-button>
          </template>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>      
    </el-form>
    <aduitDialog :visible.sync="visible" :aduitStatusList="contractAduitStatusList" @handleAduit="handleAduit"></aduitDialog>
  </div>
</template>

<script>
import { listProject } from "@/api/business/project.js";
import { updateContract, addContract, aduitContract, queryAduitContractRecord, getContractDetail, cancelApply, deleteSubContract, getSubContractList } from "@/api/business/contract.js";
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
      contractTypeList: [], // 合同类型枚举
      taxList: [], // 是否含税枚举
      pagination: {
        pageIndex: 1,
        pageSize: 999,
        totalCount: 0,
      }, // 分页数据

      rules: {}, // 表单规则
      contractCode: undefined, // 合同code
      contractForm: {}, // 合同表单
      contractStatusList: [], // 审核状态
      contractSettlementStatesListObj: {}, // 合同审核状态枚举
      flowCodeList: [], // 合同工作流列表


      aduitContractRecord: [], // 所有的审核记录
      visible: false, // 审核结果
      contractAduitStatusList: [], // 审核可选项

      subContractList: [], // 子合同列表
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { contractCode, isAduit } = this.$route.query;
      this.isAduit = String(isAduit) === 'true';
      this.contractCode = contractCode;
      if (!contractCode) {
        this.contractForm.createName = this.$store.state.user.name;
      }
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.getContractTypeList();
      this.getTaxList();
      this.initRules();

      this.getContractSettlementStatesListObj(); // 获取合同审核状态结果枚举
      this.getContractAduitStatusList(); // 获取审核状态可选项枚举
      this.getFlowDicFn(); // 获取合同流枚举
    },
    // 初始化远程数据
    initRemoteData() {
      this.getProjectList();
      if (this.contractCode) {
        this.getContractDetailFn();
        this.getSubContractListFn();
      }
    },
    // 获取合同类型枚举
    getContractTypeList() {
      const data = [
        {
          dictLabel: '劳务合同',
          dictValue: 1,
        },
        {
          dictLabel: '材料合同',
          dictValue: 2,
        },
        {
          dictLabel: '租赁合同',
          dictValue: 3,
        },
        {
          dictLabel: '其他合同',
          dictValue: 4,
        },
      ]
      this.contractTypeList = data;
    },
    // 是否含税枚举
    getTaxList() {
      const data = [
        {
          dictLabel: '是',
          dictValue: 1,
        },
        {
          dictLabel: '否',
          dictValue: 2,
        },
      ]
      this.taxList = data;
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
    // 获取合同详情
    getContractDetailFn() {
      const params = {
        contractCode: this.contractCode
      };
      getContractDetail(params).then(res => {
        this.contractForm = res.data || {};
      })
    },
    // 初始化表单规则
    initRules() {
      const rules = {
        projectCode: [{ required: true, trigger: ['blur', 'change'], message: '所属项目必填' }],
        contractType: [{ required: true, trigger: ['blur', 'change'], message: '合同类型必填' }],
        contractName: [{ required: true, trigger: ['blur', 'change'], message: '合同名称必填' }],
        contractMaterialCode: [{ required: true, trigger: ['blur', 'change'], message: '合同签约编号必填' }],
        signerDate: [{ required: true, trigger: ['blur', 'change'], message: '创建时间必填' }],
        contractAddress: [{ required: true, trigger: ['blur', 'change'], message: '合同地址必填' }],
        contractMoney: [{ required: true, trigger: ['blur', 'change'], message: '合同金额必填' }],
        flowCode: [{ required: true, trigger: ['blur', 'change'], message: '必须关联审核流' }],
      };
      this.rules = rules;
    },
    // 获取合同审核状态枚举
    getContractSettlementStatesListObj() {
      const data = {
        0: '未结算',
        1: '已结算',
      }
      this.contractSettlementStatesListObj = data;
    },
    // 获取审核状态列表
    getContractAduitStatusList() {
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
      this.contractAduitStatusList = data;
    },
    // 获取审核流列表
    getFlowDicFn() {
      getFlowDic().then(res => {
        this.flowCodeList = res.data;
      })
    },
    // 新建/保存合同
    handelOperate() {
      this.$refs['contractForm'].validate((valid) => {
        if (valid) {
          this.isRequesting = true;
          const { contractMoney, contractCode, warrantyPeriod, auditUserId, contractSettlementAmount } = this.contractForm;
          const params = {
            ...this.contractForm,
            contractMoney: Number(contractMoney),
            auditUserId: auditUserId || 0,
            contractSettlementAmount: contractSettlementAmount || 0,
          };
          if (contractCode) {
            this.handleUpdate(params);
          } else {
            this.handleAdd(params);
          }
        }
      });
    },
    // 编辑合同
    handleUpdate(params) {
      updateContract(params).then(response => {
        this.msgSuccess("修改成功");
        this.getContractDetailFn();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 添加合同
    handleAdd(params) {
      addContract(params).then(response => {
        this.msgSuccess("合同已创建");
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
    },

    refreshList() {
      this.getContractDetailFn();
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
      const { contractCode, flowCode, auditStates } = this.contractForm;
      const params = {
        contractCode,
        flowCode,
        auditStates: status === -1 ? -1 : auditStates, // 如果为不通过，则传-1
        remark,
        auditUserId: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).id : '',
      };
      aduitContract(params).then(res => {
        this.msgSuccess('审核完成');
        this.visible = false;
        this.getContractDetailFn();
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
        const { contractCode, flowCode, auditStates } = this.contractForm;
        const params = {
          contractCode,
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

    /* 子合同模块 */
    
    // 获取子合同列表
    getSubContractListFn() {
      const { contractCode } = this;
      const params = {
        contractCode,
        pageIndex: 1,
        pageSize: 9999,
      };
      getSubContractList(params).then(res => {
        this.subContractList = res.data;
      })
    },

    // 添加子合同-前往创建子合同
    handleAddSubContract() {
      const { contractCode } = this;
      this.$router.push({
        path: '/business/contract/sub/create',
        query: {
          contractCode,
        }
      })
    },

    // 添加子合同-前往创建子合同
    handleEditSubContract(subContractCode) {
      const { contractCode } = this;
      this.$router.push({
        path: '/business/contract/sub/create',
        query: {
          contractCode,
          subContractCode,
        }
      })
    },

    // 删除子合同
    deleteSubContractFn(subContractCode) {
      const { contractCode } = this;
      const params = {
        contractCode,
        subContractCode,
      };
      this.$confirm('是否确认删除子合同编号为"' + subContractCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteSubContract(params);
        }).then(() => {
          this.getSubContractListFn();
          this.msgSuccess("删除成功");
        }).catch(function() {});

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

.contract-base-box {
  margin-bottom: 20px;
}

.user-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>