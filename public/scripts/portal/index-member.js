// JS File for Portal Index View

$(function () {
	$('#divEvents').click(function () {
		window.location.href = '/portal/events';
	});

	$('#divRecords').click(function () {
		window.location.href = '/portal/recordings';
	});

	$('#divViewUserProfile').click(function () {
		window.location.href = '/portal/profile';
	});

	$('#divEditUserProfile').click(function () {
		window.location.href = 'portal/profile/edit';
	});
});
