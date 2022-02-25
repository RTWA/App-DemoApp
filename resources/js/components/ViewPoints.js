import React, { useEffect, useState } from 'react';
import { APIClient } from 'webapps-react';

const ViewPoints = () => {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/DemoApp/teams', undefined, { signal: APIController.signal })
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error)
                }
            });
        await APIClient('/api/apps/DemoApp/members', undefined, { signal: APIController.signal })
            .then(json => {
                setMembers(json.data.members);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error)
                }
            });

        return () => {
            APIController.abort();
        }
    }, []);

    if (teams === null || members === null)
        return (<div>No Teams or Members found</div>)

    return (
        <div className="grid gird-cols-1 md:grid-cols-2 gap-4 text-center">
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