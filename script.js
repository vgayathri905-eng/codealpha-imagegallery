

const images=document.querySelectorAll(".gallery img");

let currentIndex=0;

function openLightbox(index){

currentIndex=index;

document.getElementById("lightbox").style.display="flex";

document.getElementById("lightbox-img").src=images[currentIndex].src;

}

function closeLightbox(){

document.getElementById("lightbox").style.display="none";

}

function changeImage(step){

currentIndex+=step;

if(currentIndex<0){

currentIndex=images.length-1;

}

if(currentIndex>=images.length){

currentIndex=0;

}

document.getElementById("lightbox-img").src=images[currentIndex].src;

}

function filterSelection(category){

const items=document.querySelectorAll(".gallery-item");

items.forEach(item=>{

if(category==="all"){

item.style.display="block";

}

else{
item.style.display=item.classList.contains(category)?"block":"none";
}
});

}