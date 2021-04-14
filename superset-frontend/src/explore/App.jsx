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
import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from '@superset-ui/core';
import { DynamicPluginProvider } from 'src/components/DynamicPlugins';
// eslint-disable-next-line no-restricted-imports
import { Select } from 'antd';
import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import ExploreViewContainer from './components/ExploreViewContainer';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import './main.less';
import '../../stylesheets/reactable-pagination.less';
import { theme } from '../preamble';

const { Option } = Select;

setupApp();
setupPlugins();

const randomTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      ...theme.colors.primary,
      base: 'red',
      dark1: '#000',
    },
  },
};

const App = ({ store }) => {
  const DEFAULT_THEME = 'superset';
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const lessScriptFile = document.createElement('script');
    const lessStyleTag = document.createElement('link');
    const lessScriptTag = document.createElement('script');
    const lessScriptTagOptions = document.createTextNode(
      "window.less = {async: false,env: 'production'};",
    );

    lessScriptFile.src =
      'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js';
    lessScriptTag.appendChild(lessScriptTagOptions);

    lessStyleTag.type = 'text/css';
    lessStyleTag.rel = 'stylesheet/less';
    lessStyleTag.href = '/static/assets/images/themes/index.less';

    document.head.prepend(lessStyleTag);
    document.head.prepend(lessScriptTag);
    document.head.prepend(lessScriptFile);
  }, []);

  function modifyLessTheme(options) {
    window.less.modifyVars(options);
    window.less.refreshStyles();
  }
  function handleSwitchTheme(chosenTheme) {
    setCurrentTheme(chosenTheme);
    switch (chosenTheme) {
      case 'superset-random': {
        const randomOptions = {
          '@primary-color': randomTheme.colors.primary.base,
          '@white': randomTheme.colors.primary.dark1,
          '@black': randomTheme.colors.primary.base,
        };
        modifyLessTheme(randomOptions);
        return;
      }
      default: {
        const defaultOptions = {
          '@primary-color': '#20a7c9',
          '@white': '#FFF',
          '@black': '#000',
        };
        modifyLessTheme(defaultOptions);
      }
    }
  }

  const SwitchTheme = () => (
    <Select defaultValue={currentTheme} onChange={handleSwitchTheme}>
      <Option value="superset">Superset</Option>
      <Option value="superset-random">Superset Random</Option>
    </Select>
  );

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider
          theme={currentTheme === DEFAULT_THEME ? theme : randomTheme}
        >
          <DynamicPluginProvider>
            <SwitchTheme />
            <ExploreViewContainer />
            <ToastPresenter />
          </DynamicPluginProvider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  );
};

export default hot(App);
