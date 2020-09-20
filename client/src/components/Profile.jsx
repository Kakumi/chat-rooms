import React from 'react';
import Card from './Card';
import UserText from './UserText';
import { Link } from 'react-router-dom';
import { removeUser } from '../sockets/emit';
import messages from '../data/messages.json';

const Profile = (props) => {
    //Return the profile
    return (
        <div id="profile">
            <Card header={messages.profile} footer={<Link onClick={() => removeUser(props.room)} to="/">{messages.logout}</Link>}>
                <UserText username={props.username} />
            </Card>
        </div>
    );
};

export default Profile;
