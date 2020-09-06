<template>
	<contractTable :loading="loading" :dataList="dataList"></contractTable>
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
		}
		
	}
}
</script>
