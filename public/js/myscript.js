function deleteuser(id){
    $.ajax ({
        url: "/showuser/" + id + "/delete-json",
        contentType: 'appliction/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({id}),
        type:'POST',
        success :((res)=>{
            console.log("Success:", res);
            $("#"+id).remove();
        }),
        error :((err) =>{
            console.log("Error:", err);
        })

    });
}