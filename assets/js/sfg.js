function getNodesList() {
	return JSON.parse(myDiagram.model.toJson()).nodeDataArray;
}

function getEdgeList() {
	return JSON.parse(myDiagram.model.toJson()).linkDataArray;
}

function getAdjacencyList() {
	edgeList = getEdgeList()
	nodesList = getNodesList()
	adjacencyList = {}

	for (i = 0; i < nodesList.length; i++) {
		node = nodesList[i]
		adjacencyList[node.id] = { name: node.text, neighbours: [] }
	}

	for (i = 0; i < edgeList.length; i++) {
		edge = edgeList[i]
		adjacencyList[edge.from].neighbours.push({ id: edge.to, weight: edge.text})
	}

	return adjacencyList
}