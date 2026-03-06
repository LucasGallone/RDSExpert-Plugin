# RDSExpert Plugin for TEF webservers
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
-> [For documentation about the decoder itself, please click here.](https://github.com/LucasGallone/RDSExpert/wiki/) <-
# Installation instructions
1 - [Download the entire repository as a ZIP file by clicking here.](https://github.com/LucasGallone/RDSExpert-Plugin/archive/refs/heads/main.zip)
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
5 - Access your webserver's configuration panel by using the admin account, click "Plugins" and select "RDSExpert by Lucas Gallone" in the plugins list, then save the changes.
<br>
<br>
You should see the RDSExpert plugin appearing on your webserver now. Click on it and enjoy!
<br>
<br>
![plugin](https://github.com/user-attachments/assets/ec4e2df8-cf24-4b0f-b6ef-12647ccd96fd)
## Decoded data
• General features for the station identification: <b>PI code</b>, <b>PS</b>, <b>TP/TA flags</b> (Traffic Program - Traffic Announcement) and <b>Music/Speech switch</b>.
<br>
<br>
• <b>Radiotext messages on Lines A and B</b>, with recognition of the maximal number of characters (64 if sent on 2A, 32 is sent on 2B).
<br>
<br>
• <b>PTY (Program Type)</b>.
<br>
<br>
• <b>PTYN (Program Type Name)</b> with A/B flag detection.
<br>
<br>
• <b>AF decoding for Methods A and B</b>, with the ability to sort decoded frequencies.
<br>
<br>
• <b>Long PS</b> (from Group 15A).
<br>
<br>
• <b>Clock Time</b> (Local and UTC values).
<br>
<br>
• <b>Enhanced Other Networks (EON)</b>.
<br>
<br>
• <b>Extended Country and Language Identification codes (ECC/LIC)</b> with country and language interpretation in tooltips.
<br>
<br>
• <b>EWS channel indication</b> (Emergency Warning System).
<br>
<br>
• <b>PIN data.</b>
<br>
<br>
• <b>ODA (Open Data Applications) presence indicator</b> with application recognition, using a database.
<br>
<br>
• <b>Decoder Identification flags</b>: Stereo, Artificial Head, Compressed, and Dynamic PTY.
<br>
<br>
• <b>Radiotext+ (RT+)</b> with tags identification and interpretation.
<br>
<br>
• <b>Traffic Message Channel (TMC)</b> with interpretation of the decoded messages, thanks to a database containing over 1500 event codes.
<br>
<br>
• <b>In House Applications (IH) data</b>, from channel 0 to 31.
<br>
<br>
• <b>Transparent Data Channels (TDC)</b>, from channel 0 to 31.
<br>
<br>
• <b>Standard Radio Paging (RP)</b>, with intelligent detection of the type of messages transmitted (Alphanumeric, Numeric, etc.) and decoding adapted to the messages type.
<br>
<br>
• <b>Enhanced Radiotext (eRT) with eRT+ tags</b> identification and interpretation.
<br>
<br>
• <b>DAB Cross-Referencing</b>, with the display of the listed Ensemble ID and its channel (In the "Groups Monitor").
## Features
• <b>Raw RDS data recording</b>, to make complete recordings of all decoded groups, in ASCII format. 
<br>
<br>
• <b>Raw RDS data playback</b>, to play recordings with real-time decoding, even many years later. All ASCII format recordings are supported, even from other RDS decoders.
<br>
<br>
• <b>Direct data export</b>, in PDF and TXT format.
<br>
<br>
• <b>Bandscan recording</b>, with all RDS data from the scanned stations, a received signals summary including the transmitters cities and powers (ERP), as well as the reception levels in dBf/dBuV. Exportable in PDF and TXT format.
<br>
<br>
• <b>Groups Monitor</b>, in order to explore and make a deep analysis of all the different groups transmitted on the decoded RDS. 
<br>
<br>
• <b>Map for TMC (Traffic Message Channel)</b>, to display the location of decoded events. Only works for certain countries, depending on location data availability.
<br>
<br>
• <b>PI to Callsign converter</b>, as a tooltip on the PI field, for the stations from the US.
<br>
<br>
• <b>Detection of the factory PI codes with manufacturers display</b>, thanks to a database.
<br>
<br>
• <b>BER (Bit Error Rate) indicator</b>, in order to determine the RDS decoding quality.
