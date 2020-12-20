let cw = document.documentElement.clientWidth,
    ch = document.documentElement.clientHeight,
    snow = [],
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.setAttribute("width", cw);
canvas.setAttribute("height", ch);


function degToRad(deg) {
  return Math.PI / 180 * deg;
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function SnowFlake (x, y, scale1, scale2){
  this.x = x;
  this.y = y;
  this.vx = 0.05;
  this.vy = 0.5;
  this.color = "rgb(255, 255, 0)";
  this.scale1 = scale1;
  this.scale2 = scale2;
};
SnowFlake.prototype.draw =  function (){
    
    function fractal(x, y, scale, rotate){
    
      ctx.save()

      ctx.translate(x, y);
      ctx.rotate(degToRad(rotate));

      ctx.moveTo(0, 0);
      ctx.lineTo(0, 0 - 3*scale); //  the main axis
      ctx.moveTo(0, 0 - 2*scale);

      ctx.lineTo(0 + 1*scale, 0 - 3*scale); // right 
      ctx.moveTo(0, 0 - 2*scale);

      ctx.lineTo(0 - 1*scale, 0 - 3*scale); // left

      ctx.restore();
    
    };
    
    ctx.beginPath();
  
   
    fractal(this.x, this.y, this.scale1, 0);
    fractal(this.x, this.y, this.scale1, 90);
    fractal(this.x, this.y, this.scale1, 180);
    fractal(this.x, this.y, this.scale1, 270);

    fractal(this.x, this.y, this.scale2, 45);
    fractal(this.x, this.y, this.scale2, -45);
    fractal(this.x, this.y, this.scale2, 225);
    fractal(this.x, this.y, this.scale2, -225);
    
    ctx.strokeStyle =  "rgb(255, 255, 255)";
    ctx.stroke();
  };
SnowFlake.prototype.update = function (){
  this.y += this.vy;
  this.x = Math.sin(this.y*0.05)*0.25+this.x;
}

function createSnow(i){
  while (i--){
    snow.push(new SnowFlake(getRandomNumber(0, cw), 
                            getRandomNumber(0, -ch - 200),
                            getRandomNumber(7, 10),
                            getRandomNumber(5, 10)
                           ));
  };
};
createSnow(100);

function animate(){
  
  ctx.clearRect(0, 0, cw, ch);
  
  var i = snow.length 
  while(i--){
    snow[i].draw();
    snow[i].update();
    if (snow[i].y>ch+10){
      snow[i].y= getRandomNumber(0, -ch);
    }
  };
  requestAnimationFrame(animate);
};

animate();

function _(query){
	return document.querySelector(query);
}
function _all(query){
	return document.querySelectorAll(query);
}
let songList = [
	
	{
		thumbnail:"frostythesnowman.jpg",
		audio:"frosty.mp3",
		songname:"Frosty the Snowman",
		artistname:"Anthony Viscounte & The Merry Gentlemen",
	},
	{
		thumbnail:"lastchristmas.jpg",
		audio:"lastchristmas.mp3",
		songname:"Last Christmas",
		artistname:"Monaco Lorenzo",
	},
	{
		thumbnail:"jinglebells.jpg",
		audio:"jinglebells.mp3",
		songname:"Jingle Bells",
		artistname:"CorporateMusic",
	},
	{
		thumbnail:"wishyou.jpg",
		audio:"wishyouamerrychristmas.mp3",
		songname:"We Wish you a Merry Christmas",
		artistname:"Hasenchat",
	},
	{
		thumbnail:"joy.jpg",
		audio:"joytotheworld.mp3",
		songname:"Joy to the World",
		artistname:"CorporateMusic",
	},
	
	{
		thumbnail:"santaclausiscomingtotown.jpg",
		audio:"santa.mp3",
		songname:"Santa Claus is Coming to Town",
		artistname:"BKSonic",
	}	    
];

let currentSongIndex = 0;

let player = _(".player"),
	toggleSongList = _(".player .toggle-list");

let main = {
	audio:_(".player .main audio"),
	thumbnail:_(".player .main img"),
	seekbar:_(".player .main input"),
	songname:_(".player .main .details h2"),
	artistname:_(".player .main .details p"),
	prevControl:_(".player .main .controls .prev-control"),
	playPauseControl:_(".player .main .controls .play-pause-control"),
	nextControl:_(".player .main .controls .next-control")
}

toggleSongList.addEventListener("click", function(){
	toggleSongList.classList.toggle("active");
	player.classList.toggle("activeSongList");
});

_(".player .player-list .list").innerHTML = (songList.map(function(song,songIndex){
	return `
		<div class="item" songIndex="${songIndex}">
			<div class="thumbnail">
				<img src="./img/${song.thumbnail}">
			</div>
			<div class="details">
				<h2>${song.songname}</h2>
				<p>${song.artistname}</p>
			</div>
		</div>
	`;
}).join(""));

let songListItems = _all(".player .player-list .list .item");
for(let i=0;i<songListItems.length;i++){
	songListItems[i].addEventListener("click",function(){
		currentSongIndex = parseInt(songListItems[i].getAttribute("songIndex"));
		loadSong(currentSongIndex);
		player.classList.remove("activeSongList");
	});
}

function loadSong(songIndex){
	let song = songList[songIndex];
	main.thumbnail.setAttribute("src","./img/"+song.thumbnail);
	document.body.style.background = `radial-gradient(rgb(250, 5, 5),rgb(31, 78, 31), url("./audio/${song.thumbnail}") center no-repeat`;
	document.body.style.backgroundSize = "cover";	
	main.songname.innerText = song.songname;
	main.artistname.innerText = song.artistname;
	main.audio.setAttribute("src","./audio/"+song.audio);
	main.seekbar.setAttribute("value",0);
	main.seekbar.setAttribute("min",0);
	main.seekbar.setAttribute("max",0);
	main.audio.addEventListener("canplay",function(){
		main.audio.play();
		if(!main.audio.paused){
			main.playPauseControl.classList.remove("paused");
		}
		main.seekbar.setAttribute("max",parseInt(main.audio.duration));
		main.audio.onended = function(){
			main.nextControl.click();
		}
	})
}
setInterval(function(){
	main.seekbar.value = parseInt(main.audio.currentTime);
},1000);

main.prevControl.addEventListener("click",function(){
	currentSongIndex--;
	if(currentSongIndex < 0){
		currentSongIndex = songList.length + currentSongIndex;
	}
	loadSong(currentSongIndex);
});
main.nextControl.addEventListener("click",function(){
	currentSongIndex = (currentSongIndex+1) % songList.length;
	loadSong(currentSongIndex);
});
main.playPauseControl.addEventListener("click",function(){
	if(main.audio.paused){
		main.playPauseControl.classList.remove("paused");
		main.audio.play();
	} else {
		main.playPauseControl.classList.add("paused");
		main.audio.pause();
	}
});
main.seekbar.addEventListener("change",function(){
	main.audio.currentTime = main.seekbar.value;
});
loadSong(currentSongIndex);

