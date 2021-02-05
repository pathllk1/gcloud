$(document).ready(function () {
    $.ajaxSetup({
        headers:
            { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
    });

    load_tbl();

    $("#jqgrid").jqGrid({
        url: '/stock/list_stock',
        datatype: "json",
        colNames: ['ITEM NAME', 'QNTY', 'HSN CODE', 'RATE', 'TOTAL'],
        colModel: [
            { name: 'item', index: 'item', width: 180 },
            { name: 'qty', index: 'qty', width: 80 },
            { name: 'hsn', index: 'hsn', width: 100 },
            { name: 'rate', index: 'rate', width: 100 },
            { name: 'total', index: 'total', width: 110 }
        ],
        rowNum: 10,
        loadonce: true,
        rowList: [10, 20, 100000000],
        loadComplete: function () {
            $("option[value=100000000]").text('All');
        },
        pager: '#pager2',
        sortname: 'item',
        viewrecords: true,
        sortorder: "desc",
        jsonReader: { repeatitems: false },
        caption: "STOCK ITEMS"
    });
    jQuery("#jqgrid").jqGrid('navGrid', '#pager2', { edit: false, add: false, del: false });
    jQuery("#jqgrid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false });

    $("#jqgrid1").jqGrid({
        url: '/stock/list_stock_reg',
        datatype: "json",
        colNames: ['ID', 'DATE', 'PARTY', 'ITEM', 'HSN', 'QNTY', 'RATE', 'TOTAL', 'PROJECT', 'uom', 'type', 'grate'],
        colModel: [
            { key: true, name: '_id', index: '_id', width: 80, hidden: true },
            { name: 'bdate', index: 'bdate', width: 120, sorttype: 'date', formatter: "date", formatoptions: { newformat: "d-m-Y" } },
            { name: 'supply', index: 'supply', width: 150 },
            { name: 'item', index: 'item', width: 200 },
            { name: 'hsn', index: 'hsn', width: 120 },
            { name: 'qty', index: 'qty', width: 120 },
            { name: 'rate', index: 'rate', width: 120 },
            { name: 'total', index: 'total', width: 120 },
            { name: 'project', index: 'project', width: 120 },
            { name: 'uom', index: 'uom', width: 120, hidden: true},
            { name: 'type', index: 'type', width: 120, hidden: true},
            { name: 'grate', index: 'grate', width: 120, hidden: true}
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
        caption: "", buttonicon: "ui-icon-disk", position: "last", onClickButton: function () {
            options = {
                includeLabels: true,
                includeGroupHeader: true,
                includeFooter: true,
                fileName: "jqGridExport.xlsx",
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                maxlength: 40,
                onBeforeExport: null,
                replaceStr: null,
                loadIndicator: true
            };
            $("#jqgrid1").jqGrid('exportToExcel', options);
        }
    }).navButtonAdd("#jqgrid1_toppager", {
        caption: "", buttonicon: "ui-icon-plus", position: "last", onClickButton: function () {
            $('#dlg').dialog('open');
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
                                        jQuery("#jqgrid").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
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
                                        jQuery("#jqgrid").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
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
    jQuery("#jqgrid1").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false });
    $("#dlg").dialog({
        autoOpen: false,
        width: '50%',
        modal: true,
        title: "Stock Entry",
        close: function (event, ui) {
            $('#add').trigger("reset");
            emode = false;
            qt = 0;
            $("#total1").hide();
        }
    });
    $("#total1").hide();
    $('.ab').focus(function () {
        $(this).css({ 'background-color': '#333FFF' });
        $(this).css({ 'color': '#FEFEFD' });
    });

    $('.ab').blur(function () {
        $(this).css({ 'background-color': '#FBFCFC' });
        $(this).css({ 'color': '#17202A' });
    });
})
var frm = $('#add');
frm.submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: frm.attr('method'),
        url: frm.attr('action'),
        data: frm.serialize(),
        success: function (data) {
            alert(data)
            $('#add').trigger("reset");
            load_tbl();
            jQuery("#jqgrid").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
            jQuery("#jqgrid1").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
            emode = false
        },
        error: function (data) {
            alert(JSON.stringify(data));
        },
        beforeSend: function () {
            $("#loader").show();
        },
        complete: function (data) {
            $("#loader").hide();
        }
    })
})

var ACCITEM = [];
var ACCSUPPLY = [];
var ACCUOM = [];
var ACCPROJECT = [];
var emode = false;
var qt = 0;

function load_tbl() {
    $.ajax({
        type: "GET",
        url: '/stock/list_stock_reg',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $('#lstTable_stock_reg tbody').empty();
            var dt = "";
            $.each(data, function (i, x) {
                ACCITEM.push(x.item);
                ACCSUPPLY.push(x.supply);
                ACCUOM.push(x.uom);
                ACCPROJECT.push(x.project);
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
    })

    $("#item").autocomplete({
        source: ACCITEM,
        appendTo: $('#dlg')
    });
    $("#supply").autocomplete({
        source: ACCSUPPLY,
        appendTo: $('#dlg')
    });
    $("#uom").autocomplete({
        source: ACCUOM,
        appendTo: $('#dlg')
    });
    $("#project").autocomplete({
        source: ACCPROJECT,
        appendTo: $('#dlg')
    });
}

$("#item").blur(function (e) {
    $.ajax({
        type: "POST",
        url: '/stock/get_item_by_name',
        data: { item: $("#item").val() },
        success: function (data) {
            if (data == null) {
                $("#total1").show();
            }
            $("#hsn").val(data.hsn)
            $("#qtyh").val(data.qty)
            $("#qtyh1").val(data.qty)
            $("#uom").val(data.uom)
            $("#rate").val(data.rate)
            $("#grate").val(data.grate)
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
})

$("#qty").on("input", function (e) {
    if (emode == true) {
        $("#total").val(parseInt($("#qty").val()) * parseInt($("#rate").val()));
        if ($("#type").val() === "SALE") {
            $("#qtyh").val(parseInt($("#qtyh1").val()) - parseInt($("#qty").val()) + parseInt(qt))
        }
        else if ($("#type").val() === "PURCHASE") {
            $("#qtyh").val(parseInt($("#qty").val()) - parseInt($("#qtyh1").val()) + parseInt(qt))
        }
        $("#total1").val(parseInt($("#qtyh").val()) * parseInt($("#rate").val()));
    }
    else {
        $("#total").val(parseInt($("#qty").val()) * parseInt($("#rate").val()));
        if ($("#type").val() === "SALE") {
            $("#qtyh").val(parseInt($("#qtyh1").val()) - parseInt($("#qty").val()))
        }
        else if ($("#type").val() === "PURCHASE") {
            $("#qtyh").val(parseInt($("#qtyh1").val()) + parseInt($("#qty").val()))
        }
        $("#total1").val(parseInt($("#qtyh").val()) * parseInt($("#rate").val()));
    }
})

function cl_edt(id) {
    try {
        $.ajax({
            type: "POST",
            url: '/stock/get_item',
            data: { id: id },
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

function cl_dlt(id) {
    if (confirm("Make Sure! You want to Delete This Record?")) {
        try {
            var myGrid = $('#jqgrid1');
            var selRowId = myGrid.jqGrid('getGridParam', 'selrow');
            var tp = myGrid.jqGrid('getCell', selRowId, 'type');
            var it = myGrid.jqGrid('getCell', selRowId, 'item');
            var qt_del = myGrid.jqGrid('getCell', selRowId, 'qty');
            var qt_upd_del;
            var hsn = myGrid.jqGrid('getCell', selRowId, 'hsn');
            var uom = myGrid.jqGrid('getCell', selRowId, 'uom');
            var rate = myGrid.jqGrid('getCell', selRowId, 'rate');
            $.ajax({
                type: "POST",
                url: '/stock/get_item_by_name',
                data: { item: it },
                success: function (data) {
                    qt_upd_del = data.qty;
                    alert(qt_upd_del)
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

