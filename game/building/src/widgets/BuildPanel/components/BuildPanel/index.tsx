/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import TabbedPane from '../TabbedPane';

import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';

import {BuildingItem} from '../../../../lib/BuildingItem'

export interface BuildPanelProps {

}

export interface BuildPanelState {
  minimized: boolean;
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  constructor(props: BuildPanelProps) {
    super(props);
    this.state = {
      minimized: false,
    }
  }

  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
    } as BuildPanelState);
  }

  render() {
    return (
      <div className={`build-panel ${this.state.minimized ? 'minimized' : ''}`}>
        <header>
          <span className='min-max' onClick={() => this.onMinMax() }>
            {this.state.minimized ? '<<' : '>>'}
          </span>
          <span className='info'>?</span>
        </header>

        <Blocks minimized={this.state.minimized} />
        <RecentSelections minimized={this.state.minimized} />
        <Blueprints minimized={this.state.minimized} />
        <DropLight minimized={this.state.minimized} />
      </div>
    )
  }
}

export default BuildPanel;
