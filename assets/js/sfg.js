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
 *	Takes a node id and detects cycles at this node as parameter.
 *	Returns a list of arrays. Each array contains id of nodes in the a loop
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

function clone(object) {
	return JSON.parse(JSON.stringify(object))
}