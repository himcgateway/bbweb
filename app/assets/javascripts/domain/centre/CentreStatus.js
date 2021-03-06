define([], function() {
  'use strict';

  //CentreStatus.$inject = [];

  /**
   *
   */
  function CentreStatus() {
    var ALL_VALUES = [
      DISABLED(),
      ENABLED()
    ];

    var service = {
      DISABLED: DISABLED,
      ENABLED:  ENABLED,

      values:    values
    };
    return service;

    //-------

    function DISABLED() { return 'Disabled'; }
    function ENABLED()  { return 'Enabled'; }

    function values()    { return ALL_VALUES; }
  }

  return CentreStatus;
});
