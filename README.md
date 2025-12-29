# RDSExpert-Plugin
This plugin allows you to use the RDSExpert interface directly on TEF webservers.
<br>
<br>
It works both with HTTP and HTTPS servers.
<br>
When the plugin is started, the connection to your server's RDS websocket is established automatically.
<br>
<br>
RDSExpert is an advanced RDS/RBDS decoder that allows you to view a large amount of technical data related to the Radio Data System.
<br>
[For documentation about the decoder itself, please click here.](https://github.com/LucasGallone/RDSExpert/blob/main/README.md)
# Installation instructions
1 - Download the entire repository on GitHub by clicking the "Code" button then "Download ZIP".
<br>
<br>
2 - Extract the ZIP file content.
<br>
<br>
3 - Place the `RDSExpert-Plugin.js` file and the `RDSExpert` folder (which contains `RDSExpert-Frontend.js`) in the `plugins` folder of your TEF webserver.
<br>
<br>
4 - Restart your TEF webserver.
<br>
<br>
5 - Access your webserver's configuration panel by using the admin account, click "Plugins" and select "RDSExpert by Lucas Gallone [v1.0]" in the plugins list, then save the changes.
<br>
<br>
6 - Restart your TEF webserver again... and enjoy!
