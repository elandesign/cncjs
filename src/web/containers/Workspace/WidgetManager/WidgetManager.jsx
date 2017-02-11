import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Modal from '../../../components/Modal';
import i18n from '../../../lib/i18n';
import store from '../../../store';
import WidgetList from './WidgetList';

class WidgetManager extends Component {
    static propTypes = {
        onSave: PropTypes.func,
        onClose: PropTypes.func.isRequired
    };
    state = {
        show: true
    };
    widgetList = [
        {
            id: 'visualizer',
            caption: i18n._('Visualizer Widget'),
            details: i18n._('This widget visualizes a G-code file and simulates the tool path.'),
            visible: true,
            disabled: true
        },
        {
            id: 'connection',
            caption: i18n._('Connection Widget'),
            details: i18n._('This widget lets you establish a connection to a serial port.'),
            visible: true,
            disabled: true
        },
        {
            id: 'console',
            caption: i18n._('Console Widget'),
            details: i18n._('This widget lets you read and write data to the CNC controller connected to a serial port.'),
            visible: true,
            disabled: false
        },
        {
            id: 'grbl',
            caption: i18n._('Grbl Widget'),
            details: i18n._('This widget shows the Grbl state and provides Grbl specific features.'),
            visible: true,
            disabled: false
        },
        {
            id: 'smoothie',
            caption: i18n._('Smoothie Widget'),
            details: i18n._('This widget shows the Smoothie state and provides Smoothie specific features.'),
            visible: true,
            disabled: false
        },
        {
            id: 'tinyg',
            caption: i18n._('TinyG Widget'),
            details: i18n._('This widget shows the TinyG state and provides TinyG specific features.'),
            visible: true,
            disabled: false
        },
        {
            id: 'axes',
            caption: i18n._('Axes Widget'),
            details: i18n._('This widget shows the XYZ position. It includes jog controls, homing, and axis zeroing.'),
            visible: true,
            disabled: false
        },
        {
            id: 'gcode',
            caption: i18n._('G-code Widget'),
            details: i18n._('This widget shows the current status of G-code commands.'),
            visible: true,
            disabled: false
        },
        {
            id: 'laser',
            caption: i18n._('Laser Widget'),
            details: i18n._('This widget allows you control laser intensity and turn the laser on/off.'),
            visible: true,
            disabled: false
        },
        {
            id: 'macro',
            caption: i18n._('Macro Widget'),
            details: i18n._('This widget can use macros to automate routine tasks.'),
            visible: true,
            disabled: false
        },
        {
            id: 'probe',
            caption: i18n._('Probe Widget'),
            details: i18n._('This widget helps you use a touch plate to set your Z zero offset.'),
            visible: true,
            disabled: false
        },
        {
            id: 'spindle',
            caption: i18n._('Spindle Widget'),
            details: i18n._('This widget provides the spindle control.'),
            visible: true,
            disabled: false
        },
        {
            id: 'webcam',
            caption: i18n._('Webcam Widget'),
            details: i18n._('This widget lets you monitor a webcam.'),
            visible: true,
            disabled: false
        },
        {
            id: 'autoleveller',
            caption: i18n._('Autoleveller Widget'),
            details: i18n._('This widget lets you autolevel your GCode by probing a PCB.'),
            visible: true,
            disabled: false
        }
    ];

    componentDidUpdate() {
        if (!(this.state.show)) {
            this.props.onClose();
        }
    }
    handleSave() {
        this.setState({ show: false });

        let activeWidgets = _(this.widgetList)
            .filter((item) => {
                return item.visible;
            })
            .map((item) => {
                return item.id;
            })
            .value();
        let inactiveWidgets = _(this.widgetList)
            .map('id')
            .difference(activeWidgets)
            .value();

        this.props.onSave(activeWidgets, inactiveWidgets);
    }
    handleCancel() {
        this.setState({ show: false });
    }
    handleChange(id, checked) {
        let o = _.find(this.widgetList, { id: id });
        if (o) {
            o.visible = checked;
        }
    }
    render() {
        const widgets = _.concat(
            store.get('workspace.container.default.widgets'),
            store.get('workspace.container.primary.widgets'),
            store.get('workspace.container.secondary.widgets')
        );
        _.each(this.widgetList, (widget) => {
            if (_.includes(widgets, widget.id)) {
                widget.visible = true;
            } else {
                widget.visible = false;
            }
        });

        return (
            <Modal
                onClose={::this.handleCancel}
                show={this.state.show}
                size="md"
            >
                <Modal.Header>
                    <Modal.Title>{i18n._('Widgets')}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <WidgetList list={this.widgetList} onChange={::this.handleChange} />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-default"
                        onClick={::this.handleCancel}
                    >
                        {i18n._('Cancel')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={::this.handleSave}
                    >
                        {i18n._('OK')}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default WidgetManager;
