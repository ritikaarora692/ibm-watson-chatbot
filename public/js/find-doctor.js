$(document).on('click', '#sendButton', function (e) {
    e.preventDefault();
    processUserInput("findDoctor");
});

$(document).ready(function () {
    getChatResponse("","findDoctor");
     $('#userInput').focus();
     $('#map').hide();
});

function submitInput(e) {
    if (e.which === 13 || e.keyCode === 13) {
        processUserInput("findDoctor");
    }
}

function selectOption(event) {
    text = event.target.innerHTML;
    displayMessage(text);
    getChatResponse(text, 'findDoctor');
    $('.option').addClass('disableClick');
}

