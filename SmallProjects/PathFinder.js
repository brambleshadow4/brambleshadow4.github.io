self.addEventListener('message', function(e)
{
	importScripts("Mazes.js");

	var mazeName = e.data[0];

	var sx = Number(e.data[1]);
	var sy = Number(e.data[2]);
	var x  = Number(e.data[3]);
	var y  = Number(e.data[4]);

	var settled = [];
	var frontier = [];
	frontier.push({'x':sx,'y':sy,'px':sx,'py':sy});

	var foundGoal = false;

	while(!foundGoal && frontier.length)
	{
		var node = frontier.shift();
		settled[cellNum(node.x,node.y)] = node;

		if(node.x == x && node.y == y)
			foundGoal = true;

		var potentialNodes = [];
		var paths = mazes[mazeName](node.x,node.y)
		if(paths.up)
			potentialNodes.push({'x':node.x,'y':node.y+1,'px':node.x,'py':node.y});
		if(paths.down)
			potentialNodes.push({'x':node.x,'y':node.y-1,'px':node.x,'py':node.y});
		if(paths.left)
			potentialNodes.push({'x':node.x-1,'y':node.y,'px':node.x,'py':node.y});
		if(paths.right)
			potentialNodes.push({'x':node.x+1,'y':node.y,'px':node.x,'py':node.y});

		while(potentialNodes.length)
		{
			var otherNode = potentialNodes.shift();

			if(settled[cellNum(otherNode.x,otherNode.y)] == undefined)
			{
				settled[cellNum(otherNode.x,otherNode.y)] = true;
				frontier.push(otherNode);
			}
		}
	}

	if(foundGoal)
	{
		highlights = [];
		length = 0;
		while(x != sx || y != sy)
		{
			var index = cellNum(x,y)
			highlights[index] = true;

			x = settled[index].px;
			y = settled[index].py;
			length++;
		}
		postMessage({"highlights": highlights, "length":length});
		
	}
	else
	{
		postMessage({"highlights": false});
	}
})
