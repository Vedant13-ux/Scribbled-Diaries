// Counter
const user_id = document.querySelector('.user_name').getAttribute('data-id');
const currentUser_id = document.querySelector('.currentUser').getAttribute('data-current-id');
console.log(user_id, currentUser_id);
const userObj = document.querySelector('.userObj').getAttribute('data-user');

$('.count').each(function() {
	$(this).prop('Counter', 0).animate(
		{
			Counter: $(this).text()
		},
		{
			duration: 3000,
			easing: 'swing',
			step: function(now) {
				$(this).text(Math.ceil(now));
			}
		}
	);
});

// Share

if (userObj.posts) {
	// Share
	const share_btn = document.querySelector('.share_button');
	const share_menu = document.querySelector('.share');
	var clicked = false;

	share_btn.addEventListener('click', () => {
		if (clicked) {
			share_menu.style.display = 'none';
			share_menu.style.transform = 'translateY(-12px)';
			var clicked = false;
		} else {
			share_menu.style.display = 'block';
			share_menu.style.transform = 'translateY(0px)';
			clicked = true;
		}
	});
}

if (currentUser_id == user_id) {
	// Image Upload
	const fi = document.getElementById('file');
	const imgUpload = document.querySelector('#imgUpload');
	const alert_img = document.querySelector('#update_img');
	// Size Validation on Image Upload
	function Filevalidation() {
		// Check if any file is selected.
		if (fi.files.length > 0) {
			for (let i = 0; i <= fi.files.length - 1; i++) {
				let fsize = fi.files.item(i).size;
				let file = Math.round(fsize / 1024);
				// The size of the file.
				var fullPath = fi.value;
				if (fullPath) {
					var startIndex =
						fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/');
					var filename = fullPath.substring(startIndex);
					if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
						filename = filename.substring(1);
					}
					document.querySelector('.custom-file-label').innerHTML =
						filename + ' (' + '<b>' + file + '</b> KB' + ')';
				}
				if (file > 4096) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
	imgUpload.addEventListener('submit', (e) => {
		if (Filevalidation() == false) {
			e.preventDefault();
			alert_img.innerHTML =
				'<i class="fas fa-exclamation-circle"></i>File too Big, please select a file less than 4mb';
		} else {
			alert_img.innerHTML = '';
		}
	});

	// Social Media Handles
	const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);

	// Facebook
	const facebook = document.querySelector('#facebook_form');
	const facebook_btn = document.querySelector('#facebook_btn');
	var alert_fb = document.querySelector('#update_fb');
	facebook_btn.addEventListener('click', (e) => {
		e.preventDefault();
		let url = facebook.elements.facebook.value;
		if (!url.match(regex)) {
			alert_fb.innerHTML = '<i class="fas fa-exclamation-circle"></i>URL is not valid';
			return;
		}
		axios
			.post('/api/socialHandles/facebook', { url: url })
			.then((response) => {
				alert_fb.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
			})
			.catch((err) => console.log(err.message));
	});

	// Twitter
	const twitter = document.querySelector('#twitter_form');
	const twitter_btn = document.querySelector('#twitter_btn');
	var alert_tw = document.querySelector('#update_tw');
	twitter_btn.addEventListener('click', (e) => {
		e.preventDefault();
		let url = twitter.elements.twitter.value;
		if (!url.match(regex)) {
			alert_tw.innerHTML = '<i class="fas fa-exclamation-circle"></i>URL is not valid';
			return;
		}
		axios
			.post('/api/socialHandles/twitter', { url: url })
			.then((response) => {
				alert_tw.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
			})
			.catch((err) => console.log(err.message));
	});

	// Instagram
	const instagram = document.querySelector('#instagram_form');
	const instagram_btn = document.querySelector('#instagram_btn');
	var alert_insta = document.querySelector('#update_insta');
	instagram_btn.addEventListener('click', (e) => {
		e.preventDefault();
		let url = instagram.elements.instagram.value;
		if (!url.match(regex)) {
			alert_insta.innerHTML = '<i class="fas fa-exclamation-circle"></i>URL is not valid';
			return;
		}
		axios
			.post('/api/socialHandles/instagram', { url: url })
			.then((response) => {
				alert_insta.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
			})
			.catch((err) => console.log(err.message));
	});

	// linkedin
	const linkedin = document.querySelector('#linkedin_form');
	const linkedin_btn = document.querySelector('#linkedin_btn');
	var alert_linkedin = document.querySelector('#update_linkedin');
	linkedin_btn.addEventListener('click', (e) => {
		e.preventDefault();
		let url = linkedin.elements.linkedin.value;
		if (!url.match(regex)) {
			alert_linkedin.innerHTML = '<i class="fas fa-exclamation-circle"></i>URL is not valid';
			return;
		}
		axios
			.post('/api/socialHandles/linkedin', { url: url })
			.then((response) => {
				alert_linkedin.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
			})
			.catch((err) => console.log(err.message));
	});

	// personalBlog
	const blog = document.querySelector('#blog_form');
	const blog_btn = document.querySelector('#blog_btn');
	var alert_blog = document.querySelector('#update_blog');
	blog_btn.addEventListener('click', (e) => {
		e.preventDefault();
		let url = blog.elements.blog.value;
		if (!url.match(regex)) {
			alert_blog.innerHTML = '<i class="fas fa-exclamation-circle"></i>URL is not valid';
			return;
		}
		axios
			.post('/api/socialHandles/personalBlog', { url: url })
			.then((response) => {
				alert_blog.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
			})
			.catch((err) => console.log(err.message));
	});
	// Edit Bio
	const alert_bio = document.querySelector('#alert_bio');
	const bio_submit = document.querySelector('#bio_submit');
	const textArea = document.getElementById('insertBio');
	const bio_content = document.querySelector('#bio_content');

	function checkWordCount() {
		s = textArea.value;
		s = s.replace(/(^\s*)|(\s*$)/gi, '');
		s = s.replace(/[ ]{2,}/gi, ' ');
		s = s.replace(/\n /, '\n');
		if (s.split(' ').length <= 75) {
			return 'min';
		}
		if (s.split(' ').length > 120) {
			return 'max';
		}
	}
	bio_submit.addEventListener('click', (e) => {
		e.preventDefault();
		if (checkWordCount() == 'min') {
			alert_bio.innerHTML = `<i class="fas fa-exclamation-circle"></i>Minimum 75 words required. Currently : ${s.split(
				' '
			).length} words`;
			return false;
		}
		if (checkWordCount() == 'max') {
			alert_bio.innerHTML = `<i class="fas fa-exclamation-circle"></i>Maximum 120 words required. Currently : ${s.split(
				' '
			).length} words`;
			return false;
		}
		axios
			.post('/api/aboutUser', { bio: textArea.value.trim() })
			.then((response) => {
				alert_bio.innerHTML = `<span style="color:black"><i class="fas fa-save" style="margin-right:4px"></i>${response.data}</span>`;
				bio_content.innerHTML = textArea.value.trim();
			})
			.catch((err) => {
				console.log(err);
			});
	});

	// Modal INput Focus
	$('#facebook').on('shown.bs.modal', function() {
		$('.facebook_input').focus();
	});
	$('#twitter').on('shown.bs.modal', function() {
		$('.twitter_input').focus();
	});
	$('#instagram').on('shown.bs.modal', function() {
		$('.instagram_input').focus();
	});
	$('#linkedin').on('shown.bs.modal', function() {
		$('.linkedin_input').focus();
	});
	$('#personalBlog').on('shown.bs.modal', function() {
		$('.personalBlog_input').focus();
	});
	$('#editBio').on('shown.bs.modal', function() {
		$('#insertBio').focus();
	});
}

// Follow
const follow_btn = document.querySelector('#follow_btn');
const count_followers = document.querySelector('.count_follower');

follow_btn.addEventListener('click', (e) => {
	if (follow_btn.textContent === 'Follow') {
		let id = follow_btn.getAttribute('data-id');
		axios.post('/api/follow/add/' + id).then(console.log('adding ' + id)).catch((err) => console.log(err));
		follow_btn.textContent = 'Unfollow';
		let counter = count_followers.innerHTML;
		counter++;
		count_followers.innerHTML = counter;
	} else {
		let id = follow_btn.getAttribute('data-id');
		axios.post('/api/follow/delete/' + id).then(console.log('deleting ' + id)).catch((err) => console.log(err));
		follow_btn.textContent = 'Follow';
		let counter = count_followers.innerHTML;
		counter--;
		count_followers.innerHTML = counter;
	}
});
