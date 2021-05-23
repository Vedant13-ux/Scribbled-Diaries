const content = document.querySelector('#text-area');
const mic = document.querySelector('#mic');
const bars = document.querySelectorAll('.bar');
var textArea = document.querySelector('textarea');
const category = document.querySelector('#category');
var params = new URLSearchParams(window.location.search);

window.addEventListener('load', () => {
	if (params.get('category') == 'somethingElse') {
		document.querySelector('#catgry').style.display = 'block';
	} else {
		category.value = params.get('category');
	}
});

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

	// start recognition
}

// Ajax Post Request
const submit = document.querySelector('#submit');

// submit.addEventListener('click', (e) => {
// 	e.preventDefault();
// });

window.onbeforeunload = function(ev) {
	return false;
};
