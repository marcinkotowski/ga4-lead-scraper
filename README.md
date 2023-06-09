﻿# Google Analytics 4 Lead Generation App
 
 ![App demo](https://github.com/marcinkotowski/ga4-lead-scraper/assets/105087767/017eb958-34e9-407f-9ce4-b30d2e3611da)
 
This is a powerful tool built with Electron and Node.js that allows users to easily generate leads through a user-friendly interface. The application uses a Node.js bot to scrape searches from Google Maps and checks if Google Analytics 4 is implemented on the searched companies' websites

### Features :sparkles:
- Add / Delete search input
- Try again scrape
- Clear and delete all search input
- Data is exported in CSV format
- Data saving notifications

### Download :package:
- Download and install latest [Releases](https://github.com/marcinkotowski/ga4-lead-scraper/releases/tag/1.1.0)

## For developers :construction_worker:
### What do you need to run only scraping script

- node.js
- npm

[Download and install both](https://nodejs.org/)

### Clone repository :package:

`git clone https://github.com/marcinkotowski/ga4-lead-scraper.git`

### Run script ⚡️

- Navigate into the directory with app `cd ga4-lead-scraper`
- Install dependencies `npm install `
- Navigate into the directory with script `cd ga4-lead-scraper/bot`
- Run script `node ./index.js "searching business 1" "searching business 2"...`
