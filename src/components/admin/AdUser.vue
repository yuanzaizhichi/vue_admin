<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select v-model="communityId"
                   clearable
                   @clear="getUserList"
                   @change="getUserList"
                   placeholder="组织划分">
          <el-option v-for="item in commData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary"
                   @click="batchDelete"
                   :disabled="batchDeleteArr.length === 0">批量删除</el-button>
      </el-col>
      <el-col :span="5"
              :offset="14">
        <el-input placeholder="搜索姓名"
                  v-model="query"
                  clearable
                  @clear="getUserList">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="getUserList"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <!-- 用户列表区域 -->
    <el-table :data="userlist"
              @selection-change="handleSelectionChange"
              border
              stripe>
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column label="姓名"
                       prop="username"></el-table-column>
      <el-table-column label="学号"
                       prop="studentId"></el-table-column>
      <el-table-column label="手机号码"
                       prop="mobile"></el-table-column>
      <el-table-column label="部门"
                       prop="departmentName"></el-table-column>
      <el-table-column label="审核状态"
                       prop="state">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enableState"
                     :active-value=1
                     :inactive-value=0
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="userStateChanged(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="200px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="text"
                     size="mini"
                     @click="showEditDialog(scope.row.id)">详情</el-button>
          <!-- 重设密码按钮 -->
          <el-button type="text"
                     size="mini"
                     @click="reSetPwd(scope.row.id)">密码重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page"
                   :page-sizes="[1, 2, 5, 10]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>

    <!-- 修改用户的对话框 -->
    <el-dialog title="用户详情"
               :visible.sync="editDialogVisible"
               width="70%"
               @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm"
               ref="editFormRef"
               disabled
               label-width="10%">
        <el-form-item label="员工照片">
          <img :src="editForm.staffPhoto"
               alt=""
               width="150px"
               height="150px">
        </el-form-item>
        <el-form-item label="手机号"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户名称"
                      prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="部门"
                      prop="departmentName">
          <el-input v-model="editForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="加入时间"
                      prop="timeOfEntry">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="editForm.timeOfEntry"
                          style="width: 30%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="学号"
                      prop="studentId">
          <el-input v-model="editForm.studentId"></el-input>
        </el-form-item>
        <el-form-item label="系别"
                      prop="system">
          <el-input v-model="editForm.system"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Common from '../../assets/Common'
export default {
  data () {
    return {
      commData: [],

      systemData: Common.system,
      editForm: {},
      editDialogVisible: false,
      batchDeleteArr: [],
      // 查询条件
      communityId: '',
      query: '',
      // 当前的页数
      page: 1,
      // 当前每页显示多少条数据
      pagesize: 10,
      userlist: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
    this.loadComm()
  },
  methods: {
    async reSetPwd (id) {
      const { data: res } = await this.$http.put('http://localhost:9002/sys/' + id + '/resetpwd')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.$message.success('重设密码成功！')
    },
    async loadComm () {
      const { data: res } = await this.$http.get('http://localhost:9001/community')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.commData = res.data
      console.log(this.commData)
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/user/' + id)
      if (res.code !== 10000) return this.$message.error(res.message)
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async deleteApi (idData) {
      console.log(idData)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除用户, 是否继续?',
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

      const { data: res } = await this.$http.post('http://127.0.0.1:9002/sys/user/del', idData)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 批量删除
    batchDelete () {
      const deleteData = this.batchDeleteArr.map(item => {
        const { id } = item
        return { id }
      })
      this.deleteApi(deleteData)
    },
    handleSelectionChange (val) {
      this.batchDeleteArr = val
    },
    // 监听 switch 开关状态的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put('http://localhost:9002/sys/user/' + userinfo.id, userinfo)
      if (res.code !== 10000) {
        userinfo.enableState = userinfo.enableState === 1 ? 0 : 1
        return this.$message.error(res.message)
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.page = newPage
      this.getUserList()
    },
    async getUserList () {
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/user?page=' + this.page + '&' + 'pagesize=' + this.pagesize, { params: { query: this.query, communityId: this.communityId } }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.userlist = res.data.rows
      this.total = res.data.total
      console.log(res)
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
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
