# Transcendence

### Flowchart Parts

* [Main Flowchart](./documetation/flowcharts/main.md)
* [Game Flowchart](./documetation/flowcharts/game.md)
* [Chat FlowChart](./documetation/flowcharts/chat.md)
* [Search FlowChart](./documetation/flowcharts/search.md)
* [Profile settings](./documetation/flowcharts/profile.md)

#### Full Flowchart
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
	subgraph Main
		in(Login):::start --> Auth{Authenticate}
		classDef start fill:#00ff80

		Auth -- yes --> FA[2FA]
		Auth -- No --> in
		FA --> is2F{2FA Auth}
		is2F -- No --> FA
		is2F -- Yes --> dash((Dashboard))

		dash --> out[Logout]  --> in
		dash --> gbtn[play game]
		dash --> Search
		dash --> chat[Chat]
		dash --> set[profile setings]

		subgraph  Game
			gbtn --> online{paly online?}
			online -- No --> offGame(offline Game)
			online -- Yes --> matching[Match making]
			offGame --> offRe{offline Rematch}
			offRe -- Yes --> offGame
			matching --> matchingOutcome{Found match}
			matchingOutcome -- No --> online
			matchingOutcome -- Yes --> OnGame(online game)
			OnGame --> playagain{play again?}
			OnGame --> SE[Send Emoji]
			OnGame --> AF[Add friend]
			playagain -- Yes --> re{online Rematch}
			re -- No --> matching 
			re -- Yes --> OnGame
		end
		offRe -- No --> dash
		playagain -- No --> dash

		subgraph search
			Search --> profile
			profile --> chlg[Challenge to a Game]
			profile --> cht[send Message]
			profile --> frd[Add as a friend]
			profile --> BLK[Block]
		end

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

		subgraph profile_page
			set --> av[Change Avatar]
			set --> un[Change Username]
			set --> FA_set[Toggle 2 factor Auth]
			set --> status[Toggle online status]
		end
	end

```
