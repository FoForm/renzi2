<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-trre">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <Temp :treeNode="company" :isroot="true" @addDepts="addDepts" />
      </el-card>
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <template v-slot="{ data }" style="width: 100%">
          <Temp
            :treeNode="data"
            :isroot="false"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @addDate="addDate"
          />
        </template>
      </el-tree>
    </div>
    <AddDept
      ref="addDeptList"
      :showDialog.sync="showDialog"
      :node="node"
      @getDepartments="getDepartments"
    />
  </div>
</template>

<script>
import Temp from "./temp/index.vue";
import AddDept from "./components/add-dept.vue";
import { getDepartments } from "@/api/departments";
import { transList } from "@/utils";
export default {
  components: {
    Temp,
    AddDept,
  },
  data() {
    return {
      loading: false,
      node: {},
      showDialog: false,
      defaultProps: {
        label: "name",
      },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: {
        name: "江苏传智播客教育科技股份有限公司",
        manager: "负责人",
        id: "",
      },
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      this.loading = true;
      try {
        const res = await getDepartments();
        //   console.log(res);
        this.company = {
          name: res.companyName,
          manager: res.companyManage || "管理员",
          id: "",
        };
        this.departs = transList(res.depts, "");
        // console.log(res.depts);
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    // 添加
    addDepts(node) {
      this.showDialog = true;
      this.node = node;
    },
    // 编辑
    addDate(node) {
      this.showDialog = true;
      this.node = node;
      this.$refs.addDeptList.getDepartDetail(node.id);
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.app-trre {
  border: 1px solid #000;
}
.tree-card {
  font-size: 14px;
  width: 900px;
  background-color: #99ccff;
}
.row-bg {
  padding: 0;
}
</style>
