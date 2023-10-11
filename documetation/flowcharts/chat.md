## Chat
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
		dash((Dashboard))

		dash --> chat[Chat]


		subgraph social
			chat <--> inChat[Select chat]
			chat <--> chatsrch[Chat search]
			chat <--> Send[Send message]
			chat <--> chatSet[Chat settings]
			chatSet --> chatType{Chat Type}
			chatType -- direct --> pr(direct chat settings)
			chatType -- group --> gr(Group chat settings)

			pr --> add[Add friend]
			pr --> Invite[Invite to a game]
			pr --> Block[Block User]

			gr -->  Leave[Leave group]
			gr --> Member[See Memebers]
			gr ---> AC[Admin controls]
			gr --> Owner[owner contros]

			AC -->  Mute[Mute user]
			AC --> name["Change Group Name"]
			AC --> Kick[kick member out]
			AC --> promote[promote to admin]

			Owner --> pass[pass ownership]

			chat <--> Cr{+New Chat} 

			Cr -- group --> group[Group name, type, and Password] --> chat
			Cr -- direct --> chat

		end

```
