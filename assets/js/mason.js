function evalualteLoopsSeries(loops) {
	var result = 1
	var i = 1;
	var combinations = matchNonTouching(loops, i)


	while (combinations.length > 0) {
		term = 0
		for (var j = 0; j < combinations.length; j++) {
			group = combinations[j]
			factor = 1;
			for (var k = 0; k < group.length; k++) {
				factor *= loopGain(group[k])
			}
			term += factor
		}
		term *= (-1)**i
		result += term
		combinations = matchNonTouching(loops, i)
		i ++
	}
	return term
}

function evaluateDelta() {
	return evalualteLoopsSeries(getLoops())
}

function evaluateDeltaI(path) {
	var loops = getLoops();
	for (var i = loops.length - 1; i >= 0; i--) {
		if (touching(path, loops[i])) {
			loops.pop()
		}
	}

	return evalualteLoopsSeries(loops)

}

function evaluateMasonFormula() {

}