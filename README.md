Slime work in progress.
A couple versions back, it should work on client-side. Right now I'm
trying to take it server-side using sockets via npm.

Three issues remain:
1. 

> npm start

works locally, but remotely there seems to be an issue with the createJs
and easeljs. I conjecture that this is due to easeljs being imported the
usual way (via website) instead of via node? Not sure about this.

2. 

The updates are all done client side. The server only transmits the
movements.
This leads to problems when one player refreshes or joins at a
different time than. Then the ball and stage get out of whack. I don't
have experience moving all the data server side.

I'm also not ssure whether to move all the data server side. I think
that helps but I really don't know.

3. Only one slime moves right now (by design). I would fix this, but it
   seems easy to fix after eliminating issue number 1 and 2.
