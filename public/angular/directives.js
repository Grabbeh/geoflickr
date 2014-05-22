angular.module('app')

    .directive('mgMap', function($rootScope) {
    return {
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {

            scope.$watch('attrs.coords', function(coords){
                 placeMarker(coords)
            })

            var mapOptions = {
                center: new google.maps.LatLng(38.3, 10.78),
                zoom: 2,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: false,
                zoomControl: false,
                scaleControl: false,
                zoomControl: true,
                draggableCursor: "default",
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("mymap"), mapOptions);

            google.maps.event.addListener(map, 'click', function (event) {
                var latLon = event.latLng;
                var latLonObject = { lat: latLon.lat(), lon: latLon.lng() };
                $rootScope.$broadcast('coords.change', latLonObject);
                $rootScope.coordinates = latLonObject;
                map.setCenter(latLon);
                placeMarker(latLon);
            })

             google.maps.event.addListener(marker, 'dragend', function (event) {
                var latLon = marker.getPosition();
                var latLonObject = { lat: latLon.lat(), lon: latLon.lng() };
                $rootScope.$broadcast('coords.change', latLonObject);
                $rootScope.coordinates = latLonObject;
                map.setCenter(latLon);
            })


            function placeMarker(location) {
                marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    flat: true,
                    draggable: true
                });
                if (map.getZoom() < 13) {
                    map.setZoom(13)
                }
            };
        }
    };
})

 .directive('mgClear', function() {
    return {
      compile: function(element){
          element.addClass('clear')
      }
    };
  })

  .directive('mgPaginator', function() {
      return {
            templateUrl: "/partials/photos.html",
            replace: true, 
            link: function(scope, elements, attrs){
                 scope.$watch(attrs.arrayOfPhotos, function(newVal){
                      if (newVal === undefined){
                          return;
                      }
                      for (var i=0; i < newVal.length; i+= scope.itemsPerPage) {
                           var slice = newVal.slice(i, i+ scope.itemsPerPage);
                           scope.groupOfArrays.push(slice);
                      }
                      scope.pageNumber = 1;
                      scope.activeImage = false;
                 })

                  scope.$watch('pageNumber', function(newPage){
                      scope.photos = scope.groupOfArrays[newPage -1];
                      console.log(scope.photos)
                  });
    
            },
            scope: {
                arrayOfPhotos: "=",
                itemsPerPage: "="
            },
            controller: function($scope) {
                $scope.groupOfArrays = [];
                $scope.prevPage = function(pageNumber){
                    $scope.pageNumber--;
                };
                $scope.nextPage = function(pageNumber){
                    $scope.pageNumber++;
                };
                $scope.firstPage = function(){
                    $scope.pageNumber = 1;
                };
                $scope.lastPage = function(){
                    $scope.pageNumber = $scope.groupOfArrays.length;
                };
                $scope.checkIfFirst = function(pageNumber){
                    if (pageNumber === 1){
                      return true;
                    }
                };
                $scope.checkIfLast = function(pageNumber){
                   if (pageNumber === $scope.groupOfArrays.length){
                      return true;
                   }
                };
                $scope.makePhotoActive = function(index){
                    $scope.activePhoto = $scope.photos[index];
                    $scope.photoIndex = index;
                };
                $scope.prevActive = function(){
                    $scope.activePhoto = $scope.photos[$scope.photoIndex - 1];
                    $scope.photoIndex--;
                };
                $scope.nextActive = function(){
                     $scope.activePhoto = $scope.photos[$scope.photoIndex + 1];
                     $scope.photoIndex++;
                }
          }
      }
  })
/*
 .directive('mgLicensesForm', function() {
    return {
      templateUrl: "/partials/licenses.html",
      scope: {
        licenses: "=",
      }
    };
  })
 */