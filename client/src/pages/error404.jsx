import React, {useContext} from 'react';
import { withRouter } from 'react-router-dom';
import ErrorPage from '../pages/error';
import messages from '../data/messages.json';

const Error404 = () => {
    return (
        <ErrorPage code="404">
            <p>{messages.pageNotFound}</p>
        </ErrorPage>
    );
}

export default withRouter(Error404);