<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <el-table :data="paramList"
                stripe
                border
                fit
                style="width: 100%;"
                highlight-current-row>
        <el-table-column fixed
                         prop="name"
                         label="菜单名称">
          <template slot-scope="scope">
            <i :style="scope.row.type==1?'margin-left: 0px':'margin-left: 20px'"></i>
            <span class="toggle-button"
                  @click="show(scope.$index,scope.row.id)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed
                         prop="code"
                         label="权限标识"></el-table-column>
        <el-table-column fixed
                         prop="description"
                         label="描述"></el-table-column>
        <el-table-column fixed
                         prop="type"
                         label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">菜单</el-tag>
            <el-tag type="warning"
                    v-else>按钮</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      paramList: [],
      pointEnable: {}
    }
  },
  created () {
    // 获取所有的权限
    this.getParamsList()
  },
  methods: {
    // 获取权限列表
    async getParamsList () {
      const { data: res } = await this.$http.get(
        'http://127.0.0.1:9002/sys/permission',
        { params: { type: 1, pid: '0' } }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.paramList = res.data
      console.log(res)
    },
    async show (index, id) {
      if (this.pointEnable[id] === null || this.pointEnable[id] === undefined) {
        const { data: res } = await this.$http.get(
          'http://127.0.0.1:9002/sys/permission',
          { params: { type: 2, pid: id } }
        )
        if (res.data.length <= 0) {
          this.$message.error('无子权限')
        } else {
          for (var i = 0; i < res.data.length; i++) {
            this.paramList.splice(index + 1, 0, res.data[i])
          }
          this.pointEnable[id] = res.data.length
          console.log(this.pointEnable)
        }
      } else {
        this.paramList.splice(index + 1, this.pointEnable[id])
        this.pointEnable[id] = null
      }
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
  font-size: 12px;
}

.toggle-button {
  cursor: pointer;
}
</style>
