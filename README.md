# KiCad Project Explorer

This project consists of two sections:
1. A shell script that queries Github for all repositories mentioning the word "kicad" and
   stores information about them in a JSON file.
2. A single-page Javascript app that displays the collected repos as a BAT (big-ass table)
   that allows searching, filtering, and sorting.

## Usage

You can explore the table of KiCad projects [here](https://devbisme.github.io/kicad_project_explorer/).
If you want to run it locally, do this:
1. Clone this repository to your machine;
2. Go into the `docs` directory.
3. Run an http server: `python -m http.server`;
4. Use your web browser to open `0.0.0.0`.

If you want to update the table with the latest KiCad projects, do this:
1. Run the `get_kicad_gh_repos` shell script;
2. Copy the `kicad_repos.json` file into the `docs` subdirectory.
3. Refresh the page with the project table.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)