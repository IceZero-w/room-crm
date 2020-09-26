<template>
	<el-table v-loading="loading" :data="dataList">
		<el-table-column label="关联项目编号" prop="projectCode"></el-table-column>
		<el-table-column label="发票编号" prop="invoiceCode"></el-table-column>
		<!-- <el-table-column label="发票名称" prop="invoiceName"></el-table-column> -->
		<el-table-column label="发票开票说明" prop="invoiceExplain"></el-table-column>
		<el-table-column label="发票金额" prop="invoiceAmount">
			<template slot-scope="scope">
				<span>{{ getPrice(scope.row.invoiceAmount) }}</span>
			</template>
		</el-table-column>
		<el-table-column label="发票开票日期" prop="invoiceDate">
			<template slot-scope="scope">
				<span>{{ parseTime(scope.row.invoiceDate) }}</span>
			</template>
		</el-table-column>
		<el-table-column label="发票状态" prop="auditName">
			<template slot-scope="scope">
				<span v-if="scope.row.auditStates === 1">业务员审核</span>
				<span v-else>{{ scope.row.auditName }}(已审核)</span>
			</template>
		</el-table-column>
		<el-table-column label="创建人" prop="createUserName">
			<template slot-scope="scope">
				<span>{{ scope.row.createUserName || '--' }}</span>
			</template>
		</el-table-column>
		
		
		<el-table-column label="操作" v-if="!hideOperateBtn">
			<template slot-scope="scope">
				<el-button
					size="mini"
					type="text"
					icon="el-icon-edit"
					@click="handleUpdate(scope.row)"
				>编辑</el-button>
				<el-button
					size="mini"
					type="text"
					icon="el-icon-aim"
					@click="handleAduit(scope.row)"
				>审核</el-button>
				<br>
				<el-button
					size="mini"
					type="text"
					icon="el-icon-delete"
					@click="handleDelete(scope.row)"
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
		}
	},
	methods: {
		init() {
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {
    },
    // 初始化远程数据
    initRemoteData() {},
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
