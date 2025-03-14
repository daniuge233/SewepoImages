$(document).ready(function () {

    let body = document.body;

    $.get("/api/image/examine/get", function (data) {
        let data_parsed = JSON.parse(data.message);

        for (var elem in data_parsed) {
            let _elem = data_parsed[elem];
            var div = `<div class="box" id="${elem}" style="display: inline-flex; align-items: center;"><img class="imgPrev" src="/api/image/get/compress/${elem}/check"><span class="title _title">From: ${_elem.name}<br/><div style="font-size: medium; font-weight: normal;">${_elem.comment}｜${_elem.time}</div></span><div class="operator"><span class="operator_position_obj operator_top" onclick="acc('${elem}')">通过</span><span class="operator_position_obj operator_bottom" onclick="del('${elem}')">驳回</span></div></div>`
            body.insertAdjacentHTML('beforeend',div);
        }
    })

})

function acc(id) {
    $.get(`/api/image/examine/accept/${id}/`, function(data) {
        if (data.message == "error") {
            alert("操作失败");
        } else {
            let element = document.getElementById(id);
            element.remove();
            alert("操作成功");
        }
    });
}

function del(id) {
    $.get(`/api/image/examine/remove/${id}/`, function(data) {
        if (data.message == "error") {
            alert("操作失败");
        } else {
            let element = document.getElementById(id);
            element.remove();
            alert("操作成功");
        }
    });
}