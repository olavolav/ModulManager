/* Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
for licensing questions please refer to the README
Created by Christian Beulke, Van Quan Nguyen and Olav Stetter */

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//  diese Funktion ueberblickrekursiv() gibt den Überblick in der linken Spalten.-//
//  die gibt alle Fehlern und Warnungen aus.                                      //
//  Und die Funktion ueberblick() ruft ueberblick-XML per AJAX auf                //
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var info_box_overview = function(modul_id){
  reset_info_box();
  $("#box_info_exception").hide();
  $("#box_info_pool").show();
  $("#info_box").modal('show');

  var html = $.ajax({
    type : 'POST',
    url  : '/abfragen/info/'+modul_id,
    data: authenticityTokenParameter(),
    async: false,
    cache: false,
    contentType: 'application/x-www-form-urlencoded',
    success : function(html){
      $("#box_info").append(html);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
     ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=info_box_overview");
    }
  }).responseText;
};

var ueberblick = function(){
	
		$("#ueberblick #ueberblick-wird-aktualisiert").show();
  	update_module_errors();

		if ($.jCache.hasItem("AbfragenUeberblickInProgress")) {
			var running = parseInt($.jCache.getItem("AbfragenUeberblickInProgress"));
			$.jCache.changeItem("AbfragenUeberblickInProgress",running+1);
		}

    var html = $.ajax({
        type : 'GET',
        url  : '/abfragen/ueberblick',
        async: true,
				cache: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
            $("#ueberblick #ueberblick_baum").empty();
            $("#ueberblick #ueberblick_baum").html(html);
            ajax_request_grade();

						// Fehler von Modulen und Kategorien auswerten
						update_category_errors();

				    // Klickbare Info-Buttons sollen beim dr�berfahren animiert werden, wie schon in global_javascript.js (OS)
				    $(".ueberblick_info_box,#ueberblick-pin-passiv,#ueberblick-pin-aktiv").mouseenter(function(){
				        $(this).animate({
				            opacity: 0.4
				        }, "fast");
				        $(this).animate({
				            opacity: 1.0
				        }, "slow");
				    });
				
						// Falls der Überblick fixiert ist, muss noch das richtige Icon angezeigt werden (OS)
						if($("#left").css("position")=="fixed") {
							$("#left #ueberblick-pin-passiv").hide();
							$("#left #ueberblick-pin-aktiv").show();
						}
						
						if ($("#pleasewait").css("display") != "none")
							$("#pleasewait").slideUp("slow");
						
						if ($.jCache.hasItem("AbfragenUeberblickInProgress")) {
							var running = parseInt($.jCache.getItem("AbfragenUeberblickInProgress"));
							// alert("running = "+running);
							if (running > 0) $.jCache.changeItem("AbfragenUeberblickInProgress",running-1);
							// Falls noch weitere Überblick-Anfragen laufen, Warte-Icon anzeigen (OS)
							if (running > 1) $("#ueberblick #ueberblick-wird-aktualisiert").show();
						}
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ueberblick");
				}
    }).responseText;
		
};// ende function

var update_category_errors = function() {
	// Durch alle Kategorien gehen und Fehler-Wert extrahieren - wäre nett, wenn das in Zukunft
	// eleganter möglich wäre (OS)
	$("#ueberblick").find(".ueberblick_info_box").each(function(){
		var cat_id = $(this).attr("id").split("#")[1];
		var cat_fehler = "false";
		if ($(this).find("a > img").attr("alt") != "Ipunkt") cat_fehler = "true";
		// alert("update_category_errors: alt="+$(this).find("a > img").attr("alt")+", error="+cat_fehler);
		
		// Testen, ob dieser neue Wert auch dem Wert im Cache entspricht, bzw. vorher, ob er existiert
		if ($.jCache.hasItem("c"+cat_id+"::error")) {
			if ($.jCache.getItem("c"+cat_id+"::error")==cat_fehler) {
				// also hat sich nichts geändert
				// alert("update_category_errors: Kategorie #"+cat_id+" unverändert, error="+cat_fehler);
			}
			else {
				$.jCache.changeItem("c"+cat_id+"::error",cat_fehler);
				// alert("update_category_errors: Kategorie #"+cat_id+" hat sich verändert, jetzt error="+cat_fehler);
				// also hat sich der Fehler-Wert verändert
				$(this).animate({opacity: 0.1}, "fast");
				$(this).animate({opacity: 1.0}, "fast");
				$(this).animate({opacity: 0.1}, "fast");
				$(this).animate({opacity: 1.0}, "fast");
				$(this).animate({opacity: 0.1}, "fast");
				$(this).animate({opacity: 1.0}, "fast");
			}
		}
		// Falls das also der erste Aufruf nach dem neu Laden war, Cache-Werte setzen
		else $.jCache.createItem("c"+cat_id+"::error",cat_fehler);
	});
};
