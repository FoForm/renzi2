<template>
  <el-dialog :title="showDate" :visible="showDialog" @close="close">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          v-model="formData.name"
          placeholder="请输入部门名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          v-model="formData.code"
          placeholder="请输入部门编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          v-model="formData.manager"
          placeholder="请选择负责人"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          type="textarea"
          v-model="formData.introduce"
          placeholder="请输入部门介绍"
        ></el-input>
      </el-form-item>
    </el-form>
    <template>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="btn">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  name: "AddDept",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // rule  规则
    // value 是我输入的内容
    // callback  回调
    const checkName = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      console.log(depts);
      //   const current = depts.filter((item) => item.pid === this.node.id);
      let currentChildern = null;
      //   判断是新增  和  编辑
      if (this.formData.id) {
        // 编辑
        currentChildern = depts.filter((item) => {
          return item.pid === this.node.pid && item.id !== this.node.id;
        });
      } else {
        // 新增
        currentChildern = depts.filter((item) => item.pid === this.node.id);
      }
      const isRepeat = currentChildern.some((item) => item.name === value);
      if (isRepeat) {
        return Promise.reject("部门名称重复");
      }
    };
    // 部门编码
    const checkCode = async (rule, value) => {
      const { depts } = await getDepartments();
      let isRepeat = null;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.code === value && item.id !== this.node.id
        );
      } else {
        isRepeat = depts.some((item) => item.code === value);
      }

      if (isRepeat) {
        return Promise.reject("部门编码重复");
      }
    };
    return {
      options: [],
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门负责人
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门名称1-50", trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门编码1-50", trigger: "blur" },
          { validator: checkCode, trigger: "blur" },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          { min: 1, max: 300, message: "部门介绍1-300", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    showDate() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple();
    },
    // 提交
    async btn() {
      // console.log(this.$refs.form);
      await this.$refs.form.validate();

      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.node.id,
        });
      }
      this.$message.success(`${this.showDate}` + "成功");
      this.$emit("getDepartments");
      this.close();
    },
    close() {
      // 关弹层
      this.$emit("update:showDialog", false);
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      // 表单重置
      this.$refs.form.resetFields();
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
};
</script>

<style></style>
