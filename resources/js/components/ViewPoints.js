import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPoints = () => {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    useEffect(() => {
        axios.get('/api/apps/DemoApp/teams')
            .then(response => {
                return response
            })
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error)
            });
        axios.get('/api/apps/DemoApp/members')
            .then(response => {
                return response
            })
            .then(json => {
                setMembers(json.data.members);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error)
            });
    }, []);

    if (teams === null || members === null)
        return (<div>No Teams or Members found</div>)

    return (
        <div className="grid grid-cols-2 text-center">
            <div>
                <h1 className="text-2xl font-bold">Team Points</h1>
                {
                    teams.map(function (team, i) {
                        return (<p key={i}>{team.name} - {team.points}</p>)
                    })
                }
            </div>
            <div>
                <h1 className="text-2xl font-bold">Member Points</h1>
                {
                    members.map(function (member, i) {
                        return (<p key={i}>{member.forename} {member.surname} ({member.short_name}) - {member.team.name} - {member.points}</p>)
                    })
                }
            </div>
        </div>
    )
}

export default ViewPoints;