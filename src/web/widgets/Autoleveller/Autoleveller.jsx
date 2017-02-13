import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import i18n from '../../lib/i18n';
import Toolbar from './Toolbar';
import {
    METRIC_UNITS
} from '../../constants';

class Autoleveller extends Component {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        // const { state, actions } = this.props;
        const { state, actions } = this.props;
        // const { canClick, units, probeDepth, startX, startY, endX, endY, clearanceZ, probeZ } = this.state;
        const { canClick, units, startX, startY, endX, endY, stepsEvery, safeZ, probeZ, probeDepth, probeFeedrate } = state;

        const displayUnits = (units === METRIC_UNITS) ? i18n._('mm') : i18n._('in');
        const feedrateUnits = (units === METRIC_UNITS) ? i18n._('mm/min') : i18n._('in/min');
        const step = (units === METRIC_UNITS) ? 1 : 0.1;

        return (
            <div>
                <Toolbar {...this.props} />
                <div className="form-group" />
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Start X')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={startX}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleStartXChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Start Y')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={startY}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleStartYChange}
                                />
                                <span className="input-group-addon">{displayUnits}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('End X')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={endX}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleEndXChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('End Y')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={endY}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleEndYChange}
                                />
                                <span className="input-group-addon">{displayUnits}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Steps Every')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stepsEvery}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleStepsEveryChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }} />
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Safe Z')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={safeZ}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleSafeZChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Probe Z Start')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={probeZ}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleProbeZChange}
                                />
                                <span className="input-group-addon">{displayUnits}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Probe Depth')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={probeDepth}
                                    placeholder="0.00"
                                    step={step}
                                    onChange={actions.handleProbeDepthChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Probe Feedrate')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={probeFeedrate}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleProbeFeedrateChange}
                                />
                                <span className="input-group-addon">{feedrateUnits}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-12">
                        <div className="btn-toolbar">
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-default"
                                    onClick={actions.startProbing}
                                    disabled={!canClick}
                                    title={i18n._('Start')}
                                >
                                    {i18n._('Start Probing')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Autoleveller;
