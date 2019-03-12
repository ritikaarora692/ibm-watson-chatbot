var text = '';
var context;


function processUserInput(type) {
    var userInput = $('#userInput').val();
    text = userInput;
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    if (text) {
        displayMessage(text);
        $('#userInput').val("");
        getChatResponse(text, type);
    } else {
        console.error("No message.");
        userInput.value = '';
        return false;
    }
}

function displayMessage(text) {
    var newDiv = document.createElement('div');
    newDiv.className = 'chatMessage user';
    newDiv.innerHTML = '<div class="sendee-user">You:</div><div class="message_right">' + text + '</div>';
    $('.chatHistory').append(newDiv);
    var objDiv = document.getElementsByClassName("chatHistory")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
}



function getChatResponse(text, type) {
    $.ajax({
        url: "/watsonResponse",
        data: {
            userInput: text,
            type: type,
            reqContext: context
        }
    }).done(function (response) {
        var objDiv = document.getElementsByClassName("chatHistory")[0];
        var initialScrollHeight = objDiv.scrollHeight;
        if($('#welcome').text() == null || $('#welcome').text() == "") {
            $('#welcome').text('Welcome ' + response.name);
        }
        var newDiv = document.createElement('div');
        newDiv.className = 'chatMessage watson';
        var divtext = '<div class="sendee-agent">Executive:</div><div class="message_left">' + response.text[0];
        if (response.dataType != null) {
            divtext = divtext + "<br/>";
            divtext = divtext + populateData(response.email, response.data, response.dataType);
        }
        if (response.text.length > 1) {
            divtext = divtext + '<br/><div class="message_left">' + response.text[1] + '</div>';
        }
        divtext += '</div>'
        newDiv.innerHTML = divtext;
        $('.chatHistory').append(newDiv);
        //var objDiv = document.getElementsByClassName("chatHistory")[0];
        objDiv.scrollTop = objDiv.scrollHeight;
        if (response != null && response.dataType == 'getDoctors') {
            objDiv.scrollTop = initialScrollHeight - 55;
        }
        context = response.context;
        $('#userInput').focus();

        checksForDoctor(type, response);

    }).fail(function (jqXHR, textStatus) {
        console.log("Error in processing request.");
        var newDiv = document.createElement('div');
        newDiv.className = 'chatMessage watson';
        var divtext = '<div class="sendee-agent">Executive:</div><div class="message_left">We are unable to process your request at this time. Sorry for the inconvenience.</div>';
        newDiv.innerHTML = divtext;
        $('.chatHistory').append(newDiv);
        var objDiv = document.getElementsByClassName("chatHistory")[0];
        objDiv.scrollTop = objDiv.scrollHeight;
        $('#userInput').focus();

    });;
}

function checksForDoctor(type, response) {
    if (type != 'bookTest') {
        switch (response.dataType) {
            case 'getDoctors': {
                $('#userInput').attr('disabled', 'disabled');
                $('#sendButton').attr('disabled', 'disabled');
                $('#userInput').attr("placeholder", "Please select the doctor from the list above");
                $('#labChatBox').css('margin-top','-90px');
                $('#doc-textInfo').text('The NAGP Care helps you find the best doctors in the world. Showing you the location of the doctors near the provided location.');                
                $('#map').show();
                updateMap(response.data.inputLocation, response.data.markers);
                break;
            }
            default: {
                $('#userInput').removeAttr('disabled');
                $('#sendButton').removeAttr('disabled');
                $('#userInput').attr("placeholder", "Please type here");
                $('#userInput').focus();
            }
        }
    }
}


function populateData(email, data, dataType) {
    var divtext = "";
    switch (dataType) {
        case 'getTestList':
            for (var i = 0; i < data.length; i++) {
                divtext = divtext + "<li class='option' onclick='submitOption(event)'><a href='#'>" + data[i] + "</a></li>"
            };
            break;
        case 'getProcedure':
            {
                divtext = divtext + "<br/><div class='message_left'><b>Procedure:</b> " + data.procedure + "<br/></div>";
            }
            break;
        case 'getCost':
            {
                divtext = divtext + "<br/><div class='message_left'><b>Cost:</b> " + data.cost + "<br/></div>";
            }
            break;
        case 'getProcedureAndCost':
            {
                divtext = divtext + "<br/><div class='message_left'><b>Procedure:</b> " + data.procedure + "<br/><b>Cost:</b> " + data.cost + "<br/></div>";
            }
            break;
        case 'sendEmail':
            {
                divtext = divtext + "<b>" + email + "<br/><br/>";
            }
            break;
        case 'getDoctors':
            for (var i = 0; i < data.markers.length && i <= 10; i++) {
                divtext = divtext + "<li class='option doctors' onclick='selectOption(event)'><a href='#'>" + data.markers[i].name + "</a></li>"
            };
            break;
    }
    return divtext;
}