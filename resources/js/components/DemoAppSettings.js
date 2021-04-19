import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const DemoAppSettings = () => {
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        let formData = new FormData();
        formData.append('key', JSON.stringify(["apps.demoApp.memberWinPoints", "apps.demoApp.teamWinPoints"]))
        axios.post('/api/setting', formData)
        .then(response => {
            return response
        })
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
        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('value', settings[key]);
        axios.post(`/api/setting/apps.demoApp.${key}`, formData)
            .then(() => {
                alert(`Setting was updated`);
            })
            .catch(error => {
                // You should handle errors better in your App
                console.log(error);
            })
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Demo App Settings</h1>
            <div className="w-1/2 grid grid-cols-2">
                <label className="pt-2 my-1">Member Points per-win</label>
                <input type="text"
                    name="memberWinPoints"
                    value={settings.memberWinPoints || ''}
                    className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                    onChange={onChange}
                    onBlur={() => saveSettings("memberWinPoints")} />
                <label className="pt-2 my-1">Team Points per-win</label>
                <input type="text"
                    name="teamWinPoints"
                    value={settings.teamWinPoints || ''}
                    className="my-1 block w-full px-0.5 bg-transparent border-white focus:ring-0 focus:border-black"
                    onChange={onChange}
                    onBlur={() => saveSettings("teamWinPoints")} />
            </div>
        </div>
    )
}

export default DemoAppSettings;