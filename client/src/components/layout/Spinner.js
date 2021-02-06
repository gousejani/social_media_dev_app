import react, { Fragment } from 'react';
import spinner from '../../img/spinner2.gif';

export default function Spinner() {
	return (
		<Fragment>
			<img
				src={spinner}
				style={{ width: '100px', margin: 'auto', display: 'block' }}
				alt="loading..."
			/>
		</Fragment>
	);
}
