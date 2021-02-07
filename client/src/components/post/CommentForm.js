import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';
const CommentForm = ({ addComment, postId }) => {
	const [text, setText] = useState('');
	const [displayCreateComment, toggleDisplayCreateComment] = useState(false);
	return (
		<div className="post-form">
			{!displayCreateComment && (
				<button
					class="btn btn-primary"
					onClick={(e) => toggleDisplayCreateComment(!displayCreateComment)}
				>
					<i className="fas fa-plus-square"></i> New Comment
				</button>
			)}
			{displayCreateComment && (
				<Fragment>
					<div className="bg-primary p-1">
						<p>Leave a Comment...</p>
					</div>
					<form
						className="form my-1"
						onSubmit={(e) => {
							e.preventDefault();
							addComment(postId, { text });
							setText('');
							toggleDisplayCreateComment(!displayCreateComment);
						}}
					>
						<textarea
							name="text"
							cols="30"
							rows="5"
							placeholder="New Comment"
							required
							value={text}
							onChange={(e) => setText(e.target.value)}
						></textarea>
						<input type="submit" className="btn btn-dark my-1" value="Submit" />
						<button
							class="btn btn-light"
							onClick={(e) => toggleDisplayCreateComment(!displayCreateComment)}
						>
							Cancel
						</button>
					</form>
				</Fragment>
			)}
		</div>
	);
};

CommentForm.propTypes = {
	addComment: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
};

export default connect(null, { addComment })(CommentForm);
