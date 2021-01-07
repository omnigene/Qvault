$(function () {
    // 实现年月日下拉选项框联动
    var [ey,em,ed]=[$(".select.year"),$(".select.month"),$(".select.day")];
    function loadDay(d,sd){
        ed.empty();
        ed.append("<option value=''></option>")
        for (let day=1;day<=d;day++){ed.append("<option value="+day+">"+day+"</option>");}
        ed.val(sd);
    }
    function checkYear(y) {
        if (y%4!==0){return 28}
        else if (y%100===0 && y%400===0){return 29}
        else if (y%100!==0 && y%4===0){return 29}
    }
    (function loadOptions(){
        let date=new Date();
        let year=date.getFullYear();
        while (year>=date.getFullYear()-100){
            ey.append("<option value="+year+">"+year+"</option>");
            year--;
        }
        for (let month=1;month<=12;month++){em.append("<option value="+month+">"+month+"</option>");}
        loadDay(31);
    }());
    $(".select.year,.select.month").change(function () {
        let sd=$(".day.select :selected").text();
        let sm=parseInt($(".month.select :selected").text());
        let sy=parseInt($(".year.select :selected").text());
        if (sm===2){loadDay(checkYear(sy),sd);}
        else if ([4,6,9,11].includes(sm)){loadDay(30,sd);}
        else{loadDay(31,sd)}
    })

    $(".add-banner-img,.add-avatar").on("click",function () {
        $(".upload").click();
    });
    $(".form-input").on({
        focus:function () {
            $(this).parent().css({"border-color":"#004aed","box-shadow":"0 0 15px rgba(0,74,237,0.3)"});
            $(this).prev().find("label").css("color","#004aed");
            $(this).prev().children(":last-child").css("display","block");
            $(this).prev().find(".input-length").empty();
            $(this).prev().find(".input-length").append($(this).val().length);
        },
        blur:function () {
            $(this).parent().css({"border-color":"lightgrey","box-shadow":""});
            $(this).prev().find("label").css("color","rgba(0,0,0,0.5)");
            $(this).prev().children(":last-child").css("display","none");
        },
        input:function () {
            $(this).prev().find(".max-length").prev().empty();
            $(this).prev().find(".max-length").prev().append($(this).val().length);
            if ($(this).val().length===Number($(this).attr("maxlength"))){
                $(this).prev().find(".max-length").css("color","#004aed");
            } else {
                $(this).prev().find(".max-length").css("color","rgba(0,0,0,0.5)");
            }
        }
    });
    var [birthday,label_date]=[$(".input-wrap.date"),$(".input-label.date")];
    $("select").on({
        focus:function () {
            $(this).parent().css({"border":"1.5px solid #004aed"});
            birthday.css({"border-color":"#004aed","box-shadow":"0 0 15px rgba(0,74,237,0.3)"});
            label_date.css("color","#004aed");
        },
        blur:function () {
            $(this).parent().css({"border-color":"lightgrey"});
        }
    });
    $(document).on('click',':not(birthday)',function () {
        birthday.css({"border-color":"lightgrey","box-shadow":""});
        label_date.css("color","rgba(0,0,0,0.5)");
    })
    birthday.click(function (e) {
        e.stopPropagation();
    })
})