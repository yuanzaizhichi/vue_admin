<template>
  <el-tabs value="first"
           type="border-card">
    <el-tab-pane label="组织管理"
                 name="first">
      <AdCommunity></AdCommunity>
    </el-tab-pane>
    <el-tab-pane label="活动管理"
                 name="second">
      <AdActivity></AdActivity>
    </el-tab-pane>
    <el-tab-pane label="人员管理"
                 name="third">
      <AdUser></AdUser>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AdCommunity from './AdCommunity'
import AdActivity from './AdActivity'
import AdUser from './AdUser'
export default {
  components: {
    AdCommunity,
    AdActivity,
    AdUser
  },
  data () {
    return {

    }
  }
}
</script>
