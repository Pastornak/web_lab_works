var useLocalStorage = false;

function switchUseLS(){
	useLocalStorage = !useLocalStorage;
}

function isOnline() {
	return window.navigator.onLine; 
}

class Feedback{
	constructor(name, feedback, date){
		this.name = name;
		this.feedback = feedback;
		this.date = date;
	}
}

function addToStorage(feedback){
	if (isOnline()){
		//var obj= JSON.stringify(feedback);
		var http = new XMLHttpRequest();
		var params = "name=" + feedback.name + "&feedback=" + feedback.feedback + "&date=" + feedback.date;
		http.open("POST", 'http://localhost:8000/feedbacks', true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() {//Call a function when the state changes.
		    if(http.readyState == 4 && http.status == 200) {
		        alert(http.responseText);
		    }
		}
		http.send(params);
		//alert("Stored feedback " + feedback.feedback);
	} else{
		if(useLocalStorage){
			var feedbacks = new Array;
		    var feedback_item = localStorage.getItem('feedbacks');
		    if (feedback_item !== null) {
		        feedbacks = JSON.parse(feedback_item); 
		    }
		    feedbacks.push(feedback);
		    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
		    //show();
		    return false;
		} else{
			var openDB = indexedDB.open("feedback", 1);

			openDB.onerror = function(event) {
			  alert("Error occurred when loading feedback");
			};
			openDB.success = function(event) {
				var db = openDB.result;
				var tx = db.transaction(["feedbacks"], "readwrite");
				var store = tx.objectStore("feedbacks");
				var addFeedback = store.add(feedback);
				addFeedback.onsuccess = function(event){
				}
				addFeedback.onerror = function(event){
					alert("Error occurred when loading feedbacks");
				}
				tx.oncomplete = function(){
					//openDB.close();
				}
			};
		}
	}
}

function show(){
	if (isOnline()){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:8000/feedbacks/all', true);
        xhr.send();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       	// Typical action to be performed when the document is ready:
		       	var feedbacks = JSON.parse(xhr.responseText);
		       	console.log(feedbacks);
		       	for(var i = 0; i < feedbacks.length; i++){
		       		console.log(feedbacks[i]);
		       		createFeedback(feedbacks[i]);
		       	}
		       //console.log(feedbacks);
		       //console.log(typeof feedbacks);
		       //console.log(feedbacks[0]);
		       //return JSON.parse(xhr.responseText);
		    }
		};
	} else{
		if(useLocalStorage){
			var feedbacks = new Array;
		    var feedback_item = localStorage.getItem('feedbacks');
		    if (feedback_item !== null) {
		        feedbacks = JSON.parse(feedback_item); 
		    }
		    for(var i = 0; i < feedbacks.length; i++){
	       		createFeedback(feedbacks[i]);
	        }
		} else{
			var openDB = indexedDB.open("feedback", 1);
			openDB.onsuccess = function(event) {
				var db = openDB.result;
				var tx = db.transaction(["feedbacks"], "readwrite");
		    	var store = tx.objectStore("feedbacks");
		    	store.openCursor().onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						var tempFeed = new Feedback(cursor.value.name, cursor.value.feedback, cursor.value.date);
						//console.log(tempFeed);
					  	createFeedback(tempFeed);
					  	cursor.continue();
					}
				};
		    	tx.oncomplete = function(){
		    		//openDB.close();
		    	}
			}
		}
	}
}

function addFeedback(){
	var feedbackText = document.getElementById("comment");
	var nameText = document.getElementById("name");
	var date = new Date();
	if(nameText.value == ""){
		alert("Вкажіть ваше ім'я");
		return;
	}
	if(feedbackText.value == ""){
		alert("Порожній відгук!");
		return;
	}
	var feedback = new Feedback(nameText.value, feedbackText.value, date);
	addToStorage(feedback);
	createFeedback(feedback);
	feedbackText.value = "";
	nameText.value = "";
}

function createFeedback(feedback){
	var responseField = document.getElementById("newResponseField");
	var element = document.getElementById("responses");

	var date = new Date(feedback.date);
	var nameText = feedback.name;
	var responseText = feedback.feedback;
	var dateString = date.getDate() + "." + (date.getMonth() + 1) + "." + (date.getFullYear())
		+ ", " + date.getHours() + ":" + date.getMinutes();

	/*element.innerHTML += '<div class="row">
	<div class = col-lg><p><span class="h2 pull-left">'+ nameText + ' ' + 
	'</span><span><i>' + dateString + '</i></span></p><p>' + responseText + '</p></div></div><hr>';*/

	var responseRow = document.createElement("div");
	responseRow.setAttribute("class", 'row');
	var responseCol = document.createElement("div");
	responseCol.setAttribute("class", "col-lg");
	var responseHeader = document.createElement("p");
	var responseFill = document.createElement("p");
	var responseHeaderName = document.createElement("span");
	responseHeaderName.setAttribute("class", "h2 pull-left");
	var responseHeaderDate = document.createElement("span");
	var responseHeaderDateItalic = document.createElement("i");
	responseHeaderDateItalic.innerHTML = dateString;
	responseHeaderName.innerHTML = nameText + " ";
	responseFill.innerHTML = responseText;

	responseHeaderDate.appendChild(responseHeaderDateItalic);
	responseHeader.appendChild(responseHeaderName);
	responseHeader.appendChild(responseHeaderDate);
	responseCol.appendChild(responseHeader);
	responseCol.appendChild(responseFill);
	responseRow.appendChild(responseCol);

	element.insertBefore(responseRow, responseField);
	element.insertBefore(document.createElement("hr"), responseField);
}