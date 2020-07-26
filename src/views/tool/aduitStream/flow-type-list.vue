
<template>
<!-- 工作流类型管理 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="工作流类型名称" prop="flowTypeName">
        <el-input
          v-model="queryParams.flowTypeName"
          placeholder="请输入工作流类型名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作流类型状态" prop="isEnable">
        <el-select
          v-model="queryParams.isEnable"
          placeholder="工作流类型状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in isEnableOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="flowTypeList">
      <el-table-column label="工作流类型编号" prop="flowTypeCode" />
      <el-table-column label="工作流类型名称" prop="flowTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="isEnable" :formatter="isEnableFormat"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getFlowTypeList"
    />

    <!-- 添加或修改工作流类型配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="工作流类型名称" prop="flowTypeName">
          <el-input v-model="form.flowTypeName" placeholder="请输入工作流类型名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.isEnable">
            <el-radio
              v-for="dict in isEnableOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFlowTypeList, createFlowType, editFlowType, deleteFlowType } from "@/api/tool/aduitStream";

export default {
  name: "FlowTypeList",
  data() {
    return {
      loading: true, // 遮罩层
      title: "", // 弹出层标题
      open: false, // 是否显示弹出层
      isEnableOptions: [], // 状态数据字典
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        flowTypeName: undefined,
        isEnable: undefined
      },
      flowTypeList: [], // 工作流类型列表
      form: {}, // 表单参数
      // 表单校验
      rules: {
        flowTypeName: [
          { required: true, message: "工作流类型名称不能为空", trigger: ["blur","change"] }
        ],
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initAssetData();
      this.initRemoteData();
    },
    initAssetData() {
      this.getEnabledOptions(); // 获取部门状态枚举
    },
    initRemoteData() {
      this.getFlowTypeList();
    },
    // 获取部门状态枚举
    getEnabledOptions() {
      const data = [
        {
          dictLabel: '启用',
          dictValue: 0,
        },
        {
          dictLabel: '禁用',
          dictValue: 1,
        },
      ];
      this.isEnableOptions = data;
    },
    /** 查询工作流类型列表 */
    getFlowTypeList() {
      this.loading = true;
      getFlowTypeList(this.queryParams).then(
        response => {
          this.flowTypeList = response.data || [];
          this.queryParams.total = response.totalCount;
          this.loading = false;
        }
      );
    },
    // 岗位状态字典翻译
    isEnableFormat(row, column) {
      return this.selectDictLabel(this.isEnableOptions, row.isEnable);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        id: undefined,
        flowTypeName: undefined,
        roleLevel: undefined,
        sort: 0,
        isEnable: 0,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getFlowTypeList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工作流类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {
        ...row,
      };
      this.open = true;
      this.title = "修改工作流类型";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            editFlowType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getFlowTypeList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            createFlowType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getFlowTypeList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const { id, flowTypeCode } = row;
      this.$confirm('是否确认删除工作流类型编号为"' + flowTypeCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const params = {
            flowTypeCode,
          };
          return deleteFlowType(params);
        }).then(() => {
          this.getFlowTypeList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }, 
  }
};
</script>