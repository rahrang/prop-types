import React, { Component } from 'react';
import _ from 'lodash';
import safeEval from 'safe-eval';

const JSON_FUNCTION_MESSAGE =
  'i-am-a-function__7bf91f73-bed4-44bc-8aed-f5c08d89dc6c';
const JSON_REGEXP_MESSAGE = 'i-am-regexp__b768715d-4241-482d-b738-bef5ffc2b64f';

Function.prototype.toJSON = function() {
  return JSON_FUNCTION_MESSAGE;
};

RegExp.prototype.toJSON = function() {
  return JSON_REGEXP_MESSAGE;
};

export default class JSONInput extends Component {
  state = {
    valueAsJS: '',
    valueAsJSON: '',
    value: {
      string: 'string',
      number: 12,
      object: {
        '1': 1,
        '2': [2, 3, 4],
        '3': {
          hello: 'you'
        }
      },
      array: [1, 2, '3', 4, { 5: 1, 6: 3 }],
      func: () => {
        console.log('func');
      },
      regex: /sdsdf'\g/
    },
    hasError: false
  };

  /**
   * TODO
   * <><><><>
   * - store a `value` in state which is just the value inputted into the textarea
   * - store a `valueAsJSON` in state which is the JSON stringified `value`
   * - when this function is called,
   *   - JSON.parse the `valueAsJSON`
   *   - if switch on the valueAsJSON -- object, array, string, number, boolean, regex, function
   *     - the first two are the most important
   *     - the regex and function must be checked against the JSON_{}_MESSAGE parameter
   *   - for objects and array, recursively map over them and their children
   *     - if an object/array is empty, return PropTypes.object/array
   *     - if an object is not empty, return PropTypes.shape({...children})/PropTypes.arrayOf
   */
  parseValue = () => {
    const { value, hasError } = this.state;
    if (hasError) {
      return null;
    }
    if (_.isObject(value)) {
      return _.map(value, (v, k) => ({ key: k, value: typeof v }));
    } else if (_.isString(value)) {
      return { key: value, value: typeof value };
    } else if (_.isArray(value)) {
      return _.map(value, k => ({ key: k, value: typeof k }));
    } else {
      return typeof value;
    }
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
    debugger;
    /**
     * - values provided as JS are better because we can safeEval them and still keep
     * reference to their internal parts (e.g. function, regexp)
     * - we must parse the `valueAsJS` into their proptypes
     */
    return (
      <div>
        <textarea
          style={{ width: 400, height: 600 }}
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
            <div>
              <h3>Value as JSON</h3>
              <pre>{valueAsJSON}</pre>
            </div>
            <hr />
            <div>
              <h3>Value as JS as JSON</h3>
              <pre>{JSON.stringify(valueAsJS, null, 2)}</pre>
            </div>
            {/* <pre>
              {JSON.stringify(
                {
                  isObject: _.isObject(valueAsJS),
                  isArray: _.isArray(valueAsJS),
                  isNumber: _.isNumber(valueAsJS),
                  isString: _.isString(valueAsJS),
                  isBoolean: _.isBoolean(valueAsJS),
                  isNaN: _.isNaN(valueAsJS),
                  isUndefined: _.isUndefined(valueAsJS),
                  isNull: _.isNull(valueAsJS)
                },
                null,
                2
              )}
            </pre> */}
          </div>
        )}
      </div>
    );
  }
}
