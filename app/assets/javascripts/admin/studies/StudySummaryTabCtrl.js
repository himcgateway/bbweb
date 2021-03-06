define(['underscore'], function(_) {
  'use strict';

  StudySummaryTabCtrl.$inject = [
    '$state',
    'modalService',
    'study'
  ];

  /**
   * Displays the study administrtion page, with a number of tabs. Each tab displays the configuration
   * for a different aspect of the study.
   */
  function StudySummaryTabCtrl($state,
                               modalService,
                               study) {
    var validStatusActions = ['disable', 'enable', 'retire', 'unretire'],
        vm = this;

    vm.study = study;
    vm.descriptionToggleLength = 100;
    vm.changeStatus = changeStatus;

    //--

    function changeStatus(statusAction) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        headerHtml: 'Confirm study ',
        bodyHtml: 'Are you sure you want to '
      };

      if (!_.contains(validStatusActions, statusAction)) {
        throw new Error('invalid status: ' + statusAction);
      }

      modalOptions.headerHtml += statusAction;
      modalOptions.bodyHtml += statusAction + ' study ' + vm.study.name + '?';

      modalService.showModal({}, modalOptions).then(function () {
        vm.study[statusAction]().then(function (study) {
          vm.study = study;
        });
      });
    }
  }

  return StudySummaryTabCtrl;
});
