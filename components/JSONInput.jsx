import React, { Component } from 'react';
import _ from 'lodash';

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
    // value: ''
    // value: '{"string":"string","number":12,"object":{"1":1,"2":[2,3,4],"3":{"hello":"you"}}}'
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

  onValueChange = e => {
    try {
      const parsed = JSON.parse(e.target.value);
      this.setState({
        value: parsed,
        hasError: false
      });
    } catch (e) {
      console.log('err', this.state.value);
      this.setState({ hasError: true });
    }
  };

  render() {
    const { value, hasError } = this.state;
    return (
      <div>
        <textarea
          style={{ width: 400, height: 600 }}
          onChange={this.onValueChange}
        >
          {JSON.stringify(value, null, 2)}
        </textarea>
        {hasError ? (
          <div>
            <p>There is a problem with the input.</p>
          </div>
        ) : (
          <div>
            <pre>
              {JSON.stringify(
                {
                  isObject: _.isObject(value),
                  isArray: _.isArray(value),
                  isNumber: _.isNumber(value),
                  isString: _.isString(value),
                  isBoolean: _.isBoolean(value),
                  isNaN: _.isNaN(value),
                  isUndefined: _.isUndefined(value),
                  isNull: _.isNull(value)
                },
                null,
                2
              )}
            </pre>
            <hr />
            <pre>{JSON.stringify(value, null, 2)}</pre>
            <hr />
          </div>
        )}
      </div>
    );
  }
}
