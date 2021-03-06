// 自动设置画板内的所有图层左上角对齐，且画板高度与内容自适应
var sketch = require('sketch');
var document = sketch.getSelectedDocument(); // 当前文档
var mySelectedLayers = document.selectedLayers; // 选中的图层
mySelectedLayers = mySelectedLayers.layers

var ab // 画板
var abListLength = 0 // 记录选中的画板数量
var maxHeight = 0 // 记录画板图层的最高长度（y+height）
var minX // 图层的最小 x
var minY // 图层的最小 y
var isArtboard = false // 标记图层是否为画板
var runSun = 0 // 记录查询画板的层级数

// console.log(mySelectedLayers)
if (mySelectedLayers.length == 0) {
    sketch.UI.message('⚠️ 请选中画板')
}

// --- 遍历所有选中的图层 --- 
for (var i = 0; i < mySelectedLayers.length; i++) {

    // --- 首先找到画板 ---
    if (mySelectedLayers[i].type == 'Artboard') {
        // 如果当前选中的是画板
        ab = mySelectedLayers[i]
        abListLength += 1 // 记录选中的画板数量
    } else {
        // 忽略非画板图层
        continue

        // // 当前选中的不是画板，则向上查找父级画板
        // ab = mySelectedLayers[i].parent // 取当前选中图层的父图层
        // runSun = 0
        // while (isArtboard == false) {
        //     runSun += 1 // 记录遍历次数，达到上限则跳出
        //     // 判断图层是否为画板
        //     if (ab.type == 'Artboard') {
        //         isArtboard = true
        //     } else {
        //         // 不是画板则继续向上查询
        //         ab = ab.parent
        //     }
        //     // 增加上限值，避免处理时间过长
        //     if (runSun >= 10) {
        //         break
        //     }
        // }
    }

    maxHeight = 0 // 记录最大长度，每个画板的值要重置
    layerList = ab.layers // 当前画板下的图层列表

    // --- 左上角对齐 ---
    minX = 10000000
    minY = 10000000

    // 遍历画板内所有图层
    for (var j = 0; j < layerList.length; j++) {

        // 忽略时间信息
        if (layerList[j].name == '[time]') {
            continue
        }

        // 查找 x、y 的最小值
        if (layerList[j].frame.y < minY) {

            minY = layerList[j].frame.y
        }
        if (layerList[j].frame.x < minX) {
            minX = layerList[j].frame.x
        }
    }

    /*
    所有图层以父级画板为基准，左上角对齐：
    理想 bbox = 100,100
    minX、minY 为实际边距
    */
    var expectMarginX, expectMarginY // 实际 bbox 与理想的差距
    expectMarginX = 100 - minX
    expectMarginY = 100 - minY

    if (minX != 100 || minY != 100) {
        // x、y 只要有 1 个不是理想值，则需要进行对齐处理
        for (var j = 0; j < layerList.length; j++) {

            // 忽略时间信息图层
            if (layerList[j].name == '[time]') {
                continue
            }

            // 所有图层移动相同距离
            layerList[j].frame.y += expectMarginY
            layerList[j].frame.x += expectMarginX

        }
    }

    // --- 画板高度自适应 ---
    for (var j = 0; j < layerList.length; j++) {

        // 取 y + height 最大的图层
        if (layerList[j].frame.y + layerList[j].frame.height > maxHeight) {
            maxHeight = layerList[j].frame.y + layerList[j].frame.height
        }
    }

    if (ab.frame.height == maxHeight + 100) {
        // 如果当前画板高度已经达到预期，则忽略
    } else {
        ab.frame.height = maxHeight + 100
    }

}

if (abListLength == 0) {
    sketch.UI.message('⚠️ 请选中画板')
} else {
    sketch.UI.message('✅ 操作成功')
}