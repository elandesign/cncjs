import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Widget from '../../components/Widget';
import i18n from '../../lib/i18n';
import store from '../../store';
import Autoleveller from './Autoleveller';
import styles from './index.styl';

class AutolevellerWidget extends Component {
    static propTypes = {
        onDelete: PropTypes.func,
        sortable: PropTypes.object
    };

    static defaultProps = {
        onDelete: () => {}
    };

    actions = {};

    pubsubTokens = [];

    constructor() {
        super();
        this.state = this.getDefaultState();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            minimized
        } = this.state;

        store.set('widgets.autoleveller.minimized', minimized);
    }

    getDefaultState() {
        return {
            minimized: store.get('widgets.autoleveller.minimized', false),
            isFullscreen: false,
            canClick: true // Defaults to true
        };
    }

    render() {
        const { minimized, isFullscreen } = this.state;

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
                    <Autoleveller />
                </Widget.Content>
            </Widget>
        );
    }
}

export default AutolevellerWidget;
