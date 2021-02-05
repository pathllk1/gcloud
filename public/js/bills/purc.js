var db = openDatabase('ANJAN', '1.0', 'ANJAN', 5 * 1024 * 1024);
var nitem = false;
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'x-access-token': $.cookie('token')
        }
    })
    $.ajax({
        url: '/dash',
        method: 'GET',
        success: function (dta) {
            console.log('succes: ' + dta);
        }
    });
    db.transaction(function (tx) {
        tx.executeSql('create table if not exists purc(rid integer primary key autoincrement, type text, bno text, bdate datetime not null, supply text, item text, hsn text, qty decimal(10, 5), qtyh decimal(10,5), uom text, rate decimal(10,5), grate decimal(10,5), disc decimal(10,5), discamt decimal(10,5), total decimal(10,5), project text)');
    });
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM purc', [], function (tx, results) {
        });
    });
    
    $("#dlg").dialog({
        autoOpen: false,
        width: '50%',
        modal: true,
        title: "SUPPLIER DETAILS",
        close: function (event, ui) {

        }
    });
    $("#dlg1").dialog({
        autoOpen: false,
        width: '50%',
        modal: true,
        title: "ITEM DETAILS",
        close: function (event, ui) {
            $('#add').trigger("reset");
            $("#total1").hide();
            nitem = false;
        }
    });

    displayAll();
    $("#total1").hide();
    load_tbl();
    $('.ab').addClass("ui-widget ui-widget-content ui-corner-all");
    $("#gtot").val("0.00");
    $("#disc").val("0.00");
    $("#cgst").val("0.00");
    $("#sgst").val("0.00");
    $("#igst").val("0.00");
    $("#rof").val("0.00");
    $("#ntot").val("0.00");
});

$("#supply").keydown(function (e) {
    if (e.keyCode == 13) {
        if ($("#supply").val().length > 0) {
            $("#suupl").text($("#supply").val());
            $('#dlg').dialog('open');
        }
        else {
            alert("Please Enter Supplier Name First!")
        }
    }
});

var frm = $('#add');
frm.submit(function (e) {
    e.preventDefault();
    db.transaction(function (tx) {
        var type = "PURCHASE"
        var item = $("#item").val()
        var supply = $("#supply").val()
        var bno = $("#bno").val()
        var bdate = $("#bdate").val()
        var hsn = $("#hsn").val()
        var qty = $("#qty").val()
        var qtyh = $("#qtyh").val()
        var uom = $("#uom").val()
        var rate = $("#rate").val()
        var grate = $("#grate").val()
        var disc1 = $("#disc1").val()
        var discamt = $("#discamt").val()
        var total = $("#total").val()
        var project = $("#project").val()
        tx.executeSql('insert into purc(type, bno, bdate, supply, item, hsn, qty, qtyh, uom, rate, grate, disc, discamt, total, project) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [type, bno, bdate, supply, item, hsn, qty, qtyh, uom, rate, grate, disc1, discamt, total, project], displayAll());
    });
    var gtot = $("#gtot").val();
    var disc = $("#disc").val();
    var cgst = $("#cgst").val();
    var sgst = $("#sgst").val();
    var igst = $("#igst").val();
    var ntot = $("#ntot").val();
    var grte = $("#grate").val();
    var tot = $("#total").val();
    $("#gtot").val(parseFloat(gtot) + parseFloat($("#total1").val()));
    $("#disc").val(parseFloat(disc) + parseFloat($("#discamt").val()));
    $("#cgst").val(parseFloat(cgst) + parseFloat((tot * grte / 100) / 2));
    $("#sgst").val(parseFloat(sgst) + parseFloat((tot * grte / 100) / 2));
    $("#igst").val(parseFloat(igst) + parseFloat(tot * grte / 100));
    $("#ntot").val(parseFloat(ntot) + parseFloat(tot) + (parseFloat(tot * grte / 100)));
})

function displayAll() {
    $.jgrid.gridUnload("jqgrid1");
    $("#jqgrid1").jqGrid({
        datatype: "local",
        colNames: ['ITEM', 'HSN', 'QNTY', 'RATE', 'GST RATE', 'DISCOUNT', 'TOTAL', 'PROJECT', 'uom'],
        colModel: [
            { name: 'item', index: 'item', width: 200 },
            { name: 'hsn', index: 'hsn', width: 120 },
            { name: 'qty', index: 'qty', width: 120 },
            { name: 'rate', index: 'rate', width: 120 },
            { name: 'grate', index: 'grate', width: 120 },
            { name: 'discamt', index: 'discamt', width: 120 },
            { name: 'total', index: 'total', width: 120 },
            { name: 'project', index: 'project', width: 120 },
            { name: 'uom', index: 'uom', width: 120, hidden: true }
        ],
        rowNum: 100000000,
        rowList: [10, 20, 30, 100000000],
        loadComplete: function () {
            $("option[value=100000000]").text('All');
        },
        loadonce: true,
        pager: '#pager',
        sortname: 'item',
        viewrecords: false,
        sortorder: "desc",
        jsonReader: { repeatitems: false },
        caption: "STOCK REGISTER",
        toppager: true,
        pgtext: '',
        pgbuttons: false,
    }).navGrid('#jqgrid1_toppager', { edit: false, add: false, del: false, refresh: true, search: true, view: true, cloneToTop: true }).navButtonAdd("#jqgrid1_toppager", {
        caption: "", buttonicon: "ui-icon-plus", position: "last", onClickButton: function () {
            $('#dlg1').dialog('open');
        }
    }).navButtonAdd("#jqgrid1_toppager", {
        caption: "", buttonicon: "ui-icon-pencil", position: "last", onClickButton: function () {
            var myGrid = $('#jqgrid1');
            var selRowId = myGrid.jqGrid('getGridParam', 'selrow');
            var tp = myGrid.jqGrid('getCell', selRowId, '_id');
            try {
                $.ajax({
                    type: "POST",
                    url: '/stock/get_item',
                    data: { id: tp },
                    success: function (data) {
                        $("#id").val(data._id)
                        $("#type").val(data.type)
                        $("#item").val(data.item)
                        $("#supply").val(data.supply)
                        $("#bno").val(data.bno)
                        $("#bdate").val(data.bdate)
                        $("#hsn").val(data.hsn)
                        $("#qty").val(data.qty)
                        $("#qtyh1").val(data.qty)
                        $("#uom").val(data.uom)
                        $("#rate").val(data.rate)
                        $("#grate").val(data.grate)
                        $("#total").val(data.total)
                        $("#project").val(data.project)
                        $.ajax({
                            type: "POST",
                            url: '/stock/get_item_by_name',
                            data: { item: $("#item").val() },
                            success: function (data) {
                                $("#qtyh").val(data.qty)
                                $("#total1").val(parseInt($("#qtyh").val()) * parseInt($("#rate").val()))
                                emode = true
                                qt = $("#qtyh").val()
                            },
                            error: function (e) {
                                alert(JSON.stringify(e));
                            }
                        });
                    },
                    error: function (e) {
                        alert(JSON.stringify(e));
                    },
                    beforeSend: function () {
                        $("#loader").show();
                    },
                    complete: function (data) {
                        $("#loader").hide();
                    }
                });
                $('#dlg').dialog('open');
            }
            catch (ex) {
                alert(ex)
            }
        }
    }).navButtonAdd("#jqgrid1_toppager", {
        caption: "", buttonicon: "ui-icon-trash", position: "last", onClickButton: function () {
            var myGrid = $('#jqgrid1');
            var selRowId = myGrid.jqGrid('getGridParam', 'selrow');
            var tp = myGrid.jqGrid('getCell', selRowId, 'type');
            var it = myGrid.jqGrid('getCell', selRowId, 'item');
            var qt_del = myGrid.jqGrid('getCell', selRowId, 'qty');
            var qt_upd_del;
            var hsn = myGrid.jqGrid('getCell', selRowId, 'hsn');
            var uom = myGrid.jqGrid('getCell', selRowId, 'uom');
            var rate = myGrid.jqGrid('getCell', selRowId, 'rate');
            var grate = myGrid.jqGrid('getCell', selRowId, 'grate');
            var id = myGrid.jqGrid('getCell', selRowId, '_id');
            if (confirm("Make Sure! You want to Delete This Record?")) {
                try {
                    $.ajax({
                        type: "DELETE",
                        url: '/stock/del_item',
                        data: { id: id },
                        success: function (data) {

                        },
                        error: function (e) {
                            alert(JSON.stringify(e));
                        },
                        beforeSend: function () {
                            $("#loader").show();
                        },
                        complete: function (data) {
                            $("#loader").hide();
                        }
                    });
                    $.ajax({
                        type: "POST",
                        url: '/stock/get_item_by_name',
                        data: { item: it },
                        success: function (data) {
                            qt_upd_del = data.qty;
                            if (tp === "SALE") {
                                var dataObject = {
                                    item: it,
                                    hsn: hsn,
                                    uom: uom,
                                    rate: rate,
                                    grate: grate,
                                    qty: qt_upd_del + qt_del,
                                    total: (qt_upd_del + qt_del) * rate
                                }
                                $.ajax({
                                    type: "POST",
                                    url: '/stock/del_upd',
                                    data: dataObject,
                                    success: function (data) {
                                        alert(data)
                                        jQuery("#jqgrid1").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                                    },
                                    error: function (e) {
                                        alert(JSON.stringify(e));
                                    }
                                });
                            }
                            else if (tp === "PURCHASE") {
                                var dataObject = {
                                    item: it,
                                    hsn: hsn,
                                    uom: uom,
                                    rate: rate,
                                    grate: grate,
                                    qty: qt_upd_del - qt_del,
                                    total: (qt_upd_del - qt_del) * rate
                                }
                                $.ajax({
                                    type: "POST",
                                    url: '/stock/del_upd',
                                    data: dataObject,
                                    success: function (data) {
                                        alert(data)
                                        jQuery("#jqgrid1").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                                    },
                                    error: function (e) {
                                        alert(JSON.stringify(e));
                                    }
                                });
                            }
                        },
                        error: function (e) {
                            alert(JSON.stringify(e));
                        }
                    });
                }
                catch (ex) {
                    alert(ex)
                }
                return true;
            }
            else {
                return false;
            }
        }
    })
    db.transaction(function (tx) {
        tx.executeSql('select * from purc', [], function (tx, results) {
            var n = results.rows.length;
            for (var i = 0; i < n; i++) {
                var x = results.rows.item(i);
                var row = {};
                row["item"] = x.item;
                row["hsn"] = x.hsn;
                row["qty"] = x.qty;
                row["uom"] = x.uom;
                row["rate"] = x.rate;
                row["grate"] = x.grate;
                row["discamt"] = x.discamt;
                row["total"] = x.total;
                row["project"] = x.project;
                jQuery("#jqgrid1").jqGrid('addRowData', i + 1, row);
            }
        });
    });
    $('#dlg1').dialog('close');
}

$("#qty").on("input", function (e) {
    if (nitem == true) {
        $("#total").val(parseInt($("#qty").val()) * parseInt($("#rate").val()));
        $("#qtyh").val($("#qty").val())
        $("#total1").val(parseInt($("#qty").val()) * parseInt($("#rate").val()));
    }
    else {
        $("#total").val(parseInt($("#qty").val()) * parseInt($("#rate").val()));
        $("#qtyh").val(parseInt($("#qtyh1").val()) + parseInt($("#qty").val()))
        $("#total1").val(parseInt($("#qtyh").val()) * parseInt($("#rate").val()));
    }
});

$("#rate").on("input", function (e) {

});

$("#disc1").on("input", function (e) {
    var k = $("#total1").val() * $("#disc1").val() / 100
    $("#total").val($("#total1").val() - k)
    $("#discamt").val(k)
})

$("#item").blur(function (e) {
    $.ajax({
        type: "POST",
        url: '/stock/get_item_by_name',
        data: { item: $("#item").val() },
        dataType: "json",
        success: function (data) {
            if (data == null) {
                $("#total1").show();
                nitem = true;
                $("#loader").hide();
            }
            else {
                $("#hsn").val(data.hsn)
                $("#qtyh").val(data.qty)
                $("#qtyh1").val(data.qty)
                $("#uom").val(data.uom)
                $("#rate").val(data.rate)
                $("#grate").val(data.grate)
                $("#loader").hide();
            }
        },
        error: function (e) {
            $("#loader").hide();
            alert(JSON.stringify(e));
            $("#total1").show();
        },
        beforeSend: function () {
            $("#loader").show();
        },
        complete: function (data) {
            $("#loader").hide();
        }
    });
})

$("#fsave").click(function (e) {
    if ($("#bno").val().length == 0 || $("#bdate").val().length == 0 || $("#supply").val().length == 0 || $("#addr").val().length == 0 || $("#state").val().length == 0) {
        alert("Please fill the records properly");
    }
    else {
        try {
            db.transaction(function (tx) {
                tx.executeSql('select * from purc', [], function (tx, results) {
                    var n = results.rows.length;
                    for (var i = 0; i < n; i++) {
                        var x = results.rows.item(i);
                        var grte = x.grate;
                        var tot = x.total;
                        var dataObject = {
                            type: "PURCHASE",
                            bno: x.bno,
                            bdate: x.bdate,
                            supply: x.supply,
                            item: x.item,
                            hsn: x.hsn,
                            uom: x.uom,
                            rate: x.rate,
                            grate: x.grate,
                            cgst: parseFloat((tot * grte / 100) / 2),
                            sgst: parseFloat((tot * grte / 100) / 2),
                            igst: parseFloat(tot * grte / 100),
                            qty: x.qty,
                            qtyh: x.qtyh,
                            disc: x.disc,
                            discamt: x.discamt,
                            project: x.project,
                            total: x.total
                        }
                        $.ajax({
                            type: "POST",
                            url: '/stock/save',
                            data: dataObject,
                            success: function (data) {
                                console.log(data)
                            },
                            error: function (e) {
                                alert(JSON.stringify(e));
                                $("#loader").hide();
                            },
                            beforeSend: function () {
                                $("#loader").show();
                            },
                            complete: function (data) {
                                $("#loader").hide();
                            }
                        });
                    }
                });
            });
        } catch (error) {
            alert(error)
        }
    }
})

var ACCITEM = [];
var ACCSUPPLY = [];
var ACCUOM = [];
var ACCPROJECT = [];

function load_tbl() {
    $.ajax({
        type: "GET",
        url: '/stock/list_stock_reg',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, x) {
                ACCITEM.push(x.item);
                ACCSUPPLY.push(x.supply);
                ACCUOM.push(x.uom);
                ACCPROJECT.push(x.project);
            });
        },
        error: function (e) {
            alert(JSON.stringify(e));
            $("#loader").hide();
        },
        beforeSend: function () {
            $("#loader").show();
        },
        complete: function (data) {
            $("#loader").hide();
        }
    })

    $("#item").autocomplete({
        source: ACCITEM,
        appendTo: $('#dlg1')
    });
    $("#supply").autocomplete({
        source: ACCSUPPLY
    });
    $("#uom").autocomplete({
        source: ACCUOM,
        appendTo: $('#dlg1')
    });
    $("#project").autocomplete({
        source: ACCPROJECT,
        appendTo: $('#dlg1')
    });
}

$("#bno").keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault()
        $("#bdate").focus();
    }
})
$("#bdate").keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault()
        $("#supply").focus();
    }
})

