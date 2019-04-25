/* jshint esversion: 6 */

/*****************
BASIC INFO
*****************/

$('#name').focus();//sets focus on the name input
$('#other-title').hide();//hides the "Other" input for the job role

//selects the job title element and adds an event to show or hide the extra input
$('#title').on('change', event => {
	'use strict';
	if (event.target.value === 'other') {
		$('#other-title').fadeIn();
	} else {
		$('#other-title').fadeOut();
	}
});

/*****************
T-SHIRT INFO
*****************/

//hides the color selector until the user chooses a design option
$('#colors-js-puns').hide();

//sets up the event listener on the design options ofr a change
$('#design').on('change', event => {
	'use strict';
	let string;
	if (event.target.value === 'js puns') {
		string = 'JS Puns shirt only';
	} 
	else if (event.target.value === 'heart js') {
		string = 'JS shirt only';
	} 
	else {
		string = 'nothing found';
	}
	checkColorOptions(string);
});

//changes the tshirt color options to match the design chosen
function checkColorOptions (string) {
	'use strict';
	let options = $('#color').children();
	const regex = new RegExp(string, 'i');
	let changed = false;
	
	$(options).each((index, value) => {
		if (!regex.test(value.textContent)) {
			$(options[index]).hide();
		} else {
			$(options[index]).show();
			if (!changed) {
				changed = true;
				$('#color').val(options[index].value);
			}
		}
	});
	
	if (string === 'nothing found') {
		$('#colors-js-puns').hide();
	} else {
		$('#colors-js-puns').show();
	}
	
}

/*****************
ACTIVITIES
*****************/

//Sets up the event listener on the course field
$('.activities').on('change', event => {
	'use strict';
	
	//gather the array to loop through and make changes as needed
	const eventListings = $('.activities').children().children();
	
	if (event.target.name === 'js-frameworks') {
		$(eventListings).each((index, value) => {
			if (value.name === 'express') {
				disableEnableActivities(value, event.target.checked);
			}
		});
	}
	
	if (event.target.name === 'express') {
		$(eventListings).each((index, value) => {
			if (value.name === 'js-frameworks') {
				disableEnableActivities(value, event.target.checked);
			}
		});
	}
	
	if (event.target.name === 'js-libs') {
		$(eventListings).each((index, value) => {
			if (value.name === 'node') {
				disableEnableActivities(value, event.target.checked);
			}
		});
	}
	
	if (event.target.name === 'node') {
		$(eventListings).each((index, value) => {
			if (value.name === 'js-libs') {
				disableEnableActivities(value, event.target.checked);
			}
		});
	}
	
	if (event.target.name === 'all') {
		totalCostDisplay(200, event.target.checked);
	} else {
		totalCostDisplay(100, event.target.checked);
	}
	
});

//handles courses that conflict with eachother so you can not book for a course at the same time as another course 
function disableEnableActivities (value, checked) {
	'use strict';
	if (checked) {
		$(value).prop('disabled', true);
		value.parentElement.style.color = 'grey';
		value.parentElement.style.textDecoration = 'line-through';
	} else {
		$(value).prop('disabled', false);
		value.parentElement.style.color = 'black';
		value.parentElement.style.textDecoration = 'none';
	}
}

let totalCost = 0; //keeps track off the total cost
let totalCostDiv = null;
//Handles displaying the total cost of the course below course selection
function totalCostDisplay(cost, checked) {
	'use strict';
	if (totalCostDiv === null) {
		totalCostDiv = document.createElement('div');
		$('.activities').append(totalCostDiv);
	}
	if (checked) {
		totalCost += cost;
	} else {
		totalCost -= cost;
	}
	const html = `<span>Total Cost = $${totalCost} </span>`;
	totalCostDiv.innerHTML = html;
}

/*****************
PAYMENT
*****************/

//the initial setup for payment form
initailPaymentSetUp();
function initailPaymentSetUp () {
	'use strict';
	const paymentOptions = $('#payment').children();
	$(paymentOptions[0]).prop('disabled', true);
	$('#payment').val('credit card');
	$('p').hide();
}

//Sets up the event listener on the payment type selector
$('#payment').on('change', event => {
	'use strict';
	const p = $('p');
	
	if (event.target.value === 'credit card') {
		$('.credit-card').show();
		$(p[0]).hide();
		$(p[1]).hide();
	}
	
	if (event.target.value === 'paypal') {
		$('.credit-card').hide();
		$(p[0]).show();
		$(p[1]).hide();
	}
	
	if (event.target.value === 'bitcoin') {
		$('.credit-card').hide();
		$(p[0]).hide();
		$(p[1]).show();
	}
	
});

/*****************
VALIDATION
*****************/

//adds the event listener for the submit button
$('button').on('click', event => {
	'use strict';
	event.preventDefault();
	
	if (!nameValid($('#name').val())) {
		formError('#name', 'Please enter a name');
	} else {
		clearError('#name');
	}
	
	if (!emailValid($('#mail').val())) {
		formError('#mail', 'Please enter a valid email');
	} else {
		clearError('#mail');
	}
	
	if (!registered()) {
		formError('.activities', 'Please select a workshop');
	} else {
		clearError('.activities');
	}
	
	if ($('#payment').val('credit card')) {
		
		if (!creditNumberValid($('#cc-num').val())) {
			let numberMessage;
			if ($('#cc-num').val('')) {
				numberMessage = 'Please enter a valid credit card number';
			} else {
				numberMessage = 'Please enter a number between 13 and 16 digits';
			}
			formError('#cc-num', numberMessage);
		} else {
			clearError('#cc-num');
		}
		
		if (!zipValid($('#zip').val())) {
			formError('#zip', 'Please enter a valid zip code');
		} else {
			clearError('#zip');
		} 
		
		if (!cvvValid($('#cvv').val())) {
			formError('#cvv', 'Please enter a valid cvv number');
		} else {
			clearError('#cvv');
		}
		
	}
	
});

//adds event listener to the credit card number for a pop up message
$('#cc-num').on('keyup', () => {
	'use strict';
	if (!creditNumberValid($('#cc-num').val())) {
		clearError('#cc-num');
		formError('#cc-num', 'Please enter a number between 13 and 16 digits');
	} else {
		clearError('#cc-num');
	}
	
});

//displays the form error messages
function formError (id, message) {
	'use strict';
	$(id).css('border-bottom', '1px solid red');
	if (!$('.' + id.substring(1) + 'Error').length) {
		const div = document.createElement('div');
		$(div).addClass(id.substring(1) + 'Error');
		console.log(id.substring(1));
		const html = `<p style="color:red" style="font-size:0.8em">${message}</p>`;
		$(div).html(html);
		if (id !== '.activities') {
			$(div).insertBefore($(id));
		} else {
			$(id).append(div);
		}
	}
}

//clears the error messages as they are corrected
function clearError (id) {
	'use strict';
	$('.' + id.substring(1) + 'Error').remove();
	$(id).css('border-bottom', 'none');
}

//checks if the name is valid
function nameValid(name) {
	'use strict';
	const nameRegex = new RegExp(/[a-zA-Z]/);	
	return nameRegex.test(name);
}

//checks to see if the email is valid
function emailValid(email) {
	'use strict';
	const emailRegex = new RegExp(/^[^@]+@[^@]+\.[a-z]+$/i);	
	return emailRegex.test(email);
}

//checks to see if they are registered
function registered() {
	'use strict';
	const eventListings = $('.activities').children().children();
	let registered = false;
	eventListings.each((index, value) => {
		if (value.checked) {
			registered = true;
		}
	});
	return registered;
}

//checks to see if the credit card number is valid
function creditNumberValid (number) {
	'use strict';
	const creditNumberRegex = new RegExp(/^\d{13,16}$/);//makes a reggex that macthe only number characters 13 to 16 characters long
	return creditNumberRegex.test(number);//returns the results of the tests string
}

//checks that the zip code is valid
function zipValid(zip) {
	'use strict';
	const zipRegex = new RegExp(/^\d{5}$/);
	return zipRegex.test(zip);
}

//checks that the cvv number is valid
function cvvValid (number) {
	'use strict';
	const cvvRegex = new RegExp(/^\d{3}$/);
	return cvvRegex.test(number);
}


