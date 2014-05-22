angular.module('app')

    .controller("mainController", ['$scope', '$rootScope', '$http', 'returnArrayOfSelectedBoxesFilter',
        function($scope, $rootScope, $http, returnArrayOfSelectedBoxesFilter) {
        var $ = $scope;

        $.showAdvancedOptions = false;
        $.showRecentLocations = false;

        $.licenses = [{ checked: true, number: 0, type: "All rights reserved"}, 
                        { checked: true, number: 1, type: "Attribution-Non-Commercial-Share Alike Licence"}, 
                        { checked: true, number: 2, type: "Attribution-Non-Commercial Licence"}, 
                        { checked: true, number: 3, type: "Attribution-Non-Commercial-NoDerivs Licence"}, 
                        { checked: true, number: 4, type:"Attribution Licence"}, 
                        { checked: true, number: 5, type:"Attribution-Share Alike Licence"}, 
                        { checked: true, number: 6, type:"Attribution-No Derivs Licence"}, 
                        { checked: true, number: 7, type:"No known copyright restrictions"}, 
                        { checked: true, number: 8, type: "United States Government Work"}]

        $.tag = "";

        $.$on('map.click', function(e, l){ 

            $http.post('/api/flickrapi', { lat: l.lat, lon: l.lon, tag: $.tag, licenses: returnArrayOfSelectedBoxesFilter($scope.licenses) })
                .success(function(data){
                    $.arrayOfPhotos = data;
                })
                .error(function(){
                    console.log("Error")
                })
        });
    }])

    .filter("returnArrayOfSelectedBoxes", function(){
        return function(ar){
            var arr = [];
            ar.forEach(function(a){
                if (a.checked === true){
                    arr.push(a.number);
                }
            })
            return arr;
        }
    })
