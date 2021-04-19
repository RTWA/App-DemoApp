import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AddPoints = () => {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
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
    }

    const addWin = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('_method', 'PUT');

        axios.post(`/api/apps/DemoApp/member/${e.target.dataset.member}/win`, formData)
            .then(response => {
                return response
            })
            .then(json => {
                if (json.data.success) {
                    loadData();
                }
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error)
            });
    }

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
                <div className="w-1/2 mx-auto">
                    {
                        members.map(function (member, i) {
                            return (
                                <div key={i} className="flex justify-around my-2">
                                    <span className="w-24 text-left">{member.forename} {member.surname}</span>
                                    <span className="text-left">({member.short_name})</span>
                                    <span className="text-left">{member.team.name}</span>
                                    <span className="text-left">{member.points}</span>
                                    <button className="px-2 bg-blue-300 rounded-lg focus:outline-none" data-member={member.id} onClick={addWin}>Add Win</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default AddPoints;