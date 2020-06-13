<template>
<!-- 岗位管理 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="岗位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="岗位状态" clearable size="small">
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
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="岗位Id" align="center" prop="postId" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="岗位排序" align="center" prop="sorts" />
      <el-table-column label="状态" align="center" prop="isEnable" :formatter="isEnableFormat" />
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
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-unlock"
            @click="handlePostMenu(scope.row)"
            v-hasPermi="['system:post:setPermis']"
          >设置岗位权限</el-button>
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="sorts">
          <el-input-number v-model="form.sorts" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="isEnable">
          <el-radio-group v-model="form.isEnable">
            <el-radio
              v-for="dict in isEnableOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在部门" prop="departmentId">
          <treeselect v-model="form.departmentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 设置岗位的菜单权限 -->
    <el-dialog title="设置岗位权限" :visible.sync="postWithMenuDialog" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="postWithMenuForm.postName" placeholder="请输入岗位名称" disabled />
        </el-form-item>
        <el-form-item label="所在部门" prop="departmentId">
          <treeselect v-model="postWithMenuForm.departmentId" :options="deptOptions" :disabled="true" :normalizer="normalizer" placeholder="选择上级部门" />
        </el-form-item>
         <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPostWithMenu">确 定</el-button>
        <el-button @click="postWithMenuDialog = !postWithMenuDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, delPost, addPost, updatePost, getPostMenuList, editPostMenu } from "@/api/system/post";
import { listDept, getDepartmentMenuList } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Post",
  components: {
    Treeselect,
  },
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
      // 岗位表格数据
      postList: [],
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
      postWithMenuDialog: false, // 控制设置岗位关联菜单的弹窗
      // 状态数据字典
      isEnableOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postId: undefined,
        postName: undefined,
        isEnable: undefined
      },
      // 表单参数
      form: {},
      postWithMenuForm: {}, // 设置岗位关联菜单的表单
      // 表单校验
      rules: {
        postName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        sorts: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" }
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
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
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
      this.form = {
        postId: undefined,
        postId: undefined,
        postName: undefined,
        sorts: 0,
        isEnable: 0,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect(); // 获取部门树形结构
      this.open = true;
      this.title = "添加岗位";
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "departmentId");
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect(); // 获取部门树形结构
      const postId = row.postId || this.ids
      this.form = {
        ...row,
      };
      this.open = true;
      this.title = "修改岗位";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPost(this.form).then(response => {
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
      const postIds = row.postId || this.ids;
      this.$confirm('是否确认删除岗位id为"' + postIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const params = {
            postId: postIds,
          };
          return delPost(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

    /* 岗位设置菜单权限模块 */
    async handlePostMenu(row) {
      const { postId, postName, departmentId } = row;
      this.postWithMenuForm = {
        postId,
        postName,
        departmentId,
      };
      this.getTreeselect(); // 获取部门树形结构
      await getDepartmentMenuList({ departmentId }).then(res => {
        if (res.code === 200) {
          this.menuOptions = res.data || [];
        } else {
          this.menuOptions = [];
        }
      }); // 获取岗位关联部门的菜单列表
      // 获取岗位已经关联的菜单
      getPostMenuList({
        postId,
      }).then(res => {
        if (res.code === 200) {
          const checkedKeys = res.data.map((item) => item.id) || [];
          this.$refs.menu.setCheckedKeys(checkedKeys);
        } else {
          this.$refs.menu.setCheckedKeys([]);
        }
      });
      this.postWithMenuDialog = true;
    },


    // 设置岗位的菜单权限
    editPostWithMenu() {
      const { postId } = this.postWithMenuForm;
      const authorIds = this.getMenuAllCheckedKeys();
      const params = {
        id: postId,
        authorIds,
      };
      editPostMenu(params).then(res => {
        if (res.code == 200) {
          this.msgSuccess("权限设置成功");
          this.postWithMenuDialog = false;
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