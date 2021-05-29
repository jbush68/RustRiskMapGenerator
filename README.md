# RustRiskMapGenerator

Alright so if you're reading this you probably already know what its for, if not here's a quick rundown
This was made specifically for u/Mautamu's RustRisk, takes the SVG you made and makes the sql queries for you instead of doing a bunch of excel sheet work :)

How to do it? Simple
-Clone this and open up the folder \n
-Copy the map you made into the folder \n 
-Rename the map to map.svg \n
-in the console either do "node ." or "node index.js" to start up the generator
-It's gonna ask you the neighbors of each territory, type them in (case insensitive, no spaces between names)
-Each time you finish a territory's neighbors it will validate and then display the names of the neighbors and ask you to confirm
  if its correct, type y or yes
  if its not, type n or no to reprompt
-Keep going until you're done
-Should close on its own
-You'll find the sql output in the output.txt file
-Copy and paste wherever you need it
-Have fun

Errors? Here's some things you might have done wrong
-Not typed in the name right
-Added spaces to the names of neighbors (for ex. El Paso instead of ElPaso) (the map uses the svg id's so you shouldn't have spaces)
-Added an extra space between the names of the neighbors or at the end of the prompt
