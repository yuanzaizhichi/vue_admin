<template>
  <el-tabs value="first"
           type="border-card">
    <el-tab-pane label="组织管理"
                 name="first">
      <AdCommunity></AdCommunity>
    </el-tab-pane>
    <el-tab-pane label="组织类型"
                 name="second">
      <AdCommunityType></AdCommunityType>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AdCommunity from './AdCommunity'
import AdCommunityType from './AdCommunityType'
export default {
  components: {
    AdCommunity,
    AdCommunityType
  },
  data () {
    return {

    }
  }
}
</script>
