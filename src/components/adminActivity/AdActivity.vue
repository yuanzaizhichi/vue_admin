<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>社联活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="communityId"
                     clearable
                     @clear="getActList"
                     @change="getActList"
                     placeholder="组织">
            <el-option v-for="item in commData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
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
        <el-col :span="5"
                :offset="4">
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
        <el-table-column label="组织名称"
                         prop="communityName"></el-table-column>
        <el-table-column label="活动地点"
                         prop="place"></el-table-column>
        <el-table-column label="举行时间"
                         prop="startTime">
          <template slot-scope="scope">{{ scope.row.startTime | dateFormat }}</template></el-table-column>
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
                       @click="showDetaDialog(scope.row.id)">详情</el-button>
            <el-button type="text"
                       size="mini"
                       @click="showRateDialog(scope.row)">评分</el-button>
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
    </el-card>

    <el-dialog title="活动详情"
               :visible.sync="detaDialogVisible"
               width="70%"
               @close="detaDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="detaForm"
               ref="detaFormRef"
               disabled
               label-width="70px">
        <el-form-item label="活动名称"
                      prop="name">
          <el-input v-model="detaForm.name"></el-input>
        </el-form-item>
        <el-form-item label="组织名称"
                      prop="communityName">
          <el-input v-model="detaForm.communityName"></el-input>
        </el-form-item>
        <el-form-item label="活动地点"
                      prop="place">
          <el-input v-model="detaForm.place"></el-input>
        </el-form-item>
        <el-form-item label="活动规模"
                      prop="scale">
          <el-input v-model="detaForm.scale"></el-input>
        </el-form-item>
        <el-form-item label="举行时间"
                      prop="startTime">
          <el-date-picker type="datetime"
                          placeholder="选择日期"
                          v-model="detaForm.startTime"
                          style="width: 30%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动介绍"
                      prop="introduce">
          <el-input v-model="detaForm.introduce"
                    type="textarea"
                    :rows="5"
                    maxlength="100"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="活动类型"
                      prop="type">
          <el-input v-model="detaForm.type"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="活动评分"
               :visible.sync="rateDialogVisible"
               width="50%"
               @close="rateDialogClosed">
      <el-rate v-model="ratepoint"
               @change="rateActById(actId,ratepoint)"
               show-text
               text-color="#ff9900">
      </el-rate>
    </el-dialog>

  </div>
</template>

<script>
import Common from '../../assets/Common'
export default {
  data () {
    return {
      commData: [],
      detaForm: {},
      detaDialogVisible: false,
      // 查询条件
      communityId: '',
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
      scaleData: Common.scale,
      stateDate: Common.state,
      scoreDate: Common.score,
      actTypeData: [],
      rateDialogVisible: false,
      ratepoint: null,
      actId: ''
    }
  },
  created () {
    this.getActList()
    this.loadActType()
    this.loadComm()
  },
  methods: {
    async rateActById (id, point) {
      // console.log(id, point)
      const { data: res } = await this.$http.put('http://127.0.0.1:9003/activity/' + id + '/rate', point)
      if (res.code !== 10000) return this.$message.error(res.message)
      this.rateDialogVisible = false
      this.$message.success('评分成功')
      this.getActList()
    },
    rateDialogClosed () {
      this.ratepoint = null
      this.actId = ''
    },
    async showRateDialog (act) {
      if (act.state === 0) return this.$message.error('该活动未结束')
      const { data: res } = await this.$http.get('http://127.0.0.1:9003/activity/' + act.id)
      if (res.code !== 10000) return this.$message.error(res.message)
      this.ratepoint = res.data.score
      this.actId = act.id
      this.rateDialogVisible = true
    },
    async showDetaDialog (id) {
      const { data: res } = await this.$http.get('http://127.0.0.1:9003/activity/' + id)
      if (res.code !== 10000) return this.$message.error(res.message)
      console.log(res)
      this.detaForm = res.data
      this.detaDialogVisible = true
    },
    detaDialogClosed () {
      this.$refs.detaFormRef.resetFields()
    },
    async loadComm () {
      const { data: res } = await this.$http.get('http://localhost:9001/community')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.commData = res.data
      console.log(this.commData)
    },
    async loadActType () {
      const { data: res } = await this.$http.get('http://localhost:9003/activity/type')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.actTypeData = res.data
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
      const { data: res } = await this.$http.get('http://127.0.0.1:9003/activity?page=' + this.page + '&' + 'pagesize=' + this.pagesize, { params: { query: this.query, scale: this.scale, type: this.type, state: this.state, score: this.score, communityId: this.communityId } }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.actlist = res.data.rows
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
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
