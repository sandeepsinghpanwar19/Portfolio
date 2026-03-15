const words=[
"Python Developer",
"Django Developer",
"AI / ML Enthusiast",
"Android Developer",
"Web Developer"
];

let wordIndex=0;
let charIndex=0;
let deleting=false;

const typing=document.getElementById("typing");

function type(){

const currentWord=words[wordIndex];

if(deleting){
charIndex--;
}else{
charIndex++;
}

typing.textContent=currentWord.substring(0,charIndex);

let speed=deleting?60:120;

if(!deleting && charIndex===currentWord.length){

speed=1500;
deleting=true;

}
else if(deleting && charIndex===0){

deleting=false;
wordIndex++;

if(wordIndex===words.length){
wordIndex=0;
}

speed=500;

}

setTimeout(type,speed);

}

type();

document.querySelectorAll("a").forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({
behavior:"smooth"
});

});

});

function reveal(){

const reveals=document.querySelectorAll(".reveal");

reveals.forEach((el)=>{

const windowHeight=window.innerHeight;
const elementTop=el.getBoundingClientRect().top;

if(elementTop < windowHeight-100){
el.classList.add("active");
}

});

}

window.addEventListener("scroll",reveal);
reveal();

particlesJS("particles-js",{

particles:{

number:{value:80},

color:{value:"#38bdf8"},

shape:{type:"circle"},

opacity:{value:0.5},

size:{value:3},

line_linked:{
enable:true,
distance:150,
color:"#38bdf8",
opacity:0.4,
width:1
},

move:{
enable:true,
speed:2
}

},

interactivity:{
events:{
onhover:{enable:true,mode:"repulse"}
}
}

});