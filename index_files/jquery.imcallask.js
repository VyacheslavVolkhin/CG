/*
	Author: Igor Mirochnik
	Site: http://ida-freewares.ru
    Site: http://im-cloud.ru
	Email: dev.imirochnik@gmail.com
	Type: commercial
*/

function IMCallMeAskMe_getQueryParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.split('#')[0]);
    if (results)
        return results[1];
    else
        return '';
}

// Чтобы собирать disabled
(function ($) {
  	$.fn.serializeAll = function () {
    	var data = $(this).serializeArray();

	    $(':disabled[name]', this).each(function () { 
	        data.push({ name: this.name, value: $(this).val() });
	    });

    	return data;
  	}
})(jQuery);

function IMCallMeAskMe_collectParams(form) {
	var sendArray = form.serializeAll(),
		queryArray = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
	;

	// Сохраняем UTM метки
	for (var cnt = 0; cnt < queryArray.length; cnt++) {
		sendArray.push({
			name: queryArray[cnt],
			value: 	IMCallMeAskMe_getQueryParam(queryArray[cnt])
		});
	}
	
	return sendArray;
}

function IMCallMeAskMe_afterSubmit(container, form, json)
{
	var jq = jQuery
	;
    container.find('.alert, .text-danger').remove();

    if (json['error']) {
        if (json['errors']) {
        	for (var cnt = 0; cnt < json['errors'].length; cnt++) {
                form.prepend(
                	'<div class="alert alert-warning">' 
                		+ json['errors'][cnt]
                		+ '<button type="button" class="close" data-dismiss="alert">&times;</button>'
                	+ '</div>'
                );
			}
        }

        for (i in json['messages']) {
            var element = container.find('input[name="' + i + '"], textarea[name="' + i + '"]');
            element.closest('.frm-row').addClass('has-error');
        }

		if (json['email_send']) {
			var element = jq('<div class="alert alert-danger" role="alert"></div>');
			element.text(json['email_send']);
			form.prepend(element);
		}
		
        // Highlight any found errors
        jq('.text-danger').parent().addClass('has-error');
    }
    else {
    	var status_complete = jQuery(
    		'<div class="alert alert-success">'
				+ json['complete']
			+ '</div>'
    	);
    	status_complete.insertBefore(form.find('*:first'));
		container.find('#imcallask-form-container-popup').fadeOut(3000, function() {
			// Удаление формы, если все корректно отправлено (для повторной загрузки)
			jq('#imcallask-form-container-popup').on('hidden.bs.modal', function () {
			    if (jq(this).find('form .alert-success').length > 0) {
					jq('.imcallask-form-container').remove();
				}
			});
			jq(this).modal('hide');
			//form.find('.alert-success').remove();
		});//.modal('hide');
	}
}

function IMCallMeAskMe_formSubmit(container) {
	container.find('form').submit(function (e) {
		e.preventDefault();
		
		var jq = jQuery,
			form = jq(this),
        	submit = form.find('button[type=submit]')
        ;

		container.find('.has-error').removeClass('has-error');

        jq.ajax({
            url: form.attr('action'),
            type: 'post',
            cache: false,
            data: IMCallMeAskMe_collectParams(form),
            dataType: 'json',
            beforeSend: function() {
                submit.button('loading');
            },
            complete: function() {
                submit.button('reset');
            },
            success: function(json) {
            	IMCallMeAskMe_afterSubmit(container, form, json);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
		
		return false;
	});
}

function IMCallMeAskMe_loadFile(container) 
{
	var mainForm = container.find('form'),
		uploads = mainForm.find('.imcallask-file-upload'),
		jq = jQuery
	;
	
	if (uploads.length == 0) {
		return;
	}
	
	uploads.find('button').click(function () {
		var item = jq(this),
			itemFormControl = item.closest('.imcallask-file-upload')
		;
		
		mainForm.find('.alert-warning').remove();
		itemFormControl.find('.text-danger').remove();
		
		jq('.imcallask-file-upload-form').remove();
		
		jq('body').append(
			'<form enctype="multipart/form-data" '
				+ 'class="imcallask-file-upload-form" ' 
			+ '>'
				+'<input type="file" name="file" />' 
			+ '</form>'
		);
		
		var form = jq('.imcallask-file-upload-form'),
			inputFile = form.find('input[name="file"]')
		;

		inputFile.change(function (){
       		
       		jq.ajax('index.php?route=tool/upload',{
       			type: 'post',
       			data: new FormData(form[0]),
       			dataType: 'json',
       			cache: false,
				contentType: false,
				processData: false,		
				beforeSend: function() {
					item.button('loading');
				},
				complete: function() {
					item.button('reset');
				},	
				success: function(json) {
					if (json['error']) {
						item.closest('.input-group').after(
							'<div class="text-danger">'
								+ json['error'].replace(/<[^>]+>/g, '')
							+ '</div>'
		                );
						itemFormControl.find('input[type="hidden"]').val('');
						itemFormControl.find('input[type="text"]').val('');
					} else if (json['success']) {
						itemFormControl.find('input[type="hidden"]').val(json['code']);

			       		var fileName = inputFile.val()
			       			fileNameArray = fileName.split('\\')
			       		;
			       		
			       		fileName = fileNameArray[fileNameArray.length - 1],
						fileName = fileName.replace(/<!--(.*?)[-][-][>]/g, '');
						fileName = fileName.replace(/<[^>]+>/g, '');
						//fileName = escape(fileName);
			       		
			       		itemFormControl.find('input[type="text"]').val(fileName);
					}
				},			
				error: function(xhr, ajaxOptions, thrownError) {
					alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					item.button('reset');
				}
       			
       		});
       		
     	});
		
		inputFile.trigger('click');
	});
}

function IMCallMeAskMe_formPopup () {
	var jq = jQuery
	;
	
	if (jq('.imcallask-form-container').length > 0) {
		jq('.imcallask-form-container #imcallask-form-container-popup').modal();
	}
	else {
		var container = jq('<div class="imcallask-form-container">')
		;
		
		jQuery('body').append(container);
		
		jq.ajax('index.php?route=module/IMCallMeAskMe/getPopup', {
			success: function (html) {
				var hidden = jq('<input type="hidden" name="url" value="">');
				
				container.html(html);
				
				container.find('form').append(hidden);
				
				hidden.val(encodeURIComponent(window.location));
				
				container.find('#imcallask-form-container-popup').modal();
				IMCallMeAskMe_formSubmit(container);
				IMCallMeAskMe_loadFile(container);
			}
		});		
	}
}

function IMCallMeAskMe_createButton() {
	var jq = jQuery,
		btn = jq('<a href="#" class="imcallask-btn-mini"><div class="imcallask-btn-mini-phone"></div></a>')
	;
	
	jq('body').append(btn);
	
	btn.click(function (e) {
		e.preventDefault();
		IMCallMeAskMe_formPopup();
		return false;
	});
}

jQuery(function () {
	var jq = jQuery
	;
	// Если пользователь сам установил
	if (jq('.imcallask-click').length > 0) {
		jq('.imcallask-click').click(function (e) {
			e.preventDefault();
			IMCallMeAskMe_formPopup();
			return false;
		});
	}
	else {
		IMCallMeAskMe_createButton();
	}

	// Дополнительные элементы
	jq('.imcallask-click-additional').click(function (e) {
		e.preventDefault();
		IMCallMeAskMe_formPopup();
		return false;
	});
});