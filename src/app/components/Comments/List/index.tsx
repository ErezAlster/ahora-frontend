import * as React from 'react';
import { addComment, Comment } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import AddCommentComponent from 'app/components/Comments/AddComment';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { AddCommentInState, clearUnReadCommentsInState, deleteCommentInState, requestCommentsToState } from 'app/store/comments/actions';
import { Divider } from 'antd';

interface InjectableProps {
    moreComments?: Comment[];
    canPostComment: boolean;
    comments?: Comment[];
}

interface DispatchProps {
    clearUnReadComments: () => void;
    addComment: (comment: Comment) => void;
    deleteComment: (commentId: number) => void;
    loadComments: (fromDate?: Date) => void;
}

interface CommentsProps extends InjectableProps, DispatchProps {
    doc: Doc;
    login: string;
}

interface State {
    pinnedComments?: Comment[];
    qouteComment?: Comment;
    focusId?: number;
}


class CommentListComponent extends React.Component<CommentsProps, State>  {
    constructor(props: CommentsProps) {
        super(props);
        this.state = {}
    }

    onDeleteComment(id: number): void {
        this.props.deleteComment(id);
    }

    async commentAdded(comment: Comment) {
        this.props.addComment(comment);
        this.setState({ focusId: comment.id, qouteComment: undefined });

        const newComment: Comment = await addComment(this.props.login, this.props.doc.id, comment.comment, comment.parentId);

        this.props.deleteComment(comment.id);
        this.props.addComment(newComment);
        this.setState({ focusId: newComment.id })
    }

    async onQoute(comment: Comment) {
        this.setState({ qouteComment: comment });
    }

    /*
    async componentDidUpdate(prevProps: CommentsProps) {
        if (this.props.doc.id !== prevProps.doc.id) {
            this.setState({ comments: undefined, pinnedComments: [] });
            const comments: Comment[] = await getComments(this.props.login, this.props.doc.id);
            this.setState({
                focusId: comments.length > 0 ? comments[comments.length - 1].id : undefined,
                comments,
                pinnedComments: comments.filter(comment => comment.pinned)
            });
        }
        else if (this.props.moreComments?.length == 1) {
            this.setState({
                focusId: this.props.moreComments[0].id
            });
        }
    }
    */

    async componentDidMount() {
        this.props.loadComments();

        if (this.props.comments) {
            this.setState({
                focusId: this.props.comments.length > 0 ? this.props.comments[this.props.comments.length - 1].id : undefined,
                pinnedComments: this.props.comments.filter(comment => comment.pinned)
            });
        }
    }

    render() {
        return (
            <div>
                {this.state.pinnedComments && this.state.pinnedComments.length > 0 &&
                    (<>
                        <div className="list">
                            {this.state.pinnedComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent focus={false} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }


                {this.props.comments ?
                    (<>
                        {this.props.comments.length > 0 &&
                            <div className="list">
                                {this.props.comments.map((comment: Comment) => {
                                    return (<CommentDetailsComponent key={`${comment.id}-${comment.updatedAt}`} focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} comment={comment}></CommentDetailsComponent>);
                                })}
                            </div>
                        }
                    </>)
                    :
                    (<AhoraSpinner />)
                }

                {this.props.moreComments && this.props.moreComments.length > 0 &&
                    <div>
                        <Divider orientation="left">New comments</Divider>
                        <div className="list">
                            {this.props.moreComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent key={`${comment.id}-${comment.updatedAt}`} focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </div>
                }

                {this.props.canPostComment &&
                    <AddCommentComponent qouteComment={this.state.qouteComment} commentAdded={(comment: Comment) => { this.commentAdded(comment) }} login={this.props.login} docId={this.props.doc.id}></AddCommentComponent>
                }
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        clearUnReadComments: () => dispatch(clearUnReadCommentsInState(ownProps.doc.id)),
        deleteComment: (commentId: number) => dispatch(deleteCommentInState(ownProps.doc.id, commentId)),
        addComment: (comment: Comment) => dispatch(AddCommentInState(comment)),
        loadComments: (fromDate?: Date) => dispatch(requestCommentsToState(ownProps.doc.id, fromDate))
    }
}
const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.doc.id);
    return {
        canPostComment: !!state.currentUser.user,
        moreComments: mapOfComments?.moreComments,
        comments: mapOfComments?.comments
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 