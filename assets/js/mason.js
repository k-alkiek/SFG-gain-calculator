function evalualteLoopsSeries(loops) {
	var result = 1
	var i = 1;
	var combinations = matchNonTouching(loops, i)
	while (combinations.length > 0) {
		var term = 0
		for (var j = 0; j < combinations.length; j++) {
			group = combinations[j]
			var factor = 1;
			for (var k = 0; k < group.length; k++) {
				factor *= loopGain(group[k])
			}
			term += factor
		}
		term *= (-1)**i
		result += term
		i++
		combinations = matchNonTouching(loops, i)
	}
	return result
}

function evaluateDelta() {
	return evalualteLoopsSeries(getLoops())
}

function evaluateDeltaI(path) {
	var loops = getLoops();
	var nonTouchingloops = []
	for (var i = loops.length - 1; i >= 0; i--) {
		if (!touching(path, loops[i])) {
			nonTouchingloops.push(loops[i])
		}
	}
	console.log(loops)
	return evalualteLoopsSeries(nonTouchingloops)
}

function evaluateMasonFormula(startNodeId, endNodeId) {
	var paths = getForwardPaths(startNodeId, endNodeId)
	var result = 0
	for (var i = 0; i < paths.length; i++) {
		console.log("Path " + i + " is " + paths[i] + " with delta " + evaluateDeltaI(paths[i]) + " and gain " + pathGain(paths[i]))
		result += evaluateDeltaI(paths[i]) * pathGain(paths[i])
	}

	result /= evaluateDelta()
	return result
}