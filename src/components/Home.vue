<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>华软社团管理系统</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.username}} - {{userInfo.community}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button type="text"
                       @click="pwdDialogVisible = true">修改密码</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button type="text"
                       @click="logout">退出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router>
          <!-- 菜单 -->
          <el-menu-item :index="'/'+item.description"
                        v-for="item in menulist"
                        :key="item.id">
            <i :class="iconsObj[item.code]"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog title="修改密码"
               :visible.sync="pwdDialogVisible"
               width="50%"
               @close="pwdDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="pwdForm"
               status-icon
               :rules="rules"
               ref="pwdFormRef"
               label-width="100px">
        <el-form-item label="旧密码"
                      prop="oldpass">
          <el-input type="password"
                    v-model="pwdForm.oldpass"
                    autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="pass">
          <el-input type="password"
                    v-model="pwdForm.pass"
                    autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-input type="password"
                    v-model="pwdForm.checkPass"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setpwd">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.pwdForm.checkPass !== '') {
          this.$refs.pwdFormRef.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        oldpass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      pwdForm: {
        oldpass: '',
        pass: '',
        checkPass: ''
      },
      pwdDialogVisible: false,
      userInfo: {},
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '001': 'iconfont icon-baobiao',
        '002': 'iconfont icon-tijikongjian',
        '003': 'iconfont icon-user',
        '004': 'iconfont icon-showpassword',
        '005': 'iconfont icon-morentouxiang',
        '006': 'iconfont icon-danju',
        '007': 'iconfont icon-shangpin',
        '008': 'iconfont icon-users'
      },
      // 是否折叠
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    pwdDialogClosed () {
      this.$refs.pwdFormRef.resetFields()
    },
    setpwd () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://127.0.0.1:9002/sys/editpwd', this.pwdForm)
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success('修改密码成功！请重新登陆')
        // 隐藏添加用户的对话框
        this.pwdDialogVisible = false
        this.logout()
      })
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.post('http://127.0.0.1:9002/sys/profile')
      if (res.code !== 10000) return this.$message.error(res.message)
      this.menulist = res.data.roles.menus
      this.userInfo = res.data
      this.$store.dispatch('setUserRoles', res.data.roles.points)
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
