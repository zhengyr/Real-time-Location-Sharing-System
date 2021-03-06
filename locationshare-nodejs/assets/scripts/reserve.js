'use strict';

var reserve = {};

/*@param {string} date. @param {string} lib*/
function reRender(date, lib) {
    let renderParams = {
        "library": lib
    };
    
    $.get("/renderForPicker", renderParams, function(result) {
        if(result === undefined) {
            console.log("result is undefined");
            return;
        }

        let stringBuilder = "<tbody id=\"temp\">";
        let startHour = moment(date).hour(8).valueOf();
        let endOfDay = moment(date).hour(23).valueOf();
        let today = moment(date).dayOfYear();
        
        result.forEach(function(item) {
            let table = item.table;
            let tableStr = table.replace(/( )+/g,'-');
            let reserved = [];
            for (let time in item.reserved) {//console.log()
                let m = moment(Number(time));
                if (m.dayOfYear() == today) {
                    reserved.push(m.hour());
                }
            };

            stringBuilder = stringBuilder + "<tr><th scope=\"row\">" + table + "</th>";
            let prefix = "<td class=\"rsv\" onclick=\"selecttime(this)\"><input type=\"checkbox\" id=\"";
            let suffix = "/><span></span></td>";
                
                for (let hour = 8; hour < 23; hour++) {
                let id = tableStr + "+" + hour;
                if (hour <= moment(date).hour() || reserved.includes(hour)) {
                    stringBuilder += prefix + id + "\"" + " disabled " + suffix;
                } else {
                    stringBuilder += prefix + id + "\"" + suffix;
                }
                if (hour === 22) {
                    stringBuilder += "</tr>";
                }
            }
        });
        stringBuilder = stringBuilder + "</tbody>"; 
        $('#reserve_table').append(stringBuilder);
    });
}


function selecttime(itself) {
    if(itself != undefined) {
        let checkbox = $(itself).find("input")[0];
        if(checkbox.disabled) {
            return;
        }

        let prev = $(itself).prev(), next = $(itself).next();
        if(!prev.hasClass("rsv")) {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;

                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let tableStr = id.substring(0, k), time = id.substring(k + 1);
                    let table = tableStr.replace(/(-)+/g,' ');

                    $("#start")[0].value = time + ":00";
                    if(!next.find("input")[0].checked) {
                        $("#table")[0].value = table;
                        $("#end")[0].value = time + ":59";
                    }
                    $("td.rsv").not($(itself)).not(next).addClass("inactive");
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c2 = next.find("input")[0];
                if(!c2.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else {
                    $("#start")[0].value = c2.id.substring(c2.id.indexOf('+') + 1) + ":00";
                    next.next().removeClass("inactive");
                }
            }
        }else if(!next.hasClass("rsv")) {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;
                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let tableStr = id.substring(0, k), time = id.substring(k + 1);
                    let table = tableStr.replace(/(-)+/g,' ');

                    $("#end")[0].value = time + ":59";
                    if(!prev.find("input")[0].checked) {
                        $("#table")[0].value = table;
                        $("#start")[0].value = time + ":00";
                    }
                    $("td.rsv").not($(itself)).not(prev).addClass("inactive");
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c1 = prev.find("input")[0];
                if(!c1.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else {
                    $("#end")[0].value = c1.id.substring(c1.id.indexOf('+') + 1) + ":59";
                    prev.prev().removeClass("inactive");
                }
            }
        }else {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;
                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let tableStr = id.substring(0, k), time = id.substring(k + 1);
                    let table = tableStr.replace(/(-)+/g,' ');

                    if(!prev.hasClass("inactive") && !next.hasClass("inactive")) {
                        $("#table")[0].value = table;
                        $("#start")[0].value = time + ":00";
                        $("#end")[0].value = time + ":59";
                        $("td.rsv").not($(itself)).not(prev).not(next).addClass("inactive");
                    }else if(prev.hasClass("inactive")) {
                        $("#start")[0].value = time + ":00";
                        next.next().addClass("inactive");
                    }else {
                        $("#end")[0].value = time + ":59";
                        prev.prev().addClass("inactive");
                    }
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c1 = prev.find("input")[0], c2 = next.find("input")[0];
                if(!c1.checked && !c2.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else if(c1.checked) {
                    $("#end")[0].value = c1.id.substring(c1.id.indexOf('+') + 1) + ":59";
                    prev.prev().removeClass("inactive");
                }else {
                    $("#start")[0].value = c2.id.substring(c2.id.indexOf('+') + 1) + ":00";
                    next.next().removeClass("inactive");
                }
            }
        }
    }
}

function getDateString(date) {
    let today = moment().dayOfYear(), day = moment(date, "MM-DD-YYYY").dayOfYear();
    if(day === today) {
        return moment();
    }else {
        return moment(date, "MM-DD-YYYY").hour(7).startOf('hour');
    }
}

/*
*function
*@param {string} date, @param {string} lib
*/
function show(date, lib) {
    //clear the old table
    if($("#temp").length > 0) {
        $("#temp").remove();
    }

    if(date === undefined || date === null) {
        let dateStr = $('#date')[0].value;
        let moment = getDateString(dateStr);
        date = moment.format();
    }

    if(lib === undefined || lib === null) {
        lib = $('#library')[0].value;
    }else {
        $('#library')[0].value = lib;
    }
    reRender(date, lib);
}

reserve.init = function () {
    let defaultMoment = moment(), defaultDate = defaultMoment.format('MM-DD-YYYY'), defaultLibrary = "carpenter";
    
    if(defaultMoment.hour() >= 22) {
        defaultMoment.add(3, 'hour');
        defaultDate = defaultMoment.format('MM-DD-YYYY');
    }
    //default value for picker
    $('#datepicker')[0].value = defaultDate;
    $('#date')[0].value = defaultDate;
    $('#library')[0].value = defaultLibrary;

    //default render
    reRender(defaultMoment.format(), defaultLibrary);

    //pikaday plugin
    let minDate = defaultMoment.startOf('day');
    let maxDate = moment().add(6, 'day');
    var picker = new Pikaday({ 
        field: $('#datepicker')[0],
        trigger: $('#datepickerTrigger')[0],
        format: 'MM-DD-YYYY',
        minDate: minDate,
        maxDate: maxDate,
        disableDayFn: function(date) {
            if(date < minDate || date > maxDate) {
                return true;
            }else {
                return false;
            }
        },
        onSelect: function(item) {
            let dateStr = picker.toString();
            let moment = getDateString(dateStr), date = moment.format('MM-DD-YYYY');
            $('#datepicker')[0].value = date;
            $('#date')[0].value = date;
            show(moment.format(), null);
        }
    });

    $("#reserve-form").submit(function(event) {
        event.preventDefault();

        let formInfo = $(this).serializeArray(), reserveInfo = {};
        
        let date = moment(formInfo[1].value, "MM-DD-YYYY");
        let start = formInfo[2].value.substring(0, formInfo[2].value.indexOf(":"));
        let end = formInfo[3].value.substring(0, formInfo[2].value.indexOf(":"));
        
        let startTime = moment(date).hour(start).startOf('hour');        
        let endTime = moment(date).hour(end).endOf('hour');
 
        reserveInfo["tabID"] = formInfo[0].value;
        reserveInfo["startTime"] = startTime.valueOf();
        reserveInfo["endTime"] = endTime.valueOf();
        reserveInfo["producedTime"] = moment().valueOf();

        $.post("/makeReservations", reserveInfo, function(result) {
            if (result.status === -1) {
                window.location.replace("/login");
            } else if (result.status === 1) {
                alert("Sorry, the time slot you selected has been taken. Please refresh the page.");
            } else if (result.status === 2) {
                alert("Sorry, but you have booked table in another library at the same time slot.");
            } else  if (result.status === 0) { // success
                let table = formInfo[0].value.replace(/( )+/g, "-");
                $("#" + table + "\\+" + startTime.hour()).attr('disabled', true);
                $("#" + table + "\\+" + endTime.hour()).attr('disabled', true);
                $("td.rsv").each(function() {$(this).removeClass("inactive");});
                $("#table")[0].value = "";
                $("#start")[0].value = "";
                $("#end")[0].value = "";
                alert("Success");
            }
        }).fail(function(err) {
            if (err.status === 400) {
                $('#error-message').text(err.responseText);
            } else if (err.status === 401) {
                window.location.replace("/login");
            }
        });
    });
}

$(document).ready(function() {
    reserve.init();
});
