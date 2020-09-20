import React from 'react';

const Card = (props) => {

    return (
        <div className="card mt-3">
            <div className="card-header">{props.header}</div>
            <div className="card-body">{props.children}</div>
            <div className="card-footer small text-muted">{props.footer}</div>
        </div>
    );
};

export default Card;
