/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events, BuildingMaterial} from 'camelot-unchained';
import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../../../lib/BuildPane';

import {GlobalState} from '../../services/session/reducer';
import {selectFromMaterial, selectToMaterial} from '../../services/session/materials-replace'

import MaterialView from '../../components/MaterialView';

function select(state: GlobalState): MaterialReplacePaneProps {
  return {
    from: state.replace.from,
    to: state.replace.to,
  }
}

export interface MaterialReplacePaneProps {
  dispatch?: (action: any) => void;
  minimized?: boolean;
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
      showTo: false
    }
  }

  showMaterialsFrom = (show: boolean) => {
    events.fire(ACTIVATE_MATERIAL_SELECTOR, { selection: this.props.from, onSelect: this.selectFrom });
  }

  showMaterialsTo = (show: boolean) => {
    events.fire(ACTIVATE_MATERIAL_SELECTOR, { selection: this.props.to, onSelect: this.selectTo });
  }

  selectFrom = (mat: BuildingMaterial) => {
    this.props.dispatch(selectFromMaterial(mat));
    this.setState({ showFrom: false, showTo: false } as MaterialReplacePaneState);
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  selectTo = (mat: BuildingMaterial) => {
    this.props.dispatch(selectToMaterial(mat));
    this.setState({ showFrom: false, showTo: false } as MaterialReplacePaneState);
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  materialReplace = () => {
    const w: any = window;
    if (w.cuAPI != null) {
      w.cuAPI.ReplaceSelectedSubstance(this.props.from.id, this.props.to.id);
    }
  }

  componentWillUnmount() {
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  render() {

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
              <div className="arrow" onClick={sameMat ? null : this.materialReplace} />
            </div>

            <MaterialView
              selectedMaterial={this.props.to}
              onClick={() => this.showMaterialsTo(!this.state.showTo) }
              />
          </div>

          {this.props.minimized ? '' : '( ' + this.props.from.id + ' ) '}
          <button onClick={this.materialReplace} disabled={sameMat}>Replace</button>
          {this.props.minimized ? '' : ' ( ' + this.props.to.id + ' )'}

        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialReplacePane);
