// JS File for Member Profile Edit View

$(function () {
	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtUserFirstName: { required: true, maxlength: 50 },
			txtUserLastName: { required: true, maxlength: 50 },
			txtUserEmail: { required: true, email: true, maxlength: 100 },
			txtUserWebsite: { required: false, maxlength: 250 },
			fileProfilePicture: { required: false, accept: 'image/*' },
		},
        messages: {
			txtUserEmail: { email: 'Please enter a valid email address' },
			fileProfilePicture: { accept: 'Please upload a valid filetype' },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});

	var uploadedImage = document.getElementById('uploadedImage');
	var croppedImage = null;
	var fileProfilePicture = document.getElementById('fileProfilePicture');
	var $modal = $('#modal');
	var cropper = null;
    
	fileProfilePicture.addEventListener('change', function (e) {
	  	var files = e.target.files;
		var done = function (url) {
			fileProfilePicture.value = '';
			uploadedImage.src = url;
			$modal.modal('show');
		};
		var reader;
		var file;
  
		if (files && files.length > 0) {
			file = files[0];
  
			if (URL) {
				done(URL.createObjectURL(file));
			} else if (FileReader) {
				reader = new FileReader();
				reader.onload = function (e) {
					done(reader.result);
				};
				reader.readAsDataURL(file);
			}
		}
	});
  
	$modal.on('shown.bs.modal', function () {
	    cropper = new Cropper(uploadedImage, {
			aspectRatio: 1,
			viewMode: 3,
		});
	}).on('hidden.bs.modal', function () {
		  cropper.destroy();
		  cropper = null;
	});
  
	$('#crop').on('click', function () {
		if (cropper) {
			cropper.getCroppedCanvas({
			    width: 1000,
			    height: 1000,
			}).toBlob(function (blob) {   
				croppedImage = blob;
			});
	    }

		$modal.modal('hide');
	});

	$('#submitButton').on('click', function () {
		var formData = new FormData(document.getElementById('frm'));
		if (croppedImage) formData.set('fileProfilePicture', croppedImage, 'profile.png');
		// for (var value of formData.values()) {
		// 	console.log(value);
		// }
		$.ajax({
			url: '/portal/profile/edit',
			method: 'PUT',
			contentType: false,
			data: formData,
 			processData: false,
			error: function (xhr, status, error) {
				var errorMessage = xhr.status + ': ' + xhr.statusText
				alert('Error: ' + errorMessage);
			}
		});
	});
});
