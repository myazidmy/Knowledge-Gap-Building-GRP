//indexroute
(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/description=:id', {
        templateUrl: 'app/views/description.html',
        controller: 'DescriptionController',
        controllerAs: 'descCtrl'
      })
      .when('/description=:id#topic', {
        templateUrl: 'app/views/description.html',
        controller: 'DescriptionController',
        controllerAs: 'descCtrl'
      })
     .when('/register', {
        templateUrl: 'app/views/register.html',
        controller: 'RegisterController',
        controllerAs: 'regCtrl'
      })
     .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginController',
        controllerAs: 'logCtrl'
      })
    .when('/forgotpassword', {
        templateUrl: 'app/views/forgotPassword.html',
        controller: 'ForgotController',
        controllerAs: 'forCtrl'
      })
    .when('/userprofile', {
        templateUrl: 'app/views/userProfile.html',
        controller: 'UserProfileController',
        controllerAs: 'userProfileCtrl'
      })
      .when('/populartopics', {
        templateUrl: 'app/views/popularTopics.html',
        controller: 'PopularTopicsController',
        controllerAs: 'popCtrl'
      })
      .when('/aboutus', {
        templateUrl: 'app/views/aboutUs.html',
        controller: 'AboutUsController',
        controllerAs: 'abtCtrl'
      })
     .when('/mytrees', {
        templateUrl: 'app/views/myTrees.html',
        controller: 'MyTreesController',
        controllerAs: 'treesCtrl'
      })
      .when('/relatedtopics=:id', {
        templateUrl: 'app/views/relatedTopics.html',
        controller: 'RelatedTopicsController',
        controllerAs: 'relCtrl'
      })
      .when('/termsAndConditions',{
        templateUrl: 'app/views/termsAndConditions.html'
      })
      .when('/treebuilder', {
        templateUrl: 'app/views/treebuilder.html',
        controller: 'TreeBuilderController',
        controllerAs: 'treeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
