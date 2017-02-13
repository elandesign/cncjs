import _, { includes } from 'lodash';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import pubsub from 'pubsub-js';
import Widget from '../../components/Widget';
import i18n from '../../lib/i18n';
import { mm2in } from '../../lib/units';
import controller from '../../lib/controller';
import store from '../../store';
import Autoleveller from './Autoleveller';
import styles from './index.styl';
import {
    // Units
    IMPERIAL_UNITS,
    METRIC_UNITS,
    // Grbl
    GRBL,
    GRBL_ACTIVE_STATE_IDLE,
    // Smoothie
    SMOOTHIE,
    SMOOTHIE_ACTIVE_STATE_IDLE,
    // TinyG
    TINYG,
    TINYG_MACHINE_STATE_READY,
    TINYG_MACHINE_STATE_STOP,
    TINYG_MACHINE_STATE_END,
    // Workflow
    WORKFLOW_STATE_IDLE
} from '../../constants';

const toUnits = (units, val) => {
    val = Number(val) || 0;
    if (units === IMPERIAL_UNITS) {
        val = mm2in(val).toFixed(4) * 1;
    }
    if (units === METRIC_UNITS) {
        val = val.toFixed(3) * 1;
    }

    return val;
};

class AutolevellerWidget extends Component {
    static propTypes = {
        onDelete: PropTypes.func,
        sortable: PropTypes.object
    };

    static defaultProps = {
        onDelete: () => {}
    };

    actions = {
        handleStartXChange: (event) => {
            const startX = event.target.value;
            this.setState({ startX });
        },
        handleStartYChange: (event) => {
            const startY = event.target.value;
            this.setState({ startY });
        },
        handleEndXChange: (event) => {
            const endX = event.target.value;
            this.setState({ endX });
        },
        handleEndYChange: (event) => {
            const endY = event.target.value;
            this.setState({ endY });
        },
        handleSafeZChange: (event) => {
            const safeZ = event.target.value;
            this.setState({ safeZ });
        },
        handleProbeZChange: (event) => {
            const probeZ = event.target.value;
            this.setState({ probeZ });
        },
        handleProbeDepthChange: (event) => {
            const probeDepth = event.target.value;
            this.setState({ probeDepth });
        },
        handleProbeFeedrateChange: (event) => {
            const probeFeedrate = event.target.value;
            this.setState({ probeFeedrate });
        },
        handleStepsEveryChange: (event) => {
            const stepsEvery = event.target.value;
            this.setState({ stepsEvery });
        },
        autoFill: () => {
            const bbox = this.state.bbox;
            this.setState({
                startX: bbox.min.x,
                startY: bbox.min.y,
                endX: bbox.max.x,
                endY: bbox.max.y
            });
        },
        startProbing: () => {
            // Calculate XY Points
            // var yPoints =
            // Move to safeZ
            // Iterate over points and probe
        }
    };

    pubsubTokens = [];

    controllerEvents = {
        'Grbl:state': (state) => {
            const { parserstate } = { ...state };
            const { modal = {} } = { ...parserstate };
            const units = {
                'G20': IMPERIAL_UNITS,
                'G21': METRIC_UNITS
            }[modal.units] || this.state.units;

            let {
                probeDepth,
                probeFeedrate,
                tlo,
                retractionDistance
            } = store.get('widgets.probe');
            if (units === IMPERIAL_UNITS) {
                probeDepth = mm2in(probeDepth).toFixed(4) * 1;
                probeFeedrate = mm2in(probeFeedrate).toFixed(4) * 1;
                tlo = mm2in(tlo).toFixed(4) * 1;
                retractionDistance = mm2in(retractionDistance).toFixed(4) * 1;
            }
            if (units === METRIC_UNITS) {
                probeDepth = Number(probeDepth).toFixed(3) * 1;
                probeFeedrate = Number(probeFeedrate).toFixed(3) * 1;
                tlo = Number(tlo).toFixed(3) * 1;
                retractionDistance = Number(retractionDistance).toFixed(3) * 1;
            }

            if (this.state.units !== units) {
                // Set `this.unitsDidChange` to true if the unit has changed
                this.unitsDidChange = true;
            }

            this.setState({
                units: units,
                controller: {
                    type: GRBL,
                    state: state
                },
                probeDepth: probeDepth,
                probeFeedrate: probeFeedrate,
                tlo: tlo,
                retractionDistance: retractionDistance
            });
        },
        'Smoothie:state': (state) => {
            const { parserstate } = { ...state };
            const { modal = {} } = { ...parserstate };
            const units = {
                'G20': IMPERIAL_UNITS,
                'G21': METRIC_UNITS
            }[modal.units] || this.state.units;

            let {
                probeDepth,
                probeFeedrate,
                tlo,
                retractionDistance
            } = store.get('widgets.probe');
            if (units === IMPERIAL_UNITS) {
                probeDepth = mm2in(probeDepth).toFixed(4) * 1;
                probeFeedrate = mm2in(probeFeedrate).toFixed(4) * 1;
                tlo = mm2in(tlo).toFixed(4) * 1;
                retractionDistance = mm2in(retractionDistance).toFixed(4) * 1;
            }
            if (units === METRIC_UNITS) {
                probeDepth = Number(probeDepth).toFixed(3) * 1;
                probeFeedrate = Number(probeFeedrate).toFixed(3) * 1;
                tlo = Number(tlo).toFixed(3) * 1;
                retractionDistance = Number(retractionDistance).toFixed(3) * 1;
            }

            if (this.state.units !== units) {
                // Set `this.unitsDidChange` to true if the unit has changed
                this.unitsDidChange = true;
            }

            this.setState({
                units: units,
                controller: {
                    type: SMOOTHIE,
                    state: state
                },
                probeDepth: probeDepth,
                probeFeedrate: probeFeedrate,
                tlo: tlo,
                retractionDistance: retractionDistance
            });
        },
        'TinyG:state': (state) => {
            const { sr } = { ...state };
            const { modal = {} } = sr;
            const units = {
                'G20': IMPERIAL_UNITS,
                'G21': METRIC_UNITS
            }[modal.units] || this.state.units;

            let {
                probeDepth,
                probeFeedrate,
                tlo,
                retractionDistance
            } = store.get('widgets.probe');
            if (units === IMPERIAL_UNITS) {
                probeDepth = mm2in(probeDepth).toFixed(4) * 1;
                probeFeedrate = mm2in(probeFeedrate).toFixed(4) * 1;
                tlo = mm2in(tlo).toFixed(4) * 1;
                retractionDistance = mm2in(retractionDistance).toFixed(4) * 1;
            }
            if (units === METRIC_UNITS) {
                probeDepth = Number(probeDepth).toFixed(3) * 1;
                probeFeedrate = Number(probeFeedrate).toFixed(3) * 1;
                tlo = Number(tlo).toFixed(3) * 1;
                retractionDistance = Number(retractionDistance).toFixed(3) * 1;
            }

            if (this.state.units !== units) {
                // Set `this.unitsDidChange` to true if the unit has changed
                this.unitsDidChange = true;
            }

            this.setState({
                units: units,
                controller: {
                    type: TINYG,
                    state: state
                },
                probeDepth: probeDepth,
                probeFeedrate: probeFeedrate,
                tlo: tlo,
                retractionDistance: retractionDistance
            });
        }
    };

    subscribe() {
        const tokens = [
            pubsub.subscribe('gcode:unload', (msg) => {
                console.log('gcode:unload');
                this.setState({
                    bbox: undefined
                });
            }),
            pubsub.subscribe('gcode:bbox', (msg, bbox) => {
                console.log('gcode:bbox');
                this.setState({
                    bbox: {
                        min: {
                            x: bbox.min.x,
                            y: bbox.min.y
                        },
                        max: {
                            x: bbox.max.x,
                            y: bbox.max.y
                        }
                    }
                });
            })
        ];
        this.pubsubTokens = this.pubsubTokens.concat(tokens);
    }

    unsubscribe() {
        _.each(this.pubsubTokens, (token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }
    addControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.on(eventName, callback);
        });
    }
    removeControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.off(eventName, callback);
        });
    }

    constructor() {
        super();
        this.state = this.getDefaultState();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            minimized, startX, startY, endX, endY, stepsEvery, probeDepth, probeFeedrate, safeZ, probeZ
        } = this.state;

        store.set('widgets.autoleveller.minimized', minimized);
        store.set('widgets.autoleveller.startX', startX);
        store.set('widgets.autoleveller.startY', startY);
        store.set('widgets.autoleveller.endX', endX);
        store.set('widgets.autoleveller.endY', endY);
        store.set('widgets.autoleveller.safeZ', safeZ);
        store.set('widgets.autoleveller.probeZ', probeZ);
        store.set('widgets.autoleveller.stepsEvery', stepsEvery);
        store.set('widgets.autoleveller.probeDepth', probeDepth);
        store.set('widgets.autoleveller.probeFeedrate', probeFeedrate);
    }

    canClick() {
        const { port, workflowState } = this.state;
        const controllerType = this.state.controller.type;
        const controllerState = this.state.controller.state;

        if (!port) {
            return false;
        }
        if (workflowState !== WORKFLOW_STATE_IDLE) {
            return false;
        }
        if (controllerType === GRBL) {
            const activeState = _.get(controllerState, 'status.activeState');
            const states = [
                GRBL_ACTIVE_STATE_IDLE
            ];
            if (!includes(states, activeState)) {
                return false;
            }
        }
        if (controllerType === SMOOTHIE) {
            const activeState = _.get(controllerState, 'status.activeState');
            const states = [
                SMOOTHIE_ACTIVE_STATE_IDLE
            ];
            if (!includes(states, activeState)) {
                return false;
            }
        }
        if (controllerType === TINYG) {
            const machineState = _.get(controllerState, 'sr.machineState');
            const states = [
                TINYG_MACHINE_STATE_READY,
                TINYG_MACHINE_STATE_STOP,
                TINYG_MACHINE_STATE_END
            ];
            if (!includes(states, machineState)) {
                return false;
            }
        }

        return true;
    }

    getDefaultState() {
        return {
            minimized: store.get('widgets.autoleveller.minimized', false),
            isFullscreen: false,
            canClick: true, // Defaults to true
            port: controller.port,
            units: METRIC_UNITS,
            controller: {
                type: controller.type,
                state: controller.state
            },
            bbox: undefined,
            workflowState: controller.workflowState,
            startX: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.startX', 0)),
            startY: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.startY', 0)),
            endX: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.endX', 50)),
            endY: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.endY', 50)),
            stepsEvery: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.stepsEvery', 5)),
            probeDepth: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.probeDepth', -3)),
            probeFeedrate: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.probeFeedrate', 20)),
            safeZ: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.safeZ', 5)),
            probeZ: toUnits(METRIC_UNITS, store.get('widgets.autoleveller.probeZ', 1))
        };
    }

    componentDidMount() {
        this.subscribe();
        // this.addControllerEvents();
    }
    componentWillUnmount() {
        // this.removeControllerEvents();
        this.unsubscribe();
    }

    render() {
        const { minimized, isFullscreen } = this.state;
        const state = {
            ...this.state,
            canClick: this.canClick(),
            gcodeLoaded: _.isObject(this.state.bbox)
        };
        const actions = {
            ...this.actions
        };

        return (
            <Widget fullscreen={isFullscreen}>
                <Widget.Header>
                    <Widget.Title>{i18n._('Autoleveller')}</Widget.Title>
                    <Widget.Controls className={this.props.sortable.filterClassName}>
                        <Widget.Button
                            title={minimized ? i18n._('Open') : i18n._('Close')}
                            onClick={(event, val) => this.setState({ minimized: !minimized })}
                        >
                            <i
                                className={classNames(
                                    'fa',
                                    { 'fa-chevron-up': !minimized },
                                    { 'fa-chevron-down': minimized }
                                )}
                            />
                        </Widget.Button>
                        <Widget.Button
                            title={i18n._('Fullscreen')}
                            onClick={(event, val) => this.setState({ isFullscreen: !isFullscreen })}
                        >
                            <i
                                className={classNames(
                                    'fa',
                                    { 'fa-expand': !isFullscreen },
                                    { 'fa-compress': isFullscreen }
                                )}
                            />
                        </Widget.Button>
                        <Widget.Button
                            title={i18n._('Remove')}
                            onClick={(event) => this.props.onDelete()}
                        >
                            <i className="fa fa-times" />
                        </Widget.Button>
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    className={classNames(
                        styles['widget-content'],
                        { [styles.hidden]: minimized }
                    )}
                >
                    <Autoleveller
                        state={state}
                        actions={actions}
                    />
                </Widget.Content>
            </Widget>
        );
    }
}

export default AutolevellerWidget;
