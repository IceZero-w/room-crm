<template>
  <el-dialog :visible="visible" :title="flowNodeInfo.nodeCode ? '编辑子节点' : '新建子节点'" width="800px" @close="closeDialog()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="工作流子节点名称" prop="nodeName">
        <el-input v-model="form.nodeName"></el-input>
      </el-form-item>
      <el-form-item label="工作流子节点排序" prop="sort">
        <el-input v-model.number="form.sort" placeholder="序号越大，工作流越靠后"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createFlowNode, editFlowNode } from '@/api/tool/aduitStream'

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
      form: {}, // 工作流表单

      rules: {
        nodeName: [
          { required: true, message: "工作流子节点名称不能为空", trigger: ["blur","change"] }
        ],
        sort: [
          { required: true, message: "工作流子节点排序不能空", trigger: ["blur","change"] }
        ],
      },
    };
  },
  watch: {
    flowNodeInfo: {
      handler(val) {
        if (val) {
          this.form = val || {};
        }
      },
      deep: true,
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.nodeCode != undefined) {
            editFlowNode(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.closeDialog();
                this.$emit('refreshList');
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            createFlowNode(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.closeDialog();
                this.$emit('refreshList');
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
    },
  }
}
</script>