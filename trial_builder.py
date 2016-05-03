from __future__ import print_function
import numpy
import random
import numpy
from copy import deepcopy

def scrambler(trials, stims):
	cycles = trials/len(stims)
	lst = stims[0:len(stims)]
	for i in range(0, cycles):
		lst = deepcopy(lst) + deepcopy(stims)
	random.shuffle(lst)
	random.shuffle(lst)
	random.shuffle(lst)
	return lst

def trial_heuristic(lst):
	"""This is a heuristic to give a list of trials a score depending on equality in
	   number of transitions between dimensions. A TRIAL_MAP is created here to trial_map
	   each stimulus to their correct relative [color, shape].
	"""
	trial_map = {"Stim1": [0,0], "Stim2": [0,1], "Stim3": [1,0], "Stim4": [1,1]}
	previous = trial_map[lst[0][0]]
	color_switch = 0
	shape_switch = 0
	complete_switch = 0
	for i in range(1, len(lst)):
		trial = trial_map[lst[i][0]]
		if trial[0] != previous[0]: 
			if trial[1] == previous[1]: #Different color, same shape
				color_switch += 1
			else: #Different color, different shape
				complete_switch +=1
		else: 
			if trial[1] != previous[1]: #Same color, different shape
				shape_switch += 1
		previous = trial
	stdDev = numpy.std([color_switch,shape_switch,complete_switch])
	if stdDev == 0:
		return 10000000000
	return 1000/stdDev

def lst_print(lst):
	for trial in lst:
		print("[%s,%d], " % (trial[0], trial[1]), end="")
	print("\n")

def practice_builder(x, y):
	stim = [[x, 1], [y, 1]]
	lst = []
	for i in range(0, 10):
		lst = deepcopy(lst) + deepcopy(stim)
	random.shuffle(lst)
	for trial in lst:
		prob = random.randint(0,3)
		if prob == 0:
			trial[1] = 0
	return lst

def learning_builder(trials):
	lst = scrambler(trials, [["Stim1", 1], ["Stim2", 1], ["Stim3", 1], ["Stim4", 1]])
	for trial in lst:
		prob = random.randint(0,1)
		if prob == 0:
			trial[1] = 0
	return lst

def learning_with_heuristic(trials):
	result = [[0],0]
	for i in range(0, 100):
		lst = learning_builder(trials)
		lst_score = trial_heuristic(lst)
		if lst_score > result[1]:
			result = [lst, lst_score]
	return result[0]

def test_builder(stims):
	lst = scrambler(20, stims)
	return lst

#PRACTICE RULE 1
print("Practice rule 1:\n")
lst_print(practice_builder("Stim1", "Stim2"))

#PRACTICE RULE 2
print("Practice rule 2:\n")
lst_print(practice_builder("Stim3", "Stim4"))

#LEARNING PHASE
print("Learning phase:\n")
lst_print(learning_with_heuristic(80))

#TEST 0
print("Test 0:\n")
lst_print(test_builder([["Stim5", 1], ["Stim6", 0], ["Stim7", 1], ["Stim8", 0], ["Stim9", 0]]))

#OVERLEARNING 1
print("Overlearning 1:\n")
lst_print(learning_with_heuristic(120))

#TEST 1
print("Test 1:\n")
lst_print(test_builder([["Stim10", 0], ["Stim11", 1], ["Stim12", 0], ["Stim13", 0], ["Stim14", 1]]))

#OVERLEARNING 2
print("Overlearning 2:\n")
lst_print(learning_with_heuristic(120))

#TEST 2
print("Test 2:\n")
lst_print(test_builder([["Stim15", 0], ["Stim16", 1], ["Stim17", 0], ["Stim18", 0], ["Stim19", 1]]))

#PreTest0
print("PreTest0:\n")
lst_print(scrambler(30, [["Stim5", 1],["Stim7", 1]]))

#PreTest1
print("PreTest1:\n")
lst_print(scrambler(30, [["Stim10", 0],["Stim12", 0]]))

#PreTest2
print("PreTest2:\n")
lst_print(scrambler(30, [["Stim15", 0],["Stim17", 0]]))
