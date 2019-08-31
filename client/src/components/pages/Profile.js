import React from 'react';
import Moment from 'react-moment';

import AuthHOC from '../AuthHOC';

const Profile = ({session: {activeUser}}) => (
    <div>
        <h3>Profile</h3>
        <Moment date={activeUser.createdAt} format='YYYY/MM/DD'/><br />
        <strong>
            @{activeUser.username}
        </strong>
        
    </div>
);

export default AuthHOC(session => session && session.activeUser)(Profile);