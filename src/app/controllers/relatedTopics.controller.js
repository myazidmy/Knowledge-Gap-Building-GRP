(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .controller('RelatedTopicsController', ['backendService','$routeParams', '$log','$scope', RelatedTopicsController]);

  /** @ngInject */
  function RelatedTopicsController(backendService,$routeParams,$log,$scope) {
    var that = this;
      that.topicInput = null;
    that.similarTopics = null;
      that.similarTopicsList = [];
    that.filteredArray = [];
      that.matches;
      that.testVariable = 'Done';
      that.testArray = [];
      $scope.states = [];

      
      
      that.searchInput = $routeParams.id;
       that.relatedTopicsName = null;
    that.relatedTopicsWithDescription = [];
      
      
      
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
      
    
        var getRelatedTopicsList = function() {
      backendService.getSimilarTopics(that.searchInput)
        .success(function (data) {
          that.relatedTopicsName = data;
          that.getRelatedTopicsDescription(that.relatedTopicsName);
        })
        .error(function () {

        });
    };
      
      
    that.getRelatedTopicsDescription = function(relatedTopicsList){
      for(var i in relatedTopicsList)
      {
        backendService.getTopicDescription(relatedTopicsList[i].title)
          .success(function(data) {
            that.relatedTopicsWithDescription.push({title:data.title,content:data.content});
          })
          .error(function(){
            //TODO: error returned
          });
        //that.topicsWithDescription.push(topicsList[i].title);
      }
    };

    getRelatedTopicsList();
  }
    
})();
