import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const _new = {
    forename: '',
    surname: '',
    short_name: '',
    team_id: 0,
    points: 0
}

const Members = () => {
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [member, setMember] = useState(null);
    const [newMember, setNewMember] = useState(_new);

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
        axios.get('/api/apps/DemoApp/members')
            .then(response => {
                return response
            })
            .then(json => {
                setMembers(json.data.members);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
    }, []);

    const onChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        let _member = (member === null) ? newMember : member;
        if (name === "surname" && value.length >= 3 && (_member.short_name === undefined || _member.short_name === '')) {
            _member['short_name'] = value.substring(0, 3).toUpperCase();
        }
        _member[name] = (name === "short_name") ? value.toUpperCase() : value;
        (member === null) ? setNewMember({ ..._member }) : setMember({ ..._member });
    }

    const saveMember = () => {
        let _member = (member === null) ? newMember : member;
        let formData = new FormData();
        formData.append('_method', (member === null) ? 'POST' : 'PUT');
        if (member !== null) {
            formData.append('id', member.id);
        }
        formData.append('forename', _member.forename);
        formData.append('surname', _member.surname);
        formData.append('short_name', _member.short_name);
        formData.append('team_id', _member.team_id);
        formData.append('points', _member.points);
        axios.post('/api/apps/DemoApp/member', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                alert(`Member was ${(member === null) ? 'created' : 'updated'}`);
                setMembers(json.data.members);
                setNewMember(_new);
                setMember(null);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            })
    }

    const deleteMember = member => {
        if (confirm(`Clicking OK will delete the member: ${member.short_name}`)) {
            axios.delete(`/api/apps/DemoApp/member/${member.id}`)
                .then(response => {
                    return response
                })
                .then(json => {
                    alert("Member was deleted");
                    setMembers(json.data.members);
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
                <h1 className="text-2xl font-bold">Current Members</h1>
                {
                    members.map(function (member, i) {
                        return (
                            <div key={i} className="flex justify-around my-2 text-left">
                                <span className="w-24">{member.forename} {member.surname}</span>
                                <span>({member.short_name})</span>
                                <span>{member.team.name}</span>
                                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={() => { setMember(member) }}>Edit</button>
                                <button className="px-2 bg-red-600 rounded-lg focus:outline-none" onClick={() => { deleteMember(member) }}>Delete</button>
                            </div>
                        )
                    })
                }
                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={() => { setMember(null); setNewMember(_new) }}>Create New Member</button>
            </div>
            <div>
                <h1 className="text-2xl font-bold pb-4">{(member === null) ? 'Create a new Member' : `Edit Member: ${member.short_name}`}</h1>
                <div className="grid grid-cols-2">
                    <label className="pt-2 my-1">Member Forename</label>
                    <input type="text"
                        name="forename"
                        value={(member === null) ? newMember.forename : member.forename}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange} />
                    <label className="pt-2 my-1">Member Surname</label>
                    <input type="text"
                        name="surname"
                        value={(member === null) ? newMember.surname : member.surname}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange} />
                    <label className="pt-2 my-1">Member Short Name</label>
                    <input type="text"
                        name="short_name"
                        value={(member === null) ? newMember.short_name : member.short_name}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange}
                        maxLength="3" />
                    <label className="pt-2 my-1">Member Team</label>
                    <select name="team_id"
                        value={(member === null) ? newMember.team_id : member.team_id}
                        onChange={onChange}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black">
                        {
                            teams.map(function (team, i) {
                                return (<option key={i} value={team.id}>{team.name}</option>)
                            })
                        }
                    </select>
                    <label className="pt-2 my-1">Member Points</label>
                    <input type="text"
                        name="points"
                        value={(member === null) ? newMember.points : member.points}
                        className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                        onChange={onChange} />
                </div>
                <button className="px-2 bg-blue-400 rounded-lg focus:outline-none" onClick={saveMember}>
                    {(member === null) ? 'Create Member' : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

export default Members;