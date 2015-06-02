var mqtt = require('mqtt');
var React = require('react');

var host = 'ws://' + window.location.host + ':1884';
var client = mqtt.connect(host);

client.on('connect', function() {
    client.subscribe("haw");
});

var Message = React.createClass({
    render: function() {
        return (
            <div key={this.props.key} className="message row">{this.props.message.payload}</div>
        );
    }
});

var MessageList = React.createClass({
    addMessage: function(message) {
        var updated = this.state.messages;
        updated.push(message);
        this.setState({messages: updated});
    },

    getInitialState: function() {
        return { messages: [] };
    },

    componentDidMount: function() {
        var self = this;

        client.on('message', function(topic, payload, packet) {
            self.addMessage({
                key: Date.now(),
                topic: topic,
                payload: payload.toString()
            });
        });
    },

    render: function() {
        var messageNodes = this.state.messages.map(function(message) {
            return (
                <Message key={message.key} message={message} />
            );
        });

        return (
            <div id="messageList" className="table-block footer-push">
                <h1>Channel Name</h1>
                <div className="messages container">{messageNodes}</div>
            </div>
        );
    }
});

var SendMessage = React.createClass({

    render: function() {
        return (
            <div className="table-block">
                <div className="container">
                    <footer id="footer" className="twelve columns">
                        <form onSubmit={this.send}>
                            <input type="text" name="sendMessage" className="u-full-width" placeholder="Say hello" />
                        </form>
                    </footer>
                </div>
            </div>
        );
    },

    send: function(event) {
        event && event.preventDefault();
        var input = event.target.children[0];
        client.publish('haw', input.value);
        input.value = "";
    }
});

var App = React.createClass({
    render: function() {
        return (
            <div className="table-container">
                <MessageList />
                <SendMessage />
            </div>
        );
    }
});

React.render(
    <App />, document.getElementById('body')
);
