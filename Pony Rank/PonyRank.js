var MLPdata = {};
var episodeNames = new Trie();
var dataSet = {};

var touchEvents = {};
dataSet._user_ = {};

// Loading data from Pony.json
	var req = new XMLHttpRequest();
	req.open("GET","Pony.json",true);
	req.send();
	req.onreadystatechange = function(e)
	{
		if(this.readyState == 4)
		{
			MLPdata = JSON.parse(req.response);

			for(episode in MLPdata)
			{
				episode = MLPdata[episode];
				//addListElement(episode.name);
				var redName = episode.name.toLowerCase();
				redName = redName.replace(/[^abcdefghijklmnopqrstuvwxyz1234567890 ]/g,"");
				words = redName.split(" ");
				words = words.sort();

				for(var i =1; i < words.length; i++)
				{
					if(words[i] == words[i-1])
					{
						words.splice(i,1);
						i--;
					}
				}

				for(var i =0; i < words.length; i++)
				{
					if(i ==0 || words[i] != words[i-1])
						episodeNames.add(words[i],episode.name);
				}
			}
		}
	}
//

//page management
//--------------------
//  changeTab(tab)
//  initializeRankTab()
//  toggleDiv()
//  addSubList(name,column)
//  addListElement(episode,after)
//  updateRankingsFromHTML()
//  saveToLocalStorage()
//  setAllignment()
//  putSortedListsInSorted()	
	function setAllignment()
	{
		if(window.innerHeight > 1.2*window.innerWidth)
		{
			document.body.className = "tablet";
		}
		else
		{
			document.body.className = "normal";
		}

		var picRatio = [1280,720];

		var HEAD_BLOCK = document.getElementById('header');
		var doubleList = document.getElementById('double-list-c');
		doubleList.style.height = 
			(window.innerHeight - HEAD_BLOCK.clientHeight - doubleList.previousElementSibling.clientHeight -30)+"px"; 
		//document.getElementById('double-list-c').style.top = HEADER_BOTTOM  + "px";

		var backgroundDiv = document.getElementById('background-div');
		backgroundDiv.style.height = '0px';
		var height = Math.max(window.innerHeight, document.body.scrollHeight);
		backgroundDiv.style.height = height + "px";
		backgroundDiv.style.width = innerWidth + "px";


		var background = document.getElementById('background-img');
		if(window.innerWidth / height < picRatio[0]/picRatio[1])
		{
			background.height = height;
			background.width = height * picRatio[0]/picRatio[1];
			background.style.left = (window.innerWidth - background.width)/2 + "px";
		}
		else{
			background.width = window.innerWidth;
			background.height = window.innerWidth * picRatio[1]/picRatio[0]
			background.style.left = "0px"; 
		}

		centerPopups();
	}

	function toggleDiv(div)
	{
		if(div.classList.contains('toggle-0'))
		{
			div.classList.remove('toggle-0');
			div.classList.add('toggle-1');

			var children = div.getElementsByTagName('div');
			for(var i=0; i<children.length; i++)
			{
				if(i%2)
					children[i].style.display = "block";
				else
					children[i].style.display = "none";
			}
		}
		else
		{
			div.classList.remove('toggle-1');
			div.classList.add('toggle-0');

			var children = div.getElementsByTagName('div');
			for(var i=0; i<children.length; i++)
			{
				if(i%2)
					children[i].style.display = "none";
				else
					children[i].style.display = "block";
			}
		}
	}
	
	function addListElement(episode,after)
	{
		if(after == undefined)
			after = "UNSORTED";
		var g = document.createElement("div")
		g.className = "episode-drag";
		g.innerHTML = episode;
		g.draggable = true;

		g.ondragstart = function(e)
		{
			//e.preventDefault();
			try{document.getElementById('dragee').id = "";}catch(e){}
			this.id = "dragee";

			e.dataTransfer.setData("text/plain", this.innerHTML);
			//console.log('drag start');
			
		}

		g.ondrag = g.ondragstart;

		g.addEventListener('touchstart',function(){
			//console.log('touchsart');
			
			touchEvents.startTime = new Date().getTime();
			this.ondragstart();
		})

		g.addEventListener('touchmove',function(ev)
		{
			if(new Date().getTime() - touchEvents.startTime  > 500)
			{
				touchEvents.dragItem = ev.target;
				ev.preventDefault();
				if(!touchEvents.drag)
				{
					touchEvents.drag = true;
					touchEvents.returnPosition = ev.target.nextElementSibling;
					touchEvents.returnPositionType = "before";
					if(!touchEvents.returnPosition)
					{
						touchEvents.returnPosition = ev.target.parentNode;
						touchEvents.returnPositionType = "parent";
					}

					//console.log(touchEvents.returnPosition);

					ev.target.parentNode.removeChild(ev.target);
					document.body.appendChild(ev.target);
				}
				
				ev.target.style.position = "absolute";

				ev.target.style.left = ev.changedTouches[0].clientX + "px";

				ev.target.style.top = ev.changedTouches[0].clientY + "px";

				touchEvents.x = ev.changedTouches[0].clientX;
				touchEvents.y = ev.changedTouches[0].clientY;
			}
			else
			{
				touchEvents.startTime = 10000000000000000000;
				touchEvents.drag = false;
			}
		})

		g.addEventListener('touchend',function(ev){
			if(touchEvents.drag)
			{
				ev.target.parentNode.removeChild(ev.target);

				var k = document.getElementsByClassName('episode-drag')
				

				if(ev.returnPositionType == "parent")
				{
					touchEvents.returnPosition.parentNode.appendChild(ev.target);
				}	
				else
				{
					//console.log(touchEvents.returnPosition.parentNode);
					touchEvents.returnPosition.parentNode.insertBefore(ev.target,touchEvents.returnPosition);
				}

				ev.target.style = "";
				touchEvents.drag = false;
			}
		})

		g.addEventListener("mousemove",function(e){
			if(touchEvents.drag)
			{
				touchEvents.target = this;
				//console.log(this);
			}
		})

		g.addEventListener("dragenter",function(e)
		{
			var x = document.getElementsByClassName('insert')
			if(x.length)
			{
				x[0].parentNode.removeChild(x[0]);
			}
			var insert = document.createElement('span');
			insert.className = 'insert';
			this.parentNode.insertBefore(insert,this);

			//console.log('drag enter');
		})
		g.ondragover = function(e)
		{
			e.preventDefault(); 
			//console.log('drag over');
		}
		g.ondrop = function(e)
		{
			e.preventDefault();
			var div = document.getElementById('dragee');
			div.parentNode.removeChild(div);
			var insert = document.getElementsByClassName('insert')[0];
			insert.parentNode.insertBefore(div,insert);
			insert.parentNode.removeChild(insert);

			updateRankingsFromHTML();
		}
		g.ondragend = function(e)
		{
			var insert = document.getElementsByClassName('insert')[0];
			if(insert != undefined)
				insert.parentNode.removeChild(insert);
		}
		
		if(after == "UNSORTED")
		{
			var lists = document.getElementById('unsorted').getElementsByClassName('sublist');
			lists[lists.length-1].appendChild(g);
		}
		if(after == "SORTED")
		{
			var lists = document.getElementById('sorted').getElementsByClassName('sublist');
			lists[lists.length-1].appendChild(g);
		}
	}

	function addSubList(name,column)
	{
		var div = document.createElement('div');
		div.className = 'sublist'
		var handle = document.createElement('div');
		handle.className = 'menu-block';

		handle.ondragenter = function(e)
		{
			var x = document.getElementsByClassName('insert')
			if(x.length)
			{
				x[0].parentNode.removeChild(x[0]);
			}
			var insert = document.createElement('div');
			insert.className = 'insert';
			this.parentNode.parentNode.insertBefore(insert,this.parentNode);
		}
		handle.ondragover = function(e)
		{
			e.preventDefault(); 
		}
		handle.ondrop = function(e)
		{
			e.preventDefault();
			var insert = document.getElementsByClassName('insert')[0];
			while(insert)
			{
				insert.parentNode.removeChild(insert);
				insert = document.getElementsByClassName('insert')[0];
			}
				
			var dragee = document.getElementById('dragee');
			var div = this.parentNode;
			while(!div.classList.contains('sublist'))
				div = div.parentNode;

			//console.log(div.previousElementSibling);

			if(div.previousElementSibling)
			{
				div = div.previousElementSibling;
				dragee.parentNode.removeChild(dragee);
				div.appendChild(dragee);
				var expand = div.getElementsByClassName('expand')[0]
				if(expand.innerHTML == '+')
					expand.onclick();

			}

			//var insert = document.getElementsByClassName('insert')[0];
			//insert.parentNode.insertBefore(div,insert);
			//insert.parentNode.removeChild(insert);

			updateRankingsFromHTML();

		}
		handle.ondragend = function(e)
		{
			var insert = document.getElementsByClassName('insert')[0];
			if(insert != undefined)
				insert.parentNode.removeChild(insert);
		}

		var txt = document.createElement('span')
		txt.innerHTML = name;
		handle.appendChild(txt)

		var buttons = document.createElement('span')
		buttons.style.position = "absolute";
		buttons.style.right = "0px";	
				
		buttons.style.paddingRight = "10px";	
		handle.appendChild(buttons)

		var expand = document.createElement('span')
		expand.innerHTML = "&#8722;";
		expand.className = 'expand';
		expand.style.cursor = "pointer";
		expand.onclick = function()
		{
			var g = this;
			while(!g.classList.contains('sublist'))
				g = g.parentNode;
			
			var episodes = g.getElementsByClassName('episode-drag');

			if(this.innerHTML == "+")
			{
				for(e in episodes)
					if(!isNaN(e))	
						episodes[e].style.display = "block";
				this.innerHTML = "&#8722;"
			}
			else
			{
				for(e in episodes)
					if(!isNaN(e))
						episodes[e].style.display = "none";
					
				this.innerHTML = "+"
			}
			
		}

		var remove = document.createElement('span')
		remove.innerHTML = "&#215;";
		remove.className = 'remove';
		remove.style.cursor = "pointer";
		remove.onclick = function()
		{
			var parent = this;
		
			while(!parent.classList.contains('sublist'))
			{
				parent = parent.parentNode;	
			}

			var l = parent.getElementsByClassName('episode-drag').length
			if(!parent.previousElementSibling && l)
				return;

			if(l ==0 || confirm("Are you sure you want to dissolve this list?"))
			{
				var eps = parent.getElementsByClassName('episode-drag')
				while(eps.length)
				{
					var e = eps[0];
					parent.removeChild(e);
					parent.previousElementSibling.appendChild(e);
					//console.log(parent.previousElementSibling);
				}
				parent.parentNode.removeChild(parent);	
			}

			updateRankingsFromHTML();

			
		}
		
		var modify = document.createElement('span')
		
		modify.innerHTML = "&#10000;";
		modify.className = 'modify';
		modify.style.cursor = "pointer";
		modify.onclick = function()
		{
			var k = this.parentNode;
			while(!k.classList.contains('sublist')) k = k.parentNode
			EditListBox(k);
		}

		var maximize = document.createElement('span')
		
		maximize.innerHTML = "&#128470;";
		maximize.className = 'maximize';
		maximize.style.cursor = "pointer";
		maximize.onclick = function()
		{
			var k = this.parentNode;
			while(!k.classList.contains('sublist')) k = k.parentNode;

			var j = document.getElementById('maximized');
			if(j) j.id = "";

			k.id = 'maximized';

			var rankedLists = document.getElementById('sorted').getElementsByClassName('sublist');
			var unsorted = document.getElementById('unsorted');
			while(rankedLists.length)
			{
				var l = rankedLists[0];
				l.parentNode.removeChild(l);
				unsorted.appendChild(l);
			}
			k.parentNode.removeChild(k);
			document.getElementById('sorted').appendChild(k);

			var expand = k.getElementsByClassName('expand')[0];
			if(expand.innerHTML == "+")
				expand.onclick();
		}	

		buttons.appendChild(expand);
		buttons.appendChild(maximize);
		buttons.appendChild(modify);
		buttons.appendChild(remove);

		div.appendChild(handle);

		if(column == "UNSORTED")
		{
			div.classList.add("unsorted");
			document.getElementById('unsorted').appendChild(div);
		}
			
		else if (column == "SORTED")
		{
			div.classList.add("sorted")
			document.getElementById('sorted').appendChild(div);
		}
	}

	function changeTab(tab)
	{
		function getId (text)
		{
			var k = text.indexOf('#')
			return text.substring(k+1);
		}

		var open = (tab.href?getId(tab.href):getId(tab));
		var links = document.getElementsByTagName('nav')[0].getElementsByTagName('a');
		for(var i =0; i < links.length; i++)
		{
			var text = getId(links[i].href);
			
			if(text == open)
				document.getElementById(open).style.display = "block";
			else
				document.getElementById(text).style.display = "none";
		} 

		mergeClose();
		setAllignment();
	}

	function initializeRankTab()
	{
		var sorted = document.getElementById('sorted');
		var unsorted = document.getElementById('unsorted');

		sorted.innerHTML = "";
		unsorted.innerHTML = "";

		var allEpisodesFound = [];

		for(var i = 0; i < dataSet._user_.lists.length; i++)
		{
			if(dataSet._user_.lists[i].type == 'sorted')
			{
				addSubList(dataSet._user_.lists[i].name,"SORTED");
				for(var j=0; j < dataSet._user_.lists[i].items.length; j++)
				{
					addListElement(dataSet._user_.lists[i].items[j],"SORTED")
					allEpisodesFound.push(dataSet._user_.lists[i].items[j])
				}
			}
			else
			{
				addSubList(dataSet._user_.lists[i].name,"UNSORTED");
				for(var j=0; j < dataSet._user_.lists[i].items.length; j++)
				{
					addListElement(dataSet._user_.lists[i].items[j],"UNSORTED")
					allEpisodesFound.push(dataSet._user_.lists[i].items[j]);
				}
			}
		}
		
		var seasonNo = 0;
		for(i in MLPdata)
		{
			if(allEpisodesFound.indexOf(MLPdata[i].name) == -1)
			{
				while(seasonNo < MLPdata[i].season)
				{
					seasonNo++;
					if(seasonNo == MLPdata[i].season)
						addSubList("Season " + seasonNo,"UNSORTED");
				}
				addListElement(MLPdata[i].name,"UNSORTED")
			}
		}
		/*document.getElementById('import').style.display = "none";
		document.getElementById('rank').style.display = "block";
		setAllignment();*/

		updateRankingsFromHTML();

		if(DOM('#sorted.sublist').length == 0)
			addSubList('Rankings',"SORTED");
	}

	function updateRankingsFromHTML()
	{
		
		dataSet._user_.ranked = [];
		dataSet._user_.lists = [];

		var k = document.getElementsByClassName('sublist');
		
		for(var i=0; i< k.length; i++)
		{
			var l = {};
			l.type = k[i].classList.contains('sorted')?"sorted":"unsorted";
			l.name = k[i].getElementsByClassName('menu-block')[0].getElementsByTagName('span')[0].innerHTML;

			l.items = [];

			var elements = k[i].getElementsByClassName('episode-drag');

			for(var j=0; j<elements.length; j++)
			{
				var txt = elements[j].innerHTML;
				txt= txt.replace("&amp;","&");
				l.items.push(txt);
			}

			if(l.type == "sorted" && l.items.length > dataSet._user_.ranked.length)
				dataSet._user_.ranked = l.items;

			if(l.items.length > 0)
				dataSet._user_.lists.push(l);
		}

		saveToLocalStorage();


		//console.log(dataSet._user_.ranked);
	}

	function saveToLocalStorage()
	{
		dataSet._user_ = dataSet._user_.name;
		localStorage.MLPPonyRank = JSON.stringify(dataSet);
		dataSet._user_ = dataSet[dataSet._user_];
	}

	function putSortedListsInSorted()
	{
		if(document.getElementById('maximized'))
			return;

		var sorted = document.getElementById('sorted');
		var sortedLists = sorted.getElementsByClassName('sublist');
		var unsorted = document.getElementById('unsorted');
		var unsortedLists = unsorted.getElementsByClassName('sublist');

		for(var i=0; i < sortedLists.length; i++)
		{
			if(sortedLists[i].classList.contains('unsorted'))
			{
				var e = sortedLists[i];
				e.parentNode.removeChild(e);
				unsorted.appendChild(e);
				i--;
			}
		}

		for(var i=0; i < unsortedLists.length; i++)
		{
			if(unsortedLists[i].classList.contains('sorted'))
			{
				var e = unsortedLists[i];
				e.parentNode.removeChild(e);
				sorted.appendChild(e);
				i--;
			}
		}
	}
//--------------------

//importing data
//--------------------
//  importStart()
//  importProcessOne()
//  suggestName()
//  createSet()

	function importStart()
	{	
		//console.log("import start");
		var inputE = document.getElementById('FILE:IMPORT');
		if(inputE.files[0] == undefined)
		{
			var text = document.getElementById('TEXT:IMPORT').value;
			text = text.split(/\r\n|\n|\r/);
			importProcessOne(text,0);	
		}
		else
		{
			var rd = new FileReader();
			rd.readAsText(inputE.files[0]);
			rd.onload = function(e)
			{
				var rankings = [];
				text = this.result.split(/\r\n|\n|\r/);
				
				importProcessOne(text,0);
				document.getElementById('FILE:IMPORT').value = "";
				fileReadyToRead(document.getElementById('FILE:IMPORT'));
			};
		}
	}
	function importProcessOne(list,position)
	{  
		if(position >= list.length)
		{
			//console.log('returning from importProcessOne');
			createSet(list);
			changeTab("#rank");
			return;
		}
		
		if(list[position].substring(0,1) == "#")
			return importProcessOne(list,position+1);
			
		var episode = list[position].trim();
		if(episode == "")
		{
			list.splice(position,1);
			importProcessOne(list,position);
			return;
		}

		var options = suggestName(episode);

		if(options.length == 0 || options.length > 1)
		{
			var popUp = document.createElement('div');
			popUp.className = "popup";

			var p1 = document.createElement('p');
			if(options.length>1)
				p1.innerHTML = "We found multiple episodes that \"" + episode + "\" might be. Please specify from the list below.";
			else
				p1.innerHTML = "We could not identify which episode \"" + episode + "\" was.";
			

			if(options.length>1)
			{
				var p2 = document.createElement('select');
				for(i in options)
				{
					var option = document.createElement('option');
					option.innerHTML = options[i];
					option.value = options[i];
					p2.appendChild(option);
				}

				var confirm = document.createElement('button')
				confirm.innerHTML = "Confirm";
				confirm.list = list;
				confirm.position = position;
				confirm.onclick = function()
				{
					var choice = this.parentNode.getElementsByTagName('select')[0].value;
					this.list[this.position] = choice;
					removePopups();
					importProcessOne(this.list,this.position);
					return;
				}

			}
			else
			{
				var p2 = document.createElement('p');
				p2.innerHTML = "What would you like to do?";
			}
				
			var ignore = document.createElement('button')
			ignore.innerHTML = "Skip this item";
			ignore.list = list;
			ignore.position = position;
			ignore.onclick = function(e){
				removePopups();
				this.list.splice(this.position,1);
				importProcessOne(this.list,this.position);
				return;
			}
			var identify = document.createElement('button');

			if(options.length > 1)
				identify.innerHTML = "Pick a differnt episode";
			else
				identify.innerHTML = "Identify this episode";
			identify.list = list;
			identify.position = position;
			identify.onclick = function(e)
			{
				removePopups();
				var popUp = document.createElement('div');
				popUp.className = "popup";
				var p1 = document.createElement('p');
				p1.innerHTML = "This episode (" +this.list[this.position] + ") is ";
				var select = document.createElement('select');
				for(i in MLPdata)
				{
					var option = document.createElement('option');
					option.innerHTML = MLPdata[i].name;
					option.value = MLPdata[i].name;
					select.appendChild(option);
				}

				var div = document.createElement('div');
				var confirm = document.createElement('button')
				confirm.innerHTML = "Confirm";
				confirm.list = this.list;
				confirm.position = this.position;
				confirm.onclick = function()
				{
					var choice = this.parentNode.parentNode.getElementsByTagName('select')[0].value;
					removePopups();
					this.list[this.position] = choice;
					importProcessOne(this.list,this.position+1);
					return;
				}
				var ignore = document.createElement('button')
				ignore.innerHTML = "Skip this item";
				ignore.list = this.list;
				ignore.rankings = this.rankings;
				ignore.onclick = function(e){
					removePopups();
					this.list.splice(this.position, 1);
					importProcessOne(this.list,this.position);
					return;
				}   

				div.appendChild(confirm);
				div.appendChild(ignore);

				popUp.appendChild(p1);
				popUp.appendChild(select);
				popUp.appendChild(div);
				document.body.appendChild(popUp);
				centerPopups();
			}   

			popUp.appendChild(p1);
			popUp.appendChild(p2);

			if(options.length > 1)
			{
				popUp.appendChild(confirm);
				popUp.appendChild(document.createElement('br'));
				popUp.appendChild(document.createElement('br'));
			}
			popUp.appendChild(identify);
			popUp.appendChild(ignore);
			document.body.appendChild(popUp);
			centerPopups();
			return;
		} 
		else
		{
			list[position] = options[0];
			importProcessOne(list,position+1);
			return;
		}
	}
	function suggestName(name)
	{
		var potential = [];

		name = name.toLowerCase();
		name = name.replace(/\t/g," ");
		name = name.replace(/[^abcdefghijklmnopqrstuvwxyz1234567890 ]/g,"");
		name = name.replace(/\t/g," ");
		words = name.split(" ");

		for(i in MLPdata)
		{
			if(MLPdata[i].name.toLowerCase() == name.toLowerCase().trim())
			{
				return [MLPdata[i].name]
			}
		}

		for(i in words)
		{
			var item = episodeNames.at(words[i]);
			if(item != undefined)
				potential = potential.concat(item);
		}

		potential = potential.sort();

		var max_mult = 1;
		var mult = 1;
		var i = 0;
		while(i < potential.length)
		{
			if(i > 0 && potential[i-1] == potential[i])
			{
				mult++;
				if(mult > max_mult)
					max_mult = mult;
			}
			else
			{
				mult = 1;
			}
			i++
		}
		var bestChoice = [];
		
		mult = 1;
		i = 0;
		while(i < potential.length)
		{
			if(i > 0 && potential[i-1] == potential[i])
				mult++;
			else
				mult = 1;
				if(mult == max_mult)
				bestChoice.push(potential[i]);
			i++
		}
		return bestChoice;
	}
	function createSet(lines)
	{
		//alert("made it");
		//console.log(lines);
		var stuff = {};
		stuff.lists = [{name: "Rankings", "type":"sorted", 'items':[]}];
		stuff.name = "untitled";
		stuff.timestamp = new Date();
		stuff.comments = "";
		stuff.ranked = [];

		for(var i=0; i< lines.length; i++)
		{
			if(lines[i][0] == "#")
			{
				var info = lines[i].substring(1).split(":");
				if(info[0].trim() == "timestamp")
					stuff.timestamp = new Date(Number(info[1]));
				if(info[0].trim() == "name")
					stuff.name = info[1].trim();
				if(info[0].trim() == "comments")
					stuff.comments = info[1].trim();
				if(info[0].trim() == "unsorted list")
					stuff.lists.push({name: info[1].trim(), "type":"unsorted", 'items':[]});
				if(info[0].trim() == "sorted list")
					stuff.lists.push({name: info[1].trim(), "type":"sorted", 'items':[]});
			}
			else
			{
				stuff.lists[stuff.lists.length-1].items.push(lines[i]);
			}
		} 

		for(var i=1; i < stuff.lists.length; i++)
		{
			console.log(stuff.lists[i].type);
			if(stuff.lists[i].type == "sorted")
			{
				if(stuff.lists[0].items.length == 0)
					stuff.lists.shift();
				break;
			}
		}	

		if(dataSet[stuff.name])
		{
			var num = 1;
			while(dataSet[stuff.name + num])
				num++;
			stuff.name = stuff.name + num;
		}
		
		dataSet[stuff.name] = stuff;
		dataSet._user_ = stuff;
		
		createSetTableEntry(stuff.name);

		DOM('#set_name').innerHTML = stuff.name;
		
		initializeRankTab();
		setAllignment();
	}

	function createSetTableEntry(setName)
	{
		var stuff = dataSet[setName];

		if(typeof stuff.timestamp == "string")
			stuff.timestamp = new Date(stuff.timestamp);

		DOM('#data_sets').innerHTML += "<tr><td class='SET-NAME'>"
			+ stuff.name+"</td><td class='SET-TIMESTAMP'>"
			+ shortDate(stuff.timestamp)
			+ "</td><td class='SET-COMMENTS'>" +stuff.comments +
			"</td><th><button onclick='ManageData.load(this);'>Load</button> "
			+"<button onclick='ManageData.export(this);'>Export</button> "
			+"<button onclick='ManageData.drop(this);'>Drop</button></th>";

		var rows = DOM('#data_sets tr');
		for(var j = 1; j < rows.length; j++)
		{
			DOM(rows[j],'.SET-NAME:0').ondblclick = clickEdit;
			DOM(rows[j],'.SET-COMMENTS:0').ondblclick = clickEdit;	
		}
	}

//--------------------

//sorting/mergeing functions
//--------------------
//  sortWizard.init()
//  sortWizard.bind(directive)
//  sortWizard.suspend()
//	merge()
// 	mergeClose()

	var sortWizard = {};
	sortWizard.bind = function(directive)
	{
		if(directive == "above")
			sortWizard.lower = sortWizard.median+1;
		else if (directive == "below")
			sortWizard.upper = sortWizard.median;
		else
		{
			sortWizard.lower = 0;
			sortWizard.upper = dataSet._user_.ranked.length;
			document.getElementById('cmp_subject').innerHTML = dataSet._user_.unranked[0];
		}

		if(sortWizard.upper == sortWizard.lower)
		{
			var subject = document.getElementById('unsorted').getElementsByClassName('episode-drag')[0];
			subject.parentNode.removeChild(subject);
			if(sortWizard.upper == dataSet._user_.ranked.length)
			{
				document.getElementById('sorted').appendChild(subject);
			}
			else
			{
				var next = document.getElementById('sorted').getElementsByClassName('episode-drag')[sortWizard.lower];
				document.getElementById('sorted').insertBefore(subject,next);
			}

			updateRankingsFromHTML();

			if(dataSet._user_.unranked.length > 0)
				sortWizard.bind();
			else
				sortWizard.suspend();
		}
		else
		{
			sortWizard.median = Math.floor((sortWizard.upper + sortWizard.lower)/2);
			document.getElementById('cmp_bound').innerHTML = dataSet._user_.ranked[sortWizard.median];
		}
	}
	sortWizard.init = function()
	{
		if(!sortWizard.active)
		{
			updateRankingsFromHTML();
			if(dataSet._user_.unranked.length == 0)
				return
			sortWizard.active = true;
			var div = document.getElementById('rank').getElementsByTagName('div')[0];
			toggleDiv(div);
			setAllignment();
			sortWizard.bind();
		}
	}

	sortWizard.suspend = function()
	{
		if(sortWizard.active)
		{
			sortWizard.active = false;
			var div = document.getElementById('rank').getElementsByTagName('div')[0];
			toggleDiv(div);
			setAllignment();
		}
	}

	function merge()
	{
		document.getElementById('unsorted').style.display = "none";
		document.getElementById('merge').style.display = "block";

		var max = document.getElementById('maximized');
		if(max) max.id = "";
		putSortedListsInSorted();

		var sp = document.getElementById('merge').getElementsByClassName('buttons')[0];
		sp.innerHTML = "";

		var button = document.getElementById('merge').getElementsByTagName('button')[0];
		button.innerHTML = "Begin Merge"
		button.onclick = function()
		{
			this.onclick = function(){ mergeClose()};
			this.innerHTML = "Stop merging";
			this.parentNode.getElementsByClassName('msg')[0].innerHTML = "Choose the best episode:"

			var inputs = this.parentNode.getElementsByTagName('input');
			while(inputs.length)
			{
				if(inputs[0].checked)
				{
					var k = inputs[0].previousElementSibling;
					k.style = "font-size: 10pt;";
					k = k.previousElementSibling;
					k.style.display = "inline";
					k = k.previousElementSibling;
					k.style.display = "inline";
				}
				else
				{
					var k = inputs[0];
					k.previousElementSibling.style.display = "none";
					k.nextSibling.parentNode.removeChild(k.nextSibling);
				}
				inputs[0].parentNode.removeChild(inputs[0]);
			}

		}

		var sortedLists = document.getElementById('sorted').getElementsByClassName('sublist');
	
		while(sortedLists.length)
		{
			var list = [];
			var eps = sortedLists[0].getElementsByClassName('episode-drag');
			while(eps.length)
			{
				list.push(eps[0].innerHTML);
				eps[0].parentNode.removeChild(eps[0]);
			}
			list.name = sortedLists[0].getElementsByClassName('menu-block')[0].getElementsByTagName('span')[0].innerHTML;
			sortedLists[0].parentNode.removeChild(sortedLists[0]);

			if(list.length == 0)
				continue;

			var button = document.createElement('button');
			button.setAttribute('name',list.name);
			button.innerHTML = list.shift();
			button.onclick = function()
			{
				addListElement(this.innerHTML,"SORTED");

				updateRankingsFromHTML();


				var l = JSON.parse(this.getAttribute('data'));
				if(l.length == 0)
				{
					this.parentNode.removeChild(this.nextElementSibling);
					this.parentNode.removeChild(this.nextElementSibling);
					this.parentNode.removeChild(this.nextElementSibling);
					this.parentNode.removeChild(this);
					return;
				}
				this.innerHTML = l.shift();
				this.setAttribute('data',JSON.stringify(l));

				
				
			}

			button.setAttribute('data',JSON.stringify(list));
			button.style = "display: none";
			
			sp.appendChild(button);

			var flood = document.createElement('button');
			flood.innerHTML = "&gt;";
			flood.onclick = function(){
				var button = this.previousElementSibling; 
				while(this.previousElementSibling == button)button.onclick();}
			flood.style.display = "none";
			
			sp.appendChild(flood);
			var label = document.createElement('label');
			label.innerHTML = button.getAttribute('name');
			label.style = "font-weight: bold; font-size: .7em; user-select: none;";
			label.setAttribute('for', "tmp-checkbox" + sortedLists.length);
			sp.appendChild(label);

			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.id = "tmp-checkbox" + sortedLists.length;
			sp.appendChild(checkbox);
			sp.appendChild(document.createElement('br'));
		}

		
		DOM('#merge.msg:0').innerHTML = "Choose which lists to merge";

		addSubList("Merge","SORTED");
		document.getElementById('sorted').getElementsByClassName('sublist')[0].id = 'maximized';
	}

	function mergeClose()
	{
		var buttons = document.getElementById('merge').getElementsByTagName('button');

		for(var i=0;i < buttons.length; i++)
		{
			var b = buttons[i];
			if(!b.hasAttribute('data'))
				continue;
			
			var l = JSON.parse(b.getAttribute('data'));
			l.unshift(b.innerHTML);

			addSubList(b.getAttribute('name'),"SORTED");
			while(l.length)
			{
				addListElement(l.shift(),"SORTED");
			}

			b.parentNode.removeChild(b);
			i--;
		}

		document.getElementById('merge').getElementsByTagName('span')[0].innerHTML = "";
		document.getElementById('merge').style.display = "none";
		document.getElementById('unsorted').style.display = "block";

		var max = document.getElementById('maximized');
		if(max) max.id = "";
		putSortedListsInSorted();
	}

	function compareTwoRankings()
	{
		var box = document.createElement('div');
		box.className = "popup";

		var txt = document.createElement('span');
		txt.innerHTML = "Please select two rankings to compare:";
		box.appendChild(txt);

		var sel = document.createElement('select');
		for(i in dataSet)
		{
			if(i !="_user_")
			{
				var opt = document.createElement('option');
				opt.innerHTML = i;
				opt.value = i;
				sel.appendChild(opt);
			}
		}
		var sel2 = sel.cloneNode(true);
		box.appendChild(document.createElement('br'));
		box.appendChild(document.createElement('br'));
		box.appendChild(sel);
		box.appendChild(document.createElement('br'));
		box.appendChild(sel2);
		box.appendChild(document.createElement('br'));
		box.appendChild(document.createElement('br'));

		var button = document.createElement('button');
		button.innerHTML = "Compare";

		button.onclick = function()
		{
			var parent = this.parentNode;
			var l1 = dataSet[parent.getElementsByTagName('select')[0].value];
			var l2 = dataSet[parent.getElementsByTagName('select')[1].value];

			var name1 = l1.name;
			var name2 = l2.name;

			var l1 = l1.ranked.slice();
			var l2 = l2.ranked.slice();

			var inSet = {};

			for(i in l1)
				inSet[l1[i]] = 1;

			for(var i =0; i <l2.length; i++)
			{
				if(inSet[l2[i]])
					inSet[l2[i]]++;
				else
				{
					l2.splice(i,1);
					i--;
				}
			}

			for(var i =0; i <l1.length; i++)
			{
				if(inSet[l1[i]] == 1)
				{
					l1.splice(i,1);
					i--;
				}
			}

			var rank1 = {};
			for(var i =0; i <l1.length; i++)
			{
				rank1[l1[i]] = i;
			}
			for(var i =0; i <l2.length; i++)
			{
				l2[i] = rank1[l2[i]];
			}

			var totalSwaps = 0;
			function countSwaps(l)
			{
				if(l.length <= 1)
					return l;
				if(l.length > 1)
				
				var lower = l.splice(0,Math.floor(l.length/2))
				var upper = l;

				lower = countSwaps(lower);
				upper = countSwaps(upper);
						
				var penalty = lower.length;
				var merged = [];
				

				while(upper.length && lower.length)
				{
					///console.log('something');
					if(lower[0] <= upper[0])
					{
						merged.push(lower.shift());
						penalty--;
					}
					else
					{
						merged.push(upper.shift());
						totalSwaps+= penalty;
					}
					//console.log(merged);
				}
				while(upper.length)
				{
					merged.push(upper.shift())
					totalSwaps+= penalty;
				}
				while(lower.length)
				{
					merged.push(lower.shift())
				}
				return merged;
			}

			countSwaps(l2);

			var parent = this.parentNode;
			parent.removeChild(this);

			var tots = (l1.length*l1.length+l1.length)/2;

			var percent = totalSwaps/tots;

			percent = Math.floor(percent*1000);
			percent /= 10;
			parent.innerHTML = "<div>Rankings " + name1 + " and " + name2 + " differ by " + totalSwaps + "/" + tots + " (" + percent + "%) comparisons</div><br>";
			//console.log(l2.length);

			parent.style.maxWidth = "50%";

			parent.appendChild(this);
			this.innerHTML = "Close";
			this.onclick = function()
			{
				removePopups();
			}

			centerPopups();

		}
		box.appendChild(button);
		document.body.appendChild(box);
		centerPopups();
	}
//--------------------

function analyze()
{
	var mode = "linear";
	if (document.getElementById('fib').checked)
		mode = "fibonacci";
	if (document.getElementById('quad').checked)
		mode = "quadratic";
	var weights = {};
	var totalWeight = "0";
	var totalCount = "0";

	var l = dataSet._user_.ranked.length;
	for(var i=0; i < l; i++)
	{
		if(mode=="fibonacci")
		{
			//var w =  IntStr.sub(Fib(""+(l-1)),Fib("" + (l-1-i)));
			var w = Fib("" + (l-1-i));
			weights[dataSet._user_.ranked[i]] = w;
			totalWeight = IntStr.add (totalWeight,w);
		}
		else if(mode =="quadratic")
		{
			var mid = Math.floor(l/2)
			var w = "" + Math.abs(mid-i)*(mid-i)
			var k = '' + (mid-i)*(mid-i)
			weights[dataSet._user_.ranked[i]] = w
			totalWeight = IntStr.add(totalWeight,k)

			/*var w = ""+(l-i);
			w = IntStr.div(IntStr.add(IntStr.mult(w,w),w),"2");
			weights[dataSet._user_.ranked[i]] = w;
			totalWeight = IntStr.add(totalWeight,w);*/
		}
		else
		{
			weights[dataSet._user_.ranked[i]] =  "" + (l-i);
			totalWeight = IntStr.add (totalWeight,"" + (l-i))
		}
		totalCount = IntStr.inc(totalCount);
	}


	function Fib(n)
	{
		var init = "1";
		var next = "2";
		while(n > 0)
		{
			n--;
			var g = IntStr.add(init, next);
			init = next;
			next = g;
		}
		return init;
	}

	function Defib(n)
	{
		var index = "0";

		while(IntStr.cmp(Fib(IntStr.inc(index)), n) <= 0)
		{
			index = IntStr.inc(index);
		}

		var upper = Fib(IntStr.inc(index));
		var lower = Fib(index);
		var frac = IntStr.div_d(IntStr.sub(n,lower),IntStr.sub(upper,lower),3);
		return index + frac;
	}

	function propertyWeights(property)
	{
		var propertyWeights = {};
		var propertyCount = {};

		for(var i=0; i < MLPdata.length; i++)
		{
			if(weights[MLPdata[i].name] != undefined)
			{
				if(typeof MLPdata[i][property] == "object")
				{

					for(var j=0; j < MLPdata[i][property].length; j++)
					{
						if(propertyWeights[MLPdata[i][property][j]] == undefined)
						{
							propertyWeights[MLPdata[i][property][j]] = "0";
							propertyCount[MLPdata[i][property][j]] = "0";
						}
						propertyWeights[MLPdata[i][property][j]] =
							IntStr.add(propertyWeights[MLPdata[i][property][j]], weights[MLPdata[i].name]);
						propertyCount[MLPdata[i][property][j]] = IntStr.inc(propertyCount[MLPdata[i][property][j]]);
					}
				}
				else
				{
					if(propertyWeights[MLPdata[i][property]] == undefined)
					{
						propertyWeights[MLPdata[i][property]] = "0";
						propertyCount[MLPdata[i][property]] = "0";
					}
					propertyWeights[MLPdata[i][property]] =
						IntStr.add(propertyWeights[MLPdata[i][property]], weights[MLPdata[i].name]);
					propertyCount[MLPdata[i][property]] = IntStr.inc(propertyCount[MLPdata[i][property]]);
				}
			}
		}

		var g = IntStr.dec(totalCount)
		var normal = IntStr.div(IntStr.add(IntStr.mult(g, g),g),"2");
		var average = []
		for( i in propertyWeights)
		{
			//console.log(propertyWeights[i]);
			//console.log(propertyCount[i]);
			average.push([i,Number(
				IntStr.div_d(
					IntStr.mult(propertyWeights[i],normal),
					IntStr.mult(propertyCount[i],totalWeight),3)
				)]);	
		}

		average.sort(function(a,b){if (a[1] < b[1]) return 1; else if (a[1] > b[1]) return -1; else return 0;});
		return average;
	}

	var seasons = propertyWeights("season");
	var txt = "";
	while(seasons.length)
	{
		var i = seasons.shift();
		txt += "<tr><td>Season " + i[0] + "</td><td>" + i[1] + "</td></tr>";
	}
	document.getElementById("analysis:season").innerHTML = txt;

	var writers = propertyWeights("writer");
	var txt = "";
	while(writers.length)
	{
		var i = writers.shift();
		txt += "<tr><td>"+ i[0] + "</td><td>" + i[1] + "</td></tr>";
	}
	document.getElementById("analysis:writer").innerHTML = txt;

	var ponies = propertyWeights("focus");
	var txt = "";
	while(ponies.length)
	{
		var i = ponies.shift();
		txt += "<tr><td>"+ i[0] + "</td><td>" + i[1] + "</td></tr>";
	}
	document.getElementById("analysis:pony").innerHTML = txt;
	
}

function splitBySeason()
{
	var lists = [];
	
	document.getElementById('sorted').innerHTML = "";

	var seasonTable = {};

	for(i in MLPdata)
	{
		seasonTable[MLPdata[i].name] = MLPdata[i].season;
	}

	for(var i=0; i< dataSet._user_.ranked.length; i++)
	{
		var season = seasonTable[dataSet._user_.ranked[i]];
		if(lists[season] == undefined)
			lists[season] = [];
		lists[season].push(dataSet._user_.ranked[i]);
	}

	for(l in lists)
	{
		addSubList("Season " +l, "SORTED");
		for(i in lists[l])
		{
			addListElement(lists[l][i],"SORTED");
		}
	}
}

//manage data buttons
//--------------------
//	ManageData.load()
//	ManageData.drop()
//	ManageData.export()
	var ManageData = {};
	ManageData.load = function(button)
	{
		var tr = button.parentNode.parentNode;
		var name = tr.getElementsByTagName('td')[0].innerHTML;
		dataSet._user_ = dataSet[name];
		document.getElementById('set_name').innerHTML = name;
		initializeRankTab();
		changeTab('#rank');
	}
	ManageData.drop = function(button)
	{
		var tr = button.parentNode.parentNode;
		var name = tr.getElementsByTagName('td')[0].innerHTML;
		delete dataSet[name];
		tr.parentNode.removeChild(tr);

		var index = "";
		for(i in dataSet)
			if(i!="_user_") index = i;
		if(index == "")
		{
			createSet(["# name: default_new"]);
		}
		else   
		{
			dataSet._user_ = dataSet[index];
			initializeRankTab();
			document.getElementById('set_name').innerHTML = index;
		}
	}
	ManageData.export = function(button)
	{
		var tr = button.parentNode.parentNode;
		var name = tr.getElementsByTagName('td')[0].innerHTML;
		var timestamp = new Date().getTime();
		var comment = tr.getElementsByTagName('td')[2].innerHTML;

		var txt = "# MLP episode rank file\r\n";
		txt += "# name: " + name + "\r\n";
		txt += "# timestamp: " + timestamp + "\r\n";
		if(comment.trim() != "")
			txt += "# comments: " + comment + "\r\n";

		for(var i =0; i < dataSet[name].lists.length; i++)
		{
			txt += "# " + dataSet[name].lists[i].type + " list: " + dataSet[name].lists[i].name + "\r\n";
			for(var j =0; j < dataSet[name].lists[i].items.length; j++)
				txt += dataSet[name].lists[i].items[j] + "\r\n";
		}

		var blob = new Blob(["\uFEFF",txt],{type: "octet/stream"});
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = name+".txt";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
//--------------------


//popups helper functions
//--------------------
//  centerPopups()
//  removePopups()
	function centerPopups()
	{
		var popups =  document.getElementsByClassName('popup');
		for(var i=0; i<popups.length; i++)
		{
			popups[i].style.left = (window.innerWidth-popups[i].clientWidth)/2 + "px";
			popups[i].style.top = (window.innerHeight-popups[i].clientHeight)/2 + "px";
		}
	}

	function removePopups()
	{
		var popups =  document.getElementsByClassName('popup');
		while(popups.length > 0)
		{
			popups[0].parentNode.removeChild(popups[0]);
		}
	}

	function EditListBox(listElement)
	{
		var box = document.createElement('div');
		box.className = "popup";

		var label = document.createElement('label')
		label.innerHTML = "List name: ";
		box.appendChild(label);

		var input = document.createElement('input')
		input.value = listElement.getElementsByTagName('span')[0].innerHTML;
		input.oninput = function(e)
		{
			this.value = this.value.replace(/[^a-zA-Z1-9 _]/g,"")
		}
		box.appendChild(input);
		box.appendChild(document.createElement('br'));
		box.appendChild(document.createElement('br'));

		var label = document.createElement('label')
		label.innerHTML = "Ranked";
		label.setAttribute('for', 'popup-radio1');
		box.appendChild(label);

		var input = document.createElement('input')
		if(listElement.classList.contains('sorted')) input.checked = true;
		input.id = 'popup-radio1';
		input.name = 'popup-radio';
		input.type = "radio";
		box.appendChild(input);

		var label = document.createElement('label')
		label.innerHTML = "Not ranked";
		label.setAttribute('for', 'popup-radio2');
		box.appendChild(label);

		var input = document.createElement('input')
		input.id = 'popup-radio2';
		if(!listElement.classList.contains('sorted')) input.checked = true;
		input.name = 'popup-radio';
		input.type = "radio";
		box.appendChild(input);

		box.appendChild(document.createElement('br'));
		box.appendChild(document.createElement('br'));

		var button = document.createElement('button')
		button.innerHTML = "Close";
		button.onclick = function()
		{
			var box = this.parentNode;
			var target = document.getElementById('modify target');
			if(!target)
				target = document.getElementById('maximized');
			else
				target.id='';
			if(document.getElementById('popup-radio1').checked)
			{
				target.classList.add('sorted');
				target.classList.remove('unsorted');
				
			}
			else if (document.getElementById('popup-radio2').checked)
			{
				target.classList.add('unsorted');
				target.classList.remove('sorted');			
			}

			putSortedListsInSorted();
			target.getElementsByTagName('span')[0].innerHTML = box.getElementsByTagName('input')[0].value;
			box.parentNode.removeChild(box);

			updateRankingsFromHTML();
		}
		box.appendChild(button);

		if(listElement.id != 'maximized')
			listElement.id = 'modify target'; 
		document.body.appendChild(box);
		centerPopups();
	}

//--------------------

//misc
	function shortDate(ts)
	{
		return ts.getFullYear() + "-" + (ts.getMonth()+1) + "-" + ts.getDate();
	}

	function buttonSublist()
	{
		var name = prompt("Sublist name");
		if(name && name.trim() != "")
		{
			addSubList(name,"SORTED");
		}
	}

	function clickEdit()
	{
		if(DOM(this,"input").length)
			return;

		var box = document.createElement('input');
		box.type = "text";
		box.value = this.innerHTML;
		box.style.width = this.clientWidth + "px";
		this.setAttribute('oldname', this.innerHTML); 
		this.innerHTML = "";
		this.appendChild(box);

		box.onblur = function()
		{
			if(this.parentNode.className == "SET-NAME")
			{
				var tryName = this.value.replace(/[^-A-Za-z1-90_]/g,"").trim();
				if(tryName != "" && dataSet[this.value] == undefined)
				{
					var oldname = this.parentNode.getAttribute('oldname');
					this.parentNode.innerHTML = tryName;
					dataSet[tryName] = dataSet[oldname];
					if(document.getElementById("set_name").innerHTML == oldname)
						document.getElementById("set_name").innerHTML = tryName;
					delete dataSet[oldname];
				}
				else
					this.parentNode.innerHTML = this.parentNode.getAttribute('oldname');
			}
			else
				this.parentNode.innerHTML = this.value;
			
		}

		box.onkeydown = function(e){if(e.keyCode == 13)this.onblur()}

		box.focus();
	}

	function DOM(root,query)
	{
		if(query == undefined)
		{
			query = root;
			root = document;
		}

		var k = 1;
		while(k < query.length && " .#".indexOf(query[k]) == -1)
			k++;
		
		var rem = query.substring(k)
		query = query.substring(0,k);

		var collection;
		if(query[0] ==  "#")
		{
			collection = root.getElementById(query.substring(1));
		}
		else
		{
			var index = "none";
			if(query.indexOf(':') != -1)
			{
				query = query.split(":")
				index = query[1]
				query = query[0]
			}
			
			if(query[0] == ".")
				collection = root.getElementsByClassName(query.substring(1));
			else if(query[0] == " ")
				collection = root.getElementsByTagName(query.substring(1));
			else
				collection = root.getElementsByTagName(query);
			
			if(index != "none")
			{
				if(index == "l")
					collection = collection[collection.length -1]
				else
					collection = collection[Number(index)]
			}
		}

		if(rem == "")
			return collection;
		
		return DOM(collection,rem);
		
	}


/*what needs to be done

 help menus / instructions
mobile drag + drop.

*/