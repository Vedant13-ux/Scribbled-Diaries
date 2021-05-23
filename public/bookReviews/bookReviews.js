$('.ui.dropdown').dropdown();


$(document).ready(function() {
	$('.rating').rating('disable');
});

function actions() {
	// Likes
	var likes = document.querySelectorAll('.likes');
	likes.forEach((like) => {
		like.addEventListener('click', (e) => {
			var id = like.getAttribute('data-id');
			if (like.classList.contains('fas')) {
				like.classList.remove('fas');
				fetch('/api/bookReview/likes/delete/' + id, { method: 'DELETE' })
					.then(console.log('deleting ' + id))
					.catch((err) => {
						throw err;
					});
				let like_count = like.children[0];
				let counter = like_count.innerHTML;
				counter--;
				like_count.innerHTML = counter;
			} else {
				like.classList.add('fas');
				fetch('/api/bookReview/likes/new/' + id, { method: 'POST' }).then(console.log('adding ' + id)).catch((err) => {
					throw err;
				});
				let like_count = like.children[0];
				let counter = like_count.innerHTML;
				counter++;
				like_count.innerHTML = counter;
			}
		});
	});
}
window.addEventListener('load', actions);

