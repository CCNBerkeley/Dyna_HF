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

	//Timer to make sure participant does not take longer than TIMING_MAX_RESPONSE_TIME to respond
	var too_late_timer;

	//Time that a trial is started. Used to calculate response time for each trial
	var choice_start;

	//Boolean flag that indicates whether or not a key is being pressed down. Prevents cheating.
	var down = false;

	//Time that the experiment is started. Used to calculate time to finish entire experiment.
	var exp_start_time = new Date().getTime();

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
		listening = true;
		choice_start = new Date().getTime();
		too_late_timer = setTimeout(tooLate, timing_max_response_time);
	};

	/* This records data and continues the experiment. */
	function recordAndContinue(response, tooLate, resp_time) {
		show_feedback = stim[1];
		var response_correct = (response == stim[0].key_response);
		var to_learn = stim[0].generalize;
		var exp_feedback;
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
			//A rather hacky way to get the font centering to work
			var message = (response_correct? 'correct' : 'incorrect')
			var feedback = '<font size = "60"><p>' + 
					(response_correct? 'correct' : 'incorrect')
					+ '</font>';
			feedbackPage(feedback);
			exp_feedback = message
		} else {
			if (tooLate) {
				exp_feedback = 'No valid response';
			} else {
				exp_feedback = 'None';
			}
		}
		psiTurk.recordTrialData({'Phase'		: (phase_types[phase_index]).phaseName,
								 'Stimulus'	 	: stim[0].stimName,
								 'Image'		: stim[0].stim_img,
								 'CorrectResp' 	: stim[0].key_response,
								 'Response' 	: response,
								 'Feedback'		: exp_feedback,
								 'ResponseTime'	: resp_time}
								);
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
			recordAndContinue(response, true, -1);
		},feedback_display_time)
	};

	/* Displays reponse correctness if feedback is on for a certain trial.
	*/
	function feedbackPage(message) {
		psiTurk.showPage('feedback.html');
		document.getElementById('container-response').innerHTML = message;
	}

	/* Increments trial number, and does other phase transition-related
	   logic. Called when phase changes
	*/
	function phaseUpdate() {
		phase_index += 1;
		trial_num = phase_types[phase_index].trials;
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
			} else if (phase_index == 3) {
				psiTurk.doInstructions(
	        		["instructTest.html"],
	        		function() {psiTurk.showPage('stage.html'); newTrial()} 
    			);
			} else {
				newTrial();
			}
		}
	};

	/* End of experiment events. */
	function end() {
		var exp_runtime = new Date().getTime() - exp_start_time;
		psiTurk.recordTrialData({'ExperimentTime' : exp_runtime});
		$("body").unbind("keydown", response_handler); // Unbind keys
		currentview = new Questionnaire();
	};

	// Takes input...
	var response_handler = function(e) {
		if (!listening || down) return;

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
			down = true;
			clearTimeout(too_late_timer);
			var resp_time = new Date().getTime() - choice_start;
			img = document.getElementById("image0");
			var source = '/static/images/fixation.png';
			img.src = source
			recordAndContinue(response, false, resp_time);
		}
	};

	/* Starts a new trial. */
	function newTrial() {
		if (trial_num == 0 || counter == 15) {
			phaseUpdate();
		} else if (phase_index >= 11) {
			return;
		} else {
			trial_num -= 1;
			img = document.getElementById("image0");
			var source = '/static/images/fixation.png';
			img.src = source;
			var stim_timer = setTimeout(displayStim, fixation_time);
		}
	};

	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	document.addEventListener("keydown", response_handler);

	// Sets var DOWN to false; this indicates the participant is not holding down a key
	document.addEventListener("keyup", function(event){down = false;});

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
var image_list  = ['static/images/T1C2S2.png', 'static/images/T2C1S2.png', 'static/images/T2C5S2.png',
					'static/images/T3C4S2.png', 'static/images/T4C3S2.png', 'static/images/T1C3S1.png',
					'static/images/T2C2S1.png', 'static/images/T3C1S1.png', 'static/images/T3C5S1.png',
					'static/images/T4C4S1.png',	'static/images/T1C3S2.png',	'static/images/T2C2S2.png',
					'static/images/T3C1S2.png',	'static/images/T3C5S2.png',	'static/images/T4C4S2.png',
					'static/images/T1C4S1.png',	'static/images/T2C3S1.png',	'static/images/T3C2S1.png',
					'static/images/T4C1S1.png',	'static/images/T4C5S1.png',	'static/images/fixation.png',
					'static/images/T1C4S2.png',	'static/images/T2C3S2.png',	'static/images/T3C2S2.png',
					'static/images/T4C1S2.png',	'static/images/T4C5S2.png',	'static/images/T1C1S1.png',
					'static/images/T1C5S1.png', 'static/images/T2C4S1.png',	'static/images/T3C3S1.png',
					'static/images/T4C2S1.png',	'static/images/T1C1S2.png',	'static/images/T1C5S2.png',
					'static/images/T2C4S2.png',	'static/images/T3C3S2.png',	'static/images/T4C2S2.png',
					'static/images/T1C2S1.png',	'static/images/T2C1S1.png',	'static/images/T2C5S1.png',
					'static/images/T3C4S1.png',	'static/images/T4C3S1.png'
					];

// All pages to be loaded after Ad page which, accepted, splashes to consent page. 
var pages = ["instruct.html", "stage.html", "questionnaire.html", "feedback.html", "rule0.html", 
	"rule1.html", "rule2.html", "noResponse.html", "instructTest.html"];

psiTurk.preloadPages(pages);
psiTurk.preloadImages(image_list);
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