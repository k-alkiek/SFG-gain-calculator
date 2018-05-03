selectingInputNode = false
selectingOutputNode = false

function evaluateClicked() {
	if (inputNodeData == null || outputNodeData == null) {
		alert("You must select input and output nodes first!")
		return
	}
	if (!reachesAll(inputNodeData.id, getAdjacencyList())) {
		alert("Graph must be connected!")
		return
		}

	result = evaluateMasonFormula(inputNodeData.id, outputNodeData.id)
	$('[href="#results"]').tab('show');
	console.log(result)
}

function selectInputNodeClicked(event) {
	resetButtons()
	selectingInputNode = true
	var button  = event.target
	button.text = "Click input node"
	button.className = "btn btn-primary btn-lg btn-danger"
}

function selectOutputNodeClicked(event) {
	resetButtons()
	selectingOutputNode = true
	var button  = event.target
	button.text = "Click output node"
	button.className = "btn btn-primary btn-lg btn-danger"
}

function resetButtons() {
	selectingInputNode = false
	selectingOutputNode = false

	if (inputNodeData == null)
		document.getElementById("input").text = "Select Input Node"
	else
		document.getElementById("input").text = "Input Node: " + inputNodeData.text

	if (outputNodeData == null)
		document.getElementById("output").text = "Select Output Node"
	else
		document.getElementById("output").text = "Output Node: " + outputNodeData.text

	document.getElementById("input").className = "btn btn-primary btn-lg"
	document.getElementById("output").className = "btn btn-primary btn-lg"
}