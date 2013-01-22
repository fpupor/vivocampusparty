var joystick = function(){
	var tempScreenPositionX;
	var tempDragPositionX;
	var tempScreenPositionY;
	var tempDragPositionY;
	var pressed = 0; //boolean
	var stickLength = 10;	
	var box = [0,0,0,0]; //upper left corner coords and lower right coords in which the box joystick can be used
	var raioScreen = 25;
	var raioDrag = 15;
	var pontoMorto = 10;
	var dragToScreen = 35;
	var value = null;
	var grd = null;
	var grd2 = null;
	
	var passo = 45;
	var meioPasso = 22.5;

	return{
		setBox: function(pX1,pY1,pX2,pY2){
			box = [pX1,pY1,pX2,pY2];
		},
		getValue: function(){
			return value;
		},
		getVars: function(){
			return {
				box: box,
				raioScreen: raioScreen, 
				raioDrag: raioDrag,
				tempScreenPositionX: tempScreenPositionX,
				tempScreenPositionY: tempScreenPositionY,
				tempDragPositionX: tempDragPositionX,
				tempDragPositionY: tempDragPositionY,
				grd: grd,
				grd2: grd2
			};
		},
		init: function(context){
			var x = box[2] / 2;
			var y = box[3] / 2;
			
			raioScreen = (Math.max(box[2],box[3]) / 100) * raioScreen;
			raioDrag = (Math.max(box[2],box[3]) / 100) * raioDrag;
			
			pontoMorto = (raioScreen / 100) * pontoMorto;
			dragToScreen = (raioScreen / 100) * dragToScreen;
			
			tempScreenPositionX = tempDragPositionX = x;
			tempScreenPositionY = tempDragPositionY = y;
			
			grd = context.createRadialGradient(tempScreenPositionX - raioScreen, tempScreenPositionY - raioScreen, raioScreen, tempScreenPositionX + raioScreen, tempScreenPositionY+raioScreen, raioScreen);
			grd.addColorStop(0, "#fb8700"); // light blue
			grd.addColorStop(1, "#feb100"); // dark blue 
			
			grd2 = context.createRadialGradient(tempScreenPositionX - raioScreen, tempScreenPositionY-raioScreen, raioScreen, tempScreenPositionX+raioDrag, tempScreenPositionY+raioDrag, raioScreen);				
			grd2.addColorStop(0, "#670099"); // light red
			grd2.addColorStop(1, "#9e52c5"); // dark red 		
			
			this.draw(context);
		},
		press: function(x,y){
			if(x>box[0] && x<box[2]){
				if(y>box[1] && y<box[3]){
					pressed = 1;
				}
			}
		},
		unpress: function(){
			pressed = 0;
			value = null;
			tempDragPositionX = tempScreenPositionX;
			tempDragPositionY = tempScreenPositionY;
		 },
		updatePosition: function(x,y){
			if(pressed == 1){
				var raioX = x - tempScreenPositionX;
				var raioY = y - tempScreenPositionY;
				var raio = Math.pow(raioX, 2) + Math.pow(raioY, 2);
				var raiz = Math.sqrt(raio);
				
				var angle = Math.atan2(raioY, raioX);
				var graus = (angle * 180 / Math.PI) + 180;
				
				if (raiz > pontoMorto)
				{
					for(var i = 0; i < 8; i++)
					{
						value = i;
						
						var passoBaixo 	= passo * i - meioPasso;
						var passoAlto 	= passo * i + meioPasso;
						
						if(passoBaixo < 0)
						{
							passoBaixo = 360 - meioPasso; 
							if ( (graus >= passoBaixo && graus <= 360) || (graus >= 0 && graus < passoAlto))
							{
								break;
							}
						}
						else if ( graus >= (passoBaixo) && graus < (passoAlto))
						{
							break;
						}
						
					}
				} else {
					value = null;
				}
				
				if (raiz > dragToScreen) 
				{
					raiz = dragToScreen;
					tempDragPositionX = (tempScreenPositionX + Math.cos(angle) * raiz);
					tempDragPositionY = (tempScreenPositionY + Math.sin(angle) * raiz);
				} else {
					tempDragPositionX = x;
					tempDragPositionY = y;
				}
				
			}
		},
		draw: function(context){
		
				context.fillStyle = grd;				
				context.strokeStyle = "#333333";
				context.lineWidth = 7;
				context.beginPath();
				context.arc(tempScreenPositionX, tempScreenPositionY, raioScreen, Math.PI*2, 0, true);
				context.closePath();
				context.fill();
				context.stroke();
				
				//actual joystick
				context.fillStyle = grd2;				
				context.beginPath();
				//draw arc: arc(x, y, radius, startAngle, endAngle, anticlockwise)
				context.arc(tempDragPositionX, tempDragPositionY, raioDrag, Math.PI*2, 0, true);
				//end drawing
				context.closePath()
				//fill it so you could see it
				context.fill();
		}
	}
};