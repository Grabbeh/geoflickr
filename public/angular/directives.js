angular.module('app')

    .directive('mgMap', function($rootScope) {
    return {
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
          
            scope.$watch(attrs.coords, function(coords){

              if (coords === undefined){
                  return;
              }
              placeMarker(new google.maps.LatLng(coords.lat, coords.lon))
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
                placeMarker(latLon);
            })

            function placeMarker(location) {
                if ($rootScope.marker != undefined){
                    $rootScope.marker.setMap(null);
                }
                $rootScope.marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    flat: true,
                    draggable: true
                });
                map.setCenter(location);
                if (map.getZoom() < 13) {
                    map.setZoom(13)
                }
                google.maps.event.addListener($rootScope.marker, 'dragend', function (event) {
                    var latLon = $rootScope.marker.getPosition();
                    var latLonObject = { lat: latLon.lat(), lon: latLon.lng() };
                    $rootScope.$broadcast('coords.change', latLonObject);
                    map.setCenter(latLon);
                })
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
                 scope.$watch('arrayOfPhotos', function(newVal){
                      if (newVal === undefined){
                          return;
                      }
                      scope.groupOfArrays = [];
                      scope.activePhoto = false;

                      for (var i = 0; i < newVal.length; i+= scope.itemsPerPage) {
                           var slice = newVal.slice(i, i+ scope.itemsPerPage);
                           scope.groupOfArrays.push(slice);
                      }
                      scope.pageNumber = 1;
                      scope.photos = scope.groupOfArrays[0];

                  })

                  scope.$watch('pageNumber', function(newPage){ 
                      if (newPage === 1){
                        return;
                      }
                      scope.photos = scope.groupOfArrays[newPage -1];
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
                    $scope.activePhoto = false;
                };
                $scope.nextPage = function(pageNumber){
                    $scope.pageNumber++;
                    $scope.activePhoto = false;
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
