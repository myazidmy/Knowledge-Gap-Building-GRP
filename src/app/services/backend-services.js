'use strict';

(function () {

    function BackendService($http) {
        this.getPopularTopics = function () {
            return $http.get('https://g52grp-server-staging.herokuapp.com/topic/popular');
        };

        this.getTopicDescription = function(topic) {
            return $http.get('https://g52grp-server-staging.herokuapp.com/topic/description?topic=' + topic);
        };

        this.getSimilarTopics = function(topic) {
            return $http.get('https://g52grp-server-staging.herokuapp.com/topic/similar?topic=' + topic);
        };
        
        this.getTreeTopics = function(topic){
            return $http.get('https://g52grp-server-staging.herokuapp.com/tree/build?topic='+topic+'&username=username');
        };

        return this;
    }

    angular
        .module('kgbStatics')
        .service('backendService', ['$http', BackendService]);
})();