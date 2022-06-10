import React, { useEffect, useState } from 'react';
import { APIClient, Button, Input, PageWrapper } from 'webapps-react';

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
        <PageWrapper title="App Settings">
            <Input
                id="memberWinPoints"
                name="memberWinPoints"
                label="Member Points per win"
                type="text"
                value={settings.memberWinPoints || ''}
                onChange={onChange}
                onBlur={() => saveSettings("memberWinPoints")}
                state={states['memberWinPoints']}
            />

            <Input
                id="teamWinPoints"
                name="teamWinPoints"
                label="Team Points per win"
                type="text"
                value={settings.teamWinPoints || ''}
                onChange={onChange}
                onBlur={() => saveSettings("teamWinPoints")}
                state={states['teamWinPoints']}
            />

            <Button href="/apps/DemoApp/view/points" target="_blank">View Current Scores</Button>
        </PageWrapper>
    )
}

export default DemoAppSettings;