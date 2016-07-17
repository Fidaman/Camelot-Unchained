/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {BuildingMaterial} from 'camelot-unchained';

import {GlobalState} from '../../services/session/reducer';
import MaterialsByType from '../../lib/MaterialsByType';
import {selectFromMaterial, selectToMaterial} from '../../services/session/materials-replace'
import MaterialView from '../..//components/MaterialView';
import MaterialSelector from '../..//components/MaterialSelector';

function select(state: GlobalState): MaterialReplacePaneProps {
  return {
    materialsByType: state.materials.materialsByType,
    from: state.replace.from,
    to: state.replace.to,
  }
}

export interface MaterialReplacePaneProps {
  dispatch?: (action: any) => void;
  minimized?: boolean;
  materialsByType: MaterialsByType;
  from: BuildingMaterial;
  to: BuildingMaterial;
}

export interface MaterialReplacePaneState {
  showFrom: boolean;
  showTo: boolean;
}

class MaterialReplacePane extends React.Component<MaterialReplacePaneProps, MaterialReplacePaneState> {

  constructor(props: MaterialReplacePaneProps) {
    super(props);
    this.state = {
      showFrom: false,
      showTo: false,
    };
  }
  
  showMaterialsFrom = (show: boolean) => {
    this.setState({ showFrom: show, showTo: false } as MaterialReplacePaneState);
  }

  showMaterialsTo = (show: boolean) => {
    this.setState({ showFrom: false, showTo: show } as MaterialReplacePaneState);
  }

  selectFrom = (mat: BuildingMaterial) => {
    this.props.dispatch(selectFromMaterial(mat));
    this.setState({ showFrom: false, showTo: false } as MaterialReplacePaneState);
  }

  selectTo = (mat: BuildingMaterial) => {
    this.props.dispatch(selectToMaterial(mat));
    this.setState({ showFrom: false, showTo: false } as MaterialReplacePaneState);
  }

  materialReplace = () => {
    var w: any = window;
    if (w.cuAPI != null) {
      w.cuAPI.ReplaceSelectedSubstance(this.props.from.id, this.props.to.id);
    }
  }

  render() {
    let matSelector: any = null;
    if (this.state.showFrom) {
      matSelector = (
        <MaterialSelector
          materialsByType={this.props.materialsByType}
          selectMaterial={this.selectFrom}
          selected={this.props.from} />
      )
    }
    else if (this.state.showTo) {
      matSelector = (
        <MaterialSelector
          materialsByType={this.props.materialsByType}
          selectMaterial={this.selectTo}
          selected={this.props.to} />
      )
    }

    const sameMat: boolean = this.props.from == this.props.to;

    return (
      <div className='build-panel__material-replace'>
        {
          this.props.minimized ? null : (
            <header>
              <span>Replace Material in selection</span>
            </header>
          )
        }
        <div className='content'>
          <div className={'material-selections' + (this.props.minimized ? ' minimized' : '') }>
            <MaterialView
              selectedMaterial={this.props.from}
              onClick={() => this.showMaterialsFrom(!this.state.showFrom) }
              />

            <div className="divider">
              <div className="arrow" onClick={sameMat? null : this.materialReplace} />
            </div>

            <MaterialView
              selectedMaterial={this.props.to}
              onClick={() => this.showMaterialsTo(!this.state.showTo) }
              />
          </div>

          {this.props.minimized ? '' : '( ' + this.props.from.id + ' ) '}
          <button onClick={this.materialReplace} disabled={sameMat}>Replace</button>
          {this.props.minimized ? '' : ' ( ' + this.props.to.id + ' )'}

          {matSelector}
        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialReplacePane);
