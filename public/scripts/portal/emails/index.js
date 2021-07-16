// JS File for Portal Email Management View

$(function () {
	$('#tblEmails').DataTable({
		searching: false,
		ordering: false,
		responsive: {
			details: {
				type: 'column',
			},
		},
		ordering: true,
		bAutoWidth: false,
		columnDefs: [
			{
				className: 'control',
				orderable: false,
				targets: 0,
			},
		],
	});

	convertSendDatesToLocalTime();

	$('.alert').click(function () {
		$(this).hide();
	});
});

function convertSendDatesToLocalTime() {
	// send dates are loaded in as utc, this function converts to local and updates all the dates

	$('.date').each(function () {
		if ($(this).text() != '') {
			const sendDate = new Date($(this).text()); // convert UTC date to JS object in user's timezone

			$(this).text(
				sendDate.toLocaleTimeString([], {
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
			);
		}
	});
}
