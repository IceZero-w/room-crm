<template>
  <!-- 项目列表 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" :inline="true">
      <el-form-item label="项目名称">
        <el-input
          v-model="queryParams.projectName"
          placeholder="项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input
          v-model.number="queryParams.projectCode"
          placeholder="项目编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          ></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select style="width: 240px" v-model="queryParams.projectAduitProgress" placeholder="请选择">
          <el-option
            v-for="(item, index) in projectAduitProgressList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
            ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-add" size="mini" @click="handleAdd">添加新项目</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="projectList">
      <el-table-column label="项目编号" prop="projectCode"></el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="甲方单位名称" prop="firstParty"></el-table-column>
      <el-table-column label="项目金额" prop="projectAmount">
        <template slot-scope="scope">
          <span>{{ getPrice(scope.row.projectAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" prop="auditName">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStates === 1">制单</span>
          <span v-else>{{ scope.row.auditName }}(已审核)</span>
        </template>
      </el-table-column>
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
              icon="el-icon-search"
              @click="handleSeeMore(scope.row)"
            >详情</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <br>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-aim"
            @click="handleAduit(scope.row)"
          >审核</el-button>
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
import { listProject, delProject } from "@/api/business/project.js";

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
    initAssetData() {
      this.getProjectAduitProgressList(); // 获取项目审核状态枚举
    },
    // 初始化远程数据
    initRemoteData() {
      this.handleQuery();
    },
    // 获取项目审核状态枚举
    getProjectAduitProgressList() {
      const data = [
        {
          dictLabel: '制单',
          dictValue: 0,
        },
        {
          dictLabel: '项目经理已审核',
          dictValue: 1,
        },
        {
          dictLabel: '财务经理已审核',
          dictValue: 2,
        },
        {
          dictLabel: '董事长已审核',
          dictValue: 3,
        },
      ];
      this.projectAduitProgressList = data;
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
      listProject(this.addDateRange(params, this.dateRange)).then(response => {
        this.projectList = response.data;
      this.pagination.totalCount = response.totalCount;
        this.loading = false;
      });
      // this.projectList = [
      //   {
      //     projectCode: 1,
      //     projectName: '测试',
      //     firstParty: '甲方1',
      //     projectAmount: 10000,
      //     createDate: +new Date(),
      //   },
      //   {
      //     projectCode: 2,
      //     projectName: '测试2',
      //     firstParty: '甲方222',
      //     projectAmount: 104000,
      //     createDate: +new Date(),
      //   }
      // ];
      // this.loading = false;
    },
    // 重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 添加项目
    handleAdd() {
      this.$router.push({
        path: './base',
        query: {
          isEdit: true,
        }
      });
    },

    // 查看项目详情
    handleSeeMore(row) {
      const { projectCode } = row;
      this.$router.push({
        path: './detail',
        query: {
          projectCode,
        },
      })
    },

    // 编辑项目基本信息
    handleUpdate(row) {
      const { projectCode } = row;
      this.$router.push({
        path: './base',
        query: {
          projectCode: projectCode,
        },
      });
    },

    // 审核项目
    handleAduit(row) {
      const { projectCode } = row;
      this.$router.push({
        path: './detail',
        query: {
          projectCode,
          isAduit: true,
        },
      });
    },

    // 删除
    handleDelete(row) {
      const { projectCode, id } = row;
      this.$confirm('是否确认删除项目编号为"' + projectCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProject({
            id,
          });
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
}
</script>