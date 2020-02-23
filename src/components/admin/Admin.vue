<template>
  <el-tabs value="second"
           type="border-card">
    <el-tab-pane label="组织管理"
                 name="first">
      <AdCommunity></AdCommunity>
    </el-tab-pane>
    <el-tab-pane label="活动管理"
                 name="second">
      <AdActivity></AdActivity>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AdCommunity from './AdCommunity'
import AdActivity from './AdActivity'
export default {
  components: {
    AdCommunity,
    AdActivity
  },
  data () {
    return {

    }
  }
}
</script>
