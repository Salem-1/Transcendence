## Profile settings
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart LR

		dash((Dashboard))

	
		dash --> set[profile setings]

		

		subgraph profile_page
			set --> av[Change Avatar]
			set --> un[Change Username]
			set --> FA_set[Toggle 2 factor Auth]
			set --> status[Toggle online status]
		end

```
