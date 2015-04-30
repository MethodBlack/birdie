'use strict';

var React = require('react');
var Panel = require('./Panel.jsx');
var Splitter = require('./Splitter.jsx');
var ControlsPanel = require('./ControlsPanel.jsx');
var LayersPanel = require('./LayersPanel.jsx');

var ControlDock = React.createClass({
    getInitialState: function() {
        return {
            visible: true,
            dragging: false,
            panelHeight: 200,
            startY: 0,
            startHeight: 200
        };
    },

    componentWillMount: function() {
        this.minPanelHeight = 100;
    },

    componentDidMount: function() {
        var app = this.props.app;

        app.on('mouseup', function() {
            this.setState({ dragging: false });
        }.bind(this));

        app.on('project_loaded', function() {
            this.refs.layers.forceUpdate();
            this.refs.controls.forceUpdate();
        }.bind(this));

        app.on('display_changed', function() {
            this.refs.layers.forceUpdate();
            this.refs.controls.forceUpdate();
        }.bind(this));

        this.dock = React.findDOMNode(this.refs.dock);
    },

    componentDidUpdate: function() {
    },

    handleMouseMove: function(e) {
        var val,
            state = this.state;

        if (state.dragging) {
            val = state.startHeight + e.pageY - state.startY;
            if (val < this.minPanelHeight) {
                val = this.minPanelHeight;
            }

            this.setState({ panelHeight: val });
        }
    },

    handleStartDrag: function(e) {
        this.setState({
            dragging: true,
            startY: e.pageY,
            startHeight: this.state.panelHeight
        });
    },

    handleLayerAdd: function() {
        this.props.onLayerAdd();
    },

    handleLayerSelected: function(index) {
        this.refs.controls.scrollToControl(index);
    },

    handleLayerChanged: function(callback) {
        this.refs.controls.forceUpdate(callback);
    },

    showDock: function(visible) {
        this.setState({ visible: visible });
    },

    render: function() {
        var state = this.state,
            style = { display: (state.visible) ? 'flex' : 'none' },
            mouseMove = (state.dragging) ? this.handleMouseMove : null;

        if (state.dragging) {
            style.cursor = 'ns-resize';
        }

        return (
            <div
                className="control-dock"
                ref="dock"
                style={style}
                onMouseMove={mouseMove}>
                <Panel title="LAYERS" height={state.panelHeight}>
                    <LayersPanel
                        ref="layers"
                        onLayerAdd={this.handleLayerAdd}
                        onLayerSelected={this.handleLayerSelected}
                        onLayerChanged={this.handleLayerChanged}
                        {...this.props}
                    />
                </Panel>

                <Splitter type="horizontal" onStartDrag={this.handleStartDrag} />

                <Panel title="CONTROLS" className="flex" shouldUpdate={false}>
                    <ControlsPanel
                        ref="controls"
                        {...this.props}
                    />
                </Panel>
            </div>
        );
    }
});

module.exports = ControlDock;