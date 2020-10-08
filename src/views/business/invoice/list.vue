<template>
  <!-- 发票列表 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" :inline="true">
      <el-form-item label="项目编号">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="项目编号"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="queryParams.userName"
          placeholder="用户名称"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['business:invoice:list:add']">添加新发票</el-button>
      </el-form-item>
    </el-form>
    <invoiceTable :loading="loading" :dataList="projectList" @handleUpdate="handleUpdate" @handleAduit="handleAduit" @handleDelete="handleDelete"></invoiceTable>
    <pagination
      v-show="pagination.totalCount>0"
      :total="pagination.totalCount"
      :page.sync="pagination.pageIndex"
      :limit.sync="pagination.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import invoiceTable from '@/components/invoice/invoice-table.vue'
import { listInvoice, delInvoice } from "@/api/business/invoice.js";

export default {
  components: {
    invoiceTable,
  },
  data() {
    return {
      loading: false,

      queryParams: {}, // 表单信息
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
      }, // 分页数据
      dateRange: [], // 时间范围表单值

      projectList: [], // 发票列表
    }
  },
  created() {
    this.init();
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
      this.handleQuery();
    },
    // 搜索
    handleQuery() {
      this.getList();
    },
    async getList() {
      this.loading = true;
      const params = {
        ...this.queryParams,
        ...this.pagination,
      };
      listInvoice(params).then(response => {
        this.projectList = response.data;
        this.pagination.totalCount = response.totalCount;
        this.loading = false;
      });
    },
    // 重置
    resetQuery() {
      this.queryParams = {};
      this.handleQuery();
    },
    // 添加发票
    handleAdd() {
      this.$router.push({
        path: './base',
        query: {
          isEdit: true,
        }
      });
    },

    // 修改发票基本信息
    handleUpdate(row) {
      const { invoiceCode } = row;
      this.$router.push({
        path: './base',
        query: {
          invoiceCode,
        },
      });
    },

    // 审核发票
    handleAduit(row) {
      const { invoiceCode } = row;
      this.$router.push({
        path: './base',
        query: {
          invoiceCode,
          isAduit: true,
        },
      });
    },

    // 删除
    handleDelete(row) {
      const { invoiceCode } = row;
      this.$confirm('是否确认删除发票编号为"' + invoiceCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInvoice({
            invoiceCode,
          });
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
}
</script>