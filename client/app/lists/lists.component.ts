'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './lists.routes';

export class ListsComponent {
  $http;
  socket;
  
  myLists = [];
  newList = '';

  Auth;  
  loggedUser;
  
  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    
    this.Auth = Auth;
    this.loggedUser = this.Auth.getCurrentUserSync();

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('list');
    });   

    console.log('Id of user: ' + this.loggedUser._id );  
    
    //user = $scope.getCurrentUser().then()(function(result){
      //console.log('test' + user._id);  
      //return result;
   /// });
  }

  $onInit() {
    var vm = this;

    this.$http.get('/api/lists/' + this.loggedUser._id + '/lists').then(response => {
      this.myLists = response.data;
      this.socket.syncUpdates('list', this.myLists);
    });
  }

  addList() {
    if (this.newList) {
      this.$http.post('/api/lists', { name: this.newList, info: "", owner: this.loggedUser._id });
      this.newList = '';
    }
  }

  deleteList(list) {
    this.$http.delete('/api/lists/' + list._id);
  }
}

export default angular.module('webappno1App.lists', [uiRouter])
  .config(routes)
  .component('lists', {
    template: require('./lists.html'),
    controller: ListsComponent
  })
  .name;
