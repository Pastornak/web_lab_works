var backupImage;
class News{
	constructor(header, shortText, fullText, image){
		this.header = header;
		this.shortText = shortText;
		this.fullText = fullText;
		this.image = image;
	}
}

function getNews() {
    var news = new Array;
    var news_item = localStorage.getItem('news');
    if (news_item !== null) {
        news = JSON.parse(news_item); 
    }
    return news;
}

function addNews(){
	var DEFAULT_PHOTO = "file:///C:/Program%20Files/web_labs/lab_7/photo_ico.png"
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
	console.log(backupImage);
	var news = new News(newsHeader.value, newsShortText.value, newsText.value, backupImage);
	addToStorage(news);
}

function addToStorage(newsItem){
	var news = getNews();
    news.push(newsItem);
    localStorage.setItem('news', JSON.stringify(news));
    return false;
}

function loadPreviewPhoto(event){
	var imagePreview = document.getElementById('user-image');
	backupImage = imagePreview.src;
	imagePreview.src = URL.createObjectURL(event.target.files[0]);
}

function show(){
	var news = getNews();
    if ((typeof news !== 'undefined') && (news.length > 0)) {
	    for(var i = 0; i < news.length; i++) {
	    	console.log(news.header);
    		createNews(news[i]);
	    }
	}
}

function createNews(news){
	console.log(news.image);
	var element = document.getElementById("newsRow");
	element.innerHTML += '<div class="col-lg-4"> <center><img src = "' + news.image + '" alt = "News" width="300" height = "300"></center><center><h3>' 
	+ news.header + '</h3></center><p>' + news.shortText + '</p></div>'
}