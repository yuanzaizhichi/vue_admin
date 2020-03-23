<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8"></el-col>
      <el-col :span="4">
        <el-button type="primary"
                   @click="addDialogVisible = true">添加类型</el-button>
      </el-col>
    </el-row>
    <el-table :data="comTypes"
              border
              stripe
              style="width: 100%">
      <el-table-column type="index"
                       label="#"></el-table-column>
      <el-table-column prop="name"
                       label="类型名称">
      </el-table-column>
      <el-table-column prop="description"
                       label="类型描述">
      </el-table-column>
      <el-table-column label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="text"
                     size="small"
                     @click="removeComTypeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加类型"
               :visible.sync="addDialogVisible"
               width="70%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="10%">
        <el-form-item label="类型名称"
                      prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型描述"
                      prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addComType">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改类型"
               :visible.sync="editDialogVisible"
               width="70%"
               @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editFormRef"
               label-width="10%">
        <el-form-item label="类型名称"
                      prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型描述"
                      prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editComTypeInfo(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false,
      addForm: {
        name: '',
        description: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '部门名称的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      comTypes: [],
      editDialogVisible: false,
      editForm: {}
    }
  },
  methods: {
    async getComTypeList () {
      const { data: res } = await this.$http.get('http://localhost:9001/community/type')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.comTypes = res.data
      console.log(res)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addComType () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:9001/community/type', this.addForm)
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success('添加类型成功！')
        this.addDialogVisible = false
        this.getComTypeList()
      })
    },
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('http://localhost:9001/community/type/' + id)

      if (res.code !== 10000) {
        return this.$message.error('查询类型信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editComTypeInfo (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('http://localhost:9001/community/type/' + id, this.editForm)
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success('修改类型成功！')
        this.editDialogVisible = false
        this.getComTypeList()
      })
    },
    async removeComTypeById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该类型, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('http://localhost:9001/community/type/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除类型成功！')
      this.getComTypeList()
    }
  },
  created: function () {
    this.getComTypeList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
