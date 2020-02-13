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
                <el-table-column prop="state"
                                 label="状态">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small"
                                   @click="showDetaDialog(scope.row.id)">详情</el-button>
                        <el-button type="text"
                                   size="small"
                                   @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button type="text"
                                   size="small"
                                   @click="removeDeptById(scope.row.id)">删除</el-button>
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
                   :visible.sync="detaDialogVisible"
                   width="50%"
                   @close="detaDialogClosed">
            <!-- 内容主体区域 -->
            <el-table>
                <el-table-column :v-for="(value, name) in detaData"
                                 :property="name"
                                 :label="value"
                                 width="150"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="修改部门"
                   :visible.sync="editDialogVisible"
                   width="50%"
                   @close="editDialogVisible">
            <!-- 内容主体区域 -->
            <el-form :model="editForm"
                     :rules="addFormRules"
                     ref="editFormRef"
                     label-width="70px">
                <el-form-item label="组织名称"
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
            detaData: {},
            detaDialogVisible: false,
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
            },
            coms: [],
            editDialogVisible: false,
            editForm: {}
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
            const { data: res } = await this.$http.get('http://localhost:9001/community/department/' + id)

            if (res.code !== 10000) {
                return this.$message.error('查询部门信息失败！')
            }
            this.editForm = res.data
            console.log(this.editForm)
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        editDeptInfo(id) {
            this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.put('http://localhost:9001/community/department/' + id, this.editForm)
            if (res.code !== 10000) return this.$message.error(res.message)
            this.$message.success('修改部门成功！')
            this.editDialogVisible = false
            this.getComList()
            })
        },
        async removeDeptById(id) {
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
            this.getComList()
        },
        detaDialogClosed() {
            this.detaData = {}
        },
        async showDetaDialog(id) {
            // console.log(id)
            const { data: res } = await this.$http.get('http://localhost:9001/community/' + id)

            if (res.code !== 10000) {
                return this.$message.error('查询组织信息失败！')
            }
            this.detaData = res.data
            console.log(this.detaData)
            this.detaDialogVisible = true
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
