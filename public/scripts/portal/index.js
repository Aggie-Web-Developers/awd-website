// JS File for Portal Index View

$(function () {
    $('#divEvents').click(function() {
		window.location.href = "/portal/events";
	});

    $('#divProjects').click(function() {
        window.location.href = "/portal/projects";
    });

    $('#divEmails').click(function() {
        window.location.href = "/portal/email";
    });
});
