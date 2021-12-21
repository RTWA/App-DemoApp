import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { ConfirmDeleteModal, Button, Input } from 'webapps-react';
import { confirmAlert } from 'react-confirm-alert';

axios.defaults.withCredentials = true;

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

    useEffect(async () => {
        await axios.get('/api/apps/DemoApp/teams')
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
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
        let formData = new FormData();
        formData.append('_method', (team === null) ? 'POST' : 'PUT');
        if (team !== null) {
            formData.append('id', team.id);
        }
        formData.append('name', _team.name);
        formData.append('points', _team.points);
        await axios.post('/api/apps/DemoApp/team', formData)
            .then(json => {
                addToast(`Team was ${(team === null) ? 'created' : 'updated'}`, { appearance: 'success' });
                setTeams(json.data.teams);
                setNewTeam(_new);
                setTeam(null);

                setState('saved');
                setTimeout(function () {
                    setState('');
                }, 2500);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);

                setState('error');
                setTimeout(function () {
                    setState('');
                }, 2500);
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
        await axios.delete(`/api/apps/DemoApp/team/${team.id}`)
            .then(json => {
                addToast("Team was deleted", { appearance: 'info' });
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="w-full">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 cursor-pointer text-2xl font-bold">Current Teams</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
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
                        <Button onClick={() => { setTeam(null); setNewTeam(_new) }}>Create New Team</Button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 cursor-pointer text-2xl font-bold">
                        {(team === null) ? 'Create a new Team' : `Edit Team: ${team.name}`}
                    </h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        <div className="flex flex-col md:flex-row py-4">
                            <label className="w-full md:w-4/12 md:py-2 font-medium md:font-normal text-sm md:text-base" htmlFor="name">Team Name</label>
                            <Input type="text"
                                name="name"
                                value={(team === null) ? newTeam.name : team.name}
                                onChange={onChange}
                                state={state} />
                        </div>
                        <div className="flex flex-col md:flex-row py-4">
                            <label className="w-full md:w-4/12 md:py-2 font-medium md:font-normal text-sm md:text-base" htmlFor="points">Team Points</label>
                            <Input type="text"
                                name="points"
                                value={(team === null) ? newTeam.points : team.points}
                                onChange={onChange}
                                state={state} />
                        </div>
                        <Button onClick={saveTeam}>{(team === null) ? 'Create Team' : 'Save Changes'}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teams;