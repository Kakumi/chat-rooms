import React from 'react';
import Jdenticon from 'react-jdenticon';

const UserText = (props) => {
    //Template for user details : logo + username
    return (
        <div className="row my-2">
            <div className="col-4">
                <Jdenticon value={props.username} />
            </div>

            <div className="col-8">
                <span className="text-truncate">{props.username}</span>
            </div>
        </div>
    );
};

export default UserText;