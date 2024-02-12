## Game
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
		classDef start fill:#00ff80
		
		subgraph Main
			dash((Dashboard))
		end
		
		subgraph  Game
			gbtn[play game]:::start
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





```
