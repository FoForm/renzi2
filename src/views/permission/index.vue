<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button type="primary" size="small" @click="btn('0', 1)"
            >添加权限
          </el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" v-if="row.type === 1" @click="btn(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${this.showText}权限`" :visible="showDialog" @close="close">
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from "@/api/permisson";
import { transList } from "@/utils";
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  computed: {
        showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    // 编辑
    async editPermission(id){
      this.formData=await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除
    async delPermission(id){
      // console.log(id);
      await this.$confirm('确定删除?')
      await delPermission(id)
      await this.getPermissionList()
      this.$message.success('删除成功')
    },
    async getPermissionList() {
      const res = await getPermissionList();
      // console.log(res);
      this.list = transList(res, "0");
    },
    // 添加
    btn(pid, type) {
      this.showDialog = true;
      this.formData.pid = pid;
      this.formData.type = type;
    },
    // 取消
    close() {
      this.$refs.perForm.resetFields()
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.showDialog = false;
    },
    // form 确定
    async btnOK() {
      await this.$refs.perForm.validate();
      try {
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData);
        } else {
          // 添加
          await addPermission(this.formData);
        }
        this.$message.success(this.showText+'成功')
        this.close();
        await this.getPermissionList();
      } catch (error) {
        console.log(error);
        this.$message.error("添加失败");
      }
    },
  },
};
</script>

<style></style>
