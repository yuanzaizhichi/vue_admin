export default {
    transformTozTreeFormat: function (sNodes) {
        var i, l;
        var r = [];
        var tmpMap = {};
        for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i].id] = sNodes[i];
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
            var p = tmpMap[sNodes[i].pid];
            if (p && sNodes[i].id != sNodes[i].pid) {
                var children = this.nodeChildren(p);
                if (!children) {
                    children = this.nodeChildren(p, []);
                }
                children.push(sNodes[i]);
            } else {
                r.push(sNodes[i]);
            }
        }
        return r;
    }
}