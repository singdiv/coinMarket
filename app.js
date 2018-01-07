
'use strict';
angular.module('RoutingApp',['ui.router'])
.controller('MainCtrl',MainCtrl)
.controller('DetailCtrl',DetailCtrl)
.controller('ChangeCurrencyCtrl',ChangeCurrencyCtrl)
.controller('ChangeCurrencyCtrl1',ChangeCurrencyCtrl1)
.factory('CoinMarketServcie',CoinMarketServcie)
.service('NotesService',NotesService)
.config(RoutesConfig);

CoinMarketServcie.$inject=['$http'];
function CoinMarketServcie($http){

    return $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=20&convert=INR');
  };
function NotesService(){
  var service = this;
  var notes = [];
  service.pushNotes = function (ItemName,id){
    notes[id]=ItemName;
    // console.log(notes);
  };

service.getNotes=function(){
  return notes;
};
};


RoutesConfig.$inject= ['$qProvider','$stateProvider','$urlRouterProvider'];
function RoutesConfig($qProvider,$stateProvider,$urlRouterProvider){
$qProvider.errorOnUnhandledRejections(false);
$stateProvider
.state('home',{
  url: '/',
  controller: 'MainCtrl',
  templateUrl: 'home.html',
})
.state('currency',{
  url: '/',
  templateUrl: 'ChangeCurrency.html',
  controller: 'ChangeCurrencyCtrl'
})
.state('currency1',{
  url: '/',
  templateUrl: 'usd.html',
  controller: 'ChangeCurrencyCtrl1'
})
.state('detail',{
   url: '/{id}',
   // views:{
   //   'view2@home':{templateUrl: 'detail.html'}
   // },
   templateUrl:'detail.html',
  controller: 'DetailCtrl',
  params:{
    index: null
  }
 });
// // // //Redirect to default url
 $urlRouterProvider.otherwise('/');
};

MainCtrl.$inject=['$http','CoinMarketServcie','NotesService','$state'];
function MainCtrl($http,CoinMarketServcie,NotesService,$state){
  var self= this;
    self.items={};
    self.notes=[];
    self.FinalList=[];
    self.buttonState='INR';
    self.options = [
                  { label: 'INR', value: 'INR' },
                  { label: 'EUR', value: 'EUR' },
                  { label: 'USD', value: 'USD' }
                ];
    $state.go('home', {
      currency: self.buttonState
       //selectedItem and id is defined
    });

  CoinMarketServcie.then(function(response){
    self.items=response.data;
    console.log(self.items);
  },function(errResponse){
    console.log('Cant fetch data');
  });
  self.notes=NotesService.getNotes();
  // console.log(self.notes);
  console.log('HEYYY'+NotesService.getNotes());
  // self.items=
  // console.log(CoinMarketServcie.mainList);
  // console.log(self.items);
};
// when a row is selected

DetailCtrl.$inject=['$http','$stateParams','NotesService'];
function DetailCtrl($http,$stateParams,NotesService){
  var self= this;
  var passingIndex='';
  self.msg='';
   self.items1=[];
   self.index='';
   $http.get('https://api.coinmarketcap.com/v1/ticker/'+$stateParams.id+'/').then(function (response){
     self.items1= response.data;
   },function (errResponse){

     console.log("Error while fetching data");
   });
  self.index=$stateParams.index;//index of item clicked

  self.addNotes=function(){
  passingIndex=self.index-1;
  NotesService.pushNotes(self.msg,passingIndex);
}

};


ChangeCurrencyCtrl.$inject=['$http','$stateParams'];
function ChangeCurrencyCtrl($http,$stateParams){
  var self= this;
   self.items=[];
   $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=20&convert=EUR').then(function (response){
     self.items= response.data;
   },function (errResponse){

     console.log("Error while fetching data");
   });
  // console.log(self.items);
};

ChangeCurrencyCtrl1.$inject=['$http','$stateParams'];
function ChangeCurrencyCtrl1($http,$stateParams){
  var self= this;
   self.items=[];
   $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=20&convert=USD').then(function (response){
     self.items= response.data;
   },function (errResponse){

     console.log("Error while fetching data");
   });
  // console.log(self.items);
};
