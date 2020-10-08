<template>
  <div class="app-container">
    <template v-if="flowNodeList.length">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in flowNodeList" :key="index" :timestamp="item.createDate" placement="top">
          <el-card>
            <h3>{{ item.nodeName }}</h3>
            <div>
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(item)"
                v-hasPermi="['tool:aduitStream:flow-list:editSubNode']"
              >修改</el-button>
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="doAuthorUser(item)"
                v-hasPermi="['tool:aduitStream:flow-list:disSubNodeUser']"
              >分配工作流用户</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(item)"
                v-hasPermi="['tool:aduitStream:flow-list:removeSubNode']"
              >删除</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <el-card :style="flowNodeList.length ? 'margin-left: 70px' : ''">
      <el-button type="primary" icon="el-icon-plus" @click="addFlowStream()" v-hasPermi="['tool:aduitStream:flow-list:addSubNode']">添加新子节点</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-card>
    <addFlowNodeDialog :visible.sync="createVisible" :flowNodeInfo="flowNodeInfo" @refreshList="getFlowNodeListFn"></addFlowNodeDialog>
    <distribFlowNodeUserDailog :visible.sync="distribFlowNodeUserVisible" :flowNodeInfo="flowNodeInfo" @refreshList="getFlowNodeListFn"></distribFlowNodeUserDailog>
  </div>
</template>

<script>
import { getFlowNodeList, deleteFlowNode, getAuthorUserList, authorNodeUser, deleteNodeUser } from '@/api/tool/aduitStream'
import addFlowNodeDialog from './add-flow-node-dialog';
import distribFlowNodeUserDailog from './distrib-flow-node-user-dailog';
export default {
  components: {
    addFlowNodeDialog,
    distribFlowNodeUserDailog,
  },
  data() {
    return {
      createVisible: false, // 创建子节点
      distribFlowNodeUserVisible: false, // 分配用户弹窗控制
      flowCode: undefined, // 工作流code

      flowNodeList: [], // 审核流数据
      flowNodeInfo: {}, // 修改时节点基础信息

    };
  },
  created() {
    this.flowCode = this.$route.query.flowCode;
    this.flowCode && this.init();
  },
  methods: {
    init() {
      this.initAssetData();
      this.initRemoteData();
    },
    initAssetData() {},
    initRemoteData() {
      this.getFlowNodeListFn();
    },
    
    // 获取审核流数据
    async getFlowNodeListFn() {
      const params = {
        flowCode: this.flowCode,
      }
      getFlowNodeList(params).then(res => {
        this.flowNodeList = res.data || [];
      });
    },
    // 添加工作流子节点
    addFlowStream() {
      this.flowNodeInfo = {
        flowCode: this.flowCode,
        nodeCode: undefined, // 节点编号
        nodeName: undefined, // 节点名称
        sort: undefined, // 节点排序
      };
      this.createVisible = true;
    },

    // 修改工作流子节点
    handleUpdate(item) {
      this.flowNodeInfo = {
        flowCode: this.flowCode,
        ...item,
      };
      this.createVisible = true;
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const { nodeCode, nodeName } = row;
      this.$confirm('是否确认删除子节点为"' + nodeName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const params = {
            flowCode: this.flowCode,
            nodeCode,
          };
          return deleteFlowNode(params);
        }).then(() => {
          this.getFlowNodeListFn();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

    doAuthorUser(item) {
      this.flowNodeInfo = {
        flowCode: this.flowCode,
        ...item,
      };
      this.distribFlowNodeUserVisible = true;
    }
  }
}
</script>