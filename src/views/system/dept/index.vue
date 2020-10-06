<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="部门名称">
        <el-input
          v-model="queryParams.departmentName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.isEnable" placeholder="部门状态" clearable size="small">
          <el-option
            v-for="dict in isEnableOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="departmentId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="departmentName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="isEnable" label="状态" :formatter="isEnableFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="200">
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
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-unlock" 
            @click="handleDeptMenu(scope.row)"
            v-hasPermi="['system:dept:setPermis']"
          >设置部门权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId != 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" :disabled="!!form.departmentId" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="departmentName">
              <el-input v-model="form.departmentName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.isEnable">
                <el-radio
                  v-for="dict in isEnableOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑部门菜单权限 -->
    <el-dialog title="设置部门权限" :visible.sync="deptWithMenuDialog" width="600px" append-to-body>
      <el-form ref="form" :model="deptWithMenuForm" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="deptWithMenuForm.departmentName" :disabled="true" placeholder="请输入部门名称" />
          </el-form-item>
        </el-row>
        <el-row>
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
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDeptWidthMenu()">确 定</el-button>
        <el-button @click="deptWithMenuDialog = !deptWithMenuDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, delDept, addDept, updateDept, editDeptMenu, getDepartmentMenuList } from "@/api/system/dept";
import { treeselect as menuTreeselect } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 菜单列表
      menuOptions: [],
      defaultProps: {
        children: "childrenList",
        label: "name"
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      deptWithMenuDialog: false, // 部门关联菜单权限
      // 状态数据字典
      isEnableOptions: [],
      // 查询参数
      queryParams: {
        departmentName: undefined,
        isEnable: undefined
      },
      // 表单参数
      form: {},
      deptWithMenuForm: {}, // 部门关联菜单表单
      // 表单校验
      rules: {
        departmentName: [
          { required: true, message: "部门名称不能为空", trigger: ["blur","change"] }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: ["blur","change"] }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur","change"]
          }
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
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "departmentId");
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.departmentId,
        label: node.departmentName,
        children: node.children
      };
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselect() {
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "departmentId");
      });
    },
    // 字典状态字典翻译
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
      this.form = {
        departmentId: undefined,
        parentId: undefined,
        departmentName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        isEnable: 0,
        menuIds: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      const { departmentId } = row || {};
      this.reset();
      this.getDeptTreeselect();
      // 非搜索模块的添加
      if (row != undefined) {
        this.form.parentId = departmentId;
      }
      this.open = true;
      this.title = "添加部门";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getDeptTreeselect();
      this.form = {
        ...row,
      };
      this.open = true;
      this.title = "修改部门";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.departmentId != undefined) {
            updateDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.departmentName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const { departmentId } = row;
          const params = {
            departmentId,
          };
          return delDept(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /* 设置部门菜单权限 */
    async handleDeptMenu(row) {
      const { departmentId, parentId, departmentName } = row;
      this.deptWithMenuForm = {
        departmentId,
        parentId,
        departmentName,
      };
      this.deptWithMenuDialog = true;
      if (!parentId) {
        // 如果为1级部门则获取系统所有的菜单
        await this.getMenuTreeselect(1);
        this.getDepartmentMenuListFn(departmentId);
      } else {
        await this.getMenuTreeselect(2, parentId);
        // 再获取当前部门已选中的部门
        this.getDepartmentMenuListFn(departmentId);
      }
    },

    /** 查询菜单树结构 */
    getMenuTreeselect(type, departmentId) {
      if (type === 1) {
        // 获取一级部门能够选择的菜单
        menuTreeselect().then(res => {
          this.menuOptions = res.data;
        });
      } else {
        const params = {
          departmentId,
        };
        // 获取子级部门能够选择的父级部门菜单
        getDepartmentMenuList(params).then(res => {
          if (res.code === 200) {
            this.menuOptions = res.data || [];
          }
        });
      }
      
    },
    // 部门关联菜单
    editDeptWidthMenu() {
      const { departmentId } = this.deptWithMenuForm;
      const authorIds = this.getMenuAllCheckedKeys();
      const params = {
        id: departmentId,
        authorIds,
      };
      editDeptMenu(params).then(res => {
        if (res.code == 200) {
          this.msgSuccess("权限设置成功");
          this.deptWithMenuDialog = false;
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

    // 获取部门菜单已存在的数据
    getDepartmentMenuListFn(departmentId) {
      const params = {
        departmentId,
      };
      getDepartmentMenuList(params).then((res) => {
        if (res.code === 200) {
          if (res.data && res.data.length) {
            const checkedKeys = res.data.map((item) => item.id);
            this.$refs.menu.setCheckedKeys(checkedKeys);
          } else {
            this.$refs.menu.setCheckedKeys([]);
          }
        }
      });
    },
  },
};
</script>