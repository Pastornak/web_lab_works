var useLocalStorage = false;

function switchUseLS(){
	useLocalStorage = !useLocalStorage;
}

function isOnline() {
	return window.navigator.onLine; 
}

class News{
	constructor(header, shortText, fullText, image){
		this.header = header;
		this.shortText = shortText;
		this.fullText = fullText;
		this.image = image;
	}
}

function addNews(){
	var DEFAULT_PHOTO = "./photo_ico.png";
	var imageForm = document.getElementById("userInputFile");
	var newsHeader = document.getElementById("header");
	var newsShortText = document.getElementById("shortText");
	var newsText = document.getElementById("newsText");
	var imagePreview = document.getElementById('user-image');
	if(newsHeader.value == ""){
		alert("Вкажіть заголовок статті");
		return;
	}
	if(newsShortText.value == ""){
		alert("Вкажіть короткий опис статті");
		return;
	}
	if(newsText.value == ""){
		alert("Вкажіть текст статті");
		return;
	}
	if(imagePreview.src == DEFAULT_PHOTO){
		alert("Завантажте фото для статті");
		return;
	}
	var news = new News(newsHeader.value, newsShortText.value, newsText.value, imagePreview.src);
	addToStorage(news);
	alert('Готово!');
	newsHeader.value = "";
	newsShortText.value = "";
	newsText.value = "";
	imagePreview.src = DEFAULT_PHOTO;
	imageForm.value="";
}

function addToStorage(newsItem){
	if(isOnline()){
		var http = new XMLHttpRequest();
		var params = "header=" + newsItem.header + "&shortText=" + newsItem.shortText + "&fullText=" + newsItem.fullText + "&image=" + newsItem.image;
		http.open("POST", 'http://localhost:8000/news', true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() {//Call a function when the state changes.
		    if(http.readyState == 4 && http.status == 200) {
		        alert(http.responseText);
		    }
		}
		http.send(params);
	} else{
		if(useLocalStorage){
			var news = getNews();
		    news.push(newsItem);
		    localStorage.setItem('news', JSON.stringify(news));
		    return false;
		} else{
			var openDB = indexedDB.open("news", 1);

			openDB.onerror = function(event) {
			  alert("Error occurred when loading news");
			};
			openDB.onupgradeneeded = function() {
			    var db = openDB.result;
			    var store = db.createObjectStore("news", {keyPath: "header"});
			    store.createIndex("header", "header", { unique: false });
			    store.createIndex("shortText", "shortText", { unique: false });
			    store.createIndex("fullText", "fullText", { unique: false });
			    store.createIndex("image", "image", { unique: false });
			};
			openDB.onsuccess = function(event) {
				var db = openDB.result;
				var tx = db.transaction(["news"], "readwrite");
				var store = tx.objectStore("news");
				var addFeedback = store.put(newsItem);
				addFeedback.onsuccess = function(event){
				}
				addFeedback.onerror = function(event){
					alert("Error occurred when loading news");
				}
				tx.oncomplete = function(){
					db.close();
				}
			};
		}
	}
}

function loadPreviewPhoto(){
	var src = document.getElementById("userInputFile");
	var target = document.getElementById("user-image");
	var fr = new FileReader();
	fr.readAsDataURL(src.files[0]);
	fr.onload = function(e){
		target.src = this.result;
	};
}

function show(){
	if(isOnline()){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:8000/news/all', true);
        xhr.send();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       	// Typical action to be performed when the document is ready:
		       	var news = JSON.parse(xhr.responseText);
		       	console.log(news);
		       	for(var i = 0; i < news.length; i++){
		       		console.log(news[i]);
		       		createNews(news[i]);
		       	}
		       //console.log(feedbacks);
		       //console.log(typeof feedbacks);
		       //console.log(feedbacks[0]);
		       //return JSON.parse(xhr.responseText);
		    }
		};
	} else{
		if(useLocalStorage){
			var news = new Array;
		    var news_item = localStorage.getItem('news');
		    if (news_item !== null) {
		        news = JSON.parse(news_item); 
		    }
		    if ((typeof news !== 'undefined') && (news.length > 0)) {
			    for(var i = 0; i < news.length; i++) {
		    		createNews(news[i]);
			    }
			}
		} else{
			var openDB = indexedDB.open("news", 1);
			openDB.onupgradeneeded = function() {
			    var db = openDB.result;
			    var store = db.createObjectStore("news", {keyPath: "header"});
			    store.createIndex("header", "header", { unique: false });
			    store.createIndex("shortText", "shortText", { unique: false });
			    store.createIndex("fullText", "fullText", { unique: false });
			    store.createIndex("image", "image", { unique: false });
			}
			openDB.onsuccess = function(event) {
				var db = openDB.result;
				var tx = db.transaction("news", "readwrite");
		    	var store = tx.objectStore("news");
		    	store.openCursor().onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						var tempNews = new News(cursor.value.header, cursor.value.shortText, cursor.value.fullText, cursor.value.image);
						//console.log(tempFeed);
					  	//feedbacks.push(tempFeed);
					  	createNews(tempNews);
					  	cursor.continue();
					}
				};
		    	tx.oncomplete = function(){
		    		db.close();
		    	}
			}
		}
	}
}

function createNews(news){
	var element = document.getElementById("newsRow");
	element.innerHTML += '<div class="col-lg-4"> <center><img src = "' + news.image + '" alt = "News" width="300" height = "300"></center><center><h3>'
	+ news.header + '</h3></center><p>' + news.shortText + '</p></div>'
}