import React from 'react';
import Popup from 'reactjs-popup';
import { withRouter, Link } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import messages from '../data/messages.json';

//Show a popup with a disclaimer
const PopupAdult = (props) => {
    return (
        <>
            <Popup trigger={props.trigger} modal>
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>&times;</button>
                        <div className="header">{messages.chatRoomTitle} {props.nom}</div>
                        <div className="content">
                            <p>{messages.avertedPublic}</p>
                            <p>{messages.continueAdult}</p>
                        </div>
                        <div className="actions">
                            <div className="d-flex justify-content-around">
                                <Link to={"/room/" + props.id}>
                                    <button className="btn btn-danger">{messages.continue}</button>
                                </Link>
                                <button className="btn btn-success" onClick={close}>{messages.close}</button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </>
    );
};

export default withRouter(PopupAdult);
