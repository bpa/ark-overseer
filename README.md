# Ark Overseer

React app used to give information on a dedicated server

# Motivation

Where did that tame go? What dinos should I breed? Where can I find an X to tame/fight? Should I incubate this egg? Is there enough food in the troughs for my growing dinos? 

Also, my server runs on linux, so the tools I found through searching don't work there.

# Frameworks

[React](https://reactjs.org/)

[Material UI](https://material-ui.com/)

# Developing

This site was built with react-scripts, see [react readme](REACT.md) for its documentation.

Note: I only have assets for the island right now, so other maps will need to be added before they work correctly.

## Getting test data

Data for this site is created with [ark-file-parser](https://github.com/bpa/ark-file-parser)
 * Clone the [repo](https://github.com/bpa/ark-file-parser)
 * [Install Rust](https://www.rust-lang.org/tools/install)
 * `cargo build --release`
 * `target/release/arkfileparser /path/to/map.ark`
 * Move the created json to this project's public/ directory

## Starting the site
 * `npm install`
 * `npm start`

# Features
 * Interactive map of wild dinos
 * Table of tamed dinos with stats & locations
 * Nursery (Egg & gestational) stats
 * Table of wild dino stats

# Future Plans
 * Configurability for what should be shown
 * Feeding Trough info
 * Limit data to view to tribe
 * Allow steam/epic login
 * Basic stats about gasoline consuming structures
 * Enhance tames & nursery to show parent stats & mutations
 * Notifications for hungry tames
 * Notifications for gestation and incubation
 * Support other maps besides The Island

 # Contributing

 All types of positive contributions are welcome. 
  * Unsolicited PRs? You bet. 
  * Suggestions for improvement? Add a case. 
  * Art? Yes please. 

# License

MIT