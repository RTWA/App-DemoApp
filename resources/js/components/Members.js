import React, { useEffect, useState } from 'react';
import { ConfirmDeleteModal, Button, Input, useToasts, APIClient, Select, PageWrapper } from 'webapps-react';
import { confirmAlert } from 'react-confirm-alert';

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

    const APIController = new AbortController();
    let timer = null;

    useEffect(async () => {
        await APIClient('/api/apps/DemoApp/teams', undefined, { signal: APIController.signal })
            .then(json => {
                setTeams(json.data.teams);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);
                }
            });
        await APIClient('/api/apps/DemoApp/members', undefined, { signal: APIController.signal })
            .then(json => {
                setMembers(json.data.members);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);
                }
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
        let _member = (member === null) ? newMember : member;
        if (name === "surname" && value.length >= 3 && (_member.short_name === undefined || _member.short_name === '')) {
            _member['short_name'] = value.substring(0, 3).toUpperCase();
        }
        _member[name] = (name === "short_name") ? value.toUpperCase() : value;
        (member === null) ? setNewMember({ ..._member }) : setMember({ ..._member });
    }

    const saveMember = async () => {
        setState('saving');

        let _member = (member === null) ? newMember : member;
        let data = {
            forename: _member.forename,
            surname: _member.surname,
            short_name: _member.short_name,
            team_id: _member.team_id,
            points: _member.points
        }
        if (member !== null) {
            data.id = member.id;
        }

        let config = {
            signal: APIController.signal,
            method: (member === null) ? 'POST' : 'PUT'
        }

        await APIClient('/api/apps/DemoApp/member', data, config)
            .then(json => {
                addToast(`Member was ${(member === null) ? 'created' : 'updated'}`, '', { appearance: 'success' });
                setMembers(json.data.members);
                setNewMember(_new);
                setMember(null);

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

    const deleteMember = async member => {
        await APIClient(`/api/apps/DemoApp/member/${member.id}`, undefined, { method: 'DELETE', signal: APIController.signal })
            .then(json => {
                addToast("Member was deleted", '', { appearance: 'info' });
                setMembers(json.data.members);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);
                }
            });
    }

    return (
        <PageWrapper>
            <div className="grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1 flex flex-col justify-between">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Current Members</h3>
                    </div>
                    {
                        members.map(function (member, i) {
                            return (
                                <div key={i} className="flex flex-col md:flex-row items-center my-2">
                                    <div className="w-full flex flex-row justify-between">
                                        <span>{member.forename} {member.surname}</span>
                                        <span>({member.short_name})</span>
                                        <span>{member.team.name}</span>
                                    </div>
                                    <div className="flex flex-row md:ml-6">
                                        <Button type="link" onClick={() => { setMember(member) }}>Edit</Button>
                                        <Button type="link" color="red" onClick={() => { contextDelete(member) }}>Delete</Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Button onClick={() => { setMember(null); setNewMember(_new) }}>Create New Member</Button>
                </div>

                <div className="md:col-span-1 flex flex-col justify-between">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Create a new Member</h3>
                    </div>

                    <Input
                        id="forename"
                        name="forename"
                        label="Forename"
                        type="text"
                        value={(member === null) ? newMember.forename : member.forename}
                        onChange={onChange}
                        state={state} />
                    <Input
                        id="surname"
                        name="surname"
                        label="Surname"
                        type="text"
                        value={(member === null) ? newMember.surname : member.surname}
                        onChange={onChange}
                        state={state} />
                    <Input
                        id="short_name"
                        name="short_name"
                        label="Short Name"
                        type="text"
                        value={(member === null) ? newMember.short_name : member.short_name}
                        onChange={onChange}
                        state={state} />
                    <Select
                        id="team_id"
                        name="team_id"
                        label="Member Team"
                        value={(member === null) ? newMember.team_id : member.team_id}
                        onChange={onChange}>
                        {
                            teams.map(function (team, i) {
                                return (<option key={i} value={team.id}>{team.name}</option>)
                            })
                        }
                    </Select>
                    <Input
                        id="points"
                        name="points"
                        label="Member Points"
                        type="text"
                        value={(member === null) ? newMember.points : member.points}
                        onChange={onChange}
                        state={state} />

                    <Button onClick={saveMember}>{(member === null) ? 'Create Member' : 'Save Changes'}</Button>
                </div>
            </div>
        </PageWrapper>
    )
}

export default Members;