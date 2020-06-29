// JS File for Portal Project New View

$(function () {
   $("#frm").validate({
        ignore: ":hidden",
        rules: {
            txtName: { required: true },
            txtWork: { required: true },
            txtStatus: { required: true },
            txtManager: { required: true },
            txtTestLink: { required: true },
            txtGithub: { required: true },
            txtImageLink: { required: true },
            txtDate: { required: true }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.closest('.form-group'));
        }
    })
});