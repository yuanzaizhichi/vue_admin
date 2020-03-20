<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList"
                border
                stripe
                style="width: 100%">
        <el-table-column prop="name"
                         label="角色名称">
        </el-table-column>
        <el-table-column prop="description"
                         label="描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="text"
                       size="small"
                       @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="text"
                       size="small"
                       @click="handlerPerm(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next"
                     :total="total">
      </el-pagination>

      <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色"
                 :visible.sync="addDialogVisible"
                 width="70%"
                 @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-width="15%">
          <el-form-item label="角色名称"
                        prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色的对话框 -->
      <el-dialog title="修改用户"
                 :visible.sync="editDialogVisible"
                 width="70%"
                 @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm"
                 :rules="addFormRules"
                 ref="editFormRef"
                 label-width="15%">
          <el-form-item label="角色名称"
                        prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editRoleInfo(editForm.id)">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="'为【'+formData.name+'】分配权限'"
                 :visible.sync="permFormVisible"
                 style="hight:100px;line-height:1px">
        <el-tree :data="treeData"
                 default-expand-all
                 show-checkbox
                 node-key="id"
                 ref="tree"
                 :check-strictly="true"
                 :default-checked-keys="checkNodes"
                 :props="{label:'name'}">
        </el-tree>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="permFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="assignPrem">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Utils from '../../utils'
export default {
  data () {
    return {
      formData: {},
      treeData: [],
      checkNodes: [],
      permFormVisible: false,
      // 角色列表
      rolesList: [],
      page: 1,
      pagesize: 5,
      total: 0,
      addDialogVisible: false,
      addForm: {
        name: '',
        description: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    // 获取所有的角色
    this.getRolesList()
  },
  methods: {
    async assignPrem () {
      console.log(this.formData.id)
      console.log(this.$refs.tree.getCheckedKeys())
      const { data: res } = await this.$http.put('http://127.0.0.1:9002/sys/role/assignPrem', {
        id: this.formData.id,
        permIds: this.$refs.tree.getCheckedKeys()
      }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.permFormVisible = false
    },
    async handlerPerm (obj) {
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/role/' + obj.id)
      console.log(res)
      this.formData = res.data
      this.checkNodes = res.data.permIds
      const { data: res2 } = await this.$http.get(
        'http://127.0.0.1:9002/sys/permission',
        { params: { type: 0, pid: null, enVisible: 1 } }
      )
      if (res2.code !== 10000) return this.$message.error(res2.message)
      this.treeData = Utils.transformTozTreeFormat(res2.data)
      console.log(this.treeData)
      this.permFormVisible = true
    },
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/role/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editRoleInfo (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('http://127.0.0.1:9002/sys/role/' + id, this.editForm)

        if (res.code !== 10000) return this.$message.error(res.message)

        this.editDialogVisible = false
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeRoleById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('http://127.0.0.1:9002/sys/role/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://127.0.0.1:9002/sys/role', this.addForm)

        if (res.code !== 10000) return this.$message.error(res.message)

        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.pagesize = newSize
      this.getRolesList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.page = newPage
      this.getRolesList()
    },
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/role?page=' + this.page + '&pagesize=' + this.pagesize)
      if (res.code !== 10000) return this.$message.error(res.message)
      this.rolesList = res.data.rows
      this.total = res.data.total
    }
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
  margin-bottom: 15px;
}

.toggle-button {
  cursor: pointer;
}
</style>
