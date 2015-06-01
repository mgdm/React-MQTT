var mqtt = require('mqtt');
var React = require('react');
var client = mqtt.connect("ws://localhost:1884");

client.on('connect', function() {
    client.subscribe("haw");
});

var Message = React.createClass({
    render: function() {
        return (
            <div key={this.props.key} className="message">{this.props.message.payload}</div>
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
            self.addMessage({key: packet.messageId, topic: topic, payload: payload.toString()});
        });
    },

    render: function() {
        var messageNodes = this.state.messages.map(function(message) {
            return (
                <Message key={message.key} message={message} />
            );
        });

        return (
            <div className="messages">{messageNodes}</div>
        );
    }
});

var SendMessage = React.createClass({

    render: function() {
        return (
            <form onSubmit={this.send}>
                <input type="text" name="sendMessage" />
            </form>
        );
    },

    send: function(event) {
        event && event.preventDefault();
        var input = event.target.children[0];
        client.publish('haw', input.value);
        input.value = "";
    }
});

React.render(
    <MessageList />, document.getElementById('messages')
);

React.render(
    <SendMessage />, document.getElementById('sendMessageBox')
);
