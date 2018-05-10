var selectingInputNode = false
var selectingOutputNode = false

function checkValidation() {
    if (inputNodeData == null || outputNodeData == null) {
        alert("You must select input and output nodes first!")
        return false
    }
    if (!reachesAll(inputNodeData.id, getAdjacencyList())) {
        alert("Graph must be connected!")
        return false
    }
    return true; // All is valid.
}

function evaluateClicked() {
    if (checkValidation()) {
        $('[href="#results"]').tab('show');
    }
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

function openResultElement(evt, elementID) {
    // Declare all variables
    var i, tabcontent, tablinks;

    const functionName = elementID + "Display";

    const failMessages = document.getElementsByClassName('failMessage');

    if (checkValidation()) {
        for (var h = 0; h < failMessages.length; h++) {
            failMessages[h].style.display = 'none';
        }
        window[functionName]();
    } else {
        for (var h = 0; h < failMessages.length; h++) {
            failMessages[h].style.display = 'block';
        }
    }

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(elementID).style.display = "block";
    evt.currentTarget.className += " active";
}

function masonsFormulaDisplay() {
    var outputContainer = document.getElementById('masonsFormulaContainer');
    while (outputContainer.firstChild) {// Clear container
        outputContainer.removeChild(outputContainer.firstChild);
    }
    var result = evaluateMasonFormula(inputNodeData.id, outputNodeData.id);
    outputContainer.appendChild(document.createTextNode("was calculated to be " + result + '.'));

}

function forwardPathsDisplay() {
    console.log('Displaying Forward Paths');
    const paths = getForwardPaths(inputNodeData.id, outputNodeData.id);
    const outputContainer = document.getElementById('forwardPathsContainer');
    while (outputContainer.firstChild) {// Clear container
        outputContainer.removeChild(outputContainer.firstChild);
    }
    var buffer;
    for (var i = 0; i < paths.length; i++) {
        buffer = "Path " + (i+1) + " is " + pathToString(paths[i]) + "of gain of " + pathGain(paths[i])
        var node = document.createElement("li");
        node.appendChild(document.createTextNode(buffer));
        outputContainer.appendChild(node);
    }
}

function loopsDisplay() {
    console.log('Displaying Loops');
    const loops = getLoops();
    const outputContainer = document.getElementById('loopsContainer');
    while (outputContainer.firstChild) {// Clear container
        outputContainer.removeChild(outputContainer.firstChild);
    }
    var buffer;
    for (var i = 0; i < loops.length; i++) {
        buffer = "Loop " + (i+1) + " is " + pathToString(loops[i]) + "with gain " + loopGain(loops[i])
        var node = document.createElement("li");
        node.appendChild(document.createTextNode(buffer));
        outputContainer.appendChild(node);
    }

    var i = 2;
    var combinations = matchNonTouching(loops, i);
    while (combinations.length > 1  ) {
        outputContainer.appendChild(document.createElement("br"));
        var node = document.createElement("h4");
        var header = "Combinations of " + i + " non-touching loops are of loops: ";
        node.appendChild(document.createTextNode(header));
        outputContainer.appendChild(node);

        for (var j = 0; j < combinations.length; j++) {
            var list = document.createElement("ul");
            var group = combinations[j];
            for (var k = 0; k < group.length; k++) {
                var item = document.createElement("li");
                item.appendChild(document.createTextNode('Loop ' + pathToString(group[k]) + ' '));
            }
            outputContainer.appendChild(list);
        }
        i++;
        combinations = matchNonTouching(loops, i);
    }
}

function deltasDisplay() {
    console.log('Displaying Deltas');
    const paths = getForwardPaths(inputNodeData.id, outputNodeData.id);
    const outputContainer = document.getElementById('deltasContainer');
    while (outputContainer.firstChild) {// Clear container
        outputContainer.removeChild(outputContainer.firstChild);
    }
    var buffer;
    for (var i = 0; i < paths.length; i++) {
        buffer = "Delta " + (i+1) + " of path " + pathToString(paths[i]) + "is with delta " + evaluateDeltaI(paths[i]);
        var node = document.createElement("li");
        node.appendChild(document.createTextNode(buffer));
        outputContainer.appendChild(node);
    }
}

function pathToString(path) {
    var string = "";
    var nodesList = getAdjacencyList();
    for (var i = 0; i < path.length; i++) {
        string += nodesList[path[i]].name + ' ';
    }
    return string;
}