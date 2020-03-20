    <template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="selectDep"
                     clearable
                     @clear="getUserList"
                     @change="getUserList"
                     placeholder="部门划分">
            <el-option v-for="item in deptData"
                       :key="item.code"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     @click="importVisible = true">批量导入</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     @click="batchDelete"
                     :disabled="batchDeleteArr.length === 0">批量删除</el-button>
        </el-col>
        <el-col :span="5"
                :offset="10">
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
                         prop="departmentName"
                         sortable></el-table-column>
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
            <!-- 分配角色按钮 -->
            <el-button type="text"
                       size="mini"
                       @click="setRole(scope.row.id)">分配角色</el-button>
            <el-button type="text"
                       size="mini"
                       @click="userInfoPdf(scope.row.id)">打印</el-button>
            <!-- 删除按钮 -->
            <el-button type="text"
                       size="mini"
                       @click="removeUserById(scope.row.id)">删除</el-button>
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

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户"
                 :visible.sync="addDialogVisible"
                 width="70%"
                 @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-width="10%">
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="用户名称"
                        prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="部门"
                        prop="departmentName">
            <el-select v-model="addForm.departmentName"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in deptData"
                         :key="item.code"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加入时间"
                        prop="timeOfEntry">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="addForm.timeOfEntry"
                            style="width: 30%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="学号"
                        prop="studentId">
            <el-input v-model="addForm.studentId"></el-input>
          </el-form-item>
          <el-form-item label="系别"
                        prop="system">
            <el-select v-model="addForm.system"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in systemData"
                         :key="item.id"
                         :label="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="用户详情"
                 :visible.sync="editDialogVisible"
                 width="70%"
                 @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm"
                 :rules="addFormRules"
                 ref="editFormRef"
                 label-width="10%">
          <el-form-item label="员工照片">
            <div>
              <RegShopImg :imgs='editForm.staffPhoto'
                          :uid='editForm.id'
                          ref="staffPhoto"></RegShopImg>
            </div>
            <span style="vertical-align: bottom;color:gray">图片格式为 JPG/JPEG/PNG/PDF 大小在2MB内</span>
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
            <el-select v-model="editForm.departmentName"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in deptData"
                         :key="item.code"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
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
            <el-select v-model="editForm.system"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in systemData"
                         :key="item.id"
                         :label="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editUser(editForm.id)">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="分配角色"
                 :visible.sync="roleFormVisible"
                 @close="roleDialogClosed">
        <el-form :model="formBase"
                 label-position="left"
                 label-width="120px"
                 style='margin-left:120px; width:500px;'>
          <el-checkbox-group v-model="checkedRoles">
            <el-checkbox v-for="(item,index) in roles"
                         :label="item.id"
                         :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="primary"
                     @click="saveRoleInfo">提交</el-button>
          <el-button @click="roleFormVisible=false">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="导入成员"
                 :visible.sync="importVisible"
                 width="26.5%">
        <component v-bind:is="importCompon"
                   ref="import"
                   :baseData='baseData'>
        </component>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Common from '../../assets/Common'
import importCompon from './import'
import RegShopImg from './imgUpload'
export default {
  components: {
    importCompon,
    RegShopImg
  },
  data () {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    // 验证学号的规则
    var checkStudyId = (rule, value, cb) => {
      // 验证学号的正则表达式
      const regStudyId = /^[1-9][0-9]{9}$/

      if (regStudyId.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的学号'))
    }
    return {
      batchDeleteArr: [],
      selectDep: '',
      baseData: {
        upUrl: 'http://127.0.0.1:9002/sys/user/import',
        fileUrl: 'http://127.0.0.1:9002/sys/download'
      },
      importCompon: 'importCompon',
      importVisible: false,
      id: null,
      roleFormVisible: false,
      formBase: {},
      checkedRoles: [],
      roles: [],
      editForm: {},
      editDialogVisible: false,
      systemData: Common.system,
      query: '',
      // 当前的页数
      page: 1,
      // 当前每页显示多少条数据
      pagesize: 10,
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        mobile: '',
        username: '',
        departmentName: '',
        timeOfEntry: '',
        studentId: '',
        system: ''
      },
      deptData: [],
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择加入时间', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { validator: checkStudyId, trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请输入系别', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
    this.loadDepts()
  },
  methods: {
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
    roleDialogClosed () {
      this.id = null
      this.checkedRoles = null
      this.roles = null
    },
    async saveRoleInfo () {
      const { data: res } = await this.$http.put('http://127.0.0.1:9002/sys/user/assignRoles', { id: this.id, roleIds: this.checkedRoles })
      if (res.code !== 10000) return this.$message.error(res.message)
      this.$message.success('分配角色成功')
      this.roleFormVisible = false
    },
    async setRole (id) {
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/user/' + id)
      if (res.code !== 10000) return this.$message.error(res.message)
      this.checkedRoles = res.data.roleIds
      const { data: res2 } = await this.$http.get('http://127.0.0.1:9002/sys/role/list')
      if (res2.code !== 10000) return this.$message.error(res2.message)
      this.id = id
      this.roles = res2.data
      this.roleFormVisible = true
    },
    // 根据Id删除对应的用户信息
    async removeUserById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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

      const { data: res } = await this.$http.delete('http://127.0.0.1:9002/sys/user/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    userInfoPdf (id) {
      location.href = 'http://127.0.0.1:9002/sys/user/' + id + '/pdf'
    },
    async editUser (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put('http://127.0.0.1:9002/sys/user/' + id, this.editForm)
        if (res.code !== 10000) return this.$message.error(res.message)

        this.$message.success('修改用户成功！')
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
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
    async loadDepts () {
      const { data: res } = await this.$http.get('http://localhost:9001/community/department')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.deptData = res.data.depts
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('http://127.0.0.1:9002/sys/user', this.addForm)
        if (res.code !== 10000) return this.$message.error(res.message)

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
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
      const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/user?page=' + this.page + '&' + 'pagesize=' + this.pagesize, { params: { query: this.query, selectDep: this.selectDep } }
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
