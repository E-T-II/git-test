function getFormFields(form, hashignore) {
    var values = form.serializeArray()
      , placeholders = {};
    form.find(":input[placeholder]").each(function(i_not_used, elem) {
        elem = $(elem);
        var name = elem.attr("name");
        void 0 === placeholders[name] ? placeholders[name] = elem.attr("placeholder") : placeholders[name] = ""
    }),
    hashignore && (values = form.find(":input:not(.hashignore)").serializeArray());
    var fields = {};
    for (var index in values)
        if (values.hasOwnProperty(index)) {
            var value = values[index].value
              , name = values[index].name;
            "cb" !== name.substring(0, 2) && (value && name in placeholders && value === placeholders[name] && (value = ""),
            void 0 !== fields[name] ? fields[name] = [fields[name], value].join(",") : fields[name] = value)
        }
    return fields
}
function getUrlForFormFields(form, baseUrl) {
    var fields = getFormFields(form, !0)
      , url = baseUrl;
    url.indexOf("?") <= 0 && (url += "?");
    for (var index in fields)
        if ("cb" !== index.substring(0, 2)) {
            var value = fields[index];
            "status[]" === index && (index = "status"),
            url = url + encodeURIComponent(index) + "=" + encodeURIComponent(value) + "&"
        }
    return "&" === url.substring(url.length - 1) && (url = url.substring(0, url.length - 1)),
    url
}
function Validation(fieldMessages) {
    this.fields = fieldMessages,
    this.getError = function(field) {
        if (!(field instanceof Element))
            return void console.log('Cannot get error because field is not of type "Element"');
        var validity = field.validity
          , name = field.name;
        return field.disabled || "file" === field.type || "reset" === field.type || "submit" === field.type || "button" === field.type || validity.valid ? void 0 : validity.valueMissing && this.fields[name] && this.fields[name].valueMissing ? this.fields[name].valueMissing : validity.typeMismatch && this.fields[name] && this.fields[name].typeMismatch ? this.fields[name].typeMismatch : validity.tooShort && this.fields[name] && this.fields[name].tooShort ? this.fields[name].tooShort : validity.tooLong && this.fields[name] && this.fields[name].tooLong ? this.fields[name].tooLong : validity.badInput && this.fields[name] && this.fields[name].badInput ? this.fields[name].badInput : validity.stepMismatch && this.fields[name] && this.fields[name].stepMismatch ? this.fields[name].stepMismatch : validity.rangeOverflow && this.fields[name] && this.fields[name].rangeOverflow ? this.fields[name].rangeOverflow : validity.rangeUnderflow && this.fields[name] && this.fields[name].rangeUnderflow ? this.fields[name].rangeUnderflow : validity.patternMismatch && this.fields[name] && this.fields[name].patternMismatch ? this.fields[name].patternMismatch : validity.customError && this.fields[name] && this.fields[name].customError ? this.fields[name].customError : "Not valid"
    }
    ,
    this.validPhone = function(value) {
        var REGEX_PHONE_US = /^(\+1?|[1]?)( | ?- ?|\.)?(\(?\d{3,3}\)?)?( | ?- ?|\.)?\d{3,3}( | ?- ?|\.)?\d{4,4}(( | ?- ?|\.)?x\d{1,5})?$/
          , REGEX_PHONE_INTL = /^\+[- .()\d]{6,20}$/
          , PHONE_BLACKLIST = ["1234567890", "0000000000", "1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666", "7777777777", "8888888888", "9999999999"];
        if (!value)
            return !0;
        if (value = value.toString().trim(),
        "+" === value.charAt(0)) {
            if (!REGEX_PHONE_INTL.test(value))
                return !1
        } else {
            if (!REGEX_PHONE_US.test(value))
                return !1;
            var digitsOnly = value.replace(/\D/g, "");
            if (-1 !== PHONE_BLACKLIST.indexOf(digitsOnly))
                return !1;
            if ("555" === digitsOnly.substring(3, 6))
                return !1
        }
        return !0
    }
    ,
    this.validContactName = function(value) {
        return !!/.+\s+.{2,}/.test(value)
    }
    ,
    this.noHtml = function(value) {
        return !/[<>]/.test(value)
    }
}
function getAreas() {
    var keys = new Array;
    for (var key in _assocAreas)
        keys.push(key);
    return keys.join(",")
}
function setAreas(areas) {
    for (var key in areas)
        addArea(areas[key]);
    $selectedAreas = SEARCH_WIDGET.ACTIVE_FORM.find(SEARCH_WIDGET.ClASS_SELECTORS.SELECTEDAREAS),
    $selectedAreas.val(getAreas())
}
function addArea(area) {
    for (var key in _assocAreas)
        if (key == area.placeid)
            return;
    _assocAreas[area.placeid] = area;
    var moreAreaData = [area.placeid, area.name]
      , template = $(".js-more-area-item-template").first().html();
    template = replaceTemplatePlaceholders(template, moreAreaData),
    SEARCH_WIDGET.ACTIVE_FORM.find(".js-more-area-list").append(template).removeClass("hidden"),
    removeRequiredError()
}
function rmArea(areaId, $form) {
    $(".js-more-area-list").find("[data-id=" + areaId + "]").remove(),
    delete _assocAreas[areaId];
    var areas = getAreas();
    0 == areas.length && (addRequiredAreaError(SEARCH_WIDGET.ClASS_SELECTORS.AUTOCOMPLETE),
    $(".js-moreAreaList-list, #moreAreasLinkWrap").addClass("hidden")),
    $(".js-selected-areas-hidden").val(areas);
    var selectedAreas = $form.find(".js-selected-areas-hidden").val();
    if (selectedAreas) {
        selectedAreas.split(",").length <= 10 && ($("#js-selected-areas-hidden").parent().removeClass("has-error"),
        $("#js-listing-error").remove())
    }
}
function openMoreOptions() {
    var url = this.href
      , params = new Array
      , areas = getAreas();
    return "" != areas && (params.push("areas"),
    params.push(areas)),
    $(":input[type=select-one]", "#searchHomesForm").each(function(i, elem) {
        "" != $(elem).val() && (params.push(encodeURIComponent($(elem).attr("name"))),
        params.push(encodeURIComponent($(elem).val())))
    }),
    params.length > 0 && (url += params.join("/") + "/"),
    window.location = url,
    !1
}
function showAreaDYM($form) {
    SEARCH_WIDGET.ACTIVE_FORM = $form;
    var stopSubmit = !1
      , isSingleAreaSearch = !1
      , $searchInput = $form.find(SEARCH_WIDGET.ClASS_SELECTORS.AUTOCOMPLETE).first()
      , isAdvancedForm = $searchInput.attr("data-advanced")
      , selectedArea = $form.find(SEARCH_WIDGET.ClASS_SELECTORS.SELECTEDAREAS).first().val()
      , propertyId = $form.find(SEARCH_WIDGET.ClASS_SELECTORS.PROPERTYID).first().val() || "";
    "false" === isAdvancedForm && (isSingleAreaSearch = !0);
    var area = encodeURIComponent($.trim($searchInput.val() || ""));
    if ((!isSingleAreaSearch && "" !== area || !isSingleAreaSearch && "" === selectedArea || isSingleAreaSearch && "" === area || isSingleAreaSearch && "" === selectedArea) && "" === propertyId && "Custom" !== area) {
        if ("listingSearchEditForm" == $form.context.id)
            return addRequiredAreaError(SEARCH_WIDGET.ClASS_SELECTORS.AUTOCOMPLETE),
            !0;
        var $didYouMeanPlaceHolder = SEARCH_WIDGET.ACTIVE_FORM.find(SEARCH_WIDGET.ClASS_SELECTORS.DYM_PLACEHOLDER)
          , $suggestedAreaModal = SEARCH_WIDGET.ACTIVE_FORM.find(SEARCH_WIDGET.ClASS_SELECTORS.SUGGESTED_AREA_MODAL);
        area && $didYouMeanPlaceHolder.load("/suggestedareasdialog/?searcharea=" + area, function() {
            $(".js-autocomplete-results").addClass("hidden"),
            $suggestedAreaModal.modal("show")
        }),
        stopSubmit = !0
    }
    return $searchInput.blur(),
    stopSubmit
}
function addRequiredAreaError(afterField) {
    $(afterField).parent().addClass("has-error"),
    $('<span class="form-text" id="js-listing-error">A Search Area is required.</span>').insertAfter(afterField),
    $(afterField).closest("form").find(".js-search-area-text").val("").blur()
}
function removeRequiredError() {
    $(".js-selected-areas-hidden").parent().removeClass("has-error"),
    $("#js-listing-error").remove()
}
function toggleNavByPosition(mastheadElement) {
    var scrollZone = mastheadElement.height() - mastheadElement.height() / 4;
    $(window).scrollTop() > scrollZone ? $(".headernav").addClass("active") : $(".headernav").removeClass("active")
}
function openWin(mypage, w, h, scroll) {
    myname = "extra",
    LeftPosition = screen.width ? (screen.width - w) / 2 : 0,
    TopPosition = screen.height ? (screen.height - h) / 2 : 0,
    settings = "height=" + h + ",width=" + w + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars  = " + scroll + ",resizable",
    win = window.open(mypage, myname, settings),
    win.opener = null
}
function encodeString(string) {
    return string = string.replace(/^[\s]+|[\s]+$/g, ""),
    string = string.replace(/\s/g, "+")
}
function replaceTemplatePlaceholders(template, data) {
    return template.replace(/{(\d+)}/g, function(match, number) {
        return void 0 !== data[number] ? data[number] : match
    })
}
function escapeHTML(s, forAttribute) {
    return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
        return ESC_MAP[c]
    })
}
var EnvelopeClass = {
    init: function(p, suppressMsg, showInfoMsg, scrollToTop) {
        $.extend(this, EnvelopeClass);
        var response = !1
          , ptype = typeof p;
        if (this.suppressMsg = suppressMsg,
        "object" == ptype && (p.responseText ? p.responseXML && p.responseXML.baseURI ? response = {
            redirectUrl: p.responseXML.baseURI
        } : (p = p.responseText,
        ptype = "string") : response = p),
        "string" == ptype) {
            if (!(p = $.trim(p)))
                return;
            if ("{" == p.charAt(0) && "}" == p.slice(-1))
                response = this.toObj(p);
            else {
                var parts = p.replace(/[^ -~]+/g, " ").match(/^(.*?)({"redirectUrl".*})\s?(.*)$/);
                if (parts) {
                    p = $.trim(parts[1] || "") + $.trim(parts[3] || "");
                    try {
                        response = this.toObj(parts[2])
                    } catch (e_not_used) {
                        response = !1
                    }
                } else
                    p = "<pre>" + p + "</pre>";
                p.length > 5120 && (p = p.substring(0, 5120) + "<b>...</b>"),
                response && (p = ['<div class="message errorMessage">', '<span class="delete-icon js-delete-uimessage"></span>', '<div class="messageIcon errorMessageIcon"></div>', '<div class="messageBody">', "<h4>AJAX Error</h4>", p, "<br/></div></div>"].join(""),
                this.showMessage(p, "error", scrollToTop))
            }
        }
        if (!response)
            return p = ['<div class="message errorMessage">', '<span class="delete-icon js-delete-uimessage"></span>', '<div class="messageIcon errorMessageIcon"></div>', '<div class="messageBody">', "<h4>Uh-Oh!</h4>An unexpected error occurred with your request. Please try again later or contact customer care.", "<br/></div></div>"].join(""),
            void this.showMessage(p, "error", scrollToTop);
        if (this.fullResponse = response,
        this.form = response.form ? response.form : {},
        response.redirectUrl) {
            var redirectUrl = response.redirectUrl.replace(/%20/g, "+")
              , windowObj = response.redirectTargetTop ? window.top : window;
            return redirectUrl == windowObj.location.pathname + windowObj.location.hash ? windowObj.location.reload() : windowObj.location = redirectUrl,
            !1
        }
        if (Array.isArray(response.triggers) || jQuery.isEmptyObject(response.triggers))
            Array.isArray(response.triggers) && response.triggers.length > 0 && response.triggers.forEach(function(trigger) {
                $(window).trigger(trigger.trigger, trigger.data)
            });
        else
            for (var trigger in response.triggers)
                $(window).trigger(response.triggers[trigger].trigger, response.triggers[trigger].data);
        if (response.payload && response.payload.rows)
            for (var i = 0, rs = response.payload.rows, n = rs.length; i < n; i++)
                for (var k in rs[i])
                    if (rs[i][k] && "string" == typeof rs[i][k])
                        try {
                            rs[i][k] = decodeURIComponent(rs[i][k])
                        } catch (e_not_used) {
                            rs[i][k] = rs[i][k].replace(/%20/g, " ").replace(/%[0-9A-Za-z][0-9A-Za-z]/g, "")
                        }
        if (this.payload = response.payload ? response.payload : {},
        response.message && ("info" !== response.messageType || showInfoMsg) ? this.showMessage(response.message, response.messageType, scrollToTop) : response.messagesUrl && $(window.parent.document.body).find("#messageWrapper").load(response.messagesUrl + " #messageWrapper > div", this.showMessage),
        window.profilerOn && void 0 !== response.profilerContent)
            try {
                profilerAddPage(response.profilerContent)
            } catch (e_not_used) {}
    },
    toObj: function(json) {
        return window.JSON && window.JSON.parse ? window.JSON.parse(json) : new Function("return " + json)()
    },
    showError: function(msg) {
        var p = ['<div class="message errorMessage">', '<span class="delete-icon js-delete-uimessage"></span>', '<div class="messageIcon errorMessageIcon"></div>', '<div class="messageBody">', msg, "<br/></div></div>"].join("");
        $("#messageWrapper div.message").remove(),
        setTimeout(function() {
            EnvelopeClass.showMessage(p, "error")
        }, 500)
    },
    showMessage: function(html, messageType, scrollToTop) {
        if (!this.suppressMsg) {
            var msgDiv = $("#messageWrapper")
              , parentWin = !1;
            0 === msgDiv.length && (msgDiv = $(window.parent.document.body).find("#messageWrapper"),
            msgDiv.find(".message").remove(),
            parentWin = !0),
            0 !== msgDiv.length && (html ? msgDiv.append(html).show().data("complete", !1) : msgDiv.show().data("complete", !1),
            "error" === messageType || "warning" === messageType ? parentWin ? window.parent.scroll(0, 0) : window.scroll(0, 0) : scrollToTop && $("html,body").animate({
                scrollTop: 0
            }, "400"),
            this.message = !0,
            setTimeout(function() {
                msgDiv.data("complete", !0),
                msgDiv = null
            }, 5e3))
        }
    },
    hideMessage: function() {
        var msgDiv = $(window.parent.document.body).find("#messageWrapper");
        msgDiv.html() && !0 === msgDiv.data("complete") && msgDiv.html("").data("complete", !1),
        msgDiv = null
    },
    payload: {},
    fullResponse: !1,
    message: !1,
    suppressMsg: !1
}
  , Envelope = EnvelopeClass.init
  , visionFormSubmit = function($) {
    function processSubmit(data, form) {
        var suppressMsg = form.hasClass("check-form-suppressMsg")
          , envelope = new Envelope(data,suppressMsg)
          , inputs = form.find(":input").removeClass("inputFieldError")
          , errors = [];
        if (!envelope.fullResponse.redirectUrl) {
            form.find("div,label,span").removeClass("inputFieldError"),
            void 0 !== envelope.form && void 0 !== envelope.form.failed && (errors = envelope.form.failed),
            errors.length && $(window).trigger("track_formerrors", errors.join(","));
            for (var i = 0, len = errors.length; i < len; i++) {
                var id = inputs.filter("[name='" + errors[i] + "']").addClass("inputFieldError").attr("id");
                id || (id = inputs.filter("[id='" + errors[i] + "']").addClass("inputFieldError").attr("id")),
                id && (form.find("div,span").filter("[data-for='" + id + "']").addClass("inputFieldError"),
                form.find("label").filter("[for='" + id + "']").addClass("inputFieldError"),
                form.find("select").filter("#" + id).parent(".select-wrapper").addClass("inputFieldError"))
            }
            var $field = inputs.filter(".inputFieldError").first()
              , fieldval = $field.val();
            $field.focus().val("").val(fieldval),
            $("body").css("cursor", "default").find("#loadingMessage").remove(),
            form.trigger("afterSubmit", [envelope, form]).find("button:submit").prop("disabled", !1),
            formSubmitted = !1
        }
    }
    function processHash(e_not_used, form) {
        var fields = getFormFields(form, !0)
          , hash = $.bbq.getState();
        fields && $.param(hash).length > 0 && $.param(fields) != $.param(hash) ? (setFieldsFromHash(form),
        form.trigger("form_change").submit()) : hash ? submitForm(form) : form.submit()
    }
    function setFieldsFromHash(form, resetFields) {
        resetFields = "boolean" == typeof resetFields && resetFields;
        var hash = $.bbq.getState()
          , inputs = form.find(":input").not(":checkbox").not(":button")
          , checkboxes = form.find(":checkbox").filter("[name]").not("[name^='cb']");
        resetFields && (checkboxes.each(function(i_not_used, elem) {
            elem.checked = !1
        }),
        inputs.each(function(i_not_used, elem) {
            $(elem).val("")
        }));
        for (var key in hash)
            if ($.isArray(hash[key])) {
                hash[key] = hash[key][0].split(",");
                for (var index in hash[key])
                    checkboxes.filter("[name='" + key + "[]'][value='" + hash[key][index] + "']").each(function(i_not_used, elem) {
                        elem.checked = !0
                    }),
                    inputs.filter("[name='" + key + "[]']").val(hash[key])
            } else
                checkboxes.filter("[name='" + key + "'][value='" + hash[key] + "']").each(function(i_not_used, elem) {
                    elem.checked = !0
                }),
                inputs.filter("[name='" + key + "']").not("[value='" + hash[key] + "']").val(hash[key])
    }
    function submitForm(form) {
        $("body:not(.mimarket-page):not(.micommunity-page):not(.mischool-page):not(.micompare-page) #messageWrapper div.message").remove(),
        $("body:not(.mimarket-page):not(.micommunity-page):not(.mischool-page):not(.micompare-page) #messageWrapper").hide(),
        $("body").css("cursor", "wait").append('<div id="loadingMessage">Loading</div>');
        var values = form.mlFieldSerializer()
          , action = form.attr("action")
          , method = "get" === (form.attr("method") || "post").toLowerCase() ? $.get : $.post;
        form.find("#" + (form.attr("id") || "form") + "SubmitButton").remove(),
        method(action, values, function(data) {
            processSubmit(data, form)
        }, "text")
    }
    var formSubmitted = !1;
    return $.fn.visionSubmit = function() {
        return this.each(function(i_not_used, form) {
            form = $(form);
            var formId = form.attr("id") || !1
              , hasbbq = $.bbq && formId && form.data("bbq");
            hasbbq && (form.data("bbq", !1),
            $(window).bind("hashchange", function(e) {
                processHash(e, form)
            })),
            form.find("button:submit").prop("disabled", !1).click(function() {
                var button = $(this)
                  , name = button.attr("name")
                  , form = button.closest("form")
                  , i = Date.now() + (1e5 * Math.random()).toFixed()
                  , form_id = form.attr("id") || "form" + i;
                return name && $("<input/>").attr("id", form_id + "SubmitButton").attr("type", "hidden").attr("name", name).attr("value", button.val() || "true").appendTo(form),
                button.blur(),
                !0
            }),
            form.submit(function() {
                if (formSubmitted)
                    return !1;
                formSubmitted = !0;
                var form = $(this);
                if (form.find("button:submit").prop("disabled", !0),
                void 0 !== form.data("validator") && !form.valid())
                    return formSubmitted = !1,
                    form.find("button:submit").prop("disabled", !1),
                    !1;
                if (form.trigger("beforeSubmit"),
                form.data("stopSubmit"))
                    form.find("button:submit").prop("disabled", !1),
                    formSubmitted = !1;
                else if (hasbbq) {
                    var hash = $.param($.bbq.getState() || {})
                      , fields = $.param(getFormFields(form, !0));
                    fields === hash ? submitForm(form) : $.bbq.pushState("#" + fields)
                } else
                    submitForm(form);
                return !1
            })
        })
    }
    ,
    $.fn.mlFieldSerializer = function() {
        return getFormFields(this, !1)
    }
    ,
    $.fn.mlSetFieldsFromHash = function(resetFields) {
        return setFieldsFromHash(this, resetFields)
    }
    ,
    $(document).ready(function() {
        $("form.check-form").visionSubmit(),
        $(document).on("click", ".js-delete-uimessage", function() {
            $(this).parent(".message").fadeOut("fast", function() {
                $(this).remove(),
                0 === $("#messageWrapper div.message").length && $("#messageWrapper").hide()
            })
        }),
        $(document).on("click.envelopeuimessage", ".view-uimessage-display", function(event) {
            $(this).find(".jsMessageClickToClose").is(":visible") && (event.preventDefault(),
            $(this).hide())
        })
    }),
    {
        submitForm: submitForm
    }
}(jQuery)
  , ml = ml || {};
ml.ajaxForm = function($) {
    return $.fn.ajaxForm = function(options) {
        function submitForm() {
            $activeForm.find(":submit").prop("disabled", !0),
            $.ajax({
                method: $activeForm.attr("method"),
                url: $activeForm.attr("action"),
                data: $activeForm.serialize(),
                complete: handleAjaxComplete
            })
        }
        function handleAjaxComplete(data) {
            var response = parseResponse(data);
            settings.success && settings.success.call(this, response),
            $activeForm.find(":submit").prop("disabled", !1)
        }
        function parseResponse(response) {
            var visionResponse = $.fn.visionResponse(settings)
              , parsedResponse = visionResponse.parseResponse(response);
            return $activeForm.find(":submit").prop("disabled", !1),
            parsedResponse
        }
        var $activeForm, settings = $.extend({
            debug: !1,
            ignore: ":hidden",
            rules: {},
            messages: {},
            errorMsgAppendToElem: "",
            successMsg: null,
            successMsgAppendToElem: ".form-group-submit",
            success: null,
            invalidHandler: function() {},
            beforeSubmit: function() {}
        }, options);
        return this.each(function() {
            $activeForm = settings.form = $(this),
            $activeForm.validate({
                debug: settings.debug,
                ignore: settings.ignore,
                rules: settings.rules,
                messages: settings.messages,
                submitHandler: function(e, a) {
                    $activeForm.trigger("beforeSubmit"),
                    settings.beforeSubmit(),
                    $activeForm.data("stopSubmit") || submitForm()
                },
                invalidHandler: settings.invalidHandler
            })
        })
    }
    ,
    {
        showThankYouMessage: function(thankYouMessage) {
            if (thankYouMessage) {
                var $thankYou = $(".js-thank-you");
                $(".js-thank-you-hide").hide(),
                $thankYou.html(thankYouMessage),
                $("html, body").animate({
                    scrollTop: 0
                }, 500)
            }
        }
    }
}(jQuery),
$.validator.setDefaults({
    highlight: function(element) {
        $(element).closest(".form-group").addClass("has-error")
    },
    unhighlight: function(element) {
        $(element).closest(".form-group").removeClass("has-error")
    },
    errorElement: "span",
    errorClass: "form-text",
    errorPlacement: function(error, element) {
        element.parent(".input-group").length ? error.insertAfter(element.parent()) : error.insertAfter(element)
    }
}),
function($) {
    $.fn.ajaxRequest = function(options) {
        function handleAjaxComplete(data) {
            var response = parseResponse(data);
            settings.success && settings.success.call(this, response)
        }
        function parseResponse(response) {
            return $.fn.visionResponse(settings).parseResponse(response)
        }
        var $elem, settings = $.extend({
            method: "POST",
            url: "",
            data: {},
            successMsg: null,
            successMsgAppendToElem: ".form-group-submit",
            successDisplayLevel: "section",
            errorMsgAppendToElem: ".js-error-message",
            errorDisplayLevel: "page",
            success: null
        }, options);
        return this.submit = function() {
            $.ajax({
                method: settings.method,
                url: settings.url,
                data: settings.data,
                complete: handleAjaxComplete
            })
        }
        ,
        this.each(function() {
            $elem = $(this)
        })
    }
}(jQuery),
function($) {
    $.fn.visionResponse = function(options) {
        function displayMessage(response) {
            "error" === response.messageType ? "" !== response.message && errorMessage(response) : settings.successMsg && successMessage(response)
        }
        function errorMessage(response) {
            var $jsMessagePlaceholder = $(settings.errorMsgAppendToElem ? settings.errorMsgAppendToElem : ".js-page-message-placeholder");
            if ("section" === settings.errorDisplayLevel)
                ;
            else if ("inline" === settings.errorDisplayLevel)
                ;
            else {
                $jsMessagePlaceholder.empty();
                var message = '<div class="alert ' + messageTypeMap.error + ' alert-dismissible js-page-message fade in show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="ion-ios-close"></i></span></button><span class="js-message">' + response.message + "</span></div>";
                $jsMessagePlaceholder.append(message).show();
                try {
                    $("html,body").animate({
                        scrollTop: $(".js-section-error").offset().top - 150
                    }, "slow")
                } catch (e) {}
                if (settings.form && response.form && response.form.failed)
                    for (var failedFields = response.form.failed, i = 0; i < failedFields.length; i++)
                        settings.form.find("[name=" + failedFields[i] + "]").parents(".form-group").addClass("has-error");
                settings.errorMsgAppendToElem || $("html,body").animate({
                    scrollTop: 0
                }, 400)
            }
        }
        function successMessage(response) {
            if ("page" === settings.successDisplayLevel)
                ;
            else if ("inline" === settings.successDisplayLevel)
                ;
            else {
                var $successMsgAppendToElem = $(settings.successMsgAppendToElem);
                if (settings.errorMsgAppendToElem) {
                    var $jsMessagePlaceholder = $(settings.errorMsgAppendToElem);
                    $jsMessagePlaceholder.hide().empty()
                }
                var successMessage = "boolean" == typeof settings.successMsg ? response.message : settings.successMsg;
                $successMsgAppendToElem.append('<span class="success italics">' + successMessage + "</span>").show(),
                setTimeout(function() {
                    $successMsgAppendToElem.find(".success").fadeOut(200, function() {
                        $(this).remove()
                    }).end().hide()
                }, successMsgTimeout)
            }
        }
        var settings = $.extend({
            errorDisplayLevel: "page",
            successDisplayLevel: "section",
            form: null
        }, options)
          , successMsgTimeout = 1e4
          , messageTypeMap = {
            success: "alert-success",
            notification: "alert-info",
            communication: "alert-info",
            recommendation: "alert-info",
            info: "alert-info",
            warning: "alert-warning",
            error: "alert-danger"
        };
        return this.parseResponse = function(r) {
            if (4 !== r.readyState || 200 !== r.status)
                return null;
            var response = {};
            try {
                return response = JSON.parse(r.responseText),
                displayMessage(response),
                response
            } catch (e) {
                return response = {},
                response.messageType = "error",
                response.message = "There was an error during your request.  Please try again later.",
                response.redirectUrl = "",
                response
            }
        }
        ,
        this.each(function() {
            $elem = $(this)
        })
    }
}(jQuery);
var ml = ml || {};
ml.contactPreferences = function($) {
    var isSingleDisplayPhoneField = !0
      , init = function() {
        var pageName = getPageName();
        isSingleDisplayPhoneField = "mytools" !== pageName,
        initEvents(),
        isSingleDisplayPhoneField && initPhoneField()
    }
      , getPageName = function() {
        return window.location.pathname.split("/")[1]
    }
      , initEvents = function() {
        var $phoneInput = $(".js-phone-input");
        isSingleDisplayPhoneField ? ($(".js-phone-dropdown").on("hide.bs.dropdown", handlePhoneSelection),
        $(".js-video-chat-checkbox").on("click", handleVideoChatPrefClickForSinglePhoneField),
        $(".js-pref-type-checkboxes").on("click", handlePrefTypeClickForSinglePhoneField),
        $phoneInput.closest("form").submit(function() {
            validateVisiblePhone()
        })) : ($(".js-video-chat-checkbox").on("click", handleVideoChatPrefClickForMultiPhoneField),
        $(".js-pref-type-checkboxes").on("click", handlePrefTypeClickForMultiPhoneField)),
        $phoneInput.blur(function() {
            validatePhones()
        })
    }
      , initPhoneField = function() {
        $(".js-cell-phone").val() ? showCellPhoneField() : $(".js-home-phone").val() ? showHomePhoneField() : $(".js-work-phone").val() && showWorkPhoneField()
    }
      , handlePhoneSelection = function(e) {
        if (e.stopPropagation(),
        e.clickEvent) {
            switch (e.clickEvent.target.value) {
            case "CELL":
                showCellPhoneField();
                break;
            case "HOME":
                showHomePhoneField();
                break;
            case "WORK":
                showWorkPhoneField()
            }
        }
    }
      , handleVideoChatPrefClickForSinglePhoneField = function(e) {
        e.stopPropagation(),
        showCellPhoneField()
    }
      , handleVideoChatPrefClickForMultiPhoneField = function(e) {
        e.stopPropagation(),
        validatePhones()
    }
      , handlePrefTypeClickForSinglePhoneField = function(e) {
        e.stopPropagation(),
        "Text" === e.target.getAttribute("data-js-pref-code") && showCellPhoneField()
    }
      , handlePrefTypeClickForMultiPhoneField = function(e) {
        e.stopPropagation();
        var code = e.target.getAttribute("data-js-pref-code");
        "Text" !== code && "Phone" !== code || validatePhones()
    }
      , showCellPhoneField = function() {
        var $phoneInput = $(".js-cell-phone")
          , newButtonName = $(".js-pick-list-item[value=CELL]").text();
        if (!newButtonName)
            return void console.error("Cell phone button from picklist was not found");
        changePhoneButtonText(newButtonName),
        changePhoneInputValue($phoneInput)
    }
      , showHomePhoneField = function() {
        var $phoneInput = $(".js-home-phone")
          , newButtonName = $(".js-pick-list-item[value=HOME]").text();
        if (!newButtonName)
            return void console.error("Home phone button from picklist was not found");
        changePhoneButtonText(newButtonName),
        changePhoneInputValue($phoneInput)
    }
      , showWorkPhoneField = function() {
        var $phoneInput = $(".js-work-phone")
          , newButtonName = $(".js-pick-list-item[value=WORK]").text();
        if (!newButtonName)
            return void console.error("Work phone button from picklist was not found");
        changePhoneButtonText(newButtonName),
        changePhoneInputValue($phoneInput)
    }
      , handleCellPhoneValidationError = function(hasCellPhoneError, hasHomePhoneError, hasWorkPhoneError) {
        hasCellPhoneError ? showCellPhoneField() : hasHomePhoneError ? showHomePhoneField() : hasWorkPhoneError && showWorkPhoneField()
    }
      , changePhoneButtonText = function(newButtonName) {
        $(".js-phone-button").text(newButtonName)
    }
      , changePhoneInputValue = function($phoneInput) {
        $(".js-phone-input").hide(),
        $phoneInput.show(),
        validateVisiblePhone()
    }
      , validateVisiblePhone = function() {
        setTimeout(function() {
            $(".js-phone-input:visible").valid()
        }, 0)
    }
      , validatePhones = function() {
        setTimeout(function() {
            $(".js-phone-input").valid()
        }, 0)
    };
    return {
        init: init,
        invalidHandler: function(validator) {
            var hasCellPhoneError = validator.errorMap.hasOwnProperty("cellPhone")
              , hasHomePhoneError = validator.errorMap.hasOwnProperty("homePhone")
              , hasOfficePhoneError = validator.errorMap.hasOwnProperty("officePhone");
            (hasCellPhoneError || hasHomePhoneError || hasOfficePhoneError) && handleCellPhoneValidationError(hasCellPhoneError, hasHomePhoneError, hasOfficePhoneError)
        }
    }
}(jQuery),
$(document).ready(function() {
    $("#js-contact-preferences").length && ml.contactPreferences.init()
});
var ml = ml || {};
ml.saveSearch = function($) {
    var init = function(refresh) {
        bindEvents(refresh)
    }
      , actionOptionChangeHandler = function(e) {
        var option = $(e.currentTarget)
          , $form = $("#js-listing-save-form");
        "update" == option.val() ? ($form.find(".js-update-field").prop("disabled", !1),
        $form.find(".js-insert-field").prop("disabled", !0),
        $("#js-selected-search-name").prop("disabled", !1)) : ($form.find(".js-insert-field").prop("disabled", !1),
        $form.find(".js-update-field").prop("disabled", !0),
        $("#js-selected-search-name").prop("disabled", !0))
    }
      , bindEvents = function(refresh) {
        var $form = $("#js-listing-save-form");
        $form.on("change", ":radio", actionOptionChangeHandler),
        $form.on("change", "select", searchSelectChangeHandler),
        $(".modal").on("hidden.bs.modal.saveSearch", function() {
            refresh ? window.location.reload() : saveSearchHiddenModalHandler()
        }),
        $(document).on("listingSearchSaveCompleted", updateMySearches),
        $form.validate({
            rules: {
                name: {
                    noHTML: !0
                },
                searchNameText: {
                    noHTML: !0
                }
            },
            messages: {
                name: {
                    noHTML: ml.messages.error.noHTML
                },
                searchNameText: {
                    noHTML: ml.messages.error.noHTML
                }
            }
        })
    }
      , searchSelectChangeHandler = function(e) {
        var $form = $("#js-listing-save-form")
          , select = $(e.currentTarget);
        $form.find("#js-selected-search-name").val(select.find(":selected").text())
    }
      , saveSearchHiddenModalHandler = function(e) {
        unBindEvents();
        var $modal = $(this).data("bs.modal");
        void 0 !== $modal && $modal.$element.remove()
    }
      , unBindEvents = function(e) {
        var $form = $("#js-listing-save-form");
        $(".modal").off("hidden.bs.modal.saveSearch", saveSearchHiddenModalHandler),
        $form.off(".saveSearch")
    }
      , updateMySearches = function() {
        var items = [];
        $(".js-saved-searches-heading").length && $.ajax({
            method: "POST",
            url: "/ajax/listingsearch/getsavedsearches/",
            success: function(response) {
                var envelope = new Envelope(response);
                $(".js-saved-search-item").remove();
                for (var i = 0, noOfItems = envelope.payload.length; i < noOfItems; i++)
                    items.push('<a class="js-saved-search-item dropdown-item text-wrap" href="/map/searchid/' + envelope.payload[i].searchId + "/" + envelope.payload[i].searchURI + '">' + envelope.payload[i].searchName + "</a>");
                $(".js-saved-searches-heading").after(items.join(""))
            }
        })
    };
    return {
        init: init
    }
}(jQuery),
$(document).ready(function() {
    $("#js-listing-save-form").length && ml.saveSearch.init()
});
var _assocAreas = {}
  , SEARCH_WIDGET = {
    ACTIVE_FORM: null,
    ClASS_SELECTORS: {
        AUTOCOMPLETE: ".js-search-area-text",
        SELECTEDAREAS: ".js-selected-areas-hidden",
        DYM_PLACEHOLDER: ".js-did-you-mean-placeholder",
        SUGGESTED_AREA_MODAL: ".js-suggest-area-modal",
        MORE_AREAS: ".js-more-areas-hidden"
    }
};
$(document).ready(function() {
    $(".js-search-form-widget").each(function() {
        var isAdvancedSearch = $(this).find(".js-search-area-text").first().data("advanced") || !1
          , isLocationOnly = $(this).find(".js-search-area-text").first().data("location") || !1;
        ml.listingSearch.init($(this), isAdvancedSearch, isLocationOnly)
    }),
    $("#min-price, #max-price, #minprice, #maxprice").bind("keypress", function(e) {
        var regex = /[0-9\b\d]+/
          , key = String.fromCharCode(e.charCode ? e.charCode : e.which);
        if (!regex.test(key) && 37 !== key && 39 !== key && 9 !== key && "tab" !== e.key.toLowerCase() && "arrowleft" !== e.key.toLowerCase() && "arrowright" !== e.key.toLowerCase())
            return e.preventDefault(),
            !1
    })
});
var ml = ml || {};
ml.listingSearch = function() {
    var init = function(formElement, isAdvancedSearch, isLocationOnly) {
        if ("listings" === window.location.pathname.split("/")[1]) {
            var filters = $($(".js-search-form-widget").first()).serializeObject()
              , searchCity = null
              , searchRegion = null
              , listingIds = [];
            $(".js-listing-record").each(function(i) {
                listingIds.push($(this).data("mlsid") + "|" + $(this).data("propertyid")),
                0 === i && (searchCity = $(this).data("city"),
                searchRegion = $(this).data("state"))
            }),
            ml.fbPixel.trackSearch(listingIds, searchCity, filters.beds, filters.baths, filters.minprice, filters.maxprice, null, searchRegion)
        }
        isAdvancedSearch && parseAddAreaData(formElement),
        bindEvents(!0),
        initSuggestAreaModal(formElement),
        initAutocomplete(isAdvancedSearch, isLocationOnly, formElement),
        initAjaxForm(formElement)
    }
      , bindEvents = function(useRelativeSelectors) {
        $(document).on("hide.bs.modal", unbindEvents),
        $(document).on("click.editSavedSearch", ".js-delete-area", function() {
            rmArea($(this).parent(".js-more-area-item").attr("data-id"), $(".js-more-area-item").closest("form"))
        }),
        $(document).on("click.editSavedSearch", "#moreOptions", "#searchHomesForm", openMoreOptions),
        $(document).on("click.editSavedSearch", "#advancedSearch", "#searchHomesForm", openMoreOptions),
        $(document).on("beforeSubmit.listingSearch", "#mlMapSearchForm, .js-search-form, .js-search-form-widget", function() {
            $(this).data("stopSubmit", showAreaDYM($(this), useRelativeSelectors))
        })
    }
      , unbindEvents = function(e) {
        var $target = $(e.target);
        $(".js-autocomplete-results").removeClass("hidden"),
        $target.find("#js-search-area-text").length && $(document).off(".editSavedSearch")
    }
      , initAjaxForm = function($form) {
        $form.hasClass("js-listing-search-full-form") && initFullForm($form),
        $form.hasClass("js-listing-search-sidebar-form") && initSideBarForm($form),
        $form.hasClass("js-listing-search-edit-form") && initEditForm($form),
        $form.hasClass("js-listing-search-compact-form") && initCompactForm($form)
    }
      , initCompactForm = function($form) {
        $form.find(SEARCH_WIDGET.ClASS_SELECTORS.SELECTEDAREAS).val(""),
        $form.ajaxForm({
            rules: {},
            success: function(response) {
                "/registration" === response.redirectUrl ? ml.registration.modals.initialRegistration({
                    trigger: "svsh"
                }, function() {
                    $form.submit()
                }) : window.location.href = response.redirectUrl
            }
        })
    }
      , initFullForm = function($form) {
        $form.ajaxForm({
            rules: {
                remarks: "alphaNumCommaQuoteDash"
            },
            messages: {
                remarks: ml.messages.error.alphaNumCommaQuoteDash
            },
            success: function(response) {
                "/registration" === response.redirectUrl ? ml.registration.modals.initialRegistration({
                    trigger: "svsh"
                }, function() {
                    $form.submit()
                }) : "error" !== response.messageType && (window.location.href = response.redirectUrl)
            }
        })
    }
      , initSideBarForm = function($form) {
        $form.ajaxForm({
            rules: {},
            success: function(response) {
                "/registration" === response.redirectUrl ? ml.registration.modals.initialRegistration({
                    trigger: "svsh"
                }, function() {
                    $form.submit()
                }) : window.location.href = response.redirectUrl
            }
        })
    }
      , initEditForm = function($form) {
        $form.ajaxForm({
            rules: {
                name: {
                    noHTML: !0
                }
            },
            messages: {
                name: {
                    noHTML: ml.messages.error.noHTML
                }
            },
            success: function(response) {
                "error" !== response.messageType && location.reload()
            }
        })
    }
      , initAutocomplete = function(isAdvancedSearch, isLocationOnly, $form) {
        var $selectedAreas = $form.find(SEARCH_WIDGET.ClASS_SELECTORS.SELECTEDAREAS).first()
          , $autocomplete = $form.find(".js-search-area-text").first()
          , useElasticSearch = !!$autocomplete.data("elastic-search")
          , excludeSearchTypes = $autocomplete.data("elastic-exclude-search-types") ? $autocomplete.data("elastic-exclude-search-types") : null;
        if (void 0 === $autocomplete.autocomplete("instance")) {
            var ac = $autocomplete.autocomplete({
                minLength: 2,
                delay: 300,
                appendTo: ".js-autocomplete-results",
                source: function(request, response) {
                    var term = request.term;
                    if (/[^0-9A-Za-z ,-.]+/.test(term) || !term)
                        return void response([]);
                    if (term = term.trim(),
                    term.length < 2)
                        return void response([]);
                    var data = {
                        q: term,
                        limit: 15
                    };
                    useElasticSearch && (data.elastic = !0),
                    excludeSearchTypes && (data.excludesearchtypes = excludeSearchTypes),
                    $.ajax({
                        url: "/ajax/searcharea/jsonlist/",
                        type: "GET",
                        cache: !1,
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            var envelope = new Envelope(data);
                            response(void 0 !== envelope.payload.json && "null" !== envelope.payload.json ? $.map(JSON.parse(envelope.payload.json), function(item) {
                                switch (item.LocationSearchType.toLowerCase()) {
                                case "place":
                                    item.Group = "locations";
                                    break;
                                case "address":
                                case "listing":
                                    item.Group = "listings"
                                }
                                return isLocationOnly ? "Place" == item.LocationSearchType ? item : null : item
                            }) : [])
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            response([])
                        }
                    })
                },
                open: function(event, ui) {
                    var acData = $(this).autocomplete("instance")
                      , term = acData.term;
                    hideAutoCompleteHelpText();
                    var $listElements = acData.menu.element.find("li").not(".ui-menu-group");
                    $listElements.each(function() {
                        term = term.replace(/[[\]\(\)\.\+\*\\\/]/gi, "");
                        var keywords = term.split(" ").join("|")
                          , formattedText = $(this).text().replace(new RegExp("(" + keywords + ")","gi"), "<strong>$1</strong>");
                        $(this).html(formattedText)
                    }),
                    $listElements.length >= 1 && acData.menu.focus("focus", $listElements.first())
                },
                select: function(event, ui) {
                    SEARCH_WIDGET.ACTIVE_FORM = $form,
                    listingSearchSelect(event, ui, $autocomplete, isAdvancedSearch, $selectedAreas)
                },
                response: function(event, ui) {
                    isAdvancedSearch || $selectedAreas.val("")
                },
                focus: function(event, ui) {
                    event.preventDefault()
                }
            });
            ac.data("ui-autocomplete")._renderMenu = function(ul, items) {
                var self = this
                  , currentGroup = "";
                $.each(items, function(index, item) {
                    if (currentGroup !== item.Group) {
                        "" !== currentGroup && $("<hr>").appendTo(ul);
                        var icon = "";
                        switch (item.Group) {
                        case "locations":
                            icon = "icon-ml-pin";
                            break;
                        case "listings":
                            icon = "icon-ml-home"
                        }
                        $("<li>").attr("class", "ui-menu-group").attr("aria-label", item.Group).append('<i class="' + icon + '"></i><span>' + item.Group + "</span>").appendTo(ul),
                        currentGroup = item.Group
                    }
                    self._renderItem(ul, item)
                }),
                setTimeout(function() {
                    $(".ui-menu-group").removeClass("ui-menu-item")
                }, 100)
            }
            ,
            ac.data("ui-autocomplete")._renderItem = function(ul, item) {
                var locationAddressArray = item.Address ? [item.Address, item.City, item.State] : [item.City, item.State]
                  , display = "Place" === item.LocationSearchType ? item.LocationSearchName : locationAddressArray.join(", ");
                return item.hasOwnProperty("Zip") && "Address" === item.LocationSearchType && (display += "  " + item.Zip),
                "Listing" === item.LocationSearchType && (display += " (ID: " + item.LocationSearchId + ")"),
                $("<li>").attr("data-value", item.LocationSearchId).attr("data-type", item.LocationSearchType).attr("aria-label", item.LocationSearchId).data("ui-autocomplete-item", item).append(display).appendTo(ul)
            }
            ,
            $autocomplete.focus(function(e) {
                showAutoCompleteHelpText(e, isLocationOnly)
            }),
            $autocomplete.blur(function(e) {
                hideAutoCompleteHelpText(e)
            })
        }
    }
      , hideAutoCompleteHelpText = function() {
        $("#js-autocomplete-help").remove()
    }
      , showAutoCompleteHelpText = function(e, isLocationOnly) {
        var $acInput = $(e.target)
          , helpHtml = '<div id="js-autocomplete-help" class="autocomplete-help"><div class="heading font-size-medium bold">Search Examples</div><div class="ac-help-set"><span class="ac-help-label">City</span><span class="ac-help-value">Springfield</span></div><div class="ac-help-set"><span class="ac-help-label">Neighborhood</span><span class="ac-help-value">Downtown</span></div>';
        isLocationOnly || (helpHtml += '<div class="ac-help-set"><span class="ac-help-label">Address</span><span class="ac-help-value">123 Main Street</span></div><div class="ac-help-set"><span class="ac-help-label">Listing</span><span class="ac-help-value">12345 (Listing ID)</span></div>'),
        helpHtml += "</div>",
        $acInput.after(helpHtml)
    }
      , initSuggestAreaModal = function($form) {
        $form.find(SEARCH_WIDGET.ClASS_SELECTORS.SUGGESTED_AREA_MODAL).modal({
            show: !1
        })
    }
      , listingSearchSelect = function(event, ui, $autocomplete, isAdvancedSearch, $selectedAreas) {
        var isSearchPdpPage = $("#js-pdp-search-main-panel").length > 0;
        if (!$.isEmptyObject(ui.item)) {
            if ($selectedAreas.val().split(",").length >= 10)
                return $autocomplete.parent().addClass("has-error"),
                void $('<span class="form-text" id="js-listing-error">Search is limited to 10 areas.</span>').insertAfter("#js-search-area-text");
            if ("place" !== ui.item.LocationSearchType.toLowerCase()) {
                var listingUrl = "/listing/mlsid/" + ui.item.MlsListId + "/propertyid/" + ui.item.LocationSearchId + "/";
                isSearchPdpPage ? (ml.pdpSearchInterfaceService.updatePdpContent(ui.item.LocationSearchId, ui.item.MlsListId),
                ml.pdpSearchInterfaceService.setState(ml.pdpSearchInterfaceService.getValidStates().PDP)) : window.location = listingUrl
            } else if (isAdvancedSearch) {
                var placeId = parseInt(ui.item.LocationSearchId)
                  , areas = {};
                areas[placeId] = {
                    name: ui.item.LocationSearchName ? ui.item.LocationSearchName : ui.item.name,
                    placeid: placeId
                },
                setAreas(areas),
                $autocomplete.val("").blur()
            } else {
                $selectedAreas.val(ui.item.LocationSearchId);
                var $form = $autocomplete.parents("form")
                  , visibleFields = $form.find("input:visible, select:visible").length;
                1 === $("#js-filters-form").length ? $(document).trigger("placeSearchSubmit", ui.item) : visibleFields <= 1 ? SEARCH_WIDGET.ACTIVE_FORM.submit() : window.setTimeout(function() {
                    $autocomplete.val(ui.item.LocationSearchName)
                }, 10),
                $autocomplete.blur()
            }
        }
    }
      , parseAddAreaData = function($form) {
        _assocAreas = {},
        $moreAreas = $form.find(SEARCH_WIDGET.ClASS_SELECTORS.MORE_AREAS),
        SEARCH_WIDGET.ACTIVE_FORM = $form;
        var data = $moreAreas.val() || "";
        if ("" != data)
            try {
                setAreas(JSON.parse("{" + data + "}"), $form)
            } catch (e) {
                console.log("could not set areas")
            }
    };
    return {
        init: init,
        listingSearchSelect: listingSearchSelect
    }
}();
var ml = ml || {};
ml.listingSearchFilters = function() {
    var multiInputHiddenFields = [{
        visibleInput: ".js-select-baths",
        hiddenInput: "#js-hidden-baths"
    }, {
        visibleInput: ".js-select-beds",
        hiddenInput: "#js-hidden-beds"
    }, {
        visibleInput: ".js-select-min-sq-ft",
        hiddenInput: "#js-hidden-min-sq-ft",
        rangeValue: "min",
        pairedVisibleInput: ".js-select-max-sq-ft",
        pairedHiddenInput: "#js-hidden-max-sq-ft"
    }, {
        visibleInput: ".js-select-max-sq-ft",
        hiddenInput: "#js-hidden-max-sq-ft",
        rangeValue: "max",
        pairedVisibleInput: ".js-select-min-sq-ft",
        pairedHiddenInput: "#js-hidden-min-sq-ft"
    }, {
        visibleInput: ".js-select-min-acres",
        hiddenInput: "#js-hidden-min-acres",
        rangeValue: "min",
        pairedVisibleInput: ".js-select-max-acres",
        pairedHiddenInput: "#js-hidden-max-acres"
    }, {
        visibleInput: ".js-select-max-acres",
        hiddenInput: "#js-hidden-max-acres",
        rangeValue: "max",
        pairedVisibleInput: ".js-select-min-acres",
        pairedHiddenInput: "#js-hidden-min-acres"
    }, {
        visibleInput: ".js-select-days-on-website",
        hiddenInput: "#js-hidden-days-on-website"
    }, {
        visibleInput: ".js-input-remarks",
        hiddenInput: "#js-hidden-remarks"
    }, {
        visibleInput: ".js-checkbox-open-house",
        hiddenInput: "#js-hidden-open-house",
        checkboxValueType: "bool"
    }, {
        visibleInput: ".js-checkboxes-status-filters input:checkbox",
        hiddenInput: "#js-hidden-status-filter",
        checkboxValueType: "statusFilters"
    }, {
        visibleInput: ".js-checkboxes-property-types input:checkbox",
        hiddenInput: "#js-hidden-property-types",
        checkboxValueType: "string"
    }]
      , priceRangeValues = {}
      , init = function() {
        bindEvents(),
        mapFilterStatusToCheckboxes(),
        setFormBySelectedListingType(),
        !$("#collapse1").length && $("#collapse2").length ? $("#collapse2").collapse("show") : $("#collapse1").length || $("#collapse2").length || $("#collapse3").collapse("show")
    }
      , bindEvents = function() {
        $(".js-top-listing-types").on("change", handleTopListingTypeChange),
        $(".js-reset-filters").on("click", handleResetFilters),
        multiInputHiddenFields.forEach(function(field) {
            $(field.visibleInput).on("change", function(e) {
                updateFieldHandler(e, field),
                $(e.target).hasClass("js-filter-bar-select") && filterBarSelectElementHandler(e)
            })
        }),
        $("[price-dropdown-display-mode] .custom-combo-select-wrapper input").on("focus", function(e) {
            var inputName = $(e.target).attr("data-input-source")
              , parent = $(e.target).parents("[price-dropdown-display-mode]")[0]
              , comboOn = $(parent).find('.custom-combo-select-wrapper[data-input-bind="' + inputName + '"]')[0]
              , comboOff = $(parent).find('.custom-combo-select-wrapper:not([data-input-bind="' + inputName + '"])')[0];
            $(comboOn).addClass("open"),
            $(comboOff).removeClass("open")
        }),
        $("[price-dropdown-display-mode] .custom-combo-select-wrapper .input-suggestions a").on("click", handlePriceDropdownClick),
        $("[price-dropdown-display-mode] .custom-combo-select-wrapper input").on("input", updatePriceFieldOnInput),
        $("[price-dropdown-display-mode] .custom-combo-select-wrapper input").on("blur", validateAndUpdatePriceInput),
        $("[price-dropdown-display-mode] .custom-combo-select-wrapper input").on("keydown", function(e) {
            "enter" === e.key.toLowerCase() && validateAndUpdatePriceInput(e)
        }),
        $(".price-dropdown-wrapper").on("show.bs.dropdown", function() {
            priceRangeValues = {
                minPrice: $("#js-min-price").val(),
                maxPrice: $("#js-max-price").val()
            }
        }),
        $(".price-dropdown-wrapper").on("hidden.bs.dropdown", function() {
            priceRangeValues.minPrice == $("#js-min-price").val() && priceRangeValues.maxPrice == $("#js-max-price").val() || (priceRangeValues.minPrice = priceRangeValues.minPrice != $("#js-min-price").val() ? $("#js-min-price").val() : priceRangeValues.minPrice,
            priceRangeValues.maxPrice = priceRangeValues.maxPrice != $("#js-max-price").val() ? $("#js-max-price").val() : priceRangeValues.maxPrice,
            ml.pdpSearchInterfaceService.performSearch())
        }),
        $(".js-top-listing-types").on("change", function(e) {
            switch ($(e.target).val()) {
            case "Lease Rent":
                $("[price-dropdown-display-mode]").attr("price-dropdown-display-mode", "for-rent");
                break;
            case "Resale New":
            default:
                $("[price-dropdown-display-mode]").attr("price-dropdown-display-mode", "for-sale")
            }
        }),
        $(document).on("click.bs.dropdown.data-api", ".js-dropdown-keep-open", function(e) {
            "submit" !== e.target.type && "modal" !== e.target.dataset.toggle && e.stopPropagation()
        })
    }
      , handlePriceDropdownClick = function(e) {
        var parents = $(e.target).parents(".custom-combo-select-wrapper")
          , input = $(parents[0]).find("input")
          , value = $(e.target).text();
        $(input).val(value),
        validateAndUpdatePriceInput(e),
        $(e.target).focus()
    }
      , validateAndUpdatePriceInput = function(e) {
        var parent = $(e.target).parents("[price-dropdown-display-mode]")[0]
          , minField = $(parent).find('input[data-input-source="minprice"]')
          , maxField = $(parent).find('input[data-input-source="maxprice"]')
          , stripDecimals = !("blur" !== e.type)
          , minValues = getBreakdownFromPriceFieldValue("minprice", $(minField).val(), stripDecimals)
          , maxValues = getBreakdownFromPriceFieldValue("maxPrice", $(maxField).val(), stripDecimals);
        !minValues.numberValue || !maxValues.numberValue || minValues.numberValue <= maxValues.numberValue ? ($('input[type="hidden"][name="minprice"]').val(minValues.numberValue),
        $('input[type="hidden"][name="maxprice"]').val(maxValues.numberValue),
        $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="minprice"]').val(minValues.stringValue),
        $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="maxprice"]').val(maxValues.stringValue)) : ($('input[type="hidden"][name="minprice"]').val(maxValues.numberValue),
        $('input[type="hidden"][name="maxprice"]').val(minValues.numberValue),
        $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="minprice"]').val(maxValues.stringValue),
        $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="maxprice"]').val(minValues.stringValue))
    }
      , updatePriceFieldOnInput = function(e) {
        var targetFieldName = $(e.target).attr("data-input-source")
          , values = getBreakdownFromPriceFieldValue(targetFieldName, e.target.value);
        values.stringValue ? $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="' + targetFieldName + '"]').val(values.stringValue) : $('[price-dropdown-display-mode] .custom-combo-select-wrapper input[data-input-source="' + targetFieldName + '"]').val(null),
        $('input [type="hidden"][name="' + targetFieldName + '"]').val(values.numberValue)
    }
      , getBreakdownFromPriceFieldValue = function(fieldName, stringValue, stripDecimals) {
        stripDecimals = stripDecimals || !1;
        var postDecimalStringValue = ""
          , decimalPresent = !1
          , dotIndex = stringValue.indexOf(".");
        if (-1 != dotIndex && (stripDecimals || 0 == dotIndex ? (stringValue = dotIndex > 0 ? stringValue.substr(0, dotIndex) : "",
        dotIndex = -1) : (postDecimalStringValue = stringValue.substr(dotIndex),
        decimalPresent = !0)),
        postDecimalStringValue && (stringValue = stringValue.replace("$", "")),
        -1 != dotIndex) {
            postDecimalStringValue = stringValue.substr(dotIndex),
            stringValue.toLowerCase().indexOf("k") == stringValue.length - 1 && postDecimalStringValue.length <= 7 && (postDecimalStringValue = postDecimalStringValue.substr(0, postDecimalStringValue.length - 1),
            stringValue = stringValue.substr(0, dotIndex - 1),
            stringValue += postDecimalStringValue.padEnd(3, "0"),
            postDecimalStringValue = "",
            decimalPresent = !1,
            !0),
            stringValue.toLowerCase().indexOf("m") == stringValue.length - 1 && postDecimalStringValue.length <= 7 && (postDecimalStringValue = postDecimalStringValue.substr(0, postDecimalStringValue.length - 1),
            stringValue = stringValue.substr(0, dotIndex - 1),
            stringValue += postDecimalStringValue.padEnd(6, "0"),
            postDecimalStringValue = "",
            decimalPresent = !1,
            !0),
            postDecimalStringValue.length >= 4 ? postDecimalStringValue = stringValue.substr(dotIndex, postDecimalStringValue.length - 1) : dotIndex >= 4 && (decimalPresent = !1,
            postDecimalStringValue = !1,
            !1,
            stringValue = stringValue.substr(0, dotIndex - 1))
        } else
            stringValue.toLowerCase().indexOf("k") == stringValue.length - 1 && stringValue.length + 3 <= 8 && (stringValue = stringValue.toLowerCase().replace("k", "000")),
            stringValue.toLowerCase().indexOf("m") == stringValue.length - 1 && stringValue.length + 6 <= 11 && (stringValue = stringValue.toLowerCase().replace("m", "000000"));
        stringValue.length > 12 && (stringValue = stringValue.substr(0, 12));
        var numberString = stringValue.replace(/[^0-9.]/g, "")
          , numberValue = parseInt(numberString);
        isNaN(numberValue) && (numberValue = null),
        postDecimalStringValue && (postDecimalStringValue = postDecimalStringValue.replace(/[^0-9]/g, ""));
        var newStringValue = numberValue ? "$" + ml.formatHelper.addCommas(numberValue) : "";
        return decimalPresent && (newStringValue += "." + postDecimalStringValue),
        {
            numberValue: numberValue,
            stringValue: newStringValue
        }
    }
      , filterBarSelectElementHandler = function(e) {
        ml.pdpSearchInterfaceService.performSearch(),
        e.target.focus()
    }
      , handleTopListingTypeChange = function(e) {
        $(".js-top-listing-types").val(e.target.value),
        setFormByListingType(e.target.value),
        resetPriceRangeFields(),
        "true" === e.target.dataset.dosearch && ml.pdpSearchInterfaceService.performSearch(),
        e.target.focus()
    }
      , resetPriceRangeFields = function() {
        $("#js-min-price").val(""),
        $("#js-max-price").val(""),
        $("#js-hidden-price-range-1").val(null),
        $("#js-hidden-price-range-2").val(null)
    }
      , setFormByListingType = function(newTopLevelListingType) {
        var $forSaleHiddenInput = $("#js-hidden-listing-type-for-sale")
          , $forRentHiddenInput = $("#js-hidden-listing-type-rent")
          , $distressedCollapseCard = $("#js-distressed-collapse-card")
          , $restrictionsCollapseCard = $("#js-restrictions-collapse-card")
          , $landTenureFormGroup = $("#js-land-tenure-form-group");
        switch (newTopLevelListingType) {
        case "Lease Rent":
            $forSaleHiddenInput.prop("disabled", !0),
            $forRentHiddenInput.prop("disabled", !1),
            $distressedCollapseCard.length && $distressedCollapseCard.hide().find("input").prop("disabled", !0),
            $restrictionsCollapseCard.length && $landTenureFormGroup.length && ($landTenureFormGroup.hide().find("input").prop("disabled", !0),
            1 === $restrictionsCollapseCard.find("select, input").length && $restrictionsCollapseCard.hide()),
            $("[price-dropdown-display-mode]").attr("price-dropdown-display-mode", "for-rent");
            break;
        case "Resale New":
            $forSaleHiddenInput.prop("disabled", !1),
            $forRentHiddenInput.prop("disabled", !0),
            mapStatusCheckboxesToStatusFilter(),
            $distressedCollapseCard.length && $distressedCollapseCard.show().find("input").prop("disabled", !1),
            $restrictionsCollapseCard.length && $landTenureFormGroup.length && ($landTenureFormGroup.show().find("input").prop("disabled", !1),
            $restrictionsCollapseCard.is(":visible") || $restrictionsCollapseCard.show()),
            $("[price-dropdown-display-mode]").attr("price-dropdown-display-mode", "for-sale");
            break;
        default:
            console.error("Error handling listing type change.  That value is not recognized.")
        }
    }
      , validateAndUpdateRangePair = function(e, visibleInput, hiddenInput, rangeValue, pairedVisibleInput, pairedHiddenInput) {
        var $targetField = $(e.target)
          , $targetPairedField = $targetField.parents(".text-input-range").find(pairedVisibleInput)
          , minValue = 0
          , maxValue = 0;
        if ("min" == rangeValue ? (minValue = parseFloat($targetField.val()),
        maxValue = parseFloat($targetPairedField.val())) : "max" == rangeValue ? (minValue = parseFloat($targetPairedField.val()),
        maxValue = parseFloat($targetField.val())) : console.error("Invalid rangeValue supplied when validating and updating form range pair."),
        minValue = isNaN(minValue) ? 0 : minValue,
        maxValue = isNaN(maxValue) ? 0 : maxValue,
        !minValue || !maxValue)
            return void updateTextFieldHandler(e, visibleInput, hiddenInput);
        if (minValue > maxValue) {
            var temp = $targetField.val();
            $(visibleInput).val($targetPairedField.val()),
            $(hiddenInput).val($targetPairedField.val()),
            $(pairedVisibleInput).val(temp),
            $(pairedHiddenInput).val(temp)
        } else
            updateTextFieldHandler(e, visibleInput, hiddenInput)
    }
      , updateFieldHandler = function(e, fieldMetaData) {
        switch (e.target.type) {
        case "checkbox":
            switch (fieldMetaData.checkboxValueType) {
            case "bool":
                updateCheckboxBoolFieldHandler(e.target.checked, fieldMetaData.visibleInput, fieldMetaData.hiddenInput);
                break;
            case "statusFilters":
                updateCheckboxStatusFilterFieldHandler(e, fieldMetaData.visibleInput, fieldMetaData.hiddenInput);
                break;
            case "string":
                updateCheckboxStringFieldHandler(e.target.checked, e.target.value, fieldMetaData.visibleInput, fieldMetaData.hiddenInput);
                break;
            default:
                console.error('Error updating the field. checkboxValueType = "' + fieldMetaData.checkboxValueType + '" is not a supported type.  Please add this type.')
            }
            break;
        case "select-one":
            fieldMetaData.hasOwnProperty("rangeValue") ? validateAndUpdateRangePair(e, fieldMetaData.visibleInput, fieldMetaData.hiddenInput, fieldMetaData.rangeValue, fieldMetaData.pairedVisibleInput, fieldMetaData.pairedHiddenInput) : updateTextFieldHandler(e, fieldMetaData.visibleInput, fieldMetaData.hiddenInput);
            break;
        case "text":
            updateTextFieldHandler(e, fieldMetaData.visibleInput, fieldMetaData.hiddenInput);
            break;
        default:
            console.error("Error updating the field since field target type not handled in updateFieldHandler()")
        }
    }
      , updateCheckboxBoolFieldHandler = function(checked, visibleInput, hiddenInput) {
        $(visibleInput).prop("checked", checked);
        var newValue = checked ? 1 : 0;
        $(hiddenInput).val(newValue)
    }
      , updateCheckboxStringFieldHandler = function(checked, value, visibleInput, hiddenInput) {
        $(visibleInput + '[value="' + value + '"]').prop("checked", checked),
        updateStringHiddenInput(visibleInput, hiddenInput)
    }
      , updateStringHiddenInput = function(visibleInput, hiddenInput) {
        for (var checkedList = [], checkedElems = $(visibleInput + ":checked"), i = 0, len = checkedElems.length; i < len; i++)
            -1 === checkedList.indexOf(checkedElems[i].value) && checkedList.push(checkedElems[i].value);
        $(hiddenInput).val(checkedList.join(","))
    }
      , updateCheckboxStatusFilterFieldHandler = function(e, visibleInput, hiddenInput) {
        var checked = e.target.checked
          , value = e.target.value;
        $(visibleInput + '[value="' + value + '"]').prop("checked", checked),
        mapStatusCheckboxesToStatusFilter()
    }
      , mapStatusCheckboxesToStatusFilter = function() {
        for (var newStatusFilterValue, checkedList = [], checkedElements = $(".js-checkboxes-status-filters input:checkbox:checked"), i = 0, len = checkedElements.length; i < len; i++)
            -1 === checkedList.indexOf(checkedElements[i].value) && checkedList.push(checkedElements[i].value);
        switch (!0) {
        case -1 !== checkedList.indexOf("1") && -1 !== checkedList.indexOf("3"):
            newStatusFilterValue = 2;
            break;
        case -1 !== checkedList.indexOf("1"):
            newStatusFilterValue = 1;
            break;
        case -1 !== checkedList.indexOf("3"):
            newStatusFilterValue = 3;
            break;
        default:
            newStatusFilterValue = null
        }
        $("#js-hidden-status-filter").val(newStatusFilterValue)
    }
      , mapFilterStatusToCheckboxes = function() {
        var value = $("#js-hidden-status-filter").val()
          , $statusCheckboxes = $(".js-checkboxes-status-filters input");
        switch (value) {
        case "1":
            $statusCheckboxes.filter("[value=1]").prop("checked", !0),
            $statusCheckboxes.filter("[value=3]").prop("checked", null);
            break;
        case "2":
            $statusCheckboxes.filter("[value=1]").prop("checked", !0),
            $statusCheckboxes.filter("[value=3]").prop("checked", !0);
            break;
        case "3":
            $statusCheckboxes.filter("[value=1]").prop("checked", null),
            $statusCheckboxes.filter("[value=3]").prop("checked", !0)
        }
    }
      , updateTextFieldHandler = function(e, visibleInput, hiddenInput) {
        var selectedVal = e.target.value;
        $(visibleInput).val(selectedVal),
        $(hiddenInput).val(selectedVal)
    }
      , handleResetFilters = function(e) {
        e.preventDefault();
        var $searchFilters = $("#js-filters-form");
        $searchFilters.find('select, option, input[type="checkbox"], input[type="text"], input[type="radio"]').each(function(i, element) {
            "select" === element.tagName.toLowerCase() && (element.selectedIndex = 0),
            "option" === element.tagName.toLowerCase() && (element.defaultSelected = !1),
            "input" === element.tagName.toLowerCase() && ("checkbox" !== element.type.toLowerCase() && "radio" !== element.type.toLowerCase() || (element.defaultChecked = !1),
            "text" === element.type.toLowerCase() && (element.defaultValue = ""))
        }),
        $searchFilters[0].reset(),
        multiInputHiddenFields.forEach(function(field) {
            $(field.hiddenInput).val(null)
        }),
        resetPriceRangeFields(),
        setStatusDefaults(),
        setPropertyTypeDefaults(),
        setListingTypeDefaults(),
        $(document).trigger("clearFiltersClicked")
    }
      , setStatusDefaults = function() {
        $(".js-checkboxes-status-filters").find('[value="1"]').prop("checked", !0),
        mapStatusCheckboxesToStatusFilter()
    }
      , setPropertyTypeDefaults = function() {
        $(".js-checkboxes-property-types").find('[value="SINGLE"]').prop("checked", !0),
        updateStringHiddenInput(".js-checkboxes-property-types input:checkbox", "#js-hidden-property-types")
    }
      , setListingTypeDefaults = function() {
        setFormBySelectedListingType()
    }
      , setFormBySelectedListingType = function() {
        var listingTypeDefaultValue = "Resale New"
          , $listingTypes = $(".js-top-listing-types");
        $listingTypes.length && (listingTypeDefaultValue = $listingTypes.find(":selected")[0].value),
        setFormByListingType(listingTypeDefaultValue)
    };
    return {
        init: init
    }
}(),
ml.listingSearchSummary = function() {
    var init = function() {
        bindEvents(),
        scanForAppliedFilters()
    }
      , bindEvents = function() {
        $("#js-filters-form").on("submit", scanForAppliedFilters)
    }
      , scanForAppliedFilters = function() {
        for (var filtersToCheck = [{
            name: "beds",
            type: "singleInput",
            selector: 'input[name="beds"]',
            rangeIdPrefix: "",
            summarySuffix: "+ bd",
            useText: !1
        }, {
            name: "baths",
            type: "singleInput",
            selector: 'input[name="baths"]',
            rangeIdPrefix: "",
            summarySuffix: "+ ba",
            useText: !1
        }, {
            name: "sq foot",
            type: "range",
            minSelector: ".js-select-min-sq-ft",
            maxSelector: ".js-select-max-sq-ft",
            rangeIdPrefix: "",
            summarySuffix: " sq ft"
        }, {
            name: "price",
            type: "range",
            minSelector: 'input[data-input-source="minprice"]',
            maxSelector: 'input[data-input-source="maxprice"]',
            rangeIdPrefix: "$",
            summarySuffix: ""
        }], filtersApplied = [], filtersAppliedStr = "", i = 0, numFilters = filtersToCheck.length; i < numFilters; i++)
            switch (filtersToCheck[i].type) {
            case "range":
                var minVal = $(filtersToCheck[i].minSelector)[0].value
                  , maxVal = $(filtersToCheck[i].maxSelector)[0].value;
                "" === minVal && "" === maxVal || (minVal = minVal || "No min",
                maxVal = maxVal || "No max",
                "sq foot" === filtersToCheck[i].name.toLowerCase().trim() && (minVal = ml.formatHelper.addCommas(minVal),
                maxVal = ml.formatHelper.addCommas(maxVal)),
                filtersApplied.push(minVal + "-" + maxVal + filtersToCheck[i].summarySuffix));
                break;
            case "singleInput":
                if (filtersToCheck[i].useText) {
                    var txt = escapeHTML($(filtersToCheck[i].selector + " option:selected").text());
                    txt && "Active" !== txt && filtersApplied.push(txt)
                } else {
                    var value = escapeHTML($(filtersToCheck[i].selector).val());
                    void 0 !== value && "" !== value && filtersApplied.push(value + filtersToCheck[i].summarySuffix)
                }
            }
        filtersApplied.length ? (filtersAppliedStr = '<div class="search-summary-container">' + filtersApplied.join(", "),
        1 === ml.favoritesOnly && (filtersAppliedStr += ", Favorites only"),
        filtersAppliedStr += "</div>") : filtersAppliedStr = 1 === ml.favoritesOnly ? '<div class="search-summary-container">Favorites only</div>' : "",
        $(".js-search-summary").html(filtersAppliedStr),
        setMobileComponentHeights(!1)
    };
    return {
        init: init
    }
}(),
$(document).ready(function() {
    $("#js-filters-form").length && ml.listingSearchFilters.init(),
    $(".js-search-summary").length && ml.listingSearchSummary.init()
}),
$(document).ready(function() {
    $(document).on("click", ".js-suggested-area", function(e) {
        var $autocomplete = SEARCH_WIDGET.ACTIVE_FORM.find(SEARCH_WIDGET.ClASS_SELECTORS.AUTOCOMPLETE)
          , $selectedAreas = SEARCH_WIDGET.ACTIVE_FORM.find(SEARCH_WIDGET.ClASS_SELECTORS.SELECTEDAREAS)
          , isAdvancedSearch = $autocomplete.data("advanced") || !1
          , ui = {};
        ui.item = {},
        ui.item.LocationSearchType = "Place",
        ui.item.label = $(this).attr("data-description"),
        ui.item.LocationSearchId = this.id,
        ui.item.LocationSearchName = $(this).attr("data-description"),
        ml.listingSearch.listingSearchSelect(e, ui, $autocomplete, isAdvancedSearch, $selectedAreas),
        $(".js-suggested-cancel-btn").trigger("click")
    })
});
var ml = ml || {};
ml.messages = {},
ml.messages.error = {
    emailRequired: "A valid email address is required.",
    validEmail: "Please provide a valid email address",
    phoneRequired: "A valid phone number is required.",
    validPhone: "Please specify a valid phone number.",
    validMobilePhone: "Please specify a valid mobile phone number.",
    validHomePhone: "Please specify a valid home phone number.",
    validWorkPhone: "Please specify a valid work phone number.",
    firstNameRequired: "First name is required.",
    lastNameRequired: "Last name is required.",
    firstAndLastRequired: "Please provide both first and last name",
    nameRequired: "Please provide a name",
    nameInvalid: "Please provide a valid name",
    subjectRequired: "Please provide a subject",
    subjectMinLength: "Subject should be at least 2 characters.",
    subjectMaxLength: "Subject should not exceed 200 characters.",
    messageRequired: "Please enter a message.",
    messageMinLength: "Please enter at least 5 characters.",
    messageMaxLength: "Please enter no more than 1000 characters.",
    messageValid: "Please enter a valid message.",
    addressRequired: "Please provide a valid address",
    sqftRequired: "Please select square footage",
    bedsRequired: "Please select number of bed rooms",
    bathsRequired: "Please select number of bath rooms",
    zipRequired: "Please enter a valid zip/postal code",
    captchaRequired: "Please enter the verification code above",
    noHighAscii: "Please enter only ASCII characters.",
    noHTML: "HTML is not allowed.",
    passwordRequired: "Password is required.",
    passwordsMustMatch: "Your passwords must match.",
    alphaNumCommaQuoteDash: "Keyword can include: A-Z, a-z, 0-9 and ', &quot;, - , and commas",
    financeQuestionMinLength: "Questions should be at least 5 characters.",
    financeQuestionMaxLength: "Please enter no more than 1000 characters."
},
ml.messages.success = {
    passwordUpdated: "Your password has been updated.",
    subscriptionsUpdated: "Your subscription has been updated.",
    emailSent: "Your email was successfully sent.",
    requestSent: "Your request was successfully sent.",
    loggedIn: "You have successfully logged in.",
    passwordResetSent: "Your password reset email was sent."
};
var ml = ml || {};
ml.trapFocus = function($) {
    var focusableElements, modal, firstFocusableElement, lastFocusableElement, bindEvents = function() {
        $(modal).on("keydown", setTrap)
    }, setTrap = function(e) {
        ("Tab" === e.key || 9 === e.keyCode) && (e.shiftKey ? document.activeElement === firstFocusableElement && (lastFocusableElement.focus(),
        e.preventDefault()) : document.activeElement === lastFocusableElement && (firstFocusableElement.focus(),
        e.preventDefault()))
    };
    return {
        init: function() {
            focusableElements = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        },
        setmodalfocustrap: function(modalId) {
            modal = $("#" + modalId);
            var allElements = modal[0].querySelectorAll(focusableElements)
              , allVisibleElements = [];
            allElements.forEach(function(element) {
                element.offsetWidth > 0 && element.offsetHeight > 0 && allVisibleElements.push(element)
            }),
            firstFocusableElement = allVisibleElements[0],
            lastFocusableElement = allVisibleElements[allVisibleElements.length - 1],
            bindEvents()
        }
    }
}(jQuery),
$(document).ready(function() {
    ml.trapFocus.init()
});
var ml = ml || {};
ml.ariaDropdownFocus = function($) {
    var dropdownOpener, bindEvents = function() {
        $(document).on("show.bs.dropdown", function(e) {
            var $button, target = e.target;
            $button = -1 === target.className.indexOf("dropdown-toggle") ? $(target).find(".dropdown-toggle") : $(target),
            dropdownOpener = $button
        }),
        $(document).on("hidden.bs.dropdown", function(e) {
            dropdownOpener && setTimeout(function() {
                dropdownOpener[0].focus(),
                dropdownOpener = null
            }, 0)
        })
    };
    return {
        init: function() {
            bindEvents()
        }
    }
}(jQuery),
$(document).ready(function() {
    $(".dropdown").length && ml.ariaDropdownFocus.init()
});
var ml = ml || {};
ml.horzScrollMenu = function($, window) {
    var timeout = 0
      , scrollingActive = !1
      , $mainMenu = $(".nav-js")
      , menuWidth = 0
      , buttonsWidth = 0
      , init = function() {
        bindEvents(),
        resizeCheck()
    }
      , toggleDropdown = function(e) {
        const $dropdown = $(e.target).closest(".dropdown")
          , $menu = $(".dropdown-menu", $dropdown);
        setTimeout(function() {
            const shouldOpen = "click" !== e.type && $dropdown.is(":hover");
            $menu.toggleClass("show", shouldOpen),
            $dropdown.find(".nav-link").toggleClass("active", shouldOpen),
            $dropdown.toggleClass("show", shouldOpen),
            $('[data-toggle="dropdown"]', $dropdown).attr("aria-expanded", shouldOpen)
        }, "mouseleave" === e.type ? 200 : 0)
    }
      , bindEvents = function() {
        $(window).resize(function() {
            handleWindowResize()
        }),
        $(".js-scroll").click(function() {
            handleClick($(this))
        }),
        $(".nav-js").on("mouseenter mouseleave", ".dropdown", toggleDropdown),
        $(".nav-js").on("click", ".dropdown-menu a", toggleDropdown)
    }
      , handleWindowResize = function() {
        0 !== timeout && clearTimeout(timeout),
        timeout = setTimeout(function() {
            resizeCheck()
        }, 200)
    }
      , handleClick = function($domElem) {
        var buttonId = $domElem.attr("data-scroll")
          , position = getMenuPosition();
        !0 !== scrollingActive && ("scrollHelperLeft" === buttonId && allowLeftClickScroll(position) && (scrollingActive = !0,
        $mainMenu.animate({
            left: "+=200px"
        }, 250, "swing", function() {
            handleAnimationComplete(buttonId)
        })),
        "scrollHelperRight" === buttonId && allowRightClickScroll(position) && (scrollingActive = !0,
        $mainMenu.animate({
            left: "-=200px"
        }, 250, "swing", function() {
            handleAnimationComplete(buttonId)
        })))
    }
      , handleAnimationComplete = function(buttonId) {
        var $scrollHelperRight = $('[data-scroll="scrollHelperRight"]')
          , $scrollHelperLeft = $('[data-scroll="scrollHelperLeft"]')
          , position = getMenuPosition();
        void 0 === buttonId ? ($scrollHelperRight.removeClass("disabled"),
        $scrollHelperLeft.removeClass("disabled")) : "scrollHelperLeft" === buttonId ? $scrollHelperRight.removeClass("disabled") : $scrollHelperLeft.removeClass("disabled"),
        allowLeftClickScroll(position) ? allowRightClickScroll(position) || $scrollHelperRight.addClass("disabled") : $scrollHelperLeft.addClass("disabled"),
        scrollingActive = !1
    }
      , allowLeftClickScroll = function(position) {
        return position > 0
    }
      , allowRightClickScroll = function(position) {
        return position + menuWidth < buttonsWidth
    }
      , getMenuPosition = function() {
        var leftCss = $mainMenu.css("left");
        return -1 * parseInt(leftCss.replace("px", ""))
    }
      , resizeCheck = function() {
        buttonsWidth = 0;
        var $menuContainer = $(".js-slide-nav");
        if ($mainMenu.children('li:not(".header-info")').each(function() {
            buttonsWidth += $(this).outerWidth()
        }),
        0 === buttonsWidth || !window.matchMedia("(min-width: " + ml.breakPoints.screenMdMin + ")").matches)
            return void hide();
        menuWidth = $menuContainer.width(),
        menuWidth <= buttonsWidth ? (show(),
        handleAnimationComplete()) : hide()
    }
      , show = function() {
        $mainMenu.addClass("scrolling-nav"),
        $('[data-show="scrollHelper"]').show(),
        $mainMenu.animate({
            left: "0px"
        }, 300, "swing", function() {
            handleAnimationComplete()
        })
    }
      , hide = function() {
        $mainMenu.removeClass("scrolling-nav"),
        $('[data-show="scrollHelper"]').hide(),
        $mainMenu.animate({
            left: "0px"
        }, 300)
    };
    return {
        init: init
    }
}(jQuery, window),
ml.responsiveNav = function($) {
    var $toggle, $footer, init = function(toggleSelector) {
        $toggle = $(toggleSelector),
        $footer = $("#js-footer"),
        mainNavClickHandling(),
        footerPosition(),
        bindEvents()
    }, bindEvents = function() {
        $toggle.click(toggleNav),
        $("#js-sign-out").click(signOut),
        $(window).resize(footerPosition)
    }, mainNavClickHandling = function() {
        $(".nav-js").on("click", ".dropdown-toggle", function(e) {
            var $el = $(this)
              , href = $el.attr("href")
              , target = $el.attr("target");
            0 !== $el.length && href && "#" !== href && (target && "_blank" === target ? window.open(href, "_blank", "noopener noreferrer") : location.href = $el.attr("href"))
        })
    }, signOut = function(e) {
        e.preventDefault(),
        confirm("Are you sure you want to sign out?") && (window.location = "/forms/prospect/signout/")
    }, toggleNav = function() {
        $("body").toggleClass("active-nav inactive-nav")
    }, footerPosition = function() {
        $(document).height() === $(window).height() ? $footer.css({
            position: "fixed",
            "z-index": 1
        }) : $footer.css({
            position: "relative"
        })
    };
    return {
        init: init,
        footerPosition: footerPosition
    }
}(jQuery),
$(document).ready(function() {
    ml.responsiveNav.init(".js-nav-toggle");
    var masthead = $("#js-masthead-carousel");
    masthead && (toggleNavByPosition(masthead),
    $(window).on("scroll", function() {
        toggleNavByPosition(masthead)
    }))
}),
$(window).on("load", function() {
    ml.horzScrollMenu.init()
});
var ml = ml || {};
ml.formatHelper = function() {
    return {
        addCommas: function(inputNumber) {
            if (!inputNumber || isNaN(inputNumber) || inputNumber.toString().split(".").length > 2)
                return inputNumber;
            for (var numberSplit = inputNumber.toString().split("."), integralNumber = numberSplit[0], fractionalNumber = numberSplit.length > 1 ? "." + numberSplit[1] : "", rgx = /(\d+)(\d{3})/; rgx.test(integralNumber); )
                integralNumber = integralNumber.replace(rgx, "$1,$2");
            return integralNumber + fractionalNumber
        }
    }
}(),
$(document).ready(function() {
    void 0 === ml && (ml = {}),
    ml.CreateModalInstance = function(options) {
        function buildContentUri() {
            var getParams = ""
              , contentUri = modal.contextData.contentPath;
            return modal.contextData.hasOwnProperty("parameters") && "object" == typeof modal.contextData.parameters && (getParams += "?",
            getParams += $.param(modal.contextData.parameters),
            contentUri += getParams),
            contentUri
        }
        function generateMarkup() {
            var modalMarkup = "";
            return modalMarkup += '<div class="modal fade" id="' + modal.modalId + '" tabindex="-1" role="dialog" ',
            options.ariaLabelledby && (modalMarkup += 'aria-labelledby="' + options.ariaLabelledby + '"'),
            modalMarkup += '><div class="modal-dialog ' + modal.modalClass + '" role="document"><div class="modal-content">',
            modal.printHeader && (modal.heading || modal.allowClose) && (modalMarkup += '<div class="modal-header">',
            modal.heading && (modalMarkup += modal.heading),
            modal.allowClose && (modalMarkup += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="icon-ml-close"></i></span></button>'),
            modalMarkup += "</div>"),
            modalMarkup += '<div class="modal-body p-0"><div class="loading"><i class="icon ml-sync"></i></div></div></div></div></div>'
        }
        function extractModalOptions(options) {
            if (modal.modalId = modal.uuid(),
            modal.modalClass = "",
            modal.onLoadedCallback = function() {}
            ,
            modal.allowClose = !1,
            modal.allowCloseWithKeyboard = !1,
            modal.heading = "",
            modal.backdrop = "static",
            modal.contextData = {},
            modal.printHeader = !1,
            modal.printFooter = !1,
            !options)
                throw "No Modal Options provided.  Cannot show modal.";
            if (!options.hasOwnProperty("contextData"))
                throw "No Modal Context Data provided.  Cannot show modal.";
            modal.contextData = options.contextData,
            options.hasOwnProperty("class") && (modal.modalClass = options.class),
            options.hasOwnProperty("allowClose") && (modal.allowClose = options.allowClose),
            options.hasOwnProperty("allowCloseWithKeyboard") && (modal.allowCloseWithKeyboard = options.allowCloseWithKeyboard),
            options.hasOwnProperty("backdrop") && (modal.backdrop = options.backdrop),
            options.hasOwnProperty("printHeader") && (modal.printHeader = options.printHeader),
            options.hasOwnProperty("heading") && (modal.heading = options.heading),
            options.hasOwnProperty("ariaLabelledby") && (modal.ariaLabelledby = options.ariaLabelledby),
            options.hasOwnProperty("onLoadedCallback") && (modal.onLoadedCallback = options.onLoadedCallback),
            options.hasOwnProperty("onModalHideCallback") && (modal.onModalHideCallback = options.onModalHideCallback)
        }
        function onModalHide() {
            $("#" + modal.modalId).remove(),
            modal.isOpen = !1,
            modal.onModalHideCallback(),
            $(".js-disable-while-modal-open").attr("disabled", !1)
        }
        var modal = {};
        return modal.modalClass = "",
        modal.modalId = "",
        modal.onLoadedCallback = function(r) {}
        ,
        modal.onModalHideCallback = function(r) {}
        ,
        modal.constructor = function(options) {
            modal.isOpen = !1,
            extractModalOptions(options)
        }
        ,
        modal.show = function() {
            if (!modal.isOpen) {
                var contentUri = buildContentUri()
                  , modalMarkup = "";
                modal.isOpen = !0,
                modalMarkup = generateMarkup(),
                $("body").append(modalMarkup),
                $("#" + modal.modalId).modal({
                    keyboard: !!modal.allowCloseWithKeyboard,
                    backdrop: modal.backdrop
                }),
                $.get(contentUri, null).done(function(result) {
                    if (!result)
                        return void console.error("No result returned from path: " + contentUri);
                    if ("{" === result.charAt(0)) {
                        var result = JSON.parse(result);
                        if (ml.hasOwnProperty(eventTracking)) {
                            var trackingDetails = JSON.stringify({
                                ModalName: modal.modalClass,
                                Result: result,
                                AllowClose: modal.allowClose,
                                ModalClass: modal.modalClass,
                                AllowCloseWithKeyboard: modal.allowCloseWithKeyboard,
                                Backdrop: modal.backdrop,
                                EngagementActionCode: modal.engagementActionCode,
                                ContextCode: modal.contextCode,
                                Heading: modal.heading
                            });
                            ml.eventTracking.track("ModalView", trackingDetails)
                        }
                        if (result.messageType && "error" === result.messageType && result.redirectUrl)
                            return void (window.location.href = result.redirectUrl)
                    }
                    $("#" + modal.modalId + " .modal-content .modal-body").html(result),
                    modal.onLoadedCallback(result)
                }).fail(function(data) {}),
                $("#" + modal.modalId).on("hidden.bs.modal", onModalHide),
                $(".js-disable-while-modal-open").attr("disabled", !0)
            }
        }
        ,
        modal.uuid = function() {
            var s4 = function() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
            };
            return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
        }
        ,
        modal.close = function() {
            $("#" + modal.modalId + ".modal").modal("hide"),
            $("#" + modal.modalId + ".js-reg-modal").remove()
        }
        ,
        modal.constructor(options),
        modal
    }
});
var ml = ml || {};
ml.changeEmailForm = function($) {
    var $form, modal, primaryEmailUpdateNotificationCallback = function() {}, initializeAjaxForm = function() {
        $form.ajaxForm({
            ignore: ".ignore",
            rules: {
                newEmailAddress: "required",
                emailDesignation: "required"
            },
            messages: {
                newEmailAddress: ml.messages.error.emailRequired
            },
            success: function(results) {
                return results.hasOwnProperty("payload") && results.payload.hasOwnProperty("isSuccess") && results.payload.isSuccess ? (modal.close(),
                results.payload.hasOwnProperty("newEmail") && results.payload.hasOwnProperty("replacedPrimaryEmail") ? void (results.payload.replacedPrimaryEmail && triggerPrimaryEmailUpdateNotification(results.payload.newEmail)) : void console.error("Change email response params are missing")) : void console.error("Email update failed.")
            },
            invalidHandler: function(event, validator) {},
            successMsg: "Email successfully updated.",
            successMsgAppendToElem: ".js-email-update-success-message",
            errorMsgAppendToElem: ".js-change-email-section-error"
        })
    }, openChangeEmailModal = function(params, invokingElement) {
        return modal = ml.CreateModalInstance({
            modalClass: "change-email-modal",
            allowClose: !0,
            allowCloseWithKeyboard: !0,
            backdrop: "static",
            engagementActionCode: params.hasOwnProperty("engagementActionCode") ? params.engagementActionCode : "contact",
            heading: '<h5 class="modal-title" id="changeEmailTitle">From Email</h5>',
            ariaLabelledby: "changeEmailTitle",
            printHeader: !0,
            contextData: {
                contentPath: "/ajax/prospect/changeemail/",
                parameters: params
            },
            onLoadedCallback: function(r) {
                $form = $("#js-change-email-form"),
                initializeAjaxForm()
            },
            onModalHideCallback: function(r) {
                invokingElement.focus()
            }
        }),
        modal.show(),
        modal
    }, triggerPrimaryEmailUpdateNotification = function(newPrimaryEmail) {
        primaryEmailUpdateNotificationCallback(newPrimaryEmail)
    };
    return {
        init: function() {
            $("[data-open-change-email-modal]").on("click", function(e) {
                openChangeEmailModal({}, e.target)
            })
        },
        primaryEmailUpdatedNotification: function(callback) {
            primaryEmailUpdateNotificationCallback = callback
        }
    }
}(jQuery),
$(document).ready(function() {
    $("[data-open-change-email-modal]").length && ml.changeEmailForm.init()
}),
$(document).ready(function() {
    void 0 === ml && (ml = {}),
    ml.initializeContactModals = function(scopeSelector) {
        var $links = null;
        $links = scopeSelector ? $(scopeSelector).find("[data-open-contact-modal]") : $("[data-open-contact-modal]"),
        $links.removeClass("disabled"),
        $links.attr("disabled", null),
        $links.on("click", function(event) {
            var params = JSON.parse($(event.target).attr("data-open-contact-modal"));
            ml.openContactModal(params, event.target)
        })
    }
    ,
    ml.updateContactModalDataValues = function(selector, overrides) {
        var $link = $(selector).find("[data-open-contact-modal]");
        if (!$link)
            return void console.error("Defined selector " + selector + " not available.");
        try {
            var params = JSON.parse($link.attr("data-open-contact-modal"));
            for (prop in overrides)
                params[prop] = overrides[prop];
            $link.attr("data-open-contact-modal", JSON.stringify(params))
        } catch (err) {
            return void console.error("Defined selector " + params + " not available.")
        }
    }
    ,
    ml.initializeContactModals(),
    ml.openContactModal = function(params, invokingElement) {
        if (!ml.hasOwnProperty("CreateModalInstance"))
            throw "CreateModalInstance() method is not available!  Please be sure that the core modal script has been loaded before invoking this script.";
        var modal = ml.CreateModalInstance({
            modalClass: "contact-modal",
            allowClose: !0,
            allowCloseWithKeyboard: !0,
            backdrop: "static",
            engagementActionCode: params.hasOwnProperty("engagementActionCode") ? params.engagementActionCode : "contact",
            contextCode: params.hasOwnProperty("contextCode") ? params.contextCode : "",
            heading: '<h5 class="modal-title" id="contactModalTitle">Email <span class="js-agent-name"></span></h5>',
            ariaLabelledby: "contactModalTitle",
            printHeader: !0,
            onLoadedCallback: function(r) {
                $(".js-agent-name").text(ml.agentName),
                ml.contactForm.init(),
                ml.contactPreferences.init(),
                ml.changeEmailForm.init()
            },
            contextData: {
                contentPath: "/ajax/profile/contactmodal/",
                parameters: params
            },
            onModalHideCallback: function(r) {
                ml.contactForm.reloadCheck() && location.reload(),
                invokingElement.focus()
            }
        });
        return modal.show(),
        modal
    }
}),
$(document).ready(function() {
    void 0 === ml && (ml = {}),
    ml.openOpenHouseModal = function(params, invokingElement) {
        if (!ml.hasOwnProperty("CreateModalInstance"))
            throw "CreateModalInstance() method is not available!  Please be sure that the core modal script has been loaded before invoking this script.";
        var modal = ml.CreateModalInstance({
            class: "open-houses-modal modal-xl modal-scrollable modal-fade",
            allowClose: !0,
            allowCloseWithKeyboard: !1,
            backdrop: "static",
            printHeader: !1,
            ariaLabelledby: "openHousesModalTitle",
            onLoadedCallback: function(r) {
                var trackingData = $(r).attr("data-hopper-tracking")
                  , eventCode = $(r).attr("data-tracking-action-name");
                trackingData = JSON.parse(trackingData),
                ml.eventTracking.track(eventCode, trackingData)
            },
            contextData: {
                contentPath: "/openhousemodal/",
                parameters: params
            },
            onModalHideCallback: function(r) {
                invokingElement.focus()
            }
        });
        return modal.show(),
        modal
    }
});
var ml = ml || {}, modalOpener;
ml.registration = function($) {
    function uuid() {
        function s4() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    }
    function setTitleAndAriaLabelId(modalId) {
        var title = $("#" + modalId + " .modal-title");
        if (title) {
            var newId = modalId + "_Title";
            $(title).attr("id", newId),
            $("#" + modalId).attr("aria-labelledby", newId)
        }
    }
    var currentModalId, init = function() {
        registerClickEvents()
    }, clickWall = !1, openRegistrationModal = function(url, opts, callBack) {
        if (!(document.activeElement.className.indexOf("js-regwall-trigger-exempt") > -1)) {
            $(".modal").modal("hide");
            var modalId = uuid();
            currentModalId = modalId;
            var modalClass = opts.class ? opts.class : "";
            $("body").append('<div class="modal js-reg-modal fade" tabindex="-1" role="dialog"  id="' + modalId + '" ><div class="modal-dialog ' + modalClass + '" role="document"><div class="modal-content"><div class="loading"><i class="icon ml-sync"></i></div></div></div></div>'),
            $("#" + modalId).modal({
                keyboard: void 0 === opts.keyboard || opts.keyboard,
                backdrop: "static"
            }),
            $("#" + modalId + " .modal-content").load(url, callBack),
            $("#" + modalId).on("hidden.bs.modal", function() {
                $("#" + modalId).remove(),
                modalOpener && modalOpener.focus()
            })
        }
    }, submitpageView = function(page) {
        var gaAccount = mlVars.account || "UA-18268864-1";
        rollupAccounts = gaAccount.split(",");
        for (var index in rollupAccounts)
            _gaq.push(["_setAccount", rollupAccounts[index]]),
            _gaq.push(["_trackPageview", page])
    }, modals = {
        initialRegistration: function(regObject, onRegistrationSuccess) {
            regObject = regObject || {},
            clickWall && (regObject.trigger = "regw");
            var regParams = $.param(regObject)
              , modalUrl = "/registermodal/?" + regParams;
            $("body").off("click", ".js-reg-sign-in"),
            openRegistrationModal(modalUrl, {
                keyboard: !clickWall,
                backdrop: "static"
            }, function(a) {
                ml.registration.state = "register",
                $("#" + currentModalId).attr("aria-label", "Register"),
                ml.trapFocus.setmodalfocustrap(currentModalId),
                $("body").on("click", ".js-reg-sign-in", function() {
                    modelOpener = this,
                    modals.login(onRegistrationSuccess)
                });
                var trigger = $(".reg-form-js").find('input[name="trigger"]').val();
                submitpageView("registrationwall/trigger/" + trigger),
                $(".reg-form-js").ajaxForm({
                    rules: {
                        firstAndLast: {
                            required: !0,
                            noHTML: !0
                        },
                        emailAddress: {
                            required: !0,
                            noHTML: !0,
                            email: !0
                        }
                    },
                    errorDisplayLevel: "section",
                    success: function(r) {
                        if (void 0 !== r.redirectUrl && "" !== r.redirectUrl ? window.location.href = r.redirectUrl : $("#js-reg-error").html(""),
                        "error" === r.messageType)
                            $("#js-reg-error").append('<div class="alert alert-danger">' + r.message + "</div>");
                        else {
                            var path = window.location.pathname.split("/");
                            if ("listing" === path[1]) {
                                var propertyId = path[3] + "|" + path[5];
                                ml.fbPixel.trackConversion(propertyId, $("#js-listing-city").text())
                            }
                            if ("map" === path[1]) {
                                var listingIds = [];
                                $(".js-card").each(function() {
                                    listingIds.push($(this).data("mls-id") + "|" + $(this).data("listing-id"))
                                }),
                                listingIds.length > 0 && ml.fbPixel.trackConversion(listingIds, null)
                            }
                            window.uetq = window.uetq || [],
                            window.uetq.push("event", "Conversion"),
                            ml.registration.modals.postRegistration(regParams, onRegistrationSuccess)
                        }
                    }
                })
            })
        },
        postRegistration: function(regParams, onRegistrationSuccess) {
            openRegistrationModal("/postregistermodal/?" + regParams, {}, function() {
                submitpageView("/registrationwall2/"),
                $("#js-post-reg-form").ajaxForm({
                    rules: {
                        phone: {
                            noHTML: !0,
                            customPhoneUSandInternational: !0
                        },
                        password: {
                            noHTML: !0
                        },
                        confirm: {
                            required: !0,
                            noHTML: !0
                        }
                    },
                    messages: {
                        phone: {
                            customPhoneUSandInternational: ml.messages.error.validPhone
                        }
                    },
                    success: function() {
                        $("#" + currentModalId).modal("toggle")
                    }
                }),
                $("#" + currentModalId).on("hidden.bs.modal", function() {
                    onRegistrationSuccess ? onRegistrationSuccess() : window.location.reload()
                });
                var $tooltip = $("#js-password-tooltip");
                $tooltip.length && $tooltip.is(":visible") && $tooltip.tooltip()
            })
        },
        forgotPassword: function() {
            openRegistrationModal("/forgotpasswordmodal/", {
                class: "modal-md"
            }, function() {
                $(".js-error-message").html(),
                setTitleAndAriaLabelId(currentModalId),
                ml.trapFocus.setmodalfocustrap(currentModalId);
                var $forgotPassForm = $(".js-forgot-password-form");
                $forgotPassForm.ajaxForm({
                    rules: {
                        emailaddress: {
                            required: !0,
                            email: !0,
                            noHTML: !0
                        }
                    },
                    messages: {},
                    successMsg: ml.messages.success.passwordResetSent,
                    errorDisplayLevel: "inline",
                    successMsgAppendToElem: ".js-forgot-password-message",
                    success: function(r) {
                        $(".js-error-message").html(""),
                        window.grecaptcha && grecaptcha.reset(),
                        "error" === r.messageType ? $(".js-error-message").append('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="icon-ml-close"></i></button><p>' + r.message + "</p></div>") : setTimeout(modals.login, 3e3)
                    }
                }),
                $forgotPassForm.on("beforeSubmit", function(event) {
                    handle_grecaptcha_presubmit($(this), ".js-captcha-error")
                })
            })
        },
        login: function(onAuthSuccess) {
            openRegistrationModal("/loginmodal/", {
                backdrop: "static",
                class: "modal-md",
                keyboard: !clickWall
            }, function(id, a) {
                clickWall && $(".js-reg-modal .close").remove(),
                ml.registration.state = "login",
                setTitleAndAriaLabelId(currentModalId),
                ml.trapFocus.setmodalfocustrap(currentModalId),
                $(".js-error-message").html(),
                $(".js-login-form").ajaxForm({
                    rules: {
                        login: {
                            required: !0,
                            email: !0,
                            noHTML: !0
                        },
                        password: {
                            required: !0,
                            noHTML: !0
                        }
                    },
                    successMsg: ml.messages.success.loggedIn,
                    errorDisplayLevel: "inline",
                    successMsgAppendToElem: ".js-login-form",
                    success: function(r) {
                        if ($(".js-error-message").html(""),
                        "error" === r.messageType)
                            $(".js-error-message").append('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="icon-ml-close"></i></button><p>' + r.message + "</p></div>");
                        else {
                            if (onAuthSuccess)
                                return void onAuthSuccess();
                            if (window.location.pathname.indexOf("/registration/") > -1)
                                return void (void 0 !== r.redirectUrl && "" !== r.redirectUrl ? window.location.href = r.redirectUrl : window.location.href = window.location.origin);
                            if (void 0 !== r.redirectUrl && "" !== r.redirectUrl)
                                return currentHash = window.location.hash,
                                void (window.location.href = r.redirectUrl + currentHash);
                            window.location.reload()
                        }
                    }
                })
            })
        },
        saveSearch: function(url, refresh) {
            openRegistrationModal(url, {
                class: "modal-md save-search-modal"
            }, function() {
                ml.saveSearch.init(refresh),
                setTitleAndAriaLabelId(currentModalId),
                ml.trapFocus.setmodalfocustrap(currentModalId),
                $("#js-listing-save-form").on("submit", function(e) {
                    e.preventDefault();
                    var formData = $("#js-listing-save-form").serialize();
                    $.ajax({
                        type: "post",
                        url: "/forms/listingsearch/save/",
                        data: formData,
                        complete: function(response) {
                            $(".modal").modal("hide"),
                            $("#js-listing-save-form").remove(),
                            refresh && window.location.reload(),
                            $(document).trigger("listingSearchSaveCompleted")
                        }
                    })
                })
            })
        },
        close: function() {
            $(".modal").modal("hide"),
            $(".js-reg-modal").remove()
        }
    };
    return registerClickEvents = function() {
        $("body").on("click", ".js-start-over", function() {
            location.href = "/"
        }),
        $("body").on("click", ".js-forgot-pass", function() {
            modals.forgotPassword()
        }),
        $("body").on("click", ".js-sign-in", function() {
            modalOpener = this;
            var redirectUrl = $(this).attr("href");
            modals.login(function(e) {
                redirectUrl && -1 === redirectUrl.indexOf("javascript") ? window.location.replace("//" + document.domain + redirectUrl) : window.location.reload()
            })
        }),
        $("body").on("click", ".js-close-modal", function() {
            modals.close()
        }),
        $("body").on("click", ".js-register", function(e) {
            e.preventDefault();
            var redirectUrl = $(this).attr("href");
            modals.initialRegistration($(this).data("regform"), function(e) {
                redirectUrl && -1 === redirectUrl.indexOf("javascript") ? window.location.replace("//" + document.domain + redirectUrl) : window.location.reload()
            })
        }),
        $("body").on("click", ".js-save-search", function(e) {
            e.preventDefault(),
            modalOpener = this;
            var modalLink = "/savelistingsearch/?" + $(this).closest("form").serialize();
            modalLink && ($(e.currentTarget).hasClass("js-reg-saved-search") ? modals.initialRegistration($(this).data("regform"), function() {
                modals.saveSearch(modalLink, !0)
            }) : modals.saveSearch(modalLink))
        }),
        $("body").on("click", ".js-unregistered-favorite-button, .js-favorite-button, .js-unfavorite-button", function(e) {
            e.preventDefault(),
            e.stopPropagation();
            var $icon = $(this)
              , $iconHref = $icon.attr("href")
              , propertyId = $icon.attr("data-property-id")
              , mlsId = $icon.attr("data-mls-id")
              , city = $icon.attr("data-city");
            if (ml.fbPixel.trackListingInteraction(mlsId + "|" + propertyId, city),
            $icon.hasClass("js-unregistered-favorite-button")) {
                var redirectUrl = $icon.attr("href");
                return void modals.initialRegistration($icon.data("regform"), function() {
                    $("body").append('<form id="js-add-listing" action ="' + redirectUrl + '" method="post"><input type="hidden" name="formredirect" value="' + (window.location.pathname + window.location.hash) + '" /></form>').find("#js-add-listing").submit()
                })
            }
            var $buttons = $(".js-unregistered-favorite-button, .js-favorite-button, .js-unfavorite-button").filter(function() {
                return $(this).attr("href") === $iconHref
            });
            $.ajax({
                type: "GET",
                dataType: "text",
                url: $iconHref
            }).done(function(data, textStatus, jqXHR) {
                var newURL;
                new Envelope(data);
                -1 !== $iconHref.indexOf("save") ? (newURL = $buttons.attr("href").replace("save", "delete"),
                $("#js-listing-map").length && ml.hasOwnProperty("pdpSearchInterfaceService") && ml.pdpSearchInterfaceService.isMapInitialized() && ml.pdpSearchInterfaceService.addFavoriteIconToPin(propertyId)) : (newURL = $buttons.attr("href").replace("delete", "save"),
                $("#js-listing-map").length && ml.hasOwnProperty("pdpSearchInterfaceService") && ml.pdpSearchInterfaceService.isMapInitialized() && ml.pdpSearchInterfaceService.removeFavoriteIconFromPin(propertyId)),
                $buttons.attr("href", newURL),
                $buttons.toggleClass("js-favorite-button"),
                $buttons.toggleClass("favorited-property"),
                $buttons.toggleClass("js-unfavorite-button"),
                $("body").trigger("fav-button-click-complete", [e])
            }).fail(function(data, textStatus, errorThrown) {
                console.error("Ajax error. Text status = " + textStatus + ". Error = " + errorThrown)
            })
        }),
        $("body").on("click", ".js-register-schedule-showing", function(e) {
            e.preventDefault();
            var redirectUrl = $(this).attr("href");
            modals.initialRegistration($(this).data("regform"), function(e) {
                window.location.replace(window.location.protocol + "//" + document.domain + redirectUrl)
            })
        }),
        $(window).on("delayopen_regform.regform", function(event, triggerData) {
            clickWall = !0;
            var delay = 1e3 * triggerData.delay + 100;
            setTimeout(function() {
                modals.initialRegistration(triggerData)
            }, delay)
        }),
        $(window).on("view_next_pdp", function(event, triggerData) {
            var delay = 1e3 * triggerData.delay + 100;
            setTimeout(function() {
                triggerData.authorized || (modals.initialRegistration(triggerData),
                $("#js-listing-pane").addClass("frost"))
            }, delay)
        })
    }
    ,
    {
        init: init,
        modals: modals,
        state: "login"
    }
}(jQuery),
$(document).on("shown.bs.modal", ".modal", function() {
    $(document.body).addClass("modal-open")
}).on("show.bs.modal", ".modal", function() {
    $(document.body).addClass("modal-open")
}).on("hidden.bs.modal", ".modal", function() {
    $(document.body).removeClass("modal-open")
}),
$(document).ready(function() {
    test = ml.registration.init(),
    $(".js-validate-form").validate()
});
var ml = ml || {};
ml.contactForm = function($) {
    var $contactForm, triggerReload = !1, initializeAjaxForm = function() {
        $contactForm.ajaxForm({
            ignore: ".ignore",
            rules: {
                fromDisplayName: {
                    required: !0,
                    minlength: 2,
                    firstAndLastSingleField: !0,
                    noHTML: !0
                },
                fromEmail: {
                    required: !0,
                    email: !0
                },
                cellPhone: {
                    customPhoneUSandInternational: !0,
                    requiredCellPhoneContactPreference: !0,
                    requiredPhoneContactPreference: !0
                },
                homePhone: {
                    customPhoneUSandInternational: !0
                },
                workPhone: {
                    customPhoneUSandInternational: !0
                },
                other: {
                    noHTML: !0
                },
                subject: {
                    required: !0,
                    noHTML: !0,
                    minlength: 2,
                    maxlength: 200
                },
                message: {
                    required: !0,
                    noHTML: !0,
                    minlength: 5,
                    maxlength: 1e3
                }
            },
            messages: {
                fromDisplayName: {
                    required: ml.messages.error.firstAndLastRequired,
                    minlength: ml.messages.error.firstAndLastRequired,
                    firstAndLastSingleField: ml.messages.error.firstAndLastRequired,
                    noHTML: ml.messages.error.nameInvalid
                },
                fromEmail: {
                    required: ml.messages.error.emailRequired,
                    email: ml.messages.error.validEmail
                },
                cellPhone: {
                    customPhoneUSandInternational: ml.messages.error.validMobilePhone
                },
                homePhone: {
                    customPhoneUSandInternational: ml.messages.error.validHomePhone
                },
                workPhone: {
                    customPhoneUSandInternational: ml.messages.error.validWorkPhone
                },
                subject: {
                    required: ml.messages.error.subjectRequired,
                    minlength: ml.messages.error.subjectMinLength,
                    maxlength: ml.messages.error.subjectMaxLength
                },
                message: {
                    required: ml.messages.error.messageRequired,
                    minlength: ml.messages.error.messageMinLength,
                    maxlength: ml.messages.error.messageMaxLength
                }
            },
            success: function(results) {
                if (ml.hasOwnProperty("eventTracking") && document.getElementsByClassName("modal-open").length) {
                    var trackingDetails = {
                        EventSourceClient: ml.eventTracking.CONSUMER_EVENT_SOURCE_CLIENT,
                        TemplateTypeCode: ml.eventTracking.ET_PROSPECT_CONTACT_FORM,
                        Subject: $contactForm[0].subject.value,
                        Message: $contactForm[0].message.value,
                        Form: $contactForm[0]
                    };
                    ml.eventTracking.track(ml.eventTracking.EVENT_TRACKING_CODE_CONTACT_MODAL_SUBMITTED, trackingDetails)
                }
                var isVirtualOpenHouse = $contactForm[0].hasOwnProperty("virtualOpenHouseUrl") && !!$contactForm[0].virtualOpenHouseUrl.value
                  , isOnsiteOpenHouse = !isVirtualOpenHouse && $contactForm[0].hasOwnProperty("isOpenHouse") && !!$contactForm[0].isOpenHouse.value;
                if (window.grecaptcha && grecaptcha.reset(),
                results.hasOwnProperty("payload") && results.payload.hasOwnProperty("isSuccess") && results.payload.isSuccess) {
                    var path = window.location.pathname.split("/");
                    if ("listing" === path[1]) {
                        var propertyId = path[3] + "|" + path[5];
                        ml.fbPixel.trackConversion(propertyId, $("#js-listing-city").text())
                    }
                    if (isVirtualOpenHouse && !isOnsiteOpenHouse) {
                        var href = $contactForm[0].virtualOpenHouseUrl.value;
                        window.open(href, "_blank", "noopener noreferrer")
                    }
                    ml.ajaxForm.showThankYouMessage(results.payload.thankYouMarkup),
                    triggerReload = results.payload.reload
                } else
                    $(".js-section-error").html('<div class="alert alert-danger" role="alert">' + ($("#isProspect").length ? 'Please provide a valid name. Go to <a href="/mytools/">account settings</a> to update the name.' : results.message) + "</div>")
            },
            invalidHandler: function(event, validator) {
                ml.contactPreferences.invalidHandler(validator)
            },
            errorMsgAppendToElem: ".js-section-error"
        }),
        void 0 === mlVars.role && $contactForm.on("beforeSubmit", function(event) {
            var $form = $(event.target);
            handle_grecaptcha_presubmit($form)
        })
    };
    return {
        init: function() {
            $contactForm = $("#js-contact-form"),
            initializeAjaxForm(),
            ml.changeEmailForm.primaryEmailUpdatedNotification(function(newPrimaryEmail) {
                $(".js-prospect-email").text(newPrimaryEmail)
            })
        },
        reloadCheck: function() {
            return triggerReload
        }
    }
}(jQuery),
$(document).ready(function() {
    $("#js-contact-form").length && ml.contactForm.init()
});
var FB_Runtime = function() {
    var FB_init_callbacks = FB_init_callbacks || []
      , FB_init_params = {};
    return {
        get: function() {
            return FB_init_callbacks
        },
        add: function(new_fb_callback, params) {
            FB_init_callbacks.push(new_fb_callback),
            params && (FB_init_params[FB_init_callbacks.length - 1] = params)
        },
        getParams: function() {
            return FB_init_params
        }
    }
}();
window.fbAsyncInit = function() {
    "undefined" != typeof JS_VARS && void 0 !== JS_VARS.social && (FB.init({
        appId: JS_VARS.social.facebookApiKey,
        xfbml: !0,
        version: "v2.1"
    }),
    $(document).ready(function() {
        var params = FB_Runtime.getParams();
        FB_Runtime.get().forEach(function(element, index, array) {
            "function" == typeof element && (params[index] ? element(params[index]) : element())
        })
    }))
}
,
$.fn.serializeObject = function() {
    var o = {}
      , a = this.serializeArray();
    return $.each(a, function() {
        void 0 !== o[this.name] ? (o[this.name].push || (o[this.name] = [o[this.name]]),
        o[this.name].push(this.value || "")) : o[this.name] = this.value || ""
    }),
    o
}
,
function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    d.getElementById(id) || $("body").hasClass("layout-thickbox") || (js = d.createElement(s),
    js.id = id,
    js.src = "//connect.facebook.net/en_US/sdk.js",
    fjs.parentNode.insertBefore(js, fjs))
}(document, "script", "facebook-jssdk");
var FB_Api = function() {
    var scope = "undefined" != typeof JS_VARS && JS_VARS.social.facebookRegistrationScope || "public_profile,email";
    return {
        network: "Facebook",
        me: function(callback) {
            FB.api("/me?fields=name,email,link", function(response) {
                callback(response)
            })
        },
        login: function(connectedCallback, failedCallback) {
            FB.login(function(response) {
                "connected" === response.status ? connectedCallback(response) : failedCallback(response)
            }, {
                scope: scope
            })
        },
        logout: function(callback) {
            FB.logout(function(response) {
                "function" == typeof callback && callback()
            })
        },
        loginStatusCheck: function(hasAccountCallback, noAccountCallback) {
            FB.getLoginStatus(function(response) {
                "connected" === response.status ? hasAccountCallback(response) : noAccountCallback(response)
            })
        },
        userPicture: function(userId, successCallback, errorCallback, type, height, width) {
            FB.api("/" + userId + "/picture", {
                redirect: !1,
                height: height || "65",
                type: type || "normal",
                width: width || "65"
            }, function(response) {
                response && !response.error ? "function" == typeof successCallback && successCallback(response) : "function" == typeof errorCallback && errorCallback(response)
            })
        }
    }
}()
  , Social_Myml = function() {
    var network_lib = null
      , idx_domain = "undefined" != typeof JS_VARS ? JS_VARS.idx.referrer || JS_VARS.idx.domain : ""
      , app_host_domain = "undefined" != typeof JS_VARS ? JS_VARS.social.appHostDomain || "" : ""
      , fb_field_map = {
        first_name: "firstName",
        last_name: "lastName",
        email: "emailAddress"
    };
    return {
        user: {},
        init: function() {
            Social_Myml.receiveEvents(),
            network_lib = FB_Api
        },
        disableControls: function() {
            $(".fb-login").addClass("fb-disable")
        },
        enableControls: function() {
            $(".fb-login").removeClass("fb-disable")
        },
        controlsDisabled: function() {
            return $(".fb-disable").length
        },
        getIdxDomain: function() {
            return idx_domain
        },
        getSocialFrame: function() {
            return document.getElementById("facebookframe").contentWindow
        },
        initializeLoginButtons: function() {
            $(".fb-reg").on("click", function() {
                network_lib.login(Social_Myml.registrationCallback, Social_Myml.loginApp)
            }),
            $(".fb-login").on("click", function() {
                network_lib.login(Social_Myml.loginCallback, Social_Myml.loginApp)
            })
        },
        loginApp: function() {
            network_lib.login(Social_Myml.registrationCallback, function() {})
        },
        registrationCallback: function(loginResponse) {
            Social_Myml.authenticationCallback(loginResponse, "Register")
        },
        loginCallback: function(loginResponse) {
            Social_Myml.authenticationCallback(loginResponse, "Login")
        },
        authenticationCallback: function(loginResponse, type) {
            var userId = loginResponse.authResponse.userID;
            network_lib.me(function(user) {
                user && !user.error && (user.socialNetwork = network_lib.network,
                user.socialLogin = userId,
                user.accessToken = loginResponse.authResponse.accessToken,
                Social_Myml.user = user,
                "Register" == type ? Social_Myml.sendRegistrationRequest() : Social_Myml.sendLoginRequest())
            })
        },
        sendDismissRegistrationModal: function() {
            window.top.postMessage("dismiss_regform", idx_domain)
        },
        sendRegistrationRequest: function() {
            Social_Myml.user.action = "Register",
            window.parent.postMessage(JSON.stringify(Social_Myml.user), idx_domain)
        },
        sendLoginRequest: function() {
            Social_Myml.user.action = "Login",
            window.parent.postMessage(JSON.stringify(Social_Myml.user), idx_domain)
        },
        receiveEvents: function() {
            window.addEventListener("message", function(event) {
                event.origin !== app_host_domain && event.origin !== idx_domain || Social_Myml.runEventMessage(event)
            }, !1)
        },
        runEventMessage: function(event) {
            var eventData = null;
            "dismiss_regform" === event.data ? $(window).trigger("dismiss_regform") : "enable_controls" === event.data ? Social_Myml.enableControls() : "disable_controls" === event.data ? Social_Myml.disableControls() : ("string" == typeof event.data && (eventData = JSON.parse(event.data)),
            eventData && "object" == typeof eventData && eventData.action && ("Register" == eventData.action && "register" === ml.registration.state ? Social_Myml.registerAccount(eventData) : Social_Myml.loginAccount(eventData)))
        },
        registerAccount: function(userData) {
            Social_Myml.getSocialFrame().postMessage("disable_controls", app_host_domain);
            var defaultFormData = $("form").serializeObject();
            userData = Social_Myml.mapFields(userData);
            var allRegData = $.extend(!0, {}, defaultFormData, userData);
            allRegData.firstAndLast = allRegData.name,
            allRegData.emailAddress = allRegData.email;
            $.ajax({
                url: "/forms/prospect/consumerregistration/",
                data: allRegData,
                type: "POST",
                dataType: "json",
                success: function(response) {
                    window.location.reload()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Social_Myml.getSocialFrame().postMessage("enable_controls", app_host_domain)
                }
            })
        },
        loginAccount: function(userData) {
            Social_Myml.getSocialFrame().postMessage("disable_controls", app_host_domain);
            var defaultFormData = $("form").serializeObject()
              , allRegData = $.extend(!0, {}, defaultFormData, userData);
            allRegData.login = "",
            allRegData.password = "",
            $.ajax({
                url: "/forms/prospect/socialauth/",
                data: allRegData,
                type: "POST",
                dataType: "json",
                success: function(response) {
                    $(".js-error-message").html(""),
                    "error" === response.messageType && $(".js-error-message").append('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="icon-mlclose"></i></button><p>' + response.message + "</p></div>"),
                    Social_Myml.envelope(response)
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Social_Myml.getSocialFrame().postMessage("enable_controls", app_host_domain)
                }
            })
        },
        envelope: function(response) {
            response.redirectUrl += response.redirectUrl.length ? -1 === response.redirectUrl.indexOf("?") ? "?socialflow=1" : "&socialflow=1" : "";
            EnvelopeClass.init(response);
            Social_Myml.getSocialFrame().postMessage("enable_controls", app_host_domain)
        },
        mapFields: function(facebookData) {
            for (var prop in facebookData)
                facebookData.hasOwnProperty(prop) && void 0 !== fb_field_map[prop] && (facebookData[fb_field_map[prop]] = facebookData[prop]);
            return facebookData
        }
    }
}();
Social_Myml.init(),
FB_Runtime.add(Social_Myml.initializeLoginButtons);
var ml = ml || {};
ml.breakPoints = {
    screenSmMin: "576px",
    screenMdMin: "768px",
    screenLgMin: "992px",
    screenXLgMin: "1200px",
    screenXsMax: "575px",
    screenSmMax: "767px",
    screenMdMax: "991px",
    screenLgMax: "1199px"
},
ml.isMobile = function() {
    return window.matchMedia("(max-width: " + ml.breakPoints.screenMdMax + ")").matches
}
,
$(document).ready(function() {
    setTimeout(function() {
        $(".setFocus").focus()
    }, 1);
    var selector = ".loading[id^=profilelist_]";
    $(selector).length && $(window).bind("scroll", {
        _selector: selector,
        _container: window,
        _threshold: 100
    }, llProfileImages).trigger("scroll"),
    $(window).scroll(function() {
        $(this).scrollTop() >= 80 ? $("#return-to-top").fadeIn(200) : $("#return-to-top").fadeOut(200)
    }),
    $("#return-to-top").click(function() {
        $("body,html").animate({
            scrollTop: 0
        }, 500)
    }),
    $(".custom-combo-select-wrapper:not(.ignore-click-showhide) input").on("focus", function(e) {
        var parent = $(e.target).parent(".custom-combo-select-wrapper");
        $(parent).hasClass("open") ? $(parent).removeClass("open") : $(parent).addClass("open")
    }),
    $(".custom-combo-select-wrapper:not(.ignore-click-select) .input-suggestions a").on("click", function(e) {
        var parents = $(e.target).parents(".custom-combo-select-wrapper")
          , input = $(parents[0]).find("input")
          , value = $(e.target).text();
        $(input).val(value)
    }),
    $("[data-input-source]").on("keydown", function(e) {
        if ("tab" === e.key.toLowerCase() && !e.shiftKey) {
            e.preventDefault();
            var targetFilterDropdown = $(e.target).siblings(".input-suggestions").filter(":visible")[0];
            $($(targetFilterDropdown).find("a")[0]).focus()
        }
    }),
    $(".custom-combo-select-wrapper a").on("keydown", function(e) {
        var $previousSibling = $(e.target.previousElementSibling)
          , $nextSibling = $(e.target.nextElementSibling);
        switch (e.key) {
        case "ArrowUp":
            $previousSibling.is("a") && $previousSibling.parents(".input-suggestions").length > 0 && $previousSibling.focus();
            break;
        case "ArrowDown":
            $nextSibling.is("a") && $nextSibling.parents(".input-suggestions").length > 0 && $nextSibling.focus();
            break;
        case " ":
            e.preventDefault(),
            $(e.target.click());
        default:
            var candidates = [];
            if (1 == e.key.length) {
                for (var key = e.key.toLowerCase(), keyIsDollarSign = "$" === key, children = $($(e.target).parents(".input-suggestions")[0]).children(), i = 0; i < children.length; i++) {
                    var $element = $(children[i])
                      , test = $element.text();
                    keyIsDollarSign || (test = test.replace("$", "")),
                    test.toLowerCase()[0] == key && candidates.push($element)
                }
                for (var startIndex = -1, i = 0; i < candidates.length; i++)
                    if ($(candidates[i]).text().toLowerCase() == $(e.target).text().toLowerCase()) {
                        startIndex = i;
                        break
                    }
                candidates.length > 1 ? (startIndex + 1 >= candidates.length ? startIndex = 0 : startIndex++,
                $(candidates[startIndex]).focus()) : 1 == candidates.length && $(candidates[0]).focus()
            }
        }
    })
});
var ESC_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}
  , ml = ml || {};
ml.forgotPasswordContact = function() {
    function initAjaxForm() {
        $form.ajaxForm({
            rules: {
                password1: "required",
                password2: {
                    equalTo: "#password1"
                }
            },
            messages: {
                password1: ml.messages.error.passwordRequired,
                password2: ml.messages.error.passwordsMustMatch
            },
            errorMsgAppendToElem: ".js-forgot-password-error",
            success: function(response) {
                response && response.redirectUrl && (window.location.href = response.redirectUrl)
            }
        })
    }
    var $form;
    return {
        init: function() {
            $form = $("#js-reset-consumer-password-form"),
            initAjaxForm()
        }
    }
}(),
ml.forgotPasswordAgent = function() {
    function initAjaxForm() {
        $form.ajaxForm({
            rules: {
                password1: {
                    required: !0,
                    agentStrongPassword: !0
                },
                password2: {
                    equalTo: "#password1"
                }
            },
            messages: {
                password1: {
                    required: ml.messages.error.passwordRequired
                },
                password2: ml.messages.error.passwordsMustMatch
            },
            errorMsgAppendToElem: ".js-forgot-password-error",
            success: function(response) {
                response && response.redirectUrl && (window.location.href = response.redirectUrl)
            }
        })
    }
    var $form;
    return {
        init: function() {
            $form = $("#js-reset-profile-password-form"),
            initAjaxForm()
        }
    }
}(),
$(document).ready(function() {
    $("#js-reset-consumer-password-form").length && ml.forgotPasswordContact.init(),
    $("#js-reset-profile-password-form").length && ml.forgotPasswordAgent.init()
});
