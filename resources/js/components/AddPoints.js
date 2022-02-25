import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APIClient, Button } from 'webapps-react';

axios.defaults.withCredentials = true;

const AddPoints = () => {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    const APIController = new AbortController();

    useEffect(async () => {
        await loadData();
        return () => {
            APIController.abort();
        }
    }, []);

    const loadData = async () => {
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
    }

    const addWin = async e => {
        e.preventDefault();
        await APIClient(`/api/apps/DemoApp/member/${e.target.dataset.member}/win`, undefined, { method: 'PUT', signal: APIController.signal })
            .then(json => {
                if (json.data.success) {
                    loadData();
                }
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error)
                }
            });
    }

    if (teams === null || members === null)
        return (<div>No Teams or Members found</div>)

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="w-full">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 cursor-pointer text-2xl font-bold w-full">Team Points</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6 text-center">
                        {
                            teams.map(function (team, i) {
                                return (<p key={i}>{team.name} - {team.points}</p>)
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 cursor-pointer text-2xl font-bold w-full">Member Points</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        {
                            members.map(function (member, i) {
                                return (
                                    <div key={i} className="flex flex-col md:flex-row items-center my-2">
                                        <div className="w-full flex flex-row justify-between">
                                            <span className="w-24 text-left">{member.forename} {member.surname}</span>
                                            <span className="text-left">({member.short_name})</span>
                                            <span className="text-left">{member.team.name}</span>
                                        </div>
                                        <div className="w-full flex flex-row justify-between md:ml-6">
                                            <span className="text-left">{member.points}</span>
                                            <Button size="small" data-member={member.id} onClick={addWin}>Add Win</Button>
                                        </div>
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