import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input } from 'webapps-react';

axios.defaults.withCredentials = true;

const DemoAppSettings = () => {
    const [states, setStates] = useState({});
    const [settings, setSettings] = useState([]);

    useEffect(async () => {
        let formData = new FormData();
        formData.append('key', JSON.stringify(["app.DemoApp.memberWinPoints", "app.DemoApp.teamWinPoints"]))
        await axios.post('/api/setting', formData)
            .then(json => {
                setSettings({
                    memberWinPoints: json.data["app.DemoApp.memberWinPoints"],
                    teamWinPoints: json.data["app.DemoApp.teamWinPoints"]
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

    const saveSettings = async key => {
        states[key] = 'saving';
        setStates({ ...states });

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('value', settings[key]);
        await axios.post(`/api/setting/app.DemoApp.${key}`, formData)
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
        <div className="w-full">
            <h6 className="text-gray-600 dark:text-gray-400 cursor-pointer text-2xl font-bold">Demo App Settings</h6>
            <div className="flex flex-col min-w-0 break-words w-full my-6 shadow-lg rounded-lg bg-blue-gray-100 dark:bg-blue-gray-600 border-0 overflow-hidden">
                <div className="bg-white dark:bg-gray-700 text-blue-gray-700 dark:text-blue-gray-100 mb-0 px-6 py-6">
                    <div className="flex flex-col md:flex-row py-4">
                        <label className="w-full md:w-4/12 md:py-2 font-medium md:font-normal text-sm md:text-base" htmlFor="memberWinPoints">Member Points per - win</label>
                        <Input type="text"
                            name="memberWinPoints"
                            value={settings.memberWinPoints || ''}
                            onChange={onChange}
                            onBlur={() => saveSettings("memberWinPoints")}
                            state={states['memberWinPoints']} />
                    </div>
                    <div className="flex flex-col md:flex-row py-4">
                        <label className="w-full md:w-4/12 md:py-2 font-medium md:font-normal text-sm md:text-base" htmlFor="teamWinPoints">Team Points per - win</label>
                        <Input type="text"
                            name="teamWinPoints"
                            value={settings.teamWinPoints || ''}
                            onChange={onChange}
                            onBlur={() => saveSettings("teamWinPoints")}
                            state={states['teamWinPoints']} />
                    </div>
                </div>
            </div>
            <Button href="/apps/DemoApp/view/points" target="_blank">View Current Scores</Button>
        </div>
    )
}

export default DemoAppSettings;