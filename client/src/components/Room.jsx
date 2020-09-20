import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FaLock, FaUnlock, FaUserShield, FaUserCheck, FaUsers } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import PopupPassword from './PopupPassword';
import PopupAdult from './PopupAdult';
import messages from '../data/messages.json';

const Room = (props) => {
    //Get progress percent of the number of users in the chat room / max users for the progress bar
    function getProgressPrc() {
        return props.users * 100 / props.room.params.max_people;
    }

    //Get progress bar color depending on the amount of users
    function getProgresColor() {
        let prc = getProgressPrc();

        if (prc <= 50) return "bg-success"; //return the class to show it green
        if (prc <= 80) return "bg-warning"; //return the class to show it orange
        return "bg-danger"; //return the class to show it red
    }

    //If chat room is full
    function isFull() {
        return props.users === props.room.params.max_people;
    }

    //Return action depending of the type of the chat room
    function getAction() {
        //If there is a password show the password popup
        if (props.room.params.password) {
            return (
                <PopupPassword trigger={<span className="clickable">{props.room.nom}</span>} nom={props.room.nom} id={props.id} password={props.room.params.password} />
            );
        } else {
            //If the chat room is for adult show the adult disclaimer popup
            if (props.room.params.for_adult) {
                return (
                    <PopupAdult trigger={<span className="clickable">{props.room.nom}</span>} nom={props.room.nom} id={props.id} />
                );
                
            } else {
                //Just a link to the page
                return (
                    <Link to={"/room/" + props.id}>
                        {props.room.nom}
                    </Link>
                );
            }
        }
    }

    return (
        <>
            <div id={props.id} className={"room row " + (isFull() ? "disabled" : "")}>
                <div className="room-header col-6 text-truncate">
                    {isFull() ? props.room.nom : getAction()}
                    
                </div>
                
                <div className="room-body col-3">
                    {props.users}/{props.room.params.max_people} <span className="svg"><FaUsers /></span>

                    <div className="progress" style={{height: 3 + "px"}}>
                        <div className={"progress-bar " + getProgresColor()} role="progressbar" style={{width: getProgressPrc() + "%"}} aria-valuenow={props.users} aria-valuemin="0" aria-valuemax={props.room.params.max_people}></div>
                    </div>
                </div>
                
                <div className="room-footer col-3">
                    <span className="svg">{props.room.params.for_adult ? <FaUserShield data-tip={messages.forAdult}/> : <FaUserCheck data-tip={messages.noRestriction} />}</span>
                    <span className="svg">{props.room.params.password == null ? <FaUnlock /> : <FaLock data-tip={messages.passwordRequired} />}</span>
                </div>
            </div>
            <div className="divider"/>
            <ReactTooltip />
        </>
    );
};

export default withRouter(Room);
