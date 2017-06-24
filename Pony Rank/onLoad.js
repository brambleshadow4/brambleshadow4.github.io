DOM('#sorted').ondragenter = function(e)
{
    if(e.target == this)
    {
        var x = document.getElementsByClassName('insert')
        if(x.length)
        {
            x[0].parentNode.removeChild(x[0]);
        }
        var insert = document.createElement('span');
        insert.className = 'insert';
        this.appendChild(insert);
    }
}
DOM('#sorted').ondragover = function(e){e.preventDefault()}
DOM('#sorted').ondrop = function(e)
{
    if(e.target == this)
    {
        e.preventDefault();

		var insert = DOM('.insert:0');
        if(insert) insert.parentNode.removeChild(insert);

		var lists = this.getElementsByClassName('sublist');
        var div = lists[lists.length-1];

		console.log(div);
		if(!div) return;

		var dragee = document.getElementById('dragee');

        dragee.parentNode.removeChild(dragee);
        div.appendChild(dragee);
        
        updateRankingsFromHTML();

		if(div.getElementsByClassName('expand')[0].innerHTML =="+")
			div.getElementsByClassName('expand')[0].onclick();
    }  
}

DOM('#unsorted').ondragover = function(e){e.preventDefault()}
DOM('#unsorted').ondrop = DOM('#sorted').ondrop
DOM('#unsorted').ondragenter = DOM('#sorted').ondragenter

document.getElementsByTagName('select')[0].onchange = function(e)
{
	var value = this.value;
	this.value = this.getElementsByTagName('option')[0].value;

	if(value == "Put ranked lists in right pane")
	{
		var k = document.getElementById('maximized');
		if(k) k.id = "";
		putSortedListsInSorted();
	}
	if(value == "Minimize all lists")
	{
		var lists = document.getElementsByClassName('sublist');
		for(l in lists)
		{
			if(isNaN(l)) continue;

			if(lists[l].getElementsByClassName('expand')[0].innerHTML != "+")
				lists[l].getElementsByClassName('expand')[0].onclick();
		}
	}
	if(value == "Merge ranked lists")
	{
		merge();
	}
	if(value == "New ranked list")
	{
		var name = prompt("List name");
		if(!name) return;

		name = name.replace(/[^a-zA-Z1-9 _]/g,"");

		addSubList(name,"SORTED");

		var ranked = document.getElementById('sorted');
		var newList = ranked.getElementsByClassName('sublist');
		newList = newList[newList.length-1];

		newList.scrollIntoView();
	}
	if(value == "New unsorted list")
	{
		var name = prompt("List name");
		if(!name) return;

		name = name.replace(/[^a-zA-Z1-9 _]/g,"");

		addSubList(name,"UNSORTED");

		var ranked = document.getElementById('unsorted');
		var newList = ranked.getElementsByClassName('sublist');
		newList = newList[newList.length-1];

		newList.scrollIntoView();
	}

	
}

setAllignment();
window.onresize = setAllignment;


function completeLoad()
{
	if(!MLPdata)
	{
		setTimeout(completeLoad,100);
		return;
	}

	if(localStorage.MLPPonyRank)
	{
		dataSet = JSON.parse(localStorage.MLPPonyRank);
		dataSet._user_ = dataSet[dataSet._user_];
		for(i in dataSet)
		{
			if(i != "_user_")
				createSetTableEntry(i);
		}

		initializeRankTab();

	}	
	else
		createSet(["# name: default_new"]);
}
completeLoad();
