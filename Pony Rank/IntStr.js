IntStr = {};
IntStr.validate = function(s)
{
	if(/^0$|^-?[1-9][0-9]*$/.exec(s) == null)
		throw new Error( s + " is not a valid IntStr");
}

IntStr.neg = function(s)
{
	this.validate(s);
	if(s == "0") return s;
	else if(s.substring(0,1) == "-") return s.substring(1);
	else return "-"+s;
}
IntStr.abs = function(s)
{
	this.validate(s);
	if(s.substring(0,1) == "-") return s.substring(1);
	else return s;
}
IntStr.inc = function(s)
{
	this.validate(s);
	if(s.substring(0,1) == "-")
	{
		function decTail(s)
		{
			
			var tl = s.substring(s.length-1);
			var hd = s.substring(0,s.length-1);

			tl = "" + (Number(tl) - 1);
			if(tl == "0" && hd=="-")
				return hd;
			if(tl == "-1")
				return decTail(hd) + "9";
			return hd + tl;
		}
		if(s == "-0") return "1";
		if(s == "-1") return "0";
		return decTail(s);
	}
	else
	{
		function incTail(s)
		{
			if(s == "") s = "0";
			var tl = s.substring(s.length-1);
			var hd = s.substring(0,s.length-1);

			tl = "" + (Number(tl) + 1);
			if(tl == "10")
				return incTail(hd) + "0";
			else
				return hd + tl;
		}
		return incTail(s);
	}
}
IntStr.dec = function(s)
{
	this.validate(s);
	return IntStr.neg(IntStr.inc(IntStr.neg(s)));
}
IntStr.add = function(s,t)
{
	this.validate(s); this.validate(t);
	function addWithCarry(s,t,c)
	{
		if(s == "" && t == "" && c == 0)
			return "";
		var s1 = Number(s.charAt(s.length-1));
		var t1 = Number(t.charAt(t.length-1));
		var s = s.substring(0,s.length-1);
		var t = t.substring(0,t.length-1);

		var sum = "" + (s1+ t1 + c);

		if(sum.length == 2)
			return addWithCarry(s,t,1) + sum.charAt(1);
		return addWithCarry(s,t,0) + sum;
	}
	function subWithCarry(s,t,c)
	{
		var s1 = Number(s.charAt(s.length-1));
		var t1 = Number(t.charAt(t.length-1));
		var s = s.substring(0,s.length-1);
		var t = t.substring(0,t.length-1);

		var digitsRemaining = (s.replace('-','').length > 0 || t.replace('-','').length > 0)

		if(isNaN(s1)) s1 = 0;
		if(isNaN(t1)) t1 = 0;

		var sum = s1 - t1 + c;
		
		if(!digitsRemaining)
		{
			if(sum < 0)
				sum+= 10;
			var sign = "";
			if(s.charAt(0) == "-")
				sign = "-";
			return sign + sum;
		}	
		else if(sum < 0)
		{
			return subWithCarry(s,t,-1) +"" + (10 + sum);
		}
		else
		{
			return subWithCarry(s,t,0) + "" + sum;;
		}
			
		
	}
	var op  = (s.charAt(0) + t.charAt(0)).replace(/[0-9]|--/g,"");
	if (op == "")
	{
		var sign = "";
		if(s.charAt(0)== "-") sign = "-";
		return sign + addWithCarry(this.abs(s),this.abs(t),0);
	}
	else
	{
		var _a = (s.charAt(0)=="-"?"-":"")
		var _b = (t.charAt(0)=="-"?"-":"")
		var a = IntStr.abs(s);
		var b = IntStr.abs(t);

		var result;

		while(a.length == b.length)
		{
			if(a.length == 0)
				return "0";
				
			if(Number(a.charAt(0)) > Number(b.charAt(0)))
			{
				//console.log("Order: 1");
				result = subWithCarry(_a+a, _b+b,0); break;
			}
				
			if(Number(a.charAt(0)) < Number(b.charAt(0)))
			{
				//console.log("Order: 2");
				result =  subWithCarry(_b+b,_a+a,0); break;
			}	
			a = a.substring(1);
			b = b.substring(1);
		}
		if(a.length > b.length)
		{
			//console.log("Order: 1");
			result = subWithCarry(_a+a, _b+b,0);
		}	
		else if (a.length < b.length)
		{
			//console.log("Order: 2");
			result = subWithCarry(_b+b,_a+a,0);
		}

		return result.replace(/^(-)?0+/,"$1");
		//return result;
		
	}
}
IntStr.sub = function(a,b){return IntStr.add(a,IntStr.neg(b));}

IntStr.mult = function(a,b)
{
	this.validate(a); this.validate(b);
	function partialMult (a,b)
	{
		var ahd = Number(a.charAt(0));
		a = a.substring(1);
		var prod = "";
		if(ahd == "0" || ahd == "")
			prod = "0";
		else
		{
			var carry = "0";
			for (var i = b.length-1; i >= 0; i--)
			{
				var sum = "" + (ahd * Number(b.charAt(i)) + Number(carry));
				if(sum.length == 2)
				{
					prod = sum.charAt(1) + prod;
					carry = sum.charAt(0);
				}
				else
				{
					prod = sum + prod;
					carry = "0";
				}
			}
			if(carry != "0")
				prod = carry + prod;
		}
		
		if(a == "")
		{
			//console.log("partial sum: " + prod)
			return prod;
		}	
		else
		{
			if(prod != "0")
				for(var i=0; i < a.length; i++){prod+= "0"}
			//console.log("partial sum: " + prod)
			return IntStr.add(prod, partialMult(a,b));
		}
	}

	

	var sign  = (a.charAt(0) + b.charAt(0)).replace(/[0-9]|--/g,"");
	var j = partialMult(IntStr.abs(a),IntStr.abs(b));
	if(j == 0)
		return j;
	return sign + j;

}

IntStr.div = function(a,b)
{
	this.validate(a); this.validate(b);
	if(b == "0")
		throw new Error("Cannot divide by zero");

	function leftMost(a,b,place)
	{
		var ha = a.substring(0,a.length-place);
		var ta = a.substring(a.length-place);

		ha = ha.replace(/^0*/,"");
		if(ha == "") ha = "0";

		var lead = "1";
		var multB = b;

		while(IntStr.cmp(ha,multB) == 1)
		{
			lead = IntStr.inc(lead);
			multB = IntStr.add(b,multB);
		}
		if(IntStr.cmp(ha,multB) == -1)
		{
			multB = IntStr.sub(multB,b);
			lead = IntStr.dec(lead);
		}

		ha = IntStr.sub(ha,multB);

		if(place <= 0)
			return lead;
		else
			return lead + leftMost(ha+ta, b, place-1)
	}

	var sign  = (a.charAt(0) + b.charAt(0)).replace(/[0-9]|--/g,"");
	var j = leftMost(IntStr.abs(a),IntStr.abs(b), IntStr.abs(a).length-1).replace(/^0*/,"");
	if(j == "")
		return "0";
	return sign + j;
}

IntStr.div_d = function (a,b,deci)
{
	this.validate(a); this.validate(b);

	k = "1";

	for(var i = 0; i < deci; i++)k +="0";

	var j = this.div(this.mult(a,k),b);

	return j.substring(0,j.length-deci) + "." + j.substring(j.length-deci);
}

IntStr.cmp = function(a,b)
{
	this.validate(a); this.validate(b);

	if(a == b)
		return 0;
	if(IntStr.sub(a,b).charAt(0) == "-")
		return -1;
	else
		return 1;
}

