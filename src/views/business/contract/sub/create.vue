<template>
	<div class="app-container">
    <el-form ref="subContractForm" :model="subContractForm" :rules="rules" label-width="150px" label-suffix=":" :inline="true">
      <el-card class="contract-base-box">
				<el-form-item label="合同编号">
					<div class="ip-w200">{{ contractCode }}</div>
				</el-form-item>
				<el-form-item label="子合同编号" v-if="subContractCode">
					<div class="ip-w200">{{ subContractCode }}</div>
				</el-form-item>
				<el-form-item label="名称" prop="name">
					<el-input class="ip-w200" size="mini" v-model="subContractForm.name" placeholder="请输入子合同名称"></el-input>
				</el-form-item>
				<el-form-item label="采购日期" prop="purchaseDate">
					<el-date-picker
						class="ip-w200"
						size="mini"
						v-model="subContractForm.purchaseDate"
						type="datetime"
						placeholder="选择采购日期"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="支付日期" prop="payDate">
					<el-date-picker
						class="ip-w200"
						size="mini"
						v-model="subContractForm.payDate"
						type="datetime"
						placeholder="选择支付日期"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="支付方式" prop="payWay">
					<el-input class="ip-w200" size="mini" v-model="subContractForm.payWay" placeholder="请输入支付方式"></el-input>
				</el-form-item>
				<el-form-item label="支付金额" prop="payAmount">
					<el-input class="ip-w200" size="mini" v-model="subContractForm.payAmount" placeholder="请输入支付金额"></el-input>
				</el-form-item>
				<el-form-item label="采购数量" prop="purchaseNumber">
					<el-input class="ip-w200" size="mini" v-model.number="subContractForm.purchaseNumber" placeholder="请输入采购数量"></el-input>
				</el-form-item>
				<el-form-item label="已收数量" prop="quantityReceived">
					<el-input class="ip-w200" size="mini" v-model.number="subContractForm.quantityReceived" placeholder="请输入已收数量"></el-input>
				</el-form-item>
			</el-card>
			<el-card class="contract-base-box">
        <!-- 按钮操作模块 -->
        <div>
					<el-button type="primary" @click="handelOperate()" :loading="isRequesting">{{ subContractCode ? '保存' : '新建' }}</el-button>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>
    </el-form>
	</div>
</template>
<script>
import { editSubContract, createSubContract, getSubContractDetail } from "@/api/business/contract.js";

export default {
	data() {
		return {
			isRequesting: false, // 接口请求中
			contractCode: undefined, // 合同id
			subContractCode: undefined, // 子合同id

			subContractForm: {}, // 子合同表单
		}
	},
	created() {
    this.init();
  },
	methods: {
		init() {
      const { contractCode, subContractCode } = this.$route.query;
			this.contractCode = contractCode;
			this.subContractCode = subContractCode;
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.initRules();
    },
    // 初始化远程数据
    initRemoteData() {
      if (this.subContractCode) {
        this.getSubContractDetailFn();
      }
		},
		initRules() {
      const rules = {
        name: [{ required: true, trigger: ['blur', 'change'], message: '子合同名称必填' }],
				purchaseDate: [{ required: true, trigger: ['blur', 'change'], message: '采购日期必填' }],
				payDate: [{ required: true, trigger: ['blur', 'change'], message: '支付日期必填' }],
        payWay: [{ required: true, trigger: ['blur', 'change'], message: '支付方式必填' }],
				payAmount: [{ required: true, trigger: ['blur', 'change'], message: '支付金额必填' }],
				purchaseNumber: [{ required: true, trigger: ['blur', 'change'], message: '采购数量必填' }],
        quantityReceived: [{ required: true, trigger: ['blur', 'change'], message: '已收数量必填' }],
      };
      this.rules = rules;
    },
		// 获取合同详情
    getSubContractDetailFn() {
			const { subContractCode } = this;
      const params = {
				subContractCode,
      };
      getSubContractDetail(params).then(res => {
        this.subContractForm = res.data || {};
      })
    },
		handelOperate() {
      this.$refs['subContractForm'].validate((valid) => {
        if (valid) {
					this.isRequesting = true;
					const { payAmount, purchaseNumber, quantityReceived } = this.subContractForm;
          const params = {
						contractCode: this.contractCode,
						...this.subContractForm,
						payAmount: Number(payAmount),
						purchaseNumber: String(purchaseNumber),
						quantityReceived: String(quantityReceived),
          };
          if (this.subContractCode) {
            this.handleUpdate(params);
          } else {
            this.handleAdd(params);
          }
        }
      });
		},
		// 编辑合同
    handleUpdate(params) {
      editSubContract(params).then(response => {
        this.msgSuccess("修改成功");
        this.getSubContractDetailFn();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 添加合同
    handleAdd(params) {
      createSubContract(params).then(response => {
        this.msgSuccess("合同已创建");
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
		},
		
		// 返回上一页
    goBack() {
      this.$router.back();
    },
	}
}
</script>
<style lang="scss" scoped>
.ip-w200 {
  width: 200px !important;
}

.contract-base-box {
  margin-bottom: 20px;
}
</style>