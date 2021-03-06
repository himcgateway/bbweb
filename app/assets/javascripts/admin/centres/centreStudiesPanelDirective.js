define(['angular', 'underscore'], function(angular, _) {
  'use strict';

  /**
   * This directive allows the user to link a center to one or more study.
   */
  function centreStudiesPanelDirective() {
    return {
      require: '^tab',
      restrict: 'EA',
      scope: {
        centre:        '=',
        centreStudies: '=',
        studyNames:    '='
      },
      templateUrl: '/assets/javascripts/admin/centres/studiesPanel.html',
      controller: 'CentreStudiesPanelCtrl as vm'
    };
  }

  CentreStudiesPanelCtrl.$inject = [
    '$scope',
    'Panel',
    'Study',
    'StudyViewer',
    'tableService',
    'modalService'
  ];

  /**
   *
   */
  function CentreStudiesPanelCtrl($scope,
                                  Panel,
                                  Study,
                                  StudyViewer,
                                  tableService,
                                  modalService) {

    var vm = this;

    var panel = new Panel('centre.panel.studies');

    vm.centre         = $scope.centre;
    vm.studyNames     = $scope.studyNames;
    vm.studyNamesById = [];
    vm.tableStudies   = [];

    vm.remove         = remove;
    vm.information    = information;
    vm.panelOpen      = panel.getPanelOpenState();

    vm.selected = undefined;
    vm.onSelect = onSelect;

    vm.centre.studyIds = _.union(vm.centre.studyIds, $scope.centreStudies);

    init();

    //--

    function init() {
      $scope.$watch(angular.bind(vm, function() { return vm.panelOpen; }),
                    angular.bind(panel, panel.watchPanelOpenChangeFunc));

      vm.studyNamesById = _.indexBy(vm.studyNames, 'id');

      _.each(vm.centre.studyIds, function (studyId) {
        vm.tableStudies.push(vm.studyNamesById[studyId]);
      });

      vm.tableParams = tableService.getTableParamsWithCallback(getTableData, {}, {counts: []});
    }

    function getTableData() {
      return vm.tableStudies;
    }

    function onSelect(item) {
      // add the study only if it's not there
      if(_.indexOf(vm.centre.studyIds, item.id) < 0) {
        vm.centre.addStudy(item).then(function () {
          vm.tableStudies.push(vm.studyNamesById[item.id]);
          vm.tableParams.reload();
        });
      }
      vm.selected = undefined;
    }

    function information(studyId) {
      return Study.get(studyId).then(function (study) {
        vm.studyNamesById[study.id] = study;
        return new StudyViewer(study);
      });
    }

    function remove(studyId) {
      // FIXME should not allow study to be removed if centre holds specimens for study
      var modalOptions = {
        closeButtonText: 'Cancel',
        headerHtml: 'Remove study',
        bodyHtml: 'Are you sure you want to remove study ' + vm.studyNamesById[studyId].name + '?'
      };

      modalService.showModal({}, modalOptions).then(function () {
        return vm.centre.removeStudy({id: studyId})
          .then(function () {
            vm.tableStudies = _.without(vm.tableStudies, vm.studyNamesById[studyId]);
            vm.tableParams.reload();
          })
          .catch(removeFailed);
      });

      function removeFailed(error) {
        var modalOptions = {
          closeButtonText: 'Cancel',
          headerHtml: 'Remove failed',
          bodyHtml: 'Could not remove study: ' + error
        };

        modalService.showModal({}, modalOptions);
      }
    }

  }

  return {
    directive: centreStudiesPanelDirective,
    controller: CentreStudiesPanelCtrl
  };
});
