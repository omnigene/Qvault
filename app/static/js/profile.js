$(function () {
    // 载入年月日下拉框选项，并实现联动
    var [ey,em,ed]=[$(".select.year"),$(".select.month"),$(".select.day")];
    var birth=$("#birth");
    var date=birth.val();
    function loadDay(d,ds){
        ed.empty();
        ed.append("<option value=''></option>")
        for (let day=1;day<=d;day++){ed.append("<option value="+day+">"+day+"</option>");}
        ed.val(ds);
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
    if (date!==""){
        ey.val(date.substr(0,4));
        em.val(date.substr(5,1)==='0'?date.substr(6,1):date.substr(5,2));
        ed.val(date.substr(8,1)==='0'?date.substr(9,1):date.substr(8,2));
    }
    $(".select.year,.select.month").change(function () {
        var [eys,ems,eds]=[$(".year.select :selected").val(),$(".month.select :selected").val(),$(".day.select :selected").val()]
        if (parseInt(ems)===2){loadDay(checkYear(parseInt(eys)),eds);}
        else if ([4,6,9,11].includes(parseInt(ems))){loadDay(30,eds);}
        else{loadDay(31,eds)}
    })

    // 选择图片文件
    var el_upload=$(".upload.img");
    var el_img_modal=$("#imageModal",window.parent.document);
    var el_img_dialog=$("#imageModal-dialog",window.parent.document);
    var el_img_wrap=$(".modal-body.image",window.parent.document);
    var el_img=$(".img-preview",window.parent.document);
    var el_mask=$(".img-mask",window.parent.document);
    var el_range=$(".img-range",window.parent.document);
    var [wrap_w,wrap_h]=[el_img_wrap.width(),el_img_wrap.height()];
    var aspect_ratio,max_w,min_w,step;
    var mask_w,mask_h;
    $(".add-banner,.add-avatar").on("click",function () {
        if ($(this).attr("class")==="add-banner"){
            // el_img_dialog.css({"max-width":"50%","width":"50%"});
            el_img_dialog.css("width",)
            el_mask.css({"width":"576px","height":"128px","border-radius":"0"});
            mask_w=el_mask.width();
            mask_h=el_mask.height();
        } else{
            el_mask.css({"width":"256px","height":"256px","border-radius":"50%"});
            mask_w=el_mask.width();
            mask_h=el_mask.height();
        }
        el_upload.click();
    });
    // 设置滑轨填充跟随滑块
    function slideRange(el,min,max){
        let pct=(parseInt(el.val())-min)/(max-min)*100+"%";
        el.css("background","linear-gradient(to right, #000000 0%, #0049ed "+pct+", #fff "+pct+", #fff 100%)");
    }
    el_upload.change(function (e) {
        el_img.removeAttr("style");
        var files=e.target.files;
        var reader= new FileReader();
        if (files[0]) {reader.readAsDataURL(files[0])}
        reader.onload=function(e){
            el_img.attr("src",e.target.result);
            el_upload.val("");
            var img=new Image();
            img.src=el_img.attr("src");
            img.onload=function () {
                img.width>img.height?el_img.height(el_img_wrap.height()):el_img.width(el_img_wrap.width());
                aspect_ratio=img.width/img.height;
                min_w=aspect_ratio>1?Math.round(mask_h*aspect_ratio):mask_w;
                max_w=img.width;
                step=(max_w-min_w)/20;
                var rv=aspect_ratio>1?el_img.height()*aspect_ratio:el_img.width();
                el_range.attr({"min":min_w,"max":max_w,"step":(max_w-min_w)/20}).val(rv);
                slideRange(el_range,min_w,max_w);
            }
        }
        el_img_modal.modal({backdrop: 'static'});


        // 鼠标滚轮调整图像大小
        el_img_wrap.bind("mousewheel", function(e) {
            const dl=aspect_ratio<1?(wrap_w-mask_w)/5:(wrap_h-mask_h)/5*aspect_ratio;
            console.log(wrap_w,mask_w,dl);
            var w=el_img.width();
            el_img.css("height","auto");
            if (e.originalEvent.wheelDelta>0 && w<max_w){
                w+=dl;
                el_img.width(Math.min(w,max_w));
                el_range.val(Math.round(w));
                slideRange(el_range,min_w,max_w);
            }
            if (e.originalEvent.wheelDelta<0){
                w-=dl;
                if (aspect_ratio>1 && w/aspect_ratio<mask_h){
                    el_img.width(min_w);
                    el_range.val(min_w);
                }else{
                    el_img.width(Math.max(w,mask_w));
                    el_range.val(Math.max(w,mask_w));
                    slideRange(el_range,min_w,max_w);
                }
            }
        })
        // 滑动条调整图像大小
        el_range.on('input',function (){
            el_img.css("height","auto");
            el_img.width(this.value);
            slideRange(el_range,min_w,max_w);
        })


        // 图像拖动
    //     el_img.mousedown(function (e) {
    //         var [ini_x,ini_y]=[e.clientX,e.clientY];
    //         var [img_ix,img_iy]=[el_img.position().left,el_img.position().top];
    //         el_img.mousemove(function (e) {
    //             var [now_x,now_y]=[e.clientX,e.clientY];
    //             var [dx,dy]=[now_x-ini_x,now_y-ini_y];
    //             var [img_ex,img_ey]=[img_ix+dx,img_iy+dy];
    //             el_img.css("position","absolute")
    //             el_img.css("left",img_ex+"px");
    //             el_img.css("top",img_ey+"px");
    //         })
    //         img.mouseleave(function () {
    //             el_img.off("mousemove");
    //         })
    //         img.mouseup(function () {
    //             el_img.off("mousemove");
    //         })
    //     })
    })
    // el_img_modal.on("show.bs.modal",function () {
    //     if (el_add.attr("class")==="add-banner"){
    //         // el_img_dialog.css({"max-width":"50%","width":"50%"});
    //         el_mask.css({
    //             "width":"96%",
    //             "height":"200px",
    //             "border-radius":"0",
    //         })
    //     } else{
    //         el_mask.css({
    //             "border-radius":"50%",
    //             "width":"240px",
    //             "height":"240px",
    //         })
    //     }
    // })
    el_img_modal.on("hide.bs.modal",function () {
        el_img_wrap.unbind("mousewheel");
        // el_mask.attr("style","");
    })

    // 输入框切换效果
    $(".form-input").on({
        focus:function () {
            $(this).parent().css({"border-color":"#004aed","box-shadow":"0 0 15px rgba(0,74,237,0.3)"});
            $(this).prev().find("label").css("color","#004aed");
            $(this).prev().children(":last-child").css("display","block");
            $(this).prev().find(".input-length").empty();
            $(this).prev().find(".input-length").append($(this).val().length);
        },
        blur:function () {
            $(this).parent().removeAttr("style");
            $(this).prev().find("label").removeAttr("style");
            $(this).prev().children(":last-child").removeAttr("style");
        },
        input:function () {
            $(this).prev().find(".max-length").prev().empty();
            $(this).prev().find(".max-length").prev().append($(this).val().length);
            if ($(this).val().length===Number($(this).attr("maxlength"))){
                $(this).prev().find(".max-length").css("color","#004aed");
            } else {
                $(this).prev().find(".max-length").removeAttr("style");
            }
        }
    });
    // 出生日期中年月日切换效果
    var [birthday,label_date]=[$(".input-wrap.date"),$(".input-label.date")];
    $("select").on({
        focus:function () {
            $(this).parent().css({"border":"1.5px solid #004aed"});
            birthday.css({"border-color":"#004aed","box-shadow":"0 0 15px rgba(0,74,237,0.3)"});
            label_date.css("color","#004aed");
        },
        blur:function () {
            $(this).parent().removeAttr("style");
        }
    });
    // 取消出生日期外框效果
    $(document).on('click',':not(birthday)',function () {
        birthday.removeAttr("style");
        label_date.removeAttr("style");
        $(".selector").removeAttr("style");
    })
    birthday.click(function(e){e.stopPropagation();})
    function checkDate(){
        let y,m,d,date;
        let [eys,ems,eds]=[$(".year.select :selected").val(),$(".month.select :selected").val(),$(".day.select :selected").val()]
        eys===""?y="":y=eys;
        ems===""?m="":(ems.length===1)?m='0'+ems:m=ems;
        eds===""?d="":(eds.length===1)?d='0'+eds:d=eds;
        date=y+m+d;
        if ([0,8].includes(date.length)){
            birth.attr("value",date);
            return true;
        }
        else {
            birthday.css({"border-color":"red","box-shadow":"0 0 15px rgba(255,0,0,0.3)"});
            label_date.css("color","red");
            $(".selector").each(function () {
                if ($(this).children(":first-child").val()===""){
                    $(this).css("border","1.5px solid red")
                }
            })
            return false;
        }
    }
    $(".profile-edit button").click(function (e) {
        if (checkDate()){
            $(".user-profile").submit();
        }
    })
})