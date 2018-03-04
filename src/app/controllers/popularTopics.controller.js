(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .controller('PopularTopicsController', ['backendService','$log','$scope', PopularTopicsController]);

  /** @ngInject */
  function PopularTopicsController(backendService,$log,$scope) {
    var that = this;
    that.topicsName = null;
    that.topicsWithDescription = [];

    var getPopularTopicsList = function() {
      backendService.getPopularTopics()
        .success(function (data) {
          that.topicsName = data;
          that.getPopularTopicsDescription(data);
        })
        .error(function () {

        });
    };

    that.getPopularTopicsDescription = function(topicsList){
      for(var i in topicsList) {
        backendService.getTopicDescription(topicsList[i].title)
          .success(function(data) {
            that.topicsWithDescription.push({title:data.title,content:data.content});
          })
          .error(function(){
            //TODO: error returned
          });
        //that.topicsWithDescription.push(topicsList[i].title);
      }
    };

    getPopularTopicsList();

    };
})();
