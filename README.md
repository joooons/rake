# RAKE

Chrome extension for scraping text from currently open tab according to user-defined query selectors. The extracted text can either be saved in a text file or displayed in a new tab.

# How to use

- Pin the extension to the chrome extension bar so that the icon is visible.
  ![icon](images/extension-icon.png)
- Navigate to the url you wish to capture text content from and keep that tab open as the active tab.
- Click on the icon to open the extension popup window.
  ![extension](images/rake-extension.png)
- If the user had previously extracted text from this url, the url regex and selector input fields should autopopulate. If the input fields are not autopopulated, type in a string that matches the current url. For example, the string "notnewspage" will match the current url of "https://smorg.netlify.app/notnewspage/1iA8kJDyLcjok8rBTkkWPE/date-you-deserve"
  ![url match](images/url-match.png)
- Enter query selectors for the elements to extract innerText from. For example, ".br-title" will match with "<div class="br-title">Popularity of Sea Salt Asparagus</div>".
- Click `OPEN NEW TAB` to display the selected elements in a new tab.
  ![new tab](images/new-tab.png)
- Click `SAVE RAW TEXT` to save the raw text in a text file instead. The file name is `raked.txt`.
  ![text saved](images/text-saved.png)
  ![text file](images/text-file.png)

# Notes

- This extension is not published yet.
- To run this extension without publishing, take the following steps:
  - Navigate to chrome://extensions/
  - Turn on Developer mode
  - Click on Load unpacked
  - Select 'rake', the location of this project

# Features

- tooltips
  ![tooltip](images/tooltip.png)

## License

MIT License
