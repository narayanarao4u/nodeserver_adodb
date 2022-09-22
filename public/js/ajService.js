app.service("memService",function($http){
	this.getAllmem = function() {
		return 	$http.get("getallmemdata");
	};

	this.UpdateMem = function(mem) {  
            return $http({  
                method: "post",  
                url: "UpdateMem",  
                data: JSON.stringify(mem),  
                dataType: "json"  
            });  
	};
	
	this.AddMember = function(mem) {
		return $http({  
                method: "post",  
                url: "AddMember",  
                data: JSON.stringify(mem),  
                dataType: "json"  
            }); 
	}
	
});