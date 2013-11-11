// JavaScript Document

 var picseconds;
         var sekunden;
           bilder = new Object();
        var anzahlbilder;
        
        var breite = $( window ).width();
       var gerundet;
     
        function jsonlesen(){
       $.getJSON( "flickr.json", function(data) {
              console.log( "success" );

        bilder = data;
        anzahlbilder = bilder.photos.length;
         
       })
        
      
        }
        
        jsonlesen();
        
        $( document ).ready(function() {
           
          
        $(".details-container").hide();
        
        $(".slider").draggable({ containment: "parent" },
                               
                               {start: function(){$(".flickrfile").fadeOut("fast").empty();
  $(".details-container").fadeOut("fast");                                                
                                                 
                                                 }},
                               
                               {drag: function(){
        
        var xpos_slider = $(".slider").position().left;

        
        var timeposprozent = xpos_slider * 100 /$(".slider-container").width() ;
        var zeitraum = 24 * timeposprozent / 100;
         gerundet = Math.round(zeitraum);
        var endzeit = gerundet+2;                           
        $(".slider").html(gerundet + " - " + endzeit);
                                           
        console.log(gerundet);
        
        // BILDER IM ZEITRAUM LADEN
               
        
        
        }
                               },
                               
        {stop: function(){
            
            $(".flickrfile").fadeIn("fast");
           
       for(var i=0; i<bilder.photos.length; i++)
        {
            
            
         var zeitpunkt = bilder.photos[i].datetaken.split(' ');

         picseconds = zeitpunkt[1].split(":");
            if(picseconds[0] == gerundet && picseconds[0] < gerundet+2){
     
              var photoid= i;
                
              $( "<img class='pic' src=" + bilder.photos[i].url_q + " alt="+photoid+">" ).appendTo( ".flickrfile" );
            }
        }
            
            $(".pic").mouseover(function(){
        
            });
             jsonlesen();
           
                              
            $(".pic").click(function(){
                var bildnummer = $(this).attr("alt");
                
                if(bilder.photos[bildnummer].url_o == undefined){
                $(".details-pic").fadeOut("fast").fadeIn("fast").html("LEIDER NICHT IN ORIGINALGRÖSSE VERFÜGBAR");
                    $(".details-titel").html("<div class='close'><a href='#'>x schließen</a></div>" + bilder.photos[bildnummer].title);
                    $(".details-text").empty();
                } else {  $(".details-pic").html("<img src=" + bilder.photos[bildnummer].url_o + ">");
                        $(".details-titel").html("<div class='close'><a href='#'>x schließen</a></div>" + bilder.photos[bildnummer].title);
                        $(".details-text").html("views: "+ bilder.photos[bildnummer].views + " | Originalgröße: " + bilder.photos[bildnummer].o_width +" x " + bilder.photos[bildnummer].o_height);
                       }
                
                $(".details-container").fadeIn("fast");
              
                 console.log(bildnummer);
                console.log(bilder.photos[bildnummer].url_o);
                
                 $(".close").click(function(){
            
                 $(".details-container").toggle();
            
            });
                
            });
                
                
              }}
                            
                              ); // ENDE VON DRAGGABLE
          
          
                
        });
        

        