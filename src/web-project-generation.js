var template = $('#project').html();
var location = document.getElementById("web-projects");

var context = { 
    "link":"https://tcd2738-onion-or-not.herokuapp.com/",
    "thumbnail": "./assets/images/project-screenshots/onion-or-not.png",
    "title": "Onion or Not"
};

//Compile the template data into a function
var templateScript = Handlebars.compile(template);

var html = templateScript(context);
//html = 'My name is Ritesh Kumar . I am a developer.'

$(location).append(html);