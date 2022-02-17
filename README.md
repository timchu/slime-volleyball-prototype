Slime work in progress.

A couple versions back, it should work on client-side. Right now I'm
trying to take it server-side using sockets via npm.

Two immediate issues remain:

1. 

> npm start

works locally, but remotely there seems to be an issue with the createJs
and easeljs. I conjecture that this is due to easeljs being imported the
usual way (via website) instead of via node? Not sure about this.

2.  I am working on making the server as the source of truth for slime
    and ball positions.



Some remaining issues:
1. See 2 in the above.

2. I'd like to make a different link per game. I don't know how to do
   this.

3. Both arrows and WASD controls only one slime right now (by design), partially due to issues 1
   and 2. I would fix this (can make it work on a single browser), but it
   seems easy to fix after eliminating issue number 1 and 2.

Things I learned so far:

1. Disentangling the "broadcast move" with the "receive mode + update
   speed" code was important. This first gets called within the
   client-side game loop. The second gets called within the socket
   listener. This is probably not my final architecture choice, but it
   did what I wanted to do for now.

2. I got each slime to be controlled by a different player. This is
   still janky, basically, when you join, you are player number
   (smallest unclaimed player num), and the players 1 and 2 control the
   left and right slimes accordingly. This was accompilshed through a
   bit of thinking and looking at multiplayer game from Phaser. The
   server will eventually coordinate state, there's still some weird
   de-syncing I don't get.
