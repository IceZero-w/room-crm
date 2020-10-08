<template>
<!-- 菜单管理 -->
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.isEnable" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.icon">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="menuSort" label="排序" width="60"></el-table-column>
      <el-table-column prop="menuCode" label="权限标识"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="isEnable" label="状态" :formatter="statusFormat" width="70"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button 
            v-if="scope.row.menuType !== 'B'"
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentMenuId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType" :disabled="!!form.menuId" @change="changeMenuType">
                <!-- <el-radio label="M">目录</el-radio> -->
                <el-radio label="M">菜单</el-radio>
                <el-radio label="B">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'B'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="menuSort">
              <el-input-number v-model="form.menuSort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'B'" label="路由地址" prop="routeUrl">
              <el-input v-model="form.routeUrl" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'M'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="menuCode">
              <el-input v-model="form.menuCode" :disabled="!!form.menuId" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'B'" label="菜单状态">
              <el-radio-group v-model="form.isEnable">
                <el-radio
                  v-for="dict in statusOptions"
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
  </div>
</template>

<script>
import { listMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        isEnable: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: ["blur","change"] }
        ],
        menuSort: [
          { required: true, message: "菜单顺序不能为空", trigger: ["blur","change"] }
        ],
        routeUrl: [
          { required: true, message: "路由地址不能为空", trigger: ["blur","change"] }
        ],
        menuCode:[
          { required: true, message: "权限标识不能为空", trigger: ["blur","change"] }
        ],
      }
    };
  },
  created() {
    this.getStatusOptions(); // 获取菜单状态
    this.getList();
  },
  methods: {
    // 获取菜单状态枚举
    getStatusOptions() {
      const data = [
        {
          dictLabel: '正常',
          dictValue: 0,
        },
        {
          dictLabel: '停用',
          dictValue: 1,
        },
      ];
      this.statusOptions = data;
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    async getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "menuId", 'parentMenuId');
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "menuId", 'parentMenuId');
        this.menuOptions.push(menu);
      });
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "B") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.isEnable);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 菜单类型更改的时候，
    changeMenuType() {
      this.form = {
        ...this.form,
        menuSort: undefined,
        icon: undefined,
        routeUrl: undefined,
        component: undefined,
        menuCode: undefined,
        isEnable: 0,
      };
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined, // 权限id
        parentMenuId: 0, // 父级权限id
        menuName: undefined, // 菜单名称
        icon: undefined, // 菜单图标
        menuType: "M", // 权限类型
        menuSort: undefined, // 菜单排序
        routeUrl: undefined, // 菜单访问地址
        component: undefined, // 菜单组件地址
        menuCode: undefined, // 按钮唯一标识
        isEnable: 0, // 菜单是否禁用
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentMenuId = row.menuId;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const { menuId } = row;
      this.reset();
      this.getTreeselect();
      const params = {
        menuId,
      };
      this.form = {
        ...row,
      };
      this.open = true;
      this.title = "修改菜单";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            const params = {
              ...this.form,
            };
            updateMenu(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            const params = {
              ...this.form,
              menuId: 0, // 新建的时候默认传0
            };
            addMenu(params).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const { menuId } = row;
          const params = {
            menuId,
          };
          return delMenu(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>