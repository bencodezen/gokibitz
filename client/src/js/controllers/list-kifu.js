angular.module('gokibitz.controllers')
	.controller('ListKifuController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
		console.log('list kifu control');
		$scope.index = 0;
		$scope.kifu = [];
		$scope.listKifu = function (replace) {
			if (typeof replace === 'undefined') {
				replace = false;
			}
			console.log('replace?', replace);
			console.log('listing kifu, starting with', $scope.index)
			var url;
			if ($scope.currentUser) {
				url = '/api/user/' + $scope.currentUser.username + '/kifu';
			} else {
				url = '/api/kifu';
			}

			var params = {
				offset: $scope.index
			};

			//console.log('scope.search?', $scope.search);
			if ($scope.search && $scope.search.length > 2) {
				params.search = $scope.search;
				//replace = true;
				console.log('and searching for', $scope.search);
			}

			$http.get(url, {
				params: params
			})
				.success(function (data) {
					//console.log('data', data);
					if (!replace) {
						$scope.kifu = $scope.kifu.concat(data.kifu);
					} else {
						$scope.kifu = data.kifu;
					}
					$scope.total = data.total;
					//$scope.comments = data.comments;
				})
				.error(function (data) {
					console.log('Error:', data);
				});
		};

		$scope.moreKifu = function () {
			console.log('moar kifu');
			$scope.index += $scope.kifu.length;
			$scope.listKifu(false);
		};

		var searchTimeout;
		$scope.searchKifu = function () {
			//console.log('resetting scope index from', $scope.index);
			$scope.index = 0;
			//console.log('...to', $scope.index);
			console.log('searching kifu');

			if ($scope.searched !== $scope.search) {
				$scope.searched = $scope.search;
				clearTimeout(searchTimeout);
				searchTimeout = setTimeout(function () {
					$scope.listKifu(true);
				}, 200);
			}
			//if ($scope.search && $scope.search.length > 2) {
			//}
		};

		$scope.deleteKifu = function (kifu) {
			$http.delete('/api/kifu/' + kifu._id)
				.success(function (data) {
					//console.log('success', data);
					for (var i = $scope.kifu.length - 1; i >= 0; i -= 1) {
						var item = $scope.kifu[i];
						if (item._id === kifu._id) {
							console.log('delete!!!');
							$scope.kifu.splice(i, 1);
						}
					}
				})
				.error(function (data) {
					console.log('Error:', data);
				});

		};

		$scope.go = function (shortid) {
			$location.path('/kifu/' + shortid);
		};

		$scope.listKifu();
	}]);
