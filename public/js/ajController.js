function member(Name, GNO, MEMTYPE) {
	this.Name = Name;
	this.GNO = GNO;
	this.MEMTYPE = MEMTYPE;
};
app.controller("memCtrl",function($scope,memService){

	$scope.member = new member('',0,'EMP');
	Getmembers();


	$scope.members = [];
	$scope.sortcol = "Name";
	$scope.sortdesc = false;

	$scope.sortData = function (col) {
		$scope.sortdesc = ($scope.sortcol == col) ? !$scope.sortdesc : false;
		$scope.sortcol = col;
	}

	$scope.getSortClass = function (col) {
		if($scope.sortcol == col){
			return $scope.sortdesc ? 'arrow-down' : 'arrow-up';
		}
			return '';
	}

	//Get Members
	function Getmembers(){
		memService.getAllmem().then(function(mem){
			$scope.members = mem.data;
			localStorage.setItem("mem",JSON. stringify(mem.data));
		},function(){
			alert('Error in fetching memdata');
		});	
	}
	
	//Update Member
	$scope.UpdateMem = function(mem, i){		
		// $scope.members[i].GNO = i;
		memService.UpdateMem(mem).then(function(res){
			$scope.msg = res.data.msg;
		},function(){
			alert('Error in updating memdata');
		});
		
	}
	
	$scope.AddMember = function(member){
		//member.MEMTYPE = 'EMP';
		memService.AddMember(member).then(function(res){
			$scope.msg = res.data.msg;
			$scope.members.unshift(res.data.mem);
			$scope.member = new window.member('',0,'EMP');

		},function(){
			alert('Error in Inserting memdata');
		});
	}

});

app.controller("cbCtrl",function (){
	this.cbno = 99;
});