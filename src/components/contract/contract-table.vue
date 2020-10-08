<template>
	<el-table v-loading="loading" :data="dataList">
		<el-table-column label="关联项目编号" prop="projectCode"></el-table-column>
		<el-table-column label="合同编号" prop="contractCode"></el-table-column>
		<el-table-column label="合同名称" prop="contractName"></el-table-column>
		<el-table-column label="合同类型" prop="contractType" :formatter="isEnableFormat"></el-table-column>
		<el-table-column label="合同金额" prop="contractMoney">
			<template slot-scope="scope">
				<span>{{ getPrice(scope.row.contractMoney) }}</span>
			</template>
		</el-table-column>
		<el-table-column label="是否含税" prop="isTax">
			<template slot-scope="scope">
				<span>{{ scope.row.isTax ? '是' : '否' }}</span>
			</template>
		</el-table-column>
		<el-table-column label="创建时间" prop="createDate">
			<template slot-scope="scope">
				<span>{{ parseTime(scope.row.createDate) }}</span>
			</template>
		</el-table-column>
		<el-table-column label="签约时间" prop="signerDate">
			<template slot-scope="scope">
				<span>{{ parseTime(scope.row.signerDate) }}</span>
			</template>
		</el-table-column>
		<el-table-column label="合同状态" prop="auditName">
			<template slot-scope="scope">
				<span v-if="scope.row.auditStates === 1">业务员审核</span>
				<span v-else>{{ scope.row.auditName }}(已审核)</span>
			</template>
		</el-table-column>
		
		<el-table-column label="操作" v-if="!hideOperateBtn">
			<template slot-scope="scope">
				<el-button
					size="mini"
					type="text"
					icon="el-icon-edit"
					@click="handleUpdate(scope.row)"
					v-hasPermi="['business:contract:list:edit']"
				>修改</el-button>
				<el-button
					size="mini"
					type="text"
					icon="el-icon-aim"
					@click="handleAduit(scope.row)"
					v-hasPermi="['business:contract:list:aduit']"
				>审核</el-button>
				<br>
				<el-button
					size="mini"
					type="text"
					icon="el-icon-delete"
					@click="handleDelete(scope.row)"
					v-hasPermi="['business:contract:list:remove']"
				>删除</el-button>
			</template>
		</el-table-column>
		<!-- 插槽 -->
		<slot></slot>
	</el-table>
</template>
<script>
export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		dataList: {
			type: Array,
			default: () => [],
		},
		// 是否隐藏
		hideOperateBtn: {
			type: Boolean,
			default: false,
		}
	},
	mounted() {
		this.init();
	},
	data() {
		return {
			contractTypeList: [],
		}
	},
	methods: {
		init() {
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
      this.getContractTypeList();
    },
    // 初始化远程数据
    initRemoteData() {},
		// 获取合同类型列表
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
		isEnableFormat(row, column) {
      return this.selectDictLabel(this.contractTypeList, row.contractType);
		},
		handleUpdate(row) {
			this.$emit('handleUpdate', row)
		},
		handleAduit(row) {
			this.$emit('handleAduit', row)
		},
		handleDelete(row) {
			this.$emit('handleDelete', row)
		},
	}
}
</script>
