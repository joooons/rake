# RAKE

Personal use chrome extension that scrapes text from currently open tab based on predetermined query selectors and saves the textContent into a file named raked.txt.

The only use for RAKE at this time is to capture job description text from Linkedin. It works on the saved jobs view page and the recommended jobs view page.

# How to use

- Navigate to the url you wish to capture textContent from and keep that tab as the currently active tab.
- Click on the Rake chrome extension icon. This will open a popup.
- Enter url regex into the "url regex" input field. For example:
- Enter query selectors for the elements to extract innerText from. For example: .nav.item
- Click on the "SAVE TEXT" button. This should save the captured text into the raked.txt file.

![screenshot] (/images/screenshot.png)

# Notes

- This extension is not published yet.
- To run this extension without publishing, take the following steps:
  - Navigate to chrome://extensions/
  - Turn on Developer mode
  - Click on Load unpacked
  - Select 'rake', the location of this project

## License

MIT License
