var crosswordSwapped = false;
var wordsearchSwapped = false;
var posterSwapped = false;

//Changes the crossword image to swap between the answer and the blank one
function changeCrossword()
{
var img = document.getElementById("crosswordImg");

if(!crosswordSwapped){
    img.src="CrosswordTwo.png";
    crosswordSwapped = true;
} else {
    img.src="CrosswordOne.png";
    crosswordSwapped = false;
}

console.log("Crossword changed");
return false;
}

//Changes the wordsearch image to swap between the answer and the blank one
function changeWordsearch()
{
var img = document.getElementById("wordsearchImg");

if(!wordsearchSwapped){
    img.src="WordsearchTwo.png";
    wordsearchSwapped = true;
} else {
    img.src="WordsearchOne.png";
    wordsearchSwapped = false;
}

console.log("Wordsearch changed");
return false;
}

//Changes the wanted poster image to swap between the answer and the blank one
function changePoster()
{
var img = document.getElementById("posterImg");

if(!posterSwapped){
    img.src="WordsearchTwo.png";
    posterSwapped = true;
} else {
    img.src="posterOne.png";
    posterSwapped = false;
}

console.log("Poster changed");
return false;
}

//Creates a function to fetch the navbar.html file and display it in the navbar div
fetch('navbar.html') 
            .then(response => response.text()) 
            .then(data => { 
                document.getElementById('navbar').innerHTML = data; 
            }) 
            .catch(error => console.error('Error loading navbar:', error));