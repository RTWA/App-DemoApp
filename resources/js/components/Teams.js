import React, { useEffect, useState } from 'react';
import { ConfirmDeleteModal, Button, Input, useToasts, APIClient } from 'webapps-react';
import { confirmAlert } from 'react-confirm-alert';

const _new = {
    name: '',
    points: 0
}

const Teams = () => {
    const [state, setState] = useState('');
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState(null);
    const [newTeam, setNewTeam] = useState(_new);

    const { addToast } = useToasts();

    const APIController = new AbortController();
    let timer = null;

    useEffect(async () => {
        await APIClient('/api/apps/DemoApp/teams', undefined, { signal: APIController.signal })
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });

        return () => {
            APIController.abort();
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, []);

    const onChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        let _team = (team === null) ? newTeam : team;
        _team[name] = value;
        (team === null) ? setNewTeam({ ..._team }) : setTeam({ ..._team });
    }

    const saveTeam = async () => {
        setState('saving');

        let _team = (team === null) ? newTeam : team;
        let data = { name: _team.name, points: _team.points }
        if (team !== null) {
            data.id = team.id;
        }

        let config = {
            signal: APIController.signal,
            method: (team === null) ? 'POST' : 'PUT'
        }

        await APIClient('/api/apps/DemoApp/team', data, config)
            .then(json => {
                addToast(`Team was ${(team === null) ? 'created' : 'updated'}`, '', { appearance: 'success' });
                setTeams(json.data.teams);
                setNewTeam(_new);
                setTeam(null);

                setState('saved');
                timer = setTimeout(function () {
                    setState('');
                    timer = null;
                }, 2500);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);

                    setState('error');
                    timer = setTimeout(function () {
                        setState('');
                        timer = null;
                    }, 2500);
                }
            })
    }

    const contextDelete = team => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmDeleteModal
                        onConfirm={() => { deleteTeam(team); onClose(); }}
                        onCancel={onClose}
                        message={`Are you sure you wish to delete the team: ${team.name}?\nThis action cannot be undone`} />
                );
            }
        });
    }

    const deleteTeam = async team => {
        await APIClient(`/api/apps/DemoApp/team/${team.id}`, undefined, { method: 'DELETE', signal: APIController.signal })
            .then(json => {
                addToast("Team was deleted", '', { appearance: 'info' });
                setTeams(json.data.teams);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);
                }
            });
    }

    return (
        <div className="mt-10 sm:mt-0 py-0 sm:py-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1 flex justify-between">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Current Teams</h3>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
                        {
                            teams.map(function (team, i) {
                                return (
                                    <div key={i} className="flex items-center justify-around my-2">
                                        <span className="w-24">{team.name}</span>
                                        <Button style="link" onClick={() => { setTeam(team) }}>Edit</Button>
                                        <Button style="link" color="red" onClick={() => { contextDelete(team) }}>Delete</Button>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="flex items-center justify-end px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md">
                        <Button onClick={() => { setTeam(null); setNewTeam(_new) }}>Create New Team</Button>
                    </div>
                </div>

                <div className="md:col-span-1 flex justify-between">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Create a new Team</h3>
                    </div>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
                        <div className="grid grid-cols-6 gap-6">
                            <Input
                                id="name"
                                name="name"
                                label="Team Name"
                                type="text"
                                wrapperClassName="col-span-6 sm:col-span-4"
                                value={(team === null) ? newTeam.name : team.name}
                                onChange={onChange}
                                state={state} />
                            <Input
                                id="points"
                                name="points"
                                label="Team Points"
                                type="text"
                                wrapperClassName="col-span-6 sm:col-span-4"
                                value={(team === null) ? newTeam.points : team.points}
                                onChange={onChange}
                                state={state} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md">
                        <Button onClick={saveTeam}>{(team === null) ? 'Create Team' : 'Save Changes'}</Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Teams;