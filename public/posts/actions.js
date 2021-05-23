function actions() {
	// Bookmark
	var bookmarks = document.querySelectorAll('.bookmark');
	var bookmark_count = document.querySelector('.bookmarkCount');
	bookmarks.forEach((bookmark) => {
		bookmark.addEventListener('click', (e) => {
			var id = bookmark.getAttribute('data-id');
			if (bookmark.classList.contains('fas')) {
				bookmark.classList.remove('fas');
				fetch('/api/bookmarks/delete/' + id, { method: 'DELETE' })
					.then(console.log('deleting ' + id))
					.catch((err) => {
						throw err;
					});
				let counter = bookmark_count.innerHTML;
				counter--;
				bookmark_count.innerHTML = counter;
			} else {
				bookmark.classList.add('fas');
				fetch('/api/bookmarks/new/' + id, { method: 'POST' }).then(console.log('adding ' + id)).catch((err) => {
					throw err;
				});
				let counter = bookmark_count.innerHTML;
				counter++;
				bookmark_count.innerHTML = counter;
			}
		});
	});

	// Likes
	var likes = document.querySelectorAll('.likes');
	likes.forEach((like) => {
		like.addEventListener('click', (e) => {
			var id = like.getAttribute('data-id');
			if (like.classList.contains('fas')) {
				like.classList.remove('fas');
				fetch('/api/likes/delete/' + id, { method: 'DELETE' })
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
				fetch('/api/likes/new/' + id, { method: 'POST' }).then(console.log('adding ' + id)).catch((err) => {
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
