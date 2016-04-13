/** This file contains the randomized logic for the stimuli, as well as possible randomuzed trial orders to 
    select from. The stimuli mappings are randomized.
*/

//Array shuffle function
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

//Stimulus object
function Stimulus(stimName, texture, color, shape, key_response, generalize) {
    this.stimName = stimName;

	//Image file name, as used in the images directory
	this.stim_img = "T" + texture + "C" + color + "S" + shape;

	//Correct action to take for this stimulus
	this.key_response = key_response;

    this.generalize = generalize
}

var texture_array = ["1", "2", "3", "4"];
var color_array = ["1", "2", "3", "4", "5"];
var shape_array = ["1", "2"];

var A1 = "F";
var A2 = "G";
var A3 = "H";
var A4 = "J";

texture_array = shuffleArray(texture_array);
color_array = shuffleArray(color_array);
shape_array = shuffleArray(shape_array);

var Stim1 = new Stimulus("Stim1", texture_array[0], color_array[0], shape_array[0], A1, 0);
var Stim2 = new Stimulus("Stim2", texture_array[0], color_array[0], shape_array[1], A2, 0);
var Stim3 = new Stimulus("Stim3", texture_array[0], color_array[1], shape_array[0], A3, 0);
var Stim4 = new Stimulus("Stim4", texture_array[0], color_array[1], shape_array[1], A4, 0);
var Stim5 = new Stimulus("Stim5", texture_array[0], color_array[2], shape_array[0], A1, 1);
var Stim6 = new Stimulus("Stim6", texture_array[0], color_array[2], shape_array[1], A2, 0);
var Stim7 = new Stimulus("Stim7", texture_array[1], color_array[1], shape_array[1], A4, 2);
var Stim8 = new Stimulus("Stim8", texture_array[1], color_array[1], shape_array[0], A3, 0);
var Stim9 = new Stimulus("Stim9", texture_array[1], color_array[0], shape_array[1], A2, 0);
var Stim10 = new Stimulus("Stim10", texture_array[0], color_array[3], shape_array[0], A1, 1);
var Stim11 = new Stimulus("Stim11", texture_array[0], color_array[3], shape_array[1], A2, 0);
var Stim12 = new Stimulus("Stim12", texture_array[2], color_array[0], shape_array[0], A4, 2);
var Stim13 = new Stimulus("Stim13", texture_array[2], color_array[0], shape_array[1], A2, 0);
var Stim14 = new Stimulus("Stim14", texture_array[2], color_array[1], shape_array[0], A3, 0);
var Stim15 = new Stimulus("Stim15", texture_array[0], color_array[4], shape_array[0], A3, 1);
var Stim16 = new Stimulus("Stim16", texture_array[0], color_array[4], shape_array[1], A4, 0);
var Stim17 = new Stimulus("Stim17", texture_array[3], color_array[1], shape_array[0], A3, 2);
var Stim18 = new Stimulus("Stim18", texture_array[3], color_array[0], shape_array[1], A2, 0);
var Stim19 = new Stimulus("Stim19", texture_array[3], color_array[0], shape_array[0], A1, 0);
