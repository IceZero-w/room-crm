<template>
<!-- 角色管理 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isEnable">
        <el-select
          v-model="queryParams.isEnable"
          placeholder="角色状态"
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
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="角色等级" prop="roleLevel" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="sort" width="100" />
      <el-table-column label="状态" align="center" width="100" :formatter="isEnableFormat"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
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
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-unlock"
            @click="handleRoleMenu(scope.row)"
            v-hasPermi="['system:role:hasPermi']"
          >设置角色权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色等级" prop="roleLevel">
          <el-select
            v-model="form.roleLevel"
            placeholder="角色等级"
            clearable
          >
            <el-option
              v-for="dict in roleLevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
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
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 角色关联菜单 -->
    <el-dialog title="角色关联权限" :visible.sync="roleWithMenuDialog" width="500px" append-to-body>
      <el-form ref="form" :model="roleWithMenuForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleWithMenuForm.roleName" disabled placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色等级" prop="roleLevel">
          <el-select
            v-model="roleWithMenuForm.roleLevel"
            placeholder="角色等级"
            clearable
            disabled
          >
            <el-option
              v-for="dict in roleLevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRoleWithMenu()">确 定</el-button>
        <el-button @click="roleWithMenuDialog = !roleWithMenuDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, delRole, addRole, updateRole, getRoleMenuList, editRoleMenu, changeRoleIsEnable } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { treeselect as deptTreeselect } from "@/api/system/dept";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      roleWithMenuDialog: false, // 控制角色关联菜单的弹窗
      // 是否显示弹出层（数据权限）
      // 日期范围
      dateRange: [],
      // 状态数据字典
      isEnableOptions: [],
      roleLevelOptions: [], // 角色等级列表
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        isEnable: undefined
      },
      // 表单参数
      form: {},
      roleWithMenuForm: {}, // 角色关联菜单表单
      defaultProps: {
        children: "childrenList",
        label: "name"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: ["blur","change"] }
        ],
        roleLevel: [
          { required: true, message: "角色等级不能为空", trigger: ["blur","change"] }
        ],
        sort: [
          { required: true, message: "角色顺序不能为空", trigger: ["blur","change"] }
        ]
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
      this.getRoleLevelOptions(); // 获取角色等级的枚举
    },
    initRemoteData() {
      this.getList();
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
    // 获取角色等级的枚举
    getRoleLevelOptions() {
      const data = [
        {
          dictLabel: '超级管理员',
          dictValue: 0,
        },
        {
          dictLabel: '管理员',
          dictValue: 1,
        },
        {
          dictLabel: '普通用户',
          dictValue: 2,
        },
      ];
      this.roleLevelOptions = data;
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then(
        response => {
          this.roleList = response.data || [];
          // this.total = response.total;
        }
      ).finally(() => {
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
    isEnableFormat(row, column) {
      return this.selectDictLabel(this.isEnableOptions, row.isEnable);
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
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
        roleId: undefined,
        roleName: undefined,
        roleLevel: undefined,
        sort: 0,
        isEnable: 0,
        menuIds: [],
        deptIds: [],
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      this.form = {
        ...row,
      };
      this.open = true;
      this.title = "修改角色";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
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
      const { roleId } = row;
      this.$confirm('是否确认删除角色编号为"' + roleId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const params = {
            roleId,
          };
          return delRole(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

    // 设置角色关联的菜单
    async handleRoleMenu(row) {
      const { roleId, roleName, roleLevel } = row;
      this.roleWithMenuForm = {
        roleId,
        roleName,
        roleLevel,
      };
      this.roleWithMenuDialog = true;
      await this.getMenuTreeselect();
      getRoleMenuList({ roleId }).then(res => {
        if (res.code === 200) {
          const checkedKeys = res.data.map((item) => item.id) || [];
          this.$refs.menu.setCheckedKeys(checkedKeys);
        } else {
          this.$refs.menu.setCheckedKeys([]);
        }
      })
    },

    getMenuTreeselect() {
      // 获取一级部门能够选择的菜单
      menuTreeselect().then(res => {
        this.menuOptions = res.data || [];
      });
    },

    // 修改角色关联菜单
    editRoleWithMenu() {
      const { roleId } = this.roleWithMenuForm;
      const authorIds = this.getMenuAllCheckedKeys();
      const params = {
        id: roleId,
        authorIds,
      };
      editRoleMenu(params).then(res => {
        if (res.code == 200) {
          this.msgSuccess("权限设置成功");
          this.roleWithMenuDialog = false;
          this.getList();
        }
      });
    },

    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
  }
};
</script>