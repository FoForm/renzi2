<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="filelist"
      :limit="1"
      :class="{ completed: isComputed }"
      :on-change="changeOn"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percentage" ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKIDzVmna7OPBi03oJ6dw3uVptiIc6YmkaCZ",
  SecretKey: "DB2fARWO4WlqkW6TegV7ZpsgFahapwNZ",
});
export default {
  name: "ImageUpload",
  data() {
    return {
      showPercent:false,// 控制图片的显示或者隐藏
      percentage:0,
      dialogImageUrl: "",
      dialogVisible: false,
      filelist: [
        {
          url: "https://img1.baidu.com/it/u=2003496092,3295249130&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313",
        },
      ],
    };
  },
  computed: {
    isComputed() {
      return this.filelist.length === 1;
    },
  },
  methods: {
    changeOn(file, filelist) {
      this.filelist = filelist;
    },
    handleRemove(file, filelist) {
      // this.filelist = this.filelist.filter(item=>item.uid!==file.uid)
      this.filelist = filelist;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      // console.log(file);
      if (!types.includes(file.type)) {
        this.$message.error("文件类型错误");
        return false;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("文件太大");
        return false;
      }
      this.showPercent = true
      // return true
    },
    // 进行上传操作
    upload({ file }) {
      //   console.log(params.file)
      if (file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "ren-1313213531", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: file.name, // 文件名
            Body: file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            onProgress: ({ percent }) => {
              this.percentage = percent * 100;
            },
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            // console.log(err || data);
            console.log(data);
            if (err) {
              return this.$message.error(err?.message || "上传出错");
            }
            this.filelist.forEach((item) => {
              if (item.uid === file.uid) {
                item.url = `http://${data.Location}`;
                item.upload = true;
              }
            });
            setTimeout(() => {
              this.showPercent=false
              this.percentage=0
            }, 1500);
          }
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .completed {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
