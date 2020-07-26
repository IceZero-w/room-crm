<template>
  <el-dialog :visible="visible" :title="'分配子节点权限用户'" width="800px" @close="closeDialog()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="分配用户" prop="userId">
        <!-- <el-select v-model="form.userList">
          <el-option v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.userId"></el-option>
        </el-select> -->
        <!-- <el-checkbox-group v-model="form.userList">
          <el-checkbox v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.userId"></el-checkbox>
        </el-checkbox-group> -->
        <template v-if="form.userList && form.userList.length">
          <el-tag class="user-tag" v-for="(item, index) in form.userList" :key="index" closable @close="handleDelete(item)">{{ item.userName || '' }}</el-tag>
        </template>
        <span class="user-tag" v-else>暂无</span>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddUserDialog()">添加用户</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">已添加完毕</el-button>
    </div>

    <!-- 添加用户弹窗 -->
    <el-dialog :visible.sync="addDialog" title="添加用户" :append-to-body="true" :modal-append-to-body="false" @close="addDialog = false">
      <el-select v-model="addUserId" filterable clearable>
        <el-option v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.id"></el-option>
      </el-select>
      <el-button :disabled="!addUserId" type="success" @click="confirmAddUser()">确定</el-button>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";
import { authorNodeUser, getAuthorUserList, deleteNodeUser } from '@/api/tool/aduitStream'

export default {
  props: {
    flowNodeInfo: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 工作流表单s
      form: {
        userId: [],
      },
      userList: [], // 获取用户列表
      addDialog: false, // 显示添加用户弹窗
      addUserId: undefined, // 想要添加的用户id

      rules: {
        nodeName: [
          { required: true, type: Array, message: "分配用户必选", trigger: ["blur","change"] }
        ],
      },
    };
  },
  watch: {
    flowNodeInfo: {
      handler(val) {
        if (val && val.nodeCode) {
          this.getAuthorUserListFn();
        }
      },
      deep: true,
    },
    visible: {
      handler(val) {
        val && this.init();
      },
    }
  },
  methods: {
    handleDelete(item) {
      const { id, userName } = item;
      this.$confirm('是否确认删除子节点用户为"' + userName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const params = {
            nodeCode: this.flowNodeInfo.nodeCode,
            id,
          };
          return deleteNodeUser(params);
        }).then(() => {
          this.getAuthorUserListFn();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    init() {
      this.getUserList();
    },
    // 获取用户列表
    getUserList() {
      const params = {
        pageIndex: 1,
        pageSize: 99,
      };
      listUser(params).then(response => {
          this.userList = response.data;
        }
      );
    },
    // 获取工作流子节点分配的用户
    getAuthorUserListFn() {
      const { nodeCode } = this.flowNodeInfo;
      const params = {
        nodeCode,
      };
      getAuthorUserList(params).then(res => {
        this.form = {
          userList: res.data,
        }
      })
    },
    // 通过用户id获取用户名称
    getUseInfoById(userId) {
      const arr = this.userList.filter(userItem => userItem.id == userId);
      return arr[0] || {};
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          authorNodeUser(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.closeDialog();
              this.$emit('refreshList');
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
    },
    // 添加用户
    showAddUserDialog() {
      this.addDialog = true;
    },
    

    // 确认添加用户
    confirmAddUser() {
      const params = {
        nodeCode: this.flowNodeInfo.nodeCode,
        userId: this.addUserId,
        userName: this.getUseInfoById(this.addUserId).userName,
      };
      authorNodeUser(params).then(res => {
        this.addDialog = false;
        this.getAuthorUserListFn();
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .user-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>