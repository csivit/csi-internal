$(document).ready(function() {
    
    var template = $('#template');
    $('.slot-time').on('change',function() {
        var slot_value = parseInt($(this).val()) + parseInt($('#slot-day').val()); 
        if(($(this).val() != '') && !(isNaN($(this).val())))
        $.getJSON("/announcements/free?time=" + slot_value, function(data) {
            var items_first = [];
            var items_second = [];
            
            for (var x in data) {
                if(data[x].reg_no.substring(0, 2) == "15")
                    items_first.push("<li>" + data[x].reg_no + '-' + data[x].name + "</li>"); 
                if(data[x].reg_no.substring(0, 2) == "14")
                    items_second.push("<li>" + data[x].reg_no + '-' + data[x].name + "</li>");     
            }
            
            

            $(".slots-list-first").empty();
            $(".slots-list-second").empty();
            
            console.log(items_first);
            
            if(data.length > 0){
            
            $(".slots-list-first").append("<h4>First Year with free slots are:</h4>");
            $("<ul/>", {
                "class": "my-slots-list",
                html: items_first.join("")
            }).appendTo(".slots-list-first");
            }
            
            else{
            $(".slots-list-first").append("<h4>No first years with Free Slots</h4>");
            }
            
            if(data.length > 0){
            
            $(".slots-list-second").append("<h4>Second Year with free slots are:</h4>");
            $("<ul/>", {
                "class": "my-slots-list",
                html: items_second.join("")
            }).appendTo(".slots-list-second");
            }
            
            else{
            $(".slots-list-second").append("<h4>No second years with Free Slots</h4>");
            }
            
            //console.log(data);
        });
        
    });
    
    $("#add-slot").click(function(){
       $('#slots-table').append('<tr>'+template.html()+'</tr>') ;
    });
});
