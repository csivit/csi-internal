$(document).ready(function() {
    
    var template = $('#template');
    $('.slot-time').on('change keyup',function() {
        if(($(this).val() != '') && !(isNaN($(this).val())))
        $.getJSON("/announcements/free?time=" + $(this).val(), function(data) {
            var items = [];
            $.each(data, function(key, val) {
               
            });
            
            for (var x in data) {
                items.push("<li>" + data[x].reg_no + '-' + data[x].name + "</li>"); 
            }

            $(".slots-list").empty();
            
            if(data.length > 0){
            
            $(".slots-list").append("<h4>People with free slots are:</h4>");
            $("<ul/>", {
                "class": "my-slots-list",
                html: items.join("")
            }).appendTo(".slots-list");
            }
            
            else{
            $(".slots-list").append("<h4>No people with Free Slots</h4>");
            }
            
            console.log(data);
        });
        
    });
    
    $("#add-slot").click(function(){
       $('#slots-table').append('<tr>'+template.html()+'</tr>') ;
    });
});
