<script>

var map, marker, currentarray = [], chunksarray = [], numberofphotos;

$(document).ready(function () {

    create_map();

    $('#searchsubmit').click(function (e) {
        e.preventDefault();
        if(!marker) {
           alert('Please select a location before searching via tag')
         }
    });

    $("#geolocate").click(function () {
        navigator.geolocation.getCurrentPosition(geolocate, function () {});
    });

    $('#userlocation').keypress(function (e) {
        if(e.which == 13) {
            geocodeAddress();
        }
    });

    $('#userlocationsubmit').click(function () {
        geocodeAddress();
    });

    $('.photolist').delegate('a', 'click', function (event) {
        $('#photonumber').children().eq(1).remove().end();
        $('#previousbutton').text(" Previous / ");
        $('#nextbutton').text("Next");
        event.preventDefault();
        var photoid = $(this).children().attr('photoid');
        var flickrlink = "http://flickr.com/photo.gne?id=" + photoid + "/";
        var bigImg = $('<a/>').attr({href: flickrlink, target: '_blank', title: 'View photo on Flickr'}).append($('<img />').attr({src:$(this).attr('href'), class: 'bigimage'}));

        $('.bigimage').html(bigImg);
        
        if(!$(this).hasClass("active")) {
            $("a.active").removeClass("active");
            $(this).addClass("active");
        }
    })

    $('#nextbutton').click(function (e) {
        var photoid = $('a.active').parent().next().find('img').attr('photoid')
        var flickrlink = "http://flickr.com/photo.gne?id=" + photoid + "/";
        var nextImg = $('<a />').attr({href: flickrlink, target: '_blank', title: 'View photo on Flickr'}).append($('<img/>').attr({src: $('a.active').parent().next().find('a').attr('href'), class: 'bigimage'}));
        $('.bigimage').html(nextImg);
        $('a.active').parent().next().find('a').addClass("active");
        $('a.active').parent().prev().find('a').removeClass("active");
        event.preventDefault()
    })

    $('#previousbutton').click(function (e) {
        var photoid = $('a.active').parent().prev().find('img').attr('photoid');
        var flickrlink = "http://flickr.com/photo.gne?id=" + photoid + "/";
        var prevImg = $('<a />').attr({href: flickrlink, target: '_blank', title: 'View photo on Flickr'}).append($('<img/>').attr({src: $('a.active').parent().prev().find('a').attr('href'), class: 'bigimage'}));
        $('.bigimage').html(prevImg);
        $('a.active').parent().prev().find('a').addClass("active");
        $('a.active').parent().next().find('a').removeClass("active");
        event.preventDefault()
    })

    $('#advancedsearch').click(function () {
        $('#advancedsearchoptions').toggle('slow', function () {
            if($('#advancedsearchoptions').is(':visible')) {
                $('#advancedsearch').text('Hide advanced options');
            } else {
                $('#advancedsearch').text('Show advanced options');
            }
        });
    })

    $('#locationtoggle').click(function () {
        $('#locations').toggle('slow', function () {
            if($('#locations').is(':visible')) {
                $('#locationtoggle').text('Recent locations - hide')
            } else {
                $('#locationtoggle').text('Recent locations - show')
            }
        })
    })
    
   $('#nextbatch').click(function(){
       clearImages();
       currentarray = currentarray + 1;
       $('#previousbatch').text("Previous");
       processFlickrData(chunksarray[currentarray]);
       
   })
   
   $('#previousbatch').click(function(){
      clearImages();
      currentarray = currentarray - 1;
      processFlickrData(chunksarray[currentarray]);
   })
});

</script>
