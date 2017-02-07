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

let templateClinicalnotesDetail = require('./clinicalnotes-detail.html');

class ClinicalnotesDetailController {
  constructor($scope, $state, $stateParams, $ngRedux, clinicalnotesActions, serviceRequests, usSpinnerService) {
    
    this.setCurrentPageData = function (data) {
      /* istanbul ignore if  */
      if (data.patientsGet.data) {
        this.currentPatient = data.patientsGet.data;
      }
      if (data.personalnotes.dataGet) {
        this.clinicalNote = data.clinicalnotes.dataGet;
        this.dateCreated = moment(this.clinicalNote.dateCreated).format('DD-MMM-YYYY');
        usSpinnerService.stop("clinicalNoteDetail-spinner");
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);

    $scope.$on('$destroy', unsubscribe);

    this.clinicalnotesLoad = clinicalnotesActions.get;
    this.clinicalnotesLoad($stateParams.patientId, $stateParams.personalNoteIndex, $stateParams.source);
  
    //Edit Clinical Note
    
    $scope.isEdit = false;

    /* istanbul ignore next  */
    this.edit = function () {
      $scope.isEdit = true;

      $scope.currentUser = this.currentUser;
      $scope.clinicalNoteEdit = Object.assign({}, this.clinicalNote);
      $scope.patient = this.currentPatient;
      
      $scope.clinicalNoteEdit.dateCreated = new Date(this.clinicalNote.dateCreated).toISOString().slice(0, 10);
    };
    this.cancelEdit = function () {
      $scope.isEdit = false;
    };

    $scope.confirmEdit = function (personalNoteForm, personalNote) {
      $scope.formSubmitted = true;
      /* istanbul ignore if  */
      if (personalNoteForm.$valid) {
        let toUpdate = {
          noteType: personalNote.noteType,
          notes: personalNote.notes,
          author: personalNote.author,
          source: personalNote.source,
          sourceId: personalNote.sourceId
        };
        
        this.personalNote = Object.assign(personalNote, $scope.personalNoteEdit);
        $scope.isEdit = false;
        clinicalnotesActions.update($scope.patient.id, toUpdate);
        setTimeout(function () {
          $state.go('personalNotes-detail', {
            patientId: $scope.patient.id,
            personalNoteIndex: personalNote.sourceId
          });
        }, 1000);
      }
    };
  }
}

const ClinicalnotesDetailComponent = {
  template: templateClinicalnotesDetail,
  controller: ClinicalnotesDetailController
};

ClinicalnotesDetailController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'clinicalnotesActions', 'serviceRequests', 'usSpinnerService'];
export default ClinicalnotesDetailComponent;