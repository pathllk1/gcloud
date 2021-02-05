$("#btnFET").click(function () {
    var ds = {
        pto: $("#sr").val(),
        dt: $("#dtfrm").val(),
        dt1: $("#dtto").val()
    }
    $.ajax({
        type: "get",
        url: "/exp/fetch/",
        data: ds,
        success: function (dt) {
            alert(JSON.stringify(dt));
        },
        error: function (e) {
            alert(JSON.stringify(e));
        }
    });
})