import _ from 'lodash';
import pubsub from 'pubsub-js';
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Sortable from 'react-sortablejs';
import store from '../../store';
import Widget from './Widget';
import styles from './widgets.styl';

@CSSModules(styles)
class SecondaryWidgets extends Component {
    static propTypes = {
        onDelete: PropTypes.func.isRequired,
        onSortStart: PropTypes.func.isRequired,
        onSortEnd: PropTypes.func.isRequired
    };
    state = {
        widgets: store.get('workspace.container.secondary.widgets')
    };
    pubsubTokens = [];

    componentDidMount() {
        this.subscribe();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    shouldComponentUpdate(nextProps, nextState) {
        // Do not compare props for performance considerations
        return !_.isEqual(nextState, this.state);
    }
    componentDidUpdate() {
        const { widgets } = this.state;

        // Calling store.set() will merge two different arrays into one.
        // Remove the property first to avoid duplication.
        store.replace('workspace.container.secondary.widgets', widgets);

        // Publish a 'resize' event
        pubsub.publish('resize'); // Also see "widgets/visualizer.jsx"
    }
    subscribe() {
        { // updateSecondaryWidgets
            let token = pubsub.subscribe('updateSecondaryWidgets', (msg, widgets) => {
                this.setState({ widgets: widgets });
            });
            this.pubsubTokens.push(token);
        }
    }
    unsubscribe() {
        _.each(this.pubsubTokens, (token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }
    handleDeleteWidget(widgetid) {
        let widgets = _.slice(this.state.widgets);
        _.remove(widgets, (n) => (n === widgetid));
        this.setState({ widgets: widgets });

        this.props.onDelete();
    }
    render() {
        const widgets = _.map(this.state.widgets, (widgetid) => (
            <Widget
                widgetid={widgetid}
                key={widgetid}
                sortable={{
                    handleClassName: 'sortable-handle',
                    filterClassName: 'sortable-filter'
                }}
                onDelete={() => {
                    this.handleDeleteWidget(widgetid);
                }}
            />
        ));

        return (
            <Sortable
                {...this.props}
                styleName="widgets"
                options={{
                    animation: 150,
                    group: {
                        name: 'secondary',
                        pull: true,
                        put: ['primary']
                    },
                    handle: '.sortable-handle', // Drag handle selector within list items
                    filter: '.sortable-filter', // Selectors that do not lead to dragging
                    chosenClass: 'sortable-chosen', // Class name for the chosen item
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder
                    dataIdAttr: 'data-widgetid',
                    onStart: (event) => {
                        this.props.onSortStart();
                    },
                    onEnd: (event) => {
                        this.props.onSortEnd();
                    }
                }}
                onChange={(order) => {
                    this.setState({ widgets: order });
                }}
            >
                {widgets}
            </Sortable>
        );
    }
}

export default SecondaryWidgets;
