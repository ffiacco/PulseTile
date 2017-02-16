/*
 ~  Copyright 2016 Ripple Foundation C.I.C. Ltd
 ~  
 ~  Licensed under the Apache License, Version 2.0 (the "License");
 ~  you may not use this file except in compliance with the License.
 ~  You may obtain a copy of the License at
 ~  
 ~    http://www.apache.org/licenses/LICENSE-2.0

 ~  Unless required by applicable law or agreed to in writing, software
 ~  distributed under the License is distributed on an "AS IS" BASIS,
 ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~  See the License for the specific language governing permissions and
 ~  limitations under the License.
 */
let templateGenericMdtList = require('./generic-mdt-list.html');

class GenericMdtListController {
  constructor($scope, $state, $stateParams, $ngRedux, genericmdtActions, serviceRequests, usSpinnerService) {
    serviceRequests.publisher('routeState', {state: $state.router.globals.current.views, breadcrumbs: $state.router.globals.current.breadcrumbs, name: 'patients-details'});
    serviceRequests.publisher('headerTitle', {title: 'Patients Details'});

    this.isShowCreateBtn = $state.router.globals.$current.name !== 'genericMdt-create';
    this.isShowExpandBtn = $state.router.globals.$current.name !== 'genericMdt';

    // $scope.search = function (row) {
    //   return (
    //     angular.lowercase(row.dateOfRequest).indexOf(angular.lowercase(this.query) || '') !== -1 ||
    //     angular.lowercase(row.serviceTeam).indexOf(angular.lowercase(this.query) || '') !== -1 ||
    //     angular.lowercase(row.dateOfMeeting).indexOf(angular.lowercase(this.query) || '') !== -1 ||
    //     angular.lowercase(row.source).indexOf(angular.lowercase(this.query) || '') !== -1
    //   );
    // };

    this.go = function (id) {
      $state.go('genericMdt-detail', {
        patientId: $stateParams.patientId,
        detailsIndex: id,
        page: $scope.currentPage || 1
      });
    };

    this.create = function () {
      $state.go('genericMdt-create', {
        patientId: $stateParams.patientId
      });
    };

    this.setCurrentPageData = function (data) {
      if (data.patientsGet.data) {
        this.currentPatient = data.patientsGet.data;
        usSpinnerService.stop('patientSummary-spinner');
      }
      if (data.genericmdt.data) {
        this.genericMdtComposition = data.genericmdt.data;

        for (var i = 0; i < this.genericMdtComposition.length; i++) {
          this.genericMdtComposition[i].dateOfRequest = moment(this.genericMdtComposition[i].dateOfRequest).format('DD-MMM-YYYY');
          this.genericMdtComposition[i].dateOfMeeting = moment(this.genericMdtComposition[i].dateOfMeeting).format('DD-MMM-YYYY');
        }
      }
      if (serviceRequests.currentUserData) {
        this.currentUser = serviceRequests.currentUserData;
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);

    $scope.$on('$destroy', unsubscribe);

    this.genericmdtLoad = genericmdtActions.all;
    this.genericmdtLoad($stateParams.patientId);
  }
}

const GenericMdtListComponent = {
  template: templateGenericMdtList,
  controller: GenericMdtListController
};

GenericMdtListController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'genericmdtActions', 'serviceRequests', 'usSpinnerService'];
export default GenericMdtListComponent;