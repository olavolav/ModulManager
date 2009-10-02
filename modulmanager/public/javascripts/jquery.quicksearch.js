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
                        return '<input type="text" value="' + val + '" rel="' + options.randomElement  + '" class="' + options.inputClass + '" id="' + options.randomElement + '" /> ';
                }

                function make_form_loader()
                {
                        if (!is_empty(options.loaderImg)) {
                                return '<img src="' + options.loaderImg + '" alt="Loading" id="' + options.loaderId + '" class="' + options.loaderClass + '" />';
                        } else {
                                return '<span id="' + options.loaderId + '" class="' + options.loaderClass + '">' + options.loaderText + '</span>';
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
					//alle bildchen wieder auf pfeil-rechts setzen 
					var this_children = $("#pool").children();
					
					$(this_children).each(function(){
						$(this).find("span").each(function(){
							var this_id = $(this).attr("class");
							if(this_id == "pfeil_rechts"){
								$(this).css("display","inline");
							}
							else if(this_id="pfeil_unten"){
								$(this).css("display","none");
							}
							
						});
						
						// mache alle untere Kategorie zu
						$(this).find(".pool_category,.pool_modul").hide();
						
						
							
						
					});//ende this_children
					
				}
				
				// function from Modulmanager
				function show_modul_by_search(array_id)
				{
					
					tree_close();
					
					//array_id kommt aus qs()
					for(var i=0; i<array_id.length; i++)
					{
						
						$("#pool ."+array_id[i]+"_parent").each(function(){
							//check ob der mod_id zwei Kinder hat
							// warum? denn ein mod_id_parent hat max. 2 Kinder
							// also ein div.nichtleer  und ein div.pool_modul
							//und wir laden nur beim mod_id_parent, der bereits 
							//div.pool_modul enth�lt
							if(($(this).children().length)==2)
							{
								var this_pool_modul = $(this).children()[1];
								var this_span_text  = $(this_pool_modul).find("span.imAuswahl").text();
								if(this_span_text == "nein")
								{
									
									$(this_pool_modul).show();
									
									//sofort macht den sein Vater pool_category auch auf
									// dann sein grandfather und ururvather aufmachen
									// achten auf das bildchen pfeil
									var first_father = $(this).parent().get(0);
									
									$(first_father).show();
									$(first_father).find("span.pfeil_rechts").eq(0).css("display","none");
									$(first_father).find("span.pfeil_unten").eq(0).css("display","inline");
									
									// andere pool_category in gleichen Kategorie mit mod_id_parent
									//auch aufmachen.
									$(first_father).siblings().show();
									
									//second_father ist ein n�chsth�henPool_kategory
									//das ist ein Schwerrpunkt. z.B: Physikinformatik
									//dann mache alle seine Siblings auch auf( bei Allgemein bunutzt)
									//achten auf das bildchen pfeil
									var second_father=$(first_father).parent().get(0);
									$(second_father).show();
									$(second_father).find("span.pfeil_rechts").eq(0).css("display","none");
									
									$(second_father).find("span.pfeil_unten").eq(0).css("display","inline");
									$(second_father).siblings().show();
									
									//third_father ist bei Allgemein-Bachelor benutzt
									var third_father =$(second_father).parent().get(0);
									if(third_father !="" || third_father !="undefined")
									{
										$(third_father).show();
										$(third_father).find("span.pfeil_rechts").eq(0).css("display","none");
										$(third_father).find("span.pfeil_unten").eq(0).css("display","inline");
									}
									
									
									// show die andere mod_id_parent  mit span.imAuswahl "nein"
									// $(this) hier: das div.mod_id_parent
									var this_siblings = $(this).siblings();
									if(this_siblings!="")
									{
										$(this_siblings).find("div.pool_modul").each(function(){
											//hier check ob das modul schon bereits im Auswahl ist
											var this_span_siblings_text = $(this).find("span.imAuswahl").text();
											if(this_span_siblings_text =="nein")
											{
												$(this).show();
											}
										});
										
									}
									
									
								}
								
								
							}
							
							
						});
						
					}//ende for schleife
					
					
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
										// -var laenge sorgt daf�r,dass es sich nichts ergeben bei
										//leere Angabe im SuchenBereich, wenn laege max ist.
										var array_id = new Array();
										var this_tr =$("table#suche tbody tr"); 
										
										var tr_show = $(this_tr).filter(function(index){
														 return ($(this).css("display")=="table-row" ||$(this).css("display")=="block" )
														 
													});
										var laenge = $(tr_show).length;
										
									
										if(laenge != table_row_all){
											
											$(tr_show).each(function(){
												
												var mod_id =$(this).attr("id");
												array_id.push(mod_id);
											});
											
											
											// Module im Pool-Baum anzeigen
											
											show_modul_by_search(array_id);
											
											
											
										}
										else{
											// hier tree_close macht den Baum bei leeren String zu
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
                        randomElement: 'qs' + Math.floor(Math.random() * 1000000),
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