// JS File for Portal Email Management View

$(function () {
    $('#txtBody').summernote();

    $("#frm").validate({
        ignore: ":hidden",
        rules: {
            txtSubject: { required: true },
            txtBody: { required: true },
            ddlEmailType: { required: true }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.closest('.form-group'));
        }
    })
});