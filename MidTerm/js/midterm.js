String.prototype.ucFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.substring(1);
}

var JSONdata = [],
	currentItem = 0,
	sidebarItems = 3,
	JSONfile = "https://raw.githubusercontent.com/joellord/users/master/users.json",
	showBtnValNext = "Show Next",
	showBtnValDone = "Done",
	enabledBtnClass = "enabled",
	disabledBtnClass = "disabled";

document.addEventListener( "DOMContentLoaded", function(){
	var	output1 = document.querySelector( "#output1" ), 
		output2 = document.querySelector( "#output2" ),
		loadBtn = document.querySelector( "#loadBtn" ),
		showBtn = document.querySelector( "#showBtn" );
		
	loadBtn.addEventListener( "click", loadBtnClick );
});

function loadBtnClick(  ) {
	loadBtn.classList.remove( enabledBtnClass ); // Note to self: '.classList.toggle()' can be used instead of add/remove
	loadBtn.classList.add( disabledBtnClass );
	showBtn.classList.remove( disabledBtnClass );
	showBtn.classList.add( enabledBtnClass );
	fetchData( JSONfile );
	loadBtn.removeEventListener( "click", loadBtnClick );
	showBtn.addEventListener( "click", showBtnClick );
}

function showBtnClick(  ) {
	moveExistingDataToSide( );
	displayNewDataInMain( );
	if ( currentItem == 1 ) {
		showBtn.innerHTML = showBtnValNext;
	}
	if ( currentItem == JSONdata.length ) { 	// Unrequested additional feature: This 'If' statement handles 'Show Next' button when out of new data 
		showBtn.classList.remove( enabledBtnClass );
		showBtn.classList.add( disabledBtnClass );
		showBtn.removeEventListener( "click", showBtnClick );
		showBtn.innerHTML = showBtnValDone;
	}
}

function fetchData( file ){
	var req = new XMLHttpRequest( );
	req.open( 'GET', file, false );	// Note to self: Synchronous XHR is deprecated. For asynchronous XHR use 'req.open( 'GET', file, true );'
	req.onreadystatechange = function( ){
		if( req.readyState == 4 ){
			if( req.status == 200 ){
				JSONdata = JSON.parse( req.responseText );	// Note to self: console.log(req.responseText);
			}
		}
	}
	req.send( null ); 
}

function displayNewDataInMain( ){
	var JSONdataRow = JSONdata[ currentItem ];
	var outputHTML = document.createElement("div");
	outputHTML.setAttribute( "id", "item" + currentItem );
	outputHTML.setAttribute( "data-thumbnail", JSONdataRow.thumbnail );
	outputHTML.innerHTML =
		'<img src="' + JSONdataRow.image + '"/>' +
		'<h2><a href="mailto:' + JSONdataRow.email + '">' + 
			JSONdataRow.firstName.ucFirstLetter() + ' ' + JSONdataRow.lastName.ucFirstLetter() + 
		'</a></h2>';
	output1.appendChild( outputHTML );
	currentItem++;
}

function moveExistingDataToSide( ){
	if ( currentItem > sidebarItems ) {
		output2.removeChild( output2.lastChild );
	}
	for ( var i=1; i <= sidebarItems; i++ ){
		if ( JSONdata.hasOwnProperty( currentItem-i ) ) {
			var currentDiv = document.getElementById( "item" + ( currentItem-i ) );
			currentDiv.querySelector("img").src = currentDiv.dataset.thumbnail;
			output2.appendChild( currentDiv );
		}
	}
}