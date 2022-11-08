function getNote(cellNumber) {
	return localStorage.getItem(`notes${cellNumber}`);
}

//using the top element identified by 'theGrid'	, this function
//inserts child <TR> and <TD> elements to create a rectangular grid
//each element has an id of the pattern 'cell<N>' where N is a flat one dimensional index
//the flat one dimensional index start from 1; ie it runs from 1 to (numRows*numCols+1)
function createClickableTRTDGrid(numRows, numCols, tto, clickFunction) {
	var cellNumber = 0;
	var elParent = document.getElementById('theGrid');
	timetableObject = tto
	elParent.innerHTML = '';
	elParent.className = 'grid';

	//column headers <TH> elements
	if (timetableObject.showColNamesAtToprow)
		console.log("Hit")
	for (var c = -1; c <= numCols; c++) {
		thElement = elParent.appendChild(document.createElement('th')); //the TH element is the column header		
		if (c == -1) { thElement.innerHTML = timetableObject.timetableName; }   //top left corner element
		else { thElement.innerHTML = timetableObject.colTitles[c] }       // other column headers
		thElement.id = `colHeader${r}`;
	}


	//body of table: <TR> and <TD> elements
	for (var r = 0; r < numRows; r++) {//upper for start
		var trElement = elParent.appendChild(document.createElement('tr'));

		//Row captions at left
		if (timetableObject.showRowNamesAtLeft) {
			thElement = trElement.appendChild(document.createElement('th')); //the TH element is the column header
			thElement.id = `rowHeader${r}`;
			thElement.innerHTML = timetableObject.rowTitles[r];
		}

		//actual entries of table. <TD> elements
		maxCols = numCols; //use default size passed to function, in case the row object had null entries for that row.
		if (timetableObject.cellTopics[r]) maxCols = timetableObject.cellTopics[r].length;
		for (var c = 0; c < maxCols; c++) {
			cellNumber++; //we increment at start so that index can begin at 1
			clickState[r * sizeX + c] = false; // set initial state to 'clear' 
			var tdElement = trElement.appendChild(document.createElement('td')); //the TD element is the individual 'cell'            
			tdElement.id = `cell${cellNumber}`;

			//set text content of the <TD> element from the JSON array.
			//robustness: if json had some wrong or null elements, simply show '' without fuss or exceptions.
			if (timetableObject.cellTopics[r] && timetableObject.cellTopics[r][c]) { tdElement.innerHTML = timetableObject.cellTopics[r][c]; }
			else { tdElement.innerHTML = ''; }

			//CORNERNOTE:
			//set a small corner fold indicator if the cell contains a note
			//dont use toggle because we also want to any possible fix inconsistent states.
			if (getNote(cellNumber)) tdElement.classList.add("foldTopLeft");
			else tdElement.classList.remove("foldTopLeft");

			tdElement.addEventListener(
				'click',
				//even though the JS event framework allows no params to a listener function, 
				//we manage to send some params :) using some hack
				(function (el, r, c, cellNumber) { return function () { clickFunction(el, r, c, cellNumber); } })(tdElement, r, c, cellNumber),
				false
			);
		}//end of for loop
	}//end of upper for 

	return elParent;
}//end of function


//the action that is triggered when user clicks a cell
function clickAction(cellTDelement, row, col, cellNr) {
	//single click
	clickState.fill(false); //Array is already assigned size; it is enough to clear all cells.	
	//the action consists of toggling click state, i.e.:
	//	toggle the css class element so that formatting /marking is changed
	//	and change model value;i.e. the value in the array holding grid state

	//Note CellNr starts at 1 , not at zero; thus while using in arrays use [cellNr-1]
	//below lines not for production
	// console.log("You clicked on element:",cellTDelement);
	// logToTextArea(`clicked on ${row},${col} [${cellNr}]`);
	// showClickState();

	//If multi click disabled, remove previous click item
	if (lastClickedElement) { lastClickedElement.classList.remove('clicked'); clickState[cellNr - 1] = false; }

	//clickState[row*sizeX + col] = ! clickState[row*sizeX + col] ; 
	//the cellNr i is computed for display purposes, i.e. it starts at 1
	//for actual code purposes , subtract one; I would prefer it being the other way. - TODO:	
	//toggle className 'clicked' either on or off; we have only one class on this element
	if (cellTDelement.className == 'clicked') {
		//cellTDelement.className = '';
		cellTDelement.classList.remove('clicked');
		clickState[cellNr - 1] = false;
	}
	else {
		//cellTDelement.className = 'clicked';
		cellTDelement.classList.add('clicked');
		clickState[cellNr - 1] = true;
	}

	lastClickedElement = cellTDelement;
	lastClickedCellnr = cellNr

	//actual cell click handler: save notes to local storage
	if (lastClickedCellnr)
		notesElement.value = localStorage.getItem(`notes${lastClickedCellnr}`);

}

//global-i.e. script level vars: 
var sizeX = 5;
var sizeY = 8;
var clickState = new Array(sizeX * sizeY);
var logElement;
var showColNamesAtToprow = true;
var showRowNamesAtLeft = true;
var lastClickedElement = null;
var lastClickedCellnr = null;
var notesElement;

if (!notesElement) notesElement = document.getElementById('notes');


function Main() {
	let serverURL = `http://127.0.0.1:5050/`
	axios.get(serverURL).then((res, rej) => {
		console.log(`Debug: ${res.data}`) //debug log - we have gotten Data At this point
		var timetableObject = res.data

		res.data["showColNamesAtToprow"] = showColNamesAtToprow
		res.data["showRowNamesAtLeft"] = showRowNamesAtLeft

		// console.log(timetableObject)
		// console.log("Debug Check")

		if (timetableObject) {
			createClickableTRTDGrid(sizeX, sizeY, res.data, clickAction);

			// save changes event handler: saves to localStorage under the key 'notes<N>'
			notesElement.addEventListener("input", e => {
				if (lastClickedCellnr && lastClickedElement) {
					let text = notesElement.value;
					text = text.trim();
					localStorage.setItem(`notes${lastClickedCellnr}`, text);
					if (text) {
						lastClickedElement.classList.add("foldTopLeft");
						console.log("setting corner style");
					}
					else {
						lastClickedElement.classList.remove("foldTopLeft");
						console.log("clearing corner stle");
					}
				}
			});
		}

	}).catch((err) => {
		console.log(err);
		var griddy = document.getElementById("theGrid");
		var errorText = `<b>Something went wrong when trying to retrieve the data, restart the server and refresh this page.</><b/>`
		griddy.innerHTML = errorText;

	})
}

Main();