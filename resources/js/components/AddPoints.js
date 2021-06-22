import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'webapps-react';

axios.defaults.withCredentials = true;

const AddPoints = () => {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get('/api/apps/DemoApp/teams')
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error)
            });
        axios.get('/api/apps/DemoApp/members')
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
            <div className="w-full px-4 py-6">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 ml-6 inline-block cursor-pointer text-2xl font-bold w-full text-center">Team Points</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        {
                            teams.map(function (team, i) {
                                return (<p key={i}>{team.name} - {team.points}</p>)
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full px-4 py-6">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 ml-6 inline-block cursor-pointer text-2xl font-bold w-full text-center">Member Points</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        {
                            members.map(function (member, i) {
                                return (
                                    <div key={i} className="flex justify-around my-2">
                                        <span className="w-24 text-left">{member.forename} {member.surname}</span>
                                        <span className="text-left">({member.short_name})</span>
                                        <span className="text-left">{member.team.name}</span>
                                        <span className="text-left">{member.points}</span>
                                        <Button size="small" data-member={member.id} onClick={addWin}>Add Win</Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPoints;