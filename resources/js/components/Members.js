import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { ConfirmDeleteModal, Button, Input } from 'webapps-react';
import { confirmAlert } from 'react-confirm-alert';

axios.defaults.withCredentials = true;

const _new = {
    forename: '',
    surname: '',
    short_name: '',
    team_id: 0,
    points: 0
};

const Members = () => {
    const [state, setState] = useState('');
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [member, setMember] = useState(null);
    const [newMember, setNewMember] = useState(_new);

    const { addToast } = useToasts();

    useEffect(() => {
        axios.get('/api/apps/DemoApp/teams')
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
        axios.get('/api/apps/DemoApp/members')
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
        setState('saving');

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
            .then(json => {
                addToast(`Member was ${(member === null) ? 'created' : 'updated'}`, { appearance: 'success' });
                setMembers(json.data.members);
                setNewMember(_new);
                setMember(null);

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

    const contextDelete = member => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmDeleteModal
                        onConfirm={() => { deleteMember(member); onClose(); }}
                        onCancel={onClose}
                        message={`Are you sure you wish to delete the member: ${member.short_name}?\nThis action cannot be undone`} />
                );
            }
        });
    }

    const deleteMember = member => {
        axios.delete(`/api/apps/DemoApp/member/${member.id}`)
            .then(json => {
                addToast("Member was deleted", { appearance: 'info' });
                setMembers(json.data.members);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
    }

    return (
        <div className="grid grid-cols-2 text-center">
            <div className="w-full px-4 py-6">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 ml-6 inline-block cursor-pointer text-2xl font-bold">Current Members</h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        {
                            members.map(function (member, i) {
                                return (
                                    <div key={i} className="flex justify-around my-2 text-left">
                                        <span className="w-24">{member.forename} {member.surname}</span>
                                        <span>({member.short_name})</span>
                                        <span>{member.team.name}</span>
                                        <Button style="link" onClick={() => { setMember(member) }}>Edit</Button>
                                        <Button style="link" color="red" onClick={() => { contextDelete(member) }}>Delete</Button>
                                    </div>
                                )
                            })
                        }
                        <Button onClick={() => { setMember(null); setNewMember(_new) }}>Create New Member</Button>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 py-6">
                <div className="flex flex-row">
                    <h6 className="text-gray-600 dark:text-gray-400 ml-6 inline-block cursor-pointer text-2xl font-bold">
                        {(member === null) ? 'Create a new Member' : `Edit Member: ${member.short_name}`}
                    </h6>
                </div>
                <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2 px-4" htmlFor="forename">Forename</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <Input type="text"
                                    name="forename"
                                    value={(member === null) ? newMember.forename : member.forename}
                                    onChange={onChange}
                                    state={state} />
                            </div>
                        </div>
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2 px-4" htmlFor="surname">Surname</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <Input type="text"
                                    name="surname"
                                    value={(member === null) ? newMember.surname : member.surname}
                                    onChange={onChange}
                                    state={state} />
                            </div>
                        </div>
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2 px-4" htmlFor="short_name">Short Name</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <Input type="text"
                                    name="short_name"
                                    value={(member === null) ? newMember.short_name : member.short_name}
                                    onChange={onChange}
                                    state={state} />
                            </div>
                        </div>
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2 px-4" htmlFor="team_id">Member Team</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <select name="team_id"
                                    value={(member === null) ? newMember.team_id : member.team_id}
                                    onChange={onChange}
                                    className="input-field">
                                    {
                                        teams.map(function (team, i) {
                                            return (<option key={i} value={team.id}>{team.name}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                            <div className="w-full lg:w-3/12">
                                <label className="block py-2 px-4" htmlFor="points">Member Points</label>
                            </div>
                            <div className="w-full lg:w-9/12">
                                <Input type="text"
                                    name="points"
                                    value={(member === null) ? newMember.points : member.points}
                                    onChange={onChange}
                                    state={state} />
                            </div>
                        </div>
                        <Button onClick={saveMember}>{(member === null) ? 'Create Member' : 'Save Changes'}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Members;