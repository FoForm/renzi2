<template>
  <el-dialog @close="close" title="分配角色" :visible="showRoleDialog">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  name: "AssignRole",
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: [],
      roleIds: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    close() {
      this.$emit("update:showRoleDialog", false);
    },
    async getRoleList() {
      const res = await getRoleList();
      this.list = res.rows;
      console.log(this.list);
    },
    // 获取用户当前角色
    async getUserDetailById(id) {
      const res = await getUserDetailById(id);
      // console.log(res);
      this.roleIds = res.roleIds;
    },
    async btnOK() {
      try {
        await assignRoles({
          id: this.userId,
          roleId: this.roleIds,
        });
        this.$message.success("成功");
        this.close()
      } catch (error) {
        this.$message.error("失败");
        this.close()
      }
    },
  },
};
</script>
