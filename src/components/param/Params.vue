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
                      fit
                      style="width: 100%;"
                      highlight-current-row>
                <el-table-column fixed
                                 prop="name"
                                 label="菜单名称"
                                 >
                    <template slot-scope="scope">
                        <i :style="scope.row.type==1?'margin-left: 0px':'margin-left: 20px'"></i>
                        <span @click="show(scope.$index,scope.row.id)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed
                                 prop="code"
                                 label="权限标识"
                                 ></el-table-column>
                <el-table-column fixed
                                 prop="description"
                                 label="描述"
                                 ></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.type==1" @click="handleCreate(null,2);setPid(2,scope.row.id)" type="text" size="small">添加权限点</el-button>
                        <el-button @click="handlerApiList(scope.row.id)" type="text" size="small">查看api权限</el-button>
                        <el-button @click="handleCreate(scope.row.id,scope.row.type);setPid(scope.row.type,scope.row.pid)" type="text" size="small">查看</el-button>
                        <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      paramList: [],
      pointEnable: {}
    }
  },
  created() {
    // 获取所有的权限
    this.getParamsList()
  },
  methods: {
    // 获取权限列表
    async getParamsList() {
      const { data: res } = await this.$http.get(
        'http://127.0.0.1:9002/sys/permission',
        { params: { type: 1, pid: '0' } }
      )
      if (res.code !== 10000) return this.$message.error(res.message)
      this.paramList = res.data
      console.log(res)
    },
    async show(index, id) {
      if (
        !this.pointEnable[id] === null ||
        this.pointEnable[id] === undefined
      ) {
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
        }
      } else {
        this.paramList.splice(index + 1, this.pointEnable[id])
        this.pointEnable[id] = null
      }
    }
  }
}
</script>
