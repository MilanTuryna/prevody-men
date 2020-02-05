/**
 * @param map
 * @returns {string}
 */
String.prototype.strReplace = function (map) {
    return this.replace(new RegExp("(" + Object.keys(map).map(
        function(i) {
            return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        }).join("|") + ")", "g"),
        function(s) {
            return map[s]
        });
};
/**
 * @param matcher
 * @returns {[]}
 */
Array.prototype.where = function (matcher) {
    let result = [];
    let len = this.length;
    for (var i = 0; i < len; i++) {
        if (matcher(this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};