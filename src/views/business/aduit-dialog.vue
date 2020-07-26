<template>
  <el-dialog :visible.sync="visible" :title="title" @close="closeDialog()">
    <el-form ref="auditForm" :model="auditForm" label-width="100px">
      <el-form-item label="审核结果" prop="status">
        <el-select v-model="auditForm.status">
          <el-option v-for="(item, index) in aduitStatusList" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核备注">
        <el-input type="textarea" v-model="auditForm.remark"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="handleAduit()">确定</el-button>
        <el-button type="default" @click="closeDialog()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 控制弹窗
    visible: {
      type: Boolean,
      default: false,
    },
    // 审核弹窗标题
    title: {
      type: String,
      default: '审核操作',
    },
    aduitStatusList: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      auditForm: {
        status: undefined,
        remark: undefined,
      },
    };
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.auditForm = {
        status: undefined,
        remark: undefined,
      };
      this.$emit('update:visible', false);
    },
    // 确认审核结果
    handleAduit() {
      if (!this.auditForm.status && this.auditForm.status !== 0) {
        this.msgError('请选择审核结果哟～');
      }
      this.$emit('handleAduit', this.auditForm);
    },
  }
}
</script>