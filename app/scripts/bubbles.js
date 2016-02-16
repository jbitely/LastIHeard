// color scale based on colorbrewer
var color = d3.scale.ordinal()
  .range(colorbrewer.PuRd[9]);

var diameter = 600;



// d3.json(apiurl + '?' + 'method=' + apimethod + '&user=' + username + '&format=json' + '&api_key=' + apikey, function(error, response){
//   var remotejson = response;
//   console.log(remotejson);
// })

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




// viz stage
var container = d3.select('#viz').append('svg')
  .attr('height', diameter)
  .attr('width', diameter)
  .attr('class', 'container');

// setup pack layout
var bubble = d3.layout.pack()
  .size([diameter, diameter])
  .value(function(d){
    return d.size;
  })
  .padding(3);

// generate data
var nodes = bubble.nodes(processData(json))
  .filter(function(d){ //filter out outer bubble (any node w/o parent);
    return d.parent;
  });

var vis = container.selectAll('circle')
  .data(nodes);

vis.enter().append('circle')
  .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
  .attr('r', function(d) {return d.r;})
  .attr('class', 'artist')
  .style('fill', function(d){return color(d.size);});

vis.enter().append('text')
  .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('font-size', function(d){
    var len = d.name.substring(0, d.r / 3).length;
    var size = d.r/4;
    size *= 10/len;
    size += 1;
    return Math.round(size)+'px';
  })
  .text(function(d){
    var text = d.name.substring(0, d.r /3);
    return text;
  });

// build data into children array
function processData(data) {
  var obj = data.artists;
  var newDataSet = [];
  for(var prop in obj) {
    newDataSet.push({name: prop, size: obj[prop]});
  }
  return {children: newDataSet};
}
