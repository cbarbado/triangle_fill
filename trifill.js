let canvas;
let context;
const canvasWidth  = 800;
const canvasHeight = 600;
let vertex_X     = new Array();
let vertex_Y     = new Array();

function prepareCanvas()
{
	let canvasDiv = document.getElementById('canvasDiv');
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

async function half_fill(v1x, v1y, v2x, v2y, d1x, d1y, d2x, d2y) {
	let stepY = (v1y > v2y) ? -1 : 1;
	for (let y = v1y; y != (v2y + stepY); y += stepY) {
		let p1x = Math.round(v1x + (d1x * ((y-v1y)/d1y)));
		let p2x = Math.round(v2x + (d2x * ((y-v2y)/d2y)));

		let stepX = (p1x > p2x) ? -1 : 1;
		for(let x = p1x; x != (p2x + stepX); x += stepX) {
			setPixel(x,y);
		}
	}
}

async function trifill()
{
	let top = 0;
	let bot = 0;
	let mid = 0;

	/* TODO: check if it is a triangle and not a line. */

	for(let i = 1; i < vertex_X.length; i++) {
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

  	let delta_x1 = vertex_X[top] - vertex_X[bot];
  	let delta_y1 = vertex_Y[top] - vertex_Y[bot];
  	let delta_x2 = vertex_X[top] - vertex_X[mid];
  	let delta_y2 = vertex_Y[top] - vertex_Y[mid];
  	let delta_x3 = vertex_X[mid] - vertex_X[bot];
  	let delta_y3 = vertex_Y[mid] - vertex_Y[bot];

	half_fill(vertex_X[top], vertex_Y[top], vertex_X[mid], vertex_Y[mid], delta_x1, delta_y1, delta_x2, delta_y2);
	half_fill(vertex_X[bot], vertex_Y[bot], vertex_X[mid], vertex_Y[mid], delta_x1, delta_y1, delta_x3, delta_y3);
}

function redraw()
{
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
   if(3 == vertex_X.length)
   {
  	  trifill();
   }
   else {
	   for(let i=0; i < vertex_X.length; i++) {		
		   context.fillRect(vertex_X[i], vertex_Y[i],3,3);
	   }
   }
}