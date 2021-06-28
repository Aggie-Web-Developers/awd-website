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
	var isCropped = false;
    
	// Get URL of uploaded image to display within cropping modal
	fileProfilePicture.addEventListener('change', function (e) {
	  	var files = e.target.files;
		var done = function (url) {
			uploadedImage.src = url;
			$modal.modal('show');
		};
		var reader;
		var file;
  
		isCropped = false;
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
  
	// Create or destory Cropper instance based on modal visibility
	$modal.on('shown.bs.modal', function () {
	    cropper = new Cropper(uploadedImage, {
			aspectRatio: 1,
			viewMode: 3,
		});
	}).on('hidden.bs.modal', function () {
		  cropper.destroy();
		  cropper = null;
		  // Removes uploaded file if not cropped
		  if (!isCropped) fileProfilePicture.value = '';
	});
  
	// Create blob object to include cropped image in PUT request
	$('#crop').on('click', function () {
		if (cropper) {
			cropper.getCroppedCanvas({
			    width: 1000,
			    height: 1000,
			}).toBlob(function (blob) {   
				croppedImage = blob;
			});
	    }
		isCropped = true;
		$modal.modal('hide');
	});

	// Make PUT request on submission
	$('#submitButton').on('click', function () {
		var formData = new FormData(document.getElementById('frm'));
		// Replace uploaded image with cropped image
		if (croppedImage) formData.set('fileProfilePicture', croppedImage, 'profile.png');

		$.ajax({
			method: 'PUT',
			contentType: false,
			data: formData,
 			processData: false,
			success: function (data, textStatus) {
				alert( 'Success! Profile updated.' );
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert( 'Error updating profile.' );
			},
			complete: function (jqXHR, textStatus) {
				window.location.href = '../profile';
			},
		});
	});
});
