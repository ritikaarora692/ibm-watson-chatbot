$(document).on('click', '#sendButton', function (e) {
    e.preventDefault();
    processUserInput("bookTest");
});

$(document).ready(function () {
    getChatResponse("", "bookTest");
    $('#userInput').focus();
});

function submitText(e) {
    if (e.which === 13 || e.keyCode === 13) {
        processUserInput("bookTest");
    }
}

function submitOption(event) {
    if ($(event.target).hasClass('disableClick')) {
        event.preventDefault();
    }
    else {
        text = event.target.innerHTML;
        displayMessage(text);
        getChatResponse(text, 'bookTest');
        $('.option>a').addClass('disableClick');
    }
}



