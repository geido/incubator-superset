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
import { render, screen, waitFor } from 'spec/helpers/testing-library';
import userEvent from '@testing-library/user-event';
import { mockStore } from 'spec/fixtures/mockStore';
import { Provider } from 'react-redux';
import FilterBar, { FiltersBarProps } from '.';

const mockedProps = {
  filtersOpen: false,
  toggleFiltersBar: jest.fn(),
};

const setup = (props: FiltersBarProps) => (
  <Provider store={mockStore}>
    <FilterBar {...props} />
  </Provider>
);

test('should render', () => {
  const { container } = render(setup(mockedProps));
  expect(container).toBeInTheDocument();
  screen.debug();
});

test('should render the "Filters" heading', () => {
  render(setup(mockedProps));
  expect(screen.getByText('Filters')).toBeInTheDocument();
});

test('should render the "Clear all" option', () => {
  render(setup(mockedProps));
  expect(screen.getByText('Clear all')).toBeInTheDocument();
});

test('should render the "Apply" option', () => {
  render(setup(mockedProps));
  expect(screen.getByText('Apply')).toBeInTheDocument();
});

test('should render the icon to create a filter', () => {
  render(setup(mockedProps));
  expect(screen.getByRole('img', { name: 'edit' })).toBeInTheDocument();
});

test('should render the icon to expand filters', () => {
  render(setup(mockedProps));
  expect(screen.getByRole('img', { name: 'expand' })).toBeInTheDocument();
});