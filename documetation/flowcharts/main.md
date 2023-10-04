## Main
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

	end

```
