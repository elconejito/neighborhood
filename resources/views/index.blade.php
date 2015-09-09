<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="//fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css" />
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
        
        <script src="{{ asset('/js/vendor.js') }}"></script>
    </head>
    <body>
        <div class="container">
            <div id="content"></div>
            <script type="text/jsx">
                var CommentBox = React.createClass({
                    loadCommentsFromServer: function () {
                        $.ajax({
                            url: this.props.url,
                            dataType: 'json',
                            cache: false,
                            success: function(data) {
                                this.setState({data: data});
                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(this.props.url, status, err.toString());
                            }.bind(this)
                        });
                    },
                    handleCommentSubmit: function (comment) {
                        $.ajax({
                            url: this.props.url,
                            dataType: 'json',
                            type: 'POST',
                            data: comment,
                            success: function(data) {
                                this.setState({data: data});
                            }.bind(this),
                            error: function(xhr, status, err) {
                                console.error(this.props.url, status, err.toString());
                            }.bind(this)
                        });
                    },
                    getInitialState: function() {
                        return {data: []};
                    },
                    componentDidMount: function() {
                        this.loadCommentsFromServer();
                        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
                    },
                    render: function() {
                        return (
                            <div className="commentBox">
                                <h1>CommentBox</h1>
                                <CommentList data={this.state.data} />
                                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                            </div>
                        );
                    }
                });
                
                var CommentList = React.createClass({
                    render: function() {
                        var commentNodes = this.props.data.map(function (comment) {
                            return (
                                <Comment author={comment.author}>
                                {comment.text}
                                </Comment>
                            );
                        });
                        return (
                            <div className="commentList">
                                {commentNodes}
                            </div>
                        );
                    }
                });
                
                var CommentForm = React.createClass({
                    handleSubmit: function (e) {
                        e.preventDefault();
                        var author = React.findDOMNode(this.refs.author).value.trim();
                        var text = React.findDOMNode(this.refs.text).value.trim();
                        if ( !text || !author ) {
                            return;
                        }
                        this.props.onCommentSubmit({author: author, text: text});
                        React.findDOMNode(this.refs.author).value = '';
                        React.findDOMNode(this.refs.text).value = '';
                        return;
                    },
                    render: function() {
                        return (
                            <form className="commentForm" onSubmit={this.handleSubmit}>
                                <input type="text" placeholder="Your Name" ref="author" />
                                <input type="text" placeholder="Say Something..." ref="text" />
                                <input type="submit" value="Post" />
                            </form>
                        );
                    }
                });
                
                var Comment = React.createClass({
                    render: function() {
                        var rawComment = marked(this.props.children.toString(), {sanitize: true});
                        return (
                            <div className="Comment">
                                <h2 className="commentAuthor">
                                    { this.props.author }
                                </h2>
                                <span dangerouslySetInnerHTML=@{{ __html: rawComment }} />
                            </div>
                        );
                    }
                });
                
                var data = [
                    { author: "Pete Hunt", text: "This is one comment" },
                    { author: "Jordan Walke", text: "This is *another* comment" }
                ];
                
                React.render(
                    <CommentBox url="comments" pollInterval={2000} />,
                    document.getElementById('content')
                );
            </script>
        </div>
    </body>
</html>
