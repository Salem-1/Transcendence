## Search
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR
		dash((Dashboard))


		dash --> Search




		subgraph search
			Search --> profile
			profile --> chlg[Challenge to a Game]
			profile --> cht[send Message]
			profile --> frd[Add as a friend]
			profile --> BLK[Block]
		end

```
