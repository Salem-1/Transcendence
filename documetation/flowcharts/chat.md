## Chat
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
		dash((Dashboard))

		dash --> chat[Chat]


		subgraph social
			chat <--> chHist[Chat History]
			chat <--> inChat[Select chat]
			chat <--> chatsrch[Chat search]
			chat <--> Send[Send message]
			chat <--> Block[Block user]
			chat <--> Leave[Leave group]
			chat <--> Cr[creat group]
			Cr --> group[Group name and Password] --> chat
			chat <--> Mute[Mute user/group]

		end

```
