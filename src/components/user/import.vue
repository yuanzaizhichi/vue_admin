<template>
  <div>
    <el-upload drag
               :action="baseData.upUrl"
               :headers="myheader"
               :before-upload="beforeUpload"
               :on-error="uploadFail"
               :on-success="handleFileSuccess"
               :show-file-list="false"
               :file-list="fileList"
               :modal-append-to-body='false'
               :disabled="processing">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip"
           slot="tip">只能上传XLS/XLSX文件，且不超过10MB</div>
      <div slot="tip"
           class="el-upload__tip">
        (推荐<span class="colRed pointer"><a :href="baseData.fileUrl">下载模板文件</a></span>，填写后上传)
        <el-button type="text"
                   size="mini"
                   @click="handleUpload">点击查看文件上传详细要求</el-button>
      </div>
    </el-upload>
    <el-dialog title="文件上传要求"
               :visible.sync="centerDialogVisible"
               width="30%"
               center
               :modal-append-to-body='false'>
      <div class="upInfoTip">
        <p><strong>重要提示：</strong></p>
        <p>支持WPS、excel2003以上版本文件</p>
        <p>请将要上传的内容放在第一个sheet中</p>
        <p>请不要加密模板文件，将导致错误</p>
        <p>请不要上传带宏的文件，将导致错误</p>
        <p>请不要过多的使用格式，如背景色和边框，将可能导致超时</p>
        <p>示例行的内容无需删除，将不会上传到系统中</p>
        <p><strong>格式说明：</strong></p>
        <p>手机号、学号:内容设置为文本格式</p>
        <p>部门编码：必须是系统里已存在的部门编码，否则会报错</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'import',
  props: ['baseData'],
  data () {
    return {
      resume: '',
      centerDialogVisible: false,
      fileList: [],
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      errorResults: [],
      positiveList: []
    }
  },
  computed: {
    myheader: function () {
      return {
        Authorization: 'Bearer ' + this.tokenStr()
      }
    }
  },
  methods: {
    tokenStr () {
      return window.sessionStorage.getItem('token')
    },
    // 业务方法
    // 下载模板
    download () {
      this.$emit('handleExport')
    },
    beforeUpload (file) {
      if (file.size < 10100000) {
        var fileName = file.name
        var suffix = fileName
          .substring(fileName.lastIndexOf('.') + 1)
          .toUpperCase()
        if (
          suffix === 'XLS' ||
          suffix === 'XLSX'
        ) {
          return true
        } else {
          this.$message.error('文件类型不正确,请重新上传')
          return false
        }
      } else {
        this.$message.error('文件大小超过10M,请重新上传')
        return false
      }
    },
    // 上传错误
    uploadFail (err, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.$message.error(err)
    },
    // 上传成功
    handleFileSuccess (obj, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.dialogImportVisible = false
      if (obj.code === 10000) {
        this.$message.success('导入成功' + '!')
      } else {
        this.$message.error(obj.message)
      }
    },
    // 查看上传文件要求
    handleUpload: function () {
      this.centerDialogVisible = true
    }
  }
}
</script>
<style>
.upInfoTip {
  line-height: 30px;
}
</style>
