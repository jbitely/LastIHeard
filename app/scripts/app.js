// construct httprequest - refactor option object?
var apiurl = 'http://ws.audioscrobbler.com/2.0/';
var apikey = '0b7b1045b71139071bd6dfa010bf3de9';
var username = ''; // <--- get from form
var apimethod = 'user.getTopArtists'; // <--- get from form
var apiperiod = '12month'; // <--- get from form

var getOptions = function(){
  // get username from form
  username = this.username.value;
  // set username in request string
  requestStr = apiurl + '?' + 'method=' + apimethod + '&user=' + username + '&format=json' + '&api_key=' + apikey;
  // api call
  fetchData(requestStr);
  return false;
  // var options = $(this).serializeArray() <--- possibly use later when more options
};

var fetchData = function(requestStr){
  d3.json(requestStr, function(error, response){
    var remotejson = response;
    // call our chart builder here
    console.log(remotejson);
  });
};

$('.options').on('submit', getOptions);


