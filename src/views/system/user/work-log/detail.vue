<template>
  <div class="app-container">
    <el-form ref="workLogForm" :model="workLogForm" :rules="rules" label-width="150px" label-suffix=":">
      <el-card class="project-base-box">
        <div slot="header" class="project-title">
          <span>项目基础信息</span>
        </div>
        <el-form-item label="工作日志编号" v-if="workLogCode">
          <div class="ip-w200">{{ workLogCode }}</div>
        </el-form-item>
        <el-form-item label="日志关联项目" prop="projectCode">
          <el-select class="ip-w200" v-model="workLogForm.projectCode">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectName" :value="item.projectCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作图片" prop="imageUrls">
          <!-- 已上传的图片 -->
          <div class="img-box" v-for="(item, index) in workLogForm.imageUrls" :key="index">
            <img
              class="img-dom"
              :src="item" alt=""
            >
            <div class="img-box-hover">
              <span
                @click="handlePictureCardPreview(index)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                @click="handleDownload(index)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                @click="handleRemove(index)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </div>
          </div>
          <!-- 上传图片模块 -->
          <el-upload
            name="files"
            action="/api/UploadImage/UploadImg"
            accept=".png, .jepg, .jpg"
            :multiple="true"
            :show-file-list="false"
            list-type="picture-card"
            :auto-upload="true"
            :on-success="uploadSuccess"
            :with-credentials="true"
            class="upload-dom"
            >
              <i slot="default" class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="日志内容" prop="workLogContent">
          <el-input type="textarea" v-model="workLogForm.workLogContent" :rows="5"></el-input>
        </el-form-item>
      </el-card>
      <el-card class="project-base-box">
        <!-- 按钮操作模块 -->
        <div>
          <el-button type="primary" @click="handelOperate()" :loading="isRequesting">{{ workLogCode ? '保存' : '新建' }}</el-button>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </el-card>    
    </el-form>
  </div>
</template>
<script>
import { getWorkLogList } from "@/api/system/user.js";
import { listProject } from "@/api/business/project.js";
import { createWorkLog, getWorkLogDetail, editWorkLog } from "@/api/system/user.js";
const baseURL = process.env.VUE_APP_BASE_API

export default {
  data() {
    return {
      baseURL,
      isRequesting: false, // 接口请求中
      workLogCode: undefined,
      workLogForm: {
        projectCode: undefined,
        imageUrls: [], // 上传的图片
        workLogContent: undefined, // 工作日志内容
      }, // 日志表单
      projectList: [], // 项目列表
      rules: {}, // 规则
      dialogVisible: false,
      dialogImageUrl: undefined, // 弹窗显示的大图地址
    };
  },
  mounted() {
    this.workLogCode = this.$route.query.workLogCode;
    this.init();
  },
  methods: {
    init() {
      this.initAssetData();
      this.initRemoteData();
    },
    initAssetData() {
      this.initRules();
    },
    initRemoteData() {
      this.getProjectListFn();
      if (this.workLogCode) {
        this.getWorkLogDetailFn();
      }
    },
    initRules() {
      const rules = {
        projectCode: [{ required: true, trigger: ["blur","change"], message: "请选择项目名称"}],
        workLogContent: [{ required: true, trigger: ["blur","change"], message: "请填写日志内容"}]
      }
      this.rules = rules;
    },
    // 获取可关联的项目列表
    getProjectListFn() {
      const params = {
        pageIndex: 1,
        pageSize: 999,
      };
      listProject(params).then(response => {
        this.projectList = response.data;
      });
    },
    // 获取日志详情
    getWorkLogDetailFn() {
      const { workLogCode } = this;
      const params = {
        workLogCode,
      }
      getWorkLogDetail(params).then(res => {
        this.workLogForm = res.data;
      })
    },
    // 新建/保存项目
    handelOperate() {
      this.$refs['workLogForm'].validate((valid) => {
        if (valid) {
          this.isRequesting = true;
          const { workLogCode } = this;
          const params = {
            ...this.workLogForm,
          };
          if (workLogCode) {
            this.handleUpdate(params);
          } else {
            const { id, userName } = JSON.parse(localStorage.getItem('userInfo'));
            params.userId = id
            params.userName = userName
            this.handleAdd(params);
          }
        }
      });
    },
    // 修改项目
    handleUpdate(params) {
      editWorkLog(params).then(response => {
        this.msgSuccess("修改成功");
        this.goBack();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 添加项目
    handleAdd(params) {
      createWorkLog(params).then(response => {
        this.msgSuccess("日志创建成功");
        this.$router.back();
      }).finally(() => {
        this.isRequesting = false;
      });
    },
    // 图片上传成功
    uploadSuccess(res) {
      if (res.code === 200) {
        this.workLogForm.imageUrls.push(res.data[0])
      } else {
        const { message = '图片上传失败' } = res;
        this.$message.error({
          message: message,
        })
      }
    },
    handlePictureCardPreview(index) {
      this.dialogVisible = true;
      this.dialogImageUrl = this.workLogForm.imageUrls[index];
    },
    // 图片下载
    handleDownload(index) {
      const imgUrl = this.workLogForm.imageUrls[index];
      window.open(`${imgUrl}`)
    },
    // 图片删除
    handleRemove(index) {
      this.workLogForm.imageUrls.splice(index, 1);
    },

    goBack() {
      this.$router.back();
    },
  }
}
</script>
<style lang="scss" scoped>
.ip-w200 {
  width: 200px !important;
}

.project-base-box {
  margin-bottom: 20px;
}

.img-box {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  cursor: pointer;
  line-height: 146px;
  vertical-align: top;
  display: inline-block;
  position: relative;
  display: inline-block;

  .img-dom {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .img-box-hover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }

  &:hover {
    .img-box-hover {
      opacity: 1;
    }
  }
  
}

.upload-dom {
  display: inline-block;
}


</style>