// JS File for Portal Event Management View

$(function () {
	$('#divPreview').hide();

	if ($('#ddlEventType').val() != 'News') $('#divLocation').show();
	else $('#divLocation').hide();

	// animate news card section
	$('.post-module').hover(function () {
		$(this).find('.description').stop().animate(
			{
				height: 'toggle',
				opacity: 'toggle',
			},
			300
		);
	});

	$('#ddlEventType').change(function () {
		if ($('#ddlEventType').val() != 'News') $('#divLocation').show();
		else $('#divLocation').hide();
	});

	$('#btnPreview').click(function () {
		var d = new Date($('#txtDate').val() + ' ' + $('#txtTime').val() + ' UTC');
		var d2 = new Date($('#txtDate').val() + ' ' + $('#txtTime').val());
		var month = d.toLocaleString('default', { month: 'short' });
		var day = d.toLocaleString('default', { day: 'numeric' });

		if ($('#ddlEventType').val() == 'News') {
			$('.date').hide();
			$('.pm').html(
				"<span class='timestamp'><i class='fas fa-user-edit mr-2'></i>Your Name</span>"
			);
		} else {
			$('.date').show();
			$('#divMonth').html(month);
			$('.day').html(day);
			$('.pm').html(
				"<span class='timestamp'><i class='fas fa-map-marker-alt mr-2'></i>" +
					$('#txtLocation').val() +
					'</span>'
			);
		}

		$('.ts-1').html(
			month +
				' ' +
				day +
				', ' +
				d2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
		$('.title').html($('#txtEventName').val());
		$('#imgEvent').attr('src', $('#txtImage').val());
		$('.category').html($('#ddlEventType').val());
		$('.sub_title').html($('#txtEventSubTitle').val());
		$('.description').html($('#txtDescr').val());

		$('#divPreview').show();
	});

	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtEventName: { required: true },
			txtEventSubTitle: { required: true },
			txtDescr: { required: true },
			txtImage: { required: true },
			txtDate: { required: true },
			txtLocation: { required: true },
			txtStartDate: { required: true },
			txtEndDate: { required: true },
			txtLocation: { required: true },
			txtTime: { required: true },
			ddlEventType: { required: true },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
