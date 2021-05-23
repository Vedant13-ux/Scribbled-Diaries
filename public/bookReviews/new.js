const bookSearch = document.querySelector('#bookSearch');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const bookInfo = document.querySelector('.bookInfo');
const yes = document.querySelector('.yes');
const no = document.querySelector('.no');
const modalBody = document.querySelector('.modal-body');
const submit = document.querySelector('#submit');

bookSearch.addEventListener('click', async (e) => {
	e.preventDefault();
	var title = titleInput.value;
	var author = authorInput.value;
	if (title != '' && author != '') {
		await axios
			.get(
				`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyDb6YmpAXmbCj2Oa0hrueHXeDeVFGsBOz0`
			)
			.then((response) => {
				if (response.data['totalItems'] == 0) {
					modalBody.innerHTML = `<h3>The book you've entered does not exist on Google Books.</h3>
                    <button class="btn btn-danger center-block no" data-dismiss="modal" aria-hidden="true"> Search Again </button>
                    <button class="btn btn-success proceed" data-dismiss="modal">Proceed Anyway</button>`;
					return;
				}
				let body = response.data['items'][0]['volumeInfo'];
				let id = response.data['items'][0]['id'];
				var bookDetails = {
					bookId: id,
					title: body['title'],
					authors: body['authors'].map((author) => author).join(', '),
					genre: body['categories'][0],
					image: body['imageLinks']['thumbnail'],
					description: body['description'],
					language: body['language'],
					pageCount: body['pageCount'],
					rating: {
						averageRating: body['averageRating'],
						count: body['ratingsCount']
					},
					previewLink: body['previewLink']
				};
				console.log(bookDetails);
				bookInfo.innerHTML = `
                    <img src=${bookDetails.image} class="top_image">
                    <div class="details">
                      <div class="info"><b>${bookDetails.title}</b></div>
                      <div class="info"><em>-by ${bookDetails.authors}</em></div>
                      <div class="info">Genre: ${bookDetails.genre}</div>
                      <div class="info">
                        Average Rating : ${bookDetails.rating.averageRating}★ (${bookDetails.rating.count} ratings)
                      </div>
                    </div>`;

				document.querySelector('.yes').addEventListener('click', () => {
                    titleInput.setAttribute('disabled', '');
					authorInput.setAttribute('disabled', '');
                    titleInput.value=bookDetails.title;
                    authorInput.value=bookDetails.authors;

					bookSearch.textContent = 'Change Book';
					bookSearch.remove();
					$('.bookForm').append(`<a class="ui button search" href='/bookreviews/create'>Change Book</a>`);
					$('.reviewContent').slideDown();
                    document.querySelector('.bookId').value = bookDetails.bookId;
					document.querySelector('.bookTitle').value = bookDetails.title;
					document.querySelector('.authors').value = bookDetails.authors;
					document.querySelector('.genre').value = bookDetails.genre;
					document.querySelector('.image').value = bookDetails.image;
					document.querySelector('.description').value = bookDetails.description;
					document.querySelector('.language').value = bookDetails.language;
					document.querySelector('.pageCount').value = bookDetails.pageCount;
					document.querySelector('.averageRating').value = bookDetails.rating.averageRating;
					document.querySelector('.count').value = bookDetails.rating.count;
                    document.querySelector('.previewLink').value = bookDetails.previewLink;
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

// Voice Recognition
const content = document.querySelector('#text-area');
const mic = document.querySelector('#mic');
const bars = document.querySelectorAll('.bar');
var textArea = document.querySelector('textarea');
function runSpeechRecognition() {
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
	recognition.lang = 'en-US';
	var action = document.querySelector('#action');

	recognition.onstart = function() {
		action.innerHTML = '<small>listening, please speak...</small>';
		content.style.marginTop = '75px';
		setTimeout(() => {
			bars.forEach((bar) => {
				bar.style.display = 'inline';
			});
		}, 750);
	};

	recognition.onspeechend = function() {
		action.innerHTML = '<small>stopped listening....</small>';
		recognition.stop();
		content.style.marginTop = '0px';
		bars.forEach((bar) => {
			bar.style.display = 'none';
		});
	};

	recognition.onresult = function(event) {
		var transcript = event.results[0][0].transcript;
		CKEDITOR.instances.tarea.insertText(transcript + ' ');
	};

	recognition.start();
}

// Ajax Post Request

window.onbeforeunload = function(ev) {
	return false;
};
