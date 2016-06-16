window.Vdig = function(w,h,fps,func) {
				
	if(fps==undefined) fps = 30;

	this.width  = w;
	this.height = h;
	this.fps    = fps;  

	this.func = func;

	this.canvas = document.createElement("canvas");
	this.canvas.width  = w;	
	this.canvas.height = h;

	this.ctx = this.canvas.getContext("2d");

	// flip
	this.ctx.translate(this.width,this.height);
	this.ctx.scale(-1,-1);

	this.isPlay = false;
		
	this.isSupported = false;
		
	navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia;

	if(navigator.getUserMedia) {
		
		navigator.getUserMedia({
			video:{mandatory:{
				minWidth:w,maxWidth:w,
				minHeight:h,maxHeight:h,
				minFrameRate:fps,maxFrameRate:fps
				}},audio:false},
				(function(stream) {
				
					this.isSupported = true;
																	 
					var url = (window.URL||window.webkitURL);
				
					this.image = document.createElement("video");
					this.image.autoplay = true;
					this.image.width  = w;
					this.image.height = h;
					
					//this.image.style.zIndex = 242;
					//this.image.style.position = "absolute";
					//document.body.appendChild(this.image);

					this.image.addEventListener("canplay",(function() {                
					
						if(this.func) this.func();
					
					
						this.image.removeEventListener("canplay",arguments.callee,true);
						this.image.play();
					
						setInterval((function() { 
						
						
							this.ctx.drawImage(this.image,0,0,this.width,this.height);
						
						}).bind(this),(1000/this.fps)>>0);
					
						this.ctx.drawImage(this.image,0,0,this.width,this.height);
					
						this.isPlay = true;
					
										
					}).bind(this));
				
				
					this.image.src = url.createObjectURL(stream);
									
			}).bind(this),
			(function(err) {
				
				console.log(err);

				this.isSupported = false;
				
			}).bind(this)
		);
		
	}
	else {
		this.isSupported = false;
	}
}

window.Vdig.prototype.get = function() {
	return new Uint8Array(this.ctx.getImageData(0,0,this.width,this.height).data.buffer);
} 