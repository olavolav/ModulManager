


$(function(){
	
	/*------------Pflichtmodule---------------------------------------------------------*/
		/*--------Grundkurse-----------------------------------------------*/
		
			$(".Grundkurse ul").hide();
			$('.Grundkurse').live("click",function(){
				$(".Grundkurse ul").toggle();
		
			});
	
		/*--------Praktika-------------------------------------------------*/
	
			$(".Praktika ul").hide();
			$('.Praktika').live("click",function(){
				$(".Praktika ul").toggle();
		
			});
			
		/*--------Mathematik-------------------------------------------------*/
	
			$(".Mathematik ul").hide();
			$('.Mathematik').live("click",function(){
				$(".Mathematik ul").toggle();
		
			});
			
	/*------------Spezialisierungsbereich---------------------------------------------------------*/
		/*--------Spezialisierungspraktikum-----------------------------------------------*/
			
			$(".Spezialisierungspraktikum ul").hide();
			$(".Spezialisierungspraktikum").live("click",function(){
				$(".Spezialisierungspraktikum ul").toggle();
			});
			
		/*--------Einfuehrungen-----------------------------------------------*/
			
			$(".einfuehrungen ul").hide();
			$(".einfuehrungen").live("click",function(){
				$(".einfuehrungen ul").toggle();
			});
			
		/*--------Spezielle Themen-----------------------------------------------*/
			
			$(".spezielle ul").hide();
			$(".spezielle").live("click",function(){
				$(".spezielle ul").toggle();
			});
			
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	/*------------Profilierungsbereich---------------------------------------------------------*/
	
			$(".Profilierungsbereich ul").hide();
			$(".Profilierungsbereich").live("click",function(){
				$(".Profilierungsbereich ul").toggle();
			});
			
	/*------------Schlüsselkompetenzen---------------------------------------------------------*/
	
			$(".schluesselkompetenzen ul").hide();
			$(".schluesselkompetenzen").live("click",function(){
				$(".schluesselkompetenzen ul").toggle();
			});


	/*------------Astro- und Geophysik---------------------------------------------------------*/

			$(".astro ul").hide();
			$(".astro").live("click",function(){
				$(".astro ul").toggle();
			});
			
	/*------------Biophysik und Physik komplexer Systeme---------------------------------------------------------*/

			$(".biophysik ul").hide();
			$(".biophysik").live("click",function(){
				$(".biophysik ul").toggle();
			});		
			
	/*------------Festkörper- und Materialphysik---------------------------------------------------------*/

			$(".materialphysik ul").hide();
			$(".materialphysik").live("click",function(){
				$(".materialphysik ul").toggle();
			});	
			
	/*------------Kern- und Teilchenphysik---------------------------------------------------------*/

			$(".teilchenphysik ul").hide();
			$(".teilchenphysik").live("click",function(){
				$(".teilchenphysik ul").toggle();
			});			
					
			
});//ende global function



	/*----------AJAX Teil---------------------------------------------------------------------------*/
	
	$(function(){


                                $('.semester').droppable({
                                        //accept: 'li',
                                        hoverClass: 'drophover',

                                        drop: function(event, ui){

                                                $(ui.draggable).hide();


                                                $.ajax({
                                                        type: 'GET',

                                                        url : 'http://localhost:3000/abfragen/pool',

                                                        cache:false,
                                                        dataType:'xml',
                                                        async :false,

                                                        contentType:'application/x-www-form-urlencoded',

                                                        success: function(msg){
                                                               rekursiv(msg);
                                                        },
                                                        error: function (a,b,c){
                                                                alert("Erorr");
                                                        }

                                                });//ende Ajax
                                         }//ende Drop
                                  });//ende droppable




                                        $('.modul').draggable({
                                                cursor: 'crosshair',
                                                revert: 'invalid'


                                        });

                                        /*$('li').draggable({
                                                cursor: 'crosshair',
                                                revert: 'invalid'

                                        });*/

                                        //reingezogene Module draggable
                                        $('li.modul').live("click",function(){
                                                $(this).draggable({
                                                        revert: 'invalid'
                                                });


                                        });


                                        /*$('#modul').sortable({
                                                connectWith: '.semester'
                                        });        */





                        });
	
	
	
	/*----------POOL Drag and Drop---------------------------------------------------------------------------*/
	
	$(function(){
		
		$("ul li").draggable({
			revert : "invalid"
			
		});
		
		
	});




















