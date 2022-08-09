<template>
  <div>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-plus"
            @click="showDialog = true"
            >新增角色</el-button
          >
          <el-table :data="list" style="width: 100%">
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="mini"
                  @click="assignPerm(scope.row.id)"
                  >分配权限</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteRole(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="flex">
            <el-pagination
              background
              :page-size="page.pagesize"
              :current-page="page.page"
              layout="prev, pager, next"
              :total="page.total"
              @current-change="changeCurrent"
            >
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="公司设置" name="second">
          <el-alert title="消息提示的文案" type="info" show-icon> </el-alert>
          <el-form disabled label-width="200px" style="margin-top: 20px">
            <el-form-item label="公司名称" style="width: 50%">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" style="width: 50%">
              <el-input v-model="formData.companyAddress"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" style="width: 50%">
              <el-input v-model="formData.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注" style="width: 50%">
              <el-input type="textarea" v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="`${this.roleForm.id ? '编辑角色' : '新增角色'}`"
      :visible="showDialog"
      @close="close"
    >
      <el-form :model="roleForm" :rules="rules" label-width="100px" ref="form">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btn">确定</el-button>
      </template>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="closes">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="props"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="closes">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, assignPerm } from "@/api/setting";
import { addRole, getRoleDetail, updateRole } from "@/api/employees";
import { getPermissionList } from '@/api/permisson';
import { transList } from '@/utils';
export default {
  data() {
    return {
       showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      props: {
        label: 'name'
      },
       permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null ,// 用来记录分配角色的id
      showPermDialog: false,
      showDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        description: [{}],
      },
      formData: [],
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0, // 记录总数
      },
      activeName: "first",
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    // 分配权限提交
    async btnPermOK(){
      const res = this.$refs.permTree.getCheckedKeys()
      // console.log(res);
      await assignPerm({
        permIds:res,
        id:this.roleId
      })
      this.$message.success('分配权限成功')
      this.closes()
    },
    // 分配权限
    async assignPerm(id) {
      // console.log(id);
      this.permData =transList(await getPermissionList(),'0')
      this.roleId=id
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true;
    },
    closes() {
      this.showPermDialog = false;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async getRoleList() {
      const res = await getRoleList(this.page);
      // console.log(res);
      this.list = res.rows;
      this.page.total = res.total;
    },
    changeCurrent(page) {
      this.page.page = page;
      // console.log(page);
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId);
      // console.log(this.formData);
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除该角色吗");
        // 只有点击了确定 才能进入到下方
        await deleteRole(id); // 调用删除接口
        const len = this.list.length;
        if (len === 1 && this.page.page > 1) {
          this.page.page--;
        }
        this.getRoleList(); // 重新加载数据
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    async handleEdit(id) {
      this.showDialog = true;
      this.roleForm = await getRoleDetail(id);
    },
    // 关闭弹层
    close() {
      this.showDialog = false;
      this.getRoleList();
      this.roleForm = {};
    },
    async btn() {
      this.$refs.form.validate();
      if (this.roleForm.id) {
        await updateRole(this.roleForm);
      } else {
        await addRole(this.roleForm);
      }

      this.$message.success("成功");
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 30px;
  .flex {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
