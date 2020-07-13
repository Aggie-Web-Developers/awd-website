// JS File for Portal Project Edit View

$(function () {
    $("#frm").validate({
        ignore: ":hidden",
        rules: {
            txtName: { required: true, maxlength: 50 },
            txtWork: { required: true, maxlength: 50 },
            txtStatus: { required: true, maxlength: 25 },
            txtManager: { required: true, maxlength: 50 },
            txtTestLink: { required: true, maxlength: 150  },
            txtGithub: { required: true, maxlength: 150  },
            txtImageLink: { required: true, maxlength: 500 },
            txtDate: { required: true }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.closest('.form-group'));
        }
    })
});