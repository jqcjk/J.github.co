/*<div class="ui-filter">
							<div class="filter-select">
								<h3>2014年</h3>
								<span class="btn-select"></span>
							</div>
							<ul class="c" style="display:none;">
								<li>2014年</li>
								<li>2013年</li>
								<li>2012年</li>
							</ul>
						</div>
*/

function dropdownlist(opts) {
    //声明元素组成和变量
    var wrap = $("<div>").addClass('ui-filter'),
	select = $("<div>").addClass('filter-select'),
    $selectText = $("<h3>"),
    $selectButton = $("<span>").addClass("btn-select"),

    optionsContainer = $("<ul>").addClass("filter-option"),
	opt = opts || {};

    var self = this;
    var selectedOption;

    //初始化控件
    selectedValue = opts.selectedValue;
    $selectText.text(selectedValue);
    select.append($selectText).append($selectButton);
	wrap.append(select).append(optionsContainer);
	optionsContainer.hide();

	var lastSelect = selectedValue;

	$selectButton.bind('click', function (event) {
	    $('ul.filter-option').not(optionsContainer).hide();
	    $('div.ui-filter').not(wrap).removeAttr("style");
	    if (optionsContainer.is(":hidden")) {
	        if (optionsContainer.find("li") == null) {
	            optionsContainer.append($("<li id='noOptions'>").append("no data"));
	        }
	        wrap.attr({ "style": "z-index:9999"});
	        optionsContainer.show();
	    }
	    else {
	        wrap.removeAttr("style");
	        optionsContainer.hide();
	    }
	    event.stopPropagation();
	});

    //绑定控件的值
	if (opt.options != null) {
	    var options = opt.options,
            len = opt.options.length;
	    for (var i = 0; i < len; i++) {
	        if (selectedValue == options[i]) {
	           // can do something. like hover etc.
	        }
	        var x = $("<li>").append(options[i]);
	        optionsContainer.append(x);
	    }
	}

    //选择下拉框的值
	optionsContainer.find("li").bind("click", function (event) {
	    var cvalue = $(this)[0].innerText;
	    $selectText.text(cvalue);
	    if (cvalue != lastSelect) {
	        lastSelect = cvalue;
	        if (self.onChange != null)
	            self.onChange();
	    }

	    optionsContainer.hide();
	    event.stopPropagation();
	});

    //指明控件位置
    function placeAt(container) {
        $(container).append(wrap);
    }
    this.placeAt = placeAt;

    //获取控件选中的值
    this.val = function () {
        return $selectText.text();
    };

    this.value = function () {
        return selectedOption;
    }

    //简单赋值事件
    this.onChange = opt.func;

    $("body").unbind("click");
    $("body").bind("click", function (e) {
        $('ul.filter-option').hide();
        $('div.ui-filter').removeAttr("style");
    });
}
