(function (w) {
    w.hostpath = "../";
    var $ = jQuery.noConflict();
    var pageSetting = {
        "virtualPath": "~/"
    }

    $.mask = function (elm) {
        if ($('#_mask_')[0])
            return; // loading 已经存在, 直接等loading消失

        //mask div
        var maskDiv = $('<div id="_mask_" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 901;display: block;opacity: 0.4;background: #000;filter: Alpha(opacity=40)"></div>');
        var maxHeight = Math.max($(window).height(), $(document.body).height());
        maskDiv.height(maxHeight);
        // elm[0].top = '50%';
        // elm[0].left = '50%';
        elm[0].style.zIndex = '902';

        $(document.body).append(maskDiv);
        $(document.body).append(elm);
    }

    $.unmask = function (elm) {
        $('#_mask_').remove();
        // 这里应该把元素放回到原来母元素中去
    }

    var Tool = function () {
        this.virtualPath = window.hostpath;
        this.AjaxLoadList = {};
        this.Init();
    }
    Tool.prototype = {
        Init: function () {
            this.Page = null; //当前页面
            this.debug = 0;  //0:正式环境，1:PC测试
        },
        //Ajax 请求
        ToAjax: function (url, data, error, success, showload, TimeOut, method, beforeSend, complete) {
            //是否有其它请求插入
            this.AjaxRd = parseInt(Math.random() * 100000, 10);
            var rd = this.AjaxRd;
            //超时设置
            if (TimeOut == null) { TimeOut = 120000; }
            //showload: [null:不显示进度条,0:显示进度条,1:显示进度条成功不消失]. 新增一个值，执行成功函数后取消进度条
            if (showload != null) {
                var timer = this.ShowLoad();
            }

            var hfCurrentHotel = $("#hfCurrentHotel");
            if (hfCurrentHotel.length > 0 && data) {
                data.CurrentHotel = hfCurrentHotel.val();
            }

            $.ajax({ url: url + "?v=" + Math.random()
            , type: method || 'post'
            , contentType: "application/x-www-form-urlencoded;charset=utf-8;"
            , dataType: "json"
            , data: data
            , timeout: TimeOut,
                error: function (json, e) {
                    //屏蔽由于刷新引起错误
                    if (json["readyState"] == "0") return;
                    tl.HideLoad(timer);
                    error(json);
                },
                success: function (json) {
                    if (showload == 0 || showload == 1) {
                        tl.HideLoad(timer);
                    }
                    switch (json.Rcode) {
                        case -300: //无权限
                            window.location.href = window.hostpath + "Other/MessageBox.aspx?msg=" + json.Msg;
                            break;
                        case -100: //错误
                            if (showload == 2)
                                tl.HideLoad(timer);
                            window.location.href = window.hostpath + "Other/MessageBox.aspx";
                            break;
                        case 100: //登录失效
                            if (showload == 2)
                                tl.HideLoad(timer);
                            window.location.href = window.hostpath + "ebookinglogin.aspx";
                            break;
                        case 200:
                            if (json.Script) {
                                eval(json.Script);
                            }
                            break;
                        default:
                            //正常
                            if (showload == 2)
                            { success(json, rd == tl.AjaxRd ? true : false, timer); }
                            else {
                                success(json, rd == tl.AjaxRd ? true : false);
                            }
                            break;
                    }
                },
                beforeSend: function () {
                    if (beforeSend != null && $.type(beforeSend) === 'function') {
                        beforeSend();
                    }
                },
                complete: function () {
                    if (complete != null && $.type(complete) === 'function') {
                        complete();
                    }
                }
            });
        },
        //页面跳转
        ToPage: function (url) {
            window.location.href = url;
        },
        //页面跳转
        ToSubmit: function (url, data) {
            var fm = document.forms[0];
            fm.action = url;
            var el;
            for (var name in data) {
                el = $('#h' + name)[0];
                if (el)
                    el.value = data[name];
                else
                    $(fm).append('<input type="hidden" id="h' + name + '" name="' + name + '" value="' + data[name] + '"/>');
            }
            fm.submit();
        },
        //显示正在加载进度条
        ShowLoad: function (msg) {
            // 预载入图片
            if (!Tool._loadingImg) {
                Tool._loadingImg = new Image();
                Tool._loadingImg.src = '/ebooking/images/loading_50.gif';
            }

            // 延时进度条效果
            var timer = setTimeout(function (waitingText) {
                var loadText = "Loading, please wait...";
                //                if (undefined != waitingText) {
                //                    loadText = waitingText;
                //                }

                if (!Tool._loading)
                    $(document.body).append('<div style="position:fixed; left:50%; top:50%; width:144px; height:90px; margin:-45px 0 0 -112px; padding-left:80px; line-height:90px; overflow:hidden; background:#fff url(/ebooking/images/loading_50.gif) no-repeat 15px center; border-radius:10px;" id="loading">' + loadText + '</div>');
                Tool._loading = Tool._loading || $('#loading');
                Tool._loading.show();
                msg && Tool._loading.text(msg);
                $.mask(Tool._loading);
            }, 200);
            return timer;
        },
        //隐藏正在加载进度条
        HideLoad: function (timer) {
            clearTimeout(timer);
            if (Tool._loading) {
                $.unmask(Tool._loading);
                Tool._loading.hide();
            }
        },
        //全角转半角
        C2H: function (str) {
            var result = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) == 12288) {
                    result += String.fromCharCode(str.charCodeAt(i) - 12256);
                }
                else if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                    result += String.fromCharCode(str.charCodeAt(i) - 65248);
                }
                else
                    result += String.fromCharCode(str.charCodeAt(i));
            }
            return result;
        },
        O2String: function (O) {
            var S = [];
            var J = "";
            if (Object.prototype.toString.apply(O) === '[object Array]') {
                for (var i = 0; i < O.length; i++)
                    S.push(this.O2String(O[i]));
                J = '[' + S.join(',') + ']';
            }
            else if (Object.prototype.toString.apply(O) === '[object Date]') {
                J = "new Date(" + O.getTime() + ")";
            }
            else if (Object.prototype.toString.apply(O) === '[object RegExp]' || Object.prototype.toString.apply(O) === '[object Function]') {
                J = O.toString();
            }
            else if (Object.prototype.toString.apply(O) === '[object Object]') {
                for (var i in O) {
                    var str = typeof (O[i]) == 'string' ? '"' + O[i].replace(/"/g, '“').replace(/\\/g, '\\\\') + '"' : (typeof (O[i]) === 'object' ? this.O2String(O[i]) : O[i]);
                    S.push(i + ':' + str);
                }
                J = '{' + S.join(',') + '}';
            }

            return J;
        },
        DateDiff: function (d1, d2) {
            var day = 24 * 60 * 60 * 1000;
            var checkTime = d1.getTime();
            var checkTime2 = d2.getTime();
            return (checkTime - checkTime2) / day;
        },
        ConvertStr2Date: function (d) {
            var dateArr = d.split("-");
            return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        },
        GetCookie: function (objName) {
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                if (temp[0] == objName)
                    return unescape(temp[1]);
            }
        },
        SetCookie: function (c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString()) + ";path=/";
        },
        DelCookie: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + "=N;expires=" + exp.toGMTString() + ";path=/";
        },
        StopPropagation: function (e) {
            e = e || window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
    }

    var tl = w.tl = new Tool();
})(window);
