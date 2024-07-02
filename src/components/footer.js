import React from 'react';
import authHelpers from '../authHelpers';

const Footer = (props) => {
  const { logged } = props;
  return (
    <footer>
      {logged ? (
        <div className="logout">
          <button onClick={e => authHelpers.logout()}>&gt; Log out</button>
        </div>
      ) : (
        <div className="logout"></div>
      )}

    </footer>
  );
};


export default Footer;
