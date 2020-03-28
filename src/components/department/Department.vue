<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组织架构</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"></el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true"
                     v-if="show('POINT-DEP-ADD')">添加部门</el-button>
        </el-col>
      </el-row>
      <el-table :data="depts"
                border
                stripe
                style="width: 100%">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="name"
                         label="部门名称">
        </el-table-column>
        <el-table-column prop="code"
                         label="部门编码">
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template></el-table-column>
        <el-table-column prop="manager"
                         label="部门负责人">
        </el-table-column>
        <el-table-column prop="introduce"
                         label="介绍">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click="showEditDialog(scope.row.id)"
                       v-if="show('POINT-DEP-UPDATE')">编辑</el-button>
            <el-button type="text"
                       size="small"
                       @click="removeDeptById(scope.row.id)"
                       v-if="show('POINT-DEP-DELETE')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加部门"
               :visible.sync="addDialogVisible"
               width="70%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="10%">
        <el-form-item label="部门名称"
                      prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编号"
                      prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="部门类别"
                      prop="category">
          <el-input v-model="addForm.category"></el-input>
        </el-form-item>
        <el-form-item label="介绍"
                      prop="introduce">
          <el-input v-model="addForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人"
                      prop="manager">
          <el-input v-model="addForm.manager"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addDept">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改部门"
               :visible.sync="editDialogVisible"
               width="70%"
               @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editFormRef"
               label-width="10%">
        <el-form-item label="部门名称"
                      prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门类别"
                      prop="category">
          <el-input v-model="editForm.category"></el-input>
        </el-form-item>
        <el-form-item label="介绍"
                      prop="introduce">
          <el-input v-model="editForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人"
                      prop="manager">
          <el-input v-model="editForm.manager"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDeptInfo(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../../utils'
export default {
  data () {
    return {
      addDialogVisible: false,
      addForm: {
        name: '',
        code: '',
        category: '',
        introduce: '',
        manager: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '部门名称的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入部门编号', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '部门编号的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      departData: {},
      depts: [],
      editDialogVisible: false,
      editForm: {}
    }
  },
  methods: {
    show (name) {
      return utils.hasPermissionPoint(name)
    },
    async getDepList () {
      const { data: res } = await this.$http.get('http://localhost:9001/community/department')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.departData = res.data
      this.depts = res.data.depts
      console.log(res)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addDept () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:9001/community/department', this.addForm)
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success('添加部门成功！')
        this.addDialogVisible = false
        this.getDepList()
      })
    },
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('http://localhost:9001/community/department/' + id)

      if (res.code !== 10000) {
        return this.$message.error('查询部门信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editDeptInfo (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('http://localhost:9001/community/department/' + id, this.editForm)
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success('修改部门成功！')
        this.editDialogVisible = false
        this.getDepList()
      })
    },
    async removeDeptById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该部门, 是否继续?',
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

      const { data: res } = await this.$http.delete('http://localhost:9001/community/department/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除部门成功！')
      this.getDepList()
    }
  },
  created: function () {
    this.getDepList()
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
