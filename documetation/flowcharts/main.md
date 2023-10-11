## Main
``` mermaid
%%{init: {'theme': 'default', "flowchart" : { "curve" : "catmullRom" } } }%%
flowchart TD
	
	classDef start fill:#00ff80
	
	subgraph login
		in(Login):::start --> Auth{Authenticate}

		Auth -- yes --> FA[2FA]
		Auth -- No --> in
		FA --> is2F{2FA Auth}
		is2F -- No --> FA
	end
	is2F -- Yes --> Main
	
	subgraph Main
		dash((Dashboard)):::start

		dash --> gbtn["`**play**`"]
		dash --> chat[Chat]
		dash --> profileCorner[profile button]


		profileCorner --> profilePage[Profile]
		profileCorner --> set[Settings]
		profileCorner --> out[Logout]
	end
		out  --> login
	

```
