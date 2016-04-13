/** This file contains the structure for each Phase. Phases randomly choose from an array
    of scrambled trial orders, as defined in stimInfo. This is to allow extra layers of
    randomness into the experiment.
*/

//Phase object
function Phase(trials, stim_types, instruction, special_instruction) {
	//Integer representing trial length
	this.trials = trials;

	//Matrix with list of stim_types used in this phase
	this.stim_types = stim_types;
}


var practice1 = new Phase(20, []);
var practice2 = new Phase(20, []); 
var learning = new Phase(80, []);
var test0 = new Phase(20, []);
var overlearn1 = new Phase(120, []);
var test1 = new Phase(20, []);
var overlearn2 = new Phase(120, []);
var test2 = new Phase(20, []);
