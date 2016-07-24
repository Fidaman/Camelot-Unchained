/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
const thunk = require('redux-thunk').default;

import {events} from 'camelot-unchained';
import reducer from './services/session/reducer';
import {initialize} from './services/session/materials';
import {BuildPaneProps} from '../../lib/BuildPane';

import TabbedPane from '../../components/TabbedPane';
import MaterialAndShapePane from './components/MaterialAndShapePane';
import MaterialReplace from './components/MaterialReplace';
import {DEACTIVATE_MATERIAL_SELECTOR} from '../../lib/BuildPane';

const store = createStore(reducer, applyMiddleware(thunk));

initialize(store.dispatch);

interface ContainerState {
}

class Container extends React.Component<BuildPaneProps, ContainerState> {
  constructor(props: BuildPaneProps) {
    super(props);
  }

  onTabChange = () => {
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }


  render() {
    return (
      <Provider store={store}>
        <TabbedPane tabs={['Blocks', 'Replace']} onTabChange={ (index: number, name: string) => this.onTabChange } >
          <MaterialAndShapePane minimized={this.props.minimized}/>
          <MaterialReplace minimized={this.props.minimized}/>
        </TabbedPane>
      </Provider>
    )
  }
}

export default Container;
