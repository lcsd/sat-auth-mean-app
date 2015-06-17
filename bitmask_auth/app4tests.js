/*jshint browser: true, devel: true, indent: 2*/
/*globals bmAuth*/

var app = angular.module('myApp', ['checklist-model']);

// links: https://github.com/lcsd/sat-auth-mean-app
// links: http://plnkr.co/edit/3YNLsyoG4PIBW6Kj7dRK?p=preview
// links: http://stackoverflow.com/questions/14514461/how-can-angularjs-bind-to-list-of-checkbox-values

app.controller('Ctrl1', function($scope) {
  $scope.all_roles =
  bmAuth.config(
    'blog,wiki,rsvd1,rsvd2' + // ui routing
    ',coord,sao,rio,nyc'      // data access
  );
  $scope.roles = bmAuth.toArray(-1); // -1: all roles mask
  $scope.user = {
    roles: ['admin', 'user', 'coord', 'sao']
  };
  $scope.checkAll = function() {
    $scope.user.roles = angular.copy($scope.roles);
  };
  $scope.uncheckAll = function() {
    $scope.user.roles = [];
  };
  $scope.checkFirst2 = function() {
    $scope.user.roles = ['admin', 'user'];
  };
});
