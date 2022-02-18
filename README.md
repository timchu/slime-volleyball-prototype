Slime work in progress.

A couple versions back, it should work on client-side. Right now I'm
trying to take it server-side using sockets via npm.

Two immediate issues remain:

1. 

> npm start

works locally, but remotely there seems to be an issue with the createJs
and easeljs. I conjecture that this is due to easeljs being imported the
usual way (via website) instead of via node? Not sure about this.

2.  The server is now source of truth on ball position, and it's being
    calculated through client 1 (though the physics is using the "ground
        truth" server, whereas the physics for the slimes might or might
        not be using the client side calculations).
    There's some isssue here where I'm ambiguously using the slime's x
    position and clientX position (what the client stores) to compute
    the physics and movement. I haven't gone down and tightened this up.




Some remaining issues:
1. This is super super laggy. Super laggy. And the delay is kinda
   obvious: the ball sorta goes through a slime before correcting.

2. I'd like to make a different link per game. I don't know how to do
   this.

3. This doesn't work remotely, and I'm not sure why. The hypotehsis is
   that it's because I'm doing createJS and easelJS through internet
   imports in the html file rather than any NPM thing, but the NPM
   installation of these packages has some issues on my computer and I
   can't get it to work.

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
