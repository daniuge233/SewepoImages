var name_obj, id_obj, img_obj, email_obj, comment_obj;

$(document).ready(function() {
    name_obj = $(".name");
    id_obj = $(".id");
    email_obj = $(".email");
    comment_obj = $(".comment");
    img_obj = $(".img");
})

function submit() {
    var n = name_obj.val();
    var i = id_obj.val();
    var email = email_obj.val();
    var comment = comment_obj.val();
    var img = img_obj.prop('files')[0];

    if (n == "" || i == "" || img == undefined) {
        alert("姓名、邀请码和图片文件不允许留空");
        return;
    }

    var formData = new FormData();
    formData.append("name", n);
    formData.append("id", i);
    formData.append("email", email)
    formData.append("comment", comment);
    
    if(img) {
        formData.append("img", img);
    }
    
    $.ajax({
        type: "POST",
        url: '/api/submit',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            if (data.message != "success") {
                alert("邀请码错误");
            } else {
                alert("上传成功，请等待审核！");
            }
        },
        error: function(xml, txt, err) {
            alert("上传出错，错误信息详见控制台。");
            console.log(err);
        }
    });
}
