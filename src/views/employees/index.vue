<template>
  <div class="dashboard-container">
    <ToolBar>
      <template #before>
        <span>1000</span>
      </template>
      <template #after>
        <el-button size="mini" type="primary" @click="DaoRu">导入</el-button>
        <el-button size="mini" type="danger" @click="DaoChu">导出</el-button>
        <el-button size="mini" type="warning" @click="showDialog = true"
          >新增员工</el-button
        >
      </template>
    </ToolBar>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="username" label="姓名" width="100" />
        <el-table-column label="头像" width="150">
          <template v-slot="{ row }">
            <el-avatar
              @click.native="showQrCode(row.staffPhoto)"
              style="width: 80px; height: 80px"
              :src="row.staffPhoto"
            >
              <img src="@/assets/common/bigUserHeader.png" alt="" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" width="100" />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          width="100"
          :formatter="formatEmployment"
        />
        <el-table-column prop="departmentName" label="部门名称" width="100" />
        <el-table-column label="入职时间" width="100">
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" width="100">
          <template>
            <el-switch v-model="value2" disabled> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="{ row }">
            <!-- slot-scope="scope" -->
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
            >
              查看
            </el-button>
            <el-button type="text" size="small"> 转正 </el-button>
            <el-button type="text" size="small"> 调岗 </el-button>
            <el-button type="text" size="small"> 离职 </el-button>
            <el-button type="text" size="small" @click="juese(row.id)">
              角色
            </el-button>
            <el-button :disabled="checkPermission('DELETE_USERS')" type="text" size="small" @click="shanchu(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page.sync="page.page"
          :total="page.total"
          @current-change="changeCuuent"
        />
      </el-row>
    </div>
    <AddEmployee :showDialog.sync="showDialog" />
    <el-dialog title="二维码" center :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="canvas" />
      </el-row>
    </el-dialog>
    <AssignRole
      :userId="userId"
      ref="assignRole"
      :showRoleDialog.sync="showRoleDialog"
    />
  </div>
</template>

<script>
import AssignRole from "@/views/employees/components/assign-role.vue";
import qrCode from "qrcode";
import { formatDate } from "@/filters";
import EmployeeEnum from "@/api/constant/employees";
import { delEmployee, getEmployeeList, importEmployee } from "@/api/employees";
import AddEmployee from "@/views/employees/components/add-employee.vue";
import {mixins} from '@/utils/mixins'
export default {
  components: {
    AddEmployee,
    AssignRole,
  },
  mixins:[mixins],
  data() {
    return {
      userId:null,
      showRoleDialog: false,
      showCodeDialog: false,
      value2: false,
      showDialog: false,
      tableData: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 点击角色
    async juese(id) {
      this.userId=id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true;
    },
    async showQrCode(url) {
      console.log(url);
      this.showCodeDialog = true;
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.canvas, url);
      });
    },
    async getEmployeeList() {
      const res = await getEmployeeList(this.page);
      //  console.log(res.rows);
      this.page.total = res.total;
      this.tableData = res.rows;
    },
    changeCuuent() {
      // console.log(page);
      // this.page.page=page
      this.getEmployeeList();
    },
    formatEmployment(row, column, cellValue, index) {
      // console.log(cellValue);
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    // 删除
    async shanchu(id) {
      try {
        await this.$confirm("删除该员工吗");
        await delEmployee(id);
        if (this.tableData.length === 1 && this.page.page > 1) {
          this.page.page--;
        }
        this.getEmployeeList();
        this.$message.success("删除员工成功");
      } catch (e) {
        console.log(e);
      }
    },
    // 导入
    DaoRu() {
      this.$router.push("/import");
    },
    // 导出
    async DaoChu() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      console.log(rows);
      const resData = this.fromJson(rows, headers);
      const { export_json_to_excel } = await import(
        /* webpackChunkName:'Export2Excel'*/ "@/utils/Export2Excel"
      );
      export_json_to_excel({
        header: Object.keys(headers), //表头 必填
        data: resData, // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    fromJson(rows, headers) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (["correctionTime", "timeOfEntry"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeeEnum.hireType.find(
                (child) => +child.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          return item[headers[key]];
        });
      });
    },
  },
};
</script>

<style></style>
