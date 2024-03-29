'use strict';

function Example(params) {
  params = params || {};

  const packageName = params.packageName;
  const sandboxConfig = params.sandboxConfig;
  const L = params.loggingFactory.getLogger();
  const T = params.loggingFactory.getTracer();

  const errorManager = params.errorManager;

  const errorBuilder = errorManager.register(packageName, {
    errorCodes: sandboxConfig.errorCodes
  });

  console.log('=== Errorlist: %s', JSON.stringify(errorManager.getAllDescriptors(), null, 2));

  const myErrorClass = 'UserNotFound';
  console.log('=== findByErrorClass(%s): %s', myErrorClass,
    JSON.stringify(errorManager.findByErrorClass(myErrorClass), null, 2)
  );

  const myReturnCode = 1001;
  console.log('=== findByReturnCode(%d): %s', myReturnCode,
    JSON.stringify(errorManager.findByReturnCode(myReturnCode), null, 2)
  );
};

Example.referenceHash = {
  errorManager: 'manager'
};

module.exports = Example;
