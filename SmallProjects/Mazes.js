var mazes = {};

mazes["Grid"] = function(i,j){
	return {"up": false, "down": false, "left": false, "right": false};
}

mazes["Open"] = function(i,j){
	return {"up": true, "down": true, "left": true, "right": true};
}
mazes["Spiral"] = function(i,j){
	if(i == 0 && j == 0){
		return {"up": false, "down": false, "left": false, "right": true};
	}
	else if(i > 0 && i == j){
		return {"up": false, "down": true, "left": true, "right": false};
	}
	else if(i < 0 && -i == j){
		return {"up": false, "down": true, "left": false, "right": true};
	}
	else if(i < 0 && i == j){
		return {"up": true, "down": false, "left": false, "right": true};
	}
	else if (i > 0 && i == -j +1){
		return {"up": true, "down": false, "left": true, "right": false};
	}
	else if(Math.abs(i) > Math.abs(j))
		return {"up": true, "down": true, "left": false, "right": false};
	else
		return {"up": false, "down": false, "left": true, "right": true};
};

mazes["Hash 1"] = function(x,y)
{	
	

	var f = this["Hash 1"];
	if((x+y)%2 == 0)
	{
		//s is a number in range 1..15
		var s = Math.floor(JHash(cellNum(x,y)/2)*15)+1;

		//s = s*s*912 + 391*s + 31;
		return {"up":(s>>0)%2==1, "down":(s>>1)%2==1, "left":(s>>2)%2==1, "right":(s>>3)%2==1};
	}
	else{
		return {"up": f(x,y+1).down, "down": f(x,y-1).up, "left": f(x-1,y).right, "right": f(x+1,y).left};
	}
}

mazes["Static Tile 5"] = function(x,y)
{
	function Cell5 (x,y){
		if(x==-2 && y==2) return {"up":false,"down":true,"left":false,"right":true};
		if(x==-1 && y==2) return {"up":false,"down":true,"left":true,"right":false};
		if(x==0 && y==2) return {"up":undefined,"down":true,"left":false,"right":true};
		if(x==1 && y==2) return {"up":false,"down":false,"left":true,"right":true};
		if(x==2 && y==2) return {"up":false,"down":true,"left":true,"right":false};

		if(x==-2 && y==1) return {"up":true,"down":true,"left":false,"right":false};
		if(x==-1 && y==1) return {"up":true,"down":false,"left":false,"right":true};
		if(x==0 && y==1) return {"up":true,"down":false,"left":true,"right":false};
		if(x==1 && y==1) return {"up":false,"down":true,"left":false,"right":true};
		if(x==2 && y==1) return {"up":true,"down":false,"left":true,"right":false};

		if(x==-2 && y==0) return {"up":true,"down":false,"left":undefined,"right":false};
		if(x==-1 && y==0) return {"up":false,"down":true,"left":false,"right":true};
		if(x==0 && y==0) return {"up":false,"down":true,"left":true,"right":false};
		if(x==1 && y==0) return {"up":true,"down":true,"left":false,"right":false};
		if(x==2 && y==0) return {"up":false,"down":true,"left":false,"right":undefined};

		if(x==-2 && y==-1) return {"up":false,"down":true,"left":false,"right":true};
		if(x==-1 && y==-1) return {"up":true,"down":false,"left":true,"right":false};
		if(x==0 && y==-1) return {"up":true,"down":false,"left":false,"right":true};
		if(x==1 && y==-1) return {"up":true,"down":true,"left":true,"right":false};
		if(x==2 && y==-1) return {"up":true,"down":true,"left":false,"right":false};

		if(x==-2 && y==-2) return {"up":true,"down":false,"left":false,"right":true};
		if(x==-1 && y==-2) return {"up":false,"down":false,"left":true,"right":true};
		if(x==0 && y==-2) return {"up":false,"down":undefined,"left":true,"right":false};
		if(x==1 && y==-2) return {"up":true,"down":false,"left":false,"right":true};
		if(x==2 && y==-2) return {"up":true,"down":false,"left":true,"right":false};
	}

	function TileCell(x,y)
	{
		var adjX, adjY;
		function adjust()
		{
			if(x > -2)
				adjX = ((x+2)%5)-2;
			else
				adjX =((x-2)%5)+2;

			if(y > -2)
				adjY = ((y+2)%5)-2;
			else
				adjY =((y-2)%5)+2;
		}
		adjust();

		//return Cell5(adjX,adjY);
		var cell = Cell5(adjX,adjY);
		
		while(cell.up == undefined)
		{
			x = Math.round(x/5);
			y = Math.round(y/5);
			adjust();
			cell.up = Cell5(adjX,adjY).up;
		}
		while(cell.down == undefined)
		{
			x = Math.round(x/5);
			y = Math.round(y/5);
			adjust();
			cell.down = Cell5(adjX,adjY).down;
		}
		while(cell.left == undefined)
		{
			x = Math.round(x/5);
			y = Math.round(y/5);
			adjust();
			cell.left = Cell5(adjX,adjY).left;
		}
		while(cell.right == undefined)
		{
			x = Math.round(x/5);
			y = Math.round(y/5);
			adjust();

		
			cell.right = Cell5(adjX,adjY).right;
		}

		return cell;
		
	}

	return TileCell(x,y);
	
}


var MazeDB = {};


mazes["Dynamic Tile 11"] = function(x,y)
{
	//maze[x][y].left 
	function GetMaze (tier,x,y)
	{
		if(MazeDB["m"+tier+":"+x+":"+y] == undefined)
		{
			//generate maze
			var size = 11;
			var seed = cellNum(x,y)*(tier+1);
			function nextRand()
			{	
				seed++;
				//return Math.random()
				return JHash(seed);
			}
			
			var tile = function(){
				this.up = false;
				this.down = false;
				this.left = false;
				this.right = false;

				this.rUp = false;
				this.rDown = false;
				this.rLeft = false;
				this.rRight = false;
				this.maze = "m"+tier+":"+x+":"+y;
			};
			
			var tiles = [];
			for (var i = 0; i < size; i++)
			{
				tiles[i] = [];
				for (var j = 0; j < size; j++)
				{
					tiles[i][j] = new tile();
					tiles[i][j].id = j+i*size;
				}
			}
			for (var i = 0; i < size; i++)
			{
				for (var j = 0; j < size; j++)
				{
					if(i != 0)
						tiles[i][j].rUp = tiles[i-1][j];
					if(j != 0)
						tiles[i][j].rLeft = tiles[i][j-1];
					if(i != size-1)
						tiles[i][j].rDown = tiles[i+1][j];
					if(j != size-1)
						tiles[i][j].rRight = tiles[i][j+1];
				}
			}

			var connected = [tiles[0][0]];
			//elements before k have zero unconnected tiles next to them.
			var k = 0;
			while(connected.length < size*size)
			{
				var expandee = connected[connected.length-1];

				var options = "";
				if(expandee.rUp && !expandee.rUp.up && !expandee.rUp.down
					&& !expandee.rUp.left && !expandee.rUp.right)
					options += "U";
				if(expandee.rDown && !expandee.rDown.up && !expandee.rDown.down
					&& !expandee.rDown.left && !expandee.rDown.right)
					options += "D";
				if(expandee.rLeft && !expandee.rLeft.up && !expandee.rLeft.down
					&& !expandee.rLeft.left && !expandee.rLeft.right)
					options += "L";
				if(expandee.rRight && !expandee.rRight.up && !expandee.rRight.down
					&& !expandee.rRight.left && !expandee.rRight.right)
					options += "R";

				if(options == "")
				{
					//swap to beginning and swap a random connected to the end
					//console.log(expandee.id);

					var randomIndex = Math.floor((connected.length-1-k)*nextRand())+k;

					connected[connected.length-1] = connected[randomIndex];
					connected[randomIndex] = connected[k];
					connected[k] = expandee;
					k++;

					
					//console.log(connected.slice(k));
				}
				else
				{
					//connenct to one of the available squares and push it to the next
					var option = options.charAt(Math.floor(options.length*nextRand()));4

					if(option == 'U')
					{
						expandee.up = true;
						expandee.rUp.down = true;
						connected.push(expandee.rUp);
						
					}
					else if(option == 'D')
					{
						expandee.down = true;
						expandee.rDown.up = true;
						connected.push(expandee.rDown);
						
					}
					else if(option == 'L')
					{
						expandee.left = true;
						expandee.rLeft.right = true;
						connected.push(expandee.rLeft);
						
					}
					else if(option == 'R')
					{
						expandee.right = true;
						expandee.rRight.left = true;
						connected.push(expandee.rRight);
						
					}
				}
			}

			var median = Math.floor(size/2);
			tiles[0][median].up = undefined;
			tiles[median][0].left = undefined;
			tiles[size-1][median].down = undefined;
			tiles[median][size-1].right = undefined;
			MazeDB["m"+tier+":"+x+":"+y] = tiles;

			//console.log(tiles);

		}

		return MazeDB["m"+tier+":"+x+":"+y];
	}

	var adjX, adjY;
	var tier = 0;
	function adjust()
	{
		if(x >= -5)
			adjX = (x+5)%11
		else
			adjX = (x-5)%11+10;

		if(y >= -5)
			adjY = 10-(y+5)%11;
		else
			adjY= -((y-5)%11);
	}
	adjust();

	x = Math.round(x/11);
	y = Math.round(y/11);
	
	var cell = GetMaze(tier,x,y)[adjY][adjX];
	
	while(cell.up == undefined)
	{
		tier++;
		adjust();
		x = Math.round(x/11);
		y = Math.round(y/11);
		
		cell.up = GetMaze(tier,x,y)[adjY][adjX].up;
	}
	while(cell.down == undefined)
	{
		tier++;
		adjust();
		x = Math.round(x/11);
		y = Math.round(y/11);

		cell.down = GetMaze(tier,x,y)[adjY][adjX].down;
	}
	while(cell.left == undefined)
	{
		tier++;
		adjust();
		x = Math.round(x/11);
		y = Math.round(y/11);

		cell.left = GetMaze(tier,x,y)[adjY][adjX].left;
	}
	while(cell.right == undefined)
	{
		tier++;
		adjust();
		x = Math.round(x/11);
		y = Math.round(y/11);
	
		cell.right = GetMaze(tier,x,y)[adjY][adjX].right;
	}

	return cell;
}

var SBMcache = {"size":0};
mazes["Square Border Method"] = function(x,y)
{
	
	function expandBox(side,x,y)
	{
		function mod(num1,num2)
		{
			var x = num1 % num2
			if(x < 0)
				return x + num2
			return x;
		}

		var bX = x; //bottom-left x coordinate of parent box
		var bY = y; //bottom-left y coordinate of parent box

		//checks various conditions to see if x,y is in the correct position
		var check  = {};
		check['left']   = function(){return (bX != x)};
		check['right']  = function(){return (bX+size-1 != x)};
		check['up']    = function(){return (bY+size-1 != y)};
		check['down'] = function(){return (bY != y)};

		var size = 1;
		var power = 1;
		var offset = 0;

		while(!check[side]())
		{
			power++;
			size *=2;

			if(power%2)
				offset -= size;
			else
				offset += size;

			bX -= mod(bX-offset,size);
			bY -= mod(bY-offset,size);
		}

		var slot; //slot is the # of line lengths to the center of the box in range 0..size/2-1
		//     0
		//     | 
		// 3 --+-- 1  line refers to which line length it's touching
		//     |
		//     2
		var line; 

		if(side=='up' || side=='down')
		{
			if(x-bX < size/2)
			{
				slot = bX + size/2-x-1;
				line = 3;
			}
			else
			{
				slot = x - bX -size/2;
				line = 1;
			}
		}
		else 
		{
			if(y-bY < size/2)
			{
				slot = bY + size/2-y-1;
				line = 2;
			}
			else
			{
				slot = y - bY -size/2;
				line = 0;
			}
		}
		
		return {"x":bX, "y":bY,"size":size,"line":line,"slot":slot};
	}

	function getBoundary(box)
	{
		var seed = cellNum(box.x,box.y)+box.size;
		function nextRand()
		{	
			seed++;
			//return Math.random()
			return JHash(seed);
		}

		var closedSide = Math.floor(nextRand()*4);

		if(box.line == closedSide)
			return false;

		var slot = Math.floor(box.size/2*nextRand())
		if(box.line == (closedSide+1)%4)
			return slot == box.slot;

		slot = Math.floor(box.size/2*nextRand())
		if(box.line == (closedSide+2)%4)
			return slot == box.slot;

		slot = Math.floor(box.size/2*nextRand())
		if(box.line == (closedSide+3)%4)
			return slot == box.slot;
	
	}

	if (SBMcache.size > 1000000)
		SBMcache = {"size":0};

	if(SBMcache[cellNum(x,y)] == undefined)
	{
		SBMcache[cellNum(x,y)] = 
			{"left":getBoundary(expandBox("left",x,y)),
			"right":getBoundary(expandBox("right",x,y)),
			"up":getBoundary(expandBox("up",x,y)),
			"down":getBoundary(expandBox("down",x,y))};
		SBMcache.size++;
	}

	return SBMcache[cellNum(x,y)];
}


//return a unique positive integer for cell i, j
function cellNum(x,y)
{
	if(Math.abs(y) >= Math.abs(x)){
		if(y > 0)
			return 4*y*y-y-x;
		else
			return 4*y*y-3*y+x
	}
	else{
		if(x > 0)
			return 4*x*x-3*x+y; //4x²-3x+y
		else
			return 4*x*x-1*x-y;
	}
}

//return a float in range [0,1)
function JHash(num)
{
	var seed = num;

	var primes = [11,7,41,3,43,5,31,37,17,29,23,47,19,13,2];
	var mode = 0;
	while(num != 0)
	{
		if(num%2)
			seed = primes[mode]*seed*seed + primes[mode+1]*seed + primes[mode+2];
		seed = seed % 1000000;

		mode += 3;
		if(mode == 15)
			mode = 0;

		num = Math.floor(num/2);
	}

	return (seed%10000)/10000;
}