function Trie()
{
    this.stuff = [];
    this.branch = {};
    this.at = function(s)
    {
        if(s == "")
            return this.stuff
        else
        {
            var c1 = s.substring(0,1);
            s = s.substring(1);
            if(this.branch[c1] == undefined)
                return;
            return this.branch[c1].at(s);
        }
    }
    this.add = function(s,val)
    {
        if(s == "")
        {
            this.stuff.push(val);
        }
        else
        {
            var c1 = s.substring(0,1);
            s = s.substring(1);
            if(this.branch[c1] == undefined)
                this.branch[c1] = new Trie();
            
            this.branch[c1].add(s,val);
        }
    }
}