(function () {
  // Create the function registry if it doesn't exist already
  if (!window.functionRegistry) {
    window.functionRegistry = {};
  }

  // Register a function in the global registry
  function registerFunction(name, func) {
    if (!name || typeof func !== "function") {
      console.error("Invalid function or name");
      return;
    }
    window.functionRegistry[name] = func;
  }

  // Retrieve a function by name from the registry
  function getFunction(name) {
    return window.functionRegistry[name] || null;
  }

  // Expose the functions to the global window object
  window.functionRegistry.register = registerFunction;
  window.functionRegistry.get = getFunction;
})();
