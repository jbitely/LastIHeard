// container settings
var diameter = 600;

// some mock JSON data for now

var json = {
  "artists" : {
    "M83" : "27",
    "Dance With The Dead" : "19",
    "Carpenter Brut" : "18",
    "Ennio Morricone" : "15",
    "Kanye West" : "10",
    "The Shirelles" : "7",
    "The Mamas & the Papas" : "5",
    "Sigur Rós" : "4",
    "The Impressions" : "4",
    "Buddy Holly" : "3"
  }
}
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
  .padding(3)

// generate data
var nodes = bubble.nodes(processData(json))
  .filter(function(d){ //filter out outer bubble (any node w/o parent);
    return d.parent;
  })

var vis = container.selectAll('circle')
  .data(nodes)

vis.enter().append('circle')
  .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
  .attr('r', function(d) {return d.r;})
  .attr('class', 'artist');

vis.enter().append('text')
  .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
  .text(function(d) { return d.name})
  .attr('text-anchor', 'middle')

// build data into children array
function processData(data) {
  var obj = data.artists;
  var newDataSet = [];
  for(var prop in obj) {
    newDataSet.push({name: prop, size: obj[prop]})
  }
  return {children: newDataSet};
}
