var joystick = 
{
	FPS:30,
	stageX:0,
	stageY:0,
	init:function()
	{
		this.base = document.createElement ("div");
		this.base.id = "joystickBase";
		document.body.appendChild (this.base);
		
		this.ball.init();
		this.base.appendChild (this.ball.div);
		
		document.body.ontouchmove = function(e){
			joystick.stageX = e.pageX;
			joystick.stageY = e.pageY;
		}
		
		var scope = this;
		setInterval (function(){
			scope.update();
		}, 1000/this.FPS);
	},
	
	update:function()
	{
		this.ball.update();
	},
	
	ball:
	{
		init:function()
		{
			this.RADIUS_DRAG = 100;
			this.LOCK_RADIAN = 45 * Math.PI / 180;
			this.LOCK_RADIAN_HALF = this.LOCK_RADIAN/2;
			this.MIN_RADIUS_REQ = 20;
			this.currentDirection = "";
			this.directions = ["r", "dr", "d", "dl", "l", "ul", "u", "ur"];
			this.x = this.xInit = 121;
			this.y = this.yInit = 107;
			this.dragOffsetX = 0;
			this.dragOffsetY = 0;
			this.div = document.createElement ("div");
			this.div.id = "joystickBall";
			this.dragging = false;
			var scope = this;
			this.div.ontouchstart = function()
			{
				scope.dragOffsetX = joystick.stageX - scope.x;
				scope.dragOffsetY = joystick.stageY - scope.y;
				scope.dragging = true;
			}
			document.body.ontouchend = function()
			{
				scope.dragging = false;
				request.send (null);
			}
			
			request.send ("s");
		},
		update:function()
		{
			var xEnd;
			var yEnd;
			if (this.dragging)
			{
				var dx = joystick.stageX - this.xInit - this.dragOffsetX;
				var dy = joystick.stageY - this.yInit - this.dragOffsetY;
				var d = Math.sqrt (dx * dx + dy * dy);
				this.currentRadius = d < this.RADIUS_DRAG ? d : this.RADIUS_DRAG
				var angle = Math.atan2 (dy, dx);
				
				xEnd = this.xInit + Math.cos (angle) * this.currentRadius;
				yEnd = this.yInit + Math.sin (angle) * this.currentRadius;
			}
			else
			{
				xEnd = this.x + (this.xInit - this.x) * 0.5;
				yEnd = this.y + (this.yInit - this.y) * 0.5;
			}
			
			this.x = xEnd;
			this.y = yEnd;
			
			
			
			var quadrant = Math.floor((angle + this.LOCK_RADIAN_HALF) / this.LOCK_RADIAN);
			if (quadrant < 0) quadrant += this.directions.length;
			this.currentDirection = this.directions[quadrant];
			
			//log ("currentDirection: " + this.currentDirection);
			if (this.currentRadius > this.MIN_RADIUS_REQ)
			{
				//log (this, "SEND REQ");
				request.send (this.currentDirection);
			}
			else
			{
				request.send (null);
			}
			
			this.updateTransform();
		},
		updateTransform:function()
		{
			this.div.style.left = this.x + "px";
			this.div.style.top = this.y + "px";
			var transform = "translateZ(0)";
			this.div.style.transform = transform;
			this.div.style.WebkitTransform = transform;
			this.div.style.MozTransform = transform;
			this.div.style.OTransform = transform;
			this.div.style.msTransform = transform;
		}
	}
}

window.lastload = window.onload;
window.onload = function(){
	if (window.lastload) window.lastload();
	joystick.init();
}