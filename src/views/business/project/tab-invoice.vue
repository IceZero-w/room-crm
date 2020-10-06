<template>
	<invoiceTable :loading="loading" :dataList="dataList" :hideOperateBtn="hideOperateBtn">
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
	</invoiceTable>
</template>
<script>
import { listInvoice } from "@/api/business/invoice.js";
import invoiceTable from '@/components/invoice/invoice-table.vue'

export default {
	components: {
		invoiceTable,
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
			invoiceTypeList: [],
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
			this.getInvoiceListFn();
		},
		getInvoiceListFn() {
      this.loading = true;
			const { projectCode } = this;
			const params = {
				projectCode,
				pageIndex: 1,
        pageSize: 9999,
			};
			listInvoice(params).then(response => {
        this.dataList = response.data;
        this.loading = false;
      });
		},
		// 编辑合同基本信息
    handleUpdate(row) {
      const { invoiceCode } = row;
      this.$router.push({
        path: '/business/invoice/base',
        query: {
          invoiceCode,
        },
      });
    },
		
	}
}
</script>
