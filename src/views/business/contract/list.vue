<template>
  <!-- 合同列表 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" :inline="true">
      <el-form-item label="合同名称">
        <el-input
          v-model="queryParams.contractName"
          placeholder="合同名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item label="合同编号">
        <el-input
          v-model.number="queryParams.contractCode"
          placeholder="合同编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-add" size="mini" @click="handleAdd">添加新合同</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="projectList">
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
      
      <el-table-column label="操作">
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
    </el-table>
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
import { listContract, delContract } from "@/api/business/contract.js";

export default {
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

      projectList: [], // 合同列表
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
    initAssetData() {
      this.getContractTypeList();
    },
    // 初始化远程数据
    initRemoteData() {
      this.handleQuery();
    },
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
      listContract(params).then(response => {
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
    // 添加合同
    handleAdd() {
      this.$router.push({
        path: './base',
        query: {
          isEdit: true,
        }
      });
    },

    // 编辑合同基本信息
    handleUpdate(row) {
      const { contractCode } = row;
      this.$router.push({
        path: './base',
        query: {
          contractCode,
        },
      });
    },

    // 审核合同
    handleAduit(row) {
      const { contractCode } = row;
      this.$router.push({
        path: './base',
        query: {
          contractCode,
          isAduit: true,
        },
      });
    },

    // 删除
    handleDelete(row) {
      const { contractCode } = row;
      this.$confirm('是否确认删除合同编号为"' + contractCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delContract({
            contractCode,
          });
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
}
</script>