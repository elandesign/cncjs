import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

class Autoleveller extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <div>
              Autoleveller
            </div>
        );
    }
}

export default Autoleveller;
