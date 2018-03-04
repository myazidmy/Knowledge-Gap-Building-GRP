(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .controller('MainController', ['backendService','$log','$scope', MainController]);

  /** @ngInject */
  function MainController(backendService,$log,$scope) {
    var that = this;
    that.topicInput = null;
    that.similarTopics = null;
      that.similarTopicsList = [];
    that.filteredArray = [];
      that.matches;
      that.testVariable = 'Done';
      that.testArray = [];
      $scope.states = [];


        $scope.$watch('selected',function(){

            backendService.getSimilarTopics($scope.selected)
                .success(function (data) {
                $scope.states = [];
                    that.similarTopics = data;
                    that.similarTopicsList=[];
//                    that.loopSimilarTopics(data);
                    $.each(data, function(key, value) {
            that.similarTopicsList.push(value["title"]);
          });
          $scope.states = that.similarTopicsList;
//                     that.substringMatcher(filteredArray);
                })
                .error(function () {
                    //TODO what if error is returned?
                });
        });
      
      $scope.$watch('topicInput',function(){

            backendService.getSimilarTopics($scope.topicInput)
                .success(function (data) {
                $scope.states = [];
                    that.similarTopics = data;
                    that.similarTopicsList=[];
//                    that.loopSimilarTopics(data);
//                     that.substringMatcher(filteredArray);
                })
                .error(function () {
                    //TODO what if error is returned?
                });
        });
      
    
//      that.loopSimilarTopics =  function(data) {
//         $.each(data, function(key, value) {
//            that.similarTopicsList.push(value["title"]);
//          });
//          $scope.states = that.similarTopicsList;
//          that.testArray = that.similarTopicsList;
//     }
  };
})();