<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>组织列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8"></el-col>
                <el-col :span="4">
                    <el-button type="primary"
                               @click="addDialogVisible = true">添加组织</el-button>
                </el-col>
            </el-row>
            <el-table :data="coms"
                      border
                      stripe
                      style="width: 100%">
                <el-table-column type="index"
                                 label="#"></el-table-column>
                <el-table-column prop="name"
                                 label="组织名称">
                </el-table-column>
                <el-table-column prop="principal"
                                 label="联系人">
                </el-table-column>
                <el-table-column label="审核状态"
                                 prop="state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state"
                                   :active-value="1"
                                   :inactive-value="0"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   @change="comStateChanged(scope.row)">
                        </el-switch>
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small"
                                   @click="showEditDialog(scope.row.id)">详情</el-button>
                        <el-button type="text"
                                   size="small"
                                   @click="removeComById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="添加组织"
                   :visible.sync="addDialogVisible"
                   width="50%"
                   @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm"
                     :rules="addFormRules"
                     ref="addFormRef"
                     label-width="70px">
                <el-form-item label="组织名称"
                              prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="组织登录账号ID"
                              prop="managerId">
                    <el-input v-model="addForm.managerId"></el-input>
                </el-form-item>
                <el-form-item label="当前版本"
                              prop="version">
                    <el-input v-model="addForm.version"></el-input>
                </el-form-item>
                <el-form-item label="组织地址"
                              prop="communityAddress">
                    <el-input v-model="addForm.communityAddress"></el-input>
                </el-form-item>
                <el-form-item label="联系电话"
                              prop="communityPhone">
                    <el-input v-model="addForm.communityPhone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱"
                              prop="mailbox">
                    <el-input v-model="addForm.mailbox"></el-input>
                </el-form-item>
                <el-form-item label="组织规模"
                              prop="communitySize">
                    <el-input v-model="addForm.communitySize"></el-input>
                </el-form-item>
                <el-form-item label="所属类型"
                              prop="type">
                    <el-input v-model="addForm.type"></el-input>
                </el-form-item>
                <el-form-item label="联系人"
                              prop="principal">
                    <el-input v-model="addForm.principal"></el-input>
                </el-form-item>
                <el-form-item label="备注"
                              prop="remarks">
                    <el-input v-model="addForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="addCom">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="组织详情"
                   :visible.sync="editDialogVisible"
                   width="50%"
                   @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editForm"
                     :rules="addFormRules"
                     ref="editFormRef"
                     label-width="70px">
                <el-form-item label="组织名称"
                              prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="组织登录账号ID"
                              prop="managerId">
                    <el-input v-model="editForm.managerId"></el-input>
                </el-form-item>
                <el-form-item label="当前版本"
                              prop="version">
                    <el-input v-model="editForm.version"></el-input>
                </el-form-item>
                <el-form-item label="组织地址"
                              prop="communityAddress">
                    <el-input v-model="editForm.communityAddress"></el-input>
                </el-form-item>
                <el-form-item label="联系电话"
                              prop="communityPhone">
                    <el-input v-model="editForm.communityPhone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱"
                              prop="mailbox">
                    <el-input v-model="editForm.mailbox"></el-input>
                </el-form-item>
                <el-form-item label="组织规模"
                              prop="communitySize">
                    <el-input v-model="editForm.communitySize"></el-input>
                </el-form-item>
                <el-form-item label="所属类型"
                              prop="type">
                    <el-input v-model="editForm.type"></el-input>
                </el-form-item>
                <el-form-item label="联系人"
                              prop="principal">
                    <el-input v-model="editForm.principal"></el-input>
                </el-form-item>
                <el-form-item label="备注"
                              prop="remarks">
                    <el-input v-model="editForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="editComInfo(editForm.id)">更新</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
        return {
            coms: [],
            editDialogVisible: false,
            editForm: {},
            addDialogVisible: false,
            addForm: {
                name: '',
                managerId: '',
                version: '',
                communityAddress: '',
                communityPhone: '',
                mailbox: '',
                communitySize: '',
                type: '',
                principal: '',
                remarks: ''
            },
            // 添加表单的验证规则对象
      addFormRules: {
        name: [
                { required: true, message: '请输入组织名称', trigger: 'blur' }
            ],
        managerId: [
                { required: true, message: '请输入组织登录账号ID', trigger: 'blur' },
                {
                    min: 6,
                    max: 15,
                    message: '部门编号的长度在6~15个字符之间',
                    trigger: 'blur'
                }
            ],
        communityPhone: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ],
        mailbox: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
        principal: [
                { required: true, message: '请输入联系人', trigger: 'blur' }
            ]
            }
        }
    },
    methods: {
        async getComList() {
            const { data: res } = await this.$http.get('http://localhost:9001/community')
            if (res.code !== 10000) return this.$message.error(res.message)
            this.coms = res.data
            console.log(this.coms)
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addCom() {
            this.$refs.addFormRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.post('http://localhost:9001/community', this.addForm)
            if (res.code !== 10000) return this.$message.error(res.message)
            this.$message.success('添加组织成功！')
            this.addDialogVisible = false
            this.getComList()
            })
        },
        async showEditDialog(id) {
            // console.log(id)
            const { data: res } = await this.$http.get('http://localhost:9001/community/' + id)

            if (res.code !== 10000) {
                return this.$message.error('查询组织信息失败！')
            }
            this.editForm = res.data
            console.log(this.editForm)
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        editComInfo(id) {
            this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.put('http://localhost:9001/community/' + id, this.editForm)
            if (res.code !== 10000) return this.$message.error(res.message)
            this.$message.success('修改组织成功！')
            this.editDialogVisible = false
            this.getComList()
            })
        },
        async removeComById(id) {
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm(
                '此操作将永久删除该组织, 是否继续?',
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

            const { data: res } = await this.$http.delete('http://localhost:9001/community/' + id)

            if (res.code !== 10000) return this.$message.error(res.message)

            this.$message.success('删除组织成功！')
            this.getComList()
        },
        // 监听 switch 开关状态的改变
        async comStateChanged(cominfo) {
            // console.log(cominfo)
            const { data: res } = await this.$http.put('http://localhost:9001/community/' + cominfo.id, cominfo)
            if (res.code !== 10000) {
                cominfo.state = cominfo.state === 1 ? 2 : 1
                return this.$message.error(res.message)
            }
            this.$message.success('更新组织状态成功！')
        }
    },
    created: function() {
        this.getComList()
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
