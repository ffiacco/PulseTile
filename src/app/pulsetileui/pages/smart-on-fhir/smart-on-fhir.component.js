let templateSmartOnFhir = require('./smart-on-fhir.html');

class SmartOnFhirController {
    constructor($scope, $state, $stateParams, $ngRedux, $location, patientsActions, serviceRequests, usSpinnerService) {
        serviceRequests.publisher('headerTitle', {title: 'Smart On FHIR'});
        serviceRequests.publisher('routeState', {state: $state.router.globals.current.views, breadcrumbs: $state.router.globals.current.breadcrumbs, name: 'smart-on-fhir'});
    
        var $dropbtn = $('.dropbtn');
        $dropbtn.on('click', function() {
            $("#myDropdown").toggleClass("show");
        });

        var $dropdownElement = $('.list-group-item');
        $dropdownElement.on('click', function(){
              $(".app-container").attr('src', $(this).attr('data-url'));
              $(".chart-title").html($(this).attr('data-name'));
        });

        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {

                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

        this.goToSection = function (state) {
            $state.go(state, {
                patientId: $stateParams.patientId
            });
        };

        $scope.go = function (state) {
            var headerRequest = {};
            headerRequest.patientId = $stateParams.patientId;
      
            $state.go(state +'-detail', headerRequest);
        };

        let unsubscribe = $ngRedux.connect(state => ({
            patient: this.setCurrentPageData(state.patientsGet.data)
        }))(this);
      
        $scope.$on('$destroy', unsubscribe);
      }
    
}

const SmartOnFhirComponent = {
    template: templateSmartOnFhir,
    controller: SmartOnFhirController
  };
  
  SmartOnFhirController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', '$location', 'patientsActions', 'serviceRequests', 'usSpinnerService'];
  export default SmartOnFhirComponent;