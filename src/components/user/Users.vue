<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model="queryInfo.query"
                              clearable
                              @clear="getUserList">
                        <el-button slot="append"
                                   icon="el-icon-search"
                                   @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"
                               @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userlist"
                      border
                      stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名"
                                 prop="username"></el-table-column>
                <el-table-column label="学号"
                                 prop="studentId"></el-table-column>
                <el-table-column label="手机号码"
                                 prop="mobile"></el-table-column>
                <el-table-column label="角色"
                                 prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state"
                                   @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark"
                                    content="分配角色"
                                    placement="top"
                                    :enterable="false">
                            <el-button type="warning"
                                       icon="el-icon-setting"
                                       size="mini"
                                       @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
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
            userlist: [],
            total: 0,
            page: 1,
            pagesize: 10
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('http://127.0.0.1:9002/sys/user?page=' + this.page + '&' + 'pagesize=' + this.pagesize)
            if (res.code !== 10000) return this.$message.error(res.message)
            this.userlist = res.data.rows
            console.log(this.userlist)
        }
    }
}
</script>
