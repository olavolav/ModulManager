// based on work by Rik Lomas
// http://rikrikrik.com/jquery/quicksearch

jQuery(function ($) {
        $.fn.quicksearch = function (opt) {

                function is_empty(i)
                {
                        return (i === null || i === undefined || i === false) ? true: false;
                }

                function strip_html(input)
                {
                        var regexp = new RegExp(/\<[^\<]+\>/g);
                        var output = input.replace(regexp, "");
                        output = $.trim(output.toLowerCase().replace(/\n/, '').replace(/\s{2,}/, ' '));
                        return output;
                }

                function get_key()
                {
                        var input = strip_html($('input[rel="' + options.randomElement + '"]').val());

                        if (input.indexOf(' ') === -1)
                        {
                                return input;
                        }
                        else
                        {
                                return input.split(" ");
                        }
                }

                function test_key(k, value, type)
                {
                        if (type === "string")
                        {
                                return test_key_string(k, value);
                        }
                        else
                        {
                                return test_key_arr(k, value);
                        }
                }

                function test_key_string(k, value)
                {
                        return (value.indexOf(k) > -1);
                }

                function test_key_arr(k, value)
                {
                        for (var i = 0; i < k.length; i++) {
                                var test = value.indexOf(k[i]);
                                if (test === -1) {
                                        return false;
                                }
                        }
                        return true;
                }

                function select_element(el)
                {
                        if (options.hideElement === "grandparent")
                        {
                                return $(el).parent().parent();
                        }
                        else if (options.hideElement === "parent")
                        {
                                return $(el).parent();
                        }
                        else
                        {
                                return $(el);
                        }
                }

                function stripe(el)
                {
                        if (doStripe)
                        {
                                var i = 0;
                                select_element(el).filter(':visible').each(function () {

                                        for (var j = 0; j < stripeRowLength; j++)
                                        {
                                                if (i === j)
                                                {
                                                        $(this).addClass(options.stripeRowClass[i]);

                                                }
                                                else
                                                {
                                                        $(this).removeClass(options.stripeRowClass[j]);
                                                }
                                        }
                                        i = (i + 1) % stripeRowLength;
                                });
								
                        }
                }

                function fix_widths(el)
                {
                        $(el).find('td').each(function () {
                                $(this).attr('width', parseInt($(this).css('width')));
                        });
                }

                function loader(o) {
                        if (options.loaderId)
                        {
                                var l = $('input[rel="' + options.randomElement + '"]').parent().find('.loader');
                                if (o === 'hide')
                                {
                                        l.hide();
                                }
                                else
                                {
                                        l.show();
                                }
                        }
						
                }

                function place_form() {
                        var formPosition = options.position;
                        var formAttached = options.attached;

                        if (formPosition === 'before') {
                                $(formAttached).before(make_form());
                        } else if (formPosition === 'prepend') {
                                $(formAttached).prepend(make_form());
                        } else if (formPosition === 'append') {
                                $(formAttached).append(make_form());
                        } else {
                                $(formAttached).after(make_form());
                        }
						
                }

                function make_form_label()
                {
                        if (!is_empty(options.labelText)) {
                                return '<label for="' + options.randomElement + '" '+
                                                        'class="' + options.labelClass + '">'
                                                        + options.labelText
                                                        + '</label> ';
                        }
                        return '';
                }

                function make_form_input()
                {
                        var val = (!is_empty(options.inputText)) ? options.inputText : ""
                        return '<input type="text" value="' + val + '" style="margin:2px;" rel="' + options.randomElement  + '" class="' + options.inputClass + '" id="' + options.randomElement + '" /> ';
                }

                function make_form_loader()
                {
                        if (!is_empty(options.loaderImg)) {
                                return '<img src="' + options.loaderImg + '" alt="Loading" id="' + options.loaderId + '" class="' + options.loaderClass + '" />';
                        } else {
                                return '<div id="' + options.loaderId + '" class="' + options.loaderClass + '">' + warten_weiss + '</div>';
                        }
                }

                function make_form()
                {
                        var f = (!options.isFieldset) ? 'form' : 'fieldset';
                        return '<' + f + ' action="#" ' + 'id="'+ options.formId + '" ' + 'class="quicksearch">' +
                                                make_form_label() +        make_form_input() + make_form_loader() +
                                        '</' + f + '>';
                }

                function focus_on_load()
                {
                        $('input[rel="' + options.randomElement + '"]').get(0).focus();
						
						
                }

                function toggle_text() {
                        $('input[rel="' + options.randomElement + '"]').focus(function () {
                                if ($(this).val() === options.inputText) {
                                        $(this).val('');
                                }
                        });
                        $('input[rel="' + options.randomElement + '"]').blur(function () {
                                if ($(this).val() === "") {
                                        $(this).val(options.inputText);
                                }
                        });
                }

                function get_cache(el)
                {
                        return $(el).map(function(){
                                return strip_html(this.innerHTML);
                        });
                }
				
				// function from Modulmanager
				
				function tree_close()
				{   
				
				
				    // Table muss zu
					/*var this_tr =$("table#suche tbody tr"); 
					$(this_tr).each(function(){
						$(this).css("display","none");
						
					});*/
					
				
					//alle bildchen wieder auf pfeil-rechts setzen 
					$("#pool").show();
					var this_children = $("#pool").children();
					$(this_children).show();
					
					$(this_children).each(function(){
						if($(this).hasClass("search_category")){
							$(this).removeClass("search_category");
							$(this).addClass("pool_category");
							
						}
						
						/*$(this).find("span").each(function(){
							var this_id = $(this).attr("class");
							if(this_id == "pfeil_rechts"){
								$(this).css("display","inline");
							}
							else if(this_id="pfeil_unten"){
								$(this).css("display","none");
							}
							
							
						});*/
						
						$(this).find("span.pfeil_rechts").each(function(){
							
								$(this).css("display","inline");
							
						});
						$(this).find("span.pfeil_unten").each(function(){
							
								$(this).css("display","none");
							
						});
						
						
						
						// mache alle untere Kategorie zu
						$(this).find(".pool_category,.pool_modul,.partial_modul,.custom_modul").hide();
						//custom_modul
						$(this).find(".search_modul").each(function(){
							$(this).removeClass("search_modul");
						});

						$(this).find(".search_category").each(function(){
							$(this).removeClass("search_category");
							$(this).addClass("pool_category");
							$(this).hide();
							
						});
						
						
							
						
					});//ende this_children
					
				}
				
				function show_pool_by_search (parent){
					var this_parent = $(parent).parent().get(0);
					var this_id = $(parent).attr("id");
					
					$(parent).show();
					if ($(parent).hasClass("pool_category")) {
						// Die Abfrage bedeutet dann auch, dass wir nicht schon bei #pool angekommen
						// sind. (OS)
						flip_arrow_of_category("unten",parent);

						$(parent).attr("class","search_category");
						// rekursiver Aufruf
						show_pool_by_search($(this_parent));
					}
				}
				
				// function from Modulmanager
				function show_modul_by_search(array_id)
				{
					
					tree_close();
					
					
					//array_id kommt aus qs()
					// alert("Anzahl uebereinstimmender Modul-IDs: "+array_id.length);
					for(var i=0; i<array_id.length; i++)
					{
						// für jeden Modul-Container, der mit der ID aus dem Such-Ergebnis überinstimmt...
						// (Module, die in der Auswahl sind, werden so auch gefunden)
						// alert((i+1)+". Anzahl uebereinstimmender Module zu ID "+array_id[i]+": "+$("#pool ."+array_id[i]+"_parent").length);
						$("#pool ."+array_id[i]+"_parent").each(function(){
							// neue Class 'search_modul' in modul_id_parent hinzufügen
							// damit kann man nur 'search_modul' im Pool_baum togglen
							$(this).addClass("search_modul");
							//$(this).removeClass("pool_category");
							
							// falls das Modul nicht in der Auswahl ist, das Modul anzeigen und
							// den Baum im Pool rekursiv öffnen
							var modul = $("#pool").find("#"+array_id[i]);
							var modul_span = $(modul).find("span.inAuswahl").eq(0).text();
							//modul-parent für ein Teil_modul
							var modul_parent = $(modul).find("span.modul_parent_attr").eq(0).text();
							
							
							if((modul_span=="nein")&&(modul_parent=="nein")){
								
								$(this).show();
								$(modul).show();
								
								var this_parent =$(this).parent().get(0);
								show_pool_by_search($(this_parent));
							}
							
							
							
						});
						
					}//ende for schleife
					
					// alle Kategorien verstecken, die nicht gesuchte Module enthalten (OS)
					$('.pool_category').hide();
					
				}//ende function

                function init()
                {
                        place_form();
                        if (options.fixWidths) fix_widths(el);
                        if (options.focusOnLoad) focus_on_load();
                        if (options.inputText != "" && options.inputText != null) toggle_text();

                        cache = get_cache(el);

                        stripe(el);
                        loader('hide');
						//anzahl der gesamten Table-row
						table_row_all = $("table#suche tbody tr").length;
															
									
										
						
                
                }

                function qs()
                {
						
                        clearTimeout(timeout);
						
                        timeout = setTimeout(function () {

                                loader('show');
								
                                setTimeout(function () {
                                        options.onBefore();
										
                                        var k = get_key();
                                        var k_type = (typeof k);
                                        var i = 0;

                                        k = options.filter(k);

                                        if (k != "")
                                        {
                                                if (typeof score[k] === "undefined")
                                                {
                                                        score[k] = new Array();
                                                        cache.each(function (i) {
                                                                if (test_key(k, cache[i], k_type))
                                                                {
                                                                        score[k][i] = true;
                                                                }
                                                        });
														

														
                                                }

                                                if (score[k].length === 0)
                                                {
                                                        select_element(el).hide();
                                                }
                                                else
                                                {
                                                        $(el).each(function (i) {
                                                                if (score[k][i])
                                                                {
                                                                        select_element(this).show();
                                                                }
                                                                else
                                                                {
                                                                        select_element(this).hide();
                                                                }
                                                        });

                                                }
                                        }
                                        else
                                        {
                                                select_element(el).show();
													
												
                                        }
										// -hier ist die Code von Modulmanager eingebunden
										// -wir suchen hier die table-row nach der Eingabe
										// -var laenge sorgt dafür,dass es sich nichts ergeben bei
										//leere Angabe im SuchenBereich, wenn laege max ist.
										var array_id = new Array();
										var this_tr =$("table#suche tbody tr"); 
										
										var tr_show = $(this_tr).filter(function(index){
														 return ($(this).css("display")=="table-row" ||$(this).css("display")=="block" )
														 
													});
										var laenge = $(tr_show).length;
										
									
										if(laenge != table_row_all){
											
											$(tr_show).each(function(){
												
												var mod_id =$(this).attr("class");
												array_id.push(mod_id);
											});
											
											
											// Module im Pool-Baum anzeigen
											
											show_modul_by_search(array_id);
											
											
											
										}
										else{
											// hier tree_close macht den Baum bei leerem String zu
											tree_close();
										}
										
										//ende Code von Modulmanager
										
                                        stripe(el);
                                }, options.delay/2);

                                setTimeout( function () {
                                        loader('hide');
                                }, options.delay/2);

                                options.onAfter();

                        }, options.delay/2);
                }

                var options = $.extend({
                        position: 'prepend',
                        attached: 'body',
                        formId: 'quicksearch',
                        labelText: 'Quick Search',
                        labelClass: 'qs_label',
                        inputText: null,
                        inputClass: 'qs_input',
                        loaderId: 'loader',
                        loaderClass: 'loader',
                        loaderImg: null,
                        loaderText: 'Loading...',
                        stripeRowClass: null,
                        hideElement: null,
                        delay: 500,
                        focusOnLoad: false,
                        onBefore: function () { },
                        onAfter: function () { },
                        filter: function (i) {
                                return i;
                        },
                        randomElement: 'qs',//+ Math.floor(Math.random() * 1000000),
                        isFieldset: false,
                        fixWidths: false
                }, opt);

                var timeout;
                var score = {};
                var stripeRowLength = (!is_empty(options.stripeRowClass)) ? options.stripeRowClass.length : 0;
                var doStripe = (stripeRowLength > 0) ? true : false;
                var el = this;
                var cache;
                var selector = $(this).selector;
				
				//anzahl der gesamten table-row
				var table_row_all;

                $.fn.extend({
                        reset_cache: function () {
                                el = $(selector);
                                cache = get_cache(el);
                        }
                });

                init();

                $('input[rel="' + options.randomElement + '"]').keydown(function (e) {
						
                        var keycode = e.keyCode;
                        if (!(keycode === 9 || keycode === 13 || keycode === 16 || keycode === 17 || keycode === 18 || keycode === 38 || keycode === 40 || keycode === 224))
                        {
							
                                qs();
                        }
                });

                $('form.quicksearch, fieldset.quicksearch').submit( function () { return false; });

                return this;
        };
});