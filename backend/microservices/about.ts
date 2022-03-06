const ip = require("ip");

const about = {
    "client ": {
        "host": ip.address(),
    },
    "server ": {
        "current_time ": Date.now(),
        "services ": [{
            "name": "Slack",
            "actions": [{
                "name": "fetchSlackMessages",
                "description": "A new message is posted in channel"
            }],
            "reactions": [{
                "name": "sendSlackMessages",
                "description": "Send a message in channel"
            }]
        }, {
            "name": "Discord",
            "actions": [{
                "name": "fetchDiscordMessages",
                "description": "A new message is posted in channel"
            }, {
                "name": "fetchDiscordUsername",
                "description": "The user modify username"
            }],
            "reactions": [{
                "name": "sendDiscordMessages",
                "description": "Send a message in channel"
            }, {
                "name": "SendDiscordReaction",
                "description": "Send reaction robot to the last message in channel"
            }]
        }, {
            "name": "Gmail",
            "actions": [{
                "name": "fetchMailGmail",
                "description": "A new mail received by user"
            }],
            "reactions": [{
                "name": "sendMailGmail",
                "description": "Send mail to a specific user"
            }]
        }, {
            "name": "GCalendar",
            "actions": [{
                "name": "GetEvents",
                "description": "A new event created"
            }],
            "reactions": [{
                "name": "CreateEvent",
                "description": "Create new event at specific date"
            }]
        }, {
            "name": "Github",
            "actions": [{
                "name": "fetchNewRepositories",
                "description": "A new repository created"
            }],
            "reactions": [{
                "name": "CreateGithubRepo",
                "description": "Create new public repository"
            }]
        }, {"name": "Github",
            "actions": [{
                "name": "fetchNewRepositories",
                "description": "A new repository created"
            }],
            "reactions": [{
                "name": "CreateGithubRepo",
                "description": "Create new public repository"
            }]
        }, {
            "name": "GDrive",
            "actions": [{
                "name": "getDrives",
                "description": "A new drive created"
            }, {
                "name": "getFiles",
                "description": "A new file created"
            }],
            "reactions": [{
                "name": "CreateFileDrive",
                "description": "Create new file in drive"
            }]
        }]
    }
}

module.exports = (app: any) => {
    app.get('/about.json', async (__req: Request, res: any) => {
        res.send(about)
    })
}