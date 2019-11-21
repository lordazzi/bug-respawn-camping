var __export = () => void (0);
var window = window || global;
const libObject = {};
var define = define || function define(name, argsNames, calle) {
  calle.apply(null, argsNames.map(argName => libObject));
  debugger;
  Object.keys(libObject).forEach(key => {
    if (key !== '__esModule') {
      window[key] = libObject[key];
    }
  });
};
