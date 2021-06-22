import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from 'webapps-react';

axios.defaults.withCredentials = true;

const DemoAppSettings = () => {
    const [states, setStates] = useState({});
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        let formData = new FormData();
        formData.append('key', JSON.stringify(["apps.demoApp.memberWinPoints", "apps.demoApp.teamWinPoints"]))
        axios.post('/api/setting', formData)
            .then(json => {
                setSettings({
                    memberWinPoints: json.data["apps.demoApp.memberWinPoints"],
                    teamWinPoints: json.data["apps.demoApp.teamWinPoints"]
                });
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            });
    }, []);

    const onChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        let _settings = settings;
        _settings[name] = value;
        setSettings({ ..._settings });
    }

    const saveSettings = (key) => {
        states[key] = 'saving';
        setStates({ ...states });

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('value', settings[key]);
        axios.post(`/api/setting/apps.demoApp.${key}`, formData)
            .then(() => {
                states[key] = 'saved';
                setStates({ ...states });
                setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                }, 2500);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);

                states[key] = 'error';
                setStates({ ...states });
                setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                }, 2500);
            })
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-row">
                <h6 className="text-gray-600 dark:text-gray-400 ml-6 inline-block cursor-pointer text-2xl font-bold">Demo App Settings</h6>
            </div>
            <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                    <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2 px-4" htmlFor="memberWinPoints">Member Points per-win</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text"
                                name="memberWinPoints"
                                value={settings.memberWinPoints || ''}
                                onChange={onChange}
                                onBlur={() => saveSettings("memberWinPoints")}
                                state={states['memberWinPoints']} />
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 py-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2 px-4" htmlFor="teamWinPoints">Team Points per-win</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text"
                                name="teamWinPoints"
                                value={settings.teamWinPoints || ''}
                                onChange={onChange}
                                onBlur={() => saveSettings("teamWinPoints")}
                                state={states['teamWinPoints']} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DemoAppSettings;