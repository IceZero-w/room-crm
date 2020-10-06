<template>
	<contractTable :loading="loading" :dataList="dataList" :hideOperateBtn="hideOperateBtn">
		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button
					size="mini"
					type="text"
					icon="el-icon-edit"
					@click="handleUpdate(scope.row)"
				>查看</el-button>
			</template>
		</el-table-column>
	</contractTable>
</template>
<script>
import { listContract } from "@/api/business/contract.js";
import contractTable from '@/components/contract/contract-table.vue'

export default {
	components: {
		contractTable,
	},
	props: {
		projectCode: {
			type: String,
			default: undefined,
		},
	},
	mounted() {
		this.init();
	},
	data() {
		return {
			hideOperateBtn: true,
			loading: false,
			contractTypeList: [],
			dataList: [],
		}
	},
	methods: {
		init() {
      this.initAssetData();
      this.initRemoteData();
    },
    // 初始化静态数据
    initAssetData() {},
    // 初始化远程数据
    initRemoteData() {
			this.getContractListFn();
		},
		getContractListFn() {
      this.loading = true;
			const { projectCode } = this;
			const params = {
				projectCode,
				pageIndex: 1,
        pageSize: 9999,
			};
			listContract(params).then(response => {
        this.dataList = response.data;
        this.loading = false;
      });
		},
		
		// 编辑合同基本信息
    handleUpdate(row) {
      const { contractCode } = row;
      this.$router.push({
        path: '/business/contract/base',
        query: {
          contractCode,
        },
      });
    },
	}
}
</script>
