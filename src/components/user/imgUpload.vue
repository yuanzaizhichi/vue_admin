<template>
  <div>
    <el-upload :action="'http://127.0.0.1:9002/sys/user/upload/'+uid"
               class="avatar-uploader"
               :headers="myheader"
               :show-file-list="false"
               :before-upload="beforeUpload"
               :on-success="uploadSuccess">
      <img v-if="imgs"
           :src="imgs"
           class="avatar"
           ref="imgRef">
      <i v-else
         class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>

</template>

<script >
export default {
  data: function () {
    return {
    }
  },
  props: ['imgs', 'uid'],
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
    beforeUpload (file) {
      if (file.size < 2097152) {
        var fileName = file.name
        var suffix = fileName
          .substring(fileName.lastIndexOf('.') + 1)
          .toUpperCase()
        if (
          suffix === 'PDF' ||
          suffix === 'JPG' ||
          suffix === 'JPEG' ||
          suffix === 'PNG' ||
          suffix === 'GIF'
        ) {
          return true
        } else {
          this.$message.error('文件类型不正确,请重新上传')
          return false
        }
      } else {
        this.$message.error('文件大小超过2M,请重新上传')
        return false
      }
    },
    uploadSuccess (obj, file) {
      if (obj.code === 10000) {
        this.$refs.imgRef.src = obj.data
        this.$message.success('上传成功' + '!')
      } else {
        this.$message.error('上传失败' + '!')
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
