// JS File for Portal Index View

$(function () {
	$('#divEvents').click(function () { //# processing
		window.location.href = '/portal/events';
	});

	$('#divRecords').click(function () {
		window.location.href = '/portal/records';
	});

	$('#divViewUserProfile').click(function () {
		window.location.href = '/portal/viewuserprofile';
	});

	$('#divEditUserProfile').click(function () {
		window.location.href = '/portal/edituserprofile';
	});
});
