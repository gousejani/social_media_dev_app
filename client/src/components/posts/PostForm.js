import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { addPost } from '../../actions/post';
import { connect } from 'react-redux';

const PostForm = ({ addPost }) => {
	const [text, setText] = useState('');
	const [displayCreatePost, toggleDisplayCreatPost] = useState(false);
	return (
		<div className="post-form">
			{!displayCreatePost && (
				<button
					class="btn btn-primary"
					onClick={(e) => toggleDisplayCreatPost(!displayCreatePost)}
				>
					<i className="fas fa-plus-square"></i> Create Post
				</button>
			)}
			{displayCreatePost && (
				<Fragment>
					<div className="bg-primary p-1">
						<h3>Say Something...</h3>
					</div>
					<form
						className="form my-1"
						onSubmit={(e) => {
							e.preventDefault();
							addPost({ text });
							setText('');
							toggleDisplayCreatPost(!displayCreatePost);
						}}
					>
						<textarea
							name="text"
							cols="30"
							rows="5"
							placeholder="Create a post"
							required
							value={text}
							onChange={(e) => setText(e.target.value)}
						></textarea>
						<input type="submit" className="btn btn-dark my-1" value="Submit" />
						<button
							class="btn btn-light"
							onClick={(e) => toggleDisplayCreatPost(!displayCreatePost)}
						>
							Cancel
						</button>
					</form>
				</Fragment>
			)}
		</div>
	);
};

PostForm.propTypes = {
	addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
