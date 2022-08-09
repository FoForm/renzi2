<template>
  <el-card class="box">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form :model="formData" :rules="rules" ref="form">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width: 40%"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input
              v-model="formData.password2"
              style="width: 40%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btn">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
         <component :is="userComponent" />
      </el-tab-pane>
      <el-tab-pane label="岗位详情">
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import userComponent from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
    components:{
        userComponent,JobInfo
    },
  data() {
    return {
        userComponent:'userComponent',
        JobInfo:'JobInfo',
      formData: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {min:6,max:16,message: "密码6-16位",trigger: "blur" }
        ],
      },
    };
  },
  created() {
    console.log(this.$route.params.id);
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id);
      // console.log(res);
      this.formData = res;
    },
    async btn() {
      await this.$refs.form.validate();
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password,
        });
        this.$message.success('更新成功')
      } catch (error) {
        this.$message.error(message||'更新成功')
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  margin: 20px;
}
</style>
