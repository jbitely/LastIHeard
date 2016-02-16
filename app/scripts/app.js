// some mock JSON data for now
var json = {
  "artists" : {
    "M83" : "27",
    "Dance With The Dead" : "36",
    "Carpenter Brut" : "41",
    "Ennio Morricone" : "15",
    "Kanye West" : "10",
    "The Shirelles" : "7",
    "The Mamas & the Papas" : "5",
    "Sigur Rós" : "11",
    "The Impressions" : "4",
    "Buddy Holly" : "3",
    "Dead Man's Bones" : "17",
    "Lykke Li" : "14",
    "The Kinks" : "14",
    "Girl Talk" : "13",
    "Spoon" : "12",
    "Florence + the Machine" : "11",
    "Sleigh Bells" : "11",
    "Hall & Oates" : "10",
    "Kenny Loggins" : "8",
    "Redbone" : "8",
    "Lana Del Rey" : "7",
    "Pixies" : "7",
    "Starfucker" : "7",
    "Daniel Johnston" : "6",
    "Kavinsky" : "6",
    "Cyndi Lauper" : "5",
    "Nathaniel Rateliff & the Night Sweats" : "5",
    "Nick Cave & The Bad Seeds" : "5"
  }
};
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

var remotejson = {};

var fetchData = function(requestStr){
  d3.json(requestStr, function(error, response){
    remotejson = response;
    // call our chart builder here
    buildBubbles(remotejson.topartists.artist);
    console.log(remotejson);
  });
};

$('.options').on('submit', getOptions);


