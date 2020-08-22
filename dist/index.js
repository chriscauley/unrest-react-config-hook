"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _useGlobalHook = _interopRequireDefault(require("use-global-hook"));

var _storage = _interopRequireDefault(require("@unrest/storage"));

var _reactJsonschemaForm = _interopRequireDefault(require("@unrest/react-jsonschema-form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var initial = options.initial,
      schema = options.schema,
      uiSchema = options.uiSchema,
      actions = options.actions,
      _options$propName = options.propName,
      propName = _options$propName === void 0 ? 'config' : _options$propName;
  var og_propName = propName;
  var storage = new _storage["default"]('app_config__' + name);
  var base_actions = {
    save: function save(store, data) {
      Object.keys(data).forEach(function (key) {
        return storage.set(key, data[key]);
      });
      store.setState(data);
      store.actions.onSave(data);
    },
    onSave: function onSave() {}
  };

  var initialState = _objectSpread({}, initial);

  storage.keys.forEach(function (key) {
    initialState[key] = storage.get(key);
  });
  var makeHook = (0, _useGlobalHook["default"])(_react["default"], initialState, _objectSpread(_objectSpread({}, base_actions), actions));

  var useConfig = function useConfig() {
    var _makeHook = makeHook(),
        _makeHook2 = _slicedToArray(_makeHook, 2),
        state = _makeHook2[0],
        actions = _makeHook2[1];

    return _objectSpread(_objectSpread({
      schema: schema,
      uiSchema: uiSchema
    }, state), {}, {
      actions: actions
    });
  };

  var connect = function connect(Component) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$propName = _ref.propName,
        propName = _ref$propName === void 0 ? og_propName : _ref$propName;

    return function ConfigProvider(props) {
      return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, _defineProperty({}, propName, useConfig())));
    };
  };

  function ConfigForm(props) {
    var _useConfig = useConfig(),
        schema = _useConfig.schema,
        uiSchema = _useConfig.uiSchema,
        formData = _useConfig.formData,
        actions = _useConfig.actions;

    var _React$useState = _react["default"].useState(formData),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        state = _React$useState2[0],
        setState = _React$useState2[1];

    var onSubmit = function onSubmit(formData) {
      actions.save({
        formData: formData
      });
      props.onSubmit && props.onSubmit({
        formData: formData
      });
    };

    var onChange = function onChange(formData) {
      props.onChange && props.onChange(formData);
      setState(formData);
    };

    return /*#__PURE__*/_react["default"].createElement(_reactJsonschemaForm["default"], _extends({}, props, {
      formData: state,
      schema: schema,
      uiSchema: uiSchema,
      onSubmit: onSubmit,
      onChange: onChange
    }));
  }

  connect.useConfig = useConfig;
  connect.Form = ConfigForm;
  return connect;
};

exports["default"] = _default;