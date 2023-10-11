## Profile Page
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
		classDef start fill:#00ff80
		
		subgraph  ProfilePage
			profile{profile} -- self --> mypage[mypage]
			profile -- other --> otherPage[Other profile]
			otherPage --> add[add friend]
			otherPage --> block[Block]
			otherPage --> ch[chat]
			otherPage --> on{online} -- Yes --> cgame[challenge to a game]
		end





```
