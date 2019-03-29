import React, { Component } from 'react';
import _ from 'lodash';
import safeEval from 'safe-eval';

const JSON_FUNCTION_MESSAGE =
  'i-am-a-function__7bf91f73-bed4-44bc-8aed-f5c08d89dc6c';
const JSON_REGEXP_MESSAGE = 'i-am-regexp__b768715d-4241-482d-b738-bef5ffc2b64f';

const PT = {
  string: 'PropTypes.string,',
  number: 'PropTypes.number,',
  bool: 'PropTypes.bool,',
  func: 'PropTypes.func,',
  any: 'PropTypes.any,'
};

const CONSTANTS = {
  str: 'string',
  num: 'number',
  bool: 'boolean',
  func: 'function',
  null: 'null',
  undefined: 'undefined'
};

const TEMP = {
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
};

/**
 * - a better thing to do may be to recursively iterate through
 * the input (object) and store each key/value pair in an object
 * - for instance, TEMP above will become
 * {
 *  string: 'string',
 *  number: 'number',
 *  object: {
 *    '1': 'number',
 *    '2': [
 *      'number',
 *      'number',
 *      'number',
 *    ],
 *    '3': {
 *      hello: 'string',
 *    },
 *  },
 *  array: [
 *    'number',
 *    'number',
 *    'string',
 *    'number',
 *    {
 *      5: 'number',
 *      6: 'number',
 *    }
 *  ],
 *  func: 'function',
 *  regex: 'regexp',
 * }
 */

const fmtPT = (pt, { key = null, numLevels = 0 } = {}) => {
  let res = '';
  res = _.padStart(res, numLevels, '  ');
  if (!_.isNull(key)) {
    res += `${key}: `;
  }
  res += pt;
  return res;
};

Function.prototype.toJSON = function() {
  return JSON_FUNCTION_MESSAGE;
};

RegExp.prototype.toJSON = function() {
  return JSON_REGEXP_MESSAGE;
};

export default class JSONInput extends Component {
  state = {
    // valueAsJS: '',
    valueAsJS: {
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
    // valueAsJSON: '',
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
    const { valueAsJS } = this.state;
    return this.recursivelyParseValueIntoPropTypes(valueAsJS);
  };

  recursivelyParseValueIntoPropTypes = (
    value,
    { key = null, numLevels = 0 } = {}
  ) => {
    if (_.isFunction(value)) {
      return fmtPT(PT.func, { key, numLevels: numLevels + 1 });
    }
    if (_.isRegExp(value)) {
      return fmtPT(`PropTypes.instanceOf(RegExp),`, {
        key,
        numLevels: numLevels + 1
      });
    }
    if (_.isString(value)) {
      return fmtPT(PT.string, { key, numLevels: numLevels + 1 });
    }
    if (_.isNumber(value)) {
      return fmtPT(PT.number, { key, numLevels: numLevels + 1 });
    }
    if (_.isBoolean(value)) {
      return fmtPT(PT.bool, { key, numLevels: numLevels + 1 });
    }
    if (_.isArray(value)) {
      const childValues = _.map(value, v =>
        this.recursivelyParseValueIntoPropTypes(v, { numLevels: numLevels + 1 })
      );
      const delimiter = _.padStart('', numLevels, '  ') + '\n';
      const childValuesStr = childValues.join(delimiter);
      /**
       * TODO
       * - go through the values of the array, and map each value to it's type
       * - if all the types are the same, we can say it is PropTypes.arrayOf(type)
       * or PropTypes.arrayOf(PropTypes.oneOfType([type1, type2, ...]))
       * - we eventually want to get to the point where each KEY can be mapped to a
       * series of PropTypes suggestions, (e.g. PropTypes.array, PropTypes.arrayOf)
       */
      return _.isNull(key)
        ? `PropTypes.arrayOf(${childValuesStr})`
        : `${key}: PropTypes.arrayOf(${childValuesStr})`;
    }
    if (_.isObject(value)) {
      const childValues = _.map(value, (v, k) =>
        this.recursivelyParseValueIntoPropTypes(v, {
          key: k,
          numLevels: numLevels + 1
        })
      );

      const delimiter = _.padStart('\n', numLevels, '  ');
      const childValuesStr = childValues.join(delimiter);

      return _.isNull(key)
        ? `PropTypes.shape({
${childValuesStr}
}),
`
        : `${key}: PropTypes.shape({
${childValuesStr}
  }),`;
    }
    return fmtPT(PT.any, { key, numLevels: numLevels + 1 });
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
            <div>
              {/* <pre>{JSON.stringify(this.parseValue(), null, 2)}</pre> */}
              <pre>{this.parseValue()}</pre>
            </div>
            <div>
              <h3>Value as JSON</h3>
              <pre>{valueAsJSON}</pre>
            </div>
            <hr />
            <div>
              <h3>Value as JS as JSON</h3>
              <pre>{JSON.stringify(valueAsJS, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }
}
