<template>
  <el-row type="flex" class="row-bg" style="width: 100%">
    <el-col :span="16"
      ><div>{{ treeNode.name }}</div></el-col
    >
    <el-col :span="8">
      <el-row type="flex" class="row-bg">
        <el-col
          ><span>{{ treeNode.manager }}</span></el-col
        >
        <el-col>
          <el-dropdown @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="!isroot"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item command="del" v-if="!isroot"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isroot: {
      type: Boolean,
    },
  },
  methods: {
    async clickItem(type) {
      // console.log(type);
      if (type === "add") {
        console.log("添加");
        this.$emit('addDepts',this.treeNode)
      } else if (type === "edit") {
        console.log("编辑");
        this.$emit('addDate',this.treeNode)
      } else {
        await this.$confirm("删除");
        await delDepartments(this.treeNode.id);
        this.$emit("delDepts"); // 触发自定义事件
        this.$message.success("删除部门成功");
      }
    },
  },
};
</script>

<style></style>
