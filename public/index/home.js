const share_btn = document.querySelector('.share_button');
const share_menu = document.querySelector('.share');
var clicked = false;
var search = document.querySelector('.searchCategory');
var search_input = document.querySelector('#page_form');
var card_cont = document.querySelector('#cont');
var svg = document.querySelector('#search_svg');

// console.log(currentUser);

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

$('.ui.dropdown').dropdown();

//*************** */
$('input').keypress((e) => {
	if (e.which == '13') {
		window.location.href = '/home#cont';
	}
});
// *************
// pOSt LInk

// Search
search_input.addEventListener('input', () => {
	if (search.textContent === 'Category' && (search_input.value != '' )) {
		var query = search_input.value;
		axios
			.get('/api/posts/category/' + query)
			.then((response) => {
				let data = response.data;
				card_cont.innerHTML = data;
				actions();
			})
			.catch((err) => {
				console.log(err);
			});
	}
	if (search.textContent === 'Overtone' && (search_input.value != '' )) {
		var query = search_input.value;
		axios
			.get(`/api/posts/overtone/${query}`)
			.then((response) => {
				let data = response.data;
				card_cont.innerHTML = data;
				actions();
			})
			.catch((err) => {
				console.log(err);
			});
	}
	if (search.textContent === 'Authors' && (search_input.value != '' )) {
		var query = search_input.value;
		axios
			.get(`/api/posts/author/${query}`)
			.then((response) => {
				let data = response.data;
				card_cont.innerHTML = data;
				actions();
			})
			.catch((err) => {
				console.log(err);
			});
	}
	if (search.textContent === 'Title' && (search_input.value != '' )) {
		var query = search_input.value;
		axios
			.get('/api/posts/title/' + query)
			.then((response) => {
				let data = response.data;
				card_cont.innerHTML = data;
				actions();
			})
			.catch((err) => {
				throw err;
			});
	}
	if (search_input.value == '') {
		axios
			.get('/api/posts')
			.then((response) => {
				let data = response.data;
				card_cont.innerHTML = data;
				actions();
			})
			.catch((err) => {
				throw err;
			});
	}
});
