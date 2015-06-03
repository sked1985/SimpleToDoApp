// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var exampleApp = angular.module('starter', ['ionic', 'firebase']);

exampleApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    fb = new Firebase("https://todosked.firebaseio.com/");
  });
})

exampleApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('todo', {
        url: '/todo',
        templateUrl: 'templates/todo.html',
        controller: 'TodoController'
    });
    $urlRouterProvider.otherwise('/login');
})

exampleApp.controller("LoginController", function($scope, $firebaseAuth, $location) {

    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }

})


exampleApp.controller("TodoController", function($scope, $firebaseObject, $ionicPopup) {

    $scope.list = function() {
        fbAuth = fb.getAuth();
        if(fbAuth){
          var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
          syncObject.$bindTo($scope, "data");
        }
    }

    $scope.create = function() {
        $ionicPopup.prompt({
          title: 'Enter a new TODO item',
          inputType: 'text'
        })
        .then(function(result){
          if(result !== ""){
            if($scope.data.hasOwnProperty("todos")!==true){
              $scope.data.todos = [];
            }
            $scope.data.todos.push({title: result});
          }else{
            console.log("Action not completed");
          }
        });
    }

});
