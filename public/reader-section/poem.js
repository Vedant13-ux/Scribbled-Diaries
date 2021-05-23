const submit = document.querySelector('#submit');
const Http = new XMLHttpRequest();
var authors = document.querySelector('#content');
var title = document.querySelector('#title');
var poem = document.querySelector('#poem');
var poem_title = document.querySelector('#poem_title');
var poem_cont = document.querySelector('#poem_cont');
var url_author = 'https://poetrydb.org/author';

window.addEventListener('load', () => {
	fetch(url_author)
		.then(function(response) {
			if (!response.ok) {
				throw Error(response.status);
			}
			return response.json();
		})
		.then(function(response) {
			var data = response['authors'];

			authors.innerHTML = `<option value="" disabled selected>Select Author Name</option>${data
				.map((author) => `<option>${author}</option>`)
				.join('')} `;
		})
		.catch((error) => {
			console.log(error);
		});
});
function display_title() {
	let url = 'https://poetrydb.org/author/' + authors.value + '/title';
	fetch(url)
		.then((request) => {
			return request.json();
		})
		.then((response) => {
			let poem_list = [];
			response.forEach((poem_title) => {
				poem_list.push(poem_title['title']);
			});
			title.innerHTML = `<option value="" disabled selected>Select Poem Title</option>${poem_list
				.map((author) => `<option>${author}</option>`)
				.join('')} `;
		});
}

submit.addEventListener('click', (e) => {
	let url = 'https://poetrydb.org/author,title/' + authors.value + ';' + title.value;
	Http.open('GET', url);
	Http.onreadystatechange = (e) => {
		var body = Http.responseText;
		var data = JSON.parse(body)[0];
		poem_title.innerHTML = `${data['title']}<br>- By <em>${data['author']}</em>`;
		poem_cont.innerHTML = `<pre id="poem">${data['lines'].map((line) => line).join('\n')}</pre>`;
	};
	Http.send();
});
/*******************************************/
