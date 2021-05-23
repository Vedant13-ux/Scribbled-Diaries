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

// COmments
const newComment = document.querySelector('#newComment');
const cmnt_input = document.querySelector('#cmnt_input');
const comments = $('.comments');
const id = cmnt_input.getAttribute('data-id');
const cmnt_counter = document.querySelector('.cmnt_counter');
post_btn.addEventListener('click', (e) => {
	e.preventDefault();
	console.log(id);
	let commentText = cmnt_input.value;
	cmnt_input.value = '';
	axios
		.post('/api/posts/' + id + '/comments', { text: commentText })
		.then((response) => {
			let data = response.data;
			comments.prepend(data);
		})
		.catch((err) => {
			throw err;
		});
	let counter = cmnt_counter.innerHTML;
	counter++;
	cmnt_counter.innerHTML = counter;
});

// Delete Comment
// $('.delete_cmnt').on('click', (e) => {
// 	let cmnt_id = e.target.getAttribute('data-id');
// 	axios
// 		.delete('/api/comments/delete/' + cmnt_id)
// 		.then(() => {
// 			let counter = cmnt_counter.innerHTML;
// 			counter--;
// 			cmnt_counter.innerHTML = counter;
// 		})
// 		.catch((err) => console.log(err));
// 		console.log('Deleted');
// 	axios
// 		.get('/api/posts/' + id + '/comments')
// 		.then((response) => {
// 			let data = response.data;
// 			comments.html(data);
// 		})
// 		.catch((err) => console.log(err));

// });
const delete_cmnt = document.querySelectorAll('.delete_cmnt');
delete_cmnt.forEach((cmnt) => {
	cmnt.addEventListener(
		'click',
		(e) => {
			let cmnt_id = e.target.getAttribute('data-id');
			axios
				.delete('/api/comments/delete/' + cmnt_id)
				.then(() => {
					let counter = cmnt_counter.innerHTML;
					counter--;
					cmnt_counter.innerHTML = counter;
				})
				.catch((err) => console.log(err));
			console.log('Deleted');
			axios
				.get('/api/posts/' + id + '/comments')
				.then((response) => {
					let data = response.data;
					comments.html(data);
				})
				.catch((err) => console.log(err));
		},
		false
	);
});

