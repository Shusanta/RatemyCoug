var rmp = require('./rmp-api.js');
var WSU = rmp("Washington State University");
var professorName = ""; // The name of the professor currently being searched
var professorRating = ""; // The rating of the professor

// This is the ID that professors are listed under in the HTML. This changes depending on how the user got to the class page.
// Initialized to MTGPAT_INSTR$ assuming the user got their by going through "My requirements" in the enroll page. See method: getUserMethod()
var professorMethodID = "MTGPAT_INSTR$"

/**
 * This listens for any change in the page and fires the listener function.
 * The timeout is so that it isn't fired several times.
 */
 //
 /////
 ///
 ///
 ///
var timeout = null;
document.addEventListener("DOMSubtreeModified",
function()
{
	if(timeout)clearTimeout(timeout);
	timeout = setTimeout(listener, 1000);
}, false);

/**
 * This method is fired whenever there is a DOM modification on the current page
 */
function listener()
{
	// run the script if it detects a class search page
	resetValues();
	if(getUserMethod())
	{
		RunScript();
	}
}

var callback = function(professor) {
  if (professor === null) {
    console.log("Professor not found.\n");
    return "";
  }
  else return professor.easiness;
};

var URI = function(professor) {
  if (professor === null) {
    console.log("Professor not found.\n");
    return "";
  }
  else return professor.url;
};
/**
 * This method finds out which method the user took when getting to the enroll page. Depending on which method (through class search or my requirements)
 * the ID for the professor name changes.
 * Returns true whenever the user is at a class search page
 */
function getUserMethod()
{
	try
	{
		var classSearchMethod = document.getElementById('ptifrmtgtframe').contentWindow.document.getElementById("MTG_INSTR$" + 0).innerHTML;
	} catch(classSearchErr) {}

	try
	{
		var myRequirementsMethod = document.getElementById('ptifrmtgtframe').contentWindow.document.getElementById("MTGPAT_INSTR$" + 0).innerHTML;
	} catch(myRequirementsErr) {}

	if(classSearchMethod != undefined)
	{
		professorMethodID = "MTG_INSTR$"; // User went through the class search page
		return true;
	}
	else if (myRequirementsMethod != undefined)
	{
		professorMethodID = "MTGPAT_INSTR$"; // User went through the my requirements page
		return true;
	}
}

/**
 * This is the main function of this script.
 */
function RunScript()
{
 	var professorIndex = 0; // start at first professor in list
	var currentProfessor = "";

	while (professorName != "undefined")
	{

		professorName = getProfessorName(professorIndex)
		currentProfessor = professorName;
		// only get the professor search page if its not undefined or staff
		if(professorName != "Staff" && professorName != "undefined")
		{
			getProfessorLegit(professorIndex, currentProfessor);
		}
		professorIndex++;
	}
}



function getProfessorName(indexOfProfessor)
{
	try
	{
		professorName = document.getElementById('ptifrmtgtframe').contentWindow.document.getElementById(professorMethodID + indexOfProfessor).innerHTML;
		return professorName;
	}
	catch (err)
	{
		professorName = "undefined"
	}
}

/////
//

// This function checks if legit then adds the rating of the professor!!!!!
function getProfessorLegit(professorIndex, currentProfessor)
{
		rating = WSU.get(currentProfessor,callback);

		if(rating != ""){

			var url = WSU.get(currentProfessor,URI);

			addRatingToPage(rating, url)
		}

}

/**
 *  This function adds the rating to the class search page. Depending on the score the color of it is changed
 */
function addRatingToPage(rating, link) {

    var span = document.createElement("span"); // Created to separate professor name and score in the HTML
    var link = document.createElement("a");
    var space = document.createTextNode(" "); // Create a space between professor name and rating
    var professorRatingTextNode = document.createTextNode(rating); // The text with the professor rating
		var ProfessorRating = Number(rating);
		
    if (ProfessorRating < 3.5) {
        link.style.color = "#8A0808"; // red = bad
    } else if (ProfessorRating >= 3.5 && ProfessorRating < 4) {
        link.style.color = "#FFBF00"; // yellow/orange = okay
    } else if (ProfessorRating >= 4 && ProfessorRating <= 5) {
        link.style.color = "#298A08"; // green = good
    }

    span.style.fontWeight = "bold"; // bold it

    link.href = link; // make the link
    link.target = "_blank"; // open a new tab when clicked

    // append everything together
    link.appendChild(professorRatingTextNode);
    span.appendChild(space);
    span.appendChild(link);
    professorID.appendChild(span);
}





/**
 * This function simply resets the variables
 */
function resetValues() {
    professorName = "";
    ratingsPageURL = "";
    searchPageURL = "";
    professorRating = "";
}

// EXTRA STOOOF
/**
 * Function to get the last name from a person.
 * We are using American English as the base for the
 * inferences.
 *
 * The following names are supported:
 * Doe 			=> 	Doe
 * John Doe 	=>	Doe
 * John M. Doe 	=>	Doe
 *
 * @param  String
 * @return String
 */
function getLastName(fullName) {
    var comp = fullName.split(" ");

    if (comp.length == 1) {
        return comp[0]; //Case for Doe
    } else if (comp.length == 2) {
        return comp[1]; //case for John Doe
    } else if (comp.length == 3) {
        return comp[2]; //case for John M. Doe
    }
}
