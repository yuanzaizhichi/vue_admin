<template>
    <div>
        <!-- 卡片视图区域 -->
        <el-card>

        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            departData: {},
            depts: []
        }
    },
    methods: {
        async getDepList() {
            const { data: res } = await this.$http.get('http://localhost:9001/community/department')
            if (res.code !== 10000) return this.$message.error(res.message)
            console.log(res)
        }
    },
    created: function() {
        this.getDepList()
    }
}
</script>
