## Project-Builder

**Important! Do not save .html file in build folder - this will cause you an error in the browser when it parser the page (simply - didn't apply styles)**

It is a project build template, which uses Gulp as a task-runer.
You will find example files in folders (you can delete and create your own).

#### Usage

##### 1. Open the .json file and install all DEVdependencies.

    npm i -D browser-sync del gulp gulp-autoprefixer gulp-clean-css gulp-concat gulp-file-include gulp-group-css-media-queries gulp-imagemin gulp-remove-empty-lines gulp-rename gulp-sass gulp-uglify-es

##### 2. Install global dependencies

    npm i imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save

##### 3. Alweys check the paths and dependencies you install

For all other solutions or packages, you need to add them on your own. If you would find a bug - let me know
