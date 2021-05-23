// Form Validation
var cardNum = document.querySelector('#cardNum');
const donateForm = document.querySelector('.donateForm');
const valid = document.querySelector('#valid');
donateForm.addEventListener('submit', (e) => {
	var num = cardNum.value;
	if (cardnumber(num) == false) {
		valid.innerHTML = '<i class="fas fa-exclamation-circle"></i>Card Number is Invalid';
		return false;
	}
});
function cardnumber(inputtxt) {
	var cardno = /^(?:3[47][0-9]{13})$/;
	if (inputtxt.value.match(cardno)) {
		return true;
	} else {
		return false;
	}
}

// Form
const card = document.querySelector('#cd');
const paytm = document.querySelector('#paytm');
const pytmBtn = document.querySelector('.paytm');
const cardBtn = document.querySelector('.credit');

pytmBtn.addEventListener('click', () => {
	paytm.style.display = 'block';
	card.style.display = 'none';
});
cardBtn.addEventListener('click', () => {
	card.style.display = 'block';
	paytm.style.display = 'none';
});
