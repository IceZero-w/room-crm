<template>
  <!-- 项目列表 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" :inline="true">
      <el-form-item label="项目编号">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="项目编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="queryParams.userName"
          placeholder="用户名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">添加日志</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="projectList">
      <el-table-column label="工作日志编号" prop="workLogCode"></el-table-column>
      <el-table-column label="用户id" prop="userId"></el-table-column>
      <el-table-column label="用户名称" prop="userName"></el-table-column>
      <el-table-column label="项目编号" prop="projectCode"></el-table-column>
      <el-table-column label="日志内容" prop="workLogContent"></el-table-column>
      <el-table-column label="创建时间" prop="createDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="projectName">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
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
import { getWorkLogList, delProject } from "@/api/system/user.js";
import { deleteWorkLog } from "@/api/system/user.js";

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
      projectAduitProgressList: [], // 项目审核状态枚举
      dateRange: [], // 时间范围表单值

      projectList: [], // 项目列表
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
      getWorkLogList(params).then(response => {
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
    // 添加项目
    handleAdd() {
      this.$router.push({
        path: '/system/user/work-log/detail',
      });
    },

    // 修改项目基本信息
    handleUpdate(row) {
      const { workLogCode } = row;
      this.$router.push({
        path: '/system/user/work-log/detail',
        query: {
          workLogCode,
        },
      });
    },

    // 删除
    handleDelete(row) {
      const { workLogCode } = row;
      this.$confirm('是否确认删除工作日志编号为"' + workLogCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteWorkLog({
            workLogCode,
          });
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
}
</script>