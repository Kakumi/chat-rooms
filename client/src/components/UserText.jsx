import React from 'react';

const UserText = (props) => {
    //Template for user details : logo + username
    return (
        <div className="row my-2">
            <div className="col-4">
                <img className="img-fluid" src={"http://localhost:8000/avatars/" + props.username} alt="Logo" />
            </div>

            <div className="col-8">
                <span className="text-truncate">{props.username}</span>
            </div>
        </div>
    );
};

export default UserText;