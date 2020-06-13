<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="isEnable">
            <el-select
              v-model="queryParams.isEnable"
              placeholder="用户状态"
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
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增用户</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="40" align="center" /> -->
          <el-table-column label="用户编号" align="center" prop="id" />
          <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="部门" align="center" prop="dept.deptName" :show-overflow-tooltip="true" /> -->
          <el-table-column label="手机号码" align="center" prop="loginAccount" width="120" />
          <el-table-column label="身份证" align="center" prop="idCard" width="120" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isEnable"
                :active-value="0"
                :inactive-value="1"
                disabled
                @change="handleIsEnableChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="createUserName"></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
               <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <!-- <el-button
                v-if="scope.row.id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['system:user:resetPwd']"
              >重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="totalCount>0"
          :total="totalCount"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="loginAccount">
              <el-input v-model="form.loginAccount" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证" maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!form.id" label="用户密码" prop="loginPassword">
              <el-input v-model="form.loginPassword" placeholder="请输入用户密码" type="loginPassword" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!form.id" label="年龄" prop="age">
              <el-input v-model.number="form.age" placeholder="请输入用户密码" type="age" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.isEnable">
                <el-radio
                  v-for="dict in isEnableOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户等级">
              <el-select v-model="form.levelId" placeholder="请选择">
                <el-option
                  v-for="item in levelOptions"
                  :key="item.levelId"
                  :label="item.levelName"
                  :value="item.levelId"
                  :disabled="item.isEnable == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.isEnable == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="departmentId">
              <treeselect v-model="form.departmentId" :options="deptOptions" :normalizer="normalizer" @input="getPostTreeselect(form.departmentId)" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postId" placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.isEnable == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, delUser, addUser, updateUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from "@/api/system/user";
import { listPost } from "@/api/system/post";
import { treeselect } from "@/api/system/dept";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
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
      totalCount: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initloginPassword: '123456',
      // 状态数据字典
      isEnableOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 部门树选项
      deptOptions: undefined,
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      levelOptions: [], // 用户等级
      // 表单参数
      form: {},
      defaultProps: {
        children: "childrenList",
        label: "name"
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        userName: undefined,
        phone: undefined,
        isEnable: undefined,
        departmentId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: ['blur', 'change'] }
        ],
        // departmentId: [
        //   { required: true, message: "归属部门不能为空", trigger: ['blur', 'change'] }
        // ],
        loginPassword: [
          { required: true, message: "用户密码不能为空", trigger: ['blur', 'change'] }
        ],
        loginAccount: [
          { required: true, message: "手机号码不能为空", trigger: ['blur', 'change'] },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: ['blur', 'change']
          }
        ],
        idCard: [
          { required: true, message: "身份证不能为空", trigger: ['blur', 'change'] },
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
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
    initAssetData() {
      this.getEnabledOptions(); // 获取部门状态枚举
      this.getSexOptions();
    },
    initRemoteData() {
      this.getList();
      this.getDeptTreeselect();
      this.getRoleList();
      this.getLevelOptions();
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
    // 获取性别枚举
    getSexOptions() {
      const data = [
        {
          dictLabel: '男',
          dictValue: 0,
        },
        {
          dictLabel: '女',
          dictValue: 1,
        },
      ];
      this.sexOptions = data;
    },
    // 获取角色列表
    getLevelOptions() {
      const data = [
        {
          levelName: 'A',
          levelId: '1',
        },
        {
          levelName: 'B',
          levelId: '2',
        },
        {
          levelName: 'C',
          levelId: '3',
        },
        {
          levelName: 'D',
          levelId: '4',
        },
        {
          levelName: 'E',
          levelId: '5',
        },
      ];
      this.levelOptions = data;
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.childrenList && !node.childrenList.length) {
        delete node.childrenList;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.childrenList
      };
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const params = {
        ...this.queryParams,
      };
      listUser(params).then(response => {
          this.userList = response.data;
          this.totalCount = response.totalCount;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 获取角色列表
    getRoleList() {
      listRole().then(response => {
        this.roleOptions = response.data;
      })
    },
    
    // 通过departmentId获取菜单权限
    getPostTreeselect(departmentId) {
      console.log(departmentId, '--departmentId')
      if (departmentId) {
        const params = {
          departmentId,
        };
        listPost(params).then(response => {
          this.postOptions = response.data;
        });
      } else {
        this.postOptions = [];
        this.form.postId = undefined;
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.departmentId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleIsEnableChange(row) {
      let text = row.isEnable === 0 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.id, row.isEnable);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isEnable = row.isEnable === 0 ? 1 : 0;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        loginPassword: undefined,
        loginAccount: undefined,
        idCard: undefined, 
        sex: undefined,
        age: undefined,
        isEnable: 0,
        levelId: undefined,
        headPhoto: undefined, // 用户头像
        remark: undefined,
        departmentId: undefined,
        postId: undefined,
        roleId: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
      this.form.loginPassword = this.initloginPassword;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {
        ...row,
      };
      this.getPostTreeselect(this.form.departmentId);
      this.open = true;
      this.title = "修改用户";
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        const params = {
          userId: row.id,
        };
          resetUserPwd(params).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            } else {
              this.msgError(response.msg);
            }
          });
        }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!(this.form.departmentId && this.form.roleId)) {
            this.msgError('角色和部门必须选一项哟');
            return;
          }
          const { id } = this.form;
          if (id) {
            const params = {
              ...this.form,
              userId: id,
            }
            updateUser(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUser(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除用户编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
  }
};
</script>