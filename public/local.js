// // Start a WebSocket connection with the server using SocketIO
// var socket = io();
// var obj = {property: "value", anotherProperty: "anotherValue"};

// // Send an event named "test" to the server with socket.emit() function
// // and with this event, send the string 'Hi, this is...' as the data
// socket.emit('test', "hello from the client");

// // When the client receives an event named "test",
// socket.on('test', function(data) {
// 	// Take whatever data was received and display it in the client console
// 	console.log(data);
// });

// document.addEventListener('click', function(event) {
// 	console.log(event);
// 	socket.emit("test",event);
// });

// // Create a variable for the web page's canvas element, which has id="mycanvas":
// var canvas = document.getElementById('mycanvas');

// // Create a variable to access the two-dimensional canvas drawing functions
// var pen = canvas.getContext('2d');

// pen.beginPath();	// Initialize
// pen.moveTo(0,0);	// Choose starting coordinates (top left corner of canvas)
// pen.lineTo(500,500);	// Choose ending coordinates (500 pixels from top, 500 pixels from left)
// pen.stroke();		// Draw the line

//

// Start a WebSocket connection with the server using SocketIO
var socket = io();

// Create a variable for the web page's canvas element, which has id="mycanvas"
var canvas = document.getElementById('mycanvas');

// Create a variable to access the two-dimensional canvas drawing functions
var pen = canvas.getContext('2d');

// Set event listeners for when the mouse button is pressed down, when the mouse moves, and when the mouse button is released
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawStuff);
canvas.addEventListener('mouseup', stopDrawing);

var isDrawing = false;
var lastSent;
var prevX;
var prevY;

function startDrawing(event) {
	// Display the click coordinates in the web browser's console
	console.log("Clicked at " + event.clientX + ", " + event.clientY);

	// The user began drawing, so save this state to a variable
	isDrawing = true;

	// Save the current timestamp
	lastSent = Date.now();

	// Save the coordinates where user clicked
	prevX = event.clientX;
	prevY = event.clientY;
}

// Run this function when the user moves the mouse
function drawStuff(event) {
	// If the user is holding down the mouse button (isDrawing) AND it's been more than 30 milliseconds since we notified the server
	if (isDrawing && Date.now() - lastSent > 30) {
		// Draw a line from the last saved coordinates to the newly saved coordinates
		pen.beginPath();
		pen.moveTo(prevX, prevY);
		pen.lineTo(event.clientX, event.clientY);
		pen.stroke();

		// Display the previous and current coordinates in the web browser's console
		console.log("Draw from " + prevX + ", " + prevY + " to " + event.clientX + ", " + event.clientY);

		// Update lastSent to the current timestamp
		lastSent = Date.now();

		// Send message named "new line" to the server with an object containing previous and current coordinates
		socket.emit('new line', {fromX: prevX, fromY: prevY, toX: event.clientX, toY: event.clientY});

		// Replace previous coordinates with the current coordinates (we need this to draw a continuous line)
		prevX = event.clientX;
		prevY = event.clientY;
	}
}

// Run this function when the user unclicks the mouse
function stopDrawing(event) {
	// The user stopped drawing, so update this variable to reflect this change in state
	isDrawing = false;

	// Display the current coordinates in the web browser's console
	console.log("Stop: " + event.clientX + ", " + event.clientY);
}

// Run this function when WebSocket messages called "new line" are receieved
socket.on('new line', function(data){
	// Display the received data in the web browser's console
	console.log(data);

	// Draw a line using the data sent from the server, from every other users' previous to current coordinates
	pen.beginPath();
	pen.moveTo(data.fromX, data.fromY);
	pen.lineTo(data.toX, data.toY);
	pen.stroke();
});
