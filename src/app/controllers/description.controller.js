(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .controller('DescriptionController', ['backendService','$location','$log','$routeParams','$scope', DescriptionController]);

  function DescriptionController(backendService,$log,$scope,$routeParams,$location) {
      var that = this;

      that.descriptionTopic = null;
      that.currentTopic = null;
      that.topicsWithDescription = [];
      that.topicList = [];

      that.updateDescriptionTopic = function(){
        that.currentTopic = $routeParams.id;
        if(that.descriptionTopic == null){
          backendService.getTopicDescription($routeParams.id)
				     .success(function(data) {
					     that.descriptionTopic = data;
               that.updateTopicTree($routeParams.id);
             })
				     .error(function(){
					     //TODO: error returned
				     });
          }
		  };

      that.updateTopicTree = function(currentTopic){
        backendService.getTreeTopics(currentTopic)
                .success(function(data){
                    traverse(data);
                    that.getTopicsDescription(that.topicList);
                })
                .error(function(){
                    that.topicList.push(that.currentTopic);
                })
      };

      var traverse = function(jsonObj){
          if( typeof jsonObj == "object" ) {
              $.each(jsonObj, function(k,v) {
                  // k is either an array index or object key
                  if('string' == typeof k){
                      that.topicList.push(k);
                  }
                  traverse(v);
              });
          }
      }

      that.getTopicsDescription = function(topicsList){
          for(var n = 0; n<topicsList.length;n++){
            if(n != null){
              backendService.getTopicDescription(topicsList[n])
                .success(function(data) {
                  that.topicsWithDescription.push({title:data.title,content:data.content});
                })
                .error(function(){
                  //TODO: error returned
                });
            }
          }
      };
      //
      //that.setCurrentTopic = function(){
      //  for(var n in that.topicsWithDescription){
      //    if(n.title === $route.params.topic){
      //      that.descriptionTopic = n;
      //    }
      //  }
      //}



      that.updateDescriptionTopic();
      //that.updateTopicTree(that.currentTopic);
      //that.getTopicsDescription(that.topicList);
      //the page reloads everytime we click a link
      // so now need to avoid the refresh and set the description content to the link that was clicked

  };
})();
