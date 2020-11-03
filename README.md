Basic-SSH
===================
This tool is for proxy-secured location. Many companies have own connection rules for internet. Unfortunately some of them block SSH port.
Some of them block rpc, websocket etc. (What a douchebags!)

With this tool you are going to use ssh with basic request based communication.

> **Note:** I wrote project with sse first. but http proxy blocked it too. I rewrote all sse segments to basic restful services. Same reason I didn't use ws, rpc.. It may be laggy but It works!

Images first
----------------------

Connect the configured domain (or ip:12345). Basic authentication will be shown. Login with user name and password.

![](docs/login.png)

Click Connect

![](docs/dashboard.png)

Pick a server

![](docs/connect.png)

Type :)

![](docs/success.png)


![](docs/htop.png)


Installation
------------------

Very complicated!

```
git clone http://github.com/co3moz/basic-ssh
cd basic-ssh
npm i
```

Edit config file in config directory. Example config;

```json
{
  "port": 12345,
  "speed": 1000,
  "users": [
    {
      "login": "admin",
      "password": "123456789"
    }, {
      "login": "another_admin",
      "password": "123456789"
    }
  ],

  "servers": [
    {
      "name": "My local server",
      "ip": "localhost",
      "port": "22",
      "login": "root",
      "password": "your password",
      "responsible": [
        "admin"
      ]
    }
  ]
}
```
