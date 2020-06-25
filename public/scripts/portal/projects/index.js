// JS File for Portal Sponsor Management View

$(function () {
	$('#tblProjects').DataTable({
		"searching":   false,
        "ordering": false,
        "responsive": {
            "details": {
                "type": "column"
            }
        },
        "ordering": true,
        "bAutoWidth": false,
        "columnDefs": [ {
			"className": "control",
			"orderable": false,
			"targets":   0
		}],
	});

    $('.alert').click(function() {
        $(this).hide();
    });
});
