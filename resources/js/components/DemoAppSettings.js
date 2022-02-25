import React, { useEffect, useState } from 'react';
import { APIClient, Button, Input } from 'webapps-react';

const DemoAppSettings = () => {
    const [states, setStates] = useState({});
    const [settings, setSettings] = useState([]);

    const APIController = new AbortController();
    let timer = null;

    useEffect(async () => {
        await APIClient('/api/setting', { key: JSON.stringify(["app.DemoApp.memberWinPoints", "app.DemoApp.teamWinPoints"]) }, { signal: APIController.signal })
            .then(json => {
                setSettings({
                    memberWinPoints: json.data["app.DemoApp.memberWinPoints"],
                    teamWinPoints: json.data["app.DemoApp.teamWinPoints"]
                });
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
        let _settings = settings;
        _settings[name] = value;
        setSettings({ ..._settings });
    }

    const saveSettings = async key => {
        states[key] = 'saving';
        setStates({ ...states });

        await APIClient(`/api/setting/app.DemoApp.${key}`, { value: settings[key] }, { method: 'PUT', signal: APIController.signal })
            .then(() => {
                states[key] = 'saved';
                setStates({ ...states });
                timer = setTimeout(function () {
                    states[key] = '';
                    setStates({ ...states });
                    timer = null;
                }, 2500);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // You should handle errors better in your App
                    console.log(error);

                    states[key] = 'error';
                    setStates({ ...states });
                    timer = setTimeout(function () {
                        states[key] = '';
                        setStates({ ...states });
                        timer = null;
                    }, 2500);
                }
            })
    }

    return (
        <div className="mt-10 sm:mt-0 py-0 sm:py-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1 flex justify-between">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">App Settings</h3>
                    </div>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
                        <div className="grid grid-cols-6 gap-6">
                            <Input
                                id="memberWinPoints"
                                name="memberWinPoints"
                                label="Member Points per win"
                                wrapperClassName="col-span-6 sm:col-span-4"
                                type="text"
                                value={settings.memberWinPoints || ''}
                                onChange={onChange}
                                onBlur={() => saveSettings("memberWinPoints")}
                                state={states['memberWinPoints']} />
                            <Input
                                id="teamWinPoints"
                                name="teamWinPoints"
                                label="Team Points per win"
                                wrapperClassName="col-span-6 sm:col-span-4"
                                type="text"
                                value={settings.teamWinPoints || ''}
                                onChange={onChange}
                                onBlur={() => saveSettings("teamWinPoints")}
                                state={states['teamWinPoints']} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md">
                        <Button href="/apps/DemoApp/view/points" target="_blank">View Current Scores</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DemoAppSettings;