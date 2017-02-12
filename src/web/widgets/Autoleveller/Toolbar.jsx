import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import i18n from '../../lib/i18n';

class Toolbar extends Component {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        const { actions } = this.props;
        const styles = {
            toolbar: {
                position: 'absolute',
                top: 10,
                right: 10
            }
        };

        return (
            <div className="btn-group" style={styles.toolbar}>
                <DropdownButton
                    bsSize="xs"
                    bsStyle="default"
                    title={i18n._('More')}
                    id="autofill-dropdown"
                    pullRight
                >
                    <MenuItem
                        eventKey="autofill"
                        onSelect={actions.autoFill}
                    >
                        {i18n._('Autofill Dimensions')}
                    </MenuItem>
                </DropdownButton>
            </div>
        );
    }
}

export default Toolbar;
