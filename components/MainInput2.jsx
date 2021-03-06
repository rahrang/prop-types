import React, { Component } from 'react';
import _ from 'lodash';
import safeEval from 'safe-eval';

import { USER_EX } from '../constants';

const JSON_FUNCTION_MESSAGE =
  'i-am-a-function__7bf91f73-bed4-44bc-8aed-f5c08d89dc6c';
const JSON_REGEXP_MESSAGE = 'i-am-regexp__b768715d-4241-482d-b738-bef5ffc2b64f';

const STRING = 'string';
const NUMBER = 'number';
const BOOLEAN = 'boolean';
const FUNCTION = 'function';
const NULL = 'null';
const UNDEFINED = 'undefined';
const REGEXP = 'regexp';
const DATE = 'date';

const PTMAP = {
  [STRING]: STRING,
  [NUMBER]: NUMBER,
  [BOOLEAN]: BOOLEAN,
  [FUNCTION]: FUNCTION,
  [NULL]: NULL,
  [UNDEFINED]: UNDEFINED,
  [REGEXP]: REGEXP,
  [DATE]: DATE
};

Function.prototype.toJSON = function() {
  return JSON_FUNCTION_MESSAGE;
};

RegExp.prototype.toJSON = function() {
  return JSON_REGEXP_MESSAGE;
};

export default class JSONInput extends Component {
  state = {
    valueAsJS: USER_EX,
    valueAsJSON: JSON.stringify(USER_EX, null, 2),
    hasError: false
  };

  parseValue = value => {
    if (_.isString(value)) return STRING;
    if (_.isNumber(value)) return NUMBER;
    if (_.isBoolean(value)) return BOOLEAN;
    if (_.isFunction(value)) return FUNCTION;
    if (_.isNull(value)) return NULL;
    if (_.isUndefined(value)) return UNDEFINED;
    if (_.isDate(value)) return DATE;
    if (_.isRegExp(value)) return REGEXP;

    if (_.isArray(value)) {
      return _.map(value, v => this.parseValue(v));
    }
    if (_.isObject(value)) {
      const res = {};
      _.forEach(value, (v, k) => {
        res[k] = this.parseValue(v);
      });
      return res;
    }

    return 'I DONT KNOW';
  };

  onValueChange = event => {
    const {
      target: { value }
    } = event;
    if (_.isEmpty(value)) {
      this.setState({
        valueAsJS: '',
        valueAsJSON: '',
        hasError: false
      });
    } else {
      try {
        const valueAsJS = JSON.parse(value);
        const valueAsJSON = JSON.stringify(valueAsJS, null, 2);
        // if we get past this point, it means `value` is JSON
        // as valueObj has successfully been set as a JavaScript object
        this.setState({
          valueAsJS,
          valueAsJSON,
          hasError: false
        });
      } catch (err1) {
        console.log('err1');
        if (err1.name === 'SyntaxError') {
          // the input might be a JavaScript Object, not JSON
          try {
            const valueAsJS = safeEval(value);
            try {
              const valueAsJSON = JSON.stringify(valueAsJS, null, 2);
              this.setState({
                valueAsJS,
                valueAsJSON,
                hasError: false
              });
            } catch (err3) {
              console.log('err3');
              this.setState({ hasError: true });
            }
          } catch (err2) {
            console.log('err2');
            this.setState({ hasError: true });
          }
        }
      }
    }
  };

  render() {
    const { valueAsJS, valueAsJSON, hasError } = this.state;

    return (
      <div>
        <textarea
          style={{ width: 400, height: 300 }}
          onChange={this.onValueChange}
        >
          {valueAsJSON}
        </textarea>
        {hasError ? (
          <div>
            <p>There is a problem with the input.</p>
          </div>
        ) : (
          <div>
            <pre>{JSON.stringify(this.parseValue(valueAsJS), null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
}
