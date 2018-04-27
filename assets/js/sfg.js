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

function clone(object) {
	return JSON.parse(JSON.stringify(object))
}

function pathGain(pathList) {
	var edgeList = getEdgeList()
	var from = pathList[0]
	var to;
	var gain = 0;
	for(var i = 1; i < pathList.length; i++) {
		to = pathList[i]
		for(var e = 0; e < edgeList.length; e++) {
			if (edgeList[e].from == from && edgeList[e].to == to) {
				gain *= edgeList[e].text;
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
	for(var e = 0; e < edgeList.length; e++) {
		if (edgeList[e].from == from && edgeList[e].to == to) {
			gain *= edgeList[e].text;
		}
	}
	return gain;
}