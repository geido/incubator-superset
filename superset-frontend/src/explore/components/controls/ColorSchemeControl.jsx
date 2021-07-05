/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { Select as DeprecatedSelect } from 'src/components/Select';
import { Select } from 'src/components';
import { Tooltip } from 'src/components/Tooltip';
import ControlHeader from '../ControlHeader';

const propTypes = {
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelMargin: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  clearable: PropTypes.bool,
  default: PropTypes.string,
  choices: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.array),
    PropTypes.func,
  ]),
  schemes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  isLinear: PropTypes.bool,
};

const defaultProps = {
  choices: [],
  schemes: {},
  clearable: false,
  onChange: () => {},
};

export default class ColorSchemeControl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.deprecatedOnChange = this.deprecatedOnChange.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.deprecatedRenderOption = this.deprecatedRenderOption.bind(this);
  }

  deprecatedOnChange(option) {
    const optionValue = option ? option.value : null;
    this.props.onChange(optionValue);
  }

  onChange(value) {
    this.props.onChange(value);
  }

  deprecatedRenderOption(key) {
    const { isLinear } = this.props;
    const currentScheme = this.schemes[key.value];

    // For categorical scheme, display all the colors
    // For sequential scheme, show 10 or interpolate to 10.
    // Sequential schemes usually have at most 10 colors.
    let colors = [];
    if (currentScheme) {
      colors = isLinear ? currentScheme.getColors(10) : currentScheme.colors;
    }

    return (
      <Tooltip id={`${currentScheme.id}-tooltip`} title={currentScheme.label}>
        <ul
          css={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',

            '& li': {
              flexBasis: 9,
              height: 10,
              margin: '9px 1px',
            },
          }}
          data-test={currentScheme.id}
        >
          {colors.map((color, i) => (
            <li
              key={`${currentScheme.id}-${i}`}
              css={{
                backgroundColor: color,
                border: `1px solid ${color === 'white' ? 'black' : color}`,
              }}
            >
              &nbsp;
            </li>
          ))}
        </ul>
      </Tooltip>
    );
  }

  renderOption(value) {
    const { isLinear } = this.props;
    const currentScheme = this.schemes[value];

    // For categorical scheme, display all the colors
    // For sequential scheme, show 10 or interpolate to 10.
    // Sequential schemes usually have at most 10 colors.
    let colors = [];
    if (currentScheme) {
      colors = isLinear ? currentScheme.getColors(10) : currentScheme.colors;
    }

    return (
      <Tooltip id={`${currentScheme.id}-tooltip`} title={currentScheme.label}>
        <ul
          css={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',

            '& li': {
              flexBasis: 9,
              height: 10,
              margin: '9px 1px',
            },
          }}
          data-test={currentScheme.id}
        >
          {colors.map((color, i) => (
            <li
              key={`${currentScheme.id}-${i}`}
              css={{
                backgroundColor: color,
                border: `1px solid ${color === 'white' ? 'black' : color}`,
              }}
            >
              &nbsp;
            </li>
          ))}
        </ul>
      </Tooltip>
    );
  }

  render() {
    const { schemes, choices, labelMargin = 0 } = this.props;
    // save parsed schemes for later
    this.schemes = isFunction(schemes) ? schemes() : schemes;
    const deprecatedOptions = (isFunction(choices) ? choices() : choices).map(
      ([value, label]) => ({
        value,
        // use scheme label if available
        label: this.schemes[value]?.label || label,
      }),
    );
    const options = (isFunction(choices) ? choices() : choices).map(
      ([value, label]) => ({
        value,
        label: this.renderOption(value),
      }),
    );
    const deprecatedSelectProps = {
      multi: false,
      name: `select-${this.props.name}`,
      placeholder: `Select (${options.length})`,
      default: this.props.default,
      options: deprecatedOptions,
      value: this.props.value,
      autosize: false,
      clearable: this.props.clearable,
      onChange: this.deprecatedOnChange,
      optionRenderer: this.deprecatedRenderOption,
      valueRenderer: this.deprecatedRenderOption,
    };
    const selectProps = {
      allowClear: this.props.clearable,
      name: `select-${this.props.name}`,
      onChange: this.onChange,
      options,
      placeholder: `Select (${options.length})`,
      value: this.props.value,
    };
    return (
      <div>
        <ControlHeader {...this.props} />
        <DeprecatedSelect
          {...deprecatedSelectProps}
          css={{ marginTop: labelMargin }}
        />
        <Select {...selectProps} />
      </div>
    );
  }
}

ColorSchemeControl.propTypes = propTypes;
ColorSchemeControl.defaultProps = defaultProps;
