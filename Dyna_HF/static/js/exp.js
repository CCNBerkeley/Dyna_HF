/*************************
 * Dyna_HF Experiment Code
 *************************/

function experiment () {

	//Image in html file where stimulus and feedback are set.
    var img;

	//Tracks trial num of experiment
	var trial_num = 0;

	//Types of phases in the experiment, sequentially.
	var phase_types = [practice1, practice2, learning, preTest0, test0, overlearn1, preTest1, test1, overlearn2, preTest2, test2, end];

	//Index of current phase.
	var phase_index = -1;

	//Counter for user-dependent phase transitions
	var counter = 0;

	//Array of stimuli, newly loaded for every phase
	var stim_bank;

	//Stimulus matrix for this trial; chosen from STIM_BANK
	var stim;

	//Boolean for to turn on keystroke-dependent events
	var listening = false;

	var too_late_timer;

	//Timing related variables
	var fixation_time = 500;
    var feedback_delay_time = 200;
    var feedback_display_time = 800;
    var timing_max_response_time = 1500;

	/* Displays stimulus and turns on listening for the response handler. */
	function displayStim() {
		stim = (stim_bank.shift())
		var presentation = stim[0].stim_img;
		var source = '/static/images/' + presentation + '.png';
		img.src = source;
		img.style.display = 'inline';
		listening = true;
		too_late_timer = setTimeout(tooLate, timing_max_response_time);
	};

	/* This records data and continues the experiment. */
	function recordAndContinue(response) {
		psiTurk.recordTrialData({'Phase'		: (phase_types[phase_index]).phaseName,
								 'Stimulus'	 	: stim[0].stimName,
								 'Image'		: stim[0].stim_img,
								 'CorrectResp' 	: stim[0].key_response,
								 'Response' 	:response}
								);
		show_feedback = stim[1];
		var response_correct = (response == stim[0].key_response);
		var to_learn = stim[0].generalize;
		if (to_learn == 1) {
			if (response_correct) {
				var check1 = counter&0x00000003;
				if (check1 == 0) {
					counter = counter^0x00000001;
				} else if (check1 == 1) {
					counter = counter^0x00000002;
				}
			} else {
				counter = counter&0xFFFFFFFC;
			}
		} else if (to_learn == 2) {
			if (response_correct) {
				var check2 = counter&0x0000000C;
				if (check2 == 0) {
					counter = counter^0x00000004;
				} else if (check2 == 4) {
					counter = counter^0x00000008;
				}
			} else {
				counter = counter&0xFFFFFFF3;
			}
		};
		setTimeout(function(){psiTurk.showPage('stage.html'); newTrial();}, 
			feedback_display_time);
		if ((show_feedback == 1) && (response.length > 0)) {
			var feedback = (response_correct? '<h1>correct</h1>' : '<h1>incorrect</h1>');
			//var correct_timer = setTimeout(function(){feedbackPage(feedback);}, feedback_delay_time);
			feedbackPage(feedback);
		}
	}

	/* Displays message when participant does not respond to stimulus in time designated
	   by TIMING_MAX_RESPONSE_TIME.
	*/
	function tooLate() {
		listening = false;
		var response = "";
		//var late_feedback_timer = setTimeout(psiTurk.showPage('noResponse.html'), feedback_delay_time);
		psiTurk.showPage('noResponse.html');
		var continuation_timer = setTimeout(function(){
			recordAndContinue(response);
		},feedback_display_time)
	};

	/* Displays reponse correctness if feedback is on for a certain trial.
	*/
	function feedbackPage(message) {
		psiTurk.showPage('feedback.html');
		elem = document.getElementById('message');
		elem.innerHTML = message;
	}

	/* Increments trial number, and does other phase transition-related
	   logic. Called when phase changes
	*/
	function phaseUpdate() {
		phase_index += 1;

		//REQCHANGE BEFORE ACTUAL EXPERIMENT RELEASE
		trial_num = 4;
		if (phase_index >= 11) {
			end();
		} else {
			stim_bank = phase_types[phase_index].stim_types;
			counter = 0;
			if (phase_index < 3) {
				var instPage = "rule" + phase_index.toString() + ".html";
				psiTurk.doInstructions(
	        		[instPage],
	        		function() {psiTurk.showPage('stage.html'); newTrial()} 
    			);
			} else {
				newTrial();
			}
		}
	};

	/* End of experiment events. */
	function end() {
		$("body").unbind("keydown", response_handler); // Unbind keys
		currentview = new Questionnaire();
	};

	// Takes input...
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode;
		var	response;

		switch (keyCode) {
			case 70:
				response = "F";
				break;
			case 71:
				response = "G";
				break;
			case 72:
				response = "H";
				break;
			case 74:
				response = "J";
				break;
			default:
				response = "";
				break;
		}
		if (response.length > 0) {
			listening = false;
			clearTimeout(too_late_timer);
			recordAndContinue(response);
		}
	};

	/* Starts a new trial. */
	function newTrial() {
		if (trial_num == 0 || counter == 15) {
			phaseUpdate();
			//newTrial();
		} else if (trial_num >= 11) {
			return;
		} else {
			trial_num -= 1;
			img = document.getElementById("image0");
			img.style.display = 'none';
			var stim_timer = setTimeout(displayStim, fixation_time);
		}
	};

	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler); 
	document.addEventListener("keydown", response_handler);

	/* Start trials. */
	newTrial();
};

/*******************
 * Main logic
 ******************/

var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition      = condition;       // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
                                        // they are not used in the stroop code but may be useful to you
var stim_images  = ['/static/images/S1C1T1.png' ,'/static/images/S1C1T1.png'];
var instr_images = ['/static/images/inst.png'];

// All pages to be loaded after Ad page which, accepted, splashes to consent page. 
var pages = ["instruct.html", "stage.html", "questionnaire.html", "feedback.html", "rule0.html", "rule1.html", "rule2.html", "noResponse.html"];

psiTurk.preloadPages(pages);
var instructionPages = ["instruct.html"];

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
 
$(window).load( function(){
    psiTurk.doInstructions(
        instructionPages,
        function() {currentview = new experiment()} 
    );
}); 