/**
 *	Copyright (C) 2016 3D Repo Ltd
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as
 *	published by the Free Software Foundation, either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	angular.module("3drepo")
		.component("login", {
			restrict: "EA",
			templateUrl: "templates/login.html",
			bindings: {
				loginMessage : "<" 
			},
			controller: LoginCtrl,
			controllerAs: "vm"
		});

	LoginCtrl.$inject = ["$scope", "$location", "AuthService", "EventService", "ClientConfigService", "APIService"];

	function LoginCtrl($scope, $location, AuthService, EventService, ClientConfigService, APIService) {
		var vm = this;

		/*
		 * Init
		 */
		vm.$onInit = function() {
			vm.version = ClientConfigService.VERSION;
			vm.userNotice = ClientConfigService.userNotice;
			vm.loggingIn = false;

			// Set a custom login message if there is one
			if (!vm.loginMessage) {
				vm.loginMessage = "Welcome to 3D Repo";
			}
			
		};

		vm.handleLogin = function() {
			vm.errorMessage = "";
			vm.loggingIn = true;
			AuthService.login(vm.user.username, vm.user.password)
				.then(function(){
					vm.loggingIn = false;
				})
				.catch(function(){
					vm.loggingIn = false;
				});
		};

		/**
		 * Attempt to login
		 *
		 * @param {Object} event
		 */
		vm.login = function(event) {
			var enterKey = 13;

			if (angular.isDefined(event)) {
				if (event.which === enterKey) {
					vm.handleLogin();
				}
			} else {
				if (vm.user && vm.user.username && vm.user.password) {
					vm.handleLogin();
				} else {

					vm.errorMessage = "Username and/or password not provided";
					if (vm.user && vm.user.password && !vm.user.username) {
						vm.errorMessage = "Username not provided";
					} else if (vm.user && vm.user.username && !vm.user.password) {
						vm.errorMessage = "Password not provided";
					}
					
				}

					
			}
		};

		/*
		 * Event watch
		 */
		$scope.$watch(EventService.currentEvent, function(event) {

			
			if (event.type === EventService.EVENT.USER_LOGGED_IN) {
				// Show an error message for incorrect login
				if (!event.value.initialiser && event.value.hasOwnProperty("error")) {
					if (event.value.error.status === 500) {
						vm.errorMessage = "There is currently a problem with the system. Please try again later.";
					} else {
						vm.errorMessage = APIService.getErrorMessage(event.value.error);
					}
				}
			}
		});
		
	}
}());
