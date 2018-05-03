
function getNodesList() {
	return JSON.parse(myDiagram.model.toJson()).nodeDataArray;
}

function getEdgeList() {
	return JSON.parse(myDiagram.model.toJson()).linkDataArray;
}

function getAdjacencyList() {
	var edgeList = getEdgeList()
	var nodesList = getNodesList()
	var adjacencyList = {}

	for (var i = 0; i < nodesList.length; i++) {
		var node = nodesList[i]
		adjacencyList[node.id] = { name: node.text, neighbours: [] }
	}

	for (var i = 0; i < edgeList.length; i++) {
		var edge = edgeList[i]
		adjacencyList[edge.from].neighbours.push({ id: edge.to, weight: edge.text})
	}

	return adjacencyList
}


function reachesAll(nodeId, adjacencyList) {

	var visited = {}

	for (var node in adjacencyList) {// Initialising the visited object.
		if (adjacencyList.hasOwnProperty(node)) {
			visited[node] = false;
		}
	}

	explore(nodeId);
	function explore(nodeExplored) {
		if (visited[nodeExplored] == true) {
			return
		} else {
			visited[nodeExplored] = true;
			neighbours = adjacencyList[nodeExplored].neighbours;
			for (var i = 0; i < neighbours.length; i++) {
				explore(neighbours[i].id);
			}
		}
	}

	for (var node in visited) {// Check if all nodes are visited.
		if (visited.hasOwnProperty(node)) {
			if (visited[node] == false) return false;
		}
	}

	return true;
}

/*
 *	Searches for loops at a given node
 *	Returns a list of arrays. Each array reprsenets a loop and contains ids of nodes in the loop
 */
function getLoopsAtNode(startNodeId) {
	function dfs(nodeId, visited) {
		if (visited.includes(nodeId)) {
			if (nodeId == startNodeId) {
				loops.push(clone(visited))
			}
			return
		}

		visited.push(nodeId)
		var neighbours = adjacencyList[nodeId].neighbours
		for (var i = 0; i < neighbours.length; i++) {
			dfs(neighbours[i].id, visited)
		}
		visited.pop()
		return
	}

	var loops = []
	var adjacencyList = getAdjacencyList()
	dfs(startNodeId, [])

	return loops
}

/*
 *	Uses getLoopsAtNode() to search for loops in the whole graph
 *	Returns a list of arrays. Each array reprsenets a loop and contains ids of nodes in the loop
 */
function getLoops() {
	var loops = [];
	var nodesList = getNodesList()
	for (var i = 0; i < nodesList.length; i++) {
		var loopsAtNode = getLoopsAtNode(nodesList[i].id)
		var loopsLen = loops.length

		for (var j = 0; j < loopsAtNode.length; j++) {
			var found = false
			for (var k = 0; k < loopsLen; k++) {
				if (arraysEqual(loopsAtNode[j], loops[k])) {
					found = true
				}
			}
			if (!found) {
				loops.push(loopsAtNode[j])
			}
		}

	}
	return loops
}

/*
 *	Given a list of loops and number n, returns a list of all possible combinations for n non-touching loops
 *	Returns a list of arrays. Each array represents a path and contains ids of nodes in the path
 */
function matchNonTouching(loops, n) {
	var combine = function (input, len, start) {
		if(len === 0) {
			combinations.push(clone(result))
			return;
		}
		for (var i = start; i <= input.length - len; i++) {
			result[n - len] = input[i];
			combine(input, len-1, i+1 );
		}
	}
	var combinations = []
	var nonTouchingCombinations = []
	var result = []

	if (loops.length < n)
		return []
	combine(loops, n, 0);

	for (var i = 0; i < combinations.length; i++) {
		group = combinations[i]
		noTouchingLoops = true
		for (var j = 0; j < group.length && noTouchingLoops; j++) {
			for (var k = 0; k < group.length && noTouchingLoops; k++) {
				if (j === k) { continue }
				if (touching(group[j], group[k])) { noTouchingLoops = false }
			}
		}
		if (noTouchingLoops) {
			nonTouchingCombinations.push(group)
		}
	}

	return nonTouchingCombinations
}

/*
 *	Given two paths, Returns true if these path are touching and false otherwise
 */
function touching(path1, path2) {
	for (var i = 0; i < path1.length; i++) {
		for (var j = 0; j < path2.length; j++) {
			if (path1[i] == path2[j])
				return true
		}
	}
	return false
}


/*
 *	Searches for paths between two nodes, given their ids
 *	Returns a list of arrays. Each array represents a path and contains ids of nodes in the path
 */
function getForwardPaths(startNodeId, endNodeId) {
	function dfs(nodeId, visited) {
		if (visited.includes(nodeId)) {
			return
		}
		if (nodeId == endNodeId) {
			visited.push(endNodeId)
			paths.push(clone(visited))
			visited.pop()
			return
		}

		visited.push(nodeId)
		var neighbours = adjacencyList[nodeId].neighbours
		for (var i = 0; i < neighbours.length; i++) {
			if (!visited.includes(neighbours[i].id)) {
				dfs(neighbours[i].id, visited)
			}
		}
		visited.pop()
		return
	}

	var paths = []
	var adjacencyList = getAdjacencyList()
	dfs(startNodeId, [])

	return paths
}

function pathGain(pathList) {
	var edgeList = getEdgeList()
	var from = pathList[0]
	var to;
	var gain = 1;
	debugger
	for(var i = 1; i < pathList.length; i++) {
		to = pathList[i]
		for(var e = 0; e < edgeList.length; e++) {
			if (edgeList[e].from == from && edgeList[e].to == to) {
				if (edgeList[e].text != undefined) {
					gain *= edgeList[e].text;
				}
			}
		}
		from = to;
	}
	return gain;
}

function loopGain(loopList) {
	var gain = pathGain(loopList);
	var from = loopList[loopList.length - 1];
	var to = loopList[0];
	var edgeList = getEdgeList()
	for(var e = 0; e < edgeList.length; e++) {
		if (edgeList[e].from == from && edgeList[e].to == to) {
			if (edgeList[e].text != undefined) {
					gain *= edgeList[e].text;
				}
		}
	}
	return gain;
}

// Helper Functions

function clone(object) {
	return JSON.parse(JSON.stringify(object))
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	a.sort()
	b.sort()

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
