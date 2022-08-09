<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select size="mini" v-model="currentYear">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="`${item}年`"
          :value="item"
        ></el-option>
      </el-select>
      <el-select size="mini" v-model="currentMonth" style="margin-left: 20px">
        <el-option
          v-for="i in 12"
          :key="i"
          :label="`${i}月`"
          :value="i"
        ></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="value"> </el-calendar>
  </div>
</template>

<script>
export default {
  name: "workCalender",
  props: {
    currentDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      //   value: new Date(),
      currentMonth: null,
      currentYear: null,
      yearList: [],
    };
  },
  computed: {
    // value(){
    //     return new Date(this.currentYear,this.currentMonth-1)
    // }
    value: {
      get() {
        return new Date(this.currentYear, this.currentMonth - 1);
      },
      set(value) {
        this.currentYear = value.getFullYear();
        this.currentMonth = value.getMonth() - 1;
      },
    },
  },
  created() {
    this.currentMonth = this.currentDate.getMonth() - 1;
    this.currentYear = this.currentDate.getFullYear();
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5;
    });
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-calendar__header {
  display: none;
}
</style>
