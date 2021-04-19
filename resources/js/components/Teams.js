import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const _new = {
    name: '',
    points: 0
}

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState(null);
    const [newTeam, setNewTeam] = useState(_new);

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

    const saveTeam = () => {
        let _team = (team === null) ? newTeam : team;
        let formData = new FormData();
        formData.append('_method', (team === null) ? 'POST' : 'PUT');
        if (team !== null) {
            formData.append('id', team.id);
        }
        formData.append('name', _team.name);
        formData.append('points', _team.points);
        axios.post('/api/apps/DemoApp/team', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                alert(`Team was ${(team === null) ? 'created' : 'updated'}`);
                setTeams(json.data.teams);
                setNewTeam(_new);
                setTeam(null);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            })
    }

    const deleteTeam = team => {
        if (confirm(`Clicking OK will delete the team: ${team.name}`)) {
            axios.delete(`/api/apps/DemoApp/team/${team.id}`)
                .then(response => {
                    return response
                })
                .then(json => {
                    alert("Team was deleted");
                    setTeams(json.data.teams);
                })
                .catch(error => {
                    // You should handle errors better in your App
                    console.log(error);
                });
        }
    }

    return (
        <div className="grid grid-cols-2 text-center">
            <div>
                <h1 className="text-2xl font-bold">Current Teams</h1>
                {
                    teams.map(function (team, i) {
                        return (
                            <div key={i} className="flex justify-around my-2 text-left">
                                <span className="w-24">{team.name}</span>
                                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={() => { setTeam(team) }}>Edit</button>
                                <button className="px-2 bg-red-600 rounded-lg focus:outline-none" onClick={() => { deleteTeam(team) }}>Delete</button>
                            </div>
                        )
                    })
                }
                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={() => { setTeam(null); setNewTeam(_new) }}>Create New Team</button>
            </div>
            <div>
                <h1 className="text-2xl font-bold pb-4">{(team === null) ? 'Create a new Team' : `Edit Team: ${team.name}`}</h1>
                <div className="grid grid-cols-2">
                    <label className="pt-2 my-1">Team Name</label>
                    <input type="text"
                        name="name"
                        value={(team === null) ? newTeam.name : team.name}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange} />
                    <label className="pt-2 my-1">Team Points</label>
                    <input type="text"
                        name="points"
                        value={(team === null) ? newTeam.points : team.points}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange} />
                </div>
                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={saveTeam}>
                    {(team === null) ? 'Create Team' : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

export default Teams;