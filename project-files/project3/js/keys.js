// Started from smooth-keyboard-control demo
const keyboard = Object.freeze({
	SHIFT: 		16,
	SPACE: 		32,
	LEFT: 		65, 	// A
	UP: 		87, 	// W
	RIGHT: 		68, 	// D
	DOWN: 		83,		// S
	ONE:		49,
	TWO:		50,
	THREE:		51,
	FOUR: 		52
});

// holds last key pressed
const keys = [];

window.onkeyup = (e) => {
	keys[e.keyCode] = false;
	e.preventDefault();
};

window.onkeydown = (e)=>{
	keys[e.keyCode] = true;
};