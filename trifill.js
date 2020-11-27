var canvas;
var context;
const canvasWidth  = 800;
const canvasHeight = 600;
var vertex_X     = new Array();
var vertex_Y     = new Array();

function prepareCanvas()
{
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}

	context = document.getElementById('canvas').getContext("2d");

	context.fillStyle             = "#000000";
    context.lineWidth             = 1;

	$('#canvas').mousedown(function(e)
	{
		if(3 == vertex_X.length)	{
			clearCanvas();
		}
		else {
			addVertex(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		}
		redraw();
  	});
}

function addVertex(x, y)
{
	/* TODO: check if the vertex is not already in the array */
    vertex_X.push(x);
    vertex_Y.push(y);
}

function clearCanvas()
{
	vertex_X.length = 0;
    vertex_Y.length = 0;
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function setPixel (x,y) {
    x = Math.round(x);
    y = Math.round(y);
    context.fillRect(x, y,1,1);
}

async function trifill()
{
	var top = 0;
	var bot = 0;
	var mid = 0;

	/* TODO: check if it is a triangle and not a line. */

	for(var i = 1; i < vertex_X.length; i++) {
		if(vertex_Y[i] < vertex_Y[top]) {
			top = i;
		}
		if(vertex_Y[i] > vertex_Y[bot]) {
			bot = i;
		}
	}

	while ((mid == top) || (mid == bot)) {
		mid ++;
	}

  	/* TOP -> MID */
  	var delta_x1 = vertex_X[top] - vertex_X[bot];
  	var delta_y1 = vertex_Y[top] - vertex_Y[bot];
  	var delta_x2 = vertex_X[top] - vertex_X[mid];
  	var delta_y2 = vertex_Y[top] - vertex_Y[mid];
  	var delta_x3 = vertex_X[mid] - vertex_X[bot];
  	var delta_y3 = vertex_Y[mid] - vertex_Y[bot];

    for (var y = vertex_Y[top]; y <= vertex_Y[mid]; y++) {
    	var pos_x1 = vertex_X[top] + (delta_x1 * ((y-vertex_Y[top])/delta_y1));
    	var pos_x2 = vertex_X[mid] + (delta_x2 * ((y-vertex_Y[mid])/delta_y2));

	    if(pos_x2 > pos_x1) {
	    	for(var x = pos_x1; x <= pos_x2; x++) {
			    setPixel(x,y);
	    	}
	    }
	    else {
	    	for(var x = pos_x2; x <= pos_x1; x++) {
			    setPixel(x,y);
	    	}
	    }
    }

    /* MID -> BOT */
    for (var y = vertex_Y[mid]; y <= vertex_Y[bot]; y++) {
    	var pos_x1 = vertex_X[top] + (delta_x1 * ((y-vertex_Y[top])/delta_y1));
    	var pos_x2 = vertex_X[mid] + (delta_x3 * ((y-vertex_Y[mid])/delta_y3));

	    if(pos_x2 > pos_x1) {
	    	for(var x = pos_x1; x <= pos_x2; x++) {
			    setPixel(x,y);
	    	}
	    }
	    else {
	    	for(var x = pos_x2; x <= pos_x1; x++) {
			    setPixel(x,y);
	    	}
	    }
    }
}

function redraw()
{
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
  if(3 == vertex_X.length)
  {
  	trifill();
  }
  else {
	for(var i=0; i < vertex_X.length; i++) {		
		context.fillRect(vertex_X[i], vertex_Y[i],3,3);
	}
  }
}