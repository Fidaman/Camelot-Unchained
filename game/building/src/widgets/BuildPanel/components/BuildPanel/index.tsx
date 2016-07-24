/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {events} from 'camelot-unchained';

const WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

import TabbedPane from '../TabbedPane';

import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';
import MaterialSelector from '../../widgets/MaterialSelector';

import {BuildingItem} from '../../../../lib/BuildingItem'
import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../lib/BuildPane'

export interface BuildPanelProps {

}

export interface BuildPanelState {
  minimized: boolean;
  showMaterialSelector: boolean;
  layout: Panel[];
}

interface Panel {
  x: number,
  y: number,
  w: number,
  h: number,
  i: string
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  private cols = 20;
  private itemWidth = 3;
  private gridHeight = 50;

  constructor(props: BuildPanelProps) {
    super(props);
    let yPos = 0;
    this.state = {
      minimized: false,
      showMaterialSelector: false,
      layout: [
        this.createLayoutItem('materials', this.itemWidth, 1, this.itemWidth, 14),
        this.createPanelLayout('header', yPos, 1),
        this.createPanelLayout('blocks', yPos += 1, 3),
        this.createPanelLayout('recent', yPos += 3, 2),
        this.createPanelLayout('blueprints', yPos += 2, 4),
        this.createPanelLayout('droplights', yPos += 4, 3)
      ]
    }
  }

  createLayoutItem(name: string, xRightIndex: number, yIndex: number, itemWidth: number, itemHeight: number) {
    return {
      i: name,
      x: this.cols - this.itemWidth - xRightIndex, //initialize to anchor to the right
      y: yIndex,
      w: itemWidth,
      h: itemHeight,
    }
  }

  createPanelLayout(name: string, yIndex: number, itemHeight: number): Panel {
    return {
      i: name,
      x: this.cols - this.itemWidth, //initialize to anchor to the right
      y: yIndex,
      w: this.itemWidth,
      h: itemHeight,
    }
  }

  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
    } as BuildPanelState);
  }

  onLayoutChange = (layout: Panel[]) => {
    const bottomWindowCell = Math.floor(window.innerHeight / this.gridHeight) - 3;
    let changed: boolean = false;
    //make sure the bottom panels don't go off the screen
    layout.forEach((panel: Panel) => {
      if (panel.y > bottomWindowCell) {
        panel.y = bottomWindowCell;
        if (panel.x >= panel.w)
          panel.x -= panel.w;
        else
          panel.x += panel.w;
        changed = true;
      }
      if (changed) {
        this.setState({ layout: [...layout] } as BuildPanelState);
      }
    });
  }

  materialSelectorActivated = () => {
    this.setState({ showMaterialSelector: true } as BuildPanelState);
  }

  materialSelectorDeactivated = () => {
    this.setState({ showMaterialSelector: false } as BuildPanelState);
  }

  componentDidMount() {
    events.addListener(ACTIVATE_MATERIAL_SELECTOR, this.materialSelectorActivated);
    events.addListener(DEACTIVATE_MATERIAL_SELECTOR, this.materialSelectorDeactivated);
  }

  componentWillUnmount() {
    events.removeListener(this.materialSelectorActivated);
    events.removeListener(this.materialSelectorDeactivated);
  }

  render() {
    return (
      <ReactGridLayout
        className={`build-panel ${this.state.minimized ? 'minimized' : ''}`}
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        cols={this.cols}
        rowHeight={this.gridHeight}
        verticalCompact={false}
        >

        <header key="header" >
          <span className='min-max' onClick={() => this.onMinMax() }>
            {this.state.minimized ? '<<' : '>>'}
          </span>
          <span className='info'>?</span>
        </header>

        <div key="materials" style={ { display: this.state.showMaterialSelector ? 'block' : 'none' } }><MaterialSelector minimized={this.state.minimized} /></div>
        <div key="blocks"><Blocks minimized={this.state.minimized} /></div>
        <div key="recent"><RecentSelections minimized={this.state.minimized} /></div>
        <div key="blueprints"><Blueprints minimized={this.state.minimized} /></div>
        <div key="droplights"><DropLight minimized={this.state.minimized} /></div>
      </ReactGridLayout>
    )
  }
}

export default BuildPanel;
