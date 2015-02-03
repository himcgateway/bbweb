/**
 * Administration package module.

 * Manages all sub-modules so other RequireJS modules only have to import the package.
 */
define([
  './AdminCtrl',
  './adminService',
  './adminStates',
  './pagedItemsListDirective',
  './LocationEditCtrl',
  './centres/CentreEditCtrl',
  './centres/CentreSummaryTabCtrl',
  './centres/CentreCtrl',
  './centres/CentresCtrl',
  './centres/locationsPanelDirective',
  './centres/centreStudiesPanelDirective',
  './centres/states',
  './statusLineDirective',
  './studies/StudyCtrl',
  './studies/StudyEditCtrl',
  './studies/studyModalService',
  './studies/annotationTypes/annotTypeModalService',
  './studies/annotationTypes/AnnotationTypeEditCtrl',
  './studies/annotationTypes/annotationTypeRemoveService',
  './studies/annotationTypes/ceventAnnotTypesPanelDirective',
  './studies/annotationTypes/participantAnnotTypeRemoveService',
  './studies/annotationTypes/participantAnnotTypesPanelDirective',
  './studies/annotationTypes/spcLinkAnnotTypeRemoveService',
  './studies/annotationTypes/spcLinkAnnotTypesPanelDirective',
  './studies/ceventTypes/CeventTypeEditCtrl',
  './studies/ceventTypes/ceventTypeModalService',
  './studies/ceventTypes/ceventTypeRemoveService',
  './studies/ceventTypes/ceventTypesPanelDirective',
  './studies/ceventTypes/states',
  './studies/participants/states',
  './studies/processing/ProcessingTypeEditCtrl',
  './studies/processing/SpcLinkTypeEditCtrl',
  './studies/processing/processingTypeModalService',
  './studies/processing/processingTypeRemoveService',
  './studies/processing/processingTypesPanelDirective',
  './studies/processing/spcLinkTypeModalService',
  './studies/processing/spcLinkTypeRemoveService',
  './studies/processing/spcLinkTypesPanelDirective',
  './studies/processing/states',
  './studies/specimenGroups/SpecimenGroupEditCtrl',
  './studies/specimenGroups/specimenGroupModalService',
  './studies/specimenGroups/specimenGroupRemoveService',
  './studies/specimenGroups/specimenGroupsPanelDirective',
  './studies/specimenGroups/states',
  './studies/states',
  './studies/StudiesCtrl',
  './studies/StudySummaryTabCtrl',
  './studies/studyViewSettingsService',
  './studies/validAmountDirective',
  './studies/validCountDirective',
  './users/UsersTableCtrl',
  './users/UserModalService',
  './users/states'
], function () {});
