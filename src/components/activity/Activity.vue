    <template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="scale"
                     clearable
                     @clear="getActList"
                     @change="getActList"
                     placeholder="活动规模">
            <el-option v-for="item in scaleData"
                       :key="item.id"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="type"
                     clearable
                     @change="getActList"
                     @clear="getActList"
                     placeholder="活动类型">
            <el-option v-for="item in actTypeData"
                       :key="item.id"
                       :label="item.type"
                       :value="item.type">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="state"
                     clearable
                     @change="getActList"
                     @clear="getActList"
                     placeholder="是否开展">
            <el-option v-for="item in stateDate"
                       :key="item.id"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="score"
                     clearable
                     @change="getActList"
                     @clear="getActList"
                     placeholder="评分">
            <el-option v-for="item in scoreDate"
                       :key="item.id"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加活动</el-button>
        </el-col>
        <el-col :span="5"
                :offset="5">
          <el-input placeholder="活动名称"
                    v-model="query"
                    clearable
                    @clear="getActList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getActList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="actlist"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="活动名称"
                         prop="name"></el-table-column>
        <el-table-column label="活动地点"
                         prop="place"></el-table-column>
        <el-table-column label="活动规模"
                         prop="scale"></el-table-column>
        <el-table-column label="举行时间"
                         prop="startTime"></el-table-column>
        <el-table-column label="社联评分"
                         prop="score">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score"
                     v-if="scope.row.state === 1 && scope.row.score !== null"
                     show-text
                     disabled
                     text-color="#ff9900">
            </el-rate>
            <span v-else-if="scope.row.state === 0 && scope.row.score === null">活动未结束</span>
            <span v-else>暂无评分</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="text"
                       size="mini"
                       @click="showEditDialog(scope.row.id)">详情</el-button>
            <el-button v-if="scope.row.state === 0"
                       type="text"
                       size="mini"
                       @click="endActById(scope.row.id)">结束活动</el-button>
            <!-- 删除按钮 -->
            <el-button v-if="scope.row.state === 0"
                       type="text"
                       size="mini"
                       @click="removeActById(scope.row.id)">删除</el-button>
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

      <!-- 添加活动的对话框 -->
      <el-dialog title="添加活动"
                 :visible.sync="addDialogVisible"
                 width="50%"
                 @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-width="70px">
          <el-form-item label="活动名称"
                        prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动地点"
                        prop="place">
            <el-input v-model="addForm.place"></el-input>
          </el-form-item>
          <el-form-item label="活动规模"
                        prop="scale">
            <el-select v-model="addForm.scale"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in scaleData"
                         :key="item.id"
                         :label="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="举行时间"
                        prop="startTime">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="addForm.startTime"
                            style="width: 30%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动介绍"
                        prop="introduce">
            <el-input v-model="addForm.introduce"
                      type="textarea"
                      :rows="3"
                      maxlength="100"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="活动类型"
                        prop="type">
            <el-select v-model="addForm.type"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in actTypeData"
                         :key="item.id"
                         :label="item.type"
                         :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addAct">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="活动详情"
                 :visible.sync="editDialogVisible"
                 width="50%"
                 @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm"
                 :rules="addFormRules"
                 ref="editFormRef"
                 label-width="70px">
          <el-form-item label="活动名称"
                        prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动地点"
                        prop="place">
            <el-input v-model="editForm.place"></el-input>
          </el-form-item>
          <el-form-item label="活动规模"
                        prop="scale">
            <el-select v-model="editForm.scale"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in scaleData"
                         :key="item.id"
                         :label="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="举行时间"
                        prop="startTime">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="editForm.startTime"
                            style="width: 30%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动介绍"
                        prop="introduce">
            <el-input v-model="editForm.introduce"
                      type="textarea"
                      :rows="3"
                      maxlength="100"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="活动类型"
                        prop="type">
            <el-select v-model="editForm.type"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in actTypeData"
                         :key="item.id"
                         :label="item.type"
                         :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button v-if="editForm.state === 0"
                     type="primary"
                     @click="editAct(editForm.id)">更 新</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import Common from '../../assets/Common'
export default {
  data () {
    return {
      editForm: {},
      editDialogVisible: false,
      // 查询条件
      scale: '',
      type: '',
      state: '',
      score: '',
      query: '',
      // 当前的页数
      page: 1,
      // 当前每页显示多少条数据
      pagesize: 10,
      actlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加活动的表单数据
      addForm: {
        name: '',
        place: '',
        scale: '',
        startTime: '',
        introduce: '',
        type: ''
      },
      scaleData: Common.scale,
      stateDate: Common.state,
      scoreDate: Common.score,
      actTypeData: [],
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        place: [
          { required: true, message: '请输入活动地点', trigger: 'blur' }
        ],
        scale: [
          { required: true, message: '请输入活动规模', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择举行时间', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入活动介绍', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入活动类型', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getActList()
    this.loadActType()
  },
  methods: {
    async endActById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将结束该活动,您将无法进行修改或删除  是否继续?',
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
        return this.$message.info('已取消')
      }

      const { data: res } = await this.$http.put('http://127.0.0.1:9003/activity/' + id + '/endact')

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('结束活动成功！')
      this.getActList()
    },
    // 根据Id删除对应的用户信息
    async removeActById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该活动, 是否继续?',
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

      const { data: res } = await this.$http.delete('http://127.0.0.1:9003/activity/' + id)

      if (res.code !== 10000) return this.$message.error(res.message)

      this.$message.success('删除活动成功！')
      this.getActList()
    },
    async editAct (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put('http://127.0.0.1:9003/activity/' + id, this.editForm)
        if (res.code !== 10000) return this.$message.error(res.message)

        this.$message.success('修改活动成功！')
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getActList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('http://127.0.0.1:9003/activity/' + id)
      if (res.code !== 10000) return this.$message.error(res.message)
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async loadActType () {
      const { data: res } = await this.$http.get('http://localhost:9003/activity/type')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.actTypeData = res.data
      console.log(this.actTypeData)
    },
    // 点击按钮，添加新用户
    addAct () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('http://127.0.0.1:9003/activity', this.addForm)
        if (res.code !== 10000) return this.$message.error(res.message)

        this.$message.success('添加活动成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getActList()
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.pagesize = newSize
      this.getActList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.page = newPage
      this.getActList()
    },
    async getActList () {
      const { data: res } = await this.$http.get('http://127.0.0.1:9003/activity?page=' + this.page + '&' + 'pagesize=' + this.pagesize, { params: { query: this.query, scale: this.scale, type: this.type, state: this.state, score: this.score } }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.actlist = res.data.rows
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
