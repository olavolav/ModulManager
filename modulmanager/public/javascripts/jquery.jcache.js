/* Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
for licensing questions please refer to the README
Created by Christian Beulke, Van Quan Nguyen and Olav Stetter */

/**
 * jCache - A client cache plugin for jQuery
 * Should come in handy when data needs to be cached in client to improve performance.
 * Author: 	Phan Van An 
 *			phoenixheart@gmail.com
 *			http://www.skidvn.com
 * License : Read jQuery's license

Usage:
    1. 	Include this plugin into your web document after jQuery:
    	<script type="text/javascript" src="js/jquery.jcache.js"></script>
    2.	[OPTIONAL] Set the max cached item number, for example 20
    	$.jCache.maxSize = 20; 
    3. 	Start playing around with it:
    	- Put an item into cache: $.jCache.setItem(theKey, the Value);
    	- Retrieve an item from cache: var theValue = $.jCache.getItem(theKey);
    	- ...
 */
(function (jQuery){
	this.version = '(beta)(0.0.1)';
	
	/**
	 * The maximum items this cache should hold. 
	 * If the cache is going to be overload, oldest item will be deleted (FIFO).
	 * Since the cached object is retained inside browser's state, 
	 * a too big value on a too big web apps may affect system memory.
	 * Default is 10.
	 */
	this.maxSize = 4000;
	
    /**
     * An array to keep track of the cache keys
     */
	this.keys = new Array();
	
	/**
	 * Number of currently cached items
	 */
	this.cache_length = 0;
	
	/**
	 * An associated array to contain the cached items
	 */
	this.items = new Array();
	
	/*
	 * @desc	Puts an item into the cache
	 *
	 * @param	string Key of the item
	 * @param 	string Value of the item
	 * @return	string Value of the item
	 */
	this.setItem = function(pKey, pValue)
	{
		if (typeof(pValue) != 'undefined') 
		{
			if (typeof(this.items[pKey]) == 'undefined') 
			{
				this.cache_length++;
			}

			this.keys.push(pKey);
			this.items[pKey] = pValue;
			
			if (this.cache_length > this.maxSize)
			{
				// Da wir das nicht wollen, wird besser eine Warnung angezeigt (OS)
				alert("jCache Warning: setItem: Out of cache memory, deleting oldest keys.");
				this.removeOldestItem();
			}
		}
		// else alert("jCache Warning: Value undefined.");
	   
		return pValue;
	}
	
	this.createItem = function(pKey, pValue)
	{
		if (typeof(pValue) != 'undefined') 
		{
			if (typeof(this.items[pKey]) == 'undefined') 
			{
				this.cache_length++;
			}
			else alert("jCache Warning: createItem: Key ("+pKey+") already exists.");

			this.keys.push(pKey);
			this.items[pKey] = pValue;
			
			if (this.cache_length > this.maxSize)
			{
				// Da wir das nicht wollen, wird besser eine Warnung angezeigt (OS)
				alert("jCache Warning: createItem: Out of cache memory, deleting oldest keys.");
				this.removeOldestItem();
			}
		}
		// else alert("jCache Warning: Value undefined.");
	   
		return pValue;
	}

	this.changeItem = function(pKey, pValue)
	{
		if (typeof(pValue) != 'undefined') 
		{
			if (typeof(this.items[pKey]) == 'undefined') 
			{
				this.cache_length++;
				alert("jCache Warning: changeItem: Key ("+pKey+") does not exist.");
			}

			this.keys.push(pKey);
			this.items[pKey] = pValue;
			
			if (this.cache_length > this.maxSize)
			{
				// Da wir das nicht wollen, wird besser eine Warnung angezeigt (OS)
				alert("jCache Warning: changeItem: Out of cache memory, deleting oldest keys.");
				this.removeOldestItem();
			}
		}
		// else alert("jCache Warning: Value undefined.");
	   
		return pValue;
	}
	

	/*
	 * @desc	Removes an item from the cache using its key
	 * @param 	string Key of the item
	 */
	this.removeItem = function(pKey)
	{
		var tmp;
		if (typeof(this.items[pKey]) != 'undefined') 
		{
			this.cache_length--;
			var tmp = this.items[pKey];
			delete this.items[pKey];
		}
	   
		return tmp;
	}

	/*
	 * @desc 	Retrieves an item from the cache by its key
	 *
	 * @param 	string Key of the item
	 * @return	string Value of the item
	 */
	this.getItem = function(pKey) 
	{
		if (typeof(this.items[pKey]) == 'undefined')
			alert("jCache Warning: Accessing undefined key ("+pKey+").");
		return this.items[pKey];
	}

	/*
	 * @desc	Indicates if the cache has an item specified by its key
	 * @param 	string Key of the item
	 * @return 	boolean TRUE or FALSE
	 */
	this.hasItem = function(pKey)
	{
		return typeof(this.items[pKey]) != 'undefined';
	}
	
	/**
	 * @desc	Removes the oldest cached item from the cache
	 */
	this.removeOldestItem = function()
	{
		this.removeItem(this.keys.shift());
	}
	
	/**
	 * @desc	Clears the cache
	 * @return	Number of items cleared
	 */
	this.clear = function()
	{
		var tmp = this.cache_length;
		this.keys = new Array();
		this.cache_length = 0;
		this.items = new Array();
		return tmp;
	}
	
	// dump entire Cache content to HTML table (OS)
	this.dumpCache = function()
	{
		var HTMLstring = "<p>Memory: "+this.cache_length+" of "+this.maxSize+" slots used.</p>";
		HTMLstring += "<table cellspacing='8'><tr><td><strong>#</strong></td><td><strong>key</strong></td>"+
			"<td><strong>value</strong></td></tr>";
		
		for (var i=0; i<this.cache_length; i++) {
			HTMLstring += "<tr><td>"+i+"</td><td>"+this.keys[i]+"</td><td>"+this.items[keys[i]]+"</td></tr>";
		}
		HTMLstring += "</table>";
		
		return HTMLstring;
	}
	
	jQuery.jCache = this;
	return jQuery;
})(jQuery);